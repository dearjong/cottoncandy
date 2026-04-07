/**
 * `/work/consulting/inquiries` 전용: `ProjectManagement`의 localOnly와 동일 키·시드로
 * 컨설팅 문의 목록을 읽고 갱신합니다.
 */
import type { MainStatus, VisibilityStatus } from "@/types/project-status"
import type {
  ConsultingActivityEntry,
  ConsultingActivityKind,
  ConsultingOutcomeKind,
} from "@/components/admin/project-management"

export const WORK_CONSULTING_PROJECTS_LS_KEY = "cottoncandy_admin_projects_additions"

/** localStorage additions 배열 한 행(컨설팅·연계 공고/1:1 공용) */
export type StoredWorkProject = {
  id: string
  title: string
  client: string
  partner?: string
  ownerCompanyId?: string
  type: "공고" | "1:1" | "컨설팅"
  status: MainStatus
  visibility: VisibilityStatus
  budget: string
  createdAt: string
  description: string
  phone?: string
  attachmentFileNames?: string[]
  consultingOutcomeKind?: ConsultingOutcomeKind
  consultingLinkedProjectId?: string
  consultingMatchingInfo?: string
  consultingOutcome?: string
  consultingAdminReply?: string
  consultingConclusion?: string
  consultingAmount?: string
  consultingActivityLog?: ConsultingActivityEntry[]
  consultingPaymentMethod?: string
  consultingServiceTier?: import("@/components/admin/project-management").ConsultingServiceTier
  productionBudget?: string
  totalBudget?: string
}

export type WorkConsultingProject = StoredWorkProject & { type: "컨설팅" }

function isConsultingCompleteStatus(status: MainStatus): boolean {
  return status === "COMPLETE" || status === "ADMIN_CONFIRMED" || status === "AFTER_SERVICE"
}

function buildMockActivityLogForActiveConsulting(projectId: string, now = Date.now()): ConsultingActivityEntry[] {
  return [
    {
      id: `act-mig-out-${projectId}`,
      at: new Date(now - 60000).toISOString(),
      kind: "MESSAGE_OUT",
      note: "고객님 부재중으로 안내 문자 발송함.",
    },
    {
      id: `act-mig-sys-${projectId}`,
      at: new Date(now).toISOString(),
      kind: "WAITING",
      note: "[안내] 안녕하세요, 배정된 담당자 김컨설턴트입니다. 금일 오후 2시에 연락드리겠습니다.",
    },
  ]
}

function isTargetMockMessagePair(log?: ConsultingActivityEntry[]): boolean {
  if (!log || log.length !== 2) return false
  const first = log[0]?.note?.trim() ?? ""
  const second = log[1]?.note?.trim() ?? ""
  return (
    first === "고객님 부재중으로 안내 문자 발송함." &&
    second === "[안내] 안녕하세요, 배정된 담당자 김컨설턴트입니다. 금일 오후 2시에 연락드리겠습니다."
  )
}

function hasLegacyMockCorrectionLog(log?: ConsultingActivityEntry[]): boolean {
  if (!log || log.length === 0) return false
  return log.some((entry) => (entry.note ?? "").includes("목업 보정: 진행중 건에 상담 활동이 없어 추가되었습니다."))
}

function readRaw(): StoredWorkProject[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(WORK_CONSULTING_PROJECTS_LS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((p: unknown) => p && typeof (p as StoredWorkProject).id === "string") as StoredWorkProject[]
  } catch {
    return []
  }
}

function writeAll(list: StoredWorkProject[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(WORK_CONSULTING_PROJECTS_LS_KEY, JSON.stringify(list))
}

/** localOnly와 동일 시드·마이그레이션 */
export function loadAllStoredWorkProjects(): StoredWorkProject[] {
  if (typeof window === "undefined") return []
  loadWorkConsultingProjects()
  return readRaw()
}

export function loadWorkConsultingProjects(): WorkConsultingProject[] {
  if (typeof window === "undefined") return []
  let additions = readRaw()

  if (additions.length === 0) {
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
    const outcomePool: ConsultingOutcomeKind[] = ["SIMPLE_CONSULT", "MATCHING_PUBLIC", "MATCHING_1TO1", "DIRECT_INTRO"]
    const activityKinds: ConsultingActivityKind[] = ["PHONE", "MESSAGE_OUT", "WAITING", "MESSAGE_IN", "NOTE"]

    additions = Array.from({ length: 10 }).map((_, i) => {
      const idx = i % statusPool.length
      const status = statusPool[idx]
      const kind =
        status === "COMPLETE" || status === "ADMIN_CONFIRMED" || status === "AFTER_SERVICE"
          ? outcomePool[i % outcomePool.length]
          : undefined
      const phoneLast = String(10 + i).padStart(2, "0")
      const phone = `010-1234-${phoneLast}`
      const attachmentFileNames = i % 3 === 0 ? [`샘플_첨부_${i + 1}.pdf`, `참고_자료_${i + 1}.png`] : []
      const linkedProjectId = kind === "MATCHING_PUBLIC" ? "PID-20240520-0009" : kind === "MATCHING_1TO1" ? "PID-20240607-0006" : undefined
      const matchingInfo = kind === "DIRECT_INTRO" ? `TVCF 전문 제작사 ${i + 1}차 매칭 (솜사탕애드)` : undefined
      const isDone = isConsultingCompleteStatus(status)
      const isReceiptOnly = status === "PROPOSAL_OPEN"
      const consultingActivityLog: ConsultingActivityEntry[] | undefined =
        isReceiptOnly ? undefined : buildMockActivityLogForActiveConsulting(`seed-${i}`, now - i * 60000)

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
    writeAll(additions)
  } else {
    let dirty = false
    additions = additions.map((p) => {
      if (p.type !== "컨설팅") return p
      let next = p
      if (p.id === "PRJ-CONS-DUMMY-2" && p.client === "더미 의뢰사 2") {
        next = { ...p, client: "(주)오리온" }
        dirty = true
      }
      const isDone = isConsultingCompleteStatus(next.status)
      const isInProgress = !isDone && next.status !== "PROPOSAL_OPEN"
      if ((isDone || isInProgress) && !isTargetMockMessagePair(next.consultingActivityLog)) {
        dirty = true
        return {
          ...next,
          consultingActivityLog: buildMockActivityLogForActiveConsulting(next.id),
        }
      }
      if ((next.consultingActivityLog?.length ?? 0) > 0) return next
      if (!isDone && !isInProgress) return next
      dirty = true
      return {
        ...next,
        consultingActivityLog: buildMockActivityLogForActiveConsulting(next.id),
      }
    })
    if (dirty) writeAll(additions)
  }

  return additions.filter((p): p is WorkConsultingProject => p.type === "컨설팅")
}

export function upsertWorkConsultingProject(next: StoredWorkProject) {
  const all = readRaw()
  const map = new Map<string, StoredWorkProject>()
  all.forEach((p) => map.set(p.id, p))
  map.set(next.id, next)
  writeAll(Array.from(map.values()))
}

export function createLinkedProjectForConsulting(
  selected: WorkConsultingProject,
  targetType: "공고" | "1:1",
): string {
  const stamp = Date.now().toString().slice(-6)
  const newId = `PRJ-LINK-${stamp}`
  const nextProject: StoredWorkProject = {
    id: newId,
    title: `[연결] ${selected.title}`,
    client: selected.client,
    type: targetType,
    status: "PROPOSAL_OPEN",
    visibility: "PUBLIC",
    budget: selected.consultingAmount || selected.budget || "미정",
    createdAt: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
    description: `컨설팅 ${selected.id}에서 생성된 연계 프로젝트`,
    productionBudget: selected.consultingAmount,
    totalBudget: selected.consultingAmount,
  }
  upsertWorkConsultingProject(nextProject)
  return newId
}
