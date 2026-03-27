/**
 * 리뷰 관리 — 전체 프로젝트의 제작 리뷰 목록 + 모더레이션
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Star, Search, ExternalLink, Eye, EyeOff, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

/* ─── 타입 ─── */
const REVIEW_ITEMS = [
  "전반적 만족도",
  "기획의 명확성",
  "제작완성도",
  "피드백 반영과 응답 속도",
  "일정준수",
  "커뮤니케이션 명확성",
  "의사결정 및 응답 속도",
  "계약 및 정산 신뢰도",
  "협업 만족도",
] as const

interface ReviewRow {
  id: string
  projectId: string
  projectName: string
  type: "공고" | "1:1"
  client: string
  partner: string
  reviewer: string
  reviewDate: string
  ratings: Record<string, number>
  reviewText: string
  visible: boolean
  avgRating: number
}

/* ─── 목업 데이터 ─── */
const INITIAL_ROWS: ReviewRow[] = [
  {
    id: "1",
    projectId: "PID-20250721-0001",
    projectName: "[베스트전자] TV 신제품 판매촉진 프로모션",
    type: "공고",
    client: "베스트전자",
    partner: "예쓰커뮤니케이션",
    reviewer: "김비비고",
    reviewDate: "2025.10.20",
    ratings: {
      "전반적 만족도": 5,
      "기획의 명확성": 4,
      "제작완성도": 5,
      "피드백 반영과 응답 속도": 4,
      "일정준수": 5,
      "커뮤니케이션 명확성": 4,
      "의사결정 및 응답 속도": 4,
      "계약 및 정산 신뢰도": 5,
      "협업 만족도": 5,
    },
    reviewText:
      "전반적으로 매우 만족스러운 프로젝트였습니다. 기획 단계부터 제작 완료까지 커뮤니케이션이 원활했고, 일정 준수도 철저히 지켜주셨습니다. 다음 프로젝트에도 함께하고 싶습니다.",
    visible: true,
    avgRating: 4.6,
  },
  {
    id: "2",
    projectId: "PID-20250615-0002",
    projectName: "[CJ제일제당] 비비고 브랜드 캠페인 영상",
    type: "공고",
    client: "CJ제일제당",
    partner: "솜사탕애드",
    reviewer: "이주영",
    reviewDate: "2025.09.30",
    ratings: {
      "전반적 만족도": 4,
      "기획의 명확성": 3,
      "제작완성도": 4,
      "피드백 반영과 응답 속도": 3,
      "일정준수": 4,
      "커뮤니케이션 명확성": 4,
      "의사결정 및 응답 속도": 3,
      "계약 및 정산 신뢰도": 4,
      "협업 만족도": 4,
    },
    reviewText:
      "전체적으로 만족스러운 결과물이었으나, 초기 기획 단계에서 의사소통에 약간의 어려움이 있었습니다. 피드백 반영 속도를 개선해 주시면 더 좋을 것 같습니다.",
    visible: true,
    avgRating: 3.7,
  },
  {
    id: "3",
    projectId: "PID-20250520-0005",
    projectName: "[삼성전자] 갤럭시 버즈 라이브 캠페인",
    type: "공고",
    client: "삼성전자",
    partner: "제일기획",
    reviewer: "박민준",
    reviewDate: "2025.09.15",
    ratings: {
      "전반적 만족도": 5,
      "기획의 명확성": 5,
      "제작완성도": 5,
      "피드백 반영과 응답 속도": 5,
      "일정준수": 5,
      "커뮤니케이션 명확성": 5,
      "의사결정 및 응답 속도": 4,
      "계약 및 정산 신뢰도": 5,
      "협업 만족도": 5,
    },
    reviewText:
      "최고의 파트너와 함께한 프로젝트였습니다. 모든 과정에서 전문성과 책임감을 보여주셨습니다.",
    visible: true,
    avgRating: 4.9,
  },
  {
    id: "4",
    projectId: "PID-20250801-0003",
    projectName: "[현대자동차] 아이오닉 신규 광고 제작",
    type: "1:1",
    client: "현대자동차",
    partner: "TBWA코리아",
    reviewer: "최동현",
    reviewDate: "2025.10.05",
    ratings: {
      "전반적 만족도": 2,
      "기획의 명확성": 2,
      "제작완성도": 3,
      "피드백 반영과 응답 속도": 2,
      "일정준수": 2,
      "커뮤니케이션 명확성": 2,
      "의사결정 및 응답 속도": 2,
      "계약 및 정산 신뢰도": 3,
      "협업 만족도": 2,
    },
    reviewText:
      "일정 지연과 커뮤니케이션 문제가 반복되었습니다. 기대에 미치지 못한 결과물이어서 아쉬웠습니다.",
    visible: false,
    avgRating: 2.2,
  },
]

/* ─── 별점 표시 컴포넌트 ─── */
function StarRating({ value, size = "sm" }: { value: number; size?: "sm" | "xs" }) {
  const starSize = size === "sm" ? "w-4 h-4" : "w-3 h-3"
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            starSize,
            value >= s ? "text-amber-400" : "text-gray-200"
          )}
          fill={value >= s ? "currentColor" : "none"}
          stroke="currentColor"
        />
      ))}
    </div>
  )
}

/* ─── 확장 행 — 항목별 별점 + 리뷰 전문 ─── */
function ExpandedReview({ row }: { row: ReviewRow }) {
  return (
    <tr>
      <td colSpan={9} className="bg-gray-50/80 px-6 pb-4 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-3">
          {REVIEW_ITEMS.map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-xs text-gray-600 w-44">{item}</span>
              <StarRating value={row.ratings[item] ?? 0} size="xs" />
            </div>
          ))}
        </div>
        {row.reviewText && (
          <div className="bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-700 leading-relaxed">
            {row.reviewText}
          </div>
        )}
      </td>
    </tr>
  )
}

/* ─── 메인 페이지 ─── */
export default function ReviewsPage() {
  const [rows, setRows] = useState<ReviewRow[]>(INITIAL_ROWS)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("전체")
  const [visibleFilter, setVisibleFilter] = useState("전체")
  const [ratingFilter, setRatingFilter] = useState("전체")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ReviewRow | null>(null)

  const filtered = rows.filter((r) => {
    const matchSearch =
      !search ||
      r.projectName.includes(search) ||
      r.client.includes(search) ||
      r.partner.includes(search) ||
      r.reviewer.includes(search)
    const matchType = typeFilter === "전체" || r.type === typeFilter
    const matchVisible =
      visibleFilter === "전체" ||
      (visibleFilter === "공개" && r.visible) ||
      (visibleFilter === "비공개" && !r.visible)
    const matchRating =
      ratingFilter === "전체" ||
      (ratingFilter === "5" && r.avgRating >= 5) ||
      (ratingFilter === "4" && r.avgRating >= 4 && r.avgRating < 5) ||
      (ratingFilter === "3↓" && r.avgRating < 4)
    return matchSearch && matchType && matchVisible && matchRating
  })

  const summary = {
    total: rows.length,
    visible: rows.filter((r) => r.visible).length,
    hidden: rows.filter((r) => !r.visible).length,
    avgAll:
      rows.length > 0
        ? Math.round((rows.reduce((a, r) => a + r.avgRating, 0) / rows.length) * 10) / 10
        : 0,
  }

  const toggleVisible = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, visible: !r.visible } : r)))
  }

  const deleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6 p-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">리뷰 관리</h1>
        <p className="text-muted-foreground">전체 프로젝트의 제작 리뷰를 확인하고 공개 여부를 관리합니다</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "전체 리뷰", value: summary.total, sub: "건", color: "text-gray-800" },
          { label: "공개 리뷰", value: summary.visible, sub: "건", color: "text-emerald-600" },
          { label: "비공개 리뷰", value: summary.hidden, sub: "건", color: "text-amber-600" },
          { label: "평균 평점", value: summary.avgAll, sub: "/ 5", color: "text-pink-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center"
          >
            <div className={cn("text-2xl font-bold", s.color)}>
              {s.value}
              <span className="text-sm font-normal text-gray-400 ml-0.5">{s.sub}</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로젝트명, 의뢰사, 수행사, 등록자 검색..."
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
        <Select value={visibleFilter} onValueChange={setVisibleFilter}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="전체">전체 공개</SelectItem>
            <SelectItem value="공개">공개</SelectItem>
            <SelectItem value="비공개">비공개</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="전체">전체 평점</SelectItem>
            <SelectItem value="5">5점</SelectItem>
            <SelectItem value="4">4점대</SelectItem>
            <SelectItem value="3↓">3점 이하</SelectItem>
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
                <th className="py-3 px-4 text-left font-medium text-gray-700">등록자</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 w-32">평균 평점</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 w-24">등록일</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 w-28">공개여부</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 w-20">액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400 text-sm">
                    검색 결과가 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <Fragment key={row.id}>
                    <tr
                      className={cn(
                        "border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer",
                        !row.visible && "opacity-60"
                      )}
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
                      <td className="py-3 px-4 text-gray-700">{row.reviewer}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <StarRating value={Math.round(row.avgRating)} />
                          <span className="text-xs font-medium text-gray-700">
                            {row.avgRating.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{row.reviewDate}</td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-7 px-2 gap-1 text-xs",
                            row.visible
                              ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          )}
                          onClick={() => toggleVisible(row.id)}
                        >
                          {row.visible ? (
                            <>
                              <Eye className="h-3.5 w-3.5" />
                              공개
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3.5 w-3.5" />
                              비공개
                            </>
                          )}
                        </Button>
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/projects/${row.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-gray-400 hover:text-gray-700"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteTarget(row)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === row.id && <ExpandedReview row={row} />}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>리뷰 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{deleteTarget?.reviewer}</span>님의 리뷰를 삭제하시겠습니까?
            <br />
            삭제된 리뷰는 복구할 수 없습니다.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteTarget && deleteRow(deleteTarget.id)}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
