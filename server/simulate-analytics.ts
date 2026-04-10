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
  stepFunnelBreakdown: Record<number, number>;
  stepDropoffBreakdown: Record<number, number>;
  draftSavedCount: number;
  draftOpenedCount: number;
  draftReturnHoursSum: number;
  projectCompletedCount: number;
  projDaysSum: number;
  projSessionsSum: number;
  projWritingMinSum: number;
  portfolioCompletedCount: number;
  pfDaysSum: number;
  pfSessionsSum: number;
  pfWritingMinSum: number;
  projectTypeBreakdown: Record<string, number>;
  consultingRegisteredCount: number;
  firstVisitCount: number;
  returnVisitCount: number;
  genderBreakdown: Record<string, number>;
  directEntryBreakdown: Record<string, number>;
  portfolioFunnelBreakdown: Record<number, number>;
  portfolioDropoffBreakdown: Record<number, number>;
  homeClickBreakdown: Record<string, number>;
  dwellSecSum: Record<string, number>;
  dwellCount: Record<string, number>;
  exitPageBreakdown: Record<string, number>;
  errors: string[];
  startedAt: number;
  completedAt?: number;
}

// 프로젝트 등록 18단계 정의
const PROJECT_STEPS = [
  { step: 1,  screen: "partner_selection",     title: "파트너 찾기 방식",   passRate: 0.85 },
  { step: 2,  screen: "partner_type",           title: "파트너 유형",         passRate: 0.90 },
  { step: 3,  screen: "project_name",           title: "프로젝트명",           passRate: 0.88 },
  { step: 4,  screen: "advertising_objective",  title: "광고 목적",            passRate: 0.85 },
  { step: 5,  screen: "production_technique",   title: "제작 기법",            passRate: 0.87 },
  { step: 6,  screen: "media_channel",          title: "노출 매체",            passRate: 0.88 },
  { step: 7,  screen: "main_client",            title: "주요 고객",            passRate: 0.90 },
  { step: 8,  screen: "budget",                 title: "예산",                 passRate: 0.73 },
  { step: 9,  screen: "payment_terms",          title: "대금 지급",            passRate: 0.88 },
  { step: 10, screen: "schedule",               title: "일정",                 passRate: 0.87 },
  { step: 11, screen: "product_info",           title: "제품정보",             passRate: 0.86 },
  { step: 12, screen: "contact_person",         title: "담당자정보",           passRate: 0.90 },
  { step: 13, screen: "excluded_competitors",   title: "경쟁사 제외",          passRate: 0.92 },
  { step: 14, screen: "participant_conditions", title: "참여기업 조건",        passRate: 0.90 },
  { step: 15, screen: "required_files",         title: "제출자료",             passRate: 0.88 },
  { step: 16, screen: "company_info",           title: "기업정보",             passRate: 0.85 },
  { step: 17, screen: "additional_description", title: "상세설명",             passRate: 0.88 },
  { step: 18, screen: "project_details",        title: "최종 확인 & 등록",    passRate: 1.00 },
] as const;

// 포트폴리오 등록 13개 섹션
const PORTFOLIO_SECTIONS = [
  { step: 1,  id: "company_info",       title: "기업 정보",               passRate: 0.90 },
  { step: 2,  id: "manager_info",       title: "담당자 정보",             passRate: 0.85 },
  { step: 3,  id: "experience",         title: "경험·특화 분야/광고매체",  passRate: 0.80 },
  { step: 4,  id: "purpose",            title: "광고 목적별 전문 분야",    passRate: 0.78 },
  { step: 5,  id: "technique",          title: "제작 기법별 전문분야",     passRate: 0.82 },
  { step: 6,  id: "clients",            title: "대표 광고주",              passRate: 0.75 },
  { step: 7,  id: "awards",             title: "대표 수상내역",            passRate: 0.70 },
  { step: 8,  id: "portfolio",          title: "대표 포트폴리오",          passRate: 0.85 },
  { step: 9,  id: "staff",              title: "대표 스태프",              passRate: 0.65 },
  { step: 10, id: "recent_projects",    title: "최근 참여 프로젝트",       passRate: 0.72 },
  { step: 11, id: "cotton_candy",       title: "Cotton Candy 활동",        passRate: 0.80 },
  { step: 12, id: "file_upload",        title: "파일 업로드",              passRate: 0.78 },
  { step: 13, id: "intro",              title: "기업 소개글",              passRate: 0.85 },
] as const;

// 북마크 / 직접 유입 랜딩 페이지 (weight = 상대적 비율)
const DIRECT_LANDING_PAGES = [
  { path: "/",                      label: "홈",                 weight: 38 },
  { path: "/work/home",             label: "마이페이지 홈",      weight: 18 },
  { path: "/work/projects",         label: "내 프로젝트",        weight: 14 },
  { path: "/partner",               label: "파트너 찾기",        weight: 10 },
  { path: "/create-project/step1",  label: "프로젝트 등록",       weight: 7  },
  { path: "/work/profile",          label: "프로필",              weight: 6  },
  { path: "/work/proposals",        label: "제안 현황",           weight: 4  },
  { path: "/work/contracts",        label: "계약 관리",           weight: 3  },
];

const jobs = new Map<string, SimJob>();
let latestJobId: string | null = null;

export function getSimJob(jobId: string): SimJob | undefined {
  return jobs.get(jobId);
}

export function getLatestSimJob(): { jobId: string; job: SimJob } | null {
  if (!latestJobId) return null;
  const job = jobs.get(latestJobId);
  if (!job) return null;
  return { jobId: latestJobId, job };
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
  events: Array<{ name: string; params: Record<string, unknown>; timestamp_micros?: number }>;
}

// GA4 키 이벤트만 전송 (real-time 가시성을 위해 timestamp_micros 생략)
// ⚠ first_visit은 GA4 예약어라 배치 전체 거부됨 → 제외
const GA4_KEY_EVENTS = new Set([
  "site_visit", "sso_login", "login",
  "signup_started", "signup_complete",
  "portfolio_registered", "project_submitted",
  "partner_applied", "contract_signed",
  "project_draft_saved", "project_draft_opened",
  "portfolio_draft_saved", "portfolio_draft_opened",
  "draft_submitted", "draft_confirmed",
  "deliverable_submitted", "deliverable_confirmed",
  "project_completed", "review_submitted", "referral_sent",
  "activation_achieved",
]);

const GA4_DEBUG_ENDPOINT = `https://www.google-analytics.com/debug/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;

let ga4Validated = false; // 첫 번째 유저에만 validation 실행

const BASE_URL = "https://admarket.co.kr";

function derivePageLocation(event: string, props: Record<string, unknown>): string {
  // 홈
  if (["site_visit", "home_click", "step1_cta_click"].includes(event)) return `${BASE_URL}/`;
  // 로그인/회원가입
  if (["sso_login", "login"].includes(event)) return `${BASE_URL}/login`;
  if (event === "signup_started") return `${BASE_URL}/signup`;
  if (event === "signup_funnel") {
    const step = Number(props.step ?? 1);
    const paths: Record<number, string> = { 1: "/signup", 2: "/signup/email", 3: "/signup/phone", 4: "/signup/account-type", 5: "/signup/job-info" };
    return `${BASE_URL}${paths[step] ?? "/signup"}`;
  }
  if (event === "signup_complete") return `${BASE_URL}/signup/phone`;
  // 프로젝트 등록 단계 (step_N_screen)
  if (event.startsWith("step_")) {
    const m = event.match(/^step_(\d+)_/);
    const n = m ? Number(m[1]) : 1;
    return `${BASE_URL}/create-project/step${n}`;
  }
  if (["project_session_started"].includes(event)) {
    const step = Number(props.steps_completed_so_far ?? 0) + 1;
    return `${BASE_URL}/create-project/step${Math.min(step, 18)}`;
  }
  if (["project_draft_saved", "project_draft_opened"].includes(event)) {
    const step = Number(props.step ?? 1);
    return `${BASE_URL}/create-project/step${step}`;
  }
  if (event === "project_submitted") return `${BASE_URL}/create-project/step18`;
  // 파트너/계약/리뷰/포트폴리오
  if (event === "partner_applied") return `${BASE_URL}/partner/detail`;
  if (event === "contract_signed") return `${BASE_URL}/work/contracts`;
  if (event === "review_submitted") return `${BASE_URL}/work/reviews`;
  if (["portfolio_registered", "portfolio_draft_saved", "portfolio_draft_opened"].includes(event)
    || event.startsWith("portfolio_section_"))
    return `${BASE_URL}/work/portfolio/register`;
  if (event === "consulting_inquiry_submitted") return `${BASE_URL}/work/consulting`;
  if (event === "referral_sent") return `${BASE_URL}/work/home`;
  if (event === "activation_achieved") return `${BASE_URL}/work/home`;
  return `${BASE_URL}/`;
}

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
  periodDays: number;           // 이벤트를 분산할 기간 (일수)
  // 로그인 유저 내 구성 (합계 100%)
  pctAdvertiser: number; pctAgency: number; pctProduction: number;
  // UTM 유입 (합계 100%)
  pctTvcf: number; pctGoogle: number; pctNaver: number; pctKakao: number; pctOrganic: number;
  // 인증 방식 (전체 유저 기준 %, 합계 ≤ 100 → 나머지는 미로그인)
  pctSsoLogin: number; pctManualLogin: number; pctSignup: number;
  // 성별 (합계 100%)
  pctMale: number; pctFemale: number;
  // 연령대 (합계 100%)
  pct20s: number; pct30s: number; pct40s: number; pct50s: number;
  // 접속 지역 (합계 100%)
  pctSeoul: number; pctGyeonggi: number; pctLocal: number; pctAbroad: number;
  // 퍼널 인원 (절대 수)
  projectRegCount: number;
  portfolioRegCount: number;
  // 완주 최소 보장
  minProjectCompletions: number;
  minPortfolioCompletions: number;
}

export const DEFAULT_CONFIG: SimConfig = {
  userCount: 1000,
  periodDays: 3,
  pctAdvertiser: 5, pctAgency: 30, pctProduction: 65,
  pctTvcf: 85, pctGoogle: 5, pctNaver: 5, pctKakao: 3, pctOrganic: 2,
  pctSsoLogin: 17, pctManualLogin: 17, pctSignup: 3,
  pctMale: 45, pctFemale: 55,
  pct20s: 10, pct30s: 35, pct40s: 35, pct50s: 20,
  pctSeoul: 35, pctGyeonggi: 20, pctLocal: 40, pctAbroad: 5,
  projectRegCount: 30,
  portfolioRegCount: 50,
  minProjectCompletions: 5,
  minPortfolioCompletions: 5,
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
    stepFunnelBreakdown: {},
    stepDropoffBreakdown: {},
    draftSavedCount: 0,
    draftOpenedCount: 0,
    draftReturnHoursSum: 0,
    projectCompletedCount: 0,
    projDaysSum: 0,
    projSessionsSum: 0,
    projWritingMinSum: 0,
    portfolioCompletedCount: 0,
    pfDaysSum: 0,
    pfSessionsSum: 0,
    pfWritingMinSum: 0,
    projectTypeBreakdown: {},
    consultingRegisteredCount: 0,
    firstVisitCount: 0,
    returnVisitCount: 0,
    genderBreakdown: {},
    directEntryBreakdown: {},
    portfolioFunnelBreakdown: {},
    portfolioDropoffBreakdown: {},
    homeClickBreakdown: {},
    dwellSecSum: {},
    dwellCount: {},
    exitPageBreakdown: {},
    errors: [],
    startedAt: Date.now(),
  };
  jobs.set(jobId, job);
  latestJobId = jobId;

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
  const stepFunnel = job.stepFunnelBreakdown;
  const stepDropoff = job.stepDropoffBreakdown;
  const directCount = job.directEntryBreakdown;
  const pfFunnel = job.portfolioFunnelBreakdown;
  const pfDropoff = job.portfolioDropoffBreakdown;

  function add(event: string, distinctId: string, ts: number, props: Record<string, unknown>) {
    events.push({
      event,
      properties: { token: MIXPANEL_TOKEN, distinct_id: distinctId, time: ts, simulation: true, ...props },
    });
    funnel[event] = (funnel[event] ?? 0) + 1;

    // GA4: page_view + 키 이벤트 수집
    const isStepEvent = /^step_\d+_/.test(event) || /^portfolio_section_/.test(event);
    if (GA4_KEY_EVENTS.has(event) || isStepEvent) {
      const entry = ga4Map.get(distinctId);
      if (entry) {
        const pageLocation = derivePageLocation(event, props);
        // GA4 MP timestamp_micros: 72시간(258,200초) 이내로 캡
        const GA4_MAX_AGO_SEC = 71 * 3600;
        const cappedTs = Math.max(ts, Math.floor(Date.now() / 1000) - GA4_MAX_AGO_SEC);
        const tsMicros = cappedTs * 1_000_000;

        // page_view 이벤트 → GA4 '페이지 및 화면' 보고서에 반영
        entry.events.push({
          name: "page_view",
          params: {
            session_id: entry.sessionId,
            engagement_time_msec: randInt(200, 8000),
            page_location: pageLocation,
            page_referrer: `${BASE_URL}/`,
          },
          timestamp_micros: tsMicros,
        });

        // 키 전환 이벤트는 custom event도 함께 전송 → GA4 이벤트 보고서에 반영
        if (GA4_KEY_EVENTS.has(event)) {
          entry.events.push({
            name: event,
            params: {
              session_id: entry.sessionId,
              engagement_time_msec: randInt(500, 30000),
              page_location: pageLocation,
              page_referrer: `${BASE_URL}/`,
              simulation: "true",
              ...props,
            },
            timestamp_micros: tsMicros,
          });
        }
      }
    }
  }

  // 페이지 체류시간 누적 헬퍼
  const DWELL_PROFILES: Record<string, { min: number; max: number }> = {
    "홈 (/)":          { min: 20,  max: 180 },
    "파트너 탐색":      { min: 30,  max: 220 },
    "공고 상세":        { min: 60,  max: 320 },
    "프로젝트 등록":    { min: 25,  max: 210 },
    "포트폴리오 등록":  { min: 35,  max: 260 },
    "컨설팅 문의":      { min: 90,  max: 380 },
    "계약 화면":        { min: 90,  max: 520 },
    "납품/산출물":      { min: 40,  max: 260 },
  };
  function addDwell(page: string) {
    const p = DWELL_PROFILES[page];
    if (!p) return;
    const sec = randInt(p.min, p.max);
    job.dwellSecSum[page] = (job.dwellSecSum[page] ?? 0) + sec;
    job.dwellCount[page]  = (job.dwellCount[page]  ?? 0) + 1;
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
  const GENDERS    = [{ value: "male", weight: cfg.pctMale }, { value: "female", weight: cfg.pctFemale }];
  const AGE_GROUPS = [
    { value: "20s", weight: cfg.pct20s },
    { value: "30s", weight: cfg.pct30s },
    { value: "40s", weight: cfg.pct40s },
    { value: "50s", weight: cfg.pct50s },
  ];

  const UTM_LIST = [
    { value: { utm_source: "tvcf",    utm_medium: "banner",   channel: "referral", utm_campaign: "admarket_launch" }, weight: cfg.pctTvcf    },
    { value: { utm_source: "google",  utm_medium: "cpc",      channel: "paid" },                                      weight: cfg.pctGoogle  },
    { value: { utm_source: "naver",   utm_medium: "cpc",      channel: "paid" },                                      weight: cfg.pctNaver   },
    { value: { utm_source: "kakao",   utm_medium: "social",   channel: "social" },                                    weight: cfg.pctKakao   },
    { value: { utm_source: "organic", utm_medium: "organic",  channel: "organic" },                                   weight: cfg.pctOrganic },
  ];

  const GEO_LIST = [
    { value: { geo_region: "서울" },  weight: cfg.pctSeoul    },
    { value: { geo_region: "경기도" }, weight: cfg.pctGyeonggi },
    { value: { geo_region: "지방" },  weight: cfg.pctLocal    },
    { value: { geo_region: "해외" },  weight: cfg.pctAbroad   },
  ];

  const HOME_CLICK_ELEMENTS = [
    { value: "cta",            weight: 28 },
    { value: "project_card",   weight: 20 },
    { value: "login_btn",      weight: 16 },
    { value: "free_start_btn", weight: 12 },
    { value: "category",       weight: 10 },
    { value: "faq",            weight: 8  },
    { value: "feature_card",   weight: 4  },
    { value: "partner",        weight: 1  },
    { value: "flow_step",      weight: 1  },
    { value: "etc",            weight: 3  },
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

  // ── 기업명 풀 ──────────────────────────────────────
  const ADVERTISER_COMPANIES = ["삼성전자","LG전자","현대자동차","SK텔레콤","롯데그룹","CJ그룹","GS칼텍스","포스코","한화그룹","코카콜라코리아","맥도날드코리아","네이버","카카오","쿠팡","배달의민족","하이트진로","오뚜기","농심","풀무원","빙그레","아모레퍼시픽","LG생활건강","이니스프리","신세계백화점","롯데백화점","현대백화점","KB국민은행","신한은행","우리은행","하나은행"];
  const PARTNER_COMPANIES = ["솜사탕애드","마케팅에이전시","크리에이티브랩","광고제작소","미디어웍스","픽셀스튜디오","비주얼팩토리","아이디어뱅크","크리에이티브허브","영상스튜디오","광고창작소","미디어플러스","콘텐츠랩","영상팩토리","디자인스튜디오","브랜드에이전시","멀티미디어","그래픽하우스","모션웍스","퍼블리셔스"];

  // Mixpanel People 프로필 배치
  const mpPeople: Array<Record<string, unknown>> = [];

  function registerMixpanelPeople(distinctId: string, props: Record<string, unknown>) {
    mpPeople.push({
      $token: MIXPANEL_TOKEN,
      $distinct_id: distinctId,
      $set: props,
    });
  }

  async function flushMixpanelPeople() {
    const PEOPLE_URL = "https://api.mixpanel.com/engage";
    for (let i = 0; i < mpPeople.length; i += BATCH_SIZE) {
      const batch = mpPeople.slice(i, i + BATCH_SIZE);
      try {
        await fetch(PEOPLE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "text/plain" },
          body: JSON.stringify(batch),
        });
      } catch (_) { /* ignore */ }
      await new Promise((r) => setTimeout(r, 15));
    }
  }

  let projRegDone = 0;
  let pfRegDone   = 0;

  for (let i = 1; i <= userCount; i++) {
    const uid      = `sim_user_${String(i).padStart(4, "0")}`;
    const userType = weightedPick(USER_TYPE_LIST);
    const gender   = weightedPick(GENDERS);
    const ageGroup = weightedPick(AGE_GROUPS);
    const utm      = weightedPick(UTM_LIST);
    const geo      = weightedPick(GEO_LIST);
    const isPartner = userType === "agency" || userType === "production";
    let didPortfolioReg = false;
    let exitPage = "홈 (/)";

    // 기업명 생성
    const userCompany = userType === "advertiser"
      ? pick(ADVERTISER_COMPANIES)
      : pick(PARTNER_COMPANIES);

    // UTM / 지역 / 성별 집계 (모든 유저)
    utmCount[utm.utm_source] = (utmCount[utm.utm_source] ?? 0) + 1;
    const region = geo.geo_region as string;
    geoCount[region] = (geoCount[region] ?? 0) + 1;
    job.genderBreakdown[gender] = (job.genderBreakdown[gender] ?? 0) + 1;

    const joinSecsAgo = Math.floor(Math.random() * cfg.periodDays * 24 * 3600);
    const baseTs = tsAgo(joinSecsAgo);

    const common: Record<string, unknown> = {
      user_type: userType,
      gender,
      age_group: ageGroup,
      ...utm,
      ...geo,
    };

    // Mixpanel People 프로필 등록
    registerMixpanelPeople(uid, {
      user_type:    userType,
      user_company: userCompany,
      gender,
      age_group:    ageGroup,
      geo_region:   geo.geo_region,
      utm_source:   utm.utm_source,
      simulation:   true,
    });

    // GA4 유저 초기화
    initGa4User(uid, uid, { user_type: userType, gender, age_group: ageGroup });

    // ── Acquisition ──────────────────────────────────
    // 첫방문(60%) / 재방문(40%) 구분
    const isNewVisitor = chance(0.60);
    if (isNewVisitor) { job.firstVisitCount += 1; } else { job.returnVisitCount += 1; }
    add("site_visit", uid, baseTs, { path: "/", is_new_visitor: isNewVisitor, ...common });
    addDwell("홈 (/)");

    // ── 메인화면 클릭 이벤트 (모든 방문자) ──────────────────
    const homeClickN = randInt(1, 4);
    for (let c = 0; c < homeClickN; c++) {
      const el = weightedPick(HOME_CLICK_ELEMENTS);
      job.homeClickBreakdown[el] = (job.homeClickBreakdown[el] ?? 0) + 1;
      add("home_click", uid, baseTs + 5 + c * 20, { element: el, ...common });
    }

    // ── 인증 결정 (직접 % 기반) ───────────────────────────
    let isAuthenticated = false;
    const roll = Math.random() * 100;
    const ssoThreshold     = cfg.pctSsoLogin;
    const manualThreshold  = ssoThreshold + cfg.pctManualLogin;
    const signupThreshold  = manualThreshold + cfg.pctSignup;

    if (roll < ssoThreshold) {
      // SSO 자동 로그인
      add("sso_login", uid, baseTs + 30, { source: "tvcf.co.kr", method: "sso", ...common });
      isAuthenticated = true;
    } else if (roll < manualThreshold) {
      // 수동 로그인
      add("login", uid, baseTs + 120, { method: "email", source: "direct", ...common });
      isAuthenticated = true;
    } else if (roll < signupThreshold) {
      // 신규 가입 (퍼널 이벤트 발생)
      add("signup_started", uid, baseTs + 30,  { method: "email", ...common });
      add("signup_funnel",  uid, baseTs + 35,  { step: 1, step_name: "account", path: "/signup", ...common });
      add("signup_funnel",  uid, baseTs + 120, { step: 2, step_name: "email",   path: "/signup/email", ...common });
      add("signup_funnel",  uid, baseTs + 200, { step: 3, step_name: "phone",   path: "/signup/phone", ...common });
      add("signup_complete", uid, baseTs + 250, { ...common });
      const accountType = chance(0.68) ? "personal" : "corporate";
      add("signup_funnel",  uid, baseTs + 300, { step: 4, step_name: "account_type", path: "/signup/account-type", ...common });
      if (accountType === "corporate" && chance(0.62)) {
        add("signup_funnel", uid, baseTs + 400, { step: 5, step_name: "job_info", path: "/signup/job-info", ...common });
      }
      isAuthenticated = true;
    }
    // else: 미로그인 (roll >= signupThreshold)

    // ── 직접 유입 / 북마크 추적 ────────────────────────
    // 재방문(직접 유입) 확률: 인증 유저 40%, 미인증 유저 20%
    if (chance(isAuthenticated ? 0.40 : 0.20)) {
      // 인증 유저는 내부 페이지로, 미인증은 공개 페이지 위주
      const landingPage = isAuthenticated
        ? weightedPick(DIRECT_LANDING_PAGES.map((p) => ({ value: p, weight: p.weight })))
        : weightedPick(DIRECT_LANDING_PAGES.filter((p) => ["홈","파트너 찾기","프로젝트 등록"].includes(p.label)).map((p) => ({ value: p, weight: p.weight })));
      directCount[landingPage.path] = (directCount[landingPage.path] ?? 0) + 1;
      add("direct_entry", uid, baseTs + 5, {
        path: landingPage.path, page_label: landingPage.label,
        is_authenticated: isAuthenticated, referrer: "direct", ...common,
      });
    }

    // ── 핵심행동: 인증 완료 유저만 ─────────────────────
    if (!isAuthenticated) continue;

    // 유저 타입 집계 (인증된 유저만 — 미로그인은 total - sum으로 계산)
    userTypeCount[userType] = (userTypeCount[userType] ?? 0) + 1;

    // 파트너 탐색 페이지 체류 (40% 확률)
    if (chance(0.40)) { addDwell("파트너 탐색"); exitPage = "파트너 탐색"; }

    const partnerType = userType === "agency" ? "대행사" : "제작사";

    // 광고주: 프로젝트 등록 — 18단계 퍼널
    if (userType === "advertiser" && projRegDone < cfg.projectRegCount) {
      projRegDone++;
      const projTs    = baseTs + 600;
      const category  = weightedPick(CATEGORIES);
      const budget    = pick(BUDGET_RANGES);
      const projectId = `proj_${randInt(100, 999)}`;
      const pType     = weightedPick([
        { value: "공고"    as const, weight: 45 },
        { value: "1:1"     as const, weight: 30 },
        { value: "컨설팅"  as const, weight: 25 },
      ]);

      // 컨설팅 의뢰 경로 (18단계 퍼널 없음)
      if (pType === "컨설팅") {
        job.consultingRegisteredCount += 1;
        job.projectTypeBreakdown["컨설팅"] = (job.projectTypeBreakdown["컨설팅"] ?? 0) + 1;
        add("consulting_inquiry_submitted", uid, projTs, {
          inquiry_type: "new", category, is_first_time: utm.utm_source !== "tvcf", ...common,
        });
        addDwell("컨설팅 문의"); exitPage = "컨설팅 문의";
        add("activation_achieved", uid, projTs + 1, { trigger_event: "consulting_inquiry_submitted", ...common });
      } else {
        // 공개(공고) / 비공개(1:1) — 18단계 퍼널 (멀티 세션)
        exitPage = "프로젝트 등록";
        const optionStr = pType === "공고" ? "public" : "private";
        add("step1_cta_click", uid, projTs, { selected_option: optionStr, ...common });

        const projNumSessions = weightedPick([
          { value: 1, weight: 25 }, { value: 2, weight: 45 }, { value: 3, weight: 30 },
        ]);
        const projStepsPerSession = Math.ceil(18 / projNumSessions);
        let projStepIdx          = 0;  // PROJECT_STEPS 배열 내 현재 위치 (0-based)
        let projCurrentTs        = projTs;
        let lastStep             = 0;
        let projTotalSessions    = 0;
        let projTotalWritingSec  = 0;
        const projGapsHours: number[] = [];
        let projDraftSaveCount   = 0;
        let projLastSaveTs       = projTs;
        let projFinallyAbandoned = false; // 임시저장 없이 완전 이탈

        for (let sIdx = 0; sIdx < projNumSessions && projStepIdx < PROJECT_STEPS.length && !projFinallyAbandoned; sIdx++) {
          projTotalSessions++;
          let sessionWriteOffset  = 0;
          let sessionDroppedOff   = false;
          let sessionSavedDraft   = false;

          // 재방문 세션: 임시저장 열기 → 중간 단계부터 재개
          if (sIdx > 0) {
            job.draftOpenedCount += 1;
            const lastGap = projGapsHours[projGapsHours.length - 1] ?? 0;
            job.draftReturnHoursSum += lastGap;
            add("project_draft_opened", uid, projCurrentTs, {
              project_type: pType, session_number: sIdx + 1,
              steps_completed_so_far: lastStep,
              resume_from_step: PROJECT_STEPS[projStepIdx]?.step ?? lastStep,
              draft_save_count: projDraftSaveCount,
              days_since_last_save: +(lastGap / 24).toFixed(1),
              hours_since_last_save: lastGap,
              cumulative_writing_sec: projTotalWritingSec, ...common,
            });
          }

          add("project_session_started", uid, projCurrentTs + 5, {
            session_number: sIdx + 1, steps_completed_so_far: lastStep,
            resume_from_step: PROJECT_STEPS[projStepIdx]?.step ?? 1,
            project_type: pType, cumulative_writing_sec: projTotalWritingSec, ...common,
          });

          // 이 세션 담당 스텝: projStepIdx 위치부터 최대 projStepsPerSession개
          const sessionSteps = PROJECT_STEPS.slice(projStepIdx, projStepIdx + projStepsPerSession);

          for (const s of sessionSteps) {
            const stepDuration = s.step <= 3 ? randInt(45, 120)
              : s.step <= 12 ? randInt(90, 420)
              : randInt(30, 120);

            stepFunnel[s.step] = (stepFunnel[s.step] ?? 0) + 1;
            add(`step_${s.step}_${s.screen}`, uid, projCurrentTs + sessionWriteOffset + 10, {
              step: s.step, screen: s.screen, project_type: pType,
              session_number: sIdx + 1,
              resumed_from_draft: sIdx > 0,
              time_on_step_sec: stepDuration,
              cumulative_writing_sec: projTotalWritingSec + stepDuration,
              ...common,
            });

            job.dwellSecSum["프로젝트 등록"] = (job.dwellSecSum["프로젝트 등록"] ?? 0) + stepDuration;
            job.dwellCount["프로젝트 등록"]  = (job.dwellCount["프로젝트 등록"]  ?? 0) + 1;
            sessionWriteOffset  += stepDuration;
            projTotalWritingSec += stepDuration;

            // 이탈 판정
            if (s.step < 18 && !chance(s.passRate)) {
              stepDropoff[s.step] = (stepDropoff[s.step] ?? 0) + 1;
              // 이탈 전 임시저장 (80% 확률)
              if (chance(0.80)) {
                projDraftSaveCount++;
                job.draftSavedCount += 1;
                sessionSavedDraft = true;
                add("project_draft_saved", uid, projCurrentTs + sessionWriteOffset + 5, {
                  step: s.step, screen: s.screen, project_type: pType,
                  session_number: sIdx + 1, draft_save_count: projDraftSaveCount,
                  steps_completed: s.step, cumulative_writing_sec: projTotalWritingSec, ...common,
                });
              }
              add("project_step_abandoned", uid, projCurrentTs + sessionWriteOffset + 10, {
                step: s.step, screen: s.screen, project_type: pType,
                had_draft: projDraftSaveCount > 0, session_number: sIdx + 1,
                time_on_step_sec: stepDuration, cumulative_writing_sec: projTotalWritingSec, ...common,
              });
              add("page_exit", uid, projCurrentTs + sessionWriteOffset + 15, {
                path: `/create-project/step${s.step}`, exit_step: s.step, ...common,
              });
              lastStep = s.step;
              sessionDroppedOff = true;
              // projStepIdx 는 증가하지 않음 → 다음 세션이 이 단계부터 재개
              break;
            }

            // 단계 성공: 위치 전진
            lastStep = s.step;
            projStepIdx++;
          }

          if (sessionDroppedOff) {
            if (sessionSavedDraft && sIdx < projNumSessions - 1) {
              // 임시저장 후 다음 세션에서 재방문 예정
              const gapHours = randInt(2, 72);
              projGapsHours.push(gapHours);
              projLastSaveTs = projCurrentTs + sessionWriteOffset + 5;
              projCurrentTs  = projLastSaveTs + gapHours * 3600;
            } else {
              // 임시저장 없이 완전 이탈 (또는 세션 소진)
              projFinallyAbandoned = true;
            }
          } else {
            // 세션 정상 완료
            if (projStepIdx >= PROJECT_STEPS.length) {
              // 18단계 완주
              projCurrentTs = projCurrentTs + sessionWriteOffset;
            } else if (sIdx < projNumSessions - 1) {
              // 중간 세션 종료 → 임시저장 후 다음 세션
              projDraftSaveCount++;
              job.draftSavedCount += 1;
              const gapHours = randInt(1, 48);
              projGapsHours.push(gapHours);
              add("project_draft_saved", uid, projCurrentTs + sessionWriteOffset + 10, {
                steps_completed: lastStep, project_type: pType,
                session_number: sIdx + 1, draft_save_count: projDraftSaveCount,
                cumulative_writing_sec: projTotalWritingSec,
                next_session_gap_hours: gapHours, ...common,
              });
              projLastSaveTs = projCurrentTs + sessionWriteOffset + 10;
              projCurrentTs  = projLastSaveTs + gapHours * 3600;
            } else {
              projCurrentTs = projCurrentTs + sessionWriteOffset;
            }
          }
        }

        // 18단계 완주 → 등록 완료
        if (lastStep === 18) {
          const projTotalHours = Math.round((projCurrentTs - projTs) / 3600);
          const projTotalDays  = +(projTotalHours / 24).toFixed(1);
          const projAvgGap     = projGapsHours.length > 0
            ? Math.round(projGapsHours.reduce((a, b) => a + b, 0) / projGapsHours.length) : 0;

          job.projectTypeBreakdown[pType] = (job.projectTypeBreakdown[pType] ?? 0) + 1;
          job.projectCompletedCount += 1;
          job.projDaysSum     += projTotalDays;
          job.projSessionsSum += projTotalSessions;
          job.projWritingMinSum += Math.round(projTotalWritingSec / 60);
          add("project_submitted", uid, projCurrentTs + 10, {
            project_id: projectId, project_type: pType,
            category, budget_range: budget, is_first_time: utm.utm_source !== "tvcf",
            total_sessions: projTotalSessions, total_hours: projTotalHours,
            total_days: projTotalDays, avg_session_gap_hours: projAvgGap,
            total_writing_time_sec: projTotalWritingSec,
            total_writing_time_min: Math.round(projTotalWritingSec / 60), ...common,
          });
          add("activation_achieved", uid, projCurrentTs + 61, { trigger_event: "project_submitted", ...common });
          if (chance(0.30)) {
            addDwell("계약 화면"); exitPage = "계약 화면";
            add("contract_signed", uid, projCurrentTs + 7 * 86400, {
              project_id: projectId, partner_name: pick(PARTNERS),
              budget_range: budget, contract_value_krw: randInt(5, 30) * 10_000_000, ...common,
            });
            if (chance(0.70)) {
              exitPage = "리뷰 등록";
              add("review_submitted", uid, projCurrentTs + 30 * 86400, {
                project_id: projectId, has_client_rating: true,
                has_partner_rating: chance(0.8), has_text: chance(0.6), ...common,
              });
            }
          }
        }
      }
    }

    // 파트너: 공고 지원 흐름 (22%)
    if (isPartner && chance(0.22)) {
      const projectId  = `proj_${randInt(100, 999)}`;
      const partnerTs  = baseTs + 400;

      addDwell("공고 상세"); exitPage = "공고 상세";
      add("partner_applied", uid, partnerTs, {
        project_id: projectId, project_type: pick(["공고","1:1"]),
        partner_type: partnerType, is_first_time: utm.utm_source !== "tvcf", ...common,
      });
      add("activation_achieved", uid, partnerTs + 1, { trigger_event: "partner_applied", ...common });

      // 포트폴리오 등록 퍼널 (멀티 세션)
      if (!didPortfolioReg && pfRegDone < cfg.portfolioRegCount) {
        pfRegDone++;
        didPortfolioReg = true;
        const pfTs = partnerTs + 100;

        const pfNumSessions = weightedPick([
          { value: 1, weight: 15 }, { value: 2, weight: 35 },
          { value: 3, weight: 30 }, { value: 4, weight: 20 },
        ]);
        const pfSecsPerSession  = Math.ceil(13 / pfNumSessions);
        let pfCurrentTs         = pfTs;
        let pfLastSection       = 0;
        let pfAbandoned         = false;
        let pfTotalSessions     = 0;
        let pfTotalWritingSec   = 0;
        let pfDraftSaveCount    = 0;
        const pfGapsHours: number[] = [];

        for (let sIdx = 0; sIdx < pfNumSessions && !pfAbandoned; sIdx++) {
          pfTotalSessions++;
          let pfSessionWriteOffset = 0;

          // 재방문 세션: 임시저장 열기
          if (sIdx > 0) {
            job.draftOpenedCount += 1;
            const pfLastGap = pfGapsHours[pfGapsHours.length - 1] ?? 0;
            job.draftReturnHoursSum += pfLastGap;
            add("portfolio_draft_opened", uid, pfCurrentTs, {
              partner_type: partnerType, session_number: sIdx + 1,
              sections_completed_so_far: pfLastSection,
              draft_save_count: pfDraftSaveCount,
              days_since_last_save: +(pfLastGap / 24).toFixed(1),
              hours_since_last_save: pfLastGap,
              cumulative_writing_sec: pfTotalWritingSec, ...common,
            });
          }

          add("portfolio_session_started", uid, pfCurrentTs + 5, {
            session_number: sIdx + 1, sections_completed_so_far: pfLastSection,
            partner_type: partnerType, cumulative_writing_sec: pfTotalWritingSec, ...common,
          });

          const sessionSecs = PORTFOLIO_SECTIONS.slice(sIdx * pfSecsPerSession, (sIdx + 1) * pfSecsPerSession);

          for (const sec of sessionSecs) {
            const secDuration = [1,2,3].includes(sec.step) ? randInt(60, 180) : randInt(180, 600);

            pfFunnel[sec.step] = (pfFunnel[sec.step] ?? 0) + 1;
            add(`portfolio_section_${sec.id}`, uid, pfCurrentTs + pfSessionWriteOffset + 10, {
              section: sec.step, section_id: sec.id, partner_type: partnerType,
              session_number: sIdx + 1,
              time_on_section_sec: secDuration,
              cumulative_writing_sec: pfTotalWritingSec + secDuration,
              ...common,
            });

            exitPage = "포트폴리오 등록";
            job.dwellSecSum["포트폴리오 등록"] = (job.dwellSecSum["포트폴리오 등록"] ?? 0) + secDuration;
            job.dwellCount["포트폴리오 등록"]  = (job.dwellCount["포트폴리오 등록"]  ?? 0) + 1;
            pfSessionWriteOffset += secDuration;
            pfTotalWritingSec    += secDuration;

            if (sec.step < 13 && !chance(sec.passRate)) {
              pfDropoff[sec.step] = (pfDropoff[sec.step] ?? 0) + 1;
              if (chance(0.80)) {
                pfDraftSaveCount++;
                add("portfolio_draft_saved", uid, pfCurrentTs + pfSessionWriteOffset + 5, {
                  sections_completed: pfLastSection, partner_type: partnerType,
                  session_number: sIdx + 1, draft_save_count: pfDraftSaveCount,
                  cumulative_writing_sec: pfTotalWritingSec, ...common,
                });
              }
              add("portfolio_section_abandoned", uid, pfCurrentTs + pfSessionWriteOffset + 10, {
                section: sec.step, section_id: sec.id, partner_type: partnerType,
                session_number: sIdx + 1, had_draft: pfDraftSaveCount > 0,
                time_on_section_sec: secDuration, cumulative_writing_sec: pfTotalWritingSec, ...common,
              });
              add("page_exit", uid, pfCurrentTs + pfSessionWriteOffset + 15, {
                path: "/work/portfolio", exit_section: sec.step, exit_section_id: sec.id, ...common,
              });
              pfLastSection = sec.step;
              pfAbandoned = true;
              break;
            }
            pfLastSection = sec.step;
          }

          if (!pfAbandoned && sIdx < pfNumSessions - 1) {
            pfDraftSaveCount++;
            const gapHours = randInt(1, 72);
            pfGapsHours.push(gapHours);
            add("portfolio_draft_saved", uid, pfCurrentTs + pfSessionWriteOffset + 10, {
              sections_completed: pfLastSection, partner_type: partnerType,
              session_number: sIdx + 1, draft_save_count: pfDraftSaveCount,
              cumulative_writing_sec: pfTotalWritingSec,
              next_session_gap_hours: gapHours, ...common,
            });
            pfCurrentTs = pfCurrentTs + pfSessionWriteOffset + gapHours * 3600;
          } else if (!pfAbandoned) {
            pfCurrentTs = pfCurrentTs + pfSessionWriteOffset;
          }
        }

        if (pfLastSection === 13) {
          const pfTotalHours = Math.round((pfCurrentTs - pfTs) / 3600);
          const pfTotalDays  = +(pfTotalHours / 24).toFixed(1);
          const pfAvgGap     = pfGapsHours.length > 0
            ? Math.round(pfGapsHours.reduce((a, b) => a + b, 0) / pfGapsHours.length) : 0;
          job.portfolioCompletedCount += 1;
          job.pfDaysSum       += pfTotalDays;
          job.pfSessionsSum   += pfTotalSessions;
          job.pfWritingMinSum += Math.round(pfTotalWritingSec / 60);
          add("portfolio_registered", uid, pfCurrentTs + 10, {
            portfolio_id: `pf_${randInt(1000, 9999)}`,
            category: weightedPick(CATEGORIES), partner_type: partnerType,
            total_sessions: pfTotalSessions, total_hours: pfTotalHours,
            total_days: pfTotalDays, avg_session_gap_hours: pfAvgGap,
            total_writing_time_sec: pfTotalWritingSec,
            total_writing_time_min: Math.round(pfTotalWritingSec / 60), ...common,
          });
        }
      }
      if (chance(0.40)) {
        addDwell("계약 화면"); exitPage = "계약 화면";
        add("contract_signed",       uid, partnerTs +  7 * 86400, { project_id: projectId, partner_type: partnerType, ...common });
        add("draft_submitted",       uid, partnerTs + 14 * 86400, { project_id: projectId, draft_round: 1, category: weightedPick(CATEGORIES), ...common });
        if (chance(0.70)) {
          add("draft_confirmed",     uid, partnerTs + 16 * 86400, { project_id: projectId, draft_round: 1, ...common });
          if (chance(0.80)) {
            addDwell("납품/산출물"); exitPage = "납품/산출물";
            add("deliverable_submitted", uid, partnerTs + 25 * 86400, { project_id: projectId, category: weightedPick(CATEGORIES), ...common });
            if (chance(0.85)) {
              add("deliverable_confirmed", uid, partnerTs + 27 * 86400, { project_id: projectId, ...common });
              add("project_completed",     uid, partnerTs + 28 * 86400, { project_id: projectId, partner_type: partnerType, category: weightedPick(CATEGORIES), ...common });
            }
          }
        }
      }
    }

    // 파트너: 포트폴리오만 등록 — 섹션별 퍼널 (멀티 세션)
    if (isPartner && !didPortfolioReg && pfRegDone < cfg.portfolioRegCount) {
      pfRegDone++;
      didPortfolioReg = true;
      const pfTs2 = baseTs + 500;

      const pfNumSessions2 = weightedPick([
        { value: 1, weight: 15 }, { value: 2, weight: 35 },
        { value: 3, weight: 30 }, { value: 4, weight: 20 },
      ]);
      const pfSecsPerSession2   = Math.ceil(13 / pfNumSessions2);
      let pfCurrentTs2          = pfTs2;
      let pfLastSection2        = 0;
      let pfAbandoned2          = false;
      let pfTotalSessions2      = 0;
      let pfTotalWritingSec2    = 0;
      let pfDraftSaveCount2     = 0;
      const pfGapsHours2: number[] = [];

      for (let sIdx = 0; sIdx < pfNumSessions2 && !pfAbandoned2; sIdx++) {
        pfTotalSessions2++;
        let pfSessionWriteOffset2 = 0;

        // 재방문 세션: 임시저장 열기
        if (sIdx > 0) {
          job.draftOpenedCount += 1;
          const pfLastGap2 = pfGapsHours2[pfGapsHours2.length - 1] ?? 0;
          job.draftReturnHoursSum += pfLastGap2;
          add("portfolio_draft_opened", uid, pfCurrentTs2, {
            partner_type: partnerType, session_number: sIdx + 1,
            sections_completed_so_far: pfLastSection2,
            draft_save_count: pfDraftSaveCount2,
            days_since_last_save: +(pfLastGap2 / 24).toFixed(1),
            hours_since_last_save: pfLastGap2,
            cumulative_writing_sec: pfTotalWritingSec2, ...common,
          });
        }

        add("portfolio_session_started", uid, pfCurrentTs2 + 5, {
          session_number: sIdx + 1, sections_completed_so_far: pfLastSection2,
          partner_type: partnerType, cumulative_writing_sec: pfTotalWritingSec2, ...common,
        });

        const sessionSecs2 = PORTFOLIO_SECTIONS.slice(sIdx * pfSecsPerSession2, (sIdx + 1) * pfSecsPerSession2);

        for (const sec of sessionSecs2) {
          const secDuration2 = [1,2,3].includes(sec.step) ? randInt(60, 180) : randInt(180, 600);

          pfFunnel[sec.step] = (pfFunnel[sec.step] ?? 0) + 1;
          add(`portfolio_section_${sec.id}`, uid, pfCurrentTs2 + pfSessionWriteOffset2 + 10, {
            section: sec.step, section_id: sec.id, partner_type: partnerType,
            session_number: sIdx + 1,
            time_on_section_sec: secDuration2,
            cumulative_writing_sec: pfTotalWritingSec2 + secDuration2,
            ...common,
          });

          pfSessionWriteOffset2 += secDuration2;
          pfTotalWritingSec2    += secDuration2;

          if (sec.step < 13 && !chance(sec.passRate)) {
            pfDropoff[sec.step] = (pfDropoff[sec.step] ?? 0) + 1;
            if (chance(0.80)) {
              pfDraftSaveCount2++;
              add("portfolio_draft_saved", uid, pfCurrentTs2 + pfSessionWriteOffset2 + 5, {
                sections_completed: pfLastSection2, partner_type: partnerType,
                session_number: sIdx + 1, draft_save_count: pfDraftSaveCount2,
                cumulative_writing_sec: pfTotalWritingSec2, ...common,
              });
            }
            add("portfolio_section_abandoned", uid, pfCurrentTs2 + pfSessionWriteOffset2 + 10, {
              section: sec.step, section_id: sec.id, partner_type: partnerType,
              session_number: sIdx + 1, had_draft: pfDraftSaveCount2 > 0,
              time_on_section_sec: secDuration2, cumulative_writing_sec: pfTotalWritingSec2, ...common,
            });
            add("page_exit", uid, pfCurrentTs2 + pfSessionWriteOffset2 + 15, {
              path: "/work/portfolio", exit_section: sec.step, exit_section_id: sec.id, ...common,
            });
            pfLastSection2 = sec.step;
            pfAbandoned2 = true;
            break;
          }
          pfLastSection2 = sec.step;
        }

        if (!pfAbandoned2 && sIdx < pfNumSessions2 - 1) {
          pfDraftSaveCount2++;
          const gapHours2 = randInt(1, 72);
          pfGapsHours2.push(gapHours2);
          add("portfolio_draft_saved", uid, pfCurrentTs2 + pfSessionWriteOffset2 + 10, {
            sections_completed: pfLastSection2, partner_type: partnerType,
            session_number: sIdx + 1, draft_save_count: pfDraftSaveCount2,
            cumulative_writing_sec: pfTotalWritingSec2,
            next_session_gap_hours: gapHours2, ...common,
          });
          pfCurrentTs2 = pfCurrentTs2 + pfSessionWriteOffset2 + gapHours2 * 3600;
        } else if (!pfAbandoned2) {
          pfCurrentTs2 = pfCurrentTs2 + pfSessionWriteOffset2;
        }
      }

      if (pfLastSection2 === 13) {
        const pfTotalHours2 = Math.round((pfCurrentTs2 - pfTs2) / 3600);
        const pfTotalDays2  = +(pfTotalHours2 / 24).toFixed(1);
        const pfAvgGap2     = pfGapsHours2.length > 0
          ? Math.round(pfGapsHours2.reduce((a, b) => a + b, 0) / pfGapsHours2.length) : 0;
        job.portfolioCompletedCount += 1;
        job.pfDaysSum       += pfTotalDays2;
        job.pfSessionsSum   += pfTotalSessions2;
        job.pfWritingMinSum += Math.round(pfTotalWritingSec2 / 60);
        add("portfolio_registered", uid, pfCurrentTs2 + 10, {
          portfolio_id: `pf_${randInt(1000, 9999)}`,
          category: weightedPick(CATEGORIES), partner_type: partnerType,
          total_sessions: pfTotalSessions2, total_hours: pfTotalHours2,
          total_days: pfTotalDays2, avg_session_gap_hours: pfAvgGap2,
          total_writing_time_sec: pfTotalWritingSec2,
          total_writing_time_min: Math.round(pfTotalWritingSec2 / 60), ...common,
        });
      }
    }

    // Referral (8%)
    if (chance(0.08)) {
      add("referral_sent", uid, baseTs + 3 * 86400, {
        method: chance(0.7) ? "copy" : "share", referrer_id: uid, ...common,
      });
    }

    // 이탈 페이지 집계
    job.exitPageBreakdown[exitPage] = (job.exitPageBreakdown[exitPage] ?? 0) + 1;
  }

  // ── 최소 완주 보장 ─────────────────────────────────────────────────
  const minProjComplete = cfg.minProjectCompletions ?? 5;
  const minPfComplete   = cfg.minPortfolioCompletions ?? 5;
  const synTs = Math.floor(Date.now() / 1000) - 86400;
  const synthCommon = { user_type: "advertiser", utm_source: "tvcf", geo: "서울", gender: "male", age_group: "30s" };

  if (job.projectCompletedCount < minProjComplete) {
    const needed = minProjComplete - job.projectCompletedCount;
    for (let k = 0; k < needed; k++) {
      const sUid = `sim_gp_${k}`;
      job.projectCompletedCount += 1;
      job.projectTypeBreakdown["공고"] = (job.projectTypeBreakdown["공고"] ?? 0) + 1;
      job.projDaysSum += 3; job.projSessionsSum += 2; job.projWritingMinSum += 90;
      add("project_submitted", sUid, synTs + k * 3600, {
        project_id: `gp_${k}`, project_type: "공고", category: "영상광고",
        budget_range: "500-1000만", total_sessions: 2, total_hours: 72, total_days: 3,
        avg_session_gap_hours: 36, total_writing_time_sec: 5400, total_writing_time_min: 90,
        ...synthCommon,
      });
    }
  }

  const pfSynthCommon = { user_type: "production", utm_source: "tvcf", geo: "서울", gender: "male", age_group: "30s" };
  if (job.portfolioCompletedCount < minPfComplete) {
    const needed = minPfComplete - job.portfolioCompletedCount;
    for (let k = 0; k < needed; k++) {
      const sUid = `sim_gpf_${k}`;
      job.portfolioCompletedCount += 1;
      job.pfDaysSum += 5; job.pfSessionsSum += 3; job.pfWritingMinSum += 120;
      add("portfolio_registered", sUid, synTs + k * 3600, {
        portfolio_id: `gpf_${k}`, category: "영상광고", partner_type: "production",
        total_sessions: 3, total_hours: 120, total_days: 5, avg_session_gap_hours: 40,
        total_writing_time_sec: 7200, total_writing_time_min: 120,
        ...pfSynthCommon,
      });
    }
  }

  // ── GA4 Measurement Protocol 전송 (실시간 개요 반영) ──
  job.status = "sending";
  job.message = "GA4 전송 중...";
  const ga4Users = Array.from(ga4Map.values()).filter((u) => u.events.length > 0);
  let ga4Done = 0;
  for (const userEntry of ga4Users) {
    const err = await sendGa4UserBatch(userEntry);
    if (err) job.errors.push(`GA4 ${userEntry.userId}: ${err}`);
    ga4Done += 1;
    job.progress = Math.round((ga4Done / ga4Users.length) * 50); // 0~50%
    job.message = `GA4 전송 중... (${ga4Done}/${ga4Users.length} 유저)`;
    // GA4 rate limit 방지: 10명마다 잠깐 대기
    if (ga4Done % 10 === 0) await new Promise((r) => setTimeout(r, 30));
  }

  // ── Mixpanel 전송 ─────────────────────────────────
  job.totalEvents = events.length;
  job.totalBatches = Math.ceil(events.length / BATCH_SIZE);
  job.message = "Mixpanel 전송 중...";

  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    const err = await sendBatch(batch);
    if (err) job.errors.push(`MP 배치 ${job.batchesSent + 1}: ${err}`);
    job.batchesSent += 1;
    job.progress = 50 + Math.round((job.batchesSent / job.totalBatches) * 50); // 50~100%
    job.message = `Mixpanel 전송 중... (${job.batchesSent}/${job.totalBatches} 배치)`;
    await new Promise((r) => setTimeout(r, 15));
  }

  // ── Mixpanel People 프로필 전송 ───────────────────────
  job.message = "Mixpanel People 프로필 등록 중...";
  await flushMixpanelPeople();

  job.status = "done";
  job.progress = 100;
  job.message = "완료!";
  job.completedAt = Date.now();
}
