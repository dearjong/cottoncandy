import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
    ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
    Search, Download,
    User, Image as ImageIcon, EyeOff, Check, XCircle, X, MoreVertical, Eye, EyeOff as EyeOffIcon, Send
} from 'lucide-react';
import { ProjectTypeBadge } from '@/components/Badges';
import { ProjectPageHeader } from '@/components/project/ProjectPageHeader';
import { useProjectFilterContextOptional } from '@/contexts/ProjectFilterContext';
import { PageHeader } from '@/components/layout';
import { MOCK_PROJECTS } from '@/data/mockData';
import { getProjectSteps, getActiveStepIndex, ProcessStepper, ProjectActionButtons } from './ProjectCommon';
import ProjectDetailDrawer from './ProjectDetailDrawer';

interface ProjectManagementProps {
    activeTab?: string;
}

const ITEMS_PER_PAGE = 20;

// 진행 상태 한글 라벨 + 뱃지 색상 (상태값 구분용)
const STATUS_DISPLAY: Record<string, { label: string; className: string }> = {
    DRAFT: { label: '임시', className: 'bg-slate-100 text-slate-500' },
    REQUESTED: { label: '승인대기', className: 'bg-amber-100 text-amber-700' },
    MATCHING: { label: '매칭중', className: 'bg-blue-100 text-blue-700' },
    APPROVED: { label: '승인', className: 'bg-emerald-100 text-emerald-700' },
    CONTRACT: { label: '계약', className: 'bg-violet-100 text-violet-700' },
    PRODUCTION: { label: '제작', className: 'bg-indigo-100 text-indigo-700' },
    SETTLEMENT: { label: '정산', className: 'bg-teal-100 text-teal-700' },
    COMPLETE: { label: '완료', className: 'bg-slate-700 text-white' },
    AFTER_SERVICE: { label: 'AS', className: 'bg-slate-600 text-white' },
    STOPPED: { label: '중단', className: 'bg-rose-100 text-rose-600' },
    REJECTED: { label: '반려', className: 'bg-rose-100 text-rose-600' },
    CANCELLED: { label: '취소', className: 'bg-slate-200 text-slate-600' },
};

const buttonBase = 'inline-flex items-center justify-center rounded-lg font-bold transition-all whitespace-nowrap';
const buttonSizes: Record<'xs' | 'sm', string> = {
    xs: 'text-[11px] px-3 py-1.5',
    sm: 'text-xs px-3 py-2',
};
const buttonVariants: Record<'primary' | 'secondary' | 'ghost', string> = {
    primary: 'bg-[#2b4ea7] text-white shadow-sm hover:bg-[#203b80] hover:shadow-md hover:-translate-y-0.5',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100',
    ghost: 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50',
};

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'xs' | 'sm';
    className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
    variant = 'secondary',
    size = 'sm',
    className = '',
    children,
    ...props
}) => {
    const classes = `${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]} ${className}`.trim();
    return (
        <button {...props} className={classes}>
            {children}
        </button>
    );
};

const ProjectManagement = ({ activeTab = 'projects' }: ProjectManagementProps) => {
    // 관리 효율성을 위해 기본 뷰를 LIST로 변경
    const [viewMode, setViewMode] = useState<'LIST' | 'CARD'>('LIST'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [sortBy, setSortBy] = useState<'REG_DATE' | 'DEADLINE'>('REG_DATE'); // 등록순 | 마감임박순
    const [selectedProject, setSelectedProject] = useState<typeof MOCK_PROJECTS[0] | null>(null);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    
    // Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Local state to simulate status toggle changes
    const [projectStatusMap, setProjectStatusMap] = useState<Record<string, string>>(() => {
        const map: Record<string, string> = {};
        MOCK_PROJECTS.forEach(p => {
            map[p.id] = p.status;
        });
        return map;
    });

    // 삭제된 프로젝트 ID (목록에서 제외)
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
    // 액션 메뉴 열린 행 + 위치 (Portal용)
    const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
    // 미승인 프로젝트 뷰 (전체 / 첫등록 / 수정요청)
    const [unapprovedView, setUnapprovedView] = useState<'ALL' | 'NEW' | 'REVISION'>('ALL');

    // Derived projects list with updated statuses
    const projectsWithStatus = useMemo(() => {
        return MOCK_PROJECTS.map(p => ({
            ...p,
            status: projectStatusMap[p.id] || p.status
        }));
    }, [projectStatusMap]);

    // 삭제 제외 목록 (통계·필터용)
    const projectsVisible = useMemo(() =>
        projectsWithStatus.filter(p => !deletedIds.has(p.id)),
        [projectsWithStatus, deletedIds]
    );

    // 리뷰/평가 관리: 전역 프로젝트 필터 사용 (선택 유지)
    const projectFilterReview = useProjectFilterContextOptional();

    // Handle Toggle Action (Approve / Stop)
    const handleStatusToggle = (projectId: string, action: 'APPROVE' | 'STOP') => {
        setProjectStatusMap(prev => {
            const currentStatus = prev[projectId] || MOCK_PROJECTS.find(p => p.id === projectId)?.status || 'MATCHING';
            let newStatus = currentStatus;

            if (action === 'APPROVE') {
                if (['STOPPED', 'REJECTED', 'CANCELLED', 'DRAFT', 'REQUESTED'].includes(currentStatus)) {
                    newStatus = 'MATCHING'; 
                }
            } else {
                if (['MATCHING', 'APPROVED', 'PRODUCTION', 'CONTRACT', 'SETTLEMENT'].includes(currentStatus)) {
                    newStatus = 'STOPPED';
                }
            }
            return { ...prev, [projectId]: newStatus };
        });
    };

    const isPublicRequested = (project: typeof MOCK_PROJECTS[0]) =>
        project.type === 'PUBLIC' && project.status === 'REQUESTED';

    const isRevisionRequest = (project: typeof MOCK_PROJECTS[0]) =>
        isPublicRequested(project) && Array.isArray(project.tags) && project.tags.includes('수정요청');

    // Stats Calculation (Updated Categories)
    const stats = useMemo(() => {
        const total = projectsVisible.length;
        const draft = projectsVisible.filter(p => p.status === 'DRAFT').length;
        // 승인대기: 공개(PUBLIC) + REQUESTED 만 집계 (비공개/컨설팅 제외)
        const requested = projectsVisible.filter(p => isPublicRequested(p)).length;
        const matching = projectsVisible.filter(p => p.status === 'MATCHING').length;
        const production = projectsVisible.filter(p => ['CONTRACT', 'PRODUCTION', 'SETTLEMENT'].includes(p.status)).length;
        const complete = projectsVisible.filter(p => ['COMPLETE', 'AFTER_SERVICE'].includes(p.status)).length;
        const stopped = projectsVisible.filter(p => ['STOPPED', 'REJECTED', 'CANCELLED'].includes(p.status)).length;

        // 진행 프로젝트 개수:
        // - 진행 상태만 포함 (임시/승인대기/완료/중단 제외)
        const inProgressStatuses = ['MATCHING', 'APPROVED', 'CONTRACT', 'PRODUCTION', 'SETTLEMENT'];
        const inProgress = projectsVisible.filter(p => inProgressStatuses.includes(p.status)).length;

        return {
            total,
            inProgress,
            draft,
            requested,
            matching,
            production,
            complete,
            stopped,
        };
    }, [projectsVisible]);

    // Filtering Logic
    const filteredProjects = useMemo(() => {
        return projectsVisible.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'ALL' || project.type === filterType;
            
            // Status Filtering
            let matchesStatus = true;
            if (filterStatus !== 'ALL') {
                if (filterStatus === 'PRODUCTION') {
                    matchesStatus = ['CONTRACT', 'PRODUCTION', 'SETTLEMENT'].includes(project.status);
                } else if (filterStatus === 'COMPLETE') {
                    matchesStatus = ['COMPLETE', 'AFTER_SERVICE'].includes(project.status);
                } else if (filterStatus === 'STOPPED') {
                    matchesStatus = ['STOPPED', 'REJECTED', 'CANCELLED'].includes(project.status);
                } else if (filterStatus === 'REQUESTED') {
                    // 승인대기 필터: 공개(PUBLIC) + REQUESTED 만 포함
                    matchesStatus = isPublicRequested(project);
                } else {
                    matchesStatus = project.status === filterStatus;
                }
            }
            
            // Sub-tab filtering logic (Priority over filterStatus if activeTab is used for navigation)
            let matchesTab = true;
            // 미승인 프로젝트 탭: 공개(PUBLIC) + 승인대기만
            if (activeTab === 'projects-unapproved') matchesTab = isPublicRequested(project);
            else if (activeTab === 'projects-matching') matchesTab = project.status === 'MATCHING' || project.status === 'REQUESTED';
            else if (activeTab === 'projects-contract') matchesTab = project.status === 'CONTRACT';
            else if (activeTab === 'projects-production') matchesTab = project.status === 'PRODUCTION';
            else if (activeTab === 'projects-review') matchesTab = project.status === 'COMPLETE' || project.status === 'AFTER_SERVICE';

            // 전체 프로젝트(탭: projects, 상태 필터 ALL)에서는
            // 1) 공개(PUBLIC) + 승인대기(REQUESTED) 중 "첫등록" 숨김
            // 2) 임시저장(DRAFT)도 숨김 (아직 승인 전 상태라 별도 뷰에서만 관리)
            const isProjectsAllView = activeTab === 'projects' && filterStatus === 'ALL';
            const hideRequestedInAllTab =
                isProjectsAllView &&
                isPublicRequested(project) &&
                !isRevisionRequest(project);
            const hideDraftInAllTab =
                isProjectsAllView &&
                project.status === 'DRAFT';

            // 미승인 프로젝트 탭 내부 뷰 (전체 / 첫등록 / 수정요청)
            let matchesUnapprovedView = true;
            if (activeTab === 'projects-unapproved') {
                if (unapprovedView === 'NEW') {
                    matchesUnapprovedView = isPublicRequested(project) && !isRevisionRequest(project);
                } else if (unapprovedView === 'REVISION') {
                    matchesUnapprovedView = isRevisionRequest(project);
                }
            }

            return (
                matchesSearch &&
                matchesType &&
                matchesStatus &&
                matchesTab &&
                (!hideRequestedInAllTab || project.status !== 'REQUESTED') &&
                !hideDraftInAllTab &&
                matchesUnapprovedView
            );
        });
    }, [searchTerm, filterType, filterStatus, activeTab, projectsVisible, unapprovedView]);

    // 리뷰/평가 관리: 전역 필터와 연동 (완료·AS만, 필터 결과 없으면 기본 목록)
    const projectsForList = useMemo(() => {
        if (activeTab !== 'projects-review') return filteredProjects;
        const fromFilter = projectFilterReview?.filteredProjects?.filter(p => ['COMPLETE', 'AFTER_SERVICE'].includes(p.status)) ?? [];
        if (fromFilter.length === 0) return filteredProjects;
        const ids = new Set(fromFilter.map(p => p.id));
        return filteredProjects.filter(p => ids.has(p.id));
    }, [activeTab, filteredProjects, projectFilterReview?.filteredProjects]);

    // 정렬: 등록순(최신등록 먼저) | 마감임박순(D-Day 가까운 순)
    const sortedProjects = useMemo(() => {
        const list = [...projectsForList];
        if (sortBy === 'REG_DATE') {
            list.sort((a, b) => {
                const dateA = a.submittedDate ? new Date(a.submittedDate.replace(/\./g, '-')).getTime() : 0;
                const dateB = b.submittedDate ? new Date(b.submittedDate.replace(/\./g, '-')).getTime() : 0;
                return dateB - dateA; // 최신 등록 먼저
            });
        } else {
            const dDayToSortKey = (dDay: string): number => {
                if (!dDay || dDay === '-' || dDay === '승인대기' || dDay === '작성중' || dDay === '상시' || dDay === '중단') return 9999;
                if (dDay === '마감') return -1;
                if (dDay === 'D-Today') return 0;
                const match = dDay.match(/^D-(\d+)$/);
                return match ? parseInt(match[1], 10) : 9999;
            };
            list.sort((a, b) => dDayToSortKey(a.dDay) - dDayToSortKey(b.dDay)); // 마감 임박 순 (작을수록 먼저)
        }
        return list;
    }, [projectsForList, sortBy]);

    // 액션: 삭제 (목록에서 제외)
    const handleDelete = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        setOpenActionMenuId(null);
        setMenuPosition(null);
        if (confirm('이 프로젝트를 삭제하시겠습니까?')) {
            setDeletedIds(prev => new Set(prev).add(projectId));
        }
    };
    // 액션: 비공개(감추기)
    const handleSetPrivate = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        setOpenActionMenuId(null);
        setMenuPosition(null);
        if (confirm('이 프로젝트를 비공개(감추기) 처리하시겠습니까?')) {
            handleStatusToggle(projectId, 'STOP');
        }
    };
    // 액션: 보이기(공개)
    const handleSetVisible = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        setOpenActionMenuId(null);
        setMenuPosition(null);
        if (confirm('이 프로젝트를 보이기(공개) 처리하시겠습니까?')) {
            handleStatusToggle(projectId, 'APPROVE');
        }
    };

    // Pagination Logic (정렬된 목록 기준)
    const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE);
    const paginatedProjects = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedProjects.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedProjects, currentPage]);

    // Reset page when filters or sort change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType, filterStatus, activeTab, sortBy]);


    // Selection Logic Helpers
    const isAllSelected = paginatedProjects.length > 0 && paginatedProjects.every(p => selectedIds.has(p.id));

    const handleSelectAll = () => {
        if (isAllSelected) {
            // Deselect all currently visible
            const newSelected = new Set(selectedIds);
            paginatedProjects.forEach(p => newSelected.delete(p.id));
            setSelectedIds(newSelected);
        } else {
            // Select all currently visible
            const newSelected = new Set(selectedIds);
            paginatedProjects.forEach(p => newSelected.add(p.id));
            setSelectedIds(newSelected);
        }
    };

    const handleSelectRow = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkHide = () => {
        if (selectedIds.size === 0) {
            alert('감추기 처리를 할 프로젝트를 먼저 선택해주세요.');
            return;
        }
        
        if (confirm(`선택한 ${selectedIds.size}개의 프로젝트를 감추기(비공개) 처리하시겠습니까?`)) {
            setProjectStatusMap(prev => {
                const next = { ...prev };
                selectedIds.forEach(id => {
                    const project = projectsWithStatus.find(p => p.id === id);
                    // Only active projects can be stopped/hidden
                    if (project && ['MATCHING', 'APPROVED', 'PRODUCTION', 'CONTRACT', 'SETTLEMENT'].includes(project.status)) {
                        next[id] = 'STOPPED';
                    }
                });
                return next;
            });
            setSelectedIds(new Set());
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) {
            alert('삭제할 프로젝트를 먼저 선택해주세요.');
            return;
        }
        if (confirm(`선택한 ${selectedIds.size}개의 프로젝트를 삭제하시겠습니까?`)) {
            setDeletedIds(prev => { const next = new Set(prev); selectedIds.forEach(id => next.add(id)); return next; });
            setSelectedIds(new Set());
        }
    };

    const handleBulkShow = () => {
        if (selectedIds.size === 0) {
            alert('보이기 처리할 프로젝트를 먼저 선택해주세요.');
            return;
        }
        if (confirm(`선택한 ${selectedIds.size}개의 프로젝트를 보이기(공개) 처리하시겠습니까?`)) {
            setProjectStatusMap(prev => {
                const next = { ...prev };
                selectedIds.forEach(id => {
                    const project = projectsWithStatus.find(p => p.id === id);
                    if (project && ['STOPPED', 'REJECTED', 'CANCELLED', 'REQUESTED'].includes(project.status)) {
                        next[id] = 'MATCHING';
                    }
                });
                return next;
            });
            setSelectedIds(new Set());
        }
    };

    const handleBulkMessage = () => {
        if (selectedIds.size === 0) {
            alert('메시지를 발송할 프로젝트를 먼저 선택해주세요.');
            return;
        }
        alert(`선택한 ${selectedIds.size}개 프로젝트에 메시지 발송 기능은 준비 중입니다.`);
    };

    // --- Helper Component for Budget Display ---
    const BudgetDisplay = ({ budget }: { budget: string }) => {
        if (!budget) return <span className="text-xs text-slate-400 font-bold opacity-50">-</span>;
        
        // Handle "Value / Value" format
        if (budget.includes('/')) {
            const [total, prod] = budget.split('/').map(s => s.trim());
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900">{total}</span>
                    <span className="text-[11px] font-bold text-slate-500">{prod}</span>
                </div>
            );
        }
        
        // Fallback for simple string
        return <div className="text-xs font-bold text-slate-900">{budget}</div>;
    };

    return (
        <>
          {activeTab === 'projects-review' && (
            <ProjectPageHeader title="리뷰/평가 관리" />
          )}
          {activeTab !== 'projects-review' && (
          <section className="w-full flex flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200 animate-in">
              <div className="shrink-0 flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-900 whitespace-nowrap flex items-baseline gap-1">
                      {activeTab === 'projects-unapproved'
                        ? '미승인 프로젝트'
                        : activeTab === 'projects'
                          ? (
                              (() => {
                                  const statusTitleMap: Record<string, string> = {
                                      ALL: '진행 프로젝트',
                                      DRAFT: '임시 저장 프로젝트',
                                      REQUESTED: '승인대기 프로젝트',
                                      MATCHING: '매칭 프로젝트',
                                      PRODUCTION: '제작 프로젝트',
                                      COMPLETE: '완료된 프로젝트',
                                      STOPPED: '중단/취소 프로젝트',
                                  };
                                  return statusTitleMap[filterStatus] || '프로젝트 목록';
                              })()
                            )
                          : activeTab === 'projects-matching'
                            ? '매칭/제안 관리'
                            : activeTab === 'projects-contract'
                              ? '계약 관리'
                              : activeTab === 'projects-production'
                                ? '제작/산출물 관리'
                                : '리뷰/평가 관리'}
                      {(activeTab === 'projects' || activeTab === 'projects-unapproved') && (
                          <span className="text-sm font-semibold text-slate-400">
                              ({sortedProjects.length})
                          </span>
                      )}
                  </h2>
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                          type="text" 
                          placeholder="검색" 
                          className="pl-8 pr-4 h-9 w-48 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#2b4ea7] transition-all"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </div>

              {activeTab !== 'projects-unapproved' && (
                  <div className="flex gap-2">
                      {(activeTab === 'projects'
                        ? [
                            { id: 'ALL', label: '전체', value: stats.inProgress },
                            { id: 'MATCHING', label: '매칭', value: stats.matching },
                            { id: 'PRODUCTION', label: '제작', value: stats.production },
                            { id: 'COMPLETE', label: '완료', value: stats.complete },
                            { id: 'STOPPED', label: '중단/취소', value: stats.stopped },
                            { id: 'REQUESTED', label: '승인대기', value: stats.requested },
                            { id: 'DRAFT', label: '임시', value: stats.draft },
                        ]
                        : [
                            { id: 'ALL', label: '전체', value: stats.total },
                            { id: 'DRAFT', label: '임시', value: stats.draft },
                            { id: 'REQUESTED', label: '승인대기', value: stats.requested },
                            { id: 'MATCHING', label: '매칭', value: stats.matching },
                            { id: 'PRODUCTION', label: '제작', value: stats.production },
                            { id: 'COMPLETE', label: '완료', value: stats.complete },
                            { id: 'STOPPED', label: '중단/취소', value: stats.stopped },
                        ]
                      ).map((stat, i) => {
                          const isActive = filterStatus === stat.id;
                          const isDimType =
                            activeTab === 'projects' &&
                            ['DRAFT', 'REQUESTED', 'COMPLETE', 'STOPPED'].includes(stat.id);

                          const base =
                            'min-w-0 flex items-center gap-2 px-3 py-1.5 border rounded-lg shadow-sm whitespace-nowrap cursor-pointer transition-all';

                          const bg = isDimType
                            ? (isActive
                                ? 'bg-slate-100 border-[#2b4ea7] ring-1 ring-[#2b4ea7]'
                                : 'bg-slate-100 border-slate-200 hover:bg-slate-100')
                            : (isActive
                                ? 'bg-white border-[#2b4ea7] ring-1 ring-[#2b4ea7]'
                                : 'bg-white border-slate-200 hover:bg-slate-50');

                          return (
                              <div
                                  key={i}
                                  onClick={() => setFilterStatus(stat.id)}
                                  className={`${base} ${bg}`}
                              >
                                  <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-400 leading-none mb-0.5">
                                          {stat.label}
                                      </span>
                                      <span
                                          className={`text-sm font-black leading-none ${
                                              isDimType && !isActive ? 'text-slate-500' : 'text-slate-900'
                                          }`}
                                      >
                                          {stat.value}건
                                      </span>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              )}
          </section>
          )}

          <section className="w-full shrink-0" aria-label="프로젝트 테이블">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full animate-in">
            {/* Toolbar - PC 고정 */}
            <div className="p-3 border-b border-slate-100 flex flex-row justify-between items-center gap-3 bg-slate-50/50">
                 <div className="flex gap-2 items-center">
                    {/* 정렬 */}
                    <span className="text-xs font-bold text-slate-500 shrink-0">정렬</span>
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                        {[
                            { id: 'REG_DATE', label: '등록순' },
                            { id: 'DEADLINE', label: '마감임박순' }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setSortBy(opt.id as 'REG_DATE' | 'DEADLINE')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                                    sortBy === opt.id
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <div className="h-5 w-px bg-slate-200 shrink-0" />
                    {activeTab === 'projects-unapproved' && (
                        <>
                            <span className="text-xs font-bold text-slate-500 shrink-0">구분</span>
                            <div className="flex bg-slate-200 p-1 rounded-lg">
                                {[
                                    { id: 'ALL', label: '전체' },
                                    { id: 'NEW', label: '첫 등록' },
                                    { id: 'REVISION', label: '수정 요청' }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setUnapprovedView(opt.id as 'ALL' | 'NEW' | 'REVISION')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                                            unapprovedView === opt.id
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            <div className="h-5 w-px bg-slate-200 shrink-0" />
                        </>
                    )}
                    {/* Project Type Tabs */}
                    {activeTab !== 'projects-unapproved' && (
                        <div className="flex bg-slate-200 p-1 rounded-lg">
                            {[
                                { id: 'ALL', label: '전체' },
                                { id: 'PUBLIC', label: '공개' },
                                { id: 'PRIVATE', label: '비공개' },
                                { id: 'CONSULTING', label: '컨설팅' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilterType(tab.id)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                                        filterType === tab.id
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}
                 </div>

                 <div className="flex gap-2 items-center justify-end">
                    <div className="flex items-center gap-2">
                        {selectedIds.size > 0 && (
                            <span className="text-xs font-bold text-slate-500 animate-in fade-in whitespace-nowrap">
                                <span className="text-[#2b4ea7] text-sm">{selectedIds.size}</span>개
                            </span>
                        )}
                        <ActionButton onClick={handleBulkDelete} variant="secondary" size="sm" className="flex items-center gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200">
                            <X size={12} /> 삭제
                        </ActionButton>
                        <ActionButton onClick={handleBulkHide} variant="secondary" size="sm" className="flex items-center gap-2">
                            <EyeOff size={12} /> 비공개
                        </ActionButton>
                        <ActionButton onClick={handleBulkShow} variant="secondary" size="sm" className="flex items-center gap-2">
                            <Eye size={12} /> 보이기
                        </ActionButton>
                        <ActionButton onClick={handleBulkMessage} variant="primary" size="sm" className="flex items-center gap-2">
                            <Send size={12} /> 메시지 발송
                        </ActionButton>
                    </div>
                    <div className="h-5 w-px bg-slate-200 mx-1"></div>
                    <ActionButton
                        variant="ghost"
                        size="sm"
                        className="h-9 flex items-center gap-2 shrink-0"
                        title="다운로드"
                    >
                        <Download size={14} />
                    </ActionButton>
                 </div>
            </div>

            {/* List View: 스크롤 없이 끝까지 렌더, 스크롤은 레이아웃(페이지) 하나만 */}
            {viewMode === 'LIST' && (
                <div className="overflow-hidden min-w-0">
                    <table className="w-full text-left border-collapse table-fixed">
                        <colgroup>{[
                            { width: '3%' },                      // 체크박스
                            { width: '2%' },                      // No
                            { width: '5%' },                      // Image
                            { width: '28%' },                     // 프로젝트 정보
                            { width: '7%' },                      // 클라이언트
                            { width: '7%' },                      // 총예산
                            { width: '17%' },                     // 상태
                            { width: '6%' },                      // 등록일
                            { width: '6%' },                      // 마감일
                            { width: '6%' },                      // 모집 현황
                            { width: '3%' },                      // 승인
                            { width: '2.5rem', minWidth: '2.5rem' }, // 액션
                        ].map((col, idx) => (
                            <col
                                // eslint-disable-next-line react/no-array-index-key
                                key={idx}
                                style={{
                                    width: col.width,
                                    ...(col.minWidth ? { minWidth: col.minWidth } : {}),
                                }}
                            />
                        ))}</colgroup>
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="py-2 px-3 font-bold w-10 min-w-10 shrink-0"> <input type="checkbox" className="rounded border-slate-300 cursor-pointer" checked={isAllSelected} onChange={handleSelectAll} /> </th>
                                <th className="py-2 px-2 font-bold text-center w-8 min-w-8 shrink-0 whitespace-nowrap">No</th>
                                <th className="py-2 px-3 font-bold w-14 min-w-14 shrink-0 whitespace-nowrap min-w-[3rem]">Image</th>
                                <th className="py-2 px-3 font-bold overflow-hidden min-w-0">프로젝트 정보</th>
                                <th className="py-2 px-3 font-bold overflow-hidden min-w-0 whitespace-nowrap min-w-[4rem]">클라이언트</th>
                                <th className="py-2 px-3 font-bold whitespace-nowrap overflow-hidden min-w-0 min-w-[5rem]">총예산(제작)</th>
                                <th className="py-2 px-3 font-bold whitespace-nowrap overflow-hidden min-w-0 min-w-[6rem]">상태 (상세진행)</th>
                                <th className="py-2 px-3 font-bold whitespace-nowrap overflow-hidden min-w-0 min-w-[4rem]">
                                    <span className="inline-flex items-center gap-1">
                                        등록일
                                        {sortBy === 'REG_DATE' && <ChevronDown size={14} className="text-[#2b4ea7] shrink-0" title="최신등록순" />}
                                    </span>
                                </th>
                                <th className="py-2 px-3 font-bold whitespace-nowrap overflow-hidden min-w-0 min-w-[4rem]">
                                    <span className="inline-flex items-center gap-1">
                                        마감일
                                        {sortBy === 'DEADLINE' && <ChevronUp size={14} className="text-[#2b4ea7] shrink-0" title="마감임박순" />}
                                    </span>
                                </th>
                                <th className="py-2 px-3 font-bold overflow-hidden min-w-0 whitespace-nowrap min-w-[4.5rem]">모집 현황</th>
                                <th className="py-2 px-2 font-bold text-center whitespace-nowrap">승인</th>
                                <th className="py-2 px-2 font-bold text-center w-10 min-w-10 shrink-0 whitespace-nowrap">액션</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedProjects.map((project, index) => {
                                const steps = getProjectSteps(project.type);
                                const activeStepIdx = getActiveStepIndex(project.status, steps);
                                const isSelected = selectedIds.has(project.id);
                                // Calculate row number based on pagination
                                const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                                const isUnapprovedTab = activeTab === 'projects-unapproved';
                                // 비공개/중단된 프로젝트 여부
                                const isStoppedLike = ['STOPPED', 'REJECTED', 'CANCELLED'].includes(project.status);
                                // 승인 스위치는 공개(PUBLIC) 중
                                // '승인대기' 상태 뷰, 매칭 탭에서만 노출
                                const showApprovalSwitch =
                                    project.type === 'PUBLIC' &&
                                    !isUnapprovedTab &&
                                    (filterStatus === 'REQUESTED' || activeTab === 'projects-matching');

                                const rowBase =
                                    'transition-colors group';
                                const rowBg = isSelected
                                    ? 'bg-blue-50/30'
                                    : isStoppedLike
                                        ? 'bg-slate-50'
                                        : 'hover:bg-slate-50/80';
                                const rowTone = isStoppedLike ? 'opacity-60' : '';

                                return (
                                    <tr 
                                        key={project.id} 
                                        className={`${rowBase} ${rowBg} ${rowTone}`}
                                    >
                                        <td className="py-2 px-3 align-top overflow-hidden min-w-0">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-slate-300 cursor-pointer shrink-0" 
                                                checked={isSelected}
                                                onChange={(e) => handleSelectRow(project.id, e)}
                                            />
                                        </td>
                                        <td className="py-2 px-2 text-center text-xs font-bold text-slate-400 align-top overflow-hidden min-w-0">
                                            {rowNumber}
                                        </td>
                                        <td className="py-2 px-3 align-top overflow-visible min-w-0">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 border border-slate-200 overflow-hidden relative shrink-0">
                                                <ImageIcon size={16} />
                                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-transparent"></div>
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 align-top overflow-hidden min-w-0">
                                            <div className="flex flex-col gap-1 min-w-0">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-[10px] font-bold text-slate-400 truncate shrink-0">{project.id}</span>
                                                    <ProjectTypeBadge type={project.type} />
                                                </div>
                                                <span 
                                                    onClick={() => setSelectedProject(project)}
                                                    className="font-bold text-slate-800 text-sm hover:text-[#2b4ea7] cursor-pointer transition-colors line-clamp-1 min-w-0 truncate block" 
                                                    title={project.title}
                                                >
                                                    {project.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 align-top overflow-hidden min-w-0">
                                            <div className="text-xs font-bold text-slate-700 truncate" title={project.clientName}>{project.clientName}</div>
                                        </td>
                                        <td className="py-2 px-3 align-top overflow-hidden min-w-0">
                                            <BudgetDisplay budget={project.budget} />
                                        </td>
                                        <td className="py-2 px-2 align-top overflow-hidden min-w-0">
                                            <div className="w-full min-w-0 flex flex-col gap-1">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-fit shrink-0 ${STATUS_DISPLAY[project.status]?.className || 'bg-slate-100 text-slate-500'}`}>
                                                    {STATUS_DISPLAY[project.status]?.label ?? project.status}
                                                </span>
                                                <ProcessStepper currentStepIndex={activeStepIdx} steps={steps} mode="COMPACT" />
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 align-top overflow-hidden min-w-0">
                                            <span className="text-xs font-medium text-slate-600 whitespace-nowrap" title={project.submittedDate}>{project.submittedDate || '-'}</span>
                                        </td>
                                        <td className="py-2 px-3 align-top overflow-hidden min-w-0">
                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded w-fit ${
                                                    project.dDay === 'D-Today' ? 'bg-rose-100 text-rose-600' : 
                                                    project.dDay === '마감' ? 'bg-slate-100 text-slate-500' :
                                                    project.status === 'DRAFT' ? 'bg-slate-50 text-slate-400' :
                                                    (project.dDay && project.dDay !== '-') ? 'bg-blue-50 text-blue-600' : 'text-slate-400'
                                                }`}>
                                                    {!project.dDay || project.dDay === '-' ? '' : project.dDay}
                                                </span>
                                                <span className="text-xs font-medium text-slate-600 whitespace-nowrap">{project.deadline === '-' ? '-' : project.deadline}</span>
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 align-top overflow-hidden min-w-0">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                                <User size={12} className="text-slate-400 shrink-0"/>
                                                <span className="truncate">{project.applicantCount}명</span>
                                            </div>
                                        </td>
                                        <td className="py-2 px-2 text-center align-top overflow-visible min-w-[4.5rem]">
                                            {isUnapprovedTab && project.type === 'PUBLIC' && project.status === 'REQUESTED' ? (
                                                <ActionButton
                                                    type="button"
                                                    variant="primary"
                                                    size="xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('이 공개 의뢰를 승인하여 공개 프로젝트로 전환할까요?\n\n승인 후에는 미승인 목록에서 빠지고 전체 프로젝트에 포함됩니다.')) {
                                                            handleStatusToggle(project.id, 'APPROVE');
                                                        }
                                                    }}
                                                >
                                                    승인처리
                                                </ActionButton>
                                            ) : showApprovalSwitch ? (
                                                <ProjectActionButtons project={project} onStatusToggle={handleStatusToggle} />
                                            ) : (
                                                <div className="flex justify-center">
                                                    <span className="text-[10px] text-slate-400 font-bold opacity-50">-</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-2 px-2 text-center align-top overflow-visible w-10 min-w-10 shrink-0">
                                            <div className="flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                        if (openActionMenuId === project.id) {
                                                            setOpenActionMenuId(null);
                                                            setMenuPosition(null);
                                                        } else {
                                                            setOpenActionMenuId(project.id);
                                                            setMenuPosition({ top: rect.bottom + 4, left: rect.right - 140 });
                                                        }
                                                    }}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                                                    title="액션 메뉴"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                            {openActionMenuId === project.id && menuPosition && createPortal(
                                                <>
                                                    <div className="fixed inset-0 z-[100]" onClick={() => { setOpenActionMenuId(null); setMenuPosition(null); }} aria-hidden />
                                                    <div 
                                                        className="fixed z-[101] min-w-[160px] py-1 bg-white rounded-lg border border-slate-200 shadow-xl"
                                                        style={{ top: menuPosition.top, left: menuPosition.left }}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                alert(`프로젝트 ${project.id}에 메시지 발송 기능은 준비 중입니다.`);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-[#2b4ea7]"
                                                        >
                                                            <Send size={14} /> 메시지 발송
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleSetPrivate(e, project.id)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-800"
                                                        >
                                                            <EyeOffIcon size={14} /> 비공개
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleSetVisible(e, project.id)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-800"
                                                        >
                                                            <Eye size={14} /> 보이기
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleDelete(e, project.id)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                                                        >
                                                            <X size={14} /> 삭제
                                                        </button>
                                                    </div>
                                                </>,
                                                document.body
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Card View */}
            {viewMode === 'CARD' && (
                <div className="p-6 bg-slate-50">
                    {/* Bulk Selection Header for Card View */}
                    <div className="mb-4 flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="card-select-all"
                            className="rounded border-slate-300 cursor-pointer"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                        />
                        <label htmlFor="card-select-all" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                            전체 선택 ({paginatedProjects.length})
                        </label>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {paginatedProjects.map(project => {
                            const steps = getProjectSteps(project.type);
                            const activeStepIdx = getActiveStepIndex(project.status, steps);
                            const isSelected = selectedIds.has(project.id);
                            const isStoppedLike = ['STOPPED', 'REJECTED', 'CANCELLED'].includes(project.status);
                            
                            return (
                                <div 
                                    key={project.id} 
                                    className={`bg-white rounded-xl border shadow-sm transition-all group flex flex-col h-full overflow-hidden relative ${
                                        isSelected 
                                        ? 'border-[#2b4ea7] ring-1 ring-[#2b4ea7] shadow-md' 
                                        : isStoppedLike
                                            ? 'border-slate-200 opacity-60'
                                            : 'border-slate-200 hover:shadow-lg'
                                    }`}
                                >
                                    {/* Card Checkbox Overlay */}
                                    <div className="absolute top-3 left-3 z-20">
                                        <div 
                                            onClick={(e) => handleSelectRow(project.id, e)}
                                            className={`w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer transition-colors shadow-sm ${
                                                isSelected 
                                                ? 'bg-[#2b4ea7] border-[#2b4ea7]' 
                                                : 'bg-white border-slate-300 hover:border-[#2b4ea7]'
                                            }`}
                                        >
                                            {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                                        </div>
                                    </div>

                                    <div className="p-4 flex gap-4 pl-12">
                                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 border border-slate-200 shrink-0">
                                            <ImageIcon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <ProjectTypeBadge type={project.type} />
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    project.dDay === '마감' ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                    {project.dDay}
                                                </span>
                                            </div>
                                            <h3 
                                                onClick={() => setSelectedProject(project)}
                                                className="font-bold text-slate-900 text-sm mb-1 line-clamp-2 leading-snug group-hover:text-[#2b4ea7] transition-colors cursor-pointer"
                                            >
                                                {project.title}
                                            </h3>
                                            <div className="text-xs text-slate-500 truncate">
                                                {project.clientName} | {project.clientIndustry}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-4 pb-4">
                                        <ProcessStepper currentStepIndex={activeStepIdx} steps={steps} mode="DETAILED" />
                                    </div>

                                    <div className="mt-auto p-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">총예산(제작)</span>
                                            <BudgetDisplay budget={project.budget} />
                                        </div>
                                        <div className="flex gap-2">
                                            <ActionButton 
                                                onClick={() => setSelectedProject(project)}
                                                variant="secondary"
                                                size="xs"
                                            >
                                                상세보기
                                            </ActionButton>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Pagination Footer */}
            <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
                <span className="text-xs text-slate-500 font-medium">
                    {activeTab === 'projects'
                        ? `활성화 ${sortedProjects.length}건`
                        : `총 ${sortedProjects.length}개 항목`}
                </span>
                <div className="flex gap-1">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={14}/>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button 
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${
                                currentPage === page 
                                ? 'bg-[#2b4ea7] text-white' 
                                : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={14}/>
                    </button>
                </div>
            </div>

          </div>
          </section>

          <ProjectDetailDrawer 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)}
            onStatusToggle={handleStatusToggle}
          />
        </>
      );
};

export default ProjectManagement;