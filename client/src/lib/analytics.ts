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
  useEffect(() => {
    trackFunnelRoute(path);
    trackGA4PageView(path);
  }, [path]);
  return null;
}
