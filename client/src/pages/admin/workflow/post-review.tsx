/**
 * 절차별: 제작 후기 — 운영자 화면
 */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdminWorkflowHeader } from "@/components/admin/workflow/AdminWorkflowHeader"

const MOCK_PROJECTS = [{ id: "1", label: "[베스트전자] TV 신제품 판매촉진 프로모션" }]

export default function AdminWorkflowPostReview() {
  return (
    <div className="space-y-6 p-6">
      <AdminWorkflowHeader
        title="제작 후기"
        description="TVCF 제작 후기를 관리합니다."
        right={
          <Select defaultValue="1">
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="프로젝트 선택" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_PROJECTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
      <div className="bg-muted/30 rounded-lg p-8 text-center text-muted-foreground">
        제작 후기 관리 — 구현 예정
      </div>
    </div>
  )
}
