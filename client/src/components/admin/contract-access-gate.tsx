"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle } from "lucide-react"
import { useLocation } from "wouter"

const CONTRACT_ACCESS_PASSWORD = "1234"
const DEFAULT_REASON = "계약정보 열람"

type Props = {
  open: boolean
  onUnlock: () => void
}

/** 계약정보 열람 시 비밀번호 입력 후 접근. 제안서·시안과 동일하게 민감 정보 보호 */
export function ContractAccessGate({ open, onUnlock }: Props) {
  const [, setLocation] = useLocation()
  const [password, setPassword] = useState(CONTRACT_ACCESS_PASSWORD)
  const [reason, setReason] = useState(DEFAULT_REASON)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setPassword(CONTRACT_ACCESS_PASSWORD)
      setReason(DEFAULT_REASON)
      setError("")
    }
  }, [open])

  if (!open) return null

  const handleUnlock = () => {
    setError("")
    if (password !== CONTRACT_ACCESS_PASSWORD) {
      setError("비밀번호가 올바르지 않습니다.")
      return
    }

    const log = {
      type: "CONTRACT_ACCESS",
      action: "계약정보 열람",
      reason,
      timestamp: new Date().toISOString(),
      adminId: localStorage.getItem("adminId") ?? "unknown",
    }
    console.log("[계약정보 열람 로그]", log)

    onUnlock()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">계약정보 열람 제한</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          계약정보는 민감한 보안자료입니다. 비밀번호와 사유를 입력한 후 열람할 수 있습니다.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          열람 시 로그가 기록됩니다.
        </p>
        <div className="mt-4 space-y-2">
          <Label htmlFor="contract-pw">비밀번호</Label>
          <Input
            id="contract-pw"
            type="password"
            value={password}
            autoFocus
            onChange={(e) => {
              setPassword(e.target.value)
              setError("")
            }}
            placeholder="비밀번호 입력"
            className={error ? "border-destructive" : ""}
            autoComplete="off"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <Label htmlFor="contract-reason">사유</Label>
            <Textarea
              id="contract-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="열람 사유를 입력해주세요"
              className="mt-1 min-h-[60px]"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setLocation("/admin/projects")}>
            취소
          </Button>
          <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleUnlock}>
            열람
          </Button>
        </div>
      </div>
    </div>
  )
}
