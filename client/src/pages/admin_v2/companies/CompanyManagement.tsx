import React, { useState } from 'react';
import { 
    Building2, Star, Video, ShieldAlert, Search, 
    Filter, Download, MoreHorizontal, ChevronLeft, ChevronRight, Briefcase as BriefcaseIcon, CheckCircle,
    Trophy, LayoutGrid, Users, X, User, MapPin, Globe, Mail, Phone, Calendar
} from 'lucide-react';
import { CompanyTypeBadge, StatusBadge, CompanyGradeBadge } from '@/components/Badges';
import { MOCK_COMPANIES } from '@/data/mockData';

const CompanyManagement = () => {
    const [companyTypeFilter, setCompanyTypeFilter] = useState('ALL');
    const [gradeFilter, setGradeFilter] = useState('ALL');
    const [selectedCompany, setSelectedCompany] = useState<typeof MOCK_COMPANIES[0] | null>(null);

    // Stats Calculation
    const totalCompanies = MOCK_COMPANIES.length;
    const newCompanies = MOCK_COMPANIES.filter(c => c.joinDate.startsWith('2024.11')).length;
    // PRD High Value: Gold/Silver Partners
    const premiumPartners = MOCK_COMPANIES.filter(c => c.grade === 'GOLD' || c.grade === 'SILVER').length;
    const pendingCompanies = MOCK_COMPANIES.filter(c => c.status === 'PENDING').length;

    const filteredCompanies = MOCK_COMPANIES.filter(company => {
        const typeMatch = companyTypeFilter === 'ALL' || (companyTypeFilter === 'PENDING' ? company.status === 'PENDING' : company.type === companyTypeFilter);
        const gradeMatch = gradeFilter === 'ALL' || company.grade === gradeFilter;
        return typeMatch && gradeMatch;
    });

    // --- Detail Drawer Component ---
    const CompanyDetailDrawer = () => {
        if (!selectedCompany) return null;

        return (
            <>
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setSelectedCompany(null)}
                ></div>
                <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-2xl z-50 transform transition-transform animate-in slide-in-from-right flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <CompanyTypeBadge type={selectedCompany.type} />
                                <CompanyGradeBadge grade={selectedCompany.grade} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                {selectedCompany.name}
                            </h2>
                            <div className="text-sm text-slate-500 mt-1 flex gap-2">
                                <span>{selectedCompany.id}</span>
                                <span className="text-slate-300">|</span>
                                <span>가입일: {selectedCompany.joinDate}</span>
                            </div>
                        </div>
                        <button onClick={() => setSelectedCompany(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                <span className="text-[10px] font-bold text-slate-400 block mb-1">직원수</span>
                                <span className="font-black text-slate-800">{selectedCompany.employeeCount}명</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                <span className="text-[10px] font-bold text-slate-400 block mb-1">총 의뢰/참여</span>
                                <span className="font-black text-slate-800">{Math.max(selectedCompany.requestCount, selectedCompany.participationCount)}건</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                <span className="text-[10px] font-bold text-slate-400 block mb-1">평점</span>
                                <span className="font-black text-amber-500 flex items-center justify-center gap-1">
                                    <Star size={12} fill="currentColor"/> {selectedCompany.rating}
                                </span>
                            </div>
                        </div>

                        {/* Basic Info (Read Only) */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">기본 정보</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <span className="text-xs font-bold text-slate-400">대표자</span>
                                    <span className="col-span-2 text-sm font-medium text-slate-700">{selectedCompany.rep}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <span className="text-xs font-bold text-slate-400">연락처</span>
                                    <span className="col-span-2 text-sm font-medium text-slate-700">{selectedCompany.phone}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <span className="text-xs font-bold text-slate-400">이메일</span>
                                    <span className="col-span-2 text-sm font-medium text-slate-700">{selectedCompany.email}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <span className="text-xs font-bold text-slate-400">기업규모</span>
                                    <span className="col-span-2 text-sm font-medium text-slate-700">{selectedCompany.scale}</span>
                                </div>
                            </div>
                        </section>

                        {/* Status Info */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">상태 및 인증</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <span className="text-xs font-bold text-slate-400">계정 상태</span>
                                    <div className="col-span-2">
                                        <StatusBadge status={selectedCompany.status} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <span className="text-xs font-bold text-slate-400">TVCF 인증</span>
                                    <div className="col-span-2">
                                        {selectedCompany.isTvcfVerified ? (
                                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                                <CheckCircle size={12}/> 인증 완료 (TVCF DB 연동됨)
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-slate-400">미인증</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Actions */}
                    <div className="p-5 border-t border-slate-200 bg-slate-50 flex gap-2">
                        <button className="flex-1 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100">
                            정보 수정
                        </button>
                        <button className="flex-1 py-2.5 bg-[#2b4ea7] text-white rounded-lg text-xs font-bold hover:bg-[#203b80]">
                            로그인 차단/관리
                        </button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">기업 관리</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">TVCF DB 기반의 기업 등급 및 승인 상태를 관리합니다.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: '전체 기업', value: totalCompanies, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: '우수 파트너 (Gold/Silver)', value: premiumPartners, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: '이번 달 신규', value: `+${newCompanies}`, icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: '승인 대기', value: pendingCompanies, icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 mb-0.5">{stat.label}</p>
                            <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-1">
                <div className="flex items-center gap-2">
                    {['ALL', 'ADVERTISER', 'AGENCY', 'PRODUCTION', 'PENDING'].map((tab) => {
                        const labels: Record<string, string> = { 
                            'ALL': '전체', 
                            'ADVERTISER': '광고주', 
                            'AGENCY': '대행사',
                            'PRODUCTION': '제작사', 
                            'PENDING': '승인대기' 
                        };
                        return (
                            <button
                                key={tab}
                                onClick={() => setCompanyTypeFilter(tab)}
                                className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors relative ${
                                    companyTypeFilter === tab 
                                    ? 'text-[#2b4ea7] border-b-2 border-[#2b4ea7]' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {labels[tab]}
                                {tab === 'PENDING' && pendingCompanies > 0 && (
                                    <span className="ml-1.5 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{pendingCompanies}</span>
                                )}
                            </button>
                        )
                    })}
                </div>
                {/* Grade Filter Dropdown */}
                 <select 
                    className="h-9 pl-3 pr-8 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 focus:outline-none focus:border-[#2b4ea7] bg-white mb-2 md:mb-0"
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                 >
                    <option value="ALL">모든 등급</option>
                    <option value="GOLD">Gold 등급</option>
                    <option value="SILVER">Silver 등급</option>
                    <option value="BRONZE">Bronze 등급</option>
                    <option value="NEW">New (신규)</option>
                 </select>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="기업명, 대표관리자, 이메일 검색" 
                            className="pl-9 pr-4 h-10 w-64 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7] transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                            <Filter size={14} /> 상세 필터
                        </button>
                        <button className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                            <Download size={14} /> 엑셀 다운로드
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                            <th className="p-4 font-bold w-10">
                                <input type="checkbox" className="rounded border-slate-300" />
                            </th>
                            <th className="p-4 font-bold">기업 정보</th>
                            <th className="p-4 font-bold">구분</th>
                            <th className="p-4 font-bold">등급</th>
                            <th className="p-4 font-bold">대표관리자</th>
                            <th className="p-4 font-bold">직원수</th>
                            <th className="p-4 font-bold">의뢰</th>
                            <th className="p-4 font-bold">참여</th>
                            <th className="p-4 font-bold">평점</th>
                            <th className="p-4 font-bold">상태</th>
                            <th className="p-4 font-bold">가입일</th>
                            <th className="p-4 font-bold text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredCompanies.map((company) => (
                            <tr 
                                key={company.id} 
                                onClick={() => setSelectedCompany(company)}
                                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                            >
                                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-slate-300" />
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-sm">
                                            {company.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm flex items-center gap-1 group-hover:text-[#2b4ea7] transition-colors">
                                                {company.name}
                                                {company.isTvcfVerified && (
                                                    <span className="bg-[#2b4ea7] text-white text-[9px] px-1 rounded-sm font-bold" title="TVCF DB 연동됨">TVCF</span>
                                                )}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 mt-0.5 flex gap-1 items-center">
                                                <span>{company.id}</span>
                                                <span className="w-0.5 h-2 bg-slate-200"></span>
                                                <span>{company.scale}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <CompanyTypeBadge type={company.type} />
                                </td>
                                <td className="p-4">
                                    <CompanyGradeBadge grade={company.grade} />
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-bold text-slate-700">{company.rep}</div>
                                    <div className="text-xs text-slate-400">{company.email}</div>
                                    <div className="text-xs text-slate-400">{company.phone}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <Users size={14} />
                                        </div>
                                        {company.employeeCount.toLocaleString()}명
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
                                            <BriefcaseIcon size={12} className="text-slate-400"/>
                                            {company.requestCount}건
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                         <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
                                            <CheckCircle size={12} className="text-slate-400"/>
                                            {company.participationCount}건
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {company.rating !== '-' ? (
                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100 w-fit">
                                            <Star size={12} className="text-yellow-500 fill-yellow-500"/>
                                            <span className="text-xs font-bold text-yellow-700">{company.rating}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-300 font-medium px-2">-</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={company.status} />
                                </td>
                                <td className="p-4 text-xs text-slate-500 font-medium">
                                    {company.joinDate}
                                </td>
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
                 {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">총 {filteredCompanies.length}개 항목</span>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"><ChevronLeft size={14}/></button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#2b4ea7] text-white font-bold text-xs">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"><ChevronRight size={14}/></button>
                    </div>
                </div>
            </div>

            {/* Detail Drawer */}
            <CompanyDetailDrawer />
        </div>
    );
};

export default CompanyManagement;