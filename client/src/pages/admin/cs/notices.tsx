import { useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Globe } from "lucide-react"

interface Notice {
  id: string
  title: string
  content: string
  type: 'general' | 'urgent' | 'maintenance'
  isActive: boolean
  createdAt: string
  priority: number
  language: 'ko' | 'en' | 'all'
}

const mockNotices: Notice[] = [
  { id: "N001", title: "시스템 점검 안내", content: "2024년 6월 20일 새벽 2시부터 4시까지 시스템 점검이 있을 예정입니다.", type: "maintenance", isActive: true, createdAt: "2024-06-15", priority: 1, language: "ko" },
  { id: "N002", title: "새로운 기능 업데이트", content: "프로젝트 관리 기능이 개선되었습니다.", type: "general", isActive: true, createdAt: "2024-06-14", priority: 2, language: "all" },
  { id: "N003", title: "긴급 보안 업데이트", content: "보안 강화를 위한 긴급 업데이트가 진행됩니다.", type: "urgent", isActive: false, createdAt: "2024-06-13", priority: 3, language: "ko" },
]

const typeBadge = (type: Notice['type']) => ({
  general:     { variant: 'default' as const,      label: '일반' },
  urgent:      { variant: 'destructive' as const,  label: '긴급' },
  maintenance: { variant: 'secondary' as const,    label: '점검' },
}[type])

export default function CsNoticesPage() {
  const [newNotice, setNewNotice] = useState({ title: '', content: '', type: 'general', language: 'ko' })

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="공지사항" description="사용자에게 표시할 공지사항을 작성하고 관리합니다" />

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">총 {mockNotices.length}건</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />새 공지 작성
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 공지사항 작성</DialogTitle>
              <DialogDescription>새로운 공지사항을 작성하고 게시하세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">공지 타입</label>
                  <Select value={newNotice.type} onValueChange={(v) => setNewNotice({ ...newNotice, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">일반</SelectItem>
                      <SelectItem value="urgent">긴급</SelectItem>
                      <SelectItem value="maintenance">점검</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">언어</label>
                  <Select value={newNotice.language} onValueChange={(v) => setNewNotice({ ...newNotice, language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="all">다국어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">제목</label>
                <Input placeholder="공지사항 제목을 입력하세요" value={newNotice.title} onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">내용</label>
                <Textarea placeholder="공지사항 내용을 입력하세요" value={newNotice.content} onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })} rows={5} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setNewNotice({ title: '', content: '', type: 'general', language: 'ko' })}>공지 게시</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>언어</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead>우선순위</TableHead>
              <TableHead>액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockNotices.map((notice) => {
              const badge = typeBadge(notice.type)
              return (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium">{notice.title}</TableCell>
                  <TableCell><Badge variant={badge.variant}>{badge.label}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span className="text-sm">{notice.language === 'ko' ? '한국어' : notice.language === 'en' ? 'English' : '다국어'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={notice.isActive} />
                      {notice.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{notice.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost"><ChevronUp className="h-3 w-3" /></Button>
                      <span className="text-sm">{notice.priority}</span>
                      <Button size="sm" variant="ghost"><ChevronDown className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline"><Edit className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
