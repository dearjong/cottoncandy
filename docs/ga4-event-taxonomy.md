# ADMarket GA4 · Mixpanel 이벤트 정의서

> 버전: v2.0 | 작성일: 2026-04-08  
> 적용 툴: Google Analytics 4 + Mixpanel (동일 이벤트명·파라미터 사용)

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
| `proposal_submitted` | 제안서 제출 | ✅ 전환 | ⬜ 개발 필요 |
| `partner_selected` | 파트너로 선정됨 | ✅ 전환 | ⬜ 개발 필요 |
| `contract_signed` | 계약 체결 | ✅ 전환 | ⬜ 개발 필요 |

**`partner_applied` 파라미터**

| 파라미터 | 예시값 | 설명 |
|---------|--------|------|
| `project_id` | `PN-20240614-0001` | 프로젝트 ID |
| `project_type` | `공고` / `1:1` | 유형 구분 |
| `partner_type` | `제작사` / `대행사` | 파트너 유형 |

---

## 8. 컨설팅 퍼널

| 이벤트명 | 트리거 | GA4 전환 | 구현 |
|---------|--------|---------|------|
| `consulting_inquiry_submitted` | 컨설팅 문의 최종 접수 | ✅ 전환 | ✅ 완료 |
| `consulting_matched` | 컨설턴트 매칭 완료 | ✅ 전환 | ⬜ 개발 필요 |
| `consulting_to_project` | 컨설팅 → 프로젝트 전환 | ✅ 전환 | ⬜ 개발 필요 |

**`consulting_inquiry_submitted` 파라미터**

| 파라미터 | 예시값 |
|---------|--------|
| `title` | `TV CF 제작 문의` (100자 이하) |
| `has_attachment` | `true` / `false` |
| `user_type` | `advertiser` |

---

## 9. 관리자 운영 이벤트

> 관리자 행동은 별도 GA4 Property 또는 Mixpanel 전용 프로젝트 권장

| 이벤트명 | 트리거 | 구현 |
|---------|--------|------|
| `admin_project_approved` | 관리자 프로젝트 승인 | ✅ 완료 |
| `admin_project_rejected` | 관리자 프로젝트 반려 | ✅ 완료 |
| `admin_member_suspended` | 회원 정지 처리 | ⬜ 개발 필요 (회원관리 페이지 정지 기능 UI 필요) |
| `admin_notice_published` | 공지사항 게시 | ✅ 완료 |
| `admin_banner_published` | 배너 게시 | ✅ 완료 |
| `admin_notification_sent` | 알림 발송 | ✅ 완료 |

---

## 10. GA4 전환 이벤트 설정 목록

> GA4 관리 콘솔 → 이벤트 → 아래 이벤트를 "전환으로 표시"

| 이벤트명 | 전환 의미 | 역할 |
|---------|----------|------|
| `signup_complete` | 회원가입 완료 | 공통 |
| `project_submitted` | 프로젝트 등록 완료 | 의뢰사 |
| `partner_applied` | 파트너 지원 완료 | 파트너사 |
| `proposal_submitted` | 제안서 제출 | 파트너사 |
| `partner_selected` | 파트너 선정 | 의뢰사 |
| `contract_signed` | 계약 체결 | 공통 |
| `consulting_inquiry_submitted` | 컨설팅 문의 | 의뢰사 |
| `consulting_to_project` | 컨설팅 → 프로젝트 전환 | 의뢰사 |

---

## 11. 퍼널 설계 (GA4 탐색 보고서 / Mixpanel 퍼널)

### 의뢰사 — 공고 프로젝트 퍼널

```
site_visit
  → signup_complete (user_type=advertiser)
    → step_1_partner_selection  ← 등록 마법사 시작
      → step_7_budget           ← 이탈률 집중 모니터링
        → project_submitted (project_type=공고)
          → partner_selected
            → contract_signed
```

### 의뢰사 — 1:1 프로젝트 퍼널

```
site_visit
  → signup_complete (user_type=advertiser)
    → step_1_partner_selection
      → project_submitted (project_type=1:1)
        → contract_signed
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

### 컨설팅 전환 퍼널

```
site_visit
  → consulting_inquiry_submitted
    → consulting_matched
      → consulting_to_project            ← 컨설팅 → 실제 프로젝트
        → project_submitted
```

---

## 12. Mixpanel 코호트 분석 설계

| 분석 목적 | 퍼널 / 코호트 구성 |
|---------|---------|
| 의뢰사 가입 → 등록 전환율 | `signup_complete (advertiser)` → `project_submitted` |
| 공고 등록 이탈 단계 파악 | `step_1_*` ~ `step_16_*` → `project_submitted` |
| 파트너사 발견 → 지원 전환율 | `project_viewed` → `partner_applied` |
| 매칭 → 계약 전환율 | `partner_selected` → `contract_signed` |
| 컨설팅 전환율 | `consulting_inquiry_submitted` → `consulting_to_project` |
| 대행사 탐색 깊이 | `partner_searched` → `agency_favorited` → `project_submitted` |

---

## 13. 구현 현황 요약

| 이벤트 | GA4 | Mixpanel | 상태 |
|--------|-----|----------|------|
| `page_view` | ✅ | ✅ | 완료 |
| `site_visit` | ✅ | ✅ | 완료 |
| `signup_funnel` | ✅ | ✅ | 완료 |
| `signup_complete` | ✅ | ✅ | 완료 (user_type 추가됨) |
| `step_N_화면명` (16단계) | ✅ | ✅ | 완료 |
| `project_submitted` | ✅ | ✅ | 완료 |
| `project_viewed` | ✅ | ✅ | 완료 |
| `partner_applied` | ✅ | ✅ | 완료 |
| `consulting_inquiry_submitted` | ✅ | ✅ | 완료 |
| `partner_searched` | ✅ | ✅ | 완료 |
| `agency_favorited` | ✅ | ✅ | 완료 |
| `admin_project_approved` | ✅ | ✅ | 완료 |
| `admin_project_rejected` | ✅ | ✅ | 완료 |
| `admin_notice_published` | ✅ | ✅ | 완료 |
| `admin_banner_published` | ✅ | ✅ | 완료 |
| `admin_notification_sent` | ✅ | ✅ | 완료 |
| `proposal_submitted` | ⬜ | ⬜ | 제안서 제출 UI 구현 후 추가 |
| `partner_selected` | ⬜ | ⬜ | 파트너 선정 UI 구현 후 추가 |
| `contract_signed` | ⬜ | ⬜ | 계약 체결 UI 구현 후 추가 |
| `consulting_matched` | ⬜ | ⬜ | 컨설턴트 매칭 UI 구현 후 추가 |
| `consulting_to_project` | ⬜ | ⬜ | 컨설팅→프로젝트 전환 UI 구현 후 추가 |
| `admin_member_suspended` | ⬜ | ⬜ | 회원 정지 기능 UI 구현 후 추가 |

---

*이 문서는 ADMarket 플랫폼 GA4·Mixpanel 설계 기준입니다. 구현 완료 후 이 표를 업데이트하세요.*
