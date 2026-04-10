# ADMarket GA4 · Mixpanel 이벤트 정의서

> 버전: v3.2 | 작성일: 2026-04-08 | 최종수정: 2026-04-10  
> 적용 툴: Google Analytics 4 + Mixpanel (동일 이벤트명·파라미터 사용)

---

## 0. 사용자 식별 구조 (identifyUser)

> 모든 이벤트에 `user_id`가 붙으려면 **로그인/가입 시점에 반드시 1회 호출** 필요.

### 호출 위치

| 위치 | 시점 | 구현 |
|------|------|------|
| `member/login.tsx` | 로그인 버튼 클릭 성공 | ✅ 완료 |
| `member/signup-email.tsx` | 이메일 인증 완료 | ✅ 완료 |
| `admin/login.tsx` | 관리자 로그인 성공 | ✅ 완료 |
| `FunnelRouteListener` (앱 마운트) | 새로고침 후 재식별 | ✅ 완료 |

### identifyUser 동작

```
mixpanel.identify(userId)           ← 익명 device_id → 실 사용자 ID 연결
mixpanel.people.set({ $name, $email, user_type, last_login })
gtag("set", "user_properties", { user_id, user_type })
localStorage.setItem("analytics_user_id", userId)   ← 새로고침 대응
```

### 파라미터

| 파라미터 | 설명 | 예시 |
|---------|------|------|
| `userId` | 고유 사용자 ID (실서비스: DB PK) | `user-kkotbyul@email.com` |
| `userName` | 표시명 | `이꽃별` |
| `userType` | `advertiser` / `partner` / `admin` | `advertiser` |
| `email` | 이메일 주소 | `kkotbyul@example.com` |

> **실서비스 연동 시**: `userId`를 서버 DB의 사용자 PK(UUID)로 교체하면 완성.

---

### trackLogin — 로그인 이벤트

> GA4 표준 `login` 이벤트 + Mixpanel `user_login` 커스텀 이벤트.  
> `identifyUser()` 직후 호출.

| 호출 위치 | 메서드 | 구현 |
|-----------|--------|------|
| `member/login.tsx` → `handleLogin` | `email` | ✅ 완료 |
| `admin/login.tsx` → `handleLogin` | `email` | ✅ 완료 |

#### 파라미터

| 파라미터 | 타입 | 예시 |
|---------|------|------|
| `method` | `"email"` / `"naver"` / `"google"` / `"admin"` | `"email"` |
| `user_type` | `"advertiser"` / `"partner"` / `"admin"` | `"advertiser"` |

#### GA4 전송 형태

```javascript
gtag("event", "login", { method: "email" })   // GA4 표준 이벤트
// Mixpanel: "user_login" { method, user_type }
```

> GA4 BigQuery 내보내기 시 `event_name = 'login'` 으로 필터.  
> 소셜 로그인(네이버·구글) 연결 시 `method` 파라미터만 교체하면 됨.

---

## 1. 설계 원칙

- 이벤트명: `snake_case` 통일 (GA4·Mixpanel 공통)
- 파라미터명: `snake_case` 통일
- **`user_type`** 파라미터를 모든 이벤트에 포함 — `advertiser`(의뢰사) / `partner`(파트너사) / `guest`(비회원)
- **`project_type`** 파라미터로 공고 vs 1:1 구분 — 퍼널이 서로 다르기 때문
- GA4 파라미터 제한: 이벤트당 최대 25개, 값 최대 100자
- GA4 전환 이벤트는 관리 콘솔에서 별도 마킹 필요

---

## 2. 자동 수집 이벤트 (코드 불필요)

| 이벤트명 | 수집 시점 | 툴 |
|---------|---------|-----|
| `page_view` | 페이지 이동 시 | GA4 + Mixpanel (FunnelRouteListener) |
| `session_start` | 세션 시작 시 | GA4 자동 |
| `first_visit` | 첫 방문 시 | GA4 자동 |

**`page_view` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `page_path` | `/admin/projects` | 현재 경로 |
| `page_title` | `ADMarket 관리자` | 탭 제목 |
| `page_location` | `https://...` | 전체 URL |

---

## 3. 유입 & 세션

| 이벤트명 | 트리거 | 구현 |
|---------|--------|------|
| `site_visit` | 세션당 최초 1회 진입 | ✅ 완료 |

**파라미터**

| 파라미터 | 예시값 |
|---------|--------|
| `path` | `/` |
| `session_id` | `uuid-xxxx` |

---

## 4. 회원가입 퍼널

| 이벤트명 | 트리거 | GA4 전환 | 구현 |
|---------|--------|---------|------|
| `signup_funnel` | 각 단계 화면 진입 시 | - | ✅ 완료 |
| `signup_complete` | 이메일 인증 완료 시 | ✅ 전환 | ✅ 완료 |

**`signup_funnel` 파라미터**

| 파라미터 | 예시값 |
|---------|--------|
| `step` | `1` / `2` / `3` |
| `step_name` | `account` / `phone` / `email` |
| `path` | `/signup` |

**`signup_complete` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `user_type` | `advertiser` / `partner` | 역할 구분 (핵심) |

> **설계 포인트**: `user_type`을 가입 완료 시점에 확정해야 이후 의뢰사/파트너사 퍼널을 분리해서 볼 수 있음

---

## 5. 발견 & 탐색 이벤트 (Discovery)

> 파트너사가 공고를 얼마나 보다가 지원하는지, 의뢰사가 대행사를 어떻게 탐색하는지 파악

| 이벤트명 | 트리거 | GA4 전환 | 구현 |
|---------|--------|---------|------|
| `project_viewed` | 공고 상세 페이지 진입 | - | ✅ 완료 |
| `partner_searched` | 파트너 검색 실행 (800ms 디바운스) | - | ✅ 완료 |
| `agency_favorited` | 대행사·제작사 즐겨찾기 추가/해제 | - | ✅ 완료 |

**`project_viewed` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `project_id` | `PN-20240614-0001` | 프로젝트 ID |
| `project_type` | `공고` / `1:1` | 유형 구분 |
| `user_type` | `partner` / `guest` | 누가 보는지 |

**`partner_searched` 파라미터**

| 파라미터 | 예시값 |
|---------|--------|
| `query` | `영상 제작` |
| `category` | `agency` / `production` |
| `user_type` | `advertiser` |

**`agency_favorited` 파라미터**

| 파라미터 | 예시값 |
|---------|--------|
| `company_id` | `42` |
| `company_type` | `agency` / `production` |
| `action` | `add` / `remove` |
| `user_type` | `advertiser` |

---

## 6. 프로젝트 등록 퍼널 (의뢰사, 공고/1:1)

> 마법사 각 화면 진입 시 자동 추적 — URL 기반

| 이벤트명 패턴 | 설명 | 구현 |
|-------------|------|------|
| `step_{N}_{화면명}` | 화면 진입 | ✅ 완료 |
| `step_{N}_{화면명}_cta` | 버튼 클릭 | ✅ 완료 |
| `project_draft_saved` | 임시저장 (세션 종료 또는 이탈 전) | ✅ 완료 |
| `project_draft_opened` | 임시저장 불러오기 (재방문 시) | ✅ 완료 |
| `project_submitted` | 최종 제출 완료 | ✅ 완료 |

**`project_submitted` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `project_type` | `공고` / `1:1` / `컨설팅` | 유형 구분 (핵심) |
| `budget_range` | `3000-5000만` | 예산 구간 |
| `total_sessions` | `2` | 완료까지 걸린 세션 수 |
| `total_days` | `1.5` | 완료까지 걸린 총 일수 |
| `avg_session_gap_hours` | `18` | 세션 간 평균 간격(시간) |
| `total_writing_time_min` | `47` | 순수 화면 작성 시간(분, 갭 제외) |

> **설계 포인트**: `project_type`으로 공고/1:1을 나눠야 퍼널 이탈률을 따로 볼 수 있음  
> 멀티세션 파라미터로 "며칠에 걸쳐 작성했는가"를 분석할 수 있음

**`project_draft_saved` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `step` | `8` | 저장 시점 단계 |
| `project_type` | `공고` | 프로젝트 유형 |
| `session_number` | `1` | 현재 세션 번호 |
| `draft_save_count` | `2` | 누적 저장 횟수 |
| `steps_completed` | `7` | 완료된 단계 수 |
| `cumulative_writing_sec` | `1240` | 누적 작성 시간(초) |
| `next_session_gap_hours` | `24` | 다음 세션까지 예상 갭 (세션 종료 저장 시만) |

**`project_draft_opened` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `project_type` | `공고` | 프로젝트 유형 |
| `session_number` | `2` | 현재 세션 번호 |
| `steps_completed_so_far` | `7` | 이전 세션까지 완료된 단계 수 |
| `resume_from_step` | `5` | **재개 시작 단계 번호** — 이탈한 단계부터 재개 시 이탈 단계와 동일, 정상 종료 재개 시 다음 단계 |
| `draft_save_count` | `1` | 저장 횟수 |
| `days_since_last_save` | `1.0` | 마지막 저장 후 경과 일수 |
| `hours_since_last_save` | `24` | 마지막 저장 후 경과 시간 |

**단계 이벤트 공통 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `step` | `5` | 단계 번호 |
| `screen` | `budget` | 화면 식별자 |
| `project_type` | `공고` / `1:1` | 프로젝트 유형 |
| `session_number` | `2` | 세션 번호 |
| `resumed_from_draft` | `true` | **임시저장 불러오기 후 재개 여부** — 2번째 세션 이후 true |
| `time_on_step_sec` | `240` | 해당 단계 체류 시간(초) |
| `cumulative_writing_sec` | `1240` | 누적 작성 시간(초) |

**등록 단계 이벤트 목록 (18단계)**

| 단계 | 화면명 | 이벤트명 | 통과율 |
|-----|--------|---------|--------|
| 1 | 파트너 찾기 방식 | `step_1_partner_selection` | 85% |
| 2 | 파트너 유형 | `step_2_partner_type` | 90% |
| 3 | 프로젝트명 | `step_3_project_name` | 88% |
| 4 | 광고 목적 | `step_4_advertising_objective` | 85% |
| 5 | 제작 기법 | `step_5_production_technique` | 87% |
| 6 | 노출 매체 | `step_6_media_channel` | 88% |
| 7 | 주요 고객 | `step_7_main_client` | 90% |
| **8** | **예산** | **`step_8_budget`** | **73% ← 최대 이탈** |
| 9 | 대금 지급 | `step_9_payment_terms` | 88% |
| 10 | 일정 | `step_10_schedule` | 87% |
| 11 | 제품정보 | `step_11_product_info` | 86% |
| 12 | 담당자정보 | `step_12_contact_person` | 90% |
| 13 | 경쟁사 제외 | `step_13_excluded_competitors` | 92% |
| 14 | 참여기업 조건 | `step_14_participant_conditions` | 90% |
| 15 | 제출자료 | `step_15_required_files` | 88% |
| 16 | 기업정보 | `step_16_company_info` | 85% |
| 17 | 상세설명 | `step_17_additional_description` | 88% |
| 18 | 최종 확인 & 등록 | `step_18_project_details` | 100% |

---

## 6-1. 포트폴리오 등록 퍼널 (파트너사)

> `agency` / `production` 유저만 해당. 13개 섹션, 1~4세션으로 분산 등록 가능.

| 이벤트명 | 설명 | 구현 |
|---------|------|------|
| `portfolio_session_started` | 각 세션 시작 | ✅ 완료 |
| `portfolio_section_{id}` | 섹션 진입 (13개) | ✅ 완료 |
| `portfolio_draft_saved` | 임시저장 (세션 종료 또는 이탈 전) | ✅ 완료 |
| `portfolio_draft_opened` | 임시저장 불러오기 (재방문 시) | ✅ 완료 |
| `portfolio_section_abandoned` | 섹션 이탈 | ✅ 완료 |
| `portfolio_registered` | 포트폴리오 등록 완료 | ✅ 완료 |

**포트폴리오 섹션 목록 (13개)**

| 섹션 | section_id | 섹션명 | 통과율 |
|-----|-----------|--------|--------|
| 1 | `company_info` | 기업 정보 | 90% |
| 2 | `manager_info` | 담당자 정보 | 85% |
| 3 | `experience` | 경험·특화 분야/광고매체 | 80% |
| 4 | `purpose` | 광고 목적별 전문 분야 | 78% |
| 5 | `technique` | 제작 기법별 전문분야 | 82% |
| 6 | `clients` | 대표 광고주 | 75% |
| **7** | `awards` | **대표 수상내역** | **70% ← 이탈 주의** |
| 8 | `portfolio` | 대표 포트폴리오 | 85% |
| **9** | `staff` | **대표 스태프** | **65% ← 최대 이탈** |
| 10 | `recent_projects` | 최근 참여 프로젝트 | 72% |
| 11 | `cotton_candy` | Cotton Candy 활동 | 80% |
| 12 | `file_upload` | 파일 업로드 | 78% |
| 13 | `intro` | 기업 소개글 | 85% |

**`portfolio_registered` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `portfolio_id` | `pf_3821` | 포트폴리오 ID |
| `category` | `영상광고` | 카테고리 |
| `partner_type` | `대행사` / `제작사` | 파트너 유형 |
| `total_sessions` | `3` | 완료까지 세션 수 |
| `total_days` | `2.5` | 완료까지 총 일수 |
| `avg_session_gap_hours` | `20` | 세션 간 평균 간격 |
| `total_writing_time_min` | `85` | 순수 작성 시간(분) |

**`portfolio_draft_saved` / `portfolio_draft_opened` 파라미터**: `project_draft_*`와 동일 구조, `step` 대신 `sections_completed` 사용.

---

## 6-2. 멀티세션 임시저장 흐름

> 프로젝트 등록(1~3세션) · 포트폴리오 등록(1~4세션) 공통 흐름

### 정상 다회 세션 (세션 사이 자동 저장)

```
[세션 1]
  project_session_started  (session_number: 1, resume_from_step: 1)
  step_1_* → step_6_*  (resumed_from_draft: false)
  ↓ 세션 종료 → 자동 저장
  project_draft_saved  (draft_save_count: 1, next_session_gap_hours: 24)

  [24시간 경과]

[세션 2]
  project_draft_opened  (steps_completed_so_far: 6, resume_from_step: 7, days_since_last_save: 1.0)
  project_session_started  (session_number: 2, resume_from_step: 7)
  step_7_* → step_13_*  (resumed_from_draft: true)
  ↓ 세션 종료 → 자동 저장
  project_draft_saved  (draft_save_count: 2, next_session_gap_hours: 8)

  [8시간 경과]

[세션 3]
  project_draft_opened  (steps_completed_so_far: 13, resume_from_step: 14, days_since_last_save: 0.3)
  project_session_started  (session_number: 3, resume_from_step: 14)
  step_14_* → step_18_project_details  (resumed_from_draft: true)
  project_submitted  (total_sessions: 3, total_days: 1.3, total_writing_time_min: 47)
```

### 이탈 후 중간 단계부터 재개 (핵심 시나리오)

```
[세션 1]
  project_session_started  (session_number: 1, resume_from_step: 1)
  step_1_* → step_5_*  (resumed_from_draft: false)
  ↓ step_5에서 이탈 판정
  project_draft_saved  (step: 5, draft_save_count: 1)  ← 이탈 전 저장 (80% 확률)
  project_step_abandoned  (step: 5)
  page_exit

  [2~72시간 경과]

[세션 2]
  project_draft_opened  (steps_completed_so_far: 5, resume_from_step: 5)  ← step 5부터 재개!
  project_session_started  (session_number: 2, resume_from_step: 5)
  step_5_* → step_9_*  (resumed_from_draft: true)
  ...
```

> **설계 포인트**: 이탈 단계에서 `projStepIdx`를 유지(증가 안 함)하므로 다음 세션은 이탈 단계부터 재시도.
> `resumed_from_draft: true`로 임시저장 재개 유저를 코호트로 분리 가능.

**이탈 패턴**: 이탈 판정 → `draft_saved` (80% 확률) → `step_abandoned` → `page_exit`
**완전 이탈**: 임시저장 없거나(20%) 세션 소진 시 → 재방문 없음 (`projFinallyAbandoned`)

---

## 7. 파트너사 퍼널 (공고 지원)

| 이벤트명 | 트리거 | GA4 전환 | 구현 |
|---------|--------|---------|------|
| `project_viewed` | 공고 상세 조회 | - | ✅ 완료 |
| `partner_applied` | 참여신청 버튼 클릭 | ✅ 전환 | ✅ 완료 |
| `proposal_submitted` | 제안서 제출 | ✅ 전환 | ✅ 완료 |
| `partner_selected` | 최종선정 확정 CTA 클릭 | ✅ 전환 | ✅ 완료 |
| `contract_signed` | 계약 등록 완료 = 파트너 선정 확정 | ✅ 전환 | ✅ 완료 |

**`partner_applied` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `project_id` | `PN-20240614-0001` | 프로젝트 ID |
| `project_type` | `공고` / `1:1` | 유형 구분 |
| `partner_type` | `제작사` / `대행사` | 파트너 유형 |

---

## 8. 컨설팅 퍼널

> **구조 설명**: 컨설팅은 "전환"이 아닌 **문의 → 응답 → 종결** 흐름.  
> 프로젝트는 컨설턴트가 별도로 직접 생성한 뒤, 해당 컨설팅 케이스에 **연결**만 함.  
> `consulting_to_project` (전환) 이벤트는 존재하지 않음 — 제거됨.

| 이벤트명 | 트리거 | GA4 전환 | 구현 |
|---------|--------|---------|------|
| `consulting_inquiry_submitted` | 의뢰사 컨설팅 문의 접수 | ✅ 전환 | ✅ 완료 |
| `consulting_message_sent` | 컨설턴트 메시지 발송 (SMS·카톡·웹) | - | ✅ 완료 |
| `consulting_responded` | 컨설턴트 케이스 종결 처리 | - | ✅ 완료 |
| `consulting_project_linked` | 컨설팅 케이스에 공고/1:1 프로젝트 연결 | - | ✅ 완료 |

**`consulting_inquiry_submitted` 파라미터**

| 파라미터 | 예시값 |
|---------|--------|
| `title` | `TV CF 제작 문의` (100자 이하) |
| `has_attachment` | `true` / `false` |
| `user_type` | `advertiser` |

**`consulting_message_sent` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `consulting_id` | `CONS-20250401-001` | 컨설팅 케이스 ID |
| `channel` | `SMS,KAKAO` | 발송 채널 (복수 시 콤마 구분) |
| `user_type` | `admin` | 항상 관리자(컨설턴트) |

**`consulting_responded` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `consulting_id` | `CONS-20250401-001` | 컨설팅 케이스 ID |
| `outcome_kind` | `MATCHING_PUBLIC` | 결과 유형 (`MATCHING_PUBLIC` / `MATCHING_1TO1` / `DIRECT_INTRO` / `SIMPLE_CONSULT`) |
| `service_tier` | `FULLCARE_PT` | 서비스 티어 (`SIMPLE_MATCH` / `PROJECT_RUN` / `FULLCARE_PT` / `CUSTOM`) |
| `user_type` | `admin` | 항상 관리자(컨설턴트) |

**`consulting_project_linked` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `consulting_id` | `CONS-20250401-001` | 연결 대상 컨설팅 케이스 ID |
| `project_id` | `PID-20250401-0001` | 연결된 프로젝트 ID |
| `outcome_kind` | `MATCHING_PUBLIC` | 결과 유형 |
| `user_type` | `admin` | 항상 관리자(컨설턴트) |

> **이벤트 연결 위치**: `/work/consulting/inquiries` → `ConsultingInquiryAdminView` 컴포넌트

---

## 9. 참여현황 관리 이벤트 (의뢰사)

> `/work/project/participation` — 의뢰사가 참여 기업을 관리하는 행동 추적

| 이벤트명 | 트리거 | GA4 전환 | 구현 |
|---------|--------|---------|------|
| `participation_invite_toggled` | 참여신청 탭 초대 토글 | - | ✅ 완료 |
| `participation_ot_confirmed` | OT참석확정 토글 | - | ✅ 완료 |
| `participation_ot_completed` | OT참석완료 토글 | - | ✅ 완료 |
| `participation_pt_confirmed` | PT참석확정 토글 | - | ✅ 완료 |
| `participation_pt_completed` | PT완료 토글 | - | ✅ 완료 |
| `participation_final_selected` | 최종선정 토글 | ✅ 전환 | ✅ 완료 |

**공통 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `company_id` | `1` | 기업 ID |
| `company_name` | `솜사탕애드` | 기업명 |
| `user_type` | `advertiser` | 항상 의뢰사 |
| `invited` / `confirmed` / `completed` / `selected` | `true` / `false` | 토글 상태 |
| `pt_round` | `pt1` / `pt2` | PT 차수 (PT 이벤트만) |

---

## 10. 계약 이벤트 (의뢰사)

> `/work/project/contract` — 계약 등록 완료가 `partner_selected` + `contract_signed` 통합 전환점

| 이벤트명 | 트리거 | GA4 전환 | 구현 |
|---------|--------|---------|------|
| `contract_saved` | 임시저장 클릭 | - | ✅ 완료 |
| `contract_request_sent` | 인정부서/파트너사 협의 요청 | - | ✅ 완료 |
| `contract_signed` | 계약 등록 완료 = 파트너 선정 확정 | ✅ 전환 | ✅ 완료 |
| `contract_cancelled` | 계약 취소 | - | ✅ 완료 |

**`contract_signed` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `partner_name` | `마케팅에이전션` | 계약 파트너명 |
| `budget_range` | `1.5억~2억원` | 계약비 구간 (UX 표시용) |
| `contract_value_krw` | `180000000` | **실제 계약 금액 (원)** — GA4 `value` 파라미터로도 전달, 매출 집계용 |
| `value` | `180000000` | GA4 표준 매출 파라미터 (자동 설정) |
| `currency` | `KRW` | 통화 (자동 설정) |
| `user_type` | `advertiser` | 항상 의뢰사 |

> **설계 포인트**: `partner_selected`(파트너 선정)과 `contract_signed`(계약 체결)을 `contract_signed` 하나로 통합.
> 참여현황의 `participation_final_selected`는 "후보 의향" 이벤트이고, 계약 등록 완료가 실제 비즈니스 전환점.

**`contract_request_sent` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `request_type` | `internal` / `partner` | 인정부서 vs 파트너사 요청 구분 |
| `partner_name` | `마케팅에이전션` | 파트너명 |

---

## 11. 납품·산출물 이벤트 (파트너사·의뢰사)

> `/work/project/deliverables` — 파트너사가 산출물을 제출하고 의뢰사가 선택·확정하는 전체 흐름

| 이벤트명 | 발송 주체 | 트리거 | GA4 전환 | 구현 |
|---------|---------|--------|---------|------|
| `draft_submitted` | 파트너사 | 제안서 제출하기 클릭 | ✅ 전환 | ✅ 완료 |
| `draft_confirmed` | 의뢰사 | 제안서 수락 버튼 클릭 | ✅ 전환 | ⏸ 함수 준비, UI 미연결 |
| `deliverable_submitted` | 파트너사 | "의뢰사에 산출물 선택 요청하기" 팝업 확인 또는 "최종산출물 확정요청" 팝업 확인 | ✅ 전환 | ✅ 완료 |
| `deliverable_confirmed` | 의뢰사 | "선택된 작품을 최종 산출물로 확정 등록하기" 팝업 확인 | ✅ 전환 | ✅ 완료 |

### 팝업 4종 → 이벤트 매핑

| 팝업명 | 발송 주체 | 이벤트 |
|--------|---------|--------|
| 산출물 업로드 완료 및 선택요청 | 파트너사 | `deliverable_submitted` |
| 최종산출물 확정요청 | 파트너사 | `deliverable_submitted` |
| 선택완료 및 수정요청 | 의뢰사 | (이벤트 없음 — UX 흐름용) |
| 최종산출물 선택완료 | 의뢰사 | `deliverable_confirmed` |

**`draft_submitted` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `project_title` | `[베스트전자] TV 신제품 프로모션` | 프로젝트명 |
| `concept_count` | `3` | 제출 컨셉 수 |
| `user_type` | `partner` | 항상 파트너사 |

**`draft_confirmed` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `project_title` | `[베스트전자] TV 신제품 프로모션` | 프로젝트명 |
| `user_type` | `advertiser` | 항상 의뢰사 |

**`deliverable_submitted` · `deliverable_confirmed` 공통 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `project_title` | `[베스트전자] TV 신제품 프로모션` | 프로젝트명 |
| `phase` | `1` / `2` | 산출물 차수 |
| `user_type` | `partner` / `advertiser` | 발송 주체 |

> **설계 포인트**: `draft_submitted` → `draft_confirmed` → `deliverable_submitted` → `deliverable_confirmed` 순서가 계약 후 납품 완료 퍼널의 핵심 마일스톤.  
> `draft_confirmed`는 의뢰사가 제안서를 수락할 때 발사 — 현재 함수만 준비, 의뢰사 화면 구현 후 연결 필요.

---

## 11-1. 제작 리뷰 · 프로젝트 완료 이벤트 (의뢰사)

> `/work/project/review` — 리뷰 작성 및 최종 완료가 프로젝트 전체 퍼널의 종점

| 이벤트명 | 트리거 | GA4 전환 | 구현 |
|---------|--------|---------|------|
| `review_saved` | 임시저장 버튼 클릭 | - | ✅ 완료 |
| `review_submitted` | 등록하기 클릭 (리뷰 제출) | ✅ 전환 | ✅ 완료 |
| `review_edited` | 수정 버튼 클릭 (7일 이내) | - | ✅ 완료 |
| `review_completed` | 완료 버튼 클릭 (리뷰 잠금) | - | ✅ 완료 |
| `project_completed` | 완료 버튼 클릭 (프로젝트 최종 종료) | ✅ 전환 | ✅ 완료 |

**`review_submitted` 파라미터** (핵심 전환)

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `partner_name` | `솜사탕애드` | 파트너 기업명 |
| `has_client_rating` | `true` | 의뢰사 평점 작성 여부 |
| `has_partner_rating` | `true` | 파트너사 평점 작성 여부 |
| `has_text` | `true` | 리뷰 텍스트 작성 여부 |
| `user_type` | `advertiser` | 항상 의뢰사 |

**`project_completed` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `partner_name` | `솜사탕애드` | 파트너 기업명 |
| `project_title` | `[베스트전자] TV 신제품 프로모션` | 프로젝트명 (있는 경우) |
| `user_type` | `advertiser` | 항상 의뢰사 |

> **설계 포인트**: `review_submitted`(리뷰 등록)와 `project_completed`(최종 완료 버튼)는 review.tsx `handleComplete`에서 동시 발사.  
> `review_submitted`는 GA4 퍼널 전환점, `project_completed`는 비즈니스 사이클 종료 지표.

---

## 12. 관리자 운영 이벤트

> 관리자 행동은 별도 GA4 Property 또는 Mixpanel 전용 프로젝트 권장

| 이벤트명 | 트리거 | 구현 |
|---------|--------|------|
| `admin_project_approved` | 관리자 프로젝트 승인 | ✅ 완료 |
| `admin_project_rejected` | 관리자 프로젝트 반려 | ✅ 완료 |
| `admin_member_warned` | 회원 경고 처리 | ✅ 완료 |
| `admin_member_suspended` | 회원 정지 처리 | ✅ 완료 |
| `admin_member_resumed` | 회원 정지 해제 | ✅ 완료 |
| `admin_member_banned` | 회원 강제 탈퇴 | ✅ 완료 |
| `admin_notice_published` | 공지사항 게시 | ✅ 완료 |
| `admin_banner_published` | 배너 게시 | ✅ 완료 |
| `admin_notification_sent` | 알림 발송 | ✅ 완료 |

---

## 13. Activation 이벤트 설계

> AARRR의 **Activation** = 가입 후 처음으로 핵심 가치를 경험하는 시점.  
> ADMarket에서는 "처음 프로젝트 등록 완료(의뢰사)" 또는 "처음 공고 지원 완료(파트너사)"를 Activation 달성으로 정의.

### Activation 퍼널

```
[의뢰사]
signup_complete
  → step_1_partner_selection (마법사 시작)
    → ... (16단계 스텝 이벤트)
      → project_submitted { is_first_time: true }   ← Activation 달성
          → activation_achieved { trigger_event: "project_submitted", user_type: "advertiser" }

[파트너사]
signup_complete
  → project_viewed
    → partner_applied { is_first_time: true }        ← Activation 달성
        → activation_achieved { trigger_event: "partner_applied", user_type: "partner" }
```

### activation_achieved 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `trigger_event` | `"project_submitted"` / `"partner_applied"` | Activation을 트리거한 이벤트 |
| `user_type` | `"advertiser"` / `"partner"` | 사용자 유형 |

### is_first_time 플래그

`project_submitted`와 `partner_applied`에 `is_first_time: boolean` 파라미터가 자동 추가됨.  
localStorage 기반으로 처음 여부를 감지하며, 첫 발사 시에만 `activation_achieved`가 함께 발사됨.

### Mixpanel 코호트 활용

| 분석 목적 | 쿼리 |
|---------|------|
| Activation 전환율 | `signup_complete` → `activation_achieved` |
| 의뢰사 첫 등록 소요 시간 | `signup_complete` → `project_submitted(is_first_time=true)` 사이 시간 |
| 파트너사 첫 지원 소요 시간 | `signup_complete` → `partner_applied(is_first_time=true)` 사이 시간 |
| Activation 미달성 코호트 | `signup_complete` 후 7일 이내 `activation_achieved` 없는 유저 |

### GA4 전환 이벤트 추가 등록

GA4 관리 콘솔 → `activation_achieved`를 전환 이벤트로 추가 마킹.

---

## 14. GA4 전환 이벤트 설정 목록

> GA4 관리 콘솔 → 이벤트 → 아래 이벤트를 "전환으로 표시"

| 이벤트명 | 전환 의미 | 역할 | 구현 |
|---------|----------|------|------|
| `signup_complete` | 회원가입 완료 | 공통 | ✅ |
| `project_submitted` | 프로젝트 등록 완료 | 의뢰사 | ✅ |
| `project_draft_saved` | 프로젝트 임시저장 | 의뢰사 | ✅ |
| `project_draft_opened` | 프로젝트 임시저장 불러오기 | 의뢰사 | ✅ |
| `portfolio_registered` | 포트폴리오 등록 완료 | 파트너사 | ✅ |
| `portfolio_draft_saved` | 포트폴리오 임시저장 | 파트너사 | ✅ |
| `portfolio_draft_opened` | 포트폴리오 임시저장 불러오기 | 파트너사 | ✅ |
| `partner_applied` | 파트너 지원 완료 | 파트너사 | ✅ |
| `proposal_submitted` | 제안서 제출 | 파트너사 | ✅ |
| `partner_selected` | 최종선정 확정 CTA 클릭 | 의뢰사 | ✅ |
| `contract_signed` | 계약 등록 완료 = 파트너 선정 확정 | 의뢰사 | ✅ |
| `draft_submitted` | 초안 제출 | 파트너사 | ✅ |
| `draft_confirmed` | 초안 승인 | 의뢰사 | ✅ |
| `deliverable_submitted` | 최종 납품물 제출 | 파트너사 | ✅ |
| `deliverable_confirmed` | 최종 납품물 승인 | 의뢰사 | ✅ |
| `participation_final_selected` | 최종 파트너 선정 토글 | 의뢰사 | ✅ |
| `consulting_inquiry_submitted` | 컨설팅 문의 접수 | 의뢰사 | ✅ |
| `review_submitted` | 제작 리뷰 등록 | 의뢰사 | ✅ |
| `project_completed` | 프로젝트 최종 완료 종료 | 의뢰사 | ✅ |
| `activation_achieved` | 첫 핵심 행동 달성 | 공통 | ✅ |
| `referral_sent` | 지인 추천 발송 | 공통 | ✅ |

> ⚠ `first_visit`은 GA4 예약어 → **영구 제외** (배치 전체 거부됨)

---

## 15. 퍼널 설계 (GA4 탐색 보고서 / Mixpanel 퍼널)

### 의뢰사 — 공고 프로젝트 퍼널 (전체 사이클)

```
site_visit
  → signup_complete (user_type=advertiser)
    → step_1_partner_selection  ← 등록 마법사 시작
      → step_7_budget           ← 이탈률 집중 모니터링
        → project_submitted (project_type=공고)
          → participation_final_selected ← 최종 파트너 선정
            → contract_signed
              → draft_confirmed          ← 제안서 수락 (의뢰사)
                → deliverable_confirmed  ← 최종 산출물 확정 (의뢰사)
                  → review_submitted     ← 리뷰 등록
                    → project_completed  ← 프로젝트 최종 종료
```

### 의뢰사 — 1:1 프로젝트 퍼널

```
site_visit
  → signup_complete (user_type=advertiser)
    → step_1_partner_selection
      → project_submitted (project_type=1:1)
        → contract_signed
          → draft_confirmed
            → deliverable_confirmed
              → review_submitted
                → project_completed     ← 프로젝트 최종 종료
```

### 파트너사 — 지원 퍼널

```
site_visit
  → signup_complete (user_type=partner)
    → project_viewed (project_type=공고)  ← 발견
      → partner_applied                  ← 행동
        → proposal_submitted
          → partner_selected (수주)
            → draft_submitted            ← 제안서 제출 (파트너사)
              → deliverable_submitted    ← 산출물 제출 (파트너사)
```

### 컨설팅 퍼널

```
site_visit
  → consulting_inquiry_submitted         ← 의뢰사 문의 접수 (GA4 전환)
    → consulting_responded               ← 컨설턴트 응답 완료 (케이스 종결)

[별도 흐름] 컨설턴트가 직접 새 프로젝트 생성 후 연결:
  consulting_project_linked (consulting_id ↔ project_id)
```

> ※ 컨설팅은 프로젝트로 자동 "전환"되지 않음.  
> 프로젝트는 컨설턴트가 독립적으로 생성하고, 컨설팅 케이스에 연결(link)만 함.

---

## 16. Mixpanel 코호트 분석 설계

| 분석 목적 | 퍼널 / 코호트 구성 |
|---------|---------|
| 의뢰사 가입 → 등록 전환율 | `signup_complete (advertiser)` → `project_submitted` |
| 공고 등록 이탈 단계 파악 | `step_1_*` ~ `step_16_*` → `project_submitted` |
| 파트너사 발견 → 지원 전환율 | `project_viewed` → `partner_applied` |
| 매칭 → 계약 전환율 | `participation_final_selected` → `contract_signed` |
| 계약 → 납품 완료율 | `contract_signed` → `deliverable_confirmed` |
| 납품 → 프로젝트 종료율 | `deliverable_confirmed` → `project_completed` |
| 전체 사이클 완주율 | `project_submitted` → `project_completed` |
| 제안서 수락 소요 시간 | `draft_submitted` → `draft_confirmed` 사이 시간 |
| 컨설팅 문의 → 응답 완료율 | `consulting_inquiry_submitted` → `consulting_responded` |
| 대행사 탐색 깊이 | `partner_searched` → `agency_favorited` → `project_submitted` |

---

## 17. 구현 현황 요약

> ⭐ = GA4 키 이벤트 (콘솔 전환 등록 대상) | GA4 `-` = Mixpanel 전용

### 유입 · 세션
| 이벤트 | GA4 | MXP |
|--------|-----|-----|
| `page_view` | ✅ | ✅ |
| `site_visit` ⭐ | ✅ | ✅ |
| `direct_entry` | ✅ | ✅ |
| `time_on_page` | ✅ | ✅ |
| `page_exit` | ✅ | ✅ |

### 인증 · 가입
| 이벤트 | GA4 | MXP |
|--------|-----|-----|
| `sso_login` ⭐ | ✅ | ✅ |
| `login` ⭐ | ✅ | ✅ |
| `user_login` (Mixpanel 전용) | - | ✅ |
| `signup_started` ⭐ | ✅ | ✅ |
| `signup_funnel` | ✅ | ✅ |
| `signup_complete` ⭐ | ✅ | ✅ |

### 탐색 · 발견
| 이벤트 | GA4 | MXP |
|--------|-----|-----|
| `project_viewed` | ✅ | ✅ |
| `partner_searched` | ✅ | ✅ |
| `agency_favorited` | ✅ | ✅ |

### 프로젝트 등록 퍼널 (의뢰사)
| 이벤트 | GA4 | MXP |
|--------|-----|-----|
| `step_1_cta_click` ⭐ | ✅ | ✅ |
| `step_N_화면명` (18단계) | ✅ page_view | ✅ |
| `project_session_started` | - | ✅ |
| `project_draft_saved` ⭐ | ✅ | ✅ |
| `project_draft_opened` ⭐ | ✅ | ✅ |
| `project_step_abandoned` | - | ✅ |
| `project_submitted` ⭐ | ✅ | ✅ |
| `consulting_inquiry_submitted` ⭐ | ✅ | ✅ |

### 포트폴리오 등록 퍼널 (파트너사)
| 이벤트 | GA4 | MXP |
|--------|-----|-----|
| `portfolio_session_started` | - | ✅ |
| `portfolio_section_{id}` (13개) | ✅ page_view | ✅ |
| `portfolio_draft_saved` ⭐ | ✅ | ✅ |
| `portfolio_draft_opened` ⭐ | ✅ | ✅ |
| `portfolio_section_abandoned` | - | ✅ |
| `portfolio_registered` ⭐ | ✅ | ✅ |

### 지원 · 계약
| 이벤트 | GA4 | MXP |
|--------|-----|-----|
| `partner_applied` ⭐ | ✅ | ✅ |
| `proposal_submitted` ⭐ | ✅ | ✅ |
| `partner_selected` ⭐ | ✅ | ✅ |
| `contract_saved` | ✅ | ✅ |
| `contract_request_sent` | ✅ | ✅ |
| `contract_signed` ⭐ | ✅ | ✅ |
| `contract_cancelled` | ✅ | ✅ |

### 참여현황 (의뢰사)
| 이벤트 | GA4 | MXP |
|--------|-----|-----|
| `participation_invite_toggled` | ✅ | ✅ |
| `participation_ot_confirmed` | ✅ | ✅ |
| `participation_ot_completed` | ✅ | ✅ |
| `participation_pt_confirmed` | ✅ | ✅ |
| `participation_pt_completed` | ✅ | ✅ |
| `participation_final_selected` ⭐ | ✅ | ✅ |

### 납품 · 리뷰
| 이벤트 | GA4 | MXP | UI 연결 |
|--------|-----|-----|---------|
| `draft_submitted` ⭐ | ✅ | ✅ | ✅ proposal-register.tsx |
| `draft_confirmed` ⭐ | ✅ | ✅ | ⏸ 함수 준비, 의뢰사 UI 미구현 |
| `deliverable_submitted` ⭐ | ✅ | ✅ | ✅ deliverables.tsx 팝업①② |
| `deliverable_confirmed` ⭐ | ✅ | ✅ | ✅ deliverables.tsx 팝업④ |
| `review_saved` | ✅ | ✅ | ✅ review.tsx |
| `review_submitted` ⭐ | ✅ | ✅ | ✅ review.tsx |
| `review_edited` | ✅ | ✅ | ✅ review.tsx |
| `review_completed` | ✅ | ✅ | ✅ review.tsx |
| `project_completed` ⭐ | ✅ | ✅ | ✅ review.tsx handleComplete |

### 컨설팅
| 이벤트 | GA4 | MXP |
|--------|-----|-----|
| `consulting_message_sent` | ✅ | ✅ |
| `consulting_responded` | ✅ | ✅ |
| `consulting_project_linked` | ✅ | ✅ |

### 관리자 운영
| 이벤트 | GA4 | MXP |
|--------|-----|-----|
| `admin_project_approved` | ✅ | ✅ |
| `admin_project_rejected` | ✅ | ✅ |
| `admin_member_warned` | ✅ | ✅ |
| `admin_member_suspended` | ✅ | ✅ |
| `admin_member_resumed` | ✅ | ✅ |
| `admin_member_banned` | ✅ | ✅ |
| `admin_notice_published` | ✅ | ✅ |
| `admin_banner_published` | ✅ | ✅ |
| `admin_notification_sent` | ✅ | ✅ |

### 마이페이지
| 이벤트 | GA4 | MXP |
|--------|-----|-----|
| `mypage_viewed` | ✅ | ✅ |
| `mypage_profile_saved` | ✅ | ✅ |
| `mypage_withdraw_attempted` | ✅ | ✅ |
| `mypage_inquiry_submitted` | ✅ | ✅ |
| `mypage_notification_settings_saved` | ✅ | ✅ |

### 기타 전환 · 실험
| 이벤트 | GA4 | MXP |
|--------|-----|-----|
| `activation_achieved` ⭐ | ✅ | ✅ |
| `referral_sent` ⭐ | ✅ | ✅ |
| `referral_signed_up` | ✅ | ✅ |
| `home_cta_clicked` | ✅ | ✅ |
| `experiment_viewed` | ✅ | ✅ |

### 자동 첨부 프로퍼티 (모든 이벤트 공통)

| 프로퍼티 | 설명 | 소스 |
|---------|------|------|
| `utm_source` / `utm_medium` / `utm_campaign` | 유입 채널 정보 | URL 파라미터 → sessionStorage 고정 |
| `user_id` | 로그인 사용자 ID | localStorage |
| `active_experiments` / `exp_<id>` | A/B 실험 배정 정보 | localStorage |

### 시뮬레이션 전용 자동 첨부 프로퍼티

> `simulate-analytics.ts` 내 `common` 객체를 통해 모든 시뮬레이션 이벤트에 자동 포함.

| 프로퍼티 | 예시값 | 설명 |
|---------|--------|------|
| `user_name` | `김민준` | 시뮬레이션 유저 한국 이름 |
| `user_company` | `삼성전자` | 광고주 기업명 또는 파트너사명 |
| `user_type` | `advertiser` / `agency` / `production` | 유저 유형 |
| `gender` | `male` / `female` | 성별 |
| `age_group` | `20s` ~ `50s` | 연령대 |
| `geo_region` | `서울` / `경기도` / `부산` 등 | 지역 |
| `utm_source` / `utm_medium` | `google` / `cpc` 등 | 유입 채널 |

---

## 18. GA4 Measurement Protocol 시뮬레이션 동작

> 어드민 시뮬레이션이 GA4로 데이터를 전송하는 방식 요약 (개발자 참조용)

### GA4 전송 구조

| 항목 | 값 / 설명 |
|------|---------|
| Endpoint | `https://www.google-analytics.com/mp/collect` |
| 인증 | `measurement_id` + `api_secret` |
| 요청당 이벤트 | 최대 25개 (GA4 MP 제한) |
| `client_id` | 시뮬레이션 유저별 고유 (`XXXXXXXXXX.XXXXXXXXXX` 형식) |
| `session_id` | 유저별 고정 (멀티세션은 동일 session_id 유지) |
| `timestamp_micros` | 이벤트 발생 시각 (Unix μs, 71시간 이내로 캡 처리) |

### GA4 전송 이벤트 종류

| 이벤트 종류 | 전송 이벤트명 | 목적 |
|------------|------------|------|
| 페이지 방문 | `page_view` | GA4 "페이지 및 화면" 보고서에 페이지 경로 집계 |
| 키 전환 | 커스텀 이벤트명 (예: `project_submitted`) | GA4 "이벤트" 보고서·전환 보고서에 집계 |

> **중요**: step 이벤트(18단계) 및 포트폴리오 섹션 이벤트(13개)는 `page_view`로 전송됨. GA4 "페이지 및 화면" 보고서에서 `/create-project/step1` ~ `/create-project/step18`, `/work/portfolio/register` 경로로 집계 확인 가능.

### page_location 매핑

| 이벤트 유형 | page_location |
|------------|--------------|
| `site_visit`, `home_click` | `admarket.co.kr/` |
| `sso_login`, `login` | `admarket.co.kr/login` |
| `signup_funnel` step 1~5 | `/signup`, `/signup/email`, `/signup/phone`, `/signup/account-type`, `/signup/job-info` |
| `step_N_*` | `admarket.co.kr/create-project/stepN` |
| `portfolio_section_*` | `admarket.co.kr/work/portfolio/register` |
| `partner_applied` | `admarket.co.kr/partner/detail` |
| `contract_signed` | `admarket.co.kr/work/contracts` |
| `review_submitted` | `admarket.co.kr/work/reviews` |

### Mixpanel People 프로필 시뮬레이션 등록

> 이벤트 전송 완료 후 `/engage` 엔드포인트를 통해 시뮬레이션 유저 전원의 People 프로필을 일괄 등록.

| 항목 | 값 / 설명 |
|------|---------|
| Endpoint | `https://api.mixpanel.com/engage` |
| 처리 방식 | Batch 50개씩 전송 (이벤트 전송 완료 후 실행) |
| 등록 시점 | 시뮬레이션 완료 직전 ("Mixpanel People 프로필 등록 중..." 상태) |

**등록 필드 (`$set`)**

| 필드 | 예시값 | 설명 |
|-----|--------|------|
| `$name` | `김민준` | Mixpanel Users 탭에 표시되는 이름 |
| `$email` | `minjun42@naver.com` | 이메일 |
| `user_type` | `advertiser` | 유저 유형 |
| `user_company` | `삼성전자` | 소속 기업명 |
| `gender` | `male` | 성별 |
| `age_group` | `30s` | 연령대 |
| `geo_region` | `서울` | 지역 |
| `utm_source` | `google` | 유입 채널 |
| `simulation` | `true` | 실제 유저와 구분용 플래그 |

**이름 생성 알고리즘**

- 성씨: 30개 (김·이·박·최·정 등)
- 남자 이름: 40개, 여자 이름: 40개 (무작위 조합)
- 이메일: `{이름+숫자}@{gmail.com|naver.com|kakao.com 등 7개 도메인}`
- 기업명: 광고주 30개(삼성전자·LG전자·현대차 등), 파트너사 20개(솜사탕애드·크리에이티브랩 등)

### 주의사항

- GA4 MP는 `timestamp_micros`가 72시간보다 오래된 이벤트를 거부함 → 시뮬레이션 `periodDays` 설정에 관계없이 최대 71시간 이내로 캡 처리
- GA4 표준 보고서는 데이터 처리에 최대 24~48시간 소요 (실시간 보고서는 즉시 반영)
- 시뮬레이션 이벤트는 `simulation: "true"` 파라미터를 포함하여 실제 유저 데이터와 구분 가능
- `first_visit`은 GA4 예약어로 Measurement Protocol 배치 전체를 거부시킴 → **영구 제외**

---

## 19. 활성 A/B 실험 목록

> `assignExperiment(experimentId, variants)` 로 배정, `trackExperimentViewed(experimentId, variant)` 로 노출 기록.  
> 배정된 variant는 localStorage(`analytics_experiments`)에 고정 저장.

### 현재 실험

| 실험 ID | 파일 | variants | 전환 기준 이벤트 | 상태 |
|---------|------|---------|----------------|------|
| `home_hero_title` | `pages/home.tsx` | `control`, `variant_question` | `project_submitted` | ✅ 활성 (10초 자동 전환) |

### `home_hero_title` 상세

| variant | 타이틀 | 서브 | CTA 텍스트 | 특이사항 |
|---------|--------|------|-----------|---------|
| `control` | `어떤 광고를\n만들어드릴까요?` | - | `지금 무료로 의뢰하기` | 프로모 텍스트 표시 |
| `variant_question` | `어떤 광고를 만들어드릴까요?` | `광고주는 선택만, 제작은 전문가가, 이 모든것이 무료!` | `지금 무료로 시작하기` | 프로모 텍스트 숨김 |

### 전송 이벤트 흐름

```
[홈 진입 or 10초 경과]
  → assignExperiment("home_hero_title", ["control", "variant_question"])
    → 배정된 variant를 localStorage에 고정
      → trackExperimentViewed("home_hero_title", variant)  ← experiment_viewed 발사

[CTA 버튼 클릭]
  → publishAnalytics("home_cta_clicked", { experiment_id, variant })
    → (프로젝트 등록까지 완료 시) project_submitted   ← 전환
```

### Mixpanel / GA4 분석 방법

| 분석 목적 | 쿼리 |
|---------|------|
| 노출 대비 CTA 클릭률 | `experiment_viewed (experiment_id=home_hero_title)` → `hero_cta_clicked` |
| variant별 최종 전환율 | `exp_home_hero_title = control` vs `variant_question` → `project_submitted` 비율 |
| 실험 트래픽 배분 확인 | `experiment_viewed` 이벤트의 `variant` 분포 |

> **유의사항**: GA4는 모든 이벤트에 `exp_home_hero_title` 프로퍼티가 자동 첨부됨.  
> GA4 탐색 보고서에서 `exp_home_hero_title` 차원으로 세분화하면 variant별 지표 비교 가능.

---

## 20. 미연결 이벤트 (함수 준비 완료, UI 연결 필요)

| 이벤트 | 함수 | 연결 예정 위치 | 비고 |
|--------|------|--------------|------|
| `draft_confirmed` | `trackDraftConfirmed` | 의뢰사 제안서 수락 화면 | 해당 화면 미구현 |

---

*이 문서는 ADMarket 플랫폼 GA4·Mixpanel 이벤트 정의 기준입니다. (v3.2 — 2026-04-10)*  
*전체 퍼널 이벤트 연결 완료: `project_completed` · `deliverable_submitted/confirmed` · `draft_submitted` · `portfolio_registered`*  
*v3.2 추가: 시뮬레이션 유저 한국 이름·기업명 생성 + Mixpanel People 프로필(`/engage`) 등록 + 공통 프로퍼티 `user_name` · `user_company` 추가*
