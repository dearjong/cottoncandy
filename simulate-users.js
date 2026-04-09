#!/usr/bin/env node
// ADMarket 1000명 가상 유저 시뮬레이션
// GA4 Measurement Protocol + Mixpanel HTTP API
// 최근 3일치 데이터 분산 전송 (GA4 72시간 제한)

const GA4_MEASUREMENT_ID = "G-MG1WSR89E1";
const GA4_API_SECRET = "yEU6R3P9SWe5z9_Foa7XWA";
const MIXPANEL_TOKEN = "B32D8265A148455CB07F704BE7A648AA";

const GA4_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;
const MIXPANEL_ENDPOINT = "https://api.mixpanel.com/track";

const TOTAL_USERS = 1000;
const NOW = Date.now();
const MAX_HOURS_BACK = 69; // GA4 72시간 제한 안전 마진

// ── 유틸 ──────────────────────────────────────────────
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function chance(p) { return Math.random() < p; }

// ── 위치 데이터 (가중치 배열 — 많이 넣을수록 비율 높음) ──────────
const LOCATIONS = [
  // 서울 (35%)
  ...Array(12).fill({ $country_code: "KR", $region: "Seoul", $city: "Seoul", geo_region: "서울" }),
  // 경기도 (20%)
  { $country_code: "KR", $region: "Gyeonggi-do", $city: "Suwon", geo_region: "경기도" },
  { $country_code: "KR", $region: "Gyeonggi-do", $city: "Seongnam", geo_region: "경기도" },
  { $country_code: "KR", $region: "Gyeonggi-do", $city: "Goyang", geo_region: "경기도" },
  { $country_code: "KR", $region: "Gyeonggi-do", $city: "Yongin", geo_region: "경기도" },
  { $country_code: "KR", $region: "Gyeonggi-do", $city: "Bucheon", geo_region: "경기도" },
  { $country_code: "KR", $region: "Gyeonggi-do", $city: "Anyang", geo_region: "경기도" },
  // 부산 (8%)
  { $country_code: "KR", $region: "Busan", $city: "Busan", geo_region: "부산" },
  { $country_code: "KR", $region: "Busan", $city: "Busan", geo_region: "부산" },
  // 인천 (5%)
  { $country_code: "KR", $region: "Incheon", $city: "Incheon", geo_region: "인천" },
  // 대구 (4%)
  { $country_code: "KR", $region: "Daegu", $city: "Daegu", geo_region: "대구" },
  // 대전 (3%)
  { $country_code: "KR", $region: "Daejeon", $city: "Daejeon", geo_region: "대전" },
  // 광주 (3%)
  { $country_code: "KR", $region: "Gwangju", $city: "Gwangju", geo_region: "광주" },
  // 기타 지방 (7%)
  { $country_code: "KR", $region: "Gyeongsangnam-do", $city: "Changwon", geo_region: "경남" },
  { $country_code: "KR", $region: "Gyeongsangbuk-do", $city: "Pohang", geo_region: "경북" },
  { $country_code: "KR", $region: "Chungcheongnam-do", $city: "Cheonan", geo_region: "충남" },
  { $country_code: "KR", $region: "Jeollabuk-do", $city: "Jeonju", geo_region: "전북" },
  { $country_code: "KR", $region: "Jeju", $city: "Jeju", geo_region: "제주" },
  // 해외 (5%)
  { $country_code: "US", $region: "California", $city: "Los Angeles", geo_region: "해외" },
  { $country_code: "JP", $region: "Tokyo", $city: "Tokyo", geo_region: "해외" },
  { $country_code: "SG", $region: "Singapore", $city: "Singapore", geo_region: "해외" },
  { $country_code: "AU", $region: "New South Wales", $city: "Sydney", geo_region: "해외" },
  { $country_code: "VN", $region: "Hanoi", $city: "Hanoi", geo_region: "해외" },
];

// 비즈니스 시간대 가중치 반영 타임스탬프
function genTimestamp(baseMs = 0) {
  const hoursBack = rand(0, MAX_HOURS_BACK);
  const hourOfDay = pick([8,9,9,10,10,10,11,11,12,13,14,14,15,15,15,16,16,17,18,19,20,21]);
  const minuteMs = randInt(0, 59) * 60000;
  const anchorMs = NOW - hoursBack * 3600000;
  const anchorMidnight = anchorMs - (new Date(anchorMs).getHours() * 3600000 + new Date(anchorMs).getMinutes() * 60000);
  const ts = anchorMidnight + hourOfDay * 3600000 + minuteMs + baseMs;
  // 범위 초과 방지
  return Math.max(NOW - MAX_HOURS_BACK * 3600000, Math.min(ts, NOW - 1000));
}

function genSessionId() { return Math.floor(Math.random() * 1e12).toString(); }
function genClientId() { return `${Math.random().toString(36).slice(2,10)}.${randInt(1e8,9e8)}`; }
function genUserId(i) { return `sim_${i.toString().padStart(4,"0")}_${Math.random().toString(36).slice(2,7)}`; }

// ── 이벤트 전송 ─────────────────────────────────────
async function ga4(clientId, userId, eventName, params, tsMs) {
  const body = {
    client_id: clientId,
    user_id: userId,
    timestamp_micros: (tsMs * 1000).toString(),
    events: [{
      name: eventName,
      params: {
        session_id: genSessionId(),
        engagement_time_msec: randInt(800, 20000),
        ...params,
      },
    }],
  };
  await fetch(GA4_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

async function mixpanel(userId, eventName, props, tsMs) {
  const body = [{
    event: eventName,
    properties: {
      token: MIXPANEL_TOKEN,
      distinct_id: userId,
      time: Math.floor(tsMs / 1000),
      $insert_id: `${userId}_${eventName}_${tsMs}`,
      ...props,
    },
  }];
  await fetch(MIXPANEL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

async function emit(clientId, userId, name, params, ts) {
  await Promise.all([
    ga4(clientId, userId, name, params, ts),
    mixpanel(userId, name, params, ts),
  ]);
}

// Mixpanel People 프로필 등록 (가입 완료 시 호출)
async function setMixpanelProfile(userId, profileProps) {
  const body = [{
    $token: MIXPANEL_TOKEN,
    $distinct_id: userId,
    $set: profileProps,
  }];
  await fetch("https://api.mixpanel.com/engage#profile-set", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

// ── 유저 행동 시뮬레이션 ─────────────────────────────
// 광고주 50% / 대행사 30% / 제작사 20%
const USER_TYPES = [
  "advertiser","advertiser","advertiser","advertiser","advertiser",
  "agency","agency","agency",
  "production","production",
];
const GENDERS   = ["male","male","male","female","female"]; // 남 60% / 여 40%
const AGE_GROUPS = ["20s","30s","30s","30s","40s","40s","50s"]; // 30-40대 중심
const CATEGORIES = ["영상광고","브랜드디자인","사진촬영","SNS마케팅","PPT디자인","웹개발"];
const SEARCH_TERMS = ["영상","브랜드","광고","디자인","사진","마케팅","촬영"];

async function simulateUser(i) {
  const userId = genUserId(i);
  const clientId = genClientId();
  const userType = pick(USER_TYPES);
  const gender   = pick(GENDERS);
  const ageGroup = pick(AGE_GROUPS);
  const location = pick(LOCATIONS);
  const sessionStart = genTimestamp();
  let t = sessionStart;
  const next = (minMs = 2000, maxMs = 25000) => { t += randInt(minMs, maxMs); return t; };
  const base = { user_type: userType, gender, age_group: ageGroup, ...location };

  // 1. 홈 방문 (100%)
  await emit(clientId, userId, "page_view", { page_location: "/", page_title: "홈", ...base }, t);

  // 2. 홈 클릭 (72%)
  if (chance(0.72)) {
    const elements = ["category","category","feature_card","cta","partner","faq","flow_step"];
    const element = pick(elements);
    await emit(clientId, userId, "home_click", { element, label: element, destination: "/", ...base }, next());
  }

  // 3. 검색 (28%)
  if (chance(0.28)) {
    await emit(clientId, userId, "search_performed", { search_term: pick(SEARCH_TERMS), results_count: randInt(5,30), ...base }, next());
  }

  // 4. 카테고리 탐색 (35%)
  if (chance(0.35)) {
    await emit(clientId, userId, "category_viewed", { category: pick(CATEGORIES), ...base }, next());
  }

  // 5. 회원가입 플로우 (22%) — 실제 앱 이벤트명 사용
  if (chance(0.22)) {
    // step 1: 기본정보 입력 페이지 진입
    await emit(clientId, userId, "signup_started", { method: "email", ...base }, next());
    await emit(clientId, userId, "signup_funnel", { step: 1, step_name: "account", path: "/signup", ...base }, next(1000, 5000));

    if (chance(0.88)) { // 이메일 인증 (88%)
      await emit(clientId, userId, "signup_funnel", { step: 2, step_name: "email", path: "/signup/email", ...base }, next());

      if (chance(0.82)) { // 전화 인증 (82%)
        await emit(clientId, userId, "signup_funnel", { step: 3, step_name: "phone", path: "/signup/phone", ...base }, next());

        if (chance(0.78)) { // 계정 유형 선택 (78%)
          const accountType = chance(0.68) ? "personal" : "corporate";
          await emit(clientId, userId, "signup_funnel", { step: 4, step_name: "account_type", path: "/signup/account-type", ...base }, next());
          await emit(clientId, userId, "signup_complete", { account_type: accountType, ...base }, next(1000, 3000));

          // Mixpanel People 프로필 등록 (가입 완료 시)
          await setMixpanelProfile(userId, {
            gender,
            age_group: ageGroup,
            user_type: userType,
            account_type: accountType,
            $city: location.$city,
            $region: location.$region,
            $country_code: location.$country_code,
            geo_region: location.geo_region,
            signup_date: new Date(t).toISOString().slice(0, 10),
          });

          if (accountType === "corporate" && chance(0.62)) { // 기업정보 등록 (62% of corporate)
            await emit(clientId, userId, "signup_funnel", { step: 5, step_name: "job_info", path: "/signup/job-info", ...base }, next());
            const companySizes = ["solo","small","medium","large"];
            await emit(clientId, userId, "job_info_submitted", {
              company_size: pick(companySizes),
              industry: pick(CATEGORIES),
              ...base,
            }, next());
          }

          if (chance(0.38)) { // 핵심행동 달성
            await emit(clientId, userId, "activation_achieved", {
              trigger_event: "signup_complete",
              user_type: userType,
            }, next(1000, 5000));
          }
        }
      }
    }
  }

  // 6. 프로젝트 등록 시작 (12%)
  if (chance(0.12)) {
    await emit(clientId, userId, "page_view", { page_location: "/create-project/step1", page_title: "프로젝트등록", ...base }, next());

    const optionWeights = ["public","public","public","private","private","consulting"];
    const selectedOption = pick(optionWeights);
    const destination = selectedOption === "consulting"
      ? "/create-project/consulting-inquiry"
      : "/create-project/step2";

    await emit(clientId, userId, "step1_cta_click", { selected_option: selectedOption, destination, ...base }, next());

    if (chance(0.68)) { // 프로젝트 제출 (68%)
      await emit(clientId, userId, "project_submitted", {
        project_type: selectedOption,
        is_first_time: chance(0.75),
        category: pick(CATEGORIES),
        ...base,
      }, next());
    }
  }

  // 7. 파트너 신청 (파트너 유저 중 22%)
  if (userType === "partner" && chance(0.22)) {
    await emit(clientId, userId, "partner_applied", {
      partner_name: `파트너사_${randInt(1, 80)}`,
      project_type: pick(["public","private"]),
      ...base,
    }, next());
  }

  // 8. 컨설팅 신청 (3%)
  if (chance(0.03)) {
    await emit(clientId, userId, "consulting_requested", {
      consultant_id: `consul_${randInt(1, 20)}`,
      ...base,
    }, next());
  }
}

// ── 메인 ──────────────────────────────────────────────
async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║  ADMarket 1000명 가상 유저 시뮬레이션   ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log(`📊 GA4: ${GA4_MEASUREMENT_ID}`);
  console.log(`📊 Mixpanel: ${MIXPANEL_TOKEN}`);
  console.log(`⏱️  최근 ${MAX_HOURS_BACK}시간 데이터 분산\n`);

  const BATCH = 20;
  let done = 0;

  for (let i = 0; i < TOTAL_USERS; i += BATCH) {
    const batch = [];
    for (let j = i; j < Math.min(i + BATCH, TOTAL_USERS); j++) {
      batch.push(simulateUser(j));
    }
    await Promise.all(batch);
    done += batch.length;
    const pct = Math.round((done / TOTAL_USERS) * 100);
    const bar = "█".repeat(Math.floor(pct / 5)) + "░".repeat(20 - Math.floor(pct / 5));
    process.stdout.write(`\r[${bar}] ${pct}% (${done}/${TOTAL_USERS}명)`);

    // API 레이트 리밋 방지
    await new Promise(r => setTimeout(r, 150));
  }

  console.log("\n\n✅ 시뮬레이션 완료!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📈 Mixpanel → Events 탭에서 즉시 확인 가능");
  console.log("📈 GA4 → 최근 활동 탭 (수십분~수시간 지연)");
  console.log("📈 GA4 DebugView는 실시간 확인 불가 (서버 전송)");
}

main().catch(console.error);
