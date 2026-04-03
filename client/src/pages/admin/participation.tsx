import { useMemo, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, BarChart3 } from "lucide-react"
import { Link } from "wouter"
import { MOCK_ADMIN_COMPANIES_V1, MOCK_ADMIN_PROJECTS_V1 } from "@/data/mockData"
import { MainStatusLabels } from "@/types/project-status"

const COMPLETED_STATUSES = ["COMPLETE", "ADMIN_CHECKING", "ADMIN_CONFIRMED", "CANCELLED", "STOPPED"]

type FilterType = "ALL" | "ADVERTISER" | "PRODUCTION"
type ViewMode = "company" | "project" | "projectList"
type FilterPeriod = "ALL" | "1Y" | "1M" | "CUSTOM"

export default function AdminParticipationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("ALL")
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ongoing" | "completed">("ALL")
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("ALL")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("company")
  const [openCompanyDetailId, setOpenCompanyDetailId] = useState<string | null>(null)

  const getPeriodRange = (): { from: Date | null; to: Date | null } => {
    const now = new Date()
    if (filterPeriod === "1Y") return { from: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()), to: now }
    if (filterPeriod === "1M") return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now }
    if (filterPeriod === "CUSTOM") return {
      from: customFrom ? new Date(customFrom) : null,
      to: customTo ? new Date(customTo) : null,
    }
    return { from: null, to: null }
  }

  const isInPeriod = (dateStr: string | undefined) => {
    if (filterPeriod === "ALL") return true
    if (!dateStr) return false
    const { from, to } = getPeriodRange()
    const d = new Date(dateStr)
    if (from && d < from) return false
    if (to && d > to) return false
    return true
  }

  const rows = useMemo(() => {
    return MOCK_ADMIN_COMPANIES_V1.map((company) => {
      const all = MOCK_ADMIN_PROJECTS_V1.filter(
        (p) => p.ownerCompanyId === company.id || (p.participantCompanyIds ?? []).includes(company.id)
      )
      const ongoing = all.filter((p) => !COMPLETED_STATUSES.includes(p.status))
      const completed = all.filter((p) => COMPLETED_STATUSES.includes(p.status))
      const asOwner = all.filter((p) => p.ownerCompanyId === company.id).length
      const asPartner = all.filter((p) => (p.participantCompanyIds ?? []).includes(company.id)).length

      const biddingCount = all.filter(
        (p) => p.type === "공고" || (p.type === "컨설팅" && p.consultingOutcomeKind === "MATCHING_PUBLIC")
      ).length
      const oneToOneCount = all.filter(
        (p) => p.type === "1:1" || (p.type === "컨설팅" && p.consultingOutcomeKind === "MATCHING_1TO1")
      ).length

      const lastProject = all
        .filter((p) => p.createdAt)
        .sort((a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime())[0]

      const lastOngoingStatus = ongoing.length > 0
        ? (MainStatusLabels[ongoing[0].status as keyof typeof MainStatusLabels] ?? ongoing[0].status)
        : null

      return {
        company,
        totalCount: all.length,
        ongoingCount: ongoing.length,
        completedCount: completed.length,
        asOwnerCount: asOwner,
        asPartnerCount: asPartner,
        biddingCount,
        oneToOneCount,
        lastActivity: lastProject?.createdAt ?? "-",
        lastOngoingStatus,
        ongoing,
        completed,
      }
    })
  }, [])

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchSearch =
        !searchTerm ||
        row.company.companyName.includes(searchTerm) ||
        (row.company.businessNumber ?? "").includes(searchTerm) ||
        (row.company.representativeName ?? "").includes(searchTerm)

      const matchType =
        filterType === "ALL" ||
        (filterType === "ADVERTISER" && row.asOwnerCount > 0) ||
        (filterType === "PRODUCTION" && row.asPartnerCount > 0)

      const matchStatus =
        filterStatus === "ALL" ||
        (filterStatus === "ongoing" && row.ongoingCount > 0) ||
        (filterStatus === "completed" && row.completedCount > 0)

      const allProjects = MOCK_ADMIN_PROJECTS_V1.filter(
        (p) => p.ownerCompanyId === row.company.id || (p.participantCompanyIds ?? []).includes(row.company.id)
      )
      const matchPeriod =
        filterPeriod === "ALL" || allProjects.some((p) => isInPeriod(p.createdAt))

      return matchSearch && matchType && matchStatus && matchPeriod
    })
  }, [rows, searchTerm, filterType, filterStatus, filterPeriod, customFrom, customTo])

  const totalOngoing = rows.reduce((s, r) => s + r.ongoingCount, 0)
  const totalCompleted = rows.reduce((s, r) => s + r.completedCount, 0)
  const totalAll = rows.reduce((s, r) => s + r.totalCount, 0)

  const validProjects = MOCK_ADMIN_PROJECTS_V1.filter((p) =>
    !(p.type === "컨설팅" &&
      p.consultingOutcomeKind !== "MATCHING_PUBLIC" &&
      p.consultingOutcomeKind !== "MATCHING_1TO1")
  )
  const totalRequest = validProjects.length
  const totalParticipation = rows.reduce((s, r) => s + r.asPartnerCount, 0)
  const totalBidding = validProjects.filter(
    (p) => p.type === "공고" || (p.type === "컨설팅" && p.consultingOutcomeKind === "MATCHING_PUBLIC")
  ).length
  const total1to1 = validProjects.filter(
    (p) => p.type === "1:1" || (p.type === "컨설팅" && p.consultingOutcomeKind === "MATCHING_1TO1")
  ).length
  const projectRows = useMemo(() => {
    return MOCK_ADMIN_PROJECTS_V1.filter((project) => {
      if (project.type === "컨설팅" &&
        project.consultingOutcomeKind !== "MATCHING_PUBLIC" &&
        project.consultingOutcomeKind !== "MATCHING_1TO1") return false

      const relatedCompany = rows.find((row) => row.company.id === project.ownerCompanyId)?.company
      const matchSearch =
        !searchTerm ||
        project.title.includes(searchTerm) ||
        project.id.includes(searchTerm) ||
        (project.client ?? "").includes(searchTerm) ||
        (project.partner ?? "").includes(searchTerm) ||
        (relatedCompany?.companyName ?? "").includes(searchTerm)

      const isCompleted = COMPLETED_STATUSES.includes(project.status)
      const matchStatus =
        filterStatus === "ALL" ||
        (filterStatus === "ongoing" && !isCompleted) ||
        (filterStatus === "completed" && isCompleted)

      return matchSearch && matchStatus
    })
  }, [rows, searchTerm, filterStatus])
  const PROJECT_TYPES = ["공고", "공고 (컨설팅)", "1:1", "1:1 (컨설팅)"] as const

  const projectListRows = useMemo(() => {
    const stat: Record<string, { total: number; ongoing: number; completed: number }> = {
      "공고": { total: 0, ongoing: 0, completed: 0 },
      "공고 (컨설팅)": { total: 0, ongoing: 0, completed: 0 },
      "1:1": { total: 0, ongoing: 0, completed: 0 },
      "1:1 (컨설팅)": { total: 0, ongoing: 0, completed: 0 },
    }

    MOCK_ADMIN_PROJECTS_V1.forEach((project) => {
      let key: string
      if (project.type === "컨설팅") {
        if (project.consultingOutcomeKind === "MATCHING_PUBLIC") key = "공고 (컨설팅)"
        else if (project.consultingOutcomeKind === "MATCHING_1TO1") key = "1:1 (컨설팅)"
        else return
      } else if (project.type === "1:1") {
        key = "1:1"
      } else {
        key = "공고"
      }

      if (stat[key]) {
        stat[key].total += 1
        if (COMPLETED_STATUSES.includes(project.status)) {
          stat[key].completed += 1
        } else {
          stat[key].ongoing += 1
        }
      }
    })

    return PROJECT_TYPES
      .map((type) => ({ type, ...stat[type] }))
      .filter((item) => {
        const matchSearch = !searchTerm || item.type.includes(searchTerm)
        const matchStatus =
          filterStatus === "ALL" ||
          (filterStatus === "ongoing" && item.ongoing > 0) ||
          (filterStatus === "completed" && item.completed > 0)
        return matchSearch && matchStatus
      })
  }, [searchTerm, filterStatus])
  const selectedCompanyRow = useMemo(
    () => rows.find((row) => row.company.id === openCompanyDetailId) ?? null,
    [rows, openCompanyDetailId]
  )

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            전체 참여현황
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            기업별/프로젝트별/프로젝트 리스트별 참여 현황을 한눈에 확인합니다.
          </p>
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="grid w-full max-w-[420px] grid-cols-3">
            <TabsTrigger value="company">기업별</TabsTrigger>
            <TabsTrigger value="project">프로젝트별</TabsTrigger>
            <TabsTrigger value="projectList">프로젝트 유형별</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-6 gap-3">
          {[
            { label: "총 의뢰", value: totalRequest, textColor: "text-slate-600" },
            { label: "참여", value: totalParticipation, textColor: "text-blue-600" },
            { label: "진행", value: totalOngoing, textColor: "text-orange-600" },
            { label: "완료", value: totalCompleted, textColor: "text-green-600" },
            { label: "공고", value: totalBidding, textColor: "text-purple-600" },
            { label: "1:1", value: total1to1, textColor: "text-pink-600" },
          ].map(({ label, value, textColor }) => (
            <Card key={label}>
              <CardContent className="pt-5 pb-5 text-center">
                <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  viewMode === "company"
                    ? "기업명, 사업자번호, 대표자명 검색"
                    : viewMode === "project"
                      ? "프로젝트명, 프로젝트ID, 의뢰사/수행사 검색"
                      : "프로젝트 유형 검색"
                }
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {viewMode === "company" && (
              <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="의뢰/참여" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  <SelectItem value="ADVERTISER">의뢰</SelectItem>
                  <SelectItem value="PRODUCTION">참여</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체 상태</SelectItem>
                <SelectItem value="ongoing">진행중</SelectItem>
                <SelectItem value="completed">완료 포함</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPeriod} onValueChange={(v) => { setFilterPeriod(v as FilterPeriod); setCustomFrom(""); setCustomTo("") }}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="기간" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">총 기간</SelectItem>
                <SelectItem value="1Y">최근 1년</SelectItem>
                <SelectItem value="1M">이번 달</SelectItem>
                <SelectItem value="CUSTOM">선택 기간</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                className="w-36 h-9 text-sm"
                value={customFrom}
                disabled={filterPeriod !== "CUSTOM"}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
              <span className="text-muted-foreground text-sm">~</span>
              <Input
                type="date"
                className="w-36 h-9 text-sm"
                value={customTo}
                disabled={filterPeriod !== "CUSTOM"}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterType("ALL")
                setFilterStatus("ALL")
                setFilterPeriod("ALL")
                setCustomFrom("")
                setCustomTo("")
              }}
            >
              초기화
            </Button>
            <span className="text-sm text-muted-foreground ml-auto">
              {viewMode === "company"
                ? `${filtered.length}개 기업`
                : viewMode === "project"
                  ? `${projectRows.length}개 프로젝트`
                  : `${projectListRows.length}개 프로젝트 유형`}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          {viewMode === "company" && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[200px]">기업명</TableHead>
                  <TableHead className="w-[90px]">유형</TableHead>
                  <TableHead className="text-center w-[90px]">총 의뢰</TableHead>
                  <TableHead className="text-center w-[90px]">총 참여</TableHead>
                  <TableHead className="text-center w-[80px]">진행중</TableHead>
                  <TableHead className="text-center w-[80px]">완료</TableHead>
                  <TableHead className="text-center w-[80px]">공고</TableHead>
                  <TableHead className="text-center w-[80px]">1:1</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                      조건에 해당하는 기업이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(({ company, ongoingCount, completedCount, asOwnerCount, asPartnerCount, biddingCount, oneToOneCount }) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="font-medium text-gray-900">{company.companyName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {company.companyType ?? "기업"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-blue-700">{asOwnerCount > 0 ? asOwnerCount : "-"}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-medium text-orange-700">{asPartnerCount > 0 ? asPartnerCount : "-"}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {ongoingCount > 0 ? (
                          <span className="inline-block min-w-[28px] text-center text-sm font-semibold text-orange-600 bg-orange-50 rounded px-2 py-0.5">
                            {ongoingCount}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {completedCount > 0 ? (
                          <span className="inline-block min-w-[28px] text-center text-sm font-semibold text-green-700 bg-green-50 rounded px-2 py-0.5">
                            {completedCount}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-purple-700">{biddingCount > 0 ? biddingCount : "-"}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-pink-700">{oneToOneCount > 0 ? oneToOneCount : "-"}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
          {viewMode === "project" && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[160px]">프로젝트 ID</TableHead>
                  <TableHead>프로젝트명</TableHead>
                  <TableHead className="w-[120px]">프로젝트 유형</TableHead>
                  <TableHead className="w-[140px]">의뢰사</TableHead>
                  <TableHead className="w-[140px]">수행사</TableHead>
                  <TableHead className="w-[140px]">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      조건에 해당하는 프로젝트가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  projectRows.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.id}</TableCell>
                      <TableCell>{project.title}</TableCell>
                      <TableCell>
                        {project.type === "컨설팅" ? (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">
                              {project.consultingOutcomeKind === "MATCHING_1TO1" ? "1:1" : "공고"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">컨설팅</Badge>
                          </div>
                        ) : (
                          <Badge variant="outline">{project.type}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{project.client ?? "-"}</TableCell>
                      <TableCell>{project.partner ?? "-"}</TableCell>
                      <TableCell className="text-xs">
                        {MainStatusLabels[project.status as keyof typeof MainStatusLabels] ?? project.status}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
          {viewMode === "projectList" && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>프로젝트 유형</TableHead>
                  <TableHead className="text-center">진행중</TableHead>
                  <TableHead className="text-center">완료</TableHead>
                  <TableHead className="text-center">합계</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectListRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      조건에 해당하는 프로젝트 유형이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  projectListRows.map((row) => (
                    <TableRow key={row.type}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1.5">
                          <span>{row.type.replace(" (컨설팅)", "")}</span>
                          {row.type.includes("(컨설팅)") && (
                            <Badge variant="outline" className="text-xs">컨설팅</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-orange-700 font-semibold">{row.ongoing}</TableCell>
                      <TableCell className="text-center text-green-700 font-semibold">{row.completed}</TableCell>
                      <TableCell className="text-center font-semibold">{row.total}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <Dialog open={!!openCompanyDetailId} onOpenChange={(open) => !open && setOpenCompanyDetailId(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>기업 참여 상세</DialogTitle>
            </DialogHeader>
            {selectedCompanyRow ? (
              <div className="space-y-5">
                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="text-lg font-semibold">{selectedCompanyRow.company.companyName}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {selectedCompanyRow.company.companyType ?? "기업"} · 대표자 {selectedCompanyRow.company.representativeName ?? "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Card><CardContent className="py-4 text-center"><div className="text-xs text-muted-foreground">총 참여</div><div className="text-xl font-bold">{selectedCompanyRow.totalCount}</div></CardContent></Card>
                  <Card><CardContent className="py-4 text-center"><div className="text-xs text-muted-foreground">진행중</div><div className="text-xl font-bold text-orange-600">{selectedCompanyRow.ongoingCount}</div></CardContent></Card>
                  <Card><CardContent className="py-4 text-center"><div className="text-xs text-muted-foreground">완료</div><div className="text-xl font-bold text-green-700">{selectedCompanyRow.completedCount}</div></CardContent></Card>
                </div>
                <div>
                  <div className="mb-2 text-sm font-semibold">최근 진행중 프로젝트</div>
                  <div className="space-y-2">
                    {selectedCompanyRow.ongoing.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between rounded border px-3 py-2">
                        <div>
                          <div className="text-sm font-medium">{project.title}</div>
                          <div className="text-xs text-muted-foreground">{project.id} · {project.type}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {MainStatusLabels[project.status as keyof typeof MainStatusLabels] ?? project.status}
                        </Badge>
                      </div>
                    ))}
                    {selectedCompanyRow.ongoing.length === 0 && (
                      <div className="rounded border px-3 py-2 text-sm text-muted-foreground">진행중인 프로젝트가 없습니다.</div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link
                    href={`/admin/companies/${selectedCompanyRow.company.id}?tab=participation`}
                    className="text-sm text-pink-600 hover:underline"
                  >
                    기업 상세 페이지로 이동
                  </Link>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
