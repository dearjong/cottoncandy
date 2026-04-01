# 개발 인수인계 — Admin 업무 플로우

| 항목 | 내용 |
| --- | --- |
| **문서 버전** | 0.2 |
| **대상** | 백엔드·프론트 (API 연동, 권한, 영속화, 레이아웃 통일) |
| **이 문서의 역할** | 인수인계 **1번 문서**. 플로우·URL·페이지 파일을 한 번에 매핑하고, 상세 UI 과제·ADM은 아래 근거 문서로 넘김 |
| **근거 문서** | [admin-workflow-v0.3-mvp.md](./admin-workflow-v0.3-mvp.md) — 플로우별 **구현됨/부분 구현**·「앞으로 구현할 것」<br>[admin-requirements.md](./admin-requirements.md) — ADM ID, 보안·감사 요구 |
| **코드 기준** | `client/src/pages/admin/*`, `client/src/components/admin/*`, 라우트 `client/src/App.tsx` |

---

## 개발팀이 읽는 순서 (권장)

1. **본 문서** — 어떤 URL이 어떤 업무·파일인지 파악  
2. **[admin-workflow-v0.3-mvp.md](./admin-workflow-v0.3-mvp.md)** — 백로그로 쪼갤 **플로우 단위 과제**  
3. **[admin-requirements.md](./admin-requirements.md)** — 정책·ADM·보안 원칙  

---

## 1. 운영·보안 원칙 (구현 시 반영)

### 1.1 민감정보

- 대화·계약·제안·정산·증빙 등 **민감정보**는 회원/기업/프로젝트 **일반 화면에 상시 노출하지 않음**.  
- 열람은 **`/admin/security/messages`**(보안자료)에서 **유형 필터 + 검색** 중심 (사유·감사는 요구사항 문서).

### 1.2 현재 코드 성격

- UI는 대부분 **목업·클라이언트 상태**.  
- **실 API, RBAC, 감사 로그 DB 저장**은 미연동 — 이슈로 분리.

---

## 2. 플로우 영역 ↔ MVP 문서 섹션

| MVP 문서 § | 주제 | 본 문서 § |
| --- | --- | --- |
| §2 | 프로젝트 운영 | [§3.1](#31-프로젝트-운영) |
| §3 | 회원·기업·컨설팅 | [§3.2](#32-회원기업컨설팅) |
| §4 | CS·신고 | [§3.3](#33-계약리뷰cs신고콘텐츠통계) 일부 |
| §5 | 콘텐츠·통계 | [§3.3](#33-계약리뷰cs신고콘텐츠통계) |
| §6 | 시스템·보안 | [§3.4](#34-시스템보안) |

---

## 3. 플로우 → 라우트 → 페이지 파일

경로는 프로덕션 기준 URL. 페이지는 `client/src/pages/admin/` 기준 파일명(확장자 제외).

### 3.1 프로젝트 운영

| 업무(요약) | URL | 페이지 (`pages/admin/…`) |
| --- | --- | --- |
| 대시보드 | `/admin` | `dashboard` |
| 캘린더 | `/admin/calendar` | `calendar` |
| 진행 현황 | `/admin/progress` | `progress` |
| 프로젝트 목록·id 진입 | `/admin/projects`, `/admin/projects/:id` | `projects` |
| 프로젝트 상세(별도) | `/admin/project-detail/:id` | `project-detail` |
| 승인 대기 | `/admin/pending-approval` | `pending-approval` |
| 중단/취소 | `/admin/stop-cancel` | `stop-cancel` |
| 공고 목록 | `/admin/bidding` | `bidding-projects` |
| 1:1 목록 | `/admin/one-on-one` | `one-on-one-projects` |

**절차별 워크플로 (레이아웃 있음)** — `components/admin/admin-layout.tsx` 안에서 렌더:

| URL | 페이지 |
| --- | --- |
| `/admin/workflow/matching` | `workflow/matching` |
| `/admin/workflow/proposal` | `workflow/proposal` |
| `/admin/workflow/proposal/view/:companyId` | `workflow/proposal-view` |
| `/admin/workflow/contract` | `workflow/contract` |
| `/admin/workflow/production` | `workflow/production` |
| `/admin/workflow/settlement` | `workflow/settlement` |
| `/admin/workflow/review` | `workflow/review` |
| `/admin/workflow/post-review` | `workflow/post-review` |
| `/admin/workflow/consumer-survey` | `workflow/consumer-survey` |
| `/admin/workflow/tvcf-review` | `workflow/tvcf-review` |

**워크플로 embed** (모달 등용, 사이드바 없음): `/admin/workflow-embed/…` → 동일 workflow 컴포넌트.

**공유 UI (참고):** `components/admin/project-management.tsx` — 승인·중단/취소 등 다이얼로그.

### 3.2 회원·기업·컨설팅

| 업무(요약) | URL | 페이지 |
| --- | --- | --- |
| 회원 | `/admin/members` | `members` |
| 기업 목록 | `/admin/companies` | `companies` |
| 기업 상세 | `/admin/companies/:id` | `company-detail` |
| 기업 인증 | `/admin/company-verification` | `company-verification` |
| 소개서·포트폴리오 | `/admin/company-portfolios` | `company-portfolios` |
| 참여 현황 | `/admin/participation` | `participation` |
| 등급 정책 | `/admin/system/grades` | `system/CompanyGradeManagement` |
| 컨설팅 목록 | `/admin/consulting` | `consulting-projects` |
| 컨설팅 상세 | `/admin/consulting/:id` | `consulting-project-detail` |
| 컨설턴트 | `/admin/consultants` | `consultants` |
| 관련 프로젝트 | `/admin/consulting/related-projects` | `consulting-related-projects` |

**레이아웃 참고:** `companies`, `companies/:id`, `participation` 등 일부 라우트는 `App.tsx`에서 `AdminLayout` 없이 직접 마운트될 수 있음 — 운영 화면 통일 시 과제.

### 3.3 계약·리뷰·CS·신고·콘텐츠·통계

| 업무(요약) | URL | 페이지 |
| --- | --- | --- |
| 계약·정산 목록 | `/admin/contracts` | `contracts` |
| 리뷰 | `/admin/reviews` | `reviews` |
| 커뮤니케이션 | `/admin/communication` | `communication` |
| 신고 | `/admin/reports-management` | `reports-management` |
| 통계/리포트 | `/admin/reports` | `reports` |
| 공지·배너 | `/admin/announcements` | `announcements` |
| 알림 설정 | `/admin/system/notifications` | `system/NotificationSettings` |

### 3.4 시스템·보안

| 업무(요약) | URL | 페이지 |
| --- | --- | --- |
| 관리자 설정 | `/admin/settings` | `admin-settings` |
| 플랫폼 설정 | `/admin/settings/platform` | `settings/platform` |
| 사용자 로그(설정 하위) | `/admin/settings/logs` | `settings/logs` |
| 활동 로그 | `/admin/activity-logs` | `activity-logs` |
| 보안자료 | `/admin/security/messages` | `security/messages` |

---

## 4. 내비게이션(IA) 코드 위치

| 역할 | 경로 |
| --- | --- |
| 사이드바 메뉴 | `client/src/components/admin/app-sidebar.tsx` |
| Admin 셸 | `client/src/components/admin/admin-layout.tsx` |

---

## 5. 백로그 쪼개기 가이드

- **소스:** [admin-workflow-v0.3-mvp.md](./admin-workflow-v0.3-mvp.md) 표의 **「부분 구현」** 행 → 이슈 1행당 1~N개 태스크.  
- **권장 단위:** 화면 단위가 아니라 **상태 전이 + 감사 이벤트**(예: 승인/반려, 사유 필수, 목록·상세 동기화).  
- **정책:** ADM·보안은 [admin-requirements.md](./admin-requirements.md) §10 등과 맞출 것.

---

## 6. 다음 인수인계 문서 (예정)

| 순서 | 문서 | 내용 |
| --- | --- | --- |
| ✓ | 본 문서 | 플로우·라우트·파일 맵 |
| 다음 | API·권한 스펙 | REST/GraphQL 초안, RBAC, 감사 필드 |
| 다음 | 도메인·상태 | 프로젝트·계약·정산·신고 상태머신 |

---

*최종 갱신: 2026-04-01 | 라우트는 `client/src/App.tsx` 기준*
