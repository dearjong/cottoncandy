import React, { useState, useMemo } from 'react';
import { 
    Search, FileText, HelpCircle, Bell, PenSquare, 
    MoreHorizontal, Send, ChevronRight, Settings,
    MessageCircle, Mail, Smartphone, Globe, AlertCircle,
    Check, X as XIcon, Edit3, Zap, Save, RotateCcw
} from 'lucide-react';
import { StatusBadge, NoticeTypeBadge, NotificationTypeBadge } from '@/components/Badges';
import { MOCK_NOTICES, MOCK_FAQS, MOCK_NOTIFICATION_LOGS } from '@/data/mockData';

// --- Notification Definitions ---
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

    // 13. 리마인더 알림 (D-3 / D-1 / 당일)
    // 13-1) OT / PT 일정 리마인더
    { category: '리마인더 (OT/PT)', code: 'RMD-001', name: 'OT 3일 전', sender: 'SYSTEM', trigger: '일정 리마인더', target: 'OT 참석자', template: 'OT가 3일 남았습니다. 일정: {OT일시}', active: true },
    { category: '리마인더 (OT/PT)', code: 'RMD-002', name: 'OT 1일 전', sender: 'SYSTEM', trigger: '일정 리마인더', target: 'OT 참석자', template: 'OT가 내일입니다. 일정: {OT일시}', active: true },
    { category: '리마인더 (OT/PT)', code: 'RMD-003', name: 'OT 당일', sender: 'SYSTEM', trigger: '일정 리마인더', target: 'OT 참석자', template: '오늘 OT가 진행됩니다. 일정: {OT일시}', active: true },
    { category: '리마인더 (OT/PT)', code: 'RMD-004', name: 'PT 3일 전', sender: 'SYSTEM', trigger: '일정 리마인더', target: 'PT 참석자', template: 'PT가 3일 남았습니다. 일정: {PT일시}', active: true },
    { category: '리마인더 (OT/PT)', code: 'RMD-005', name: 'PT 1일 전', sender: 'SYSTEM', trigger: '일정 리마인더', target: 'PT 참석자', template: 'PT가 내일입니다. 일정: {PT일시}', active: true },
    { category: '리마인더 (OT/PT)', code: 'RMD-006', name: 'PT 당일', sender: 'SYSTEM', trigger: '일정 리마인더', target: 'PT 참석자', template: '오늘 PT가 진행됩니다. 일정: {PT일시}', active: true },

    // 13-2) 산출물 마감 리마인더
    { category: '리마인더 (산출물)', code: 'RMD-007', name: '산출물 제출 3일 전', sender: 'SYSTEM', trigger: '마감 리마인더', target: '제출 담당', template: '산출물 제출 마감이 3일 남았습니다. 마감: {마감일}', active: true },
    { category: '리마인더 (산출물)', code: 'RMD-008', name: '산출물 제출 1일 전', sender: 'SYSTEM', trigger: '마감 리마인더', target: '제출 담당', template: '산출물 제출 마감이 내일입니다. 마감: {마감일}', active: true },
    { category: '리마인더 (산출물)', code: 'RMD-009', name: '산출물 제출 당일', sender: 'SYSTEM', trigger: '마감 리마인더', target: '제출 담당', template: '오늘 산출물 제출 마감일입니다. 마감: {마감일}', active: true },
    { category: '리마인더 (산출물)', code: 'RMD-010', name: '최종산출물 제출 3일 전', sender: 'SYSTEM', trigger: '마감 리마인더', target: '제출 담당', template: '최종산출물 제출 마감이 3일 남았습니다. 마감: {마감일}', active: true },
    { category: '리마인더 (산출물)', code: 'RMD-011', name: '최종산출물 제출 1일 전', sender: 'SYSTEM', trigger: '마감 리마인더', target: '제출 담당', template: '최종산출물 제출 마감이 내일입니다. 마감: {마감일}', active: true },
    { category: '리마인더 (산출물)', code: 'RMD-012', name: '최종산출물 제출 당일', sender: 'SYSTEM', trigger: '마감 리마인더', target: '제출 담당', template: '오늘 최종산출물 제출 마감일입니다. 마감: {마감일}', active: true },

    // 13-3) 정산 리마인더
    { category: '리마인더 (정산)', code: 'RMD-013', name: '계약금 정산 3일 전', sender: 'SYSTEM', trigger: '정산 리마인더', target: '지급자', template: '계약금 지급 예정일이 3일 남았습니다. 예정일: {예정일}', active: true },
    { category: '리마인더 (정산)', code: 'RMD-014', name: '중도금 정산 3일 전', sender: 'SYSTEM', trigger: '정산 리마인더', target: '지급자', template: '중도금 지급 예정일이 3일 남았습니다. 예정일: {예정일}', active: true },
    { category: '리마인더 (정산)', code: 'RMD-015', name: '잔금 정산 3일 전', sender: 'SYSTEM', trigger: '정산 리마인더', target: '지급자', template: '잔금 지급 예정일이 3일 남았습니다. 예정일: {예정일}', active: true },
    { category: '리마인더 (정산)', code: 'RMD-016', name: '정산 확인 3일 전', sender: 'SYSTEM', trigger: '정산 리마인더', target: '상대방', template: '정산 확인 마감이 3일 남았습니다. 마감: {마감일}', active: true },

    // 13-4) 관심공고(즐겨찾기) 마감 리마인더
    { category: '리마인더 (관심공고)', code: 'RMD-017', name: '관심공고 마감 3일 전', sender: 'SYSTEM', trigger: '마감 리마인더', target: '관심등록한 사용자', template: '관심 등록한 공고의 접수 마감이 3일 남았습니다. ({프로젝트명})', active: true },
    { category: '리마인더 (관심공고)', code: 'RMD-018', name: '관심공고 마감 1일 전', sender: 'SYSTEM', trigger: '마감 리마인더', target: '관심등록한 사용자', template: '관심 등록한 공고의 접수 마감이 내일입니다. ({프로젝트명})', active: true },
    { category: '리마인더 (관심공고)', code: 'RMD-019', name: '관심공고 마감 당일', sender: 'SYSTEM', trigger: '마감 리마인더', target: '관심등록한 사용자', template: '오늘 관심 공고 접수 마감일입니다. 지금 확인해 주세요. ({프로젝트명})', active: true },

    // 13-5) 내 프로젝트 마감 리마인더
    { category: '리마인더 (내 프로젝트)', code: 'RMD-020', name: '내 프로젝트 마감 3일 전', sender: 'SYSTEM', trigger: '내 할 일 마감', target: '담당자', template: '내 프로젝트 할 일 마감이 3일 남았습니다. ({할일명} / {프로젝트명})', active: true },
    { category: '리마인더 (내 프로젝트)', code: 'RMD-021', name: '내 프로젝트 마감 1일 전', sender: 'SYSTEM', trigger: '내 할 일 마감', target: '담당자', template: '내 프로젝트 할 일 마감이 내일입니다. ({할일명} / {프로젝트명})', active: true },
    { category: '리마인더 (내 프로젝트)', code: 'RMD-022', name: '내 프로젝트 마감 당일', sender: 'SYSTEM', trigger: '내 할 일 마감', target: '담당자', template: '오늘 내 프로젝트 할 일 마감일입니다. ({할일명} / {프로젝트명})', active: true },
];

interface ContentManagementProps {
    activeTab?: string;
}

const ContentManagement = ({ activeTab = 'content-notice' }: ContentManagementProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Notification Settings State
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [notificationList, setNotificationList] = useState(NOTIFICATION_DEFINITIONS);
    const [editingNotifCode, setEditingNotifCode] = useState<string | null>(null);
    const [tempTemplate, setTempTemplate] = useState('');

    // Determine internal view based on activeTab prop
    const currentView = useMemo(() => {
        if (activeTab === 'content-faq') return 'FAQ';
        if (activeTab === 'content-notification') return 'NOTIFICATION';
        if (activeTab === 'content-settings') return 'SETTINGS';
        return 'NOTICE';
    }, [activeTab]);

    // Stats
    const stats = useMemo(() => ({
        notices: MOCK_NOTICES.filter(n => n.status === 'POSTED').length,
        faqs: MOCK_FAQS.filter(f => f.status === 'ACTIVE').length,
        notifications: MOCK_NOTIFICATION_LOGS.reduce((acc, curr) => acc + curr.count, 0),
    }), []);

    // --- Notification Setting Logic ---
    const categories = useMemo(() => {
        const cats = new Set(NOTIFICATION_DEFINITIONS.map(n => n.category));
        return ['ALL', ...Array.from(cats)];
    }, []);

    const filteredSettings = useMemo(() => {
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

    // Tab Content Rendering
    const renderNotices = () => (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="제목 검색" 
                            className="pl-9 pr-4 h-10 w-full md:w-80 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="h-10 px-4 rounded-lg bg-[#2b4ea7] text-white text-sm font-bold hover:bg-[#203b80] flex items-center gap-2 shadow-sm transition-colors">
                        <PenSquare size={16} /> 공지사항 등록
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-w-0">
                <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="p-4 font-bold w-20">No</th>
                            <th className="p-4 font-bold">유형</th>
                            <th className="p-4 font-bold w-1/3">제목</th>
                            <th className="p-4 font-bold">타겟</th>
                            <th className="p-4 font-bold">작성자</th>
                            <th className="p-4 font-bold">등록일</th>
                            <th className="p-4 font-bold">조회수</th>
                            <th className="p-4 font-bold">상태</th>
                            <th className="p-4 font-bold text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_NOTICES.map((notice, idx) => (
                            <tr key={notice.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-4 text-xs font-bold text-slate-400">{notice.id}</td>
                                <td className="p-4"><NoticeTypeBadge type={notice.type} /></td>
                                <td className="p-4">
                                    <span className="font-bold text-slate-800 text-sm">{notice.title}</span>
                                </td>
                                <td className="p-4 text-xs font-bold text-slate-500">{notice.target}</td>
                                <td className="p-4 text-xs font-medium text-slate-600">{notice.author}</td>
                                <td className="p-4 text-xs font-medium text-slate-500">{notice.date}</td>
                                <td className="p-4 text-xs font-medium text-slate-500">{notice.views.toLocaleString()}</td>
                                <td className="p-4"><StatusBadge status={notice.status} /></td>
                                <td className="p-4 text-center">
                                    <button className="text-slate-400 hover:text-[#2b4ea7] p-2 hover:bg-blue-50 rounded-full transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderFAQs = () => (
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                 <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="질문, 답변 검색" 
                        className="pl-9 pr-4 h-10 w-full md:w-80 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7] transition-all"
                    />
                </div>
                <button className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-colors">
                    <PenSquare size={16} /> FAQ 등록
                </button>
            </div>
            <div className="divide-y divide-slate-100">
                {MOCK_FAQS.map(faq => (
                    <div key={faq.id} className="p-5 hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{faq.category}</span>
                                <h3 className="font-bold text-slate-800">{faq.question}</h3>
                             </div>
                             <div className="flex items-center gap-2">
                                <StatusBadge status={faq.status} />
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                             </div>
                        </div>
                        <div className="pl-14 text-sm text-slate-500 line-clamp-1">
                            {faq.author} | 최종수정 {faq.updateDate}
                        </div>
                    </div>
                ))}
            </div>
         </div>
    );

    const renderNotifications = () => (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-700">최근 30일 발송 이력</h3>
                <button className="h-10 px-4 rounded-lg bg-[#2b4ea7] text-white text-sm font-bold hover:bg-[#203b80] flex items-center gap-2 shadow-sm transition-colors">
                    <Send size={16} /> 알림 발송
                </button>
             </div>
             <div className="overflow-x-auto min-w-0">
             <table className="w-full min-w-[700px] text-left border-collapse">
                <thead>
                     <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                        <th className="p-4 font-bold">발송유형</th>
                        <th className="p-4 font-bold">메시지 제목</th>
                        <th className="p-4 font-bold">타겟 대상</th>
                        <th className="p-4 font-bold">발송 건수</th>
                        <th className="p-4 font-bold">발송 일시</th>
                        <th className="p-4 font-bold">성공률</th>
                        <th className="p-4 font-bold">상태</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {MOCK_NOTIFICATION_LOGS.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4"><NotificationTypeBadge type={log.type} /></td>
                            <td className="p-4 font-bold text-slate-800 text-sm">{log.title}</td>
                            <td className="p-4 text-xs font-bold text-slate-500">{log.target}</td>
                            <td className="p-4 text-xs font-bold text-slate-600">{log.count.toLocaleString()}건</td>
                            <td className="p-4 text-xs font-medium text-slate-500">{log.sentDate}</td>
                            <td className="p-4 text-xs font-bold text-emerald-600">{log.successRate}</td>
                            <td className="p-4"><StatusBadge status={log.status} /></td>
                        </tr>
                    ))}
                </tbody>
             </table>
             </div>
        </div>
    );

    const renderSettings = () => (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-14rem)] animate-in">
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
                            {filteredSettings.length}
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
                
                <div className="flex-1 overflow-x-auto overflow-y-auto min-w-0">
                    <table className="w-full min-w-[800px] text-left border-collapse">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-4 font-bold w-20">Code</th>
                                <th className="p-4 font-bold w-40">알림명 / 트리거</th>
                                <th className="p-4 font-bold w-24">대상</th>
                                <th className="p-4 font-bold">발송 내용 (Template)</th>
                                <th className="p-4 font-bold w-24 text-center">상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSettings.map((notif) => (
                                <tr key={notif.code} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 whitespace-nowrap">
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
                                        <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-full shadow-sm whitespace-nowrap">
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
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-xs text-slate-600 leading-relaxed truncate max-w-lg" title={notif.template}>
                                                    {notif.template}
                                                </p>
                                                <button 
                                                    onClick={() => startEditing(notif)}
                                                    className="p-1.5 text-slate-400 hover:text-[#2b4ea7] hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                    disabled={editingNotifCode !== null}
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                            </div>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {currentView === 'NOTICE' && '공지사항 관리'}
                    {currentView === 'FAQ' && 'FAQ 관리'}
                    {currentView === 'NOTIFICATION' && '알림 발송 내역'}
                    {currentView === 'SETTINGS' && '알림 설정'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    {currentView === 'NOTICE' && '플랫폼 전체 공지사항을 등록하고 관리합니다.'}
                    {currentView === 'FAQ' && '자주 묻는 질문을 카테고리별로 관리합니다.'}
                    {currentView === 'NOTIFICATION' && '시스템에서 발송된 알림(문자, 메일 등) 이력을 조회합니다.'}
                    {currentView === 'SETTINGS' && '시스템 이벤트에 따른 알림 발송 여부와 문구를 관리합니다.'}
                  </p>
                </div>
            </div>

            {/* Stats Cards - Hide on Settings tab */}
            {currentView !== 'SETTINGS' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">게시 중인 공지</p>
                            <h4 className="text-3xl font-black text-slate-900">{stats.notices}</h4>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <HelpCircle size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">운영 중인 FAQ</p>
                            <h4 className="text-3xl font-black text-slate-900">{stats.faqs}</h4>
                        </div>
                    </div>
                     <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Bell size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">이번 달 발송</p>
                            <h4 className="text-3xl font-black text-slate-900">{stats.notifications.toLocaleString()}</h4>
                        </div>
                    </div>
                </div>
            )}

            {currentView === 'NOTICE' && renderNotices()}
            {currentView === 'FAQ' && renderFAQs()}
            {currentView === 'NOTIFICATION' && renderNotifications()}
            {currentView === 'SETTINGS' && renderSettings()}
        </div>
    );
};

export default ContentManagement;