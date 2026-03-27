# 컴포넌트화 후보 정리

비슷한 UI/코드 패턴을 공통 컴포넌트로 뺄 수 있는 항목들을 정리했습니다.  
우선순위·범위에 맞춰 골라서 적용하면 됩니다.

---

## 1. 페이지 레이아웃

### 1.1 Admin 페이지 공통 레이아웃
- **패턴**: `<div className="space-y-6 p-6">` + `<h1 className="text-2xl font-bold text-foreground">` + `<p className="text-muted-foreground">` (선택)
- **사용처**  
  `pending-approval.tsx`, `stop-cancel.tsx`, `consulting-projects.tsx`, `announcements.tsx`, `admin-settings.tsx`, `activity-logs.tsx`, `consultants.tsx`, `company-verification.tsx`, `workflow/review.tsx`, `workflow/post-review.tsx`, `workflow/consumer-survey.tsx`, `workflow/settlement.tsx`, `workflow/proposal.tsx`, `workflow/matching.tsx`, `workflow/production.tsx`  
  그 외 `members.tsx`, `communication.tsx`, `bidding-projects.tsx`, `reports.tsx`, `projects.tsx`, `dashboard.tsx`, `calendar.tsx`, `one-on-one-projects.tsx`, `placeholder.tsx`, `project-detail.tsx`, `companies.tsx`, `reports-management.tsx` 등
- **제안 컴포넌트**: `@/components/layout/AdminPageLayout.tsx`  
  - props: `title`, `description?`, `children`  
  - 기존 `PageHeader`에 description 옵션 추가하거나, 이 레이아웃에서 통일

### 1.2 Work / Company 공통 레이아웃 (사이드바 + 메인)
- **패턴**: `work-container` → `work-content` → `flex gap-6` → `WorkSidebar` + `flex-1` 메인, 메인에 `work-title` 또는 `h1.work-title`
- **사용처 (work)**  
  `work/project/*` (proposal-view, review, contract, list, detail, participation, consumer-survey, post-review, schedule, deliverables, tvcf-review, selection, proposal, settlement, ot-guide), `work/home.tsx`, `work/file/file-repository.tsx`, `work/message/*`, `work/settings/*`, `work/company-profile.tsx`
- **사용처 (company)**  
  `company/company-portfolio/*` 전부 (intro, experience, awards, file-upload, manager-info, recent-projects, purpose, technique, company-info, portfolio, clients, staff, cotton-candy-activity, index 등)
- **제안 컴포넌트**: `@/components/layout/WorkAreaLayout.tsx` (또는 `SidebarContentLayout`)  
  - props: `sidebar`, `title`, `children`, `toolbar?` 등  
  - `work-container` / `work-content` / `flex gap-6` 한 곳에서 관리

### 1.3 카드형 콘텐츠 블록
- **패턴**: `bg-white rounded-lg shadow-sm p-6` 또는 `bg-white rounded-xl shadow-sm border border-gray-100 p-6`
- **사용처**  
  `work/project/proposal-view.tsx`, `work/project/review.tsx`, `work/project/contract.tsx`, `work/home.tsx`, `work/file/file-repository.tsx`, `work/message/sent-messages.tsx`, `work/message/message-detail.tsx`, `company/company-portfolio/*` (intro, experience, file-upload, manager-info, recent-projects, purpose, awards 등), `admin/workflow/review.tsx`, `admin_v2` 여러 페이지
- **제안 컴포넌트**: `@/components/ui/content-card.tsx` (또는 `PageCard`)  
  - props: `className?`, `variant?: 'default' | 'bordered'`, `children`

---

## 2. 폼 / 버튼

### 2.1 라벨 + 입력 블록
- **패턴**: `label` (text-sm font-medium text-gray-700 mb-2) + input/textarea
- **사용처**  
  `company/company-portfolio/intro.tsx`, `experience.tsx`, `file-upload.tsx`, `manager-info.tsx`, `company-info.tsx`, `clients.tsx`, `service/guides/inquiry.tsx`, `my/member-management.tsx` 등
- **제안 컴포넌트**: `@/components/ui/form-field.tsx`  
  - Label + slot(children), shadcn `Label` + spacing wrapper

### 2.2 다이얼로그/확인 액션 버튼 그룹
- **패턴**: `flex gap-3`(또는 gap-4) + 취소(Outline) + 확인(승인/반려/보내기 등)
- **사용처**  
  `admin/project-detail.tsx`, `admin/company-verification.tsx`, `components/admin/project-management.tsx`, `admin/workflow/contract.tsx`, `admin/workflow/proposal-view.tsx`, `admin_v2/projects/ContractManagement.tsx`, `ProductionManagement.tsx`, `ProposalManagement2.tsx`, `my/member-management.tsx`, `service/create-project/consulting-inquiry.tsx`, `admin/consultants.tsx`
- **제안 컴포넌트**: `@/components/ui/dialog-actions.tsx` 또는 `@/components/ui/confirm-actions.tsx`  
  - “취소 + 확인” / “취소 + 반려 + 승인” 등 slot으로 조합

### 2.3 테이블 래퍼 (Admin)
- **패턴**: `Table` + `TableHeader` + `TableBody` + 필터/페이지네이션
- **사용처**  
  `admin/consultants.tsx`, `admin/companies.tsx`, `admin/company-verification.tsx`, `admin/company-detail.tsx`, `admin/activity-logs.tsx`, `admin/reports-management.tsx` 등
- **제안**: 공통 스타일만 필요 시 `@/components/ui/data-table.tsx` 등으로 래퍼 추상화

---

## 3. 도메인 공통 (Admin / Service / Work / Company)

### 3.1 프로젝트 목록
- **admin**: `ProjectManagement` 사용 (projects, pending-approval, stop-cancel, consulting-projects)
- **service**: `service/project-list/list.tsx` — 검색/필터/카드 리스트
- **work**: `work/project/list.tsx` — WorkSidebar + 탭 + SearchBar + 카드 리스트
- **제안**:  
  - `@/components/project/ProjectListFilters.tsx` — 필터 UI 공통  
  - `@/components/project/ProjectCard.tsx` — 카드 한 장 UI 공통  
  페이지는 admin/service/work 각각 유지

### 3.2 제안서·시안 뷰 (ProposalView)
- **admin**: `admin/workflow/proposal-view.tsx` — ProposalDisputeGate + Tabs(컨셉) + 시안 테이블 + 다이얼로그
- **work**: `work/project/proposal-view.tsx` — WorkSidebar + 동일 Tabs/시안/문서 구조
- **제안 컴포넌트**: `@/components/project/ProposalViewContent.tsx` (또는 `ProposalAndSiansView`)  
  - 컨셉 탭 + 제안서 파일 + 시안 테이블 + 문서 목록. admin은 Gate로 감싸서 사용

### 3.3 회사 포트폴리오 레이아웃
- **패턴**: WorkSidebar + 메인, 회사 선택(select + 상세 버튼), 본문 카드
- **사용처**: `company/company-portfolio/*` 전부
- **제안 컴포넌트**  
  - `@/components/company/CompanyPortfolioLayout.tsx` — 사이드바 + 제목 + 회사 선택 + children  
  - `@/components/company/CompanySelectHeader.tsx` — 회사 select + ArrowUpRight 상세 보기 한 블록

---

## 4. UI 프리미티브

### 4.1 “목록으로” 버튼
- **이미 있음**: `@/components/BackToListButton.tsx` (href / onClick, 기본 문구 “리스트로 돌아가기”)
- **사용처**: `project-management.tsx`, `AdminWorkflowHeader.tsx`, `admin/project-detail.tsx`, `work/company-profile.tsx`
- **통일 제안**:  
  `service/project-list/detail.tsx` (“목록으로 돌아가기”), `admin/company-detail.tsx` (“목록으로”) → `BackToListButton`으로 교체

### 4.2 비밀번호/사유 입력 Gate 모달 (3종)
- **패턴**: 오버레이 + 모달 + 제목(AlertTriangle) + 설명 + Label/Input(비밀번호 또는 사유) + 취소/확인
- **사용처**  
  `components/admin/admin-action-gate.tsx`, `components/admin/contract-access-gate.tsx`, `components/admin/proposal-dispute-gate.tsx`
- **제안 컴포넌트**: `@/components/admin/SecureActionGate.tsx`  
  - props: `open`, `title`, `description`, `reasonLabel`, `reasonPlaceholder`, `onCancel`, `onConfirm(reason)`, 필요 시 password 필드 옵션  
  - 위 세 Gate를 이 컴포넌트 기반으로 리팩터

### 4.3 탭 바
- **현황**: `@/components/ui/tabs` 사용 중. 도메인별 탭 설정만 상수/유틸로 두면 됨.
- **제안**: “프로젝트 단계” 등 공통 탭 설정은 한 곳에서 관리

### 4.4 ProjectPageHeader / ProjectPageLayout
- **이미 있음**: `@/components/project/ProjectPageHeader.tsx`, `ProjectPageLayout`
- **사용처**: admin_v2의 ContractManagement, ProjectManagement, ProposalManagement2, ProductionManagement 등
- **제안**: admin v1의 “제목 + 설명”만 있는 페이지는 1.1 `AdminPageLayout`로 통일; 프로젝트 선택 등이 필요하면 `ProjectPageHeader` / `ProjectPageLayout` 재사용

---

## 5. 데이터 표시

### 5.1 프로젝트 상태 뱃지
- **패턴**: 상태 코드 → 한글 라벨 + 색상 클래스
- **사용처**  
  `components/Badges.tsx`, `admin_v2/projects/ProjectManagement.tsx`, `MatchingManagement.tsx`, `ProductionManagement.tsx`, `ProposalManagement2.tsx`, `admin/company-detail.tsx`, `CompanyDetailTabs.tsx`, `work/project/list.tsx`
- **제안 컴포넌트**: `@/components/project/ProjectStatusBadge.tsx`  
  - status → 라벨 + Tailwind 클래스 매핑 한 곳에서. Badges.tsx 프로젝트 관련 + admin_v2 매핑 통합

### 5.2 예산 표시
- **패턴**: “총예산” 라벨 + 금액(또는 범위) + “VAT 별도”/“비공개” 등
- **사용처**  
  `work/project/list.tsx`, `work/project/detail.tsx`, `admin_v2/projects/ContractGPTManagement.tsx`
- **제안 컴포넌트**: `@/components/project/BudgetDisplay.tsx`  
  - props: `amount`, `detail?`, `isPublic?`, `format?` 등. `formatCurrency`는 lib로 두고 컴포넌트에서 사용

### 5.3 기업명 표시
- **제안**: 단일 “기업명만” 컴포넌트는 선택. `ProjectCard` 등으로 카드/행을 통일하면 기업명은 그 안의 한 필드로 처리 가능

---

## 요약 표

| 구분 | 패턴 요약 | 제안 컴포넌트 |
|------|-----------|----------------|
| 레이아웃 | Admin `space-y-6 p-6` + h1 + description | `@/components/layout/AdminPageLayout.tsx` |
| 레이아웃 | Work/Company 사이드바 + 메인 | `@/components/layout/WorkAreaLayout.tsx` |
| 레이아웃 | 흰색 카드 블록 (rounded-lg shadow-sm p-6) | `@/components/ui/content-card.tsx` |
| 폼 | label + input 블록 | `@/components/ui/form-field.tsx` |
| 폼 | 취소/승인/반려 버튼 그룹 | `@/components/ui/dialog-actions.tsx` |
| 도메인 | 프로젝트 목록 카드·필터 | `ProjectCard`, `ProjectListFilters` (`@/components/project/`) |
| 도메인 | 제안서·시안 뷰 | `@/components/project/ProposalViewContent.tsx` |
| 도메인 | 회사 포트폴리오 레이아웃 + 회사 선택 | `CompanyPortfolioLayout.tsx`, `CompanySelectHeader.tsx` |
| 프리미티브 | 목록으로 버튼 | 기존 `BackToListButton` 사용 확대 |
| 프리미티브 | 비밀번호/사유 Gate 모달 3종 | `@/components/admin/SecureActionGate.tsx` |
| 데이터 | 프로젝트 상태 뱃지 | `@/components/project/ProjectStatusBadge.tsx` |
| 데이터 | 예산 표시 | `@/components/project/BudgetDisplay.tsx` |

---

원하는 카테고리만 골라 단계적으로 적용하면 됩니다.  
특정 컴포넌트의 props/시그니처를 구체화하고 싶으면 해당 항목만 지정해서 요청하면 됩니다.
