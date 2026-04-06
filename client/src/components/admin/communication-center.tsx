import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  Send, 
  Mail, 
  MessageCircle, 
  Phone,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  HelpCircle
} from "lucide-react"
import { MOCK_ALL_INQUIRIES, MOCK_ALL_DISPUTES } from "@/data/mockData"

interface NotificationHistory {
  id: string
  recipient: string
  type: 'email' | 'sms' | 'kakao' | 'push'
  title: string
  content: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  sentAt: string
  readAt?: string
}

interface ChatHistory {
  id: string
  user: string
  message: string
  timestamp: string
  category: string
  status: 'active' | 'resolved'
}

interface CommunicationCenterProps {
  onTabChange?: (tab: string) => void
}

export function CommunicationCenter({ onTabChange }: CommunicationCenterProps) {
  const [activeTab, setActiveTab] = useState("inquiry")
  const [newNotification, setNewNotification] = useState({
    type: 'email',
    recipients: '',
    title: '',
    content: ''
  })

  // TODO: remove mock data - replace with real API data
  const notificationHistory: NotificationHistory[] = [
    {
      id: "N001",
      recipient: "kim@techstartup.co.kr",
      type: "email",
      title: "프로젝트 승인 완료 안내",
      content: "귀하의 프로젝트가 승인되었습니다.",
      status: "read",
      sentAt: "2024-06-15 14:30",
      readAt: "2024-06-15 14:35"
    },
    {
      id: "N002",
      recipient: "010-1234-5678",
      type: "sms",
      title: "비딩 마감 알림",
      content: "프로젝트 비딩이 내일 마감됩니다.",
      status: "delivered",
      sentAt: "2024-06-15 10:00"
    },
    {
      id: "N003",
      recipient: "lee@creative.co.kr",
      type: "kakao",
      title: "계약서 확인 요청",
      content: "계약서 검토 후 서명해 주세요.",
      status: "read",
      sentAt: "2024-06-14 16:20",
      readAt: "2024-06-14 16:25"
    }
  ]

  const chatHistory: ChatHistory[] = [
    {
      id: "C001",
      user: "김철수",
      message: "프로젝트 등록 방법을 알고 싶습니다.",
      timestamp: "2024-06-15 14:45",
      category: "프로젝트 등록",
      status: "resolved"
    },
    {
      id: "C002",
      user: "이영희",
      message: "계약서 수정이 가능한가요?",
      timestamp: "2024-06-15 13:20",
      category: "계약 관리",
      status: "active"
    },
    {
      id: "C003",
      user: "박민수",
      message: "정산 일정을 확인하고 싶습니다.",
      timestamp: "2024-06-15 11:10",
      category: "정산 문의",
      status: "resolved"
    }
  ]

  const getStatusIcon = (status: NotificationHistory['status']) => {
    switch (status) {
      case 'sent':
        return <Send className="h-3 w-3 text-blue-500" />
      case 'delivered':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'read':
        return <Eye className="h-3 w-3 text-green-600" />
      case 'failed':
        return <Clock className="h-3 w-3 text-red-500" />
    }
  }

  const getTypeIcon = (type: NotificationHistory['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="h-3 w-3" />
      case 'sms':
        return <Phone className="h-3 w-3" />
      case 'kakao':
        return <MessageCircle className="h-3 w-3" />
      case 'push':
        return <MessageSquare className="h-3 w-3" />
    }
  }

  const handleSendNotification = () => {
    console.log('Sending notification:', newNotification)
    // TODO: replace with real API call
    setNewNotification({ type: 'email', recipients: '', title: '', content: '' })
  }

  const handleViewChat = (chatId: string) => {
    console.log('Viewing chat:', chatId)
    // TODO: replace with real chat view functionality
  }

  return (
    <div className="space-y-6">
      <Card data-testid="card-communication-center">
        {/* CardTitle 제거: 상위 페이지에서 이미 헤더가 노출되도록 중복 UI를 없앰 */}
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); onTabChange?.(v) }} className="space-y-4">
            <TabsList className="grid w-full max-w-[560px] grid-cols-4">
              <TabsTrigger value="inquiry">1:1 문의</TabsTrigger>
              <TabsTrigger value="notifications">알림 발송</TabsTrigger>
              <TabsTrigger value="history">발송 내역</TabsTrigger>
              <TabsTrigger value="chat">AI 채팅 상담</TabsTrigger>
            </TabsList>

            <TabsContent value="inquiry" className="space-y-6">
              {/* 1:1 문의 목록 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-semibold">1:1 문의</h3>
                  <span className="text-xs text-muted-foreground">
                    ({MOCK_ALL_INQUIRIES.filter(i => i.status === 'WAITING').length}건 미답변)
                  </span>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>카테고리</TableHead>
                        <TableHead>제목</TableHead>
                        <TableHead>문의자</TableHead>
                        <TableHead>소속</TableHead>
                        <TableHead>접수일</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_ALL_INQUIRIES.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>{item.user}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.company}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'WAITING' ? 'destructive' : 'secondary'}>
                              {item.status === 'WAITING' ? '미답변' : '답변완료'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                              {item.status === 'WAITING' ? '답변하기' : '내용보기'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* 분쟁 조정 목록 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <h3 className="text-sm font-semibold">분쟁 조정</h3>
                  <span className="text-xs text-muted-foreground">
                    ({MOCK_ALL_DISPUTES.filter(d => d.status !== 'RESOLVED').length}건 진행 중)
                  </span>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>유형</TableHead>
                        <TableHead>제목</TableHead>
                        <TableHead>프로젝트</TableHead>
                        <TableHead>신청자</TableHead>
                        <TableHead>상대방</TableHead>
                        <TableHead>진행상황</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_ALL_DISPUTES.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.project}</TableCell>
                          <TableCell className="text-sm">{item.claimant}</TableCell>
                          <TableCell className="text-sm">{item.respondent}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.progress}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === 'URGENT' ? 'destructive' :
                                item.status === 'PROCESS' ? 'default' : 'secondary'
                              }
                            >
                              {item.status === 'URGENT' ? '긴급' :
                               item.status === 'PROCESS' ? '처리중' : '해결완료'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                              상세보기
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">새 알림 발송</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">발송 방법</label>
                      <Select 
                        value={newNotification.type} 
                        onValueChange={(value) => setNewNotification({...newNotification, type: value})}
                      >
                        <SelectTrigger data-testid="select-notification-type">
                          <SelectValue />
                        </SelectTrigger>
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
                      <Input
                        placeholder="이메일 또는 전화번호 입력"
                        value={newNotification.recipients}
                        onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                        data-testid="input-notification-recipients"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">제목</label>
                    <Input
                      placeholder="알림 제목을 입력하세요"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                      data-testid="input-notification-title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">내용</label>
                    <Textarea
                      placeholder="알림 내용을 입력하세요"
                      value={newNotification.content}
                      onChange={(e) => setNewNotification({...newNotification, content: e.target.value})}
                      rows={4}
                      data-testid="textarea-notification-content"
                    />
                  </div>
                  <Button 
                    onClick={handleSendNotification}
                    className="w-full"
                    data-testid="button-send-notification"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    알림 발송
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="rounded-md border">
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
                    {notificationHistory.map((notification) => (
                      <TableRow key={notification.id} data-testid={`row-notification-${notification.id}`}>
                        <TableCell>{notification.recipient}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(notification.type)}
                            <Badge variant="outline">{notification.type}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(notification.status)}
                            <span className="text-sm">{notification.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{notification.sentAt}</TableCell>
                        <TableCell className="text-sm">{notification.readAt || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>사용자</TableHead>
                      <TableHead>메시지</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>시간</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chatHistory.map((chat) => (
                      <TableRow key={chat.id} data-testid={`row-chat-${chat.id}`}>
                        <TableCell className="font-medium">{chat.user}</TableCell>
                        <TableCell className="max-w-xs truncate">{chat.message}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{chat.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={chat.status === 'active' ? 'default' : 'secondary'}>
                            {chat.status === 'active' ? '진행중' : '해결됨'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{chat.timestamp}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewChat(chat.id)}
                            data-testid={`button-view-chat-${chat.id}`}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            상세
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}