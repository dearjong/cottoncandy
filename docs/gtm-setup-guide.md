# ADMarket GTM 이벤트 재생성 가이드

> 버전: v1.0 | 작성일: 2026-04-13  
> 대상: 기획자  
> GTM 컨테이너 ID: `GTM-T2QRR8N7` | GA4 측정 ID: `G-MG1WSR89E1`

---

## 개요: 현재 이벤트 흐름

ADMarket의 모든 이벤트는 `publishAnalytics()` 함수 한 곳에서 관리됩니다.  
이 함수가 호출되면 **자동으로 GTM dataLayer에 push**됩니다.

```
사용자 행동
  → publishAnalytics("이벤트명", { 파라미터들 })
    → window.dataLayer.push({ event: "이벤트명", ...파라미터들 })  ← GTM이 감지
    → gtag("event", "이벤트명", { 파라미터들 })                   ← GA4 직접 전송
    → mixpanel.track("이벤트명", { 파라미터들 })                   ← Mixpanel 전송
```

GTM 태그를 새로 만들면 dataLayer에 쌓이는 모든 이벤트를 GTM 경유로 GA4에 보낼 수 있습니다.

---

## STEP 1. GTM 컨테이너 접속 확인

1. [tagmanager.google.com](https://tagmanager.google.com) 접속
2. 컨테이너 `GTM-T2QRR8N7` 선택
3. 좌측 메뉴에서 **변수 → 트리거 → 태그** 순서로 설정

> **현재 코드 상태**: `client/index.html`에 GTM 스니펫이 이미 삽입되어 있습니다.  
> 별도 코드 수정 없이 GTM 콘솔에서만 작업합니다.

---

## STEP 2. 기본 변수(Variables) 설정

이벤트 파라미터를 GTM에서 읽어오려면 **데이터 영역 변수(Data Layer Variable)**를 만들어야 합니다.

### 2-1. 필수 변수 목록

GTM 콘솔 → **변수** → **사용자 정의 변수** → 새로 만들기

| 변수명 (GTM) | 변수 유형 | 데이터 영역 변수 이름 | 용도 |
|------------|---------|-----------------|------|
| `DLV - event` | 데이터 영역 변수 | `event` | 이벤트명 |
| `DLV - user_type` | 데이터 영역 변수 | `user_type` | 의뢰사/파트너사/guest |
| `DLV - step` | 데이터 영역 변수 | `step` | 퍼널 단계 번호 |
| `DLV - step_name` | 데이터 영역 변수 | `step_name` | 퍼널 단계 이름 |
| `DLV - path` | 데이터 영역 변수 | `path` | 페이지 경로 |
| `DLV - project_type` | 데이터 영역 변수 | `project_type` | 공고/1:1/컨설팅 |
| `DLV - is_first_time` | 데이터 영역 변수 | `is_first_time` | 첫 전환 여부 |
| `DLV - partner_type` | 데이터 영역 변수 | `partner_type` | 제작사/대행사 |
| `DLV - budget_range` | 데이터 영역 변수 | `budget_range` | 예산 구간 |
| `DLV - contract_value_krw` | 데이터 영역 변수 | `contract_value_krw` | 계약 금액(원) |
| `DLV - channel` | 데이터 영역 변수 | `channel` | 유입 채널 |
| `DLV - utm_source` | 데이터 영역 변수 | `utm_source` | UTM 소스 |
| `DLV - utm_medium` | 데이터 영역 변수 | `utm_medium` | UTM 매체 |
| `DLV - utm_campaign` | 데이터 영역 변수 | `utm_campaign` | UTM 캠페인 |
| `DLV - wizard_step` | 데이터 영역 변수 | `wizard_step` | 프로젝트 등록 단계 |
| `DLV - depth_pct` | 데이터 영역 변수 | `depth_pct` | 스크롤 깊이(%) |
| `DLV - duration_sec` | 데이터 영역 변수 | `duration_sec` | 체류시간(초) |

### 2-2. 설정 방법 (예시: user_type)

```
유형: 데이터 영역 변수
데이터 영역 변수 이름: user_type
데이터 영역 버전: 버전 2
```

---

## STEP 3. 트리거(Triggers) 설정

### 3-1. GA4 설정 태그용 — All Pages 트리거

이미 기본 제공되는 **All Pages** 트리거를 사용합니다.

### 3-2. 이벤트별 맞춤 이벤트 트리거

GTM 콘솔 → **트리거** → 새로 만들기 → **맞춤 이벤트**

#### 전환 이벤트 트리거 (각각 개별 생성)

| 트리거명 | 이벤트 이름 | 용도 |
|---------|-----------|------|
| `CE - signup_complete` | `signup_complete` | 회원가입 완료 |
| `CE - project_submitted` | `project_submitted` | 프로젝트 최종 등록 |
| `CE - partner_applied` | `partner_applied` | 파트너 공고 지원 |
| `CE - contract_signed` | `contract_signed` | 계약 체결 |
| `CE - review_submitted` | `review_submitted` | 리뷰 등록 |
| `CE - activation_achieved` | `activation_achieved` | 핵심 행동 첫 달성 |
| `CE - consulting_inquiry_submitted` | `consulting_inquiry_submitted` | 컨설팅 문의 |

#### 퍼널 추적 트리거 (그룹 트리거)

| 트리거명 | 이벤트 이름 | 설명 |
|---------|-----------|------|
| `CE - signup_funnel` | `signup_funnel` | 가입 단계별 추적 |
| `CE - site_visit` | `site_visit` | 세션 최초 방문 |
| `CE - step_enter (All)` | `step_.*` (정규식 ✅ 체크) | 프로젝트 등록 전 단계 |
| `CE - participation_events` | `participation_.*` (정규식 ✅) | 참여현황 전 이벤트 |

#### 행동 추적 트리거

| 트리거명 | 이벤트 이름 |
|---------|-----------|
| `CE - time_on_page` | `time_on_page` |
| `CE - scroll_depth` | `scroll_depth` |
| `CE - page_exit` | `page_exit` |
| `CE - home_click` | `home_click` |

---

## STEP 4. 태그(Tags) 설정

### 4-1. GA4 구성 태그 (기본 태그 — 가장 먼저 생성)

GTM 콘솔 → **태그** → 새로 만들기 → **Google 애널리틱스: GA4 구성**

```
태그 유형: Google 애널리틱스: GA4 구성
측정 ID: G-MG1WSR89E1
트리거: All Pages
```

> 이 태그가 있어야 아래 GA4 이벤트 태그들이 작동합니다.

---

### 4-2. 회원가입 퍼널 태그

#### 태그: signup_funnel (단계별 추적)

```
태그 유형: Google 애널리틱스: GA4 이벤트
구성 태그: (위 GA4 구성 태그 선택)
이벤트 이름: signup_funnel
이벤트 파라미터:
  step       → {{DLV - step}}
  step_name  → {{DLV - step_name}}
  path       → {{DLV - path}}
  user_type  → {{DLV - user_type}}
트리거: CE - signup_funnel
```

#### 태그: signup_complete (전환)

```
태그 유형: Google 애널리틱스: GA4 이벤트
이벤트 이름: signup_complete
이벤트 파라미터:
  user_type  → {{DLV - user_type}}
  channel    → {{DLV - channel}}
트리거: CE - signup_complete
```

---

### 4-3. 프로젝트 등록 퍼널 태그

#### 태그: step_enter (18단계 통합)

```
태그 유형: Google 애널리틱스: GA4 이벤트
이벤트 이름: {{DLV - event}}           ← 변수로 이벤트명 자동 매핑
이벤트 파라미터:
  wizard_step  → {{DLV - wizard_step}}
  path         → {{DLV - path}}
  user_type    → {{DLV - user_type}}
  project_type → {{DLV - project_type}}
트리거: CE - step_enter (All)
```

> 이 태그 하나로 `step_1_partner_selection` ~ `step_18_project_details` 전 단계를 커버합니다.

#### 태그: project_submitted (전환 — 핵심)

```
태그 유형: Google 애널리틱스: GA4 이벤트
이벤트 이름: project_submitted
이벤트 파라미터:
  project_type   → {{DLV - project_type}}
  budget_range   → {{DLV - budget_range}}
  partner_type   → {{DLV - partner_type}}
  is_first_time  → {{DLV - is_first_time}}
  user_type      → {{DLV - user_type}}
트리거: CE - project_submitted
```

---

### 4-4. 파트너사 퍼널 태그

#### 태그: partner_applied (전환)

```
태그 유형: Google 애널리틱스: GA4 이벤트
이벤트 이름: partner_applied
이벤트 파라미터:
  project_type   → {{DLV - project_type}}
  partner_type   → {{DLV - partner_type}}
  is_first_time  → {{DLV - is_first_time}}
  user_type      → {{DLV - user_type}}
트리거: CE - partner_applied
```

---

### 4-5. 계약 태그

#### 태그: contract_signed (전환 + 매출 추적)

```
태그 유형: Google 애널리틱스: GA4 이벤트
이벤트 이름: contract_signed
이벤트 파라미터:
  budget_range         → {{DLV - budget_range}}
  contract_value_krw   → {{DLV - contract_value_krw}}
  value                → {{DLV - contract_value_krw}}   ← GA4 매출 파라미터
  currency             → KRW
  user_type            → {{DLV - user_type}}
트리거: CE - contract_signed
```

> `value` + `currency` 파라미터를 설정하면 GA4 수익 보고서에서 계약 금액을 합산해서 볼 수 있습니다.

---

### 4-6. 행동 분석 태그

#### 태그: activation_achieved

```
태그 유형: Google 애널리틱스: GA4 이벤트
이벤트 이름: activation_achieved
이벤트 파라미터:
  trigger_event  → {{DLV - event}}
  user_type      → {{DLV - user_type}}
트리거: CE - activation_achieved
```

#### 태그: scroll_depth

```
태그 유형: Google 애널리틱스: GA4 이벤트
이벤트 이름: scroll_depth
이벤트 파라미터:
  depth_pct  → {{DLV - depth_pct}}
  path       → {{DLV - path}}
트리거: CE - scroll_depth
```

#### 태그: time_on_page

```
태그 유형: Google 애널리틱스: GA4 이벤트
이벤트 이름: time_on_page
이벤트 파라미터:
  duration_sec    → {{DLV - duration_sec}}
  path            → {{DLV - path}}
트리거: CE - time_on_page
```

#### 태그: site_visit (유입 분석)

```
태그 유형: Google 애널리틱스: GA4 이벤트
이벤트 이름: site_visit
이벤트 파라미터:
  path        → {{DLV - path}}
  channel     → {{DLV - channel}}
  utm_source  → {{DLV - utm_source}}
  utm_medium  → {{DLV - utm_medium}}
  utm_campaign → {{DLV - utm_campaign}}
트리거: CE - site_visit
```

---

### 4-7. 참여현황 태그 (통합)

```
태그 유형: Google 애널리틱스: GA4 이벤트
이벤트 이름: {{DLV - event}}     ← 변수로 이벤트명 자동 매핑
이벤트 파라미터:
  user_type  → {{DLV - user_type}}
트리거: CE - participation_events
```

> `participation_invite_toggled`, `participation_ot_confirmed` 등 6개 이벤트를 태그 1개로 처리합니다.

---

### 4-8. 리뷰 태그

```
태그 유형: Google 애널리틱스: GA4 이벤트
이벤트 이름: review_submitted
이벤트 파라미터:
  user_type  → {{DLV - user_type}}
트리거: CE - review_submitted
```

---

## STEP 5. GA4 전환 이벤트 마킹

GTM 게시 후 **Google Analytics 4 콘솔**에서 전환 이벤트로 마킹합니다.

GA4 → 관리(⚙) → 이벤트 → 이벤트 목록 → 각 이벤트 옆 "전환으로 표시" 토글 ON

| 이벤트명 | 전환 의미 | 우선순위 |
|---------|---------|---------|
| `signup_complete` | 회원가입 완료 | ★★★ |
| `project_submitted` | 프로젝트 등록 완료 (의뢰사 핵심 전환) | ★★★ |
| `partner_applied` | 공고 지원 완료 (파트너사 핵심 전환) | ★★★ |
| `contract_signed` | 계약 체결 (매출 발생 시점) | ★★★ |
| `activation_achieved` | 핵심 행동 첫 달성 | ★★★ |
| `consulting_inquiry_submitted` | 컨설팅 문의 접수 | ★★ |
| `review_submitted` | 리뷰 등록 (프로젝트 완료) | ★★ |

---

## STEP 6. GTM 미리보기로 검증

### 6-1. 미리보기 실행

GTM 콘솔 상단 → **미리보기** 클릭 → ADMarket 사이트 URL 입력 → **연결**

### 6-2. 확인 방법

1. 사이트를 실제로 조작 (버튼 클릭, 페이지 이동 등)
2. GTM 미리보기 패널에서 **이벤트 목록** 확인
3. 각 이벤트 클릭 → **태그** 탭에서 `✅ 실행됨` 확인
4. **데이터 영역** 탭에서 파라미터 값이 올바른지 확인

### 6-3. 주요 검증 시나리오

| 시나리오 | 확인할 이벤트 | 확인할 파라미터 |
|---------|------------|--------------|
| 사이트 첫 방문 | `site_visit` | `channel`, `path` |
| /signup 진입 | `signup_funnel` | `step: 1`, `step_name: "account"` |
| /signup/email 진입 | `signup_funnel` | `step: 2`, `step_name: "email"` |
| 프로젝트 등록 마법사 진입 | `step_1_partner_selection` | `wizard_step: 1` |
| 예산 단계 진입 | `step_8_budget` | `wizard_step: 8` |
| 스크롤 50% 지점 | `scroll_depth` | `depth_pct: 50` |

---

## STEP 7. GTM 컨테이너 게시

1. GTM 콘솔 → 우측 상단 **제출** 클릭
2. 버전 이름: `v1.0 - ADMarket 초기 이벤트 세팅`
3. **게시** 클릭
4. GA4 DebugView(GA4 → 관리 → DebugView)에서 실시간 이벤트 확인

---

## 부록 A. 이벤트 전체 목록

### 전환 이벤트 (7개)

| 이벤트명 | 발생 시점 |
|---------|---------|
| `signup_complete` | 이메일 인증 완료 |
| `project_submitted` | 프로젝트 최종 등록 |
| `partner_applied` | 공고 지원 |
| `contract_signed` | 계약 등록 완료 |
| `activation_achieved` | 핵심 행동 첫 달성 |
| `consulting_inquiry_submitted` | 컨설팅 문의 접수 |
| `review_submitted` | 리뷰 등록 완료 |

### 퍼널 이벤트 (25개)

| 이벤트명 | 발생 시점 |
|---------|---------|
| `site_visit` | 세션 최초 1회 방문 |
| `signup_funnel` | 가입 단계(step 1~5) 진입 |
| `step_1_partner_selection` ~ `step_18_project_details` | 프로젝트 등록 마법사 각 단계 |
| `project_draft_saved` | 임시저장 |
| `project_draft_opened` | 임시저장 불러오기 |

### 행동 이벤트 (10개)

| 이벤트명 | 발생 시점 |
|---------|---------|
| `time_on_page` | 페이지 이동 시 이전 페이지 체류시간 전송 |
| `scroll_depth` | 25 / 50 / 75 / 100% 스크롤 도달 시 |
| `page_exit` | 브라우저 닫기 / 탭 이탈 |
| `home_click` | 홈 화면 UI 요소 클릭 |
| `partner_searched` | 파트너 검색 실행 |
| `project_viewed` | 공고 상세 조회 |
| `agency_favorited` | 대행사/제작사 즐겨찾기 |
| `participation_invite_toggled` ~ `participation_final_selected` | 참여현황 관리 |
| `user_login` | 로그인 완료 |
| `contract_saved` / `contract_request_sent` / `contract_cancelled` | 계약 중간 행동 |

---

## 부록 B. 공통 파라미터 (모든 이벤트에 자동 첨부)

`publishAnalytics()` 호출 시 아래 파라미터가 **자동으로** 모든 이벤트에 추가됩니다.

| 파라미터 | 설명 | 예시값 |
|---------|------|--------|
| `utm_source` | 유입 소스 | `google`, `naver` |
| `utm_medium` | 유입 매체 | `cpc`, `organic` |
| `utm_campaign` | 캠페인명 | `spring_2026` |
| `referrer` | 이전 URL | `https://google.com` |
| `referrer_domain` | 이전 도메인 | `google.com` |
| `channel` | 유입 채널 자동 분류 | `paid`, `organic`, `social`, `direct` |
| `landing_path` | 랜딩 페이지 경로 | `/` |

---

## 부록 C. 현재 코드 구조 요약

```
client/src/lib/analytics.ts
  └── publishAnalytics()          ← 모든 이벤트의 단일 진입점
        ├── window.dataLayer.push  ← GTM으로 전달
        ├── gtag("event", ...)     ← GA4 직접 전달 (이중 안전장치)
        └── mixpanel.track()       ← Mixpanel 전달

client/src/App.tsx
  └── <FunnelRouteListener />    ← URL 변경 감지 → 자동 이벤트 발송
        ├── site_visit (세션 최초 1회)
        ├── signup_funnel (단계별)
        ├── step_{N}_{화면명} (프로젝트 등록 18단계)
        ├── time_on_page (페이지 이탈 시)
        └── scroll_depth (25/50/75/100%)
```

**설계 포인트**: 코드에서 이벤트명과 파라미터를 직접 관리하기 때문에  
GTM에서 이벤트명 오타 없이 `{{DLV - event}}` 변수로 자동 매핑 가능.  
새 이벤트 추가 시 코드만 수정하면 GTM 태그 추가 없이 바로 수집됩니다.
