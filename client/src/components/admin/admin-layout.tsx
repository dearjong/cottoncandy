import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/admin/theme-provider";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, UserCog, FlaskConical } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <TooltipProvider>
      <ThemeProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="admin-root flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between p-4 border-b border-sidebar-border bg-background">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="flex items-center gap-4">
                  <Link href="/admin/simulate">
                    <Button variant="outline" size="sm">
                      <FlaskConical className="h-4 w-4 mr-2" />
                      사용자 시뮬레이션
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" size="sm">
                      <Home className="h-4 w-4 mr-2" />
                      사용자 화면
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserCog className="h-4 w-4" />
                    <span>슈퍼 관리자</span>
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-auto bg-background">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  );
}
