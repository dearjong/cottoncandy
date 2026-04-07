/**
 * 절차별: 참여현황 — 관리자 화면
 * 첫 줄만 원본 텍스트 유지, 나머지는 Select·탭·필터·커스텀 카드 구조
 */
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { AdminWorkflowHeader } from "@/components/admin/workflow/AdminWorkflowHeader"

type StageKey = "APPLY" | "OT" | "PT1" | "PT2" | "FINAL"

const STAGE_TABS: { key: StageKey; label: string }[] = [
  { key: "APPLY", label: "참여신청" },
  { key: "OT", label: "OT" },
  { key: "PT1", label: "PT1" },
  { key: "PT2", label: "PT2" },
  { key: "FINAL", label: "최종선정" },
]

interface Participant {
  id: string
  companyName: string
  stage: StageKey
  appliedAt: string
  inviteStatus: "초대" | "미초대"
  otAssigned?: boolean
  otCompleted?: boolean
}

const MOCK_PROJECTS = [
  { id: "PID-20240615-0001", clientName: "베스트전자", title: "TV 신제품 판매촉진 프로모션" },
  { id: "PID-20240614-0001", clientName: "(주)테크브랜드", title: "브랜드 홍보 영상 제작" },
]

const MOCK_PARTICIPANTS: Participant[] = [
  // 참여신청 단계 (5개)
  {
    id: "APPLY-1",
    companyName: "VEGA",
    stage: "APPLY",
    appliedAt: "2025.01.15",
    inviteStatus: "초대",
  },
  {
    id: "APPLY-2",
    companyName: "솜사탕애드",
    stage: "APPLY",
    appliedAt: "2025.01.14",
    inviteStatus: "초대",
  },
  {
    id: "APPLY-3",
    companyName: "크리에이티브랩",
    stage: "APPLY",
    appliedAt: "2025.01.13",
    inviteStatus: "미초대",
  },
  {
    id: "APPLY-4",
    companyName: "미디어웍스",
    stage: "APPLY",
    appliedAt: "2025.01.12",
    inviteStatus: "미초대",
  },
  {
    id: "APPLY-5",
    companyName: "디지털플러스",
    stage: "APPLY",
    appliedAt: "2025.01.11",
    inviteStatus: "미초대",
  },

  // OT 단계 (4개)
  {
    id: "OT-1",
    companyName: "VEGA",
    stage: "OT",
    appliedAt: "2025.01.20",
    inviteStatus: "초대",
    otAssigned: true,
    otCompleted: true,
  },
  {
    id: "OT-2",
    companyName: "솜사탕애드",
    stage: "OT",
    appliedAt: "2025.01.20",
    inviteStatus: "초대",
    otAssigned: true,
    otCompleted: false,
  },
  {
    id: "OT-3",
    companyName: "이노션",
    stage: "OT",
    appliedAt: "2025.01.20",
    inviteStatus: "미초대",
    otAssigned: false,
    otCompleted: false,
  },
  {
    id: "OT-4",
    companyName: "크리에이티브랩",
    stage: "OT",
    appliedAt: "2025.01.19",
    inviteStatus: "미초대",
    otAssigned: false,
    otCompleted: false,
  },

  // PT1 단계 (3개)
  {
    id: "PT1-1",
    companyName: "VEGA",
    stage: "PT1",
    appliedAt: "2025.01.25",
    inviteStatus: "초대",
  },
  {
    id: "PT1-2",
    companyName: "솜사탕애드",
    stage: "PT1",
    appliedAt: "2025.01.25",
    inviteStatus: "초대",
  },
  {
    id: "PT1-3",
    companyName: "이노션",
    stage: "PT1",
    appliedAt: "2025.01.24",
    inviteStatus: "미초대",
  },

  // PT2 단계 (2개)
  {
    id: "PT2-1",
    companyName: "VEGA",
    stage: "PT2",
    appliedAt: "2025.02.01",
    inviteStatus: "초대",
  },
  {
    id: "PT2-2",
    companyName: "솜사탕애드",
    stage: "PT2",
    appliedAt: "2025.02.01",
    inviteStatus: "미초대",
  },

  // 최종선정 단계 (1개)
  {
    id: "FINAL-1",
    companyName: "VEGA",
    stage: "FINAL",
    appliedAt: "2025.02.10",
    inviteStatus: "초대",
  },
]

const STAGE_COUNTS: Record<StageKey, number> = MOCK_PARTICIPANTS.reduce(
  (acc, p) => {
    acc[p.stage] += 1
    return acc
  },
  { APPLY: 0, OT: 0, PT1: 0, PT2: 0, FINAL: 0 } as Record<StageKey, number>
)

interface WorkflowMatchingPageProps {
  /** embed 모드: 상단 헤더/프로젝트 셀렉트 숨김 */
  embedded?: boolean
  /** embed 모드에서 외부에서 단계 제어 (APPLY/OT...) */
  stage?: StageKey
}

export default function WorkflowMatchingPage({ embedded = false, stage }: WorkflowMatchingPageProps) {
  const [location] = useLocation()
  const [selectedProjectId, setSelectedProjectId] = useState(MOCK_PROJECTS[0].id)
  const parseStage = (raw: string | null): StageKey | null => {
    if (!raw) return null
    const allowed: StageKey[] = ["APPLY", "OT", "PT1", "PT2", "FINAL"]
    return allowed.includes(raw as StageKey) ? (raw as StageKey) : null
  }

  const getStageFromLocation = (loc: string) => {
    const query = loc.includes("?") ? loc.split("?")[1] : ""
    return parseStage(new URLSearchParams(query).get("stage"))
  }

  const [activeStage, setActiveStage] = useState<StageKey>(() => {
    if (embedded) {
      // 상세 화면 내 embed 모드에서는 외부 stage 우선, 없으면 '참여신청'
      return stage ?? "APPLY"
    }
    // 단독 페이지에서는 URL의 stage 쿼리 우선
    const fromWindow =
      typeof window !== "undefined"
        ? parseStage(new URLSearchParams(window.location.search).get("stage"))
        : null
    return fromWindow ?? getStageFromLocation(location) ?? "OT"
  })
  const [sortOrder, setSortOrder] = useState("registered")
  const [inProgress, setInProgress] = useState(false)
  const [includeEnded, setIncludeEnded] = useState(false)

  useEffect(() => {
    if (embedded) {
      if (stage) setActiveStage(stage)
      return
    }
    const s = getStageFromLocation(location)
    if (s) setActiveStage(s)
  }, [location, embedded, stage])

  const participants = useMemo(() => {
    return MOCK_PARTICIPANTS.filter((p) => activeStage === p.stage)
  }, [activeStage])

  const isEmbedFromQuery =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embed") === "1"
  const isEmbed = embedded || isEmbedFromQuery

  return (
    <div className="space-y-5 p-6">
      {!isEmbed && (
        <>
          <AdminWorkflowHeader title="참여현황" />
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="h-10 w-full max-w-2xl rounded-md border border-input bg-muted/30 px-3 text-sm font-medium">
              <SelectValue placeholder="프로젝트 선택" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_PROJECTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  [{p.clientName}] {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}

      {/* 단계 탭 + 필터 한 줄 (단독 페이지에서만 노출) */}
      {!isEmbed && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border pb-0">
          <div className="flex gap-0">
            {STAGE_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveStage(tab.key)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  activeStage === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label} ({STAGE_COUNTS[tab.key]})
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="ml-auto">AI 추천기업 (2) | 관심기업 (2)</span>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-8 w-[100px] border-input text-muted-foreground text-sm font-normal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registered">등록순</SelectItem>
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={inProgress} onCheckedChange={(v) => setInProgress(!!v)} />
              <span>진행중</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={includeEnded} onCheckedChange={(v) => setIncludeEnded(!!v)} />
              <span>종료/취소 포함</span>
            </label>
          </div>
        </div>
      )}

      {/* 참여 기업 테이블 */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div
          className={cn(
            "grid gap-4 px-5 py-3 text-sm font-medium text-muted-foreground border-b border-border",
            activeStage === "OT" || activeStage === "PT1" || activeStage === "PT2"
              ? "grid-cols-[1.2fr_0.8fr_0.9fr_0.9fr]"
              : "grid-cols-[1.2fr_0.8fr_0.8fr]"
          )}
        >
          <div>기업명</div>
          <div>확정일</div>
          {activeStage === "OT" || activeStage === "PT1" || activeStage === "PT2" ? (
            <>
              <div>{activeStage === "OT" ? "OT참석확정" : "PT참석확정"}</div>
              <div>{activeStage === "OT" ? "OT참석완료" : "PT참석완료"}</div>
            </>
          ) : (
            <div>초대여부</div>
          )}
        </div>
        <div>
          {participants.map((p) => (
            <div
              key={p.id}
              className={cn(
                "grid gap-4 px-5 py-4 text-sm items-center border-b border-border last:border-b-0",
                  activeStage === "OT" || activeStage === "PT1" || activeStage === "PT2"
                  ? "grid-cols-[1.2fr_0.8fr_0.9fr_0.9fr]"
                  : "grid-cols-[1.2fr_0.8fr_0.8fr]"
              )}
            >
              <div className="font-medium text-foreground">{p.companyName}</div>
              <div className="text-muted-foreground">{p.appliedAt}</div>
              {activeStage === "OT" || activeStage === "PT1" || activeStage === "PT2" ? (
                <>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex h-2 w-2 rounded-full",
                          p.otAssigned ? "bg-emerald-500" : "bg-gray-300"
                        )}
                      />
                      <span className="text-muted-foreground">
                        {p.otAssigned ? "확정" : "미확정"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex h-2 w-2 rounded-full",
                          p.otCompleted ? "bg-emerald-500" : "bg-gray-300"
                        )}
                      />
                      <span className="text-muted-foreground">
                        {p.otCompleted ? "완료" : "미완료"}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex h-2 w-2 rounded-full",
                        p.inviteStatus === "초대" ? "bg-emerald-500" : "bg-gray-300"
                      )}
                    />
                    <span className="text-muted-foreground">
                      {p.inviteStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {participants.length === 0 && (
        <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
          해당 단계의 참여 기업이 없습니다.
        </div>
      )}
    </div>
  )
}
