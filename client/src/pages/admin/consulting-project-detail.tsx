import { Link, useLocation } from "wouter"
import { useEffect, useMemo, useState } from "react"
import { Phone, Building2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { loadAllStoredWorkProjects } from "@/lib/work-consulting-projects"
import { MOCK_ADMIN_PROJECTS_V1 } from "@/data/mockData"

const dummyProjects = [
  { id: "C-001", title: "[(주)오리온] 더미 컨설팅 문의 1", client: "(주)오리온", phone: "010-1234-11" },
  { id: "C-002", title: "[(주)오리온] 더미 컨설팅 문의 2", client: "(주)오리온", phone: "010-1234-11" },
  { id: "C-003", title: "[(주)삼성] 마케팅 전략 컨설팅", client: "(주)삼성", phone: "010-5678-22" },
]

const consultants = [
  { id: "CON-001", name: "김컨설턴트", email: "kim@cotton.com" },
  { id: "CON-002", name: "이담당", email: "lee@cotton.com" },
  { id: "CON-003", name: "박매니저", email: "park@cotton.com" },
]

const progressSteps = ["접수", "진행중", "완료·종료", "확정 전"]

const messages = [
  {
    id: 1,
    icon: "📋",
    sender: "문의 접수",
    content: "더미 컨설팅 문의 2\n컨설팅 문의 더미 내용 2",
    date: "2026.03.20 09:00",
  },
  {
    id: 2,
    icon: "💬",
    sender: "김컨설턴트",
    content: "고객님 b채중으로 안내 문자 발송함.",
    date: "03.26 11:24",
  },
  {
    id: 3,
    icon: "💬",
    sender: "시스템",
    content: "[안녕] 안녕하세요. 배정된 담당자 김컨설턴트입니다. 금일 오후 2시에 연락드리겠습니다.",
    date: "03.26 11:25",
  },
]

const consultingResult = {
  serviceType: "직접 입력 (별도 협의)",
  serviceTypeSub: "맞춤 컨설팅 범위 및 금액 선정",
  resultType: "성공",
  scope: "브랜드 영상 1편 (30초), 소셜 3편 가이드 및 제작 진행",
  estimatedAmount: "5,000,000",
  paymentMethod: "무통장 입금 (세금계산서)",
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-border last:border-b-0">
      <div className="w-36 flex-shrink-0 text-sm text-muted-foreground font-medium">{label}</div>
      <div className="flex-1 text-sm text-foreground">
        {value || <span className="text-muted-foreground italic">미입력</span>}
      </div>
    </div>
  )
}

export type AdminConsultingProjectDetailPageProps = {
  projectId: string
}

export default function AdminConsultingProjectDetailPage({ projectId }: AdminConsultingProjectDetailPageProps) {
  const [, setLocation] = useLocation()

  const consultingRows = useMemo(() => {
    const fromMock = MOCK_ADMIN_PROJECTS_V1
      .filter((p) => p.type === "컨설팅")
      .map((p) => ({
        id: p.id,
        title: p.title,
        client: p.client,
        phone: "phone" in p && typeof p.phone === "string" ? p.phone.trim() || "—" : "—",
      }))

    if (typeof window === "undefined") return fromMock

    const fromStorage = loadAllStoredWorkProjects()
      .filter((p) => p.type === "컨설팅")
      .map((p) => ({
        id: p.id,
        title: p.title,
        client: p.client,
        phone: p.phone?.trim() || "—",
      }))

    const map = new Map<string, { id: string; title: string; client: string; phone: string }>()
    fromMock.forEach((r) => map.set(r.id, r))
    fromStorage.forEach((r) => map.set(r.id, r))
    return Array.from(map.values())
  }, [projectId])

  const projectOptions = useMemo(() => {
    const map = new Map<string, { id: string; title: string; client: string; phone: string }>()
    consultingRows.forEach((r) => map.set(r.id, r))
    dummyProjects.forEach((r) => {
      if (!map.has(r.id)) map.set(r.id, r)
    })
    if (!map.has(projectId)) {
      map.set(projectId, {
        id: projectId,
        title: projectId,
        client: "—",
        phone: "—",
      })
    }
    return Array.from(map.values())
  }, [consultingRows, projectId])

  const [currentStep, setCurrentStep] = useState(1)
  const [currentConsultant, setCurrentConsultant] = useState(consultants[0])

  const [isForceStatusOpen, setIsForceStatusOpen] = useState(false)
  const [forceStatusType, setForceStatusType] = useState<"종료" | "취소">("종료")
  const [forceStatusReason, setForceStatusReason] = useState("")

  const [isReassignOpen, setIsReassignOpen] = useState(false)
  const [reassignTarget, setReassignTarget] = useState("")
  const [reassignReason, setReassignReason] = useState("")
  const [reassignDone, setReassignDone] = useState(false)

  useEffect(() => {
    setReassignDone(false)
  }, [projectId])

  const currentProject = projectOptions.find((p) => p.id === projectId) ?? {
    id: projectId,
    title: projectId,
    client: "—",
    phone: "—",
  }

  const handleForceStatus = () => {
    setCurrentStep(2)
    setIsForceStatusOpen(false)
    setForceStatusReason("")
  }

  const handleReassign = () => {
    const target = consultants.find((c) => c.id === reassignTarget)
    if (target) setCurrentConsultant(target)
    setReassignDone(true)
    setIsReassignOpen(false)
    setReassignReason("")
    setReassignTarget("")
  }

  const consultantActionToolbar = (showLeadingDivider: boolean) => (
    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap" aria-label="담당 컨설턴트 및 처리">
      {showLeadingDivider && <div className="w-px h-5 bg-border" />}
      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 flex-shrink-0">
        {currentConsultant.name.charAt(0)}
      </div>
      <span className="text-sm text-foreground">{currentConsultant.name}</span>
      {reassignDone && <Badge className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 border-0">재배정됨</Badge>}
      <Button
        size="sm"
        variant="outline"
        className="h-9 text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
        onClick={() => setIsReassignOpen(true)}
      >
        컨설턴트 변경
      </Button>
      <div className="w-px h-5 bg-border" />
      <Button
        size="sm"
        variant="outline"
        className="h-9 text-xs border-orange-300 text-orange-600 hover:bg-orange-50"
        onClick={() => { setForceStatusType("종료"); setIsForceStatusOpen(true) }}
      >
        강제 종료
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-9 text-xs border-red-300 text-red-600 hover:bg-red-50"
        onClick={() => { setForceStatusType("취소"); setIsForceStatusOpen(true) }}
      >
        취소 처리
      </Button>
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">컨설팅 문의 상세</h1>
          <p className="text-muted-foreground text-sm mt-1">컨설턴트가 처리한 문의 내용을 모니터링합니다.</p>
        </div>
        <Link href="/admin/consulting">
          <Button variant="outline" size="sm">← 목록으로</Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={projectId}
          onValueChange={(id) => setLocation(`/admin/consulting/${encodeURIComponent(id)}`)}
        >
          <SelectTrigger className="flex-1 h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {projectOptions.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {consultantActionToolbar(true)}
      </div>

      <div className="bg-card border border-border rounded-lg px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="font-medium text-foreground text-sm">{currentProject.client}</span>
          <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground text-sm">{currentProject.phone}</span>
        </div>
        <div className="flex items-center gap-1">
          {progressSteps.map((step, idx) => (
            <div key={step} className="flex items-center gap-1">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                idx === currentStep
                  ? "bg-blue-500 text-white"
                  : idx < currentStep
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gray-100 text-gray-400"
              }`}>
                <span>{idx + 1}</span>
                <span>{step}</span>
              </div>
              {idx < progressSteps.length - 1 && (
                <div className={`w-4 h-px ${idx < currentStep ? "bg-gray-300" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">메시지 이력</h3>
          <p className="text-xs text-muted-foreground mt-0.5">컨설턴트와 고객 간 주고받은 메시지입니다.</p>
        </div>
        <div className="divide-y divide-border">
          {messages.map((msg) => (
            <div key={msg.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="text-xl flex-shrink-0 mt-0.5">{msg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-foreground text-sm">{msg.sender}</span>
                    <span className="text-xs text-muted-foreground">{msg.date}</span>
                  </div>
                  <div className="text-sm text-foreground whitespace-pre-line">{msg.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg px-5 py-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-500">🏢</span>
          <h3 className="font-bold text-foreground">컨설팅 결과 (컨설턴트 입력)</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">컨설턴트가 작성한 결과 내용입니다. 운영자는 조회만 가능합니다.</p>
        <div className="bg-muted/30 rounded-lg px-4 py-2">
          <ReadOnlyField label="서비스 유형" value={`${consultingResult.serviceType} — ${consultingResult.serviceTypeSub}`} />
          <ReadOnlyField label="결과 유형" value={consultingResult.resultType} />
          <ReadOnlyField label="컨설팅 범위" value={consultingResult.scope} />
          <ReadOnlyField label="확정 금액 (VAT별도)" value={`${Number(consultingResult.estimatedAmount).toLocaleString()}원`} />
          <ReadOnlyField label="결제 방법" value={consultingResult.paymentMethod} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-border">
        {consultantActionToolbar(false)}
        <Link href="/admin/consulting" className="sm:ml-auto sm:order-last">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">← 목록으로</Button>
        </Link>
      </div>

      <Dialog open={isForceStatusOpen} onOpenChange={setIsForceStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {forceStatusType === "종료" ? "⚠️ 강제 종료" : "🚫 취소 처리"}
            </DialogTitle>
            <DialogDescription>
              {forceStatusType === "종료"
                ? "이 컨설팅 문의를 강제 종료합니다. 컨설턴트와 고객에게 알림이 발송됩니다."
                : "이 컨설팅 문의를 취소 처리합니다. 진행 중인 내용이 모두 중단됩니다."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <p className="text-sm font-medium text-foreground">처리 사유 *</p>
            <Textarea
              value={forceStatusReason}
              onChange={(e) => setForceStatusReason(e.target.value)}
              placeholder={forceStatusType === "종료"
                ? "예: 고객 연락 두절, 3회 이상 미응답"
                : "예: 고객 요청으로 취소, 중복 문의 확인"}
              className="resize-none h-24 text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsForceStatusOpen(false)}>취소</Button>
            <Button
              disabled={!forceStatusReason.trim()}
              onClick={handleForceStatus}
              className={forceStatusType === "종료"
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"}
            >
              {forceStatusType === "종료" ? "강제 종료" : "취소 처리"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>컨설턴트 재배정</DialogTitle>
            <DialogDescription>
              현재 담당: <strong>{currentConsultant.name}</strong> — 새 담당자를 선택해 주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">새 담당 컨설턴트 *</p>
              <Select value={reassignTarget} onValueChange={setReassignTarget}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="컨설턴트 선택" />
                </SelectTrigger>
                <SelectContent>
                  {consultants
                    .filter((c) => c.id !== currentConsultant.id)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">재배정 사유</p>
              <Textarea
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="예: 담당자 휴가, 업무 과부하, 전문 분야 미일치"
                className="resize-none h-20 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReassignOpen(false)}>취소</Button>
            <Button
              disabled={!reassignTarget}
              onClick={handleReassign}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              재배정 확정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
