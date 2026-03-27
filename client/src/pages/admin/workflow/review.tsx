/**
 * 절차별: 리뷰/평가
 * 사용자 제작 리뷰(/work/project/review) 기반 운영자 화면
 */
import { AdminWorkflowHeader } from "@/components/admin/workflow/AdminWorkflowHeader"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const MOCK_PROJECTS = [{ id: "1", label: "[베스트전자] TV 신제품 판매촉진 프로모션" }]

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

export default function WorkflowReviewPage() {
  const [projectId, setProjectId] = useState("1")
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [reviewText, setReviewText] = useState("")
  const setRating = (item: string, value: number) => {
    setRatings((prev) => ({ ...prev, [item]: value }))
  }
  const isEmbed = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embed") === "1"

  return (
    <div className="space-y-4 px-4 pt-4 pb-1">
      {!isEmbed && (
        <AdminWorkflowHeader
          title="제작 리뷰"
          description="사용자 제작 리뷰를 확인/관리합니다."
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

      <div className="space-y-4">
        {/* 파트너기업 / 등록자 (한 줄 요약) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-2">
          <p className="text-xs sm:text-sm text-gray-700">
            <span className="text-gray-500">파트너기업</span>{" "}
            <span className="font-medium text-gray-900 mr-4">솜사탕애드</span>
            <span className="text-gray-500">등록자</span>{" "}
            <span className="font-medium text-gray-900">김비비고</span>
          </p>
        </div>

        {/* 평점 항목 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">평가 항목</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-5 gap-x-10">
            {(() => {
              const mid = Math.ceil(REVIEW_ITEMS.length / 2)
              const columns = [REVIEW_ITEMS.slice(0, mid), REVIEW_ITEMS.slice(mid)]
              return columns.map((colItems, colIdx) => (
                <div key={colIdx} className="space-y-3">
                  {colItems.map((item) => (
                    <div key={item} className="flex items-center justify-between gap-3">
                      <Label className="text-gray-700 text-xs sm:text-sm w-32 sm:w-40 md:w-44 shrink-0">
                        {item}
                      </Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            type="button"
                            onClick={() => setRating(item, score)}
                            className={cn(
                              "p-0.5 rounded transition-colors",
                              (ratings[item] ?? 0) >= score
                                ? "text-pink-500 hover:text-pink-600"
                                : "text-gray-300 hover:text-gray-400"
                            )}
                          >
                            <Star
                              className="w-5 h-5"
                              fill={(ratings[item] ?? 0) >= score ? "currentColor" : "none"}
                              stroke="currentColor"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            })()}
          </div>
        </div>

        {/* 리뷰 (출력 전용, 컴팩트 모드) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <Label className="text-gray-700 text-xs font-medium block mb-1.5">리뷰</Label>
          <div className="text-sm text-gray-800 leading-relaxed line-clamp-2">
            {reviewText || "등록된 리뷰 내용이 없습니다."}
          </div>
        </div>

        {/* 안내 */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>입력하신 정보는 프로젝트 관리와 서비스 제공 목적에만 사용되는 것에 동의합니다.</p>
          <p>등록 후 7일 이내에만 수정이 가능합니다.</p>
        </div>

      </div>
    </div>
  )
}
