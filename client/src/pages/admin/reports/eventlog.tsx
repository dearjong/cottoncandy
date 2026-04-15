import { PageHeader } from "@/components/admin/page-header";
import { EventLogTab } from "@/pages/admin/event-log";

export default function ReportsEventLogPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="이벤트 로그"
        description="홈 카테고리·카드·FAQ·GNB 등 사용자 클릭을 실시간으로 확인합니다"
        hidePeriodFilter
      />
      <EventLogTab />
    </div>
  );
}
