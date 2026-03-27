/**
 * /work/project/proposal 과 관리자 제안 제출현황에서 공통으로 쓰는 목업
 */
export type ProposalSubmissionRow = {
  id: string
  companyName: string
  versions?: string[]
  confirmed?: boolean
  strategy: number
  creative: number
  video: number
  image: number
  companyIntro: number
  documents: number
  /** 표시용 (예: 09.09 14:55, 미제출 시 '-') */
  submittedAt: string
}

export const MOCK_PROPOSAL_SUBMISSION_PROJECTS = [
  { id: "1", label: "[베스트전자] TV 신제품 판매촉진 프로모션" },
  { id: "2", label: "[글로벌식품] 신제품 런칭 캠페인" },
] as const

export const MOCK_PROPOSAL_SUBMISSION_ROWS: ProposalSubmissionRow[] = [
  {
    id: "1",
    companyName: "솜사탕애드",
    versions: ["Version 2", "Version 3", "Version 4"],
    confirmed: true,
    strategy: 1,
    creative: 1,
    video: 5,
    image: 3,
    companyIntro: 1,
    documents: 5,
    submittedAt: "09.09 14:55",
  },
  {
    id: "2",
    companyName: "목화솜기획",
    strategy: 1,
    creative: 1,
    video: 1,
    image: 1,
    companyIntro: 0,
    documents: 0,
    submittedAt: "09.09 14:55",
  },
  {
    id: "3",
    companyName: "광고천재",
    strategy: 1,
    creative: 1,
    video: 1,
    image: 1,
    companyIntro: 0,
    documents: 0,
    submittedAt: "09.09 14:55",
  },
  {
    id: "4",
    companyName: "웃음꽃기획",
    strategy: 1,
    creative: 1,
    video: 2,
    image: 3,
    companyIntro: 1,
    documents: 6,
    submittedAt: "09.09 14:55",
  },
  {
    id: "5",
    companyName: "무지개애드",
    strategy: 0,
    creative: 0,
    video: 0,
    image: 0,
    companyIntro: 0,
    documents: 0,
    submittedAt: "-",
  },
  {
    id: "6",
    companyName: "블루밍기획",
    strategy: 1,
    creative: 1,
    video: 6,
    image: 0,
    companyIntro: 1,
    documents: 0,
    submittedAt: "09.09 14:55",
  },
]

export const PROPOSAL_SUBMISSION_FIELD_COLUMNS = [
  { key: "strategy" as const, label: "전략제안서" },
  { key: "creative" as const, label: "Creative 제안서" },
  { key: "video" as const, label: "영상 시안" },
  { key: "image" as const, label: "이미지시안" },
  { key: "companyIntro" as const, label: "회사소개서" },
  { key: "documents" as const, label: "제출문서" },
] as const
