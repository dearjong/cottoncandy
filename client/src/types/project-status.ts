export type MainStatusCategory = 
  | '등록'
  | '접수단계'
  | '계약'
  | '제작'
  | '제작완료'
  | '온에어'
  | '사후관리'
  | '완료'
  | '중단'
  | '취소'

export type MainStatus = 
  | 'DRAFT'           // 임시저장
  | 'REQUESTED'       // 승인요청
  | 'APPROVED'        // 승인완료
  | 'PROPOSAL_OPEN'   // 접수중
  | 'PROPOSAL_CLOSED' // 접수마감
  | 'OT_SCHEDULED'    // OT 예정
  | 'OT_COMPLETED'    // OT 완료
  | 'PROPOSAL_SUBMIT' // 제안서 제출 대기
  | 'PROPOSAL_SUBMITTED' // 제안서 제출 완료
  | 'PT_SCHEDULED'    // PT 예정
  | 'PT_COMPLETED'    // PT 완료
  | 'NO_SELECTION'    // 미선정
  | 'SELECTED'        // 선정완료
  | 'CONTRACT'        // 계약완료
  | 'SHOOTING'        // 촬영 중
  | 'EDITING'         // 후반 작업
  | 'DRAFT_SUBMITTED' // 시안 제출
  | 'FINAL_APPROVED'  // 최종본 컨펌 완료
  | 'PRODUCTION_COMPLETE' // 제작완료
  | 'ONAIR_STARTED'   // 온에어 시작
  | 'AFTER_SERVICE'   // 사후관리
  | 'COMPLETE'        // 완료됨
  | 'ADMIN_CHECKING'  // 관리자 확인중
  | 'ADMIN_CONFIRMED' // 관리자 승인됨
  | 'STOPPED'         // 중단됨
  | 'CANCELLED'       // 취소됨

export type VisibilityStatus = 
  | 'PUBLIC'      // 공개
  | 'PRIVATE'     // 비공개
  | 'INVITE_ONLY' // 초대 전용
  | 'HIDDEN'      // 숨김

export type PartnerEngagementStatus = 
  | 'APPLY'           // 참여신청
  | 'INVITED'         // 초대됨
  | 'NOT_INVITED'     // 미초대됨
  | 'OT_ACCEPTED'     // OT 참석확정
  | 'OT_INVITED'      // OT 참석불가
  | 'OT_NOT_ATTENDED' // OT 미참석
  | 'OT_ATTENDED'     // OT 참석 완료
  | 'PROPOSAL_SUBMIT' // 제안서 제출 대기
  | 'PROPOSAL_SUBMITTED' // 제안서 제출 완료
  | 'PT_ACCEPTED'     // PT 참석확정
  | 'PT_INVITED'      // PT 참석불가
  | 'PT_NOT_ATTENDED' // PT 미참석
  | 'PT_COMPLETED'    // PT 발표 완료
  | 'CONTRACTED'      // 계약완료
  | 'COMPLETE'        // 완료됨
  | 'STOPPED'         // 중단됨
  | 'CANCELLED'       // 취소됨

export type ProductionStatus = 
  | 'PLANNING'  // 기획 진행 중
  | 'PPM'       // 프리프로덕션
  | 'SHOOTING'  // 촬영 중
  | 'EDITING'   // 후반 작업
  | 'DELIVERED' // 최종 납품

export type PaymentStatus = 
  | 'NOT_STARTED'   // 미정산
  | 'DEPOSIT_PAID'  // 계약금 지급
  | 'MID_PAID'      // 중도금 지급
  | 'BALANCE_PAID'  // 잔금 지급
  | 'COMPLETE'      // 정산 완료

export type InvolvementStatus = 
  | 'MY_CHARGE' // 내 담당
  | 'DEFAULT'   // 관여하지 않음

export const MainStatusLabels: Record<MainStatus, string> = {
  'DRAFT': '임시저장',
  'REQUESTED': '승인요청',
  'APPROVED': '승인완료',
  'PROPOSAL_OPEN': '접수중',
  'PROPOSAL_CLOSED': '접수마감',
  'OT_SCHEDULED': 'OT 예정',
  'OT_COMPLETED': 'OT 완료',
  'PROPOSAL_SUBMIT': '제안서 제출 대기',
  'PROPOSAL_SUBMITTED': '제안서 제출 완료',
  'PT_SCHEDULED': 'PT 예정',
  'PT_COMPLETED': 'PT 완료',
  'NO_SELECTION': '미선정',
  'SELECTED': '선정완료',
  'CONTRACT': '계약완료',
  'SHOOTING': '촬영 중',
  'EDITING': '후반 작업',
  'DRAFT_SUBMITTED': '시안 제출',
  'FINAL_APPROVED': '최종본 컨펌',
  'PRODUCTION_COMPLETE': '제작완료',
  'ONAIR_STARTED': '온에어',
  'AFTER_SERVICE': '사후관리',
  'COMPLETE': '완료',
  'ADMIN_CHECKING': '관리자 확인중',
  'ADMIN_CONFIRMED': '관리자 승인됨'
}

export const MainStatusColors: Record<MainStatus, string> = {
  'DRAFT': 'bg-gray-100 text-gray-700',
  'REQUESTED': 'bg-yellow-100 text-yellow-700',
  'APPROVED': 'bg-green-100 text-green-700',
  'PROPOSAL_OPEN': 'bg-blue-100 text-blue-700',
  'PROPOSAL_CLOSED': 'bg-orange-100 text-orange-700',
  'OT_SCHEDULED': 'bg-purple-100 text-purple-700',
  'OT_COMPLETED': 'bg-purple-100 text-purple-700',
  'PROPOSAL_SUBMIT': 'bg-indigo-100 text-indigo-700',
  'PROPOSAL_SUBMITTED': 'bg-indigo-100 text-indigo-700',
  'PT_SCHEDULED': 'bg-pink-100 text-pink-700',
  'PT_COMPLETED': 'bg-pink-100 text-pink-700',
  'NO_SELECTION': 'bg-red-100 text-red-700',
  'SELECTED': 'bg-emerald-100 text-emerald-700',
  'CONTRACT': 'bg-teal-100 text-teal-700',
  'SHOOTING': 'bg-cyan-100 text-cyan-700',
  'EDITING': 'bg-cyan-100 text-cyan-700',
  'DRAFT_SUBMITTED': 'bg-amber-100 text-amber-700',
  'FINAL_APPROVED': 'bg-lime-100 text-lime-700',
  'PRODUCTION_COMPLETE': 'bg-emerald-100 text-emerald-700',
  'ONAIR_STARTED': 'bg-rose-100 text-rose-700',
  'AFTER_SERVICE': 'bg-violet-100 text-violet-700',
  'COMPLETE': 'bg-green-100 text-green-700',
  'ADMIN_CHECKING': 'bg-orange-100 text-orange-700',
  'ADMIN_CONFIRMED': 'bg-red-100 text-red-700',
  'STOPPED': 'bg-slate-100 text-slate-700',
  'CANCELLED': 'bg-red-100 text-red-700'
}

export const StatusCategoryLabels: Record<MainStatusCategory, string> = {
  '등록': '등록',
  '접수단계': '접수단계',
  '계약': '계약',
  '제작': '제작',
  '제작완료': '제작완료',
  '온에어': '온에어',
  '사후관리': '사후관리',
  '완료': '완료',
  '중단': '중단',
  '취소': '취소'
}

export const StatusByCategory: Record<MainStatusCategory, MainStatus[]> = {
  '등록': ['DRAFT', 'REQUESTED', 'APPROVED', 'PROPOSAL_OPEN', 'PROPOSAL_CLOSED'],
  '접수단계': ['OT_SCHEDULED', 'OT_COMPLETED', 'PROPOSAL_SUBMIT', 'PROPOSAL_SUBMITTED', 'PT_SCHEDULED', 'PT_COMPLETED', 'NO_SELECTION', 'SELECTED'],
  '계약': ['CONTRACT'],
  '제작': ['SHOOTING', 'EDITING', 'DRAFT_SUBMITTED', 'FINAL_APPROVED'],
  '제작완료': ['PRODUCTION_COMPLETE'],
  '온에어': ['ONAIR_STARTED'],
  '사후관리': ['AFTER_SERVICE'],
  '완료': ['COMPLETE'],
  '중단': ['STOPPED'],
  '취소': ['CANCELLED']
}

export const VisibilityLabels: Record<VisibilityStatus, string> = {
  'PUBLIC': '공개',
  'PRIVATE': '비공개',
  'INVITE_ONLY': '초대 전용',
  'HIDDEN': '숨김'
}

export const PaymentLabels: Record<PaymentStatus, string> = {
  'NOT_STARTED': '미정산',
  'DEPOSIT_PAID': '계약금 지급',
  'MID_PAID': '중도금 지급',
  'BALANCE_PAID': '잔금 지급',
  'COMPLETE': '정산 완료'
}

export const STATUSES_WITH_PARTNER = new Set<MainStatus>([
  "CONTRACT", "SHOOTING", "EDITING", "DRAFT_SUBMITTED", "FINAL_APPROVED",
  "PRODUCTION_COMPLETE", "ONAIR_STARTED", "AFTER_SERVICE", "COMPLETE",
  "ADMIN_CHECKING", "ADMIN_CONFIRMED",
])
