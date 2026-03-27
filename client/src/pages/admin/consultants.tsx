import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

type Consultant = {
  id: string
  name: string
  company?: string
  expertise: string
  email?: string
  phone?: string
  status: "ACTIVE" | "PENDING"
  moderationStatus?: "normal" | "warning" | "suspended"
  joinDate: string
  projectCount?: number
}

const INITIAL_CONSULTANTS: Consultant[] = [
  {
    id: "CS-2401-001",
    name: "강전문",
    company: "컨설팅랩",
    expertise: "브랜딩, 전략컨설팅",
    email: "consult1@example.com",
    phone: "010-1234-5678",
    status: "ACTIVE",
    moderationStatus: "normal",
    joinDate: "2024-11-01",
    projectCount: 3,
  },
  {
    id: "CS-2402-002",
    name: "이마케팅",
    company: "마케팅파트너스",
    expertise: "디지털마케팅, 캠페인설계",
    status: "PENDING",
    moderationStatus: "normal",
    joinDate: "2024-11-15",
    projectCount: 0,
  },
]

export default function AdminConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>(INITIAL_CONSULTANTS)
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionTarget, setActionTarget] = useState<Consultant | null>(null)
  const [actionType, setActionType] = useState<"warn" | "unwarn" | "suspend" | "resume" | null>(null)
  const [actionReason, setActionReason] = useState("")
  const [actionError, setActionError] = useState("")
  const [form, setForm] = useState({
    name: "",
    company: "",
    expertise: "",
    email: "",
    phone: "",
  })

  const filtered = consultants.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      c.expertise.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    )
  })

  const openActionForConsultant = (c: Consultant, type: NonNullable<typeof actionType>) => {
    setActionTarget(c)
    setActionType(type)
    setActionReason("")
    setActionError("")
    setActionDialogOpen(true)
  }

  const handleConfirmAction = () => {
    if (!actionTarget || !actionType) return
    setActionError("")
    if (!actionReason.trim()) {
      setActionError("사유를 입력해 주세요.")
      return
    }

    const id = actionTarget.id
    const nextStatus: NonNullable<Consultant["moderationStatus"]> = (() => {
      if (actionType === "warn") return "warning"
      if (actionType === "unwarn") return "normal"
      if (actionType === "suspend") return "suspended"
      return "normal"
    })()

    setConsultants((prev) => prev.map((x) => (x.id === id ? { ...x, moderationStatus: nextStatus } : x)))

    // TODO: 실제 감사/이력 API 연동
    console.log("[컨설턴트 관리 액션]", {
      consultantId: id,
      actionType,
      reason: actionReason.trim(),
      timestamp: new Date().toISOString(),
    })

    setActionDialogOpen(false)
    setActionTarget(null)
    setActionType(null)
    setActionReason("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.expertise.trim()) return

    const newId = `CS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(
      consultants.length + 1
    ).padStart(3, "0")}`

    const next: Consultant = {
      id: newId,
      name: form.name.trim(),
      company: form.company.trim() || undefined,
      expertise: form.expertise.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      status: "PENDING",
      moderationStatus: "normal",
      joinDate: new Date().toISOString().slice(0, 10),
      projectCount: 0,
    }

    setConsultants((prev) => [next, ...prev])
    setForm({ name: "", company: "", expertise: "", email: "", phone: "" })
    setOpen(false)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">컨설턴트 관리</h1>
          <p className="text-muted-foreground">
            컨설턴트를 등록하고 컨설팅 문의 매칭에 활용합니다.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>컨설턴트 추가</Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Input
              placeholder="이름 / 회사 / 전문분야 / ID 검색"
              className="w-64 pl-3 pr-3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500 ml-auto">
            총 <span className="font-medium text-pink-600">{consultants.length}</span>명
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="w-24 text-xs font-medium text-gray-600 text-center whitespace-nowrap">
                    ID
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-600">이름</TableHead>
                  <TableHead className="text-xs font-medium text-gray-600">소속</TableHead>
                  <TableHead className="text-xs font-medium text-gray-600">전문분야</TableHead>
                  <TableHead className="w-24 text-xs font-medium text-gray-600 text-center whitespace-nowrap">
                    담당프로젝트
                  </TableHead>
                  <TableHead className="w-28 text-xs font-medium text-gray-600 text-center">
                    상태
                  </TableHead>
                  <TableHead className="w-28 text-xs font-medium text-gray-600 text-center">
                    등록일
                  </TableHead>
                  <TableHead className="w-[72px] text-xs font-medium text-gray-600 text-center">
                    액션
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-sm text-gray-500">
                      등록된 컨설턴트가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                  <TableRow key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="text-center font-mono text-xs text-gray-600 whitespace-nowrap">
                        {c.id}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">{c.name}</TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {c.company ?? "-"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">{c.expertise}</TableCell>
                      <TableCell className="text-center text-sm text-gray-700">
                        {c.projectCount ?? 0}건
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={c.status === "ACTIVE" ? "default" : "secondary"}
                          className={c.status === "ACTIVE" ? "" : "bg-gray-100 text-gray-700"}
                        >
                          {c.status === "ACTIVE" ? "활성" : "대기"}
                        </Badge>
                        {c.moderationStatus === "warning" && (
                          <div className="mt-1">
                            <Badge className="bg-yellow-500 text-white">경고</Badge>
                          </div>
                        )}
                        {c.moderationStatus === "suspended" && (
                          <div className="mt-1">
                            <Badge className="bg-gray-500 text-white">활동중지</Badge>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600 whitespace-nowrap">
                        {c.joinDate}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>조치</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {c.moderationStatus !== "warning" ? (
                              <DropdownMenuItem onClick={() => openActionForConsultant(c, "warn")}>
                                경고
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => openActionForConsultant(c, "unwarn")}>
                                경고 해제
                              </DropdownMenuItem>
                            )}
                            {c.moderationStatus !== "suspended" ? (
                              <DropdownMenuItem onClick={() => openActionForConsultant(c, "suspend")}>
                                활동중지
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => openActionForConsultant(c, "resume")}>
                                활동 재개
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>컨설턴트 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="consultant-name">이름</Label>
              <Input
                id="consultant-name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="예: 강전문"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultant-company">소속(선택)</Label>
              <Input
                id="consultant-company"
                value={form.company}
                onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="예: 컨설팅랩"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultant-expertise">전문분야</Label>
              <Input
                id="consultant-expertise"
                value={form.expertise}
                onChange={(e) => setForm((prev) => ({ ...prev, expertise: e.target.value }))}
                placeholder="예: 브랜딩, 전략컨설팅"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultant-email">이메일(선택)</Label>
              <Input
                id="consultant-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="예: consultant@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultant-phone">연락처(선택)</Label>
              <Input
                id="consultant-phone"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="예: 010-0000-0000"
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button type="submit">저장</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "warn"
                ? "경고 처리"
                : actionType === "unwarn"
                  ? "경고 해제"
                  : actionType === "suspend"
                    ? "활동중지"
                    : "활동 재개"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            {actionTarget && (
              <div className="text-sm text-muted-foreground">
                <div className="font-medium text-foreground">
                  {actionTarget.name} ({actionTarget.id})
                </div>
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">사유</span>
                <span className="text-xs text-gray-400">내부 기록용</span>
              </div>
              <Textarea
                value={actionReason}
                onChange={(e) => {
                  setActionReason(e.target.value)
                  if (actionError) setActionError("")
                }}
                placeholder="사유를 입력해 주세요."
                className="resize-none h-24 text-sm"
              />
              {actionError && <p className="text-xs text-red-500 mt-0.5">{actionError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setActionDialogOpen(false)
                setActionTarget(null)
                setActionType(null)
                setActionReason("")
                setActionError("")
              }}
            >
              취소
            </Button>
            <Button type="button" onClick={handleConfirmAction}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

