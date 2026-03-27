import { AdminCalendar } from "@/components/admin-calendar"

export default function CalendarPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">관리자 캘린더</h1>
        <p className="text-muted-foreground">날짜별 업무 활동 현황을 확인하고 관리하세요</p>
      </div>
      
      <AdminCalendar />
    </div>
  )
}