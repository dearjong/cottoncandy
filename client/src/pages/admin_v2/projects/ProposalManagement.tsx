import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, Filter, ChevronDown, Download, Bell, AlertTriangle, 
    Copy, Building2, FileText, Image as ImageIcon, Video, 
    CheckCircle2, XCircle, Clock, Eye, MoreHorizontal,
    Send, Settings, FileCheck, ArrowRight, PlayCircle, History,
    ThumbsUp, ThumbsDown, MessageSquare, FileSpreadsheet
} from 'lucide-react';
import { StatusBadge } from '@/components/Badges';
import { MOCK_PROJECTS } from '@/data/mockData';

// --- Types ---
type SubmissionStatus = 'NOT_SUBMITTED' | 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'CONFIRMED';

interface SubmissionFile {
    id: string;
    type: 'STRATEGY' | 'CREATIVE' | 'VIDEO' | 'IMAGE' | 'ETC';
    name: string;
    size: string;
    date: string;
    status: 'NORMAL' | 'ISSUE';
}

interface CompanySubmission {
    id: string; // APP-ID
    companyName: string;
    companyId: string;
    repName: string;
    version: string;
    strategyDoc: SubmissionFile | null;
    creativeDoc: SubmissionFile | null;
    videoCount: number;
    imageCount: number;
    submittedAt: string;
    status: SubmissionStatus;
    isConfirmed: boolean;
    issues: string[]; // e.g., 'FILE_ERROR', 'LATE'
}

// --- Mock Data ---
const MOCK_SUBMISSIONS: CompanySubmission[] = [
    {
        id: 'APP-001',
        companyName: '스튜디오 블랙',
        companyId: 'CP-2410-045',
        repName: '박감독',
        version: 'v2.0',
        strategyDoc: { id: 'F1', type: 'STRATEGY', name: '제안전략서_v2.pdf', size: '12MB', date: '2024.11.14', status: 'NORMAL' },
        creativeDoc: { id: 'F2', type: 'CREATIVE', name: '크리에이티브_보드_v2.pdf', size: '45MB', date: '2024.11.14', status: 'NORMAL' },
        videoCount: 2,
        imageCount: 5,
        submittedAt: '2024.11.14 15:30',
        status: 'REVIEWING',
        isConfirmed: false,
        issues: []
    },
    {
        id: 'APP-002',
        companyName: '크리에이티브 랩',
        companyId: 'CP-2411-012',
        repName: '한창의',
        version: 'v1.0',
        strategyDoc: { id: 'F3', type: 'STRATEGY', name: '전략기획안.pdf', size: '8MB', date: '2024.11.13', status: 'NORMAL' },
        creativeDoc: null,
        videoCount: 1,
        imageCount: 0,
        submittedAt: '2024.11.13 10:00',
        status: 'APPROVED',
        isConfirmed: true,
        issues: []
    },
    {
        id: 'APP-003',
        companyName: '제일기획',
        companyId: 'CP-2407-003',
        repName: '김제일',
        version: 'v3.1',
        strategyDoc: { id: 'F4', type: 'STRATEGY', name: 'Final_Strategy.pdf', size: '15MB', date: '2024.11.15', status: 'NORMAL' },
        creativeDoc: { id: 'F5', type: 'CREATIVE', name: 'Concept_Art.pdf', size: '120MB', date: '2024.11.15', status: 'NORMAL' },
        videoCount: 4,
        imageCount: 12,
        submittedAt: '2024.11.15 09:20',
        status: 'CONFIRMED',
        isConfirmed: true,
        issues: []
    },
    {
        id: 'APP-004',
        companyName: '영상공작소 픽셀',
        companyId: 'CP-2411-005',
        repName: '최에딧',
        version: '-',
        strategyDoc: null,
        creativeDoc: null,
        videoCount: 0,
        imageCount: 0,
        submittedAt: '-',
        status: 'NOT_SUBMITTED',
        isConfirmed: false,
        issues: ['LATE']
    },
];

const ProposalManagement = () => {
    // --- State ---
    // Available Projects (Filter for relevant statuses)
    const availableProjects = useMemo(() => {
        return MOCK_PROJECTS.filter(p => ['MATCHING', 'REQUESTED', 'CONTRACT', 'PRODUCTION'].includes(p.status));
    }, []);

    const [selectedProjectId, setSelectedProjectId] = useState<string>(availableProjects[0]?.id || '');
    const [selectedSubmission, setSelectedSubmission] = useState<CompanySubmission | null>(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const exists = availableProjects.find(p => p.id === selectedProjectId);
        if (!exists && availableProjects.length > 0) {
            setSelectedProjectId(availableProjects[0].id);
        }
    }, [availableProjects, selectedProjectId]);

    const selectedProject = availableProjects.find(p => p.id === selectedProjectId);

    // Filter Logic
    const filteredSubmissions = useMemo(() => {
        return MOCK_SUBMISSIONS.filter(item => {
            const matchesSearch = item.companyName.includes(searchTerm) || item.repName.includes(searchTerm);
            const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter]);

    // Stats
    const stats = useMemo(() => ({
        total: MOCK_SUBMISSIONS.length,
        submitted: MOCK_SUBMISSIONS.filter(s => s.status !== 'NOT_SUBMITTED').length,
        notSubmitted: MOCK_SUBMISSIONS.filter(s => s.status === 'NOT_SUBMITTED').length,
        needsReview: MOCK_SUBMISSIONS.filter(s => s.status === 'SUBMITTED' || s.status === 'REVIEWING').length,
        confirmed: MOCK_SUBMISSIONS.filter(s => s.isConfirmed).length,
    }), []);

    // Handlers
    const copyToClipboard = (text: string) => {
        alert(`복사되었습니다: ${text}`);
    };

    // --- Components ---

    const SubmissionStatusBadge = ({ status }: { status: SubmissionStatus }) => {
        const styles = {
            NOT_SUBMITTED: 'bg-slate-100 text-slate-400 border-slate-200',
            SUBMITTED: 'bg-blue-50 text-blue-600 border-blue-200',
            REVIEWING: 'bg-indigo-50 text-indigo-600 border-indigo-200',
            APPROVED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
            REJECTED: 'bg-rose-50 text-rose-600 border-rose-200',
            CONFIRMED: 'bg-slate-800 text-white border-slate-800',
        };
        const labels = {
            NOT_SUBMITTED: '미제출',
            SUBMITTED: '제출완료',
            REVIEWING: '검수중',
            APPROVED: '승인',
            REJECTED: '반려',
            CONFIRMED: '최종확정',
        };
        return (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const SummaryCard = ({ label, value, color, active = false }: { label: string, value: number, color: string, active?: boolean }) => (
        <div className={`flex-1 p-4 rounded-xl border transition-all cursor-pointer ${
            active 
            ? 'bg-white border-[#2b4ea7] shadow-md ring-1 ring-[#2b4ea7]' 
            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }`}>
            <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
            <h4 className={`text-2xl font-black ${color}`}>{value}</h4>
        </div>
    );

    const DetailDrawer = () => {
        if (!selectedSubmission) return null;

        return (
            <>
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" 
                    onClick={() => setSelectedSubmission(null)}
                ></div>
                <div className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-2xl z-50 transform transition-transform animate-in slide-in-from-right flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    {selectedSubmission.version}
                                </span>
                                <SubmissionStatusBadge status={selectedSubmission.status} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                {selectedSubmission.companyName}
                            </h2>
                            <div className="text-sm text-slate-500 mt-1">
                                담당자: {selectedSubmission.repName} <span className="text-slate-300">|</span> 제출일: {selectedSubmission.submittedAt}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 text-xs font-bold flex items-center gap-2 transition-colors">
                                <Download size={14}/> 전체 다운로드
                            </button>
                            <button onClick={() => setSelectedSubmission(null)} className="p-2 text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-8">
                        
                        {/* 1. Review Actions Panel (Fixed Top or Inline) */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <FileCheck size={16} className="text-[#2b4ea7]"/> 검수 및 처리
                            </h3>
                            <div className="flex gap-3 mb-4">
                                <button className="flex-1 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-sm hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                                    <ThumbsUp size={16}/> 검수 승인
                                </button>
                                <button className="flex-1 py-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 font-bold text-sm hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
                                    <ThumbsDown size={16}/> 반려 (수정요청)
                                </button>
                            </div>
                            <div className="relative">
                                <textarea 
                                    placeholder="검수 코멘트 또는 반려 사유를 입력하세요 (참여사에게 전송됨)" 
                                    className="w-full h-20 p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#2b4ea7] resize-none"
                                ></textarea>
                                <button className="absolute bottom-2 right-2 p-1.5 bg-slate-100 text-slate-400 rounded-md hover:bg-[#2b4ea7] hover:text-white transition-colors">
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>

                        {/* 2. Proposals */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <FileText size={16} className="text-slate-400"/> 제안서 문서
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {selectedSubmission.strategyDoc ? (
                                    <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-[#2b4ea7] transition-colors group cursor-pointer relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <FileText size={20}/>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">PDF</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 truncate mb-1">{selectedSubmission.strategyDoc.name}</p>
                                        <p className="text-xs text-slate-400">{selectedSubmission.strategyDoc.size}</p>
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                                                <Eye size={12}/> 미리보기
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 h-32">
                                        <FileText size={24} className="opacity-20"/>
                                        <span className="text-xs">전략 제안서 미제출</span>
                                    </div>
                                )}

                                {selectedSubmission.creativeDoc ? (
                                    <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-[#2b4ea7] transition-colors group cursor-pointer relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                <ImageIcon size={20}/>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">PDF</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 truncate mb-1">{selectedSubmission.creativeDoc.name}</p>
                                        <p className="text-xs text-slate-400">{selectedSubmission.creativeDoc.size}</p>
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                                                <Eye size={12}/> 미리보기
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 h-32">
                                        <ImageIcon size={24} className="opacity-20"/>
                                        <span className="text-xs">크리에이티브 미제출</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 3. Concepts (Video/Image) */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Video size={16} className="text-slate-400"/> 시안 파일 (영상/이미지)
                            </h3>
                            {selectedSubmission.videoCount > 0 ? (
                                <div className="space-y-3">
                                    {[1, 2].map((v) => (
                                        <div key={v} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-200">
                                            <div className="w-24 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-white relative shrink-0 cursor-pointer hover:bg-slate-700">
                                                <PlayCircle size={24} />
                                                <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 px-1 rounded">00:30</span>
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-bold text-slate-800 truncate">Concept_Video_Option_{v}.mp4</h4>
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">v{v}.0</span>
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1">1920x1080 • 45MB</div>
                                            </div>
                                            <div className="flex flex-col gap-1 justify-center">
                                                <button className="p-1.5 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600"><Download size={14}/></button>
                                                <button className="p-1.5 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600"><MoreHorizontal size={14}/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-center text-xs text-slate-400">
                                    제출된 시안 파일이 없습니다.
                                </div>
                            )}
                        </section>

                        {/* 4. History Log */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <History size={16} className="text-slate-400"/> 변경 이력
                            </h3>
                            <div className="pl-4 border-l-2 border-slate-100 space-y-4">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-3 h-3 bg-slate-200 rounded-full border-2 border-white"></div>
                                    <p className="text-xs text-slate-600"><strong>박감독</strong>님이 파일 제출 (v2.0)</p>
                                    <p className="text-[10px] text-slate-400">2024.11.14 15:30</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-3 h-3 bg-[#2b4ea7] rounded-full border-2 border-white"></div>
                                    <p className="text-xs text-slate-600"><strong>운영자</strong>님이 검수 시작</p>
                                    <p className="text-[10px] text-slate-400">2024.11.14 16:00</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </>
        );
    };

    // --- Render Main ---
    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] -m-6">
            
            {/* 1. Header (Project Dropdown) */}
            <div className="bg-white border-b border-slate-200 px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-[#2b4ea7] bg-[#2b4ea7]/10 px-2 py-0.5 rounded whitespace-nowrap">
                            제안서/시안 관리
                        </span>
                        <span className="text-slate-300">|</span>
                        
                        <div className="relative flex-1 max-w-[600px]">
                            <select 
                                className="appearance-none w-full bg-slate-50 border border-slate-200 hover:border-[#2b4ea7] hover:bg-white text-lg font-black text-slate-900 pl-4 pr-10 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4ea7]/20 focus:border-[#2b4ea7] transition-all cursor-pointer truncate"
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                            >
                                {availableProjects.map(p => (
                                    <option key={p.id} value={p.id}>[{p.clientName}] {p.title}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        </div>
                    </div>
                    
                    {selectedProject ? (
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pl-1">
                             <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700" onClick={() => copyToClipboard(selectedProject.id)}>
                                 <span className="font-mono font-medium">{selectedProject.id}</span>
                                 <Copy size={12}/>
                             </div>
                             <span className="w-px h-3 bg-slate-300"></span>
                             <span className="font-bold text-slate-700 flex items-center gap-1">
                                 <Building2 size={12}/> {selectedProject.clientName}
                             </span>
                             <span className="w-px h-3 bg-slate-300"></span>
                             <StatusBadge status={selectedProject.status} />
                             <span className="text-slate-400 hidden sm:inline">
                                 (마감: {selectedProject.deadline})
                             </span>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 font-medium pl-1">진행 중인 프로젝트가 없습니다.</div>
                    )}
                </div>

                <div className="flex gap-2">
                     <button className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center gap-2">
                        <FileSpreadsheet size={14} /> 엑셀 다운로드
                    </button>
                    <button className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center gap-2">
                        <Bell size={14} /> 리마인드 발송
                    </button>
                    <button className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 flex items-center gap-2">
                        <Settings size={14} /> 제출 규칙 설정
                    </button>
                </div>
            </div>

            {/* 2. Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <SummaryCard label="참여 기업" value={stats.total} color="text-slate-700" active />
                    <SummaryCard label="제출 완료" value={stats.submitted} color="text-blue-600" />
                    <SummaryCard label="미제출" value={stats.notSubmitted} color="text-slate-400" />
                    <SummaryCard label="검수 필요" value={stats.needsReview} color="text-rose-600" />
                    <SummaryCard label="최종 확정" value={stats.confirmed} color="text-emerald-600" />
                </div>

                {/* Filter Toolbar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="기업명, 담당자 검색" 
                                className="pl-9 pr-4 h-10 w-full md:w-64 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7] transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select 
                            className="h-10 pl-3 pr-8 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 focus:outline-none focus:border-[#2b4ea7] bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">전체 상태</option>
                            <option value="SUBMITTED">제출완료</option>
                            <option value="NOT_SUBMITTED">미제출</option>
                            <option value="REVIEWING">검수중</option>
                            <option value="CONFIRMED">확정</option>
                        </select>
                        <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center gap-2">
                            <Filter size={14} /> 필터
                        </button>
                    </div>
                    <select className="h-10 pl-3 pr-8 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 focus:outline-none bg-white">
                        <option>최신 제출순</option>
                        <option>업체명순</option>
                        <option>상태순</option>
                    </select>
                </div>

                {/* Submission Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="p-4 font-bold w-10"><input type="checkbox" className="rounded border-slate-300"/></th>
                                <th className="p-4 font-bold">참여사 (제출자)</th>
                                <th className="p-4 font-bold text-center">버전</th>
                                <th className="p-4 font-bold text-center">전략 제안서</th>
                                <th className="p-4 font-bold text-center">크리에이티브</th>
                                <th className="p-4 font-bold text-center">영상/이미지 시안</th>
                                <th className="p-4 font-bold">제출 일시</th>
                                <th className="p-4 font-bold">상태</th>
                                <th className="p-4 font-bold text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSubmissions.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedSubmission(item)}>
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300"/></td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800 text-sm group-hover:text-[#2b4ea7] transition-colors">{item.companyName}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                            {item.companyId} <span className="w-px h-2 bg-slate-300"></span> {item.repName}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        {item.status !== 'NOT_SUBMITTED' ? (
                                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                                                {item.version}
                                            </span>
                                        ) : <span className="text-slate-300">-</span>}
                                    </td>
                                    <td className="p-4 text-center">
                                        {item.strategyDoc ? (
                                            <div className="flex justify-center" title={item.strategyDoc.name}>
                                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                                                    <FileText size={16} />
                                                </div>
                                            </div>
                                        ) : <span className="text-slate-300 text-xs">-</span>}
                                    </td>
                                    <td className="p-4 text-center">
                                        {item.creativeDoc ? (
                                            <div className="flex justify-center" title={item.creativeDoc.name}>
                                                <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded flex items-center justify-center">
                                                    <ImageIcon size={16} />
                                                </div>
                                            </div>
                                        ) : <span className="text-slate-300 text-xs">-</span>}
                                    </td>
                                    <td className="p-4 text-center">
                                        {item.videoCount > 0 || item.imageCount > 0 ? (
                                            <div className="flex justify-center gap-1">
                                                {item.videoCount > 0 && (
                                                    <span className="flex items-center gap-0.5 text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                                        <Video size={10}/> {item.videoCount}
                                                    </span>
                                                )}
                                                {item.imageCount > 0 && (
                                                    <span className="flex items-center gap-0.5 text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                                        <ImageIcon size={10}/> {item.imageCount}
                                                    </span>
                                                )}
                                            </div>
                                        ) : <span className="text-slate-300 text-xs">-</span>}
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs font-medium text-slate-600">{item.submittedAt.split(' ')[0]}</div>
                                        <div className="text-[10px] text-slate-400">{item.submittedAt.split(' ')[1] || '-'}</div>
                                    </td>
                                    <td className="p-4">
                                        <SubmissionStatusBadge status={item.status} />
                                        {item.issues.includes('LATE') && (
                                            <span className="ml-1 text-[9px] font-bold text-rose-500 bg-rose-50 px-1 rounded">지연</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-slate-400 hover:text-[#2b4ea7] p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); setSelectedSubmission(item); }}>
                                            <ArrowRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* 3. Detail Drawer */}
            <DetailDrawer />
        </div>
    );
};

export default ProposalManagement;