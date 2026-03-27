/**
 * 절차별: 제작/산출물
 * 이 단계는 수행사 1곳만 두고, 사용자 산출물(/work/project/deliverables)의
 * 1차·2차를 "업체명" 칸에 1차/2차로만 표기 (탭 없음). 제출일·제출 여부만 표시.
 */
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { AdminWorkflowHeader } from "@/components/admin/workflow/AdminWorkflowHeader"

type DeliverableStatusRow = {
  id: string
  /** 수행사 1곳 전제: 구분은 1차 / 2차만 업체명 열에 표기 */
  phaseLabel: "1차" | "2차"
  typeLabel: "영상" | "이미지"
  submittedAt: string | null
  /** 제출 처리한 사람 (수행사 담당자 등) */
  submittedByName: string | null
  /** 의뢰사(광고주) 측 수락·확인 담당자 */
  acceptedByName: string | null
}

const MOCK_PROJECTS = [
  { id: "PRJ-001", label: "[베스트전자] TV 신제품 판매촉진 프로모션" },
  { id: "PRJ-002", label: "[(주)테크브랜드] 브랜드 홍보 영상 제작" },
]

/** 단일 수행사 기준, deliverables 화면의 1차·2차 슬롯과 대응 */
const MOCK_DELIVERABLE_ROWS: DeliverableStatusRow[] = [
  {
    id: "1",
    phaseLabel: "1차",
    typeLabel: "영상",
    submittedAt: "2025.10.15",
    submittedByName: "박제작 (솜사탕애드)",
    acceptedByName: "김광고 (베스트전자)",
  },
  {
    id: "2",
    phaseLabel: "2차",
    typeLabel: "영상",
    submittedAt: "2025.10.18",
    submittedByName: "박제작 (솜사탕애드)",
    /** 제출 후 의뢰사 확인·수락 전 */
    acceptedByName: null,
  },
  {
    id: "3",
    phaseLabel: "2차",
    typeLabel: "이미지",
    submittedAt: null,
    submittedByName: null,
    acceptedByName: null,
  },
]

interface WorkflowProductionPageProps {
  embedded?: boolean
}

export default function WorkflowProductionPage({ embedded = false }: WorkflowProductionPageProps) {
  const [projectId, setProjectId] = useState(MOCK_PROJECTS[0].id)

  const isEmbedFromQuery =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embed") === "1"
  const isEmbed = embedded || isEmbedFromQuery

  const rows = [...MOCK_DELIVERABLE_ROWS].sort((a, b) => {
    if (a.phaseLabel !== b.phaseLabel) return a.phaseLabel === "1차" ? -1 : 1
    return a.typeLabel.localeCompare(b.typeLabel, "ko")
  })

  return (
    <div className="space-y-5 p-6">
      {!isEmbed && (
        <AdminWorkflowHeader
          title="제작/산출물"
          description="수행사 1곳 기준으로 1차·2차 산출물의 제출·수락 담당자와 일시를 확인합니다."
          right={
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="w-[320px]">
                <SelectValue placeholder="프로젝트 선택" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PROJECTS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div
          className={cn(
            "grid gap-3 px-5 py-3 text-sm font-medium text-muted-foreground border-b border-border",
            "grid-cols-[minmax(52px,0.45fr)_minmax(48px,0.5fr)_minmax(72px,0.55fr)_minmax(88px,0.75fr)_minmax(100px,1fr)_minmax(100px,1fr)]"
          )}
        >
          <div>업체명</div>
          <div>유형</div>
          <div>제출</div>
          <div>제출일</div>
          <div>제출자</div>
          <div>수락자</div>
        </div>
        <div>
          {rows.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              산출물 슬롯이 없습니다.
            </div>
          ) : (
            rows.map((r) => {
              const submitted = r.submittedAt != null
              const acceptorDisplay = r.acceptedByName ?? "—"
              return (
                <div
                  key={r.id}
                  className="grid gap-3 px-5 py-4 text-sm items-center border-b border-border last:border-b-0 grid-cols-[minmax(52px,0.45fr)_minmax(48px,0.5fr)_minmax(72px,0.55fr)_minmax(88px,0.75fr)_minmax(100px,1fr)_minmax(100px,1fr)]"
                >
                  <div className="font-medium text-foreground">{r.phaseLabel}</div>
                  <div className="text-muted-foreground">{r.typeLabel}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex h-2 w-2 rounded-full shrink-0",
                          submitted ? "bg-emerald-500" : "bg-gray-300"
                        )}
                      />
                      <span className="text-muted-foreground whitespace-nowrap">
                        {submitted ? "제출함" : "미제출"}
                      </span>
                    </div>
                  </div>
                  <div className="text-muted-foreground tabular-nums whitespace-nowrap">
                    {submitted ? r.submittedAt : "—"}
                  </div>
                  <div className="text-muted-foreground min-w-0 break-words">
                    {r.submittedByName ?? "—"}
                  </div>
                  <div className="text-muted-foreground min-w-0 break-words">
                    {acceptorDisplay}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        원본 파일·미리보기는 <span className="font-medium text-foreground">보안자료</span> 메뉴에서만 열람할 수 있습니다.
      </p>
    </div>
  )
}
