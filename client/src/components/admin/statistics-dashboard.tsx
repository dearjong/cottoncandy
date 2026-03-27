import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Download, 
  DollarSign, 
  Users, 
  FileText, 
  Star,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"

export function StatisticsDashboard() {
  // TODO: remove mock data - replace with real API data
  const overallStats = {
    totalProjects: 1234,
    totalContracts: 856,
    totalRevenue: "48억 2천만원",
    activePartners: 342,
    averageRating: 4.7,
    completionRate: 94.2
  }

  const monthlyData = [
    { month: "1월", projects: 98, revenue: "3.2억" },
    { month: "2월", projects: 115, revenue: "4.1억" },
    { month: "3월", projects: 132, revenue: "5.8억" },
    { month: "4월", projects: 108, revenue: "4.5억" },
    { month: "5월", projects: 145, revenue: "6.2억" },
    { month: "6월", projects: 167, revenue: "7.8억" },
  ]

  const partnerStats = [
    { type: "광고주", count: 89, percentage: 26 },
    { type: "대행사", count: 76, percentage: 22 },
    { type: "제작사", count: 124, percentage: 36 },
    { type: "프리랜서", count: 53, percentage: 16 },
  ]

  const topPerformers = [
    { name: "크리에이티브 스튜디오", projects: 34, rating: 4.9, revenue: "2.1억" },
    { name: "비디오 프로덕션", projects: 28, rating: 4.8, revenue: "1.8억" },
    { name: "디지털 에이전시", projects: 25, rating: 4.7, revenue: "1.5억" },
  ]

  const handleDownloadReport = (type: string) => {
    console.log(`Downloading ${type} report`)
    // TODO: replace with real report download functionality
  }

  return (
    <div className="space-y-6">
      {/* 전체 통계 개요 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card data-testid="card-total-projects">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 프로젝트</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalProjects.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% 전월 대비</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-revenue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">+18% 전월 대비</p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-partners">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 파트너</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.activePartners}</div>
            <p className="text-xs text-muted-foreground">+8% 전월 대비</p>
          </CardContent>
        </Card>

        <Card data-testid="card-average-rating">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageRating}</div>
            <p className="text-xs text-muted-foreground">5점 만점</p>
          </CardContent>
        </Card>

        <Card data-testid="card-completion-rate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료율</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% 전월 대비</p>
          </CardContent>
        </Card>

        <Card data-testid="card-download-reports">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">리포트</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => handleDownloadReport('monthly')}
              data-testid="button-download-report"
            >
              월간 리포트
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 월별 프로젝트 및 매출 현황 */}
        <Card data-testid="card-monthly-performance">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">월별 성과 현황</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-1 rounded-sm"></div>
                  <span>프로젝트 수</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-2 rounded-sm"></div>
                  <span>매출</span>
                </div>
              </div>
              <div className="space-y-3">
                {monthlyData.map((data) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 text-sm font-medium">{data.month}</div>
                      <div className="flex gap-1">
                        <div 
                          className="bg-chart-1 h-4 rounded-sm"
                          style={{ width: `${(data.projects / 180) * 60}px` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {data.projects}건 / {data.revenue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 파트너 타입별 분포 */}
        <Card data-testid="card-partner-distribution">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">파트너 타입별 분포</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partnerStats.map((partner, index) => (
                <div key={partner.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-3 h-3 rounded-sm bg-chart-${index + 1}`}
                    />
                    <span className="text-sm font-medium">{partner.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{partner.count}명</span>
                    <Badge variant="secondary">{partner.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 우수 파트너 현황 */}
      <Card data-testid="card-top-performers">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">우수 파트너 현황</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div 
                key={performer.name} 
                className="flex items-center justify-between p-3 rounded border"
                data-testid={`top-performer-${index}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{performer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {performer.projects}개 프로젝트 완료
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{performer.rating}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{performer.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}