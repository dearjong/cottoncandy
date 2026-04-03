import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { PageHeader } from "@/components/admin/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Building2, Users, CheckCircle, XCircle, Clock, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocation } from "wouter"
import { MOCK_ADMIN_COMPANIES_V1 } from "@/data/mockData"

interface Company {
  id: string
  companyName: string
  companyNameEn?: string
  companyType: '광고주' | '대행사' | '제작사'
  subType?: string
  representativeName: string
  businessNumber: string
  email: string
  phone: string
  memberCount: number
  projectCount: number
  status: 'active' | 'inactive' | 'pending'
  verificationStatus: 'verified' | 'pending' | 'rejected'
  registeredAt: string
}

const mockCompanies: Company[] = MOCK_ADMIN_COMPANIES_V1 as unknown as Company[]

const STORAGE_KEY_ADMIN_MOCK_COMPANIES_V1 = "cottoncandy_admin_mock_companies_v1"

const statusLabels = {
  active: { label: "활성", color: "bg-green-500" },
  inactive: { label: "비활성", color: "bg-gray-400" },
  pending: { label: "대기", color: "bg-yellow-500" },
}

const verificationLabels = {
  verified: { label: "인증완료", color: "bg-blue-500", icon: CheckCircle },
  pending: { label: "인증대기", color: "bg-yellow-500", icon: Clock },
  rejected: { label: "인증거부", color: "bg-red-500", icon: XCircle },
}

export default function AdminCompanies() {
  const [searchTerm, setSearchTerm] = useState("")
  const [, setLocation] = useLocation()
  const [selectedPersonCompany, setSelectedPersonCompany] = useState<Company | null>(null)

  const [companies, setCompanies] = useState<Company[]>(() => {
    if (typeof window === "undefined") return mockCompanies
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ADMIN_MOCK_COMPANIES_V1)
      if (!raw) return mockCompanies
      const parsed = JSON.parse(raw) as Company[]
      if (!Array.isArray(parsed)) return mockCompanies
      return parsed
    } catch {
      return mockCompanies
    }
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_MOCK_COMPANIES_V1, JSON.stringify(companies))
    } catch {
      // ignore
    }
  }, [companies])

  const [companyActionDialogOpen, setCompanyActionDialogOpen] = useState(false)
  const [companyActionType, setCompanyActionType] = useState<"suspend" | "withdraw" | null>(null)
  const [companyActionTarget, setCompanyActionTarget] = useState<Company | null>(null)
  const [companyActionReason, setCompanyActionReason] = useState("")
  const [companyActionError, setCompanyActionError] = useState("")

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.businessNumber.includes(searchTerm) ||
    company.representativeName.includes(searchTerm)
  )

  const activeCount = companies.filter((c) => c.status === "active").length
  const inactiveCount = companies.filter((c) => c.status === "inactive").length
  const pendingCount = companies.filter((c) => c.verificationStatus === "pending").length

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="기업 관리" description="등록된 기업 목록을 관리합니다" />

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">전체 기업</p>
                  <p className="text-2xl font-bold">{companies.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">활성 기업</p>
                  <p className="text-2xl font-bold">{activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">비활성 기업</p>
                  <p className="text-2xl font-bold">{inactiveCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">인증 대기</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <Tabs defaultValue="all">
              <div className="flex items-center gap-3">
                <TabsList className="mb-0">
                  <TabsTrigger value="all">전체 ({companies.length})</TabsTrigger>
                  <TabsTrigger value="advertiser">광고주</TabsTrigger>
                  <TabsTrigger value="agency">대행사</TabsTrigger>
                  <TabsTrigger value="production">제작사</TabsTrigger>
                </TabsList>
                <div className="relative w-64 md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="기업명, 사업자번호, 대표자명 검색"
                    className="pl-9 h-9 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsContent value="all">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">ID</TableHead>
                      {/* 회사명 컬럼 폭 축소 */}
                      <TableHead className="w-[240px]">기업명</TableHead>
                      <TableHead>기업유형</TableHead>
                      <TableHead>대표자</TableHead>
                      <TableHead>사업자번호</TableHead>
                      <TableHead className="text-center">구성원</TableHead>
                      <TableHead className="text-center">프로젝트</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>인증</TableHead>
                      <TableHead>등록일</TableHead>
                      <TableHead className="text-right w-[72px]">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                          검색 결과가 없습니다
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCompanies.map((company) => {
                        const statusInfo = statusLabels[company.status]
                        const verificationInfo = verificationLabels[company.verificationStatus]
                        return (
                          <TableRow 
                            key={company.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-mono text-sm">{company.id}</TableCell>
                        <TableCell className="max-w-[240px] whitespace-nowrap">
                          <div className="min-w-0">
                                <button
                                  type="button"
                              className="block w-full py-1 font-medium hover:text-pink-600 truncate text-left cursor-pointer"
                                  title={company.companyName}
                                  onClick={() => setLocation(`/admin/companies/${company.id}`)}
                                >
                                  {company.companyName}
                                </button>
                                {company.companyNameEn && (
                                  <p className="text-xs text-muted-foreground truncate" title={company.companyNameEn}>
                                    {company.companyNameEn}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{company.companyType}</Badge>
                              {company.subType && (
                                <p className="text-xs text-muted-foreground mt-1">{company.subType}</p>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              <button
                                type="button"
                                className="hover:text-pink-600 hover:underline cursor-pointer"
                                onClick={() => setSelectedPersonCompany(company)}
                              >
                                {company.representativeName}
                              </button>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{company.businessNumber}</TableCell>
                            <TableCell className="text-center">
                              <button
                                type="button"
                                className="inline-flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-pink-600 cursor-pointer"
                                onClick={() => setLocation(`/admin/companies/${company.id}?tab=members`)}
                              >
                                <Users className="h-4 w-4" />
                                <span>{company.memberCount}</span>
                              </button>
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                type="button"
                                className="inline-flex items-center justify-center w-full text-sm font-medium hover:text-pink-600 hover:underline cursor-pointer"
                                onClick={() => setLocation(`/admin/companies/${company.id}?tab=projects`)}
                              >
                                {company.projectCount}
                              </button>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${statusInfo.color} text-white`}>
                                {statusInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${verificationInfo.color} text-white`}>
                                <verificationInfo.icon className="h-3 w-3 mr-1" />
                                {verificationInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{company.registeredAt}</TableCell>
                            <TableCell className="text-right align-middle">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    className="px-2 text-lg leading-none text-gray-500 hover:text-gray-800 disabled:text-gray-300"
                                    aria-label="기업 관리 액션"
                                    title="기업 관리 액션"
                                  >
                                    …
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  {company.status === "active" && (
                                    <DropdownMenuItem
                                      onSelect={() => {
                                        setCompanyActionTarget(company)
                                        setCompanyActionType("suspend")
                                        setCompanyActionReason("")
                                        setCompanyActionError("")
                                        setCompanyActionDialogOpen(true)
                                      }}
                                    >
                                      활동중지
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onSelect={() => {
                                      setCompanyActionTarget(company)
                                      setCompanyActionType("withdraw")
                                      setCompanyActionReason("")
                                      setCompanyActionError("")
                                      setCompanyActionDialogOpen(true)
                                    }}
                                  >
                                    영구탈퇴
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="advertiser">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[240px]">기업명</TableHead>
                      <TableHead>대표자</TableHead>
                      <TableHead>구성원</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.filter(c => c.companyType === '광고주').map((company) => (
                      <TableRow 
                        key={company.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="max-w-[240px] whitespace-nowrap">
                          <button
                            type="button"
                            className="block w-full py-1 font-medium hover:text-pink-600 truncate text-left cursor-pointer"
                            title={company.companyName}
                            onClick={() => setLocation(`/admin/companies/${company.id}`)}
                          >
                            {company.companyName}
                          </button>
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-pink-600 hover:underline cursor-pointer"
                            onClick={() => setSelectedPersonCompany(company)}
                          >
                            {company.representativeName}
                          </button>
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-pink-600 cursor-pointer"
                            onClick={() => setLocation(`/admin/companies/${company.id}?tab=members`)}
                          >
                            {company.memberCount}명
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusLabels[company.status].color} text-white`}>
                            {statusLabels[company.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="agency">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[240px]">기업명</TableHead>
                      <TableHead>대표자</TableHead>
                      <TableHead>구성원</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.filter(c => c.companyType === '대행사').map((company) => (
                      <TableRow
                        key={company.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="max-w-[240px] whitespace-nowrap">
                          <button
                            type="button"
                            className="block w-full py-1 font-medium hover:text-pink-600 truncate text-left cursor-pointer"
                            title={company.companyName}
                            onClick={() => setLocation(`/admin/companies/${company.id}`)}
                          >
                            {company.companyName}
                          </button>
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-pink-600 hover:underline cursor-pointer"
                            onClick={() => setSelectedPersonCompany(company)}
                          >
                            {company.representativeName}
                          </button>
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-pink-600 cursor-pointer"
                            onClick={() => setLocation(`/admin/companies/${company.id}?tab=members`)}
                          >
                            {company.memberCount}명
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusLabels[company.status].color} text-white`}>
                            {statusLabels[company.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="production">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[240px]">기업명</TableHead>
                      <TableHead>대표자</TableHead>
                      <TableHead>구성원</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.filter(c => c.companyType === '제작사').map((company) => (
                      <TableRow
                        key={company.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="max-w-[240px] whitespace-nowrap">
                          <button
                            type="button"
                            className="block w-full py-1 font-medium hover:text-pink-600 truncate text-left cursor-pointer"
                            title={company.companyName}
                            onClick={() => setLocation(`/admin/companies/${company.id}`)}
                          >
                            {company.companyName}
                          </button>
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-pink-600 hover:underline cursor-pointer"
                            onClick={() => setSelectedPersonCompany(company)}
                          >
                            {company.representativeName}
                          </button>
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-pink-600 cursor-pointer"
                            onClick={() => setLocation(`/admin/companies/${company.id}?tab=members`)}
                          >
                            {company.memberCount}명
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusLabels[company.status].color} text-white`}>
                            {statusLabels[company.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 대표자(개인) 정보 팝업 */}
      <Dialog
        open={!!selectedPersonCompany}
        onOpenChange={(open) => {
          if (!open) setSelectedPersonCompany(null)
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>대표자 정보</DialogTitle>
            <DialogDescription>
              기업 대표자의 기본 연락처 정보입니다.
            </DialogDescription>
          </DialogHeader>
          {selectedPersonCompany && (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">대표자 성명</p>
                <p className="font-medium">{selectedPersonCompany.representativeName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">소속 기업</p>
                <p className="font-medium">
                  {selectedPersonCompany.companyName}
                  {selectedPersonCompany.companyNameEn && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({selectedPersonCompany.companyNameEn})
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">연락처</p>
                <p className="font-medium">{selectedPersonCompany.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">이메일</p>
                <p className="font-medium break-all">{selectedPersonCompany.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPersonCompany(null)}>
              <X className="h-4 w-4 mr-1" />
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 기업 제재/탈퇴 */}
      <Dialog
        open={companyActionDialogOpen}
        onOpenChange={(open) => {
          setCompanyActionDialogOpen(open)
          if (!open) {
            setCompanyActionType(null)
            setCompanyActionTarget(null)
            setCompanyActionReason("")
            setCompanyActionError("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {companyActionType === "suspend"
                ? "기업 활동중지 요청"
                : companyActionType === "withdraw"
                  ? "기업 영구탈퇴 처리"
                  : "요청"}
            </DialogTitle>
            <DialogDescription>
              사유를 입력해야만 실행됩니다. (목업: UI에서 상태만 변경)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium">사유</label>
            <Textarea
              value={companyActionReason}
              onChange={(e) => {
                setCompanyActionReason(e.target.value)
                setCompanyActionError("")
              }}
              placeholder="예: 반복 위반, 분쟁 발생 근거 등"
              className="min-h-[96px]"
            />
            {companyActionError && <p className="text-sm text-destructive">{companyActionError}</p>}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCompanyActionDialogOpen(false)
              }}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!companyActionTarget || !companyActionType) return
                if (!companyActionReason.trim()) {
                  setCompanyActionError("사유를 입력해 주세요.")
                  return
                }

                if (companyActionType === "suspend") {
                  setCompanies((prev) =>
                    prev.map((c) => (c.id === companyActionTarget.id ? { ...c, status: "inactive" } : c)),
                  )
                } else if (companyActionType === "withdraw") {
                  setCompanies((prev) => prev.filter((c) => c.id !== companyActionTarget.id))
                }

                console.log("[기업 관리 액션]", {
                  companyId: companyActionTarget.id,
                  actionType: companyActionType,
                  reason: companyActionReason.trim(),
                  timestamp: new Date().toISOString(),
                })

                setCompanyActionDialogOpen(false)
                setCompanyActionType(null)
                setCompanyActionTarget(null)
                setCompanyActionReason("")
                setCompanyActionError("")
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
