# Admin 프로젝트 화면: V1 vs V2 구조 비교 및 V2 기능 V1 이식 방안

## 1. 구조 차이 요약

| 구분 | V1 (admin) | V2 (admin_v2) |
|------|------------|---------------|
| **네비게이션** | URL별 페이지. 사이드바에서 **프로젝트 유형**으로 구분 (전체 / 공고 / 1:1 / 컨설팅 + 승인대기, 중단·취소) | 단일 경로 `/admin/v2`, **탭**으로 **진행 절차** 구분 (승인대기, 전체, 매칭/제안, 제안서/시안, 계약, 제작, 정산, 리뷰) |
| **데이터** | `MOCK_ADMIN_PROJECTS_V1` | `MOCK_PROJECTS` |
| **상태 체계** | `MainStatus` (세분화: REQUESTED, PROPOSAL_OPEN, OT_SCHEDULED, … CONTRACT, SHOOTING, COMPLETE 등) | 단순화: REQUESTED, MATCHING, APPROVED, CONTRACT, PRODUCTION, SETTLEMENT, COMPLETE 등 |
| **프로젝트 타입** | `공고` \| `1:1` \| `컨설팅` | `PUBLIC` \| `CONSULTING` (+ 프로젝트 유형: TVCF, 바이럴 등) |
| **프로젝트 목록** | 하나의 `ProjectManagement` 컴포넌트. `filterType`으로 유형 필터만 적용 | 탭별로 **다른 컴포넌트** 또는 **동일 리스트 + 탭 필터** (승인대기/전체/리뷰는 ProjectManagement, 매칭→MatchingManagement, 계약→ContractManagement 등) |
| **상세/액션** | 행 클릭 시 `CompanyDetailTabs` (회사+프로젝트 정보). ProcessStepper로 단계 표시 | 행 클릭 시 `ProjectDetailDrawer`. 탭/화면별로 **절차 전용 UI** (참여자·OT/PT, 계약서, 정산 단계 등) |

요약하면, **V1은 “유형별 한 페이지 + 공통 리스트”**, **V2는 “절차별 전용 화면 + 절차별 상세/액션”** 구조다.

---

## 2. V2에 있는 “기능”이 V1에 어떻게 매핑되는지

- **승인대기**  
  - V2: `projects-unapproved` 탭, 공개+REQUESTED만, 승인/반려 버튼.  
  - V1: `/admin/pending-approval` 별도 페이지 + `ProjectManagement` 상태 필터 “승인요청”.  
  → 기능은 있음. 다만 “한 리스트 안에서 절차 뷰로 보기”는 없음.

- **매칭/제안**  
  - V2: `MatchingManagement` — 참여자 목록, OT/PT 일정·초대·증빙, 메시지 등.  
  - V1: 동일한 **전용 화면** 없음. 리스트에서 PROPOSAL_OPEN, OT_SCHEDULED 등으로만 구분 가능.

- **제안서/시안**  
  - V2: `ProposalManagement2` — 제안서·시안 목록/상세.  
  - V1: 리스트 + ProcessStepper로 “제안서” 단계 표시만 있고, 제안서 전용 관리 화면 없음.

- **계약**  
  - V2: `ContractManagement` — 계약 목록, 계약서 상세·검토·서명 상태.  
  - V1: CONTRACT 상태로 필터만 가능, 계약 전용 화면 없음.

- **제작/산출물**  
  - V2: `ProductionManagement` — 제작 단계별 관리.  
  - V1: SHOOTING, EDITING 등으로 필터 가능, 제작 전용 화면 없음.

- **정산**  
  - V2: `SettlementManagement` — 착수/중도/잔금 단계, 납부 상태.  
  - V1: 정산 전용 화면 없음.

- **리뷰/평가**  
  - V2: `projects-review` 탭, 완료/AS 프로젝트 + 리뷰 필터.  
  - V1: COMPLETE 등으로 필터만 가능, 리뷰 전용 뷰 없음.

즉, **V1에는 “절차별 전용 화면”과 “절차별 상세/액션”이 없고, “리스트 + 상태 필터 + 공통 상세”만 있다.**

---

## 3. V1 데이터/상태로의 매핑

V1은 이미 `MainStatus`와 `StatusByCategory`(`project-status.ts`)로 **단계**가 정의돼 있다.

- **등록**: DRAFT, REQUESTED, APPROVED, PROPOSAL_OPEN, PROPOSAL_CLOSED  
  → “승인대기”에 대응하는 건 주로 REQUESTED (및 공개 여부).
- **접수단계**: OT_SCHEDULED, OT_COMPLETED, PROPOSAL_SUBMIT, PROPOSAL_SUBMITTED, PT_SCHEDULED, PT_COMPLETED, NO_SELECTION, SELECTED  
  → “매칭/제안”, “제안서/시안”에 대응.
- **계약**: CONTRACT  
  → “계약”.
- **제작**: SHOOTING, EDITING, DRAFT_SUBMITTED, FINAL_APPROVED  
  → “제작/산출물”.
- **제작완료**: PRODUCTION_COMPLETE  
- **온에어**: ONAIR_STARTED  
- **사후관리**: AFTER_SERVICE  
- **완료**: COMPLETE  
  → “정산”은 지급 단계 개념이라 V1 MainStatus와는 별도로 “정산 진행 중” 구간을 정의해야 함. “리뷰”는 AFTER_SERVICE, COMPLETE로 매핑 가능.

정리하면, **V2의 “절차”는 V1의 MainStatus/StatusByCategory로 1:1로 매핑 가능**하다.  
차이는 “그걸 보여주는 전용 화면과 액션이 V1에 없다”는 점이다.

---

## 4. V2 기능을 V1에 붙이는 방향 (아이디어)

목표: **V2처럼 “절차별로 보기 + 절차별로 뭔가 하기”**를 V1에도 두는 것.  
단, **V1은 “페이지/라우트 단위 + 기존 리스트/상세 구조”**를 유지한다.

### A. 리스트: “절차(뷰)” 추가

- **현재**: 프로젝트 유형 필터(전체/공고/1:1/컨설팅) + 상태 필터(드롭다운).
- **추가**: 상단에 **절차 탭 또는 버튼**을 둔다.  
  예: `전체 | 승인대기 | 매칭·제안 | 제안서·시안 | 계약 | 제작·산출물 | 정산 | 리뷰·평가`
- **동작**:  
  - “승인대기” → `visibility === 'PUBLIC' && status === 'REQUESTED'` (필요 시 V1 필드 맞게 조정).  
  - 나머지 절차 → `StatusByCategory` 또는 직접 정의한 `MainStatus[]`로 필터.  
  - 기존 테이블·검색·페이지네이션·ProcessStepper는 그대로 사용.

이렇게 하면 **V1 한 페이지에서도 “지금 어떤 절차 화면인지”가 명확**해지고, V2의 “탭 = 절차”와 개념이 맞춰진다.

### B. 상세: 절차별 블록/탭 추가

- **현재**: 행 클릭 시 `CompanyDetailTabs` (회사 정보, 프로젝트 요약 등).
- **추가**:  
  - 프로젝트 상세 안에 **“진행 단계” 또는 “절차”** 탭/섹션을 둔다.  
  - 단계별로 “매칭 현황”, “제안서·시안”, “계약 정보”, “제작 현황”, “정산 현황”, “리뷰” 같은 **블록**을 넣는다.  
  - 각 블록은 **V2의 MatchingManagement / ContractManagement / SettlementManagement 등에 쓰인 로직·UI를 참고해, V1 데이터(MOCK_ADMIN_PROJECTS_V1, MainStatus)와 V1 스타일에 맞게 재구현**한다.  
  - 예: 계약 블록 → “계약 상태, 요약, 첨부” 정도만 먼저 넣고, 정산 블록 → “착수/중도/잔금, 납부 여부” 정도만 넣는 식으로 단계적 구현.

즉, **“페이지를 v2로 링크만 걸지 말고, V1 페이지/컴포넌트 안에 V2와 같은 기능을 V1 구조·데이터에 맞게 구현”**하는 방향이다.

### C. 데이터 정합성

- V2 전용 화면들은 `MOCK_PROJECTS`, `MOCK_CONTRACTS` 등 **다른 목업**을 쓴다.  
- V1에 기능을 붙일 때는 **V1 데이터를 기준**으로 두는 게 낫다.  
  - 예: 정산 화면을 V1에 넣으면 “프로젝트 목록”은 `MOCK_ADMIN_PROJECTS_V1`에서 CONTRACT/SHOOTING/COMPLETE 등으로 가져오고,  
  - “정산 단계(착수/중도/잔금)”는 V2의 `MOCK_SETTLEMENTS` 구조를 **참고**해, `projectId`를 V1 프로젝트 id에 맞춘 새 목업을 만들거나, 기존 V1 프로젝트에 `settlement` 필드를 붙이는 식으로 맞춘다.
- **상태 매핑**:  
  - V2 status → V1 MainStatus 변환 테이블을 한 곳에 두고,  
  - “절차 뷰” 필터와 “상세 절차 블록” 둘 다 이 테이블을 사용하면, 나중에 실제 API가 붙었을 때도 한 군데만 수정하면 된다.

### D. 구현 순서 제안

1. **절차 뷰 필터 (A)**  
   - `/admin/projects` (및 공고/1:1/컨설팅 페이지)의 `ProjectManagement` 상단에 “절차” 탭/버튼 추가.  
   - `StatusByCategory` + “승인대기” 규칙으로 필터만 적용해, 기존 테이블이 절차별로 잘리는지 확인.
2. **상세에 “절차” 섹션 추가 (B)**  
   - `CompanyDetailTabs`(또는 프로젝트 상세를 보여주는 컴포넌트)에 “진행 단계” 탭 추가.  
   - 그 안에 “매칭”, “계약”, “제작”, “정산”, “리뷰” 중 **우선순위 높은 1~2개**만 블록으로 구현 (V2 로직 참고, V1 데이터/UI에 맞게).
3. **데이터 확장 (C)**  
   - 정산·계약 등 전용 UI를 넣을 때, V1 목업에 필요한 필드 추가 또는 V2 스타일 목업을 V1 id에 맞춰 연결.
4. **나머지 절차 블록**  
   - 매칭/제안, 제안서/시안, 제작/산출물 등을 같은 패턴으로 하나씩 추가.

---

## 5. 정리

- **구조 차이**: V1 = URL·유형별 페이지 + 하나의 리스트/상세. V2 = 탭·절차별 화면 + 절차별 전용 컴포넌트.
- **기능 차이**: V1에는 “절차별 전용 화면/액션”이 없고, “리스트 + 상태 필터 + 공통 상세”만 있음.
- **이식 방향**:  
  - 리스트에는 **절차(뷰) 필터**를 추가하고,  
  - 상세에는 **절차별 블록(매칭, 계약, 제작, 정산, 리뷰)**을 V1 데이터/UI에 맞게 넣되,  
  - **V2 화면을 그대로 가져오지 말고, V2의 “기능(무엇을 보여주고 무엇을 하는지)”만 참고해 V1 구조에 맞게 구현**하는 방식이 맞다.

이 문서를 기준으로 “어디부터 손댈지”(예: 먼저 절차 탭만 넣기, 또는 계약 블록부터 넣기) 정하면 된다.
