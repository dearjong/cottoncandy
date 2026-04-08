import { useEffect } from "react";
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

/**
 * Mixpanel 전송 + GA4 전송 + 서버 `analytics_events` 적재 (POST /api/analytics/events).
 * GA4·Mixpanel 동일 이벤트명 사용.
 */
export function publishAnalytics(
  eventName: string,
  properties?: Record<string, unknown>,
) {
  const props = properties ?? {};

  // Mixpanel
  mixpanel.track(eventName, props);

  // GA4
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, props);
  }

  // 서버 적재
  void fetch("/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      properties: props,
      sessionId: getAnalyticsSessionId(),
    }),
    keepalive: true,
  }).catch(() => {});
}

// ─── 사용자 식별 (로그인/가입 시점 1회) ───────────────────────

/**
 * 로그인 또는 회원가입 완료 시 호출.
 * Mixpanel.identify() + people.set() + GA4 user_properties 설정.
 * 이후 모든 이벤트에 user_id가 자동으로 붙음.
 */
export function identifyUser(props: {
  userId: string;
  userName?: string;
  userType?: "advertiser" | "partner" | "admin";
  email?: string;
}) {
  const { userId, userName, userType, email } = props;

  // Mixpanel: 디바이스 익명 ID → 실 사용자 ID로 연결
  mixpanel.identify(userId);
  mixpanel.people.set({
    $name: userName ?? userId,
    $email: email ?? "",
    user_type: userType ?? "unknown",
    last_login: new Date().toISOString(),
  });

  // GA4: user_id 설정 (세션 전체에 자동 첨부)
  if (typeof gtag !== "undefined") {
    gtag("set", "user_properties", {
      user_id: userId,
      user_type: userType ?? "unknown",
    });
  }

  // localStorage에 저장 → 새로고침 후 재식별에 활용
  try {
    localStorage.setItem("analytics_user_id", userId);
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
        gtag("set", "user_properties", {
          user_id: userId,
          user_type: userType ?? "unknown",
        });
      }
    }
  } catch {/* ignore */}
}

// ─── 유입 & 세션 ───────────────────────────────────────────────

/** 세션당 1회 — 퍼널 1단계(유입) */
export function trackSiteVisitOnce(path: string) {
  try {
    if (sessionStorage.getItem(SITE_VISIT_SESSION_KEY)) return;
    sessionStorage.setItem(SITE_VISIT_SESSION_KEY, "1");
    publishAnalytics("site_visit", { path });
  } catch {
    publishAnalytics("site_visit", { path });
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

// ─── 핵심 비즈니스 이벤트 ─────────────────────────────────────

/** 프로젝트 최종 제출 완료 (GA4 전환 이벤트) */
export function trackProjectSubmitted(props: {
  project_type: "공고" | "1:1" | "컨설팅";
  partner_type?: "제작" | "대행" | "unknown";
  budget_range?: string;
}) {
  publishAnalytics("project_submitted", props);
}

/** 파트너사 공고 지원 완료 (GA4 전환 이벤트) */
export function trackPartnerApplied(props: {
  project_id: string;
  project_type: "공고" | "1:1";
  partner_type?: "제작사" | "대행사";
}) {
  publishAnalytics("partner_applied", props);
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

/** 라우트 변경 시 퍼널 관련 경로만 전송 */
export function trackFunnelRoute(path: string) {
  trackSiteVisitOnce(path);

  if (path === "/signup") {
    trackSignupFunnelStep(1, "account", path);
    return;
  }
  if (path === "/signup/phone") {
    trackSignupFunnelStep(2, "phone", path);
    return;
  }
  if (path === "/signup/email") {
    trackSignupFunnelStep(3, "email", path);
    return;
  }

  trackProjectRegisterStep(path);
}

/** App 루트에 두면 경로 변경 시 퍼널 이벤트가 자동으로 쌓입니다. */
export function FunnelRouteListener() {
  const [path] = useLocation();

  // 앱 마운트 시 이미 로그인된 사용자 재식별 (새로고침 대응)
  useEffect(() => {
    reIdentifyIfLoggedIn();
  }, []);

  useEffect(() => {
    trackFunnelRoute(path);
    trackGA4PageView(path);
  }, [path]);
  return null;
}
