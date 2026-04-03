import { useState } from "react"
import { CommunicationCenter } from "@/components/admin/communication-center"
import { PageHeader } from "@/components/admin/page-header"

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState("notifications")

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="커뮤니케이션"
        description="알림 발송 및 고객 상담 내역을 관리하세요"
        hidePeriodFilter={activeTab !== "history"}
      />
      <CommunicationCenter onTabChange={setActiveTab} />
    </div>
  )
}
