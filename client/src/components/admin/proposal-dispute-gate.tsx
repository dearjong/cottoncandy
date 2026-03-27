"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle } from "lucide-react"

const DISPUTE_ACCESS_PASSWORD = "1234"
const DEFAULT_REASON = "클레임/분쟁 발생으로 인한 열람"

type Props = {
  open: boolean
  companyName: string
  onCancel: () => void
  onClaimDispute: () => void
}

/** 클레임/분쟁 발생 시 비밀번호 1234 입력 후 열람. 로그 기록 */
export function ProposalDisputeGate({ open, companyName, onCancel, onClaimDispute }: Props) {
  const [password, setPassword] = useState(DISPUTE_ACCESS_PASSWORD)
  const [reason, setReason] = useState(DEFAULT_REASON)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setPassword(DISPUTE_ACCESS_PASSWORD)
      setReason(DEFAULT_REASON)
      setError("")
    }
  }, [open])

  if (!open) return null

  const handleClaim = () => {
    setError("")
    if (password !== DISPUTE_ACCESS_PASSWORD) {
      setError("비밀번호가 올바르지 않습니다.")
      return
    }

    const log = {
      type: "PROPOSAL_DISPUTE_ACCESS",
      action: "클레임/분쟁 발생",
      companyName,
      reason,
      timestamp: new Date().toISOString(),
      adminId: localStorage.getItem("adminId") ?? "unknown",
    }
    console.log("[제안서·시안 열람 로그] 클레임/분쟁 발생", log)

    onClaimDispute()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">보안자료 열람 제한</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          제안서·시안 상세 자료는 보안자료입니다. 평소에는 열람할 수 없습니다.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          <strong>[{companyName}]</strong> 관련 클레임/분쟁 발생 시에만 열람 가능합니다. 열람 시 로그가 기록됩니다.
        </p>
        <div className="mt-4 space-y-2">
          <Label htmlFor="dispute-pw">비밀번호</Label>
          <Input
            id="dispute-pw"
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
            <Label htmlFor="dispute-reason">사유</Label>
            <Textarea
              id="dispute-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="열람 사유를 입력해주세요"
              className="mt-1 min-h-[60px]"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            취소
          </Button>
          <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleClaim}>
            클레임/분쟁 발생
          </Button>
        </div>
      </div>
    </div>
  )
}
