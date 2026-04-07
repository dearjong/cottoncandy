import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Activity } from "lucide-react"

export function DashboardCharts() {
  const weeklyData = [
    { day: "월", projects: 45, contracts: 32, reviews: 28 },
    { day: "화", projects: 52, contracts: 38, reviews: 31 },
    { day: "수", projects: 48, contracts: 35, reviews: 29 },
    { day: "목", projects: 61, contracts: 42, reviews: 35 },
    { day: "금", projects: 55, contracts: 39, reviews: 33 },
    { day: "토", projects: 23, contracts: 15, reviews: 12 },
    { day: "일", projects: 18, contracts: 12, reviews: 10 },
  ]

  const monthlyData = [
    { month: "1월", total: 1250, completed: 1180 },
    { month: "2월", total: 1380, completed: 1320 },
    { month: "3월", total: 1420, completed: 1350 },
    { month: "4월", total: 1380, completed: 1295 },
    { month: "5월", total: 1520, completed: 1450 },
    { month: "6월", total: 1680, completed: 1580 },
  ]

  const chartH = 108
  const weeklyMax = Math.max(...weeklyData.map(d => d.projects + d.contracts + d.reviews))
  const monthlyMax = Math.max(...monthlyData.map(d => d.total))

  return (
    <div className="grid gap-2 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-4 pb-1">
          <CardTitle className="text-sm font-medium">주간 활동 현황</CardTitle>
          <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-1">
          <div className="flex gap-3 text-xs mb-3">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-chart-1 rounded-sm" /><span>프로젝트</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-chart-2 rounded-sm" /><span>계약</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-chart-3 rounded-sm" /><span>리뷰</span></div>
          </div>
          <div className="flex items-end justify-between gap-1.5" style={{ height: chartH }}>
            {weeklyData.map((d) => {
              const total = d.projects + d.contracts + d.reviews
              const colH = Math.round((total / weeklyMax) * chartH)
              const pH = Math.round((d.projects / total) * colH)
              const cH = Math.round((d.contracts / total) * colH)
              const rH = colH - pH - cH
              return (
                <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full flex flex-col justify-end overflow-hidden rounded-t-sm" style={{ height: colH }}>
                    <div className="bg-chart-3 w-full shrink-0" style={{ height: rH }} />
                    <div className="bg-chart-2 w-full shrink-0" style={{ height: cH }} />
                    <div className="bg-chart-1 w-full shrink-0" style={{ height: pH }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-4 pb-1">
          <CardTitle className="text-sm font-medium">월간 프로젝트 현황</CardTitle>
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-1">
          <div className="flex gap-3 text-xs mb-3">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-chart-4 rounded-sm" /><span>총 등록</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-chart-2 rounded-sm" /><span>완료</span></div>
          </div>
          <div className="flex items-end justify-between gap-1.5" style={{ height: chartH }}>
            {monthlyData.map((d) => {
              const totalH = Math.round((d.total / monthlyMax) * chartH)
              const completedH = Math.round((d.completed / monthlyMax) * chartH)
              return (
                <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full relative rounded-t-sm overflow-hidden" style={{ height: totalH }}>
                    <div className="absolute inset-0 bg-chart-4" />
                    <div className="absolute bottom-0 left-0 right-0 bg-chart-2" style={{ height: completedH }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.month}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
