import { useState } from "react"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { AdminAlerts } from "@/components/admin/admin-alerts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  ArrowRight,
  Clock,
  AlertTriangle
} from "lucide-react"
import { Link } from "wouter"
import { AdminMainTabs } from "@/components/admin/AdminMainTabs"

type FilterPeriod = "ALL" | "1Y" | "1M" | "CUSTOM"

const stageProgress = {
  draft: { label: "임시저장", count: 2, color: "bg-slate-400" },
  proposal: { label: "접수중", count: 5, color: "bg-blue-500" },
  ot: { label: "OT", count: 3, color: "bg-purple-500" },
  pt: { label: "PT", count: 2, color: "bg-orange-500" },
  selected: { label: "계약", count: 4, color: "bg-green-500" },
  production: { label: "제작중", count: 6, color: "bg-cyan-500" },
  complete: { label: "완료", count: 12, color: "bg-emerald-600" },
  cancelled: { label: "취소", count: 1, color: "bg-gray-500" },
  stopped: { label: "중단", count: 1, color: "bg-red-500" },
}

const todaySchedule = [
  { id: "PRJ-003", title: "마케팅 전략 영상", type: "PT", time: "16:00" },
  { id: "PRJ-015", title: "제품 소개 영상", type: "OT", time: "10:00" },
]

const pendingItems = {
  approval: 4,
  stopCancel: 2,
  verification: 3,
  reports: 2
}

export default function Dashboard() {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("ALL")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")

  return (
    <AdminMainTabs>
      {/* 기간 필터 */}
      <div className="flex items-center gap-2 justify-end">
        <Select value={filterPeriod} onValueChange={(v) => setFilterPeriod(v as FilterPeriod)}>
          <SelectTrigger className="w-32 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 기간</SelectItem>
            <SelectItem value="1Y">최근 1년</SelectItem>
            <SelectItem value="1M">이번 달</SelectItem>
            <SelectItem value="CUSTOM">직접 입력</SelectItem>
          </SelectContent>
        </Select>
        <input
          type="date"
          value={customFrom}
          onChange={(e) => setCustomFrom(e.target.value)}
          disabled={filterPeriod !== "CUSTOM"}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        />
        <span className="text-xs text-muted-foreground">~</span>
        <input
          type="date"
          value={customTo}
          onChange={(e) => setCustomTo(e.target.value)}
          disabled={filterPeriod !== "CUSTOM"}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        />
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-2 items-stretch">
        <Card className="min-w-0">
          <CardHeader className="py-2.5 px-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold">프로젝트 단계별 현황</CardTitle>
            <Link href="/admin/progress">
              <Button variant="ghost" size="sm" className="h-7 text-xs -mr-1">
                상세보기 <ArrowRight className="ml-0.5 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0 px-2 pb-2.5 flex flex-wrap items-center gap-1.5">
            {Object.entries(stageProgress).map(([key, stage], index) => (
              <div key={key} className="flex items-center">
                <div className="text-center px-2 py-1 bg-muted rounded-md min-w-[52px]">
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${stage.color}`} />
                    <span className="text-[10px] text-muted-foreground">{stage.label}</span>
                  </div>
                  <p className="text-sm font-bold leading-none">{stage.count}</p>
                </div>
                {index < Object.entries(stageProgress).length - 1 && (
                  <ArrowRight className="mx-0.5 h-2.5 w-2.5 text-muted-foreground shrink-0" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="min-w-0 w-fit">
          <CardHeader className="py-2.5 px-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold shrink-0">운영자 처리 대기</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-2 pb-2 grid grid-cols-2 gap-1.5 lg:grid-cols-[repeat(4,minmax(120px,1fr))]">
            <Link href="/admin/pending-approval" className="min-w-0">
              <div className="flex items-center justify-between gap-1.5 p-2 rounded-md border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 min-w-0 w-full">
                <Clock className="h-3.5 w-3.5 shrink-0 text-yellow-600" />
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs text-muted-foreground leading-tight">승인 대기</p>
                  <p className="text-base font-bold leading-tight">{pendingItems.approval}</p>
                </div>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/admin/stop-cancel" className="min-w-0">
              <div className="flex items-center justify-between gap-1.5 p-2 rounded-md border border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800 min-w-0 w-full">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-orange-600" />
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs text-muted-foreground leading-tight">중단/취소</p>
                  <p className="text-base font-bold leading-tight">{pendingItems.stopCancel}</p>
                </div>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/admin/company-verification" className="min-w-0">
              <div className="flex items-center justify-between gap-1.5 p-2 rounded-md border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 min-w-0 w-full">
                <FileText className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs text-muted-foreground leading-tight">인증 대기</p>
                  <p className="text-base font-bold leading-tight">{pendingItems.verification}</p>
                </div>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/admin/reports-management" className="min-w-0">
              <div className="flex items-center justify-between gap-1.5 p-2 rounded-md border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 min-w-0 w-full">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-600" />
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs text-muted-foreground leading-tight">신고 처리</p>
                  <p className="text-base font-bold leading-tight">{pendingItems.reports}</p>
                </div>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              오늘의 일정
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-3">
            {todaySchedule.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">오늘 일정 없음</p>
            ) : (
              <div className="space-y-1.5">
                {todaySchedule.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1.5 px-2 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Badge variant={item.type === "PT" ? "default" : "secondary"} className={item.type !== "PT" ? "text-[10px] px-1.5 py-0 h-5 border-0 shrink-0 text-white bg-slate-600" : "text-[10px] px-1.5 py-0 h-5 border-0 shrink-0"}>
                        {item.type}
                      </Badge>
                      <span className="text-xs font-medium truncate">{item.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>
      </div>

      <AdminAlerts />
    </AdminMainTabs>
  )
}