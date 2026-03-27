import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
    Search, Download, MoreHorizontal, UserCog, 
    UserPlus, Star, Award, Briefcase, Activity, 
    Calendar, CheckCircle2, AlertCircle, DollarSign,
    ChevronRight, Wallet, X
} from 'lucide-react';
import { StatusBadge } from '@/components/Badges';
import { getConsultants } from '@/api';
import type { Consultant } from '@/api';

// --- Extended Mock Data for Projects and Settlements ---
const MOCK_CONSULTANT_PROJECTS = [
    { id: 'CP-001', projectId: 'PID-20241101-0001', projectTitle: '2025 S/S 시즌 아웃도어 브랜드 TVC', consultantId: 'CS-2401-001', consultantName: '강전문', status: 'MATCHING', startDate: '2024.11.01', matchingRate: 95 },
    { id: 'CP-002', projectId: 'PID-20241028-0002', projectTitle: '신규 뷰티 브랜드 런칭 퍼포먼스', consultantId: 'CS-2405-012', consultantName: '박기획', status: 'PRODUCTION', startDate: '2024.10.28', matchingRate: 88 },
    { id: 'CP-003', projectId: 'PID-20240901-0004', projectTitle: 'SKT AI 에이닷 프로모션 영상', consultantId: 'CS-2401-001', consultantName: '강전문', status: 'COMPLETE', startDate: '2024.09.01', matchingRate: 92 },
    { id: 'CP-004', projectId: 'PID-20241102-0005', projectTitle: '스타트업 IR 피칭 영상 제작', consultantId: 'CS-2403-005', consultantName: '이마케팅', status: 'REQUESTED', startDate: '2024.11.02', matchingRate: 75 },
];

const MOCK_CONSULTANT_SETTLEMENTS = [
    { id: 'CS-PAY-001', consultantId: 'CS-2401-001', consultantName: '강전문', projectTitle: 'SKT AI 에이닷 프로모션 영상', amount: 1500000, date: '2024.11.10', status: 'PAID' },
    { id: 'CS-PAY-002', consultantId: 'CS-2405-012', consultantName: '박기획', projectTitle: '신규 뷰티 브랜드 런칭 퍼포먼스', amount: 800000, date: '2024.12.10', status: 'SCHEDULED' },
    { id: 'CS-PAY-003', consultantId: 'CS-2401-001', consultantName: '강전문', projectTitle: '금융 앱 서비스 리뉴얼', amount: 1200000, date: '2024.10.10', status: 'PAID' },
];

interface ConsultantManagementProps {
    activeTab?: string;
}

const ConsultantManagement = ({ activeTab = 'consultants-list' }: ConsultantManagementProps) => {
    // Determine internal view based on activeTab prop
    const currentView = useMemo(() => {
        if (activeTab === 'consultants-projects') return 'PROJECTS';
        if (activeTab === 'consultants-settlement') return 'SETTLEMENT';
        return 'LIST';
    }, [activeTab]);

    // States
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [consultants, setConsultants] = useState<Consultant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
    const [registerForm, setRegisterForm] = useState({
        name: '',
        type: 'FREELANCER' as 'FREELANCER' | string,
        company: '',
        career: '',
        expertise: '' as string,
        expertiseList: [] as string[],
        email: '',
        phone: '',
    });

    // API: 컨설턴트 목록 (Mock API → 실서비스 시 동일 호출)
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        getConsultants()
            .then((data) => { if (!cancelled) setConsultants(data); })
            .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load'); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    // --- Helpers ---
    const formatCurrency = (amount: number) => new Intl.NumberFormat('ko-KR').format(amount);

    const resetRegisterForm = () => {
        setRegisterForm({
            name: '',
            type: 'FREELANCER',
            company: '',
            career: '',
            expertise: '',
            expertiseList: [],
            email: '',
            phone: '',
        });
    };

    const openRegisterModal = () => {
        resetRegisterForm();
        setShowRegisterModal(true);
    };

    const closeRegisterModal = () => {
        setShowRegisterModal(false);
        resetRegisterForm();
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fromInput = registerForm.expertise ? registerForm.expertise.split(/[,，\s]+/).map(s => s.trim()).filter(Boolean) : [];
        const expertiseList = registerForm.expertiseList.length ? registerForm.expertiseList : fromInput;
        if (!registerForm.name.trim()) return;
        const newId = `CS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(consultants.length + 1).padStart(3, '0')}`;
        const newConsultant: Consultant = {
            id: newId,
            name: registerForm.name.trim(),
            type: registerForm.type,
            company: registerForm.type !== 'FREELANCER' ? registerForm.company : undefined,
            expertise: expertiseList.length ? expertiseList : ['미분류'],
            career: registerForm.career.trim() || '-',
            managedProjects: 0,
            matchRate: '-',
            rating: 0,
            status: 'PENDING',
            email: registerForm.email.trim() || undefined,
            phone: registerForm.phone.trim() || undefined,
            joinDate: new Date().toISOString().slice(0, 10),
        };
        setConsultants(prev => [newConsultant, ...prev]);
        closeRegisterModal();
    };

    const addExpertiseTag = () => {
        const tag = registerForm.expertise.trim();
        if (!tag || registerForm.expertiseList.includes(tag)) return;
        setRegisterForm(prev => ({ ...prev, expertiseList: [...prev.expertiseList, tag], expertise: '' }));
    };

    // --- Filter Logic ---
    const filteredConsultants = useMemo(() => {
        return consultants.filter(consultant => {
            const statusMatch = statusFilter === 'ALL' || consultant.status === statusFilter;
            const searchMatch = 
                consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (consultant.expertise && consultant.expertise.some(e => e.includes(searchTerm))) ||
                consultant.id.toLowerCase().includes(searchTerm.toLowerCase());
            return statusMatch && searchMatch;
        });
    }, [consultants, statusFilter, searchTerm]);

    const filteredProjects = useMemo(() => {
        return MOCK_CONSULTANT_PROJECTS.filter(p => 
            p.projectTitle.includes(searchTerm) || p.consultantName.includes(searchTerm)
        );
    }, [searchTerm]);

    const filteredSettlements = useMemo(() => {
        return MOCK_CONSULTANT_SETTLEMENTS.filter(s => 
            s.consultantName.includes(searchTerm) || s.projectTitle.includes(searchTerm)
        );
    }, [searchTerm]);

    // Stats
    const stats = useMemo(() => {
        const n = consultants.length;
        const avg = n > 0 ? (consultants.reduce((acc, curr) => acc + curr.rating, 0) / n).toFixed(1) : '0';
        return {
            total: n,
            active: consultants.filter(c => c.status === 'ACTIVE').length,
            pending: consultants.filter(c => c.status === 'PENDING').length,
            avgRating: avg,
            totalProjects: MOCK_CONSULTANT_PROJECTS.length,
            activeProjects: MOCK_CONSULTANT_PROJECTS.filter(p => ['MATCHING', 'PRODUCTION'].includes(p.status)).length,
            totalSettlement: MOCK_CONSULTANT_SETTLEMENTS.reduce((acc, curr) => acc + curr.amount, 0),
            paidSettlement: MOCK_CONSULTANT_SETTLEMENTS.filter(s => s.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0),
        };
    }, [consultants]);

    // --- Renders ---

    const renderList = () => (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="이름, 전문분야 검색" 
                            className="pl-9 pr-4 h-10 w-full md:w-80 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select 
                        className="h-10 pl-3 pr-8 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 focus:outline-none focus:border-[#2b4ea7] bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">모든 상태</option>
                        <option value="ACTIVE">활동중</option>
                        <option value="PENDING">승인대기</option>
                        <option value="SUSPENDED">활동정지</option>
                    </select>
                    <button
                        type="button"
                        onClick={openRegisterModal}
                        className="h-10 px-4 rounded-lg bg-[#2b4ea7] text-white text-sm font-bold hover:bg-[#203b80] transition-colors shadow-sm flex items-center gap-2"
                    >
                        <UserPlus size={14} />
                        컨설턴트 등록
                    </button>
                    <button className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                        <Download size={14} />
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto min-w-0">
                <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="p-4 font-bold w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
                            <th className="p-4 font-bold">컨설턴트 정보</th>
                            <th className="p-4 font-bold">전문 분야</th>
                            <th className="p-4 font-bold">매칭 성과</th>
                            <th className="p-4 font-bold">상태</th>
                            <th className="p-4 font-bold text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredConsultants.length > 0 ? filteredConsultants.map((consultant) => (
                            <tr key={consultant.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="p-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-sm relative">
                                            {consultant.name.charAt(0)}
                                            {consultant.status === 'PENDING' && (
                                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedConsultant(consultant)}
                                                    className="font-bold text-slate-800 text-sm text-left hover:text-[#2b4ea7] underline-offset-2 hover:underline transition-colors"
                                                >
                                                    {consultant.name}
                                                </button>
                                                <span className={`text-[9px] font-bold px-1 py-0.5 rounded border ${
                                                    consultant.type === 'FREELANCER' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                }`}>
                                                    {consultant.type === 'FREELANCER' ? '프리랜서' : consultant.company}
                                                </span>
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                                                {consultant.id} <span className="text-slate-300">|</span> {consultant.career}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                                        {consultant.expertise.map((exp, idx) => (
                                            <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                                                {exp}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">프로젝트</span>
                                            <span className="text-sm font-bold text-slate-700">{consultant.managedProjects}건</span>
                                        </div>
                                        <div className="w-px h-6 bg-slate-100"></div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">평점</span>
                                            <div className="flex items-center gap-1">
                                                <Star size={10} className="text-amber-400 fill-amber-400"/>
                                                <span className="text-sm font-bold text-slate-700">{consultant.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4"><StatusBadge status={consultant.status} /></td>
                                <td className="p-4 text-center">
                                    <button className="text-slate-400 hover:text-[#2b4ea7] p-2 hover:bg-blue-50 rounded-full transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="p-20 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <UserCog size={48} className="mb-4 opacity-10"/>
                                        <p className="text-sm font-medium text-slate-500 mb-1">등록된 컨설턴트가 없습니다.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderProjects = () => (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="프로젝트, 담당 컨설턴트 검색" 
                        className="pl-9 pr-4 h-10 w-full rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto min-w-0"><table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="p-4 font-bold">프로젝트 정보</th>
                        <th className="p-4 font-bold">담당 컨설턴트</th>
                        <th className="p-4 font-bold">시작일</th>
                        <th className="p-4 font-bold">매칭 적합도</th>
                        <th className="p-4 font-bold">상태</th>
                        <th className="p-4 font-bold text-center">관리</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredProjects.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4">
                                <div className="text-sm font-bold text-slate-800">{p.projectTitle}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{p.projectId}</div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                        {p.consultantName.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{p.consultantName}</span>
                                </div>
                            </td>
                            <td className="p-4 text-xs font-medium text-slate-500">{p.startDate}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#2b4ea7]" style={{ width: `${p.matchingRate}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-[#2b4ea7]">{p.matchingRate}%</span>
                                </div>
                            </td>
                            <td className="p-4"><StatusBadge status={p.status} /></td>
                            <td className="p-4 text-center">
                                <button className="p-2 text-slate-400 hover:text-[#2b4ea7] rounded-full hover:bg-slate-50">
                                    <ChevronRight size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );

    const renderSettlements = () => (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-slate-800 text-sm">최근 정산 내역</h3>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                        <Calendar size={14} className="text-slate-400"/>
                        <span className="text-xs font-bold text-slate-600">2024년 11월</span>
                    </div>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="컨설턴트, 프로젝트 검색" 
                        className="pl-9 pr-4 h-9 w-full rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#2b4ea7] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto min-w-0"><table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="p-4 font-bold">지급일</th>
                        <th className="p-4 font-bold">컨설턴트</th>
                        <th className="p-4 font-bold">관련 프로젝트</th>
                        <th className="p-4 font-bold text-right">정산 금액</th>
                        <th className="p-4 font-bold text-center">상태</th>
                        <th className="p-4 font-bold text-center">증빙</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredSettlements.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4 text-xs font-medium text-slate-500">{s.date}</td>
                            <td className="p-4">
                                <span className="text-sm font-bold text-slate-700">{s.consultantName}</span>
                            </td>
                            <td className="p-4 text-xs text-slate-500">{s.projectTitle}</td>
                            <td className="p-4 text-right font-black text-slate-800">{formatCurrency(s.amount)}원</td>
                            <td className="p-4 text-center">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                                    s.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {s.status === 'PAID' ? '지급완료' : '지급예정'}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <button className="text-[10px] font-bold text-slate-500 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">
                                    보기
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {currentView === 'LIST' && '컨설턴트 리스트'}
                    {currentView === 'PROJECTS' && '관련 프로젝트'}
                    {currentView === 'SETTLEMENT' && '수수료 정산'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    {currentView === 'LIST' && '프로젝트 매칭을 지원하는 전문 컨설턴트를 등록하고 관리합니다.'}
                    {currentView === 'PROJECTS' && '컨설턴트가 담당하고 있는 프로젝트 현황을 조회합니다.'}
                    {currentView === 'SETTLEMENT' && '매칭 성과에 따른 컨설턴트 수수료 및 인센티브를 정산합니다.'}
                  </p>
                </div>
                {/* 컨설턴트 등록 버튼 제거 (현재 화면에서는 조회/관리 전용) */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {currentView === 'LIST' && (
                    <>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><UserCog size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">전체</p><h4 className="text-2xl font-black text-slate-900">{stats.total}</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Activity size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">활동 중</p><h4 className="text-2xl font-black text-slate-900">{stats.active}</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><Award size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">승인 대기</p><h4 className="text-2xl font-black text-slate-900">{stats.pending}</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center"><Star size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">평균 평점</p><h4 className="text-2xl font-black text-slate-900">{stats.avgRating}</h4></div>
                        </div>
                    </>
                )}
                {currentView === 'PROJECTS' && (
                    <>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><Briefcase size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">진행 프로젝트</p><h4 className="text-2xl font-black text-slate-900">{stats.totalProjects}</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Activity size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">매칭 중/진행 중</p><h4 className="text-2xl font-black text-slate-900">{stats.activeProjects}</h4></div>
                        </div>
                    </>
                )}
                {currentView === 'SETTLEMENT' && (
                    <>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Wallet size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">총 지급액</p><h4 className="text-2xl font-black text-slate-900">{formatCurrency(stats.totalSettlement)}원</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">지급 완료</p><h4 className="text-2xl font-black text-slate-900">{formatCurrency(stats.paidSettlement)}원</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><DollarSign size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">지급 예정</p><h4 className="text-2xl font-black text-slate-900">{formatCurrency(stats.totalSettlement - stats.paidSettlement)}원</h4></div>
                        </div>
                    </>
                )}
            </div>

            {/* Main Content */}
            {currentView === 'LIST' && (
                <>
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                            {error}
                        </div>
                    )}
                    {loading && !error && (
                        <div className="flex items-center justify-center py-12 text-slate-500 text-sm font-medium">
                            로딩 중...
                        </div>
                    )}
                    {!loading && !error && renderList()}
                </>
            )}
            {currentView === 'PROJECTS' && renderProjects()}
            {currentView === 'SETTLEMENT' && renderSettlements()}

            {/* 컨설턴트 등록 팝업 */}
            {showRegisterModal && createPortal(
                <>
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                        onClick={closeRegisterModal}
                        aria-hidden
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <div
                            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50 shrink-0">
                                <h3 className="text-lg font-black text-slate-900">컨설턴트 등록</h3>
                                <button
                                    type="button"
                                    onClick={closeRegisterModal}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    aria-label="닫기"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleRegisterSubmit} className="flex flex-col flex-1 min-h-0">
                                <div className="px-6 py-4 overflow-y-auto space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">이름 <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={registerForm.name}
                                            onChange={(e) => setRegisterForm(f => ({ ...f, name: e.target.value }))}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7]"
                                            placeholder="홍길동"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">유형</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="consultantType"
                                                    checked={registerForm.type === 'FREELANCER'}
                                                    onChange={() => setRegisterForm(f => ({ ...f, type: 'FREELANCER' }))}
                                                    className="text-[#2b4ea7]"
                                                />
                                                <span className="text-sm font-medium text-slate-700">프리랜서</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="consultantType"
                                                    checked={registerForm.type !== 'FREELANCER'}
                                                    onChange={() => setRegisterForm(f => ({ ...f, type: 'COMPANY' }))}
                                                    className="text-[#2b4ea7]"
                                                />
                                                <span className="text-sm font-medium text-slate-700">회사</span>
                                            </label>
                                        </div>
                                    </div>
                                    {registerForm.type !== 'FREELANCER' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">회사명</label>
                                            <input
                                                type="text"
                                                value={registerForm.company}
                                                onChange={(e) => setRegisterForm(f => ({ ...f, company: e.target.value }))}
                                                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7]"
                                                placeholder="(주)회사명"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">경력</label>
                                        <input
                                            type="text"
                                            value={registerForm.career}
                                            onChange={(e) => setRegisterForm(f => ({ ...f, career: e.target.value }))}
                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7]"
                                            placeholder="예: 10년차, OO대 졸"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">전문 분야</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={registerForm.expertise}
                                                onChange={(e) => setRegisterForm(f => ({ ...f, expertise: e.target.value }))}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertiseTag())}
                                                className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7]"
                                                placeholder="영상제작, 기획 (쉼표 또는 Enter로 추가)"
                                            />
                                            <button type="button" onClick={addExpertiseTag} className="h-10 px-3 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 shrink-0">
                                                추가
                                            </button>
                                        </div>
                                        {registerForm.expertiseList.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {registerForm.expertiseList.map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium border border-slate-200"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => setRegisterForm(f => ({ ...f, expertiseList: f.expertiseList.filter((_, j) => j !== i) }))}
                                                            className="text-slate-400 hover:text-rose-500"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">이메일</label>
                                            <input
                                                type="email"
                                                value={registerForm.email}
                                                onChange={(e) => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                                                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7]"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">연락처</label>
                                            <input
                                                type="tel"
                                                value={registerForm.phone}
                                                onChange={(e) => setRegisterForm(f => ({ ...f, phone: e.target.value }))}
                                                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7]"
                                                placeholder="010-0000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 shrink-0 bg-slate-50/50">
                                    <button
                                        type="button"
                                        onClick={closeRegisterModal}
                                        className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:bg-slate-50"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="h-10 px-4 rounded-lg bg-[#2b4ea7] text-white text-sm font-bold hover:bg-[#203b80] transition-colors shadow-sm"
                                    >
                                        등록
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>,
                document.body
            )}

            {/* 컨설턴트 상세 프로필 팝업 */}
            {selectedConsultant && createPortal(
                <>
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setSelectedConsultant(null)}
                        aria-hidden
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <div
                            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50 shrink-0">
                                <h3 className="text-lg font-black text-slate-900">컨설턴트 프로필</h3>
                                <button
                                    type="button"
                                    onClick={() => setSelectedConsultant(null)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    aria-label="닫기"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="px-6 py-5 overflow-y-auto space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-500 font-black text-xl shrink-0">
                                        {selectedConsultant.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-black text-slate-900 text-lg">{selectedConsultant.name}</span>
                                            <StatusBadge status={selectedConsultant.status} />
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                                selectedConsultant.type === 'FREELANCER'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                            }`}>
                                                {selectedConsultant.type === 'FREELANCER' ? '프리랜서' : selectedConsultant.company || '회사'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">{selectedConsultant.id}</div>
                                        {selectedConsultant.joinDate && (
                                            <div className="text-[11px] text-slate-400 mt-0.5">가입일 {selectedConsultant.joinDate}</div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">경력</h4>
                                    <p className="text-sm text-slate-700 font-medium">{selectedConsultant.career || '-'}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">전문 분야</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedConsultant.expertise.map((exp, idx) => (
                                            <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium border border-slate-200">
                                                {exp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">담당 프로젝트</span>
                                        <p className="text-lg font-black text-slate-800 mt-0.5">{selectedConsultant.managedProjects}건</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">평점</span>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Star size={14} className="text-amber-400 fill-amber-400" />
                                            <span className="text-lg font-black text-slate-800">{selectedConsultant.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                {(selectedConsultant.email || selectedConsultant.phone) && (
                                    <div className="pt-2 border-t border-slate-100 space-y-2">
                                        {selectedConsultant.email && (
                                            <div className="text-sm"><span className="text-slate-500 font-medium">이메일</span> <span className="text-slate-700 font-medium">{selectedConsultant.email}</span></div>
                                        )}
                                        {selectedConsultant.phone && (
                                            <div className="text-sm"><span className="text-slate-500 font-medium">연락처</span> <span className="text-slate-700 font-medium">{selectedConsultant.phone}</span></div>
                                        )}
                                    </div>
                                )}
                                {(() => {
                                    const projects = MOCK_CONSULTANT_PROJECTS.filter(p => p.consultantId === selectedConsultant.id);
                                    const settlements = MOCK_CONSULTANT_SETTLEMENTS.filter(s => s.consultantId === selectedConsultant.id);
                                    if (projects.length === 0 && settlements.length === 0) return null;
                                    return (
                                        <div className="pt-2 border-t border-slate-100 space-y-3">
                                            {projects.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">관련 프로젝트</h4>
                                                    <ul className="space-y-1.5">
                                                        {projects.slice(0, 5).map(p => (
                                                            <li key={p.id} className="text-xs text-slate-600 font-medium flex justify-between gap-2">
                                                                <span className="truncate">{p.projectTitle}</span>
                                                                <span className="text-slate-400 shrink-0">{p.status === 'COMPLETE' ? '완료' : p.status === 'PRODUCTION' ? '제작중' : '매칭중'}</span>
                                                            </li>
                                                        ))}
                                                        {projects.length > 5 && <li className="text-[11px] text-slate-400">외 {projects.length - 5}건</li>}
                                                    </ul>
                                                </div>
                                            )}
                                            {settlements.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">최근 정산</h4>
                                                    <ul className="space-y-1.5">
                                                        {settlements.slice(0, 3).map(s => (
                                                            <li key={s.id} className="text-xs text-slate-600 font-medium flex justify-between gap-2">
                                                                <span className="truncate">{s.projectTitle}</span>
                                                                <span className="shrink-0 font-bold text-slate-700">{formatCurrency(s.amount)}원</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="px-6 py-4 border-t border-slate-200 shrink-0 bg-slate-50/50 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setSelectedConsultant(null)}
                                    className="h-10 px-4 rounded-lg bg-[#2b4ea7] text-white text-sm font-bold hover:bg-[#203b80] transition-colors shadow-sm"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};

export default ConsultantManagement;