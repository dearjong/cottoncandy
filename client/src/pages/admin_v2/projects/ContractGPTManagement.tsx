import React, { useState, useMemo, useEffect } from 'react';
import { 
    ChevronDown, Building2, Copy, FileText, CheckCircle2, AlertTriangle, 
    Download, Printer, AlertOctagon, Calendar, CreditCard, ExternalLink,
    Paperclip, Eye, History, ShieldAlert, PenTool, Brain, Sparkles, Send,
    X, Check, Lock, FileCheck, RefreshCw, XCircle, Search
} from 'lucide-react';
import { StatusBadge } from '@/components/Badges';
import { MOCK_PROJECTS, MOCK_CONTRACTS } from '@/data/mockData';

// --- Types for this specific view ---
type ReviewStatus = 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';

interface AutoCheckResult {
    id: string;
    label: string;
    status: 'PASS' | 'FAIL' | 'WARN';
    message?: string;
}

interface ContractGPTDetails {
    id: string;
    status: string;
    lastModified: string;
    lastModifier: string;
    summary: {
        scope: string[];
        budget: { total: number; ad: number; production: number; isVatIncluded: boolean; isPublic: boolean };
        schedule: { contractDate: string; firstDelivery: string; finalDelivery: string; onAir: string };
        payment: { type: string; steps: { label: string; ratio: number; trigger: string; date: string }[] };
        verification: { businessReg: boolean; seal: boolean };
        filesCount: number;
    };
    checks: AutoCheckResult[];
    files: { id: string; name: string; type: string; uploader: string; date: string; status: 'NORMAL' | 'CORRUPT' }[];
    signatures: { 
        role: 'ADVERTISER' | 'PRODUCTION'; 
        name: string; 
        status: 'WAITING' | 'SIGNED'; 
        date?: string; 
        ip?: string; 
        method?: string; 
    }[];
    audit: { time: string; actor: string; action: string; desc: string }[];
}

// --- Mock Data Generator for Detail View ---
const MOCK_GPT_DETAILS: ContractGPTDetails = {
    id: 'CT-202411-001',
    status: 'REVIEW_PENDING',
    lastModified: '2024.11.16 10:30',
    lastModifier: '박감독 (제작사)',
    summary: {
        scope: ['전략기획', '크리에이티브', '영상촬영', '종합편집', '2D모션'],
        budget: { total: 380000000, ad: 0, production: 380000000, isVatIncluded: false, isPublic: false },
        schedule: { contractDate: '2024.11.16', firstDelivery: '2024.12.20', finalDelivery: '2025.01.30', onAir: '2025.02.01' },
        payment: { 
            type: '표준 지급 (3:4:3)', 
            steps: [
                { label: '선금', ratio: 30, trigger: '계약 체결 시', date: '2024.11.20' },
                { label: '중도금', ratio: 40, trigger: '촬영 종료 시', date: '2024.12.25' },
                { label: '잔금', ratio: 30, trigger: '최종 납품 시', date: '2025.01.30' }
            ] 
        },
        verification: { businessReg: true, seal: true },
        filesCount: 3
    },
    checks: [
        { id: 'CK-1', label: '필수 항목 입력', status: 'PASS' },
        { id: 'CK-2', label: '지급 비율 합계 (100%)', status: 'PASS' },
        { id: 'CK-3', label: '일정 역전 여부', status: 'PASS' },
        { id: 'CK-4', label: '표준계약서 양식 준수', status: 'WARN', message: '특약 사항에 비표준 조항 포함됨' },
        { id: 'CK-5', label: '첨부파일 무결성', status: 'PASS' },
    ],
    files: [
        { id: 'F1', name: '표준제작계약서_v1.pdf', type: 'CONTRACT', uploader: '박감독', date: '2024.11.15', status: 'NORMAL' },
        { id: 'F2', name: '청렴서약서.pdf', type: 'PLEDGE', uploader: '박감독', date: '2024.11.15', status: 'NORMAL' },
        { id: 'F3', name: '사업자등록증.jpg', type: 'DOC', uploader: '박감독', date: '2024.11.15', status: 'NORMAL' },
    ],
    signatures: [
        { role: 'ADVERTISER', name: '마운틴K', status: 'SIGNED', date: '2024.11.16 10:30', ip: '123.45.xx.xx', method: '공인인증' },
        { role: 'PRODUCTION', name: '스튜디오 블랙', status: 'WAITING' },
    ],
    audit: [
        { time: '2024.11.16 10:30', actor: '마운틴K', action: 'SIGN', desc: '광고주 전자서명 완료' },
        { time: '2024.11.15 14:00', actor: '박감독', action: 'UPLOAD', desc: '계약서 파일 업로드' },
        { time: '2024.11.15 13:50', actor: '박감독', action: 'CREATE', desc: '계약서 초안 작성' },
    ]
};

// --- Components ---

const CheckItem: React.FC<{ check: AutoCheckResult }> = ({ check }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
        <span className="text-xs font-medium text-slate-600">{check.label}</span>
        <div className="flex items-center gap-1.5">
            {check.status === 'PASS' && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={10}/> PASS</span>}
            {check.status === 'FAIL' && <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-1"><XCircle size={10}/> FAIL</span>}
            {check.status === 'WARN' && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-1"><AlertTriangle size={10}/> WARN</span>}
        </div>
    </div>
);

const ContractGPTManagement = () => {
    // 1. Project Selection State
    const availableProjects = useMemo(() => {
        return MOCK_PROJECTS.filter(p => ['CONTRACT', 'PRODUCTION', 'COMPLETE'].includes(p.status));
    }, []);
    const [selectedProjectId, setSelectedProjectId] = useState<string>(availableProjects[0]?.id || '');
    const selectedProject = availableProjects.find(p => p.id === selectedProjectId);

    // 2. View State
    const [activeTab, setActiveTab] = useState<'FIELDS' | 'FILES' | 'SIGNATURE' | 'AUDIT'>('FIELDS');
    const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('PENDING');
    const [adminMemo, setAdminMemo] = useState('');
    const [outboundMsg, setOutboundMsg] = useState('');

    // Ensure selectedProjectId is valid
    useEffect(() => {
        const exists = availableProjects.find(p => p.id === selectedProjectId);
        if (!exists && availableProjects.length > 0) {
            setSelectedProjectId(availableProjects[0].id);
        }
    }, [availableProjects, selectedProjectId]);

    // Helper Functions
    const formatCurrency = (amount: number) => new Intl.NumberFormat('ko-KR').format(amount);
    const copyToClipboard = (text: string) => alert(`복사되었습니다: ${text}`);

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 relative">
            
            {/* 1. Header & Project Selector */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 z-20">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-[#2b4ea7] bg-[#2b4ea7]/10 px-2 py-0.5 rounded whitespace-nowrap flex items-center gap-1">
                            <Brain size={12}/> 계약관리 GPT
                        </span>
                        <span className="text-slate-300">|</span>
                        <div className="relative flex-1 max-w-[600px]">
                            <select 
                                className="appearance-none w-full bg-slate-50 border border-slate-200 hover:border-[#2b4ea7] hover:bg-white text-lg font-black text-slate-900 pl-4 pr-10 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2b4ea7]/20 focus:border-[#2b4ea7] transition-all cursor-pointer truncate"
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                            >
                                {availableProjects.map(p => (
                                    <option key={p.id} value={p.id}>[{p.clientName}] {p.title}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Project Context Bar */}
            {selectedProject && (
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-500">ID</span>
                            <span className="font-mono text-slate-700 bg-white px-1.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-50" onClick={() => copyToClipboard(selectedProject.id)}>{selectedProject.id}</span>
                        </div>
                        <div className="w-px h-3 bg-slate-300"></div>
                        <div className="flex items-center gap-1">
                            <Building2 size={12} className="text-slate-400"/>
                            <span className="font-bold text-slate-700">{selectedProject.clientName}</span>
                            <span className="text-slate-400">↔</span>
                            <span className="font-bold text-slate-700">스튜디오 블랙</span>
                        </div>
                        <div className="w-px h-3 bg-slate-300"></div>
                        <div className="flex items-center gap-1">
                            <span className="text-slate-500">상태:</span>
                            <span className="font-bold text-slate-800">서명 대기중</span>
                        </div>
                        <div className="w-px h-3 bg-slate-300"></div>
                        <div className="flex items-center gap-1 text-slate-500">
                            <History size={12}/>
                            <span>마지막 변경: {MOCK_GPT_DETAILS.lastModified} ({MOCK_GPT_DETAILS.lastModifier})</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1">
                            <FileText size={12}/> 계약 파일 보기
                        </button>
                        <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1">
                            <Download size={12}/> 전체 다운로드
                        </button>
                        <button className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded text-xs font-bold text-rose-600 hover:bg-rose-100 flex items-center gap-1">
                            <AlertTriangle size={12}/> 이슈 등록
                        </button>
                    </div>
                </div>
            )}

            {/* 3. Main Layout: Content + Review Panel */}
            <div className="flex flex-1 overflow-hidden bg-slate-100/50">
                
                {/* LEFT COLUMN: Main Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* A. Summary & Auto Checks */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Summary Card */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText size={16} className="text-[#2b4ea7]"/> 계약 요약
                            </h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs">
                                <div>
                                    <span className="block text-slate-400 font-bold mb-1">의뢰 범위</span>
                                    <div className="flex flex-wrap gap-1">
                                        {MOCK_GPT_DETAILS.summary.scope.map(s => (
                                            <span key={s} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-slate-400 font-bold mb-1">총 예산 (VAT 별도)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-black text-slate-900">{formatCurrency(MOCK_GPT_DETAILS.summary.budget.total)}원</span>
                                        {!MOCK_GPT_DETAILS.summary.budget.isPublic && <span className="bg-slate-800 text-white text-[9px] px-1.5 rounded flex items-center gap-1"><Lock size={8}/> 비공개</span>}
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-slate-400 font-bold mb-1">계약 기간</span>
                                    <span className="font-bold text-slate-700">
                                        {MOCK_GPT_DETAILS.summary.schedule.contractDate} ~ {MOCK_GPT_DETAILS.summary.schedule.finalDelivery}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-slate-400 font-bold mb-1">지급 조건</span>
                                    <div className="font-bold text-slate-700">{MOCK_GPT_DETAILS.summary.payment.type}</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                        {MOCK_GPT_DETAILS.summary.payment.steps.map(s => `${s.label} ${s.ratio}%`).join(' + ')}
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-slate-400 font-bold mb-1">기업 인증</span>
                                    <div className="flex gap-2">
                                        <span className={`flex items-center gap-1 ${MOCK_GPT_DETAILS.summary.verification.businessReg ? 'text-blue-600' : 'text-slate-400'}`}>
                                            <CheckCircle2 size={12}/> 사업자등록
                                        </span>
                                        <span className={`flex items-center gap-1 ${MOCK_GPT_DETAILS.summary.verification.seal ? 'text-blue-600' : 'text-slate-400'}`}>
                                            <CheckCircle2 size={12}/> 인감/서명
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-slate-400 font-bold mb-1">첨부 문서</span>
                                    <span className="font-bold text-slate-700 flex items-center gap-1">
                                        <Paperclip size={12}/> {MOCK_GPT_DETAILS.summary.filesCount}개
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Auto Checks */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Sparkles size={100} className="text-[#2b4ea7]"/>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                                <Brain size={16} className="text-purple-600"/> Auto Check
                            </h3>
                            <div className="space-y-1 relative z-10">
                                {MOCK_GPT_DETAILS.checks.map(check => (
                                    <CheckItem key={check.id} check={check} />
                                ))}
                            </div>
                            {MOCK_GPT_DETAILS.checks.some(c => c.status === 'WARN' || c.status === 'FAIL') && (
                                <div className="mt-4 p-2 bg-rose-50 border border-rose-100 rounded text-[10px] text-rose-600 font-medium">
                                    주의가 필요한 항목이 감지되었습니다. 내용을 확인해주세요.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* B. Detail Viewer (Tabs) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
                        {/* Tabs Navigation */}
                        <div className="flex border-b border-slate-200">
                            {[
                                { id: 'FIELDS', label: '계약 필드 (Fields)', icon: FileText },
                                { id: 'FILES', label: '첨부파일 (Files)', icon: Paperclip },
                                { id: 'SIGNATURE', label: '서명/확정 (Signature)', icon: PenTool },
                                { id: 'AUDIT', label: '변경이력 (Audit)', icon: History },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                                        activeTab === tab.id
                                        ? 'border-[#2b4ea7] text-[#2b4ea7] bg-[#2b4ea7]/5'
                                        : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 flex-1">
                            {activeTab === 'FIELDS' && (
                                <div className="space-y-8 animate-in fade-in">
                                    <section>
                                        <h4 className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block mb-4">A. 의뢰 내용 및 예산</h4>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400">의뢰 범위</label>
                                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                                                    {MOCK_GPT_DETAILS.summary.scope.join(', ')}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400">총 예산 (VAT 별도)</label>
                                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex justify-between">
                                                    <span>{formatCurrency(MOCK_GPT_DETAILS.summary.budget.total)}원</span>
                                                    {!MOCK_GPT_DETAILS.summary.budget.isPublic && <span className="text-xs text-rose-500 font-bold flex items-center gap-1"><Lock size={10}/> 비공개</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block mb-4">B. 일정 및 납품</h4>
                                        <div className="grid grid-cols-4 gap-4">
                                            {['계약일', '1차 납품', '최종 납품', 'On-Air'].map((label, idx) => {
                                                const keys = ['contractDate', 'firstDelivery', 'finalDelivery', 'onAir'];
                                                return (
                                                    <div key={label} className="space-y-1">
                                                        <label className="text-[10px] font-bold text-slate-400">{label}</label>
                                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                                                            {MOCK_GPT_DETAILS.summary.schedule[keys[idx] as keyof typeof MOCK_GPT_DETAILS.summary.schedule]}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block mb-4">C. 지급 조건</h4>
                                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase">
                                                    <tr>
                                                        <th className="p-3 font-bold">구분</th>
                                                        <th className="p-3 font-bold">비율</th>
                                                        <th className="p-3 font-bold">지급 조건 (Trigger)</th>
                                                        <th className="p-3 font-bold">지급 예정일</th>
                                                        <th className="p-3 font-bold text-right">금액</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                                                    {MOCK_GPT_DETAILS.summary.payment.steps.map((step, idx) => (
                                                        <tr key={idx}>
                                                            <td className="p-3 font-bold">{step.label}</td>
                                                            <td className="p-3">{step.ratio}%</td>
                                                            <td className="p-3">{step.trigger}</td>
                                                            <td className="p-3">{step.date}</td>
                                                            <td className="p-3 text-right font-medium text-slate-500">
                                                                {formatCurrency(MOCK_GPT_DETAILS.summary.budget.total * (step.ratio / 100))}원
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>

                                    {/* Field Actions */}
                                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1">
                                            <RefreshCw size={12}/> 수정 요청 (알림 발송)
                                        </button>
                                        <button className="px-4 py-2 border border-rose-200 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1">
                                            <AlertTriangle size={12}/> 경고 플래그 추가
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'FILES' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="flex justify-end">
                                        <button className="text-xs font-bold text-slate-500 hover:text-[#2b4ea7] flex items-center gap-1">
                                            <Download size={12}/> 모든 파일 일괄 다운로드 (ZIP)
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {MOCK_GPT_DETAILS.files.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-[#2b4ea7] hover:bg-[#2b4ea7]/5 transition-colors group bg-white">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    file.type === 'CONTRACT' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    <FileText size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-sm text-slate-800">{file.name}</span>
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded border border-slate-200">{file.type}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        업로더: {file.uploader} • {file.date}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {file.status === 'NORMAL' ? (
                                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
                                                            <ShieldAlert size={12}/> 안전
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">손상됨</span>
                                                    )}
                                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                                                        <Download size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'SIGNATURE' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                                        <ShieldAlert size={20} className="text-blue-600 mt-0.5"/>
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-800 mb-1">운영자 권한 안내</h4>
                                            <p className="text-xs text-blue-600 leading-relaxed">
                                                운영자는 계약 당사자를 대신하여 서명할 수 없습니다.<br/>
                                                단, 분쟁 조정 결과에 따라 기존 서명을 무효화하거나 계약을 파기 처리할 수 있습니다.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                        {MOCK_GPT_DETAILS.signatures.map((sig, idx) => (
                                            <div key={idx} className="relative">
                                                <div className={`absolute -left-[1.6rem] w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${
                                                    sig.status === 'SIGNED' ? 'bg-[#2b4ea7]' : 'bg-slate-300'
                                                }`}>
                                                    {sig.status === 'SIGNED' && <Check size={12} className="text-white"/>}
                                                </div>
                                                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{sig.role === 'ADVERTISER' ? '갑 (광고주)' : '을 (제작사)'}</span>
                                                            <span className="text-sm font-bold text-slate-800">{sig.name}</span>
                                                        </div>
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                                                            sig.status === 'SIGNED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                                        }`}>
                                                            {sig.status === 'SIGNED' ? '서명 완료' : '서명 대기'}
                                                        </span>
                                                    </div>
                                                    {sig.status === 'SIGNED' && (
                                                        <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded mt-2 font-mono">
                                                            Time: {sig.date}<br/>
                                                            IP: {sig.ip} (Masked)<br/>
                                                            Method: {sig.method}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'AUDIT' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                        {MOCK_GPT_DETAILS.audit.map((log, idx) => (
                                            <div key={idx} className="relative group">
                                                <div className="absolute -left-[1.35rem] w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white group-hover:bg-[#2b4ea7] transition-colors"></div>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-800">{log.action}</div>
                                                        <div className="text-xs text-slate-500">{log.desc}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-bold text-slate-600">{log.actor}</div>
                                                        <div className="text-[10px] text-slate-400">{log.time}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Review Panel (Fixed) */}
                <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 shadow-xl">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <FileCheck size={16} className="text-[#2b4ea7]"/> 검수 패널
                        </h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                        {/* Status Select */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500">현재 상태</label>
                            <div className="relative">
                                <select 
                                    className={`w-full p-2.5 rounded-lg border text-sm font-bold focus:outline-none appearance-none cursor-pointer ${
                                        reviewStatus === 'PENDING' ? 'bg-slate-50 border-slate-200 text-slate-600' :
                                        reviewStatus === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                                        reviewStatus === 'REJECTED' ? 'bg-rose-50 border-rose-200 text-rose-600' :
                                        'bg-blue-50 border-blue-200 text-blue-600'
                                    }`}
                                    value={reviewStatus}
                                    onChange={(e) => setReviewStatus(e.target.value as ReviewStatus)}
                                >
                                    <option value="PENDING">미검수 (Pending)</option>
                                    <option value="REVIEWING">검수중 (Reviewing)</option>
                                    <option value="APPROVED">승인 (Approved)</option>
                                    <option value="REJECTED">반려 (Rejected)</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"/>
                            </div>
                        </div>

                        {/* Rejection Templates (Conditional) */}
                        {reviewStatus === 'REJECTED' && (
                            <div className="space-y-2 animate-in slide-in-from-top-2">
                                <label className="text-xs font-bold text-rose-500">반려 사유 템플릿</label>
                                <select className="w-full p-2 rounded-lg border border-rose-200 text-xs text-rose-600 focus:outline-none">
                                    <option>사유를 선택하세요</option>
                                    <option>필수 항목 누락</option>
                                    <option>계약 일정 모순 (날짜 오류)</option>
                                    <option>첨부파일 누락/식별 불가</option>
                                    <option>표준계약서 위반 조항 발견</option>
                                </select>
                            </div>
                        )}

                        {/* Internal Memo */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 flex justify-between">
                                내부 메모 (Admin Only)
                                <Lock size={10}/>
                            </label>
                            <textarea 
                                className="w-full h-24 p-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#2b4ea7] bg-slate-50 resize-none"
                                placeholder="운영자간 공유할 특이사항을 입력하세요."
                                value={adminMemo}
                                onChange={(e) => setAdminMemo(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Outbound Message */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 flex justify-between">
                                외부 전달 메시지
                                <Send size={10}/>
                            </label>
                            <textarea 
                                className="w-full h-24 p-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#2b4ea7] resize-none"
                                placeholder="광고주/제작사에게 발송될 메시지입니다."
                                value={outboundMsg}
                                onChange={(e) => setOutboundMsg(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-5 border-t border-slate-200 bg-slate-50/50 space-y-2">
                        <button className="w-full py-3 rounded-xl bg-[#2b4ea7] text-white font-bold text-sm hover:bg-[#203b80] transition-colors shadow-lg shadow-blue-900/10">
                            검수 내용 저장
                        </button>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition-colors">
                                승인 처리
                            </button>
                            <button className="flex-1 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors">
                                반려/수정요청
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractGPTManagement;