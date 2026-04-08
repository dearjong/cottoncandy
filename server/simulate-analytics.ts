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
  abBreakdown: {
    control: { viewed: number; ctaClicked: number };
    variant_question: { viewed: number; ctaClicked: number };
  };
  errors: string[];
  startedAt: number;
  completedAt?: number;
}

const jobs = new Map<string, SimJob>();

export function getSimJob(jobId: string): SimJob | undefined {
  return jobs.get(jobId);
}

function weightedRandom<T>(items: Array<{ value: T; weight: number }>): T {
  const total = items.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const x of items) { r -= x.weight; if (r <= 0) return x.value; }
  return items[items.length - 1].value;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

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
    abBreakdown: {
      control: { viewed: 0, ctaClicked: 0 },
      variant_question: { viewed: 0, ctaClicked: 0 },
    },
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
  const ab = job.abBreakdown;

  function add(event: string, distinctId: string, ts: number, props: Record<string, unknown>) {
    events.push({
      event,
      properties: { token: MIXPANEL_TOKEN, distinct_id: distinctId, time: ts, simulation: true, ...props },
    });
    funnel[event] = (funnel[event] ?? 0) + 1;
  }

  const UTM_SOURCES = [
    { value: { utm_source: "organic", utm_medium: "(none)", utm_campaign: "(organic)" }, weight: 30 },
    { value: { utm_source: "google", utm_medium: "cpc", utm_campaign: "brand_awareness" }, weight: 30 },
    { value: { utm_source: "naver", utm_medium: "cpc", utm_campaign: "검색광고" }, weight: 20 },
    { value: { utm_source: "kakao", utm_medium: "display", utm_campaign: "카카오비즈" }, weight: 10 },
    { value: { utm_source: "referral", utm_medium: "referral", utm_campaign: "(referral)" }, weight: 10 },
  ];

  const PARTNERS = ["솜사탕애드", "마케팅에이전션", "크리에이티브랩", "광고제작소", "미디어웍스"];
  const BUDGET_RANGES = ["500-1000만", "1000-3000만", "3000-5000만", "5000만-1억", "1억 이상"];

  for (let i = 1; i <= userCount; i++) {
    const uid = `sim_user_${String(i).padStart(4, "0")}`;
    const userType = i <= Math.floor(userCount * 0.1) ? "advertiser" : "partner";
    const utm = weightedRandom(UTM_SOURCES);
    const joinSecsAgo = Math.floor(Math.random() * 30 * 86400);
    const baseTs = tsAgo(joinSecsAgo);
    const variant: "control" | "variant_question" = i % 2 === 0 ? "control" : "variant_question";

    const common = {
      user_type: userType,
      ...utm,
      exp_home_hero_title: variant,
      active_experiments: "home_hero_title",
    };

    // Acquisition
    add("site_visit", uid, baseTs, { path: "/", ...common });

    // A/B 실험 노출 (80%)
    if (Math.random() < 0.8) {
      add("experiment_viewed", uid, baseTs + 2, {
        experiment_id: "home_hero_title",
        variant,
        ...common,
      });
      ab[variant].viewed += 1;

      // CTA 클릭: control 15%, variant_question 22%
      const ctaRate = variant === "variant_question" ? 0.22 : 0.15;
      if (Math.random() < ctaRate) {
        add("home_cta_clicked", uid, baseTs + 5, {
          experiment_id: "home_hero_title",
          variant,
          ...common,
        });
        ab[variant].ctaClicked += 1;
      }
    }

    // 회원가입 (40%)
    if (Math.random() < 0.4) {
      add("signup_funnel", uid, baseTs + 30, { step: 1, step_name: "account", path: "/signup", ...common });
      if (Math.random() < 0.85) {
        add("signup_funnel", uid, baseTs + 120, { step: 2, step_name: "phone", path: "/signup/phone", ...common });
        if (Math.random() < 0.9) {
          add("signup_funnel", uid, baseTs + 200, { step: 3, step_name: "email", path: "/signup/email", ...common });
          add("signup_complete", uid, baseTs + 250, { ...common });

          // Retention — 복수 세션 (55%)
          if (Math.random() < 0.55) {
            for (const dayOffset of [1, 3, 7, 14]) {
              if (Math.random() < 0.55) {
                add("page_view", uid, baseTs + dayOffset * 86400, {
                  page_path: "/service/project-list",
                  ...common,
                });
              }
            }
          }

          // Activation
          if (userType === "advertiser" && Math.random() < 0.35) {
            const wTs = baseTs + 600;
            for (let step = 1; step <= 16; step++) {
              if (Math.random() < 0.85) {
                add(`step_${step}_wizard`, uid, wTs + step * 60, { wizard_step: step, ...common });
              }
            }
            const pType = randomFrom(["공고", "1:1"] as const);
            const budget = randomFrom(BUDGET_RANGES);
            add("project_submitted", uid, wTs + 1200, {
              project_type: pType, partner_type: "advertiser",
              budget_range: budget, is_first_time: true, ...common,
            });
            add("activation_achieved", uid, wTs + 1201, {
              trigger_event: "project_submitted", ...common,
            });

            // Revenue (30%)
            if (Math.random() < 0.3) {
              add("participation_final_selected", uid, wTs + 5 * 86400, {
                company_id: Math.floor(Math.random() * 100) + 1,
                company_name: randomFrom(PARTNERS),
                selected: true, ...common,
              });
              const cVal = (Math.floor(Math.random() * 25) + 5) * 10_000_000;
              add("contract_signed", uid, wTs + 7 * 86400, {
                partner_name: randomFrom(PARTNERS),
                budget_range: budget,
                contract_value_krw: cVal,
                value: cVal,
                currency: "KRW", ...common,
              });

              // 리뷰 (70%)
              if (Math.random() < 0.7) {
                add("review_submitted", uid, wTs + 30 * 86400, {
                  project_id: `PN-SIM-${i}`,
                  has_client_rating: true,
                  has_partner_rating: Math.random() < 0.8,
                  has_text: Math.random() < 0.6, ...common,
                });
              }
            }

          } else if (userType === "partner" && Math.random() < 0.45) {
            const pid = `PN-2024-${String(Math.floor(Math.random() * 50) + 1).padStart(4, "0")}`;
            add("project_viewed", uid, baseTs + 400, {
              project_id: pid, project_type: "공고", user_type: "partner", ...common,
            });
            add("partner_applied", uid, baseTs + 500, {
              project_id: pid, project_type: "공고",
              partner_type: "제작사", is_first_time: true, ...common,
            });
            add("activation_achieved", uid, baseTs + 501, {
              trigger_event: "partner_applied", ...common,
            });

            // 제안서 (40%)
            if (Math.random() < 0.4) {
              add("proposal_submitted", uid, baseTs + 3 * 86400, {
                project_title: `광고 프로젝트 ${Math.floor(Math.random() * 100)}`,
                has_strategic_file: Math.random() < 0.7,
                has_creative_file: Math.random() < 0.8,
                concept_count: Math.floor(Math.random() * 3) + 1, ...common,
              });
            }
          }

          // Referral (8%)
          if (Math.random() < 0.08) {
            add("referral_sent", uid, baseTs + 3 * 86400, {
              method: Math.random() < 0.7 ? "copy" : "share",
              referrer_id: uid, ...common,
            });
          }
        }
      }
    }
  }

  job.totalEvents = events.length;
  job.totalBatches = Math.ceil(events.length / BATCH_SIZE);
  job.status = "sending";
  job.message = `Mixpanel 전송 중...`;

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
