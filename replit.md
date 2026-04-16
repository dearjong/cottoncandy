# ADMarket - Admin Platform

## Overview

ADMarket는 광고주(의뢰사)와 광고 제작사(파트너)를 연결하는 프로젝트 매칭 플랫폼입니다. 본 프로젝트는 이 플랫폼의 관리자 패널을 개발하며, 기획자가 Figma 대신 Replit을 프로토타이핑 도구로 활용하는 것을 목표로 합니다. 주요 기능은 광고 프로젝트 관리, 계약 및 정산, 리뷰 관리, 컨설팅 관리, 회원/기업 관리, 운영 센터, 통계/리포트, 시스템 설정 등입니다.

## User Preferences

- 커뮤니케이션: 간결한 한국어, 기술 용어 최소화
- 디자인 일관성: 프로젝트 생성 포맷과 완벽하게 동일하게
- 화면 목적: 기획자 프로토타입 (Figma 대체)

## System Architecture

### Frontend (Vite + React 18 + TypeScript)
- **Bundler**: Vite
- **Routing**: Wouter
- **State Management**: @tanstack/react-query
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI 기반)
- **Animation**: Framer Motion
- **UI/UX Design**:
    - 모든 페이지 `bg-white` 배경
    - 인라인 스타일 금지, CSS 클래스만 사용
    - 버튼 스타일: `btn-pink` / `btn-white` (font-weight: 400)
    - 레이아웃 컴포넌트: `work-container`, `work-content`, `page-container`, `page-content`
    - 페이지 헤더 패턴: `<PageHeader title="..." description="..." hidePeriodFilter? />`
    - 뱃지 스타일: 미답변 (`destructive`), 답변완료 (`outline + text-muted-foreground`)
    - 관리자 버튼: 반려 (`variant="outline"`), 승인 (`bg-pink-600 hover:bg-pink-700`)
    - 디자인 토큰: `--cotton-candy-pink: #EA4C89`, `--cotton-pastel-cobalt: #16C2E9`
    - 팝업 클래스: `popup-title`, `popup-description`, `popup-buttons`

### Backend (Express + Node.js)
- **Runtime**: Node.js 20 + tsx
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (Neon serverless)
- **Storage**: DbStorage (if `DATABASE_URL` exists) / MemStorage (fallback)

### Admin Panel Information Architecture
- **Main**: Dashboard, Calendar, Progress
- **Projects**: Public, 1:1, Pending Approval, Stop/Cancel, Participation Status
- **Contract & Settlement**
- **Review Management**
- **Consulting Management**: Inquiries, Consultants, Related Projects
- **Members/Companies**: Member Management, Company Management, Verification, Portfolios, Grade Policy
- **Operation Center**: 1:1 Inquiry, Reports, Notifications, AI Chat, Notices, Banners, Notification Settings
- **Statistics/Reports**
- **System Settings**: Admin Accounts, Platform Settings, User Logs
- **Security/Audit**: Security Data

### Key Admin Pages and Components
- **Admin Pages**: dashboard, calendar, progress, various project lists, contracts, reviews, consulting, member/company management, CS tools, reports (sub-menu: 활동현황/플랫폼현황/이벤트로그), system settings, security.
- **Admin Components**: `app-sidebar`, `admin-layout`, `admin-alerts`, `page-header`, `period-filter`, `notice-banner-management`, `project-management`, `AdminMainTabs`.

### User Onboarding Flow
- `/signup` (Basic Info) → `/signup/email` (Email Verification) → `/signup/phone` (Phone Verification) → `/signup/account-type` (Account Type Selection)
    - Personal Account → `/`
    - Corporate Account → `/signup/job-info` (Company Registration) → `/`

## External Dependencies

- **PostgreSQL**: Used with Drizzle ORM for database management (via Neon serverless).
- **Google Analytics 4 (GA4)**: `G-SR7QGTY3K9` for website analytics.
- **Mixpanel**: `a6d30eeef83cda0e513f6b3ea08a0b3d` for detailed event tracking and user behavior analysis.
- **GTM**: `GTM-T2QRR8N7` — head script + body noscript 삽입, `publishAnalytics` 호출마다 `window.dataLayer.push` 연동.
- **GA4 Measurement Protocol API Secret**: 환경변수 아닌 `simulate-users.js` 내 하드코딩 (시뮬레이션 전용).

## Analytics Architecture

### 핵심 파일
- `client/src/lib/analytics.ts` — 모든 이벤트 발송 함수 + `FunnelRouteListener` 훅
- `client/src/pages/admin/event-log.tsx` — 어드민 이벤트 로그 파서
- `simulate-users.js` — 1000명 가상 유저 시뮬레이션 스크립트 (루트)

### FunnelRouteListener (App.tsx에 마운트)
URL 변경 감지 → 자동으로 아래 이벤트 발송:
- `site_visit` (세션 최초 1회)
- `signup_funnel` (step 1~5, 각 가입 단계 URL 진입 시)
- `step_{N}_{파일명}` (프로젝트 등록 1~18단계 각 URL 진입 시)
- `time_on_page` + `scroll_depth` (페이지 이탈/스크롤 자동)
- `page_exit` (브라우저 이탈 시)

### 회원가입 퍼널 이벤트 (올바른 순서)
| Step | URL | 이벤트 |
|------|-----|--------|
| 1 | `/signup` | `signup_funnel` step=1, `signup_started` |
| 2 | `/signup/email` | `signup_funnel` step=2 |
| 3 | `/signup/phone` | `signup_funnel` step=3, `signup_complete` |
| 4 | `/signup/account-type` | `signup_funnel` step=4 |
| 5 | `/signup/job-info` | `signup_funnel` step=5 (기업 가입 시) |

### 핵심 전환 이벤트 (GA4 전환 등록 대상)
| 이벤트 | 발생 위치 | 의미 |
|--------|-----------|------|
| `signup_complete` | `signup-phone.tsx` | 가입 완료 |
| `project_submitted` | `project-details.tsx` handleConfirm | 프로젝트 등록 확정 |
| `partner_applied` | `detail.tsx` | 파트너 공고 지원 |
| `contract_signed` | `contract.tsx` | 계약 체결 |
| `review_submitted` | `review.tsx` | 리뷰 등록 |
| `activation_achieved` | 첫 project_submitted / partner_applied 시 | 핵심행동 달성 |
| `step1_cta_click` | `step1-partner-selection.tsx` | 프로젝트 등록 시작 + 유형 선택 |

### 참여현황 이벤트 (participation.tsx)
`participation_invite_toggled`, `participation_ot_confirmed`, `participation_ot_completed`,
`participation_pt_confirmed`, `participation_pt_completed`, `participation_final_selected`

### 홈 이벤트
`home_click` + `element` 파라미터 (cta / category / feature_card / partner / faq / flow_step / partner_more / faq_more)

### 시뮬레이션 스크립트 (`simulate-users.js`)
- 루트에서 `node simulate-users.js` 실행
- GA4 Measurement Protocol + Mixpanel HTTP API 직접 전송
- 1000명 × 최근 69시간 분산 (GA4 72시간 제한 준수)
- 유저 속성: `user_type` (advertiser 50% / agency 30% / production 20%), `gender` (male 60% / female 40%), `age_group` (20s~50s, 30-40대 중심)
- 위치: 서울 35% / 경기도 20% / 부산·인천·대구·대전·광주 등 / 해외 5%
- 가입 완료 유저는 Mixpanel People 프로필 (`/engage`) 자동 등록
- 이벤트명은 실제 앱과 동일 (`signup_funnel` + step 파라미터 방식)