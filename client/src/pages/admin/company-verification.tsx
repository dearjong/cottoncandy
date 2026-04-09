import { useState } from "react"
import { trackCompanyVerificationApproved, trackCompanyVerificationRejected, trackCorporateMemberActivated } from "@/lib/analytics"
import { PageHeader } from "@/components/admin/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Search, 
  Check, 
  X, 
  Building2,
  FileCheck,
  ShieldCheck,
  Pencil,
  Save,
  Award,
  Clock,
  Download
} from "lucide-react"

interface CompanyVerification {
  id: string
  companyName: string
  companyNameEn?: string
  representativeName: string
  businessNumber: string
  companyType: '대행사' | '제작사' | '광고주'
  subType?: string
  verificationType: 'BUSINESS' | 'PROJECT_AUTHENTICITY' | 'PROJECT_COMPLETION'
  requestedAt: string
  documents: string[]
  projectCount?: number
  completedCount?: number
  email: string
  phone: string
  intro?: string
  industry?: string
  foundedYear?: string
  foundedMonth?: string
  zipCode?: string
  address?: string
  addressDetail?: string
  website?: string
  companySize?: string
  employeeCount?: string
  serviceRange?: string[]
  industryResponse?: string[]
  businessType?: '법인사업자' | '개인사업자'
  tvcfPortfolio?: string
  logoUrl?: string
  detailIntro?: string
  minProductionCost?: string
}

const verificationRequests: CompanyVerification[] = [
  {
    id: "VER-001",
    companyName: "(주)크리에이티브랩",
    companyNameEn: "Creative Lab Inc",
    representativeName: "김대표",
    businessNumber: "123-45-67890",
    companyType: "제작사",
    subType: "종합 제작",
    verificationType: "BUSINESS",
    requestedAt: "2026-01-19 14:30",
    documents: ["사업자등록증.pdf", "대표자신분증.pdf"],
    email: "admin@creativelab.com",
    phone: "02-1234-5678",
    intro: "영상 콘텐츠 전문 제작사입니다. TV광고, 디지털 콘텐츠, 브랜드 필름 등을 제작합니다.",
    industry: "영상제작, 광고제작",
    foundedYear: "2018",
    foundedMonth: "3",
    zipCode: "06039",
    address: "서울 강남구 도산대로73길 25-7",
    addressDetail: "크리에이티브빌딩 3층",
    website: "www.creativelab.com",
    companySize: "중소기업",
    employeeCount: "20명 이상",
    serviceRange: ["크리에이티브 기획", "영상 제작"],
    industryResponse: [],
    businessType: "법인사업자",
    tvcfPortfolio: "star.tvcf.co.kr/creativelab",
    detailIntro: "크리에이티브랩은 2018년 설립 이후 다양한 브랜드의 영상 콘텐츠를 제작해왔습니다. TV광고, 디지털 콘텐츠, 브랜드 필름 등 다양한 포맷의 영상을 전문적으로 제작하며, 클라이언트의 브랜드 가치를 영상으로 구현하는 것을 목표로 합니다.",
    minProductionCost: "5천만 원 ~ 1억"
  },
  {
    id: "VER-002",
    companyName: "스마트에이전시",
    companyNameEn: "Smart Agency",
    representativeName: "이사장",
    businessNumber: "234-56-78901",
    companyType: "대행사",
    subType: "Creative 중심",
    verificationType: "PROJECT_AUTHENTICITY",
    requestedAt: "2026-01-18 10:15",
    documents: ["포트폴리오증빙.pdf", "계약서사본.pdf"],
    projectCount: 15,
    email: "contact@smartagency.kr",
    phone: "02-2345-6789",
    intro: "크리에이티브 중심의 종합 광고 대행사입니다.",
    industry: "광고대행, 마케팅",
    foundedYear: "2015",
    foundedMonth: "7",
    zipCode: "04789",
    address: "서울 성동구 왕십리로 115",
    addressDetail: "헤이그라운드 5층",
    website: "www.smartagency.kr",
    companySize: "중소기업",
    employeeCount: "30명 이상",
    serviceRange: ["전략기획", "크리에이티브 기획", "미디어 집행"],
    industryResponse: ["금융 패키 대응"],
    businessType: "법인사업자",
    detailIntro: "스마트에이전시는 크리에이티브 중심의 종합 광고 대행사로, 전략 기획부터 미디어 집행까지 원스톱 서비스를 제공합니다.",
    minProductionCost: "1억 ~ 2억"
  },
  {
    id: "VER-003",
    companyName: "비주얼프로덕션",
    representativeName: "박감독",
    businessNumber: "345-67-89012",
    companyType: "제작사",
    subType: "촬영 중심",
    verificationType: "PROJECT_COMPLETION",
    requestedAt: "2026-01-17 16:45",
    documents: ["완료보고서.pdf"],
    projectCount: 42,
    completedCount: 38,
    email: "info@visualprod.com",
    phone: "02-3456-7890",
    intro: "촬영 전문 프로덕션입니다.",
    industry: "영상촬영",
    foundedYear: "2012",
    foundedMonth: "1",
    companySize: "중소기업",
    employeeCount: "10명 이상",
    serviceRange: ["영상 제작"],
    businessType: "법인사업자",
    detailIntro: "비주얼프로덕션은 촬영 전문 프로덕션입니다.",
    minProductionCost: "5천만 원 미만"
  },
  {
    id: "VER-004",
    companyName: "(주)테크브랜드",
    companyNameEn: "Tech Brand Co., Ltd",
    representativeName: "최본부장",
    businessNumber: "456-78-90123",
    companyType: "광고주",
    verificationType: "BUSINESS",
    requestedAt: "2026-01-20 09:00",
    documents: ["사업자등록증.pdf"],
    email: "marketing@techbrand.co.kr",
    phone: "02-4567-8901",
    intro: "IT 솔루션 전문 기업입니다.",
    industry: "IT, 소프트웨어",
    foundedYear: "2010",
    foundedMonth: "5",
    zipCode: "13494",
    address: "경기도 성남시 분당구 판교로 256번길 25",
    addressDetail: "테크타워 10층",
    website: "www.techbrand.co.kr",
    companySize: "중견기업",
    employeeCount: "100명 이상",
    businessType: "법인사업자"
  },
]

const verificationTypeLabels = {
  BUSINESS: { label: "사업자 인증", icon: FileCheck, color: "bg-blue-500" },
  PROJECT_AUTHENTICITY: { label: "진정성 인증", icon: ShieldCheck, color: "bg-purple-500" },
  PROJECT_COMPLETION: { label: "수행 인증", icon: Award, color: "bg-green-500" },
}

export default function CompanyVerificationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVerification, setSelectedVerification] = useState<CompanyVerification | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [approveTarget, setApproveTarget] = useState<CompanyVerification | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedData, setEditedData] = useState<Partial<CompanyVerification>>({})

  const startEditing = () => {
    if (selectedVerification) {
      setEditedData({ ...selectedVerification })
      setIsEditMode(true)
    }
  }

  const cancelEditing = () => {
    setEditedData({})
    setIsEditMode(false)
  }

  const saveEditing = () => {
    if (editedData) {
      alert("수정 내용이 저장되었습니다.")
      setIsEditMode(false)
      setEditedData({})
    }
  }

  const updateField = (field: keyof CompanyVerification, value: any) => {
    setEditedData(prev => ({ ...prev, [field]: value }))
  }

  const businessRequests = verificationRequests.filter(r => r.verificationType === 'BUSINESS')
  const authenticityRequests = verificationRequests.filter(r => r.verificationType === 'PROJECT_AUTHENTICITY')
  const completionRequests = verificationRequests.filter(r => r.verificationType === 'PROJECT_COMPLETION')

  const filteredRequests = (type: string) => {
    let requests = type === 'all' ? verificationRequests :
                   type === 'business' ? businessRequests :
                   type === 'authenticity' ? authenticityRequests : completionRequests
    
    return requests.filter(request =>
      request.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.businessNumber.includes(searchTerm) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const handleApprove = (verification: CompanyVerification) => {
    const typeLabel = verificationTypeLabels[verification.verificationType].label
    trackCompanyVerificationApproved({
      company_name: verification.companyName,
      verification_type: verification.verificationType,
      company_id: verification.id,
    })
    trackCorporateMemberActivated({
      company_name: verification.companyName,
      company_type: "agency",
      verification_type: verification.verificationType,
    })
    alert(`"${verification.companyName}"의 ${typeLabel}이(가) 승인되었습니다.`)
    setSelectedVerification(null)
  }

  const handleReject = () => {
    if (selectedVerification && rejectReason) {
      const typeLabel = verificationTypeLabels[selectedVerification.verificationType].label
      trackCompanyVerificationRejected({
        company_name: selectedVerification.companyName,
        verification_type: selectedVerification.verificationType,
        reject_reason: rejectReason,
      })
      alert(`"${selectedVerification.companyName}"의 ${typeLabel}이(가) 반려되었습니다.\n사유: ${rejectReason}`)
      setRejectDialogOpen(false)
      setRejectReason("")
      setSelectedVerification(null)
    }
  }

  const [personInfo, setPersonInfo] = useState<CompanyVerification | null>(null)

  const VerificationTable = ({ requests }: { requests: CompanyVerification[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>요청 ID</TableHead>
          <TableHead>기업명</TableHead>
          <TableHead>기업 유형</TableHead>
          <TableHead>인증 유형</TableHead>
          <TableHead>사업자번호</TableHead>
          <TableHead>요청일시</TableHead>
          <TableHead className="text-right">액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              인증 대기 중인 요청이 없습니다
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => {
            const typeInfo = verificationTypeLabels[request.verificationType]
            return (
              <TableRow key={request.id} className="cursor-default">
                <TableCell className="font-mono text-sm">{request.id}</TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      className="font-medium cursor-pointer hover:text-pink-600 text-left"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedVerification(request)
                      }}
                    >
                      {request.companyName}
                    </button>
                    <p className="text-xs text-muted-foreground">
                      <button
                        type="button"
                        className="hover:text-pink-600 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPersonInfo(request)
                        }}
                      >
                        {request.representativeName}
                      </button>
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{request.companyType}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${typeInfo.color} text-white`}>
                    <typeInfo.icon className="h-3 w-3 mr-1" />
                    {typeInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{request.businessNumber}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{request.requestedAt}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedVerification(request)
                        setRejectDialogOpen(true)
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      반려
                    </Button>
                    <Button
                      size="sm"
                      className="bg-pink-600 hover:bg-pink-700"
                      onClick={() => {
                        setApproveTarget(request)
                        setApproveDialogOpen(true)
                      }}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      승인
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="기업 인증 관리" description="TVCF Certified 인증 요청을 검토하고 처리하세요" />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{verificationRequests.length}</p>
                <p className="text-sm text-muted-foreground">전체 대기</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{businessRequests.length}</p>
                <p className="text-sm text-muted-foreground">사업자 인증</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{authenticityRequests.length}</p>
                <p className="text-sm text-muted-foreground">진정성 인증</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completionRequests.length}</p>
                <p className="text-sm text-muted-foreground">수행 인증</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle>인증 요청 목록</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="기업 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">전체 ({verificationRequests.length})</TabsTrigger>
              <TabsTrigger value="business">사업자 인증 ({businessRequests.length})</TabsTrigger>
              <TabsTrigger value="authenticity">진정성 인증 ({authenticityRequests.length})</TabsTrigger>
              <TabsTrigger value="completion">수행 인증 ({completionRequests.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <VerificationTable requests={filteredRequests('all')} />
            </TabsContent>
            <TabsContent value="business" className="mt-4">
              <VerificationTable requests={filteredRequests('business')} />
            </TabsContent>
            <TabsContent value="authenticity" className="mt-4">
              <VerificationTable requests={filteredRequests('authenticity')} />
            </TabsContent>
            <TabsContent value="completion" className="mt-4">
              <VerificationTable requests={filteredRequests('completion')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!selectedVerification && !rejectDialogOpen} onOpenChange={() => setSelectedVerification(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>인증 요청 상세</DialogTitle>
            <DialogDescription>
              기업 인증 정보를 검토하세요
            </DialogDescription>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-2">
                {(() => {
                  const typeInfo = verificationTypeLabels[selectedVerification.verificationType]
                  return (
                    <Badge className={`${typeInfo.color} text-white text-base px-3 py-1`}>
                      <typeInfo.icon className="h-4 w-4 mr-1" />
                      {typeInfo.label}
                    </Badge>
                  )
                })()}
                <Badge variant="outline">{selectedVerification.companyType}</Badge>
                {selectedVerification.subType && (
                  <Badge variant="secondary">{selectedVerification.subType}</Badge>
                )}
              </div>

              <div className="space-y-4">
                <div className="inline-block bg-gray-800 text-white text-xs px-3 py-1 rounded">1. 기본정보</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">* 기업명</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.companyName || ''} onChange={(e) => updateField('companyName', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.companyName}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">기업명 (영어)</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.companyNameEn || ''} onChange={(e) => updateField('companyNameEn', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.companyNameEn || '-'}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">* 한줄소개</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.intro || ''} onChange={(e) => updateField('intro', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.intro || '-'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">* 업종</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.industry || ''} onChange={(e) => updateField('industry', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.industry || '-'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">* 설립년월</p>
                    {isEditMode ? (
                      <div className="flex gap-1 items-center">
                        <input type="text" className="w-16 px-2 py-1 border rounded text-sm" value={editedData.foundedYear || ''} onChange={(e) => updateField('foundedYear', e.target.value)} />
                        <span>년</span>
                        <input type="text" className="w-12 px-2 py-1 border rounded text-sm" value={editedData.foundedMonth || ''} onChange={(e) => updateField('foundedMonth', e.target.value)} />
                        <span>월</span>
                      </div>
                    ) : (
                      <p className="font-medium">{selectedVerification.foundedYear ? `${selectedVerification.foundedYear}년 ${selectedVerification.foundedMonth}월` : '-'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="inline-block bg-gray-800 text-white text-xs px-3 py-1 rounded">2. 상세정보</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">* 대표자 성명</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.representativeName || ''} onChange={(e) => updateField('representativeName', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.representativeName}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">* 대표 전화</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.phone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">* 대표 이메일</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.email || ''} onChange={(e) => updateField('email', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Website</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.website || ''} onChange={(e) => updateField('website', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.website || '-'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">* 우편번호</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.zipCode || ''} onChange={(e) => updateField('zipCode', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.zipCode || '-'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">* 주소</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.address || ''} onChange={(e) => updateField('address', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.address || '-'}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">* 상세주소</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.addressDetail || ''} onChange={(e) => updateField('addressDetail', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.addressDetail || '-'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="inline-block bg-gray-800 text-white text-xs px-3 py-1 rounded">3. 상세소개</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">로고</p>
                    <div className="w-16 h-16 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 mt-1">
                      {selectedVerification.logoUrl ? (
                        <img src={selectedVerification.logoUrl} alt="로고" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-gray-400 text-xs">LOGO</span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">상세소개</p>
                    {isEditMode ? (
                      <textarea className="w-full px-2 py-1 border rounded text-sm h-20 mt-1" value={editedData.detailIntro || ''} onChange={(e) => updateField('detailIntro', e.target.value)} />
                    ) : (
                      <p className="font-medium mt-1 p-2 bg-gray-50 rounded-lg text-sm leading-relaxed">
                        {selectedVerification.detailIntro || '-'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="inline-block bg-gray-800 text-white text-xs px-3 py-1 rounded">4. 기업정보</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">* 기업유형</p>
                    {isEditMode ? (
                      <select className="w-full px-2 py-1 border rounded text-sm" value={editedData.companyType || ''} onChange={(e) => updateField('companyType', e.target.value)}>
                        <option value="광고주">광고주</option>
                        <option value="대행사">대행사</option>
                        <option value="제작사">제작사</option>
                      </select>
                    ) : (
                      <p className="font-medium">{selectedVerification.companyType}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">* 세부유형</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.subType || ''} onChange={(e) => updateField('subType', e.target.value)} />
                    ) : (
                      <p className="font-medium">{selectedVerification.subType || '-'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">* 최소 제작비</p>
                    {isEditMode ? (
                      <select className="w-full px-2 py-1 border rounded text-sm" value={editedData.minProductionCost || ''} onChange={(e) => updateField('minProductionCost', e.target.value)}>
                        <option value="">선택해 주세요</option>
                        <option value="5천만 원 미만">5천만 원 미만</option>
                        <option value="5천만 원 ~ 1억">5천만 원 ~ 1억</option>
                        <option value="1억 ~ 2억">1억 ~ 2억</option>
                        <option value="2억 ~ 5억">2억 ~ 5억</option>
                        <option value="5억 이상">5억 이상</option>
                      </select>
                    ) : (
                      <p className="font-medium">{selectedVerification.minProductionCost || '-'}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">* 서비스 범위</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedVerification.serviceRange && selectedVerification.serviceRange.length > 0 ? (
                        selectedVerification.serviceRange.map((s, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                        ))
                      ) : <span>-</span>}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">업종 대응</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedVerification.industryResponse && selectedVerification.industryResponse.length > 0 ? (
                        selectedVerification.industryResponse.map((s, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                        ))
                      ) : <span>-</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">* 기업규모</p>
                    {isEditMode ? (
                      <select className="w-full px-2 py-1 border rounded text-sm" value={editedData.companySize || ''} onChange={(e) => updateField('companySize', e.target.value)}>
                        <option value="">선택해 주세요</option>
                        <option value="대기업">대기업</option>
                        <option value="중견기업">중견기업</option>
                        <option value="중소기업">중소기업</option>
                        <option value="스타트업">스타트업</option>
                        <option value="외국계 기업">외국계 기업</option>
                        <option value="공공기관/공기업">공공기관/공기업</option>
                      </select>
                    ) : (
                      <p className="font-medium">{selectedVerification.companySize || '-'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">* 직원수</p>
                    {isEditMode ? (
                      <select className="w-full px-2 py-1 border rounded text-sm" value={editedData.employeeCount || ''} onChange={(e) => updateField('employeeCount', e.target.value)}>
                        <option value="">선택해 주세요</option>
                        <option value="10명 미만">10명 미만</option>
                        <option value="10명 이상">10명 이상</option>
                        <option value="20명 이상">20명 이상</option>
                        <option value="30명 이상">30명 이상</option>
                        <option value="50명 이상">50명 이상</option>
                        <option value="100명 이상">100명 이상</option>
                      </select>
                    ) : (
                      <p className="font-medium">{selectedVerification.employeeCount || '-'}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">TVCF 포트폴리오</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm" value={editedData.tvcfPortfolio || ''} onChange={(e) => updateField('tvcfPortfolio', e.target.value)} />
                    ) : (
                      <p className="font-medium text-blue-600">{selectedVerification.tvcfPortfolio || '-'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="inline-block bg-gray-800 text-white text-xs px-3 py-1 rounded">5. 사업자정보</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">* 사업자등록번호</p>
                    {isEditMode ? (
                      <input type="text" className="w-full px-2 py-1 border rounded text-sm font-mono" value={editedData.businessNumber || ''} onChange={(e) => updateField('businessNumber', e.target.value)} />
                    ) : (
                      <p className="font-medium font-mono">{selectedVerification.businessNumber}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">* 사업자유형</p>
                    {isEditMode ? (
                      <select className="w-full px-2 py-1 border rounded text-sm" value={editedData.businessType || ''} onChange={(e) => updateField('businessType', e.target.value)}>
                        <option value="법인사업자">법인사업자</option>
                        <option value="개인사업자">개인사업자</option>
                      </select>
                    ) : (
                      <p className="font-medium">{selectedVerification.businessType || '-'}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {(selectedVerification.projectCount || selectedVerification.completedCount) && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
                  {selectedVerification.projectCount && (
                    <div>
                      <p className="text-sm text-muted-foreground">등록 프로젝트</p>
                      <p className="text-xl font-bold">{selectedVerification.projectCount}건</p>
                    </div>
                  )}
                  {selectedVerification.completedCount && (
                    <div>
                      <p className="text-sm text-muted-foreground">완료 프로젝트</p>
                      <p className="text-xl font-bold">{selectedVerification.completedCount}건</p>
                    </div>
                  )}
                </div>
              )}
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">제출 서류</p>
                <div className="space-y-2">
                  {selectedVerification.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="text-sm">{doc}</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-sm">
                <p className="text-muted-foreground">요청일시</p>
                <p>{selectedVerification.requestedAt}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={cancelEditing}>
                  취소
                </Button>
                <Button onClick={saveEditing}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setSelectedVerification(null)}>
                  닫기
                </Button>
                <Button variant="outline" onClick={startEditing}>
                  <Pencil className="h-4 w-4 mr-2" />
                  수정
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setRejectDialogOpen(true)}
                >
                  <X className="h-4 w-4 mr-2" />
                  반려
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (selectedVerification) {
                      handleApprove(selectedVerification)
                    }
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  승인
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 대표자 개인정보 팝업 (테이블에서 대표자 이름 클릭 시) */}
      <Dialog
        open={!!personInfo}
        onOpenChange={(open) => {
          if (!open) setPersonInfo(null)
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>대표자 정보</DialogTitle>
            <DialogDescription>기업 대표자의 연락처 및 이메일 정보입니다.</DialogDescription>
          </DialogHeader>
          {personInfo && (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">대표자 성명</p>
                <p className="font-medium">{personInfo.representativeName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">대표 전화</p>
                <p className="font-medium">{personInfo.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">대표 이메일</p>
                <p className="font-medium break-all">{personInfo.email}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>인증 반려</DialogTitle>
            <DialogDescription>
              반려 사유를 입력해주세요. 기업 담당자에게 전달됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedVerification && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedVerification.companyName}</p>
                <p className="text-sm text-muted-foreground">
                  {verificationTypeLabels[selectedVerification.verificationType].label}
                </p>
              </div>
            )}
            <div>
              <Textarea
                placeholder="반려 사유를 입력하세요..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              반려 확정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={approveDialogOpen} onOpenChange={(open) => { setApproveDialogOpen(open); if (!open) setApproveTarget(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>인증 승인</DialogTitle>
            <DialogDescription>
              아래 인증 요청을 승인하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          {approveTarget && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{approveTarget.companyName}</p>
              <p className="text-sm text-muted-foreground">
                {verificationTypeLabels[approveTarget.verificationType].label}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setApproveDialogOpen(false); setApproveTarget(null) }}>
              취소
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700"
              onClick={() => {
                if (approveTarget) {
                  handleApprove(approveTarget)
                  setApproveDialogOpen(false)
                  setApproveTarget(null)
                }
              }}
            >
              승인 확정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
