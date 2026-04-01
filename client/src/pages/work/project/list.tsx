import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import SearchBar from '@/components/common/search-bar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectButton from '@/components/common/project-button';

type ProjectType = 'request' | 'participate';
type ProjectStatus = 'draft' | 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';

interface Project {
  id: string;
  projectNumber: string;
  title: string;
  company: string;
  companyType: string;
  companySize: string;
  status: ProjectStatus;
  statusLabel: string;
  deadline: string;
  deliveryDate: string;
  scope: string[];
  budget: string;
  budgetDetail: string;
  hashtags: string[];
  features: string[];
  daysRemaining: number;
  progressStage: string;
  projectType: ProjectType;
  badges?: string[];
}

const MOCK_PROJECT_LIST: Project[] = [
  {
    id: 'PJT-001',
    projectNumber: 'PID-20250721-0001',
    title: '[베스트전자] 신제품 판매촉진 프로모션 대행사 모집',
    company: '베스트전자',
    companyType: '전기전자',
    companySize: '대기업',
    status: 'in_progress',
    statusLabel: '접수중',
    deadline: '2026-04-15',
    deliveryDate: '2026-06-30',
    scope: ['전략기획', '크리에이티브', '영상제작', '미디어집행'],
    budget: '10~20억',
    budgetDetail: '(제작비 3억~6억)',
    hashtags: ['#전자제품', '#프로모션', '#대행사모집'],
    features: ['급행 제작 대응', '경쟁사 수행기업 제외', '리젝션 Fee'],
    daysRemaining: 14,
    progressStage: '제안서 접수중',
    projectType: 'request',
    badges: ['참여공고', '대행사 모집', '경쟁PT'],
  },
  {
    id: 'PJT-002',
    projectNumber: 'PID-20250610-0002',
    title: '[코스메틱코리아] 신제품 런칭 바이럴 캠페인',
    company: '코스메틱코리아',
    companyType: '화장품',
    companySize: '중견기업',
    status: 'approved',
    statusLabel: '승인완료',
    deadline: '2026-03-30',
    deliveryDate: '2026-05-15',
    scope: ['SNS 마케팅', '인플루언서', '영상제작'],
    budget: '3~5억',
    budgetDetail: '(제작비 1억~2억)',
    hashtags: ['#화장품', '#바이럴', '#SNS'],
    features: ['인플루언서 200명 이상', '릴스/쇼츠 포함'],
    daysRemaining: 0,
    progressStage: 'OT 완료 · PT 준비중',
    projectType: 'request',
    badges: ['1:1 매칭'],
  },
  {
    id: 'PJT-003',
    projectNumber: 'PID-20250505-0003',
    title: '[로컬푸드] 브랜드 리뉴얼 영상 캠페인',
    company: '로컬푸드(주)',
    companyType: '식품',
    companySize: '중소기업',
    status: 'draft',
    statusLabel: '임시저장',
    deadline: '2026-05-01',
    deliveryDate: '2026-07-31',
    scope: ['브랜딩', '영상제작', '옥외광고'],
    budget: '1~3억',
    budgetDetail: '(제작비 5천~1억)',
    hashtags: ['#식품', '#브랜드리뉴얼'],
    features: ['스토리보드 포함', '2D 애니메이션'],
    daysRemaining: 30,
    progressStage: '등록중 (임시저장)',
    projectType: 'request',
  },
  {
    id: 'PJT-004',
    projectNumber: 'PID-20241201-0004',
    title: '[패션브랜드] 시즌 컬렉션 디지털 캠페인',
    company: '패션브랜드',
    companyType: '패션/의류',
    companySize: '대기업',
    status: 'completed',
    statusLabel: '완료',
    deadline: '2024-12-15',
    deliveryDate: '2025-02-28',
    scope: ['크리에이티브', '영상', '디지털 광고'],
    budget: '5~8억',
    budgetDetail: '',
    hashtags: ['#패션', '#디지털', '#시즌'],
    features: ['4K 촬영', '글로벌 배포'],
    daysRemaining: 0,
    progressStage: '프로젝트 완료',
    projectType: 'request',
    badges: ['완료'],
  },
  {
    id: 'PJT-005',
    projectNumber: 'PID-20250801-0005',
    title: '[스마트솔루션] 기업 IR 영상 제작',
    company: '스마트솔루션(주)',
    companyType: 'IT/SaaS',
    companySize: '중소기업',
    status: 'in_progress',
    statusLabel: '제작중',
    deadline: '2026-04-20',
    deliveryDate: '2026-05-30',
    scope: ['영상제작', '모션그래픽', '번역'],
    budget: '5천~1억',
    budgetDetail: '',
    hashtags: ['#IT', '#IR영상', '#B2B'],
    features: ['한/영 자막', '3D 그래픽'],
    daysRemaining: 19,
    progressStage: '제작 진행중',
    projectType: 'participate',
    badges: ['My담당'],
  },
  {
    id: 'PJT-006',
    projectNumber: 'PID-20250915-0006',
    title: '[핀테크랩] 서비스 소개 영상 시리즈',
    company: '핀테크랩',
    companyType: '핀테크',
    companySize: '스타트업',
    status: 'approved',
    statusLabel: '승인완료',
    deadline: '2026-04-25',
    deliveryDate: '2026-06-10',
    scope: ['영상제작', '애니메이션'],
    budget: '3천~5천',
    budgetDetail: '(3편 패키지)',
    hashtags: ['#핀테크', '#서비스소개', '#시리즈'],
    features: ['모션그래픽 포함', '시리즈 3편'],
    daysRemaining: 24,
    progressStage: 'PT 준비중',
    projectType: 'participate',
  },
];

export default function WorkProjectList() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<ProjectType>('request');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showDraft, setShowDraft] = useState(false);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const projects = useMemo(
    () => MOCK_PROJECT_LIST.filter((p) => p.projectType === activeTab),
    [activeTab]
  );
  const isLoading = false;

  const filteredProjects = projects.filter(project => {
    if (!showDraft && project.status === 'draft') return false;
    if (!showInProgress && ['pending', 'approved', 'in_progress'].includes(project.status)) return false;
    if (!showCompleted && ['completed', 'cancelled'].includes(project.status)) return false;
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'draft': return 'text-gray-600';
      case 'pending': return 'text-yellow-600';
      case 'approved': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'completed': return 'text-gray-500';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const userCompany = activeTab === 'request' ? '베스트전자' : '솜사탕애드';
  const pageTitle = activeTab === 'request' ? '의뢰한 프로젝트 관리' : '참여한 프로젝트 관리';

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="work-title">[{userCompany}] {pageTitle}</h1>
              </div>

              <div className="mb-6">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="검색어를 입력하세요"
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setActiveTab('request')}
                      className={`pb-2 font-medium ${
                        activeTab === 'request'
                          ? 'border-b-2 border-gray-800 text-gray-800'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      data-testid="tab-request"
                    >
                      My의뢰
                    </button>
                    <button
                      onClick={() => setActiveTab('participate')}
                      className={`pb-2 font-medium ${
                        activeTab === 'participate'
                          ? 'border-b-2 border-gray-800 text-gray-800'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      data-testid="tab-participate"
                    >
                      My 참여
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      data-testid="select-sort"
                    >
                      <option value="latest">등록순</option>
                      <option value="deadline">마감순</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={showDraft}
                        onChange={(e) => setShowDraft(e.target.checked)}
                        data-testid="checkbox-draft"
                      />
                      임시저장
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={showInProgress}
                        onChange={(e) => setShowInProgress(e.target.checked)}
                        data-testid="checkbox-in-progress"
                      />
                      진행중
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                        data-testid="checkbox-completed"
                      />
                      종료/ 취소 포함
                    </label>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {isLoading ? (
                    <div className="text-center py-12 text-gray-500">로딩 중...</div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">프로젝트가 없습니다</div>
                  ) : (
                    filteredProjects.map((project) => (
                      <div 
                        key={project.id} 
                        className="border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setLocation(`/work/project/detail?id=${project.id}`)}
                        data-testid={`project-card-${project.id}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-mono text-sm font-medium">{project.projectNumber}</span>
                              <span className={`text-sm font-medium ${getStatusColor(project.status)}`}>
                                {project.statusLabel}
                              </span>
                              {project.badges && project.badges.map((badge, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded">
                                  {badge}
                                </span>
                              ))}
                            </div>
                            <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                            <div className="text-sm text-gray-600">
                              {project.company} {project.companySize} {project.companyType}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">
                              총예산 <span className="font-medium text-gray-800">{project.budget}</span>
                            </div>
                            <div className="text-xs text-gray-500">{project.budgetDetail}</div>
                          </div>
                        </div>

                        <div className="flex gap-4 text-sm text-gray-600 mb-3">
                          <div>접수마감 {project.deadline}</div>
                          <div>납품기한 {project.deliveryDate}</div>
                        </div>

                        <div className="flex gap-2 mb-3">
                          {project.scope.map((item, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 text-sm rounded">
                              {item}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2 mb-4">
                          {project.hashtags.map((tag, idx) => (
                            <span key={idx} className="text-sm text-gray-600">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-4 text-sm text-gray-700 mb-4">
                          {project.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <span>✓</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-500">
                            {project.progressStage}
                          </div>
                          
                          <div className="flex gap-2">
                            {activeTab === 'request' && project.status === 'draft' && (
                              <ProjectButton variant="white" className="w-auto px-6">
                                임시저장
                              </ProjectButton>
                            )}
                            {project.daysRemaining > 0 && (
                              <span className="text-sm text-gray-600">
                                {activeTab === 'request' ? '접수마감' : 'PT'} D-{project.daysRemaining}
                              </span>
                            )}
                            <ProjectButton variant="white" className="w-auto px-6">
                              {activeTab === 'request' ? 'AI추천 업체 보기' : '메세지'}
                            </ProjectButton>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {filteredProjects.length > 0 && (
                  <div className="flex items-center justify-center gap-2 px-6 py-4 border-t">
                    <button className="p-1 hover:bg-gray-100 rounded" data-testid="button-prev-page">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" data-testid="button-first-page">
                      {'<<'}
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" data-testid="button-page-prev">
                      {'<'}
                    </button>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${
                          currentPage === page
                            ? 'bg-gray-800 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                        data-testid={`button-page-${page}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button className="p-1 hover:bg-gray-100 rounded" data-testid="button-page-next">
                      {'>'}
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" data-testid="button-last-page">
                      {'>>'}
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" data-testid="button-next-page">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
