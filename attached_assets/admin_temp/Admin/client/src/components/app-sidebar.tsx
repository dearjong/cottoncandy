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
  UserCog,
  Home,
  Folder,
  HandHeart,
  MessageCircle
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "wouter"

// 메뉴 아이템 정의
const mainMenuItems = [
  {
    title: "대시보드",
    url: "/",
    icon: Home,
  },
  {
    title: "관리자 캘린더",
    url: "/calendar",
    icon: Calendar,
  },
]

const projectMenuItems = [
  {
    title: "프로젝트 관리",
    url: "/projects",
    icon: Folder,
  },
  {
    title: "공고프로젝트 관리",
    url: "/bidding",
    icon: Briefcase,
  },
  {
    title: "1:1 프로젝트 관리",
    url: "/one-on-one",
    icon: HandHeart,
  },
  {
    title: "컨설팅 프로젝트 관리",
    url: "/consulting",
    icon: MessageCircle,
  },
]

const businessMenuItems = [
  {
    title: "계약 & 정산 관리",
    url: "/contracts",
    icon: CreditCard,
  },
  {
    title: "리뷰 관리",
    url: "/reviews",
    icon: Star,
  },
  {
    title: "회원 관리",
    url: "/members",
    icon: Users,
  },
]

const systemMenuItems = [
  {
    title: "커뮤니케이션",
    url: "/communication",
    icon: MessageSquare,
  },
  {
    title: "통계/리포트",
    url: "/reports",
    icon: TrendingUp,
  },
  {
    title: "공지 & 배너 관리",
    url: "/announcements",
    icon: Megaphone,
  },
  {
    title: "관리자 설정",
    url: "/admin-settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const [location] = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-sidebar-primary" />
          <span className="font-semibold text-sidebar-foreground">관리자 대시보드</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메인</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>프로젝트</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>비즈니스</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>시스템</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserCog className="h-4 w-4" />
          <span>슈퍼 관리자</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}