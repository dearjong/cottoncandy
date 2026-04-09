const MIXPANEL_TOKEN = "B32D8265A148455CB07F704BE7A648AA";
const MIXPANEL_URL = "https://api.mixpanel.com/track";
const BATCH_SIZE = 50;

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

export async function startSimulation(userCount: number): Promise<string> {
  const jobId = crypto.randomUUID();
  const job: SimJob = {
    status: "pending",
    progress: 0,
    message: "준비 중...",
    totalUsers: userCount,
    totalEvents: 0,
    batchesSent: 0,
    totalBatches: 0,
    funnelBreakdown: {},
    utmBreakdown: {},
    errors: [],
    startedAt: Date.now(),
  };
  jobs.set(jobId, job);

  runJob(jobId, job, userCount).catch((e) => {
    job.status = "error";
    job.errors.push(String(e));
  });

  return jobId;
}

async function runJob(jobId: string, job: SimJob, userCount: number) {
  job.status = "generating";
  job.message = "가상 사용자 이벤트 생성 중...";

  const events: MpEvent[] = [];
  const funnel = job.funnelBreakdown;
  const utmCount = job.utmBreakdown;

  function add(event: string, distinctId: string, ts: number, props: Record<string, unknown>) {
    events.push({
      event,
      properties: { token: MIXPANEL_TOKEN, distinct_id: distinctId, time: ts, simulation: true, ...props },
    });
    funnel[event] = (funnel[event] ?? 0) + 1;
  }

  // ── 유저 속성 풀 ──────────────────────────────────────
  // 광고주 5% / 대행사 30% / 제작사 55% / 뜨내기 10%
  const USER_TYPE_LIST = [
    { value: "advertiser", weight:  5 },
    { value: "agency",     weight: 30 },
    { value: "production", weight: 55 },
    { value: "visitor",    weight: 10 },
  ];
  const GENDERS    = [{ value: "male", weight: 50 }, { value: "female", weight: 50 }];
  const AGE_GROUPS = [{ value: "20s", weight: 10 }, { value: "30s", weight: 35 }, { value: "40s", weight: 35 }, { value: "50s", weight: 20 }];

  // UTM: tvcf.co.kr 배너 85% / 나머지 15%
  const UTM_LIST = [
    { value: { utm_source: "tvcf",    utm_medium: "banner",   channel: "referral", utm_campaign: "admarket_launch" }, weight: 85 },
    { value: { utm_source: "google",  utm_medium: "cpc",      channel: "paid" },     weight: 5  },
    { value: { utm_source: "naver",   utm_medium: "cpc",      channel: "paid" },     weight: 5  },
    { value: { utm_source: "kakao",   utm_medium: "social",   channel: "social" },   weight: 3  },
    { value: { utm_source: "organic", utm_medium: "organic",  channel: "organic" },  weight: 2  },
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

    // UTM 집계
    utmCount[utm.utm_source] = (utmCount[utm.utm_source] ?? 0) + 1;

    const joinSecsAgo = Math.floor(Math.random() * 69 * 3600); // 최근 69시간
    const baseTs = tsAgo(joinSecsAgo);

    const common: Record<string, unknown> = {
      user_type: userType,
      gender,
      age_group: ageGroup,
      ...utm,
      ...geo,
    };

    // ── Acquisition ──────────────────────────────────
    add("site_visit",  uid, baseTs,     { path: "/", ...common });
    add("first_visit", uid, baseTs + 1, { path: "/", ...common });

    // 뜨내기: 홈만 보다 이탈
    if (userType === "visitor") continue;

    // ── 인증 결정 ─────────────────────────────────────
    let isAuthenticated = false;
    const isTvcf = utm.utm_source === "tvcf";

    // SSO: tvcf 유입 유저 중 50%는 이미 로그인 상태
    if (isTvcf && chance(0.50)) {
      add("sso_login", uid, baseTs + 30, { source: "tvcf.co.kr", method: "sso", ...common });
      isAuthenticated = true;
    }

    // 일반 가입 (비SSO 중 5%)
    if (!isAuthenticated && chance(0.05)) {
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

  job.totalEvents = events.length;
  job.totalBatches = Math.ceil(events.length / BATCH_SIZE);
  job.status = "sending";
  job.message = "Mixpanel 전송 중...";

  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    const err = await sendBatch(batch);
    if (err) job.errors.push(`배치 ${job.batchesSent + 1}: ${err}`);
    job.batchesSent += 1;
    job.progress = Math.round((job.batchesSent / job.totalBatches) * 100);
    job.message = `Mixpanel 전송 중... (${job.batchesSent}/${job.totalBatches} 배치)`;
    await new Promise((r) => setTimeout(r, 15));
  }

  job.status = "done";
  job.progress = 100;
  job.message = "완료!";
  job.completedAt = Date.now();
}
