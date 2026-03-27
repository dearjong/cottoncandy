import React, { useMemo } from 'react';
import { 
    FileText, CheckSquare, ArrowRight, CheckCircle, XCircle, 
    ArrowUpRight, Megaphone, Send, Headphones, AlertTriangle,
    Medal, Crown, Info, Star, Download, Users, DollarSign,
    Briefcase, Activity, PieChart, BarChart3, Zap, Clock, BellRing,
    Bell
} from 'lucide-react';
import { MOCK_APPROVAL_QUEUE, MOCK_INQUIRIES, MOCK_DISPUTES, MOCK_COMPANIES, MOCK_NOTIFICATION_LOGS } from '@/data/mockData';
import { NotificationTypeBadge, StatusBadge } from '@/components/Badges';

const AdminHome = () => {
    // Calculate Grade Stats (Existing Logic)
    const gradeStats = useMemo(() => {
        const total = MOCK_COMPANIES.length;
        const counts = {
            GOLD: MOCK_COMPANIES.filter(c => c.grade === 'GOLD').length,
            SILVER: MOCK_COMPANIES.filter(c => c.grade === 'SILVER').length,
            BRONZE: MOCK_COMPANIES.filter(c => c.grade === 'BRONZE').length,
            NEW: MOCK_COMPANIES.filter(c => c.grade === 'NEW').length,
        };
        return { total, counts };
    }, []);

    // Calculate Notification Stats for Dashboard
    const notificationStats = useMemo(() => {
        const totalSent = MOCK_NOTIFICATION_LOGS.reduce((acc, curr) => acc + curr.count, 0);
        // Mocking a 'today' count or simply using the total for display
        const todaySent = Math.floor(totalSent * 0.3); // Example ratio
        return {
            total: totalSent,
            today: todaySent,
            successRate: '98.5%'
        };
    }, []);

    return (
        <div className="space-y-6 animate-in">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-black text-slate-900">운영 커맨드 센터</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">운영자가 직접 개입해야 할 'Action Item'과 주요 알림 발송 현황을 확인하세요.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold">
                    <Clock size={14} className="text-slate-400"/>
                    마지막 업데이트: 방금 전
                </div>
            </div>

            {/* 1. Key Metrics (Operational Health) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Urgent Actions */}
                <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all cursor-pointer">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">긴급 처리 필요</span>
                            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-900">3<span className="text-lg text-slate-500 font-bold ml-1">건</span></h4>
                        <p className="text-[10px] text-rose-600 mt-1 font-medium">분쟁 1건 / 신고 2건</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-sm relative z-10">
                        <AlertTriangle size={24} />
                    </div>
                </div>

                {/* Approval Queue */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden group hover:border-[#2b4ea7] transition-all cursor-pointer">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">승인 대기</span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-900">{MOCK_APPROVAL_QUEUE.length}<span className="text-lg text-slate-500 font-bold ml-1">건</span></h4>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">프로젝트 심사 대기중</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shadow-sm group-hover:text-[#2b4ea7] group-hover:bg-[#2b4ea7]/10 transition-colors">
                        <CheckSquare size={24} />
                    </div>
                </div>

                {/* Notification History (Replaced Automated Tasks) */}
                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all cursor-pointer">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">알림 발송 (금일)</span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-900">{notificationStats.today}<span className="text-lg text-slate-500 font-bold ml-1">건</span></h4>
                        <p className="text-[10px] text-indigo-600 mt-1 font-medium flex items-center gap-1">
                            <CheckCircle size={10}/> 성공률 {notificationStats.successRate}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-sm relative z-10">
                        <Bell size={24} />
                    </div>
                </div>

                {/* Active Projects */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-all">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">진행 중 프로젝트</span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-900">42<span className="text-lg text-slate-500 font-bold ml-1">건</span></h4>
                        <p className="text-[10px] text-emerald-600 mt-1 font-bold">+4 전일 대비</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                        <Activity size={24} />
                    </div>
                </div>
            </div>

            {/* 2. Action Items & Notification Log */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 2-1. Manual Action Queue (운영자가 직접 해야 할 일) */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                <BellRing size={16} className="text-[#2b4ea7]"/> Action Items (할 일)
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">운영자 확인 및 승인이 필요한 대기 항목입니다.</p>
                        </div>
                        <span className="bg-[#2b4ea7] text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            {MOCK_APPROVAL_QUEUE.length + MOCK_DISPUTES.length}건 대기
                        </span>
                    </div>
                    <div className="divide-y divide-slate-50 flex-1 overflow-auto max-h-[400px]">
                        {/* Urgent Disputes First */}
                        {MOCK_DISPUTES.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-rose-50/30 transition-colors flex items-center justify-between gap-3 border-l-4 border-rose-500 bg-rose-50/10">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[9px] font-bold text-white bg-rose-500 px-1.5 rounded-sm">긴급</span>
                                        <span className="text-[10px] font-bold text-slate-400">{item.id}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 truncate mb-1">{item.title}</h4>
                                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                        <AlertTriangle size={12} className="text-rose-400"/>
                                        <span>{item.type}</span>
                                        <span className="w-0.5 h-2 bg-slate-200"></span>
                                        <span>{item.time}</span>
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors shadow-sm">
                                    해결하기
                                </button>
                            </div>
                        ))}

                        {/* Approval Items */}
                        {MOCK_APPROVAL_QUEUE.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 border-l-4 border-transparent hover:border-[#2b4ea7]">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold text-slate-400">{item.id}</span>
                                        {item.delayed && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 rounded">지연 {item.daysDelayed}일</span>}
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 truncate mb-1">{item.title}</h4>
                                    <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-[11px] text-slate-500">
                                        <span className="font-medium text-slate-700">{item.client}</span>
                                        <span className="w-0.5 h-2 bg-slate-200"></span>
                                        <span className="text-slate-900 font-medium">{item.budget}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-colors">
                                        승인
                                    </button>
                                    <button className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-colors">
                                        상세
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2-2. Notification History (Replaced Automation Feed) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                <Send size={16} className="text-indigo-500"/> 알림 발송 이력
                            </h3>
                            <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600">
                                전체보기
                            </button>
                        </div>
                        <div className="divide-y divide-slate-50 flex-1 overflow-auto max-h-[400px]">
                            {MOCK_NOTIFICATION_LOGS.slice(0, 5).map((log, i) => (
                                <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <NotificationTypeBadge type={log.type} />
                                            <span className="text-[10px] text-slate-400">{log.sentDate.split(' ')[1]}</span>
                                        </div>
                                        <StatusBadge status={log.status} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-800 mb-1 line-clamp-1">{log.title}</p>
                                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                                        <span>To. {log.target}</span>
                                        <span className="font-medium text-slate-700">{log.count}건 발송</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                            <p className="text-[10px] text-slate-500">
                                최근 24시간 내 발송된 알림입니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;