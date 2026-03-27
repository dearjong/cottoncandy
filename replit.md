# Cotton Candy - Onboarding Project Platform

## Overview

This is a single-page React application for a project matching and consulting platform called "Cotton Candy". It features a Korean interface for users to select their partner discovery method.

The application displays a single step where users can choose how they want to find project partners (공개 프로젝트로 등록, 비공개 프로젝트 매칭, 전담상담사와 밀착컨설팅). It's built with modern web technologies and follows a clean, component-based architecture.

## System Architecture

### Frontend Architecture (Vite)
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Styling**: Tailwind CSS with custom design system using "cotton candy" color scheme
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for smooth transitions and interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Built-in support for PostgreSQL session storage
- **Development**: tsx for TypeScript execution in development

### Key Components

#### Frontend Structure
- **Layout Components**: Header with navigation and Footer with social links
- **Pages**: Step-based onboarding flow (Step1 and Step2)
- **UI Components**: Comprehensive component library following shadcn/ui patterns
- **Shared Types**: TypeScript interfaces for onboarding options and state

#### Backend Structure
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **Routes**: RESTful API endpoints (currently stubbed for implementation)
- **Schema**: Database schema using Drizzle ORM with users and onboarding selections tables

## Data Flow

1. **User Journey**: Users navigate through a two-step onboarding process
   - Step 1: Select project type (public, private, or consulting)
   - Step 2: Choose service category (advertising, video, or consulting agency)

2. **State Management**: 
   - Local state for UI interactions
   - React Query for server-side data caching
   - localStorage for temporary onboarding state persistence

3. **Data Persistence**: 
   - User selections stored in onboarding_selections table
   - Session-based tracking using session IDs
   - User management through users table with authentication fields

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Replit**: Development and deployment platform with built-in PostgreSQL module

### UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Modern icon library for consistent iconography

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer support

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module for local development
- **Build Process**: Vite dev server with hot module replacement
- **Port Configuration**: Local port 5000 mapped to external port 80

### Production Build
- **Frontend**: Static assets built with Vite and served from dist/public
- **Backend**: Server bundled with ESBuild for optimized Node.js execution
- **Deployment**: Autoscale deployment target on Replit infrastructure
- **Process**: npm run build followed by npm run start for production

### Development Workflow
- **Hot Reload**: Vite HMR for frontend changes
- **TypeScript**: Strict type checking across frontend and backend
- **Database**: Push schema changes with drizzle-kit push command

## Changelog
- June 27, 2025. Initial setup
- June 27, 2025. Completed 2-step onboarding flow implementation with Korean UI

## Recent Changes
- ✓ Implemented Step 1: Partner discovery method selection (공개 프로젝트등록 홍보, 비공개 프로젝트 매칭, 전담상담사와 밀착컨설팅)
- ✓ Added animated selection cards with hover and click effects using Framer Motion
- ✓ Created responsive Korean UI matching Cotton Candy design with pink/blue color scheme
- ✓ Implemented localStorage persistence for user selection
- ✓ Created Layout component for consistent Header/Footer inclusion
- ✓ Simplified to single-page application per user request (January 4, 2025)
- ✓ Developed comprehensive bidding detail page with dashboard-style layout (January 4, 2025)
- ✓ Transformed design to text-centric, minimalist approach per user feedback
- ✓ Removed visual distractions (icons, colorful elements, badges) to prioritize text information
- ✓ Redesigned with clean, reference-based layout matching user's preferred style (January 4, 2025)
- ✓ Set bidding detail page as homepage with comprehensive PDF content display
- ✓ Renamed order folder to create-project for better clarity (October 13, 2025)
- ✓ Refactored step files from numbered names (step1.tsx) to descriptive names (request-style.tsx, partner-type.tsx, etc.) - step numbers now managed in routing only (October 13, 2025)
- ✓ Renamed components/onboarding to components/project-creation for clarity - components are specifically for project creation flow (October 13, 2025)
- ✓ Completed CSS class naming consistency refactor: removed all "onboarding-*" classes and replaced with "project-*" naming (onboarding-section → project-section, etc.) for unified terminology (October 13, 2025)
- ✓ Updated type definitions: OnboardingState → ProjectState for consistency with project-creation naming convention (October 13, 2025)
- ✓ Renamed component functions: OnboardingDetailView → ProjectDetailView to match new naming standards (October 13, 2025)
- ✓ Centralized CSS layout classes: Created work-container and work-content for consistent styling across all Work pages (October 15, 2025)
- ✓ Standardized background to bg-white (matching project creation format) across entire application - removed all bg-gray-50 instances (October 15, 2025)
- ✓ Admin project detail page: 3-column layout with step18 content in left card, client info + admin actions in right column (January 16, 2026)
- ✓ Added "사용자 화면" button in admin header for navigation back to main site (January 16, 2026)
- ✓ Admin project list: clickable titles linking to project detail page (/admin/projects/:id) (January 16, 2026)
- ✓ Removed Next.js entirely — full Vite-only setup (March 27, 2026)
- ✓ Added admin 계약 & 정산 관리 page (/admin/contracts) — full project contract/settlement list with expandable rows (March 27, 2026)
- ✓ Added admin 리뷰 관리 page (/admin/reviews) — full review list with visibility toggle and delete moderation (March 27, 2026)
- ✓ Sidebar: 계약 & 정산, 리뷰 관리 are standalone top-level menu items (not under 전체 프로젝트); 파일 저장소 admin removed (user-private data) (March 27, 2026)
- ✓ 컨설팅 관리 sidebar: added 관련 프로젝트 sub-item → /admin/consulting/related-projects; ProjectManagement got filterConsultingLinked prop (March 27, 2026)
- ✓ 회원/기업 sidebar: added 회사소개서&포트폴리오 sub-item → /admin/company-portfolios; list with search/filter, status review (승인/반려), preview dialog, delete (March 27, 2026)

## User Preferences
- Preferred communication style: Simple, everyday language
- Design consistency: ALL screens must match project creation format exactly ("완벽하게 똑같이")
- CSS architecture: Use centralized CSS classes (work-container, work-content, page-container, page-content)
- NO inline styles allowed - all styling through CSS classes only
- Background: bg-white for all pages (matching project creation format)
- Buttons: Centralized btn-pink and btn-white classes with consistent font-weight: 400