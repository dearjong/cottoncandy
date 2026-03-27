// 프로젝트 공고 목업 데이터

export interface ProjectListItem {
  id: string;
  status: string;
  type: string;
  partnerType: string;
  bidType: string;
  myStatus: string;
  title: string;
  company: string;
  companyType: string;
  industry: string;
  deadline: string;
  deliveryDate: string;
  services: string[];
  totalBudget: string;
  productionBudget: string;
  daysLeft: number;
  tags: string[];
  features: string[];
}

export interface ProjectDetail {
  id: string;
  status: string;
  type: string;
  partnerType: string;
  bidType: string;
  myStatus: string;
  company: {
    name: string;
    logo: string;
    type: string;
    industry: string;
    website: string;
    phone: string;
  };
  product: {
    name: string;
    type: string;
  };
  services: string[];
  schedule: {
    support: string;
  };
  adPurpose: Array<{
    title: string;
    detail: string;
  }>;
  techniques: string[];
  media: string[];
  target: {
    age: string;
    gender: string;
    job: string;
  };
  competitors: {
    industry: string;
    companies: string[];
    period: string;
  };
  partner: {
    type: string;
    subType: string;
    conditions: string[];
  };
  budget: {
    total: string;
    production: string;
  };
  timeline: {
    applicationStart: string;
    applicationEnd: string;
    applicationDays: number;
    ot: string;
    otNote: string;
    proposalDeadline: string;
    pt: string;
    ptNote: string;
    result: string;
    delivery: string;
    onAir: string;
  };
  rejectionFee: string;
  rejectionNote: string;
  payment: {
    advance: string;
    interim: string;
    balance: string;
  };
  documents: {
    basic: string[];
    required: string[];
    proposal: string[];
    contract: string[];
  };
  description: string;
  contact: {
    name: string;
    position: string;
    phone: string;
    mobile: string;
    email: string;
  };
  features: string[];
}

export const mockProjects: ProjectListItem[] = [
  {
    id: "PN-20250721-0001",
    status: "접수중",
    type: "참여공고",
    partnerType: "대행사 모집",
    bidType: "경쟁PT",
    myStatus: "My담당",
    title: "[베스트전자] 스탠바이미2 - 판매촉진 프로모션",
    company: "베스트전자",
    companyType: "대기업",
    industry: "전기전자",
    deadline: "2025.08.19",
    deliveryDate: "2025.12.25",
    services: ["전략기획", "크리에이티브 기획", "영상 제작", "미디어 집행", "성과 측정 및 리포팅"],
    totalBudget: "5~10억원",
    productionBudget: "5천만~1억원",
    daysLeft: 35,
    tags: ["제품판매촉진", "브랜드 인지도 향상", "이벤트/프로모션"],
    features: ["급행 제작 대응", "경쟁사 수행기업 제외", "리젝션 Fee"]
  },
  {
    id: "PN-20250721-0002",
    status: "접수중",
    type: "참여공고",
    partnerType: "제작사 모집",
    bidType: "바로제작",
    myStatus: "참여중",
    title: "대기업 전자제품 판매촉진 프로모션 - 제작사 모집",
    company: "솜사탕애드",
    companyType: "Creative 중심 대행사",
    industry: "전기전자/카메라/영상/음향가전/TV",
    deadline: "2025.08.19",
    deliveryDate: "2025.12.25",
    services: ["영상 기획", "영상 촬영", "편집 및 후반작업", "음악/BGM", "모델/배우 섭외", "매체 집행"],
    totalBudget: "10억원",
    productionBudget: "3억원",
    daysLeft: 35,
    tags: ["AI", "라이브액션", "특수촬영"],
    features: ["급행 제작 대응", "경쟁사 수행기업 제외", "리젝션 Fee"]
  },
  {
    id: "PN-20250721-0003",
    status: "접수중",
    type: "1:1 비공개",
    partnerType: "제작사 모집",
    bidType: "바로제작",
    myStatus: "",
    title: "[1:1비공개] 직접 의뢰받은 기업에게만 공개됩니다.",
    company: "기업명비공개",
    companyType: "Creative 중심 대행사",
    industry: "",
    deadline: "2025.08.19",
    deliveryDate: "2025.12.25",
    services: ["영상 기획", "영상 촬영", "편집 및 후반작업", "음악/BGM", "모델/배우 섭외", "매체 집행"],
    totalBudget: "10~20억원",
    productionBudget: "3~6억원",
    daysLeft: 35,
    tags: ["AI", "라이브액션", "특수촬영"],
    features: ["급행 제작 대응"]
  },
  {
    id: "PN-20250721-0004",
    status: "접수중",
    type: "Only제작사",
    partnerType: "제작사 모집",
    bidType: "바로제작",
    myStatus: "",
    title: "[Only제작사] 제작사에게만 공개됩니다.",
    company: "기업명비공개",
    companyType: "Creative 중심 대행사",
    industry: "",
    deadline: "2025.08.19",
    deliveryDate: "2025.12.25",
    services: ["영상 기획", "영상 촬영", "편집 및 후반작업", "음악/BGM", "모델/배우 섭외", "매체 집행"],
    totalBudget: "10~20억원",
    productionBudget: "3~6억원",
    daysLeft: 35,
    tags: ["AI", "라이브액션", "특수촬영"],
    features: ["급행 제작 대응"]
  },
  {
    id: "R25BK00589729",
    status: "접수중",
    type: "공공 입찰",
    partnerType: "",
    bidType: "",
    myStatus: "",
    title: "[서울특별시장] 2025년 서울시의회 TV광고 제작",
    company: "서울특별시장",
    companyType: "관공서/단체/공익",
    industry: "",
    deadline: "2025.08.19",
    deliveryDate: "",
    services: [],
    totalBudget: "10~20억원",
    productionBudget: "",
    daysLeft: 35,
    tags: [],
    features: []
  }
];

export const mockProjectDetails: Record<string, ProjectDetail> = {
  "PN-20250721-0001": {
    id: "PN-20250721-0001",
    status: "접수중",
    type: "참여공고",
    partnerType: "대행사 모집",
    bidType: "경쟁PT",
    myStatus: "My담당",
    company: {
      name: "베스트전자",
      logo: "B",
      type: "대기업",
      industry: "전기전자",
      website: "https://best-electronics.com",
      phone: "02-1234-5678"
    },
    product: {
      name: "[OLED] 스탠바이미2",
      type: "카메라/영상/음향가전"
    },
    services: ["전략기획", "크리에이티브 기획", "영상 제작", "미디어 집행", "성과 측정 및 리포팅", "인플루언서/SNS 마케팅", "PR/언론보도 대응", "오프라인 이벤트/프로모션"],
    schedule: {
      support: "#급행 제작 대응, #당일 피드백 반영 가능, #일정 유동성 대응, #이벤트/행사 대응"
    },
    adPurpose: [
      { title: "제품판매촉진", detail: "#실사용 리뷰형 콘텐츠 제작" },
      { title: "브랜드 인지도 향상", detail: "#바이럴 확산형 콘텐츠 기획 및 제작, #TV·디지털 연계 캠페인 기획" },
      { title: "이벤트/프로모션", detail: "#명절/할인/이벤트 캠페인" }
    ],
    techniques: ["AI", "라이브액션", "특수촬영", "캐릭터/동물 모델"],
    media: ["TV", "Youtube", "디지털광고", "옥외"],
    target: {
      age: "10대, 20대",
      gender: "전체",
      job: "직장인, 주부, 자영업자"
    },
    competitors: {
      industry: "전기/전자",
      companies: ["삼성전자", "애플", "HP", "소니"],
      period: "최근 6개월"
    },
    partner: {
      type: "대행사",
      subType: "종합 광고대행사",
      conditions: [
        "광고 Awards 수상작 10작품 이상 (최근 3년간)",
        "TVCF 명예의 전당 5작품 이상 (최근 3년간)",
        "TVCF 포트폴리오 50건 이상 (최근 3년간)",
        "최소제작비 2억 이상"
      ]
    },
    budget: {
      total: "10~20억",
      production: "3억~6억"
    },
    timeline: {
      applicationStart: "2025.11.10(월)",
      applicationEnd: "2025.08.19(금)",
      applicationDays: 30,
      ot: "2025.12.20 (목) 10:00 온라인",
      otNote: "※ OT 참석기업 > 제안서 검토 후 5일이내 개별 안내",
      proposalDeadline: "2025.12.20",
      pt: "2025.12.25 (수) 12:00 서울시 강남구",
      ptNote: "※ PT 참석기업 > 제안서 검토 후 5일이내 개별 안내",
      result: "PT발표 후 5일 이내 개별 안내",
      delivery: "2025.12.20",
      onAir: "2025.12.25"
    },
    rejectionFee: "30만원",
    rejectionNote: "※ PT후 미선정팀에 개별지급",
    payment: {
      advance: "30%",
      interim: "30%",
      balance: "30%"
    },
    documents: {
      basic: ["참여신청서 ⓘ", "회사소개서 & 포트폴리오 ⓘ"],
      required: ["사업자 등록증사본", "비밀유지 서약서"],
      proposal: ["제안서", "시안", "견적서"],
      contract: ["용역계약서", "법인 등 기부등본", "통장 사본"]
    },
    description: "베스트전자는 전자, 가전 분야의 혁신적인 기술로\n세계적인 일류기업 자리를 지켜나가도록 최선을 다하겠습니다.\n\n베스트전자는 고객을 위한 가치창조와\n인간존중의 경영을 실현합니다.\n\n자세한 내용은 OT에서 전달드리겠습니다.",
    contact: {
      name: "나해피",
      position: "선임",
      phone: "02-1234-5679",
      mobile: "010-1234-5679",
      email: "nhappy@yesc.com"
    },
    features: ["급행 제작 대응", "경쟁사 수행기업 제외", "리젝션 Fee"]
  },
  "PN-20250721-0002": {
    id: "PN-20250721-0002",
    status: "접수중",
    type: "참여공고",
    partnerType: "제작사 모집",
    bidType: "바로제작",
    myStatus: "참여중",
    company: {
      name: "솜사탕애드",
      logo: "S",
      type: "Creative 중심 대행사",
      industry: "전기전자/카메라/영상/음향가전/TV",
      website: "https://cottoncandy-ad.com",
      phone: "02-2345-6789"
    },
    product: {
      name: "대기업 전자제품",
      type: "카메라/영상/음향가전"
    },
    services: ["영상 기획", "영상 촬영", "편집 및 후반작업", "음악/BGM", "모델/배우 섭외", "매체 집행"],
    schedule: {
      support: "#급행 제작 대응, #주말 작업 가능"
    },
    adPurpose: [
      { title: "제품판매촉진", detail: "#AI 기술 활용 콘텐츠" }
    ],
    techniques: ["AI", "라이브액션", "특수촬영"],
    media: ["Youtube", "디지털광고"],
    target: {
      age: "20대, 30대",
      gender: "전체",
      job: "직장인"
    },
    competitors: {
      industry: "전기/전자",
      companies: ["삼성전자"],
      period: "최근 6개월"
    },
    partner: {
      type: "제작사",
      subType: "영상 제작사",
      conditions: [
        "영상 제작 경력 5년 이상",
        "AI 기술 활용 가능"
      ]
    },
    budget: {
      total: "10억",
      production: "3억"
    },
    timeline: {
      applicationStart: "2025.11.10(월)",
      applicationEnd: "2025.08.19(금)",
      applicationDays: 30,
      ot: "2025.12.15 (수) 14:00 온라인",
      otNote: "※ OT 참석기업 > 5일이내 개별 안내",
      proposalDeadline: "2025.12.18",
      pt: "2025.12.22 (목) 15:00 서울시 강남구",
      ptNote: "※ PT 참석기업 > 5일이내 개별 안내",
      result: "PT발표 후 3일 이내 개별 안내",
      delivery: "2025.12.25",
      onAir: "2025.12.30"
    },
    rejectionFee: "20만원",
    rejectionNote: "※ PT후 미선정팀에 개별지급",
    payment: {
      advance: "40%",
      interim: "30%",
      balance: "30%"
    },
    documents: {
      basic: ["참여신청서", "회사소개서 & 포트폴리오"],
      required: ["사업자 등록증사본"],
      proposal: ["제안서", "견적서"],
      contract: ["용역계약서", "통장 사본"]
    },
    description: "솜사탕애드는 크리에이티브 중심의 광고대행사입니다.\n\n자세한 내용은 OT에서 안내드립니다.",
    contact: {
      name: "김담당",
      position: "대리",
      phone: "02-2345-6780",
      mobile: "010-2345-6780",
      email: "kim@cottoncandy-ad.com"
    },
    features: ["급행 제작 대응", "경쟁사 수행기업 제외", "리젝션 Fee"]
  }
};

export function getProjectById(id: string): ProjectDetail | undefined {
  return mockProjectDetails[id];
}
