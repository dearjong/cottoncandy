import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"

const chatHistory = [
  { id: "C001", user: "김철수", message: "프로젝트 등록 방법을 알고 싶습니다.", timestamp: "2024-06-15 14:45", category: "프로젝트 등록", status: "resolved" as const },
  { id: "C002", user: "이영희", message: "계약서 수정이 가능한가요?", timestamp: "2024-06-15 13:20", category: "계약 관리", status: "active" as const },
  { id: "C003", user: "박민수", message: "정산 일정을 확인하고 싶습니다.", timestamp: "2024-06-15 11:10", category: "정산 문의", status: "resolved" as const },
]

export default function CsAiChatPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="AI 채팅 상담"
        description="AI 챗봇을 통한 고객 상담 내역을 확인하고 관리합니다"
        hidePeriodFilter
      />

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>사용자</TableHead>
              <TableHead>메시지</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>시간</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chatHistory.map((chat) => (
              <TableRow key={chat.id}>
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
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <Eye className="h-3 w-3 mr-1" />상세
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
