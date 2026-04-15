import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  CREATE_PROJECT_STEP_META,
  buildCreateProjectEventName,
  buildCreateProjectCtaEventName,
} from "@/config/create-project-step-meta";
import mixpanel from "mixpanel-browser";

declare function gtag(...args: unknown[]): void;

const SITE_VISIT_SESSION_KEY = "analytics_site_visit_sent";
const SESSION_ID_KEY = "analytics_session_id";
const UTM_SESSION_KEY = "analytics_utm_params";
const EXPERIMENT_STORAGE_KEY = "analytics_experiments";
const REFERRAL_CODE_KEY = "analytics_referral_code";

// ─── UTM 파라미터 캡처 ───────────────────────────────────────

/**
 * URL의 UTM 파라미터를 sessionStorage에 저장하고 반환.
 * 이후 같은 세션에선 저장된 값을 재사용 (랜딩 URL 기준으로 고정).
 */
function captureUtmParams(): Record<string, string> {
  try {
    const stored = sessionStorage.getItem(UTM_SESSION_KEY);
    if (stored) return JSON.parse(stored);

    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(key => {
      const val = params.get(key);
      if (val) utm[key] = val;
    });

    if (Object.keys(utm).length > 0) {
      sessionStorage.setItem(UTM_SESSION_KEY, JSON.stringify(utm));
    }
    return utm;
  } catch { return {}; }
}

// ─── 유입 경로(트래픽 소스) 캡처 ─────────────────────────────

const TRAFFIC_SOURCE_KEY = "analytics_traffic_source";

const SEARCH_ENGINES = ["google", "naver", "daum", "bing", "yahoo", "baidu", "yandex", "duckduckgo"];
const SOCIAL_DOMAINS = ["facebook", "instagram", "twitter", "x.com", "linkedin", "tiktok", "youtube", "pinterest", "kakao"];


function deriveChannel(utm: Record<string, string>, referrerDomain: string): string {
  const medium = (utm.utm_medium ?? "").toLowerCase();
  const source = (utm.utm_source ?? "").toLowerCase();

  if (medium.includes("cpc") || medium.includes("ppc") || medium.includes("paid") || source.includes("ads")) return "paid";
  if (medium.includes("email") || source.includes("email") || source.includes("newsletter")) return "email";
  if (medium.includes("social") || SOCIAL_DOMAINS.some(s => source.includes(s) || referrerDomain.includes(s))) return "social";
  if (medium.includes("affiliate")) return "affiliate";
  if (utm.utm_source) return "campaign";
  if (SEARCH_ENGINES.some(s => referrerDomain.includes(s))) return "organic";
  if (referrerDomain && referrerDomain !== window.location.hostname) return "referral";
  return "direct";
}

/**
 * 유입 경로 정보를 sessionStorage에 저장하고 반환.
 * referrer, referrer_domain, channel, landing_path 포함.
 * 세션당 1회 캡처 (랜딩 시점 기준으로 고정).
 */
export function captureTrafficSource(): Record<string, string> {
  try {
    const stored = sessionStorage.getItem(TRAFFIC_SOURCE_KEY);
    if (stored) return JSON.parse(stored);

    const utm = captureUtmParams();
    const rawReferrer = document.referrer ?? "";
    let referrerDomain = "";
    try { referrerDomain = new URL(rawReferrer).hostname; } catch { /* direct */ }

    const channel = deriveChannel(utm, referrerDomain);
    const source: Record<string, string> = {
      referrer: rawReferrer || "direct",
      referrer_domain: referrerDomain || "direct",
      channel,
      landing_path: window.location.pathname,
    };

    sessionStorage.setItem(TRAFFIC_SOURCE_KEY, JSON.stringify(source));
    return source;
  } catch { return {}; }
}

// ─── Referral 코드 캡처 ──────────────────────────────────────

/**
 * URL의 `?ref=` 파라미터를 sessionStorage에 저장.
 * 랜딩 시 1회만 저장하고 세션 내내 유지.
 */
export function captureReferralCode(): string | null {
  try {
    const stored = sessionStorage.getItem(REFERRAL_CODE_KEY);
    if (stored) return stored;

    const code = new URLSearchParams(window.location.search).get("ref");
    if (code) sessionStorage.setItem(REFERRAL_CODE_KEY, code);
    return code;
  } catch { return null; }
}

/** 현재 세션에 캡처된 referral 코드 반환 */
export function getReferralCode(): string | null {
  try { return sessionStorage.getItem(REFERRAL_CODE_KEY); } catch { return null; }
}

/**
 * 내 추천 링크 생성 (userId 기반).
 * 예: https://admarket.co.kr/?ref=user-이꽃별
 */
export function generateReferralLink(userId?: string): string {
  const id = userId ?? localStorage.getItem("analytics_user_id") ?? "unknown";
  return `${window.location.origin}/?ref=${encodeURIComponent(id)}`;
}

/**
 * 추천 링크 복사/공유 시 발송.
 * 마이페이지 → 내 추천 링크 복사 버튼에서 호출.
 */
export function trackReferralSent(props: { method: "copy" | "share"; referrer_id?: string }) {
  publishAnalytics("referral_sent", { ...props, user_type: "advertiser" });
}

/**
 * 추천 링크를 통해 가입 완료 시 발송.
 * signup-email.tsx의 가입 완료 직전에서 호출. ref 코드가 있을 때만 발송.
 */
export function trackReferralSignedUp(props: { referrer_code: string }) {
  publishAnalytics("referral_signed_up", { ...props, user_type: "advertiser" });
}

/** 브라우저 세션 단위 ID (DB 적재 시 세션 묶음용) */
export function getAnalyticsSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

// ─── 로컬 이벤트 로그 (localStorage 영구 보존) ──────────────────

const LOCAL_EVENT_LOG_KEY = "analytics_event_log";
const LOCAL_EVENT_LOG_MAX = 500;

export interface LocalEventRow {
  id: number;
  eventName: string;
  properties: Record<string, unknown>;
  sessionId?: string;
  userId?: string;
  createdAt: string;
}

function saveEventToLocalStorage(
  eventName: string,
  properties: Record<string, unknown>,
  sessionId: string,
  userId?: string,
) {
  try {
    const raw = localStorage.getItem(LOCAL_EVENT_LOG_KEY);
    const existing: LocalEventRow[] = raw ? JSON.parse(raw) : [];
    const nextId = existing.length > 0 ? existing[existing.length - 1].id + 1 : 1;
    existing.push({
      id: nextId,
      eventName,
      properties,
      sessionId,
      userId,
      createdAt: new Date().toISOString(),
    });
    // 최대 500개 유지
    const trimmed = existing.length > LOCAL_EVENT_LOG_MAX
      ? existing.slice(existing.length - LOCAL_EVENT_LOG_MAX)
      : existing;
    localStorage.setItem(LOCAL_EVENT_LOG_KEY, JSON.stringify(trimmed));
  } catch {/* ignore */}
}

export function getLocalEventLog(): LocalEventRow[] {
  try {
    const raw = localStorage.getItem(LOCAL_EVENT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function clearLocalEventLog() {
  try { localStorage.removeItem(LOCAL_EVENT_LOG_KEY); } catch {/* ignore */}
}

/**
 * Mixpanel 전송 + GA4 전송 + 서버 `analytics_events` 적재 (POST /api/analytics/events).
 * UTM 파라미터·유입경로·user_id·experiment variant를 모든 이벤트에 자동 첨부.
 */
export function publishAnalytics(
  eventName: string,
  properties?: Record<string, unknown>,
) {
  const utmProps = captureUtmParams();
  const trafficSource = captureTrafficSource();
  const userId = (() => { try { return localStorage.getItem("analytics_user_id") ?? undefined; } catch { return undefined; } })();
  const experiments = (() => { try { return JSON.parse(localStorage.getItem(EXPERIMENT_STORAGE_KEY) ?? "{}") as Record<string, string>; } catch { return {}; } })();
  const experimentProps = Object.keys(experiments).length > 0
    ? { active_experiments: Object.keys(experiments).join(","), ...Object.fromEntries(Object.entries(experiments).map(([k, v]) => [`exp_${k}`, v])) }
    : {};

  const props: Record<string, unknown> = { ...properties, ...utmProps, ...trafficSource, ...experimentProps };
  const sessionId = getAnalyticsSessionId();

  // localStorage 영구 적재
  saveEventToLocalStorage(eventName, props, sessionId, userId);

  // Mixpanel (제한 없음)
  mixpanel.track(eventName, props);

  // GA4 + GTM — gtag() 단일 경로로 전송 (gtag는 내부적으로 dataLayer 래퍼)
  // dataLayer.push 별도 호출 시 GTM에서 이벤트가 두 번 찍히므로 제거
  if (typeof gtag !== "undefined") {
    const ga4Props: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) {
      if (typeof v === "string" && v.length > 100) {
        ga4Props[k] = v.slice(0, 100);
      } else {
        ga4Props[k] = v;
      }
    }
    gtag("event", eventName, ga4Props);
  }

  // 서버 적재 (user_id 포함)
  void fetch("/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      properties: props,
      sessionId,
      userId,
    }),
    keepalive: true,
  }).catch(() => {});
}

// ─── 사용자 식별 (로그인/가입 시점 1회) ───────────────────────

/**
 * 이메일·이름 등 식별 가능한 값을 익명 ID로 변환.
 * 동일 입력 → 동일 출력(결정론적), 역변환 불가.
 */
function anonymizeId(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h, 33) ^ input.charCodeAt(i);
  }
  return "usr_" + (h >>> 0).toString(16).padStart(8, "0");
}

/** 이메일에서 도메인 부분만 추출 (예: naver.com) */
function emailDomain(email: string): string {
  const parts = email.split("@");
  return parts.length === 2 ? parts[1] : "";
}

/**
 * 로그인 또는 회원가입 완료 시 호출.
 * Mixpanel.identify() + people.set() + GA4 user_properties 설정.
 * 이후 모든 이벤트에 user_id가 자동으로 붙음.
 *
 * 개인정보 처리 원칙:
 *  - distinct_id: 이메일/이름을 해시한 익명 ID (역추적 불가)
 *  - $email: 도메인만 저장 (예: naver.com)
 *  - $name: 전송하지 않음
 */
export function identifyUser(props: {
  userId: string;
  userName?: string;
  userType?: "advertiser" | "partner" | "admin";
  email?: string;
}) {
  const { userId, userType, email } = props;

  // 식별 가능 정보를 익명 ID로 변환
  const anonId = anonymizeId(userId);

  // Mixpanel: 디바이스 익명 ID → 해시된 사용자 ID로 연결
  mixpanel.identify(anonId);
  mixpanel.people.set({
    email_domain: email ? emailDomain(email) : "",
    user_type: userType ?? "unknown",
    last_login: new Date().toISOString(),
  });

  // GA4: User-ID 기능 활성화 (해시된 ID 사용)
  if (typeof gtag !== "undefined") {
    gtag("config", "G-MG1WSR89E1", {
      user_id: anonId,
    });
    gtag("set", "user_properties", {
      user_type: userType ?? "unknown",
    });
  }

  // localStorage에 저장 → 새로고침 후 재식별에 활용 (이미 익명화된 ID)
  try {
    localStorage.setItem("analytics_user_id", anonId);
    localStorage.setItem("analytics_user_type", userType ?? "unknown");
  } catch {/* ignore */}
}

/**
 * 앱 초기 로드 시 이미 로그인된 경우 재식별.
 * localStorage에 저장된 user_id가 있으면 Mixpanel.identify() 재호출.
 */
export function reIdentifyIfLoggedIn() {
  try {
    const userId = localStorage.getItem("analytics_user_id");
    const userType = localStorage.getItem("analytics_user_type");
    if (userId) {
      mixpanel.identify(userId);
      if (typeof gtag !== "undefined") {
        gtag("config", "G-MG1WSR89E1", { user_id: userId });
        gtag("set", "user_properties", { user_type: userType ?? "unknown" });
      }
    }
  } catch {/* ignore */}
}

/**
 * 로그인 완료 이벤트 — GA4 표준 `login` 이벤트 + Mixpanel 커스텀 이벤트.
 * identifyUser() 호출 직후 함께 사용할 것.
 */
export function trackLogin(props: {
  method?: "email" | "naver" | "google" | "admin";
  user_type?: "advertiser" | "partner" | "admin";
}) {
  // GA4: 표준 login 이벤트 (BigQuery / 전환 분석에 활용 가능)
  if (typeof gtag !== "undefined") {
    gtag("event", "login", { method: props.method ?? "email" });
  }
  // Mixpanel: 커스텀 파라미터 포함
  publishAnalytics("user_login", {
    method: props.method ?? "email",
    user_type: props.user_type ?? "advertiser",
  });
}

// ─── 유입 & 세션 ───────────────────────────────────────────────

/** 세션당 1회 — 퍼널 1단계(유입). referrer·channel·UTM 포함 */
export function trackSiteVisitOnce(path: string) {
  try {
    if (sessionStorage.getItem(SITE_VISIT_SESSION_KEY)) return;
    sessionStorage.setItem(SITE_VISIT_SESSION_KEY, "1");
    const traffic = captureTrafficSource();
    publishAnalytics("site_visit", { path, ...traffic });
  } catch {
    const traffic = captureTrafficSource();
    publishAnalytics("site_visit", { path, ...traffic });
  }
}

// ─── 회원가입 ─────────────────────────────────────────────────

/** 회원가입 플로우 — 화면별 (같은 이벤트명 + step으로 퍼널에서 단계 구분) */
export function trackSignupFunnelStep(
  step: 1 | 2 | 3,
  stepName: "account" | "phone" | "email",
  path: string,
) {
  publishAnalytics("signup_funnel", { step, step_name: stepName, path });
}

/** 이메일 인증까지 완료 시 */
export function trackSignupComplete(userType?: "advertiser" | "partner") {
  publishAnalytics("signup_complete", {
    user_type: userType ?? "unknown",
  });
}

// ─── 프로젝트 등록 마법사 ─────────────────────────────────────

/** 프로젝트 등록 마법사 화면 진입 (URL 기준) */
export function trackProjectRegisterStep(path: string) {
  const meta = CREATE_PROJECT_STEP_META[path];
  if (!meta) return;
  publishAnalytics(buildCreateProjectEventName(meta), {
    path,
    screen: meta.screen,
    wizard_step: meta.wizard_step,
    source_file: meta.source_file,
    title_ko: meta.title_ko,
    action: "enter",
  });
}

/** 마법사 각 화면의 버튼(다음/이전/제출 등) */
export function trackCreateProjectCta(
  pathname: string,
  action: "next" | "back" | "submit" | "confirm" | "complete",
) {
  const meta = CREATE_PROJECT_STEP_META[pathname];
  if (!meta) return;
  publishAnalytics(buildCreateProjectCtaEventName(meta), {
    path: pathname,
    wizard_step: meta.wizard_step,
    source_file: meta.source_file,
    screen: meta.screen,
    title_ko: meta.title_ko,
    action,
  });
}

// ─── Activation 헬퍼 ─────────────────────────────────────────

const ACT_KEY_PROJECT = "analytics_act_project_submitted";
const ACT_KEY_APPLIED = "analytics_act_partner_applied";

/**
 * localStorage 기반 "처음" 감지.
 * key가 없으면 true(처음) + 저장, 이미 있으면 false.
 */
function checkFirstTime(key: string): boolean {
  try {
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, "1");
    return true;
  } catch { return false; }
}

/**
 * Activation 달성 이벤트.
 * 의뢰사: 첫 project_submitted 시 / 파트너사: 첫 partner_applied 시 자동 발사.
 */
export function trackActivationAchieved(props: {
  trigger_event: "project_submitted" | "partner_applied";
  user_type: "advertiser" | "partner";
}) {
  publishAnalytics("activation_achieved", props);
}

// ─── 핵심 비즈니스 이벤트 ─────────────────────────────────────

/** 프로젝트 최종 제출 완료 (GA4 전환 이벤트) */
export function trackProjectSubmitted(props: {
  project_type: "공고" | "1:1" | "컨설팅";
  partner_type?: "제작" | "대행" | "unknown";
  budget_range?: string;
}) {
  const is_first_time = checkFirstTime(ACT_KEY_PROJECT);
  publishAnalytics("project_submitted", { ...props, is_first_time });
  if (is_first_time) {
    trackActivationAchieved({ trigger_event: "project_submitted", user_type: "advertiser" });
  }
}

/** 파트너사 공고 지원 완료 (GA4 전환 이벤트) */
export function trackPartnerApplied(props: {
  project_id: string;
  project_type: "공고" | "1:1";
  partner_type?: "제작사" | "대행사";
}) {
  const is_first_time = checkFirstTime(ACT_KEY_APPLIED);
  publishAnalytics("partner_applied", { ...props, is_first_time });
  if (is_first_time) {
    trackActivationAchieved({ trigger_event: "partner_applied", user_type: "partner" });
  }
}

/** 컨설팅 문의 최종 접수 완료 (GA4 전환 이벤트) */
export function trackConsultingInquirySubmitted(props: {
  title?: string;
  has_attachment?: boolean;
}) {
  publishAnalytics("consulting_inquiry_submitted", {
    ...props,
    user_type: "advertiser",
  });
}

// ─── 발견 & 탐색 이벤트 ──────────────────────────────────────

/** 공고 프로젝트 상세 조회 (파트너사 발견 퍼널) */
export function trackProjectViewed(props: {
  project_id: string;
  project_type: "공고" | "1:1";
  user_type?: "advertiser" | "partner" | "guest";
}) {
  publishAnalytics("project_viewed", props);
}

/** 파트너·대행사 검색 실행 */
export function trackPartnerSearched(props: {
  query: string;
  category: "agency" | "production";
  result_count?: number;
}) {
  publishAnalytics("partner_searched", {
    ...props,
    user_type: "advertiser",
  });
}

/** 대행사/제작사 즐겨찾기 토글 */
export function trackAgencyFavorited(props: {
  company_id: string | number;
  company_type: "agency" | "production";
  action: "add" | "remove";
}) {
  publishAnalytics("agency_favorited", {
    ...props,
    user_type: "advertiser",
  });
}

// ─── 참여현황 관리 이벤트 ─────────────────────────────────────

/** 초대 토글 (참여신청 탭) */
export function trackParticipationInviteToggled(props: {
  company_id: number;
  company_name: string;
  invited: boolean;
}) {
  publishAnalytics("participation_invite_toggled", {
    ...props,
    user_type: "advertiser",
  });
}

/** OT 참석 확정 토글 */
export function trackParticipationOtConfirmed(props: {
  company_id: number;
  company_name: string;
  confirmed: boolean;
}) {
  publishAnalytics("participation_ot_confirmed", {
    ...props,
    user_type: "advertiser",
  });
}

/** OT 참석 완료 토글 */
export function trackParticipationOtCompleted(props: {
  company_id: number;
  company_name: string;
  completed: boolean;
}) {
  publishAnalytics("participation_ot_completed", {
    ...props,
    user_type: "advertiser",
  });
}

/** PT 참석 확정 토글 */
export function trackParticipationPtConfirmed(props: {
  company_id: number;
  company_name: string;
  pt_round: "pt1" | "pt2";
  confirmed: boolean;
}) {
  publishAnalytics("participation_pt_confirmed", {
    ...props,
    user_type: "advertiser",
  });
}

/** PT 완료 토글 */
export function trackParticipationPtCompleted(props: {
  company_id: number;
  company_name: string;
  pt_round: "pt1" | "pt2";
  completed: boolean;
}) {
  publishAnalytics("participation_pt_completed", {
    ...props,
    user_type: "advertiser",
  });
}

/** 최종 선정 토글 */
export function trackParticipationFinalSelected(props: {
  company_id: number;
  company_name: string;
  selected: boolean;
}) {
  publishAnalytics("participation_final_selected", {
    ...props,
    user_type: "advertiser",
  });
}

// ─── 계약 이벤트 ─────────────────────────────────────────────

/** 계약 임시저장 */
export function trackContractSaved(props: { partner_name?: string }) {
  publishAnalytics("contract_saved", { ...props, user_type: "advertiser" });
}

/** 파트너사에 계약 협의 요청 발송 */
export function trackContractRequestSent(props: { partner_name?: string; request_type: "internal" | "partner" }) {
  publishAnalytics("contract_request_sent", { ...props, user_type: "advertiser" });
}

/**
 * 최종선정 확정 CTA 클릭 — 스위치로 선택된 파트너를 확정하는 순간.
 * participation.tsx 의 "최종선정 확정" 버튼에서 호출.
 */
export function trackPartnerSelected(props: {
  selected_count: number;
  company_ids?: string[];
}) {
  publishAnalytics("partner_selected", { ...props, user_type: "advertiser" });
}

/** 계약 등록 완료 = partner_selected + contract_signed (GA4 전환 이벤트) */
export function trackContractSigned(props: {
  partner_name?: string;
  budget_range?: string;
  /** 실제 계약 금액 (원 단위). GA4 value 파라미터로도 전달해 매출 집계 가능. */
  contract_value_krw?: number;
}) {
  const { contract_value_krw, ...rest } = props;
  publishAnalytics("contract_signed", {
    ...rest,
    user_type: "advertiser",
    ...(contract_value_krw != null && {
      contract_value_krw,
      value: contract_value_krw,      // GA4 표준 value 파라미터 (매출 집계용)
      currency: "KRW",
    }),
  });
}

/** 계약 취소 */
export function trackContractCancelled(props: { partner_name?: string }) {
  publishAnalytics("contract_cancelled", { ...props, user_type: "advertiser" });
}

// ─── 제작 리뷰 이벤트 ────────────────────────────────────────

/** 리뷰 임시저장 */
export function trackReviewSaved(props: {
  project_id?: string;
  partner_name?: string;
}) {
  publishAnalytics("review_saved", { ...props, user_type: "advertiser" });
}

/** 리뷰 등록 완료 → 프로젝트 완료 처리 (GA4 전환 이벤트) */
export function trackReviewSubmitted(props: {
  project_id?: string;
  partner_name?: string;
  has_client_rating: boolean;
  has_partner_rating: boolean;
  has_text: boolean;
}) {
  publishAnalytics("review_submitted", { ...props, user_type: "advertiser" });
}

/** 리뷰 수정 (등록 후 7일 이내) */
export function trackReviewEdited(props: {
  project_id?: string;
  partner_name?: string;
}) {
  publishAnalytics("review_edited", { ...props, user_type: "advertiser" });
}

/** 리뷰 최종 완료 확인 */
export function trackReviewCompleted(props: {
  project_id?: string;
  partner_name?: string;
}) {
  publishAnalytics("review_completed", { ...props, user_type: "advertiser" });
}

// ─── 제안서 이벤트 ───────────────────────────────────────────

/** 파트너사 제안서 제출 */
export function trackProposalSubmitted(props: {
  project_title?: string;
  has_strategic_file?: boolean;
  has_creative_file?: boolean;
  concept_count?: number;
  submission_file_count?: number;
}) {
  publishAnalytics("proposal_submitted", { ...props, user_type: "partner" });
}

// ─── 컨설팅 이벤트 ───────────────────────────────────────────

/** 컨설턴트 메시지 발송 (상담 활동 기록) */
export function trackConsultingMessageSent(props: {
  consulting_id: string;
  channel?: string;
}) {
  publishAnalytics("consulting_message_sent", { ...props, user_type: "admin" });
}

/** 컨설팅 케이스 완료·종결 처리 */
export function trackConsultingResponded(props: {
  consulting_id: string;
  outcome_kind?: string;
  service_tier?: string;
}) {
  publishAnalytics("consulting_responded", { ...props, user_type: "admin" });
}

/** 컨설턴트가 새 프로젝트를 생성하고 컨설팅 케이스에 연결 */
export function trackConsultingProjectLinked(props: {
  consulting_id: string;
  project_id: string;
  outcome_kind?: string;
}) {
  publishAnalytics("consulting_project_linked", { ...props, user_type: "admin" });
}

// ─── 기업 회원 가입 & 인증 이벤트 ────────────────────────────

/**
 * 가입 유형 선택 완료 (광고주 / 파트너사 선택 시).
 * 회원가입 초기 화면에서 유형을 결정하는 순간 호출.
 */
export function trackSignupTypeSelected(props: {
  user_type: "advertiser" | "partner";
  partner_type?: "agency" | "production";
}) {
  publishAnalytics("signup_type_selected", props);
}

/**
 * 기업 정보 등록 완료 — 사업자등록번호·회사명 등 기업 정보를 제출한 순간.
 * 기업 등록 폼의 "제출" 버튼 클릭 시 호출.
 */
export function trackCompanyRegistered(props: {
  company_type: "advertiser" | "agency" | "production";
  has_business_number?: boolean;
}) {
  publishAnalytics("company_registered", {
    ...props,
    user_type: props.company_type === "advertiser" ? "advertiser" : "partner",
  });
}

/**
 * 기업 인증 신청 제출 — 사업자 인증·진정성 인증·수행 인증 신청 시.
 * 인증 신청 완료 버튼 클릭 후 호출.
 */
export function trackCompanyVerificationRequested(props: {
  company_name: string;
  verification_type: "BUSINESS" | "PROJECT_AUTHENTICITY" | "PROJECT_COMPLETION";
}) {
  publishAnalytics("company_verification_requested", {
    ...props,
    user_type: "partner",
  });
}

/**
 * 기업 인증 승인 (관리자 액션).
 * 관리자 → 기업 인증 관리 → 승인 버튼 클릭 후 호출.
 */
export function trackCompanyVerificationApproved(props: {
  company_name: string;
  verification_type: string;
  company_id?: string;
}) {
  publishAnalytics("company_verification_approved", {
    ...props,
    user_type: "admin",
  });
}

/**
 * 기업 인증 반려 (관리자 액션).
 * 관리자 → 기업 인증 관리 → 반려 버튼 클릭 후 호출.
 */
export function trackCompanyVerificationRejected(props: {
  company_name: string;
  verification_type: string;
  reject_reason?: string;
}) {
  publishAnalytics("company_verification_rejected", {
    ...props,
    user_type: "admin",
  });
}

/**
 * 시안(제안서) 제출 — proposal-register.tsx 제출하기 버튼 클릭 시 (파트너).
 */
export function trackDraftSubmitted(props: { project_title?: string; concept_count?: number }) {
  publishAnalytics("draft_submitted", { ...props, user_type: "partner" });
}

/**
 * 시안(제안서) 확정 — 의뢰사가 제안서를 확정/확인할 때.
 */
export function trackDraftConfirmed(props: { project_title?: string }) {
  publishAnalytics("draft_confirmed", { ...props, user_type: "advertiser" });
}

/**
 * 산출물 선택 요청 — 파트너가 의뢰사에 산출물 선택 요청 시.
 */
export function trackDeliverableSubmitted(props: { project_title?: string; phase?: number }) {
  publishAnalytics("deliverable_submitted", { ...props, user_type: "partner" });
}

/**
 * 산출물 최종 확정 — 의뢰사가 최종 산출물을 확정할 때.
 */
export function trackDeliverableConfirmed(props: { project_title?: string; phase?: number }) {
  publishAnalytics("deliverable_confirmed", { ...props, user_type: "advertiser" });
}

/**
 * 프로젝트 완료 — 제작 리뷰 양쪽 완료 처리 시.
 * review.tsx handleComplete() 에서 호출.
 */
export function trackProjectCompleted(props: { partner_name?: string; project_title?: string }) {
  publishAnalytics("project_completed", { ...props, user_type: "advertiser" });
}

/**
 * 포트폴리오(회사소개서) 등록 완료 — /portfolio/preview 등록하기 → 확인 버튼 클릭 시.
 * 등록 완료 팝업의 확인 버튼 클릭 직전 호출.
 */
export function trackPortfolioRegistered(props: {
  portfolio_title?: string;
  is_first_time?: boolean;
}) {
  publishAnalytics("portfolio_registered", {
    ...props,
    user_type: "partner",
  });
}

/**
 * 기업 회원 활성화 완료 — 인증 승인 이후 기업 회원 등급 부여 시.
 * trackCompanyVerificationApproved() 직후 자동 호출.
 */
export function trackCorporateMemberActivated(props: {
  company_name: string;
  company_type: "advertiser" | "agency" | "production";
  verification_type: string;
}) {
  publishAnalytics("corporate_member_activated", {
    ...props,
    user_type: "admin",
  });
}

// ─── 관리자 회원 제재 이벤트 ─────────────────────────────────

/** 회원 경고 */
export function trackAdminMemberWarned(props: { member_id: string; member_type?: string }) {
  publishAnalytics("admin_member_warned", { ...props, user_type: "admin" });
}

/** 회원 정지 */
export function trackAdminMemberSuspended(props: { member_id: string; member_type?: string }) {
  publishAnalytics("admin_member_suspended", { ...props, user_type: "admin" });
}

/** 회원 정지 해제 */
export function trackAdminMemberResumed(props: { member_id: string; member_type?: string }) {
  publishAnalytics("admin_member_resumed", { ...props, user_type: "admin" });
}

/** 회원 강제 탈퇴 */
export function trackAdminMemberBanned(props: { member_id: string; member_type?: string }) {
  publishAnalytics("admin_member_banned", { ...props, user_type: "admin" });
}

// ─── A/B 테스트 프레임워크 ────────────────────────────────────

/**
 * 실험 variant 배정 (deterministic: userId 기반 일관된 배정).
 * 한 번 배정된 variant는 localStorage에 고정 저장.
 *
 * @example
 * const variant = assignExperiment("signup_cta_test", ["control", "variant_a", "variant_b"]);
 */
export function assignExperiment(experimentId: string, variants: string[]): string {
  try {
    const stored = JSON.parse(localStorage.getItem(EXPERIMENT_STORAGE_KEY) ?? "{}") as Record<string, string>;
    if (stored[experimentId]) return stored[experimentId];

    const userId = localStorage.getItem("analytics_user_id") ?? crypto.randomUUID();
    const seed = [...`${userId}::${experimentId}`].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
    const variant = variants[seed % variants.length];

    stored[experimentId] = variant;
    localStorage.setItem(EXPERIMENT_STORAGE_KEY, JSON.stringify(stored));
    return variant;
  } catch { return variants[0]; }
}

/**
 * 현재 배정된 variant 조회 (미배정 시 null).
 */
export function getExperimentVariant(experimentId: string): string | null {
  try {
    const stored = JSON.parse(localStorage.getItem(EXPERIMENT_STORAGE_KEY) ?? "{}") as Record<string, string>;
    return stored[experimentId] ?? null;
  } catch { return null; }
}

/**
 * 실험 노출 이벤트 — variant가 사용자에게 실제로 노출된 순간 호출.
 * Mixpanel A/B Report & GA4 Funnel에서 experiment_id + variant로 분기 분석 가능.
 */
export function trackExperimentViewed(experimentId: string, variant: string) {
  publishAnalytics("experiment_viewed", { experiment_id: experimentId, variant });
}

// ─── 내정보(마이페이지) 이벤트 ───────────────────────────────

/** 내정보 섹션 페이지 진입 */
export function trackMyPageView(page: "profile" | "withdraw" | "inquiry" | "notification_settings") {
  publishAnalytics("mypage_viewed", { page });
}

/** 내정보 저장 완료 */
export function trackMyProfileSaved() {
  publishAnalytics("mypage_profile_saved", { user_type: "advertiser" });
}

/** 회원탈퇴 시도 */
export function trackMyWithdrawAttempted(props: { reason_count: number; has_other_text: boolean }) {
  publishAnalytics("mypage_withdraw_attempted", { ...props, user_type: "advertiser" });
}

/** 1:1 문의 제출 */
export function trackMyInquirySubmitted(props: { tab: "general" | "report"; has_attachment: boolean }) {
  publishAnalytics("mypage_inquiry_submitted", { ...props, user_type: "advertiser" });
}

/** 알림설정 저장 */
export function trackMyNotificationSettingsSaved(props: {
  app_on_count: number;
  email_on_count: number;
  sms_on_count: number;
}) {
  publishAnalytics("mypage_notification_settings_saved", { ...props, user_type: "advertiser" });
}

// ─── 라우트 리스너 ────────────────────────────────────────────

/** GA4에 page_view 이벤트 전송 (SPA 경로 변경 시) */
function trackGA4PageView(path: string) {
  if (typeof gtag === "undefined") return;
  gtag("event", "page_view", {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  });
}

// ── 기업 구성원 관리 ──────────────────────────────────────────────────
/** 대기 중인 구성원 소속 승인 */
export function trackMemberApproved(props: { member_id: string; member_name?: string; company_id?: string }) {
  publishAnalytics("member_approved", { ...props });
}

/** 활동승인 토글 (활성 ↔ 비활성) */
export function trackMemberActivityToggled(props: { member_id: string; is_active: boolean; member_name?: string }) {
  publishAnalytics("member_activity_toggled", { ...props });
}

/** 구성원 탈퇴/삭제 */
export function trackMemberRemoved(props: { member_id: string; member_name?: string; section: "approved" | "active" | "pending" }) {
  publishAnalytics("member_removed", { ...props });
}

/** 권한 변경 */
export function trackMemberRoleChanged(props: { member_id: string; member_name?: string; prev_role: string; new_role: string }) {
  publishAnalytics("member_role_changed", { ...props });
}

export function trackFunnelRoute(path: string) {
  trackSiteVisitOnce(path);

  if (path === "/signup") {
    trackSignupFunnelStep(1, "account", path);
    return;
  }
  if (path === "/signup/email") {
    trackSignupFunnelStep(2, "email", path);
    return;
  }
  if (path === "/signup/phone") {
    trackSignupFunnelStep(3, "phone", path);
    return;
  }
  if (path === "/signup/account-type") {
    publishAnalytics("signup_funnel", { step: 4, step_name: "account_type", path });
    return;
  }
  if (path === "/signup/job-info") {
    publishAnalytics("signup_funnel", { step: 5, step_name: "job_info", path });
    return;
  }

  trackProjectRegisterStep(path);
}

/** 스크롤 깊이(%) 계산 */
function getScrollPct(): number {
  const el = document.documentElement;
  const scrollable = el.scrollHeight - el.clientHeight;
  if (scrollable <= 0) return 100;
  return Math.min(100, Math.round((window.scrollY / scrollable) * 100));
}

/** App 루트에 두면 경로 변경 시 퍼널 이벤트 + 체류시간 + 스크롤깊이 + 이탈 이벤트가 자동으로 쌓입니다. */
export function FunnelRouteListener() {
  const [path] = useLocation();
  const pageEnterTime = useRef<number>(Date.now());
  const prevPath = useRef<string>(path);
  const maxScrollPct = useRef<number>(0);
  const firedMilestones = useRef<Set<number>>(new Set());

  // 스크롤 이벤트 — 최대 깊이 갱신 + 25/50/75/100% 마일스톤 이벤트
  useEffect(() => {
    const MILESTONES = [25, 50, 75, 100];

    const handleScroll = () => {
      const pct = getScrollPct();
      if (pct > maxScrollPct.current) maxScrollPct.current = pct;

      for (const m of MILESTONES) {
        if (pct >= m && !firedMilestones.current.has(m)) {
          firedMilestones.current.add(m);
          publishAnalytics("scroll_depth", { path: prevPath.current, depth_pct: m });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 앱 마운트 시 이미 로그인된 사용자 재식별 + UTM 캡처 + 브라우저 이탈 감지
  useEffect(() => {
    reIdentifyIfLoggedIn();
    captureUtmParams();
    captureReferralCode();

    const handleUnload = () => {
      const duration = Math.round((Date.now() - pageEnterTime.current) / 1000);
      publishAnalytics("page_exit", {
        path: prevPath.current,
        time_on_page_sec: duration,
        max_scroll_pct: maxScrollPct.current,
      });
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  useEffect(() => {
    // 경로가 바뀔 때 이전 페이지의 체류시간 + 스크롤 깊이 전송
    if (prevPath.current !== path) {
      const duration = Math.round((Date.now() - pageEnterTime.current) / 1000);
      if (duration > 0) {
        publishAnalytics("time_on_page", {
          path: prevPath.current,
          duration_sec: duration,
          max_scroll_pct: maxScrollPct.current,
        });
      }
      prevPath.current = path;
      pageEnterTime.current = Date.now();
      maxScrollPct.current = 0;
      firedMilestones.current = new Set();
      window.scrollTo(0, 0);
    }

    trackFunnelRoute(path);
    trackGA4PageView(path);
  }, [path]);
  return null;
}
