/**
 * 절차별: 제안서·시안 보기 — 운영자 화면
 * 평소 비공개. '클레임/분쟁 발생' 클릭 시 로그 남기고 열람 가능
 */
import { useState, useEffect } from "react"
import { Link, useParams, useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ProposalDisputeGate } from "@/components/admin/proposal-dispute-gate"
import { AdminActionGate } from "@/components/admin/admin-action-gate"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { FileText, Download, ExternalLink, RotateCcw, Unlock, Wallet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CONCEPT_TABS = [
  { value: "concept1", label: "Concept1 - 젤리" },
  { value: "concept2", label: "Concept2 - 곰" },
  { value: "concept3", label: "Concept3 - 봄날의 곰" },
  { value: "concept4", label: "Concept4 - 솜사탕" },
]

const MOCK_CONCEPT = `[베스트전자] 스탠바이미2 판매촉진 프로모션은 제품의 핵심 특성인 '이동성과 감성적 사용 경험'을 소비자의 일상 속에서 자연스럽게 스며들도록 제안하는 캠페인입니다.

이노션은 '움직이는 무드, 나만의 TV'라는 메시지 아래, 스탠바이미2를 감성적으로 각인시키는 영상 중심의 체험 기반 콘텐츠를 제시합니다.

이번 프로젝트는 제품 인지도 제고, 감성 브랜드 포지셔닝, 구매 전환율 상승을 주요 KPI로 설정하여 MZ세대와 1인 가구 중심의 고객에게 다가갑니다.`

const MOCK_PROPOSAL_FILES = [
  { name: "Strategic Proposal.pdf", label: "전략 제안서" },
  { name: "Creative Proposal.pdf", label: "크리에이티브 제안서" },
]

const MOCK_SIANS = [
  { no: "시안1", title: "봄날의 젤리을 좋아하세요?", desc: "스탠바이미2의 부드럽고 감성적인 이미지와 함께, 사용자의 일상에 따뜻하게 스며드는 스토리를 전개. 벚꽃 아래 분홍 곰과의 교감으로 브랜드 친밀도를 높임.", model: "박보영", cost: "6억" },
  { no: "시안2", title: "봄날의 젤리을 좋아하세요?", desc: "모델이 젤리인형을 안고 행복해 한다.", model: "박보영", cost: "6억" },
  { no: "시안3", title: "봄날의 젤리을 좋아하세요?", desc: "모델이 젤리인형을 안고 행복해 한다.", model: "박보영", cost: "6억" },
  { no: "시안4", title: "봄날의 젤리을 좋아하세요?", desc: "모델이 젤리인형을 안고 행복해 한다.", model: "박보영", cost: "6억" },
]

const MOCK_DOCUMENTS = [
  { name: "[HSAD] 포트폴리오_20250807.pdf", type: "포트폴리오", date: "2024-04-06" },
  { name: "[HSAD] 회사소개서 2025.pdf", type: "회사소개서", date: "2024-04-06" },
  { name: "[HSAD] 프로젝트 기획서 2025.pdf", type: "프로젝트 기획서", date: "2024-04-06" },
]

const MOCK_COMPANY_NAMES: Record<string, string> = {
  "1": "솜사탕애드",
  "2": "목화솜기획",
  "3": "광고천재",
  "4": "웃음꽃기획",
  "5": "무지개애드",
  "6": "블루밍기획",
}

const MOCK_OPERATOR_LOGS: Record<string, { timestamp: string; adminId: string }[]> = {
  "1": [{ timestamp: "2025.01.15 14:30", adminId: "admin1" }],
  "2": [],
  "3": [],
  "4": [
    { timestamp: "2025.01.14 11:20", adminId: "admin1" },
    { timestamp: "2025.01.14 15:45", adminId: "admin2" },
  ],
  "5": [],
  "6": [],
}

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

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { timestamp: "2026-03-10", adminId: "admin_01", action: "상태 강제 변경", before: "제작 중", after: "제안서 검토", reason: "광고주 요청: 일정 오기로 인한 계약서 재작성 필요" },
  { timestamp: "2026-03-11", adminId: "admin_02", action: "수정 권한 부여", before: "잠금 (Locked)", after: "활성 (Active)", reason: "제안서 금액 오타 수정 허용" },
]

function formatTimestamp() {
  return new Date().toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\. /g, ".").replace(/\.$/, "")
}

export default function AdminWorkflowProposalView() {
  const params = useParams<{ companyId: string }>()
  const [, setLocation] = useLocation()
  const companyId = params.companyId ?? "1"
  const companyName = MOCK_COMPANY_NAMES[companyId] ?? "솜사탕애드"
  const [unlocked, setUnlocked] = useState(false)
  const [allLogs, setAllLogs] = useState<{ timestamp: string; adminId: string }[]>([])
  const [userEditEnabled, setUserEditEnabled] = useState(false)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS)
  const [forceStatusOpen, setForceStatusOpen] = useState(false)
  const [unlockEditOpen, setUnlockEditOpen] = useState(false)
  const [manualSettlementOpen, setManualSettlementOpen] = useState(false)
  const [statusChangeType, setStatusChangeType] = useState("rollback")
  const [statusChangeTarget, setStatusChangeTarget] = useState("제안서 검토")
  const [currentProjectStatus, setCurrentProjectStatus] = useState("계약중")
  const [gateOpen, setGateOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<"force_status" | "unlock_edit" | "manual_settlement" | null>(null)
  const isEmbed = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embed") === "1"

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

  const handleGateConfirm = (reason: string) => {
    if (pendingAction === "force_status") executeForceStatusChange(reason)
    else if (pendingAction === "unlock_edit") handleUserEditToggle(true, true, reason)
    else if (pendingAction === "manual_settlement") executeManualSettlement(reason)
    setGateOpen(false)
    setPendingAction(null)
  }

  useEffect(() => {
    if (unlocked) {
      const existing = MOCK_OPERATOR_LOGS[companyId] ?? []
      const newLog = {
        timestamp: new Date().toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\. /g, ".").replace(/\.$/, ""),
        adminId: localStorage.getItem("adminId") ?? "unknown",
      }
      setAllLogs([...existing, newLog])
      console.log("[제안서·시안 열람 로그] 운영자 열람", { ...newLog, companyId, companyName })
    }
  }, [unlocked, companyId, companyName])

  const body = (
    <div className="space-y-6">
        {/* 전체 컨셉 안내 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-base font-semibold text-foreground mb-3">전체 컨셉 안내</h2>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Concept Overview</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{MOCK_CONCEPT}</p>
        </div>

        {/* 제안서 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">제안서</h2>
          <p className="text-sm text-muted-foreground mb-3">[베스트전자] TV 신제품 판매촉진 프로모션</p>
          <p className="text-sm font-medium text-foreground mb-4">[{companyName}] Version.1</p>
          <div className="space-y-2">
            {MOCK_PROPOSAL_FILES.map((f) => (
              <div key={f.name} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-foreground">{f.name}</span>
                <span className="text-sm text-muted-foreground">— {f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 시안 테이블 + 탭 */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground mb-3">컨셉·시안</h2>
            <Tabs defaultValue="concept1" className="w-full">
              <TabsList className="bg-muted p-0.5 h-auto flex flex-wrap gap-1">
                {CONCEPT_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded px-3 py-2 text-sm"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {CONCEPT_TABS.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium text-foreground w-20">No.</th>
                          <th className="py-3 px-4 text-left font-medium text-foreground">영상/이미지</th>
                          <th className="py-3 px-4 text-left font-medium text-foreground">제목/설명</th>
                          <th className="py-3 px-4 text-left font-medium text-foreground w-24">모델</th>
                          <th className="py-3 px-4 text-left font-medium text-foreground w-24">제작비</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_SIANS.map((row) => (
                          <tr key={row.no} className="border-b border-border hover:bg-muted/30">
                            <td className="py-3 px-4 text-muted-foreground">{row.no}</td>
                            <td className="py-3 px-4 text-muted-foreground">—</td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-foreground">{row.title}</div>
                                <div className="text-muted-foreground text-xs mt-0.5">{row.desc}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{row.model}</td>
                            <td className="py-3 px-4 text-muted-foreground">{row.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-3 bg-muted/30 text-sm text-muted-foreground">
                    제작비 6억원 · 총견적 20억원
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* 회사소개서 & 포트폴리오 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-base font-semibold text-foreground mb-3">회사소개서 & 포트폴리오</h2>
          <Link
            href="/work/project/company-profile"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/90 text-sm font-medium"
          >
            💼 [{companyName}] 기본 회사소개서 & 포트폴리오
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* 제출문서 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">제출문서</h2>
          <ul className="space-y-2 mb-4">
            {MOCK_DOCUMENTS.map((f) => (
              <li key={f.name} className="flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{f.name}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">{f.type}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">{f.date}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            전체파일 다운로드
          </Button>
        </div>

        {/* 자료열람기간 안내 */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200">
          <h3 className="font-semibold mb-2">[자료열람기간]</h3>
          <p>※ 선정된 기업의 자료는 프로젝트 종료 후 6개월까지 열람이 가능합니다.</p>
          <p className="mt-1">※ 미선정된 기업의 자료는 의뢰기업에 즉시 비공개되며, 자료를 업로드한 참여기업은 등록 후 6개월까지 확인 가능합니다.</p>
        </div>

        {/* 개입 및 중재 (Admin IA) */}
        {!isEmbed && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-foreground text-sm mb-2">개입 및 중재</h3>
          <p className="text-xs text-muted-foreground mb-4">프로세스가 꼬인 경우 운영자가 특정 이슈를 해결하기 위해 사용하는 기능입니다.</p>
          <div className="flex flex-wrap gap-3">
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
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span>사용자 수정 권한:</span>
            <span className={userEditEnabled ? "text-green-600 font-medium" : ""}>{userEditEnabled ? "활성 (Active)" : "잠금 (Locked)"}</span>
            <Switch checked={userEditEnabled} onCheckedChange={(c) => handleUserEditToggle(c, false)} />
          </div>
        </div>
        )}

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

        {/* 액션 로그 (Audit Trail) */}
        {!isEmbed && (
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
        )}

        <AdminActionGate
          open={gateOpen}
          title={
            pendingAction === "force_status" ? "프로젝트 상태 강제 변경" :
            pendingAction === "unlock_edit" ? "수정 모드 활성화" :
            pendingAction === "manual_settlement" ? "수동 정산 실행" : "접근 확인"
          }
          description="비밀번호와 사유를 입력하면 액션이 실행됩니다. 사유는 감사 로그에 기록됩니다."
          reasonPlaceholder={
            pendingAction === "force_status" ? "예: 광고주 요청: 일정 오기로 인한 계약서 재작성 필요" :
            pendingAction === "unlock_edit" ? "예: 계약서 제3조 2항 금액 오타 수정 허용" :
            "예: 이메일 캡처, 통화 내역 메모 등"
          }
          onCancel={() => { setGateOpen(false); setPendingAction(null); }}
          onConfirm={handleGateConfirm}
        />
      </div>
  )

  if (isEmbed) {
    // 팝업/임베드에서는 헤더 없이, 보안 게이트 + 바디만 출력
    return (
      <div className="p-4 space-y-4">
        <ProposalDisputeGate
          open={!unlocked}
          companyName={companyName}
          onCancel={() => setLocation("/admin/workflow/proposal")}
          onClaimDispute={() => setUnlocked(true)}
        />

        {!unlocked && (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
            클레임/분쟁 발생 시에만 상세 자료를 열람할 수 있습니다.
          </div>
        )}

        {unlocked && body}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <ProposalDisputeGate
        open={!unlocked}
        companyName={companyName}
        onCancel={() => setLocation("/admin/workflow/proposal")}
        onClaimDispute={() => setUnlocked(true)}
      />

      {!unlocked && (
        <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
          클레임/분쟁 발생 시에만 상세 자료를 열람할 수 있습니다.
        </div>
      )}

      {unlocked && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">제안서·시안 (보기)</h1>
            <Link href="/admin/workflow/proposal">
              <Button variant="outline" size="sm">제출현황으로 돌아가기</Button>
            </Link>
          </div>

          {body}
        </>
      )}
    </div>
  )
}
