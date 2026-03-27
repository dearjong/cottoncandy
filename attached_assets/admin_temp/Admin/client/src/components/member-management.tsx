import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Eye, UserCheck, UserX, Shield, Building } from "lucide-react"

interface Member {
  id: string
  name: string
  email: string
  company: string
  type: '광고주' | '대행사' | '제작사' | '프리랜서'
  status: '대기' | '승인' | '반려' | '정지'
  joinDate: string
  lastLogin: string
  isVerified: boolean
}

export function MemberManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // TODO: remove mock data - replace with real API data
  const members: Member[] = [
    {
      id: "MEM-001",
      name: "김철수",
      email: "kim@techstartup.co.kr",
      company: "(주)테크스타트업",
      type: "광고주",
      status: "대기",
      joinDate: "2024-06-15",
      lastLogin: "2024-06-15 14:30",
      isVerified: false
    },
    {
      id: "MEM-002",
      name: "이영희",
      email: "lee@creative.co.kr",
      company: "크리에이티브 에이전시",
      type: "대행사",
      status: "승인",
      joinDate: "2024-06-10",
      lastLogin: "2024-06-15 09:45",
      isVerified: true
    },
    {
      id: "MEM-003",
      name: "박민수",
      email: "park@videoworks.com",
      company: "비디오웍스",
      type: "제작사",
      status: "승인",
      joinDate: "2024-06-08",
      lastLogin: "2024-06-14 16:20",
      isVerified: true
    },
    {
      id: "MEM-004",
      name: "정수진",
      email: "jung.freelancer@gmail.com",
      company: "개인",
      type: "프리랜서",
      status: "대기",
      joinDate: "2024-06-14",
      lastLogin: "2024-06-14 11:15",
      isVerified: false
    },
  ]

  const getStatusBadge = (status: Member['status']) => {
    const variants = {
      '대기': 'secondary',
      '승인': 'default',
      '반려': 'destructive',
      '정지': 'destructive'
    }
    return variants[status] as any
  }

  const getTypeBadge = (type: Member['type']) => {
    const variants = {
      '광고주': 'default',
      '대행사': 'secondary',
      '제작사': 'outline',
      '프리랜서': 'secondary'
    }
    return variants[type] as any
  }

  const handleMemberAction = (memberId: string, action: 'approve' | 'reject' | 'suspend') => {
    console.log(`Member ${memberId} ${action}`)
    // TODO: replace with real API call
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || member.type === typeFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      <Card data-testid="card-member-management">
        <CardHeader>
          <CardTitle>회원 관리</CardTitle>
        </CardHeader>
        <CardContent>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40" data-testid="select-status-filter">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="대기">승인 대기</SelectItem>
                <SelectItem value="승인">승인</SelectItem>
                <SelectItem value="반려">반려</SelectItem>
                <SelectItem value="정지">정지</SelectItem>
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
                  <TableHead>액션</TableHead>
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
                            <span className="font-medium">{member.name}</span>
                            {member.isVerified && (
                              <Shield className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        {member.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadge(member.type)}>
                        {member.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.joinDate}</TableCell>
                    <TableCell className="text-sm">{member.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              data-testid={`button-view-member-${member.id}`}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              상세
                            </Button>
                          </DialogTrigger>
                          <DialogContent data-testid={`dialog-member-details-${member.id}`}>
                            <DialogHeader>
                              <DialogTitle>{member.name} 회원 정보</DialogTitle>
                              <DialogDescription>회원 상세 정보 및 관리</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">이메일</label>
                                  <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">회원 타입</label>
                                  <p className="text-sm text-muted-foreground">{member.type}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">회사/소속</label>
                                  <p className="text-sm text-muted-foreground">{member.company}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">인증 상태</label>
                                  <p className="text-sm text-muted-foreground">
                                    {member.isVerified ? '인증됨' : '미인증'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <DialogFooter className="gap-2">
                              {member.status === '대기' && (
                                <>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleMemberAction(member.id, 'reject')}
                                    data-testid={`button-reject-member-${member.id}`}
                                  >
                                    <UserX className="h-4 w-4 mr-1" />
                                    반려
                                  </Button>
                                  <Button
                                    onClick={() => handleMemberAction(member.id, 'approve')}
                                    data-testid={`button-approve-member-${member.id}`}
                                  >
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    승인
                                  </Button>
                                </>
                              )}
                              {member.status === '승인' && (
                                <Button
                                  variant="destructive"
                                  onClick={() => handleMemberAction(member.id, 'suspend')}
                                  data-testid={`button-suspend-member-${member.id}`}
                                >
                                  정지
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        {member.status === '대기' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMemberAction(member.id, 'reject')}
                              data-testid={`button-quick-reject-member-${member.id}`}
                            >
                              <UserX className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleMemberAction(member.id, 'approve')}
                              data-testid={`button-quick-approve-member-${member.id}`}
                            >
                              <UserCheck className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}