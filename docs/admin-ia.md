# Admin 정보 구조 (IA)

| 항목 | 내용 |
| --- | --- |
| **문서명** | Cotton Candy — 플랫폼 운영자(Admin) IA |
| **범위** | `/admin` 하위 SPA, **사이드바** 기준 |
| **구현 기준** | `client/src/components/admin/app-sidebar.tsx`, `client/src/App.tsx` |
| **관련 문서** | [dev-handoff-admin-flow.md](./dev-handoff-admin-flow.md) |

---

## 1. IA 목적

- 운영·기획·개발·QA가 **메뉴명 ↔ URL** 을 동일하게 사용한다.  
- 사이드바에 없는 **딥링크·워크플로**는 별도 표로 구분한다.

---

## 2. 사이드바 IA (표 — 위에서 아래 순서)

| 순서 | 1차 그룹 | 2차 메뉴 | URL | 노출 |
| --- | --- | --- | --- | --- |
| 1 | 메인 | — | `/admin` | 단일 링크 |
| 2 | 전체 프로젝트 | (부모) | `/admin/projects` | 접기 그룹 부모 |
| 3 | 전체 프로젝트 | 승인 대기 | `/admin/pending-approval` | 하위 |
| 4 | 전체 프로젝트 | 중단/취소 요청 | `/admin/stop-cancel` | 하위 |
| 5 | 전체 프로젝트 | 공고 프로젝트 | `/admin/bidding` | 하위 |
| 6 | 전체 프로젝트 | 1:1 프로젝트 | `/admin/one-on-one` | 하위 |
| 7 | 계약 & 정산 | — | `/admin/contracts` | 단일 |
| 8 | 리뷰 관리 | — | `/admin/reviews` | 단일 |
| 9 | 컨설팅 관리 | (부모) | `/admin/consulting` | 접기 그룹 부모 |
| 10 | 컨설팅 관리 | 컨설팅 문의 | `/admin/consulting` | 하위 *(부모와 동일 URL)* |
| 11 | 컨설팅 관리 | 컨설턴트 관리 | `/admin/consultants` | 하위 |
| 12 | 컨설팅 관리 | 관련 프로젝트 | `/admin/consulting/related-projects` | 하위 |
| 13 | 회원/기업 | (부모) | `/admin/members` | 접기 그룹 부모 |
| 14 | 회원/기업 | 회원 관리 | `/admin/members` | 하위 *(부모와 동일 URL)* |
| 15 | 회원/기업 | 기업 관리 | `/admin/companies` | 하위 |
| 16 | 회원/기업 | 기업 인증 관리 | `/admin/company-verification` | 하위 |
| 17 | 회원/기업 | 회사소개서&포트폴리오 | `/admin/company-portfolios` | 하위 |
| 18 | 회원/기업 | 참여현황 | `/admin/participation` | 하위 |
| 19 | 회원/기업 | 등급 정책 관리 | `/admin/system/grades` | 하위 |
| 20 | 운영 센터 | (부모) | `/admin/communication` | 접기 그룹 부모 |
| 21 | 운영 센터 | 커뮤니케이션 | `/admin/communication` | 하위 *(부모와 동일 URL)* |
| 22 | 운영 센터 | 공지 & 배너 관리 | `/admin/announcements` | 하위 |
| 23 | 운영 센터 | 알림 설정 | `/admin/system/notifications` | 하위 |
| 24 | 통계/리포트 | — | `/admin/reports` | 단일 |
| 25 | 시스템 설정 | (부모) | `/admin/settings` | 접기 그룹 부모 |
| 26 | 시스템 설정 | 관리자 계정 | `/admin/settings` | 하위 *(부모와 동일 URL)* |
| 27 | 시스템 설정 | 플랫폼 설정 | `/admin/settings/platform` | 하위 |
| 28 | 시스템 설정 | 사용자 로그 | `/admin/settings/logs` | 하위 |
| 29 | 보안/감사 | (부모) | `/admin/security/messages` | 접기 그룹 부모 |
| 30 | 보안/감사 | 보안자료 | `/admin/security/messages` | 하위 *(부모와 동일 URL)* |
| 31 | 보안/감사 | 신고 관리 | `/admin/reports-management` | 하위 |

**노출** 열: `단일` = 펼침 없음 / `접기 그룹 부모` = 제목 클릭 시 이동 + 하위 펼침 / `하위` = 2차 링크.

---

## 3. 라우트는 있으나 사이드바에 없는 화면 (표)

코드에 `Route`는 있으나 **좌측 메뉴에는 없음** (대시보드 등에서 이동·직접 URL).

| 용도 | URL | 비고 |
| --- | --- | --- |
| 관리자 캘린더 | `/admin/calendar` | `mainMenuItems` 정의만 있고 사이드바 항목은 `메인` 1개 |
| 진행 현황 | `/admin/progress` | 위와 동일 |
| 프로젝트 상세(별도) | `/admin/project-detail/:id` | 프로젝트 운영 플로우 |
| 프로젝트 by id | `/admin/projects/:id` | |
| 컨설팅 상세 | `/admin/consulting/:id` | |
| 기업 상세 | `/admin/companies/:id` | |
| 절차별 워크플로 | `/admin/workflow/*` | [dev-handoff §3.1](./dev-handoff-admin-flow.md#31-프로젝트-운영) |
| 워크플로 embed | `/admin/workflow-embed/*` | 모달·임베드 |
| 활동 로그(전역) | `/admin/activity-logs` | 설정의 사용자 로그와 구분 검토 |

---

## 4. 1차 그룹 ↔ 대표 URL (요약 표)

| 1차 그룹 | 대표 URL | 하위 개수(대략) |
| --- | --- | --- |
| 메인 | `/admin` | 0 (단일) |
| 전체 프로젝트 | `/admin/projects` | 4 |
| 계약 & 정산 | `/admin/contracts` | 0 |
| 리뷰 관리 | `/admin/reviews` | 0 |
| 컨설팅 관리 | `/admin/consulting` | 3 |
| 회원/기업 | `/admin/members` | 6 |
| 운영 센터 | `/admin/communication` | 3 |
| 통계/리포트 | `/admin/reports` | 0 |
| 시스템 설정 | `/admin/settings` | 3 |
| 보안/감사 | `/admin/security/messages` | 2 |

---

## 5. 용어·IA 메모

- 부모·자식이 **동일 URL**인 행(컨설팅 문의, 회원 관리 등)은 라벨만 구분 — 혼동 시 IA 조정 검토.  
- **신고 관리** URL은 `/admin/reports-management` (경로 접두 `reports-`).

---

## 6. 향후 IA 과제 (체크리스트)

- [ ] RBAC 도입 시 역할별 메뉴 가시성  
- [ ] 캘린더·진행 현황을 사이드바 `메인` 하위로 노출할지 결정  
- [ ] `activity-logs` 메뉴 소속 정리  
- [ ] `AdminLayout` 미적용 페이지 시각 통일  

---

*문서 버전: 1.1 (표 중심) | 2026-04-01*
