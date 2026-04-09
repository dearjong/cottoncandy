const MIXPANEL_TOKEN = "B32D8265A148455CB07F704BE7A648AA";
const MIXPANEL_URL = "https://api.mixpanel.com/track";
const BATCH_SIZE = 50;

const GA4_MEASUREMENT_ID = "G-MG1WSR89E1";
const GA4_API_SECRET = "yEU6R3P9SWe5z9_Foa7XWA";
const GA4_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;

export type JobStatus = "pending" | "generating" | "sending" | "done" | "error";

export interface SimJob {
  status: JobStatus;
  progress: number;
  message: string;
  totalUsers: number;
  totalEvents: number;
  batchesSent: number;
  totalBatches: number;
  funnelBreakdown: Record<string, number>;
  utmBreakdown: Record<string, number>;
  userTypeBreakdown: Record<string, number>;
  geoBreakdown: Record<string, number>;
  errors: string[];
  startedAt: number;
  completedAt?: number;
}

const jobs = new Map<string, SimJob>();

export function getSimJob(jobId: string): SimJob | undefined {
  return jobs.get(jobId);
}

function weightedPick<T>(items: Array<{ value: T; weight: number }>): T {
  const total = items.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const x of items) { r -= x.weight; if (r <= 0) return x.value; }
  return items[items.length - 1].value;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function chance(p: number) { return Math.random() < p; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function tsAgo(seconds: number): number {
  return Math.floor((Date.now() - seconds * 1000) / 1000);
}

interface MpEvent {
  event: string;
  properties: Record<string, unknown>;
}

async function sendBatch(batch: MpEvent[]): Promise<string | null> {
  try {
    const res = await fetch(MIXPANEL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/plain" },
      body: JSON.stringify(batch),
    });
    if (!res.ok) return await res.text();
    return null;
  } catch (e) {
    return String(e);
  }
}

interface Ga4UserEvents {
  clientId: string;
  userId: string;
  sessionId: string;
  userProperties: Record<string, { value: unknown }>;
  events: Array<{ name: string; params: Record<string, unknown> }>;
}

// GA4 키 이벤트만 전송 (real-time 가시성을 위해 timestamp_micros 생략)
// ⚠ first_visit은 GA4 예약어라 배치 전체 거부됨 → 제외
const GA4_KEY_EVENTS = new Set([
  "site_visit", "sso_login", "login",
  "signup_started", "signup_complete",
  "project_submitted", "partner_applied", "contract_signed",
  "review_submitted", "project_completed", "activation_achieved",
]);

const GA4_DEBUG_ENDPOINT = `https://www.google-analytics.com/debug/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;

let ga4Validated = false; // 첫 번째 유저에만 validation 실행

async function sendGa4UserBatch(entry: Ga4UserEvents): Promise<string | null> {
  const GA4_MAX = 25;
  const payload = {
    client_id: entry.clientId,
    user_id: entry.userId,
    user_properties: entry.userProperties,
    events: [] as typeof entry.events,
  };

  for (let i = 0; i < entry.events.length; i += GA4_MAX) {
    payload.events = entry.events.slice(i, i + GA4_MAX);
    const body = JSON.stringify(payload);

    // 첫 전송 시 debug 엔드포인트로 검증
    if (!ga4Validated) {
      ga4Validated = true;
      try {
        const dbgRes = await fetch(GA4_DEBUG_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const dbgJson = await dbgRes.json() as { validationMessages?: Array<{ description: string }> };
        if (dbgJson.validationMessages && dbgJson.validationMessages.length > 0) {
          console.error("[GA4 Validation]", JSON.stringify(dbgJson.validationMessages));
        } else {
          console.log("[GA4 Validation] OK — payload is valid");
        }
      } catch (e) {
        console.error("[GA4 Validation Error]", e);
      }
    }

    try {
      const res = await fetch(GA4_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (res.status !== 204 && res.status !== 200) {
        const errText = await res.text();
        console.error(`[GA4 Error] status=${res.status}`, errText);
        return `status ${res.status}: ${errText}`;
      }
    } catch (e) {
      console.error("[GA4 Network Error]", e);
      return String(e);
    }
  }
  return null;
}

export interface SimConfig {
  userCount: number;
  pctAdvertiser: number;
  pctAgency: number;
  pctProduction: number;
  pctTvcf: number;
  pctGoogle: number;
  pctNaver: number;
  pctKakao: number;
  pctOrganic: number;
  tvcfSsoRate: number;
  tvcfManualLoginRate: number;
  signupRate: number;
}

export const DEFAULT_CONFIG: SimConfig = {
  userCount: 1000,
  pctAdvertiser: 5, pctAgency: 30, pctProduction: 65,
  pctTvcf: 85, pctGoogle: 5, pctNaver: 5, pctKakao: 3, pctOrganic: 2,
  tvcfSsoRate: 20, tvcfManualLoginRate: 25, signupRate: 3,
};

export async function startSimulation(cfg: SimConfig): Promise<string> {
  const jobId = crypto.randomUUID();
  const job: SimJob = {
    status: "pending",
    progress: 0,
    message: "준비 중...",
    totalUsers: cfg.userCount,
    totalEvents: 0,
    batchesSent: 0,
    totalBatches: 0,
    funnelBreakdown: {},
    utmBreakdown: {},
    userTypeBreakdown: {},
    geoBreakdown: {},
    errors: [],
    startedAt: Date.now(),
  };
  jobs.set(jobId, job);

  runJob(jobId, job, cfg).catch((e) => {
    job.status = "error";
    job.errors.push(String(e));
  });

  return jobId;
}

async function runJob(jobId: string, job: SimJob, cfg: SimConfig) {
  ga4Validated = false; // 매 job마다 재검증
  job.status = "generating";
  job.message = "가상 사용자 이벤트 생성 중...";

  const { userCount } = cfg;
  const events: MpEvent[] = [];
  const ga4Map = new Map<string, Ga4UserEvents>();
  const funnel = job.funnelBreakdown;
  const utmCount = job.utmBreakdown;
  const userTypeCount = job.userTypeBreakdown;
  const geoCount = job.geoBreakdown;

  function add(event: string, distinctId: string, ts: number, props: Record<string, unknown>) {
    events.push({
      event,
      properties: { token: MIXPANEL_TOKEN, distinct_id: distinctId, time: ts, simulation: true, ...props },
    });
    funnel[event] = (funnel[event] ?? 0) + 1;

    // GA4: 키 이벤트만 수집 (timestamp_micros 생략 → 실시간 개요 반영)
    if (GA4_KEY_EVENTS.has(event)) {
      const entry = ga4Map.get(distinctId);
      if (entry) {
        // session_id + engagement_time_msec 필수 (GA4 실시간 반영 조건)
        entry.events.push({
          name: event,
          params: {
            session_id: entry.sessionId,
            engagement_time_msec: randInt(500, 30000),
            simulation: "true",
            ...props,
          },
        });
      }
    }
  }

  function initGa4User(distinctId: string, userId: string, userProps: Record<string, unknown>) {
    const sessionId = String(Date.now() - randInt(0, 1800000)); // 최근 30분 내 세션
    ga4Map.set(distinctId, {
      clientId: `${randInt(1000000000, 9999999999)}.${randInt(1000000000, 9999999999)}`,
      userId,
      sessionId,
      userProperties: Object.fromEntries(
        Object.entries(userProps).map(([k, v]) => [k, { value: v }])
      ),
      events: [],
    });
  }

  // ── 유저 속성 풀 ──────────────────────────────────────
  // 유저 타입은 로그인한 유저 중 구성비 (미로그인 = total - authenticated)
  const USER_TYPE_LIST = [
    { value: "advertiser", weight: cfg.pctAdvertiser },
    { value: "agency",     weight: cfg.pctAgency     },
    { value: "production", weight: cfg.pctProduction  },
  ];
  const GENDERS    = [{ value: "male", weight: 50 }, { value: "female", weight: 50 }];
  const AGE_GROUPS = [{ value: "20s", weight: 10 }, { value: "30s", weight: 35 }, { value: "40s", weight: 35 }, { value: "50s", weight: 20 }];

  const UTM_LIST = [
    { value: { utm_source: "tvcf",    utm_medium: "banner",   channel: "referral", utm_campaign: "admarket_launch" }, weight: cfg.pctTvcf    },
    { value: { utm_source: "google",  utm_medium: "cpc",      channel: "paid" },                                      weight: cfg.pctGoogle  },
    { value: { utm_source: "naver",   utm_medium: "cpc",      channel: "paid" },                                      weight: cfg.pctNaver   },
    { value: { utm_source: "kakao",   utm_medium: "social",   channel: "social" },                                    weight: cfg.pctKakao   },
    { value: { utm_source: "organic", utm_medium: "organic",  channel: "organic" },                                   weight: cfg.pctOrganic },
  ];

  const GEO_LIST = [
    { value: { geo_region: "서울" },   weight: 35 },
    { value: { geo_region: "경기도" }, weight: 20 },
    { value: { geo_region: "부산" },   weight: 8  },
    { value: { geo_region: "인천" },   weight: 5  },
    { value: { geo_region: "대구" },   weight: 4  },
    { value: { geo_region: "대전" },   weight: 3  },
    { value: { geo_region: "광주" },   weight: 3  },
    { value: { geo_region: "기타지방"},weight: 17 },
    { value: { geo_region: "해외" },   weight: 5  },
  ];

  const CATEGORIES   = [
    { value: "영상광고",    weight: 85 },
    { value: "브랜드디자인", weight: 3  },
    { value: "사진촬영",    weight: 3  },
    { value: "SNS마케팅",   weight: 3  },
    { value: "PPT디자인",   weight: 3  },
    { value: "웹개발",      weight: 3  },
  ];
  const PARTNERS     = ["솜사탕애드","마케팅에이전시","크리에이티브랩","광고제작소","미디어웍스"];
  const BUDGET_RANGES = ["500-1000만","1000-3000만","3000-5000만","5000만-1억","1억 이상"];

  for (let i = 1; i <= userCount; i++) {
    const uid      = `sim_user_${String(i).padStart(4, "0")}`;
    const userType = weightedPick(USER_TYPE_LIST);
    const gender   = weightedPick(GENDERS);
    const ageGroup = weightedPick(AGE_GROUPS);
    const utm      = weightedPick(UTM_LIST);
    const geo      = weightedPick(GEO_LIST);
    const isPartner = userType === "agency" || userType === "production";

    // UTM / 지역 집계 (모든 유저)
    utmCount[utm.utm_source] = (utmCount[utm.utm_source] ?? 0) + 1;
    const region = geo.geo_region as string;
    geoCount[region] = (geoCount[region] ?? 0) + 1;

    const joinSecsAgo = Math.floor(Math.random() * 69 * 3600); // 최근 69시간
    const baseTs = tsAgo(joinSecsAgo);

    const common: Record<string, unknown> = {
      user_type: userType,
      gender,
      age_group: ageGroup,
      ...utm,
      ...geo,
    };

    // GA4 유저 초기화
    initGa4User(uid, uid, { user_type: userType, gender, age_group: ageGroup });

    // ── Acquisition ──────────────────────────────────
    add("site_visit", uid, baseTs, { path: "/", ...common });

    // ── 인증 결정 ─────────────────────────────────────
    let isAuthenticated = false;
    const isTvcf = utm.utm_source === "tvcf";

    // SSO: tvcf 유입 유저 중 50%는 이미 로그인 상태
    if (isTvcf && chance(cfg.tvcfSsoRate / 100)) {
      add("sso_login", uid, baseTs + 30, { source: "tvcf.co.kr", method: "sso", ...common });
      isAuthenticated = true;
    }

    // 수동 로그인: tvcf 비SSO 유저 중 60% (기존 tvcf 유저가 직접 로그인)
    if (!isAuthenticated && isTvcf && chance(cfg.tvcfManualLoginRate / 100)) {
      add("login", uid, baseTs + 120, { method: "email", source: "tvcf.co.kr", ...common });
      isAuthenticated = true;
    }

    // 일반 가입 (비로그인 유저 중 5%)
    if (!isAuthenticated && chance(cfg.signupRate / 100)) {
      add("signup_started", uid, baseTs + 30,  { method: "email", ...common });
      add("signup_funnel",  uid, baseTs + 35,  { step: 1, step_name: "account", path: "/signup", ...common });

      if (chance(0.88)) {
        add("signup_funnel", uid, baseTs + 120, { step: 2, step_name: "email", path: "/signup/email", ...common });

        if (chance(0.82)) {
          add("signup_funnel",  uid, baseTs + 200, { step: 3, step_name: "phone", path: "/signup/phone", ...common });
          add("signup_complete", uid, baseTs + 250, { ...common });

          if (chance(0.78)) {
            const accountType = chance(0.68) ? "personal" : "corporate";
            add("signup_funnel", uid, baseTs + 300, { step: 4, step_name: "account_type", path: "/signup/account-type", ...common });
            if (accountType === "corporate" && chance(0.62)) {
              add("signup_funnel", uid, baseTs + 400, { step: 5, step_name: "job_info", path: "/signup/job-info", ...common });
            }
            isAuthenticated = true;
          }
        }
      }
    }

    // ── 핵심행동: 인증 완료 유저만 ─────────────────────
    if (!isAuthenticated) continue;

    // 유저 타입 집계 (인증된 유저만 — 미로그인은 total - sum으로 계산)
    userTypeCount[userType] = (userTypeCount[userType] ?? 0) + 1;

    const partnerType = userType === "agency" ? "대행사" : "제작사";

    // 광고주: 프로젝트 등록 (12%)
    if (userType === "advertiser" && chance(0.12)) {
      const projTs    = baseTs + 600;
      const category  = weightedPick(CATEGORIES);
      const budget    = pick(BUDGET_RANGES);
      const projectId = `proj_${randInt(100, 999)}`;
      const pType     = pick(["공고", "1:1"] as const);

      add("step1_cta_click", uid, projTs, { selected_option: pType === "공고" ? "public" : "private", ...common });
      if (chance(0.68)) {
        add("project_submitted", uid, projTs + 1200, {
          project_id: projectId, project_type: pType,
          category, budget_range: budget, is_first_time: !isTvcf, ...common,
        });
        add("activation_achieved", uid, projTs + 1201, { trigger_event: "project_submitted", ...common });
        if (chance(0.30)) {
          add("contract_signed", uid, projTs + 7 * 86400, {
            project_id: projectId, partner_name: pick(PARTNERS),
            budget_range: budget, contract_value_krw: randInt(5, 30) * 10_000_000, ...common,
          });
          if (chance(0.70)) {
            add("review_submitted", uid, projTs + 30 * 86400, {
              project_id: projectId, has_client_rating: true,
              has_partner_rating: chance(0.8), has_text: chance(0.6), ...common,
            });
          }
        }
      }
    }

    // 파트너: 공고 지원 흐름 (22%)
    if (isPartner && chance(0.22)) {
      const projectId  = `proj_${randInt(100, 999)}`;
      const partnerTs  = baseTs + 400;

      add("partner_applied", uid, partnerTs, {
        project_id: projectId, project_type: pick(["공고","1:1"]),
        partner_type: partnerType, is_first_time: !isTvcf, ...common,
      });
      add("activation_achieved", uid, partnerTs + 1, { trigger_event: "partner_applied", ...common });

      if (chance(0.55)) {
        add("portfolio_registered", uid, partnerTs + 100, {
          portfolio_id: `pf_${randInt(1000, 9999)}`,
          category: weightedPick(CATEGORIES), partner_type: partnerType, ...common,
        });
      }
      if (chance(0.40)) {
        add("contract_signed",       uid, partnerTs +  7 * 86400, { project_id: projectId, partner_type: partnerType, ...common });
        add("draft_submitted",       uid, partnerTs + 14 * 86400, { project_id: projectId, draft_round: 1, category: weightedPick(CATEGORIES), ...common });
        if (chance(0.70)) {
          add("draft_confirmed",     uid, partnerTs + 16 * 86400, { project_id: projectId, draft_round: 1, ...common });
          if (chance(0.80)) {
            add("deliverable_submitted", uid, partnerTs + 25 * 86400, { project_id: projectId, category: weightedPick(CATEGORIES), ...common });
            if (chance(0.85)) {
              add("deliverable_confirmed", uid, partnerTs + 27 * 86400, { project_id: projectId, ...common });
              add("project_completed",     uid, partnerTs + 28 * 86400, { project_id: projectId, partner_type: partnerType, category: weightedPick(CATEGORIES), ...common });
            }
          }
        }
      }
    }

    // 파트너: 포트폴리오만 등록 (20%)
    if (isPartner && chance(0.20)) {
      add("portfolio_registered", uid, baseTs + 500, {
        portfolio_id: `pf_${randInt(1000, 9999)}`,
        category: weightedPick(CATEGORIES), partner_type: partnerType, ...common,
      });
    }

    // Referral (8%)
    if (chance(0.08)) {
      add("referral_sent", uid, baseTs + 3 * 86400, {
        method: chance(0.7) ? "copy" : "share", referrer_id: uid, ...common,
      });
    }
  }

  // ── Mixpanel 전송 ─────────────────────────────────
  job.totalEvents = events.length;
  job.totalBatches = Math.ceil(events.length / BATCH_SIZE);
  job.status = "sending";
  job.message = "Mixpanel 전송 중...";

  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    const err = await sendBatch(batch);
    if (err) job.errors.push(`MP 배치 ${job.batchesSent + 1}: ${err}`);
    job.batchesSent += 1;
    job.progress = Math.round((job.batchesSent / job.totalBatches) * 50); // 0~50%
    job.message = `Mixpanel 전송 중... (${job.batchesSent}/${job.totalBatches} 배치)`;
    await new Promise((r) => setTimeout(r, 15));
  }

  // ── GA4 Measurement Protocol 전송 (실시간 개요 반영) ──
  job.message = "GA4 전송 중...";
  const ga4Users = Array.from(ga4Map.values()).filter((u) => u.events.length > 0);
  let ga4Done = 0;
  for (const userEntry of ga4Users) {
    const err = await sendGa4UserBatch(userEntry);
    if (err) job.errors.push(`GA4 ${userEntry.userId}: ${err}`);
    ga4Done += 1;
    job.progress = 50 + Math.round((ga4Done / ga4Users.length) * 50); // 50~100%
    job.message = `GA4 전송 중... (${ga4Done}/${ga4Users.length} 유저)`;
    // GA4 rate limit 방지: 10명마다 잠깐 대기
    if (ga4Done % 10 === 0) await new Promise((r) => setTimeout(r, 30));
  }

  job.status = "done";
  job.progress = 100;
  job.message = "완료!";
  job.completedAt = Date.now();
}
