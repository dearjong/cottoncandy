# Korean Admin Dashboard Design Guidelines

## Design Approach
**Selected Approach:** Design System Approach using Material Design  
**Justification:** This is a utility-focused, information-dense admin interface requiring standard patterns for maximum usability and efficiency. Material Design provides excellent data visualization components and consistent interaction patterns essential for complex admin workflows.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 220 90% 50% (Professional blue for admin actions)
- Surface: 0 0% 98% (Clean background for data readability)
- On-surface: 220 20% 20% (High contrast text)

**Dark Mode:**
- Primary: 220 80% 60% (Adjusted blue for dark theme)
- Surface: 220 15% 12% (Dark admin background)
- On-surface: 0 0% 95% (Light text for readability)

**Status Colors:**
- Success: 120 60% 45% (Approvals, completions)
- Warning: 45 90% 55% (Pending, review needed)
- Error: 0 70% 50% (Rejections, issues)
- Info: 200 80% 55% (Notifications, info)

### B. Typography
**Font Family:** Inter (via Google Fonts CDN) for excellent Korean character support
- Headers (H1-H3): 600 weight, 28px-20px sizes
- Body text: 400 weight, 16px-14px sizes
- Data labels: 500 weight, 14px-12px sizes
- Monospace data: JetBrains Mono for IDs, dates, numbers

### C. Layout System
**Spacing Units:** Tailwind units of 2, 4, 6, and 8 (corresponding to 8px, 16px, 24px, 32px)
- Card padding: p-6 (24px)
- Section gaps: gap-8 (32px)
- Form field spacing: space-y-4 (16px)
- Button spacing: px-6 py-2 (24px horizontal, 8px vertical)

### D. Component Library

**Navigation:**
- Collapsible sidebar with section groupings (대시보드, 프로젝트 관리, 회원 관리, etc.)
- Breadcrumb navigation for deep admin flows
- Tab navigation for multi-section views

**Data Display:**
- Card-based layouts for dashboard metrics
- Data tables with sorting, filtering, and pagination
- Status badges with consistent color coding
- Chart containers using Chart.js or similar via CDN

**Forms & Actions:**
- Floating label inputs for space efficiency
- Multi-step forms for complex approval workflows
- Batch action toolbars for member/project management
- Modal dialogs for confirmations and detailed views

**Communication:**
- Toast notifications for system feedback
- Inline status indicators for approval states
- Comment/note sections for admin collaboration

### E. Specific Admin Patterns

**Dashboard Layout:**
- 4-column metric cards at top (등록/계약/완료/정산 counts)
- 2-column chart section (주간/월간 graphs)
- Alert/notification panel in sidebar

**Calendar Interface:**
- Monthly grid view with activity count badges
- Color-coded activity types
- Expandable day details with action buttons

**Management Tables:**
- Sticky headers for long data lists
- Row actions (승인/반려) with confirmation dialogs
- Bulk selection for mass operations
- Filter sidebar with saved filter presets

**Korean Localization:**
- Proper Korean typography spacing
- Right-to-left form labels where appropriate
- Korean date formatting (YYYY년 MM월 DD일)
- Localized number formatting for currency/statistics

## No Custom Images Required
This admin interface relies on data visualization and functional components rather than imagery. Use icon libraries (Heroicons recommended) for navigation and action buttons.