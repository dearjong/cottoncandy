import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Search, Eye, Check, X, Filter } from "lucide-react"

interface Project {
  id: string
  title: string
  client: string
  type: '공고' | '1:1' | '컨설팅'
  status: '등록' | '임시저장' | '승인대기' | '승인' | '반려' | '진행중' | '완료'
  budget: string
  createdAt: string
  description: string
}

export function ProjectManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // TODO: remove mock data - replace with real API data
  const projects: Project[] = [
    {
      id: "PRJ-001",
      title: "브랜드 홍보 영상 제작",
      client: "(주)테크스타트업",
      type: "공고",
      status: "승인대기",
      budget: "500만원",
      createdAt: "2024-06-15",
      description: "신제품 런칭을 위한 브랜드 홍보 영상 제작 프로젝트입니다."
    },
    {
      id: "PRJ-002", 
      title: "기업 IR 영상 제작",
      client: "스마트솔루션(주)",
      type: "1:1",
      status: "진행중",
      budget: "800만원",
      createdAt: "2024-06-14",
      description: "투자 유치를 위한 IR 프레젠테이션 영상 제작"
    },
    {
      id: "PRJ-003",
      title: "마케팅 전략 컨설팅",
      client: "로컬푸드(주)",
      type: "컨설팅",
      status: "승인대기",
      budget: "300만원",
      createdAt: "2024-06-13",
      description: "온라인 마케팅 전략 수립 및 실행 계획 컨설팅"
    },
    {
      id: "PRJ-004",
      title: "제품 소개 영상",
      client: "이노베이션랩",
      type: "공고",
      status: "반려",
      budget: "400만원",
      createdAt: "2024-06-12",
      description: "AI 제품 소개를 위한 영상 콘텐츠 제작"
    },
  ]

  const getStatusBadge = (status: Project['status']) => {
    const variants = {
      '등록': 'secondary',
      '임시저장': 'outline',
      '승인대기': 'secondary',
      '승인': 'default',
      '반려': 'destructive',
      '진행중': 'default',
      '완료': 'secondary'
    }
    return variants[status] as any
  }

  const getStatusColor = (status: Project['status']) => {
    const colors = {
      '등록': 'text-blue-600',
      '임시저장': 'text-gray-500',
      '승인대기': 'text-yellow-600',
      '승인': 'text-green-600',
      '반려': 'text-red-600',
      '진행중': 'text-blue-600',
      '완료': 'text-green-600'
    }
    return colors[status]
  }

  const handleApproval = (projectId: string, action: 'approve' | 'reject') => {
    console.log(`Project ${projectId} ${action}`)
    // TODO: replace with real API call
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <Card data-testid="card-project-management">
        <CardHeader>
          <CardTitle>프로젝트 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="프로젝트명 또는 클라이언트로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-project-search"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48" data-testid="select-status-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="승인대기">승인 대기</SelectItem>
                <SelectItem value="진행중">진행 중</SelectItem>
                <SelectItem value="완료">완료</SelectItem>
                <SelectItem value="반려">반려</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>프로젝트 ID</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead>클라이언트</TableHead>
                  <TableHead>타입</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>예산</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} data-testid={`row-project-${project.id}`}>
                    <TableCell className="font-mono text-sm">{project.id}</TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadge(project.status)}
                        className={getStatusColor(project.status)}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.budget}</TableCell>
                    <TableCell>{project.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedProject(project)}
                              data-testid={`button-view-${project.id}`}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              상세
                            </Button>
                          </DialogTrigger>
                          <DialogContent data-testid={`dialog-project-details-${project.id}`}>
                            <DialogHeader>
                              <DialogTitle>{project.title}</DialogTitle>
                              <DialogDescription>프로젝트 상세 정보</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">클라이언트</label>
                                  <p className="text-sm text-muted-foreground">{project.client}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">예산</label>
                                  <p className="text-sm text-muted-foreground">{project.budget}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">설명</label>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                              </div>
                            </div>
                            {project.status === '승인대기' && (
                              <DialogFooter className="gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleApproval(project.id, 'reject')}
                                  data-testid={`button-reject-${project.id}`}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  반려
                                </Button>
                                <Button
                                  onClick={() => handleApproval(project.id, 'approve')}
                                  data-testid={`button-approve-${project.id}`}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  승인
                                </Button>
                              </DialogFooter>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {project.status === '승인대기' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleApproval(project.id, 'reject')}
                              data-testid={`button-quick-reject-${project.id}`}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleApproval(project.id, 'approve')}
                              data-testid={`button-quick-approve-${project.id}`}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}