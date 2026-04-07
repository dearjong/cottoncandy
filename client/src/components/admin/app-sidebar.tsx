import { useEffect, useMemo, useState } from "react"
import {
  BarChart3,
  Calendar,
  FileText,
  Users,
  MessageSquare,
  Settings,
  TrendingUp,
  Megaphone,
  Briefcase,
  CreditCard,
  Star,
  Home,
  Folder,
  HandHeart,
  MessageCircle,
  ClipboardCheck,
  XCircle,
  Building2,
  Flag,
  Activity,
  GitBranch,
  ChevronDown,
  ChevronRight,
  Bell,
  ShieldCheck,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "wouter"

// admin 폴더 전용 메뉴 (admin_v2와 분리)
const mainParentItem = { title: "메인", url: "/admin", icon: Home }
const mainMenuItems = [
  { title: "대시보드", url: "/admin/dashboard", icon: Home },
  { title: "관리자 캘린더", url: "/admin/calendar", icon: Calendar },
  { title: "진행 현황", url: "/admin/progress", icon: GitBranch },
]

const projectParentItem = {
  title: "전체 프로젝트",
  url: "/admin/projects",
  icon: Folder,
}

const projectCoreItems = [
  { title: "공고 프로젝트", url: "/admin/bidding", icon: Briefcase },
  { title: "1:1 프로젝트", url: "/admin/one-on-one", icon: HandHeart },
]
const projectFilterItems = [
  { title: "승인 대기", url: "/admin/pending-approval", icon: ClipboardCheck },
  { title: "중단/취소 요청", url: "/admin/stop-cancel", icon: XCircle },
  { title: "참여현황", url: "/admin/participation", icon: BarChart3 },
]
const projectSubMenuItems = [...projectCoreItems, ...projectFilterItems]

const contractsParentItem = { title: "계약 & 정산", url: "/admin/contracts", icon: CreditCard }
const reviewsParentItem = { title: "리뷰 관리", url: "/admin/reviews", icon: Star }

const consultingParentItem = { title: "컨설팅 관리", url: "/admin/consulting", icon: MessageCircle }
const consultingSubMenuItems = [
  { title: "컨설팅 문의", url: "/admin/consulting", icon: MessageCircle },
  { title: "컨설턴트 관리", url: "/admin/consultants", icon: Users },
  { title: "관련 프로젝트", url: "/admin/consulting/related-projects", icon: Briefcase },
]

const memberParentItem = { title: "회원/기업", url: "/admin/members", icon: Users }
const memberMenuItems = [
  { title: "회원 관리", url: "/admin/members", icon: Users },
  { title: "기업 관리", url: "/admin/companies", icon: Building2 },
  { title: "기업 인증 관리", url: "/admin/company-verification", icon: Building2 },
  { title: "회사소개서&포트폴리오", url: "/admin/company-portfolios", icon: FileText },
  { title: "등급 정책 관리", url: "/admin/system/grades", icon: Star },
]

// 운영/CS/알림 설정 메뉴
const operationsParentItem = { title: "운영 센터", url: "/admin/cs/inquiry", icon: Settings }
const operationsMenuItems = [
  { title: "1:1 문의", url: "/admin/cs/inquiry", icon: MessageSquare },
  { title: "신고 관리", url: "/admin/reports-management", icon: Flag },
  { title: "알림 발송", url: "/admin/cs/notifications", icon: Bell },
  { title: "AI 채팅", url: "/admin/cs/ai-chat", icon: MessageCircle },
  { title: "공지사항", url: "/admin/cs/notices", icon: Megaphone },
  { title: "배너 관리", url: "/admin/cs/banners", icon: Megaphone },
  { title: "알림 설정", url: "/admin/system/notifications", icon: Bell },
]

const statsParentItem = { title: "통계/리포트", url: "/admin/reports", icon: TrendingUp }

// 시스템(설정) 메뉴
const systemSettingsParentItem = { title: "시스템 설정", url: "/admin/settings", icon: Settings }
const systemSettingsMenuItems = [
  { title: "관리자 계정", url: "/admin/settings", icon: Users },
  { title: "플랫폼 설정", url: "/admin/settings/platform", icon: Settings },
  { title: "사용자 로그", url: "/admin/settings/logs", icon: FileText },
]

// 보안/감사 메뉴
const securityAuditParentItem = { title: "보안/감사", url: "/admin/security/messages", icon: ShieldCheck }
const securityAuditMenuItems = [
  { title: "보안자료", url: "/admin/security/messages", icon: ShieldCheck },
]

/** 사이드바 하위 메뉴 라벨 앞 트리 접두(└) — 일반 굵기 */
function SubNavLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex min-w-0 items-center gap-1">
      <span className="shrink-0 text-sidebar-foreground/65" aria-hidden>
        └
      </span>
      <span className="truncate font-normal text-sidebar-foreground/70">{children}</span>
    </span>
  )
}

/** 자주 사용하는 필터 메뉴 라벨 — 볼드로 강조 */
function SubNavLabelSub({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex min-w-0 items-center gap-1">
      <span className="shrink-0 text-sidebar-foreground/65" aria-hidden>
        └
      </span>
      <span className="truncate font-semibold">{children}</span>
    </span>
  )
}

export function AppSidebar() {
  const [location] = useLocation()
  const isProjectSectionActive = useMemo(
    () =>
      location.startsWith("/admin/projects") ||
      projectSubMenuItems.some((item) => location === item.url),
    [location]
  )
  const isConsultingSectionActive = useMemo(
    () =>
      consultingSubMenuItems.some((item) => location === item.url) ||
      location.startsWith("/admin/consulting/"),
    [location]
  )
  const [projectsOpen, setProjectsOpen] = useState<boolean>(true)
  const [consultingOpen, setConsultingOpen] = useState<boolean>(false)
  const isMainSectionActive = useMemo(
    () => mainMenuItems.some((item) => location === item.url),
    [location]
  )
  const isMemberSectionActive = useMemo(
    () => memberMenuItems.some((item) => location === item.url),
    [location]
  )
  const isOperationsSectionActive = useMemo(
    () => operationsMenuItems.some((item) => location === item.url),
    [location]
  )
  const isContractsActive = useMemo(() => location === contractsParentItem.url, [location])
  const isReviewsActive = useMemo(() => location === reviewsParentItem.url, [location])
  const isStatsSectionActive = useMemo(() => location === statsParentItem.url, [location])
  const isSystemSectionActive = useMemo(
    () => systemSettingsMenuItems.some((item) => location === item.url),
    [location]
  )
  const isSecuritySectionActive = useMemo(
    () => securityAuditMenuItems.some((item) => location === item.url),
    [location]
  )
  const [memberOpen, setMemberOpen] = useState<boolean>(true)
  // 하위가 있는 그룹은 기본 접힘 가능. 부모 라벨 클릭 시 펼침 + 하위 화면 진입 시 일부 자동 펼침.
  const [operationsOpen, setOperationsOpen] = useState<boolean>(false)
  const [systemOpen, setSystemOpen] = useState<boolean>(false)
  const [securityOpen, setSecurityOpen] = useState<boolean>(false)

  // 하위 페이지로 이동했을 때는 자동으로 펼침 유지
  useEffect(() => {
    if (isProjectSectionActive) setProjectsOpen(true)
  }, [isProjectSectionActive])
  useEffect(() => {
    if (isConsultingSectionActive) setConsultingOpen(true)
  }, [isConsultingSectionActive])
  useEffect(() => {
    if (isMemberSectionActive) setMemberOpen(true)
  }, [isMemberSectionActive])
  useEffect(() => {
    if (isSystemSectionActive) setSystemOpen(true)
  }, [isSystemSectionActive])

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4 pb-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          <BarChart3 className="h-6 w-6 text-sidebar-primary" />
          <span className="font-semibold text-sidebar-foreground">Cotton Candy Admin</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="gap-0 pt-4">
        {/* 메인 */}
        <SidebarGroup className="p-2">
          <SidebarGroupContent className="gap-0">
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isMainSectionActive}
                  data-testid={`nav-${mainParentItem.title}`}
                >
                  <Link href={mainParentItem.url}>
                    <mainParentItem.icon />
                    <span>{mainParentItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 전체 프로젝트 */}
        <SidebarGroup className="py-0 px-2">
          <SidebarGroupContent className="gap-0">
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isProjectSectionActive}
                  data-testid={`nav-${projectParentItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Link href={projectParentItem.url} onClick={() => setProjectsOpen(true)}>
                    <projectParentItem.icon />
                    <span>{projectParentItem.title}</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setProjectsOpen((prev) => !prev)
                  }}
                  aria-label={projectsOpen ? "프로젝트 메뉴 접기" : "프로젝트 메뉴 펼치기"}
                  title={projectsOpen ? "접기" : "펼치기"}
                >
                  {projectsOpen ? <ChevronDown /> : <ChevronRight />}
                </SidebarMenuAction>
                {projectsOpen && (
                  <SidebarMenuSub>
                    {projectCoreItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location === item.url}
                          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Link href={item.url}>
                            <SubNavLabel>{item.title}</SubNavLabel>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    <SidebarMenuSubItem>
                      <div className="mx-2 my-1 border-t border-sidebar-border" />
                    </SidebarMenuSubItem>
                    {projectFilterItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location === item.url}
                          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Link href={item.url}>
                            <SubNavLabelSub>{item.title}</SubNavLabelSub>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 계약 & 정산 */}
        <SidebarGroup className="py-0 px-2">
          <SidebarGroupContent className="gap-0">
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isContractsActive}
                  data-testid="nav-계약-정산"
                >
                  <Link href={contractsParentItem.url}>
                    <contractsParentItem.icon />
                    <span>{contractsParentItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 리뷰 관리 */}
        <SidebarGroup className="py-0 px-2">
          <SidebarGroupContent className="gap-0">
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isReviewsActive}
                  data-testid="nav-리뷰-관리"
                >
                  <Link href={reviewsParentItem.url}>
                    <reviewsParentItem.icon />
                    <span>{reviewsParentItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 컨설팅 관리 */}
        <SidebarGroup className="py-0 px-2">
          <SidebarGroupContent className="gap-0">
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isConsultingSectionActive}
                  data-testid={`nav-${consultingParentItem.title}`}
                >
                  <Link href={consultingParentItem.url} onClick={() => setConsultingOpen(true)}>
                    <consultingParentItem.icon />
                    <span>{consultingParentItem.title}</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setConsultingOpen((prev) => !prev)
                  }}
                  aria-label={consultingOpen ? "컨설팅 관리 메뉴 접기" : "컨설팅 관리 메뉴 펼치기"}
                  title={consultingOpen ? "접기" : "펼치기"}
                >
                  {consultingOpen ? <ChevronDown /> : <ChevronRight />}
                </SidebarMenuAction>
                {consultingOpen && (
                  <SidebarMenuSub>
                    {consultingSubMenuItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location === item.url}
                          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Link href={item.url}>
                            <SubNavLabel>{item.title}</SubNavLabel>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 회원 / 기업 */}
        <SidebarGroup className="py-0 px-2">
          <SidebarGroupContent className="gap-0">
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isMemberSectionActive}
                  data-testid={`nav-${memberParentItem.title}`}
                >
                  <Link href={memberParentItem.url} onClick={() => setMemberOpen(true)}>
                    <memberParentItem.icon />
                    <span>{memberParentItem.title}</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setMemberOpen((prev) => !prev)
                  }}
                  aria-label={memberOpen ? "회원/기업 메뉴 접기" : "회원/기업 메뉴 펼치기"}
                  title={memberOpen ? "접기" : "펼치기"}
                >
                  {memberOpen ? <ChevronDown /> : <ChevronRight />}
                </SidebarMenuAction>
                {memberOpen && (
                  <SidebarMenuSub>
                    {memberMenuItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location === item.url}
                          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Link href={item.url}>
                            <SubNavLabel>{item.title}</SubNavLabel>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 운영 센터 */}
        <SidebarGroup className="py-0 px-2">
          <SidebarGroupContent className="gap-0">
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isOperationsSectionActive}
                  data-testid={`nav-${operationsParentItem.title}`}
                >
                  <Link href={operationsParentItem.url} onClick={() => setOperationsOpen(true)}>
                    <operationsParentItem.icon />
                    <span>{operationsParentItem.title}</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOperationsOpen((prev) => !prev)
                  }}
                  aria-label={operationsOpen ? "운영 센터 메뉴 접기" : "운영 센터 메뉴 펼치기"}
                  title={operationsOpen ? "접기" : "펼치기"}
                >
                  {operationsOpen ? <ChevronDown /> : <ChevronRight />}
                </SidebarMenuAction>
                {operationsOpen && (
                  <SidebarMenuSub>
                    {operationsMenuItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location === item.url}
                          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Link href={item.url}>
                            <SubNavLabel>{item.title}</SubNavLabel>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 통계/리포트 */}
        <SidebarGroup className="py-0 px-2">
          <SidebarGroupContent className="gap-0">
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isStatsSectionActive}
                  data-testid={`nav-${statsParentItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Link href={statsParentItem.url}>
                    <statsParentItem.icon />
                    <span>{statsParentItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 시스템(설정) */}
        <SidebarGroup className="py-0 px-2">
          <SidebarGroupContent className="gap-0">
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isSystemSectionActive}
                  data-testid={`nav-${systemSettingsParentItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Link href={systemSettingsParentItem.url} onClick={() => setSystemOpen(true)}>
                    <systemSettingsParentItem.icon />
                    <span>{systemSettingsParentItem.title}</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSystemOpen((prev) => !prev)
                  }}
                  aria-label={systemOpen ? "시스템 설정 메뉴 접기" : "시스템 설정 메뉴 펼치기"}
                  title={systemOpen ? "접기" : "펼치기"}
                >
                  {systemOpen ? <ChevronDown /> : <ChevronRight />}
                </SidebarMenuAction>
                {systemOpen && (
                  <SidebarMenuSub>
                    {systemSettingsMenuItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location === item.url}
                          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Link href={item.url}>
                            <SubNavLabel>{item.title}</SubNavLabel>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 보안/감사 */}
        <SidebarGroup className="py-0 px-2">
          <SidebarGroupContent className="gap-0">
            <SidebarMenu className="gap-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isSecuritySectionActive}
                  data-testid={`nav-${securityAuditParentItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Link href={securityAuditParentItem.url} onClick={() => setSecurityOpen(true)}>
                    <securityAuditParentItem.icon />
                    <span>{securityAuditParentItem.title}</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSecurityOpen((prev) => !prev)
                  }}
                  aria-label={securityOpen ? "보안/감사 메뉴 접기" : "보안/감사 메뉴 펼치기"}
                  title={securityOpen ? "접기" : "펼치기"}
                >
                  {securityOpen ? <ChevronDown /> : <ChevronRight />}
                </SidebarMenuAction>
                {securityOpen && (
                  <SidebarMenuSub>
                    {securityAuditMenuItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location === item.url}
                          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Link href={item.url}>
                            <SubNavLabel>{item.title}</SubNavLabel>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}