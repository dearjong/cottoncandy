import { AdminSettings } from "@/components/admin-settings"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">관리자 설정</h1>
        <p className="text-muted-foreground">플랫폼 설정과 관리자 계정을 관리하세요</p>
      </div>
      
      <AdminSettings />
    </div>
  )
}