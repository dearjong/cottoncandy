import { useMemo, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, BarChart3, RotateCcw } from "lucide-react"
import { MOCK_ADMIN_PROJECTS_V1 } from "@/data/mockData"
import { MainStatusLabels, MainStatusColors, MainStatus } from "@/types/project-status"

type ViewMode = "project" | "projectType" | "company"

const COMPLETED = ["COMPLETE", "ADMIN_CHECKING", "ADMIN_CONFIRMED", "CANCELLED", "STOPPED"]

const TYPE_LABEL: Record<string, string> = { "공고": "공고", "1:1": "1:1", "컨설팅": "컨설팅" }

export default function AdminParticipationPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("project")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("ALL")
  const [filterStatus, setFilterStatus] = useState("ALL")

  const records = useMemo(() =>
    MOCK_ADMIN_PROJECTS_V1.map((p) => ({
      id: p.id,
      title: p.title,
      client: p.client,
      partner: p.partner,
      type: p.type,
      status: p.status,
      createdAt: p.createdAt ?? "",
    })),
    []
  )

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchSearch = !searchTerm ||
        r.title.includes(searchTerm) ||
        r.client.includes(searchTerm) ||
        r.partner.includes(searchTerm) ||
        r.id.includes(searchTerm)
      const matchType = filterType === "ALL" || r.type === filterType
      const matchStatus =
        filterStatus === "ALL" ||
        (filterStatus === "ongoing" && !COMPLETED.includes(r.status)) ||
        (filterStatus === "completed" && COMPLETED.includes(r.status))
      return matchSearch && matchType && matchStatus
    })
  }, [records, searchTerm, filterType, filterStatus])

  const totalCount = filtered.length
  const ongoingCount = filtered.filter((r) => !COMPLETED.includes(r.status)).length
  const completedCount = filtered.filter((r) => COMPLETED.includes(r.status)).length

  const byType = useMemo(() => {
    const map: Record<string, typeof filtered> = {}
    filtered.forEach((r) => {
      if (!map[r.type]) map[r.type] = []
      map[r.type].push(r)
    })
    return map
  }, [filtered])

  const byCompany = useMemo(() => {
    const map: Record<string, typeof filtered> = {}
    filtered.forEach((r) => {
      if (!map[r.client]) map[r.client] = []
      map[r.client].push(r)
    })
    return map
  }, [filtered])

  const statusLabel = (status: string) =>
    MainStatusLabels[status as MainStatus] ?? status

  const statusColor = (status: string) =>
    MainStatusColors[status as MainStatus] ?? "bg-gray-100 text-gray-700"

  const reset = () => { setSearchTerm(""); setFilterType("ALL"); setFilterStatus("ALL") }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <PageHeader
          title={<span className="flex items-center gap-2"><BarChart3 className="h-6 w-6" />전체 참여현황</span>}
          description="프로젝트별 의뢰사-수행사 참여 현황을 한눈에 확인합니다."
        />

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="px-5 py-4">
              <div className="flex items-center gap-4">
                <p className="text-xs font-medium text-muted-foreground w-16 shrink-0">총 참여</p>
                <div className="w-px h-10 bg-border shrink-0" />
                <div className="text-center">
                  <div className="text-lg font-medium">{totalCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">건</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="px-5 py-4">
              <div className="flex items-center gap-4">
                <p className="text-xs font-medium text-muted-foreground w-16 shrink-0">진행중</p>
                <div className="w-px h-10 bg-border shrink-0" />
                <div className="text-center">
                  <div className="text-lg font-medium text-blue-600">{ongoingCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">건</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="px-5 py-4">
              <div className="flex items-center gap-4">
                <p className="text-xs font-medium text-muted-foreground w-16 shrink-0">완료</p>
                <div className="w-px h-10 bg-border shrink-0" />
                <div className="text-center">
                  <div className="text-lg font-medium text-green-600">{completedCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">건</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 탭 */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="grid w-full max-w-[420px] grid-cols-3">
            <TabsTrigger value="project">프로젝트별</TabsTrigger>
            <TabsTrigger value="projectType">프로젝트 유형별</TabsTrigger>
            <TabsTrigger value="company">기업별</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 검색 / 필터 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="프로젝트명, 의뢰사, 수행사 검색"
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체 유형</SelectItem>
                <SelectItem value="공고">공고</SelectItem>
                <SelectItem value="1:1">1:1</SelectItem>
                <SelectItem value="컨설팅">컨설팅</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체 상태</SelectItem>
                <SelectItem value="ongoing">진행중</SelectItem>
                <SelectItem value="completed">완료/중단</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={reset} className="flex items-center gap-1">
              <RotateCcw className="h-3.5 w-3.5" />초기화
            </Button>
            <span className="text-sm text-muted-foreground ml-auto">{filtered.length}건</span>
          </div>
        </div>

        {/* 프로젝트별 뷰 */}
        {viewMode === "project" && (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">프로젝트ID</TableHead>
                  <TableHead>프로젝트명</TableHead>
                  <TableHead>의뢰사</TableHead>
                  <TableHead>수행사</TableHead>
                  <TableHead className="w-20">유형</TableHead>
                  <TableHead className="w-28">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-xs text-muted-foreground font-mono">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell>{r.client}</TableCell>
                    <TableCell>{r.partner}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{TYPE_LABEL[r.type] ?? r.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(r.status)}`}>
                        {statusLabel(r.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* 프로젝트 유형별 뷰 */}
        {viewMode === "projectType" && (
          <div className="space-y-4">
            {Object.entries(byType).map(([type, rows]) => (
              <Card key={type}>
                <div className="px-4 py-3 border-b flex items-center gap-2">
                  <Badge variant="outline">{TYPE_LABEL[type] ?? type}</Badge>
                  <span className="text-sm text-muted-foreground">{rows.length}건</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>프로젝트명</TableHead>
                      <TableHead>의뢰사</TableHead>
                      <TableHead>수행사</TableHead>
                      <TableHead className="w-28">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.title}</TableCell>
                        <TableCell>{r.client}</TableCell>
                        <TableCell>{r.partner}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(r.status)}`}>
                            {statusLabel(r.status)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ))}
          </div>
        )}

        {/* 기업별 뷰 */}
        {viewMode === "company" && (
          <div className="space-y-4">
            {Object.entries(byCompany).map(([company, rows]) => (
              <Card key={company}>
                <div className="px-4 py-3 border-b flex items-center gap-2">
                  <span className="font-medium text-sm">{company}</span>
                  <span className="text-sm text-muted-foreground">({rows.length}건 의뢰)</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>프로젝트명</TableHead>
                      <TableHead>수행사</TableHead>
                      <TableHead className="w-20">유형</TableHead>
                      <TableHead className="w-28">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.title}</TableCell>
                        <TableCell>{r.partner}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{TYPE_LABEL[r.type] ?? r.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(r.status)}`}>
                            {statusLabel(r.status)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
