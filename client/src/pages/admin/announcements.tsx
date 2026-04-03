import { NoticeBannerManagement } from "@/components/admin/notice-banner-management"
import { PageHeader } from "@/components/admin/page-header"

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="공지 & 배너 관리" description="공지사항과 배너를 작성하고 관리하세요" />
      
      <NoticeBannerManagement />
    </div>
  )
}