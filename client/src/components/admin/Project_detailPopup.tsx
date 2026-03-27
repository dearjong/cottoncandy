import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ProjectManagement } from "@/components/admin/project-management"
import { cn } from "@/lib/utils"

interface ProjectDetailPopupProps {
  /** 팝업 열림 여부 */
  open: boolean
  /** 열림/닫힘 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void
  /** 상세를 표시할 프로젝트 ID (예: PRJ-001) */
  projectId: string
}

/**
 * 진행현황 등에서 쓰는 프로젝트 상세 팝업.
 * ProjectManagement의 상세 화면을 그대로 재사용하여,
 * 한쪽을 수정하면 다른쪽도 자동으로 동일하게 유지되도록 한다.
 */
export function Project_detailPopup({ open, onOpenChange, projectId }: ProjectDetailPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-6xl w-[min(100%,1152px)] max-h-[calc(100vh-2rem)] overflow-y-auto p-6 pt-12",
          // 기본 Dialog는 top 50% + translateY -50% 세로중앙이라, 내부 높이가 변할 때마다 위치가 흔들림.
          // 상단 기준 + 가로만 중앙 정렬로 고정.
          "!left-1/2 !top-8 !-translate-x-1/2 !translate-y-0",
          // 열릴 때도 세로 슬라이드가 아닌 위쪽에서 자연스럽게
          "data-[state=open]:slide-in-from-top-[2%] data-[state=closed]:slide-out-to-top-[2%]",
        )}
      >
        <ProjectManagement
          initialProjectId={projectId}
          hideBackToListButton
          showCloseButton
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

