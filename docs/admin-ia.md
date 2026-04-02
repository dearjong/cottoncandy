# Admin 정보구조도 (Information Architecture)

| 항목 | 내용 |
| --- | --- |
| **문서명** | ADMarket 플랫폼 운영자(Admin) IA |
| **버전** | v0.2 |
| **최종 업데이트** | 2026-04-02 |
| **구현 기준** | `client/src/components/admin/app-sidebar.tsx`, `client/src/App.tsx` |
| **참고 문서** | [user-flow-operator.md](./user-flow-operator.md), [prd.md](./prd.md), [dev-handoff-admin-flow.md](./dev-handoff-admin-flow.md) |

---

## 1. IA 목적

- 운영·기획·개발·QA가 **메뉴명 ↔ URL ↔ 담당 기능**을 동일하게 사용
- 사이드바 화면마다 **목적 / 핵심 데이터 / 주요 액션 / 연결 상태값** 명시
- 운영자 User Flow(`docs/user-flow-operator.md`)와 1:1 매핑하여 누락 화면 식별

---

## 2. 어드민 전체 구조 개요

```
/admin
├── [메인 그룹]
│   ├── 대시보드            /admin
│   ├── 관리자 캘린더        /admin/calendar
│   └── 진행 현황           /admin/progress
│
├── [전체 프로젝트]
│   ├── (목록)              /admin/projects
│   ├── 승인 대기           /admin/pending-approval
│   ├── 중단/취소 요청       /admin/stop-cancel
│   ├── 공고 프로젝트        /admin/bidding
│   └── 1:1 프로젝트        /admin/one-on-one
│
├── 계약 & 정산              /admin/contracts
├── 리뷰 관리                /admin/reviews
│
├── [컨설팅 관리]
│   ├── 컨설팅 문의          /admin/consulting
│   ├── 컨설턴트 관리        /admin/consultants
│   └── 관련 프로젝트        /admin/consulting/related-projects
│
├── [회원/기업]
│   ├── 회원 관리           /admin/members
│   ├── 기업 관리           /admin/companies
│   ├── 기업 인증 관리       /admin/company-verification
│   ├── 회사소개서&포트폴리오 /admin/company-portfolios
│   ├── 참여현황            /admin/participation
│   └── 등급 정책 관리       /admin/system/grades
│
├── [운영 센터]
│   ├── 커뮤니케이션         /admin/communication
│   ├── 공지 & 배너 관리     /admin/announcements
│   └── 알림 설정           /admin/system/notifications
│
├── 통계/리포트              /admin/reports
│
├── [시스템 설정]
│   ├── 관리자 계정          /admin/settings
│   ├── 플랫폼 설정          /admin/settings/platform
│   └── 사용자 로그          /admin/settings/logs
│
└── [보안/감사]
    ├── 보안자료             /admin/security/messages
    └── 신고 관리            /admin/reports-management
```

---

## 3. 사이드바 IA (순서표)

| 순서 | 1차 그룹 | 메뉴명 | URL | 타입 |
| --- | --- | --- | --- | --- |
| 1 | 메인 | 대시보드 | `/admin` | 단일 |
| 2 | 전체 프로젝트 | (그룹) | `/admin/projects` | 부모 |
| 3 | 전체 프로젝트 | 승인 대기 | `/admin/pending-approval` | 하위 |
| 4 | 전체 프로젝트 | 중단/취소 요청 | `/admin/stop-cancel` | 하위 |
| 5 | 전체 프로젝트 | 공고 프로젝트 | `/admin/bidding` | 하위 |
| 6 | 전체 프로젝트 | 1:1 프로젝트 | `/admin/one-on-one` | 하위 |
| 7 | — | 계약 & 정산 | `/admin/contracts` | 단일 |
| 8 | — | 리뷰 관리 | `/admin/reviews` | 단일 |
| 9 | 컨설팅 관리 | (그룹) | `/admin/consulting` | 부모 |
| 10 | 컨설팅 관리 | 컨설팅 문의 | `/admin/consulting` | 하위 |
| 11 | 컨설팅 관리 | 컨설턴트 관리 | `/admin/consultants` | 하위 |
| 12 | 컨설팅 관리 | 관련 프로젝트 | `/admin/consulting/related-projects` | 하위 |
| 13 | 회원/기업 | (그룹) | `/admin/members` | 부모 |
| 14 | 회원/기업 | 회원 관리 | `/admin/members` | 하위 |
| 15 | 회원/기업 | 기업 관리 | `/admin/companies` | 하위 |
| 16 | 회원/기업 | 기업 인증 관리 | `/admin/company-verification` | 하위 |
| 17 | 회원/기업 | 회사소개서&포트폴리오 | `/admin/company-portfolios` | 하위 |
| 18 | 회원/기업 | 참여현황 | `/admin/participation` | 하위 |
| 19 | 회원/기업 | 등급 정책 관리 | `/admin/system/grades` | 하위 |
| 20 | 운영 센터 | (그룹) | `/admin/communication` | 부모 |
| 21 | 운영 센터 | 커뮤니케이션 | `/admin/communication` | 하위 |
| 22 | 운영 센터 | 공지 & 배너 관리 | `/admin/announcements` | 하위 |
| 23 | 운영 센터 | 알림 설정 | `/admin/system/notifications` | 하위 |
| 24 | — | 통계/리포트 | `/admin/reports` | 단일 |
| 25 | 시스템 설정 | (그룹) | `/admin/settings` | 부모 |
| 26 | 시스템 설정 | 관리자 계정 | `/admin/settings` | 하위 |
| 27 | 시스템 설정 | 플랫폼 설정 | `/admin/settings/platform` | 하위 |
| 28 | 시스템 설정 | 사용자 로그 | `/admin/settings/logs` | 하위 |
| 29 | 보안/감사 | (그룹) | `/admin/security/messages` | 부모 |
| 30 | 보안/감사 | 보안자료 | `/admin/security/messages` | 하위 |
| 31 | 보안/감사 | 신고 관리 | `/admin/reports-management` | 하위 |

---

## 4. 화면별 상세

### 4-1. 대시보드 `/admin`

| 항목 | 내용 |
| --- | --- |
| **목적** | 오늘의 To-do 요약 — 운영자가 가장 먼저 보는 화면 |
| **핵심 데이터** | 승인 대기 건수 / 중단·취소 요청 건수 / 신고 미처리 건수 / 기업 인증 대기 건수 |
| **주요 액션** | 각 카드 클릭 → 해당 목록 페이지 딥링크 이동 |
| **운영자 Flow 연결** | [플랫폼 운영자 Flow §A](./user-flow-operator.md) — 진입 경로 |

---

### 4-2. 관리자 캘린더 `/admin/calendar`

| 항목 | 내용 |
| --- | --- |
| **목적** | 전체 프로젝트 일정(OT/PT/납품/온에어) 달력 뷰 |
| **핵심 데이터** | 프로젝트별 마일스톤 날짜 |
| **주요 액션** | 날짜 클릭 → 해당 프로젝트 상세 이동 |
| **사이드바 노출** | 사이드바 없음 (메인 그룹 내 직접 접근) |

---

### 4-3. 진행 현황 `/admin/progress`

| 항목 | 내용 |
| --- | --- |
| **목적** | 현재 진행 중인 프로젝트 전체 칸반/리스트 뷰 |
| **핵심 데이터** | 프로젝트 상태값별 분류(접수중 / 계약 / 제작 / 정산 등) |
| **주요 액션** | 프로젝트 클릭 → `/admin/projects/:id` 상세 |
| **사이드바 노출** | 사이드바 없음 (메인 그룹 내 직접 접근) |

---

### 4-4. 전체 프로젝트 목록 `/admin/projects`

| 항목 | 내용 |
| --- | --- |
| **목적** | 플랫폼 전체 프로젝트 통합 목록 |
| **핵심 데이터** | 프로젝트명 / 의뢰자 / 프로젝트 유형 / 현재 상태 / 등록일 |
| **필터** | 상태값 / 프로젝트 유형(공개·비공개·컨설턴트) / 날짜 범위 |
| **주요 액션** | 행 클릭 → `/admin/projects/:id` 상세 |

---

### 4-5. 승인 대기 `/admin/pending-approval` ⭐ 핵심

| 항목 | 내용 |
| --- | --- |
| **목적** | 공개 프로젝트 승인 요청 목록 처리 |
| **대상 상태값** | `REQUESTED` |
| **핵심 데이터** | 프로젝트명 / 의뢰자 / 예산 / 요청일 |
| **주요 액션** | 행 클릭 → 상세 검토 → `승인(APPROVED)` 또는 `반려(REJECTED)` + 사유 |
| **상태 전이** | `REQUESTED` → `APPROVED` → `PROPOSAL_OPEN` |
| **운영자 Flow 연결** | [§1 공개 프로젝트 승인](./user-flow-operator.md) |

---

### 4-6. 중단/취소 요청 `/admin/stop-cancel` ⭐ 핵심

| 항목 | 내용 |
| --- | --- |
| **목적** | 사용자가 요청한 프로젝트 중단·취소 건 검토 및 확정 |
| **대상 상태값** | `STOPPED.ADMIN_CHECKING`, `CANCELLED.ADMIN_CHECKING` |
| **핵심 데이터** | 요청 사유 / 관련 대화 이력 / 계약·정산 진행 여부 / 산출물 업로드 여부 |
| **주요 액션** | `승인(ADMIN_CONFIRMED)` / `반려` / `보류(추가 확인)` |
| **상태 전이** | `ADMIN_CHECKING` → `ADMIN_CONFIRMED` (중단·취소 확정) |
| **운영자 Flow 연결** | [§2 중단/취소 승인](./user-flow-operator.md) |

---

### 4-7. 공고 프로젝트 `/admin/bidding`

| 항목 | 내용 |
| --- | --- |
| **목적** | 공개 모집 프로젝트(Bidding) 전용 목록 |
| **핵심 데이터** | 접수 현황 / 지원사 수 / 마감일 |
| **주요 액션** | 프로젝트 상세 → 접수 현황 확인, 마감 처리 지원 |

---

### 4-8. 1:1 프로젝트 `/admin/one-on-one`

| 항목 | 내용 |
| --- | --- |
| **목적** | 비공개 직접의뢰(1:1) 프로젝트 목록 |
| **핵심 데이터** | 의뢰자 / 수신 파트너 / 응답 상태 |
| **주요 액션** | 프로젝트 상세 확인 |

---

### 4-9. 계약 & 정산 `/admin/contracts`

| 항목 | 내용 |
| --- | --- |
| **목적** | 플랫폼 전체 계약·정산 진행 현황 목록 |
| **핵심 데이터** | 프로젝트명 / 계약금·중도금·잔금 상태 / 증빙 업로드 여부 |
| **필터** | 정산 상태(PENDING / CHECKING / COMPLETED / REVISION_REQUESTED) |
| **주요 액션** | 행 클릭 → 정산 상세(확장 행 또는 모달) |
| **운영자 Flow 연결** | [process-settlement.md §6.3 운영자](./process-settlement.md) |

---

### 4-10. 리뷰 관리 `/admin/reviews`

| 항목 | 내용 |
| --- | --- |
| **목적** | 플랫폼에 등록된 리뷰 목록 관리 |
| **핵심 데이터** | 작성자 / 대상(기업) / 평점 / 노출 상태 / 작성일 |
| **주요 액션** | `노출/숨김 토글` / `삭제(신고 리뷰)` |

---

### 4-11. 컨설팅 문의 `/admin/consulting`

| 항목 | 내용 |
| --- | --- |
| **목적** | 광고주가 컨설턴트 의뢰 방식으로 등록한 문의 목록 |
| **핵심 데이터** | 문의 내용 / 배정된 컨설턴트 / 문의 상태 |
| **주요 액션** | 컨설턴트 배정 / 상태 업데이트 |

---

### 4-12. 컨설턴트 관리 `/admin/consultants`

| 항목 | 내용 |
| --- | --- |
| **목적** | 플랫폼에 등록된 컨설턴트 목록 및 관리 |
| **핵심 데이터** | 컨설턴트명 / 담당 문의 수 / 활성 상태 |
| **주요 액션** | 컨설턴트 등록 / 비활성화 |

---

### 4-13. 컨설팅 관련 프로젝트 `/admin/consulting/related-projects`

| 항목 | 내용 |
| --- | --- |
| **목적** | 컨설턴트가 관여하는 프로젝트만 필터링한 목록 |
| **핵심 데이터** | 프로젝트명 / 컨설턴트명 / 현재 단계 |

---

### 4-14. 회원 관리 `/admin/members`

| 항목 | 내용 |
| --- | --- |
| **목적** | 플랫폼 전체 회원 목록 및 계정 관리 |
| **핵심 데이터** | 이름 / 이메일 / 가입일 / 소속 기업 / 계정 상태 |
| **주요 액션** | 계정 정지 / 탈퇴 처리 / 비밀번호 초기화 |

---

### 4-15. 기업 관리 `/admin/companies`

| 항목 | 내용 |
| --- | --- |
| **목적** | 플랫폼에 등록된 기업 목록 |
| **핵심 데이터** | 기업명 / 유형(광고주·대행사·제작사) / 인증 상태 / 등록일 |
| **주요 액션** | 기업 상세(`/admin/companies/:id`) / 인증 관리 연결 |

---

### 4-16. 기업 인증 관리 `/admin/company-verification` ⭐ 핵심

| 항목 | 내용 |
| --- | --- |
| **목적** | 기업 인증 신청 검토 및 처리 |
| **대상** | 인증 신청 기업 |
| **핵심 데이터** | 사업자 정보 / 서류 / 대표관리자 정보 |
| **주요 액션** | `인증 승인` → 기업에 인증 완료 반영 + 알림 / `반려` + 사유 → 재신청 루프 |
| **운영자 Flow 연결** | [§4 기업 인증](./user-flow-operator.md) |

---

### 4-17. 회사소개서&포트폴리오 `/admin/company-portfolios`

| 항목 | 내용 |
| --- | --- |
| **목적** | 기업이 제출한 회사소개서·포트폴리오 검토 |
| **핵심 데이터** | 제출 기업명 / 검토 상태(승인·반려·대기) |
| **주요 액션** | 미리보기 다이얼로그 / `승인` / `반려` / `삭제` |

---

### 4-18. 참여현황 `/admin/participation`

| 항목 | 내용 |
| --- | --- |
| **목적** | 기업별 프로젝트 참여 이력 및 현황 통계 |
| **핵심 데이터** | 기업명 / 참여 수 / 선정 수 / 최근 활동일 |

---

### 4-19. 등급 정책 관리 `/admin/system/grades`

| 항목 | 내용 |
| --- | --- |
| **목적** | 기업 등급 기준 정의 및 수동 조정 |
| **핵심 데이터** | 등급명 / 조건(포트폴리오 수·리뷰 점수 등) / 등급별 기업 수 |
| **주요 액션** | 등급 기준 수정 / 개별 기업 등급 수동 조정 |

---

### 4-20. 커뮤니케이션 `/admin/communication`

| 항목 | 내용 |
| --- | --- |
| **목적** | 플랫폼 내 1:1 메시지·문의 목록 모니터링 |
| **핵심 데이터** | 발신자 / 수신자 / 메시지 내용 / 발송일 |
| **주요 액션** | 메시지 내용 확인 (읽기 전용 모니터링) |

---

### 4-21. 공지 & 배너 관리 `/admin/announcements`

| 항목 | 내용 |
| --- | --- |
| **목적** | 공지사항 작성·게시 / 배너 등록 및 노출 관리 |
| **핵심 데이터** | 공지 제목 / 게시 기간 / 노출 상태 / 채널(웹·이메일·카카오톡) |
| **주요 액션** | `공지 작성` / `예약 발송` / `게시 중지` / 배너 이미지 업로드 |
| **운영자 Flow 연결** | [§5 공지/리마인드 발송](./user-flow-operator.md) |

---

### 4-22. 알림 설정 `/admin/system/notifications`

| 항목 | 내용 |
| --- | --- |
| **목적** | 자동 알림 트리거·채널·대상 규칙 설정 |
| **핵심 데이터** | 알림 이벤트명 / 채널 / 활성 여부 |
| **주요 액션** | 알림 ON/OFF / 채널 변경 |

---

### 4-23. 통계/리포트 `/admin/reports`

| 항목 | 내용 |
| --- | --- |
| **목적** | 플랫폼 주요 지표 대시보드 |
| **핵심 데이터** | 프로젝트 등록 수 / 완료율 / 매칭 성공률 / 정산 금액 추이 |
| **주요 액션** | 기간 필터 / CSV 다운로드 |

---

### 4-24. 관리자 계정 `/admin/settings`

| 항목 | 내용 |
| --- | --- |
| **목적** | 운영자 계정 목록 및 권한 관리 |
| **핵심 데이터** | 관리자명 / 역할(슈퍼·운영·CS) / 마지막 로그인 |
| **주요 액션** | 계정 추가 / 역할 변경 / 비활성화 |

---

### 4-25. 플랫폼 설정 `/admin/settings/platform`

| 항목 | 내용 |
| --- | --- |
| **목적** | 플랫폼 전반 운영 파라미터 설정 |
| **핵심 데이터** | 수수료율 / 파일 보관 기간 / 서비스 점검 모드 등 |
| **주요 액션** | 값 수정 / 저장 |

---

### 4-26. 사용자 로그 `/admin/settings/logs`

| 항목 | 내용 |
| --- | --- |
| **목적** | 운영자 액션 감사(Audit) 로그 열람 |
| **핵심 데이터** | 이벤트 유형 / 수행자 / 대상 / 발생 시각 |
| **주요 액션** | 날짜·이벤트 유형 필터 / 상세 보기 |
| **운영자 Flow 연결** | [§7 활동 로그 열람](./user-flow-operator.md) |

---

### 4-27. 보안자료 `/admin/security/messages`

| 항목 | 내용 |
| --- | --- |
| **목적** | NDA·보안서약서 등 보안 관련 문서 보관소 |
| **핵심 데이터** | 문서 유형 / 프로젝트 연결 / 업로드일 |
| **주요 액션** | 다운로드 / 만료 처리 |

---

### 4-28. 신고 관리 `/admin/reports-management` ⭐ 핵심

| 항목 | 내용 |
| --- | --- |
| **목적** | 사용자 신고 접수 및 처리 |
| **핵심 데이터** | 신고 유형(프로젝트·메시지·프로필·제안서) / 상태(미처리·처리중·종결) / 신고자·피신고자 |
| **주요 액션** | 신고 내용 확인 → `콘텐츠 숨김` / `경고/제재` / `종결(기록)` |
| **운영자 Flow 연결** | [§3 신고 처리](./user-flow-operator.md) |

---

## 5. 딥링크 라우트 (사이드바 외)

| 화면 | URL | 접근 경로 |
| --- | --- | --- |
| 프로젝트 상세 | `/admin/projects/:id` | 목록 행 클릭 |
| 프로젝트 상세(관리) | `/admin/project-detail/:id` | 프로젝트 운영 플로우 |
| 컨설팅 상세 | `/admin/consulting/:id` | 문의 목록 행 클릭 |
| 기업 상세 | `/admin/companies/:id` | 기업 관리 행 클릭 |
| 활동 로그(전역) | `/admin/activity-logs` | 사용자 로그와 별도 |
| 워크플로 — 매칭 | `/admin/workflow/matching` | 프로젝트 상세 내 탭 |
| 워크플로 — 제안서 | `/admin/workflow/proposal` | 위 동일 |
| 워크플로 — 제안서 보기 | `/admin/workflow/proposal/view/:companyId` | 위 동일 |
| 워크플로 — 계약 | `/admin/workflow/contract` | 위 동일 |
| 워크플로 — 제작 | `/admin/workflow/production` | 위 동일 |
| 워크플로 — 정산 | `/admin/workflow/settlement` | 위 동일 |
| 워크플로 — 리뷰 | `/admin/workflow/review` | 위 동일 |
| 워크플로 — 사후관리 | `/admin/workflow/post-review` | 위 동일 |
| 워크플로 — 소비자조사 | `/admin/workflow/consumer-survey` | 위 동일 |
| 워크플로 — TVCF리뷰 | `/admin/workflow/tvcf-review` | 위 동일 |
| 워크플로 embed(동일) | `/admin/workflow-embed/*` | 모달·임베드 용도 |

---

## 6. 운영자 Flow → 어드민 화면 매핑

| 운영자 Flow | 어드민 화면 | URL |
| --- | --- | --- |
| 공개 프로젝트 승인 | 승인 대기 | `/admin/pending-approval` |
| 중단/취소 승인 | 중단/취소 요청 | `/admin/stop-cancel` |
| 신고 처리 | 신고 관리 | `/admin/reports-management` |
| 기업 인증 | 기업 인증 관리 | `/admin/company-verification` |
| 공지/리마인드 발송 | 공지 & 배너 관리 | `/admin/announcements` |
| 시스템 오류 모니터링 | 통계/리포트 + 사용자 로그 | `/admin/reports`, `/admin/settings/logs` |
| 활동 로그(Audit) | 사용자 로그 | `/admin/settings/logs` |

---

## 7. 상태값 참조

어드민에서 다루는 주요 프로젝트 상태값.

| 상태값 | 설명 | 관련 화면 |
| --- | --- | --- |
| `REQUESTED` | 공개 프로젝트 승인 요청 | 승인 대기 |
| `APPROVED` | 승인 완료 | 전체 프로젝트 |
| `REJECTED` | 승인 반려 | 승인 대기 |
| `PROPOSAL_OPEN` | 접수중 | 공고 프로젝트 |
| `PROPOSAL_CLOSED` | 접수 마감 | 공고 프로젝트 |
| `SELECTED` | 선정 완료 | 전체 프로젝트 |
| `CONTRACT` | 계약 단계 | 계약 & 정산 |
| `PRODUCTION` | 제작 진행 | 진행 현황 |
| `SETTLEMENT` | 정산 단계 | 계약 & 정산 |
| `COMPLETE` | 종료 | 전체 프로젝트 |
| `STOPPED.ADMIN_CHECKING` | 중단 — 운영자 확인 중 | 중단/취소 요청 |
| `CANCELLED.ADMIN_CHECKING` | 취소 — 운영자 확인 중 | 중단/취소 요청 |
| `ADMIN_CONFIRMED` | 중단/취소 확정 | 중단/취소 요청 |

---

## 8. 미구현 / 향후 과제

| 항목 | 내용 | 우선순위 |
| --- | --- | --- |
| 대시보드 To-do 카드 | 승인 대기·신고·인증 건수 실시간 집계 | 높음 |
| 승인 대기 — 승인/반려 API 연동 | 현재 UI만 존재 | 높음 |
| 중단/취소 — 상태 전이 API | `ADMIN_CHECKING → ADMIN_CONFIRMED` | 높음 |
| 기업 인증 — 승인/반려 결과 알림 | 사용자 화면에 결과 미표시 | 중간 |
| 신고 관리 — 제재 액션 API | 현재 localStorage 기반 | 중간 |
| 통계/리포트 — 실제 집계 | 현재 mock | 낮음 |
| RBAC — 역할별 메뉴 가시성 | 슈퍼·운영·CS 권한 분리 | 낮음 |
| 활동 로그 메뉴 소속 정리 | `/admin/activity-logs` vs 사용자 로그 중복 | 낮음 |

---

*문서 버전: v0.2 | 2026-04-02*
