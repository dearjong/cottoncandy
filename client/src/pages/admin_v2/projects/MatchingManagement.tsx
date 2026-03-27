import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, Filter, Briefcase, ChevronRight, User, 
    Clock, DollarSign, FileText, CheckCircle2, XCircle, 
    MessageSquare, Star, ArrowUpRight, LayoutGrid, ArrowLeft,
    MoreHorizontal, Calendar, Download,
    Paperclip, Image as ImageIcon, PlayCircle, Copy, Bell, AlertTriangle,
    Eye, EyeOff, FileSpreadsheet, MapPin, Link as LinkIcon, Send,
    LogOut, CheckSquare, X, History, GripVertical
} from 'lucide-react';
import { StatusBadge, CompanyGradeBadge, ProjectTypeBadge } from '@/components/Badges';
import { ProjectPageLayout } from '@/components/project/ProjectPageHeader';
import { useProjectFilterContext } from '@/contexts/ProjectFilterContext';
import { MOCK_PROJECTS } from '@/data/mockData';

// --- Types for Extended Functionality ---
type StageType = 'APPLICANT' | 'OT' | 'PT1' | 'PT2' | 'FINAL';
type InviteStatus = 'NOT_SENT' | 'SENT' | 'ACCEPTED' | 'FIXED';
type AttendanceStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'NOSHOW' | 'CANCELLED';

interface TimelineEvent {
    id: string;
    type: 'INVITE' | 'ACCEPT' | 'FIX' | 'ATTEND' | 'NOSHOW';
    title: string;
    timestamp: string;
    actor: string;
    desc?: string;
}

interface Evidence {
    type: 'FILE' | 'LINK' | 'NOTE';
    title: string;
    url?: string;
    date: string;
    author: string;
}

interface Participant {
    id: string;
    companyName: string;
    type: 'PRODUCTION' | 'AGENCY' | 'FREELANCER';
    repName: string;
    phone: string;
    email: string;
    inviteStatus: InviteStatus;
    attendanceStatus: AttendanceStatus;
    isCompleted: boolean;
    schedule: {
        date: string;
        time: string;
        type: 'OFFLINE' | 'ONLINE';
        location: string;
    } | null;
    lastChange: {
        date: string;
        actor: string;
    };
    evidenceCount: number;
    messageCount: number;
    lastMessageAt: string;
    isReported: boolean;
    timelines: TimelineEvent[];
    evidences: Evidence[];
}

// --- Extended Mock Data ---
const MOCK_PARTICIPANTS: Participant[] = [
    {
        id: 'APP-001',
        companyName: '스튜디오 블랙',
        type: 'PRODUCTION',
        repName: '박감독',
        phone: '010-9876-5432',
        email: 'pd@black.com',
        inviteStatus: 'FIXED',
        attendanceStatus: 'CONFIRMED',
        isCompleted: false,
        schedule: { date: '2024.11.20', time: '14:00', type: 'OFFLINE', location: '서울 강남구 테헤란로 123' },
        lastChange: { date: '2024.11.15 10:00', actor: '박감독' },
        evidenceCount: 3,
        messageCount: 5,
        lastMessageAt: '10분 전',
        isReported: false,
        timelines: [
            { id: 'TL-1', type: 'INVITE', title: 'PT 초대장 발송', timestamp: '2024.11.10 10:00', actor: '운영자' },
            { id: 'TL-2', type: 'ACCEPT', title: '참여 수락', timestamp: '2024.11.11 14:20', actor: '박감독' },
            { id: 'TL-3', type: 'FIX', title: '일정 확정', timestamp: '2024.11.12 09:30', actor: '운영자' },
        ],
        evidences: [
            { type: 'FILE', title: '1차_제안서_v1.pdf', date: '2024.11.11', author: '박감독' },
            { type: 'LINK', title: '포트폴리오 영상 링크', url: 'https://youtube.com/...', date: '2024.11.11', author: '박감독' },
        ]
    },
    {
        id: 'APP-002',
        companyName: '크리에이티브 랩',
        type: 'PRODUCTION',
        repName: '한창의',
        phone: '010-3333-4444',
        email: 'lab@creative.com',
        inviteStatus: 'SENT',
        attendanceStatus: 'PENDING',
        isCompleted: false,
        schedule: null,
        lastChange: { date: '2024.11.14 15:00', actor: '운영자' },
        evidenceCount: 1,
        messageCount: 2,
        lastMessageAt: '1일 전',
        isReported: false,
        timelines: [
            { id: 'TL-1', type: 'INVITE', title: 'PT 초대장 발송', timestamp: '2024.11.14 15:00', actor: '운영자' },
        ],
        evidences: []
    },
    {
        id: 'APP-003',
        companyName: '제일기획',
        type: 'AGENCY',
        repName: '김제일',
        phone: '010-1111-2222',
        email: 'kim@cheil.com',
        inviteStatus: 'FIXED',
        attendanceStatus: 'COMPLETED',
        isCompleted: true,
        schedule: { date: '2024.11.18', time: '10:00', type: 'ONLINE', location: 'Zoom Meeting' },
        lastChange: { date: '2024.11.18 11:30', actor: '시스템' },
        evidenceCount: 5,
        messageCount: 12,
        lastMessageAt: '3일 전',
        isReported: false,
        timelines: [
            { id: 'TL-1', type: 'INVITE', title: 'PT 초대장 발송', timestamp: '2024.11.01', actor: '운영자' },
            { id: 'TL-2', type: 'FIX', title: '일정 확정', timestamp: '2024.11.05', actor: '김제일' },
            { id: 'TL-3', type: 'ATTEND', title: 'PT 참석 확인', timestamp: '2024.11.18 09:50', actor: '시스템' },
        ],
        evidences: [
            { type: 'NOTE', title: 'PT Q&A 기록', date: '2024.11.18', author: '운영자' }
        ]
    },
    {
        id: 'APP-004',
        companyName: '영상공작소 픽셀',
        type: 'PRODUCTION',
        repName: '최에딧',
        phone: '010-0000-0000',
        email: 'pixel@edit.com',
        inviteStatus: 'FIXED',
        attendanceStatus: 'NOSHOW',
        isCompleted: false,
        schedule: { date: '2024.11.19', time: '15:00', type: 'OFFLINE', location: '본사 회의실' },
        lastChange: { date: '2024.11.19 15:30', actor: '운영자' },
        evidenceCount: 0,
        messageCount: 1,
        lastMessageAt: '5일 전',
        isReported: true,
        timelines: [
            { id: 'TL-1', type: 'FIX', title: '일정 확정', timestamp: '2024.11.10', actor: '최에딧' },
            { id: 'TL-2', type: 'NOSHOW', title: '노쇼 처리', timestamp: '2024.11.19 15:30', actor: '운영자', desc: '연락 두절 및 불참' },
        ],
        evidences: []
    }
];

interface MatchingManagementProps {
    activeTab?: string;
}

const MatchingManagement = ({ activeTab = 'projects-matching' }: MatchingManagementProps) => {
    const projectFilter = useProjectFilterContext();
    const {
        filteredProjects,
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,
        projectsForClient,
    } = projectFilter;

    const [currentStage, setCurrentStage] = useState<StageType>('PT1');
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Participant Filtering Logic
    const filteredParticipants = useMemo(() => {
        return MOCK_PARTICIPANTS.filter(p => {
            const matchesSearch = 
                p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.repName.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [searchTerm]);

    // Handlers
    const copyToClipboard = (text: string) => {
        // navigator.clipboard.writeText(text); // In real app
        alert(`복사되었습니다: ${text}`);
    };

    // --- Components ---

    const StageTabs = () => (
        <div className="flex bg-white border-b border-slate-200 sticky top-0 z-10">
            {[
                { id: 'APPLICANT', label: '참여신청' },
                { id: 'OT', label: 'OT' },
                { id: 'PT1', label: 'PT 1차' },
                { id: 'PT2', label: 'PT 2차' },
                { id: 'FINAL', label: '최종선정' },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setCurrentStage(tab.id as StageType)}
                    className={`px-6 py-4 text-sm font-bold border-b-2 transition-all relative ${
                        currentStage === tab.id
                        ? 'border-[#2b4ea7] text-[#2b4ea7] bg-[#2b4ea7]/5'
                        : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {tab.label}
                    {tab.id === 'PT1' && (
                        <span className="ml-2 bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full border border-slate-200">
                            {MOCK_PARTICIPANTS.length}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );

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

    const InviteStatusBadge = ({ status }: { status: InviteStatus }) => {
        const map = {
            NOT_SENT: { label: '미초대', style: 'bg-slate-100 text-slate-400' },
            SENT: { label: '초대발송', style: 'bg-blue-50 text-blue-600' },
            ACCEPTED: { label: '수락', style: 'bg-indigo-50 text-indigo-600' },
            FIXED: { label: '일정확정', style: 'bg-emerald-50 text-emerald-600' },
        };
        const conf = map[status];
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${conf.style}`}>{conf.label}</span>;
    };

    const AttendanceBadge = ({ status }: { status: AttendanceStatus }) => {
        const map = {
            PENDING: { label: '미정', style: 'bg-slate-100 text-slate-400' },
            CONFIRMED: { label: '참석확정', style: 'bg-blue-50 text-blue-600' },
            COMPLETED: { label: '참석완료', style: 'bg-emerald-50 text-emerald-600' },
            NOSHOW: { label: '노쇼', style: 'bg-rose-50 text-rose-600' },
            CANCELLED: { label: '취소', style: 'bg-gray-100 text-gray-500' },
        };
        const conf = map[status];
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${conf.style}`}>{conf.label}</span>;
    };

    const ParticipantDrawer = () => {
        if (!selectedParticipant) return null;

        return (
            <>
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" 
                    onClick={() => setSelectedParticipant(null)}
                ></div>
                <div className="fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 transform transition-transform animate-in slide-in-from-right flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                    selectedParticipant.type === 'PRODUCTION' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                    selectedParticipant.type === 'AGENCY' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                }`}>
                                    {selectedParticipant.type === 'PRODUCTION' ? '제작사' : selectedParticipant.type === 'AGENCY' ? '대행사' : '프리랜서'}
                                </span>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer hover:text-slate-600" onClick={() => copyToClipboard(selectedParticipant.id)}>
                                    {selectedParticipant.id} <Copy size={10} />
                                </div>
                            </div>
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                {selectedParticipant.companyName}
                                <button className="text-slate-400 hover:text-[#2b4ea7]"><ArrowUpRight size={16}/></button>
                            </h2>
                            <div className="text-sm text-slate-500 mt-1 flex gap-3">
                                <span>{selectedParticipant.repName}</span>
                                <span className="text-slate-300">|</span>
                                <span>{selectedParticipant.phone}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-500" title="분쟁/이슈 등록">
                                <AlertTriangle size={16} />
                            </button>
                            <button className="p-2 rounded-lg bg-[#2b4ea7] text-white hover:bg-[#203b80]" title="운영 알림 발송">
                                <Send size={16} />
                            </button>
                            <button onClick={() => setSelectedParticipant(null)} className="p-2 text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Status Summary */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Briefcase size={16} className="text-slate-400"/> PT 상태 요약
                            </h3>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-slate-500 block mb-1">초대 상태</span>
                                    <InviteStatusBadge status={selectedParticipant.inviteStatus} />
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500 block mb-1">참석 상태</span>
                                    <AttendanceBadge status={selectedParticipant.attendanceStatus} />
                                </div>
                                <div className="col-span-2 pt-3 border-t border-slate-200">
                                    <span className="text-xs text-slate-500 block mb-1">PT 일정</span>
                                    {selectedParticipant.schedule ? (
                                        <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                            <Calendar size={14} className="text-[#2b4ea7]"/> {selectedParticipant.schedule.date} {selectedParticipant.schedule.time}
                                            <span className="text-slate-300">|</span>
                                            <MapPin size={14} className="text-slate-400"/> {selectedParticipant.schedule.location}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-400 font-medium">일정 미정</span>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Timeline */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <History size={16} className="text-slate-400"/> 타임라인
                            </h3>
                            <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                {selectedParticipant.timelines.map((log, idx) => (
                                    <div key={log.id} className="relative">
                                        <div className={`absolute -left-[1.35rem] w-2.5 h-2.5 rounded-full border-2 border-white ${
                                            log.type === 'NOSHOW' ? 'bg-rose-500' : 'bg-[#2b4ea7]'
                                        }`}></div>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-bold text-slate-800">{log.title}</span>
                                            <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            <span className="font-medium text-slate-700">{log.actor}</span>
                                            {log.desc && <span className="block mt-1 p-2 bg-slate-50 rounded text-slate-600 border border-slate-100">{log.desc}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                         {/* Evidence */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Paperclip size={16} className="text-slate-400"/> 증빙 자료 ({selectedParticipant.evidences.length})
                            </h3>
                            {selectedParticipant.evidences.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedParticipant.evidences.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className={`w-8 h-8 rounded flex items-center justify-center ${
                                                item.type === 'FILE' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {item.type === 'FILE' ? <FileText size={16}/> : <LinkIcon size={16}/>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold text-slate-700 truncate group-hover:text-[#2b4ea7]">{item.title}</div>
                                                <div className="text-[10px] text-slate-400">{item.date} • {item.author}</div>
                                            </div>
                                            <Download size={14} className="text-slate-300 group-hover:text-slate-600"/>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-100 border-dashed text-xs text-slate-400">
                                    등록된 증빙 자료가 없습니다.
                                </div>
                            )}
                        </section>

                        {/* Comms Meta */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <MessageSquare size={16} className="text-slate-400"/> 커뮤니케이션
                            </h3>
                             <div className="flex gap-4">
                                <div className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-center">
                                    <div className="text-xs text-slate-500 mb-1">메시지</div>
                                    <div className="text-lg font-black text-slate-800">{selectedParticipant.messageCount}건</div>
                                </div>
                                <div className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-center">
                                    <div className="text-xs text-slate-500 mb-1">최근 수신</div>
                                    <div className="text-lg font-bold text-slate-800">{selectedParticipant.lastMessageAt}</div>
                                </div>
                            </div>
                            {selectedParticipant.isReported && (
                                <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3">
                                    <AlertTriangle size={18} className="text-rose-500" />
                                    <div>
                                        <div className="text-xs font-bold text-rose-700">신고 접수된 내역이 있습니다.</div>
                                        <button className="text-[10px] text-rose-600 underline hover:text-rose-800">분쟁 케이스 확인하기</button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </>
        );
    };

    // --- RENDER: MAIN VIEW (Complex UI) ---
    return (
        <>
            <ProjectPageLayout
                title={activeTab === 'projects-proposal' ? '제안서/시안 관리' : '매칭/제안 관리'}
                toolbar={
                    <>
                        <div className="flex gap-2 w-full xl:w-auto justify-end">
                            <button className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center gap-2">
                                <FileSpreadsheet size={14} /> 엑셀 다운로드
                            </button>
                            <button className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center gap-2">
                                <Bell size={14} /> 운영 알림 발송
                            </button>
                            <button className="px-3 py-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold hover:bg-rose-100 flex items-center gap-2">
                                <AlertTriangle size={14} /> 분쟁/이슈 등록
                            </button>
                        </div>
                    </>
                }
            >
                {/* Stage Tabs */}
                <StageTabs />

                {/* 본문 영역 */}
                <div className="p-6 space-y-6">

                    {/* Filter Toolbar - 구조화 */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* 왼쪽: 검색 + 필터 */}
                            <div className="flex gap-2 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="참여사, 담당자 검색" 
                                        className="pl-9 pr-4 h-10 w-full rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7] transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="px-4 py-2 h-10 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center gap-2 shrink-0">
                                    <Filter size={14} /> 필터
                                </button>
                            </div>
                            {/* 오른쪽: 정렬 */}
                            <div className="flex items-center gap-4 shrink-0">
                                <select className="h-10 pl-3 pr-8 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 focus:outline-none bg-white">
                                    <option>최신순</option>
                                    <option>PT 일정순</option>
                                    <option>이름순</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Participant Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="p-4 font-bold w-10"><input type="checkbox" className="rounded border-slate-300"/></th>
                                <th className="p-4 font-bold">참여사 정보</th>
                                <th className="p-4 font-bold">유형</th>
                                <th className="p-4 font-bold">PT 초대</th>
                                <th className="p-4 font-bold">참석 상태</th>
                                <th className="p-4 font-bold">PT 일정</th>
                                <th className="p-4 font-bold">최근 변경</th>
                                <th className="p-4 font-bold">증빙/메타</th>
                                <th className="p-4 font-bold text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredParticipants.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedParticipant(item)}>
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300"/></td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800 text-sm group-hover:text-[#2b4ea7] transition-colors">{item.companyName}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{item.id}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                            item.type === 'PRODUCTION' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                            item.type === 'AGENCY' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        }`}>
                                            {item.type === 'PRODUCTION' ? '제작사' : item.type === 'AGENCY' ? '대행사' : '프리랜서'}
                                        </span>
                                    </td>
                                    <td className="p-4"><InviteStatusBadge status={item.inviteStatus} /></td>
                                    <td className="p-4"><AttendanceBadge status={item.attendanceStatus} /></td>
                                    <td className="p-4">
                                        {item.schedule ? (
                                            <div className="flex flex-col">
                                                <div className="text-xs font-bold text-slate-700">{item.schedule.date} {item.schedule.time}</div>
                                                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    {item.schedule.type === 'ONLINE' ? '온라인' : '오프라인 (장소 비공개)'}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs font-medium text-slate-600">{item.lastChange.date}</div>
                                        <div className="text-[10px] text-slate-400">{item.lastChange.actor}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {item.evidenceCount > 0 && (
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200" title="증빙자료">
                                                    <Paperclip size={10}/> <span>{item.evidenceCount}</span>
                                                </div>
                                            )}
                                            {item.messageCount > 0 && (
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100" title="메시지">
                                                    <MessageSquare size={10}/> <span>{item.messageCount}</span>
                                                </div>
                                            )}
                                            {item.isReported && (
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100" title="신고 접수됨">
                                                    <AlertTriangle size={10}/> <span>신고</span>
                                                </div>
                                            )}
                                            {item.evidenceCount === 0 && item.messageCount === 0 && !item.isReported && (
                                                <span className="text-xs text-slate-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-slate-400 hover:text-[#2b4ea7] p-2 hover:bg-slate-100 rounded-full transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
</div>
                    </div>
                </div>
            </ProjectPageLayout>

            {/* Participant Drawer */}
            <ParticipantDrawer />
        </>
    );
};

export default MatchingManagement;