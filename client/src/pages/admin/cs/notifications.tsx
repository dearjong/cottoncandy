import { useState } from "react"
import { publishAnalytics } from "@/lib/analytics"
import { PageHeader } from "@/components/admin/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Mail, MessageCircle, Phone, MessageSquare, Eye, Clock, CheckCircle } from "lucide-react"

type NotifType = 'email' | 'sms' | 'kakao' | 'push'
type NotifStatus = 'sent' | 'delivered' | 'read' | 'failed'

const notificationHistory = [
  { id: "N001", recipient: "kim@techstartup.co.kr", type: "email" as NotifType, title: "프로젝트 승인 완료 안내", status: "read" as NotifStatus, sentAt: "2024-06-15 14:30", readAt: "2024-06-15 14:35" },
  { id: "N002", recipient: "010-1234-5678", type: "sms" as NotifType, title: "비딩 마감 알림", status: "delivered" as NotifStatus, sentAt: "2024-06-15 10:00", readAt: undefined },
  { id: "N003", recipient: "lee@creative.co.kr", type: "kakao" as NotifType, title: "계약서 확인 요청", status: "read" as NotifStatus, sentAt: "2024-06-14 16:20", readAt: "2024-06-14 16:25" },
]

const typeIcon = (type: NotifType) => ({
  email: <Mail className="h-3 w-3" />,
  sms: <Phone className="h-3 w-3" />,
  kakao: <MessageCircle className="h-3 w-3" />,
  push: <MessageSquare className="h-3 w-3" />,
}[type])

const statusIcon = (status: NotifStatus) => ({
  sent: <Send className="h-3 w-3 text-blue-500" />,
  delivered: <CheckCircle className="h-3 w-3 text-green-500" />,
  read: <Eye className="h-3 w-3 text-green-600" />,
  failed: <Clock className="h-3 w-3 text-red-500" />,
}[status])

export default function CsNotificationsPage() {
  const [form, setForm] = useState({ type: 'email', recipients: '', title: '', content: '' })
  const [activeTab, setActiveTab] = useState("send")

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="알림 발송"
        description="회원에게 이메일·문자·카카오·푸시 알림을 발송하고 내역을 확인합니다"
        hidePeriodFilter={activeTab !== "history"}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-[280px] grid-cols-2">
          <TabsTrigger value="send">알림 발송</TabsTrigger>
          <TabsTrigger value="history">발송 내역</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">새 알림 발송</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">발송 방법</label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">이메일</SelectItem>
                      <SelectItem value="sms">문자</SelectItem>
                      <SelectItem value="kakao">카카오톡</SelectItem>
                      <SelectItem value="push">푸시 알림</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">수신자</label>
                  <Input placeholder="이메일 또는 전화번호" value={form.recipients} onChange={(e) => setForm({ ...form, recipients: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">제목</label>
                <Input placeholder="알림 제목" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">내용</label>
                <Textarea placeholder="알림 내용" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} />
              </div>
              <Button className="w-full" onClick={() => {
                publishAnalytics("admin_notification_sent", {
                  notif_type: form.type,
                  title: form.title.slice(0, 100),
                  has_recipients: form.recipients.trim().length > 0,
                })
                setForm({ type: 'email', recipients: '', title: '', content: '' })
              }}>
                <Send className="h-4 w-4 mr-2" />알림 발송
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>수신자</TableHead>
                  <TableHead>타입</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>발송시간</TableHead>
                  <TableHead>읽음시간</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notificationHistory.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell>{n.recipient}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {typeIcon(n.type)}
                        <Badge variant="outline">{n.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {statusIcon(n.status)}
                        <span className="text-sm">{n.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{n.sentAt}</TableCell>
                    <TableCell className="text-sm">{n.readAt ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
