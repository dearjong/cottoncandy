import { AdminSettings } from "@/components/admin/admin-settings"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <AdminSettings section="admins" />
    </div>
  )
}