import { Switch, Route } from "wouter";
import { FunnelRouteListener } from "@/lib/analytics";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Login from "@/pages/member/login";
import LoginNaver from "@/pages/member/login-naver";
import LoginGoogle from "@/pages/member/login-google";
import Signup from "@/pages/member/signup";
import SignupPhone from "@/pages/member/signup-phone";
import SignupEmail from "@/pages/member/signup-email";
import SignupAccountType from "@/pages/member/signup-account-type";
import SignupJobInfo from "@/pages/member/signup-job-info";
import Step1PartnerSelection from "@/pages/service/create-project/step1-partner-selection";
import ConsultingInquiry from "@/pages/service/create-project/consulting-inquiry";
import PartnerType from "@/pages/service/create-project/partner-type";
import ProjectName from "@/pages/service/create-project/project-name";
import AdvertisingObjective from "@/pages/service/create-project/advertising-objective";
import ProductionTechnique from "@/pages/service/create-project/production-technique";
import MediaChannel from "@/pages/service/create-project/media-channel";
import MainClient from "@/pages/service/create-project/main-client";
import Budget from "@/pages/service/create-project/budget";
import PaymentTerms from "@/pages/service/create-project/payment-terms";
import Schedule from "@/pages/service/create-project/schedule";
import ProductInfo from "@/pages/service/create-project/product-info";
import ContactPerson from "@/pages/service/create-project/contact-person";
import ExcludedCompetitors from "@/pages/service/create-project/excluded-competitors";
import ParticipantConditions from "@/pages/service/create-project/participant-conditions";
import RequiredFiles from "@/pages/service/create-project/required-files";
import CompanyInfo from "@/pages/service/create-project/company-info";
import AdditionalDescription from "@/pages/service/create-project/additional-description";
import ProjectDetails from "@/pages/service/create-project/project-details";
import Portfolio from "@/pages/service/partners/portfolio";
import PortfolioPreview from "@/pages/service/partners/portfolio-preview";
import AgencySearch from "@/pages/service/partners/agency-search";
import GuideIndex from "@/pages/service/guides/main";
import GuideFeatures from "@/pages/service/guides/features";
import GuideHowToUse from "@/pages/service/guides/how-to-use";
import GuideFAQ from "@/pages/service/guides/faq";
import GuideInquiry from "@/pages/service/guides/inquiry";
import GuideNotice from "@/pages/service/guides/notice";
import GuideEvent from "@/pages/service/guides/event";
import ProjectList from "@/pages/service/project-list/list";
import ProjectListDetail from "@/pages/service/project-list/detail";
import Contest from "@/pages/contest";
import WorkHome from "@/pages/work/home";
import WorkProjectList from "@/pages/work/project/list";
import WorkProjectSchedule from "@/pages/work/project/schedule";
import WorkProjectParticipation from "@/pages/work/project/participation";
import WorkProjectOtGuide from "@/pages/work/project/ot-guide";
import WorkProjectProposal from "@/pages/work/project/proposal";
import WorkProjectProposalView from "@/pages/work/project/proposal-view";
import WorkProjectProposalRegister from "@/pages/work/project/proposal-register";
import WorkProjectContract from "@/pages/work/project/contract";
import WorkProjectDeliverables from "@/pages/work/project/deliverables";
import WorkProjectSettlement from "@/pages/work/project/settlement";
import WorkProjectReview from "@/pages/work/project/review";
import WorkProjectPostReview from "@/pages/work/project/post-review";
import WorkProjectConsumerSurvey from "@/pages/work/project/consumer-survey";
import WorkProjectTvcfReview from "@/pages/work/project/tvcf-review";
import WorkProjectDetail from "@/pages/work/project/detail";
import WorkCompanyProfile from "@/pages/work/company-profile";
import WorkConsultingInquiries from "@/pages/work/consulting/inquiries";
import CompanyPortfolio from "@/pages/company/company-portfolio/index";
import CompanyInfoPortfolio from "@/pages/company/company-portfolio/company-info";
import ManagerInfo from "@/pages/company/company-portfolio/manager-info";
import Experience from "@/pages/company/company-portfolio/experience";
import Purpose from "@/pages/company/company-portfolio/purpose";
import Technique from "@/pages/company/company-portfolio/technique";
import Clients from "@/pages/company/company-portfolio/clients";
import Awards from "@/pages/company/company-portfolio/awards";
import PortfolioList from "@/pages/company/company-portfolio/portfolio";
import Staff from "@/pages/company/company-portfolio/staff";
import RecentProjects from "@/pages/company/company-portfolio/recent-projects";
import CottonCandyActivity from "@/pages/company/company-portfolio/cotton-candy-activity";
import FileUploadPage from "@/pages/company/company-portfolio/file-upload";
import Intro from "@/pages/company/company-portfolio/intro";
import MessageDetail from "@/pages/work/message/message-detail";
import ReceivedMessages from "@/pages/work/message/received-messages";
import SentMessages from "@/pages/work/message/sent-messages";
import CustomNotifications from "@/pages/work/message/custom-notifications";
import ProgressNotifications from "@/pages/work/message/progress-notifications";
import SystemNotifications from "@/pages/work/message/system-notifications";
import NotificationDetail from "@/pages/work/message/notification-detail";
import FileRepository from "@/pages/work/file/file-repository";
import SettingsCompanyInfo from "@/pages/work/settings/company-info";
import SettingsMemberManagement from "@/pages/work/settings/member-management";
import MemberManagement from "@/pages/my/member-management";
import MyProfile from "@/pages/my/profile";
import MyWithdraw from "@/pages/my/withdraw";
import MyInquiry from "@/pages/my/inquiry";
import MyNotificationSettings from "@/pages/my/notification-settings";
import MyJobInfo from "@/pages/my/job-info";
import DesignSystem from "@/pages/design-system";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/components/admin/admin-layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCalendar from "@/pages/admin/calendar";
import AdminProjects from "@/pages/admin/projects";
import AdminMembers from "@/pages/admin/members";
import AdminCommunication from "@/pages/admin/communication";
import AdminReports from "@/pages/admin/reports";
import AdminReportsPlatform from "@/pages/admin/reports/platform";
import AdminReportsEventLog from "@/pages/admin/reports/eventlog";
import AdminAnnouncements from "@/pages/admin/announcements";
import AdminSettings from "@/pages/admin/admin-settings";
import AdminSettingsPlatform from "@/pages/admin/settings/platform";
import AdminSettingsLogs from "@/pages/admin/settings/logs";
import AdminSecurityMessages from "@/pages/admin/security/messages";
import AdminSimulate from "@/pages/admin/simulate";
import AdminPlaceholder from "@/pages/admin/placeholder";
import AdminContracts from "@/pages/admin/contracts";
import AdminReviews from "@/pages/admin/reviews";
import AdminProjectDetail from "@/pages/admin/project-detail";
import AdminBiddingProjects from "@/pages/admin/bidding-projects";
import AdminOneOnOneProjects from "@/pages/admin/one-on-one-projects";
import AdminConsultingProjects from "@/pages/admin/consulting-projects";
import AdminConsultingProjectDetailPage from "@/pages/admin/consulting-project-detail";
import AdminConsultingRelatedProjects from "@/pages/admin/consulting-related-projects";
import AdminProgress from "@/pages/admin/progress";
import AdminPendingApproval from "@/pages/admin/pending-approval";
import AdminStopCancel from "@/pages/admin/stop-cancel";
import AdminCompanyVerification from "@/pages/admin/company-verification";
import AdminCompanyPortfolios from "@/pages/admin/company-portfolios";
import AdminReportsManagement from "@/pages/admin/reports-management";
import AdminActivityLogs from "@/pages/admin/activity-logs";
import AdminEventLog from "@/pages/admin/event-log";
import AdminCompanies from "@/pages/admin/companies";
import AdminCompanyDetail from "@/pages/admin/company-detail";
import AdminParticipation from "@/pages/admin/participation";
import AdminWorkflowMatching from "@/pages/admin/workflow/matching";
import AdminWorkflowProposal from "@/pages/admin/workflow/proposal";
import AdminWorkflowProposalView from "@/pages/admin/workflow/proposal-view";
import AdminWorkflowContract from "@/pages/admin/workflow/contract";
import AdminWorkflowProduction from "@/pages/admin/workflow/production";
import AdminWorkflowSettlement from "@/pages/admin/workflow/settlement";
import AdminWorkflowReview from "@/pages/admin/workflow/review";
import AdminWorkflowPostReview from "@/pages/admin/workflow/post-review";
import AdminWorkflowConsumerSurvey from "@/pages/admin/workflow/consumer-survey";
import AdminWorkflowTvcfReview from "@/pages/admin/workflow/tvcf-review";
import AdminConsultants from "@/pages/admin/consultants";
import AdminNotificationSettings from "@/pages/admin/system/NotificationSettings";
import AdminCompanyGradeManagement from "@/pages/admin/system/CompanyGradeManagement";
import CsInquiryPage from "@/pages/admin/cs/inquiry";
import CsNotificationsPage from "@/pages/admin/cs/notifications";
import CsAiChatPage from "@/pages/admin/cs/ai-chat";
import CsNoticesPage from "@/pages/admin/cs/notices";
import CsBannersPage from "@/pages/admin/cs/banners";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/login/naver" component={LoginNaver} />
      <Route path="/login/google" component={LoginGoogle} />
      <Route path="/signup" component={Signup} />
      <Route path="/signup/phone" component={SignupPhone} />
      <Route path="/signup/email" component={SignupEmail} />
      <Route path="/signup/account-type" component={SignupAccountType} />
      <Route path="/signup/job-info" component={SignupJobInfo} />
      <Route path="/create-project/step1">
        <ProtectedRoute component={Step1PartnerSelection} />
      </Route>
      <Route path="/create-project/consulting-inquiry">
        <ProtectedRoute component={ConsultingInquiry} />
      </Route>
      <Route path="/create-project/step2">
        <ProtectedRoute component={PartnerType} />
      </Route>
      <Route path="/create-project/step3">
        <ProtectedRoute component={ProjectName} />
      </Route>
      <Route path="/create-project/step4">
        <ProtectedRoute component={AdvertisingObjective} />
      </Route>
      <Route path="/create-project/step5">
        <ProtectedRoute component={ProductionTechnique} />
      </Route>
      <Route path="/create-project/step6">
        <ProtectedRoute component={MediaChannel} />
      </Route>
      <Route path="/create-project/step7">
        <ProtectedRoute component={MainClient} />
      </Route>
      <Route path="/create-project/step8">
        <ProtectedRoute component={Budget} />
      </Route>
      <Route path="/create-project/step9">
        <ProtectedRoute component={PaymentTerms} />
      </Route>
      <Route path="/create-project/step10">
        <ProtectedRoute component={Schedule} />
      </Route>
      <Route path="/create-project/step11">
        <ProtectedRoute component={ProductInfo} />
      </Route>
      <Route path="/create-project/step12">
        <ProtectedRoute component={ContactPerson} />
      </Route>
      <Route path="/create-project/step13">
        <ProtectedRoute component={ExcludedCompetitors} />
      </Route>
      <Route path="/create-project/step14">
        <ProtectedRoute component={ParticipantConditions} />
      </Route>
      <Route path="/create-project/step15">
        <ProtectedRoute component={RequiredFiles} />
      </Route>
      <Route path="/create-project/step16">
        <ProtectedRoute component={CompanyInfo} />
      </Route>
      <Route path="/create-project/step17">
        <ProtectedRoute component={AdditionalDescription} />
      </Route>
      <Route path="/create-project/step18">
        <ProtectedRoute component={ProjectDetails} />
      </Route>
      <Route path="/portfolio/preview">
        <ProtectedRoute component={PortfolioPreview} />
      </Route>
      <Route path="/portfolio">
        <ProtectedRoute component={Portfolio} />
      </Route>
      <Route path="/agency-search">
        <ProtectedRoute component={AgencySearch} />
      </Route>
      <Route path="/guide">
        <ProtectedRoute component={GuideIndex} />
      </Route>
      <Route path="/guide/features">
        <ProtectedRoute component={GuideFeatures} />
      </Route>
      <Route path="/guide/how-to-use">
        <ProtectedRoute component={GuideHowToUse} />
      </Route>
      <Route path="/guide/faq">
        <ProtectedRoute component={GuideFAQ} />
      </Route>
      <Route path="/guide/inquiry">
        <ProtectedRoute component={GuideInquiry} />
      </Route>
      <Route path="/guide/notice">
        <ProtectedRoute component={GuideNotice} />
      </Route>
      <Route path="/guide/event">
        <ProtectedRoute component={GuideEvent} />
      </Route>
      <Route path="/project-list">
        <ProtectedRoute component={ProjectList} />
      </Route>
      <Route path="/project-list/:id">
        <ProtectedRoute component={ProjectListDetail} />
      </Route>
      <Route path="/contest">
        <ProtectedRoute component={Contest} />
      </Route>
      <Route path="/work/home">
        <ProtectedRoute component={WorkHome} />
      </Route>
      <Route path="/work/consulting/inquiries">
        <ProtectedRoute component={WorkConsultingInquiries} />
      </Route>
      <Route path="/work/project/list">
        <ProtectedRoute component={WorkProjectList} />
      </Route>
      <Route path="/work/project/schedule">
        <ProtectedRoute component={WorkProjectSchedule} />
      </Route>
      <Route path="/work/project/participation">
        <ProtectedRoute component={WorkProjectParticipation} />
      </Route>
      <Route path="/work/project/ot-guide">
        <ProtectedRoute component={WorkProjectOtGuide} />
      </Route>
      <Route path="/work/project/proposal/register">
        <ProtectedRoute component={WorkProjectProposalRegister} />
      </Route>
      <Route path="/work/project/proposal/view/:companyId">
        <ProtectedRoute component={WorkProjectProposalView} />
      </Route>
      <Route path="/work/project/proposal">
        <ProtectedRoute component={WorkProjectProposal} />
      </Route>
      <Route path="/work/project/contract">
        <ProtectedRoute component={WorkProjectContract} />
      </Route>
      <Route path="/work/project/deliverables">
        <ProtectedRoute component={WorkProjectDeliverables} />
      </Route>
      <Route path="/work/project/settlement">
        <ProtectedRoute component={WorkProjectSettlement} />
      </Route>
      <Route path="/work/project/review">
        <ProtectedRoute component={WorkProjectReview} />
      </Route>
      <Route path="/work/project/post-review">
        <ProtectedRoute component={WorkProjectPostReview} />
      </Route>
      <Route path="/work/project/consumer-survey">
        <ProtectedRoute component={WorkProjectConsumerSurvey} />
      </Route>
      <Route path="/work/project/tvcf-review">
        <ProtectedRoute component={WorkProjectTvcfReview} />
      </Route>
      <Route path="/work/project/detail">
        <ProtectedRoute component={WorkProjectDetail} />
      </Route>
      <Route path="/work/project/company-profile">
        <ProtectedRoute component={WorkCompanyProfile} />
      </Route>
      <Route path="/work/company-portfolio">
        <ProtectedRoute component={CompanyPortfolio} />
      </Route>
      <Route path="/work/company-portfolio/company-info">
        <ProtectedRoute component={CompanyInfoPortfolio} />
      </Route>
      <Route path="/work/company-portfolio/manager-info">
        <ProtectedRoute component={ManagerInfo} />
      </Route>
      <Route path="/work/company-portfolio/experience">
        <ProtectedRoute component={Experience} />
      </Route>
      <Route path="/work/company-portfolio/purpose">
        <ProtectedRoute component={Purpose} />
      </Route>
      <Route path="/work/company-portfolio/technique">
        <ProtectedRoute component={Technique} />
      </Route>
      <Route path="/work/company-portfolio/clients">
        <ProtectedRoute component={Clients} />
      </Route>
      <Route path="/work/company-portfolio/awards">
        <ProtectedRoute component={Awards} />
      </Route>
      <Route path="/work/company-portfolio/portfolio">
        <ProtectedRoute component={PortfolioList} />
      </Route>
      <Route path="/work/company-portfolio/staff">
        <ProtectedRoute component={Staff} />
      </Route>
      <Route path="/work/company-portfolio/recent-projects">
        <ProtectedRoute component={RecentProjects} />
      </Route>
      <Route path="/work/company-portfolio/cotton-candy-activity">
        <ProtectedRoute component={CottonCandyActivity} />
      </Route>
      <Route path="/work/company-portfolio/file-upload">
        <ProtectedRoute component={FileUploadPage} />
      </Route>
      <Route path="/work/company-portfolio/intro">
        <ProtectedRoute component={Intro} />
      </Route>
      <Route path="/work/message/received">
        <ProtectedRoute component={ReceivedMessages} />
      </Route>
      <Route path="/work/message/sent">
        <ProtectedRoute component={SentMessages} />
      </Route>
      <Route path="/work/message/detail/:id">
        <ProtectedRoute component={MessageDetail} />
      </Route>
      <Route path="/work/message/custom-notifications">
        <ProtectedRoute component={CustomNotifications} />
      </Route>
      <Route path="/work/message/progress-notifications">
        <ProtectedRoute component={ProgressNotifications} />
      </Route>
      <Route path="/work/message/system-notifications">
        <ProtectedRoute component={SystemNotifications} />
      </Route>
      <Route path="/work/notification/detail/:id">
        <ProtectedRoute component={NotificationDetail} />
      </Route>
      <Route path="/work/file-repository">
        <ProtectedRoute component={FileRepository} />
      </Route>
      <Route path="/work/settings/company-info">
        <ProtectedRoute component={SettingsCompanyInfo} />
      </Route>
      <Route path="/work/settings/member-management">
        <ProtectedRoute component={SettingsMemberManagement} />
      </Route>
      <Route path="/mypage/members">
        <ProtectedRoute component={MemberManagement} />
      </Route>
      <Route path="/my/profile">
        <ProtectedRoute component={MyProfile} />
      </Route>
      <Route path="/my/withdraw">
        <ProtectedRoute component={MyWithdraw} />
      </Route>
      <Route path="/my/inquiry">
        <ProtectedRoute component={MyInquiry} />
      </Route>
      <Route path="/my/notification-settings">
        <ProtectedRoute component={MyNotificationSettings} />
      </Route>
      <Route path="/my/job-info">
        <ProtectedRoute component={MyJobInfo} />
      </Route>
      <Route path="/design-system" component={DesignSystem} />
      
      {/* Admin Routes (admin 폴더 전용) */}
      <Route path="/admin">
        <AdminLayout><AdminDashboard /></AdminLayout>
      </Route>
      <Route path="/admin/dashboard">
        <AdminLayout><AdminDashboard /></AdminLayout>
      </Route>
      <Route path="/admin/calendar">
        <AdminLayout><AdminCalendar /></AdminLayout>
      </Route>
      <Route path="/admin/project_list">
        <AdminLayout><AdminProjects /></AdminLayout>
      </Route>
      <Route path="/admin/project_list/public">
        <AdminLayout><AdminBiddingProjects /></AdminLayout>
      </Route>
      <Route path="/admin/project_list/private">
        <AdminLayout><AdminOneOnOneProjects /></AdminLayout>
      </Route>
      <Route path="/admin/project-detail/:id">
        <AdminLayout><AdminProjectDetail /></AdminLayout>
      </Route>
      <Route path="/admin/consulting/related-projects">
        <AdminLayout><AdminConsultingRelatedProjects /></AdminLayout>
      </Route>
      <Route path="/admin/consulting/:id">
        {(params: { id: string }) => (
          <AdminLayout>
            <AdminConsultingProjectDetailPage projectId={params.id} />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/consulting">
        <AdminLayout><AdminConsultingProjects /></AdminLayout>
      </Route>
      <Route path="/admin/consultants">
        <AdminLayout><AdminConsultants /></AdminLayout>
      </Route>
      <Route path="/admin/progress">
        <AdminLayout><AdminProgress /></AdminLayout>
      </Route>
      <Route path="/admin/pending-approval">
        <AdminLayout><AdminPendingApproval /></AdminLayout>
      </Route>
      <Route path="/admin/stop-cancel">
        <AdminLayout><AdminStopCancel /></AdminLayout>
      </Route>
      {/* 절차별(workflow) */}
      <Route path="/admin/workflow/matching">
        <AdminLayout><AdminWorkflowMatching /></AdminLayout>
      </Route>
      <Route path="/admin/workflow/proposal">
        <AdminLayout><AdminWorkflowProposal /></AdminLayout>
      </Route>
      <Route path="/admin/workflow/proposal/view/:companyId">
        <AdminLayout><AdminWorkflowProposalView /></AdminLayout>
      </Route>
      <Route path="/admin/workflow/contract">
        <AdminLayout><AdminWorkflowContract /></AdminLayout>
      </Route>
      <Route path="/admin/workflow/production">
        <AdminLayout><AdminWorkflowProduction /></AdminLayout>
      </Route>
      <Route path="/admin/workflow/settlement">
        <AdminLayout><AdminWorkflowSettlement /></AdminLayout>
      </Route>
      <Route path="/admin/workflow/review">
        <AdminLayout><AdminWorkflowReview /></AdminLayout>
      </Route>
      <Route path="/admin/workflow/post-review">
        <AdminLayout><AdminWorkflowPostReview /></AdminLayout>
      </Route>
      <Route path="/admin/workflow/consumer-survey">
        <AdminLayout><AdminWorkflowConsumerSurvey /></AdminLayout>
      </Route>
      <Route path="/admin/workflow/tvcf-review">
        <AdminLayout><AdminWorkflowTvcfReview /></AdminLayout>
      </Route>
      {/* 절차별(workflow) — embed (사이드바 없이 모달용) */}
      <Route path="/admin/workflow-embed/matching">
        <AdminWorkflowMatching />
      </Route>
      <Route path="/admin/workflow-embed/proposal">
        <AdminWorkflowProposal />
      </Route>
      <Route path="/admin/workflow-embed/proposal/view/:companyId">
        <AdminWorkflowProposalView />
      </Route>
      <Route path="/admin/workflow-embed/contract">
        <AdminWorkflowContract />
      </Route>
      <Route path="/admin/workflow-embed/production">
        <AdminWorkflowProduction />
      </Route>
      <Route path="/admin/workflow-embed/settlement">
        <AdminWorkflowSettlement />
      </Route>
      <Route path="/admin/workflow-embed/review">
        <AdminWorkflowReview />
      </Route>
      <Route path="/admin/company-verification">
        <AdminLayout><AdminCompanyVerification /></AdminLayout>
      </Route>
      <Route path="/admin/company-portfolios">
        <AdminLayout><AdminCompanyPortfolios /></AdminLayout>
      </Route>
      <Route path="/admin/companies">
        <AdminCompanies />
      </Route>
      <Route path="/admin/companies/:id">
        <AdminCompanyDetail />
      </Route>
      <Route path="/admin/participation">
        <AdminParticipation />
      </Route>
      <Route path="/admin/reports-management">
        <AdminLayout><AdminReportsManagement /></AdminLayout>
      </Route>
      <Route path="/admin/activity-logs">
        <AdminLayout><AdminActivityLogs /></AdminLayout>
      </Route>
      <Route path="/admin/event-log">
        <AdminLayout><AdminEventLog /></AdminLayout>
      </Route>
      <Route path="/admin/system/notifications">
        <AdminLayout><AdminNotificationSettings /></AdminLayout>
      </Route>
      <Route path="/admin/system/grades">
        <AdminLayout><AdminCompanyGradeManagement /></AdminLayout>
      </Route>
      <Route path="/admin/contracts">
        <AdminLayout><AdminContracts /></AdminLayout>
      </Route>
      <Route path="/admin/reviews">
        <AdminLayout><AdminReviews /></AdminLayout>
      </Route>

      <Route path="/admin/members">
        <AdminLayout><AdminMembers /></AdminLayout>
      </Route>
      <Route path="/admin/communication">
        <AdminLayout><AdminCommunication /></AdminLayout>
      </Route>
      <Route path="/admin/cs/inquiry">
        <AdminLayout><CsInquiryPage /></AdminLayout>
      </Route>
      <Route path="/admin/cs/notifications">
        <AdminLayout><CsNotificationsPage /></AdminLayout>
      </Route>
      <Route path="/admin/cs/ai-chat">
        <AdminLayout><CsAiChatPage /></AdminLayout>
      </Route>
      <Route path="/admin/cs/notices">
        <AdminLayout><CsNoticesPage /></AdminLayout>
      </Route>
      <Route path="/admin/cs/banners">
        <AdminLayout><CsBannersPage /></AdminLayout>
      </Route>
      <Route path="/admin/reports">
        <AdminLayout><AdminReports /></AdminLayout>
      </Route>
      <Route path="/admin/reports/platform">
        <AdminLayout><AdminReportsPlatform /></AdminLayout>
      </Route>
      <Route path="/admin/reports/eventlog">
        <AdminLayout><AdminReportsEventLog /></AdminLayout>
      </Route>
      <Route path="/admin/announcements">
        <AdminLayout><AdminAnnouncements /></AdminLayout>
      </Route>
      <Route path="/admin/settings">
        <AdminLayout><AdminSettings /></AdminLayout>
      </Route>
      <Route path="/admin/settings/platform">
        <AdminLayout><AdminSettingsPlatform /></AdminLayout>
      </Route>
      <Route path="/admin/settings/logs">
        <AdminLayout><AdminSettingsLogs /></AdminLayout>
      </Route>

      <Route path="/admin/security/messages">
        <AdminLayout><AdminSecurityMessages /></AdminLayout>
      </Route>
      <Route path="/admin/simulate">
        <AdminLayout><AdminSimulate /></AdminLayout>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <FunnelRouteListener />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
