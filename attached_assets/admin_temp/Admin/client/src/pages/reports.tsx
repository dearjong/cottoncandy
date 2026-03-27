import { StatisticsDashboard } from "@/components/statistics-dashboard"

export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">통계/리포트</h1>
        <p className="text-muted-foreground">플랫폼 성과 데이터와 상세 리포트를 확인하세요</p>
      </div>
      
      <StatisticsDashboard />
    </div>
  )
}