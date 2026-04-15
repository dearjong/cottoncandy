import { PageHeader } from "@/components/admin/page-header";
import { StatisticsDashboard } from "@/components/admin/statistics-dashboard";

export default function ReportsPlatformPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="플랫폼 현황" description="플랫폼 전체 성과 데이터와 주요 지표를 확인하세요" hidePeriodFilter />
      <StatisticsDashboard />
    </div>
  );
}
