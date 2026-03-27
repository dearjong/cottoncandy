/**
 * 절차별: 계약 — 운영자 화면 (계약정보 관리)
 * Admin IA: 개입 및 중재 (상태 강제 변경, 수정 권한 부여, 수동 정산) + 액션 로그
 */
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { FileText, RotateCcw, Unlock, Wallet, ShieldAlert } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AdminActionGate } from "@/components/admin/admin-action-gate"
import { ContractAccessGate } from "@/components/admin/contract-access-gate"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdminWorkflowHeader } from "@/components/admin/workflow/AdminWorkflowHeader"

const MOCK_PROJECTS = [
  { id: "1", label: "[베스트전자] TV 신제품 판매촉진 프로모션" },
  { id: "2", label: "[글로벌식품] 신제품 런칭 캠페인" },
]

const DELEGATION_TAGS = [
  "전략기획", "크리에이티브 기획", "영상 제작", "성과 측정 및 리포팅", "인플루언서/SNS 마케팅",
  "오프라인 이벤트/프로모션", "영상 기획", "영상 촬영", "편집 및 후반작업", "모델/배우 섭외", "매체 집행",
  "급행 제작 대응", "당일 피드백 반영 가능", "미디어 집행", "PR/언론보도 대응", "가격 확정형", "구간가격형",
  "일정 유동성 대응", "음악/BGM", "이벤트/행사 대응", "미공개",
]

const SCHEDULE_OPTIONS = [
  "급행 제작 대응", "당일 피드백 반영 가능", "일정 유동성 대응", "이벤트/행사 대응",
]

/** 의뢰 내용: 체크된 항목 (의뢰자 입력값) */
const MOCK_SELECTED_DELEGATION = [
  "전략기획", "크리에이티브 기획", "영상 제작", "성과 측정 및 리포팅", "인플루언서/SNS 마케팅",
  "오프라인 이벤트/프로모션", "영상 기획", "영상 촬영", "편집 및 후반작업", "모델/배우 섭외", "매체 집행",
  "급행 제작 대응", "당일 피드백 반영 가능", "미디어 집행", "PR/언론보도 대응", "가격 확정형", "구간가격형",
  "일정 유동성 대응", "음악/BGM", "이벤트/행사 대응", "미공개",
]

/** 일정 대응: 체크된 항목 */
const MOCK_SELECTED_SCHEDULE = ["급행 제작 대응", "당일 피드백 반영 가능", "일정 유동성 대응", "이벤트/행사 대응"]

const MOCK_FILES = [
  { name: "[계약서] LG 스탠바이미2 프로모션 광고계약서.pdf", type: "계약서", date: "2024-04-06" },
  { name: "[HSAD] 사업자 등록증 사본.pdf", date: "2024-04-06" },
  { name: "[HSAD] 비밀유지 서약서 2025.pdf", type: "비밀유지 서약서", date: "2024-04-06" },
  { name: "[HSAD] 프로젝트 기획서 2025.pdf", type: "프로젝트 기획서", date: "2024-04-06" },
]

type AuditLogEntry = {
  timestamp: string
  adminId: string
  action: string
  before: string
  after: string
  reason: string
}

const PROJECT_STATUS_OPTIONS = [
  { value: "rollback", label: "단계 되돌리기" },
  { value: "terminate", label: "강제 종료" },
  { value: "force_next", label: "강제 다음 단계" },
]

const PROJECT_STATUSES = ["모집중", "제안서 검토", "계약중", "제작중", "검수 완료", "종료"]

const MOCK_OPERATOR_LOGS: { timestamp: string; adminId: string }[] = [
  { timestamp: "2025.01.15 14:30", adminId: "admin1" },
  { timestamp: "2026.03.10 10:41", adminId: "unknown" },
]

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { timestamp: "2026-03-10", adminId: "admin_01", action: "상태 강제 변경", before: "제작 중", after: "제안서 검토", reason: "광고주 요청: 일정 오기로 인한 계약서 재작성 필요" },
  { timestamp: "2026-03-11", adminId: "admin_02", action: "수정 권한 부여", before: "잠금 (Locked)", after: "활성 (Active)", reason: "계약서 제3조 2항 금액 오타 수정 허용" },
]

function formatTimestamp() {
  return new Date().toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\. /g, ".").replace(/\.$/, "")
}

export default function AdminWorkflowContract() {
  const [unlocked, setUnlocked] = useState(false)
  const [projectId, setProjectId] = useState("1")
  const [allLogs, setAllLogs] = useState<{ timestamp: string; adminId: string }[]>([])
  const [userEditEnabled, setUserEditEnabled] = useState(false)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS)

  useEffect(() => {
    const newLog = {
      timestamp: formatTimestamp(),
      adminId: localStorage.getItem("adminId") ?? "unknown",
    }
    setAllLogs([...MOCK_OPERATOR_LOGS, newLog])
  }, [])

  const [forceStatusOpen, setForceStatusOpen] = useState(false)
  const [unlockEditOpen, setUnlockEditOpen] = useState(false)
  const [manualSettlementOpen, setManualSettlementOpen] = useState(false)
  const [statusChangeType, setStatusChangeType] = useState("rollback")
  const [statusChangeTarget, setStatusChangeTarget] = useState("제안서 검토")
  const [currentProjectStatus, setCurrentProjectStatus] = useState("계약중")
  const [gateOpen, setGateOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<"force_status" | "unlock_edit" | "manual_settlement" | "sanction" | null>(null)
  const [sanctionOpen, setSanctionOpen] = useState(false)
  const [sanctionTarget, setSanctionTarget] = useState("partner")
  const [sanctionType, setSanctionType] = useState("warning")

  const SANCTION_TARGETS = [
    { value: "advertiser", label: "광고주" },
    { value: "partner", label: "파트너" },
  ]
  const SANCTION_TYPES = [
    { value: "warning", label: "경고" },
    { value: "restrict_7", label: "활동 제한 (7일)" },
    { value: "restrict_30", label: "활동 제한 (30일)" },
    { value: "suspend", label: "계정 정지" },
  ]

  const addAuditLog = (entry: AuditLogEntry) => {
    setAuditLogs((prev) => [entry, ...prev])
    console.log("[감사 로그] 운영자 옵션 변경", entry)
  }

  const handleUserEditToggle = (checked: boolean, fromDialog = false, gateReason?: string) => {
    const adminId = localStorage.getItem("adminId") ?? "unknown"
    const reason = checked ? (fromDialog ? (gateReason || "사용자 수정 권한 부여") : "스위치로 활성화") : "수정 권한 회수"
    addAuditLog({
      timestamp: formatTimestamp(),
      adminId,
      action: "수정 권한 부여",
      before: userEditEnabled ? "활성 (Active)" : "잠금 (Locked)",
      after: checked ? "활성 (Active)" : "잠금 (Locked)",
      reason,
    })
    setUserEditEnabled(checked)
    if (fromDialog) setUnlockEditOpen(false)
  }

  const executeForceStatusChange = (reason: string) => {
    const adminId = localStorage.getItem("adminId") ?? "unknown"
    const afterStatus = statusChangeType === "terminate" ? "강제 종료" : statusChangeType === "force_next" ? "검수 완료" : statusChangeTarget
    addAuditLog({
      timestamp: formatTimestamp(),
      adminId,
      action: "상태 강제 변경",
      before: currentProjectStatus,
      after: afterStatus,
      reason,
    })
    setCurrentProjectStatus(afterStatus)
    setForceStatusOpen(false)
  }

  const executeManualSettlement = (reason: string) => {
    const adminId = localStorage.getItem("adminId") ?? "unknown"
    addAuditLog({
      timestamp: formatTimestamp(),
      adminId,
      action: "수동 정산 실행",
      before: "에스크로 보류",
      after: "지급 승인",
      reason,
    })
    setManualSettlementOpen(false)
  }

  const executeSanction = (reason: string) => {
    const adminId = localStorage.getItem("adminId") ?? "unknown"
    const targetLabel = SANCTION_TARGETS.find((t) => t.value === sanctionTarget)?.label ?? sanctionTarget
    const typeLabel = SANCTION_TYPES.find((t) => t.value === sanctionType)?.label ?? sanctionType
    addAuditLog({
      timestamp: formatTimestamp(),
      adminId,
      action: "제재",
      before: "정상",
      after: `${targetLabel} ${typeLabel}`,
      reason,
    })
    setSanctionOpen(false)
  }

  const handleGateConfirm = (reason: string) => {
    if (pendingAction === "force_status") executeForceStatusChange(reason)
    else if (pendingAction === "unlock_edit") handleUserEditToggle(true, true, reason)
    else if (pendingAction === "manual_settlement") executeManualSettlement(reason)
    else if (pendingAction === "sanction") executeSanction(reason)
    setGateOpen(false)
    setPendingAction(null)
  }

  return (
    <div className="space-y-6 p-6">
      <ContractAccessGate open={!unlocked} onUnlock={() => setUnlocked(true)} />

      {!unlocked && (
        <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
          비밀번호와 사유를 입력한 후 계약정보를 열람할 수 있습니다.
        </div>
      )}

      {unlocked && (
        <>
      {!(typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embed") === "1") && (
        <AdminWorkflowHeader
          title="계약정보"
          right={
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="w-full max-w-xl">
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
      )}

      <div className="space-y-6">
        {/* 계약파트너 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Label className="text-muted-foreground text-sm">계약파트너</Label>
          <p className="mt-1 font-medium text-foreground">예쓰커뮤니케이션</p>
        </div>

        {/* 의뢰 내용 (체크박스 비활성화, 체크/미체크 표시) */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Label className="text-muted-foreground text-sm block mb-3">의뢰 내용</Label>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {DELEGATION_TAGS.map((tag) => (
              <label key={tag} className="flex items-center gap-2 cursor-default opacity-90">
                <Checkbox checked={MOCK_SELECTED_DELEGATION.includes(tag)} disabled />
                <span className="text-sm text-foreground">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 일정 대응 / 금액입력방식 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col gap-6">
            <div>
              <Label className="text-foreground text-sm block mb-3">일정 대응</Label>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {SCHEDULE_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-default opacity-90">
                    <Checkbox checked={MOCK_SELECTED_SCHEDULE.includes(opt)} disabled />
                    <span className="text-sm text-foreground">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm block mb-2">금액입력방식</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">제작비</p>
                  <Input defaultValue="200,000,000" className="mb-1" readOnly />
                  <p className="text-xs text-muted-foreground">원 VAT 포함</p>
                  <p className="text-xs text-muted-foreground mt-1">1.5억~3억원 (VAT 포함)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">총 예산 (매체비포함)</p>
                  <Input defaultValue="2,000,000,000" className="mb-1" readOnly />
                  <p className="text-xs text-muted-foreground">원 VAT 포함</p>
                  <p className="text-xs text-muted-foreground mt-1">5억 ~ 10억원 (VAT 포함)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 계약일 / 최종기획안 / 납품기한 / OnAir */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-muted-foreground text-sm">계약일</Label>
              <Input type="date" defaultValue="2025-10-15" className="mt-1" />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">최종기획안 제출일</Label>
              <Input type="date" defaultValue="2025-10-15" className="mt-1" />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">1차 납품기한</Label>
              <Input type="date" defaultValue="2025-10-15" className="mt-1" />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">최종 납품기한</Label>
              <Input type="date" defaultValue="2025-10-15" className="mt-1" />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">OnAir</Label>
              <Input type="date" defaultValue="2025-10-15" className="mt-1" />
            </div>
          </div>
        </div>

        {/* 선금 / 중도금 / 잔금 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Label className="text-muted-foreground text-sm block mb-3">결제 조건</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-2 px-3 text-left font-medium text-foreground">구분</th>
                  <th className="py-2 px-3 text-left font-medium text-foreground">시점</th>
                  <th className="py-2 px-3 text-center font-medium text-foreground w-20">비율</th>
                  <th className="py-2 px-3 text-left font-medium text-foreground">일자</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 text-muted-foreground">선금</td>
                  <td className="py-2 px-3 text-muted-foreground">계약 체결 시</td>
                  <td className="py-2 px-3 text-center text-muted-foreground">30%</td>
                  <td className="py-2 px-3 text-muted-foreground">2025.10.15</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 text-muted-foreground">중도금</td>
                  <td className="py-2 px-3 text-muted-foreground">기획안/스토리보드 확정 시</td>
                  <td className="py-2 px-3 text-center text-muted-foreground">40%</td>
                  <td className="py-2 px-3 text-muted-foreground">2025.11.15</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3 text-muted-foreground">잔금</td>
                  <td className="py-2 px-3 text-muted-foreground">최종 결과물 납품 시</td>
                  <td className="py-2 px-3 text-center text-muted-foreground">30%</td>
                  <td className="py-2 px-3 text-muted-foreground">2025.12.15</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 기업인증 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Label className="text-muted-foreground text-sm block mb-2">기업인증</Label>
          <p className="text-sm text-muted-foreground">사업자 정보·인증완료 (2027.12.31까지)</p>
        </div>

        {/* 기타 계약조건 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Label className="text-muted-foreground text-sm block mb-2">기타 계약조건</Label>
          <Textarea className="min-h-[80px] bg-muted/30" defaultValue="계약서에 명시된 표준 계약조건을 따릅니다. 특이사항 없음." readOnly />
        </div>

        {/* 서명완료된 계약서 / 최종기획서 / 기타문서 등록 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Label className="text-muted-foreground text-sm block mb-3">서명완료된 계약서 / 최종기획서 / 기타문서 등록</Label>
          <ul className="space-y-2 mb-4">
            {MOCK_FILES.map((f) => (
              <li key={f.name} className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{f.name}</span>
                {f.type && <span className="text-muted-foreground">| {f.type}</span>}
                <span className="text-muted-foreground">| {f.date}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm">파일 추가</Button>
        </div>

        {/* 안내 문구 */}
        <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground space-y-1">
          <p>입력하신 정보는 안전하게 저장되며, 프로젝트 관리와 서비스 제공 목적에만 사용되는 것에 동의합니다.</p>
          <p>계약은 파트너사의 확인 및 동의 후 완료됩니다.</p>
          <p>계약이 확정되면 이후 수정은 불가능합니다.</p>
        </div>

        {/* 개입 및 중재 (Admin IA) */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-foreground text-sm mb-2">개입 및 중재</h3>
          <p className="text-xs text-muted-foreground mb-4">프로세스가 꼬인 경우 운영자가 특정 이슈를 해결하기 위해 사용하는 기능입니다.</p>
          <div className="flex flex-wrap gap-3">
            {/* 1. 프로젝트 상태 강제 변경 */}
            <Dialog open={forceStatusOpen} onOpenChange={setForceStatusOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  프로젝트 상태 강제 변경
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>프로젝트 상태 강제 변경</DialogTitle>
                  <DialogDescription>단계를 되돌리거나, 강제 종료/진행시킬 때 사용합니다. 변경 사유는 로그에 기록됩니다.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label className="text-sm">현재 상태</Label>
                    <p className="text-sm text-muted-foreground mt-1">{currentProjectStatus}</p>
                  </div>
                  <div>
                    <Label className="text-sm">액션 유형</Label>
                    <Select value={statusChangeType} onValueChange={setStatusChangeType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {statusChangeType === "rollback" && (
                    <div>
                      <Label className="text-sm">대상 단계</Label>
                      <Select value={statusChangeTarget} onValueChange={setStatusChangeTarget}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_STATUSES.filter((s) => s !== currentProjectStatus).map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setForceStatusOpen(false)}>취소</Button>
                  <Button onClick={() => { setPendingAction("force_status"); setForceStatusOpen(false); setGateOpen(true); }}>적용</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 2. 계약서/제안서 수정 권한 부여 */}
            <Dialog open={unlockEditOpen} onOpenChange={setUnlockEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Unlock className="w-4 h-4 mr-1" />
                  수정 모드 활성화
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>계약서/제안서 수정 권한 부여</DialogTitle>
                  <DialogDescription>이미 확정된 필드를 사용자가 다시 수정할 수 있도록 활성화합니다. 해당 광고주/파트너에게 알림이 발송됩니다.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUnlockEditOpen(false)}>취소</Button>
                  <Button onClick={() => { setPendingAction("unlock_edit"); setUnlockEditOpen(false); setGateOpen(true); }}>수정 모드 활성화</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 3. 수동 정산 승인 */}
            <Dialog open={manualSettlementOpen} onOpenChange={setManualSettlementOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Wallet className="w-4 h-4 mr-1" />
                  수동 정산 실행
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>증빙 기반 정산 승인</DialogTitle>
                  <DialogDescription>에스크로 상황에서 운영자가 수동으로 지급을 결정할 때 사용합니다. 중재 근거 자료를 첨부해주세요.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="text-sm text-muted-foreground">
                    <p>· 산출물 업로드 여부: 완료</p>
                    <p>· 최종 계약 금액: 200,000,000원</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setManualSettlementOpen(false)}>취소</Button>
                  <Button onClick={() => { setPendingAction("manual_settlement"); setManualSettlementOpen(false); setGateOpen(true); }}>수동 정산 실행</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* 4. 제재 */}
            <Dialog open={sanctionOpen} onOpenChange={setSanctionOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                  <ShieldAlert className="w-4 h-4 mr-1" />
                  제재
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>제재</DialogTitle>
                  <DialogDescription>계약 위반, 분쟁 등으로 인해 광고주 또는 파트너에게 제재를 부과할 때 사용합니다. 사유는 액션 로그에 기록됩니다.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label className="text-sm">제재 대상</Label>
                    <Select value={sanctionTarget} onValueChange={setSanctionTarget}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SANCTION_TARGETS.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">제재 유형</Label>
                    <Select value={sanctionType} onValueChange={setSanctionType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SANCTION_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSanctionOpen(false)}>취소</Button>
                  <Button variant="destructive" onClick={() => { setPendingAction("sanction"); setSanctionOpen(false); setGateOpen(true); }}>제재 실행</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span>사용자 수정 권한:</span>
            <span className={userEditEnabled ? "text-green-600 font-medium" : ""}>{userEditEnabled ? "활성 (Active)" : "잠금 (Locked)"}</span>
            <Switch checked={userEditEnabled} onCheckedChange={(c) => handleUserEditToggle(c, false)} />
          </div>
        </div>

        {/* 운영자 열람 로그 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 px-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
          <span className="font-medium text-foreground shrink-0">운영자 열람 로그</span>
          {allLogs.length > 0 ? (
            <span className="flex flex-wrap items-center gap-x-4">
              {allLogs.map((log, i) => (
                <span key={i}>{log.timestamp} · {log.adminId} 열람</span>
              ))}
            </span>
          ) : (
            <span>—</span>
          )}
        </div>

        {/* 액션 로그 (Audit Trail) — 누가, 언제, 왜 변경했는지 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-foreground text-sm mb-3">액션 로그</h3>
          <p className="text-xs text-muted-foreground mb-3">운영자가 개입·중재한 모든 기록이 프로젝트 상세 하단에 기록됩니다.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-2 px-3 text-left font-medium text-foreground">일시</th>
                  <th className="py-2 px-3 text-left font-medium text-foreground">운영자 ID</th>
                  <th className="py-2 px-3 text-left font-medium text-foreground">액션 구분</th>
                  <th className="py-2 px-3 text-left font-medium text-foreground">변경 전 상태</th>
                  <th className="py-2 px-3 text-left font-medium text-foreground">변경 후 상태</th>
                  <th className="py-2 px-3 text-left font-medium text-foreground">사유 (로그)</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-2 px-3 text-muted-foreground">{log.timestamp}</td>
                    <td className="py-2 px-3 text-muted-foreground">{log.adminId}</td>
                    <td className="py-2 px-3 text-muted-foreground">{log.action}</td>
                    <td className="py-2 px-3 text-muted-foreground">{log.before}</td>
                    <td className="py-2 px-3 text-muted-foreground">{log.after}</td>
                    <td className="py-2 px-3 text-muted-foreground">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AdminActionGate
        open={gateOpen}
        title={
          pendingAction === "force_status" ? "프로젝트 상태 강제 변경" :
          pendingAction === "unlock_edit" ? "수정 모드 활성화" :
          pendingAction === "manual_settlement" ? "수동 정산 실행" :
          pendingAction === "sanction" ? "제재" : "접근 확인"
        }
        description="비밀번호와 사유를 입력하면 액션이 실행됩니다. 사유는 감사 로그에 기록됩니다."
        reasonPlaceholder={
          pendingAction === "force_status" ? "예: 광고주 요청: 일정 오기로 인한 계약서 재작성 필요" :
          pendingAction === "unlock_edit" ? "예: 계약서 제3조 2항 금액 오타 수정 허용" :
          pendingAction === "sanction" ? "예: 계약 위반, 분쟁 등 제재 사유" :
          "예: 이메일 캡처, 통화 내역 메모 등"
        }
        onCancel={() => { setGateOpen(false); setPendingAction(null); }}
        onConfirm={handleGateConfirm}
      />
        </>
      )}
    </div>
  )
}
