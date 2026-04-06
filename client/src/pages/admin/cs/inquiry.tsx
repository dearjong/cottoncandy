import { useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, HelpCircle } from "lucide-react"
import { MOCK_ALL_INQUIRIES, MOCK_ALL_DISPUTES } from "@/data/mockData"
import { AdminMainTabs } from "@/components/admin/AdminMainTabs"

export default function CsInquiryPage() {
  return (
    <AdminMainTabs>
      <div className="space-y-6">
        <PageHeader
          title="1:1 문의"
          description="회원의 1:1 문의와 분쟁 조정 요청을 처리합니다"
        />

        {/* 1:1 문의 목록 */}
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
          <div className="rounded-md border bg-white">
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
                      <Button size="sm" variant="outline" className="h-7 text-xs">상세보기</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminMainTabs>
  )
}
