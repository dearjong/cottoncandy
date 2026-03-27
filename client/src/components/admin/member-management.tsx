import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Shield, Building, X } from "lucide-react"
import { CompanyDetailTabs } from "@/components/admin/CompanyDetailTabs"

interface Member {
  id: string
  name: string
  email: string
  phone?: string
  company: string
  /** 기업 상세 팝업용 (있으면 클릭 시 회사 팝업 오픈) */
  companyId?: string | null
  type: '광고주' | '대행사' | '제작사' | '프리랜서'
  /** 기업 인증 여부 (회원 가입 승인은 없고 기업 인증만 있음) */
  companyVerified: boolean
  status: "normal" | "warning" | "suspended" | "withdrawn" | "banned"
  joinDate: string
  lastLogin: string
}

export function MemberManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState<"all" | Member["status"]>("all")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [openCompanyId, setOpenCompanyId] = useState<string | null>(null)

  // TODO: remove mock data - replace with real API data
  const initialMembers: Member[] = [
    {
      id: "MEM-001",
      name: "김철수",
      email: "kim@techstartup.co.kr",
      phone: "010-1234-5678",
      company: "(주)테크스타트업",
      companyId: "COM-004",
      type: "광고주",
      companyVerified: false,
      status: "normal",
      joinDate: "2024-06-15",
      lastLogin: "2024-06-15 14:30",
    },
    {
      id: "MEM-002",
      name: "이영희",
      email: "lee@creative.co.kr",
      phone: "010-2345-6789",
      company: "크리에이티브 에이전시",
      companyId: "COM-002",
      type: "대행사",
      companyVerified: true,
      status: "warning",
      joinDate: "2024-06-10",
      lastLogin: "2024-06-15 09:45",
    },
    {
      id: "MEM-003",
      name: "박애드",
      email: "park@videoworks.com",
      phone: "010-3456-7890",
      company: "비디오웍스",
      companyId: "COM-003",
      type: "제작사",
      companyVerified: true,
      status: "suspended",
      joinDate: "2024-06-08",
      lastLogin: "2024-06-14 16:20",
    },
    {
      id: "MEM-004",
      name: "정수진",
      email: "jung.freelancer@gmail.com",
      company: "개인",
      companyId: null,
      type: "프리랜서",
      companyVerified: false,
      status: "withdrawn",
      joinDate: "2024-06-14",
      lastLogin: "2024-06-14 11:15",
    },
  ]

  const [members, setMembers] = useState<Member[]>(initialMembers)

  const statusLabels = {
    normal: { label: "정상", color: "bg-green-500" },
    warning: { label: "경고", color: "bg-yellow-500" },
    suspended: { label: "활동중지", color: "bg-gray-500" },
    withdrawn: { label: "탈퇴", color: "bg-slate-400" },
    banned: { label: "영구강퇴", color: "bg-red-600" },
  } as const

  /** 목록 표시용: 활성(로그인 가능 계정) / 비활성 — 세부 상태는 ⋯ 메뉴에서 조치 */
  const getListStatusBadge = (status: Member["status"]) => {
    if (status === "withdrawn" || status === "banned" || status === "suspended") {
      return { label: "비활성", color: "bg-gray-400" as const }
    }
    return { label: "활성", color: "bg-green-500" as const }
  }

  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionTargetMember, setActionTargetMember] = useState<Member | null>(null)
  const [actionType, setActionType] = useState<"warn" | "unwarn" | "suspend" | "resume" | "ban" | null>(null)
  const [actionReason, setActionReason] = useState("")
  const [actionError, setActionError] = useState("")

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || member.type === typeFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const openActionForMember = (member: Member, type: "warn" | "unwarn" | "suspend" | "resume" | "ban") => {
    setActionTargetMember(member)
    setActionType(type)
    setActionReason("")
    setActionError("")
    setActionDialogOpen(true)
  }

  const handleConfirmAction = () => {
    if (!actionTargetMember || !actionType) return
    setActionError("")
    if (!actionReason.trim()) {
      setActionError("사유를 입력해 주세요.")
      return
    }

    const id = actionTargetMember.id
    const nextStatus = ((): Member["status"] => {
      if (actionType === "warn") return "warning"
      if (actionType === "unwarn") return "normal"
      if (actionType === "suspend") return "suspended"
      if (actionType === "resume") return "normal"
      return "banned"
    })()

    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m)))
    setSelectedMember((prev) => (prev?.id === id ? { ...prev, status: nextStatus } : prev))

    // TODO: replace with real audit-log API call
    console.log("[회원 관리 액션]", {
      memberId: id,
      actionType,
      reason: actionReason.trim(),
      timestamp: new Date().toISOString(),
    })

    setActionDialogOpen(false)
    setActionType(null)
    setActionTargetMember(null)
    setActionReason("")
  }

  return (
    <div className="space-y-6">
      <Card data-testid="card-member-management">
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="이름, 이메일 또는 회사명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-member-search"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40" data-testid="select-type-filter">
                <SelectValue placeholder="회원 타입" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="광고주">광고주</SelectItem>
                <SelectItem value="대행사">대행사</SelectItem>
                <SelectItem value="제작사">제작사</SelectItem>
                <SelectItem value="프리랜서">프리랜서</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-40" data-testid="select-status-filter">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="normal">정상</SelectItem>
                <SelectItem value="warning">경고</SelectItem>
                <SelectItem value="suspended">활동중지</SelectItem>
                <SelectItem value="withdrawn">탈퇴</SelectItem>
                <SelectItem value="banned">영구강퇴</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>회원</TableHead>
                  <TableHead>회사/소속</TableHead>
                  <TableHead>타입</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead>최근 로그인</TableHead>
                  <TableHead className="text-right w-[72px]">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id} data-testid={`row-member-${member.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span 
                              className="font-medium cursor-pointer hover:text-pink-600"
                              onClick={() => setSelectedMember(member)}
                            >
                              {member.name}
                            </span>
                            {member.companyVerified && (
                              <Shield className="h-3 w-3 text-green-500" title="기업 인증 완료" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-muted-foreground shrink-0" />
                        {member.companyId ? (
                          <button
                            type="button"
                            className="text-left hover:text-pink-600 hover:underline cursor-pointer"
                            onClick={() => setOpenCompanyId(member.companyId!)}
                          >
                            {member.company}
                          </button>
                        ) : (
                          <span>{member.company}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.type}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        <Badge className={`${getListStatusBadge(member.status).color} text-white`}>
                          {getListStatusBadge(member.status).label}
                        </Badge>
                        {member.status === "warning" && (
                          <span className="text-[11px] text-muted-foreground">세부: 경고</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{member.joinDate}</TableCell>
                    <TableCell className="text-sm">{member.lastLogin}</TableCell>
                    <TableCell className="text-right align-middle p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="px-2 text-lg leading-none text-gray-500 hover:text-gray-800 disabled:text-gray-300"
                            aria-label="회원 관리 액션"
                            title="회원 관리 액션"
                          >
                            …
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          {member.status === "withdrawn" || member.status === "banned" ? (
                            <>
                              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                탈퇴·강퇴 회원은 추가 조치가 제한됩니다.
                              </DropdownMenuLabel>
                            </>
                          ) : (
                            <>
                              {member.status !== "warning" ? (
                                <DropdownMenuItem onSelect={() => openActionForMember(member, "warn")}>
                                  경고
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onSelect={() => openActionForMember(member, "unwarn")}>
                                  경고 해제
                                </DropdownMenuItem>
                              )}
                              {member.status !== "suspended" ? (
                                <DropdownMenuItem onSelect={() => openActionForMember(member, "suspend")}>
                                  활동중지
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onSelect={() => openActionForMember(member, "resume")}>
                                  활동재개
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={() => openActionForMember(member, "ban")}
                              >
                                영구강퇴
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent data-testid="dialog-member-details">
          <DialogHeader>
            <DialogTitle>{selectedMember?.name} 회원 정보</DialogTitle>
            <DialogDescription>회원 상세 정보 및 관리</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">이메일</label>
                  <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">휴대폰</label>
                  <p className="text-sm text-muted-foreground">{selectedMember.phone ?? '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">회원 타입</label>
                  <p className="text-sm text-muted-foreground">{selectedMember.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">회사/소속</label>
                  <p className="text-sm text-muted-foreground">{selectedMember.company}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">기업 인증</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedMember.companyVerified ? '인증완료' : '미인증'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">가입일</label>
                  <p className="text-sm text-muted-foreground">{selectedMember.joinDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">최근 로그인</label>
                  <p className="text-sm text-muted-foreground">{selectedMember.lastLogin}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`${getListStatusBadge(selectedMember.status).color} text-white`}>
                    {getListStatusBadge(selectedMember.status).label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    (세부: {statusLabels[selectedMember.status].label})
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedMember.status === "withdrawn" || selectedMember.status === "banned" ? (
                  <Badge className={`${statusLabels[selectedMember.status].color} text-white`}>
                    {statusLabels[selectedMember.status].label}
                  </Badge>
                ) : (
                  <>
                    {selectedMember.status !== "warning" ? (
                      <Button size="sm" variant="outline" onClick={() => openActionForMember(selectedMember, "warn")}>
                        경고
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => openActionForMember(selectedMember, "unwarn")}>
                        경고 해제
                      </Button>
                    )}
                    {selectedMember.status !== "suspended" ? (
                      <Button size="sm" variant="outline" onClick={() => openActionForMember(selectedMember, "suspend")}>
                        활동중지
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => openActionForMember(selectedMember, "resume")}>
                        활동재개
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => openActionForMember(selectedMember, "ban")}>
                      영구강퇴
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMember(null)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 회원 제재/탈퇴 액션 다이얼로그 */}
      <Dialog
        open={actionDialogOpen}
        onOpenChange={(open) => {
          setActionDialogOpen(open)
          if (!open) {
            setActionType(null)
            setActionTargetMember(null)
            setActionReason("")
            setActionError("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "suspend"
                ? "활동중지"
                : actionType === "resume"
                  ? "활동재개"
                  : actionType === "warn"
                    ? "경고"
                    : actionType === "unwarn"
                      ? "경고 해제"
                      : "영구강퇴 처리"}
            </DialogTitle>
            <DialogDescription>
              사유를 입력해야만 실행됩니다. (목업: UI에서 상태만 변경)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium">사유</label>
            <Textarea
              value={actionReason}
              onChange={(e) => {
                setActionReason(e.target.value)
                setActionError("")
              }}
              placeholder="예: 부정행위 의심, 반복 문의로 인한 제한 등"
            />
            {actionError && <p className="text-sm text-destructive">{actionError}</p>}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialogOpen(false)
                setActionType(null)
                setActionTargetMember(null)
                setActionReason("")
              }}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleConfirmAction}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 회사 상세 팝업 (회사/소속 셀 클릭 시) */}
      <Dialog
        open={!!openCompanyId}
        onOpenChange={(open) => {
          if (!open) setOpenCompanyId(null)
        }}
      >
        <DialogContent className="max-w-6xl w-[1100px] h-[720px] max-h-[90vh] sm:top-[8vh] sm:translate-y-0 overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>기업 정보</DialogTitle>
          </DialogHeader>
          {openCompanyId && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <CompanyDetailTabs companyId={openCompanyId} showPortfolio={true} />
            </div>
          )}
          <div className="border-t pt-4 pb-1 flex justify-end shrink-0">
            <Button variant="outline" size="sm" onClick={() => setOpenCompanyId(null)}>
              <X className="h-4 w-4 mr-1" />
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}