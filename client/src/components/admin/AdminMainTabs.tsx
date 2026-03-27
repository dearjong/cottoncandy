"use client"

import { ReactNode, useMemo } from "react"
import { useLocation } from "wouter"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type MainTabKey = "dashboard" | "calendar" | "progress"

function getMainTabFromLocation(location: string): MainTabKey {
  if (location.startsWith("/admin/calendar")) return "calendar"
  if (location.startsWith("/admin/progress")) return "progress"
  return "dashboard"
}

function getRouteFromTab(tab: MainTabKey): string {
  if (tab === "calendar") return "/admin/calendar"
  if (tab === "progress") return "/admin/progress"
  return "/admin"
}

function getTitle(tab: MainTabKey) {
  if (tab === "calendar") return "관리자 캘린더"
  if (tab === "progress") return "진행 현황"
  return "대시보드"
}

function getDescription(tab: MainTabKey) {
  if (tab === "calendar") return "날짜별 업무 활동 현황을 확인하고 관리하세요"
  if (tab === "progress") return "프로젝트 단계별 진행 상황을 한눈에 확인하세요"
  return "프로젝트 관리 플랫폼의 전체 현황을 확인하세요"
}

export function AdminMainTabs({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation()
  const activeTab = useMemo(() => getMainTabFromLocation(location), [location])

  const title = getTitle(activeTab)
  const description = getDescription(activeTab)

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setLocation(getRouteFromTab(v as MainTabKey))}
      >
        <TabsList className="grid w-full grid-cols-3 h-10">
          <TabsTrigger value="dashboard">대시보드</TabsTrigger>
          <TabsTrigger value="calendar">캘린더</TabsTrigger>
          <TabsTrigger value="progress">진행 현황</TabsTrigger>
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}

