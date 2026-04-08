# ADMarket GA4 · Mixpanel 이벤트 정의서

> 버전: v1.0 | 작성일: 2026-04-08  
> 적용 툴: Google Analytics 4 + Mixpanel (동일 이벤트명 사용)

---

## 1. 설계 원칙

- 이벤트명: `snake_case` 통일 (GA4·Mixpanel 공통)
- 파라미터명: `snake_case` 통일
- GA4 파라미터 제한: 이벤트당 최대 25개, 값 최대 100자
- 전환(Conversion) 이벤트는 GA4 관리 콘솔에서 별도 마킹 필요

---

## 2. 자동 수집 이벤트 (코드 불필요)

| 이벤트명 | 수집 시점 | 툴 |
|---------|---------|-----|
| `page_view` | 페이지 이동 시 | GA4 + Mixpanel |
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

| 이벤트명 | 트리거 | 전환 여부 |
|---------|--------|---------|
| `site_visit` | 세션당 최초 1회 진입 | - |

**파라미터**

| 파라미터 | 예시값 |
|---------|--------|
| `path` | `/` |
| `session_id` | `uuid-xxxx` |

---

## 4. 회원가입 퍼널

| 이벤트명 | 트리거 | GA4 전환 |
|---------|--------|---------|
| `signup_funnel` | 각 단계 화면 진입 시 | - |
| `signup_complete` | 이메일 인증 완료 시 | ✅ 전환 |

**`signup_funnel` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `step` | `1` / `2` / `3` | 단계 번호 |
| `step_name` | `account` / `phone` / `email` | 단계명 |
| `path` | `/signup` | 경로 |

---

## 5. 프로젝트 등록 퍼널 (의뢰사)

> 프로젝트 등록 마법사 각 화면 진입 시 자동 추적

| 이벤트명 패턴 | 예시 | 설명 |
|-------------|------|------|
| `step_{N}_{화면명}` | `step_1_partner_selection` | 화면 진입 |
| `step_{N}_{화면명}_cta` | `step_2_project_name_cta` | 버튼 클릭 |

**공통 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `wizard_step` | `1` | 마법사 순서 |
| `screen` | `partner_selection` | 화면 식별자 |
| `title_ko` | `파트너 유형 선택` | 화면 제목(KR) |
| `action` | `enter` / `next` / `back` / `submit` | 행동 유형 |
| `path` | `/create-project/step1` | 경로 |

**등록 단계 목록**

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

## 6. 핵심 비즈니스 이벤트 (미구현 → 개발 요청 필요)

### 6-1. 프로젝트

| 이벤트명 | 트리거 | GA4 전환 | 우선순위 |
|---------|--------|---------|---------|
| `project_submitted` | 프로젝트 최종 제출 | ✅ | 높음 |
| `project_approved` | 관리자 승인 | - | 높음 |
| `project_rejected` | 관리자 반려 | - | 중간 |
| `project_cancelled` | 프로젝트 취소 | - | 중간 |

**`project_submitted` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `project_id` | `PID-20240615-0001` | 프로젝트 ID |
| `project_type` | `공고` / `1:1` | 유형 |
| `partner_type` | `제작` / `대행` | 파트너 유형 |
| `budget_range` | `3000-5000` | 예산 구간(만원) |
| `media_channel` | `TV` / `디지털` | 매체 |

---

### 6-2. 파트너 매칭

| 이벤트명 | 트리거 | GA4 전환 | 우선순위 |
|---------|--------|---------|---------|
| `partner_applied` | 파트너사 지원 완료 | ✅ | 높음 |
| `proposal_submitted` | 제안서 제출 | ✅ | 높음 |
| `partner_selected` | 파트너 선정 완료 | ✅ | 높음 |
| `contract_signed` | 계약 체결 | ✅ | 높음 |

**`partner_selected` 파라미터**

| 파라미터 | 예시값 |
|---------|--------|
| `project_id` | `PN-20240614-0001` |
| `partner_type` | `제작사` / `대행사` |
| `applicant_count` | `5` |
| `days_to_select` | `12` |

---

### 6-3. 컨설팅

| 이벤트명 | 트리거 | GA4 전환 |
|---------|--------|---------|
| `consulting_inquiry_submitted` | 컨설팅 문의 제출 | ✅ |
| `consulting_matched` | 컨설턴트 매칭 완료 | ✅ |
| `consulting_to_project` | 컨설팅 → 프로젝트 전환 | ✅ |

---

### 6-4. 관리자 운영

| 이벤트명 | 트리거 |
|---------|--------|
| `admin_project_approved` | 관리자 프로젝트 승인 |
| `admin_project_rejected` | 관리자 프로젝트 반려 |
| `admin_member_suspended` | 회원 정지 처리 |
| `admin_notice_published` | 공지사항 게시 |
| `admin_banner_published` | 배너 게시 |
| `admin_notification_sent` | 알림 발송 |

---

## 7. GA4 전환 이벤트 설정 목록

GA4 관리 콘솔 → 이벤트 → 아래 이벤트를 "전환으로 표시"

| 이벤트명 | 전환 의미 |
|---------|----------|
| `signup_complete` | 회원가입 완료 |
| `project_submitted` | 프로젝트 등록 완료 |
| `partner_applied` | 파트너 지원 완료 |
| `proposal_submitted` | 제안서 제출 |
| `partner_selected` | 파트너 선정 |
| `contract_signed` | 계약 체결 |
| `consulting_inquiry_submitted` | 컨설팅 문의 |
| `consulting_to_project` | 컨설팅 → 프로젝트 전환 |

---

## 8. GA4 퍼널 설계 (탐색 보고서)

### 의뢰사 핵심 퍼널

```
site_visit
  → signup_complete
    → project_submitted
      → partner_selected
        → contract_signed
```

### 파트너사 핵심 퍼널

```
site_visit
  → signup_complete
    → partner_applied
      → proposal_submitted
        → partner_selected (수주)
```

### 프로젝트 등록 이탈 퍼널

```
step_1_partner_selection
  → step_7_budget (이탈률 주목)
    → step_16_additional_description
      → project_submitted
```

---

## 9. Mixpanel 퍼널 / 코호트 설계

| 분석 목적 | 퍼널 구성 |
|---------|---------|
| 등록 전환율 | `site_visit` → `signup_complete` |
| 의뢰 전환율 | `signup_complete` → `project_submitted` |
| 매칭 전환율 | `project_submitted` → `partner_selected` |
| 계약 전환율 | `partner_selected` → `contract_signed` |
| 지원 전환율 | `signup_complete` → `partner_applied` |

---

## 10. 구현 현황

| 이벤트 | GA4 | Mixpanel | 상태 |
|--------|-----|----------|------|
| `page_view` | ✅ | ✅ | 완료 |
| `site_visit` | ✅ | ✅ | 완료 |
| `signup_funnel` | ✅ | ✅ | 완료 |
| `signup_complete` | ✅ | ✅ | 완료 |
| `step_N_화면명` | ✅ | ✅ | 완료 |
| `project_submitted` | ⬜ | ⬜ | 개발 필요 |
| `partner_applied` | ⬜ | ⬜ | 개발 필요 |
| `partner_selected` | ⬜ | ⬜ | 개발 필요 |
| `contract_signed` | ⬜ | ⬜ | 개발 필요 |
| `consulting_inquiry_submitted` | ⬜ | ⬜ | 개발 필요 |

---

*이 문서는 ADMarket 플랫폼 기반으로 작성된 초안입니다. 실제 구현 전 개발팀 검토 필요.*
