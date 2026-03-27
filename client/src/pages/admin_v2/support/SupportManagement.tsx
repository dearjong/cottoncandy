import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, MessageSquare, Clock, Mail, CheckCircle2,
    Gavel, AlertTriangle, ShieldAlert,
    Briefcase, MoreHorizontal, User, Tag
} from 'lucide-react';
import { StatusBadge, UserTypeBadge } from '@/components/Badges';
import { MOCK_ALL_INQUIRIES, MOCK_ALL_DISPUTES, MOCK_REPORTS } from '@/data/mockData';

interface SupportManagementProps {
    activeTab?: string;
}

const SupportManagement = ({ activeTab = 'support' }: SupportManagementProps) => {
    const [currentTab, setCurrentTab] = useState<'INQUIRY' | 'DISPUTE' | 'REPORT'>('INQUIRY');

    // Sync tab with sidebar selection
    useEffect(() => {
        if (activeTab === 'support-dispute') setCurrentTab('DISPUTE');
        else if (activeTab === 'support-report') setCurrentTab('REPORT');
        else setCurrentTab('INQUIRY'); // Default for 'support' or 'support-inquiry'
    }, [activeTab]);

    // --- Inquiry States ---
    const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');
    const [inquirySearchTerm, setInquirySearchTerm] = useState('');

    // --- Dispute States ---
    const [disputeStatusFilter, setDisputeStatusFilter] = useState('ALL');
    const [disputeSearchTerm, setDisputeSearchTerm] = useState('');

    // --- Report States ---
    const [reportStatusFilter, setReportStatusFilter] = useState('ALL');
    const [reportSearchTerm, setReportSearchTerm] = useState('');

    // --- Stats Calculation ---
    const stats = useMemo(() => ({
        // Inquiry Stats
        waitingInquiries: MOCK_ALL_INQUIRIES.filter(i => i.status === 'WAITING').length,
        todayInquiries: 3, 
        totalInquiries: MOCK_ALL_INQUIRIES.length,
        avgResponseTime: '2.5시간',
        
        // Dispute Stats
        totalDisputes: MOCK_ALL_DISPUTES.length,
        urgentDisputes: MOCK_ALL_DISPUTES.filter(d => d.status === 'URGENT').length,
        processDisputes: MOCK_ALL_DISPUTES.filter(d => d.status === 'PROCESS').length,
        resolvedDisputes: MOCK_ALL_DISPUTES.filter(d => d.status === 'RESOLVED').length,

        // Report Stats (Based on Manual Reports)
        totalReports: MOCK_REPORTS.length,
        waitingReports: MOCK_REPORTS.filter(r => r.status === 'WAITING').length,
        processReports: MOCK_REPORTS.filter(r => r.status === 'PROCESS').length,
        resolvedReports: MOCK_REPORTS.filter(r => r.status === 'RESOLVED').length,
    }), []);

    // --- Filter Logic ---
    const filteredInquiries = useMemo(() => {
        return MOCK_ALL_INQUIRIES.filter(item => {
            const matchesStatus = inquiryStatusFilter === 'ALL' || item.status === inquiryStatusFilter;
            const matchesSearch = item.title.includes(inquirySearchTerm) || item.user.includes(inquirySearchTerm);
            return matchesStatus && matchesSearch;
        });
    }, [inquiryStatusFilter, inquirySearchTerm]);

    const filteredDisputes = useMemo(() => {
        return MOCK_ALL_DISPUTES.filter(item => {
            const matchesStatus = disputeStatusFilter === 'ALL' || item.status === disputeStatusFilter;
            const matchesSearch = item.title.includes(disputeSearchTerm) || item.project.includes(disputeSearchTerm);
            return matchesStatus && matchesSearch;
        });
    }, [disputeStatusFilter, disputeSearchTerm]);

    const filteredReports = useMemo(() => {
        return MOCK_REPORTS.filter(report => {
            const matchesStatus = reportStatusFilter === 'ALL' || report.status === reportStatusFilter;
            const matchesSearch = 
                report.content.includes(reportSearchTerm) || 
                report.reporter.includes(reportSearchTerm) || 
                report.reportedUser.includes(reportSearchTerm);
            return matchesStatus && matchesSearch;
        });
    }, [reportStatusFilter, reportSearchTerm]);

    const getReportTypeLabel = (type: string) => {
        switch(type) {
            case 'ABUSE': return { label: '욕설/비방', color: 'bg-rose-50 text-rose-600 border-rose-100' };
            case 'SPAM': return { label: '스팸/홍보', color: 'bg-orange-50 text-orange-600 border-orange-100' };
            case 'CONTACT': return { label: '직거래 유도', color: 'bg-amber-50 text-amber-600 border-amber-100' };
            default: return { label: '기타', color: 'bg-slate-50 text-slate-600 border-slate-100' };
        }
    };

    return (
        <div className="space-y-6 animate-in flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex justify-between items-end shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                      {currentTab === 'INQUIRY' && '1:1 문의'}
                      {currentTab === 'DISPUTE' && '분쟁 관리'}
                      {currentTab === 'REPORT' && '신고 관리'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                      {currentTab === 'INQUIRY' && '사용자 1:1 문의를 처리하고 답변을 관리합니다.'}
                      {currentTab === 'DISPUTE' && '프로젝트 분쟁 조정을 위한 이슈를 관리합니다.'}
                      {currentTab === 'REPORT' && '사용자가 접수한 신고 내역을 확인하고 처리합니다.'}
                  </p>
                </div>
            </div>

            {/* --- TAB 1: 1:1 INQUIRY --- */}
            {currentTab === 'INQUIRY' && (
                <div className="space-y-6 animate-in fade-in flex flex-col flex-1 min-h-0 overflow-hidden">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><MessageSquare size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">답변 대기</p><h4 className="text-2xl font-black text-rose-600">{stats.waitingInquiries}건</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Mail size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">오늘 접수</p><h4 className="text-2xl font-black text-slate-900">{stats.todayInquiries}건</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><CheckCircle2 size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">누적 문의</p><h4 className="text-2xl font-black text-slate-900">{stats.totalInquiries}건</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Clock size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">평균 답변 시간</p><h4 className="text-2xl font-black text-slate-900">{stats.avgResponseTime}</h4></div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
                        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                                {['ALL', 'WAITING', 'ANSWERED'].map(filter => (
                                    <button 
                                        key={filter}
                                        onClick={() => setInquiryStatusFilter(filter)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            inquiryStatusFilter === filter 
                                            ? 'bg-slate-800 text-white shadow-sm' 
                                            : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        {filter === 'ALL' ? '전체 문의' : filter === 'WAITING' ? '답변 대기' : '답변 완료'}
                                    </button>
                                ))}
                            </div>
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="제목, 작성자 검색" 
                                    className="pl-9 pr-4 h-9 w-full md:w-64 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#2b4ea7] transition-all"
                                    value={inquirySearchTerm}
                                    onChange={(e) => setInquirySearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-x-auto min-w-0">
                            <table className="w-full min-w-[800px] text-left border-collapse">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                        <th className="p-4 font-bold w-10"><input type="checkbox" className="rounded border-slate-300"/></th>
                                        <th className="p-4 font-bold w-20">ID</th>
                                        <th className="p-4 font-bold w-24">카테고리</th>
                                        <th className="p-4 font-bold">제목</th>
                                        <th className="p-4 font-bold">작성자</th>
                                        <th className="p-4 font-bold">접수일시</th>
                                        <th className="p-4 font-bold">상태</th>
                                        <th className="p-4 font-bold text-center">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredInquiries.map(inquiry => (
                                        <tr key={inquiry.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                            <td className="p-4"><input type="checkbox" className="rounded border-slate-300"/></td>
                                            <td className="p-4 text-xs font-bold text-slate-400">{inquiry.id}</td>
                                            <td className="p-4"><span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{inquiry.category}</span></td>
                                            <td className="p-4"><div className="text-sm font-bold text-slate-800 group-hover:text-[#2b4ea7] transition-colors">{inquiry.title}</div></td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                                        {inquiry.user}
                                                        <UserTypeBadge type={inquiry.userType} />
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 mt-0.5">{inquiry.company}</div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs font-medium text-slate-500">{inquiry.date}</td>
                                            <td className="p-4"><StatusBadge status={inquiry.status} /></td>
                                            <td className="p-4 text-center">
                                                <button className="text-[#2b4ea7] hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-transparent hover:border-blue-100">답변하기</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB 2: DISPUTES --- */}
            {currentTab === 'DISPUTE' && (
                <div className="space-y-6 animate-in fade-in flex flex-col flex-1 min-h-0 overflow-hidden">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><Gavel size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">전체 접수</p><h4 className="text-2xl font-black text-slate-900">{stats.totalDisputes}건</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><AlertTriangle size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">긴급 처리 필요</p><h4 className="text-2xl font-black text-rose-600">{stats.urgentDisputes}건</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Clock size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">중재 진행 중</p><h4 className="text-2xl font-black text-slate-900">{stats.processDisputes}건</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">해결 완료</p><h4 className="text-2xl font-black text-slate-900">{stats.resolvedDisputes}건</h4></div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
                        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                            <div className="flex gap-2 w-full md:w-auto">
                                {['ALL', 'URGENT', 'PROCESS', 'RESOLVED'].map(filter => (
                                    <button 
                                        key={filter}
                                        onClick={() => setDisputeStatusFilter(filter)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            disputeStatusFilter === filter 
                                            ? 'bg-slate-800 text-white shadow-sm' 
                                            : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        {filter === 'ALL' ? '전체 분쟁' : filter === 'URGENT' ? '긴급 처리' : filter === 'PROCESS' ? '중재 중' : '해결 완료'}
                                    </button>
                                ))}
                            </div>
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="분쟁 내용, 프로젝트명 검색" 
                                    className="pl-9 pr-4 h-9 w-full md:w-64 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#2b4ea7] transition-all"
                                    value={disputeSearchTerm}
                                    onChange={(e) => setDisputeSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-x-auto min-w-0">
                            <table className="w-full min-w-[900px] text-left border-collapse">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                        <th className="p-4 font-bold w-20">ID</th>
                                        <th className="p-4 font-bold w-24">유형</th>
                                        <th className="p-4 font-bold">분쟁 내용 / 프로젝트</th>
                                        <th className="p-4 font-bold">당사자 (신고인 vs 피신고인)</th>
                                        <th className="p-4 font-bold">접수일시</th>
                                        <th className="p-4 font-bold">진행상황</th>
                                        <th className="p-4 font-bold">상태</th>
                                        <th className="p-4 font-bold text-center">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredDisputes.map(dispute => (
                                        <tr key={dispute.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                            <td className="p-4 text-xs font-bold text-slate-400">{dispute.id}</td>
                                            <td className="p-4"><span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">{dispute.type}</span></td>
                                            <td className="p-4">
                                                <div className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#2b4ea7] transition-colors">{dispute.title}</div>
                                                <div className="text-xs font-medium text-slate-500 flex items-center gap-1"><Briefcase size={10} /> {dispute.project}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="font-bold text-slate-700">{dispute.claimant}</span>
                                                    <span className="text-slate-300">vs</span>
                                                    <span className="font-bold text-slate-700">{dispute.respondent}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs font-medium text-slate-500">{dispute.date}</td>
                                            <td className="p-4 text-xs font-bold text-slate-600">{dispute.progress}</td>
                                            <td className="p-4"><StatusBadge status={dispute.status} /></td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="text-[#2b4ea7] hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-transparent hover:border-blue-100 whitespace-nowrap">중재하기</button>
                                                    <button className="text-slate-400 hover:text-[#2b4ea7] p-2 hover:bg-slate-100 rounded-full transition-colors"><MoreHorizontal size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB 3: REPORT (Manual List) --- */}
            {currentTab === 'REPORT' && (
                <div className="space-y-6 animate-in fade-in flex flex-col flex-1 min-h-0 overflow-hidden">
                     {/* Report Stats */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><ShieldAlert size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">신고 접수</p><h4 className="text-2xl font-black text-slate-900">{stats.totalReports}건</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><AlertTriangle size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">처리 대기</p><h4 className="text-2xl font-black text-rose-600">{stats.waitingReports}건</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Clock size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">처리 진행 중</p><h4 className="text-2xl font-black text-slate-900">{stats.processReports}건</h4></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={20} /></div>
                            <div><p className="text-xs font-bold text-slate-500 mb-0.5">처리 완료</p><h4 className="text-2xl font-black text-slate-900">{stats.resolvedReports}건</h4></div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
                        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                            <div className="flex gap-2 w-full md:w-auto">
                                {['ALL', 'WAITING', 'PROCESS', 'RESOLVED'].map(filter => (
                                    <button 
                                        key={filter}
                                        onClick={() => setReportStatusFilter(filter)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            reportStatusFilter === filter 
                                            ? 'bg-slate-800 text-white shadow-sm' 
                                            : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        {filter === 'ALL' ? '전체' : filter === 'WAITING' ? '대기' : filter === 'PROCESS' ? '처리중' : '완료'}
                                    </button>
                                ))}
                            </div>
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="내용, 신고자/대상자 검색" 
                                    className="pl-9 pr-4 h-9 w-full md:w-64 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#2b4ea7] transition-all"
                                    value={reportSearchTerm}
                                    onChange={(e) => setReportSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-x-auto min-w-0">
                            <table className="w-full min-w-[900px] text-left border-collapse">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                        <th className="p-4 font-bold w-20">ID</th>
                                        <th className="p-4 font-bold w-24">유형</th>
                                        <th className="p-4 font-bold">신고 내용 / 타겟</th>
                                        <th className="p-4 font-bold">신고자</th>
                                        <th className="p-4 font-bold">대상자 (피신고인)</th>
                                        <th className="p-4 font-bold">접수일시</th>
                                        <th className="p-4 font-bold">상태</th>
                                        <th className="p-4 font-bold text-center">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredReports.map(report => {
                                        const typeInfo = getReportTypeLabel(report.type);
                                        return (
                                            <tr key={report.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                                <td className="p-4 text-xs font-bold text-slate-400">{report.id}</td>
                                                <td className="p-4">
                                                    <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded border whitespace-nowrap ${typeInfo.color}`}>{typeInfo.label}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#2b4ea7] transition-colors">{report.content}</div>
                                                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                        <Tag size={10} /> 타겟: {report.target}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-xs font-bold text-slate-700">{report.reporter}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-xs font-bold text-rose-700">{report.reportedUser}</div>
                                                </td>
                                                <td className="p-4 text-xs font-medium text-slate-500">{report.date}</td>
                                                <td className="p-4"><StatusBadge status={report.status} /></td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button className="text-[#2b4ea7] hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-transparent hover:border-blue-100 whitespace-nowrap">처리하기</button>
                                                        <button className="text-slate-400 hover:text-[#2b4ea7] p-2 hover:bg-slate-100 rounded-full transition-colors"><MoreHorizontal size={18} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportManagement;