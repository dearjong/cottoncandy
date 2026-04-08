import { 
  users, type User, type InsertUser, 
  projects, type Project, type InsertProject, type ProjectData,
  messages, type Message, type InsertMessage,
  notifications, type Notification, type InsertNotification,
  schedules, type Schedule, type InsertSchedule,
  type AnalyticsEvent, type InsertAnalyticsEvent,
} from "@shared/schema";
import type { WorkProject } from "@shared/work-project";

export type { WorkProject } from "@shared/work-project";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProject(userId: string): Promise<Project | undefined>;
  createProject(userId: string, projectData: ProjectData): Promise<Project>;
  updateProject(userId: string, projectData: Partial<ProjectData>, currentStep?: number, maxVisitedStep?: number): Promise<Project | undefined>;
  
  // Work Projects methods
  getWorkProjects(userId: string, projectType: 'request' | 'participate'): Promise<WorkProject[]>;
  
  // Message methods
  getMessages(userId: string, type?: string): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
  
  // Notification methods
  getNotifications(userId: string, type?: string): Promise<Notification[]>;
  getNotification(id: number): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
  
  // Schedule methods
  getSchedule(projectId: string): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(projectId: string, scheduleData: Partial<InsertSchedule>): Promise<Schedule | undefined>;

  recordAnalyticsEvent(event: InsertAnalyticsEvent): Promise<{ id: number }>;
  getRecentAnalyticsEvents(limit: number): Promise<AnalyticsEvent[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<string, Project>;
  private messages: Map<number, Message>;
  private notifications: Map<number, Notification>;
  private schedules: Map<string, Schedule>;
  private analyticsEvents: AnalyticsEvent[];
  private workProjects: WorkProject[];
  currentUserId: number;
  currentProjectId: number;
  currentMessageId: number;
  currentNotificationId: number;
  currentScheduleId: number;
  currentAnalyticsEventId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.messages = new Map();
    this.notifications = new Map();
    this.schedules = new Map();
    this.analyticsEvents = [];
    this.workProjects = [];
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentMessageId = 1;
    this.currentNotificationId = 1;
    this.currentScheduleId = 1;
    this.currentAnalyticsEventId = 1;
    
    // 초기 목업 데이터 추가
    this.seedMockData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      displayName: insertUser.displayName ?? null,
      email: insertUser.email ?? null,
      phone: insertUser.phone ?? null,
      userType: insertUser.userType ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async getProject(userId: string): Promise<Project | undefined> {
    return this.projects.get(userId);
  }

  async createProject(userId: string, projectData: ProjectData): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const project: Project = {
      id,
      userId,
      projectData,
      currentStep: 1,
      maxVisitedStep: 1,
      status: "draft",
      submittedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(userId, project);
    return project;
  }

  async updateProject(
    userId: string, 
    projectData: Partial<ProjectData>,
    currentStep?: number,
    maxVisitedStep?: number
  ): Promise<Project | undefined> {
    const existing = this.projects.get(userId);
    if (!existing) return undefined;

    const updatedProject: Project = {
      ...existing,
      projectData: { ...(existing.projectData as ProjectData), ...projectData },
      currentStep: currentStep ?? existing.currentStep,
      maxVisitedStep: maxVisitedStep ?? existing.maxVisitedStep,
      updatedAt: new Date(),
    };
    
    this.projects.set(userId, updatedProject);
    return updatedProject;
  }

  // Message methods
  async getMessages(userId: string, type?: string): Promise<Message[]> {
    const allMessages = Array.from(this.messages.values()).filter(
      msg => msg.userId === userId
    );
    if (type) {
      return allMessages.filter(msg => msg.type === type);
    }
    return allMessages;
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      messageType: insertMessage.messageType ?? null,
      originalContent: insertMessage.originalContent ?? null,
      attachments: insertMessage.attachments ?? null,
      isRead: false,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    const updated = { ...message, isRead: true };
    this.messages.set(id, updated);
    return updated;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }

  // Notification methods
  async getNotifications(userId: string, type?: string): Promise<Notification[]> {
    const allNotifications = Array.from(this.notifications.values()).filter(
      notif => notif.userId === userId
    );
    if (type) {
      return allNotifications.filter(notif => notif.type === type);
    }
    return allNotifications;
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const notification: Notification = {
      ...insertNotification,
      id,
      projectId: insertNotification.projectId ?? null,
      projectTitle: insertNotification.projectTitle ?? null,
      company: insertNotification.company ?? null,
      isRead: false,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    const updated = { ...notification, isRead: true };
    this.notifications.set(id, updated);
    return updated;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }

  async getWorkProjects(userId: string, projectType: 'request' | 'participate'): Promise<WorkProject[]> {
    return this.workProjects.filter(p => p.projectType === projectType);
  }

  // 초기 목업 데이터
  private seedMockData() {
    const userId = "1";
    
    // 메시지 목업 데이터
    const messageContent = `베스트전자 스탠바이미2 판매촉진 프로모션 비딩 참여의 건

안녕하세요,

베스트전자 마케팅팀 담당자님.

귀사의 혁신적인 제품인 스탠바이미2 판매촉진 프로모션 비딩에 저희 대행사를 초대해주셔서 진심으로 감사드립니다.

저희는 다양한 디지털/오프라인 마케팅 경험과 업계 인사이트를 바탕으로, 스탠바이미2의 브랜드 가치와 판매 실적을 극대화할 수 있는 차별화된 프로모션 전략을 제안드릴 수 있음을 자신합니다.

특히, 20~40대 라이프스타일 소비자를 타깃으로 한 맞춤형 캠페인, 실질적인 구매 전환을 유도하는 퍼포먼스 마케팅, 그리고 트렌디한 콘텐츠 기획 역량을 적극 활용할 계획입니다.

비딩 안내해주신 일정에 맞춰,

· 창의적이고 실효성 높은 프로모션 제안서
· 효율적인 예산 운용 방안
· 구체적인 성과 측정 및 KPI 관리 방안

등을 포함한 제안서를 준비하여 제출드리겠습니다.

향후 질의응답이나 추가 요청사항이 있으시면 언제든 연락 주시기 바랍니다.
이번 비딩을 통해 베스트전자와의 파트너십을 강화하고, 스탠바이미2의 성공적인 시장 확대에 기여할 수 있기를 기대합니다.

감사합니다.

[광고대행사명/담당자명/연락처]`;

    const originalContent = `안녕하세요.
베스트전자 마케팅팀입니다.

당사는 자사 혁신 제품인 스탠바이미2의 판매 확대 및 브랜드 인지도 강화를 위해, 하반기 대규모 판매촉진 프로모션을 기획하고 있습니다.
이에 귀사를 비롯한 역량 있는 마케팅/광고 대행사와 함께 효과적인 프로모션 전략을 모색하고자, 아래와 같이 비딩 참여를 요청드립니다.

1. 프로젝트 개요
제품명: 베스트전자 스탠바이미2
목적: 판매 증진 및 브랜드 인지도 제고
프로모션 기간: 2025년 하반기(예정)
주요 타깃: 20~40대 라이프스타일 소비자

2. 비딩 참여 요청 사항
프로모션 제안서: 창의적이고 실효성 높은 판매촉진 방안
예산안: 효율적인 예산 운용 계획
성과 측정 방안: KPI 및 기대 효과

3. 제출 일정 및 방법
제안서 제출 마감: 2025년 6월 30일(월) 18:00까지
제출 방법: 이메일(XXXX@lge.com) 또는 지정된 온라인 플랫폼

4. 기타 안내
제출된 제안서는 내부 심사 후 개별 연락드릴 예정입니다.
우수 제안사에는 추가 협업 기회가 제공될 수 있습니다.
귀사의 혁신적이고 차별화된 아이디어를 기대하며, 적극적인 비딩 참여를 부탁드립니다.
궁금하신 사항은 언제든 문의해주시기 바랍니다.

감사합니다.

베스트전자 마케팅팀 드림
Contact : 010-5225-9696
Mail : marketing@lge.com`;

    this.createMessage({
      userId,
      projectId: "1",
      projectTitle: "[베스트전자] TV 신제품 판매촉진 프로모션",
      type: "received",
      messageType: "",
      subject: "[답변] 베스트전자 스탠바이미2 판매촉진 프로모션 비딩 참여의 건",
      sender: "김나야 AE",
      senderCompany: "HSAD",
      content: messageContent,
      originalContent: originalContent,
      attachments: ["File Name File Name"],
    });

    // 관련 메시지들
    const relatedMessages = [
      { messageType: "문의", subject: "광고제작 문의드립니다.", sender: "나해피 선임", company: "HS애드" },
      { messageType: "", subject: "└ 관심 감사드립니다.", sender: "김엘 차장", company: "베스트전자" },
      { messageType: "문의", subject: "광고제작 문의드립니다.", sender: "나해피 선임", company: "HS애드" },
      { messageType: "진행", subject: "프로모션 광고제작 참여 제안", sender: "나해피 선임", company: "HS애드" },
      { messageType: "문의", subject: "광고제작 문의드립니다.", sender: "나해피 선임", company: "HS애드" },
      { messageType: "진행", subject: "프로모션 광고제작 참여 제안", sender: "나해피 선임", company: "HS애드" },
      { messageType: "진행", subject: "프로모션 광고제작 참여 제안", sender: "나해피 선임", company: "HS애드" },
      { messageType: "문의", subject: "프로모션 광고제작 참여 제안", sender: "나해피 선임", company: "HS애드" },
      { messageType: "문의", subject: "광고제작 문의드립니다.", sender: "나해피 선임", company: "HS애드" },
    ];

    relatedMessages.forEach(msg => {
      this.createMessage({
        userId,
        projectId: "1",
        projectTitle: "[베스트전자] 스탠바이미 2",
        type: "received",
        messageType: msg.messageType,
        subject: msg.subject,
        sender: msg.sender,
        senderCompany: msg.company,
        content: "메시지 내용",
        attachments: [],
      });
    });

    // 보낸 메시지 목업 데이터
    const sentMessages = [
      { subject: "비딩 참여 의향서 제출", receiver: "김엘 차장", company: "베스트전자" },
      { subject: "광고 제작 견적서 송부", receiver: "이마케 팀장", company: "글로벌식품" },
      { subject: "프로젝트 진행 관련 문의", receiver: "박광고 과장", company: "신선식품" },
      { subject: "제안서 수정본 발송", receiver: "최디렉 이사", company: "패션하우스" },
      { subject: "미팅 일정 조율", receiver: "정브랜 본부장", company: "뷰티코스" },
    ];

    sentMessages.forEach(msg => {
      this.createMessage({
        userId,
        projectId: "1",
        projectTitle: "[베스트전자] TV 신제품 판매촉진 프로모션",
        type: "sent",
        messageType: "",
        subject: msg.subject,
        sender: msg.receiver,
        senderCompany: msg.company,
        content: "보낸 메시지 내용입니다.",
        attachments: [],
      });
    });

    // 진행현황 알림
    const progressNotifications = [
      '프로젝트가 "취소"상태로 변경되었습니다.',
      "PT 3일전 입니다.",
      "오늘은 OT가 있는 날입니다.",
      "OT 3일 전 입니다."
    ];

    progressNotifications.forEach(title => {
      this.createNotification({
        userId,
        type: "progress",
        projectId: "1",
        projectTitle: "[베스트전자] 스탠바이미 2",
        title,
        company: "HS애드",
      });
    });

    // 맞춤공고 알림
    for (let i = 0; i < 10; i++) {
      this.createNotification({
        userId,
        type: "custom",
        projectId: "1",
        projectTitle: "[베스트전자] 스탠바이미 2 신제품 런칭 프로모션 대행사 모집",
        title: "[베스트전자] 스탠바이미 2 신제품 런칭 프로모션 대행사 모집",
        company: "HS애드",
      });
    }

    // 시스템 알림
    const systemNotifications = [
      "신규 프로젝트를 등록해신 광고주분께 TVCF 무료 이용권을 드려요!",
      "[공지] Cotton Candy 기업등급 안내",
      "Cotton Candy 에 오신것을 환영합니다."
    ];

    systemNotifications.forEach(title => {
      this.createNotification({
        userId,
        type: "system",
        title,
      });
    });

    // Work Projects 목업 데이터 - 의뢰 프로젝트
    this.workProjects.push(
      {
        id: 'PID-20250721-0001',
        projectNumber: 'PID-20250721-0001',
        title: '[베스트전자] 스탠바이미2 - 판매촉진 프로모션',
        company: '베스트전자',
        companyType: '전기전자',
        companySize: '대기업',
        status: 'draft',
        statusLabel: '임시저장됨 (24일 후 삭제)',
        deadline: '2025.08.19',
        deliveryDate: '2025.12.25',
        scope: ['전략기획', '크리에이티브 기획', '영상 제작', '미디어 집행', '성과 측정 및 리포팅'],
        budget: '10~20억원',
        budgetDetail: '(제작비 3억~6억원)',
        hashtags: ['#제품판매촉진', '#브랜드 인지도 향상', '#이벤트/프로모션'],
        features: ['급행 제작 대응', '경쟁사 수행기업 제외', '리젝션 Fee'],
        daysRemaining: 35,
        progressStage: '임시저장 → 승인대기중 → 승인완료',
        projectType: 'request',
        badges: ['참여공고 대행사 모집', '경쟁PT', 'My 담당']
      },
      {
        id: 'PN-20250721-0002',
        projectNumber: 'PN-20250721-0002',
        title: '[베스트전자] 스탠바이미2 - 판매촉진 프로모션',
        company: '베스트전자',
        companyType: '전기전자',
        companySize: '대기업',
        status: 'pending',
        statusLabel: '최종제안서 제출 대기',
        deadline: '2025.08.19',
        deliveryDate: '2025.12.25',
        scope: ['전략기획', '크리에이티브 기획', '영상 제작', '미디어 집행', '성과 측정 및 리포팅'],
        budget: '10~20억원',
        budgetDetail: '(제작비 3억~6억원)',
        hashtags: ['#제품판매촉진', '#브랜드 인지도 향상', '#이벤트/프로모션'],
        features: ['급행 제작 대응', '경쟁사 수행기업 제외', '리젝션 Fee'],
        daysRemaining: 35,
        progressStage: '접수 → OT → 제안서 → PT → 계약 → 제작 → 온에어 → 사후관리 → 완료',
        projectType: 'request',
        badges: ['참여공고 제작사 모집', '바로제작', 'My담당']
      },
      {
        id: 'PID-20250722-0003',
        projectNumber: 'PID-20250722-0003',
        title: '[글로벌식품] 신제품 런칭 캠페인',
        company: '글로벌식품',
        companyType: '식품',
        companySize: '중견기업',
        status: 'in_progress',
        statusLabel: 'PT 진행중',
        deadline: '2025.09.01',
        deliveryDate: '2025.11.30',
        scope: ['크리에이티브 기획', '영상 제작', '미디어 집행'],
        budget: '5~10억원',
        budgetDetail: '(제작비 1억~3억원)',
        hashtags: ['#신제품 런칭', '#브랜드 인지도 향상'],
        features: ['경쟁사 수행기업 제외'],
        daysRemaining: 45,
        progressStage: '접수 → OT → 제안서 → PT → 계약 → 제작 → 온에어 → 사후관리 → 완료',
        projectType: 'request',
        badges: ['참여공고 대행사 모집', '경쟁PT']
      },
      {
        id: 'PID-20250723-0004',
        projectNumber: 'PID-20250723-0004',
        title: '[패션하우스] FW 시즌 브랜드 캠페인',
        company: '패션하우스',
        companyType: '패션/뷰티',
        companySize: '중소기업',
        status: 'approved',
        statusLabel: '승인완료',
        deadline: '2025.08.25',
        deliveryDate: '2025.10.15',
        scope: ['크리에이티브 기획', '영상 제작'],
        budget: '3~5억원',
        budgetDetail: '(제작비 1억~2억원)',
        hashtags: ['#브랜드 캠페인', '#시즌 프로모션'],
        features: ['급행 제작 대응'],
        daysRemaining: 40,
        progressStage: '접수 → OT → 제안서 → PT → 계약 → 제작 → 온에어 → 사후관리 → 완료',
        projectType: 'request',
        badges: ['제작사 모집', '바로제작']
      },
      {
        id: 'PID-20250724-0005',
        projectNumber: 'PID-20250724-0005',
        title: '[뷰티코스] 신규 스킨케어 라인 홍보',
        company: '뷰티코스',
        companyType: '패션/뷰티',
        companySize: '중견기업',
        status: 'completed',
        statusLabel: '완료',
        deadline: '2025.07.15',
        deliveryDate: '2025.09.30',
        scope: ['전략기획', '크리에이티브 기획', '영상 제작', '미디어 집행'],
        budget: '7~10억원',
        budgetDetail: '(제작비 2억~4억원)',
        hashtags: ['#신제품 런칭', '#브랜드 인지도 향상', '#온라인 마케팅'],
        features: ['급행 제작 대응', '리젝션 Fee'],
        daysRemaining: 0,
        progressStage: '접수 → OT → 제안서 → PT → 계약 → 제작 → 온에어 → 사후관리 → 완료',
        projectType: 'request',
        badges: ['완료']
      }
    );

    // Work Projects 목업 데이터 - 참여 프로젝트
    this.workProjects.push(
      {
        id: 'PN-20250721-0001',
        projectNumber: 'PN-20250721-0001',
        title: '[베스트전자] 스탠바이미2 - 판매촉진 프로모션',
        company: '베스트전자',
        companyType: '전기전자',
        companySize: '대기업',
        status: 'in_progress',
        statusLabel: 'PT예정',
        deadline: '2025.08.19',
        deliveryDate: '2025.12.25',
        scope: ['전략기획', '크리에이티브 기획', '영상 제작', '미디어 집행', '성과 측정 및 리포팅'],
        budget: '10~20억원',
        budgetDetail: '(제작비 3억~6억원)',
        hashtags: ['#제품판매촉진', '#브랜드 인지도 향상', '#이벤트/프로모션'],
        features: ['급행 제작 대응', '경쟁사 수행기업 제외', '리젝션 Fee'],
        daysRemaining: 35,
        progressStage: '참여신청 → OT → 제안서 → PT → 계약 → 제작 → 온에어 → 사후관리 → 완료',
        projectType: 'participate',
        badges: ['참여공고 대행사 모집', '경쟁PT', '참여중']
      },
      {
        id: 'PN-20250722-0002',
        projectNumber: 'PN-20250722-0002',
        title: '[신선식품] 여름 시즌 마케팅 캠페인',
        company: '신선식품',
        companyType: '식품',
        companySize: '중소기업',
        status: 'in_progress',
        statusLabel: '제안서 작성중',
        deadline: '2025.08.30',
        deliveryDate: '2025.10.30',
        scope: ['크리에이티브 기획', '영상 제작'],
        budget: '2~3억원',
        budgetDetail: '(제작비 8천~1억원)',
        hashtags: ['#시즌 프로모션', '#온라인 마케팅'],
        features: [],
        daysRemaining: 45,
        progressStage: '참여신청 → OT → 제안서 → PT → 계약 → 제작 → 온에어 → 사후관리 → 완료',
        projectType: 'participate',
        badges: ['제작사 모집', '참여중']
      },
      {
        id: 'PN-20250723-0003',
        projectNumber: 'PN-20250723-0003',
        title: '[모빌리티테크] 신규 서비스 론칭 프로모션',
        company: '모빌리티테크',
        companyType: 'IT/서비스',
        companySize: '스타트업',
        status: 'approved',
        statusLabel: 'OT 완료',
        deadline: '2025.09.10',
        deliveryDate: '2025.11.15',
        scope: ['전략기획', '크리에이티브 기획', '영상 제작'],
        budget: '3~5억원',
        budgetDetail: '(제작비 1억~2억원)',
        hashtags: ['#신규 서비스', '#브랜드 런칭'],
        features: ['급행 제작 대응'],
        daysRemaining: 55,
        progressStage: '참여신청 → OT → 제안서 → PT → 계약 → 제작 → 온에어 → 사후관리 → 완료',
        projectType: 'participate',
        badges: ['대행사 모집', '경쟁PT']
      },
      {
        id: 'PN-20250724-0004',
        projectNumber: 'PN-20250724-0004',
        title: '[프리미엄홈] 브랜드 리뉴얼 캠페인',
        company: '프리미엄홈',
        companyType: '가구/인테리어',
        companySize: '중견기업',
        status: 'pending',
        statusLabel: '심사대기',
        deadline: '2025.08.15',
        deliveryDate: '2025.10.20',
        scope: ['크리에이티브 기획', '영상 제작', '미디어 집행'],
        budget: '5~7억원',
        budgetDetail: '(제작비 1억~3억원)',
        hashtags: ['#브랜드 리뉴얼', '#브랜드 캠페인'],
        features: [],
        daysRemaining: 30,
        progressStage: '참여신청 → OT → 제안서 → PT → 계약 → 제작 → 온에어 → 사후관리 → 완료',
        projectType: 'participate',
        badges: ['심사중']
      },
      {
        id: 'PN-20250725-0005',
        projectNumber: 'PN-20250725-0005',
        title: '[헬스케어] 건강기능식품 브랜드 캠페인',
        company: '헬스케어',
        companyType: '제약/건강',
        companySize: '중소기업',
        status: 'cancelled',
        statusLabel: '참여 취소',
        deadline: '2025.07.20',
        deliveryDate: '2025.09.25',
        scope: ['영상 제작', '미디어 집행'],
        budget: '2~4억원',
        budgetDetail: '(제작비 8천~1억5천원)',
        hashtags: ['#건강기능식품', '#온라인 마케팅'],
        features: [],
        daysRemaining: 0,
        progressStage: '참여신청 → OT → 제안서 → PT → 계약 → 제작 → 온에어 → 사후관리 → 완료',
        projectType: 'participate',
        badges: ['취소']
      }
    );
  }
  
  async getSchedule(projectId: string): Promise<Schedule | undefined> {
    return this.schedules.get(projectId);
  }
  
  async createSchedule(scheduleData: InsertSchedule): Promise<Schedule> {
    const id = this.currentScheduleId++;
    const now = new Date();
    const schedule: Schedule = {
      id,
      projectId: scheduleData.projectId,
      applicationDeadline: scheduleData.applicationDeadline ?? null,
      applicationResult: scheduleData.applicationResult ?? null,
      orientation: scheduleData.orientation ?? null,
      submissionDeadline: scheduleData.submissionDeadline ?? null,
      presentation: scheduleData.presentation ?? null,
      presentationResult: scheduleData.presentationResult ?? null,
      finalPlanSubmission: scheduleData.finalPlanSubmission ?? null,
      shootingDate: scheduleData.shootingDate ?? null,
      firstDelivery: scheduleData.firstDelivery ?? null,
      finalDelivery: scheduleData.finalDelivery ?? null,
      onAir: scheduleData.onAir ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.schedules.set(scheduleData.projectId, schedule);
    return schedule;
  }
  
  async updateSchedule(projectId: string, scheduleData: Partial<InsertSchedule>): Promise<Schedule | undefined> {
    const existingSchedule = this.schedules.get(projectId);
    if (!existingSchedule) {
      return undefined;
    }
    
    const updatedSchedule: Schedule = {
      ...existingSchedule,
      ...scheduleData,
      projectId, // ensure projectId doesn't change
      updatedAt: new Date(),
    };
    
    this.schedules.set(projectId, updatedSchedule);
    return updatedSchedule;
  }

  async recordAnalyticsEvent(insert: InsertAnalyticsEvent): Promise<{ id: number }> {
    const id = this.currentAnalyticsEventId++;
    const now = new Date();
    const row: AnalyticsEvent = {
      id,
      eventName: insert.eventName,
      properties: insert.properties ?? {},
      sessionId: insert.sessionId ?? null,
      userId: insert.userId ?? null,
      createdAt: now,
    };
    this.analyticsEvents.push(row);
    return { id };
  }

  async getRecentAnalyticsEvents(limit: number): Promise<AnalyticsEvent[]> {
    const n = Math.min(Math.max(1, limit), 500);
    return this.analyticsEvents.slice(-n);
  }
}

