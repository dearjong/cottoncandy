/**
 * 절차별: 제안서/시안 — 운영자 화면 (기업별 제출현황, 건수 표기)
 * 행 데이터는 /work/project/proposal 과 proposalSubmissionMock 공유
 */
import { useState } from "react"
import { useLocation } from "wouter"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdminWorkflowHeader } from "@/components/admin/workflow/AdminWorkflowHeader"
import {
  MOCK_PROPOSAL_SUBMISSION_PROJECTS,
  MOCK_PROPOSAL_SUBMISSION_ROWS,
} from "@/data/proposalSubmissionMock"

type OperatorLogEntry = {
  timestamp: string
  adminId: string
  action: string
}

const OPERATOR_LOGS_BY_ID: Record<string, OperatorLogEntry[]> = {
  "1": [{ timestamp: "2025.01.15 14:30", adminId: "admin1", action: "운영자 열람" }],
  "4": [
    { timestamp: "2025.01.14 11:20", adminId: "admin1", action: "운영자 열람" },
    { timestamp: "2025.01.14 15:45", adminId: "admin2", action: "운영자 열람" },
  ],
}

type SubmissionRow = (typeof MOCK_PROPOSAL_SUBMISSION_ROWS)[number] & {
  operatorLogs?: OperatorLogEntry[]
}

const MOCK_ROWS: SubmissionRow[] = MOCK_PROPOSAL_SUBMISSION_ROWS.map((r) => ({
  ...r,
  operatorLogs: OPERATOR_LOGS_BY_ID[r.id] ?? [],
}))

const COLUMNS = [
  { key: "companyName", label: "업체명", className: "text-left w-64" },
  { key: "strategy", label: "전략제안서", className: "text-center w-28 whitespace-nowrap" },
  { key: "creative", label: "Creative 제안서", className: "text-center w-32 whitespace-nowrap" },
  { key: "video", label: "영상 시안", className: "text-center w-28 whitespace-nowrap" },
  { key: "image", label: "이미지시안", className: "text-center w-28 whitespace-nowrap" },
  { key: "companyIntro", label: "회사소개서", className: "text-center w-28 whitespace-nowrap" },
  { key: "documents", label: "제출문서", className: "text-center w-28 whitespace-nowrap" },
  { key: "submittedAt", label: "제출일", className: "text-center w-28 whitespace-nowrap" },
  { key: "operatorLog", label: "운영자 로그", className: "text-center w-28 whitespace-nowrap" },
] as const

export default function AdminWorkflowProposal() {
  const [, setLocation] = useLocation()
  const [projectId, setProjectId] = useState("1")
  const isEmbed = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embed") === "1"

  return (
    <div className="space-y-5 p-6">
      {!isEmbed && <AdminWorkflowHeader title="제안서·시안 (제출현황)" />}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        {!isEmbed && (
          <div className="px-6 py-4 border-b border-gray-100">
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
          </div>
        )}

        <div className="px-6 py-3 border-b border-gray-100 bg-muted/30">
          <h2 className="text-sm font-medium text-foreground">기업별 제출현황</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="admin-proposal-submission-table">
            <thead>
              <tr className="border-b border-gray-200 bg-muted/50">
                {COLUMNS.map((col) => (
                  <th key={col.key} className={`py-3 px-3 font-medium text-foreground ${col.className}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_ROWS.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-muted/30 cursor-pointer"
                  onClick={() => setLocation(`/admin/workflow-embed/proposal/view/${row.id}?embed=1`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setLocation(`/admin/workflow-embed/proposal/view/${row.id}?embed=1`)}
                >
                  <td className="py-3 px-3 text-foreground">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{row.companyName}</span>
                      {row.versions?.length ? (
                        <div className="text-muted-foreground text-xs mt-1 space-y-0.5">
                          {row.versions.map((v) => (
                            <div key={v}>└ {v}</div>
                          ))}
                          {row.confirmed ? <span className="text-green-600 font-medium">✔ 확정</span> : null}
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center text-muted-foreground">{row.strategy === 0 ? "-" : row.strategy}</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">{row.creative === 0 ? "-" : row.creative}</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">{row.video === 0 ? "-" : row.video}</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">{row.image === 0 ? "-" : row.image}</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">{row.companyIntro === 0 ? "-" : row.companyIntro}</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">{row.documents === 0 ? "-" : row.documents}</td>
                  <td className="py-3 px-3 text-center text-muted-foreground">{row.submittedAt}</td>
                  <td className="py-3 px-3 text-center">
                    {row.operatorLogs?.length ? (
                      <span
                        className="text-xs text-muted-foreground"
                        title={row.operatorLogs.map((l) => `${l.timestamp} ${l.adminId} ${l.action}`).join("\n")}
                      >
                        {row.operatorLogs[row.operatorLogs.length - 1].timestamp}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
