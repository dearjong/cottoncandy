import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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

export default function WorkProjectList() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<ProjectType>('request');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showDraft, setShowDraft] = useState(false);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects', activeTab],
    queryFn: async () => {
      const response = await fetch(`/api/projects?projectType=${activeTab}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
  });

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
