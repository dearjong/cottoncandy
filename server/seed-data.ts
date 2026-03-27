import type { InsertMessage, InsertNotification, ProjectData } from "@shared/schema";
import type { WorkProject } from "@shared/work-project";

/** 시드용 회원 1명 — 클라이언트 `projectApi` 기본 userId(이꽃별)와 동일 */
export const SEED_USER = {
  username: "이꽃별",
  password: "dev-only-not-for-production",
  displayName: "이꽃별",
  email: null as string | null,
  phone: null as string | null,
  userType: "의뢰" as string | null,
};

/** 시드용 프로젝트 등록 초안 1건 (users.username 과 user_id 문자열 일치) */
export const SEED_PROJECT_DRAFT = {
  userId: "이꽃별",
  projectData: {} as ProjectData,
  currentStep: 1,
  maxVisitedStep: 1,
  status: "draft" as const,
  submittedAt: null as Date | null,
};

/** DB 시드용 — mem-storage seedMockData와 동일한 Work 카드 (요약본, 필요 시 확장) */
export const SEED_WORK_PROJECT_ROWS: Array<{
  userId: string;
  projectType: "request" | "participate";
  data: WorkProject;
}> = [
  {
    userId: "1",
    projectType: "request",
    data: {
      id: "PID-20250721-0001",
      projectNumber: "PID-20250721-0001",
      title: "[베스트전자] 스탠바이미2 - 판매촉진 프로모션",
      company: "베스트전자",
      companyType: "전기전자",
      companySize: "대기업",
      status: "draft",
      statusLabel: "임시저장됨 (24일 후 삭제)",
      deadline: "2025.08.19",
      deliveryDate: "2025.12.25",
      scope: [
        "전략기획",
        "크리에이티브 기획",
        "영상 제작",
        "미디어 집행",
        "성과 측정 및 리포팅",
      ],
      budget: "10~20억원",
      budgetDetail: "(제작비 3억~6억원)",
      hashtags: ["#제품판매촉진", "#브랜드 인지도 향상", "#이벤트/프로모션"],
      features: ["급행 제작 대응", "경쟁사 수행기업 제외", "리젝션 Fee"],
      daysRemaining: 35,
      progressStage: "임시저장 → 승인대기중 → 승인완료",
      projectType: "request",
      badges: ["참여공고 대행사 모집", "경쟁PT", "My 담당"],
    },
  },
  {
    userId: "1",
    projectType: "request",
    data: {
      id: "PN-20250721-0002",
      projectNumber: "PN-20250721-0002",
      title: "[베스트전자] 스탠바이미2 - 판매촉진 프로모션",
      company: "베스트전자",
      companyType: "전기전자",
      companySize: "대기업",
      status: "pending",
      statusLabel: "최종제안서 제출 대기",
      deadline: "2025.08.19",
      deliveryDate: "2025.12.25",
      scope: [
        "전략기획",
        "크리에이티브 기획",
        "영상 제작",
        "미디어 집행",
        "성과 측정 및 리포팅",
      ],
      budget: "10~20억원",
      budgetDetail: "(제작비 3억~6억원)",
      hashtags: ["#제품판매촉진", "#브랜드 인지도 향상", "#이벤트/프로모션"],
      features: ["급행 제작 대응", "경쟁사 수행기업 제외", "리젝션 Fee"],
      daysRemaining: 35,
      progressStage: "접수 → OT → 제안서 → PT → 계약 → 제작 → 온에어 → 사후관리 → 완료",
      projectType: "request",
      badges: ["참여공고 제작사 모집", "바로제작", "My담당"],
    },
  },
  {
    userId: "1",
    projectType: "participate",
    data: {
      id: "PN-20250721-0001",
      projectNumber: "PN-20250721-0001",
      title: "[베스트전자] 스탠바이미2 - 판매촉진 프로모션",
      company: "베스트전자",
      companyType: "전기전자",
      companySize: "대기업",
      status: "in_progress",
      statusLabel: "PT예정",
      deadline: "2025.08.19",
      deliveryDate: "2025.12.25",
      scope: [
        "전략기획",
        "크리에이티브 기획",
        "영상 제작",
        "미디어 집행",
        "성과 측정 및 리포팅",
      ],
      budget: "10~20억원",
      budgetDetail: "(제작비 3억~6억원)",
      hashtags: ["#제품판매촉진", "#브랜드 인지도 향상", "#이벤트/프로모션"],
      features: ["급행 제작 대응", "경쟁사 수행기업 제외", "리젝션 Fee"],
      daysRemaining: 35,
      progressStage: "참여신청 → OT → 제안서 → PT → 계약 → 제작 → 온에어 → 사후관리 → 완료",
      projectType: "participate",
      badges: ["참여공고 대행사 모집", "경쟁PT", "참여중"],
    },
  },
];

/**
 * 사용자(작업자/제작사) 화면 더미 데이터
 * - client는 `?userId=1`로 messages/notifications를 호출합니다.
 * - seedMockData(mem-storage) 내용을 DB용으로 최소 세트만 옮깁니다.
 */
export const SEED_MESSAGES: InsertMessage[] = [
  {
    userId: "1",
    projectId: "1",
    projectTitle: "[베스트전자] TV 신제품 판매촉진 프로모션",
    type: "received",
    messageType: "",
    subject: "[답변] 베스트전자 스탠바이미2 판매촉진 프로모션 비딩 참여의 건",
    sender: "김나야 AE",
    senderCompany: "HSAD",
    content:
      "베스트전자 스탠바이미2 판매촉진 프로모션 비딩 참여의 건(목업).",
    originalContent:
      "안녕하세요. 베스트전자 마케팅팀입니다(목업 원문).",
    attachments: ["File Name File Name"],
  },
  // 관련(문의/진행) 메시지 목업
  {
    userId: "1",
    projectId: "1",
    projectTitle: "[베스트전자] 스탠바이미 2",
    type: "received",
    messageType: "문의",
    subject: "광고제작 문의드립니다.",
    sender: "나해피 선임",
    senderCompany: "HS애드",
    content: "메시지 내용(목업).",
    attachments: [],
  },
  {
    userId: "1",
    projectId: "1",
    projectTitle: "[베스트전자] 스탠바이미 2",
    type: "received",
    messageType: "",
    subject: "└ 관심 감사드립니다.",
    sender: "김엘 차장",
    senderCompany: "베스트전자",
    content: "메시지 내용(목업).",
    attachments: [],
  },
  // 보낸 메시지 목업
  {
    userId: "1",
    projectId: "1",
    projectTitle: "[베스트전자] TV 신제품 판매촉진 프로모션",
    type: "sent",
    messageType: "",
    subject: "비딩 참여 의향서 제출",
    sender: "김엘 차장",
    senderCompany: "베스트전자",
    content: "보낸 메시지 내용입니다.(목업)",
    attachments: [],
  },
  {
    userId: "1",
    projectId: "1",
    projectTitle: "[베스트전자] TV 신제품 판매촉진 프로모션",
    type: "sent",
    messageType: "",
    subject: "프로젝트 진행 관련 문의",
    sender: "박광고 과장",
    senderCompany: "신선식품",
    content: "보낸 메시지 내용입니다.(목업)",
    attachments: [],
  },
];

export const SEED_NOTIFICATIONS: InsertNotification[] = [
  // 진행현황 알림
  {
    userId: "1",
    type: "progress",
    projectId: "1",
    projectTitle: "[베스트전자] 스탠바이미 2",
    title: '프로젝트가 "취소"상태로 변경되었습니다.',
    company: "HS애드",
  },
  {
    userId: "1",
    type: "progress",
    projectId: "1",
    projectTitle: "[베스트전자] 스탠바이미 2",
    title: "PT 3일전 입니다.",
    company: "HS애드",
  },
  {
    userId: "1",
    type: "progress",
    projectId: "1",
    projectTitle: "[베스트전자] 스탠바이미 2",
    title: "오늘은 OT가 있는 날입니다.",
    company: "HS애드",
  },
  {
    userId: "1",
    type: "progress",
    projectId: "1",
    projectTitle: "[베스트전자] 스탠바이미 2",
    title: "OT 3일 전 입니다.",
    company: "HS애드",
  },

  // 맞춤공고 알림(목업 10개)
  ...Array.from({ length: 10 }).map(
    () =>
      ({
        userId: "1",
        type: "custom",
        projectId: "1",
        projectTitle: "[베스트전자] 스탠바이미 2 신제품 런칭 프로모션 대행사 모집",
        title: "[베스트전자] 스탠바이미 2 신제품 런칭 프로모션 대행사 모집",
        company: "HS애드",
      }) satisfies InsertNotification,
  ),

  // 시스템 알림
  {
    userId: "1",
    type: "system",
    title: "신규 프로젝트를 등록해신 광고주분께 TVCF 무료 이용권을 드려요!",
  },
  {
    userId: "1",
    type: "system",
    title: "[공지] Cotton Candy 기업등급 안내",
  },
  {
    userId: "1",
    type: "system",
    title: "Cotton Candy 에 오신것을 환영합니다.",
  },
];
