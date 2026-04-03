import { StatisticsDashboard } from "@/components/admin/statistics-dashboard"
import { PageHeader } from "@/components/admin/page-header"

export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="통계/리포트" description="플랫폼 성과 데이터와 상세 리포트를 확인하세요" />
      
      <StatisticsDashboard />
    </div>
  )
}