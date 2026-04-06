import { useState } from "react"
import { CommunicationCenter } from "@/components/admin/communication-center"
import { PageHeader } from "@/components/admin/page-header"

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState("inquiry")

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="커뮤니케이션"
        description="1:1 문의·분쟁 조정·알림 발송을 관리하세요"
        hidePeriodFilter={activeTab !== "history" && activeTab !== "inquiry"}
      />
      <CommunicationCenter onTabChange={setActiveTab} />
    </div>
  )
}
