# 개발 인수인계 — Admin 업무 플로우 (v0.1)

| 항목 | 내용 |
| --- | --- |
| **대상** | 백엔드·프론트 개발 (API 연동·권한·영속화 담당) |
| **목적** | Admin **업무 흐름·라우트·구현 범위**를 한 문서에서 파악하고, 상세 요구는 기존 문서로 추적 |
| **근거 문서** | [admin-workflow-v0.3-mvp.md](./admin-workflow-v0.3-mvp.md) (플로우 상세·부분 구현 시 UI 과제)<br>[admin-requirements.md](./admin-requirements.md) (ADM ID·요구·보안 원칙) |
| **코드 기준** | `client/src/pages/admin/*`, `client/src/components/admin/*`, 라우트 `client/src/App.tsx` |

---

## 1. 개발 시 반드시 알아둘 운영 원칙

### 1.1 민감정보 열람

- 대화·계약·제안·정산·증빙 등 **민감정보는** 개별 회원/기업/프로젝트 화면에서 상시 노출하지 않음.
- **`/admin/security/messages`**(보안자료)에서 **유형 필터 + 검색**으로만 열람 (사유·감사는 정책/요구사항 문서 참고).

### 1.2 현재 구현 성격

- 대부분 화면은 **목업·로컬 상태** 기준. **API·RBAC·감사 로그 영속화**는 별도 백로그.

---

## 2. 플로우 → 라우트 → 페이지 컴포넌트 (빠른 맵)

아래는 **업무 영역별**로 “어디 URL에서 무슨 페이지가 뜨는지”만 정리한 표입니다.  
세부 사용자 스토리·“앞으로 구현할 것”은 **MVP 워크플로 문서** 표를 따른다.

### 2.1 프로젝트 운영

| 업무 흐름(요약) | 경로 | 페이지 컴포넌트 (`client/src/pages/admin/…`) |
| --- | --- | --- |
| 대시보드·KPI | `/admin` | `dashboard` |
| 캘린더·진행 현황 | `/admin/calendar`, `/admin/progress` | `calendar`, `progress` |
| 프로젝트 목록·상세(운영) | `/admin/projects`, `/admin/projects/:id` | `projects` |
| 프로젝트 상세(별도 뷰) | `/admin/project-detail/:id` | `project-detail` |
| 승인 대기 | `/admin/pending-approval` | `pending-approval` |
| 중단/취소 요청 | `/admin/stop-cancel` | `stop-cancel` |
| 공고 / 1:1 목록 | `/admin/bidding`, `/admin/one-on-one` | `bidding-projects`, `one-on-one-projects` |
| 절차별 워크플로 | `/admin/workflow/matching` ~ `tvcf-review` | `workflow/*` |
| 워크플로(embed, 사이드바 없음) | `/admin/workflow-embed/*` | 동일 workflow 컴포넌트 |

핵심 공유 UI: `components/admin/project-management.tsx` 등 (승인·중단/취소 다이얼로그 포함).

### 2.2 회원·기업·컨설팅

| 업무 흐름(요약) | 경로 | 페이지 컴포넌트 |
| --- | --- | --- |
| 회원 관리 | `/admin/members` | `members` |
| 기업 목록·상세 | `/admin/companies`, `/admin/companies/:id` | `companies`, `company-detail` *(일부 라우트는 `AdminLayout` 미적용 — 레이아웃 통일 시 과제)* |
| 기업 인증 | `/admin/company-verification` | `company-verification` |
| 소개서·포트폴리오 조회 | `/admin/company-portfolios` | `company-portfolios` |
| 참여 현황 | `/admin/participation` | `participation` |
| 등급 정책 | `/admin/system/grades` | `system/CompanyGradeManagement` |
| 컨설팅 목록·상세 | `/admin/consulting`, `/admin/consulting/:id` | `consulting-projects`, `consulting-project-detail` |
| 컨설턴트 | `/admin/consultants` | `consultants` |
| 관련 프로젝트 | `/admin/consulting/related-projects` | `consulting-related-projects` |

### 2.3 계약·리뷰·CS·신고·콘텐츠·통계

| 업무 흐름(요약) | 경로 | 페이지 컴포넌트 |
| --- | --- | --- |
| 계약 & 정산 목록 | `/admin/contracts` | `contracts` |
| 리뷰 관리 | `/admin/reviews` | `reviews` |
| 커뮤니케이션(CS) | `/admin/communication` | `communication` |
| 신고 관리 | `/admin/reports-management` | `reports-management` |
| 통계/리포트 | `/admin/reports` | `reports` |
| 공지·배너 | `/admin/announcements` | `announcements` |
| 알림 설정 | `/admin/system/notifications` | `system/NotificationSettings` |

### 2.4 시스템·보안

| 업무 흐름(요약) | 경로 | 페이지 컴포넌트 |
| --- | --- | --- |
| 관리자·플랫폼·로그 | `/admin/settings`, `/admin/settings/platform`, `/admin/settings/logs` | `admin-settings`, `settings/platform`, `settings/logs` |
| 활동 로그(별도) | `/admin/activity-logs` | `activity-logs` |
| 보안자료 | `/admin/security/messages` | `security/messages` |

---

## 3. 사이드바(IA)와 코드

- 메뉴 정의: `client/src/components/admin/app-sidebar.tsx`
- 레이아웃(헤더·사이드바 래퍼): `client/src/components/admin/admin-layout.tsx`

---

## 4. 개발 백로그에 넣기 좋은 단위 (플로우 기준)

MVP 워크플로 표의 **「부분 구현」** 행을 그대로 이슈로 쪼개면 됨. 예:

- 프로젝트: 승인/반려·사유·목록/상세 상태 동기화
- 회원: 상세·조치·사유·민감정보 비노출
- CS: 답변·미답변 구분
- 보안자료: 필터·검색·사유·열람 기록

API 설계 시 **화면별가 아니라 “플로우 단위(상태 전이·감사 이벤트)”**로 묶는 것을 권장.

---

## 5. 다음 인수인계 문서(예정)

| 순서 | 문서 | 내용 |
| --- | --- | --- |
| 1 | 본 문서 (Admin flow) | 플로우·라우트·컴포넌트 맵 |
| 2 | API / 권한 스펙 | 엔드포인트·RBAC·감사 필드 (별도 초안) |
| 3 | 데이터 모델 / 상태머신 | 프로젝트·계약·정산·신고 등 도메인 정의 |

---

*문서 버전: 0.1 | 기준 코드: 레포 `main` (라우트는 `App.tsx` 기준)*
