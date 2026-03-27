import React, { useState } from 'react';
import { 
    Search, Filter, ChevronRight, Building2, CheckCircle2, XCircle, 
    FileText, Download, Eye, AlertTriangle, ArrowRight, User, Calendar,
    MapPin, Globe, CreditCard, Layers, ExternalLink, RefreshCw, Clock
} from 'lucide-react';
import { StatusBadge, CompanyTypeBadge } from '@/components/Badges';

// Mock Data: Sorted by Request Date (Oldest First typically for processing)
const CERT_REQUESTS = [
    {
        id: 'REQ-202411-001',
        companyName: '스튜디오 블랙',
        type: 'PRODUCTION',
        repName: '박감독',
        reqDate: '2024.11.15 14:00', // Newer
        status: 'PENDING',
        bizNum: '123-45-67890',
        docUrl: 'https://via.placeholder.com/600x800?text=Business+License+Image',
        data: {
            basic: {
                name: '스튜디오 블랙',
                engName: 'Studio Black Inc.',
                desc: '영상 제작의 새로운 기준을 제시합니다.',
                category: ['TVCF', '바이럴', '홍보영상'],
                estDate: { year: '2019', month: '05' }
            },
            detail: {
                ceo: '박감독',
                phone: '02-1234-5678',
                email: 'contact@studioblack.com',
                zip: '06039',
                addr: '서울 강남구 도산대로 12길 25-1',
                detailAddr: '3층 스튜디오',
                website: 'www.studioblack.com'
            },
            intro: {
                desc: '스튜디오 블랙은 5년차 영상 제작 전문 프로덕션입니다. 대기업 TVCF부터 스타트업 바이럴까지 다양한 경험을 보유하고 있습니다.\n\n주요 클라이언트: 삼성전자, 현대자동차, SK텔레콤 등'
            },
            type: {
                subType: '종합 영상 제작',
                budget: '3천만원 ~ 1억원',
                scope: ['기획', '촬영', '편집', '2D/3D'],
                scale: '중소기업',
                employees: '20명 이상',
                portfolio: 'www.studioblack.com/portfolio'
            },
            biz: {
                num: '123-45-67890',
                type: '법인사업자',
                status: 'ACTIVE' // External API Check Result
            }
        }
    },
    {
        id: 'REQ-202411-002',
        companyName: '(주)퓨어랩',
        type: 'ADVERTISER',
        repName: '김대표',
        reqDate: '2024.11.14 10:30', // Older
        status: 'REVIEWING',
        bizNum: '888-22-33333',
        docUrl: 'https://via.placeholder.com/600x800?text=License+Image',
        data: {
            basic: {
                name: '(주)퓨어랩',
                engName: 'PureLab Corp.',
                desc: '자연주의 코스메틱 브랜드',
                category: ['화장품', '유통', '이커머스'],
                estDate: { year: '2023', month: '01' }
            },
            detail: {
                ceo: '김대표',
                phone: '010-1111-2222',
                email: 'ceo@purelab.co.kr',
                zip: '12345',
                addr: '경기 성남시 분당구 판교로',
                detailAddr: '판교테크노밸리 A동',
                website: 'www.purelab.co.kr'
            },
            intro: {
                desc: '새롭게 런칭하는 비건 뷰티 브랜드입니다. 2030 여성을 타겟으로 자연주의 감성의 제품을 만듭니다.'
            },
            type: {
                subType: '패션/뷰티',
                budget: '미정',
                scope: [],
                scale: '스타트업',
                employees: '10명 미만',
                portfolio: ''
            },
            biz: {
                num: '888-22-33333',
                type: '법인사업자',
                status: 'ACTIVE'
            }
        }
    }
];

const CompanyCertification = () => {
    const [selectedReqId, setSelectedReqId] = useState<string>(CERT_REQUESTS[0].id);
    const selectedReq = CERT_REQUESTS.find(r => r.id === selectedReqId) || CERT_REQUESTS[0];
    
    const [rejectReason, setRejectReason] = useState('');
    const [isRejectMode, setIsRejectMode] = useState(false);

    // Section Header Component
    const SectionHeader = ({ num, title }: { num: string, title: string }) => (
        <div className="flex items-center gap-2 mb-4 mt-10 pb-2 border-b border-slate-100">
            <span className="bg-slate-800 text-white text-[10px] font-black px-1.5 py-0.5 rounded">{num}</span>
            <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        </div>
    );

    // Form Field Component
    const Field = ({ label, value, full = false }: { label: string, value: string | React.ReactNode, full?: boolean }) => (
        <div className={`space-y-1.5 ${full ? 'col-span-2' : ''}`}>
            <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                {label}
            </label>
            <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 min-h-[40px] flex items-center">
                {value || <span className="text-slate-300">-</span>}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col animate-in -m-2">
            <div className="flex flex-1 items-start bg-white rounded-xl border border-slate-200 shadow-sm m-2">
                
                {/* 1. Left List Panel (Sticky Sidebar) */}
                <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0 sticky top-20 h-[calc(100vh-6rem)]">
                    <div className="p-4 border-b border-slate-200 bg-white shrink-0">
                        <div className="flex justify-between items-center mb-1">
                            <h2 className="text-lg font-black text-slate-900">심사 대기열</h2>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                신청순
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">처리 대기 중인 인증 요청: <span className="text-[#2b4ea7] font-bold">{CERT_REQUESTS.length}건</span></p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="기업명, 대표자명 검색" 
                                className="w-full pl-9 pr-4 h-9 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#2b4ea7] bg-white transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {CERT_REQUESTS.map(req => (
                            <button 
                                key={req.id}
                                onClick={() => { setSelectedReqId(req.id); setIsRejectMode(false); }}
                                className={`w-full text-left p-4 border-b border-slate-100 transition-all hover:bg-white group ${
                                    selectedReqId === req.id ? 'bg-white border-l-4 border-l-[#2b4ea7] shadow-sm' : 'border-l-4 border-l-transparent'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-bold ${selectedReqId === req.id ? 'text-[#2b4ea7]' : 'text-slate-500'}`}>{req.id}</span>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <Clock size={10} />
                                        {req.reqDate.split(' ')[0]}
                                    </span>
                                </div>
                                <div className="font-bold text-slate-800 mb-1">{req.companyName}</div>
                                <div className="flex items-center gap-2">
                                    <CompanyTypeBadge type={req.type} />
                                    <span className="text-xs text-slate-500">{req.repName}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Middle Panel (Detailed Info Form + Docs) - Natural Scroll */}
                <div className="flex-1 flex flex-col min-w-0 bg-white relative">
                    <div className="p-8 pb-16">
                        <div className="max-w-3xl mx-auto">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                        {selectedReq.companyName}
                                        <CompanyTypeBadge type={selectedReq.type} />
                                    </h1>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><User size={14}/> {selectedReq.repName}</span>
                                        <span className="w-px h-3 bg-slate-300"></span>
                                        <span>요청일시: {selectedReq.reqDate}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <StatusBadge status={selectedReq.status} />
                                    <span className="text-xs text-slate-400 font-medium">사업자번호: {selectedReq.bizNum}</span>
                                </div>
                            </div>

                            {/* SECTION 1: BASIC INFO */}
                            <SectionHeader num="1" title="기본정보" />
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="기업명" value={selectedReq.data.basic.name} />
                                <Field label="기업명 (영어)" value={selectedReq.data.basic.engName} />
                                <Field label="한줄소개" value={selectedReq.data.basic.desc} full />
                                <Field label="업종" value={
                                    <div className="flex gap-1 flex-wrap">
                                        {selectedReq.data.basic.category.map((c, i) => (
                                            <span key={i} className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs">{c}</span>
                                        ))}
                                    </div>
                                } full />
                                <Field label="설립년월" value={`${selectedReq.data.basic.estDate.year}년 ${selectedReq.data.basic.estDate.month}월`} />
                            </div>

                            {/* SECTION 2: DETAIL INFO */}
                            <SectionHeader num="2" title="상세정보" />
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="대표자 성명" value={selectedReq.data.detail.ceo} />
                                <Field label="대표 전화" value={selectedReq.data.detail.phone} />
                                <Field label="대표 이메일" value={selectedReq.data.detail.email} full />
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400">주소</label>
                                    <div className="flex gap-2">
                                        <div className="w-24 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">{selectedReq.data.detail.zip}</div>
                                        <div className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">{selectedReq.data.detail.addr}</div>
                                    </div>
                                    <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">{selectedReq.data.detail.detailAddr}</div>
                                </div>
                                <Field label="Website" value={selectedReq.data.detail.website} full />
                            </div>

                            {/* SECTION 3: INTRO */}
                            <SectionHeader num="3" title="상세소개" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-400">로고</label>
                                    <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-300">
                                        Logo
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-400">상세소개</label>
                                    <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 min-h-[100px] whitespace-pre-wrap leading-relaxed">
                                        {selectedReq.data.intro.desc}
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 4: TYPE */}
                            <SectionHeader num="4" title="기업유형" />
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="세부유형" value={selectedReq.data.type.subType} />
                                <Field label="최소 제작비" value={selectedReq.data.type.budget} />
                                {selectedReq.data.type.scope.length > 0 && (
                                    <Field label="서비스 범위" value={selectedReq.data.type.scope.join(', ')} full />
                                )}
                                <Field label="기업규모" value={selectedReq.data.type.scale} />
                                <Field label="직원수" value={selectedReq.data.type.employees} />
                                <Field label="포트폴리오 URL" value={selectedReq.data.type.portfolio} full />
                            </div>

                            {/* SECTION 5: BIZ INFO (Verification Target) */}
                            <SectionHeader num="5" title="사업자정보 (검증 필수)" />
                            <div className="p-4 bg-[#2b4ea7]/5 border border-[#2b4ea7]/20 rounded-xl mb-4">
                                <div className="flex items-center gap-2 mb-2 text-[#2b4ea7] font-bold text-xs">
                                    <RefreshCw size={14} /> 국세청 API 자동 조회 결과
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                                        <CheckCircle2 size={16}/> 유효한 사업자
                                    </span>
                                    <span className="text-slate-400 text-xs">|</span>
                                    <span className="text-slate-600 text-xs">{selectedReq.data.biz.status === 'ACTIVE' ? '계속사업자' : '휴/폐업'}</span>
                                    <span className="text-slate-400 text-xs">|</span>
                                    <span className="text-slate-600 text-xs">{selectedReq.data.biz.type}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-400">사업자등록번호</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 p-3 bg-white border-2 border-[#2b4ea7]/30 text-[#2b4ea7] rounded-lg text-lg font-black tracking-wider flex items-center">
                                            {selectedReq.data.biz.num}
                                        </div>
                                        <button className="px-4 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors">국세청 재조회</button>
                                    </div>
                                </div>
                                <Field label="사업자 유형" value={selectedReq.data.biz.type} />
                            </div>

                            {/* SECTION 6: DOCUMENTS (Bottom Section) */}
                            <SectionHeader num="6" title="제출 증빙 서류" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Document Preview Box */}
                                <div className="bg-slate-100 rounded-xl border border-slate-200 overflow-hidden min-h-[300px] flex items-center justify-center relative group">
                                    <div className="text-center text-slate-400">
                                        <FileText size={48} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm font-bold">사업자등록증 이미지</p>
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors cursor-pointer flex items-center justify-center group">
                                        <button className="bg-white/90 text-slate-800 px-4 py-2 rounded-full text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                            <ExternalLink size={12}/> 원본 크게보기
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Checklist */}
                                <div className="space-y-4">
                                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-yellow-800 text-xs">
                                        <strong className="block mb-2 flex items-center gap-1 text-yellow-900 font-bold"><AlertTriangle size={14}/> 심사 체크리스트</strong>
                                        <ul className="space-y-2 list-disc list-inside marker:text-yellow-400">
                                            <li><strong>사업자등록번호</strong>가 입력된 정보와 일치합니까?</li>
                                            <li><strong>대표자명</strong>이 입력된 정보와 일치합니까?</li>
                                            <li><strong>개업연월일</strong>이 일치합니까?</li>
                                            <li>국세청 조회 결과가 <strong>계속사업자</strong>입니까?</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 text-xs">
                                        <strong className="block mb-2 font-bold text-slate-700">시스템 자동 분석</strong>
                                        <div className="flex items-center gap-2 text-emerald-600 font-bold mb-1">
                                            <CheckCircle2 size={12}/> 텍스트 추출 일치율 98%
                                        </div>
                                        <p>OCR을 통해 추출된 텍스트가 입력된 정보와 대부분 일치합니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions (Normal Flow, Not Sticky) */}
                    <div className="border-t border-slate-200 bg-white p-4">
                        <div className="max-w-3xl mx-auto">
                            {!isRejectMode ? (
                                <div className="flex justify-end gap-3">
                                    <button 
                                        onClick={() => setIsRejectMode(true)}
                                        className="px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-50 transition-colors shadow-sm"
                                    >
                                        반려 (재요청)
                                    </button>
                                    <button className="px-8 py-3 bg-[#2b4ea7] text-white rounded-xl font-bold text-sm hover:bg-[#203b80] transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                                        <CheckCircle2 size={18}/> 인증 승인
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 animate-in slide-in-from-bottom-2 bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-bold text-rose-600 flex items-center gap-1">
                                            <XCircle size={14}/> 반려 사유 입력
                                        </label>
                                        <button onClick={() => setIsRejectMode(false)} className="text-xs text-slate-400 hover:text-slate-600 font-bold underline">취소</button>
                                    </div>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text"
                                            placeholder="반려 사유를 입력하세요. (예: 사업자등록증 식별 불가, 정보 불일치 등)"
                                            className="flex-1 h-10 px-3 rounded-lg border border-rose-200 text-sm focus:outline-none focus:border-rose-500 bg-white"
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                        />
                                        <button 
                                            className="px-6 h-10 bg-rose-600 text-white rounded-lg font-bold text-xs hover:bg-rose-700 shadow-md whitespace-nowrap"
                                        >
                                            반려 처리
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyCertification;