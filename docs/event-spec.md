# ADMarket Analytics 이벤트 명세서

> **최종 업데이트**: 2026-04-10  
> **전송 플랫폼**: GA4 (키 이벤트만) + Mixpanel (전체)  
> **전송 순서**: GA4 먼저(0~50%) → Mixpanel 이후(50~100%)

---

## 공통 파라미터 (모든 이벤트에 포함)

| 파라미터 | 타입 | 예시 | 설명 |
|---|---|---|---|
| `user_type` | string | `advertiser` / `agency` / `production` | 유저 유형 |
| `gender` | string | `male` / `female` | 성별 |
| `age_group` | string | `20s` / `30s` / `40s` / `50s` | 연령대 |
| `utm_source` | string | `google` / `tvcf` / `kakao` | 유입 소스 |
| `utm_medium` | string | `cpc` / `social` / `email` | 유입 매체 |
| `utm_campaign` | string | `brand_awareness` | 캠페인명 |
| `geo_region` | string | `서울` / `경기도` / `부산` | 지역 |
| `geo_country` | string | `KR` / `US` | 국가 |

---

## 1. 획득 (Acquisition)

### `site_visit` ⭐ GA4 키 이벤트
- **발생 시점**: 첫 페이지 방문 (세션 기준)
- **파라미터**: `path`, `is_new_visitor` (bool)

### `sso_login` ⭐ GA4 키 이벤트
- **발생 시점**: TVCF 연동 자동 로그인
- **파라미터**: `source` (`tvcf.co.kr`), `method` (`sso`)

### `login` ⭐ GA4 키 이벤트
- **발생 시점**: 이메일/비밀번호 로그인
- **파라미터**: `method` (`email`), `source` (`direct`)

### `direct_entry`
- **발생 시점**: 북마크/직접 URL 입력 방문 (인증 40%, 미인증 20% 확률)
- **파라미터**: `path`, `page_label`, `is_authenticated` (bool), `referrer` (`direct`)

---

## 2. 회원가입 퍼널

### `signup_started` ⭐ GA4 키 이벤트
- **발생 시점**: `/signup` 첫 진입
- **파라미터**: `method` (`email`)

### `signup_funnel`
- **발생 시점**: 가입 단계 진입마다
- **파라미터**: `step` (1~5), `step_name`, `path`

| step | step_name | path |
|---|---|---|
| 1 | `account` | `/signup` |
| 2 | `email` | `/signup/email` |
| 3 | `phone` | `/signup/phone` |
| 4 | `account_type` | `/signup/account-type` |
| 5 | `job_info` | `/signup/job-info` (기업 가입 시) |

### `signup_complete` ⭐ GA4 키 이벤트
- **발생 시점**: 전화번호 인증 완료 (`/signup/phone`)

---

## 3. 프로젝트 등록 퍼널 (18단계 멀티 세션)

> 광고주(`advertiser`)만 해당. 1~3세션으로 분산 등록 가능.

### `step1_cta_click` ⭐ GA4 키 이벤트
- **발생 시점**: 프로젝트 등록 시작 버튼 클릭
- **파라미터**: `selected_option` (`public` / `private`)

### `step_N_SCREEN_NAME` (예: `step_8_budget`)
- **발생 시점**: 각 단계 화면 진입
- **파라미터**: `step` (1~18), `screen`, `project_type`, `session_number`, `time_on_step_sec`, `cumulative_writing_sec`

| step | screen | 화면명 | 통과율 |
|---|---|---|---|
| 1 | `partner_selection` | 파트너 찾기 방식 | 85% |
| 2 | `partner_type` | 파트너 유형 | 90% |
| 3 | `project_name` | 프로젝트명 | 88% |
| 4 | `advertising_objective` | 광고 목적 | 85% |
| 5 | `production_technique` | 제작 기법 | 87% |
| 6 | `media_channel` | 노출 매체 | 88% |
| 7 | `main_client` | 주요 고객 | 90% |
| 8 | `budget` | 예산 | **73%** (최대 이탈) |
| 9 | `payment_terms` | 대금 지급 | 88% |
| 10 | `schedule` | 일정 | 87% |
| 11 | `product_info` | 제품정보 | 86% |
| 12 | `contact_person` | 담당자정보 | 90% |
| 13 | `excluded_competitors` | 경쟁사 제외 | 92% |
| 14 | `participant_conditions` | 참여기업 조건 | 90% |
| 15 | `required_files` | 제출자료 | 88% |
| 16 | `company_info` | 기업정보 | 85% |
| 17 | `additional_description` | 상세설명 | 88% |
| 18 | `project_details` | 최종 확인 & 등록 | 100% |

### `project_session_started`
- **발생 시점**: 각 세션 시작 (세션 1~3)
- **파라미터**: `session_number`, `steps_completed_so_far`, `project_type`, `cumulative_writing_sec`

### `project_draft_saved` ⭐ GA4 키 이벤트
- **발생 시점**: ① 세션 종료 시 (다음 세션 위해), ② 이탈 직전 (80% 확률)
- **파라미터**: `step`, `screen`, `project_type`, `session_number`, `draft_save_count`, `steps_completed`, `cumulative_writing_sec`, `next_session_gap_hours` (①만)

### `project_draft_opened` ⭐ GA4 키 이벤트
- **발생 시점**: 2회차 이상 세션 시작 직전 (임시저장 불러오기)
- **파라미터**: `project_type`, `session_number`, `steps_completed_so_far`, `draft_save_count`, `days_since_last_save`, `hours_since_last_save`, `cumulative_writing_sec`

### `project_step_abandoned`
- **발생 시점**: 단계 이탈 판정
- **파라미터**: `step`, `screen`, `project_type`, `had_draft` (bool), `session_number`, `time_on_step_sec`, `cumulative_writing_sec`

### `project_submitted` ⭐ GA4 키 이벤트
- **발생 시점**: 18단계 완주 → 등록 확정
- **파라미터**: `project_id`, `project_type`, `category`, `budget_range`, `is_first_time`, `total_sessions`, `total_hours`, `total_days`, `avg_session_gap_hours`, `total_writing_time_sec`, `total_writing_time_min`

---

## 4. 포트폴리오 등록 퍼널 (13개 섹션 멀티 세션)

> 파트너(`agency` / `production`)만 해당. 1~4세션으로 분산 등록 가능.

### `portfolio_session_started`
- **발생 시점**: 각 세션 시작
- **파라미터**: `session_number`, `sections_completed_so_far`, `partner_type`, `cumulative_writing_sec`

### `portfolio_section_N_ID` (예: `portfolio_section_portfolio`)
- **발생 시점**: 각 섹션 진입
- **파라미터**: `section` (1~13), `section_id`, `partner_type`, `session_number`, `time_on_section_sec`, `cumulative_writing_sec`

| section | section_id | 섹션명 | 통과율 |
|---|---|---|---|
| 1 | `company_info` | 기업 정보 | 90% |
| 2 | `manager_info` | 담당자 정보 | 85% |
| 3 | `experience` | 경험·특화 분야/광고매체 | 80% |
| 4 | `purpose` | 광고 목적별 전문 분야 | 78% |
| 5 | `technique` | 제작 기법별 전문분야 | 82% |
| 6 | `clients` | 대표 광고주 | 75% |
| 7 | `awards` | 대표 수상내역 | **70%** (최대 이탈) |
| 8 | `portfolio` | 대표 포트폴리오 | 85% |
| 9 | `staff` | 대표 스태프 | **65%** (최대 이탈) |
| 10 | `recent_projects` | 최근 참여 프로젝트 | 72% |
| 11 | `cotton_candy` | Cotton Candy 활동 | 80% |
| 12 | `file_upload` | 파일 업로드 | 78% |
| 13 | `intro` | 기업 소개글 | 85% |

### `portfolio_draft_saved` ⭐ GA4 키 이벤트
- **발생 시점**: ① 세션 종료 시 (다음 세션 위해), ② 이탈 직전 (80% 확률)
- **파라미터**: `sections_completed`, `partner_type`, `session_number`, `draft_save_count`, `cumulative_writing_sec`, `next_session_gap_hours` (①만)

### `portfolio_draft_opened` ⭐ GA4 키 이벤트
- **발생 시점**: 2회차 이상 세션 시작 직전
- **파라미터**: `partner_type`, `session_number`, `sections_completed_so_far`, `draft_save_count`, `days_since_last_save`, `hours_since_last_save`, `cumulative_writing_sec`

### `portfolio_section_abandoned`
- **발생 시점**: 섹션 이탈 판정
- **파라미터**: `section`, `section_id`, `partner_type`, `had_draft` (bool), `session_number`, `time_on_section_sec`, `cumulative_writing_sec`

### `portfolio_registered` ⭐ GA4 키 이벤트
- **발생 시점**: 13개 섹션 완주 → 포폴 등록 완료
- **파라미터**: `portfolio_id`, `category`, `partner_type`, `total_sessions`, `total_hours`, `total_days`, `avg_session_gap_hours`, `total_writing_time_sec`, `total_writing_time_min`

---

## 5. 파트너 지원 & 계약

### `partner_applied` ⭐ GA4 키 이벤트
- **발생 시점**: 파트너가 공고에 지원
- **파라미터**: `project_id`, `project_type`, `partner_type`, `is_first_time`

### `contract_signed` ⭐ GA4 키 이벤트
- **발생 시점**: 계약 체결 (`project_submitted` 후 7일, 30% 확률)
- **파라미터**: `project_id`, `partner_name`, `budget_range`, `contract_value_krw`

### `review_submitted` ⭐ GA4 키 이벤트
- **발생 시점**: 리뷰 등록 (`contract_signed` 후 30일, 70% 확률)
- **파라미터**: `project_id`, `has_client_rating`, `has_partner_rating`, `has_text`

---

## 6. 납품/검수 흐름

### `draft_submitted` ⭐ GA4 키 이벤트
- **발생 시점**: 초안 제출

### `draft_confirmed` ⭐ GA4 키 이벤트
- **발생 시점**: 초안 승인

### `deliverable_submitted` ⭐ GA4 키 이벤트
- **발생 시점**: 최종 납품물 제출

### `deliverable_confirmed` ⭐ GA4 키 이벤트
- **발생 시점**: 최종 납품물 승인

### `project_completed` ⭐ GA4 키 이벤트
- **발생 시점**: 프로젝트 최종 완료

---

## 7. 기타 전환 이벤트

### `consulting_inquiry_submitted`
- **발생 시점**: 컨설팅 의뢰 제출 (`project_type = 컨설팅`)
- **파라미터**: `inquiry_type`, `category`, `is_first_time`

### `activation_achieved` ⭐ GA4 키 이벤트
- **발생 시점**: 첫 핵심 전환 행동 직후
- **파라미터**: `trigger_event` (`project_submitted` / `partner_applied` / `consulting_inquiry_submitted`)

### `referral_sent` ⭐ GA4 키 이벤트
- **발생 시점**: 지인 추천 발송

### `page_exit`
- **발생 시점**: 페이지 이탈 (주로 퍼널 이탈 직후)
- **파라미터**: `path`, `exit_step` (프로젝트), `exit_section` / `exit_section_id` (포폴)

---

## GA4 키 이벤트 전체 목록 (GA4 콘솔 등록 대상)

```
site_visit
sso_login
login
signup_started
signup_complete
project_draft_saved
project_draft_opened
portfolio_draft_saved
portfolio_draft_opened
portfolio_registered
project_submitted
partner_applied
contract_signed
draft_submitted
draft_confirmed
deliverable_submitted
deliverable_confirmed
project_completed
review_submitted
referral_sent
activation_achieved
```

> ⚠ `first_visit`은 GA4 예약어 → 영구 제외 (배치 전체 거부됨)

---

## 임시저장 흐름 상세

```
[세션 1]
  project_session_started  (session_number: 1)
  step_1_partner_selection → step_6_media_channel
    ↓ 세션 종료 (자동 저장)
  project_draft_saved  (draft_save_count: 1, next_session_gap_hours: 24)

  [24시간 경과]

[세션 2]
  project_draft_opened  (days_since_last_save: 1.0, draft_save_count: 1)
  project_session_started  (session_number: 2)
  step_7_main_client → step_13_excluded_competitors
    ↓ 세션 종료 (자동 저장)
  project_draft_saved  (draft_save_count: 2, next_session_gap_hours: 8)

  [8시간 경과]

[세션 3]
  project_draft_opened  (days_since_last_save: 0.3, draft_save_count: 2)
  project_session_started  (session_number: 3)
  step_14_participant_conditions → step_18_project_details
  project_submitted  (total_sessions: 3, total_days: 1.3, total_writing_time_min: 47)
```

**이탈 시 임시저장**: 단계 이탈 판정 → `project_draft_saved` (80% 확률) → `project_step_abandoned` → `page_exit`

---

## 시뮬레이션 설정 (SimConfig)

| 항목 | 의미 | 기본값 예시 |
|---|---|---|
| `userCount` | 시뮬레이션 유저 수 | 100 |
| `periodDays` | 이벤트 분산 기간 (일) | 30 |
| `pctSsoLogin` | SSO 자동 로그인 비율(%) | 15 |
| `pctManualLogin` | 수동 로그인 비율(%) | 30 |
| `pctSignup` | 신규 가입 비율(%) | 20 |
| `projectRegCount` | 프로젝트 등록 완주 목표 수 | 10 |
| `portfolioRegCount` | 포트폴리오 등록 완주 목표 수 | 10 |
