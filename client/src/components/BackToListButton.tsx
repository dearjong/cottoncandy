import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonClassName =
  "bg-[#666666] text-white hover:bg-[#555555] hover:text-white border border-gray-400 shadow-sm"

type BackToListButtonProps = {
  /** 목록 페이지 경로. 지정 시 Link로 렌더 */
  href?: string
  /** 클릭 핸들러. href 없을 때만 사용, Button으로 렌더 */
  onClick?: () => void
  /** 왼쪽 아이콘 (기본: ChevronLeft). 아이콘 숨김: null */
  icon?: React.ReactNode | null
  className?: string
  children?: React.ReactNode
}

export function BackToListButton({
  href,
  onClick,
  icon = <ChevronLeft className="h-4 w-4 shrink-0" />,
  className,
  children = "리스트로 돌아가기",
}: BackToListButtonProps) {
  const content = (
    <>
      {icon}
      {children}
    </>
  )

  if (href != null) {
    return (
      <Link href={href}>
        <Button
          variant="outline"
          size="default"
          className={cn(buttonClassName, className)}
        >
          {content}
        </Button>
      </Link>
    )
  }

  return (
    <Button
      variant="outline"
      size="default"
      onClick={onClick}
      className={cn(buttonClassName, className)}
    >
      {content}
    </Button>
  )
}
