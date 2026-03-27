/**
 * cottoncandy_admin 원본 그대로 - admin_v2 전용 사이드바
 */
import React from 'react';
import { LayoutDashboard, Briefcase, FileText, Settings, BarChart3, UserCog, Building2, ChevronDown, ChevronRight, Headphones } from 'lucide-react';
import { MOCK_PROJECTS } from '@/data/mockData';

interface AdminSidebarProps { activeTab: string; onTabChange: (tabId: string) => void; }

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const [projectsMenuOpen, setProjectsMenuOpen] = React.useState(false);
  const isProjectsOpen = projectsMenuOpen || activeTab.startsWith('projects');

  const isPublicRequested = (p: (typeof MOCK_PROJECTS)[number]) =>
    p.type === 'PUBLIC' && p.status === 'REQUESTED';

  const isRevisionRequest = (p: (typeof MOCK_PROJECTS)[number]) =>
    isPublicRequested(p) && Array.isArray(p.tags) && p.tags.includes('수정요청');

  const unapprovedCount = MOCK_PROJECTS.filter(p => isPublicRequested(p)).length;

  const activeCount = MOCK_PROJECTS.filter(p => {
    if (p.status === 'DRAFT') return false;
    const pr = isPublicRequested(p);
    const rev = isRevisionRequest(p);
    if (pr && !rev) return false;
    return true;
  }).length;
  const NavItem = ({ id, icon: Icon, label, hasSub = false, isOpen = false, onClick, isActive }: { id: string, icon: any, label: string, hasSub?: boolean, isOpen?: boolean, onClick?: () => void, isActive?: boolean }) => {
      const isItemActive = isActive !== undefined ? isActive : (activeTab === id || (hasSub && activeTab.startsWith(id)));
      return (
        <button onClick={onClick || (() => onTabChange(id))}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isItemActive && !hasSub ? 'bg-[#2b4ea7]/10 text-[#2b4ea7]' : isItemActive && hasSub ? 'text-[#2b4ea7]' : 'text-slate-500 hover:bg-[#2b4ea7]/5 hover:text-[#2b4ea7]'}`}>
            <div className="flex items-center gap-3"><Icon size={18} /> {label}</div>
            {hasSub && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </button>
      );
  };
  const SubNavItem = ({
      id,
      label,
      type = 'dot',
      count,
      countTone = 'muted',
  }: {
      id: string;
      label: string;
      type?: 'dot' | 'tree';
      count?: number;
      countTone?: 'muted' | 'danger';
  }) => (
      <button onClick={() => onTabChange(id)}
        className={`w-full text-left pl-11 pr-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === id ? 'text-[#2b4ea7] bg-[#2b4ea7]/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                {type === 'dot' && <div className={`w-1 h-1 rounded-full ${activeTab === id ? 'bg-[#2b4ea7]' : 'bg-slate-300'}`} />}
                {type === 'tree' && <span className="text-slate-300 text-[10px] -ml-1.5 mr-0.5">└</span>}
                <span>{label}</span>
            </div>
            {typeof count === 'number' && (
                <span
                    className={`text-[10px] font-black ${
                        countTone === 'danger' ? 'text-rose-500' : 'text-slate-400'
                    }`}
                >
                    {count}
                </span>
            )}
        </div>
      </button>
  );

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-slate-200 flex flex-col z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#2b4ea7] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm">A</div>
        <div>
          <h1 className="font-bold text-slate-900 tracking-tight leading-none">ADMarket</h1>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Admin v7.0</p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div className="mb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Main</div>
        <NavItem id="dashboard" icon={LayoutDashboard} label="대시보드" />
        <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core Management</div>
        <div>
            <NavItem
            id="projects"
            icon={Briefcase}
            label="프로젝트 관리"
            hasSub
            isOpen={isProjectsOpen}
            onClick={() => {
              setProjectsMenuOpen((prev) => !prev);
              if (!activeTab.startsWith('projects')) {
                onTabChange(unapprovedCount > 0 ? 'projects-unapproved' : 'projects');
              }
            }}
          />
            {isProjectsOpen && (
                <div className="mt-1 space-y-0.5">
                    {unapprovedCount > 0 && (
                      <SubNavItem id="projects-unapproved" label="승인대기 프로젝트" type="tree" count={unapprovedCount} countTone="danger" />
                    )}
                    <SubNavItem id="projects" label="전체 프로젝트" type="tree" count={activeCount} />
                    <SubNavItem id="projects-matching" label="매칭/제안 관리" type="tree" />
                    <SubNavItem id="projects-proposal" label="제안서/시안 관리" type="tree" />
                    <SubNavItem id="projects-contract" label="계약 관리" type="tree" />
                    <SubNavItem id="projects-production" label="제작/산출물 관리" type="tree" />
                    <SubNavItem id="projects-settlement" label="정산" type="tree" />
                    <SubNavItem id="projects-review" label="리뷰/평가 관리" type="tree" />
                </div>
            )}
        </div>
        <div>
            <NavItem id="companies" icon={Building2} label="기업/회원관리" hasSub isOpen={activeTab.startsWith('companies') || activeTab === 'employees' || activeTab === 'users'} onClick={() => onTabChange('companies')} />
            {(activeTab.startsWith('companies') || activeTab === 'employees' || activeTab === 'users') && (
                <div className="mt-1 space-y-0.5">
                    <SubNavItem id="companies" label="기업 목록" type="tree" />
                    <SubNavItem id="employees" label="직원 관리" type="tree" />
                    <SubNavItem id="companies-certification" label="사업자 인증" type="tree" />
                    <SubNavItem id="companies-grades" label="등급 관리" type="tree" />
                    <div className="my-2 border-t border-slate-100 mx-2"></div>
                    <SubNavItem id="users" label="개인회원" type="tree" />
                </div>
            )}
        </div>
        <div>
            <NavItem id="consultants" icon={UserCog} label="컨설턴트 관리" hasSub isOpen={activeTab.startsWith('consultants')} onClick={() => onTabChange('consultants')} />
            {activeTab.startsWith('consultants') && (
                <div className="mt-1 space-y-0.5">
                    <SubNavItem id="consultants-list" label="컨설턴트 리스트" type="tree" />
                    <SubNavItem id="consultants-projects" label="관련 프로젝트" type="tree" />
                    <SubNavItem id="consultants-settlement" label="수수료 정산" type="tree" />
                </div>
            )}
        </div>
        <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operations</div>
        <div>
            <NavItem id="content" icon={FileText} label="공지/알림/FAQ" hasSub isOpen={activeTab.startsWith('content')} onClick={() => onTabChange('content')} />
            {activeTab.startsWith('content') && (
                <div className="mt-1 space-y-0.5">
                    <SubNavItem id="content-notice" label="공지사항 관리" type="tree" />
                    <SubNavItem id="content-faq" label="FAQ 관리" type="tree" />
                    <SubNavItem id="content-notification" label="알림 발송 내역" type="tree" />
                    <div className="my-2 border-t border-slate-100 mx-2"></div>
                    <SubNavItem id="content-settings" label="알림 설정" type="tree" />
                </div>
            )}
        </div>
        <div>
            <NavItem id="support" icon={Headphones} label="고객 지원 센터(CS)" hasSub isOpen={activeTab.startsWith('support')} onClick={() => onTabChange('support')} />
            {activeTab.startsWith('support') && (
                <div className="mt-1 space-y-0.5">
                    <SubNavItem id="support-inquiry" label="1:1 문의" type="tree" />
                    <SubNavItem id="support-dispute" label="분쟁" type="tree" />
                    <SubNavItem id="support-report" label="신고" type="tree" />
                </div>
            )}
        </div>
        <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">System</div>
        <NavItem id="analytics" icon={BarChart3} label="통계 및 분석" />
        <NavItem id="settings" icon={Settings} label="설정" />
      </nav>
    </aside>
  );
};

export default AdminSidebar;
