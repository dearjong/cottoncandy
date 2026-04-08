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
 * Mixpanel 전송 + 서버 `analytics_events` 적재 (POST /api/analytics/events).
 * 운영에서 Postgres를 쓰면 동일 스키마로 Drizzle 연동하면 됩니다.
 */
export function publishAnalytics(
  eventName: string,
  properties?: Record<string, unknown>,
) {
  const props = properties ?? {};
  mixpanel.track(eventName, props);
  const body = JSON.stringify({
    eventName,
    properties: props,
    sessionId: getAnalyticsSessionId(),
  });
  void fetch("/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

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

/** 회원가입 플로우 — 화면별 (같은 이벤트명 + step으로 퍼널에서 단계 구분) */
export function trackSignupFunnelStep(
  step: 1 | 2 | 3,
  stepName: "account" | "phone" | "email",
  path: string,
) {
  publishAnalytics("signup_funnel", { step, step_name: stepName, path });
}

/** 이메일 인증까지 완료 시 */
export function trackSignupComplete() {
  publishAnalytics("signup_complete", {});
}

/** 프로젝트 등록 마법사 화면 진입 (URL 기준) — 이벤트명 = step_{단계}_{파일베이스}, action=enter */
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

/**
 * 마법사 각 화면의 버튼(다음/이전/제출 등).
 * 이벤트명: `step_1_step1_partner_selection_cta` (`buildCreateProjectCtaEventName`).
 */
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

/** GA4에 페이지뷰 이벤트 전송 */
function trackGA4PageView(path: string) {
  if (typeof gtag === "undefined") return;
  gtag("event", "page_view", {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  });
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
