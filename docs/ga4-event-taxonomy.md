# ADMarket GA4 · Mixpanel 이벤트 정의서

> 버전: v2.7 | 작성일: 2026-04-08  
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
| `project_submitted` | 최종 제출 완료 | ✅ 완료 |

**`project_submitted` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `project_type` | `공고` / `1:1` / `컨설팅` | 유형 구분 (핵심) |
| `partner_type` | `제작` / `대행` | 파트너 유형 |
| `budget_range` | `3000-5000` | 예산 구간(만원) |

> **설계 포인트**: `project_type`으로 공고/1:1을 나눠야 퍼널 이탈률을 따로 볼 수 있음

**등록 단계 이벤트 목록**

| 단계 | 화면명 | 이벤트명 |
|-----|--------|---------|
| 1 | 파트너 유형 선택 | `step_1_partner_selection` |
| 2 | 프로젝트명 | `step_2_project_name` |
| 3 | 광고 목적 | `step_3_advertising_objective` |
| 4 | 제작 기법 | `step_4_production_technique` |
| 5 | 매체 채널 | `step_5_media_channel` |
| 6 | 주요 클라이언트 | `step_6_main_client` |
| 7 | 예산 | `step_7_budget` |
| 8 | 대금 지급 조건 | `step_8_payment_terms` |
| 9 | 일정 | `step_9_schedule` |
| 10 | 상품 정보 | `step_10_product_info` |
| 11 | 담당자 | `step_11_contact_person` |
| 12 | 경쟁사 제외 | `step_12_excluded_competitors` |
| 13 | 참여 조건 | `step_13_participant_conditions` |
| 14 | 필수 제출물 | `step_14_required_files` |
| 15 | 기업 정보 | `step_15_company_info` |
| 16 | 추가 설명 | `step_16_additional_description` |

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

## 11. 제작 리뷰 이벤트 (의뢰사)

> `/work/project/review` — 리뷰 작성이 곧 프로젝트 완료를 의미

| 이벤트명 | 트리거 | GA4 전환 | 구현 |
|---------|--------|---------|------|
| `review_saved` | 임시저장 버튼 클릭 | - | ✅ 완료 |
| `review_submitted` | 등록하기 클릭 (프로젝트 완료) | ✅ 전환 | ✅ 완료 |
| `review_edited` | 수정 버튼 클릭 (7일 이내) | - | ✅ 완료 |
| `review_completed` | 완료 버튼 클릭 | - | ✅ 완료 |

**`review_submitted` 파라미터** (핵심 전환)

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `partner_name` | `솜사탕애드` | 파트너 기업명 |
| `has_client_rating` | `true` | 의뢰사 평점 작성 여부 |
| `has_partner_rating` | `true` | 파트너사 평점 작성 여부 |
| `has_text` | `true` | 리뷰 텍스트 작성 여부 |
| `user_type` | `advertiser` | 항상 의뢰사 |

> **설계 포인트**: `review_submitted` = 프로젝트 완료 전환. GA4 퍼널 마지막 단계 `contract_signed` → `review_submitted`로 이어짐

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
| `partner_applied` | 파트너 지원 완료 | 파트너사 | ✅ |
| `proposal_submitted` | 제안서 제출 | 파트너사 | ✅ |
| `partner_selected` | 최종선정 확정 CTA 클릭 | 의뢰사 | ✅ |
| `contract_signed` | 계약 등록 완료 = 파트너 선정 확정 | 의뢰사 | ✅ |
| `participation_final_selected` | 최종 파트너 선정 토글 | 의뢰사 | ✅ |
| `consulting_inquiry_submitted` | 컨설팅 문의 접수 | 의뢰사 | ✅ |
| `review_submitted` | 제작 리뷰 등록 = 프로젝트 완료 | 의뢰사 | ✅ |

---

## 15. 퍼널 설계 (GA4 탐색 보고서 / Mixpanel 퍼널)

### 의뢰사 — 공고 프로젝트 퍼널

```
site_visit
  → signup_complete (user_type=advertiser)
    → step_1_partner_selection  ← 등록 마법사 시작
      → step_7_budget           ← 이탈률 집중 모니터링
        → project_submitted (project_type=공고)
          → participation_final_selected ← 최종 파트너 선정
            → contract_signed
              → review_submitted          ← 프로젝트 완료
```

### 의뢰사 — 1:1 프로젝트 퍼널

```
site_visit
  → signup_complete (user_type=advertiser)
    → step_1_partner_selection
      → project_submitted (project_type=1:1)
        → contract_signed
          → review_submitted             ← 프로젝트 완료
```

### 파트너사 — 지원 퍼널

```
site_visit
  → signup_complete (user_type=partner)
    → project_viewed (project_type=공고)  ← 발견
      → partner_applied                  ← 행동
        → proposal_submitted
          → partner_selected (수주)
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
| 컨설팅 문의 → 응답 완료율 | `consulting_inquiry_submitted` → `consulting_responded` |
| 대행사 탐색 깊이 | `partner_searched` → `agency_favorited` → `project_submitted` |

---

## 17. 구현 현황 요약

| 이벤트 | GA4 | Mixpanel | 상태 |
|--------|-----|----------|------|
| `page_view` | ✅ | ✅ | 완료 |
| `site_visit` | ✅ | ✅ | 완료 |
| `signup_funnel` | ✅ | ✅ | 완료 |
| `signup_complete` | ✅ | ✅ | 완료 |
| `step_N_화면명` (16단계) | ✅ | ✅ | 완료 |
| `project_submitted` | ✅ | ✅ | 완료 |
| `project_viewed` | ✅ | ✅ | 완료 |
| `partner_applied` | ✅ | ✅ | 완료 |
| `consulting_inquiry_submitted` | ✅ | ✅ | 완료 |
| `partner_searched` | ✅ | ✅ | 완료 |
| `agency_favorited` | ✅ | ✅ | 완료 |
| `participation_invite_toggled` | ✅ | ✅ | 완료 |
| `participation_ot_confirmed` | ✅ | ✅ | 완료 |
| `participation_ot_completed` | ✅ | ✅ | 완료 |
| `participation_pt_confirmed` | ✅ | ✅ | 완료 |
| `participation_pt_completed` | ✅ | ✅ | 완료 |
| `participation_final_selected` | ✅ | ✅ | 완료 (GA4 전환) |
| `review_saved` | ✅ | ✅ | 완료 |
| `review_submitted` | ✅ | ✅ | 완료 (GA4 전환) |
| `review_edited` | ✅ | ✅ | 완료 |
| `review_completed` | ✅ | ✅ | 완료 |
| `contract_saved` | ✅ | ✅ | 완료 |
| `contract_request_sent` | ✅ | ✅ | 완료 |
| `contract_signed` | ✅ | ✅ | 완료 (GA4 전환, partner_selected 통합) |
| `contract_cancelled` | ✅ | ✅ | 완료 |
| `admin_project_approved` | ✅ | ✅ | 완료 |
| `admin_project_rejected` | ✅ | ✅ | 완료 |
| `admin_notice_published` | ✅ | ✅ | 완료 |
| `admin_banner_published` | ✅ | ✅ | 완료 |
| `admin_notification_sent` | ✅ | ✅ | 완료 |
| `consulting_message_sent` | ✅ | ✅ | 완료 |
| `consulting_responded` | ✅ | ✅ | 완료 |
| `consulting_project_linked` | ✅ | ✅ | 완료 |
| `proposal_submitted` | ✅ | ✅ | 완료 (`/work/project/proposal/register`) |
| `partner_selected` | ✅ | ✅ | 완료 — selected_count, company_ids (최종선정 확정 CTA) |
| ~~`consulting_matched`~~ | - | - | 제거됨 (해당 구조 없음) |
| ~~`consulting_to_project`~~ | - | - | 제거됨 (전환 아닌 연결 구조) |
| `admin_member_warned` | ✅ | ✅ | 완료 |
| `admin_member_suspended` | ✅ | ✅ | 완료 |
| `admin_member_resumed` | ✅ | ✅ | 완료 |
| `admin_member_banned` | ✅ | ✅ | 완료 |
| `mypage_viewed` | ✅ | ✅ | 완료 — page: profile/withdraw/inquiry/notification_settings |
| `mypage_profile_saved` | ✅ | ✅ | 완료 — 내정보 저장 |
| `mypage_withdraw_attempted` | ✅ | ✅ | 완료 — reason_count, has_other_text |
| `mypage_inquiry_submitted` | ✅ | ✅ | 완료 — tab: general/report, has_attachment |
| `mypage_notification_settings_saved` | ✅ | ✅ | 완료 — app_on_count, email_on_count, sms_on_count |
| `experiment_viewed` | ✅ | ✅ | 완료 — experiment_id, variant (A/B 테스트 노출) |
| `time_on_page` | ✅ | ✅ | 완료 — path, duration_sec (SPA 경로 변경 시) |
| `page_exit` | ✅ | ✅ | 완료 — path, time_on_page_sec (브라우저 종료/이탈 시) |
| `referral_sent` | ✅ | ✅ | 완료 — method: copy/share (내정보 → 추천 링크 복사) |
| `referral_signed_up` | ✅ | ✅ | 완료 — referrer_code (?ref= 파라미터 가입 시 발송) |
| `activation_achieved` | ✅ | ✅ | 완료 — trigger_event, user_type (첫 핵심 행동 달성 시 자동 발사) |

### 자동 첨부 프로퍼티 (모든 이벤트 공통)
| 프로퍼티 | 설명 | 소스 |
|---------|------|------|
| `utm_source` | 유입 채널 (google, naver 등) | URL 파라미터 → sessionStorage 고정 |
| `utm_medium` | 매체 (cpc, email 등) | URL 파라미터 |
| `utm_campaign` | 캠페인명 | URL 파라미터 |
| `utm_term` | 키워드 | URL 파라미터 |
| `utm_content` | 광고 소재 구분 | URL 파라미터 |
| `user_id` | 로그인 사용자 ID | localStorage |
| `active_experiments` | 현재 진행 실험 목록 | localStorage |
| `exp_<id>` | 실험별 배정 variant | localStorage |

---

*이 문서는 ADMarket 플랫폼 GA4·Mixpanel 설계 기준입니다. 구현 완료 후 이 표를 업데이트하세요.*
