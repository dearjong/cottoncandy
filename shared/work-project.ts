/** Work 홈 등에서 쓰는 프로젝트 카드 (서버 목업/API 공통) */
export interface WorkProject {
  id: string;
  projectNumber: string;
  title: string;
  company: string;
  companyType: string;
  companySize: string;
  status:
    | "draft"
    | "pending"
    | "approved"
    | "in_progress"
    | "completed"
    | "cancelled";
  statusLabel: string;
  deadline: string;
  deliveryDate: string;
  scope: string[];
  budget: string;
  budgetDetail: string;
  hashtags: string[];
  features: string[];
  daysRemaining: number;
  progressStage: string;
  projectType: "request" | "participate";
  badges?: string[];
}
