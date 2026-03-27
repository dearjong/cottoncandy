import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProjectButton from "@/components/common/project-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Briefcase,
  Calendar,
  CreditCard,
  FileText,
  MessageCircle,
  MessageSquare,
  Phone,
  PhoneCall,
  Plus,
  Send,
  Check,
  Banknote,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MainStatus } from "@/types/project-status"
import type {
  ConsultingActivityEntry,
  ConsultingActivityKind,
  ConsultingOutcomeKind,
  ConsultingServiceTier,
} from "@/components/admin/project-management"
import type { StoredWorkProject, WorkConsultingProject } from "@/lib/work-consulting-projects"

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

function formatActivityShortKo(iso: string): string {
  try {
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return iso
  }
}

/** 참고 목업(App.tsx): call=blue-100, message=emerald-100, note=slate-200 */
function consultRefLogVisual(e: ConsultingActivityEntry): { Icon: LucideIcon; wrapClass: string; iconClass: string } {
  if (e.kind === "PHONE") {
    return { Icon: PhoneCall, wrapClass: "bg-blue-100", iconClass: "text-blue-600" }
  }
  if (e.kind === "NOTE") {
    return { Icon: FileText, wrapClass: "bg-slate-200", iconClass: "text-slate-600" }
  }
  return { Icon: MessageSquare, wrapClass: "bg-emerald-100", iconClass: "text-emerald-600" }
}

/** 작업 인입 목록: 발신자·본문(자동 보정 PHONE 로그는 시스템 안내처럼 표시) */
function activitySenderBodyForW(e: ConsultingActivityEntry): { sender: string; body: string } {
  const row = activityRowVisual(e)
  const raw = e.note?.trim() ?? ""
  if (raw.includes("목업 보정")) {
    return { sender: "시스템", body: raw }
  }
  return { sender: row.sender, body: row.body }
}

/** 작업 인입 목업: 시스템 안내·담당자 메시지 = 연한 초록 원 + 말풍선 아이콘(이미지 목업과 동일 톤) */
function consultRefLogVisualW(e: ConsultingActivityEntry): { Icon: LucideIcon; wrapClass: string; iconClass: string } {
  const body = e.note?.trim() ?? ""
  /* localStorage 마이그레이션에서 kind만 PHONE으로 넣었던 자동 문구 → 메시지 UI */
  if (e.kind === "PHONE" && body.includes("목업 보정")) {
    return {
      Icon: MessageCircle,
      wrapClass: "border-2 border-emerald-200 bg-emerald-50",
      iconClass: "text-emerald-600",
    }
  }
  if (e.kind === "PHONE") {
    return { Icon: PhoneCall, wrapClass: "bg-blue-100", iconClass: "text-blue-600" }
  }
  if (e.kind === "NOTE") {
    return { Icon: FileText, wrapClass: "bg-slate-200", iconClass: "text-slate-600" }
  }
  if (e.kind === "MESSAGE_IN") {
    return {
      Icon: MessageCircle,
      wrapClass: "bg-slate-100 ring-1 ring-inset ring-slate-200",
      iconClass: "text-slate-600",
    }
  }
  if (/^\[안내\]/u.test(body) || e.kind === "MESSAGE_OUT" || e.kind === "WAITING") {
    return {
      Icon: MessageCircle,
      wrapClass: "border-2 border-emerald-200 bg-emerald-50",
      iconClass: "text-emerald-600",
    }
  }
  return {
    Icon: MessageCircle,
    wrapClass: "border-2 border-emerald-200 bg-emerald-50",
    iconClass: "text-emerald-600",
  }
}

function formatLogTimeRef(iso: string): string {
  try {
    return format(new Date(iso), "MM.dd HH:mm")
  } catch {
    return formatActivityShortKo(iso)
  }
}

function activityRowVisual(e: ConsultingActivityEntry): {
  Icon: LucideIcon
  sender: string
  body: string
  iconWrapClass: string
  iconClass: string
} {
  const body = e.note?.trim() || (e.kind === "PHONE" ? "통화 기록" : "—")
  if (e.kind === "PHONE") {
    return {
      Icon: Phone,
      sender: "김컨설턴트",
      body,
      iconWrapClass: "bg-blue-500",
      iconClass: "text-white",
    }
  }
  if (/^\[안내\]/u.test(body)) {
    return {
      Icon: MessageCircle,
      sender: "시스템",
      body,
      iconWrapClass: "bg-emerald-500",
      iconClass: "text-white",
    }
  }
  if (e.kind === "MESSAGE_IN") {
    return {
      Icon: MessageCircle,
      sender: "고객",
      body,
      iconWrapClass: "bg-slate-100",
      iconClass: "text-slate-600",
    }
  }
  return {
    Icon: e.kind === "MESSAGE_OUT" ? Send : MessageCircle,
    sender: "김컨설턴트",
    body,
    iconWrapClass: "bg-slate-100",
    iconClass: "text-slate-600",
  }
}

function inferConsultingServiceTier(project: WorkConsultingProject): ConsultingServiceTier {
  if (project.consultingServiceTier) return project.consultingServiceTier
  switch (project.consultingOutcomeKind) {
    case "SIMPLE_CONSULT":
      return "SIMPLE_MATCH"
    case "MATCHING_1TO1":
      return "PROJECT_RUN"
    case "MATCHING_PUBLIC":
      return "FULLCARE_PT"
    case "DIRECT_INTRO":
      return "CUSTOM"
    default:
      return "CUSTOM"
  }
}

function isConsultingCompleteStatus(status: MainStatus): boolean {
  return status === "COMPLETE" || status === "ADMIN_CONFIRMED" || status === "AFTER_SERVICE"
}

/** 목업 상단 스텝: 접수 → 진행중 → 완료·결과 (`ProjectManagement`와 동일 규칙) */
const W_HEADER_STEPS = ["접수", "진행중", "완료·결과"] as const

function consultingProgressStepForView(p: WorkConsultingProject): 0 | 1 | 2 {
  if (isConsultingCompleteStatus(p.status)) return 2
  if (p.status === "PROPOSAL_OPEN") return 0
  if ((p.consultingActivityLog?.length ?? 0) > 0) return 1
  return 0
}

function workHeaderOutcomeBadge(p: WorkConsultingProject): string {
  const step = consultingProgressStepForView(p)
  if (isConsultingCompleteStatus(p.status)) {
    if (p.consultingOutcomeKind) return consultingOutcomeKindLabel(p.consultingOutcomeKind)
    return "완료"
  }
  if (!p.consultingOutcomeKind) return step >= 2 ? "미등록" : "확정 전"
  return consultingOutcomeKindLabel(p.consultingOutcomeKind)
}

export type ConsultingInquiryAdminViewProps = {
  project: WorkConsultingProject
  allProjects: StoredWorkProject[]
  onUpdateProject: (patch: Partial<WorkConsultingProject>) => void
  onOpenLinkedProject: (projectId: string) => void
  onCreateLinkedProject: (targetType: "공고" | "1:1") => string | null
  consultingDetailMode: "admin" | "completion"
  /** 작업 화면 셸에 넣을 때: 바깥 패딩·제목 숨김 */
  embedded?: boolean
  /** 작업 컨설팅 관리 목업: 요청 내역 카드 숨김 */
  hideRequestSection?: boolean
  /** 작업 인입 상세: 부모 flex 영역의 남는 높이를 카드가 채우도록 함 */
  fillAvailableHeight?: boolean
  /** 본문 최대 너비 (기본 `max-w-[42rem]`) */
  contentMaxWidthClass?: string
}

type MessageChannel = "SMS" | "KAKAO" | "WEB"

export function ConsultingInquiryAdminView({
  project,
  allProjects,
  onUpdateProject,
  onOpenLinkedProject,
  onCreateLinkedProject,
  consultingDetailMode,
  embedded = false,
  hideRequestSection = false,
  fillAvailableHeight = false,
  contentMaxWidthClass = "max-w-[42rem]",
}: ConsultingInquiryAdminViewProps) {
  const difficultyAreas = ["적정 예산 산정", "제작사/대행사 선정"]
  const applicantName = project.client || "—"
  const contactPhone = project.phone || "010-1234-5678"
  const inquiryContent = project.description || "문의 내용이 없습니다."
  const [outcomeKindDraft, setOutcomeKindDraft] = useState<ConsultingOutcomeKind | "">(project.consultingOutcomeKind ?? "")
  const [linkedProjectIdDraft, setLinkedProjectIdDraft] = useState(project.consultingLinkedProjectId ?? "")
  const [matchingInfoDraft, setMatchingInfoDraft] = useState(project.consultingMatchingInfo ?? "")
  const [amountDraft, setAmountDraft] = useState(project.consultingAmount ?? "")
  const [conclusionDraft, setConclusionDraft] = useState(project.consultingConclusion ?? "")
  const [replyDraft, setReplyDraft] = useState(project.consultingAdminReply ?? "")
  const [consultInputTab, setConsultInputTab] = useState<"message">("message")
  const [selectedMessageChannels, setSelectedMessageChannels] = useState<MessageChannel[]>([
    "SMS",
    "KAKAO",
    "WEB",
  ])
  const [quickRegisterDraft, setQuickRegisterDraft] = useState("")
  const [serviceTierDraft, setServiceTierDraft] = useState<ConsultingServiceTier>(() => inferConsultingServiceTier(project))
  const [paymentMethodDraft, setPaymentMethodDraft] = useState(() => project.consultingPaymentMethod ?? "무통장 입금 (세금계산서)")
  const [consultValidationError, setConsultValidationError] = useState("")

  const isAdmin = consultingDetailMode === "admin"
  const isComplete = isConsultingCompleteStatus(project.status)
  /** 작업 컨설팅 상세: 목업 수준의 시각 마감 */
  const w = hideRequestSection
  const wProgressStep = w ? consultingProgressStepForView(project) : 0
  const wOutcomeBadge = w ? workHeaderOutcomeBadge(project) : ""
  const wReceivedAtLabel = useMemo(() => {
    if (!project.createdAt) return "—"
    try {
      const d = new Date(project.createdAt)
      if (Number.isNaN(d.getTime())) return project.createdAt
      return format(d, "yyyy.MM.dd HH:mm")
    } catch {
      return project.createdAt
    }
  }, [project.createdAt])

  const sortedActivityLog = useMemo(() => {
    const log = project.consultingActivityLog ?? []
    return [...log].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
  }, [project.consultingActivityLog])
  const wForcedActivityLog = useMemo<ConsultingActivityEntry[]>(() => {
    if (!w) return sortedActivityLog
    if (project.status === "PROPOSAL_OPEN") return sortedActivityLog
    const now = Date.now()
    return [
      {
        id: `w-fixed-out-${project.id}`,
        at: new Date(now - 60000).toISOString(),
        kind: "MESSAGE_OUT",
        note: "고객님 부재중으로 안내 문자 발송함.",
      },
      {
        id: `w-fixed-sys-${project.id}`,
        at: new Date(now).toISOString(),
        kind: "WAITING",
        note: "[안내] 안녕하세요, 배정된 담당자 김컨설턴트입니다. 금일 오후 2시에 연락드리겠습니다.",
      },
    ]
  }, [w, project.status, project.id, sortedActivityLog])

  useEffect(() => {
    setOutcomeKindDraft(project.consultingOutcomeKind ?? "")
    setLinkedProjectIdDraft(project.consultingLinkedProjectId ?? "")
    setMatchingInfoDraft(project.consultingMatchingInfo ?? "")
    setAmountDraft(project.consultingAmount ?? "")
    setConclusionDraft(project.consultingConclusion ?? "")
    setReplyDraft(project.consultingAdminReply ?? "")
    setServiceTierDraft(inferConsultingServiceTier(project))
    setPaymentMethodDraft(project.consultingPaymentMethod ?? "무통장 입금 (세금계산서)")
  }, [
    project.id,
    project.consultingOutcomeKind,
    project.consultingLinkedProjectId,
    project.consultingMatchingInfo,
    project.consultingAmount,
    project.consultingConclusion,
    project.consultingAdminReply,
    project.consultingPaymentMethod,
    project.consultingServiceTier,
  ])

  const linkableProjects = allProjects.filter((p) => p.type !== "컨설팅")

  const showLinkedIdField = outcomeKindDraft === "MATCHING_PUBLIC" || outcomeKindDraft === "MATCHING_1TO1"
  const showMatchingInfoField = outcomeKindDraft === "DIRECT_INTRO"

  const withInProgressStatusIfReceipt = (base: Partial<WorkConsultingProject>, nextLogLength: number): Partial<WorkConsultingProject> => {
    if (isConsultingCompleteStatus(project.status)) return base
    if (nextLogLength < 1) return base
    if (project.status !== "PROPOSAL_OPEN") return base
    return { ...base, status: "DRAFT_SUBMITTED" as MainStatus }
  }

  const applyServiceTier = (tier: ConsultingServiceTier) => {
    setServiceTierDraft(tier)
    switch (tier) {
      case "SIMPLE_MATCH":
        setOutcomeKindDraft("SIMPLE_CONSULT")
        setAmountDraft("500,000원")
        break
      case "PROJECT_RUN":
        setOutcomeKindDraft("MATCHING_1TO1")
        setAmountDraft("2,000,000원")
        break
      case "FULLCARE_PT":
        setOutcomeKindDraft("MATCHING_PUBLIC")
        setAmountDraft("5,000,000원")
        break
      case "CUSTOM":
        setOutcomeKindDraft((prev) => (prev ? prev : "DIRECT_INTRO"))
        break
      default:
        break
    }
  }

  const handleQuickRegister = () => {
    if (!isAdmin || isComplete) return
    const text = quickRegisterDraft.trim()
    if (!text) return
    if (consultInputTab === "message" && selectedMessageChannels.length === 0) return
    const kind: ConsultingActivityKind = "MESSAGE_OUT"
    const channelLabels: Record<MessageChannel, string> = {
      SMS: "문자",
      KAKAO: "카톡",
      WEB: "웹메시지",
    }
    const channelPrefix =
      consultInputTab === "message"
        ? `[${selectedMessageChannels.map((ch) => channelLabels[ch]).join(", ")}] `
        : ""

    const entry: ConsultingActivityEntry = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      at: new Date().toISOString(),
      kind,
      note: `${channelPrefix}${text}`,
    }
    const nextLog = [...(project.consultingActivityLog ?? []), entry]
    let patch: Partial<WorkConsultingProject> = { consultingActivityLog: nextLog }
    patch = withInProgressStatusIfReceipt(patch, nextLog.length)
    if (consultInputTab === "message") {
      patch.consultingAdminReply = text
    }
    onUpdateProject(patch)
    setQuickRegisterDraft("")
    setConsultValidationError("")
  }

  const handleSaveReply = () => {
    if (!isAdmin) return
    onUpdateProject({
      consultingAdminReply: replyDraft.trim() || undefined,
    })
  }

  const handleSaveOutcomeAfterComplete = () => {
    if (!isAdmin || !isComplete) return
    onUpdateProject({
      consultingOutcomeKind: outcomeKindDraft || undefined,
      consultingLinkedProjectId: showLinkedIdField ? (linkedProjectIdDraft.trim() || undefined) : undefined,
      consultingMatchingInfo: showMatchingInfoField ? (matchingInfoDraft.trim() || undefined) : undefined,
      consultingAmount: amountDraft.trim() || undefined,
      consultingConclusion: conclusionDraft.trim() || undefined,
      consultingAdminReply: replyDraft.trim() || undefined,
      consultingPaymentMethod: paymentMethodDraft || undefined,
      consultingServiceTier: serviceTierDraft,
    })
  }

  const handleCompleteConsulting = () => {
    if (!isAdmin || isComplete) return
    if (!outcomeKindDraft) return
    const logLen = project.consultingActivityLog?.length ?? 0
    if (logLen < 1) {
      setConsultValidationError("진행 중 상담은 일시·상담반법이 있는 활동 기록이 1건 이상 있어야 완료 처리할 수 있습니다.")
      return
    }
    setConsultValidationError("")
    onUpdateProject({
      status: "COMPLETE",
      consultingOutcomeKind: outcomeKindDraft,
      consultingLinkedProjectId: showLinkedIdField ? (linkedProjectIdDraft.trim() || undefined) : undefined,
      consultingMatchingInfo: showMatchingInfoField ? (matchingInfoDraft.trim() || undefined) : undefined,
      consultingAmount: amountDraft.trim() || undefined,
      consultingConclusion: conclusionDraft.trim() || undefined,
      consultingAdminReply: replyDraft.trim() || undefined,
      consultingPaymentMethod: paymentMethodDraft || undefined,
      consultingServiceTier: serviceTierDraft,
    })
  }

  const quickPlaceholder = "고객에게 발송할 메시지를 입력하세요..."

  const toggleMessageChannel = (channel: MessageChannel) => {
    setSelectedMessageChannels((prev) =>
      prev.includes(channel) ? prev.filter((ch) => ch !== channel) : [...prev, channel],
    )
  }

  const startPhoneConsultRecord = () => {
    if (isComplete) return
    const entry: ConsultingActivityEntry = {
      id: `act-call-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      at: new Date().toISOString(),
      kind: "PHONE",
      note: "전화 상담 시도 (자동 기록)",
    }
    const nextLog = [...(project.consultingActivityLog ?? []), entry]
    let patch: Partial<WorkConsultingProject> = { consultingActivityLog: nextLog }
    patch = withInProgressStatusIfReceipt(patch, nextLog.length)
    onUpdateProject(patch)
  }

  const serviceTierCards: { tier: ConsultingServiceTier; title: string; price: string; desc: string }[] = [
    {
      tier: "SIMPLE_MATCH",
      title: "단순 매칭",
      price: "500,000원~",
      desc: "요구 분석 및 제작사·대행사 리스트업/연결",
    },
    {
      tier: "PROJECT_RUN",
      title: "프로젝트 생성 및 진행",
      price: "2,000,000원~",
      desc: "RFP 제작, 제작사 선정, 일정·산출물 관리",
    },
    {
      tier: "FULLCARE_PT",
      title: "PT까지 도와드림 (풀케어)",
      price: "5,000,000원~",
      desc: "PT 참석, 계약 협상, 최종 검수까지 전 과정 관리",
    },
    {
      tier: "CUSTOM",
      title: "직접 입력 (별도 협의)",
      price: "협의",
      desc: "맞춤 컨설팅 범위 및 금액 산정",
    },
  ]

  const lbl = w
    ? "mb-1.5 block text-sm font-semibold text-slate-700"
    : "mb-1.5 block text-[13px] font-medium text-slate-500"

  /** 참고 목업: rounded-xl shadow-sm border-slate-200 */
  const cardShell = w
    ? "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    : "overflow-hidden rounded-2xl border border-slate-200/90 bg-white"

  const inner = (
    <div
      className={cn(
        "mx-auto pb-2",
        w ? "space-y-6" : "space-y-4",
        contentMaxWidthClass,
        fillAvailableHeight &&
          embedded &&
          "flex h-full min-h-0 min-w-0 flex-1 flex-col",
        fillAvailableHeight && embedded && "mx-0 w-full max-w-none pb-0",
      )}
    >
      {!embedded && (
        <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">[컨설팅] {project.title}</h1>
      )}

      {!hideRequestSection && (
        <div className={cardShell}>
          <div className="border-b border-slate-100 px-5 py-3.5 sm:px-6">
            <h2 className="text-[15px] font-bold text-slate-900">요청 내역</h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm sm:px-6">
            <div className="flex flex-wrap gap-2">
              {difficultyAreas.map((area) => (
                <Badge key={area} variant="secondary" className="border-slate-200 bg-slate-50 font-normal text-slate-700">
                  {area}
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 text-sm">
              <div>
                <span className={lbl}>신청자</span>
                <p className="font-semibold text-slate-900">{applicantName}</p>
              </div>
              <div>
                <span className={lbl}>연락처</span>
                <p className="font-semibold text-slate-900">{contactPhone}</p>
              </div>
            </div>
            <div>
              <span className={lbl}>문의 내용</span>
              <p className="whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 leading-relaxed text-slate-800">{inquiryContent}</p>
            </div>
            {project.attachmentFileNames && project.attachmentFileNames.length > 0 && (
              <div>
                <span className={lbl}>첨부</span>
                <ul className="list-inside list-disc text-slate-800 marker:text-slate-400">
                  {project.attachmentFileNames.map((name, idx) => (
                    <li key={`${name}-${idx}`}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={cn(
          cardShell,
          w &&
            (fillAvailableHeight
              ? "flex min-h-0 flex-1 flex-col overflow-hidden"
              : "flex max-h-[min(72vh,680px)] min-h-0 flex-col overflow-hidden"),
        )}
      >
        {w ? (
          <>
            {/* 목업: 상단 — 의뢰사·연락처(좌) + 진행 스텝·상태(우) */}
            <div className="shrink-0 rounded-t-xl border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-slate-900 sm:gap-x-4">
                  <span className="max-w-[min(100%,280px)] truncate" aria-label={`의뢰사 ${applicantName}`}>
                    {applicantName}
                  </span>
                  <span
                    className="flex min-w-0 items-center gap-1.5 font-medium text-slate-800 tabular-nums"
                    aria-label={`연락처 ${contactPhone}`}
                  >
                    <PhoneCall className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    <span className="truncate">{contactPhone}</span>
                    {!isComplete && (
                      <button
                        type="button"
                        onClick={startPhoneConsultRecord}
                        className="ml-1 shrink-0 rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
                      >
                        전화하기
                      </button>
                    )}
                  </span>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 sm:gap-5">
                  <div
                    className="relative z-0 w-full min-w-[min(100%,260px)] max-w-[300px] sm:w-[280px] sm:shrink-0"
                    aria-label="컨설팅 진행 단계"
                  >
                    {/* 첫·세 번째 스텝 중심을 잇는 트랙 */}
                    <div className="pointer-events-none absolute left-[16.6667%] top-[14px] z-0 h-0.5 w-[66.6667%] rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-200/90 transition-[width] duration-500 ease-out"
                        style={{
                          width: wProgressStep === 0 ? "0%" : wProgressStep === 1 ? "50%" : "100%",
                        }}
                      />
                    </div>
                    <div className="relative z-10 grid grid-cols-3 gap-0">
                      {W_HEADER_STEPS.map((label, idx) => {
                        const isPast = idx < wProgressStep
                        const isCurrent = idx === wProgressStep
                        const isFuture = idx > wProgressStep
                        return (
                          <div key={label} className="flex flex-col items-center gap-1">
                            <span
                              className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors",
                                isFuture && "border-slate-200 bg-white text-slate-300",
                                isPast &&
                                  "border-emerald-200 bg-emerald-100 text-emerald-700 shadow-none",
                                isCurrent &&
                                  "border-emerald-600 bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/35 ring-offset-2 ring-offset-white",
                              )}
                            >
                              {idx + 1}
                            </span>
                            <span
                              className={cn(
                                "w-full px-0.5 text-center text-[10px] font-semibold leading-tight",
                                isFuture && "text-slate-400",
                                isPast && "text-emerald-700/75",
                                isCurrent && "font-bold text-emerald-800",
                              )}
                            >
                              {label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <span className="self-center whitespace-nowrap text-xs font-semibold text-slate-500">
                    {wOutcomeBadge}
                  </span>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50/30 p-4">
              {/* 문의받은 형태: 상담 기록 위에 접수 내용 고정 표시 */}
              <div className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200"
                    aria-hidden
                  >
                    <FileText className="h-4 w-4 text-slate-600" strokeWidth={2} />
                  </div>
                </div>
                <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800">문의 접수</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 tabular-nums">
                      <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {wReceivedAtLabel}
                    </span>
                  </div>
                  <h4 className="mb-2 text-sm font-bold leading-snug text-slate-900">{project.title}</h4>
                  <div className="rounded-md border border-slate-100 bg-slate-50/90 p-3 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                    {inquiryContent}
                  </div>
                  {project.attachmentFileNames && project.attachmentFileNames.length > 0 && (
                    <div className="mt-2 border-t border-slate-100 pt-2">
                      <p className="mb-1 text-[11px] font-medium text-slate-500">첨부</p>
                      <ul className="list-inside list-disc text-xs text-slate-600 marker:text-slate-300">
                        {project.attachmentFileNames.map((name, idx) => (
                          <li key={`${name}-${idx}`}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {wForcedActivityLog.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">아직 기록이 없습니다.</p>
              ) : (
                wForcedActivityLog.map((e) => {
                  const { sender, body } = activitySenderBodyForW(e)
                  const { Icon, wrapClass, iconClass } = consultRefLogVisualW(e)
                  return (
                    <div key={e.id} className="flex gap-3">
                      <div className="mt-1 shrink-0">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full",
                            wrapClass,
                          )}
                        >
                          <Icon className={cn("h-[15px] w-[15px]", iconClass)} strokeWidth={2} aria-hidden />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-800">{sender}</span>
                          <span className="shrink-0 text-xs text-slate-400 tabular-nums">
                            {formatLogTimeRef(e.at)}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{body}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {isAdmin && (
              <div className="shrink-0 rounded-b-xl border-t border-slate-200 bg-white p-4">
                {consultInputTab === "message" && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {([
                      { id: "SMS" as const, label: "문자" },
                      { id: "KAKAO" as const, label: "카톡" },
                      { id: "WEB" as const, label: "웹메시지" },
                    ] as const).map((channel) => (
                      <button
                        key={channel.id}
                        type="button"
                        disabled={isComplete}
                        onClick={() => toggleMessageChannel(channel.id)}
                        className={cn(
                          "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                          selectedMessageChannels.includes(channel.id)
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                          isComplete && "cursor-not-allowed opacity-50",
                        )}
                      >
                        {selectedMessageChannels.includes(channel.id) && (
                          <Check className="mr-1 inline h-3 w-3" aria-hidden />
                        )}
                        {channel.label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <textarea
                    disabled={isComplete}
                    className="min-h-[80px] flex-1 resize-none rounded-md border border-slate-300 p-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder={isComplete ? "상담 완료 건에서는 새 기록을 등록할 수 없습니다." : quickPlaceholder}
                    value={quickRegisterDraft}
                    onChange={(ev) => setQuickRegisterDraft(ev.target.value)}
                  />
                  <button
                    type="button"
                    disabled={
                      isComplete ||
                      !quickRegisterDraft.trim() ||
                      (consultInputTab === "message" && selectedMessageChannels.length === 0)
                    }
                    className="flex flex-col items-center justify-center gap-1 rounded-md bg-emerald-600 px-4 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleQuickRegister}
                  >
                    <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
                    <span className="text-xs font-medium">보내기</span>
                  </button>
                </div>
                {isComplete && (
                  <p className="mt-3 text-center text-xs text-slate-400">
                    완료된 상담은 기록만 조회할 수 있습니다.
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm" aria-hidden>
                <MessageCircle className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <h2 className="text-[17px] font-bold text-slate-900">상담 기록 및 연락</h2>
              </div>
            </div>

            <div>
              {sortedActivityLog.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-slate-500 sm:px-6">아직 기록이 없습니다.</div>
              ) : (
                sortedActivityLog.map((e, idx) => {
                  const { Icon, sender, body, iconWrapClass, iconClass } = activityRowVisual(e)
                  return (
                    <div
                      key={e.id}
                      className={cn(
                        "flex gap-4 px-5 py-4 sm:px-6",
                        idx < sortedActivityLog.length - 1 && "border-b border-slate-100/90",
                      )}
                    >
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", iconWrapClass)}>
                        <Icon className={cn("h-[18px] w-[18px]", iconClass)} strokeWidth={2} aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-sm font-semibold text-slate-900">{sender}</span>
                          <time className="shrink-0 text-xs tabular-nums text-slate-400">{formatActivityShortKo(e.at)}</time>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{body}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {isAdmin && (
              <div className="border-t border-slate-100 bg-white px-5 py-5 sm:px-6">
                <div className="space-y-3">
                  <div>
                    <span className={lbl}>고객 안내(답변) 직접 수정</span>
                    <textarea
                      className="mt-2 min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-none placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                      placeholder="메시지 발송 외에 안내만 덧붙일 때"
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                    />
                    <Button type="button" variant="outline" size="sm" className="mt-2 rounded-lg border-slate-200" onClick={handleSaveReply}>
                      안내만 저장
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {isAdmin && !isComplete && (
              <div className="border-t border-slate-200 bg-white px-5 py-5 sm:px-6">
                {consultInputTab === "message" && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {([
                      { id: "SMS" as const, label: "문자" },
                      { id: "KAKAO" as const, label: "카톡" },
                      { id: "WEB" as const, label: "웹메시지" },
                    ] as const).map((channel) => (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => toggleMessageChannel(channel.id)}
                        className={cn(
                          "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                          selectedMessageChannels.includes(channel.id)
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                        )}
                      >
                        {selectedMessageChannels.includes(channel.id) && (
                          <Check className="mr-1 inline h-3 w-3" aria-hidden />
                        )}
                        {channel.label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  <textarea
                    className="min-h-[132px] flex-1 resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/25"
                    placeholder={quickPlaceholder}
                    value={quickRegisterDraft}
                    onChange={(ev) => setQuickRegisterDraft(ev.target.value)}
                  />
                  <Button
                    type="button"
                    disabled={consultInputTab === "message" && selectedMessageChannels.length === 0}
                    className="h-auto min-h-[132px] w-[4.5rem] shrink-0 flex-col gap-2 rounded-xl bg-emerald-600 px-2 text-sm font-semibold text-white shadow-none hover:bg-emerald-700"
                    onClick={handleQuickRegister}
                  >
                    <Send className="h-4 w-4" aria-hidden />
                    보내기
                  </Button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  「메시지 발송」으로 등록하면 고객 안내(답변)에도 같은 내용이 반영됩니다.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className={cardShell}>
        <div
          className={cn(
            "border-b",
            w ? "border-slate-200 bg-slate-50/50 p-4" : "border-slate-100 px-5 py-4 sm:px-6",
          )}
        >
          {w ? (
            <>
              <h3 className="flex items-center gap-2 font-bold text-slate-800">
                <Briefcase className="h-5 w-5 text-blue-600" strokeWidth={2} aria-hidden />
                컨설팅 결과 및 프로젝트 등록
              </h3>
              <p className="ml-7 mt-1 text-xs text-slate-500">상담 결과를 바탕으로 새 프로젝트를 생성하고 관리합니다.</p>
            </>
          ) : (
            <div className="flex items-start gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm"
                aria-hidden
              >
                <Briefcase className="h-5 w-5" strokeWidth={2} />
              </span>
              <div className="min-w-0 pt-0.5">
                <h2 className="text-[17px] font-bold leading-snug text-slate-900">컨설팅 결과 및 프로젝트 등록</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  상담 결과를 바탕으로 새 프로젝트를 생성하고 관리합니다.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={cn(w ? "space-y-5 p-6" : "space-y-6 px-5 py-6 sm:px-6")}>
          {isAdmin && (
            <div>
              <label className={cn(w ? "mb-2 block text-sm font-medium text-slate-700" : lbl)}>
                컨설팅 서비스 유형 <span className="text-red-500">*</span>
              </label>
              <div className={cn("grid grid-cols-1 gap-3", w ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
                {serviceTierCards.map((card) => (
                  <button
                    key={card.tier}
                    type="button"
                    onClick={() => applyServiceTier(card.tier)}
                    className={cn(
                      "cursor-pointer border text-left transition-all",
                      w
                        ? cn(
                            "rounded-lg p-3",
                            serviceTierDraft === card.tier
                              ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50",
                          )
                        : cn(
                            "rounded-2xl border-2 p-4 duration-200",
                            serviceTierDraft === card.tier
                              ? "border-blue-500 bg-blue-50/60 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]"
                              : "border-slate-200 bg-white hover:border-slate-300",
                          ),
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-start justify-between gap-2",
                        w ? "mb-1" : "min-w-0 items-baseline gap-3",
                      )}
                    >
                      <span
                        className={cn(
                          "font-semibold text-slate-900",
                          w ? "text-sm" : "min-w-0 flex-1 truncate text-[15px] font-bold",
                        )}
                      >
                        {card.title}
                      </span>
                      {card.tier !== "CUSTOM" && (
                        <span
                          className={cn(
                            "shrink-0 whitespace-nowrap font-bold text-blue-600",
                            w ? "text-xs" : "text-sm",
                          )}
                        >
                          {card.price}
                        </span>
                      )}
                    </div>
                    {w ? (
                      <p className="text-xs text-slate-500">{card.desc}</p>
                    ) : (
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">{card.desc}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isAdmin && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-700">
              <span className="text-slate-500">요금제 </span>
              <span className="font-semibold text-slate-900">
                {serviceTierCards.find((c) => c.tier === (project.consultingServiceTier ?? inferConsultingServiceTier(project)))?.title ?? "—"}
              </span>
              {project.consultingOutcomeKind && (
                <>
                  <span className="mx-1.5 text-slate-400">·</span>
                  <span>{consultingOutcomeKindLabel(project.consultingOutcomeKind)}</span>
                </>
              )}
            </div>
          )}

          {isAdmin && serviceTierDraft !== "SIMPLE_MATCH" && (
            <div>
              <span className={lbl}>결과 유형 (직접)</span>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={outcomeKindDraft || "__NONE__"} onValueChange={(v) => setOutcomeKindDraft(v === "__NONE__" ? "" : (v as ConsultingOutcomeKind))}>
                  <SelectTrigger className="h-10 min-w-[240px] max-w-md rounded-xl border-slate-200">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__NONE__">선택</SelectItem>
                    <SelectItem value="MATCHING_PUBLIC">공고 진행</SelectItem>
                    <SelectItem value="MATCHING_1TO1">1:1 매칭 진행</SelectItem>
                    <SelectItem value="DIRECT_INTRO">직접 소개</SelectItem>
                    <SelectItem value="SIMPLE_CONSULT">단순상담</SelectItem>
                  </SelectContent>
                </Select>
                {showLinkedIdField && (
                  <>
                    <ProjectButton
                      type="button"
                      variant="white"
                      className="!w-auto !rounded-md !px-3 !py-2 !text-sm !font-medium"
                      onClick={() => linkedProjectIdDraft && onOpenLinkedProject(linkedProjectIdDraft)}
                    >
                      열기
                    </ProjectButton>
                    <Button
                      type="button"
                      className="h-9 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"
                      disabled={isComplete}
                      onClick={() => {
                        const targetType = outcomeKindDraft === "MATCHING_PUBLIC" ? "공고" : "1:1"
                        const createdId = onCreateLinkedProject(targetType)
                        if (createdId) setLinkedProjectIdDraft(createdId)
                      }}
                    >
                      신규 등록
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          <div>
            <label className={cn(w ? "mb-1 block text-sm font-medium text-slate-700" : lbl)}>
              상세 컨설팅/프로젝트 범위 {w ? <span className="text-red-500">*</span> : <span className="text-destructive">*</span>}
            </label>
            {isAdmin ? (
              <textarea
                className={cn(
                  "mt-2 min-h-[108px] w-full border bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none",
                  w
                    ? "min-h-[80px] rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    : "rounded-xl border-slate-200 shadow-none focus-visible:ring-2 focus-visible:ring-blue-500/20",
                )}
                placeholder={
                  hideRequestSection
                    ? "예: 브랜드 필름 1편 (30초), 숏폼 3편 기획 및 제작 총괄"
                    : "예: 브랜드 필름 1편(30초), 숏폼 3편 기획 및 제작 총괄"
                }
                value={conclusionDraft}
                onChange={(e) => setConclusionDraft(e.target.value)}
              />
            ) : (
              <p className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-800">
                {project.consultingConclusion?.trim() || "—"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <div>
              <label className={cn(w ? "mb-1 block text-sm font-medium text-slate-700" : lbl)}>
                예상/확정 금액 (VAT 별도) {w ? <span className="text-red-500">*</span> : <span className="text-destructive">*</span>}
              </label>
              {isAdmin ? (
                w ? (
                  <div className="relative mt-2">
                    <Input
                      className="h-auto border-slate-300 py-3 pr-10 text-right font-mono text-sm shadow-sm focus-visible:ring-blue-500"
                      placeholder="0"
                      value={amountDraft}
                      onChange={(e) => setAmountDraft(e.target.value)}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">원</span>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      className="h-10 rounded-xl border-slate-200 font-mono text-sm"
                      placeholder="0"
                      value={amountDraft}
                      onChange={(e) => setAmountDraft(e.target.value)}
                    />
                    <span className="text-sm font-medium text-slate-500">원</span>
                  </div>
                )
              ) : (
                <p className="mt-2 text-sm font-semibold text-slate-900">{project.consultingAmount?.trim() || "—"}</p>
              )}
            </div>
            <div>
              <label className={cn(w ? "mb-1 block text-sm font-medium text-slate-700" : lbl)}>비용 결제 방법</label>
              {isAdmin ? (
                <Select value={paymentMethodDraft} onValueChange={setPaymentMethodDraft}>
                  <SelectTrigger
                    className={cn(
                      "mt-2",
                      w
                        ? "relative h-auto rounded-md border-slate-300 py-3 pl-10 shadow-sm focus:ring-1 focus:ring-blue-500"
                        : "h-10 rounded-xl border-slate-200",
                    )}
                  >
                    {w ? (
                      <>
                        <CreditCard
                          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                          aria-hidden
                        />
                        <SelectValue />
                      </>
                    ) : (
                      <div className="flex w-full min-w-0 items-center gap-2">
                        <Banknote className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                        <SelectValue />
                      </div>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="무통장 입금 (세금계산서)">무통장 입금 (세금계산서)</SelectItem>
                    <SelectItem value="카드 결제">카드 결제</SelectItem>
                    <SelectItem value="기타 (별도 협의)">기타 (별도 협의)</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-2 text-sm">{project.consultingPaymentMethod ?? "—"}</p>
              )}
            </div>
          </div>

          {showLinkedIdField && (!isAdmin || project.consultingLinkedProjectId) && (
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <p className="text-sm font-bold text-slate-900">연계 프로젝트</p>
              {!isAdmin ? (
                <p className="font-mono text-sm">{project.consultingLinkedProjectId ?? "—"}</p>
              ) : null}
            </div>
          )}

          {showMatchingInfoField && (isAdmin || project.consultingMatchingInfo?.trim()) && (
            <div className="border-t border-slate-100 pt-5">
              <span className={lbl}>매칭정보</span>
              {isAdmin ? (
                <textarea
                  className="mt-2 min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  placeholder="직접 소개 시 매칭 내용"
                  value={matchingInfoDraft}
                  onChange={(e) => setMatchingInfoDraft(e.target.value)}
                />
              ) : (
                <p className="whitespace-pre-wrap text-sm">{project.consultingMatchingInfo?.trim() || "—"}</p>
              )}
            </div>
          )}

          {isAdmin && consultValidationError && (
            <p className="text-sm text-destructive" role="alert">
              {consultValidationError}
            </p>
          )}

          {isAdmin && !isComplete && (
            <>
              <Button
                type="button"
                className={cn(
                  "w-full gap-2 font-semibold text-white shadow-sm",
                  "h-12 rounded-lg bg-blue-600 text-[15px] hover:bg-blue-700",
                )}
                disabled={!outcomeKindDraft || (project.consultingActivityLog?.length ?? 0) < 1}
                title={
                  (project.consultingActivityLog?.length ?? 0) < 1
                    ? "상담 기록을 1건 이상 등록하세요."
                    : !outcomeKindDraft
                      ? "티어 또는 결과 유형을 선택하세요."
                      : undefined
                }
                onClick={handleCompleteConsulting}
              >
                <Plus className="h-4 w-4" aria-hidden />
                저장하기
              </Button>
              <p
                className={cn(
                  "mx-auto max-w-lg px-1 text-center leading-relaxed text-slate-500",
                  w ? "text-[13px]" : "text-xs",
                )}
              >
                프로젝트를 등록하면 상태가 자동으로 &apos;프로젝트 전환&apos;으로 변경되며, 고객에게 알림이 발송됩니다.
              </p>
            </>
          )}

          {isAdmin && isComplete && (
            <Button type="button" className="h-11 w-full rounded-xl bg-blue-600 text-[15px] font-semibold shadow-none hover:bg-blue-700" onClick={handleSaveOutcomeAfterComplete}>
              결과·답변 저장
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  if (embedded) {
    return (
      <div
        className={cn(
          fillAvailableHeight
            ? "flex h-full min-h-0 min-w-0 flex-1 flex-col"
            : "pb-2",
        )}
      >
        {inner}
      </div>
    )
  }

  return <div className="-mx-1 rounded-2xl bg-[#eef0f4] p-4 sm:-mx-2 sm:p-5">{inner}</div>
}
