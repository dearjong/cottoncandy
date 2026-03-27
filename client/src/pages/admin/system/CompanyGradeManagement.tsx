import React, { useState, useMemo } from 'react';
import { 
    Medal, Star, Settings, AlertCircle, CheckCircle2, 
    ArrowUpRight, ArrowDownRight, Search, Filter, 
    Save, RotateCcw, Info, Users, Crown
} from 'lucide-react';
import { CompanyTypeBadge, CompanyGradeBadge } from '@/components/Badges';
import { MOCK_COMPANIES } from '@/data/mockData';

// 초기 설정값 (이미지 기준)
const INITIAL_RULES = {
    GOLD: { count: 100, rating: 4.7 },
    SILVER: { count: 50, rating: 4.5 },
    BRONZE: { count: 30, rating: 4.0 }
};

interface CompanyGradeManagementProps {
    onTabChange?: (tabId: string) => void;
}

const CompanyGradeManagement = ({ onTabChange }: CompanyGradeManagementProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [rules, setRules] = useState(INITIAL_RULES);
    const [tempRules, setTempRules] = useState(INITIAL_RULES);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL'); // ALL, MISMATCH, UPGRADE, DOWNGRADE

    // 등급 계산 로직 (시뮬레이션용)
    const calculateSuggestedGrade = (portfolioCount: number, rating: number | string) => {
        const rate = typeof rating === 'string' ? 0 : rating;
        
        if (portfolioCount >= rules.GOLD.count && rate >= rules.GOLD.rating) return 'GOLD';
        if (portfolioCount >= rules.SILVER.count && rate >= rules.SILVER.rating) return 'SILVER';
        if (portfolioCount >= rules.BRONZE.count && rate >= rules.BRONZE.rating) return 'BRONZE';
        return 'NEW';
    };

    // 데이터 가공: 현재 등급 vs 적정 등급 비교
    const analyzedCompanies = useMemo<any[]>(() => {
        return MOCK_COMPANIES.map((company: any) => {
            // admin_v2 UI가 기대하는 필드명과 mock 데이터 필드명이 다름.
            // 화면 동작을 유지하기 위해 mock에서 필요한 값을 파생합니다.
            const portfolioCount =
                typeof company.portfolioCount === 'number'
                    ? company.portfolioCount
                    : (company.participationCount ?? 0);

            const isTvcfVerified =
                typeof company.isTvcfVerified === 'boolean'
                    ? company.isTvcfVerified
                    : company.status === 'APPROVED';

            const suggested = calculateSuggestedGrade(
                portfolioCount,
                company.rating === '-' ? 0 : company.rating,
            );

            let status = 'MATCH'; // 적정
            if (company.grade !== suggested) {
                // 등급 우선순위: GOLD > SILVER > BRONZE > NEW
                const grades = ['NEW', 'BRONZE', 'SILVER', 'GOLD'];
                const currentIdx = grades.indexOf(company.grade);
                const suggestedIdx = grades.indexOf(suggested);
                
                status = suggestedIdx > currentIdx ? 'UPGRADE' : 'DOWNGRADE';
            }

            return { ...company, portfolioCount, isTvcfVerified, suggestedGrade: suggested, status };
        });
    }, [rules]);

    // 필터링
    const filteredList = useMemo<any[]>(() => {
        return analyzedCompanies.filter((c: any) => {
            const searchMatch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.rep.toLowerCase().includes(searchTerm.toLowerCase());
            
            let typeMatch = true;
            if (filterType === 'MISMATCH') typeMatch = c.status !== 'MATCH';
            else if (filterType === 'UPGRADE') typeMatch = c.status === 'UPGRADE';
            else if (filterType === 'DOWNGRADE') typeMatch = c.status === 'DOWNGRADE';

            return searchMatch && typeMatch;
        });
    }, [analyzedCompanies, searchTerm, filterType]);

    // 통계
    const stats = useMemo(() => ({
        gold: analyzedCompanies.filter(c => c.grade === 'GOLD').length,
        silver: analyzedCompanies.filter(c => c.grade === 'SILVER').length,
        bronze: analyzedCompanies.filter(c => c.grade === 'BRONZE').length,
        new: analyzedCompanies.filter(c => c.grade === 'NEW').length,
        upgradeTarget: analyzedCompanies.filter(c => c.status === 'UPGRADE').length,
        downgradeTarget: analyzedCompanies.filter(c => c.status === 'DOWNGRADE').length,
    }), [analyzedCompanies]);

    // 핸들러
    const handleSaveRules = () => {
        setRules(tempRules);
        setIsEditing(false);
    };

    const handleCancelRules = () => {
        setTempRules(rules);
        setIsEditing(false);
    };

    const handleRuleChange = (grade: 'GOLD' | 'SILVER' | 'BRONZE', field: 'count' | 'rating', value: string) => {
        setTempRules(prev => ({
            ...prev,
            [grade]: {
                ...prev[grade],
                [field]: parseFloat(value)
            }
        }));
    };

    // 등급 카드 컴포넌트
    const GradeCard = ({ grade, title, icon, colorClass, borderClass, bgClass, count }: any) => {
        const ruleKey = grade as 'GOLD' | 'SILVER' | 'BRONZE';
        const rule = tempRules[ruleKey];

        return (
            <div className={`relative p-5 rounded-2xl border ${borderClass} ${bgClass} flex flex-col justify-between min-h-[160px] transition-all`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm ${colorClass}`}>
                            {icon}
                        </div>
                        <div>
                            <h3 className={`font-black text-lg ${colorClass}`}>{title}</h3>
                            <p className="text-xs font-bold opacity-60">현재 {count}개사</p>
                        </div>
                    </div>
                </div>

                {grade === 'NEW' ? (
                    <div className="text-sm font-medium text-slate-500 bg-white/50 p-3 rounded-lg border border-slate-100">
                        활동 이력이 없거나<br/>최소 요건 미충족
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                            <span className="text-[10px] font-bold text-slate-400">포트폴리오</span>
                            {isEditing ? (
                                <div className="flex items-center gap-1">
                                    <input 
                                        type="number" 
                                        className="w-12 h-6 text-right text-sm font-bold border-b border-slate-300 focus:outline-none focus:border-[#2b4ea7]"
                                        value={rule.count}
                                        onChange={(e) => handleRuleChange(ruleKey, 'count', e.target.value)}
                                    />
                                    <span className="text-xs text-slate-500">건↑</span>
                                </div>
                            ) : (
                                <span className="text-sm font-black text-slate-700">{rule.count}건 이상</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                            <span className="text-[10px] font-bold text-slate-400">평균 평점</span>
                            {isEditing ? (
                                <div className="flex items-center gap-1">
                                    <input 
                                        type="number" 
                                        step="0.1"
                                        className="w-12 h-6 text-right text-sm font-bold border-b border-slate-300 focus:outline-none focus:border-[#2b4ea7]"
                                        value={rule.rating}
                                        onChange={(e) => handleRuleChange(ruleKey, 'rating', e.target.value)}
                                    />
                                    <span className="text-xs text-slate-500">점↑</span>
                                </div>
                            ) : (
                                <span className="text-sm font-black text-slate-700">{rule.rating}점 이상</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 p-6 animate-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">등급 정책 관리</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">TVCF 포트폴리오 및 리뷰 평점을 기준으로 파트너 등급을 산정합니다.</p>
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={handleCancelRules}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                            >
                                취소
                            </button>
                            <button 
                                onClick={handleSaveRules}
                                className="px-4 py-2 bg-[#2b4ea7] text-white rounded-xl font-bold text-sm hover:bg-[#203b80] transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"
                            >
                                <Save size={16} /> 변경사항 저장
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2.5 bg-[#2b4ea7] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#203b80] hover:shadow-lg transition-all flex items-center gap-2 border border-[#1f3a7a]"
                        >
                            <Settings size={16} className="text-white" /> 기준 설정 변경
                        </button>
                    )}
                </div>
            </div>

            {/* 1. Grade Policy Config Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GradeCard 
                    grade="GOLD" 
                    title="Gold" 
                    icon={<Medal size={20} className="text-amber-500 fill-amber-500"/>}
                    bgClass="bg-amber-50/50"
                    borderClass="border-amber-100"
                    colorClass="text-amber-600"
                    count={stats.gold}
                />
                <GradeCard 
                    grade="SILVER" 
                    title="Silver" 
                    icon={<Medal size={20} className="text-slate-400 fill-slate-400"/>}
                    bgClass="bg-slate-100/50"
                    borderClass="border-slate-200"
                    colorClass="text-slate-500"
                    count={stats.silver}
                />
                <GradeCard 
                    grade="BRONZE" 
                    title="Bronze" 
                    icon={<Medal size={20} className="text-orange-700 fill-orange-700"/>}
                    bgClass="bg-orange-50/50"
                    borderClass="border-orange-100"
                    colorClass="text-orange-800"
                    count={stats.bronze}
                />
                <GradeCard 
                    grade="NEW" 
                    title="New" 
                    icon={<Crown size={20} className="text-emerald-500 fill-emerald-500"/>}
                    bgClass="bg-emerald-50/50"
                    borderClass="border-emerald-100"
                    colorClass="text-emerald-600"
                    count={stats.new}
                />
            </div>

            {/* 2. Simulation Alert & Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                        <Info size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm mb-1">등급 자동 심사 현황</h4>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            현재 설정된 기준에 따라 <strong className="text-emerald-600">승급 대상 {stats.upgradeTarget}개사</strong>, <strong className="text-rose-600">강등 대상 {stats.downgradeTarget}개사</strong>가 감지되었습니다.<br/>
                            '자동 적용'을 누르면 시스템 제안대로 일괄 변경됩니다.
                        </p>
                    </div>
                </div>
                {(stats.upgradeTarget > 0 || stats.downgradeTarget > 0) && (
                    <button className="whitespace-nowrap px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 shadow-md flex items-center gap-2 transition-all">
                        <RotateCcw size={16} /> 등급 현행화 (일괄 적용)
                    </button>
                )}
            </div>

            {/* 3. Company Grade List Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                    <div className="flex gap-2 w-full md:w-auto">
                        {['ALL', 'MISMATCH', 'UPGRADE', 'DOWNGRADE'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilterType(tab)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                                    filterType === tab 
                                    ? 'bg-white text-[#2b4ea7] border-[#2b4ea7] shadow-sm' 
                                    : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'
                                }`}
                            >
                                {{
                                    ALL: '전체 목록',
                                    MISMATCH: `불일치 (${stats.upgradeTarget + stats.downgradeTarget})`,
                                    UPGRADE: `승급 대상 (${stats.upgradeTarget})`,
                                    DOWNGRADE: `강등 대상 (${stats.downgradeTarget})`
                                }[tab]}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="기업명 검색" 
                            className="pl-9 pr-4 h-9 w-full md:w-64 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#2b4ea7] transition-all bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                            <tr>
                                <th className="p-4 font-bold w-10"><input type="checkbox" className="rounded border-slate-300"/></th>
                                <th className="p-4 font-bold">기업 정보</th>
                                <th className="p-4 font-bold text-center">현재 등급</th>
                                <th className="p-4 font-bold text-center">실적 (포트폴리오)</th>
                                <th className="p-4 font-bold text-center">평판 (평점)</th>
                                <th className="p-4 font-bold text-center">시스템 제안 (적정 등급)</th>
                                <th className="p-4 font-bold text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredList.map((company) => (
                                <tr key={company.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4"><input type="checkbox" className="rounded border-slate-300"/></td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs">
                                                {company.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                                    {company.name}
                                                    {company.isTvcfVerified && <span className="text-[9px] text-blue-600 bg-blue-50 px-1 rounded">TVCF</span>}
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">{company.rep}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <CompanyGradeBadge grade={company.grade} />
                                    </td>
                                    <td className="p-4 text-center">
                                        {onTabChange ? (
                                            <button
                                                type="button"
                                                onClick={() => onTabChange('projects')}
                                                className="font-bold text-slate-700 text-sm hover:text-[#2b4ea7] hover:underline cursor-pointer transition-colors"
                                            >
                                                {company.portfolioCount}
                                            </button>
                                        ) : (
                                            <span className="font-bold text-slate-700 text-sm">{company.portfolioCount}</span>
                                        )}
                                        <span className="text-slate-400 text-xs ml-1">건</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star size={12} className="text-amber-400 fill-amber-400" />
                                            <span className="font-bold text-slate-700 text-sm">{company.rating}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        {company.status === 'MATCH' ? (
                                            <span className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                                <CheckCircle2 size={12}/> 적정
                                            </span>
                                        ) : (
                                            <div className={`flex items-center justify-center gap-2 p-1.5 rounded-lg border ${
                                                company.status === 'UPGRADE' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
                                            }`}>
                                                {company.status === 'UPGRADE' 
                                                    ? <ArrowUpRight size={14} className="text-emerald-600"/> 
                                                    : <ArrowDownRight size={14} className="text-rose-600"/>
                                                }
                                                <div className="flex flex-col items-start">
                                                    <span className={`text-[9px] font-bold ${company.status === 'UPGRADE' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {company.status === 'UPGRADE' ? '승급 대상' : '강등 대상'}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs font-bold text-slate-400 line-through decoration-slate-300 decoration-2">{company.grade}</span>
                                                        <span className="text-xs text-slate-400">→</span>
                                                        <CompanyGradeBadge grade={company.suggestedGrade} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                company.status === 'MATCH'
                                                ? 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                                : 'bg-slate-800 text-white border-slate-800 hover:bg-slate-700 shadow-sm'
                                            }`}
                                        >
                                            {company.status === 'MATCH' ? '수동 변경' : '등급 적용'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (Mock) */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-xs text-slate-500 font-medium">총 {filteredList.length}개 항목</span>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 bg-white hover:bg-slate-50 disabled:opacity-50">1</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyGradeManagement;

