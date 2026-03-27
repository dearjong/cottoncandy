import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, Filter, ChevronDown, Download, Bell, AlertTriangle, 
    Copy, Building2, FileText, Image as ImageIcon, Video, 
    CheckCircle2, XCircle, Clock, Eye, MoreHorizontal,
    Send, Settings, FileCheck, ArrowRight, PlayCircle, History,
    ThumbsUp, ThumbsDown, MessageSquare, FileSpreadsheet, ShieldAlert, Lock, Unlock
} from 'lucide-react';
import { StatusBadge } from '@/components/Badges';
import { ProjectPageHeader } from '@/components/project/ProjectPageHeader';
import { useProjectFilterContext } from '@/contexts/ProjectFilterContext';
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
    issues: string[]; 
    disputeStatus: 'NONE' | 'ACTIVE'; // Added for Security Logic
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
        issues: [],
        disputeStatus: 'NONE' // Locked by default
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
        issues: [],
        disputeStatus: 'NONE'
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
        issues: [],
        disputeStatus: 'ACTIVE' // Unlocked because of dispute
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
        issues: ['LATE'],
        disputeStatus: 'NONE'
    },
];

const ProposalManagement2 = () => {
    const projectFilter = useProjectFilterContext();
    const { selectedProjectId, setSelectedProjectId, selectedProject } = projectFilter;

    const [selectedSubmission, setSelectedSubmission] = useState<CompanySubmission | null>(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    // Security States
    const [showOverrideForm, setShowOverrideForm] = useState(false);
    const [overrideReason, setOverrideReason] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);

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
    const handleSelectSubmission = (item: CompanySubmission) => {
        setSelectedSubmission(item);
        // Reset Security State
        setShowOverrideForm(false);
        setOverrideReason('');
        setErrorMsg('');
        setIsUnlocked(false);
    };

    const handleUnlock = () => {
        if (!overrideReason.trim()) {
            setErrorMsg('열람 사유를 입력해주세요.');
            return;
        }
        if (overrideReason.length < 5) {
            setErrorMsg('사유는 최소 5자 이상 입력해야 합니다.');
            return;
        }
        // Log logic would go here
        setIsUnlocked(true);
        setShowOverrideForm(false);
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

        const isContentVisible = selectedSubmission.disputeStatus === 'ACTIVE' || isUnlocked;

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
                                {selectedSubmission.disputeStatus === 'ACTIVE' && (
                                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <AlertTriangle size={10}/> 분쟁중
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                {selectedSubmission.companyName}
                            </h2>
                            <div className="text-sm text-slate-500 mt-1">
                                담당자: {selectedSubmission.repName} <span className="text-slate-300">|</span> 제출일: {selectedSubmission.submittedAt}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setSelectedSubmission(null)} className="p-2 text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-8">
                        
                        {isContentVisible ? (
                            <>
                                {/* Security Banner if Unlocked */}
                                {isUnlocked && selectedSubmission.disputeStatus !== 'ACTIVE' && (
                                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-bold">
                                        <Unlock size={14} />
                                        관리자 권한으로 보안 문서가 해제되었습니다. (로그 기록됨)
                                    </div>
                                )}

                                {/* 1. Review Actions Panel */}
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
                                            placeholder="검수 코멘트를 입력하세요..." 
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
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20}/></div>
                                                    <span className="text-[10px] font-bold text-slate-400">PDF</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-800 truncate mb-1">{selectedSubmission.strategyDoc.name}</p>
                                                <p className="text-xs text-slate-400">{selectedSubmission.strategyDoc.size}</p>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 h-32">
                                                <span className="text-xs">전략 제안서 미제출</span>
                                            </div>
                                        )}
                                        {selectedSubmission.creativeDoc ? (
                                            <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-[#2b4ea7] transition-colors group cursor-pointer relative overflow-hidden">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ImageIcon size={20}/></div>
                                                    <span className="text-[10px] font-bold text-slate-400">PDF</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-800 truncate mb-1">{selectedSubmission.creativeDoc.name}</p>
                                                <p className="text-xs text-slate-400">{selectedSubmission.creativeDoc.size}</p>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 h-32">
                                                <span className="text-xs">크리에이티브 미제출</span>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                                {/* Scenario B: NO DISPUTE (Access Denied / Override) */}
                                {selectedSubmission.disputeStatus !== 'ACTIVE' && !showOverrideForm && (
                                    <>
                                        <h3 className="text-lg font-black text-rose-600 mb-3 flex items-center justify-center gap-2">
                                            <ShieldAlert size={22}/> 열람 불가 문서 (보안 등급)
                                        </h3>
                                        <div className="text-xs text-rose-600 mb-6 leading-relaxed bg-rose-50 p-4 rounded-xl border border-rose-100 text-left shadow-sm">
                                            <div className="flex items-start gap-2 mb-2 font-bold">
                                                <AlertTriangle size={14} className="shrink-0 mt-0.5"/>
                                                <p>본 자료는 보안 등급이 적용된 <strong>비공개 정보</strong>입니다. 접근 권한 규정에 따라 운영자 열람이 제한됩니다.</p>
                                            </div>
                                            <p className="pl-6 text-rose-500/80 font-medium">열람이 꼭 필요한 경우, 분쟁을 먼저 등록하거나 최고 관리자 권한으로 긴급 해제해야 합니다.</p>
                                        </div>
                                        
                                        <button 
                                            onClick={() => { setShowOverrideForm(true); setErrorMsg(''); }}
                                            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm"
                                        >
                                            <AlertTriangle size={16} /> 긴급 직권 열람 (Emergency Override)
                                        </button>
                                        {/* Security Notice */}
                                        <div className="mt-3 text-[10px] text-slate-400 font-medium space-y-0.5">
                                            <p>※ 최고 관리자만 가능</p>
                                            <p>※ 사유 입력 및 로그 자동 기록</p>
                                        </div>
                                    </>
                                )}

                                {/* Scenario C: Override Form */}
                                {showOverrideForm && (
                                    <div className="w-full bg-white p-6 rounded-xl border border-rose-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                                        <h4 className="text-sm font-bold text-slate-900 mb-4 text-left flex items-center gap-2">
                                            <Lock size={16} className="text-rose-500"/> 보안 해제 사유 입력
                                        </h4>
                                        <div className="space-y-3 mb-4">
                                            <div className="text-left">
                                                <label className="text-[11px] font-bold text-slate-500 block mb-1">열람 사유 (상세히 작성)</label>
                                                <textarea 
                                                    className="w-full h-24 p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-rose-500 bg-slate-50 resize-none"
                                                    placeholder="예: 클라이언트 요청에 의한 긴급 파일 확인 (유선 협의 완료)"
                                                    value={overrideReason}
                                                    onChange={(e) => setOverrideReason(e.target.value)}
                                                ></textarea>
                                            </div>
                                            {errorMsg && <p className="text-[11px] text-rose-500 font-bold text-left">{errorMsg}</p>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setShowOverrideForm(false)}
                                                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                                            >
                                                취소
                                            </button>
                                            <button 
                                                onClick={handleUnlock}
                                                className="flex-1 py-2.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm"
                                            >
                                                해제 및 열람
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] -m-6">
            <div className="px-6 pt-5">
                <ProjectPageHeader title="제안서/시안 관리" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <SummaryCard label="전체 참여사" value={stats.total} color="text-slate-700" active />
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
                    </div>
                </div>

                {/* Submission Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="p-4 font-bold w-10"><input type="checkbox" className="rounded border-slate-300"/></th>
                                <th className="p-4 font-bold">참여사 (제출자)</th>
                                <th className="p-4 font-bold text-center">버전</th>
                                <th className="p-4 font-bold text-center">제안서</th>
                                <th className="p-4 font-bold text-center">보안상태</th>
                                <th className="p-4 font-bold">제출 일시</th>
                                <th className="p-4 font-bold">상태</th>
                                <th className="p-4 font-bold text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSubmissions.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => handleSelectSubmission(item)}>
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
                                        {item.disputeStatus === 'ACTIVE' ? (
                                            <span className="text-[10px] text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-100 flex items-center justify-center gap-1">
                                                <AlertTriangle size={10}/> 해제됨
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center justify-center gap-1">
                                                <Lock size={10}/> 잠금
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs font-medium text-slate-600">{item.submittedAt.split(' ')[0]}</div>
                                        <div className="text-[10px] text-slate-400">{item.submittedAt.split(' ')[1] || '-'}</div>
                                    </td>
                                    <td className="p-4">
                                        <SubmissionStatusBadge status={item.status} />
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-slate-400 hover:text-[#2b4ea7] p-2 hover:bg-slate-100 rounded-full transition-colors">
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

            {/* Detail Drawer */}
            <DetailDrawer />
        </div>
    );
};

export default ProposalManagement2;