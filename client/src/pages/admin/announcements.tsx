import { NoticeBannerManagement } from "@/components/admin/notice-banner-management"

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">공지 & 배너 관리</h1>
        <p className="text-muted-foreground">공지사항과 배너를 작성하고 관리하세요</p>
      </div>
      
      <NoticeBannerManagement />
    </div>
  )
}