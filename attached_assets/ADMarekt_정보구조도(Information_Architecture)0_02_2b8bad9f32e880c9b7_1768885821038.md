# ADMarekt 정보구조도(Information Architecture)0.02

---

| **항목** | **내용** |
| --- | --- |
| **문서명** | ADMarket 정보구조도 (Information Architecture) |
| **버전** | v0.02 |
| **작성일** | 2025-11-27 |
| **최종 업데이트** | 2025-11-27 |
| **작성자** | ADCream 기획팀 / JH Lee |
| **적용 범위** | ADMarket 플랫폼 전체 (광고주 / 대행사 / 제작사 / 일반 회원 / 플랫폼 운영자) |
| **문서 목적** | 본 문서는 ADMarket 서비스의 전체 정보 체계(IA)를 정의하여 메뉴 구조, 화면 레벨 구조, 사용자 접근 흐름을 명확히 하고, 서비스 전반의 일관된 UX 설계 및 개발 연계를 지원하기 위한 기준을 제공한다. |
| **참고 문서** | ADMarket PRD v0.02, ADMarket 운영정책서 v0.01, ADMarket 기능정의서 v0.02 |

---

## 1. 메인화면 (main)

## 2. 광고제작 의뢰 (create-project)

- 파트너 찾는 방법 (request-style)
- 파트너 유형 (partner-type)
- 프로젝트명 (project-name)
- 광고목적 (advertising-objective)
- 제작기법 (production-technique)
- 제작형태·노출매체 (production-format)
- 주요 고객 (main-client)
- 예산 (budget)
- 대금지급 (payment-terms)
- 일정 (schedule)
- 제품정보 (product-info)
- 담당자 정보 (contact-person)
- 경쟁사 수행기업제외 (excluded-competitors)
- 참여기업 상세조건 (participant-conditions)
- 제출자료 (required-files)
- 상세설명 (additional-description)
- 프로젝트 상세 (project-detail-own)

---

## 3. 대행사·제작사 찾기 (partners)

- 리스트 (list)
- 상세화면 (detail)
    - 팝업: 문의하기 (popup-inquiry)
    - 팝업: 1:1의뢰하기 (popup-direct-request)

---

## 4. 프로젝트 공고 (project-list)

- 리스트 (list)
- 상세화면 (project-detail-public)
    - 팝업: 문의하기 (popup-inquiry)
    - 팝업: 참여신청 (popup-apply)

---

## 5. 이용안내 (guides)

- Home (guide-home)
- 특장점 (features)
- 이용방법 (usage-guide)
- 자주 묻는 질문 (faq)
- 1:1 문의 (inquiry)
- 공지사항 (notices)
- 이벤트 (events)

---

## 6. 영상 공모전 (contests)

- 공모전 메인 (contests-main)

---

## 7. 소규모 제작 Shop (shop)

- 소규모 제작 Shop 메인 (shop-main)

---

## 8. Work

### 8-1. Work 홈 (work-home)

---

### 8-2. 메시지 (messages)

- 리스트 (list)
    - 전체 (all)
    - 받은 (inbox)
    - 보낸 (sent)
- 읽기 (read)
- 답장하기 (reply)

---

### 8-3. 알림 (notifications)

- 리스트 (list)
    - 전체 (all)
    - 프로젝트 알림 (project)
    - 맞춤·추천 알림 (recommended)
    - 일반 알림 (general)

---

### 8-4. 프로젝트 관리 (project-management)

- 프로젝트 리스트 (list)
- 프로젝트 개요 (project-detail-manage)
- 메시지 (messages)
    - 리스트 (list)
        - 전체 (all)
        - 받은 (inbox)
        - 보낸 (sent)
    - 읽기 (read)
    - 답장하기 (reply)
- 알림 (notifications)
    - 리스트 (list)
        - 전체 (all)
        - 프로젝트 알림 (project)
- 일정관리 (schedule-management)
- 참여기업 관리 (participant-management)
    - 참여현황 (status)
    - OT 안내 (ot-invitation)
    - PT 안내 (pt-invitation)
- 제안서·시안 (proposals)
    - 제출현황 (proposal-status)
    - 등록수정 (proposal-edit)
    - 제안서·시안 보기(의뢰/참여) (proposal-view)
- 계약정보 (contract-info)
- 산출물 (deliverables)
- 정산 (settlement)
- 사후관리 (post-review)
    - 제작리뷰 (production-review)
    - 제작후기 (production-feedback)
    - TVCF 소비자반응조사 (consumer-report)
    - TVCF 리뷰 (tvcf-review)

---

### 8-5. 문서함 (file-box)

### 회사소개서 & 포트폴리오 (portfolio)

- 회사소개서&포트폴리오 홈 (portfolio-home)
- 담당자 정보 (contact-person)
- 경험·특화 분야/광고매체 (experience-media)
- 광고 목적별 전문 분야 (objective-specialty)
- 제작기법별 전문분야 (technique-specialty)
- 대표 광고주 (main-clients)
- 대표 수상내역 (awards)
- 대표 포트폴리오 (portfolio-items)
- 대표 스태프 (key-staff)
- 최근 참여 프로젝트 (recent-projects)
- 최근 Cotton Candy 활동 (recent-activities)
- 파일 업로드 (file-upload)
- 기업소개글 (company-intro)
- 회사소개서 & 포트폴리오 상세 (portfolio-view)

### 기업정보 (company-info)

- 팝업: 기본정보 (popup-basic-info)
- 팝업: 상세정보 (popup-detail-info)
- 팝업: 상세소개 (popup-intro-detail)
- 팝업: 기업유형 (popup-company-type)
- 팝업: 사업자정보 (popup-biz-info)

### 구성원 관리 (member-management)

- (세부 항목 추후 정의)

---

## 9. My 메뉴 (my-menu)

- 내정보 (my-info)
- 즐겨찾기 (favorites)
    - 관심프로젝트 (saved-projects)
    - 관심기업 (saved-companies)
- 1:1 문의 (inquiry)
    - 쓰기 (write)
    - 리스트 (list)
    - 읽기 (read)
- 알림설정 (notification-settings)
- 회원탈퇴 (account-delete)

---

## 10. 회원 (member)

### 로그인 (login)

- 기존사용자 통합로그인 (sso-login)
- 신규이용자 이메일인증 (email-verification)

### 회원가입 (signup)

- 기본정보 등록 (basic-info)
- 휴대폰 인증 (phone-verification)
- 직업정보 등록 (job-info)

### 챗봇(chatbot)