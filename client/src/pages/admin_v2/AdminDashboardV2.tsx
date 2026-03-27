/**
 * cottoncandy_admin AdminDashboard 그대로 - 탭 기반, admin_v2 페이지 사용
 */
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AdminHome from '@/pages/admin_v2/dashboard/AdminHome';
import ProjectManagement from '@/pages/admin_v2/projects/ProjectManagement';
import CompanyManagement from '@/pages/admin_v2/companies/CompanyManagement';
import CompanyCertification from '@/pages/admin_v2/companies/CompanyCertification';
import CompanyGradeManagement from '@/pages/admin_v2/companies/CompanyGradeManagement';
import EmployeeManagement from '@/pages/admin_v2/companies/EmployeeManagement';
import UserManagement from '@/pages/admin_v2/companies/UserManagement';
import ConsultantManagement from '@/pages/admin_v2/consultants/ConsultantManagement';
import ContentManagement from '@/pages/admin_v2/content/ContentManagement';
import SupportManagement from '@/pages/admin_v2/support/SupportManagement';
import SettlementManagement from '@/pages/admin_v2/projects/SettlementManagement';
import MatchingManagement from '@/pages/admin_v2/projects/MatchingManagement';
import ProposalManagement from '@/pages/admin_v2/projects/ProposalManagement';
import ProposalManagement2 from '@/pages/admin_v2/projects/ProposalManagement2';
import ProductionManagement from '@/pages/admin_v2/projects/ProductionManagement';
import ContractManagement from '@/pages/admin_v2/projects/ContractManagement';
import AnalyticsDashboard from '@/pages/admin_v2/analytics/AnalyticsDashboard';
import SystemManagement from '@/pages/admin_v2/system/SystemManagement';
import AdminLayout from '@/components/admin_v2/AdminLayout';
import { ProjectFilterProvider } from '@/contexts/ProjectFilterContext';

const AdminDashboardV2 = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  const onSwitchToUser = () => setLocation('/');

  const renderContent = () => {
    if (activeTab === 'projects-proposal') return <ProposalManagement2 />;
    if (activeTab === 'projects-matching') return <MatchingManagement activeTab={activeTab} />;
    if (activeTab === 'projects-contract') return <ContractManagement />;
    if (activeTab === 'projects-production') return <ProductionManagement />;
    if (activeTab === 'projects-settlement') return <SettlementManagement />;
    if (activeTab.startsWith('projects')) return <ProjectManagement activeTab={activeTab} />;
    if (activeTab.startsWith('consultants')) return <ConsultantManagement activeTab={activeTab} />;
    if (activeTab.startsWith('content')) return <ContentManagement activeTab={activeTab} />;
    if (activeTab.startsWith('support')) return <SupportManagement activeTab={activeTab} />;

    switch (activeTab) {
      case 'dashboard': return <AnalyticsDashboard onTabChange={setActiveTab} />;
      case 'companies': return <CompanyManagement />;
      case 'companies-certification': return <CompanyCertification />;
      case 'companies-grades': return <CompanyGradeManagement onTabChange={setActiveTab} />;
      case 'employees': return <EmployeeManagement />;
      case 'users': return <UserManagement />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'settings': return <SystemManagement />;
      default: return <AdminHome />;
    }
  };

  return (
    <ProjectFilterProvider>
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} onSwitchToUser={onSwitchToUser}>
        {renderContent()}
      </AdminLayout>
    </ProjectFilterProvider>
  );
};

export default AdminDashboardV2;
