import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { HelpCircle } from "lucide-react"
import { MOCK_ALL_INQUIRIES } from "@/data/mockData"

export default function CsInquiryPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="1:1 문의"
        description="회원의 1:1 문의와 분쟁 조정 요청을 처리합니다"
      />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-semibold">1:1 문의</h3>
          <span className="text-xs text-muted-foreground">
            ({MOCK_ALL_INQUIRIES.filter(i => i.status === 'WAITING').length}건 미답변)
          </span>
        </div>
        <div className="rounded-md border bg-white">
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
                  <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
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

    </div>
  )
}
