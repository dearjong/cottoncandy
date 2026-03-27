"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Siren } from "lucide-react"

const ADMIN_ACTION_PASSWORD = "1234"

type Props = {
  open: boolean
  title: string
  description?: string
  reasonLabel?: string
  reasonPlaceholder?: string
  variant?: "default" | "danger"
  initialPassword?: string
  initialReason?: string
  onCancel: () => void
  onConfirm: (reason: string) => void
}

/** 운영자 개입·중재 액션 시 비밀번호 + 사유 입력 후 실행. 감사 로그에 사유 기록 */
export function AdminActionGate({
  open,
  title,
  description = "이 액션은 감사 로그에 기록됩니다. 비밀번호와 사유를 입력해주세요.",
  reasonLabel = "사유 (로그)",
  reasonPlaceholder = "예: 광고주 요청, 일정 변경 등",
  variant = "default",
  initialPassword,
  initialReason,
  onCancel,
  onConfirm,
}: Props) {
  const [password, setPassword] = useState(initialPassword ?? "")
  const [reason, setReason] = useState(initialReason ?? "")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setPassword(initialPassword ?? "")
      setReason(initialReason ?? "")
      setError("")
    } else {
      setPassword("")
      setReason("")
      setError("")
    }
  }, [open, initialPassword, initialReason])

  if (!open) return null

  const handleConfirm = () => {
    setError("")
    if (password !== ADMIN_ACTION_PASSWORD) {
      setError("비밀번호가 올바르지 않습니다.")
      return
    }
    if (!reason.trim()) {
      setError("사유를 입력해주세요.")
      return
    }

    onConfirm(reason.trim())
    setPassword("")
    setReason("")
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div
        className={
          variant === "danger"
            ? "mx-4 w-full max-w-md rounded-lg border border-red-800 bg-[#660000] p-6 shadow-lg"
            : "mx-4 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg"
        }
      >
        <div
          className={
            variant === "danger"
              ? "flex items-center gap-2 text-gray-200"
              : "flex items-center gap-2 text-destructive"
          }
        >
          {variant === "danger" ? (
            <Siren className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {variant === "danger" ? (
          <p className="mt-3 text-[11px] leading-relaxed text-gray-200 bg-transparent border border-red-300/60 rounded-md px-3 py-2">
            {description}
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">{description}</p>
        )}
        <div className="mt-4 space-y-4">
          <div>
            <Label
              htmlFor="admin-action-pw"
              className={variant === "danger" ? "text-gray-200" : undefined}
            >
              비밀번호
            </Label>
            <Input
              id="admin-action-pw"
              type="password"
              value={password}
              autoFocus
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              placeholder="비밀번호 입력"
              className={`mt-1 ${
                error ? "border-destructive" : ""
              } ${
                variant === "danger"
                  ? "bg-neutral-900/70 border-neutral-500 text-gray-200 placeholder:text-gray-400"
                  : ""
              }`}
              autoComplete="off"
            />
          </div>
          <div>
            <Label
              htmlFor="admin-action-reason"
              className={variant === "danger" ? "text-gray-200" : undefined}
            >
              {reasonLabel}
            </Label>
            <Textarea
              id="admin-action-reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError("")
              }}
              placeholder={reasonPlaceholder}
              className={`mt-1 min-h-[80px] ${
                error ? "border-destructive" : ""
              } ${
                variant === "danger"
                  ? "bg-neutral-900/70 border-neutral-500 text-gray-200 placeholder:text-gray-400"
                  : ""
              }`}
              autoComplete="off"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <div className="mt-6 flex gap-3">
          {variant === "danger" ? (
            <>
              <Button
                variant="outline"
                className="flex-1 border-neutral-500 text-gray-200 hover:bg-neutral-900/80 bg-neutral-900/60"
                onClick={onCancel}
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-neutral-900/60 hover:bg-neutral-900/80 border border-neutral-500 text-gray-100"
                onClick={handleConfirm}
              >
                확인
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex-1" onClick={onCancel}>
                취소
              </Button>
              <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleConfirm}>
                확인
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
