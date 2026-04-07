import { useState, useEffect, forwardRef, useImperativeHandle, useMemo, type ReactNode } from "react"
import { useLocation } from "wouter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { BackToListButton } from "@/components/BackToListButton"
import { Search, Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { 
  MainStatus, 
  MainStatusCategory,
  MainStatusLabels, 
  StatusByCategory,
  VisibilityStatus,
} from "@/types/project-status"
import { MOCK_ADMIN_PROJECTS_V1 } from "@/data/mockData"
import { cn } from "@/lib/utils"
import { ConsultingInquiryAdminView } from "@/components/work-consulting/consulting-inquiry-admin-view"
import type { StoredWorkProject, WorkConsultingProject } from "@/lib/work-consulting-projects"
import { CompanyDetailTabs } from "@/components/admin/CompanyDetailTabs"
import { ProcessStepper, getProjectSteps, getActiveStepIndexFromMainStatus } from "@/components/project/ProcessStepper"
import WorkflowMatchingPage from "@/pages/admin/workflow/matching"
import WorkflowProductionPage from "@/pages/admin/workflow/production"
import WorkflowProposalSubmissionStatus from "@/pages/admin/workflow/proposal-submission-status"

/** 컨설팅 상담완료 후 결과 유형 */
export type ConsultingOutcomeKind =
  | "MATCHING_PUBLIC"
  | "MATCHING_1TO1"
  | "DIRECT_INTRO"
  | "SIMPLE_CONSULT"

/** 컨설팅 상담 중 기록(전화·메시지·대기 등) — 누적 시 진행중으로 간주 */
export type ConsultingActivityKind = "PHONE" | "MESSAGE_OUT" | "MESSAGE_IN" | "WAITING" | "NOTE"

export interface ConsultingActivityEntry {
  id: string
  /** 상담 일시(ISO 8601) */
  at: string
  /** 상담반법(전화·메시지 등) */
  kind: ConsultingActivityKind
  note?: string
}

/** 상담 완료 시 선택하는 서비스 티어(목업 UI) */
export type ConsultingServiceTier = "SIMPLE_MATCH" | "PROJECT_RUN" | "FULLCARE_PT" | "CUSTOM"


interface Project {
  id: string
  title: string
  client: string
  partner?: string
  ownerCompanyId?: string
  participantCompanyIds?: string[]
  type: '공고' | '1:1' | '컨설팅'
  status: MainStatus
  visibility: VisibilityStatus
  budget: string
  productionBudget?: string
  totalBudget?: string
  createdAt: string
  deadline?: string
  description: string
  /** 계약 시작일 (API 연동 시 사용) */
  contractStartDate?: string
  /** 계약 마감일 (API 연동 시 사용) */
  contractEndDate?: string
  /** 컨설팅: 결과 유형 (공고 진행 / 1:1 매칭 / 직접 소개 / 단순상담) */
  consultingOutcomeKind?: ConsultingOutcomeKind
  /** 공고·1:1 진행 시 연결된 제작 프로젝트 ID */
  consultingLinkedProjectId?: string
  /** 직접 소개: (매칭정보) 표시용 문구 */
  consultingMatchingInfo?: string
  /** 컨설팅 문의/요청: 연락처 */
  phone?: string
  /** 컨설팅 문의/요청: 첨부파일명 목록 (File 객체는 로컬저장에 못 담아 문자열만 저장) */
  attachmentFileNames?: string[]
  /** 레거시: 자유 텍스트만 있을 때(구 데이터) */
  consultingOutcome?: string
  /** 관리자 답변 */
  consultingAdminReply?: string
  /** 관리자 결론 메모 */
  consultingConclusion?: string
  /** 컨설팅 확정 금액(표시용 문자열) */
  consultingAmount?: string
  /** 상담 중 활동 기록(시간순) */
  consultingActivityLog?: ConsultingActivityEntry[]
  /** 비용 결제 방법(목업) */
  consultingPaymentMethod?: string
  /** 컨설팅 서비스 티어(목업 카드 선택) */
  consultingServiceTier?: ConsultingServiceTier
}

interface ProjectManagementProps {
  filterType?: '공고' | '1:1' | '컨설팅' | null
  /** true면 `localStorage`에 추가된 컨설팅 문의(목업)만 사용 */
  localOnly?: boolean
  /** true면 "전체 프로젝트(ALL)" 화면에서 컨설팅 프로젝트를 제외합니다. */
  excludeConsultingInAll?: boolean
  /** true면 테이블의 `타입` 컬럼을 숨김 */
  hideTypeColumn?: boolean
  /** 컨설팅 목록 `진행` 열에 동그라미 오른쪽에 결과(ConsultingOutcomeBlock) 표시 — 관리자 컨설팅 프로젝트 화면 전용 */
  showConsultingOutcomeInList?: boolean
  /** 컨설팅 상세: admin=상담사 처리(입력·버튼), completion=의뢰인 읽기 전용 */
  consultingDetailMode?: "admin" | "completion"
  /** true면 상단 탭(프로젝트 상세/의뢰사/수행사/참여현황 등) 숨김. 승인 대기·컨설팅 프로젝트 메뉴에서 사용 */
  hideWorkflowTabs?: boolean
  /** 작업 컨설팅 문의 상세만: 넓은 셀렉트·칩형 탭·본문 회색 패널·요청 내역 숨김(리스트 UI는 동일) */
  consultingWorkInquiryDetail?: boolean
  /** 관리자 컨설팅 목록: 제목/진행 클릭 시 인라인 상세 대신 `/admin/consulting/:id` 로 이동 */
  consultingOpenDetailAsRoute?: boolean
  /** 상세 화면 내부의 "목록으로" 버튼을 숨김 (팝업에서 사용) */
  hideBackToListButton?: boolean
  /** 팝업에서 닫기 버튼을 노출하고 싶을 때 사용 */
  showCloseButton?: boolean
  /** 팝업 닫기 핸들러 (showCloseButton=true일 때 필요) */
  onClose?: () => void
  /** 특정 프로젝트를 바로 상세로 열고 싶을 때 사용 (예: 진행현황 → 상세 진입) */
  initialProjectId?: string | null
  /** 최초 진입 시 기본으로 적용할 상태 필터 (예: 승인 대기 페이지에서 REQUESTED) */
  defaultStatus?: MainStatus | "ALL"
  /** 이 값이 있으면 리스트에는 해당 상태들만 노출 (예: 중단/취소 전용 목록) */
  defaultStatuses?: MainStatus[]
  /** 상단 페이지 타이틀 옆에 현재 화면명(참여/OT/제안/PT 등)을 표시하고 싶을 때 사용 */
  onActiveViewChange?: (label: string) => void
  /** 상세 모드 진입/이탈 시 호출. 부모에서 "목록으로" 버튼을 제목 위에 배치할 때 사용 */
  onDetailModeChange?: (isDetail: boolean) => void
  /** true면 컨설팅 문의에 연결된 공고/1:1 프로젝트만 표시 (관련 프로젝트 메뉴 전용) */
  filterConsultingLinked?: boolean
  /** true면 프로젝트를 인라인 상세 대신 새 창 상세 페이지로 엽니다. */
  openProjectDetailInNewWindow?: boolean
}

export interface ProjectManagementRef {
  clearSelection: () => void
}

const STEP_WORKFLOW_PATH: Record<string, string> = {
  MATCHING: "/admin/workflow/matching?stage=APPLY",
  OT: "/admin/workflow/matching?stage=OT",
  PROPOSAL: "/admin/workflow/proposal",
  PT: "/admin/workflow/matching?stage=PT1",
  CONTRACT: "/admin/workflow/contract",
  PRODUCTION: "/admin/workflow/production",
  SETTLEMENT: "/admin/workflow/settlement",
  COMPLETE: "/admin/workflow/review",
  REVIEW: "/admin/workflow/review",
}

const quickFilterStatuses: { value: MainStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "DRAFT", label: "임시저장" },
  { value: "REQUESTED", label: "승인요청" },
  { value: "PROPOSAL_OPEN", label: "접수" },
  { value: "SHOOTING", label: "진행중" },
  { value: "COMPLETE", label: "완료" },
  { value: "중단취소" as any, label: "중단/취소" },
]

const allStatuses: { value: MainStatus; label: string }[] = [
  { value: "DRAFT", label: "임시저장" },
  { value: "REQUESTED", label: "승인요청" },
  { value: "APPROVED", label: "승인완료" },
  { value: "PROPOSAL_OPEN", label: "접수" },
  { value: "PROPOSAL_CLOSED", label: "접수마감" },
  { value: "OT_SCHEDULED", label: "OT 예정" },
  { value: "OT_COMPLETED", label: "OT 완료" },
  { value: "PROPOSAL_SUBMIT", label: "제안서 제출 대기" },
  { value: "PROPOSAL_SUBMITTED", label: "제안서 제출 완료" },
  { value: "PT_SCHEDULED", label: "PT 예정" },
  { value: "PT_COMPLETED", label: "PT 완료" },
  { value: "NO_SELECTION", label: "미선정" },
  { value: "SELECTED", label: "선정완료" },
  { value: "CONTRACT", label: "계약완료" },
  { value: "SHOOTING", label: "촬영 중" },
  { value: "EDITING", label: "후반 작업" },
  { value: "DRAFT_SUBMITTED", label: "시안 제출" },
  { value: "FINAL_APPROVED", label: "최종본 컨펌 완료" },
  { value: "PRODUCTION_COMPLETE", label: "제작완료" },
  { value: "ONAIR_STARTED", label: "온에어 시작" },
  { value: "AFTER_SERVICE", label: "사후관리" },
  { value: "COMPLETE", label: "완료됨" },
  { value: "ADMIN_CHECKING", label: "관리자 확인중" },
  { value: "ADMIN_CONFIRMED", label: "관리자 승인됨" },
]

/** 계약 완료 단계 이후만 수행사 확정 → 그 전에는 '-' 표시 */
const STATUSES_WITH_PARTNER = new Set<MainStatus>([
  "CONTRACT", "SHOOTING", "EDITING", "DRAFT_SUBMITTED", "FINAL_APPROVED",
  "PRODUCTION_COMPLETE", "ONAIR_STARTED", "AFTER_SERVICE", "COMPLETE",
  "ADMIN_CHECKING", "ADMIN_CONFIRMED",
])

type WorkflowTabKey = "overview" | "company" | "partner" | "matching" | "proposal" | "contract" | "production" | "settlement" | "review"

/** 진행 상태에 따라 노출할 탭 목록. 순서: 프로젝트 상세 → [의뢰사(·수행사)] → 참여현황 → … (의뢰사는 항상, 수행사는 계약 이후만) */
function getVisibleWorkflowTabs(status: MainStatus, projectType: "공고" | "1:1"): WorkflowTabKey[] {
  const steps = getProjectSteps(projectType === "1:1" ? "1:1" : "PUBLIC")
  const stepIndex = getActiveStepIndexFromMainStatus(status, steps)
  const visible: WorkflowTabKey[] = ["overview", "company"]
  if (STATUSES_WITH_PARTNER.has(status)) {
    visible.push("partner")
  }
  if (stepIndex >= 0) {
    visible.push("matching", "proposal")
  }
  const contractIdx = steps.findIndex((s) => s.key === "CONTRACT")
  if (contractIdx >= 0 && stepIndex >= contractIdx) visible.push("contract")
  const productionIdx = steps.findIndex((s) => s.key === "PRODUCTION")
  if (productionIdx >= 0 && stepIndex >= productionIdx) visible.push("production")
  const settlementIdx = steps.findIndex((s) => s.key === "SETTLEMENT")
  if (settlementIdx >= 0 && stepIndex >= settlementIdx) visible.push("settlement")
  const reviewIdx = steps.findIndex((s) => s.key === "COMPLETE")
  if (reviewIdx >= 0 && stepIndex >= reviewIdx) visible.push("review")

  return visible
}

/** 컨설팅 상단 스텝: 접수 → 진행중 → 완료·결과(우측 블록에 상세 결과) */
const CONSULTING_HEADER_STEPS = ["접수", "진행중", "완료·결과"] as const

const LOCAL_STORAGE_KEY_ADMIN_PROJECTS_ADD = "cottoncandy_admin_projects_additions"

function consultingOutcomeKindLabel(kind: ConsultingOutcomeKind): string {
  switch (kind) {
    case "MATCHING_PUBLIC":
      return "공고 진행"
    case "MATCHING_1TO1":
      return "1:1 매칭 진행"
    case "DIRECT_INTRO":
      return "직접 소개"
    case "SIMPLE_CONSULT":
      return "단순상담"
    default:
      return "—"
  }
}

function short2(text: string): string {
  const t = text.replace(/\s+/g, "")
  return t.length <= 2 ? t : t.slice(0, 2)
}

/** 컨설팅 진행 스텝을 2글자 단위로 보기 좋게 축약 */
function consultingStepShort2(label: string): string {
  switch (label) {
    case "접수":
      return "접수"
    case "진행중":
      return "진행"
    case "완료·결과":
      return "완료"
    default:
      return short2(label)
  }
}

/** 컨설팅 결과: 공고/1:1 → 프로젝트 ID, 직접 소개 → 매칭정보, 단순상담 → 라벨만 */
function ConsultingOutcomeBlock({
  project,
  variant,
  onOpenLinkedProject,
}: {
  project: Project
  variant: "compact" | "detail"
  onOpenLinkedProject?: (projectId: string) => void
}) {
  const idx = getConsultingProgressStep(project)
  const pendingText = idx >= 2 ? "미등록" : "확정 전"
  const kind = project.consultingOutcomeKind
  const legacy = project.consultingOutcome?.trim()

  const alignmentClasses = variant === "compact" ? "items-center text-center" : "items-start"

  const textBase =
    variant === "compact"
      ? "text-xs sm:text-sm font-medium text-foreground leading-snug"
      : "text-sm font-medium text-foreground leading-snug"

  if (!kind && legacy) {
    return <span className={textBase}>{legacy}</span>
  }
  if (!kind) {
    return <span className={textBase + " text-muted-foreground"}>{pendingText}</span>
  }

  const showLinked =
    (kind === "MATCHING_PUBLIC" || kind === "MATCHING_1TO1") &&
    !!project.consultingLinkedProjectId?.trim()

  return (
    <div
      className={`flex flex-col min-w-0 ${variant === "compact" ? "gap-1.5" : "gap-1"} ${alignmentClasses} ${textBase}`}
    >
      <span>{consultingOutcomeKindLabel(kind)}</span>
      {showLinked && (
        <button
          type="button"
          className={`${variant === "compact" ? "text-center" : "text-left"} font-mono text-xs text-primary hover:underline w-fit`}
          onClick={() => onOpenLinkedProject?.(project.consultingLinkedProjectId!)}
        >
          {project.consultingLinkedProjectId}
        </button>
      )}
      {kind === "DIRECT_INTRO" && (
        project.consultingMatchingInfo?.trim() ? (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-center text-primary hover:underline text-xs w-fit font-medium"
                aria-label="매칭정보 보기"
              >
                매칭정보
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 text-sm leading-relaxed">
              {project.consultingMatchingInfo.trim()}
            </PopoverContent>
          </Popover>
        ) : (
          <span className="text-muted-foreground font-normal text-xs leading-snug">
            (매칭정보 미등록)
          </span>
        )
      )}
    </div>
  )
}

/** 목록 진행 열: 결과 칸은 완료 단계 이후(미등록)·또는 결과/레거시가 있을 때만 노출. 「확정 전」은 숨김 */
function consultingListOutcomeColumnVisible(project: Project): boolean {
  const idx = getConsultingProgressStep(project)
  const kind = project.consultingOutcomeKind
  const legacy = project.consultingOutcome?.trim()
  if (legacy) return true
  if (kind) return true
  if (idx >= 2) return true
  return false
}

function consultingActivityKindLabel(kind: ConsultingActivityKind): string {
  switch (kind) {
    case "PHONE":
      return "전화"
    case "MESSAGE_OUT":
      return "발신 메시지"
    case "MESSAGE_IN":
      return "수신·고객 반응"
    case "WAITING":
      return "답장 대기"
    case "NOTE":
      return "기타 메모"
    default:
      return kind
  }
}


function isConsultingCompleteStatus(status: MainStatus): boolean {
  return status === "COMPLETE" || status === "ADMIN_CONFIRMED" || status === "AFTER_SERVICE"
}

/** 0 접수 · 1 진행중(상담 활동 1건 이상) · 2 완료 */
function getConsultingProgressStep(project: Project): 0 | 1 | 2 {
  const { status } = project
  if (isConsultingCompleteStatus(status)) return 2
  /** 접수 단계: 상태가 접수중이면 활동 로그 유무와 관계없이 항상 「접수」 스텝 */
  if (status === "PROPOSAL_OPEN") return 0

  const hasLog = (project.consultingActivityLog?.length ?? 0) > 0
  if (hasLog) return 1

  return 0
}

function getConsultingConsultantName(project: Project): string | null {
  const notes = (project.consultingActivityLog ?? [])
    .map((e) => e.note)
    .filter((n): n is string => typeof n === "string" && n.trim().length > 0)

  for (const note of notes) {
    // 예: "[안내] 안녕하세요, 배정된 담당자 김컨설턴트입니다. 금일 오후 2시에 연락드리겠습니다."
    const m = note.match(/배정된 담당자\s*(.+?)\s*입니다/)
    if (m?.[1]) return m[1].trim()

    const m2 = note.match(/담당자\s*(.+?)\s*입니다/)
    if (m2?.[1]) return m2[1].trim()
  }

  return null
}

function getFinalSelectionStage(status: MainStatus): "APPLY" | "OT" | "PT" {
  if (status === "PT_SCHEDULED" || status === "PT_COMPLETED") {
    return "PT"
  }
  if (status === "OT_SCHEDULED" || status === "OT_COMPLETED") {
    return "OT"
  }
  return "APPLY"
}


export const ProjectManagement = forwardRef<ProjectManagementRef, ProjectManagementProps>(function ProjectManagement({
  filterType = null,
  localOnly = false,
  excludeConsultingInAll = false,
  hideTypeColumn = false,
  showConsultingOutcomeInList = false,
  consultingDetailMode = "admin",
  hideWorkflowTabs = false,
  consultingWorkInquiryDetail = false,
  consultingOpenDetailAsRoute = false,
  hideBackToListButton = false,
  showCloseButton = false,
  onClose,
  initialProjectId = null,
  defaultStatus = "ALL",
  defaultStatuses,
  onActiveViewChange,
  onDetailModeChange,
  filterConsultingLinked = false,
  openProjectDetailInNewWindow = false,
}, ref) {
  const [, setLocation] = useLocation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<MainStatus | MainStatusCategory | "ALL">(defaultStatus)
  const projects: Project[] = (() => {
    const base = MOCK_ADMIN_PROJECTS_V1 as unknown as Project[]
    if (typeof window === "undefined") return base
    let additions: Project[] = []
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN_PROJECTS_ADD)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          additions = parsed.filter((p: any) => p && typeof p.id === "string") as Project[]
        }
      }
    } catch {
      additions = []
    }

    if (localOnly) {
      if (additions.length === 0) {
        // 사용자 화면(컨설팅 문의) 목업용: 기본 더미 10건 시드
        const now = new Date()
        const createdAtBase = now.toISOString().slice(0, 10)
        const statusPool: MainStatus[] = [
          "PROPOSAL_OPEN",
          "PROPOSAL_SUBMITTED",
          "OT_SCHEDULED",
          "OT_COMPLETED",
          "PRODUCTION_COMPLETE",
          "COMPLETE",
          "ADMIN_CONFIRMED",
          "AFTER_SERVICE",
        ]
        const outcomePool: ConsultingOutcomeKind[] = [
          "SIMPLE_CONSULT",
          "MATCHING_PUBLIC",
          "MATCHING_1TO1",
          "DIRECT_INTRO",
        ]

        const activityKinds: ConsultingActivityKind[] = ["PHONE", "MESSAGE_OUT", "WAITING", "MESSAGE_IN", "NOTE"]

        const seeded: Project[] = Array.from({ length: 10 }).map((_, i) => {
          const idx = i % statusPool.length
          const status = statusPool[idx]
          const kind = status === "COMPLETE" || status === "ADMIN_CONFIRMED" || status === "AFTER_SERVICE" ? outcomePool[i % outcomePool.length] : undefined

          const phoneLast = String(10 + i).padStart(2, "0")
          const phone = `010-1234-${phoneLast}`

          const attachmentFileNames =
            i % 3 === 0 ? [`샘플_첨부_${i + 1}.pdf`, `참고_자료_${i + 1}.png`] : []

          const linkedProjectId = kind === "MATCHING_PUBLIC" ? "PRJ-011" : kind === "MATCHING_1TO1" ? "PRJ-009" : undefined
          const matchingInfo =
            kind === "DIRECT_INTRO" ? `TVCF 전문 제작사 ${i + 1}차 매칭 (솜사탕애드)` : undefined

          const isDone = isConsultingCompleteStatus(status)
          const isReceiptOnly = status === "PROPOSAL_OPEN"
          /** 진행중 규칙: 접수만 빼고 비완료는 활동 1건 이상 */
          const consultingActivityLog: ConsultingActivityEntry[] | undefined =
            isDone || isReceiptOnly
              ? isDone
                ? [
                    {
                      id: `act-seed-a-${i}`,
                      at: new Date(now.getTime() - (i + 3) * 86400000).toISOString(),
                      kind: activityKinds[i % activityKinds.length],
                      note: "1차 상담",
                    },
                    {
                      id: `act-seed-b-${i}`,
                      at: new Date(now.getTime() - (i + 1) * 86400000).toISOString(),
                      kind: "PHONE",
                      note: "결과 안내",
                    },
                  ]
                : undefined
              : [
                  {
                    id: `act-seed-${i}`,
                    at: new Date(now.getTime() - (i + 1) * 86400000).toISOString(),
                    kind: activityKinds[i % activityKinds.length],
                    note: i % 2 === 0 ? "초기 상담 진행" : "문자 발송 후 회신 대기",
                  },
                ]

          return {
            id: `PRJ-CONS-DUMMY-${i + 1}`,
            title: `더미 컨설팅 문의 ${i + 1}`,
            client: i === 1 ? "(주)오리온" : `더미 의뢰사 ${i + 1}`,
            type: "컨설팅",
            status,
            visibility: "PUBLIC",
            budget: `${300 + i * 50}만원`,
            createdAt: createdAtBase,
            description: `컨설팅 문의 더미 내용 ${i + 1}`,
            phone,
            attachmentFileNames,
            consultingOutcomeKind: kind,
            consultingLinkedProjectId: linkedProjectId,
            consultingMatchingInfo: matchingInfo,
            consultingActivityLog,
          }
        })

        additions = seeded
        window.localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN_PROJECTS_ADD, JSON.stringify(seeded))
      } else {
        // 예전 시드(활동 로그 없음): 진행중 판정을 위해 비완료·비접수 건에 활동 1건 보정
        let dirty = false
        additions = additions.map((p) => {
          if (p.type !== "컨설팅") return p
          let next = p
          if (p.id === "PRJ-CONS-DUMMY-2" && p.client === "더미 의뢰사 2") {
            next = { ...p, client: "(주)오리온" }
            dirty = true
          }
          if ((next.consultingActivityLog?.length ?? 0) > 0) return next
          if (isConsultingCompleteStatus(next.status)) return next
          if (next.status === "PROPOSAL_OPEN") return next
          dirty = true
          return {
            ...next,
            consultingActivityLog: [
              {
                id: `act-mig-${next.id}`,
                at: new Date(Date.now() - 86400000).toISOString(),
                kind: "MESSAGE_OUT",
                note: "목업 보정: 진행중 건에 상담 활동이 없어 추가되었습니다.",
              },
            ],
          }
        })
        if (dirty) {
          window.localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN_PROJECTS_ADD, JSON.stringify(additions))
        }
      }
      return additions
    }

    const map = new Map<string, Project>()
    base.forEach((p) => map.set(p.id, p))
    additions.forEach((p) => map.set(p.id, p))
    return Array.from(map.values())
  })()

  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    if (consultingOpenDetailAsRoute) return null
    if (!initialProjectId) return null
    const allProjects: Project[] = projects
    return allProjects.find((p) => p.id === initialProjectId) ?? null
  })

  const openProjectDetailPageInNewWindow = (projectId: string) => {
    const url = `/admin/project-detail/${encodeURIComponent(projectId)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const openConsultingFromList = (project: Project) => {
    if (openProjectDetailInNewWindow && project.type !== "컨설팅") {
      openProjectDetailPageInNewWindow(project.id)
      return
    }
    if (consultingOpenDetailAsRoute && project.type === "컨설팅") {
      setLocation(`/admin/consulting/${encodeURIComponent(project.id)}`)
      return
    }
    setSelectedProject(project)
    setWorkflowTab("overview")
  }

  // 연계 프로젝트 버튼(목록 `결과` 열)을 눌렀을 때
  // SPA 내부 화면 전환이 아니라 새 창(탭)으로 띄웁니다.
  const openLinkedProjectInNewWindow = (projectId: string) => {
    const url = `/admin/project-detail/${encodeURIComponent(projectId)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const [workflowTab, setWorkflowTab] = useState<
    "company" | "partner" | "overview" | "matching" | "proposal" | "contract" | "production" | "settlement" | "review"
  >("overview")
  const [matchingStage, setMatchingStage] = useState<"APPLY" | "OT" | "PT1">("APPLY")
  const [openCompanyId, setOpenCompanyId] = useState<string | null>(null)
  const [openCompanyRole, setOpenCompanyRole] = useState<"client" | "partner" | null>(null)

  const upsertProjectToLocalStorage = (nextProject: Project) => {
    if (typeof window === "undefined") return
    let additions: Project[] = []
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN_PROJECTS_ADD)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) additions = parsed as Project[]
      }
    } catch {
      additions = []
    }
    const map = new Map<string, Project>()
    additions.forEach((p) => map.set(p.id, p))
    map.set(nextProject.id, nextProject)
    window.localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN_PROJECTS_ADD, JSON.stringify(Array.from(map.values())))
  }

  const updateSelectedProject = (patch: Partial<Project>) => {
    setSelectedProject((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch } as Project
      upsertProjectToLocalStorage(next)
      return next
    })
  }

  const createLinkedProjectForConsulting = (targetType: "공고" | "1:1"): string | null => {
    if (!selectedProject) return null
    const stamp = Date.now().toString().slice(-6)
    const newId = `PRJ-LINK-${stamp}`
    const nextProject: Project = {
      id: newId,
      title: `[연결] ${selectedProject.title}`,
      client: selectedProject.client,
      type: targetType,
      status: "PROPOSAL_OPEN",
      visibility: "PUBLIC",
      budget: selectedProject.consultingAmount || selectedProject.budget || "미정",
      createdAt: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
      description: `컨설팅 ${selectedProject.id}에서 생성된 연계 프로젝트`,
      productionBudget: selectedProject.consultingAmount,
      totalBudget: selectedProject.consultingAmount,
    }
    upsertProjectToLocalStorage(nextProject)
    return newId
  }

  const openConsultingLinkedProject = (projectId: string) => {
    const p = projects.find((x) => x.id === projectId)
    if (p) {
      setSelectedProject(p)
      setWorkflowTab("overview")
    }
  }

  const isWorkConsultInquiryDetail =
    !!selectedProject && consultingWorkInquiryDetail && selectedProject.type === "컨설팅"

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const itemsPerPage = 10
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [messageRecipients, setMessageRecipients] = useState<("client" | "partner")[]>([])
  const [messageText, setMessageText] = useState("")
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectError, setRejectError] = useState("")
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false)
  const [stopCancelApproveOpen, setStopCancelApproveOpen] = useState(false)
  const [stopCancelApproveType, setStopCancelApproveType] = useState<"중단 승인" | "취소 승인" | "요청 거절" | "완료 취소">("중단 승인")
  const [stopCancelRejectReason, setStopCancelRejectReason] = useState("")
  const [stopCancelRejectError, setStopCancelRejectError] = useState("")

  useImperativeHandle(ref, () => ({
    clearSelection: () => setSelectedProject(null),
  }), [])

  useEffect(() => {
    onDetailModeChange?.(!!selectedProject)
  }, [selectedProject, onDetailModeChange])

  // 상단 외부 타이틀(예: 1:1 프로젝트 관리) 옆에 현재 화면명 노출용
  useEffect(() => {
    if (!onActiveViewChange) return

    // 리스트 모드일 때는 하위 화면명 제거
    if (!selectedProject) {
      onActiveViewChange("")
      return
    }

    let label = ""

    if (workflowTab === "company") {
      label = "의뢰 정보"
    } else if (workflowTab === "partner") {
      label = "수행사 정보"
    } else if (workflowTab === "overview") {
      label = "프로젝트 상세"
    } else if (workflowTab === "matching") {
      // 참여현황 하위 스테이지
      if (matchingStage === "APPLY") label = "참여"
      else if (matchingStage === "OT") label = "OT"
      else if (matchingStage === "PT1") label = "PT"
    } else if (workflowTab === "proposal") {
      label = "제안"
    } else if (workflowTab === "contract") {
      label = "계약"
    } else if (workflowTab === "production") {
      label = "제작"
    } else if (workflowTab === "settlement") {
      label = "정산"
    } else if (workflowTab === "review") {
      label = "리뷰"
    }

    onActiveViewChange(label)
  }, [selectedProject, workflowTab, matchingStage, onActiveViewChange])

  const parseManwon = (text: string) => {
    const n = Number(String(text).replace(/[^\d]/g, ""))
    return Number.isFinite(n) && n > 0 ? n : null
  }

  const renderBudgetCell = (project: Project) => {
    // 우선순위: 분리 필드 → 예산 문자열에서 숫자 파싱 → 원본 예산 표시
    const prodRaw = project.productionBudget ?? ""
    const totalRaw = project.totalBudget ?? ""

    if (prodRaw && totalRaw) {
      return (
        <span className="inline-flex items-baseline gap-1 tabular-nums whitespace-nowrap">
          <span className="font-semibold text-gray-900">{prodRaw}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600">{totalRaw}</span>
        </span>
      )
    }

    const base = project.budget ?? ""
    const total = project.totalBudget ?? ""
    if (base && total) {
      return (
        <span className="flex flex-col leading-snug">
          <span className="text-gray-900 whitespace-nowrap">{base}</span>
          <span className="text-gray-400 text-xs whitespace-nowrap">(총 {total})</span>
        </span>
      )
    }
    return <span className="text-gray-900 whitespace-nowrap">{base}</span>
  }

  const getConsultingProgress = (status: MainStatus) => {
    /**
     * 컨설팅은 제작 절차(OT/PT/계약...) 대신
     * 요청 → 컨설턴트 답변 → 결과(채택/종결) 흐름으로 표시한다.
     *
     * 현재 목업 status 필드만으로 완벽한 분기는 어렵기 때문에
     * 아래는 "운영 화면용" 최소 매핑으로 잡고, 추후 실데이터 필드가 붙으면 고도화한다.
     */
    const isDoneLike =
      status === "AFTER_SERVICE" ||
      status === "COMPLETE" ||
      status === "ADMIN_CONFIRMED"
    const isAnsweredLike =
      status === "PROPOSAL_SUBMITTED" ||
      status === "PT_COMPLETED" ||
      status === "SELECTED" ||
      status === "CONTRACT" ||
      status === "SHOOTING" ||
      status === "EDITING" ||
      status === "PRODUCTION_COMPLETE"

    const steps = ["요청", "답변", "결과"] as const
    const activeIndex = isDoneLike ? 2 : isAnsweredLike ? 1 : 0

    return { steps, activeIndex }
  }

  const consultingLinkedProjectIds = useMemo(() => {
    // 컨설팅 문의 결과로 연결된 제작 프로젝트에 "컨설팅" 딱지를 표시하기 위해,
    // 컨설팅 프로젝트들의 consultingLinkedProjectId를 역참조용 Set으로 만든다.
    const ids = new Set<string>()
    projects.forEach((p) => {
      if (p.type !== "컨설팅") return
      const linked = p.consultingLinkedProjectId?.trim()
      if (linked) ids.add(linked)
    })
    return ids
  }, [projects])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = defaultStatuses && defaultStatuses.length > 0
      ? defaultStatuses.includes(project.status)
      : selectedStatus === "ALL"
        ? true
        : (selectedStatus as string) === "중단취소"
          ? project.status === "STOPPED" || project.status === "CANCELLED"
          : selectedStatus in StatusByCategory
            ? (StatusByCategory[selectedStatus as MainStatusCategory] as MainStatus[]).includes(project.status)
            : project.status === selectedStatus
    const matchesType =
      filterType !== null
        ? project.type === filterType
        : !(excludeConsultingInAll && project.type === "컨설팅")
    const matchesLinked = filterConsultingLinked ? consultingLinkedProjectIds.has(project.id) : true
    return matchesSearch && matchesStatus && matchesType && matchesLinked
  })

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const isConsultingInquiryList = filterType === "컨설팅" && showConsultingOutcomeInList

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedProjects.map(p => p.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, projectId])
    } else {
      setSelectedRows(prev => prev.filter(id => id !== projectId))
    }
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as MainStatus | "ALL")
    setCurrentPage(1)
  }

  return (
    <div
      className={cn(
        "min-h-0 min-w-0",
        selectedProject && isWorkConsultInquiryDetail
          ? "flex h-full flex-1 flex-col gap-4 overflow-hidden"
          : "h-full flex-1 space-y-4 overflow-hidden",
      )}
    >
      {/* 리스트 모드: 필터 + 테이블 + 페이지네이션 */}
      {!selectedProject && (
      <>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* 검색 */}
          <div className="relative">
            <Input
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72 h-8 text-sm pl-8"
              data-testid="input-project-search"
            />
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
          </div>
          
          {/* 빠른 필터 버튼 */}
          <div className="flex items-center gap-2">
            {quickFilterStatuses.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedStatus === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange(filter.value)}
                className={`h-7 text-xs ${selectedStatus === filter.value ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>


          {/* 프로젝트 수 */}
          <div className="text-sm text-gray-500">
            총 <span className="font-medium text-pink-600">{filteredProjects.length}</span>개
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={selectedRows.length === paginatedProjects.length && paginatedProjects.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="h-4 w-4"
                  />
                </TableHead>
                <TableHead className="w-16 text-center text-xs font-medium text-gray-600">No</TableHead>
                <TableHead className="text-xs font-medium text-gray-600">
                  {isConsultingInquiryList ? "의뢰 / 컨설턴트" : "의뢰 / 수행"}
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-600">프로젝트명</TableHead>
                {!hideTypeColumn && (
                  <TableHead className="w-20 text-center text-xs font-medium text-gray-600">타입</TableHead>
                )}
                {!isConsultingInquiryList && (
                  <TableHead className="w-28 text-center text-xs font-medium text-gray-600">
                    <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
                      <span className="text-gray-900 font-semibold">제작비</span>
                      <span className="text-gray-300">/</span>
                      <span className="text-gray-600">총예산</span>
                    </span>
                  </TableHead>
                )}
                <TableHead className="w-24 text-center text-xs font-medium text-gray-600">등록일</TableHead>
                <TableHead
                  className={
                    isConsultingInquiryList
                      ? "text-left text-xs font-medium text-gray-600 w-32 whitespace-nowrap"
                      : "w-56 text-center text-xs font-medium text-gray-600"
                  }
                >
                  진행
                </TableHead>
                {isConsultingInquiryList && (
                  <TableHead className="w-32 text-left text-xs font-medium text-gray-600">
                    결과
                  </TableHead>
                )}
              </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.map((project, index) => {
              const steps = getProjectSteps(project.type === '1:1' ? '1:1' : 'PUBLIC')
              const activeStepIndex = getActiveStepIndexFromMainStatus(project.status, steps)

              return (
                <TableRow 
                  key={project.id} 
                  className="border-b border-gray-100 hover:bg-gray-50"
                  data-testid={`row-project-${project.id}`}
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedRows.includes(project.id)}
                      onCheckedChange={(checked) => handleSelectRow(project.id, checked as boolean)}
                      className="h-4 w-4"
                    />
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-600">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 whitespace-nowrap">
                    <div className="flex flex-col">
                      {project.ownerCompanyId ? (
                        <button
                          type="button"
                          className="hover:text-pink-600 hover:underline cursor-pointer text-left"
                          onClick={() => {
                            setOpenCompanyId(project.ownerCompanyId!)
                            setOpenCompanyRole("client")
                          }}
                          title={project.client}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span>{project.client}</span>
                            {consultingLinkedProjectIds.has(project.id) && (
                              <Badge className="h-5 px-2 text-[10px] bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50">
                                컨설팅
                              </Badge>
                            )}
                          </span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <span>{project.client}</span>
                          {consultingLinkedProjectIds.has(project.id) && (
                            <Badge className="h-5 px-2 text-[10px] bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50">
                              컨설팅
                            </Badge>
                          )}
                        </span>
                      )}
                      {isConsultingInquiryList ? (
                        <span className="text-xs text-gray-500">
                          {getConsultingConsultantName(project) ?? project.partner ?? "-"}
                        </span>
                      ) : STATUSES_WITH_PARTNER.has(project.status) && project.partner ? (
                        project.participantCompanyIds && project.participantCompanyIds.length > 0 ? (
                          <button
                            type="button"
                            className="text-xs text-gray-500 text-left hover:text-pink-600 hover:underline cursor-pointer"
                            onClick={() => {
                              setOpenCompanyId(project.participantCompanyIds![0])
                              setOpenCompanyRole("partner")
                            }}
                            title={project.partner}
                          >
                            {project.partner}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">{project.partner}</span>
                        )
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span 
                      className="text-sm text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
                      onClick={() => {
                        openConsultingFromList(project)
                      }}
                    >
                      {project.title}
                    </span>
                  </TableCell>
                  {!hideTypeColumn && (
                    <TableCell className="text-center">
                      <span className="text-xs text-gray-600">{project.type}</span>
                    </TableCell>
                  )}
                  {!isConsultingInquiryList && (
                    <TableCell className="text-center text-sm text-gray-600 whitespace-nowrap tabular-nums">
                      {renderBudgetCell(project)}
                    </TableCell>
                  )}
                  <TableCell className="text-center text-sm text-gray-600 whitespace-nowrap">{project.createdAt}</TableCell>
                  <TableCell
                    className={`${
                      isConsultingInquiryList && project.type === "컨설팅" && showConsultingOutcomeInList
                        ? "text-left align-middle w-32 whitespace-nowrap"
                        : project.type === "컨설팅" && showConsultingOutcomeInList
                          ? "text-left align-middle w-32 whitespace-nowrap"
                        : "text-center"
                    } ${
                      project.type === "컨설팅" && !showConsultingOutcomeInList ? "min-w-[292px]" : ""
                    }`}
                  >
                    <div
                      className={`flex flex-col gap-1.5 leading-tight ${
                        project.type === "컨설팅" && showConsultingOutcomeInList
                          ? "items-start w-max"
                          : "w-full items-center justify-center"
                      }`}
                    >
                      {project.type === "컨설팅" ? (
                        showConsultingOutcomeInList ? (
                          <div className="flex flex-row flex-nowrap items-center justify-start gap-3 w-max min-w-0">
                            <div className="flex items-center justify-start gap-1.5 flex-shrink-0">
                              {CONSULTING_HEADER_STEPS.map((label, idx) => {
                                const activeStepIndex = getConsultingProgressStep(project)
                                const isPastOrActive = activeStepIndex >= 0 && idx <= activeStepIndex
                                const isActive = idx === activeStepIndex
                                const baseClasses =
                                  "flex items-center justify-center w-6 h-6 rounded-full border text-[10px] font-medium transition-colors cursor-pointer"
                                const stateClasses = isActive
                                  ? "bg-pink-600 border-pink-600 text-white"
                                  : isPastOrActive
                                    ? "bg-pink-50 border-pink-300 text-pink-600"
                                    : "bg-gray-50 border-gray-200 text-gray-400"
                                return (
                                  <button
                                    key={label}
                                    type="button"
                                    className={`${baseClasses} ${stateClasses}`}
                                    title={label}
                                    onClick={() => {
                                      openConsultingFromList(project)
                                    }}
                                  >
                                    {consultingStepShort2(label)}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1 max-w-[292px] mx-auto flex-wrap">
                            {CONSULTING_HEADER_STEPS.map((label, idx) => {
                              const activeStepIndex = getConsultingProgressStep(project)
                              const isPastOrActive = activeStepIndex >= 0 && idx <= activeStepIndex
                              const isActive = idx === activeStepIndex
                              const baseClasses =
                                "flex items-center justify-center w-6 h-6 rounded-full border text-[10px] font-medium transition-colors cursor-pointer"
                              const stateClasses = isActive
                                ? "bg-pink-600 border-pink-600 text-white"
                                : isPastOrActive
                                  ? "bg-pink-50 border-pink-300 text-pink-600"
                                  : "bg-gray-50 border-gray-200 text-gray-400"
                              return (
                                <button
                                  key={label}
                                  type="button"
                                  className={`${baseClasses} ${stateClasses}`}
                                  title={label}
                                  onClick={() => {
                                    openConsultingFromList(project)
                                  }}
                                >
                                  {consultingStepShort2(label)}
                                </button>
                              )
                            })}
                          </div>
                        )
                      ) : (
                          <div className="flex items-center justify-center gap-1 max-w-[260px] mx-auto">
                            {steps.map((step, idx) => {
                              const isPastOrActive = activeStepIndex >= 0 && idx <= activeStepIndex
                              const isActive = idx === activeStepIndex
                              const baseClasses =
                                "flex items-center justify-center w-6 h-6 rounded-full border text-[10px] font-medium transition-colors cursor-pointer"
                              const stateClasses = isActive
                                ? "bg-pink-600 border-pink-600 text-white"
                                : isPastOrActive
                                  ? "bg-pink-50 border-pink-300 text-pink-600"
                                  : "bg-gray-50 border-gray-200 text-gray-400"

                              const shortLabel =
                                step.label === "참여"
                                  ? "참여"
                                  : step.label === "OT"
                                    ? "OT"
                                    : step.label === "제안서"
                                      ? "제안"
                                      : step.label === "PT"
                                        ? "PT"
                                        : step.label === "계약"
                                          ? "계약"
                                          : step.label === "제작"
                                            ? "제작"
                                            : step.label === "정산"
                                              ? "정산"
                                              : step.label === "리뷰"
                                                ? "리뷰"
                                                : step.label

                              const mapStepKeyToTab = (key: string): typeof workflowTab => {
                                if (key === "MATCHING" || key === "OT" || key === "PT" || key === "APPLY") {
                                  return "matching"
                                }
                                if (key === "PROPOSAL") return "proposal"
                                if (key === "CONTRACT") return "contract"
                                if (key === "PRODUCTION") return "production"
                                if (key === "SETTLEMENT") return "settlement"
                                if (key === "COMPLETE" || key === "REVIEW") return "review"
                                return "overview"
                              }

                              return (
                                <button
                                  key={step.key}
                                  type="button"
                                  className={`${baseClasses} ${stateClasses}`}
                                  title={step.label}
                                  onClick={() => {
                                    if (!selectedProject || selectedProject.id !== project.id) {
                                      setSelectedProject(project)
                                    }
                                    // 리스트 진행 셀도 상단 스텝퍼와 동일하게
                                    // 참여 / OT / PT 단계별로 매칭 하위 스테이지로 진입
                                    if (step.key === "MATCHING" || step.key === "APPLY") {
                                      setMatchingStage("APPLY")
                                    } else if (step.key === "OT") {
                                      setMatchingStage("OT")
                                    } else if (step.key === "PT") {
                                      setMatchingStage("PT1")
                                    }
                                    setWorkflowTab(mapStepKeyToTab(step.key))
                                  }}
                                >
                                  {shortLabel}
                                </button>
                              )
                            })}
                          </div>
                      )}
                    </div>
                  </TableCell>
                  {isConsultingInquiryList && (
                    <TableCell className="w-32 max-w-[128px] text-left text-xs text-gray-600 whitespace-nowrap">
                      {project.type === "컨설팅" ? (
                        consultingListOutcomeColumnVisible(project) ? (
                          <div className="w-full min-w-0">
                            <ConsultingOutcomeBlock
                              project={project}
                              variant="compact"
                                onOpenLinkedProject={openLinkedProjectInNewWindow}
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-center gap-1 py-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-8 px-2 text-xs"
          >
            {"<<"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className={`h-8 w-8 text-xs ${currentPage === pageNum ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
              >
                {pageNum}
              </Button>
            )
          })}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 px-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 px-2 text-xs"
          >
            {">>"}
          </Button>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          {selectedRows.length > 0 && (
            <span>
              <span className="font-medium">{selectedRows.length}</span>개 선택됨
            </span>
          )}
        </div>
        <div>
          {currentPage} / {totalPages || 1} 페이지
        </div>
      </div>
      </>
      )}

      {/* 상세 모드: 프로젝트 상세 + 탭 */}
      {selectedProject && (
        <div
          className={cn(
            "mt-6",
            isWorkConsultInquiryDetail && "flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden",
          )}
        >
          {/* 프로젝트 선택 + 우측 액션 */}
          <div
            className={cn(
              "flex items-center justify-between gap-4",
              isWorkConsultInquiryDetail ? "mb-5 shrink-0" : "mb-3",
            )}
          >
            <div
              className={cn(
                "min-w-0 flex-1",
                isWorkConsultInquiryDetail ? "sm:max-w-3xl lg:max-w-[min(100%,42rem)]" : "max-w-md",
              )}
            >
              <Select
                value={selectedProject.id}
                onValueChange={(value) => {
                  const next = projects.find((p) => p.id === value)
                  if (next) {
                    setSelectedProject(next as Project)
                    setWorkflowTab("overview")
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    "w-full text-sm",
                    isWorkConsultInquiryDetail
                      ? "h-12 rounded-xl border-slate-200/90 bg-white px-4 text-[15px] font-semibold text-slate-800 shadow-sm ring-offset-white transition-shadow hover:border-slate-300/90 focus:ring-2 focus:ring-emerald-500/20"
                      : "h-9",
                  )}
                >
                  <SelectValue placeholder="프로젝트 선택" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {[p.client, p.title].filter(Boolean).length > 1
                        ? `[${p.client}] ${p.title}`
                        : p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {selectedProject.status === "REQUESTED" && (
                <>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => {
                      setRejectReason("")
                      setRejectError("")
                      setRejectDialogOpen(true)
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    반려
                  </Button>
                  <Button
                    size="default"
                    className="bg-pink-600 hover:bg-pink-700"
                    onClick={() => {
                      setApproveDialogOpen(true)
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    승인
                  </Button>
                </>
              )}
              {selectedProject.status === "STOPPED" && (
                <>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => {
                      setStopCancelApproveType("요청 거절")
                      setStopCancelRejectReason("")
                      setStopCancelRejectError("")
                      setStopCancelApproveOpen(true)
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    요청 거절
                  </Button>
                  <Button
                    size="default"
                    className="bg-pink-600 hover:bg-pink-700"
                    onClick={() => {
                      setStopCancelApproveType("중단 승인")
                      setStopCancelApproveOpen(true)
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    중단 승인
                  </Button>
                </>
              )}
              {selectedProject.status === "CANCELLED" && (
                <>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => {
                      setStopCancelApproveType("요청 거절")
                      setStopCancelRejectReason("")
                      setStopCancelRejectError("")
                      setStopCancelApproveOpen(true)
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    요청 거절
                  </Button>
                  <Button
                    size="default"
                    className="bg-pink-600 hover:bg-pink-700"
                    onClick={() => {
                      setStopCancelApproveType("취소 승인")
                      setStopCancelApproveOpen(true)
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    취소 승인
                  </Button>
                </>
              )}
              {(selectedProject.status === "COMPLETE" || selectedProject.status === "ADMIN_CONFIRMED") && (
                <Button
                  size="default"
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    setStopCancelApproveType("완료 취소")
                    setStopCancelApproveOpen(true)
                  }}
                >
                  완료 취소처리
                </Button>
              )}
              {!isWorkConsultInquiryDetail && (
                <Button variant="outline" size="default" onClick={() => setMessageDialogOpen(true)}>
                  메시지 보내기
                </Button>
              )}
              {!hideBackToListButton && (
                <BackToListButton
                  className={
                    isWorkConsultInquiryDetail
                      ? "h-10 rounded-xl border-0 bg-slate-900 px-4 font-semibold text-white shadow-md shadow-slate-900/15 hover:bg-slate-800 hover:text-white"
                      : undefined
                  }
                  onClick={() => setSelectedProject(null)}
                >
                  목록으로
                </BackToListButton>
              )}
            </div>
          </div>

          <Dialog
            open={messageDialogOpen}
            onOpenChange={(open) => {
              setMessageDialogOpen(open)
              if (open) {
                setMessageRecipients(["client"])
              } else {
                setMessageRecipients([])
                setMessageText("")
              }
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>메시지 보내기</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1.5">수신자</div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={
                        messageRecipients.includes("client")
                          ? "bg-[#666666] text-white hover:bg-[#555555] hover:text-white border border-gray-400 shadow-sm"
                          : "border border-gray-300 text-gray-800 bg-white hover:bg-gray-100"
                      }
                      onClick={() =>
                        setMessageRecipients((prev) =>
                          prev.includes("client") ? prev.filter((t) => t !== "client") : [...prev, "client"],
                        )
                      }
                    >
                      의뢰사 ({selectedProject.client})
                    </Button>
                    {selectedProject.type !== "컨설팅" &&
                      selectedProject.partner &&
                      STATUSES_WITH_PARTNER.has(selectedProject.status) && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={
                            messageRecipients.includes("partner")
                              ? "bg-[#666666] text-white hover:bg-[#555555] hover:text-white border border-gray-400 shadow-sm"
                              : "border border-gray-300 text-gray-800 bg-white hover:bg-gray-100"
                          }
                          onClick={() =>
                            setMessageRecipients((prev) =>
                              prev.includes("partner") ? prev.filter((t) => t !== "partner") : [...prev, "partner"],
                            )
                          }
                        >
                          수행사 ({selectedProject.partner})
                        </Button>
                      )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1.5">메시지</div>
                  <textarea
                    className="w-full min-h-[100px] text-sm border border-gray-300 rounded-md p-2 resize-y"
                    placeholder="메시지를 입력하세요..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setMessageDialogOpen(false)
                      setMessageRecipients([])
                      setMessageText("")
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      // TODO: messageRecipients, messageText로 전송 API 호출
                      setMessageDialogOpen(false)
                      setMessageRecipients([])
                      setMessageText("")
                    }}
                  >
                    보내기
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* 상단 탭: 의뢰·상세 항상 표시, 공고/1:1은 진행 상태에 따라 추가 탭 노출 (승인대기·컨설팅은 의뢰·상세만) */}
          {(() => {
            const detailPanelShell = (body: ReactNode) =>
              isWorkConsultInquiryDetail ? (
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">{body}</div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">{body}</div>
              )
            return detailPanelShell(
              <>
                {(() => {
                  const projectType = selectedProject.type === "컨설팅" ? "공고" : selectedProject.type
                  const visibleTabs: WorkflowTabKey[] =
                    consultingWorkInquiryDetail && selectedProject.type === "컨설팅"
                      ? ["overview"]
                      : hideWorkflowTabs
                        ? ["overview", "company"]
                        : getVisibleWorkflowTabs(selectedProject.status, projectType)
                  const effectiveTab = visibleTabs.includes(workflowTab) ? workflowTab : visibleTabs[0]
                  const tabLabels: Record<WorkflowTabKey, string> = {
                    overview: "프로젝트 상세",
                    company: `의뢰: ${selectedProject.client}`,
                    partner: `수행: ${selectedProject.partner ?? "미정"}`,
                    matching: "참여현황",
                    proposal: "제안서·시안",
                    contract: "계약정보",
                    production: "산출물",
                    settlement: "정산",
                    review: "리뷰",
                  }
                  const companyKeys = visibleTabs.filter((k) => k === "company" || k === "partner")
                  const isConsultingProject = selectedProject.type === "컨설팅"
                  const consultingProgressStep = isConsultingProject ? getConsultingProgressStep(selectedProject) : 0
                  const groupBox =
                    "inline-flex items-center rounded-md border border-gray-400 bg-[#666666] text-white p-1 shrink-0 shadow-sm"
                  /* 작업 컨설팅 인입: 상단 바는 ConsultingInquiryAdminView(hideRequestSection) 안에서 목업과 동일하게 처리 */
                  if (consultingWorkInquiryDetail && isConsultingProject) {
                    return null
                  }
                  return (
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                      <Tabs value={effectiveTab} onValueChange={(v) => setWorkflowTab(v as WorkflowTabKey)}>
                        <TabsList className="inline-flex h-10 items-center gap-2 rounded-md bg-transparent p-0 text-muted-foreground w-full justify-start flex-wrap">
                          {/* 프로젝트 상세 탭: 가장 왼쪽 */}
                          <div className={groupBox} role="group" aria-label="프로젝트 상세">
                            <TabsTrigger
                              value="overview"
                              className="h-8 shrink-0 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=active]:shadow-sm"
                            >
                              프로젝트 상세
                            </TabsTrigger>
                          </div>
                          {/* 기업 묶음: 의뢰사·수행사 (계약 이후만 노출) */}
                          {companyKeys.length > 0 && (
                            <div className={groupBox} role="group" aria-label="기업">
                              {companyKeys.map((key) => (
                                <TabsTrigger
                                  key={key}
                                  value={key}
                                  className="h-8 shrink-0 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=active]:shadow-sm"
                                >
                                  {tabLabels[key]}
                                </TabsTrigger>
                              ))}
                            </div>
                          )}
                          {/* 진행 표시: 컨설팅은 활동·완료 처리에 따라 자동 반영(읽기 전용) + 우측 결과 */}
                          {isConsultingProject ? (
                            <div
                              className="flex flex-1 min-w-[260px] ml-4 items-center gap-4"
                              aria-label="컨설팅 진행 단계(자동)"
                            >
                              <div className="relative flex-1 min-w-0 self-center">
                                <div className="absolute left-0 right-0 top-5 h-0.5 bg-green-100 z-0" />
                                <div className="relative z-10 flex items-center w-full">
                                  {CONSULTING_HEADER_STEPS.map((label, idx) => {
                                    const isPastOrActive = idx <= consultingProgressStep
                                    const isActive = idx === consultingProgressStep
                                    return (
                                      <div
                                        key={label}
                                        className="flex-1 flex flex-col items-center gap-1"
                                        role="img"
                                        aria-label={`${label}${isActive ? " (현재)" : isPastOrActive ? " (지남)" : ""}`}
                                      >
                                        <span
                                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                                            isActive
                                              ? "bg-green-600 border-green-600 text-white"
                                              : isPastOrActive
                                                ? "bg-green-50 border-green-300 text-green-700"
                                                : "bg-white border-gray-300 text-gray-400"
                                          }`}
                                        >
                                          {idx + 1}
                                        </span>
                                        <span
                                          className={`text-[11px] font-medium ${
                                            isActive ? "text-green-700" : "text-gray-400"
                                          }`}
                                        >
                                          {label}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                              {selectedProject.consultingOutcomeKind === "SIMPLE_CONSULT" ? (
                                <span className="text-[11px] font-medium text-gray-500">단순상담</span>
                              ) : (
                                <div
                                  className="shrink-0 flex flex-row flex-wrap items-start pl-4 border-l border-green-200/90 min-w-0 max-w-[min(100%,240px)] sm:max-w-[280px]"
                                  title="상담 종료 후 확정(공고 진행·1:1 매칭·직접 소개·단순상담)"
                                >
                                  <ConsultingOutcomeBlock
                                    project={selectedProject}
                                    variant="compact"
                                    onOpenLinkedProject={openConsultingLinkedProject}
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="relative flex-1 min-w-[260px]" aria-label="진행 단계">
                              <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200 z-0" />
                              <div className="relative z-10 flex items-center w-full">
                                {[
                                  { key: "STEP1", label: "참여", tab: "matching" as WorkflowTabKey, stage: "APPLY" as "APPLY" | "OT" | "PT1" | null },
                                  { key: "STEP2", label: "OT",   tab: "matching" as WorkflowTabKey, stage: "OT" },
                                  { key: "STEP3", label: "제안", tab: "proposal" as WorkflowTabKey, stage: null },
                                  { key: "STEP4", label: "PT",   tab: "matching" as WorkflowTabKey, stage: "PT1" },
                                  { key: "STEP5", label: "계약", tab: "contract" as WorkflowTabKey, stage: null },
                                  { key: "STEP6", label: "제작", tab: "production" as WorkflowTabKey, stage: null },
                                  { key: "STEP7", label: "정산", tab: "settlement" as WorkflowTabKey, stage: null },
                                  { key: "STEP8", label: "리뷰", tab: "review" as WorkflowTabKey, stage: null },
                                ].map((step, idx) => {
                                  // 공고/1:1용 전체 스텝 정보
                                  const allWorkflowSteps = getProjectSteps(projectType === "1:1" ? "1:1" : "PUBLIC")
                                  const activeWorkflowStepIndex = getActiveStepIndexFromMainStatus(
                                    selectedProject.status,
                                    allWorkflowSteps,
                                  )
                                  const isStepReached = idx <= activeWorkflowStepIndex
                                  const isCurrentStep = idx === activeWorkflowStepIndex
                                  const isActive =
                                    step.tab === "matching"
                                      ? workflowTab === "matching" &&
                                        ((step.stage === "APPLY" && matchingStage === "APPLY") ||
                                         (step.stage === "OT" && matchingStage === "OT") ||
                                         (step.stage === "PT1" && matchingStage === "PT1"))
                                      : workflowTab === step.tab

                                  return (
                                    <button
                                      key={step.key}
                                      type="button"
                                      onClick={() => {
                                        if (!isStepReached) return
                                        if (step.tab === "matching" && step.stage) {
                                          setMatchingStage(step.stage)
                                        }
                                        setWorkflowTab(step.tab)
                                      }}
                                      className={`flex-1 flex flex-col items-center gap-1 h-auto px-0 py-0 border-none bg-transparent ${
                                        isStepReached ? "cursor-pointer" : "cursor-default"
                                      }`}
                                    >
                                      <span
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                                          isActive
                                            ? "bg-pink-600 border-pink-600 text-white"
                                            : isStepReached
                                              ? "bg-pink-50 border-pink-300 text-pink-600"
                                              : "bg-white border-gray-300 text-gray-400"
                                        }`}
                                      >
                                        {idx + 1}
                                      </span>
                                      <span
                                        className={`text-[11px] font-medium ${
                                          isCurrentStep ? "text-pink-600" : "text-gray-400"
                                        }`}
                                      >
                                        {step.label}
                                      </span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </TabsList>
                      </Tabs>
                    </div>
                  )
                })()}

                {/* 탭 콘텐츠 (승인대기·컨설팅은 의뢰·상세만, 그 외는 진행 상태에 따라 표시) */}
                {isWorkConsultInquiryDetail ? (
                  <ConsultingInquiryAdminView
                    project={selectedProject as WorkConsultingProject}
                    allProjects={projects as StoredWorkProject[]}
                    onUpdateProject={updateSelectedProject}
                    onOpenLinkedProject={openConsultingLinkedProject}
                    onCreateLinkedProject={createLinkedProjectForConsulting}
                    consultingDetailMode={consultingDetailMode}
                    embedded
                    hideRequestSection
                    fillAvailableHeight
                    contentMaxWidthClass="max-w-4xl"
                  />
                ) : (
                  <div className="px-6 pt-4 pb-6">
                    {(() => {
                    const projectType = selectedProject.type === "컨설팅" ? "공고" : selectedProject.type
                    const visibleTabs: WorkflowTabKey[] =
                      consultingWorkInquiryDetail && selectedProject.type === "컨설팅"
                        ? ["overview"]
                        : hideWorkflowTabs
                          ? ["overview", "company"]
                          : getVisibleWorkflowTabs(selectedProject.status, projectType)
                    const effectiveTab = visibleTabs.includes(workflowTab) ? workflowTab : visibleTabs[0]
                    return (
                  <Tabs
                    value={effectiveTab}
                    onValueChange={(v) => setWorkflowTab(v as WorkflowTabKey)}
                    className={cn(
                      isWorkConsultInquiryDetail &&
                        "box-border flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-6 pt-4 pb-6",
                    )}
                  >
                    <TabsContent value="company" className="mt-0">
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">의뢰사</span>
                          <span className="ml-2">{selectedProject.client}</span>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden min-h-[360px]">
                          {selectedProject.ownerCompanyId ? (
                            <CompanyDetailTabs
                              companyId={selectedProject.ownerCompanyId}
                              showPortfolio
                            />
                          ) : (
                            <div className="p-6 text-sm text-gray-500">
                              연결된 기업 정보가 없습니다.
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="partner" className="mt-0">
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">수행사</span>
                          <span className="ml-2">
                            {selectedProject.partner ?? "등록된 수행사 정보가 없습니다."}
                          </span>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden min-h-[360px]">
                          <iframe
                            title="파트너 회사소개서·포트폴리오"
                            src="/work/project/company-profile?embed=1"
                            className="w-full h-[900px] bg-white"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="overview"
                      className={cn(
                        "mt-0",
                        isWorkConsultInquiryDetail &&
                          "flex min-h-0 min-w-0 flex-1 flex-col outline-none",
                      )}
                    >
                      <div
                        className={cn(
                          isWorkConsultInquiryDetail &&
                            "flex min-h-0 min-w-0 flex-1 flex-col",
                        )}
                      >
                        {selectedProject.type === "컨설팅" ? (
                          consultingWorkInquiryDetail ? (
                            <ConsultingInquiryAdminView
                              project={selectedProject as WorkConsultingProject}
                              allProjects={projects as StoredWorkProject[]}
                              onUpdateProject={updateSelectedProject}
                              onOpenLinkedProject={openConsultingLinkedProject}
                              onCreateLinkedProject={createLinkedProjectForConsulting}
                              consultingDetailMode={consultingDetailMode}
                              embedded
                              hideRequestSection
                              fillAvailableHeight
                              contentMaxWidthClass="max-w-4xl"
                            />
                          ) : (
                            <ConsultingInquiryAdminView
                              project={selectedProject as WorkConsultingProject}
                              allProjects={projects as StoredWorkProject[]}
                              onUpdateProject={updateSelectedProject}
                              onOpenLinkedProject={openConsultingLinkedProject}
                              onCreateLinkedProject={createLinkedProjectForConsulting}
                              consultingDetailMode={consultingDetailMode}
                            />
                          )
                        ) : (
                        <div>
                        <div className="mb-4">
                          <h3 className="font-semibold tracking-tight text-xl">
                            [참여공고] 프로젝트 상세
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            등록된 공고를 보고 전문 기업이 참여 신청을 합니다.
                          </p>
                        </div>

                        <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <div className="text-sm text-gray-600 mb-3">{selectedProject.id} {MainStatusLabels[selectedProject.status]}</div>
                  </div>
                  <div className="text-sm text-gray-600">참여공고 대행사 경쟁PT My담당</div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {selectedProject.client.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold mb-2">{selectedProject.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-3">
                        <span>{selectedProject.client}</span>
                        <span className="text-gray-400">|</span>
                        <span>대기업</span>
                        <span className="text-gray-400">|</span>
                        <span>전기전자</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">총예산 {selectedProject.budget}</div>
                      <div className="text-xs text-gray-500">(제작비 3억~6억)</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="text-green-600">✓</span> 급행 제작 대응
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-green-600">✓</span> 경쟁사 수행기업 제외
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-green-600">✓</span> 리젝션 Fee
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">제품명</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">[OLED] 스탠바이미2</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 제품유형</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">카메라/영상/음향가전</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">의뢰항목</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">전략기획 크리에이티브 기획 영상 제작 미디어 집행</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">일정대응</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">#급행 제작 대응, #당일 피드백 반영 가능, #일정 유동성 대응</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">광고목적</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div>제품판매촉진 /리뷰형 콘텐츠 제작 #실사용</div>
                          <div>브랜드 인지도 향상 #바이럴 확산형 콘텐츠</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">제작기법</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">#AI, #라이브액션, #특수촬영, #캐릭터/동물 모델</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">매체</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">TV Youtube 디지털광고 옥외</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">주요 고객</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">10대, 20대</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 성별</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">전체</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 직업</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">직장인, 주부, 자영업자</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">경쟁사<br/>제한업종</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">전기/전자</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">수행기업<br/>제외</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">#삼성전자, #애플, #HP, #소니 (최근 6개월)</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">모집 파트너</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">대행사</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 세부유형</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">종합 광고대행사</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 상세조건</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div>광고 Awards 수상작 10작품 이상 (최근 3년간)</div>
                          <div>TVCF 명예의 전당 5작품 이상 (최근 3년간)</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">상세설명</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 leading-relaxed">
                          {selectedProject.description}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 lg:border-l lg:border-gray-200 lg:pl-12 mt-6 lg:mt-0">
                    <div className="flex gap-4">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">접수마감</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 font-medium">D-35</div>
                        <div className="text-xs text-gray-500 mt-1">(0팀 참여)</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">접수기간</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">2025.11.10(월) ~ 2025.12.10(수)</div>
                        <div className="text-xs text-gray-500 mt-1">(총 30일)</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">사전미팅(OT)</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">UP</span>
                            <span>2025.12.20 (목) 10:00 온라인</span>
                          </div>
                          <div className="text-xs text-gray-500">※ OT 참석기업 &gt; 제안서 검토 후 5일이내 개별 안내</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">제출자료 마감</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">2025.12.20</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">경쟁PT</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div>2025.12.25 (수) 12:00 서울시 강남구</div>
                          <div className="text-xs text-gray-500">※ PT 참석기업 &gt; 제안서 검토 후 5일이내 개별 안내</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">리젝션 Fee</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">new</span>
                            <span className="font-medium">30만원</span>
                          </div>
                          <div className="text-xs text-gray-500">※ PT후 미선정팀에 개별지급</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">파트너 선정 결과</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">PT발표 후 5일 이내 개별 안내</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">납품기한</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">2025.12.20</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">OnAir</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">2025.12.25</div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">대금지급</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div>선금 30%</div>
                          <div>중도금 30%</div>
                          <div>잔금 40%</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">지원 서류</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div><span className="text-pink-600">기본</span> 참여신청서 ⓘ</div>
                          <div><span className="text-pink-600">기본</span> 회사소개서 & 포트폴리오 ⓘ</div>
                          <div>사업자등록증사본</div>
                          <div>비밀유지 서약서</div>
                          <div className="font-medium mt-2">제안서·시안</div>
                          <div className="ml-4">제안서</div>
                          <div className="ml-4">시안</div>
                          <div className="ml-4">견적서</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">계약 체결 시<br/>제출 서류</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div>용역계약서</div>
                          <div>법인 등기부등본</div>
                          <div>통장 사본</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">기업 웹사이트</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 space-y-2">
                          <div>☎ 02-1234-5678</div>
                          <div className="pt-2 border-t border-gray-100">
                            <div>나해피 선임</div>
                            <div>☎ 02-1234-5679</div>
                            <div className="ml-4">010-1234-5679</div>
                            <div>nhappy@yesc.com</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="matching" className="mt-0">
                      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                        <WorkflowMatchingPage embedded stage={matchingStage} />
                      </div>
                    </TabsContent>
                    <TabsContent value="proposal" className="mt-0">
                      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                        <WorkflowProposalSubmissionStatus embedded />
                      </div>
                    </TabsContent>
                    <TabsContent value="contract" className="mt-0">
                      <div className="space-y-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">계약 정보</div>
                              <div className="mt-1 text-xs text-gray-500">
                                보안상 계약서 원문과 정확한 금액은 이 화면에서 노출하지 않습니다. (상태/구간만 표시)
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                              보안
                            </Badge>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50 border-b border-gray-200">
                                <TableHead className="w-[160px] text-xs font-medium text-gray-600">항목</TableHead>
                                <TableHead className="text-xs font-medium text-gray-600">내용</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(() => {
                                const totalManwon = parseManwon(selectedProject.budget ?? "")
                                const range = (() => {
                                  if (totalManwon == null) return "비공개"
                                  if (totalManwon < 500) return "500만원 미만"
                                  if (totalManwon < 1000) return "500만~1,000만"
                                  if (totalManwon < 3000) return "1,000만~3,000만"
                                  if (totalManwon < 5000) return "3,000만~5,000만"
                                  if (totalManwon < 10000) return "5,000만~1억"
                                  if (totalManwon < 30000) return "1억~3억"
                                  return "3억 이상"
                                })()

                                return (
                                  <>
                                    <TableRow className="border-b border-gray-100">
                                      <TableCell className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                        계약 상태
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-700">
                                        {selectedProject.status === "CONTRACT" ||
                                        selectedProject.status === "SHOOTING" ||
                                        selectedProject.status === "EDITING" ||
                                        selectedProject.status === "DRAFT_SUBMITTED" ||
                                        selectedProject.status === "FINAL_APPROVED" ||
                                        selectedProject.status === "PRODUCTION_COMPLETE" ||
                                        selectedProject.status === "ONAIR_STARTED" ||
                                        selectedProject.status === "AFTER_SERVICE" ||
                                        selectedProject.status === "COMPLETE" ||
                                        selectedProject.status === "ADMIN_CHECKING" ||
                                        selectedProject.status === "ADMIN_CONFIRMED"
                                          ? "체결됨"
                                          : "미체결/진행 전"}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow className="border-b border-gray-100">
                                      <TableCell className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                        금액(구간)
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-700">{range}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                        원문 열람
                                      </TableCell>
                                      <TableCell className="text-sm text-gray-600">
                                        원문은 <span className="font-medium text-gray-800">보안자료</span>에서만 열람할 수 있습니다.
                                      </TableCell>
                                    </TableRow>
                                  </>
                                )
                              })()}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="production" className="mt-0">
                      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                        <WorkflowProductionPage embedded />
                      </div>
                    </TabsContent>
                    <TabsContent value="settlement" className="mt-0">
                      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                        <iframe
                          title="workflow-embed-settlement"
                          className="w-full h-[620px] bg-white"
                          src="/admin/workflow-embed/settlement?embed=1"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="review" className="mt-0">
                      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                        <iframe
                          title="workflow-embed-review"
                          className="w-full h-[480px] bg-white"
                          src="/admin/workflow-embed/review?embed=1"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                    )
                  })()}
                  </div>
                )}
              </>
            )
          })()}

          <div
            className={cn(
              "mt-2 flex gap-2 justify-end pb-1",
              isWorkConsultInquiryDetail && "shrink-0",
            )}
          >
            {selectedProject.status === "REQUESTED" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRejectReason("")
                    setRejectError("")
                    setRejectDialogOpen(true)
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  반려
                </Button>
                <Button
                  className="bg-pink-600 hover:bg-pink-700"
                  onClick={() => {
                    setApproveDialogOpen(true)
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  승인
                </Button>
              </>
            )}
            {!isWorkConsultInquiryDetail && (
              <Button variant="outline" onClick={() => setMessageDialogOpen(true)}>
                메시지 보내기
              </Button>
            )}
            {showCloseButton && (
              <Button
                variant="outline"
                onClick={() => {
                  onClose?.()
                }}
              >
                닫기
              </Button>
            )}
            {!hideBackToListButton && (
              <BackToListButton onClick={() => setSelectedProject(null)}>목록으로</BackToListButton>
            )}
          </div>
        </div>
      )}

      {/* 회사 상세 팝업 (프로젝트 리스트 등에서 기업명 클릭 시) */}
      <Dialog
        open={!!openCompanyId}
        onOpenChange={(open) => {
          if (!open) {
            setOpenCompanyId(null)
            setOpenCompanyRole(null)
          }
        }}
      >
        <DialogContent className="max-w-6xl w-[1100px] h-[720px] max-h-[90vh] sm:top-[8vh] sm:translate-y-0 overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{openCompanyRole === "partner" ? "[수행사] 정보" : "[의뢰사] 정보"}</DialogTitle>
          </DialogHeader>
          {openCompanyId && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <CompanyDetailTabs
                companyId={openCompanyId}
                showPortfolio
              />
            </div>
          )}
          <div className="border-t pt-4 pb-1 flex justify-end shrink-0">
            <BackToListButton
              onClick={() => {
                setOpenCompanyId(null)
                setOpenCompanyRole(null)
              }}
              icon={<X className="h-4 w-4 shrink-0" />}
            >
              닫기
            </BackToListButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* 프로젝트 승인 확인 팝업 (1단계만) */}
      <Dialog
        open={approveDialogOpen}
        onOpenChange={(open) => {
          setApproveDialogOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>프로젝트 승인할까요?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            {selectedProject && (
              <div className="text-sm text-muted-foreground">
                <div className="font-medium text-foreground mb-1">
                  [{selectedProject.client}] {selectedProject.title}
                </div>
                <p>승인 후에는 공고/매칭 단계로 진행됩니다.</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => {
                // TODO: 실제 API 연동 시 상태 업데이트 및 이력 저장
                setApproveDialogOpen(false)
                setSelectedProject(null)
              }}
            >
              승인하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 중단/취소 요청 승인·거절 확인 팝업 */}
      <Dialog
        open={stopCancelApproveOpen}
        onOpenChange={(open) => {
          setStopCancelApproveOpen(open)
          if (!open) {
            setStopCancelRejectReason("")
            setStopCancelRejectError("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {stopCancelApproveType === "중단 승인" && "중단 요청을 승인할까요?"}
              {stopCancelApproveType === "취소 승인" && "취소 요청을 승인할까요?"}
              {stopCancelApproveType === "요청 거절" && "요청 거절 — 사유 입력"}
              {stopCancelApproveType === "완료 취소" && "완료 처리를 취소할까요?"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            {selectedProject && (
              <div className="text-sm text-muted-foreground">
                <div className="font-medium text-foreground mb-1">
                  [{selectedProject.client}] {selectedProject.title}
                </div>
                {stopCancelApproveType === "중단 승인" && (
                  <p>승인 시 프로젝트가 중단 처리됩니다.</p>
                )}
                {stopCancelApproveType === "취소 승인" && (
                  <p>승인 시 프로젝트가 취소 처리됩니다.</p>
                )}
                {stopCancelApproveType === "완료 취소" && (
                  <p>완료 처리를 취소하고 이전 단계로 되돌립니다.</p>
                )}
              </div>
            )}
            {stopCancelApproveType === "요청 거절" && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">거절 사유 <span className="text-pink-600">*</span></span>
                  <span className="text-xs text-gray-400">의뢰사에게 그대로 노출됩니다.</span>
                </div>
                <textarea
                  className="w-full min-h-[96px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="거절 사유를 입력하세요."
                  value={stopCancelRejectReason}
                  onChange={(e) => {
                    setStopCancelRejectReason(e.target.value)
                    if (stopCancelRejectError) setStopCancelRejectError("")
                  }}
                />
                {stopCancelRejectError && (
                  <p className="text-xs text-red-500">{stopCancelRejectError}</p>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStopCancelApproveOpen(false)}
            >
              닫기
            </Button>
            <Button
              type="button"
              className={
                stopCancelApproveType === "요청 거절"
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : stopCancelApproveType === "완료 취소"
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-pink-600 hover:bg-pink-700 text-white"
              }
              onClick={() => {
                if (stopCancelApproveType === "요청 거절" && !stopCancelRejectReason.trim()) {
                  setStopCancelRejectError("거절 사유를 입력해주세요.")
                  return
                }
                // TODO: 실제 API 연동 시 상태 업데이트 및 이력 저장
                setStopCancelApproveOpen(false)
                setStopCancelRejectReason("")
                setStopCancelRejectError("")
              }}
            >
              {stopCancelApproveType === "요청 거절" ? "거절하기" : stopCancelApproveType === "완료 취소" ? "취소처리" : "승인하기"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 프로젝트 반려 사유 입력 팝업 (1단계) */}
      <Dialog open={rejectDialogOpen} onOpenChange={(open) => {
        setRejectDialogOpen(open)
        if (!open) {
          setRejectReason("")
          setRejectError("")
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>프로젝트 반려 사유</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            {selectedProject && (
              <div className="text-sm text-muted-foreground">
                <div className="font-medium text-foreground mb-1">
                  [{selectedProject.client}] {selectedProject.title}
                </div>
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">반려 사유</span>
                <span className="text-xs text-gray-400">의뢰사에게 그대로 노출됩니다.</span>
              </div>
              <textarea
                className="w-full min-h-[96px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value)
                  if (rejectError) setRejectError("")
                }}
                placeholder="예) 예산/일정 정보가 부족하여 보완 후 재요청 부탁드립니다."
              />
              {rejectError && (
                <p className="text-xs text-red-500 mt-0.5">{rejectError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false)
              }}
            >
              취소
            </Button>
            <Button
              type="button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!rejectReason.trim()) {
                  setRejectError("반려 사유를 입력해 주세요.")
                  return
                }
                setRejectDialogOpen(false)
                // Dialog 닫힘 애니메이션/상태 전파 타이밍 이슈 방지
                setTimeout(() => setConfirmRejectOpen(true), 0)
              }}
            >
              반려 처리
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 프로젝트 반려 최종 확인 팝업 (2단계) */}
      <Dialog
        open={confirmRejectOpen}
        onOpenChange={(open) => setConfirmRejectOpen(open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>프로젝트를 반려하시겠습니까?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            {selectedProject && (
              <div className="text-sm text-muted-foreground">
                <div className="font-medium text-foreground mb-1">
                  [{selectedProject.client}] {selectedProject.title}
                </div>
                <p>입력한 반려 사유가 의뢰사에게 전달됩니다.</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmRejectOpen(false)}
            >
              아니오
            </Button>
            <Button
              type="button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setConfirmRejectOpen(false)
                // TODO: 실제 API 연동 시 상태 업데이트 및 이력 저장
                setSelectedProject(null)
              }}
            >
              네, 반려합니다
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
})
