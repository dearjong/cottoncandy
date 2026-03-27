import React, { useState } from 'react';
import { 
    TrendingUp, DollarSign, Users, Activity, Calendar, 
    Download, ChevronDown, ArrowUpRight, ArrowDownRight,
    PieChart, BarChart3, Wallet, CreditCard, Layers,
    MessageCircle, Flag, Briefcase, CheckSquare
} from 'lucide-react';
import { MOCK_ALL_INQUIRIES, MOCK_REPORTS, MOCK_PROJECTS } from '@/data/mockData';

// Mock Data for Analytics
const CHART_DATA = [
    { month: '1월', tvcf: 2500, digital: 2000 },
    { month: '2월', tvcf: 2800, digital: 2400 },
    { month: '3월', tvcf: 2600, digital: 2200 },
    { month: '4월', tvcf: 3200, digital: 2900 },
    { month: '5월', tvcf: 3000, digital: 2900 },
    { month: '6월', tvcf: 3800, digital: 3400 },
    { month: '7월', tvcf: 4200, digital: 4300 },
    { month: '8월', tvcf: 4000, digital: 4100 },
    { month: '9월', tvcf: 4800, digital: 4400 },
    { month: '10월', tvcf: 5500, digital: 5000 },
    { month: '11월', tvcf: 5800, digital: 5400 },
    { month: '12월', tvcf: 6500, digital: 6000 },
];

const CATEGORY_DISTRIBUTION = [
    { label: 'TVCF', value: 35, color: '#2b4ea7' },
    { label: '바이럴', value: 25, color: '#3b82f6' },
    { label: '유튜브', value: 20, color: '#60a5fa' },
    { label: '모션그래픽', value: 15, color: '#93c5fd' },
    { label: '기타', value: 5, color: '#e2e8f0' },
];

const TOP_PARTNERS = [
    { rank: 1, name: '제일기획', type: 'AGENCY', amount: '12억 5,000만원', projects: 15, growth: '+12%' },
    { rank: 2, name: '스튜디오 블랙', type: 'PRODUCTION', amount: '8억 2,000만원', projects: 24, growth: '+25%' },
    { rank: 3, name: '크리에이티브 랩', type: 'PRODUCTION', amount: '5억 4,000만원', projects: 18, growth: '+8%' },
    { rank: 4, name: '영상공작소 픽셀', type: 'PRODUCTION', amount: '3억 1,000만원', projects: 42, growth: '+150%' },
    { rank: 5, name: 'HS Ad', type: 'AGENCY', amount: '2억 8,000만원', projects: 4, growth: '-5%' },
];

const SimpleDonutChart = ({ data }: { data: typeof CATEGORY_DISTRIBUTION }) => {
    let cumulativePercent = 0;
    
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg viewBox="-1 -1 2 2" className="w-full h-full rotate-[-90deg]">
                {data.map((slice, i) => {
                    const start = cumulativePercent;
                    const slicePercent = slice.value / 100;
                    cumulativePercent += slicePercent;
                    
                    const [startX, startY] = getCoordinatesForPercent(start);
                    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                    const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
                    
                    const pathData = [
                        `M ${startX} ${startY}`,
                        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                        `L 0 0`,
                    ].join(' ');

                    return (
                        <path 
                            key={i} 
                            d={pathData} 
                            fill={slice.color} 
                            stroke="white" 
                            strokeWidth="0.02" 
                            className="hover:opacity-90 transition-opacity cursor-pointer"
                        />
                    );
                })}
                <circle cx="0" cy="0" r="0.65" fill="white" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
                <span className="text-sm font-black text-slate-800">1,250건</span>
            </div>
        </div>
    );
};

const SimpleBarChart = () => {
    // Max Value Calculation for Y-Axis Scaling
    const maxVal = Math.max(...CHART_DATA.map(d => d.tvcf + d.digital));
    const yMax = Math.ceil(maxVal / 1000) * 1000 + 1500; // Add generous headroom for labels

    return (
        <div className="relative h-36 w-full mt-1 select-none pt-4">
             {/* Y-axis Grid Lines & Labels */}
             <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-300 font-bold z-0 pointer-events-none pb-5 pl-8 pt-4">
                {[1, 0.75, 0.5, 0.25, 0].map((tick, i) => (
                    <div key={i} className="flex items-center w-full h-0 relative">
                        <span className="w-7 text-right pr-2 -translate-y-1/2 absolute left-0 text-[9px]">
                            {(yMax * tick / 10000).toFixed(1)}억
                        </span>
                        <div className="w-full border-t border-dashed border-slate-100 ml-0"></div>
                    </div>
                ))}
             </div>

             {/* Chart Bars Area */}
             <div className="absolute inset-0 flex items-end justify-between pl-8 pr-1 pb-5 z-10 pt-4 gap-0.5 md:gap-1">
                {CHART_DATA.map((d, i) => {
                    const tvcfPct = (d.tvcf / yMax) * 100;
                    const digitalPct = (d.digital / yMax) * 100;
                    const totalVal = d.tvcf + d.digital;
                    const totalPct = (totalVal / yMax) * 100;

                    return (
                        <div key={i} className="flex-1 flex flex-col justify-end items-center h-full group relative">
                            {/* Value Label (Directly Visible) */}
                            <div 
                                className="absolute w-full text-center transition-all duration-300 z-20 pointer-events-none group-hover:-translate-y-1"
                                style={{ bottom: `${totalPct}%`, marginBottom: '6px' }}
                            >
                                <span className="text-[9px] font-black text-slate-700 bg-white/90 px-1 py-0.5 rounded shadow-sm border border-slate-100 block mx-auto w-fit whitespace-nowrap">
                                    {(totalVal / 10000).toFixed(1)}억
                                </span>
                            </div>

                            {/* Stacked Bar Container */}
                            <div 
                                className="w-full max-w-[28px] flex flex-col-reverse justify-start rounded-t overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:brightness-105 bg-slate-50 cursor-pointer"
                                style={{ height: `${totalPct}%` }}
                            >
                                {/* Bottom Segment: TVCF (Blue) */}
                                <div style={{ height: `${(d.tvcf/totalVal)*100}%` }} className="w-full bg-[#2b4ea7] relative transition-all group-hover:bg-[#1e3a8a]"></div>
                                {/* Top Segment: Digital (Light Blue) */}
                                <div style={{ height: `${(d.digital/totalVal)*100}%` }} className="w-full bg-[#93c5fd] relative transition-all group-hover:bg-[#60a5fa]"></div>
                            </div>
                            
                            {/* X-axis Label */}
                            <span className="absolute -bottom-3 text-[9px] font-bold text-slate-400 whitespace-nowrap group-hover:text-slate-900 transition-colors">{d.month}</span>

                            {/* Hover Tooltip - Detailed Breakdown */}
                            <div className="absolute bottom-full mb-4 bg-slate-900 text-white text-[10px] rounded py-2 px-2.5 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 min-w-[110px] transform -translate-x-1/2 left-1/2 translate-y-1 group-hover:translate-y-0">
                                <div className="font-bold mb-1.5 border-b border-white/20 pb-1.5 text-center">{d.month} 상세 내역</div>
                                <div className="space-y-1">
                                    <div className="flex justify-between gap-3 text-[10px]">
                                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#93c5fd]"></div>디지털</span>
                                        <span className="font-bold font-mono">{(d.digital/10000).toFixed(1)}억</span>
                                    </div>
                                    <div className="flex justify-between gap-3 text-[10px]">
                                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#2b4ea7]"></div>TVCF</span>
                                        <span className="font-bold font-mono">{(d.tvcf/10000).toFixed(1)}억</span>
                                    </div>
                                    <div className="flex justify-between gap-3 text-[10px] mt-1 pt-1 border-t border-white/10 font-bold text-emerald-400">
                                        <span>합계</span>
                                        <span className="font-mono">{(totalVal/10000).toFixed(1)}억</span>
                                    </div>
                                </div>
                                {/* Tooltip Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-900"></div>
                            </div>
                        </div>
                    );
                })}
             </div>
        </div>
    );
};

const REPORT_TYPE_LABELS: Record<string, string> = { ABUSE: '욕설/비방', SPAM: '스팸', CONTACT: '직거래 유도', ETC: '기타' };

const DATE_RANGE_OPTIONS = ['전체', '연', '월', '주', '일'] as const;
type DateRangeOption = typeof DATE_RANGE_OPTIONS[number];

const AnalyticsDashboard = ({ onTabChange }: { onTabChange?: (tab: string) => void }) => {
    const [dateRange, setDateRange] = useState<DateRangeOption>('연');
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const waitingInquiries = MOCK_ALL_INQUIRIES.filter(i => i.status === 'WAITING').length;
    const waitingReports = MOCK_REPORTS.filter(r => r.status === 'WAITING').length;
    const recentInquiries = MOCK_ALL_INQUIRIES.slice(0, 2);
    const recentReports = MOCK_REPORTS.slice(0, 1);
    const recentProjects = [...MOCK_PROJECTS].sort((a, b) => (b.submittedDate || '').localeCompare(a.submittedDate || '')).slice(0, 4);
    const approvalNeeded = MOCK_PROJECTS.filter(p => p.type === 'PUBLIC' && p.status === 'REQUESTED').slice(0, 4);

    return (
        <div className="space-y-4 animate-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">대시보드</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">주요 지표·통계와 1:1 문의·신고 현황을 한눈에 확인하세요.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <button
                          type="button"
                          className="h-10 px-4 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50"
                          onClick={() => setIsDateMenuOpen((prev) => !prev)}
                        >
                            <Calendar size={16} className="text-slate-400" />
                            {dateRange === '연' ? '2024년 전체' : dateRange}
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>
                        {isDateMenuOpen && (
                          <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                              {DATE_RANGE_OPTIONS.map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  className={`w-full text-left px-3 py-1.5 text-xs font-bold ${
                                    dateRange === option
                                      ? 'text-[#2b4ea7] bg-[#2b4ea7]/5'
                                      : 'text-slate-600 hover:bg-slate-50'
                                  }`}
                                  onClick={() => {
                                    setDateRange(option);
                                    setIsDateMenuOpen(false);
                                  }}
                                >
                                  {option}
                                </button>
                              ))}
                          </div>
                        )}
                    </div>
                    <button className="h-10 px-4 bg-[#2b4ea7] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#203b80] shadow-sm">
                        <Download size={16} /> 리포트 다운로드
                    </button>
                </div>
            </div>

            {/* 1:1 문의 · 신고(넓게) · KPI(압축) 한 줄 */}
            <div className="grid grid-cols-2 md:grid-cols-8 gap-3">
                {/* 1:1 문의 (넓은 영역) */}
                <div className="md:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-w-0">
                    <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <MessageCircle size={16} className="text-[#2b4ea7] shrink-0" />
                            <h3 className="font-bold text-slate-800 text-xs truncate">1:1 문의</h3>
                        </div>
                        {onTabChange && (
                            <button onClick={() => onTabChange('support-inquiry')} className="text-[10px] font-bold text-slate-400 hover:text-[#2b4ea7] shrink-0">전체</button>
                        )}
                    </div>
                    <div className="p-3 flex-1 min-h-0 flex flex-col">
                        <div className="flex items-baseline gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-slate-500">답변대기</span>
                            <span className="text-base font-black text-slate-900">{waitingInquiries}건</span>
                        </div>
                        <ul className="space-y-1 min-w-0">
                            {recentInquiries.map((q) => (
                                <li key={q.id} className="text-xs text-slate-600 truncate">{q.title}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* 신고 (넓은 영역) */}
                <div className="md:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col min-w-0">
                    <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <Flag size={16} className="text-rose-500 shrink-0" />
                            <h3 className="font-bold text-slate-800 text-xs truncate">신고</h3>
                        </div>
                        {onTabChange && (
                            <button onClick={() => onTabChange('support-report')} className="text-[10px] font-bold text-slate-400 hover:text-[#2b4ea7] shrink-0">전체</button>
                        )}
                    </div>
                    <div className="p-3 flex-1 min-h-0 flex flex-col">
                        <div className="flex items-baseline gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-slate-500">처리대기</span>
                            <span className="text-base font-black text-slate-900">{waitingReports}건</span>
                        </div>
                        <ul className="space-y-1 min-w-0">
                            {recentReports.map((r) => (
                                <li key={r.id} className="text-xs text-slate-600 truncate">{REPORT_TYPE_LABELS[r.type] || r.type} · {r.content}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* KPI 카드 4개 (더 압축) */}
                {[
                    { title: '총 거래액 (GMV)', value: '125.4억', trend: '+12.5%', up: true, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: '총 매출 (수수료)', value: '12.5억', trend: '+8.2%', up: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { title: '신규 파트너', value: '1,240개사', trend: '+24.5%', up: true, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { title: '매칭률', value: '85.2%', trend: '-2.1%', up: false, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((stat, i) => (
                    <div key={i} className="md:col-span-1 bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between min-h-[96px] relative overflow-hidden group hover:border-[#2b4ea7]/30 transition-all">
                        <div className="flex justify-between items-start gap-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <span className={`text-base font-bold ${stat.up ? 'text-emerald-600' : 'text-rose-500'}`}>{stat.trend}</span>
                        </div>
                        <div className="min-w-0 mt-2">
                            <p className="text-base font-bold text-slate-500 truncate">{stat.title}</p>
                            <p className="text-2xl font-black text-slate-900 truncate leading-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section (컴팩트) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start mt-4">
                {/* Main Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-3">
                    <div className="flex justify-between items-center mb-2 mt-0.5">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                                <BarChart3 size={16} className="text-slate-400"/>
                                월별 거래액 추이
                            </h3>
                            <p className="text-[10px] text-slate-500 mt-0.5">2024년 1~12월</p>
                        </div>
                        <div className="flex gap-1.5">
                             <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 px-2 py-0.5 bg-slate-50 rounded border border-slate-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#2b4ea7]"></div> TVCF
                             </div>
                             <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 px-2 py-0.5 bg-slate-50 rounded border border-slate-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#93c5fd]"></div> 디지털
                             </div>
                        </div>
                    </div>
                    <SimpleBarChart />
                </div>

                {/* Donut Chart */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 flex flex-col items-center">
                    <div className="w-full mb-1.5 mt-0.5">
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                            <PieChart size={16} className="text-slate-400"/>
                            카테고리별 비중
                        </h3>
                    </div>
                    <SimpleDonutChart data={CATEGORY_DISTRIBUTION} />
                    <div className="w-full mt-1.5 space-y-0.5">
                        {CATEGORY_DISTRIBUTION.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-[11px]">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                                    <span className="font-bold text-slate-600 truncate">{item.label}</span>
                                </div>
                                <span className="font-bold text-slate-900 shrink-0">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4개 한 줄: 신규 등록 · 승인 필요 · 매출 TOP 5 · 퍼널 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-start min-w-0">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-w-0">
                    <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center gap-1">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate min-w-0">
                            <Briefcase size={14} className="text-slate-400 shrink-0"/> 신규 등록
                        </h3>
                        {onTabChange && (
                            <button onClick={() => onTabChange('projects')} className="text-xs font-bold text-slate-400 hover:text-[#2b4ea7] shrink-0">전체</button>
                        )}
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {recentProjects.slice(0, 3).map((p) => (
                            <li key={p.id} className="px-3 py-2 hover:bg-slate-50/50 min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate">{p.title}</div>
                                <div className="text-[11px] text-slate-500 truncate mt-0.5">{p.clientName}</div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-w-0">
                    <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center gap-1">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate min-w-0">
                            <CheckSquare size={14} className="text-amber-500 shrink-0"/> 승인 필요
                        </h3>
                        {onTabChange && (
                            <button onClick={() => onTabChange('projects-unapproved')} className="text-xs font-bold text-slate-400 hover:text-[#2b4ea7] shrink-0">전체</button>
                        )}
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {approvalNeeded.length === 0 ? (
                            <li className="px-3 py-2 text-xs text-slate-400">없음</li>
                        ) : (
                            approvalNeeded.slice(0, 3).map((p) => (
                                <li key={p.id} className="px-3 py-2 hover:bg-slate-50/50 min-w-0">
                                    <div className="text-xs font-bold text-slate-800 truncate">{p.title}</div>
                                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{p.clientName}</div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-w-0">
                    <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center gap-1">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate min-w-0">
                            <CreditCard size={14} className="text-slate-400 shrink-0"/> 매출 TOP 5
                        </h3>
                        <button className="text-xs font-bold text-slate-400 hover:text-[#2b4ea7] shrink-0">전체</button>
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {TOP_PARTNERS.map((partner) => (
                            <li key={partner.rank} className="px-3 py-2 hover:bg-slate-50/50 flex items-center justify-between gap-2 min-w-0">
                                <span className="w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black bg-slate-100 text-slate-500 shrink-0">{partner.rank}</span>
                                <span className="text-xs font-bold text-slate-800 truncate min-w-0">{partner.name}</span>
                                <span className="text-xs font-bold text-slate-600 shrink-0">{partner.amount}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                        <Layers size={14} className="text-slate-400 shrink-0"/> 퍼널
                    </h3>
                    <div className="space-y-1.5">
                        {[
                            { step: '방문자', count: '45,200', percent: 100, color: 'bg-slate-200' },
                            { step: '회원가입', count: '3,840', percent: 8.5, color: 'bg-blue-200' },
                            { step: '프로젝트', count: '1,250', percent: 32.5, color: 'bg-blue-400' },
                            { step: '계약', count: '980', percent: 78.4, color: 'bg-[#2b4ea7]' },
                        ].map((item, i, arr) => (
                            <div key={item.step} className="relative">
                                <div className="flex justify-between items-center gap-1 mb-0.5">
                                    <span className="text-xs font-bold text-slate-600 truncate">{item.step}</span>
                                    <span className="text-xs font-black text-slate-900 shrink-0">{item.count}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${item.color}`} 
                                        style={{ width: i === 0 ? '100%' : `${(parseInt(item.count.replace(/,/g,'')) / parseInt(arr[0].count.replace(/,/g,''))) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;