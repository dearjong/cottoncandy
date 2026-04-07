import { DashboardStats } from "@/components/admin/dashboard-stats"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { AdminAlerts } from "@/components/admin/admin-alerts"
import { AdminMainTabs } from "@/components/admin/AdminMainTabs"

export default function Dashboard() {
  return (
    <AdminMainTabs>
      <DashboardStats />
      <DashboardCharts />
      <AdminAlerts />
    </AdminMainTabs>
  )
}
