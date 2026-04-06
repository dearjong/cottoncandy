import { useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react"

interface Banner {
  id: string
  title: string
  imageUrl: string
  linkUrl: string
  position: 'main' | 'sidebar' | 'footer'
  isActive: boolean
  priority: number
  startDate: string
  endDate: string
}

const mockBanners: Banner[] = [
  { id: "B001", title: "여름 프로모션", imageUrl: "/images/summer-promo.jpg", linkUrl: "/promotions/summer", position: "main", isActive: true, priority: 1, startDate: "2024-06-01", endDate: "2024-08-31" },
  { id: "B002", title: "파트너 모집", imageUrl: "/images/partner-recruitment.jpg", linkUrl: "/partners/join", position: "sidebar", isActive: true, priority: 2, startDate: "2024-06-01", endDate: "2024-12-31" },
]

const positionLabel = (p: Banner['position']) => ({ main: '메인', sidebar: '사이드바', footer: '푸터' }[p])

export default function CsBannersPage() {
  const [newBanner, setNewBanner] = useState({ title: '', imageUrl: '', linkUrl: '', position: 'main', startDate: '', endDate: '' })

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="배너 관리" description="플랫폼에 노출할 배너를 등록하고 관리합니다" />

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">총 {mockBanners.length}건</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />새 배너 등록
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 배너 등록</DialogTitle>
              <DialogDescription>새로운 배너를 등록하고 게시하세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">배너 제목</label>
                  <Input placeholder="배너 제목" value={newBanner.title} onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">게시 위치</label>
                  <Select value={newBanner.position} onValueChange={(v) => setNewBanner({ ...newBanner, position: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">메인 페이지</SelectItem>
                      <SelectItem value="sidebar">사이드바</SelectItem>
                      <SelectItem value="footer">푸터</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">이미지 URL</label>
                <Input placeholder="배너 이미지 URL" value={newBanner.imageUrl} onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">링크 URL</label>
                <Input placeholder="클릭 시 이동할 URL" value={newBanner.linkUrl} onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">시작일</label>
                  <Input type="date" value={newBanner.startDate} onChange={(e) => setNewBanner({ ...newBanner, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">종료일</label>
                  <Input type="date" value={newBanner.endDate} onChange={(e) => setNewBanner({ ...newBanner, endDate: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setNewBanner({ title: '', imageUrl: '', linkUrl: '', position: 'main', startDate: '', endDate: '' })}>배너 등록</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>위치</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>기간</TableHead>
              <TableHead>우선순위</TableHead>
              <TableHead>액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBanners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell className="font-medium">{banner.title}</TableCell>
                <TableCell><Badge variant="outline">{positionLabel(banner.position)}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={banner.isActive} />
                    {banner.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{banner.startDate} ~ {banner.endDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost"><ChevronUp className="h-3 w-3" /></Button>
                    <span className="text-sm">{banner.priority}</span>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
