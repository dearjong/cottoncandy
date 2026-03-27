import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Folder, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Pencil,
  Save,
  User
} from "lucide-react"
import { useLocation, useParams, Link } from "wouter"
import { MOCK_ADMIN_COMPANIES_V1, MOCK_ADMIN_PROJECTS_V1 } from "@/data/mockData"
import { MainStatusLabels } from "@/types/project-status"
import { ProcessStepper, getProjectSteps, getActiveStepIndexFromMainStatus } from "@/components/project/ProcessStepper"

interface Member {
  id: string
  name: string
  nickname: string
  department: string
  position: string
  role: '대표관리자' | '부관리자' | '일반직원'
  email: string
  phone?: string
  status: 'active' | 'inactive' | 'pending'
  joinedAt: string
  lastLoginAt?: string
  projectCount?: number
}

const mockMembers: Member[] = [
  { id: '1', name: '이애드', nickname: '왕솜사탕', department: '경영지원', position: '대표이사', role: '대표관리자', email: 'king@somsatang.com', phone: '010-1234-5678', status: 'active', joinedAt: '2024-01-15', lastLoginAt: '2025-01-20', projectCount: 8 },
  { id: '2', name: '김애드', nickname: '중솜사탕', department: '기획', position: '부장', role: '부관리자', email: 'middle@somsatang.com', phone: '010-2345-6789', status: 'active', joinedAt: '2024-01-20', lastLoginAt: '2025-01-19', projectCount: 5 },
  { id: '3', name: '나애드', nickname: '솜사탕', department: '마케팅', position: '차장', role: '부관리자', email: 'na@somsatang.com', phone: '010-3456-7890', status: 'active', joinedAt: '2024-02-01', lastLoginAt: '2025-01-18', projectCount: 3 },
  { id: '4', name: '박에드', nickname: '미니사탕', department: '디자인', position: '과장', role: '일반직원', email: 'mini@somsatang.com', phone: '010-4567-8901', status: 'inactive', joinedAt: '2024-02-15', lastLoginAt: '2024-12-01', projectCount: 2 },
  { id: '5', name: '차환류', nickname: '새사탕', department: '-', position: '-', role: '일반직원', email: 'cha@somsatang.com', status: 'pending', joinedAt: '2024-03-01' },
]

const companyProfiles: Record<string, {
  address: string;
  addressDetail: string;
  zipCode: string;
  website?: string;
  intro: string;
  foundedYear: string;
  foundedMonth: string;
  companySize: string;
  employeeCount: string;
}> = {
  "COM-001": {
    address: "서울 강남구 테헤란로 123",
    addressDetail: "크리에이티브빌딩 3층",
    zipCode: "06234",
    website: "www.creativelab.com",
    intro: "크리에이티브 중심의 영상 제작 전문 기업",
    foundedYear: "2018",
    foundedMonth: "3",
    companySize: "중소기업",
    employeeCount: "20명 이상",
  },
  "COM-002": {
    address: "서울 마포구 월드컵북로 98",
    addressDetail: "스마트타워 7층",
    zipCode: "03992",
    website: "www.smartagency.kr",
    intro: "브랜딩부터 집행까지 종합대행을 제공합니다.",
    foundedYear: "2016",
    foundedMonth: "7",
    companySize: "중소기업",
    employeeCount: "10명 이상",
  },
  "COM-003": {
    address: "경기 성남시 분당구 판교로 25",
    addressDetail: "비주얼센터 2층",
    zipCode: "13488",
    intro: "촬영 중심의 프로덕션. 급행 제작 대응 가능.",
    foundedYear: "2020",
    foundedMonth: "1",
    companySize: "소기업",
    employeeCount: "10명 미만",
  },
  "COM-004": {
    address: "서울 영등포구 여의대로 100",
    addressDetail: "테크브랜드 본사 12층",
    zipCode: "07326",
    website: "www.techbrand.co.kr",
    intro: "테크 제품 기반의 브랜드 마케팅을 운영합니다.",
    foundedYear: "2012",
    foundedMonth: "9",
    companySize: "중견기업",
    employeeCount: "50명 이상",
  },
}

const roleColors = {
  '대표관리자': 'bg-purple-500',
  '부관리자': 'bg-blue-500',
  '일반직원': 'bg-gray-400',
}

const statusLabels = {
  active: { label: "활동중", color: "bg-green-500" },
  inactive: { label: "활동중지", color: "bg-gray-400" },
  pending: { label: "승인대기", color: "bg-yellow-500" },
}

const STORAGE_KEY_ADMIN_MOCK_COMPANIES_V1 = "cottoncandy_admin_mock_companies_v1"
const STORAGE_KEY_ADMIN_MOCK_MEMBERS_PREFIX = "cottoncandy_admin_mock_company_members_v1_"

export default function AdminCompanyDetail() {
  const params = useParams()
  const [location, setLocation] = useLocation()
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [members, setMembers] = useState<Member[]>(() => [...mockMembers])

  const [memberActionDialogOpen, setMemberActionDialogOpen] = useState(false)
  const [memberActionType, setMemberActionType] = useState<"suspend" | "resume" | "withdraw" | null>(null)
  const [memberActionReason, setMemberActionReason] = useState("")
  const [memberActionError, setMemberActionError] = useState("")

  const companyId = (params as { id?: string } | null)?.id
  const companiesSource = (() => {
    if (typeof window === "undefined") return MOCK_ADMIN_COMPANIES_V1 as any
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ADMIN_MOCK_COMPANIES_V1)
      if (!raw) return MOCK_ADMIN_COMPANIES_V1 as any
      const parsed = JSON.parse(raw) as any[]
      if (!Array.isArray(parsed)) return MOCK_ADMIN_COMPANIES_V1 as any
      return parsed
    } catch {
      return MOCK_ADMIN_COMPANIES_V1 as any
    }
  })()
  const company = companiesSource.find((c) => c.id === companyId) ?? companiesSource[0]

  const profile = companyProfiles[company?.id] ?? companyProfiles["COM-001"]

  useEffect(() => {
    if (!companyId) return
    if (typeof window === "undefined") return
    try {
      const key = `${STORAGE_KEY_ADMIN_MOCK_MEMBERS_PREFIX}${companyId}`
      const raw = localStorage.getItem(key)
      if (!raw) {
        setMembers([...mockMembers])
        return
      }
      const parsed = JSON.parse(raw) as Member[]
      if (!Array.isArray(parsed)) {
        setMembers([...mockMembers])
        return
      }
      setMembers(parsed)
    } catch {
      setMembers([...mockMembers])
    }
  }, [companyId])

  useEffect(() => {
    if (!companyId) return
    if (typeof window === "undefined") return
    try {
      const key = `${STORAGE_KEY_ADMIN_MOCK_MEMBERS_PREFIX}${companyId}`
      localStorage.setItem(key, JSON.stringify(members))
    } catch {
      // ignore
    }
  }, [companyId, members])

  const projectsAll = MOCK_ADMIN_PROJECTS_V1.filter(
    (p) => p.ownerCompanyId === company?.id || (p.participantCompanyIds ?? []).includes(company?.id)
  )
  const projectsOwned = MOCK_ADMIN_PROJECTS_V1.filter((p) => p.ownerCompanyId === company?.id)
  const projectsParticipating = MOCK_ADMIN_PROJECTS_V1.filter((p) =>
    (p.participantCompanyIds ?? []).includes(company?.id)
  )

  const filteredMembers = members.filter(member =>
    member.name.includes(searchTerm) ||
    member.email.includes(searchTerm) ||
    member.department.includes(searchTerm)
  )

  const activeMembers = members.filter((m) => m.status === "active").length
  const inactiveMembers = members.filter((m) => m.status === "inactive").length
  const pendingMembers = members.filter((m) => m.status === "pending").length

  const tabFromUrl = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("tab")
    : null
  const initialTab: "info" | "projects" | "portfolio" | "members" =
    tabFromUrl === "members" ? "members"
    : tabFromUrl === "portfolio" ? "portfolio"
    : tabFromUrl === "projects" ? "projects"
    : "info"
  const [activeTab, setActiveTab] = useState<"info" | "projects" | "portfolio" | "members">(initialTab)

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <AdminBackButton href="/admin/companies" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{company.companyName}</h1>
              <Badge variant="outline">{company.companyType}</Badge>
              {company.status === "inactive" ? (
                <Badge className="bg-gray-400 text-white">비활성</Badge>
              ) : company.status === "pending" ? (
                <Badge className="bg-yellow-500 text-white">대기</Badge>
              ) : (
                <Badge className="bg-green-500 text-white">활성</Badge>
              )}
              {company.verificationStatus === "rejected" ? (
                <Badge className="bg-red-500 text-white">
                  <XCircle className="h-3 w-3 mr-1" />
                  인증거부
                </Badge>
              ) : company.verificationStatus === "pending" ? (
                <Badge className="bg-yellow-500 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  인증대기
                </Badge>
              ) : (
                <Badge className="bg-blue-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  인증완료
                </Badge>
              )}
            </div>
            {company.companyNameEn && (
              <p className="text-muted-foreground mt-1">{company.companyNameEn}</p>
            )}
          </div>
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>취소</Button>
                <Button onClick={() => { setIsEditMode(false); alert('저장되었습니다.') }}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditMode(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                수정
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="info">회사 정보</TabsTrigger>
            <TabsTrigger value="projects">프로젝트</TabsTrigger>
            <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
            <TabsTrigger value="members">구성원</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-0">
            <div className="grid grid-cols-3 gap-6">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">기업 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">대표자</p>
                      <p className="font-medium">{company.representativeName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">사업자등록번호</p>
                      <p className="font-medium font-mono">{company.businessNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">설립년월</p>
                      <p className="font-medium">{profile.foundedYear}년 {profile.foundedMonth}월</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">기업규모</p>
                      <p className="font-medium">{profile.companySize}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">직원수</p>
                      <p className="font-medium">{profile.employeeCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">세부유형</p>
                      <p className="font-medium">{company.subType ?? "-"}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-muted-foreground text-sm mb-1">한줄소개</p>
                    <p className="font-medium">{profile.intro}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">연락처</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{company.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{company.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>[{profile.zipCode}]</p>
                      <p>{profile.address}</p>
                      <p>{profile.addressDetail}</p>
                    </div>
                  </div>
                  {profile.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-0">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Folder className="h-5 w-5" />
                    프로젝트
                  </CardTitle>
                  <Link href="/admin/projects" className="text-sm text-muted-foreground hover:text-foreground">
                    전체 프로젝트 보기
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">전체 ({projectsAll.length})</TabsTrigger>
                    <TabsTrigger value="owned">의뢰/등록 ({projectsOwned.length})</TabsTrigger>
                    <TabsTrigger value="participating">참여 ({projectsParticipating.length})</TabsTrigger>
                  </TabsList>
                  {(
                    [
                      { key: "all", list: projectsAll },
                      { key: "owned", list: projectsOwned },
                      { key: "participating", list: projectsParticipating },
                    ] as const
                  ).map(({ key, list }) => (
                    <TabsContent key={key} value={key}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-28">ID</TableHead>
                            <TableHead>프로젝트명</TableHead>
                            <TableHead className="w-20 text-center">타입</TableHead>
                            <TableHead className="w-28 text-center">진행</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {list.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                연결된 프로젝트가 없습니다
                              </TableCell>
                            </TableRow>
                          ) : (
                            list.map((p) => (
                              <TableRow key={p.id}>
                                <TableCell className="font-mono text-sm">{p.id}</TableCell>
                                <TableCell>
                                  <Link
                                    href={`/admin/projects/${p.id}`}
                                    className="font-medium hover:text-pink-600"
                                  >
                                    {p.title}
                                  </Link>
                                  <div className="text-xs text-muted-foreground mt-1">{MainStatusLabels[p.status as keyof typeof MainStatusLabels] ?? p.status}</div>
                                </TableCell>
                                <TableCell className="text-center text-sm text-muted-foreground">{p.type}</TableCell>
                                <TableCell className="text-center">
                                  <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-sm text-gray-600">{MainStatusLabels[p.status as keyof typeof MainStatusLabels] ?? p.status}</span>
                                    <ProcessStepper
                                      currentStepIndex={getActiveStepIndexFromMainStatus(
                                        p.status,
                                        getProjectSteps(p.type === "1:1" ? "1:1" : "PUBLIC")
                                      )}
                                      steps={getProjectSteps(p.type === "1:1" ? "1:1" : "PUBLIC")}
                                      mode="MINI"
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-0">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">회사소개서 & 포트폴리오</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden min-h-[360px]">
                  <iframe
                    title="회사소개서·포트폴리오"
                    src="/work/project/company-profile?embed=1"
                    className="w-full h-[900px] bg-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    구성원 목록
                  </CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="이름, 이메일, 부서 검색"
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">전체 ({mockMembers.length})</TabsTrigger>
                    <TabsTrigger value="active">활동중 ({activeMembers})</TabsTrigger>
                    <TabsTrigger value="inactive">활동중지 ({inactiveMembers})</TabsTrigger>
                    <TabsTrigger value="pending">승인대기 ({pendingMembers})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>이름</TableHead>
                          <TableHead>닉네임</TableHead>
                          <TableHead>부서</TableHead>
                          <TableHead>직위</TableHead>
                          <TableHead>권한</TableHead>
                          <TableHead>이메일</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>가입일</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.map((member) => {
                          const statusInfo = statusLabels[member.status]
                          return (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium cursor-pointer hover:text-pink-600" onClick={() => setSelectedMember(member)}>{member.name}</TableCell>
                              <TableCell>{member.nickname}</TableCell>
                              <TableCell>{member.department}</TableCell>
                              <TableCell>{member.position}</TableCell>
                              <TableCell>
                                <Badge className={`${roleColors[member.role]} text-white`}>
                                  {member.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{member.email}</TableCell>
                              <TableCell>
                                <Badge className={`${statusInfo.color} text-white`}>
                                  {statusInfo.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{member.joinedAt}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="active">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>이름</TableHead>
                          <TableHead>부서</TableHead>
                          <TableHead>권한</TableHead>
                          <TableHead>이메일</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.filter(m => m.status === 'active').map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium cursor-pointer hover:text-pink-600" onClick={() => setSelectedMember(member)}>{member.name}</TableCell>
                            <TableCell>{member.department}</TableCell>
                            <TableCell>
                              <Badge className={`${roleColors[member.role]} text-white`}>
                                {member.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{member.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="inactive">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>이름</TableHead>
                          <TableHead>부서</TableHead>
                          <TableHead>권한</TableHead>
                          <TableHead>이메일</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.filter(m => m.status === 'inactive').map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium cursor-pointer hover:text-pink-600" onClick={() => setSelectedMember(member)}>{member.name}</TableCell>
                            <TableCell>{member.department}</TableCell>
                            <TableCell>
                              <Badge className={`${roleColors[member.role]} text-white`}>
                                {member.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{member.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="pending">
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                      구성원 승인은 해당 기업의 관리자가 처리합니다. 요청 시 대리 처리가 가능합니다.
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>이름</TableHead>
                          <TableHead>부서</TableHead>
                          <TableHead>이메일</TableHead>
                          <TableHead>신청일</TableHead>
                          <TableHead className="text-right">대리 처리</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.filter(m => m.status === 'pending').map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium cursor-pointer hover:text-pink-600" onClick={() => setSelectedMember(member)}>{member.name}</TableCell>
                            <TableCell>{member.department}</TableCell>
                            <TableCell className="text-sm">{member.email}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{member.joinedAt}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" onClick={() => alert('기업 관리자 대신 승인 처리되었습니다.')}>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  대리 승인
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => alert('기업 관리자 대신 거절 처리되었습니다.')}>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  대리 거절
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>회원 정보</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedMember.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedMember.nickname}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">이메일</p>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">연락처</p>
                  <p className="font-medium">{selectedMember.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">부서</p>
                  <p className="font-medium">{selectedMember.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">직위</p>
                  <p className="font-medium">{selectedMember.position}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">권한</p>
                  <Badge className={`${roleColors[selectedMember.role]} text-white`}>
                    {selectedMember.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">상태</p>
                  <Badge className={`${statusLabels[selectedMember.status].color} text-white`}>
                    {statusLabels[selectedMember.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">가입일</p>
                  <p className="font-medium">{selectedMember.joinedAt}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">최근 로그인</p>
                  <p className="font-medium">{selectedMember.lastLoginAt || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">참여 프로젝트</p>
                  <p className="font-medium">{selectedMember.projectCount ?? 0}건</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedMember.status !== "inactive" ? (
                  <Button size="sm" variant="outline" onClick={() => {
                    setMemberActionType("suspend")
                    setMemberActionReason("")
                    setMemberActionError("")
                    setMemberActionDialogOpen(true)
                  }}>
                    활동중지
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => {
                    setMemberActionType("resume")
                    setMemberActionReason("")
                    setMemberActionError("")
                    setMemberActionDialogOpen(true)
                  }}>
                    활동재개
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setMemberActionType("withdraw")
                    setMemberActionReason("")
                    setMemberActionError("")
                    setMemberActionDialogOpen(true)
                  }}
                >
                  영구탈퇴
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 구성원 제재/탈퇴 */}
      <Dialog
        open={memberActionDialogOpen}
        onOpenChange={(open) => {
          setMemberActionDialogOpen(open)
          if (!open) {
            setMemberActionType(null)
            setMemberActionReason("")
            setMemberActionError("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {memberActionType === "suspend"
                ? "활동중지 요청"
                : memberActionType === "resume"
                  ? "활동재개 요청"
                  : "영구탈퇴 처리"}
            </DialogTitle>
            <DialogDescription>
              사유를 입력해야만 실행됩니다. (목업: UI 상태만 변경)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium">사유</label>
            <Textarea
              value={memberActionReason}
              onChange={(e) => {
                setMemberActionReason(e.target.value)
                setMemberActionError("")
              }}
              placeholder="예: 부정행위 의심, 반복 민원 처리 필요 등"
              className="min-h-[96px]"
            />
            {memberActionError && <p className="text-sm text-destructive">{memberActionError}</p>}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setMemberActionDialogOpen(false)
              }}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!selectedMember || !memberActionType) return
                if (!memberActionReason.trim()) {
                  setMemberActionError("사유를 입력해 주세요.")
                  return
                }

                if (memberActionType === "suspend") {
                  setMembers((prev) => prev.map((m) => (m.id === selectedMember.id ? { ...m, status: "inactive" } : m)))
                  setSelectedMember((prev) => (prev ? { ...prev, status: "inactive" } : prev))
                } else if (memberActionType === "resume") {
                  setMembers((prev) => prev.map((m) => (m.id === selectedMember.id ? { ...m, status: "active" } : m)))
                  setSelectedMember((prev) => (prev ? { ...prev, status: "active" } : prev))
                } else if (memberActionType === "withdraw") {
                  setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id))
                  setSelectedMember(null)
                }

                // TODO: replace with real audit-log API call
                console.log("[구성원 관리 액션]", {
                  memberId: selectedMember.id,
                  actionType: memberActionType,
                  reason: memberActionReason.trim(),
                  timestamp: new Date().toISOString(),
                })

                setMemberActionDialogOpen(false)
                setMemberActionType(null)
                setMemberActionReason("")
                setMemberActionError("")
              }}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
