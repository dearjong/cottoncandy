import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "wouter"
import { cn } from "@/lib/utils"

type AdminBackButtonProps = {
  /** 이동할 목록 경로. 지정 시 Link로 이동 */
  href?: string
  /** 클릭 핸들러. href 없을 때 사용 (예: 상세→목록 모드 전환) */
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

/** 상단 좌측용 공통 "목록으로" 버튼 (ghost 스타일) */
export function AdminBackButton({
  href,
  onClick,
  className,
  children = "목록으로",
}: AdminBackButtonProps) {
  const content = (
    <>
      <ArrowLeft className="h-4 w-4 mr-2" />
      {children}
    </>
  )

  const button = (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn("inline-flex items-center gap-2", className)}
    >
      {content}
    </Button>
  )

  if (href) {
    return (
      <Link href={href}>
        {button}
      </Link>
    )
  }

  return button
}

