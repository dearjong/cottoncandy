# ADMarket - Admin Platform

## Overview

ADMarket는 광고주(의뢰사)와 광고 제작사(파트너)를 연결하는 프로젝트 매칭 플랫폼입니다.
React + Vite 기반 풀스택 앱으로, 관리자 패널이 핵심 기능입니다.
기획자가 Figma 대신 Replit을 프로토타이핑 도구로 활용하는 프로젝트입니다.

---

## System Architecture

### Frontend (Vite + React 18 + TypeScript)
- **Bundler**: Vite (포트 5000, Next.js 완전 제거)
- **Routing**: Wouter
- **State**: @tanstack/react-query
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI 기반)
- **Animation**: Framer Motion

### Backend (Express + Node.js)
- **Runtime**: Node.js 20 + tsx
- **ORM**: Drizzle ORM + PostgreSQL (Neon serverless)
- **Storage**: DATABASE_URL 있으면 DbStorage, 없으면 MemStorage 자동 전환

---

## Admin Panel IA (정보 구조)

### 사이드바 메뉴 전체 구조

```
[메인]
├── 대시보드                  /admin
├── 관리자 캘린더              /admin/calendar
└── 진행 현황                 /admin/progress

[전체 프로젝트]              /admin/projects
├── 승인 대기                 /admin/pending-approval
├── 중단/취소 요청             /admin/stop-cancel
├── 공고 프로젝트              /admin/project_list
├── 1:1 프로젝트              /admin/private
└── 참여현황                  /admin/participation

[계약 & 정산]                /admin/contracts
[리뷰 관리]                  /admin/reviews

[컨설팅 관리]                /admin/consulting
├── 컨설팅 문의               /admin/consulting
├── 컨설턴트 관리              /admin/consultants
└── 관련 프로젝트             /admin/consulting/related-projects

[회원/기업]                  /admin/members
├── 회원 관리                 /admin/members
├── 기업 관리                 /admin/companies
├── 기업 인증 관리             /admin/company-verification
├── 회사소개서&포트폴리오       /admin/company-portfolios
└── 등급 정책 관리             /admin/system/grades

[운영 센터]                  /admin/cs/inquiry
├── 1:1 문의                  /admin/cs/inquiry
├── 신고 관리                 /admin/reports-management
├── 알림 발송                 /admin/cs/notifications
├── AI 채팅                   /admin/cs/ai-chat
├── 공지사항                  /admin/cs/notices
├── 배너 관리                 /admin/cs/banners
└── 알림 설정                 /admin/system/notifications

[통계/리포트]                /admin/reports

[시스템 설정]                /admin/settings
├── 관리자 계정               /admin/settings
├── 플랫폼 설정               /admin/settings/platform
└── 사용자 로그               /admin/settings/logs

[보안/감사]                  /admin/security/messages
└── 보안자료                  /admin/security/messages
```

### 운영 센터 페이지별 내용
| 경로 | 내용 |
|------|------|
| `/admin/cs/inquiry` | 1:1 문의 목록 (10건 mock), 미답변·답변완료 뱃지 |
| `/admin/reports-management` | 신고 내역 (ABUSE·SPAM·CONTACT) |
| `/admin/cs/notifications` | 알림 발송 폼 + 발송 내역 탭 |
| `/admin/cs/ai-chat` | AI 채팅 상담 내역 |
| `/admin/cs/notices` | 공지사항 목록 + 새 공지 작성 다이얼로그 |
| `/admin/cs/banners` | 배너 목록 + 새 배너 등록 다이얼로그 |

---

## Key Files

### Admin Pages
```
client/src/pages/admin/
├── dashboard.tsx
├── calendar.tsx
├── progress.tsx
├── projects.tsx / project-detail.tsx
├── bidding-projects.tsx
├── one-on-one-projects.tsx
├── pending-approval.tsx
├── stop-cancel.tsx
├── contracts.tsx
├── reviews.tsx
├── consulting-projects.tsx / consulting-project-detail.tsx
├── consulting-related-projects.tsx
├── consultants.tsx
├── members.tsx
├── companies.tsx / company-detail.tsx
├── company-verification.tsx
├── company-portfolios.tsx
├── participation.tsx
├── reports.tsx
├── reports-management.tsx
├── announcements.tsx          ← 구형 (공지+배너 통합, 호환 유지)
├── activity-logs.tsx
├── admin-settings.tsx
├── cs/
│   ├── inquiry.tsx            ← 1:1 문의
│   ├── notifications.tsx      ← 알림 발송
│   ├── ai-chat.tsx            ← AI 채팅
│   ├── notices.tsx            ← 공지사항
│   └── banners.tsx            ← 배너 관리
├── security/messages.tsx
├── settings/platform.tsx / logs.tsx
├── system/NotificationSettings.tsx / CompanyGradeManagement.tsx
└── workflow/
    ├── matching.tsx / proposal.tsx / proposal-view.tsx
    ├── contract.tsx / production.tsx / settlement.tsx
    ├── review.tsx / post-review.tsx
    ├── consumer-survey.tsx / tvcf-review.tsx
```

### Admin Components
```
client/src/components/admin/
├── app-sidebar.tsx            ← 전체 사이드바 IA 정의
├── admin-layout.tsx
├── admin-alerts.tsx           ← 대시보드 알림 (4개 업무 카드)
├── page-header.tsx            ← PageHeader(title, description, hidePeriodFilter?)
├── period-filter.tsx
├── communication-center.tsx   ← 구형 탭 컴포넌트 (호환 유지)
├── notice-banner-management.tsx
├── project-management.tsx
└── AdminMainTabs.tsx          ← 대시보드/캘린더/진행현황 전용 탭
```

### Data & Types
```
client/src/data/mockData.ts    ← 모든 mock 데이터 (MOCK_ALL_INQUIRIES 10건 등)
client/src/types/project-status.ts
```

---

## Design Rules

- **배경**: 모든 페이지 `bg-white`
- **CSS**: 인라인 스타일 금지 — CSS 클래스만 사용
- **버튼**: `btn-pink` / `btn-white` (font-weight: 400)
- **레이아웃**: `work-container` / `work-content` / `page-container` / `page-content`
- **PageHeader 패턴**: `<PageHeader title="..." description="..." hidePeriodFilter? />`
- **뱃지**: 미답변=`destructive`, 답변완료=`outline + text-muted-foreground`
- **Admin 버튼**: 반려=`variant="outline"`, 승인=`bg-pink-600 hover:bg-pink-700`
- **Design tokens**: `--cotton-candy-pink: #EA4C89`, `--cotton-pastel-cobalt: #16C2E9`

---

## Changelog

- 2025-06-27: 초기 셋업
- 2025-10-13: create-project 폴더 리팩토링, CSS 네이밍 통일 (onboarding-* → project-*)
- 2026-01-16: admin 프로젝트 상세 3컬럼 레이아웃, "사용자 화면" 버튼
- 2026-03-27: Next.js 제거 → Vite 단독, 계약&정산·리뷰관리·컨설팅·회사소개서 페이지 추가
- 2026-04-06: 운영 센터 분리 — 1:1 문의·신고·알림발송·AI채팅·공지사항·배너 각각 독립 서브메뉴
- 2026-04-08: 내정보 섹션 추가 — /my/profile·/my/withdraw·/my/inquiry·/my/notification-settings 4페이지 + MySidebar 공통 컴포넌트; 헤더 드롭다운 내정보 링크 /my/profile 연결
- 2026-04-09: 레거시 폴더 정리 — create-project/ guides/ mypage/ admin_v2/ work/company-portfolio/ 등 미사용 폴더 삭제. pages/ 구조: home.tsx + admin/ member/ service/ work/ company/ my/ 로 정리

## User Preferences
- 커뮤니케이션: 간결한 한국어, 기술 용어 최소화
- 디자인 일관성: 프로젝트 생성 포맷과 완벽하게 동일하게
- 화면 목적: 기획자 프로토타입 (Figma 대체)
