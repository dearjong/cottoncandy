# Cotton Candy API Documentation

## Base URL
```
https://6760df1a6be7889dc35e7614.mockapi.io/api/v1
```

## Authentication
모든 보호된 엔드포인트는 Bearer 토큰 인증이 필요합니다.
```
Authorization: Bearer {token}
```

---

## Members API (구성원 관리)

### GET /members
전체 구성원 목록 조회

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | 상태 필터: `active`, `pending` |
| role | string | No | 권한 필터: `대표관리자`, `부관리자`, `일반직원` |
| department | string | No | 부서 필터 |

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "name": "홍길동",
    "nickname": "길동이",
    "department": "마케팅팀",
    "position": "팀장",
    "role": "대표관리자",
    "email": "hong@example.com",
    "status": "active",
    "isMember": true
  }
]
```

### GET /members/:id
특정 구성원 상세 조회

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | 구성원 ID |

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "홍길동",
  "nickname": "길동이",
  "department": "마케팅팀",
  "position": "팀장",
  "role": "대표관리자",
  "email": "hong@example.com",
  "status": "active",
  "isMember": true
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Member not found"
}
```

### POST /members
새 구성원 초대

**Request Body:**
```json
{
  "email": "new@example.com",
  "department": "디자인팀",
  "position": "디자이너",
  "role": "일반직원"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | 이메일 주소 |
| department | string | Yes | 부서명 |
| position | string | Yes | 직책 |
| role | string | Yes | 권한: `부관리자`, `일반직원` |
| name | string | No | 이름 (가입 후 자동 입력) |
| nickname | string | No | 닉네임 (가입 후 자동 입력) |

**Response (201 Created):**
```json
{
  "id": "2",
  "email": "new@example.com",
  "department": "디자인팀",
  "position": "디자이너",
  "role": "일반직원",
  "status": "pending",
  "isMember": false
}
```

### PUT /members/:id
구성원 정보 수정

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | 구성원 ID |

**Request Body:**
```json
{
  "department": "마케팅팀",
  "position": "매니저",
  "role": "부관리자",
  "status": "active"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | 이름 |
| nickname | string | No | 닉네임 |
| department | string | No | 부서명 |
| position | string | No | 직책 |
| role | string | No | 권한: `대표관리자`, `부관리자`, `일반직원` |
| status | string | No | 상태: `active`, `pending` |

**Response (200 OK):**
```json
{
  "id": "2",
  "name": "김철수",
  "nickname": "철수",
  "email": "new@example.com",
  "department": "마케팅팀",
  "position": "매니저",
  "role": "부관리자",
  "status": "active",
  "isMember": true
}
```

### DELETE /members/:id
구성원 삭제

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | 구성원 ID |

**Response (200 OK):**
```json
{
  "id": "2"
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Cannot delete primary administrator"
}
```

---

## Projects API (프로젝트 관리)

### GET /projects
프로젝트 목록 조회

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | 상태 필터: `draft`, `published`, `in_progress`, `completed` |
| category | string | No | 카테고리 필터 |
| page | number | No | 페이지 번호 (기본값: 1) |
| limit | number | No | 페이지당 항목 수 (기본값: 20) |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "1",
      "title": "신제품 광고 영상 제작",
      "category": "영상 제작",
      "budget": "5,000,000 - 10,000,000원",
      "status": "published",
      "createdAt": "2025-01-15T09:00:00Z",
      "deadline": "2025-02-28"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

### GET /projects/:id
프로젝트 상세 조회

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | 프로젝트 ID |

**Response (200 OK):**
```json
{
  "id": "1",
  "title": "신제품 광고 영상 제작",
  "description": "신제품 론칭을 위한 30초 광고 영상 제작",
  "category": "영상 제작",
  "budget": "5,000,000 - 10,000,000원",
  "status": "published",
  "requestStyle": "공개 프로젝트 등록",
  "partnerType": "에이전시",
  "objectives": ["브랜드 인지도 향상", "제품 홍보"],
  "techniques": ["모션그래픽", "실사 촬영"],
  "mediaChannels": ["YouTube", "SNS"],
  "targetAudience": "20-30대 여성",
  "schedule": {
    "startDate": "2025-02-01",
    "endDate": "2025-02-28"
  },
  "contactPerson": {
    "name": "홍길동",
    "email": "hong@example.com",
    "phone": "010-1234-5678"
  },
  "createdAt": "2025-01-15T09:00:00Z",
  "updatedAt": "2025-01-15T09:00:00Z"
}
```

### POST /projects
새 프로젝트 생성

**Request Body:**
```json
{
  "title": "신제품 광고 영상 제작",
  "description": "신제품 론칭을 위한 30초 광고 영상 제작",
  "category": "영상 제작",
  "budget": "5,000,000 - 10,000,000원",
  "requestStyle": "공개 프로젝트 등록",
  "partnerType": "에이전시",
  "objectives": ["브랜드 인지도 향상"],
  "techniques": ["모션그래픽"],
  "mediaChannels": ["YouTube"],
  "targetAudience": "20-30대 여성",
  "schedule": {
    "startDate": "2025-02-01",
    "endDate": "2025-02-28"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "1",
  "title": "신제품 광고 영상 제작",
  "status": "draft",
  "createdAt": "2025-01-15T09:00:00Z"
}
```

---

## Messages API (메시지 관리)

### GET /messages
메시지 목록 조회

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | No | 메시지 유형: `received`, `sent` |
| isRead | boolean | No | 읽음 여부 |

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "senderId": "user123",
    "senderName": "김철수",
    "receiverId": "user456",
    "subject": "프로젝트 견적 문의",
    "content": "안녕하세요. 프로젝트 견적을 문의드립니다.",
    "isRead": false,
    "createdAt": "2025-01-15T10:30:00Z"
  }
]
```

### POST /messages
새 메시지 발송

**Request Body:**
```json
{
  "receiverId": "user456",
  "subject": "프로젝트 견적 문의",
  "content": "안녕하세요. 프로젝트 견적을 문의드립니다."
}
```

**Response (201 Created):**
```json
{
  "id": "1",
  "senderId": "user123",
  "receiverId": "user456",
  "subject": "프로젝트 견적 문의",
  "content": "안녕하세요. 프로젝트 견적을 문의드립니다.",
  "isRead": false,
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

## Authentication API (인증)

### POST /auth/login
로그인

**Request Body:**
```json
{
  "email": "hong@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "hong@example.com",
    "name": "홍길동",
    "role": "대표관리자"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

### POST /auth/signup
회원가입

**Request Body:**
```json
{
  "email": "new@example.com",
  "password": "password123",
  "name": "신규사용자",
  "companyName": "주식회사 ABC"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "2",
    "email": "new@example.com",
    "name": "신규사용자",
    "role": "대표관리자"
  }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Rate Limiting
- 인증된 사용자: 분당 100 요청
- 비인증 사용자: 분당 20 요청

## Notes
- 모든 날짜는 ISO 8601 형식 (`YYYY-MM-DDTHH:mm:ssZ`)
- 모든 금액은 원화(KRW) 기준
- 페이지네이션 기본값: page=1, limit=20
