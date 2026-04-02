# Admin API 명세 (API Specification)

| 항목 | 내용 |
| --- | --- |
| **문서명** | ADMarket Admin — 어드민 전용 API 명세 |
| **버전** | v0.1 |
| **최종 업데이트** | 2026-04-02 |
| **Base URL** | `/api/admin` |
| **관련 문서** | [admin-ia.md](./admin-ia.md), [admin-state-machine.md](./admin-state-machine.md), [api.md](./api.md) |

> **참고** `api.md`는 사용자 화면용 일반 API. 본 문서는 `/api/admin/*` 어드민 전용 엔드포인트만 다룬다.  
> 현재 구현된 서버 라우트: `/api/project`, `/api/messages`, `/api/notifications`, `/api/projects`, `/api/schedules`, `/api/analytics` — 모두 **사용자용**, 어드민 전용 API는 **전체 미구현** 상태.

---

## 공통 규칙

### 인증
```
Authorization: Bearer {admin_token}
```
모든 `/api/admin/*` 엔드포인트는 운영자 권한 토큰 필요.

### 공통 에러 응답

| 코드 | 의미 |
| --- | --- |
| `400` | 잘못된 요청 (파라미터 오류) |
| `401` | 인증 실패 |
| `403` | 권한 없음 (운영자 아님) |
| `404` | 리소스 없음 |
| `409` | 상태 전이 불가 (이미 처리됨 등) |
| `500` | 서버 오류 |

### 구현 현황 표기

| 기호 | 의미 |
| --- | --- |
| ✅ | 구현됨 |
| ⚠️ | 부분 구현 (UI만 / 목업) |
| ❌ | 미구현 (API 없음) |

---

## 1. 프로젝트 관리

### 1-1. 전체 프로젝트 목록 ❌

```
GET /api/admin/projects
```

**Query Parameters**

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| `status` | string | 상태값 필터 (REQUESTED, APPROVED, PROPOSAL_OPEN 등) |
| `type` | string | 프로젝트 유형 (public, private, consulting) |
| `dateFrom` | string | 등록일 시작 (ISO 8601) |
| `dateTo` | string | 등록일 종료 |
| `page` | number | 페이지 번호 (기본: 1) |
| `limit` | number | 페이지당 건수 (기본: 20) |

**Response 200**
```json
{
  "data": [
    {
      "id": "proj_001",
      "name": "삼성 갤럭시 S25 광고",
      "ownerName": "삼성전자",
      "type": "public",
      "status": "REQUESTED",
      "budget": 150000000,
      "createdAt": "2026-04-01T09:00:00Z"
    }
  ],
  "total": 128,
  "page": 1,
  "limit": 20
}
```

---

### 1-2. 프로젝트 상세 ❌

```
GET /api/admin/projects/:id
```

**Response 200** — 프로젝트 전체 정보 (광고주 정보, 현재 상태, 참여사 목록 포함)

---

### 1-3. 프로젝트 승인 ❌ ⭐ MVP 1순위

```
PATCH /api/admin/projects/:id/approve
```

**Request Body** — 없음

**Response 200**
```json
{
  "id": "proj_001",
  "status": "APPROVED",
  "approvedAt": "2026-04-02T10:30:00Z",
  "approvedBy": "admin_001"
}
```

**상태 전이**: `REQUESTED` → `APPROVED`  
**후속 처리**: 광고주에게 R-02 알림 발송

**에러 케이스**
- `409`: 이미 승인/반려된 프로젝트

---

### 1-4. 프로젝트 반려 ❌ ⭐ MVP 1순위

```
PATCH /api/admin/projects/:id/reject
```

**Request Body**
```json
{
  "reason": "예산 정보 불일치. 수정 후 재제출 바랍니다."
}
```

**Response 200**
```json
{
  "id": "proj_001",
  "status": "REJECTED",
  "rejectedAt": "2026-04-02T10:30:00Z",
  "rejectedBy": "admin_001",
  "reason": "예산 정보 불일치. 수정 후 재제출 바랍니다."
}
```

**상태 전이**: `REQUESTED` → `REJECTED` (광고주 측에서 `DRAFT`로 복귀)  
**후속 처리**: 광고주에게 R-03 알림 발송 (사유 포함)

---

### 1-5. 승인 대기 목록 ❌

```
GET /api/admin/projects/pending
```

`GET /api/admin/projects?status=REQUESTED` 와 동일하나 어드민 대시보드 카운트용 별도 엔드포인트 권장.

**Response 200**
```json
{
  "data": [...],
  "count": 5
}
```

---

## 2. 중단/취소 요청 관리

### 2-1. 중단/취소 요청 목록 ❌ ⭐ MVP 1순위

```
GET /api/admin/projects/stop-cancel
```

**Response 200**
```json
{
  "data": [
    {
      "id": "proj_002",
      "name": "LG 광고 프로젝트",
      "requestType": "STOPPED",
      "status": "ADMIN_CHECKING",
      "requestedBy": "user_123",
      "requestedAt": "2026-04-01T14:00:00Z",
      "reason": "클라이언트 예산 삭감으로 인한 중단 요청"
    }
  ],
  "count": 3
}
```

---

### 2-2. 중단/취소 확정 ❌ ⭐ MVP 1순위

```
PATCH /api/admin/projects/:id/confirm-stop-cancel
```

**Request Body**
```json
{
  "action": "CONFIRM",
  "note": "정산 및 자료 보관 정책 안내 발송 예정"
}
```

**Response 200**
```json
{
  "id": "proj_002",
  "status": "ADMIN_CONFIRMED",
  "confirmedAt": "2026-04-02T11:00:00Z"
}
```

**상태 전이**: `STOPPED.ADMIN_CHECKING` → `STOPPED.ADMIN_CONFIRMED`  
또는 `CANCELLED.ADMIN_CHECKING` → `CANCELLED.ADMIN_CONFIRMED`  
**후속 처리**: 광고주·참여사에게 X-02 알림 발송

---

### 2-3. 중단/취소 반려 ❌

```
PATCH /api/admin/projects/:id/reject-stop-cancel
```

**Request Body**
```json
{
  "reason": "계약서 상 중단 조건 미충족"
}
```

**상태 전이**: `*.ADMIN_CHECKING` → 이전 진행 상태로 복귀  
**후속 처리**: 광고주에게 X-03 알림 발송

---

## 3. 기업 인증 관리

### 3-1. 인증 신청 목록 ❌

```
GET /api/admin/company-verification
```

**Query Parameters**: `status` (pending, approved, rejected), `page`, `limit`

**Response 200**
```json
{
  "data": [
    {
      "id": "ver_001",
      "companyId": "comp_001",
      "companyName": "영상제작소 ABC",
      "type": "제작사",
      "submittedAt": "2026-04-01T09:00:00Z",
      "status": "pending",
      "documents": ["사업자등록증.pdf"]
    }
  ],
  "count": 7
}
```

---

### 3-2. 기업 인증 승인 ❌

```
PATCH /api/admin/company-verification/:id/approve
```

**Response 200**
```json
{
  "id": "ver_001",
  "status": "approved",
  "approvedAt": "2026-04-02T10:00:00Z"
}
```

**후속 처리**: 기업 대표관리자에게 V-02 알림 발송

---

### 3-3. 기업 인증 반려 ❌

```
PATCH /api/admin/company-verification/:id/reject
```

**Request Body**
```json
{
  "reason": "사업자등록증 유효기간 만료. 최신 서류로 재제출 바랍니다."
}
```

**후속 처리**: 기업 대표관리자에게 V-03 알림 발송 (사유 포함)

---

## 4. 회원/기업 관리

### 4-1. 회원 목록 ❌

```
GET /api/admin/members
```

**Query Parameters**: `status` (active, suspended), `companyId`, `page`, `limit`

---

### 4-2. 기업 목록 ❌

```
GET /api/admin/companies
```

**Query Parameters**: `type` (advertiser, agency, production), `verificationStatus`, `page`, `limit`

---

### 4-3. 기업 상세 ❌

```
GET /api/admin/companies/:id
```

---

### 4-4. 회사소개서 목록 ❌

```
GET /api/admin/company-portfolios
```

**Query Parameters**: `status` (pending, approved, rejected), `page`, `limit`

---

### 4-5. 회사소개서 승인/반려 ❌

```
PATCH /api/admin/company-portfolios/:id/review
```

**Request Body**
```json
{
  "action": "approve",
  "reason": ""
}
```

`action`: `"approve"` | `"reject"`

---

## 5. 리뷰 관리

### 5-1. 리뷰 목록 ❌

```
GET /api/admin/reviews
```

**Query Parameters**: `visibility` (visible, hidden), `reportedOnly` (boolean), `page`, `limit`

**Response 200**
```json
{
  "data": [
    {
      "id": "rev_001",
      "projectName": "삼성 갤럭시 S25 광고",
      "authorName": "삼성전자",
      "targetCompany": "영상제작소 ABC",
      "rating": 4,
      "content": "제작 퀄리티가 우수했습니다.",
      "visibility": "visible",
      "reportCount": 0,
      "createdAt": "2026-04-01T12:00:00Z"
    }
  ],
  "total": 48
}
```

---

### 5-2. 리뷰 노출/숨김 토글 ⚠️ (클라이언트 상태만)

```
PATCH /api/admin/reviews/:id/visibility
```

**Request Body**
```json
{
  "visibility": "hidden"
}
```

`visibility`: `"visible"` | `"hidden"`

---

### 5-3. 리뷰 삭제 ⚠️ (클라이언트 상태만)

```
DELETE /api/admin/reviews/:id
```

---

## 6. 신고 관리

### 6-1. 신고 목록 ❌

```
GET /api/admin/reports
```

**Query Parameters**: `type` (project, message, profile, proposal), `status` (unresolved, in_progress, resolved), `page`, `limit`

**Response 200**
```json
{
  "data": [
    {
      "id": "rep_001",
      "type": "message",
      "status": "unresolved",
      "reporterName": "홍길동",
      "targetId": "msg_123",
      "content": "부적절한 언어 사용",
      "reportedAt": "2026-04-01T16:00:00Z"
    }
  ],
  "count": 12
}
```

---

### 6-2. 신고 처리 (조치 및 종결) ❌

```
PATCH /api/admin/reports/:id/resolve
```

**Request Body**
```json
{
  "action": "hide_content",
  "note": "커뮤니티 가이드라인 위반으로 콘텐츠 숨김 처리"
}
```

`action`: `"hide_content"` | `"warn_user"` | `"dismiss"` | `"close"`

---

### 6-3. 신고 대상 콘텐츠 숨김 ❌

```
PATCH /api/admin/reports/:id/hide-content
```

**후속 처리**: 피신고자에게 G-03 알림, 신고자에게 G-02 알림

---

## 7. 계약 & 정산 관리

### 7-1. 계약/정산 목록 ❌

```
GET /api/admin/contracts
```

**Query Parameters**: `settlementStatus` (NOT_STARTED, DEPOSIT_PAID, MID_PAID, BALANCE_PAID, COMPLETE), `page`, `limit`

**Response 200**
```json
{
  "data": [
    {
      "id": "proj_003",
      "projectName": "LG TV 광고",
      "ownerName": "LG전자",
      "participantName": "영상제작소 ABC",
      "contractAmount": 80000000,
      "depositStatus": "COMPLETE",
      "midStatus": "COMPLETE",
      "balanceStatus": "PENDING",
      "settlementStatus": "MID_PAID"
    }
  ],
  "total": 35
}
```

---

## 8. 공지 & 배너 관리

### 8-1. 공지사항 목록 ❌

```
GET /api/admin/announcements
```

**Query Parameters**: `type` (notice, banner), `status` (active, scheduled, expired), `page`, `limit`

---

### 8-2. 공지사항 생성 ❌

```
POST /api/admin/announcements
```

**Request Body**
```json
{
  "title": "시스템 점검 안내",
  "content": "2026년 4월 10일 새벽 2시 ~ 4시 시스템 점검이 있습니다.",
  "type": "notice",
  "targetGroup": "all",
  "channels": ["platform", "email"],
  "publishAt": "2026-04-08T09:00:00Z",
  "expireAt": "2026-04-10T10:00:00Z"
}
```

`targetGroup`: `"all"` | `"advertiser"` | `"participant"` | `"consultant"`

---

### 8-3. 공지사항 수정 ❌

```
PATCH /api/admin/announcements/:id
```

---

### 8-4. 공지사항 삭제 ❌

```
DELETE /api/admin/announcements/:id
```

---

## 9. 컨설팅 관리

### 9-1. 컨설팅 문의 목록 ❌

```
GET /api/admin/consulting
```

---

### 9-2. 컨설턴트 배정 ❌

```
PATCH /api/admin/consulting/:id/assign
```

**Request Body**
```json
{
  "consultantId": "cons_001"
}
```

---

### 9-3. 컨설턴트 목록 ❌

```
GET /api/admin/consultants
```

---

## 10. 통계/리포트

### 10-1. 대시보드 개요 통계 ❌

```
GET /api/admin/stats/overview
```

**Response 200**
```json
{
  "pendingApproval": 5,
  "stopCancelRequests": 3,
  "pendingVerification": 7,
  "unresolvedReports": 12,
  "activeProjects": 84,
  "completedProjects": 231,
  "totalMembers": 1024,
  "totalCompanies": 387
}
```

---

### 10-2. 프로젝트 통계 ❌

```
GET /api/admin/stats/projects
```

**Query Parameters**: `dateFrom`, `dateTo`, `groupBy` (day, week, month)

**Response 200**
```json
{
  "totalRegistered": 128,
  "totalApproved": 115,
  "totalCompleted": 89,
  "approvalRate": 0.898,
  "completionRate": 0.773,
  "byStatus": {
    "PROPOSAL_OPEN": 23,
    "PRODUCTION": 18,
    "SETTLEMENT": 7
  },
  "timeline": [
    { "date": "2026-04-01", "count": 5 }
  ]
}
```

---

### 10-3. 회원/기업 통계 ❌

```
GET /api/admin/stats/users
```

---

## 11. 활동 로그 (Audit Log)

### 11-1. 감사 로그 목록 ❌

```
GET /api/admin/activity-logs
```

**Query Parameters**: `actorId`, `eventType`, `dateFrom`, `dateTo`, `page`, `limit`

**Response 200**
```json
{
  "data": [
    {
      "id": "log_001",
      "eventType": "PROJECT_APPROVED",
      "actorId": "admin_001",
      "actorName": "운영자 홍길동",
      "targetId": "proj_001",
      "targetType": "project",
      "detail": "프로젝트 승인 처리",
      "createdAt": "2026-04-02T10:30:00Z"
    }
  ],
  "total": 412
}
```

> 로그는 수정·삭제 불가 (PRD §7.5.2)

---

## 12. 구현 우선순위 요약

### MVP 1순위 (즉시 구현)

| 엔드포인트 | 연결 화면 |
| --- | --- |
| `PATCH /api/admin/projects/:id/approve` | `/admin/pending-approval` |
| `PATCH /api/admin/projects/:id/reject` | `/admin/pending-approval` |
| `GET /api/admin/projects/pending` | 대시보드 카운트 |
| `PATCH /api/admin/projects/:id/confirm-stop-cancel` | `/admin/stop-cancel` |
| `PATCH /api/admin/projects/:id/reject-stop-cancel` | `/admin/stop-cancel` |
| `GET /api/admin/projects/stop-cancel` | `/admin/stop-cancel` |
| `GET /api/admin/stats/overview` | 대시보드 |

### MVP 2순위

| 엔드포인트 | 연결 화면 |
| --- | --- |
| `PATCH /api/admin/company-verification/:id/approve` | `/admin/company-verification` |
| `PATCH /api/admin/company-verification/:id/reject` | `/admin/company-verification` |
| `PATCH /api/admin/reviews/:id/visibility` | `/admin/reviews` |
| `PATCH /api/admin/reports/:id/resolve` | `/admin/reports-management` |

### P2 이후

| 엔드포인트 |
| --- |
| `GET /api/admin/stats/projects` |
| `POST /api/admin/announcements` |
| `GET /api/admin/activity-logs` |
| 컨설팅 관련 전체 |

---

*문서 버전: v0.1 | 2026-04-02*
