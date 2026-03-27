import React, { useState, useMemo } from 'react';
import { 
    Users, Search, Filter, Download, MoreHorizontal, 
    ChevronDown, Mail, Phone, Building2,
    Briefcase, Video, LayoutGrid, X, Check, UserPlus,
    Trash2, ShieldAlert, Lock
} from 'lucide-react';
import { CompanyTypeBadge, CompanyGradeBadge } from '@/components/Badges';
import { MOCK_EMPLOYEES, MOCK_COMPANIES } from '@/data/mockData';

// 한글 초성 추출 헬퍼 함수
const getHangulInitial = (str: string) => {
    if (!str) return '기타';
    const code = str.charCodeAt(0);
    
    // 한글 유니코드 범위: AC00(44032) ~ D7A3(55203)
    if (code >= 0xAC00 && code <= 0xD7A3) {
        const charCode = code - 0xAC00;
        const choIndex = Math.floor(charCode / 21 / 28);
        const standardCho = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        const cho = standardCho[choIndex];
        
        // 쌍자음은 단자음으로 매핑 (필터 단순화)
        const map: Record<string, string> = { 'ㄲ': 'ㄱ', 'ㄸ': 'ㄷ', 'ㅃ': 'ㅂ', 'ㅆ': 'ㅅ', 'ㅉ': 'ㅈ' };
        return map[cho] || cho;
    }
    
    if (/[a-zA-Z]/.test(str[0])) return 'A-Z';
    return '기타';
};

const CONSONANTS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'A-Z'];

const EmployeeManagement = () => {
    // States
    const [selectedCompany, setSelectedCompany] = useState<typeof MOCK_COMPANIES[0] | null>(null);
    const [companySearch, setCompanySearch] = useState('');
    const [companyTypeTab, setCompanyTypeTab] = useState('ALL');
    
    // Filter States
    const [statusTab, setStatusTab] = useState('ALL'); // ALL, ACTIVE, SUSPENDED, PENDING
    const [deptFilter, setDeptFilter] = useState('전체');
    const [initialFilter, setInitialFilter] = useState('전체');
    const [employeeSearch, setEmployeeSearch] = useState('');

    // 1. Filter Companies (Sidebar)
    const filteredCompanies = useMemo(() => {
        return MOCK_COMPANIES.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(companySearch.toLowerCase()) || 
                                c.rep.toLowerCase().includes(companySearch.toLowerCase());
            const matchesType = companyTypeTab === 'ALL' || c.type === companyTypeTab;
            return matchesSearch && matchesType;
        });
    }, [companySearch, companyTypeTab]);

    // 2. Base Employees (By Selected Company)
    const baseEmployees = useMemo(() => {
        return selectedCompany
            ? MOCK_EMPLOYEES.filter(e => e.companyName === selectedCompany.name)
            : MOCK_EMPLOYEES;
    }, [selectedCompany]);

    // 3. Dynamic Departments (Extract from current employees)
    const departments = useMemo(() => {
        const depts = new Set(baseEmployees.map(e => e.department).filter(Boolean));
        return ['전체', ...Array.from(depts)];
    }, [baseEmployees]);

    // 4. Apply Filters (Status, Dept, Initial, Search)
    const filteredEmployees = useMemo(() => {
        return baseEmployees.filter(employee => {
            // Search Filter
            const searchLower = employeeSearch.toLowerCase();
            const searchMatch = !employeeSearch || 
                employee.name.toLowerCase().includes(searchLower) ||
                employee.email.toLowerCase().includes(searchLower) ||
                employee.phone.includes(searchLower);

            if (!searchMatch) return false;

            // Status Tab Filter
            let statusMatch = true;
            if (statusTab === 'ACTIVE') statusMatch = employee.status === 'ACTIVE';
            else if (statusTab === 'SUSPENDED') statusMatch = employee.status === 'SUSPENDED' || employee.status === 'STOPPED';
            else if (statusTab === 'PENDING') statusMatch = employee.status === 'PENDING';

            // Dept Filter
            const deptMatch = deptFilter === '전체' || employee.department === deptFilter;

            // Initial Filter
            const initial = getHangulInitial(employee.name);
            const initialMatch = initialFilter === '전체' || initial === initialFilter;

            return statusMatch && deptMatch && initialMatch;
        });
    }, [baseEmployees, statusTab, deptFilter, initialFilter, employeeSearch]);

    // Stats for Tabs
    const stats = useMemo(() => ({
        all: baseEmployees.length,
        active: baseEmployees.filter(e => e.status === 'ACTIVE').length,
        suspended: baseEmployees.filter(e => e.status === 'SUSPENDED' || e.status === 'STOPPED').length,
        pending: baseEmployees.filter(e => e.status === 'PENDING').length
    }), [baseEmployees]);

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] animate-in gap-4">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0 mb-1">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">구성원 관리</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                      기업별 구성원 계정을 조회하고 권한 제어 및 강제 탈퇴 처리를 할 수 있습니다.
                  </p>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">
                {/* Left Sidebar: Company List */}
                <div className="w-72 bg-white rounded-xl border border-slate-200 flex flex-col shrink-0 shadow-sm overflow-hidden">
                    {/* Sidebar Header */}
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50 space-y-3">
                         <div className="flex p-1 bg-slate-200/50 rounded-lg">
                            {[
                                { id: 'ALL', icon: LayoutGrid, label: '전체' },
                                { id: 'ADVERTISER', icon: Briefcase, label: '광고주' },
                                { id: 'PRODUCTION', icon: Video, label: '제작사' },
                                { id: 'AGENCY', icon: Users, label: '대행사' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setCompanyTypeTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all ${
                                        companyTypeTab === tab.id 
                                        ? 'bg-white text-[#2b4ea7] shadow-sm' 
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                    title={tab.label}
                                >
                                    <tab.icon size={14} />
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="기업명 검색" 
                                className="w-full pl-9 pr-4 h-9 rounded-lg border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#2b4ea7] bg-white transition-all"
                                value={companySearch}
                                onChange={(e) => setCompanySearch(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* Company List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        <button 
                            onClick={() => setSelectedCompany(null)}
                            className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between group border ${
                                selectedCompany === null 
                                ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                                : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'
                            }`}
                        >
                            <span className="font-bold text-sm">전체 기업 보기</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                selectedCompany === null ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>{MOCK_EMPLOYEES.length}</span>
                        </button>
                        
                        <div className="h-px bg-slate-100 my-2 mx-2"></div>

                        {filteredCompanies.map(company => (
                            <button 
                                key={company.id}
                                onClick={() => setSelectedCompany(company)}
                                className={`w-full text-left p-3 rounded-lg transition-all border group relative ${
                                    selectedCompany?.id === company.id
                                    ? 'bg-white border-[#2b4ea7] ring-1 ring-[#2b4ea7] shadow-md z-10' 
                                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-bold text-sm truncate pr-6 ${selectedCompany?.id === company.id ? 'text-[#2b4ea7]' : 'text-slate-800'}`}>
                                        {company.name}
                                    </span>
                                    {company.isTvcfVerified && (
                                        <span className="absolute top-3 right-3 shrink-0 text-[8px] font-black text-[#2b4ea7] bg-blue-50 px-1 rounded">TVCF</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                     <CompanyTypeBadge type={company.type} />
                                     <CompanyGradeBadge grade={company.grade} />
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-400">
                                    <span>{company.rep}</span>
                                    <div className="flex items-center gap-1">
                                        <Users size={12} /> {company.employeeCount}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Content: Employee Detail View */}
                <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    
                    {/* 1. Top Toolbar: Search & Actions */}
                    <div className="px-5 py-4 bg-white flex justify-between items-center border-b border-slate-100">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="이름, 이메일, 연락처 검색" 
                                className="pl-10 pr-4 h-10 w-80 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7] bg-slate-50 focus:bg-white transition-all"
                                value={employeeSearch}
                                onChange={(e) => setEmployeeSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                             <button className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-bold hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                <Download size={14} /> 엑셀 다운로드
                            </button>
                        </div>
                    </div>

                    {/* 2. Status Tabs */}
                    <div className="flex border-b border-slate-100 bg-slate-50/30">
                        {[
                            { id: 'ALL', label: '전체', count: stats.all },
                            { id: 'ACTIVE', label: '활동승인', count: stats.active },
                            { id: 'SUSPENDED', label: '활동중지', count: stats.suspended },
                            { id: 'PENDING', label: '구성원 승인대기', count: stats.pending },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusTab(tab.id)}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                                    statusTab === tab.id
                                    ? 'border-[#2b4ea7] text-[#2b4ea7] bg-white'
                                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                                }`}
                            >
                                {tab.label}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    statusTab === tab.id ? 'bg-[#2b4ea7]/10 text-[#2b4ea7]' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* 3. Advanced Filters (Dept, Initial) */}
                    <div className="px-5 py-4 space-y-3 border-b border-slate-100 bg-white">
                        {/* Department Filter Row */}
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-500 w-12 shrink-0">부서별</span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {departments.map(dept => (
                                    <button
                                        key={dept}
                                        onClick={() => setDeptFilter(dept)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                            deptFilter === dept
                                            ? 'bg-slate-800 border-slate-800 text-white shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                    >
                                        {dept}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hangul Initial Filter Row */}
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-500 w-12 shrink-0">가나다</span>
                            <div className="flex items-center gap-1 flex-wrap">
                                <button
                                    onClick={() => setInitialFilter('전체')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                        initialFilter === '전체'
                                        ? 'bg-slate-800 border-slate-800 text-white shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                                    }`}
                                >
                                    전체
                                </button>
                                {CONSONANTS.map(char => (
                                    <button
                                        key={char}
                                        onClick={() => setInitialFilter(char)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all border ${
                                            initialFilter === char
                                            ? 'bg-slate-100 border-slate-300 text-slate-700'
                                            : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                    >
                                        {char}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. Table */}
                    <div className="flex-1 overflow-x-auto min-w-0">
                        <table className="w-full min-w-[800px] text-left border-collapse">
                            <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
                                <tr className="border-b border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider">
                                    <th className="p-4 font-bold w-10">
                                        <input type="checkbox" className="rounded border-slate-300" />
                                    </th>
                                    <th className="p-4 font-bold">이름</th>
                                    <th className="p-4 font-bold">닉네임/ID</th>
                                    <th className="p-4 font-bold">부서</th>
                                    <th className="p-4 font-bold">직책</th>
                                    <th className="p-4 font-bold">권한</th>
                                    <th className="p-4 font-bold">이메일</th>
                                    <th className="p-4 font-bold text-center">활동제어</th>
                                    <th className="p-4 font-bold text-center">계정관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredEmployees.length > 0 ? filteredEmployees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group bg-white">
                                        <td className="p-4">
                                            <input type="checkbox" className="rounded border-slate-300" />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-800 text-sm">{emp.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                                                     {/* Random Avatar Emoji based on ID */}
                                                     <span className="text-[10px]">
                                                        {parseInt(emp.id.replace(/\D/g,'')) % 2 === 0 ? '🦁' : '🐰'}
                                                     </span>
                                                </div>
                                                <span className="text-xs font-medium text-slate-500">
                                                    {emp.id.split('-')[0]}{parseInt(emp.id.replace(/\D/g,''))}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-bold text-slate-600">{emp.department}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs text-slate-500">{emp.role === 'MASTER' ? '대표이사' : emp.role === 'MANAGER' ? '팀장' : '사원'}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="relative group/dropdown inline-block">
                                                <button className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded border transition-colors ${
                                                    emp.role === 'MASTER' ? 'text-rose-500 border-rose-200 bg-rose-50' :
                                                    emp.role === 'MANAGER' ? 'text-slate-700 border-slate-300 bg-white' :
                                                    'text-slate-500 border-slate-200 bg-slate-50'
                                                }`}>
                                                    {emp.role === 'MASTER' ? '대표관리자' : emp.role === 'MANAGER' ? '중간관리자' : '일반직원'}
                                                    <ChevronDown size={10} />
                                                </button>
                                                {/* Mock Dropdown */}
                                                <div className="absolute top-full left-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg hidden group-hover/dropdown:block z-20">
                                                    {['일반직원', '중간관리자', '대표관리자'].map(role => (
                                                        <div key={role} className="px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer">{role}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs text-slate-500 font-medium">{emp.email}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center group/toggle relative">
                                                <button className={`relative w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${
                                                    emp.status === 'ACTIVE' ? 'bg-rose-400' : 'bg-slate-200'
                                                }`}>
                                                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                                                        emp.status === 'ACTIVE' ? 'translate-x-5' : 'translate-x-0'
                                                    }`}></span>
                                                </button>
                                                <div className="absolute bottom-full mb-2 hidden group-hover/toggle:block px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap z-20">
                                                    {emp.status === 'ACTIVE' ? '활동 중지 (계정 잠금)' : '활동 승인'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {emp.role === 'MASTER' ? (
                                                <div className="flex justify-center group/lock relative">
                                                    <Lock size={16} className="text-slate-300" />
                                                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover/lock:block px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap z-20 w-32 text-center">
                                                        대표 관리자는 삭제할 수 없습니다.
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    className="text-slate-300 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-50 rounded-lg group/delete relative"
                                                    title="강제 탈퇴 (계정 삭제)"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={9} className="p-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Users size={48} className="mb-4 opacity-10"/>
                                                <p className="text-sm font-medium text-slate-500 mb-1">해당 조건의 구성원이 없습니다.</p>
                                                <p className="text-xs text-slate-400">필터 조건을 변경하거나 새로운 구성원을 초대해보세요.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeManagement;