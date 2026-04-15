import { useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle } from "lucide-react"
import { MOCK_ALL_INQUIRIES } from "@/data/mockData"

type Inquiry = typeof MOCK_ALL_INQUIRIES[number]

export default function CsInquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_ALL_INQUIRIES)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [draftAnswer, setDraftAnswer] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const isWaiting = selected?.status === "WAITING"

  function openDialog(item: Inquiry) {
    setSelected(item)
    setDraftAnswer("")
    setDialogOpen(true)
  }

  function handleSubmit() {
    if (!selected || !draftAnswer.trim()) return
    setInquiries(prev =>
      prev.map(i =>
        i.id === selected.id
          ? { ...i, status: "ANSWERED" as const, answer: draftAnswer.trim() }
          : i
      )
    )
    setDialogOpen(false)
    setSelected(null)
    setDraftAnswer("")
  }

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
            ({inquiries.filter(i => i.status === "WAITING").length}건 미답변)
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
              {inquiries.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.user}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.company}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === "WAITING" ? "destructive" : "outline"}
                      className={item.status === "ANSWERED" ? "text-muted-foreground" : ""}
                    >
                      {item.status === "WAITING" ? "미답변" : "답변완료"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => openDialog(item)}
                    >
                      {item.status === "WAITING" ? "답변하기" : "내용보기"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base">
              {isWaiting ? "답변하기" : "문의 내용 보기"}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4 py-1">
              {/* 문의 메타 */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">{selected.category}</Badge>
                <span>{selected.user}</span>
                <span>·</span>
                <span>{selected.company}</span>
                <span>·</span>
                <span>{selected.date}</span>
              </div>

              {/* 제목 */}
              <p className="font-semibold text-sm">{selected.title}</p>

              {/* 문의 내용 */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selected.content}
              </div>

              {/* 답변 영역 */}
              {isWaiting ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600">답변 내용</p>
                  <Textarea
                    placeholder="답변을 입력하세요..."
                    className="min-h-[120px] text-sm resize-none"
                    value={draftAnswer}
                    onChange={e => setDraftAnswer(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600">관리자 답변</p>
                  <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selected.answer || "—"}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {isWaiting ? "취소" : "닫기"}
            </Button>
            {isWaiting && (
              <Button
                className="bg-pink-600 hover:bg-pink-700 text-white"
                disabled={!draftAnswer.trim()}
                onClick={handleSubmit}
              >
                답변 등록
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
