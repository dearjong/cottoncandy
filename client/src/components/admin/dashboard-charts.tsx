import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Activity } from "lucide-react"

export function DashboardCharts() {
  // TODO: remove mock data - replace with real chart library and API data
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

  return (
    <div className="grid gap-2 lg:grid-cols-2">
      <Card data-testid="card-weekly-chart">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-4 pb-1">
          <CardTitle className="text-sm font-medium">주간 활동 현황</CardTitle>
          <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <div className="space-y-2">
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-chart-1 rounded-sm" />
                <span>프로젝트</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-chart-2 rounded-sm" />
                <span>계약</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-chart-3 rounded-sm" />
                <span>리뷰</span>
              </div>
            </div>
            <div className="space-y-1">
              {weeklyData.map((data) => (
                <div key={data.day} className="flex items-center gap-1.5 text-xs">
                  <div className="w-5 font-medium shrink-0">{data.day}</div>
                  <div className="flex-1 flex gap-0.5 min-w-0 overflow-hidden">
                    <div
                      className="bg-chart-1 h-3 rounded-sm shrink-0"
                      style={{ width: `${(data.projects / 70) * 100}%` }}
                    />
                    <div
                      className="bg-chart-2 h-3 rounded-sm shrink-0"
                      style={{ width: `${(data.contracts / 70) * 100}%` }}
                    />
                    <div
                      className="bg-chart-3 h-3 rounded-sm shrink-0"
                      style={{ width: `${(data.reviews / 70) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-right text-muted-foreground shrink-0 text-[10px] min-w-0">
                    {data.projects + data.contracts + data.reviews}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-monthly-chart">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-4 pb-1">
          <CardTitle className="text-sm font-medium">월간 프로젝트 현황</CardTitle>
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <div className="space-y-2">
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-chart-4 rounded-sm" />
                <span>총 등록</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-chart-2 rounded-sm" />
                <span>완료</span>
              </div>
            </div>
            <div className="space-y-1">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex items-center gap-1.5 text-xs">
                  <div className="w-5 font-medium shrink-0">{data.month}</div>
                  <div className="flex-1 relative h-3 min-w-0 overflow-hidden">
                    <div
                      className="bg-chart-4 h-3 rounded-sm absolute left-0 top-0"
                      style={{ width: `${(data.total / 1800) * 100}%` }}
                    />
                    <div
                      className="bg-chart-2 h-3 rounded-sm absolute left-0 top-0"
                      style={{ width: `${(data.completed / 1800) * 100}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-muted-foreground shrink-0 text-[10px] min-w-0">
                    {data.completed}/{data.total}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}