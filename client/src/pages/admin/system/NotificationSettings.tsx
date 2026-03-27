import ContentManagement from "@/pages/admin/content/ContentManagement"

/** admin_v2 콘텐츠 > 알림 설정(`content-settings`)과 동일한 화면 */
export default function AdminNotificationSettings() {
  return (
    <div className="space-y-6 p-6">
      <ContentManagement activeTab="content-settings" />
    </div>
  )
}
