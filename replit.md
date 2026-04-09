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
- **Admin Pages**: dashboard, calendar, progress, various project lists, contracts, reviews, consulting, member/company management, CS tools, reports, system settings, security.
- **Admin Components**: `app-sidebar`, `admin-layout`, `admin-alerts`, `page-header`, `period-filter`, `notice-banner-management`, `project-management`, `AdminMainTabs`.

### User Onboarding Flow
- `/signup` (Basic Info) → `/signup/email` (Email Verification) → `/signup/phone` (Phone Verification) → `/signup/account-type` (Account Type Selection)
    - Personal Account → `/`
    - Corporate Account → `/signup/job-info` (Company Registration) → `/`

## External Dependencies

- **PostgreSQL**: Used with Drizzle ORM for database management (via Neon serverless).
- **Google Analytics 4 (GA4)**: `G-MG1WSR89E1` for website analytics.
- **Mixpanel**: `B32D8265A148455CB07F704BE7A648AA` for detailed event tracking and user behavior analysis.