import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard-charts"
import { AdminAlerts } from "@/components/admin-alerts"

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">대시보드</h1>
        <p className="text-muted-foreground">프로젝트 관리 플랫폼의 전체 현황을 확인하세요</p>
      </div>
      
      <DashboardStats />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>
        <div>
          <AdminAlerts />
        </div>
      </div>
    </div>
  )
}