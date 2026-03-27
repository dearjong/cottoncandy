/**
 * 절차별: 정산
 * 사용자 정산 화면(/work/project/settlement)과 동일 — 금액은 비율(%)만, 계산서는 업로드 여부만
 */
import { AdminWorkflowHeader } from "@/components/admin/workflow/AdminWorkflowHeader"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const MOCK_PROJECTS = [{ id: "1", label: "[베스트전자] TV 신제품 판매촉진 프로모션" }]

interface PaymentRow {
  type: string
  label: string
  dueDate: string
  paidDate: string | null
  amount: number
  receiptUploaded: boolean
}

const MOCK_ROWS: PaymentRow[] = [
  { type: "DOWN", label: "선금", dueDate: "2025.10.15", paidDate: "2025.10.15", amount: 50000000, receiptUploaded: true },
  { type: "INTERMEDIATE", label: "중도금", dueDate: "2025.10.20", paidDate: null, amount: 50000000, receiptUploaded: false },
  { type: "BALANCE", label: "잔금", dueDate: "2025.10.30", paidDate: null, amount: 50000000, receiptUploaded: false },
]

const TOTAL_AMOUNT = MOCK_ROWS.reduce((sum, r) => sum + r.amount, 0)

function formatSharePercent(amount: number) {
  const pct = TOTAL_AMOUNT > 0 ? (amount / TOTAL_AMOUNT) * 100 : 0
  const rounded = Math.round(pct * 10) / 10
  return `${rounded}%`
}

function ReceiptUploadCell({ uploaded }: { uploaded: boolean }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span
        className={cn(
          "inline-flex h-2 w-2 rounded-full shrink-0",
          uploaded ? "bg-emerald-500" : "bg-gray-300"
        )}
      />
      <span className="text-muted-foreground truncate">{uploaded ? "업로드" : "미업로드"}</span>
    </div>
  )
}

export default function WorkflowSettlementPage() {
  const [projectId, setProjectId] = useState("1")
  const isEmbed = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embed") === "1"

  return (
    <div className="space-y-6 p-6">
      {!isEmbed && (
        <AdminWorkflowHeader
          title="정산"
          description="선금·중도금·잔금 등 정산 단계를 관리합니다. 지급 비율은 %로만 표시되며, 계산서는 업로드 여부만 확인할 수 있습니다."
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

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 text-left font-medium text-gray-700">지급단계</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">지급예정일</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">지급완료일</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-700">비율</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">계산서</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ROWS.map((row) => (
                  <tr key={row.type} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-800">{row.label}</td>
                    <td className="py-3 px-4 text-gray-600">{row.dueDate}</td>
                    <td className="py-3 px-4 text-gray-600">{row.paidDate ?? "—"}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-800">{formatSharePercent(row.amount)}</td>
                    <td className="py-3 px-4">
                      <ReceiptUploadCell uploaded={row.receiptUploaded} />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4 text-gray-800">총계</td>
                  <td className="py-3 px-4" />
                  <td className="py-3 px-4" />
                  <td className="py-3 px-4 text-right text-gray-800">100%</td>
                  <td className="py-3 px-4" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="default" className="border-gray-300">
            수행사에 최종 정산 완료 확정요청
          </Button>
          <Button size="default" className="bg-pink-600 hover:bg-pink-700">
            최종 정산 완료 확정
          </Button>
          <Button variant="outline" size="default" className="border-gray-300">
            정산정보 저장
          </Button>
        </div>
      </div>
    </div>
  )
}
