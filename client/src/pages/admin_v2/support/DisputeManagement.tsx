import React, { useState, useMemo } from 'react';
import { 
    Search, AlertTriangle, MoreHorizontal, Briefcase, Gavel, 
    CheckCircle2, Clock, MessageSquare, AlertOctagon, User, ShieldAlert,
    Lock, Eye, ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';
import { StatusBadge, RiskLevelBadge } from '@/components/Badges';
import { MOCK_ALL_DISPUTES, MOCK_MESSAGE_ROOMS, MOCK_CHAT_LOGS } from '@/data/mockData';

const DisputeManagement = () => {
    // Tab State
    const [mainTab, setMainTab] = useState<'DISPUTES' | 'MESSAGES'>('DISPUTES');

    // Dispute Tab States
    const [disputeStatusFilter, setDisputeStatusFilter] = useState('ALL');
    const [disputeSearchTerm, setDisputeSearchTerm] = useState('');

    // Message Tab States
    const [msgStatusFilter, setMsgStatusFilter] = useState('ALL');
    const [msgSearchTerm, setMsgSearchTerm] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [isChatUnlocked, setIsChatUnlocked] = useState(false);
    const [accessReason, setAccessReason] = useState('');

    // --- Dispute Data Logic ---
    const disputeStats = useMemo(() => ({
        total: MOCK_ALL_DISPUTES.length,
        urgent: MOCK_ALL_DISPUTES.filter(d => d.status === 'URGENT').length,
        process: MOCK_ALL_DISPUTES.filter(d => d.status === 'PROCESS').length,
        resolved: MOCK_ALL_DISPUTES.filter(d => d.status === 'RESOLVED').length,
    }), []);

    const filteredDisputes = useMemo(() => {
        return MOCK_ALL_DISPUTES.filter(item => {
            const matchesStatus = disputeStatusFilter === 'ALL' || item.status === disputeStatusFilter;
            const matchesSearch = item.title.includes(disputeSearchTerm) || item.project.includes(disputeSearchTerm);
            return matchesStatus && matchesSearch;
        });
    }, [disputeStatusFilter, disputeSearchTerm]);

    // --- Message Data Logic ---
    const filteredRooms = useMemo(() => {
        return MOCK_MESSAGE_ROOMS.filter(room => {
            const matchesStatus = msgStatusFilter === 'ALL' || 
                (msgStatusFilter === 'REPORTED' ? room.status === 'REPORTED' : room.riskLevel === msgStatusFilter);
            
            const matchesSearch = 
                room.participants.some(p => p.includes(msgSearchTerm)) || 
                room.project.includes(msgSearchTerm);
            
            return matchesStatus && matchesSearch;
        });
    }, [msgStatusFilter, msgSearchTerm]);

    const msgStats = useMemo(() => ({
        total: MOCK_MESSAGE_ROOMS.length,
        reported: MOCK_MESSAGE_ROOMS.filter(r => r.status === 'REPORTED').length,
        warning: MOCK_MESSAGE_ROOMS.filter(r => r.riskLevel === 'WARNING').length,
        caution: MOCK_MESSAGE_ROOMS.filter(r => r.riskLevel === 'CAUTION').length,
    }), []);

    const selectedRoom = MOCK_MESSAGE_ROOMS.find(r => r.id === selectedRoomId);

    // Reset lock when changing rooms
    const handleRoomSelect = (roomId: string) => {
        setSelectedRoomId(roomId);
        setIsChatUnlocked(false);
        setAccessReason('');
    };

    const handleUnlockChat = () => {
        if (!accessReason) {
            alert("열람 사유를 선택해주세요.");
            return;
        }
        // In a real app, this would log the access action to the server
        console.log(`Access Logged: Room ${selectedRoomId}, Reason: ${accessReason}, User: Admin`);
        setIsChatUnlocked(true);
    };

    return (
        <div className="space-y-4 animate-in flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">분쟁 및 신고</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">프로젝트 분쟁 조정 및 신고된 메시지를 심사합니다.</p>
                </div>
            </div>

            {/* Main Tabs (Style matching ContentManagement) */}
            <div className="flex border-b border-slate-200 shrink-0">
                {[
                    { id: 'DISPUTES', label: '분쟁 접수 현황', icon: Gavel },
                    { id: 'MESSAGES', label: '메시지 심사', icon: MessageSquare },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setMainTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all ${
                            mainTab === tab.id
                            ? 'border-[#2b4ea7] text-[#2b4ea7]'
                            : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {tab.id === 'MESSAGES' && (msgStats.reported > 0 || msgStats.warning > 0) && (
                            <span className="flex h-1.5 w-1.5 relative -top-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT: DISPUTES */}
            {mainTab === 'DISPUTES' && (
                <div className="space-y-6 animate-in fade-in overflow-auto p-1">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                <Gavel size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 mb-0.5">전체 접수</p>
                                <h4 className="text-2xl font-black text-slate-900">{disputeStats.total}건</h4>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 mb-0.5">긴급 처리 필요</p>
                                <h4 className="text-2xl font-black text-rose-600">{disputeStats.urgent}건</h4>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 mb-0.5">중재 진행 중</p>
                                <h4 className="text-2xl font-black text-slate-900">{disputeStats.process}건</h4>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 mb-0.5">해결 완료</p>
                                <h4 className="text-2xl font-black text-slate-900">{disputeStats.resolved}건</h4>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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

                        <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
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
                                {filteredDisputes.length > 0 ? filteredDisputes.map(dispute => (
                                    <tr key={dispute.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                        <td className="p-4 text-xs font-bold text-slate-400">{dispute.id}</td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">{dispute.type}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#2b4ea7] transition-colors">{dispute.title}</div>
                                            <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                <Briefcase size={10} /> {dispute.project}
                                            </div>
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
                                            <button className="text-slate-400 hover:text-[#2b4ea7] p-2 hover:bg-slate-100 rounded-full transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="p-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Gavel size={48} className="mb-4 opacity-10"/>
                                                <p className="text-sm font-medium text-slate-500 mb-1">등록된 분쟁 내역이 없습니다.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: MESSAGES (Monitoring) */}
            {mainTab === 'MESSAGES' && (
                <div className="flex flex-col flex-1 gap-4 min-h-0 animate-in fade-in overflow-hidden p-1">
                     {/* Monitoring Stats */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 mb-0.5">전체 채팅방</p>
                                <h4 className="text-2xl font-black text-slate-900">{msgStats.total}</h4>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 mb-0.5">신고 접수</p>
                                <h4 className="text-2xl font-black text-rose-600">{msgStats.reported}건</h4>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <AlertOctagon size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 mb-0.5">키워드 감지(위험)</p>
                                <h4 className="text-2xl font-black text-slate-900">{msgStats.warning}건</h4>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 mb-0.5">키워드 감지(주의)</p>
                                <h4 className="text-2xl font-black text-slate-900">{msgStats.caution}건</h4>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-1 gap-6 min-h-0">
                        {/* Room List */}
                        <div className={`flex-1 flex flex-col min-w-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${selectedRoomId ? 'hidden md:flex md:w-1/2 lg:w-3/5' : 'w-full'}`}>
                             <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                                <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                                     {[
                                        { id: 'ALL', label: '전체' },
                                        { id: 'REPORTED', label: '신고접수' },
                                        { id: 'WARNING', label: '위험감지' },
                                        { id: 'CAUTION', label: '주의필요' },
                                    ].map(filter => (
                                        <button 
                                            key={filter.id}
                                            onClick={() => setMsgStatusFilter(filter.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                                                msgStatusFilter === filter.id 
                                                ? 'bg-slate-800 text-white border-slate-800' 
                                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-auto">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input 
                                        type="text" 
                                        placeholder="참여자, 프로젝트명 검색" 
                                        className="pl-9 pr-4 h-9 w-full md:w-56 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#2b4ea7] transition-all"
                                        value={msgSearchTerm}
                                        onChange={(e) => setMsgSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-slate-50 z-10">
                                        <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                            <th className="p-4 font-bold w-20">ID</th>
                                            <th className="p-4 font-bold w-24">위험도</th>
                                            <th className="p-4 font-bold">프로젝트 / 참여자</th>
                                            <th className="p-4 font-bold">최근 메시지</th>
                                            <th className="p-4 font-bold w-24">상태</th>
                                            <th className="p-4 font-bold w-12 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredRooms.map(room => (
                                            <tr 
                                                key={room.id} 
                                                onClick={() => handleRoomSelect(room.id)}
                                                className={`cursor-pointer transition-colors group ${
                                                    selectedRoomId === room.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                                                }`}
                                            >
                                                <td className="p-4 text-xs font-bold text-slate-400">{room.id.split('-')[1]}..</td>
                                                <td className="p-4"><RiskLevelBadge level={room.riskLevel} /></td>
                                                <td className="p-4">
                                                    <div className="text-xs font-bold text-slate-800 mb-1 line-clamp-1">{room.project}</div>
                                                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                                        <User size={10} />
                                                        {room.participants.join(', ')}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-xs text-slate-600 line-clamp-1 mb-1">{room.lastMessage}</div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-slate-400">{room.date}</span>
                                                        {room.keywords.length > 0 && (
                                                            <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                                                                {room.keywords[0]} 감지
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4"><StatusBadge status={room.status} /></td>
                                                <td className="p-4 text-center">
                                                    <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#2b4ea7] transition-colors">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right: Chat Detail (Protected) */}
                        {selectedRoomId && selectedRoom && (
                            <div className="w-full md:w-1/2 lg:w-2/5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 relative">
                                {/* Header */}
                                <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/80">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-slate-400">{selectedRoom.id}</span>
                                            <StatusBadge status={selectedRoom.status} />
                                            <RiskLevelBadge level={selectedRoom.riskLevel} />
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm mb-1">{selectedRoom.project}</h3>
                                        <p className="text-xs text-slate-500">참여자: {selectedRoom.participants.join(', ')}</p>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedRoomId(null)}
                                        className="md:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                                    >
                                        <ChevronRight size={18} className="rotate-180"/>
                                    </button>
                                </div>
                                
                                {/* Safeguard Layer / Chat Content */}
                                <div className="flex-1 overflow-hidden relative bg-slate-50/30">
                                    {!isChatUnlocked ? (
                                        <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex items-center justify-center p-6">
                                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-sm w-full text-center">
                                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                                                    <Lock size={24} />
                                                </div>
                                                <h3 className="text-lg font-black text-slate-900 mb-2">대화 내용 열람 제한</h3>
                                                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                                                    개인정보 보호를 위해 대화 내역 조회는<br/> 
                                                    <strong className="text-slate-700">분쟁 조정 및 신고 조사 목적</strong>으로만 제한됩니다.<br/>
                                                    열람 기록은 시스템에 영구적으로 저장됩니다.
                                                </p>
                                                
                                                <div className="space-y-3 mb-6">
                                                    <div className="text-left">
                                                        <label className="text-[10px] font-bold text-slate-500 block mb-1.5 ml-1">열람 사유 선택 (필수)</label>
                                                        <select 
                                                            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#2b4ea7]"
                                                            value={accessReason}
                                                            onChange={(e) => setAccessReason(e.target.value)}
                                                        >
                                                            <option value="">사유를 선택해주세요</option>
                                                            <option value="REPORT_INVESTIGATION">신고 접수 건 사실 관계 조사</option>
                                                            <option value="DISPUTE_MEDIATION">분쟁 조정 증거 자료 확인</option>
                                                            <option value="ILLEGAL_MONITORING">불법/유해 정보 필터링 감지</option>
                                                            <option value="OTHER">기타 관리자 직권 (사유서 별도 제출)</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={handleUnlockChat}
                                                    disabled={!accessReason}
                                                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                                        accessReason 
                                                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg' 
                                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {accessReason ? <><Eye size={16} /> 대화 열람하기 (로그 기록됨)</> : '사유를 선택해주세요'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full overflow-y-auto p-4 space-y-4">
                                            {/* Security Log Banner */}
                                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 flex items-center justify-center gap-2 text-[10px] text-blue-700 font-medium mb-4">
                                                <ShieldCheck size={12} />
                                                <span>관리자(master) 계정으로 열람 중입니다. (사유: {
                                                    accessReason === 'REPORT_INVESTIGATION' ? '신고 조사' :
                                                    accessReason === 'DISPUTE_MEDIATION' ? '분쟁 조정' :
                                                    accessReason === 'ILLEGAL_MONITORING' ? '불법 감지' : '기타'
                                                })</span>
                                            </div>

                                            {/* Warning Banner */}
                                            {selectedRoom.riskLevel !== 'NORMAL' && (
                                                <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 flex gap-3 mb-4">
                                                    <AlertTriangle className="text-rose-500 shrink-0" size={16} />
                                                    <div>
                                                        <h4 className="text-xs font-bold text-rose-700 mb-1">주의: 의심스러운 활동이 감지되었습니다.</h4>
                                                        <p className="text-[11px] text-rose-600">
                                                            감지된 키워드: {selectedRoom.keywords.join(', ')}<br/>
                                                            직거래 유도나 비방 행위가 의심될 경우 이용 제한 조치를 취해주세요.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Chat Bubbles */}
                                            {MOCK_CHAT_LOGS.map((msg) => (
                                                <div key={msg.id} className={`flex flex-col ${msg.isRisk ? 'items-end' : 'items-start'}`}>
                                                    <div className="flex items-center gap-2 mb-1 px-1">
                                                        <span className="text-[10px] font-bold text-slate-500">{msg.sender}</span>
                                                        <span className="text-[10px] text-slate-300">{msg.time}</span>
                                                    </div>
                                                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs font-medium leading-relaxed relative ${
                                                        msg.isRisk 
                                                        ? 'bg-rose-50 border-rose-200 text-slate-800 border-2' 
                                                        : 'bg-white border border-slate-200 text-slate-700'
                                                    }`}>
                                                        {msg.text}
                                                        {msg.isRisk && (
                                                            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 rounded-full shadow-sm animate-pulse">
                                                                위험
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Admin Actions */}
                                {isChatUnlocked && (
                                    <div className="p-4 border-t border-slate-200 bg-white animate-in slide-in-from-bottom-2">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">관리자 조치</h4>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
                                                경고 메시지 발송
                                            </button>
                                            <button className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm">
                                                대화방 차단
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisputeManagement;