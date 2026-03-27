import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  ChevronUp,
  ChevronDown,
  Globe
} from "lucide-react"

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

export function NoticeBannerManagement() {
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    type: 'general',
    language: 'ko'
  })

  const [newBanner, setNewBanner] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    position: 'main',
    startDate: '',
    endDate: ''
  })

  // TODO: remove mock data - replace with real API data
  const notices: Notice[] = [
    {
      id: "N001",
      title: "시스템 점검 안내",
      content: "2024년 6월 20일 새벽 2시부터 4시까지 시스템 점검이 있을 예정입니다.",
      type: "maintenance",
      isActive: true,
      createdAt: "2024-06-15",
      priority: 1,
      language: "ko"
    },
    {
      id: "N002",
      title: "새로운 기능 업데이트",
      content: "프로젝트 관리 기능이 개선되었습니다. 자세한 내용은 공지사항을 확인해주세요.",
      type: "general",
      isActive: true,
      createdAt: "2024-06-14",
      priority: 2,
      language: "all"
    },
    {
      id: "N003",
      title: "긴급 보안 업데이트",
      content: "보안 강화를 위한 긴급 업데이트가 진행됩니다.",
      type: "urgent",
      isActive: false,
      createdAt: "2024-06-13",
      priority: 3,
      language: "ko"
    }
  ]

  const banners: Banner[] = [
    {
      id: "B001",
      title: "여름 프로모션",
      imageUrl: "/images/summer-promo.jpg",
      linkUrl: "/promotions/summer",
      position: "main",
      isActive: true,
      priority: 1,
      startDate: "2024-06-01",
      endDate: "2024-08-31"
    },
    {
      id: "B002",
      title: "파트너 모집",
      imageUrl: "/images/partner-recruitment.jpg", 
      linkUrl: "/partners/join",
      position: "sidebar",
      isActive: true,
      priority: 2,
      startDate: "2024-06-01",
      endDate: "2024-12-31"
    }
  ]

  const getNoticeTypeBadge = (type: Notice['type']) => {
    const variants = {
      'general': 'default',
      'urgent': 'destructive',
      'maintenance': 'secondary'
    }
    const labels = {
      'general': '일반',
      'urgent': '긴급',
      'maintenance': '점검'
    }
    return { variant: variants[type] as any, label: labels[type] }
  }

  const handleCreateNotice = () => {
    console.log('Creating notice:', newNotice)
    // TODO: replace with real API call
    setNewNotice({ title: '', content: '', type: 'general', language: 'ko' })
  }

  const handleCreateBanner = () => {
    console.log('Creating banner:', newBanner)
    // TODO: replace with real API call
    setNewBanner({ title: '', imageUrl: '', linkUrl: '', position: 'main', startDate: '', endDate: '' })
  }

  const handleToggleActive = (id: string, type: 'notice' | 'banner') => {
    console.log(`Toggling ${type} ${id}`)
    // TODO: replace with real API call
  }

  const handlePriorityChange = (id: string, direction: 'up' | 'down', type: 'notice' | 'banner') => {
    console.log(`Moving ${type} ${id} ${direction}`)
    // TODO: replace with real API call
  }

  return (
    <div className="space-y-6">
      <Card data-testid="card-notice-banner-management">
        <CardHeader>
          <CardTitle>공지 & 배너 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notices" className="space-y-4">
            <TabsList>
              <TabsTrigger value="notices">공지사항</TabsTrigger>
              <TabsTrigger value="banners">배너 관리</TabsTrigger>
            </TabsList>

            <TabsContent value="notices" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">공지사항 관리</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button data-testid="button-create-notice">
                      <Plus className="h-4 w-4 mr-2" />
                      새 공지 작성
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-testid="dialog-create-notice">
                    <DialogHeader>
                      <DialogTitle>새 공지사항 작성</DialogTitle>
                      <DialogDescription>새로운 공지사항을 작성하고 게시하세요</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">공지 타입</label>
                          <Select 
                            value={newNotice.type} 
                            onValueChange={(value) => setNewNotice({...newNotice, type: value})}
                          >
                            <SelectTrigger data-testid="select-notice-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">일반</SelectItem>
                              <SelectItem value="urgent">긴급</SelectItem>
                              <SelectItem value="maintenance">점검</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">언어</label>
                          <Select 
                            value={newNotice.language} 
                            onValueChange={(value) => setNewNotice({...newNotice, language: value})}
                          >
                            <SelectTrigger data-testid="select-notice-language">
                              <SelectValue />
                            </SelectTrigger>
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
                        <Input
                          placeholder="공지사항 제목을 입력하세요"
                          value={newNotice.title}
                          onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                          data-testid="input-notice-title"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">내용</label>
                        <Textarea
                          placeholder="공지사항 내용을 입력하세요"
                          value={newNotice.content}
                          onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                          rows={5}
                          data-testid="textarea-notice-content"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleCreateNotice}
                        data-testid="button-save-notice"
                      >
                        공지 게시
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
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
                    {notices.map((notice) => {
                      const typeBadge = getNoticeTypeBadge(notice.type)
                      return (
                        <TableRow key={notice.id} data-testid={`row-notice-${notice.id}`}>
                          <TableCell className="font-medium">{notice.title}</TableCell>
                          <TableCell>
                            <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Globe className="h-3 w-3" />
                              {notice.language === 'ko' ? '한국어' : 
                               notice.language === 'en' ? 'English' : '다국어'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={notice.isActive}
                                onCheckedChange={() => handleToggleActive(notice.id, 'notice')}
                                data-testid={`switch-notice-${notice.id}`}
                              />
                              {notice.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </div>
                          </TableCell>
                          <TableCell>{notice.createdAt}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handlePriorityChange(notice.id, 'up', 'notice')}
                                data-testid={`button-notice-priority-up-${notice.id}`}
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <span className="text-sm">{notice.priority}</span>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handlePriorityChange(notice.id, 'down', 'notice')}
                                data-testid={`button-notice-priority-down-${notice.id}`}
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                data-testid={`button-edit-notice-${notice.id}`}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                data-testid={`button-delete-notice-${notice.id}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="banners" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">배너 관리</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button data-testid="button-create-banner">
                      <Plus className="h-4 w-4 mr-2" />
                      새 배너 등록
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-testid="dialog-create-banner">
                    <DialogHeader>
                      <DialogTitle>새 배너 등록</DialogTitle>
                      <DialogDescription>새로운 배너를 등록하고 게시하세요</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">배너 제목</label>
                          <Input
                            placeholder="배너 제목을 입력하세요"
                            value={newBanner.title}
                            onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                            data-testid="input-banner-title"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">게시 위치</label>
                          <Select 
                            value={newBanner.position} 
                            onValueChange={(value) => setNewBanner({...newBanner, position: value})}
                          >
                            <SelectTrigger data-testid="select-banner-position">
                              <SelectValue />
                            </SelectTrigger>
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
                        <Input
                          placeholder="배너 이미지 URL을 입력하세요"
                          value={newBanner.imageUrl}
                          onChange={(e) => setNewBanner({...newBanner, imageUrl: e.target.value})}
                          data-testid="input-banner-image"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">링크 URL</label>
                        <Input
                          placeholder="클릭 시 이동할 URL을 입력하세요"
                          value={newBanner.linkUrl}
                          onChange={(e) => setNewBanner({...newBanner, linkUrl: e.target.value})}
                          data-testid="input-banner-link"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">시작일</label>
                          <Input
                            type="date"
                            value={newBanner.startDate}
                            onChange={(e) => setNewBanner({...newBanner, startDate: e.target.value})}
                            data-testid="input-banner-start-date"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">종료일</label>
                          <Input
                            type="date"
                            value={newBanner.endDate}
                            onChange={(e) => setNewBanner({...newBanner, endDate: e.target.value})}
                            data-testid="input-banner-end-date"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleCreateBanner}
                        data-testid="button-save-banner"
                      >
                        배너 등록
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
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
                    {banners.map((banner) => (
                      <TableRow key={banner.id} data-testid={`row-banner-${banner.id}`}>
                        <TableCell className="font-medium">{banner.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{banner.position}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={banner.isActive}
                              onCheckedChange={() => handleToggleActive(banner.id, 'banner')}
                              data-testid={`switch-banner-${banner.id}`}
                            />
                            {banner.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {banner.startDate} ~ {banner.endDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handlePriorityChange(banner.id, 'up', 'banner')}
                              data-testid={`button-banner-priority-up-${banner.id}`}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <span className="text-sm">{banner.priority}</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handlePriorityChange(banner.id, 'down', 'banner')}
                              data-testid={`button-banner-priority-down-${banner.id}`}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              data-testid={`button-edit-banner-${banner.id}`}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              data-testid={`button-delete-banner-${banner.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
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