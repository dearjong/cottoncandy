/**
 * 계약 & 정산 관리 — 전체 프로젝트의 계약/정산 현황 목록
 */
import { useState, Fragment } from "react"
import { Link } from "wouter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Search, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

/* ─── 타입 ─── */
interface SettlementStage {
  label: string
  dueDate: string
  paidDate: string | null
  receiptUploaded: boolean
}

interface ContractRow {
  id: string
  projectId: string
  projectName: string
  type: "공고" | "1:1"
  client: string
  partner: string
  contractStatus: "미서명" | "확정완료" | "진행중"
  contractDate: string | null
  stages: SettlementStage[]
  settlementStatus: "미완료" | "일부완료" | "완료"
}

/* ─── 목업 데이터 ─── */
const MOCK_ROWS: ContractRow[] = [
  {
    id: "1",
    projectId: "PID-20250721-0001",
    projectName: "[베스트전자] TV 신제품 판매촉진 프로모션",
    type: "공고",
    client: "베스트전자",
    partner: "예쓰커뮤니케이션",
    contractStatus: "확정완료",
    contractDate: "2025.10.12",
    stages: [
      { label: "선금", dueDate: "2025.10.15", paidDate: "2025.10.15", receiptUploaded: true },
      { label: "중도금", dueDate: "2025.10.20", paidDate: null, receiptUploaded: false },
      { label: "잔금", dueDate: "2025.10.30", paidDate: null, receiptUploaded: false },
    ],
    settlementStatus: "일부완료",
  },
  {
    id: "2",
    projectId: "PID-20250615-0002",
    projectName: "[CJ제일제당] 비비고 브랜드 캠페인 영상",
    type: "공고",
    client: "CJ제일제당",
    partner: "솜사탕애드",
    contractStatus: "확정완료",
    contractDate: "2025.09.05",
    stages: [
      { label: "선금", dueDate: "2025.09.10", paidDate: "2025.09.10", receiptUploaded: true },
      { label: "중도금", dueDate: "2025.09.25", paidDate: "2025.09.25", receiptUploaded: true },
      { label: "잔금", dueDate: "2025.10.10", paidDate: "2025.10.10", receiptUploaded: true },
    ],
    settlementStatus: "완료",
  },
  {
    id: "3",
    projectId: "PID-20250801-0003",
    projectName: "[현대자동차] 아이오닉 신규 광고 제작",
    type: "1:1",
    client: "현대자동차",
    partner: "TBWA코리아",
    contractStatus: "진행중",
    contractDate: null,
    stages: [
      { label: "선금", dueDate: "2025.11.01", paidDate: null, receiptUploaded: false },
      { label: "잔금", dueDate: "2025.12.01", paidDate: null, receiptUploaded: false },
    ],
    settlementStatus: "미완료",
  },
  {
    id: "4",
    projectId: "PID-20250902-0004",
    projectName: "[롯데칠성] 칸타타 커피 SNS 콘텐츠",
    type: "1:1",
    client: "롯데칠성",
    partner: "이노션",
    contractStatus: "미서명",
    contractDate: null,
    stages: [
      { label: "선금", dueDate: "2025.11.15", paidDate: null, receiptUploaded: false },
      { label: "잔금", dueDate: "2025.12.20", paidDate: null, receiptUploaded: false },
    ],
    settlementStatus: "미완료",
  },
  {
    id: "5",
    projectId: "PID-20250520-0005",
    projectName: "[삼성전자] 갤럭시 버즈 라이브 캠페인",
    type: "공고",
    client: "삼성전자",
    partner: "제일기획",
    contractStatus: "확정완료",
    contractDate: "2025.07.01",
    stages: [
      { label: "선금", dueDate: "2025.07.05", paidDate: "2025.07.05", receiptUploaded: true },
      { label: "중도금", dueDate: "2025.08.01", paidDate: "2025.08.02", receiptUploaded: true },
      { label: "잔금", dueDate: "2025.09.01", paidDate: "2025.09.01", receiptUploaded: true },
    ],
    settlementStatus: "완료",
  },
]

/* ─── 헬퍼 컴포넌트 ─── */
function ContractStatusBadge({ status }: { status: ContractRow["contractStatus"] }) {
  const map = {
    미서명: "border-gray-300 text-gray-500",
    확정완료: "border-emerald-400 text-emerald-700 bg-emerald-50",
    진행중: "border-blue-400 text-blue-700 bg-blue-50",
  } as const
  return (
    <Badge variant="outline" className={cn("text-xs font-normal", map[status])}>
      {status}
    </Badge>
  )
}

function SettlementStatusBadge({ status }: { status: ContractRow["settlementStatus"] }) {
  const map = {
    미완료: "border-gray-300 text-gray-500",
    일부완료: "border-amber-400 text-amber-700 bg-amber-50",
    완료: "border-emerald-400 text-emerald-700 bg-emerald-50",
  } as const
  return (
    <Badge variant="outline" className={cn("text-xs font-normal", map[status])}>
      {status}
    </Badge>
  )
}

function StageDots({ stages }: { stages: SettlementStage[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {stages.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-0.5">
          <span
            className={cn(
              "inline-block h-2.5 w-2.5 rounded-full",
              s.paidDate ? "bg-emerald-500" : "bg-gray-200"
            )}
            title={`${s.label}: ${s.paidDate ? "완료" : "미완료"}`}
          />
          <span className="text-[10px] text-gray-400">{s.label.slice(0, 2)}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── 확장 행 (정산 단계 상세) ─── */
function ExpandedRow({ stages }: { stages: SettlementStage[] }) {
  return (
    <tr>
      <td colSpan={8} className="bg-gray-50/80 px-6 pb-3 pt-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-left font-medium text-gray-500 w-20">단계</th>
              <th className="py-2 text-left font-medium text-gray-500 w-28">지급예정일</th>
              <th className="py-2 text-left font-medium text-gray-500 w-28">지급완료일</th>
              <th className="py-2 text-left font-medium text-gray-500">계산서</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((s) => (
              <tr key={s.label} className="border-b border-gray-100 last:border-0">
                <td className="py-1.5 font-medium text-gray-700">{s.label}</td>
                <td className="py-1.5 text-gray-600">{s.dueDate}</td>
                <td className="py-1.5 text-gray-600">{s.paidDate ?? "—"}</td>
                <td className="py-1.5">
                  <div className="flex items-center gap-1">
                    <span
                      className={cn(
                        "inline-block h-2 w-2 rounded-full",
                        s.receiptUploaded ? "bg-emerald-500" : "bg-gray-300"
                      )}
                    />
                    <span className="text-gray-500">
                      {s.receiptUploaded ? "업로드" : "미업로드"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  )
}

/* ─── 메인 페이지 ─── */
export default function ContractsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("전체")
  const [contractFilter, setContractFilter] = useState("전체")
  const [settlementFilter, setSettlementFilter] = useState("전체")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = MOCK_ROWS.filter((r) => {
    const matchSearch =
      !search ||
      r.projectName.includes(search) ||
      r.client.includes(search) ||
      r.partner.includes(search) ||
      r.projectId.includes(search)
    const matchType = typeFilter === "전체" || r.type === typeFilter
    const matchContract = contractFilter === "전체" || r.contractStatus === contractFilter
    const matchSettlement = settlementFilter === "전체" || r.settlementStatus === settlementFilter
    return matchSearch && matchType && matchContract && matchSettlement
  })

  const summary = {
    total: MOCK_ROWS.length,
    signed: MOCK_ROWS.filter((r) => r.contractStatus === "확정완료").length,
    settledAll: MOCK_ROWS.filter((r) => r.settlementStatus === "완료").length,
    pending: MOCK_ROWS.filter((r) => r.settlementStatus === "미완료").length,
  }

  return (
    <div className="space-y-6 p-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">계약 & 정산 관리</h1>
        <p className="text-muted-foreground">전체 프로젝트의 계약 서명 및 정산 진행 현황을 관리합니다</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "전체 계약", value: summary.total, color: "text-gray-800" },
          { label: "계약 확정완료", value: summary.signed, color: "text-emerald-600" },
          { label: "정산 완료", value: summary.settledAll, color: "text-blue-600" },
          { label: "정산 미완료", value: summary.pending, color: "text-amber-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center"
          >
            <div className={cn("text-2xl font-bold", s.color)}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로젝트명, 의뢰사, 수행사 검색..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="전체">전체 유형</SelectItem>
            <SelectItem value="공고">공고</SelectItem>
            <SelectItem value="1:1">1:1</SelectItem>
          </SelectContent>
        </Select>
        <Select value={contractFilter} onValueChange={setContractFilter}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="전체">계약 전체</SelectItem>
            <SelectItem value="미서명">미서명</SelectItem>
            <SelectItem value="진행중">진행중</SelectItem>
            <SelectItem value="확정완료">확정완료</SelectItem>
          </SelectContent>
        </Select>
        <Select value={settlementFilter} onValueChange={setSettlementFilter}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="전체">정산 전체</SelectItem>
            <SelectItem value="미완료">미완료</SelectItem>
            <SelectItem value="일부완료">일부완료</SelectItem>
            <SelectItem value="완료">완료</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3 px-4 text-left font-medium text-gray-700 w-10" />
                <th className="py-3 px-4 text-left font-medium text-gray-700">프로젝트</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 w-16">유형</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">의뢰사</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">수행사</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 w-24">계약서명</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 w-28">정산 진행</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 w-20">정산 상태</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 w-16">바로가기</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400 text-sm">
                    검색 결과가 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <Fragment key={row.id}>
                    <tr
                      className="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === row.id ? null : row.id)
                      }
                    >
                      <td className="py-3 px-4 text-gray-400">
                        {expandedId === row.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800 line-clamp-1">
                          {row.projectName}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{row.projectId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-normal",
                            row.type === "공고"
                              ? "border-pink-300 text-pink-600 bg-pink-50"
                              : "border-blue-300 text-blue-600 bg-blue-50"
                          )}
                        >
                          {row.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{row.client}</td>
                      <td className="py-3 px-4 text-gray-700">{row.partner}</td>
                      <td className="py-3 px-4 text-center">
                        <ContractStatusBadge status={row.contractStatus} />
                        {row.contractDate && (
                          <div className="text-[10px] text-gray-400 mt-0.5">{row.contractDate}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StageDots stages={row.stages} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <SettlementStatusBadge status={row.settlementStatus} />
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <Link href={`/admin/projects/${row.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-500 hover:text-gray-800">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                    {expandedId === row.id && <ExpandedRow stages={row.stages} />}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400">* 금액 정보는 보안 정책상 비율(%)로만 표시됩니다. 실제 금액은 각 프로젝트 상세에서 확인하세요.</p>
    </div>
  )
}
