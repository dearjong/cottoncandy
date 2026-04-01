# Admin 정보 구조 (IA)

| 항목 | 내용 |
| --- | --- |
| **문서명** | Cotton Candy — 플랫폼 운영자(Admin) IA |
| **범위** | `/admin` 하위 SPA, 사이드바 기준 1차 구조 |
| **구현 기준** | `client/src/components/admin/app-sidebar.tsx`, `client/src/App.tsx` |
| **관련 문서** | [dev-handoff-admin-flow.md](./dev-handoff-admin-flow.md) (플로우·파일 맵) |

---

## 1. IA 목적

- 운영자가 **어디서 무엇을 하는지** 한눈에 보이게 한다.  
- 기획·개발·QA가 **메뉴명 ↔ URL** 을 같은 언어로 말할 수 있게 한다.  
- 사이드바에 없는 **숨은 경로**(딥링크·워크플로)를 따로 표시한다.

---

## 2. 정보 구조 트리 (사이드바 순서)

```
Admin (루트 /admin)
├── 메인
│   ├── 대시보드          → /admin
│   ├── 관리자 캘린더      → /admin/calendar
│   └── 진행 현황         → /admin/progress
├── 전체 프로젝트         → /admin/projects  (하위 접기/펼치기)
│   ├── 승인 대기         → /admin/pending-approval
│   ├── 중단/취소 요청    → /admin/stop-cancel
│   ├── 공고 프로젝트     → /admin/bidding
│   └── 1:1 프로젝트     → /admin/one-on-one
├── 계약 & 정산           → /admin/contracts
├── 리뷰 관리             → /admin/reviews
├── 컨설팅 관리           → /admin/consulting
│   ├── 컨설팅 문의       → /admin/consulting
│   ├── 컨설턴트 관리     → /admin/consultants
│   └── 관련 프로젝트     → /admin/consulting/related-projects
├── 회원/기업             → /admin/members
│   ├── 회원 관리         → /admin/members
│   ├── 기업 관리         → /admin/companies
│   ├── 기업 인증 관리    → /admin/company-verification
│   ├── 회사소개서&포트폴리오 → /admin/company-portfolios
│   ├── 참여현황          → /admin/participation
│   └── 등급 정책 관리    → /admin/system/grades
├── 운영 센터             → /admin/communication
│   ├── 커뮤니케이션      → /admin/communication
│   ├── 공지 & 배너 관리  → /admin/announcements
│   └── 알림 설정         → /admin/system/notifications
├── 통계/리포트           → /admin/reports
├── 시스템 설정           → /admin/settings
│   ├── 관리자 계정       → /admin/settings
│   ├── 플랫폼 설정       → /admin/settings/platform
│   └── 사용자 로그       → /admin/settings/logs
└── 보안/감사             → /admin/security/messages
    ├── 보안자료          → /admin/security/messages
    └── 신고 관리         → /admin/reports-management
```

---

## 3. URL 요약표 (1차 메뉴 기준)

| 1차 그룹 | 대표 URL | 비고 |
| --- | --- | --- |
| 메인 | `/admin` | 대시보드 = 동일 경로 |
| 전체 프로젝트 | `/admin/projects` | 하위 4개 큐 |
| 계약 & 정산 | `/admin/contracts` | |
| 리뷰 관리 | `/admin/reviews` | |
| 컨설팅 관리 | `/admin/consulting` | 상세 `/admin/consulting/:id` |
| 회원/기업 | `/admin/members` | 기업 상세 `/admin/companies/:id` |
| 운영 센터 | `/admin/communication` | |
| 통계/리포트 | `/admin/reports` | |
| 시스템 설정 | `/admin/settings` | |
| 보안/감사 | `/admin/security/messages` | 민감 열람 허브 |

---

## 4. 사이드바에 없는 Admin 경로 (딥링크·운영 보조)

운영 플로우에서 쓰이지만 **좌측 1차 메뉴에는 없음**. IA 보완·메뉴 추가 여부는 기획에서 결정.

| 용도 | URL | 비고 |
| --- | --- | --- |
| 프로젝트 상세(별도 뷰) | `/admin/project-detail/:id` | 목록/워크플로에서 진입 |
| 프로젝트 id 직접 진입 | `/admin/projects/:id` | |
| 절차별 워크플로 | `/admin/workflow/matching` 등 | [dev-handoff](./dev-handoff-admin-flow.md) §3.1 표 참고 |
| 워크플로 embed | `/admin/workflow-embed/*` | 모달·임베드용 |
| 활동 로그(전역) | `/admin/activity-logs` | 설정의 “사용자 로그”와 역할 구분 필요 시 정리 |

---

## 5. 용어·중복 정리 (IA 관점 메모)

- **「컨설팅 문의」**와 부모 **「컨설팅 관리」**가 동일 URL(`/admin/consulting`) — 의도적이면 유지, 혼동 시 부모만 랜딩·자식은 앵커 등 검토.  
- **「신고 관리」**는 보안/감사 하위지만 URL은 `/admin/reports-management` — 그룹명과 path 접두가 다름, 문서·온보딩 시 한 줄 설명 권장.  
- **「통계/리포트」** vs **「리뷰 관리」** — 숫자/품질 지표 역할 구분을 기획 문장으로 고정해 두면 좋음.

---

## 6. 향후 IA 과제 (체크리스트)

- [ ] RBAC 도입 시 **역할별 메뉴 가시성** (숨김 vs 비활성)  
- [ ] `activity-logs` 를 사이드바에 넣을지, 설정 하위로만 둘지 통일  
- [ ] 워크플로 전체를 사이드바 2차로 노출할지, 프로젝트 컨텍스트 안에서만 열지 결정  
- [ ] `AdminLayout` 미적용 페이지(`companies` 등) **시각적 IA 통일**

---

*문서 버전: 1.0 | 2026-04-01*
