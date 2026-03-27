import React, { useState, useMemo } from 'react';
import { 
    Zap, Bell, ChevronRight, Search, Edit3, Save, RotateCcw
} from 'lucide-react';

// --- Mock Data: Notification Definitions (Based on PDF) ---
const NOTIFICATION_DEFINITIONS = [
    // 1. 공지/시스템 안내
    { category: '공지/시스템 안내', code: 'NTC-001', name: '공지사항 안내', sender: 'ADMIN', trigger: '공지 등록', target: '전체', template: '{공지 내용}', active: true },
    { category: '공지/시스템 안내', code: 'NTC-002', name: '시스템 점검 안내', sender: 'ADMIN', trigger: '점검 일정 생성', target: '전체', template: '{일정 안내}', active: true },
    { category: '공지/시스템 안내', code: 'NTC-003', name: '약관/정책 변경 안내', sender: 'ADMIN', trigger: '약관 업데이트', target: '전체', template: '약관/정책이 변경되었습니다. 변경 내용을 확인해 주세요.', active: true },
    { category: '공지/시스템 안내', code: 'NTC-004', name: '긴급 공지', sender: 'ADMIN', trigger: '운영자 발송', target: '전체', template: '{공지 내용}', active: true },

    // 2. 운영자 알림
    { category: '운영자 알림', code: 'OPS-001', name: '프로젝트 승인 필요', sender: 'SYSTEM', trigger: '상태 변경(REQUESTED)', target: '플랫폼 운영자', template: '프로젝트 승인 요청이 접수되었습니다.', active: true },
    { category: '운영자 알림', code: 'OPS-002', name: '1:1 비공개 프로젝트 등록', sender: 'SYSTEM', trigger: '프로젝트 등록', target: '플랫폼 운영자', template: '1:1 비공개 프로젝트가 등록되었습니다.', active: true },
    { category: '운영자 알림', code: 'OPS-003', name: '컨설팅 문의 등록', sender: 'SYSTEM', trigger: '프로젝트 등록', target: '플랫폼 운영자', template: '컨설팅 문의가 등록되었습니다.', active: true },
    { category: '운영자 알림', code: 'OPS-004', name: '1:1 문의 등록', sender: 'SYSTEM', trigger: '문의 등록', target: '플랫폼 운영자', template: '1:1 문의가 등록되었습니다. 확인해 주세요.', active: true },
    { category: '운영자 알림', code: 'OPS-005', name: '신고 접수', sender: 'SYSTEM', trigger: '신고 접수', target: '플랫폼 운영자', template: '신고가 접수되었습니다. 검토가 필요합니다.', active: true },
    { category: '운영자 알림', code: 'OPS-006', name: '분쟁 접수', sender: 'SYSTEM', trigger: '분쟁 접수', target: '플랫폼 운영자', template: '분쟁이 접수되었습니다. 조치가 필요합니다.', active: true },

    // 3. 회원/계정 안내
    { category: '회원/계정 안내', code: 'MBR-001', name: '가입 완료', sender: 'SYSTEM', trigger: '회원가입 완료', target: '가입자', template: '가입이 완료되었습니다. 프로필을 등록해 시작해 보세요.', active: true },
    { category: '회원/계정 안내', code: 'MBR-002', name: '소속 회사 선택 안내', sender: 'SYSTEM', trigger: '프로필 등록 진입', target: '가입자', template: '프로필에서 회사 이름을 선택하면 해당 회사의 구성원으로 등록 신청됩니다.', active: true },
    { category: '회원/계정 안내', code: 'MBR-003', name: '회원 탈퇴 완료', sender: 'SYSTEM', trigger: '회원 탈퇴 완료', target: '탈퇴자', template: '회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.', active: true },
    { category: '회원/계정 안내', code: 'MBR-004', name: '1:1 문의 답변 도착', sender: 'SYSTEM', trigger: '답변 등록', target: '문의자', template: '1:1 문의에 답변이 등록되었습니다.', active: true },

    // 4. 기업 관리 알림
    { category: '기업 관리 알림', code: 'ORG-001', name: '직원 등록 신청 접수', sender: 'SYSTEM', trigger: '직원 등록 신청', target: '기업관리자', template: '{이름}님이 {회사명} 구성원 등록을 신청했습니다.', active: true },
    { category: '기업 관리 알림', code: 'ORG-002', name: '직원 등록 승인 완료', sender: 'ADMIN', trigger: '기업관리자 승인', target: '신청자', template: '{회사명} 구성원 등록이 승인되었습니다.', active: true },
    { category: '기업 관리 알림', code: 'ORG-003', name: '직원 등록 반려', sender: 'ADMIN', trigger: '기업관리자 반려', target: '신청자', template: '{회사명} 구성원 등록이 반려되었습니다. 사유: {사유}', active: true },
    { category: '기업 관리 알림', code: 'ORG-008', name: '권한 변경 안내', sender: 'ADMIN', trigger: '권한 변경', target: '해당 사용자', template: '{회사명}에서 내 권한이 변경되었습니다.', active: true },
    { category: '기업 관리 알림', code: 'ORG-009', name: '사업자등록 인증 신청 접수', sender: 'SYSTEM', trigger: '인증 신청', target: '플랫폼 운영자', template: '사업자등록 인증 신청이 접수되었습니다.', active: true },
    { category: '기업 관리 알림', code: 'ORG-010', name: '사업자등록 인증 승인 완료', sender: 'ADMIN', trigger: '운영자 승인', target: '신청자', template: '사업자등록 인증이 승인되었습니다.', active: true },

    // 5. 프로젝트 상태 알림
    { category: '프로젝트 상태 알림', code: 'PRJ-001', name: '승인 완료', sender: 'SYSTEM', trigger: '상태 변경(APPROVED)', target: 'Owner', template: '프로젝트가 승인되었습니다. 접수가 자동으로 시작되었습니다.', active: true },
    { category: '프로젝트 상태 알림', code: 'PRJ-002', name: '반려', sender: 'SYSTEM', trigger: '상태 변경(REJECTED)', target: 'Owner', template: '요청하신 프로젝트가 반려되었습니다. 내용 보완 후 다시 신청해 주세요.', active: true },
    { category: '프로젝트 상태 알림', code: 'PRJ-003', name: '접수 마감', sender: 'SYSTEM', trigger: '상태 변경(CLOSED)', target: 'Owner', template: '접수가 마감되었습니다. 결과를 확인해 주세요.', active: true },
    { category: '프로젝트 상태 알림', code: 'PRJ-004', name: '선정 완료', sender: 'SYSTEM', trigger: '상태 변경(SELECTED)', target: 'Owner', template: '최종 파트너 선정이 완료되었습니다.', active: true },
    { category: '프로젝트 상태 알림', code: 'PRJ-005', name: '계약 단계 진입', sender: 'SYSTEM', trigger: '상태 변경(CONTRACT)', target: '양측', template: '계약 단계로 전환되었습니다. 계약 서류를 확인해 주세요.', active: true },
    { category: '프로젝트 상태 알림', code: 'PRJ-009', name: '종료(완료)', sender: 'SYSTEM', trigger: '상태 변경(COMPLETE)', target: '양측', template: '프로젝트가 완료 처리되었습니다.', active: true },

    // 6. 파트너 참여 상태 알림
    { category: '파트너 참여 상태 알림', code: 'PAR-001', name: '프로젝트 초대', sender: 'SYSTEM', trigger: 'INVITED', target: '해당 파트너', template: '프로젝트에 초대되었습니다. 참여 여부를 확인해 주세요.', active: true },
    { category: '파트너 참여 상태 알림', code: 'PAR-002', name: '참여 신청 도착', sender: 'SYSTEM', trigger: 'APPLY', target: 'Owner', template: '참여 신청이 도착했습니다.', active: true },
    { category: '파트너 참여 상태 알림', code: 'PAR-003', name: '제안서 제출 완료', sender: 'SYSTEM', trigger: 'PROPOSAL_SUBMITTED', target: 'Owner', template: '제안서가 제출되었습니다. 확인해 주세요.', active: true },
    { category: '파트너 참여 상태 알림', code: 'PAR-008', name: '파트너 선정', sender: 'SYSTEM', trigger: 'SELECTED', target: '해당 파트너', template: '축하드립니다! {프로젝트명} 최종 파트너로 선정되셨습니다.', active: true },

    // 7. 제안서/시안 업로드
    { category: '제안서/시안 업로드', code: 'DOC-001', name: '제안서/시안 업로드', sender: 'SYSTEM', trigger: '파일 업로드', target: 'Owner', template: '제안서/시안이 업로드되었습니다. 확인해 주세요.', active: true },

    // 8. 계약/서류
    { category: '계약/서류', code: 'CTR-001', name: '계약서류 업로드', sender: 'SYSTEM', trigger: '파일 업로드', target: '상대방', template: '계약 서류가 업로드되었습니다. 확인해 주세요.', active: true },
    { category: '계약/서류', code: 'CTR-002', name: '계약 확정 요청', sender: 'SYSTEM', trigger: '확정 요청', target: '상대방', template: '계약 확정 요청이 도착했습니다.', active: true },
    
    // 9. 제작/산출물
    { category: '제작/산출물', code: 'DLV-001', name: '산출물 업로드 완료', sender: 'SYSTEM', trigger: '파일 업로드', target: 'Owner', template: '산출물이 업로드되었습니다. 검수해 주세요.', active: true },
    
    // 10. 정산
    { category: '정산', code: 'PAY-001', name: '증빙/지급 정보 등록', sender: 'SYSTEM', trigger: '증빙 등록', target: '상대방', template: '증빙/지급 정보가 등록되었습니다. 확인해 주세요.', active: true },
    { category: '정산', code: 'PAY-005', name: '정산 완료', sender: 'SYSTEM', trigger: 'COMPLETE', target: '양측', template: '정산이 완료 처리되었습니다.', active: true },

    // 11. 맞춤/관심기업
    { category: '맞춤/관심기업', code: 'REC-001', name: '맞춤 프로젝트 등록 알림', sender: 'SYSTEM', trigger: '조건 매칭', target: '해당 사용자', template: '조건에 맞는 신규 프로젝트가 등록되었습니다.', active: true },
    { category: '맞춤/관심기업', code: 'REC-002', name: '관심 기업 신규 프로젝트', sender: 'SYSTEM', trigger: '관심기업 이벤트', target: '해당 사용자', template: '관심 기업의 신규 프로젝트가 등록되었습니다.', active: true },
    { category: '맞춤/관심기업', code: 'REC-003', name: '관심 기업 활동 업데이트', sender: 'SYSTEM', trigger: '관심기업 업데이트', target: '해당 사용자', template: '관심 기업의 활동이 업데이트되었습니다.', active: true },

    // 12. 메시지
    { category: '메시지', code: 'MSG-001', name: '쪽지 수신', sender: 'SYSTEM', trigger: '메시지 수신', target: '수신자', template: '새 메시지가 도착했습니다.', active: true },
];

const AutomationManagement = () => {
    // Notification States
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [notificationList, setNotificationList] = useState(NOTIFICATION_DEFINITIONS);
    const [editingNotifCode, setEditingNotifCode] = useState<string | null>(null);
    const [tempTemplate, setTempTemplate] = useState('');

    const categories = useMemo(() => {
        const cats = new Set(NOTIFICATION_DEFINITIONS.map(n => n.category));
        return ['ALL', ...Array.from(cats)];
    }, []);

    const filteredNotifications = useMemo(() => {
        if (selectedCategory === 'ALL') return notificationList;
        return notificationList.filter(n => n.category === selectedCategory);
    }, [selectedCategory, notificationList]);

    const toggleNotification = (code: string) => {
        setNotificationList(prev => prev.map(n => n.code === code ? { ...n, active: !n.active } : n));
    };

    const startEditing = (notif: typeof NOTIFICATION_DEFINITIONS[0]) => {
        setEditingNotifCode(notif.code);
        setTempTemplate(notif.template);
    };

    const saveTemplate = () => {
        setNotificationList(prev => prev.map(n => n.code === editingNotifCode ? { ...n, template: tempTemplate } : n));
        setEditingNotifCode(null);
    };

    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <Bell className="text-[#2b4ea7]" size={24}/> 시스템 알림 설정
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">플랫폼 내 발생하는 주요 이벤트에 대한 알림 발송 여부와 문구를 관리합니다.</p>
                </div>
            </div>

            {/* Notification List Layout */}
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
                {/* Left Category Sidebar */}
                <div className="w-full lg:w-64 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-900 text-sm">카테고리</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex justify-between items-center ${
                                    selectedCategory === cat 
                                    ? 'bg-[#2b4ea7] text-white shadow-md' 
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {cat === 'ALL' ? '전체 보기' : cat}
                                <ChevronRight size={14} className={selectedCategory === cat ? 'text-white' : 'text-slate-300'} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Notification List */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                        <div className="text-sm font-bold text-slate-700">
                            {selectedCategory === 'ALL' ? '전체 알림' : selectedCategory} 
                            <span className="ml-2 text-[#2b4ea7] bg-[#2b4ea7]/10 px-2 py-0.5 rounded-full text-xs">
                                {filteredNotifications.length}
                            </span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="알림명, 내용 검색" 
                                className="pl-9 pr-4 h-9 w-64 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#2b4ea7] bg-white transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="p-4 font-bold w-20">Code</th>
                                    <th className="p-4 font-bold w-40">알림명 / 트리거</th>
                                    <th className="p-4 font-bold w-24">대상</th>
                                    <th className="p-4 font-bold">발송 내용 (Template)</th>
                                    <th className="p-4 font-bold w-24 text-center">상태</th>
                                    <th className="p-4 font-bold w-16 text-center">편집</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredNotifications.map((notif) => (
                                    <tr key={notif.code} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4">
                                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                                {notif.code}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-slate-800 mb-0.5">{notif.name}</div>
                                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                                <Zap size={10} /> {notif.trigger}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-full shadow-sm">
                                                {notif.target}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {editingNotifCode === notif.code ? (
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        className="flex-1 h-8 px-2 border border-[#2b4ea7] rounded text-xs focus:outline-none bg-white"
                                                        value={tempTemplate}
                                                        onChange={(e) => setTempTemplate(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <button onClick={saveTemplate} className="p-1.5 bg-[#2b4ea7] text-white rounded hover:bg-[#203b80]">
                                                        <Save size={14}/>
                                                    </button>
                                                    <button onClick={() => setEditingNotifCode(null)} className="p-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300">
                                                        <RotateCcw size={14}/>
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-600 leading-relaxed truncate max-w-lg" title={notif.template}>
                                                    {notif.template}
                                                </p>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => toggleNotification(notif.code)}
                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                                                    notif.active ? 'bg-emerald-500' : 'bg-slate-200'
                                                }`}
                                            >
                                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                                    notif.active ? 'translate-x-5' : 'translate-x-1'
                                                }`} />
                                            </button>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => startEditing(notif)}
                                                className="p-2 text-slate-400 hover:text-[#2b4ea7] hover:bg-blue-50 rounded-lg transition-colors"
                                                disabled={editingNotifCode !== null}
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutomationManagement;