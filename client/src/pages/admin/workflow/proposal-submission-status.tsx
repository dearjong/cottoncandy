/**
 * 제안서·시안 제출현황 — OT/PT 참여현황과 동일한 그리드 + 점(제출/미제출)
 * 데이터는 /work/project/proposal 과 proposalSubmissionMock 공유
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
import {
  MOCK_PROPOSAL_SUBMISSION_PROJECTS,
  MOCK_PROPOSAL_SUBMISSION_ROWS,
  PROPOSAL_SUBMISSION_FIELD_COLUMNS,
  type ProposalSubmissionRow,
} from "@/data/proposalSubmissionMock"

function SubmitDotCell({ submitted }: { submitted: boolean }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span
        className={cn(
          "inline-flex h-2 w-2 rounded-full shrink-0",
          submitted ? "bg-emerald-500" : "bg-gray-300"
        )}
      />
      <span className="text-muted-foreground truncate">
        {submitted ? "제출" : "미제출"}
      </span>
    </div>
  )
}

function fieldSubmitted(row: ProposalSubmissionRow, key: (typeof PROPOSAL_SUBMISSION_FIELD_COLUMNS)[number]["key"]): boolean {
  const v = row[key]
  return typeof v === "number" && v > 0
}

interface WorkflowProposalSubmissionStatusProps {
  embedded?: boolean
}

export default function WorkflowProposalSubmissionStatus({
  embedded = false,
}: WorkflowProposalSubmissionStatusProps) {
  const [projectId, setProjectId] = useState(MOCK_PROPOSAL_SUBMISSION_PROJECTS[0].id)

  const isEmbedFromQuery =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embed") === "1"
  const isEmbed = embedded || isEmbedFromQuery

  const gridTemplate =
    "grid-cols-[minmax(140px,1.2fr)_minmax(88px,0.75fr)_repeat(6,minmax(72px,0.65fr))]"

  return (
    <div className="space-y-5 p-6">
      {!isEmbed && (
        <AdminWorkflowHeader
          title="제안서·시안 (제출현황)"
          description="사용자 제안 화면(/work/project/proposal)과 동일 목업 기준으로 항목별 제출 여부만 표시합니다."
          right={
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="w-full max-w-xl">
                <SelectValue placeholder="프로젝트 선택" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PROPOSAL_SUBMISSION_PROJECTS.map((p) => (
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
            gridTemplate
          )}
        >
          <div>기업명</div>
          <div>확정일</div>
          {PROPOSAL_SUBMISSION_FIELD_COLUMNS.map((col) => (
            <div key={col.key} className="min-w-0 leading-tight">
              <span className="block truncate" title={col.label}>
                {col.label}
              </span>
            </div>
          ))}
        </div>
        <div>
          {MOCK_PROPOSAL_SUBMISSION_ROWS.map((row) => (
            <div
              key={row.id}
              className={cn(
                "grid gap-3 px-5 py-4 text-sm items-center border-b border-border last:border-b-0",
                gridTemplate
              )}
            >
              <div className="min-w-0">
                <div className="font-medium text-foreground">{row.companyName}</div>
                {row.versions && row.versions.length > 0 ? (
                  <div className="text-muted-foreground text-xs mt-1 space-y-0.5">
                    {row.versions.map((v) => (
                      <div key={v}>└ {v}</div>
                    ))}
                    {row.confirmed ? (
                      <span className="text-green-600 font-medium">✔ 확정</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="text-muted-foreground tabular-nums whitespace-nowrap">
                {row.submittedAt === "-" ? "—" : row.submittedAt}
              </div>
              {PROPOSAL_SUBMISSION_FIELD_COLUMNS.map((col) => (
                <div key={col.key} className="min-w-0">
                  <SubmitDotCell submitted={fieldSubmitted(row, col.key)} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        상세 열람·다운로드는 <span className="font-medium text-foreground">보안자료</span> 메뉴에서만 가능합니다.
      </p>
    </div>
  )
}
