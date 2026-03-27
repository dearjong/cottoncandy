"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"

type Props = {
  open: boolean
  onCancel: () => void
  onVerified: () => void
  /** 비밀번호 검증. true면 열람 허용 */
  validatePassword: (password: string) => boolean
}

export function ProposalSecurityGate({ open, onCancel, onVerified, validatePassword }: Props) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!password.trim()) {
      setError("비밀번호를 입력하세요.")
      return
    }
    if (validatePassword(password)) {
      setPassword("")
      onVerified()
    } else {
      setError("비밀번호가 올바르지 않습니다.")
    }
  }

  const handleCancel = () => {
    setPassword("")
    setError("")
    onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>보안 경고 — 제안서·시안 열람</DialogTitle>
          </div>
          <DialogDescription asChild>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                제안서·시안 자료는 보안자료입니다.
              </p>
              <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-400">
                <li>업무상 필요시에만 열람할 수 있습니다.</li>
                <li>무단 열람·복사·유출 시 법적 책임이 따를 수 있습니다.</li>
                <li>열람 시 내부 보안 정책을 준수해 주세요.</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proposal-security-pw">열람 비밀번호</Label>
            <Input
              id="proposal-security-pw"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              placeholder="비밀번호 입력"
              className={error ? "border-destructive" : ""}
              autoComplete="off"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit">열람하기</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
