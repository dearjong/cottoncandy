import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/app-sidebar";

// Import all pages
import Dashboard from "@/pages/dashboard";
import CalendarPage from "@/pages/calendar";
import ProjectsPage from "@/pages/projects";
import MembersPage from "@/pages/members";
import CommunicationPage from "@/pages/communication";
import ReportsPage from "@/pages/reports";
import AnnouncementsPage from "@/pages/announcements";
import AdminSettingsPage from "@/pages/admin-settings";
import PlaceholderPage from "@/pages/placeholder";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/bidding">
        {() => (
          <PlaceholderPage 
            title="공고프로젝트 관리" 
            description="비딩 현황 및 참여사 목록을 관리하세요" 
          />
        )}
      </Route>
      <Route path="/one-on-one">
        {() => (
          <PlaceholderPage 
            title="1:1 프로젝트 관리" 
            description="1:1 프로젝트 현황을 관리하세요" 
          />
        )}
      </Route>
      <Route path="/consulting">
        {() => (
          <PlaceholderPage 
            title="컨설팅 프로젝트 관리" 
            description="컨설팅 문의 및 프로젝트를 관리하세요" 
          />
        )}
      </Route>
      <Route path="/contracts">
        {() => (
          <PlaceholderPage 
            title="계약 & 정산 관리" 
            description="계약 진행 현황과 정산을 관리하세요" 
          />
        )}
      </Route>
      <Route path="/reviews">
        {() => (
          <PlaceholderPage 
            title="리뷰 관리" 
            description="고객 리뷰를 관리하고 모니터링하세요" 
          />
        )}
      </Route>
      <Route path="/members" component={MembersPage} />
      <Route path="/communication" component={CommunicationPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/announcements" component={AnnouncementsPage} />
      <Route path="/admin-settings" component={AdminSettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Custom sidebar width for admin interface
  const style = {
    "--sidebar-width": "20rem",       // 320px for better content
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b border-sidebar-border bg-background">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto bg-background">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
