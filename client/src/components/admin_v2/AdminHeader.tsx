/**
 * cottoncandy_admin 원본 그대로 - admin_v2 전용 헤더
 */
import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Minimize, Maximize, Bell, CheckCircle2, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { Link } from 'wouter';

interface AdminHeaderProps { activeTab: string; onSwitchToUser?: () => void; }

const NOTIFICATIONS = [
    { id: 1, type: 'URGENT', title: '긴급 분쟁 접수', message: '스튜디오 블랙 vs 마운틴K 환불 요청 건', time: '10분 전', action: '분쟁 조정' },
    { id: 2, type: 'APPROVAL', title: '프로젝트 심사 대기', message: '신규 등록된 3건의 프로젝트 심사가 필요합니다.', time: '1시간 전', action: '심사하기' },
    { id: 3, type: 'SYSTEM', title: '자동 정산 완료', message: '11월 1차 정산(15건)이 자동 처리되었습니다.', time: '2시간 전', action: null },
    { id: 4, type: 'WARNING', title: '금칙어 감지', message: '채팅방 #4022에서 직거래 유도 의심 단어 감지', time: '3시간 전', action: '채팅 확인' },
];

const AdminHeader = ({ activeTab, onSwitchToUser }: AdminHeaderProps) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) { document.exitFullscreen(); setIsFullscreen(false); }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifications(false);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'URGENT': return <ShieldAlert size={16} className="text-rose-500" />;
            case 'APPROVAL': return <CheckCircle2 size={16} className="text-[#2b4ea7]" />;
            case 'WARNING': return <AlertTriangle size={16} className="text-amber-500" />;
            default: return <Clock size={16} className="text-emerald-500" />;
        }
    };

    return (
        <header className="h-16 w-full min-w-full bg-white border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-end shadow-sm">
            <div className="flex items-center gap-4">
               <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-[#2b4ea7] border border-slate-200 hover:border-[#2b4ea7]/50 bg-white hover:bg-[#2b4ea7]/5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                  사용자 화면 바로가기 <ArrowUpRight size={14} />
               </Link>
               <Link href="/admin" className="flex items-center gap-2 text-slate-500 hover:text-[#2b4ea7] border border-slate-200 hover:border-[#2b4ea7]/50 bg-white hover:bg-[#2b4ea7]/5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                  Admin v1으로 가기
               </Link>
               <div className="h-4 w-px bg-slate-200"></div>
                <button onClick={toggleFullScreen} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors" title={isFullscreen ? "전체화면 종료" : "전체화면"}>
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
               <div className="relative" ref={notifRef}>
                   <button onClick={() => setShowNotifications(!showNotifications)} className={`relative p-2 rounded-full transition-all ${showNotifications ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                      <Bell size={20} />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                   </button>
                   {showNotifications && (
                       <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                               <h3 className="font-black text-slate-900 text-sm">Action Center</h3>
                               <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">4 Pending</span>
                           </div>
                           <div className="max-h-[400px] overflow-y-auto">
                               {NOTIFICATIONS.map((item) => (
                                   <div key={item.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group relative">
                                       <div className="flex gap-3">
                                           <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.type === 'URGENT' ? 'bg-rose-50' : item.type === 'APPROVAL' ? 'bg-blue-50' : item.type === 'WARNING' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                                               {getIcon(item.type)}
                                           </div>
                                           <div className="flex-1">
                                               <div className="flex justify-between items-start mb-1">
                                                   <span className="text-xs font-bold text-slate-900">{item.title}</span>
                                                   <span className="text-[10px] text-slate-400">{item.time}</span>
                                               </div>
                                               <p className="text-xs text-slate-500 leading-snug mb-2">{item.message}</p>
                                               {item.action && (
                                                   <button className="text-[10px] font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors w-full flex items-center justify-center gap-1">{item.action} <ArrowUpRight size={10} /></button>
                                               )}
                                           </div>
                                       </div>
                                   </div>
                               ))}
                           </div>
                           <div className="p-2 bg-slate-50 text-center border-t border-slate-100">
                               <button className="text-[10px] font-bold text-slate-500 hover:text-[#2b4ea7] transition-colors">모든 알림 보기</button>
                           </div>
                       </div>
                   )}
               </div>
               <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="text-right hidden md:block">
                     <p className="text-xs font-bold text-slate-900">최고관리자</p>
                     <p className="text-[10px] text-slate-400">master</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">OP</div>
               </div>
            </div>
        </header>
    );
};

export default AdminHeader;
