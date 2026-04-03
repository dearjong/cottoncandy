import { useState } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Eye, 
  Flag,
  MessageSquare,
  FileText,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Ban
} from "lucide-react"
import { getReportsOnly } from "@/lib/supportStore"

interface Report {
  id: string
  reportType: 'PROJECT' | 'MESSAGE' | 'PROFILE' | 'PROPOSAL'
  targetId: string
  targetTitle: string
  reporterName: string
  reporterCompany: string
  reportedName: string
  reportedCompany: string
  reason: string
  description: string
  reportedAt: string
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED'
}

const reports: Report[] = [
  {
    id: "RPT-001",
    reportType: "MESSAGE",
    targetId: "MSG-1234",
    targetTitle: "비정상적 메시지 내용",
    reporterName: "김광고주",
    reporterCompany: "(주)테크브랜드",
    reportedName: "이사기",
    reportedCompany: "가짜제작사",
    reason: "스팸/광고성 메시지",
    description: "계약과 관련 없는 외부 서비스 홍보 메시지를 반복적으로 수신했습니다.",
    reportedAt: "2026-01-19 15:30",
    status: "PENDING"
  },
  {
    id: "RPT-002",
    reportType: "PROJECT",
    targetId: "PRJ-456",
    targetTitle: "허위 프로젝트 등록 의심",
    reporterName: "박제작사",
    reporterCompany: "비주얼프로덕션",
    reportedName: "최가짜",
    reportedCompany: "페이크광고주",
    reason: "허위/사기 의심",
    description: "프로젝트 정보가 실제와 다르며, 연락이 두절되었습니다. 사기 의심됩니다.",
    reportedAt: "2026-01-18 10:20",
    status: "IN_PROGRESS"
  },
  {
    id: "RPT-003",
    reportType: "PROFILE",
    targetId: "USR-789",
    targetTitle: "포트폴리오 도용 신고",
    reporterName: "정원작자",
    reporterCompany: "오리지널스튜디오",
    reportedName: "윤도용",
    reportedCompany: "카피캣프로덕션",
    reason: "저작권 침해",
    description: "해당 기업이 저희 회사의 포트폴리오를 무단으로 사용하고 있습니다.",
    reportedAt: "2026-01-17 14:45",
    status: "PENDING"
  },
  {
    id: "RPT-004",
    reportType: "PROPOSAL",
    targetId: "PRP-321",
    targetTitle: "부적절한 제안서 내용",
    reporterName: "강담당",
    reporterCompany: "스마트솔루션",
    reportedName: "한부적절",
    reportedCompany: "문제있는제작사",
    reason: "부적절한 내용",
    description: "제안서에 업무와 관련 없는 부적절한 내용이 포함되어 있습니다.",
    reportedAt: "2026-01-16 09:15",
    status: "RESOLVED"
  },
]

const reportTypeLabels = {
  PROJECT: { label: "프로젝트", icon: FileText, color: "bg-blue-500" },
  MESSAGE: { label: "메시지", icon: MessageSquare, color: "bg-purple-500" },
  PROFILE: { label: "프로필", icon: User, color: "bg-green-500" },
  PROPOSAL: { label: "제안서", icon: FileText, color: "bg-orange-500" },
}

const statusLabels = {
  PENDING: { label: "미처리", color: "bg-yellow-500" },
  IN_PROGRESS: { label: "처리중", color: "bg-blue-500" },
  RESOLVED: { label: "완료", color: "bg-green-500" },
  DISMISSED: { label: "기각", color: "bg-gray-500" },
}

export default function ReportsManagementPage() {
  const fromUserReports = getReportsOnly().map((t): Report => ({
    id: t.id,
    reportType: (t.reportTargetType ?? "MESSAGE") as Report["reportType"],
    targetId: t.reportTargetId ?? t.id,
    targetTitle: t.reportTargetTitle ?? t.title,
    reporterName: "사용자",
    reporterCompany: "-",
    reportedName: "-",
    reportedCompany: "-",
    reason: "사용자 신고 접수",
    description: t.content,
    reportedAt: t.createdAt.slice(0, 16).replace("T", " "),
    status: "PENDING",
  }))

  const allReports = [...fromUserReports, ...reports]
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string>("")
  const [actionNote, setActionNote] = useState("")

  const pendingReports = allReports.filter(r => r.status === 'PENDING')
  const inProgressReports = allReports.filter(r => r.status === 'IN_PROGRESS')
  const resolvedReports = allReports.filter(r => r.status === 'RESOLVED' || r.status === 'DISMISSED')

  const filteredReports = (status: string) => {
    let filtered = status === 'all' ? allReports :
                   status === 'pending' ? pendingReports :
                   status === 'in_progress' ? inProgressReports : resolvedReports
    
    return filtered.filter(report =>
      report.targetTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterName.includes(searchTerm) ||
      report.reportedName.includes(searchTerm) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const handleAction = () => {
    if (selectedReport && selectedAction) {
      alert(`신고 "${selectedReport.id}"에 대해 "${selectedAction}" 조치가 완료되었습니다.`)
      setActionDialogOpen(false)
      setSelectedReport(null)
      setSelectedAction("")
      setActionNote("")
    }
  }

  const ReportTable = ({ reports }: { reports: Report[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>신고 ID</TableHead>
          <TableHead>유형</TableHead>
          <TableHead>신고 대상</TableHead>
          <TableHead>신고자</TableHead>
          <TableHead>피신고자</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>신고일시</TableHead>
          <TableHead className="text-right">액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              신고 내역이 없습니다
            </TableCell>
          </TableRow>
        ) : (
          reports.map((report) => {
            const typeInfo = reportTypeLabels[report.reportType]
            const statusInfo = statusLabels[report.status]
            return (
              <TableRow key={report.id}>
                <TableCell className="font-mono text-sm">{report.id}</TableCell>
                <TableCell>
                  <Badge className={`${typeInfo.color} text-white`}>
                    <typeInfo.icon className="h-3 w-3 mr-1" />
                    {typeInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{report.targetTitle}</p>
                    <p className="text-xs text-muted-foreground">{report.targetId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{report.reporterName}</p>
                    <p className="text-xs text-muted-foreground">{report.reporterCompany}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{report.reportedName}</p>
                    <p className="text-xs text-muted-foreground">{report.reportedCompany}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${statusInfo.color} text-white border-0`}>
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{report.reportedAt}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {report.status !== 'RESOLVED' && report.status !== 'DISMISSED' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report)
                          setActionDialogOpen(true)
                        }}
                      >
                        처리
                      </Button>
                    )}
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
      <PageHeader title="신고 관리" description="사용자 신고를 검토하고 적절한 조치를 취하세요" />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900">
                <Flag className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reports.length}</p>
                <p className="text-sm text-muted-foreground">전체 신고</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingReports.length}</p>
                <p className="text-sm text-muted-foreground">미처리</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressReports.length}</p>
                <p className="text-sm text-muted-foreground">처리중</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resolvedReports.length}</p>
                <p className="text-sm text-muted-foreground">처리완료</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle>신고 목록</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="신고 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger value="all">전체 ({reports.length})</TabsTrigger>
              <TabsTrigger value="pending">미처리 ({pendingReports.length})</TabsTrigger>
              <TabsTrigger value="in_progress">처리중 ({inProgressReports.length})</TabsTrigger>
              <TabsTrigger value="resolved">완료 ({resolvedReports.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <ReportTable reports={filteredReports('all')} />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <ReportTable reports={filteredReports('pending')} />
            </TabsContent>
            <TabsContent value="in_progress" className="mt-4">
              <ReportTable reports={filteredReports('in_progress')} />
            </TabsContent>
            <TabsContent value="resolved" className="mt-4">
              <ReportTable reports={filteredReports('resolved')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!selectedReport && !actionDialogOpen} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>신고 상세 정보</DialogTitle>
            <DialogDescription>
              신고 내용을 검토하고 적절한 조치를 취하세요
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {(() => {
                  const typeInfo = reportTypeLabels[selectedReport.reportType]
                  const statusInfo = statusLabels[selectedReport.status]
                  return (
                    <>
                      <Badge className={`${typeInfo.color} text-white`}>
                        <typeInfo.icon className="h-3 w-3 mr-1" />
                        {typeInfo.label}
                      </Badge>
                      <Badge variant="outline" className={`${statusInfo.color} text-white border-0`}>
                        {statusInfo.label}
                      </Badge>
                    </>
                  )
                })()}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">신고자</p>
                  <p className="font-medium">{selectedReport.reporterName}</p>
                  <p className="text-sm text-muted-foreground">{selectedReport.reporterCompany}</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-muted-foreground mb-1">피신고자</p>
                  <p className="font-medium">{selectedReport.reportedName}</p>
                  <p className="text-sm text-muted-foreground">{selectedReport.reportedCompany}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">신고 대상</p>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedReport.targetTitle}</p>
                  <p className="text-sm text-muted-foreground">{selectedReport.targetId}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">신고 사유</p>
                <Badge variant="outline">{selectedReport.reason}</Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">상세 내용</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedReport.description}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">신고일시</p>
                <p>{selectedReport.reportedAt}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              닫기
            </Button>
            {selectedReport && selectedReport.status !== 'RESOLVED' && selectedReport.status !== 'DISMISSED' && (
              <Button onClick={() => setActionDialogOpen(true)}>
                조치하기
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>신고 처리</DialogTitle>
            <DialogDescription>
              적절한 조치를 선택하고 처리 내용을 기록하세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedReport && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedReport.targetTitle}</p>
                <p className="text-sm text-muted-foreground">
                  피신고자: {selectedReport.reportedName} ({selectedReport.reportedCompany})
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">조치 유형</label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="조치를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">경고 발송</SelectItem>
                  <SelectItem value="hide">콘텐츠 숨김</SelectItem>
                  <SelectItem value="suspend">활동 제한 (7일)</SelectItem>
                  <SelectItem value="ban">계정 정지</SelectItem>
                  <SelectItem value="dismiss">신고 기각</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">처리 내용</label>
              <Textarea
                placeholder="조치 내용 및 사유를 입력하세요..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              취소
            </Button>
            <Button
              onClick={handleAction}
              disabled={!selectedAction}
            >
              조치 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
