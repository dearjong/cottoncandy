import { DashboardStats } from "@/components/admin/dashboard-stats"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { AdminMainTabs } from "@/components/admin/AdminMainTabs"

export default function Dashboard() {
  return (
    <AdminMainTabs>
      <DashboardStats />
      <DashboardCharts />
    </AdminMainTabs>
  )
}
