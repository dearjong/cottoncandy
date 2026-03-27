/**
 * cottoncandy_admin 원본 그대로 - admin_v2 전용 레이아웃
 */
import React, { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children?: ReactNode;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onSwitchToUser: () => void;
}

const AdminLayout = ({ children, activeTab, onTabChange, onSwitchToUser }: AdminLayoutProps) => {
  return (
    <div className="admin-v2-root flex h-screen w-full bg-[#F1F5F9] font-sans text-slate-700 selection:bg-[#2b4ea7]/20 selection:text-[#2b4ea7]">
      <AdminSidebar activeTab={activeTab} onTabChange={onTabChange} />

      <main className="ml-64 flex-1 h-screen w-0 min-w-0 flex flex-col overflow-hidden">
        <header className="shrink-0 w-full">
          <AdminHeader activeTab={activeTab} onSwitchToUser={onSwitchToUser} />
        </header>
        <div className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-auto flex flex-col gap-4 p-6 bg-[#F1F5F9]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
