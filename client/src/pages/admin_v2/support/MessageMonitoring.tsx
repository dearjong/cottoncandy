import React, { useState, useMemo } from 'react';
import { 
    Search, Mail, AlertTriangle, ShieldAlert, CheckCircle2, 
    MoreHorizontal, ArrowRight, MessageSquare, AlertOctagon, User
} from 'lucide-react';
import { StatusBadge, RiskLevelBadge } from '@/components/Badges';
import { MOCK_MESSAGE_ROOMS, MOCK_CHAT_LOGS } from '@/data/mockData';

const MessageMonitoring = () => {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    // Filter Logic
    const filteredRooms = useMemo(() => {
        return MOCK_MESSAGE_ROOMS.filter(room => {
            const matchesStatus = statusFilter === 'ALL' || 
                (statusFilter === 'REPORTED' ? room.status === 'REPORTED' : room.riskLevel === statusFilter);
            
            const matchesSearch = 
                room.participants.some(p => p.includes(searchTerm)) || 
                room.project.includes(searchTerm);
            
            return matchesStatus && matchesSearch;
        });
    }, [statusFilter, searchTerm]);

    // Stats
    const stats = useMemo(() => ({
        total: MOCK_MESSAGE_ROOMS.length,
        reported: MOCK_MESSAGE_ROOMS.filter(r => r.status === 'REPORTED').length,
        warning: MOCK_MESSAGE_ROOMS.filter(r => r.riskLevel === 'WARNING').length,
        caution: MOCK_MESSAGE_ROOMS.filter(r => r.riskLevel === 'CAUTION').length,
    }), []);

    const selectedRoom = MOCK_MESSAGE_ROOMS.find(r => r.id === selectedRoomId);

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] animate-in gap-4">
            {/* Header */}
            <div className="flex justify-between items-end shrink-0 mb-1">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">메시지 모니터링</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">사용자 간 채팅 내역을 조회하고 부정 행위(직거래 유도, 비방 등)를 모니터링합니다.</p>
                </div>
            </div>

            {/* Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-0.5">전체 채팅방</p>
                        <h4 className="text-2xl font-black text-slate-900">{stats.total}</h4>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-0.5">신고 접수</p>
                        <h4 className="text-2xl font-black text-rose-600">{stats.reported}건</h4>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <AlertOctagon size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-0.5">키워드 감지(위험)</p>
                        <h4 className="text-2xl font-black text-slate-900">{stats.warning}건</h4>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-0.5">키워드 감지(주의)</p>
                        <h4 className="text-2xl font-black text-slate-900">{stats.caution}건</h4>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">
                {/* Left: Chat Room List */}
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
                                    onClick={() => setStatusFilter(filter.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                                        statusFilter === filter.id 
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
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto min-w-0">
                        <table className="w-full min-w-[800px] text-left border-collapse">
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
                                        onClick={() => setSelectedRoomId(room.id)}
                                        className={`cursor-pointer transition-colors ${
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
                                        <td className="p-4 text-center text-slate-300">
                                            <ArrowRight size={16} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Chat Detail (Visible when room selected) */}
                {selectedRoomId && selectedRoom && (
                    <div className="w-full md:w-1/2 lg:w-2/5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4">
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
                                닫기
                            </button>
                        </div>
                        
                        {/* Chat Area (Mock) */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30 space-y-4">
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

                        {/* Admin Actions */}
                        <div className="p-4 border-t border-slate-200 bg-white">
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageMonitoring;