import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, CalendarRange, MoreHorizontal,
    CreditCard, Banknote, AlertCircle, CheckCircle2, Clock, 
    ArrowRight, ChevronRight, Filter, Wallet, Calendar,
    PieChart, X, ChevronDown
} from 'lucide-react';
import { ProjectPageHeader } from '@/components/project/ProjectPageHeader';
import { useProjectFilterContext } from '@/contexts/ProjectFilterContext';
import { MOCK_PROJECTS } from '@/data/mockData';

// Types for better structure
type PaymentStageStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'SCHEDULED';

interface PaymentStage {
    type: 'DOWN' | 'INTERMEDIATE' | 'BALANCE';
    label: string;
    ratio: number; // Percentage
    amount: number;
    date: string;
    status: PaymentStageStatus;
    taxBill: boolean;
}

interface ProjectSettlement {
    id: string;
    projectTitle: string;
    client: string;
    partner: string;
    totalAmount: number;
    stages: PaymentStage[];
}

// Mock Data: 프로젝트별 정산 스케줄
const MOCK_SETTLEMENTS: ProjectSettlement[] = [
    { 
        id: 'PID-20241101-0001',
        projectTitle: '2025 S/S 시즌 아웃도어 브랜드 TVC 제작',
        client: '마운틴K',
        partner: '스튜디오 블랙',
        totalAmount: 300000000,
        stages: [
            { type: 'DOWN', label: '착수금', ratio: 30, amount: 90000000, date: '2024.11.14', status: 'PAID', taxBill: true },
            { type: 'INTERMEDIATE', label: '중도금', ratio: 40, amount: 120000000, date: '2024.12.20', status: 'SCHEDULED', taxBill: false },
            { type: 'BALANCE', label: '잔금', ratio: 30, amount: 90000000, date: '2025.01.30', status: 'SCHEDULED', taxBill: false },
        ]
    },
    { 
        id: 'PID-20241028-0002',
        projectTitle: '신규 뷰티 브랜드 런칭 퍼포먼스 마케팅',
        client: '퓨어랩',
        partner: '영상공작소 픽셀',
        totalAmount: 50000000,
        stages: [
            { type: 'DOWN', label: '착수금', ratio: 50, amount: 25000000, date: '2024.11.01', status: 'PAID', taxBill: true },
            { type: 'BALANCE', label: '잔금', ratio: 50, amount: 25000000, date: '2024.12.01', status: 'PENDING', taxBill: true },
        ]
    },
    { 
        id: 'PID-20240901-0004',
        projectTitle: 'SKT AI 에이닷 프로모션 영상',
        client: 'SK텔레콤',
        partner: '크리에이티브 랩',
        totalAmount: 80000000,
        stages: [
            { type: 'DOWN', label: '착수금', ratio: 30, amount: 24000000, date: '2024.09.10', status: 'PAID', taxBill: true },
            { type: 'INTERMEDIATE', label: '중도금', ratio: 40, amount: 32000000, date: '2024.10.20', status: 'PAID', taxBill: true },
            { type: 'BALANCE', label: '잔금', ratio: 30, amount: 24000000, date: '2024.11.10', status: 'OVERDUE', taxBill: false },
        ]
    },
    { 
        id: 'PID-20241105-0008',
        projectTitle: '겨울 시즌 호텔 프로모션 영상',
        client: '호텔 리조트',
        partner: '필름 팩토리',
        totalAmount: 45000000,
        stages: [
            { type: 'DOWN', label: '일시불', ratio: 100, amount: 45000000, date: '2024.11.25', status: 'SCHEDULED', taxBill: false },
        ]
    }
];

const SettlementManagement = () => {
    const projectFilter = useProjectFilterContext();
    const { selectedProjectId, selectedProject } = projectFilter;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL'); 
    
    // Initialize Date Range State to 'ALL' (Default)
    const [periodPreset, setPeriodPreset] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const updateDateRange = (preset: string) => {
        setPeriodPreset(preset);

        if (preset === 'ALL') {
            setStartDate('');
            setEndDate('');
            return;
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDay(); // 0 is Sunday
        let start = '';
        let end = '';

        const formatDate = (d: Date) => {
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        if (preset === 'THIS_WEEK') {
            // Monday to Sunday
            const currentDay = day === 0 ? 7 : day; // Make Sunday 7
            const monday = new Date(now);
            monday.setDate(now.getDate() - currentDay + 1);
            const sunday = new Date(now);
            sunday.setDate(now.getDate() + (7 - currentDay));
            
            start = formatDate(monday);
            end = formatDate(sunday);
        } else if (preset === 'THIS_MONTH') {
            start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
            end = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`;
        } else if (preset === 'LAST_MONTH') {
            const lastMonthStart = new Date(year, month - 1, 1);
            const lastMonthEnd = new Date(year, month, 0); // Day 0 of current month is last day of prev month
            start = formatDate(lastMonthStart);
            end = formatDate(lastMonthEnd);
        } else if (preset === 'NEXT_MONTH') {
            const nextMonth = new Date(year, month + 1, 1);
            const nextY = nextMonth.getFullYear();
            const nextM = nextMonth.getMonth();
            start = `${nextY}-${String(nextM + 1).padStart(2, '0')}-01`;
            end = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${new Date(nextY, nextM + 1, 0).getDate()}`;
        } else if (preset === 'THIS_QUARTER') {
            const quarter = Math.floor((month + 3) / 3);
            const startMonth = (quarter - 1) * 3;
            start = `${year}-${String(startMonth + 1).padStart(2, '0')}-01`;
            const endMonthDate = new Date(year, startMonth + 3, 0);
            end = formatDate(endMonthDate);
        } else if (preset === 'THIS_YEAR') {
            start = `${year}-01-01`;
            end = `${year}-12-31`;
        } else if (preset === 'LAST_YEAR') {
            start = `${year - 1}-01-01`;
            end = `${year - 1}-12-31`;
        }

        if (start && end) {
            setStartDate(start);
            setEndDate(end);
        }
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateDateRange(e.target.value);
    };

    // Filtering
    const filteredData = useMemo(() => {
        return MOCK_SETTLEMENTS.filter(item => {
            const matchesProject = !selectedProjectId || item.id === selectedProjectId;
            const matchesSearch = item.projectTitle.includes(searchTerm) || item.client.includes(searchTerm) || item.partner.includes(searchTerm);
            
            // Status Logic
            let matchesStatus = true;
            const hasOverdue = item.stages.some(s => s.status === 'OVERDUE');
            const isAllPaid = item.stages.every(s => s.status === 'PAID');

            if (filterStatus === 'OVERDUE') matchesStatus = hasOverdue;
            else if (filterStatus === 'COMPLETED') matchesStatus = isAllPaid;
            else if (filterStatus === 'ONGOING') matchesStatus = !isAllPaid && !hasOverdue;

            // Date Range Logic
            let matchesDate = true;
            if (startDate || endDate) {
                matchesDate = item.stages.some(s => {
                    const sDate = new Date(s.date.replace(/\./g, '-'));
                    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
                    const end = endDate ? new Date(endDate) : new Date('2999-12-31');
                    return sDate >= start && sDate <= end;
                });
            }

            return matchesProject && matchesSearch && matchesStatus && matchesDate;
        });
    }, [searchTerm, filterStatus, startDate, endDate, selectedProjectId]);

    // Stats
    const stats = useMemo(() => {
        let totalReceived = 0;
        let totalScheduled = 0;
        let overdueCount = 0;

        filteredData.forEach(project => {
            project.stages.forEach(stage => {
                if (stage.status === 'PAID') totalReceived += stage.amount;
                else if (stage.status === 'SCHEDULED' || stage.status === 'PENDING') totalScheduled += stage.amount;
                
                if (stage.status === 'OVERDUE') overdueCount++; 
            });
        });

        return { totalReceived, totalScheduled, overdueCount };
    }, [filteredData]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(amount);
    };

    const StageBlock = ({ stage }: { stage: PaymentStage }) => {
        const styles = {
            PAID: 'bg-emerald-50 border-emerald-100 text-emerald-700',
            PENDING: 'bg-blue-50 border-blue-100 text-blue-700', 
            SCHEDULED: 'bg-slate-50 border-slate-100 text-slate-500', 
            OVERDUE: 'bg-rose-50 border-rose-100 text-rose-700 animate-pulse' 
        };

        const icons = {
            PAID: <CheckCircle2 size={12} className="text-emerald-500" />,
            PENDING: <Clock size={12} className="text-blue-500" />,
            SCHEDULED: <Calendar size={12} className="text-slate-400" />,
            OVERDUE: <AlertCircle size={12} className="text-rose-500" />
        };

        // Check if stage is within selected range (visual highlight)
        let isWithinRange = true;
        if (startDate || endDate) {
             const sDate = new Date(stage.date.replace(/\./g, '-'));
             const start = startDate ? new Date(startDate) : new Date('1900-01-01');
             const end = endDate ? new Date(endDate) : new Date('2999-12-31');
             isWithinRange = sDate >= start && sDate <= end;
        }

        return (
            <div className={`flex-1 p-2 rounded-lg border flex flex-col gap-1 min-w-[120px] transition-opacity ${styles[stage.status]} ${isWithinRange ? 'opacity-100 ring-1 ring-offset-1 ring-transparent' : 'opacity-40 grayscale'}`}>
                <div className="flex justify-between items-center text-[10px] font-bold opacity-80">
                    <span className="flex items-center gap-1">
                        {stage.label} ({stage.ratio}%)
                    </span>
                    {icons[stage.status]}
                </div>
                <div className="text-xs font-black">
                    {(stage.amount / 10000).toLocaleString()}만원
                </div>
                <div className="flex justify-between items-end mt-1">
                    <span className="text-[10px] font-medium opacity-70">{stage.date}</span>
                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded bg-white/50 border border-black/5`}>
                         {stage.status === 'PAID' ? '지급완료' : stage.status === 'OVERDUE' ? '지연' : '예정'}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in">
            <ProjectPageHeader title="정산" />

            {/* 기간 선택: 헤더 아래 배치 */}
            <div className="flex justify-end">
                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    {[
                        { id: 'ALL', label: '전체' },
                        { id: 'THIS_YEAR', label: '연간' },
                        { id: 'THIS_MONTH', label: '월간' },
                        { id: 'THIS_WEEK', label: '주간' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => updateDateRange(tab.id)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                                periodPreset === tab.id
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Wallet size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-400">Paid Total</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">지급 완료 (필터 기준)</p>
                        <h4 className="text-2xl font-black text-slate-900">{formatCurrency(stats.totalReceived)}</h4>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                            <CalendarRange size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-400">Scheduled</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">지급 예정 (잔액)</p>
                        <h4 className="text-2xl font-black text-slate-900">{formatCurrency(stats.totalScheduled)}</h4>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                            <AlertCircle size={20} />
                        </div>
                        <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">Issue</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">지연 발생</p>
                        <h4 className="text-2xl font-black text-rose-600">{stats.overdueCount}건</h4>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col xl:flex-row justify-between items-center gap-4 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-center">
                        {/* Status Tabs */}
                        <div className="flex bg-slate-200/50 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
                            {[
                                { id: 'ALL', label: '전체 프로젝트' },
                                { id: 'ONGOING', label: '진행 중' },
                                { id: 'OVERDUE', label: '지급 지연' },
                                { id: 'COMPLETED', label: '정산 완료' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilterStatus(tab.id)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap flex-1 md:flex-none ${
                                        filterStatus === tab.id
                                        ? 'bg-white text-[#2b4ea7] shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Date Range Group */}
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 h-9 w-full md:w-auto shadow-sm">
                            <div className="relative border-r border-slate-100 pr-2 mr-1">
                                <select
                                    value={periodPreset}
                                    onChange={handlePeriodChange}
                                    className="appearance-none bg-transparent text-xs font-bold text-slate-600 focus:outline-none pr-6 cursor-pointer"
                                >
                                    <option value="ALL">전체 기간</option>
                                    <option value="THIS_WEEK">이번 주</option>
                                    <option value="THIS_MONTH">이번 달</option>
                                    <option value="LAST_MONTH">지난 달</option>
                                    <option value="NEXT_MONTH">다음 달</option>
                                    <option value="THIS_QUARTER">이번 분기</option>
                                    <option value="THIS_YEAR">올해 ({new Date().getFullYear()})</option>
                                    <option value="LAST_YEAR">작년 ({new Date().getFullYear() - 1})</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                            </div>

                            <Calendar size={14} className="text-slate-400 shrink-0"/>
                            <input 
                                type="date" 
                                className="text-xs font-bold text-slate-600 focus:outline-none bg-transparent w-full md:w-auto"
                                value={startDate}
                                onChange={(e) => { setStartDate(e.target.value); setPeriodPreset('CUSTOM'); }}
                            />
                            <span className="text-slate-300">~</span>
                            <input 
                                type="date" 
                                className="text-xs font-bold text-slate-600 focus:outline-none bg-transparent w-full md:w-auto"
                                value={endDate}
                                onChange={(e) => { setEndDate(e.target.value); setPeriodPreset('CUSTOM'); }}
                            />
                            {(startDate || endDate) && (
                                <button 
                                    onClick={() => { setStartDate(''); setEndDate(''); setPeriodPreset('ALL'); }}
                                    className="ml-1 text-slate-400 hover:text-rose-500"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search & Filter Button */}
                    <div className="flex gap-2 w-full xl:w-auto">
                        <div className="relative flex-1 xl:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="프로젝트, 거래처 검색" 
                                className="pl-9 pr-4 h-9 w-full xl:w-64 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#2b4ea7] transition-all bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-bold hover:bg-slate-50 flex items-center gap-2 shrink-0">
                            <Filter size={14} /> 필터
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-bold w-10"><input type="checkbox" className="rounded border-slate-300"/></th>
                                <th className="p-4 font-bold w-[25%]">프로젝트 정보</th>
                                <th className="p-4 font-bold w-[15%] text-right">총 금액</th>
                                <th className="p-4 font-bold w-[50%]">단계별 지급 현황 (지급비율 / 금액 / 예정일)</th>
                                <th className="p-4 font-bold text-center w-[10%]">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.map((project) => {
                                // Progress Calculation
                                const paidCount = project.stages.filter(s => s.status === 'PAID').length;
                                const totalStages = project.stages.length;
                                const progress = Math.round((paidCount / totalStages) * 100);

                                return (
                                    <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 align-top pt-6">
                                            <input type="checkbox" className="rounded border-slate-300"/>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-400 font-bold">{project.id}</span>
                                                    {project.stages.some(s => s.status === 'OVERDUE') && (
                                                        <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 rounded animate-pulse">지연 발생</span>
                                                    )}
                                                </div>
                                                <div className="text-sm font-bold text-slate-800 mb-1 line-clamp-2" title={project.projectTitle}>
                                                    {project.projectTitle}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span className="font-medium text-slate-700">{project.client}</span>
                                                    <ArrowRight size={10} className="text-slate-300"/>
                                                    <span className="font-medium text-slate-700">{project.partner}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top text-right">
                                            <div className="text-sm font-black text-slate-900">{formatCurrency(project.totalAmount)}</div>
                                            <div className="text-[10px] font-bold text-slate-400 mt-1">
                                                (VAT 별도)
                                            </div>
                                            {/* Mini Progress Bar */}
                                            <div className="mt-3 flex items-center justify-end gap-2">
                                                <span className="text-[10px] font-bold text-slate-400">{progress}% 완료</span>
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#2b4ea7]" style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            {/* Payment Stages Timeline */}
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {project.stages.map((stage, idx) => (
                                                    <React.Fragment key={idx}>
                                                        <StageBlock stage={stage} />
                                                        {idx < project.stages.length - 1 && (
                                                            <div className="flex items-center justify-center text-slate-300">
                                                                <ChevronRight size={16} />
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top text-center pt-6">
                                            <button className="text-slate-400 hover:text-[#2b4ea7] p-2 hover:bg-slate-100 rounded-full transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                     {/* Empty State */}
                     {filteredData.length === 0 && (
                        <div className="p-20 text-center flex flex-col items-center justify-center text-slate-400">
                            <CalendarRange size={48} className="mb-4 opacity-10"/>
                            <p className="text-sm font-medium text-slate-500 mb-1">해당 기간에 예정된 지급 내역이 없습니다.</p>
                            <p className="text-xs text-slate-400">조회 기간을 변경하거나 필터를 초기화해보세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettlementManagement;