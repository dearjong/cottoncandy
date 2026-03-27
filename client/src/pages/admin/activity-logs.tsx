import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Activity,
  FileText,
  User,
  Settings,
  CheckCircle,
  XCircle,
  Edit,
  Upload,
  Download,
  Eye,
  RefreshCw,
  Filter
} from "lucide-react"

interface ActivityLog {
  id: string
  timestamp: string
  category: 'PROJECT' | 'USER' | 'SYSTEM' | 'DOCUMENT'
  action: string
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'VIEW' | 'UPLOAD' | 'DOWNLOAD'
  targetType: string
  targetId: string
  targetName: string
  actor: string
  actorRole: string
  details: string
  ipAddress: string
}

const activityLogs: ActivityLog[] = [
  {
    id: "LOG-001",
    timestamp: "2026-01-20 10:35:22",
    category: "PROJECT",
    action: "프로젝트 승인",
    actionType: "APPROVE",
    targetType: "프로젝트",
    targetId: "PRJ-101",
    targetName: "브랜드 캠페인 영상",
    actor: "운영자1",
    actorRole: "슈퍼관리자",
    details: "공개 프로젝트 승인 처리",
    ipAddress: "192.168.1.100"
  },
  {
    id: "LOG-002",
    timestamp: "2026-01-20 10:28:15",
    category: "USER",
    action: "기업 인증 승인",
    actionType: "APPROVE",
    targetType: "기업",
    targetId: "COM-234",
    targetName: "(주)크리에이티브랩",
    actor: "운영자2",
    actorRole: "관리자",
    details: "사업자 인증 승인",
    ipAddress: "192.168.1.101"
  },
  {
    id: "LOG-003",
    timestamp: "2026-01-20 10:15:43",
    category: "DOCUMENT",
    action: "계약서 업로드",
    actionType: "UPLOAD",
    targetType: "프로젝트",
    targetId: "PRJ-098",
    targetName: "기업 IR 영상",
    actor: "김광고주",
    actorRole: "광고주",
    details: "계약서.pdf 업로드",
    ipAddress: "211.234.56.78"
  },
  {
    id: "LOG-004",
    timestamp: "2026-01-20 10:05:11",
    category: "PROJECT",
    action: "상태 변경",
    actionType: "UPDATE",
    targetType: "프로젝트",
    targetId: "PRJ-095",
    targetName: "마케팅 영상",
    actor: "시스템",
    actorRole: "시스템",
    details: "PROPOSAL_OPEN → PROPOSAL_CLOSED (자동 마감)",
    ipAddress: "-"
  },
  {
    id: "LOG-005",
    timestamp: "2026-01-20 09:55:30",
    category: "PROJECT",
    action: "프로젝트 반려",
    actionType: "REJECT",
    targetType: "프로젝트",
    targetId: "PRJ-102",
    targetName: "SNS 광고 시리즈",
    actor: "운영자1",
    actorRole: "슈퍼관리자",
    details: "예산 정보 불명확 - 보완 요청",
    ipAddress: "192.168.1.100"
  },
  {
    id: "LOG-006",
    timestamp: "2026-01-20 09:45:18",
    category: "USER",
    action: "회원 제재",
    actionType: "UPDATE",
    targetType: "회원",
    targetId: "USR-567",
    targetName: "이사기",
    actor: "운영자2",
    actorRole: "관리자",
    details: "스팸 신고에 따른 7일 활동 제한",
    ipAddress: "192.168.1.101"
  },
  {
    id: "LOG-007",
    timestamp: "2026-01-20 09:30:05",
    category: "SYSTEM",
    action: "공지사항 등록",
    actionType: "CREATE",
    targetType: "공지사항",
    targetId: "NTC-045",
    targetName: "설 연휴 운영 안내",
    actor: "운영자1",
    actorRole: "슈퍼관리자",
    details: "새 공지사항 등록",
    ipAddress: "192.168.1.100"
  },
  {
    id: "LOG-008",
    timestamp: "2026-01-20 09:15:42",
    category: "DOCUMENT",
    action: "산출물 다운로드",
    actionType: "DOWNLOAD",
    targetType: "산출물",
    targetId: "DLV-789",
    targetName: "최종본_v3.mp4",
    actor: "박광고주",
    actorRole: "광고주",
    details: "최종 산출물 다운로드",
    ipAddress: "123.456.78.90"
  },
]

const categoryLabels = {
  PROJECT: { label: "프로젝트", icon: FileText, color: "bg-blue-500" },
  USER: { label: "사용자", icon: User, color: "bg-purple-500" },
  SYSTEM: { label: "시스템", icon: Settings, color: "bg-gray-500" },
  DOCUMENT: { label: "문서", icon: Upload, color: "bg-green-500" },
}

const actionTypeIcons = {
  CREATE: Edit,
  UPDATE: RefreshCw,
  DELETE: XCircle,
  APPROVE: CheckCircle,
  REJECT: XCircle,
  VIEW: Eye,
  UPLOAD: Upload,
  DOWNLOAD: Download,
}

export default function ActivityLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [actionFilter, setActionFilter] = useState<string>("all")

  const projectLogs = activityLogs.filter(l => l.category === 'PROJECT')
  const userLogs = activityLogs.filter(l => l.category === 'USER')
  const systemLogs = activityLogs.filter(l => l.category === 'SYSTEM')
  const documentLogs = activityLogs.filter(l => l.category === 'DOCUMENT')

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = 
      log.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter
    const matchesAction = actionFilter === 'all' || log.actionType === actionFilter
    
    return matchesSearch && matchesCategory && matchesAction
  })

  const LogTable = ({ logs }: { logs: ActivityLog[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[160px]">시간</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>액션</TableHead>
          <TableHead>대상</TableHead>
          <TableHead>수행자</TableHead>
          <TableHead>상세</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              로그 내역이 없습니다
            </TableCell>
          </TableRow>
        ) : (
          logs.map((log) => {
            const catInfo = categoryLabels[log.category]
            const ActionIcon = actionTypeIcons[log.actionType]
            return (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {log.timestamp}
                </TableCell>
                <TableCell>
                  <Badge className={`${catInfo.color} text-white`}>
                    <catInfo.icon className="h-3 w-3 mr-1" />
                    {catInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ActionIcon className={`h-4 w-4 ${
                      log.actionType === 'APPROVE' ? 'text-green-500' :
                      log.actionType === 'REJECT' ? 'text-red-500' :
                      log.actionType === 'DELETE' ? 'text-red-500' :
                      'text-muted-foreground'
                    }`} />
                    <span className="text-sm">{log.action}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{log.targetName}</p>
                    <p className="text-xs text-muted-foreground">{log.targetType} · {log.targetId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{log.actor}</p>
                    <p className="text-xs text-muted-foreground">{log.actorRole}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground max-w-[200px] truncate" title={log.details}>
                    {log.details}
                  </p>
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">활동 로그</h1>
        <p className="text-muted-foreground">플랫폼 내 모든 주요 활동 이력을 확인하세요</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{projectLogs.length}</p>
                <p className="text-sm text-muted-foreground">프로젝트</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userLogs.length}</p>
                <p className="text-sm text-muted-foreground">사용자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{documentLogs.length}</p>
                <p className="text-sm text-muted-foreground">문서</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{systemLogs.length}</p>
                <p className="text-sm text-muted-foreground">시스템</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              활동 로그
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="PROJECT">프로젝트</SelectItem>
                  <SelectItem value="USER">사용자</SelectItem>
                  <SelectItem value="DOCUMENT">문서</SelectItem>
                  <SelectItem value="SYSTEM">시스템</SelectItem>
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="액션 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="CREATE">생성</SelectItem>
                  <SelectItem value="UPDATE">수정</SelectItem>
                  <SelectItem value="DELETE">삭제</SelectItem>
                  <SelectItem value="APPROVE">승인</SelectItem>
                  <SelectItem value="REJECT">반려</SelectItem>
                  <SelectItem value="UPLOAD">업로드</SelectItem>
                  <SelectItem value="DOWNLOAD">다운로드</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LogTable logs={filteredLogs} />
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              총 {filteredLogs.length}건의 로그
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                이전
              </Button>
              <Button variant="outline" size="sm">
                다음
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>로그 정책 안내</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">보존 기간</h4>
              <p className="text-sm text-muted-foreground">
                모든 활동 로그는 <strong>1년간</strong> 보존됩니다. 법적 요구 시 연장될 수 있습니다.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">수정 불가</h4>
              <p className="text-sm text-muted-foreground">
                기록된 로그는 <strong>수정 및 삭제가 불가능</strong>합니다. 투명성 확보를 위한 정책입니다.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">접근 권한</h4>
              <p className="text-sm text-muted-foreground">
                활동 로그는 <strong>슈퍼관리자 및 관리자</strong>만 열람할 수 있습니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
