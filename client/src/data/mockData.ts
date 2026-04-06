/**
 * Admin 페이지용 목업 데이터
 * @/data/mockData 로 import
 */

// --- Approval / Dashboard ---
export const MOCK_APPROVAL_QUEUE = [
  { id: 'AP-001', title: 'TVCF 광고 제작 프로젝트', client: 'A사', budget: '5,000만원', delayed: false, daysDelayed: 0 },
  { id: 'AP-002', title: '바이럴 마케팅 캠페인', client: 'B사', budget: '2,000만원', delayed: true, daysDelayed: 2 },
];

export const MOCK_INQUIRIES = [
  { id: 'IQ-001', title: '결제 문의', type: '결제', time: '10:30' },
];

export const MOCK_DISPUTES = [
  { id: 'DP-001', title: '작업물 검수 기준 분쟁', type: '품질', time: '09:15' },
];

// --- Companies ---
export const MOCK_COMPANIES = [
  {
    id: 'C-001',
    name: '크리에이티브 스튜디오',
    type: 'PARTNER',
    grade: 'GOLD',
    status: 'APPROVED',
    joinDate: '2024.11.01',
    employeeCount: 15,
    requestCount: 3,
    participationCount: 12,
    rating: 4.8,
    rep: '김대표',
    phone: '02-1234-5678',
    email: 'contact@studio.com',
    scale: '중소기업',
  },
  {
    id: 'C-002',
    name: '미디어 에이전시',
    type: 'PARTNER',
    grade: 'SILVER',
    status: 'APPROVED',
    joinDate: '2024.10.15',
    employeeCount: 8,
    requestCount: 1,
    participationCount: 5,
    rating: 4.5,
    rep: '이대표',
    phone: '02-2345-6789',
    email: 'hello@media.com',
    scale: '소기업',
  },
  {
    id: 'C-003',
    name: '신규 제작사',
    type: 'PARTNER',
    grade: 'NEW',
    status: 'PENDING',
    joinDate: '2024.11.20',
    employeeCount: 3,
    requestCount: 0,
    participationCount: 0,
    rating: 0,
    rep: '박대표',
    phone: '02-3456-7890',
    email: 'info@new.com',
    scale: '소기업',
  },
];

// --- Admin V1 (Replit)용 목업 데이터 ---
export const MOCK_ADMIN_COMPANIES_V1 = [
  {
    id: "COM-001",
    companyName: "솜사탕애드",
    companyNameEn: "Campaign creators 솜사탕애드",
    companyType: "대행사" as const,
    subType: "Creative중심 대행사",
    representativeName: "김대표",
    businessNumber: "123-45-67890",
    email: "contact@creativelab.com",
    phone: "02-1234-5678",
    memberCount: 5,
    projectCount: 12,
    status: "active" as const,
    verificationStatus: "verified" as const,
    registeredAt: "2024-01-15",
  },
  {
    id: "COM-002",
    companyName: "스마트에이전시",
    companyNameEn: "Smart Agency",
    companyType: "대행사" as const,
    subType: "종합대행",
    representativeName: "이사장",
    businessNumber: "234-56-78901",
    email: "info@smartagency.kr",
    phone: "02-2345-6789",
    memberCount: 8,
    projectCount: 25,
    status: "active" as const,
    verificationStatus: "verified" as const,
    registeredAt: "2023-11-20",
  },
  {
    id: "COM-003",
    companyName: "비주얼프로덕션",
    companyType: "제작사" as const,
    subType: "촬영 중심",
    representativeName: "박감독",
    businessNumber: "345-67-89012",
    email: "pd@visualprod.com",
    phone: "02-3456-7890",
    memberCount: 3,
    projectCount: 8,
    status: "active" as const,
    verificationStatus: "pending" as const,
    registeredAt: "2024-02-01",
  },
  {
    id: "COM-004",
    companyName: "(주)테크브랜드",
    companyNameEn: "Tech Brand Co., Ltd",
    companyType: "광고주" as const,
    representativeName: "최본부장",
    businessNumber: "456-78-90123",
    email: "marketing@techbrand.co.kr",
    phone: "02-4567-8901",
    memberCount: 2,
    projectCount: 3,
    status: "inactive" as const,
    verificationStatus: "verified" as const,
    registeredAt: "2024-03-10",
  },
] as const;

export const MOCK_ADMIN_PROJECTS_V1 = [
  {
    id: "PRJ-001",
    title: "브랜드 홍보 영상 제작",
    client: "베스트전자",
    partner: "스튜디오 블랙",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-002", "COM-001"],
    type: "공고" as const,
    status: "REQUESTED" as const,
    visibility: "PUBLIC" as const,
    budget: "500만원",
    createdAt: "2024-06-15",
    description: "신제품 런칭을 위한 브랜드 홍보 영상 제작 프로젝트입니다.",
  },
  {
    id: "PRJ-002",
    title: "기업 IR 영상 제작",
    client: "스마트솔루션(주)",
    partner: "크리에이티브 스튜디오",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-001"],
    type: "1:1" as const,
    status: "SHOOTING" as const,
    visibility: "PRIVATE" as const,
    budget: "800만원",
    createdAt: "2024-06-14",
    description: "투자 유치를 위한 IR 프레젠테이션 영상 제작",
  },
  {
    id: "PRJ-003",
    title: "마케팅 전략 컨설팅",
    client: "핀테크랩",
    partner: "컨설팅랩",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-002"],
    type: "컨설팅" as const,
    status: "PROPOSAL_OPEN" as const,
    visibility: "PUBLIC" as const,
    budget: "300만원",
    createdAt: "2024-06-13",
    description: "온라인 마케팅 전략 수립 및 실행 계획 컨설팅",
    phone: "010-2345-6789",
    consultingOutcomeKind: "SIMPLE_CONSULT" as const,
  },
  {
    id: "PRJ-004",
    title: "제품 소개 영상",
    client: "전자산업(주)",
    partner: "영상공작소 픽셀",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-003"],
    type: "공고" as const,
    status: "NO_SELECTION" as const,
    visibility: "PUBLIC" as const,
    budget: "400만원",
    createdAt: "2024-06-12",
    description: "AI 제품 소개를 위한 영상 콘텐츠 제작",
  },
  {
    id: "PRJ-005",
    title: "SNS 광고 캠페인",
    client: "뷰티브랜드",
    partner: "미디어 에이전시",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-002"],
    type: "공고" as const,
    status: "SELECTED" as const,
    visibility: "PUBLIC" as const,
    budget: "1,200만원",
    createdAt: "2024-06-11",
    description: "인스타그램/틱톡 인플루언서 협업 광고 캠페인",
  },
  {
    id: "PRJ-006",
    title: "기업 홍보 다큐멘터리",
    client: "IT솔루션",
    partner: "필름 팩토리",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-001"],
    type: "1:1" as const,
    status: "COMPLETE" as const,
    visibility: "PRIVATE" as const,
    budget: "2,000만원",
    createdAt: "2024-06-10",
    description: "친환경 에너지 기업 소개 다큐멘터리 제작",
  },
  {
    id: "PRJ-007",
    title: "브랜딩 전략 수립",
    client: "(주)테크브랜드",
    partner: "브랜드 컨설팅 그룹",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-002"],
    type: "컨설팅" as const,
    status: "CONTRACT" as const,
    visibility: "INVITE_ONLY" as const,
    budget: "600만원",
    createdAt: "2024-06-09",
    description: "신규 브랜드 런칭을 위한 브랜딩 전략 컨설팅",
    phone: "010-3456-7890",
    consultingOutcomeKind: "MATCHING_1TO1" as const,
    consultingLinkedProjectId: "PRJ-009",
    consultingActivityLog: [
      {
        id: "act-prj007-1",
        at: "2024-06-09T10:00:00.000Z",
        kind: "PHONE" as const,
        note: "1차 니즈 정리 통화",
      },
      {
        id: "act-prj007-2",
        at: "2024-06-10T14:30:00.000Z",
        kind: "MESSAGE_OUT" as const,
        note: "제안 요약 문자 발송",
      },
    ],
  },
  {
    id: "PRJ-008",
    title: "유튜브 채널 운영 대행",
    client: "제조업체",
    partner: "디지털 마케팅 스튜디오",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-002", "COM-003"],
    type: "공고" as const,
    status: "DRAFT" as const,
    visibility: "HIDDEN" as const,
    budget: "월 300만원",
    createdAt: "2024-06-08",
    description: "기업 유튜브 채널 콘텐츠 기획 및 제작 운영",
  },
  {
    id: "PRJ-009",
    title: "TV CF 제작",
    client: "헬스케어",
    partner: "TVCF 프로덕션",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-001", "COM-003"],
    type: "1:1" as const,
    status: "OT_SCHEDULED" as const,
    visibility: "PRIVATE" as const,
    budget: "5,000만원",
    createdAt: "2024-06-07",
    description: "신규 모바일 앱 런칭 TV 광고 제작",
  },
  {
    id: "PRJ-010",
    title: "디지털 마케팅 컨설팅",
    client: "에코에너지",
    partner: "퍼포먼스 컨설팅 파트너",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-002"],
    type: "컨설팅" as const,
    status: "PRODUCTION_COMPLETE" as const,
    visibility: "PRIVATE" as const,
    budget: "450만원",
    createdAt: "2024-06-06",
    description: "B2B 헬스케어 서비스 디지털 마케팅 전략 수립",
    phone: "010-4567-8901",
    consultingOutcomeKind: "MATCHING_PUBLIC" as const,
    consultingLinkedProjectId: "PRJ-011",
    consultingActivityLog: [
      {
        id: "act-prj010-1",
        at: "2024-06-06T09:00:00.000Z",
        kind: "PHONE" as const,
        note: "키워드·예산 범위 상담",
      },
    ],
  },
  {
    id: "PRJ-013",
    title: "영상 제작 방향 컨설팅 (직접 소개)",
    client: "스타트업허브",
    partner: "브랜드 컨설팅 그룹",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-002"],
    type: "컨설팅" as const,
    status: "COMPLETE" as const,
    visibility: "PUBLIC" as const,
    budget: "200만원",
    createdAt: "2024-06-05",
    description: "초기 브랜드 영상 제작 방향 및 제작사 소개 요청",
    phone: "010-5678-1234",
    consultingOutcomeKind: "DIRECT_INTRO" as const,
    consultingMatchingInfo: "TVCF 전문 제작사 1차 매칭 (솜사탕애드)",
    consultingActivityLog: [
      {
        id: "act-prj013-1",
        at: "2024-06-04T11:00:00.000Z",
        kind: "PHONE" as const,
        note: "제작 방향 논의",
      },
      {
        id: "act-prj013-2",
        at: "2024-06-05T16:00:00.000Z",
        kind: "MESSAGE_OUT" as const,
        note: "매칭 정보 전달 완료",
      },
    ],
  },
  {
    id: "PRJ-011",
    title: "TV 신제품 판매촉진 프로모션",
    client: "베스트전자",
    partner: "솜사탕애드",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-001"],
    type: "공고" as const,
    status: "COMPLETE" as const,
    visibility: "PUBLIC" as const,
    budget: "1억 5천만원",
    createdAt: "2024-05-20",
    description: "신제품 런칭 TVCF 및 디지털 프로모션 캠페인. 제작·온에어·정산·리뷰 완료.",
  },
  {
    id: "PRJ-012",
    title: "봄 시즌 브랜드 캠페인",
    client: "골드백화점",
    partner: "크리에이티브 스튜디오",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-002"],
    type: "공고" as const,
    status: "COMPLETE" as const,
    visibility: "PUBLIC" as const,
    budget: "2억원",
    createdAt: "2024-05-10",
    description: "봄 시즌 옥외·디지털 통합 캠페인. 제작부터 리뷰 등록까지 완료.",
  },
  {
    id: "PRJ-050",
    title: "브랜드 리뉴얼 영상 제작",
    client: "(주)패션브랜드",
    partner: "스튜디오 블랙",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-002"],
    type: "공고" as const,
    status: "STOPPED" as const,
    visibility: "PRIVATE" as const,
    budget: "5,000만원",
    createdAt: "2024-06-01",
    description: "내부 사정으로 일시 중단. 예산 재조정 후 재개 예정.",
  },
  {
    id: "PRJ-045",
    title: "신제품 런칭 광고",
    client: "스마트전자(주)",
    partner: "미디어 에이전시",
    ownerCompanyId: "COM-004",
    participantCompanyIds: ["COM-002"],
    type: "공고" as const,
    status: "CANCELLED" as const,
    visibility: "PRIVATE" as const,
    budget: "8,000만원",
    createdAt: "2024-05-28",
    description: "제품 출시 일정 무기한 연기로 프로젝트 취소.",
  },
] as const;

// --- Notification Logs ---
export const MOCK_NOTIFICATION_LOGS = [
  { id: 'NL-001', type: 'PRJ-001', status: 'SENT', title: '프로젝트 승인 완료', target: '의뢰사 A', count: 1, sentDate: '2024-11-06 14:30', successRate: '100%' },
  { id: 'NL-002', type: 'PRJ-005', status: 'SENT', title: '계약 단계 안내', target: '파트너 B', count: 1, sentDate: '2024-11-06 13:00', successRate: '100%' },
  { id: 'NL-003', type: 'OPS-001', status: 'SENT', title: '승인 필요', target: '운영자', count: 2, sentDate: '2024-11-06 12:00', successRate: '99.8%' },
  { id: 'NL-004', type: 'MBR-001', status: 'SENT', title: '가입 완료', target: '신규회원', count: 5, sentDate: '2024-11-06 11:00', successRate: '100%' },
  { id: 'NL-005', type: 'NTC-001', status: 'SENT', title: '시스템 점검 안내', target: '전체', count: 120, sentDate: '2024-11-05 18:00', successRate: '99.2%' },
];

// --- Support: Inquiries ---
export const MOCK_ALL_INQUIRIES = [
  { id: 'INQ-001', category: '결제', title: '결제 수단 추가 문의', user: '홍길동', userType: 'CLIENT', company: '(주)테스트', date: '2024-11-06 14:00', status: 'WAITING' as const },
  { id: 'INQ-002', category: '기능', title: '프로젝트 삭제 방법', user: '김파트너', userType: 'PARTNER', company: '제작사A', date: '2024-11-06 12:30', status: 'ANSWERED' as const },
  { id: 'INQ-003', category: '기타', title: '영수증 발행 요청', user: '이의뢰', userType: 'CLIENT', company: '광고주B', date: '2024-11-06 11:00', status: 'WAITING' as const },
  { id: 'INQ-004', category: '계약', title: '계약서 수정 가능한가요?', user: '박광고', userType: 'CLIENT', company: '(주)광고기획사', date: '2024-11-06 10:20', status: 'WAITING' as const },
  { id: 'INQ-005', category: '정산', title: '정산 일정 확인 요청', user: '최제작', userType: 'PARTNER', company: '영상제작소', date: '2024-11-05 17:40', status: 'ANSWERED' as const },
  { id: 'INQ-006', category: '회원', title: '회사 정보 수정 방법', user: '정브랜드', userType: 'CLIENT', company: '브랜드코리아', date: '2024-11-05 15:10', status: 'ANSWERED' as const },
  { id: 'INQ-007', category: '프로젝트', title: '비공개 프로젝트 전환 문의', user: '강미디어', userType: 'CLIENT', company: '미디어그룹', date: '2024-11-05 13:50', status: 'WAITING' as const },
  { id: 'INQ-008', category: '결제', title: '세금계산서 발행 요청', user: '윤크리에이티브', userType: 'PARTNER', company: '크리에이티브스튜디오', date: '2024-11-05 11:00', status: 'WAITING' as const },
  { id: 'INQ-009', category: '기능', title: '포트폴리오 업로드 오류', user: '임디렉터', userType: 'PARTNER', company: '디렉팅랩', date: '2024-11-04 16:30', status: 'ANSWERED' as const },
  { id: 'INQ-010', category: '기타', title: '서비스 이용 약관 문의', user: '오마케팅', userType: 'CLIENT', company: '(주)마케팅파트너스', date: '2024-11-04 14:00', status: 'WAITING' as const },
];

// --- Support: Disputes ---
export const MOCK_ALL_DISPUTES = [
  { id: 'DIS-001', type: '품질', title: '최종 편집본 검수 기준 불일치', project: 'TVCF 광고 A', claimant: '의뢰사 A', respondent: '제작사 B', date: '2024-11-06 10:00', progress: '1차 조정 중', status: 'URGENT' as const },
  { id: 'DIS-002', type: '일정', title: '납기일 연장 요청', project: '바이럴 캠페인', claimant: '제작사 C', respondent: '의뢰사 D', date: '2024-11-05 16:00', progress: '검토 중', status: 'PROCESS' as const },
  { id: 'DIS-003', type: '금액', title: '추가 비용 합의', project: '유튜브 제작', claimant: '의뢰사 E', respondent: '제작사 F', date: '2024-11-04 09:00', progress: '해결 완료', status: 'RESOLVED' as const },
];

// --- Support: Reports ---
export const MOCK_REPORTS = [
  { id: 'RPT-001', type: 'ABUSE', content: '욕설 및 비방성 메시지 신고', target: '1:1 대화', reporter: '회원A', reportedUser: '회원B', date: '2024-11-06 13:00', status: 'WAITING' as const },
  { id: 'RPT-002', type: 'SPAM', content: '무단 광고 반복 발송', target: '프로젝트 쪽지', reporter: '회원C', reportedUser: '회원D', date: '2024-11-06 11:30', status: 'PROCESS' as const },
  { id: 'RPT-003', type: 'CONTACT', content: '직거래 유도 메시지', target: '1:1 대화', reporter: '회원E', reportedUser: '회원F', date: '2024-11-05 15:00', status: 'RESOLVED' as const },
];

// --- Projects ---
export const MOCK_PROJECTS = [
  { id: 'P-001', status: 'MATCHING', title: 'TVCF 제작', type: 'TVCF', tags: [] as string[] },
  { id: 'P-002', status: 'CONTRACT', title: '바이럴 캠페인', type: '바이럴', tags: [] as string[] },
  { id: 'P-003', status: 'PRODUCTION', title: '유튜브 광고', type: '유튜브', tags: [] as string[] },
  { id: 'P-004', status: 'COMPLETE', title: '모션그래픽', type: '모션', tags: [] as string[] },
];

// --- Contracts ---
export const MOCK_CONTRACTS = [
  { id: 'CON-001', projectId: 'P-001', status: 'SIGNING' as const, projectTitle: 'TVCF 제작', advertiser: { name: 'A사' }, production: { name: '크리에이티브 스튜디오' } },
  { id: 'CON-002', projectId: 'P-002', status: 'COMPLETED' as const, projectTitle: '바이럴 캠페인', advertiser: { name: 'B사' }, production: { name: '미디어 에이전시' } },
  { id: 'CON-003', projectId: 'P-003', status: 'DRAFT' as const, projectTitle: '유튜브 광고', advertiser: { name: 'C사' }, production: { name: '제작사 C' } },
];

// --- Message monitoring ---
export const MOCK_MESSAGE_ROOMS = [
  { id: 'ROOM-001', status: 'REPORTED' as const, riskLevel: 'WARNING' as const },
  { id: 'ROOM-002', status: 'ACTIVE' as const, riskLevel: 'CAUTION' as const },
];

export const MOCK_CHAT_LOGS = [
  { id: 'CH-001', roomId: 'ROOM-001', sender: '회원1', message: '테스트 메시지', time: '14:00' },
];

// --- Users ---
export const MOCK_USERS = [
  { id: 'U-001', name: '김회원', type: 'COMPANY_MEMBER' as const, status: 'ACTIVE' as const },
  { id: 'U-002', name: '이프리', type: 'FREELANCER' as const, status: 'ACTIVE' as const },
];

// --- Employees ---
export const MOCK_EMPLOYEES = [
  { id: 'E-001', name: '김직원', companyName: '크리에이티브 스튜디오' },
  { id: 'E-002', name: '이직원', companyName: '크리에이티브 스튜디오' },
  { id: 'E-003', name: '박직원', companyName: '미디어 에이전시' },
];

// --- Content (Notices, FAQ) ---
export const MOCK_NOTICES = [
  { id: 'N-001', type: 'SYSTEM', title: '11월 정기 점검 안내', target: '전체', author: '운영자', date: '2024-11-01', views: 1250, status: 'POSTED' as const, createdAt: '2024-11-01' },
  { id: 'N-002', type: 'NOTICE', title: '서비스 이용 안내', target: '전체', author: '운영자', date: '2024-11-05', views: 320, status: 'POSTED' as const, createdAt: '2024-11-05' },
];

export const MOCK_FAQS = [
  { id: 'F-001', question: '결제 방법은?', answer: '카드/계좌이체 지원', category: '결제', status: 'ACTIVE' as const, author: '운영자', updateDate: '2024-11-01' },
];
