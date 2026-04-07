import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  ChevronRight,
  Users,
  FileText,
  Video,
  CheckCircle2,
  ArrowRight
} from "lucide-react"
import { Link } from "wouter"
import { Project_detailPopup } from "@/components/admin/Project_detailPopup"
import { AdminMainTabs } from "@/components/admin/AdminMainTabs"

const pendingItems = {
  approval: 4,
  stopCancel: 2,
  verification: 3,
  reports: 2
}

interface Project {
  id: string
  title: string
  client: string
  status: string
  statusLabel: string
  date?: string
  time?: string
  daysOverdue?: number
  participants?: number
}

const pipelineData = {
  proposal_open: {
    label: "접수중",
    color: "bg-blue-500",
    count: 5,
    projects: [
      { id: "PRJ-001", title: "브랜드 홍보영상 제작", client: "(주)테크스타트업", status: "PROPOSAL_OPEN", statusLabel: "접수중", participants: 8 },
      { id: "PRJ-007", title: "신제품 런칭 영상", client: "코스메틱코리아", status: "PROPOSAL_OPEN", statusLabel: "접수중", participants: 12 },
      { id: "PRJ-011", title: "기업 소개 영상", client: "푸드테크", status: "PROPOSAL_OPEN", statusLabel: "접수중", participants: 5 },
    ]
  },
  ot_scheduled: {
    label: "OT 예정",
    color: "bg-purple-500",
    count: 3,
    projects: [
      { id: "PRJ-002", title: "기업 IR 영상 제작", client: "스마트솔루션(주)", status: "OT_SCHEDULED", statusLabel: "OT 예정", date: "2026-01-21", time: "14:00" },
      { id: "PRJ-008", title: "서비스 소개 영상", client: "핀테크랩", status: "OT_SCHEDULED", statusLabel: "OT 예정", date: "2026-01-22", time: "10:00" },
    ]
  },
  pt_scheduled: {
    label: "PT 예정",
    color: "bg-orange-500",
    count: 2,
    projects: [
      { id: "PRJ-003", title: "마케팅 전략 영상", client: "로컬푸드(주)", status: "PT_SCHEDULED", statusLabel: "PT 예정", date: "2026-01-20", time: "16:00" },
      { id: "PRJ-009", title: "브랜드 리뉴얼 영상", client: "패션브랜드", status: "PT_SCHEDULED", statusLabel: "PT 예정", date: "2026-01-23", time: "15:00" },
    ]
  },
  selected: {
    label: "선정완료",
    color: "bg-green-500",
    count: 4,
    projects: [
      { id: "PRJ-004", title: "제품 광고 영상", client: "전자산업(주)", status: "SELECTED", statusLabel: "선정완료" },
      { id: "PRJ-010", title: "브랜드 캠페인", client: "뷰티브랜드", status: "SELECTED", statusLabel: "선정완료" },
    ]
  },
  production: {
    label: "제작중",
    color: "bg-cyan-500",
    count: 6,
    projects: [
      { id: "PRJ-005", title: "홍보 영상 제작", client: "IT솔루션", status: "SHOOTING", statusLabel: "촬영중" },
      { id: "PRJ-006", title: "디지털 광고", client: "이커머스코리아", status: "EDITING", statusLabel: "후반작업" },
      { id: "PRJ-012", title: "TV 광고", client: "식품회사", status: "DRAFT_SUBMITTED", statusLabel: "시안제출" },
    ]
  },
  complete: {
    label: "완료",
    color: "bg-gray-500",
    count: 12,
    projects: []
  }
}

const todaySchedule: Project[] = [
  { id: "PRJ-003", title: "마케팅 전략 컨설팅", client: "핀테크랩", status: "PT_SCHEDULED", statusLabel: "PT", date: "2026-01-20", time: "16:00" },
  { id: "PRJ-009", title: "TV CF 제작", client: "헬스케어", status: "OT_SCHEDULED", statusLabel: "OT", date: "2026-01-20", time: "10:00" },
  { id: "PRJ-005", title: "SNS 광고 캠페인", client: "뷰티브랜드", status: "PROPOSAL_CLOSED", statusLabel: "마감", date: "2026-01-20", time: "18:00" },
]

const delayedProjects: Project[] = [
  { id: "PRJ-008", title: "유튜브 채널 운영 대행", client: "제조업체", status: "OT_SCHEDULED", statusLabel: "OT 일정 초과", daysOverdue: 3 },
  { id: "PRJ-001", title: "브랜드 홍보 영상 제작", client: "베스트전자", status: "PROPOSAL_SUBMIT", statusLabel: "제안서 미제출", daysOverdue: 5 },
  { id: "PRJ-050", title: "브랜드 리뉴얼 영상 제작", client: "(주)패션브랜드", status: "EDITING", statusLabel: "후반작업 지연", daysOverdue: 2 },
]

export default function ProgressPage() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailProjectId, setDetailProjectId] = useState<string | null>(null)

  return (
    <AdminMainTabs>
      <div className="space-y-4">
      <Card>
        <CardHeader className="py-2.5 px-3">
          <CardTitle className="text-sm font-semibold">운영자 처리 대기</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 pb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Link href="/admin/pending-approval">
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-md border border-yellow-200 bg-yellow-50">
              <Clock className="h-4 w-4 shrink-0 text-yellow-600" />
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">승인 대기</p>
                <p className="text-lg font-bold leading-tight">{pendingItems.approval}</p>
              </div>
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            </div>
          </Link>
          <Link href="/admin/stop-cancel">
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-md border border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 shrink-0 text-orange-600" />
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">중단/취소</p>
                <p className="text-lg font-bold leading-tight">{pendingItems.stopCancel}</p>
              </div>
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            </div>
          </Link>
          <Link href="/admin/company-verification">
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-md border border-blue-200 bg-blue-50">
              <FileText className="h-4 w-4 shrink-0 text-blue-600" />
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">인증 대기</p>
                <p className="text-lg font-bold leading-tight">{pendingItems.verification}</p>
              </div>
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            </div>
          </Link>
          <Link href="/admin/reports-management">
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-md border border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">신고 처리</p>
                <p className="text-lg font-bold leading-tight">{pendingItems.reports}</p>
              </div>
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            </div>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {Object.entries(pipelineData).map(([key, stage]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-all hover:shadow-md ${selectedStage === key ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedStage(selectedStage === key ? null : key)}
          >
            <CardContent className="p-2.5">
              <div className="flex items-center justify-between mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                <span className="text-xl font-bold">{stage.count}</span>
              </div>
              <p className="text-xs text-muted-foreground">{stage.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStage && pipelineData[selectedStage as keyof typeof pipelineData].projects.length > 0 && (
        <Card>
          <CardHeader className="py-2.5 px-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <div className={`w-2.5 h-2.5 rounded-full ${pipelineData[selectedStage as keyof typeof pipelineData].color}`} />
              {pipelineData[selectedStage as keyof typeof pipelineData].label} 프로젝트
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            <div className="space-y-2">
              {pipelineData[selectedStage as keyof typeof pipelineData].projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground shrink-0">{project.id}</span>
                      <span
                        className="font-medium truncate cursor-pointer hover:underline hover:text-primary"
                        onClick={() => { setDetailProjectId(project.id); setDetailOpen(true) }}
                      >{project.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{project.client}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {'date' in project && project.date && (
                      <div className="text-right text-xs">
                        <p className="text-muted-foreground">{project.date}</p>
                        {'time' in project && <p className="font-medium">{project.time}</p>}
                      </div>
                    )}
                    {'participants' in project && project.participants && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {project.participants}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="py-2.5 px-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              오늘의 일정
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            {todaySchedule.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 text-sm">오늘 예정된 일정이 없습니다</p>
            ) : (
              <div className="space-y-2">
                {todaySchedule.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg text-sm cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => {
                      setDetailProjectId(item.id)
                      setDetailOpen(true)
                    }}
                  >
                    <div className="flex items-center gap-1.5 min-w-[72px]">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{item.time}</span>
                    </div>
                    <Badge variant={item.statusLabel === "PT" ? "default" : item.statusLabel === "OT" ? "secondary" : "outline"}>
                      {item.statusLabel}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.client}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDetailProjectId(item.id)
                        setDetailOpen(true)
                      }}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-2.5 px-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              지연 프로젝트
              <Badge variant="destructive" className="ml-1.5 text-xs">{delayedProjects.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            {delayedProjects.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-1" />
                <p className="text-muted-foreground text-sm">지연된 프로젝트가 없습니다</p>
              </div>
            ) : (
              <div className="space-y-2">
                {delayedProjects.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 bg-destructive/10 rounded-lg border border-destructive/20 text-sm cursor-pointer hover:bg-destructive/15 transition-colors"
                    onClick={() => {
                      setDetailProjectId(item.id)
                      setDetailOpen(true)
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{item.id}</span>
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.client}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-destructive">{item.statusLabel}</p>
                      <p className="text-xs text-muted-foreground">{item.daysOverdue}일 초과</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDetailProjectId(item.id)
                        setDetailOpen(true)
                      }}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {detailProjectId && (
        <Project_detailPopup
          open={detailOpen}
          onOpenChange={(open) => {
            setDetailOpen(open)
            if (!open) {
              setDetailProjectId(null)
            }
          }}
          projectId={detailProjectId}
        />
      )}

      </div>
    </AdminMainTabs>
  )
}
