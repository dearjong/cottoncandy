import { Bell, FileText, Folder, Building2, ChevronDown, Users, MessageCircle, FolderOpen } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";

export default function WorkSidebar() {
  const [location, setLocation] = useLocation();
  const [userMode, setUserMode] = useState<'request' | 'participate'>(() => {
    return (localStorage.getItem('userMode') as 'request' | 'participate') || 'request';
  });
  const [messagesOpen, setMessagesOpen] = useState(() => location.startsWith('/work/message'));
  const [projectsOpen, setProjectsOpen] = useState(() => location.startsWith('/work/project'));
  const [portfolioOpen, setPortfolioOpen] = useState(() => location.startsWith('/work/company-portfolio') || location.startsWith('/portfolio'));
  const [isToggleAnimating, setIsToggleAnimating] = useState(false);

  const handleModeChange = (mode: 'request' | 'participate') => {
    if (mode === userMode) return;
    setIsToggleAnimating(true);
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
    setTimeout(() => {
      setLocation('/work/project/participation');
      window.location.reload();
    }, 200);
  };

  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-1">
        {/* 의뢰/참여 Toggle */}
        <div className="relative bg-gray-200 rounded-full p-[0.5px] mb-4">
          <div className="flex relative">
            <button
              onClick={() => handleModeChange('request')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all z-10 ${
                userMode === 'request'
                  ? 'text-white'
                  : 'text-gray-600'
              }`}
              data-testid="sidebar-toggle-request"
            >
              My의뢰
            </button>
            <button
              onClick={() => handleModeChange('participate')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all z-10 ${
                userMode === 'participate'
                  ? 'text-white'
                  : 'text-gray-600'
              }`}
              data-testid="sidebar-toggle-participate"
            >
              My 참여
            </button>
            {/* Sliding background */}
            <div
              className={`absolute top-[0.5px] bottom-[0.5px] w-[calc(50%-0.5px)] bg-gray-800 rounded-full ${
                isToggleAnimating ? 'transition-transform duration-200' : ''
              } ${
                userMode === 'participate' ? 'translate-x-[calc(100%+0.5px)]' : 'translate-x-[0.5px]'
              }`}
            />
          </div>
        </div>

        {/* 1. Work 홈 */}
        <Link 
          href="/work/home" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
            location === '/work/home' 
              ? 'bg-pink-50 text-pink-600' 
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          data-testid="sidebar-work-home"
        >
          <Building2 className="w-5 h-5" />
          Work 홈
        </Link>
        
        {/* 2. 메세시·알림 */}
        <div>
          <button
            onClick={() => setMessagesOpen(!messagesOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium" 
            data-testid="sidebar-messages"
          >
            <MessageCircle className="w-5 h-5" />
            <div className="flex-1 text-left">메세시·알림</div>
            <span className="bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">2</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${messagesOpen ? 'rotate-180' : ''}`} />
          </button>
          {messagesOpen && (
            <div className="ml-8 space-y-1">
            <Link 
              href="/work/message/received" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/message/received' || location.startsWith('/work/message/detail') ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-received"
            >
받은메세지 <span className="text-pink-600">2</span>
            </Link>
            <Link 
              href="/work/message/sent" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/message/sent' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-sent"
            >
보낸메세지
            </Link>
            <Link 
              href="/work/message/progress-notifications" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/message/progress-notifications' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-progress"
            >
진행현황 알림
            </Link>
            <Link 
              href="/work/message/custom-notifications" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/message/custom-notifications' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-custom"
            >
맞춤공고 알림
            </Link>
            <Link 
              href="/work/message/system-notifications" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/message/system-notifications' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-system"
            >
Cotton Candy 알림
            </Link>
            </div>
          )}
        </div>

        {/* 3. 컨설팅 문의 */}
        <Link
          href="/work/consulting/inquiries"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
            location.startsWith('/work/consulting')
              ? 'bg-pink-50 text-pink-600'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          data-testid="sidebar-consulting"
        >
          <MessageCircle className="w-5 h-5" />
          컨설팅 문의
        </Link>
        
        {/* 4. 프로젝트 리스트 */}
        <div>
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
              location.startsWith('/work/project')
                ? 'bg-pink-50 text-pink-600' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
            data-testid="sidebar-projects"
          >
            <FileText className="w-5 h-5" />
            <div className="flex-1 text-left">프로젝트 리스트</div>
            <ChevronDown className={`w-4 h-4 transition-transform ${projectsOpen ? 'rotate-180' : ''}`} />
          </button>
          {projectsOpen && (
            <div className="ml-8 space-y-1">
            <Link 
              href="/work/project/list" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/list' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-project-list"
            >
프로젝트 리스트
            </Link>
            <Link 
              href="/work/project/schedule" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/schedule' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-schedule"
            >
일정관리
            </Link>
            <Link 
              href="/work/project/selection" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/selection' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-selection"
            >
참여관리
            </Link>
            <Link 
              href="/work/project/participation" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/participation' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-participation-status"
            >
              └ 참여현황
            </Link>
            <Link
              href="/work/project/ot-guide"
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/ot-guide' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-ot-guide"
            >
              └ OT 안내
            </Link>
            <Link
              href="/work/project/proposal"
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/proposal' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-proposal"
            >
              제안서·시안
            </Link>
            <Link
              href="/work/project/contract"
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/contract' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-contract"
            >
              계약정보
            </Link>
            <Link
              href="/work/project/deliverables"
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/deliverables' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-deliverables"
            >
              산출물
            </Link>
            <Link
              href="/work/project/settlement"
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/settlement' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-settlement"
            >
              정산
            </Link>
            <div className="pt-1 mt-1 border-t border-gray-100">
              <p className="px-4 py-1.5 text-xs font-medium text-gray-400">사후관리</p>
            </div>
            <Link
              href="/work/project/review"
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/review' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-review"
            >
              └ 제작 리뷰
            </Link>
            <Link
              href="/work/project/post-review"
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/post-review' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-post-review"
            >
              └ 제작 후기
            </Link>
            <Link
              href="/work/project/consumer-survey"
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/consumer-survey' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-consumer-survey"
            >
              └ 소비자 반응 조사
            </Link>
            <Link
              href="/work/project/tvcf-review"
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/project/tvcf-review' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-tvcf-review"
            >
              └ TVCF 리뷰
            </Link>
            </div>
          )}
        </div>

        {/* 4. 문서함 */}
        <Link 
          href="/work/file-repository" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
            location === '/work/file-repository' 
              ? 'bg-pink-50 text-pink-600' 
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          data-testid="sidebar-files"
        >
          <Folder className="w-5 h-5" />
          문서함
        </Link>

        {/* Separator */}
        <div className="my-2 border-t border-gray-200"></div>
        
        {/* 5. 회사소개서 & 포트폴리오 */}
        <div>
          <button
            onClick={() => { setLocation('/portfolio'); setPortfolioOpen(true); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
              location === '/portfolio' || location.startsWith('/portfolio') || location === '/work/company-portfolio' || location.startsWith('/work/company-portfolio/')
                ? 'bg-pink-50 text-pink-600' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
            data-testid="sidebar-portfolio"
          >
            <FolderOpen className="w-5 h-5" />
            <div className="flex-1 text-left">회사소개서 & 포트폴리오</div>
            <ChevronDown className={`w-4 h-4 transition-transform ${portfolioOpen ? 'rotate-180' : ''}`} />
          </button>
          {portfolioOpen && (
            <div className="ml-8 space-y-1">
            <Link 
              href="/work/company-portfolio/manager-info" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/manager-info' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-manager-info"
            >
담당자 정보
            </Link>
            <Link 
              href="/work/company-portfolio/experience" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/experience' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-experience"
            >
경험·특화 분야/광고매체
            </Link>
            <Link 
              href="/work/company-portfolio/purpose" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/purpose' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-purpose"
            >
광고 목적별 전문 분야
            </Link>
            <Link 
              href="/work/company-portfolio/technique" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/technique' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-technique"
            >
제작 기법별 전문분야
            </Link>
            <Link 
              href="/work/company-portfolio/clients" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/clients' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-clients"
            >
대표 광고주
            </Link>
            <Link 
              href="/work/company-portfolio/awards" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/awards' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-awards"
            >
대표 수상내역
            </Link>
            <Link 
              href="/work/company-portfolio/portfolio" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/portfolio' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-portfolio-list"
            >
대표 포트폴리오
            </Link>
            <Link 
              href="/work/company-portfolio/staff" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/staff' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-staff"
            >
대표 스태프
            </Link>
            <Link 
              href="/work/company-portfolio/recent-projects" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/recent-projects' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-recent-projects"
            >
최근 참여 프로젝트
            </Link>
            <Link 
              href="/work/company-portfolio/cotton-candy-activity" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/cotton-candy-activity' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-cotton-candy-activity"
            >
최근 Cotton Candy 활동
            </Link>
            <Link 
              href="/work/company-portfolio/file-upload" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/file-upload' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-file-upload"
            >
파일 업로드
            </Link>
            <Link 
              href="/work/company-portfolio/intro" 
              className={`block px-4 py-2 text-sm hover:text-pink-600 ${
                location === '/work/company-portfolio/intro' ? 'text-pink-600' : 'text-gray-600'
              }`}
              data-testid="sidebar-intro"
            >
기업 소개글
            </Link>
            </div>
          )}
        </div>

        {/* 6. 기업 정보 */}
        <Link 
          href="/work/settings/company-info" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
            location === '/work/settings/company-info' 
              ? 'bg-pink-50 text-pink-600' 
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          data-testid="sidebar-company-info-main"
        >
          <Building2 className="w-5 h-5" />
          기업 정보
        </Link>

        {/* 7. 구성원 관리 */}
        <Link 
          href="/work/settings/member-management" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
            location === '/work/settings/member-management' 
              ? 'bg-pink-50 text-pink-600' 
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          data-testid="sidebar-members"
        >
          <Users className="w-5 h-5" />
          구성원 관리
        </Link>
      </div>
    </div>
  );
}
