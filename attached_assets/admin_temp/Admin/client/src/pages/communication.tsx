import { CommunicationCenter } from "@/components/communication-center"

export default function CommunicationPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">커뮤니케이션</h1>
        <p className="text-muted-foreground">알림 발송 및 고객 상담 내역을 관리하세요</p>
      </div>
      
      <CommunicationCenter />
    </div>
  )
}