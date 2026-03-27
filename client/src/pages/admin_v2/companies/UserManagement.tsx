import React, { useState, useMemo } from 'react';
import { 
    Search, Download, MoreHorizontal, Filter, Users, UserCheck, UserX, User, Mail
} from 'lucide-react';
import { StatusBadge, UserTypeBadge } from '@/components/Badges';
import { MOCK_USERS } from '@/data/mockData';

const UserManagement = () => {
    // States
    const [userTypeTab, setUserTypeTab] = useState('ALL'); // ALL, COMPANY_MEMBER, FREELANCER
    const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, SUSPENDED, WITHDRAWN
    const [searchTerm, setSearchTerm] = useState('');

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return MOCK_USERS.filter(user => {
            const typeMatch = userTypeTab === 'ALL' || user.type === userTypeTab;
            const statusMatch = statusFilter === 'ALL' || user.status === statusFilter;
            const searchMatch = 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm);
            
            return typeMatch && statusMatch && searchMatch;
        });
    }, [userTypeTab, statusFilter, searchTerm]);

    // Stats
    const stats = useMemo(() => ({
        total: MOCK_USERS.length,
        companyMembers: MOCK_USERS.filter(u => u.type === 'COMPANY_MEMBER').length,
        freelancers: MOCK_USERS.filter(u => u.type === 'FREELANCER').length,
        active: MOCK_USERS.filter(u => u.status === 'ACTIVE').length,
    }), []);

    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">개인회원 관리</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">플랫폼에 가입된 모든 개인 계정(기업 소속 및 프리랜서)을 관리합니다.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: '전체 회원', value: stats.total, icon: Users, color: 'text-slate-600', bg: 'bg-slate-100' },
                    { label: '기업 소속 회원', value: stats.companyMembers, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: '개인/프리랜서', value: stats.freelancers, icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: '활동 중', value: stats.active, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
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

            {/* Main Content */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Tabs & Search */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {['ALL', 'COMPANY_MEMBER', 'FREELANCER'].map((tab) => {
                            const labels: Record<string, string> = { 
                                'ALL': '전체', 
                                'COMPANY_MEMBER': '기업 소속', 
                                'FREELANCER': '프리랜서/개인'
                            };
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setUserTypeTab(tab)}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                                        userTypeTab === tab 
                                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {labels[tab]}
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="이름, 이메일, 전화번호 검색" 
                                className="pl-9 pr-4 h-10 w-full md:w-64 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7] transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select 
                            className="h-10 pl-3 pr-8 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 focus:outline-none focus:border-[#2b4ea7] bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">모든 상태</option>
                            <option value="ACTIVE">활동중</option>
                            <option value="SUSPENDED">활동정지</option>
                            <option value="WITHDRAWN">탈퇴</option>
                        </select>
                        <button className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                            <Download size={14} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="p-4 font-bold w-10">
                                    <input type="checkbox" className="rounded border-slate-300" />
                                </th>
                                <th className="p-4 font-bold">회원 정보</th>
                                <th className="p-4 font-bold">구분</th>
                                <th className="p-4 font-bold">소속 기업</th>
                                <th className="p-4 font-bold">연락처</th>
                                <th className="p-4 font-bold">가입일</th>
                                <th className="p-4 font-bold">최근 로그인</th>
                                <th className="p-4 font-bold">상태</th>
                                <th className="p-4 font-bold text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-4">
                                        <input type="checkbox" className="rounded border-slate-300" />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400">{user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <UserTypeBadge type={user.type} />
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-sm font-medium ${user.company === '-' ? 'text-slate-400' : 'text-slate-700'}`}>
                                            {user.company}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1 text-xs text-slate-600">
                                                <Mail size={10} className="text-slate-400"/> {user.email}
                                            </div>
                                            <div className="text-xs text-slate-400 pl-3.5">{user.phone}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-slate-500 font-medium">
                                        {user.joinDate}
                                    </td>
                                    <td className="p-4 text-xs text-slate-500 font-medium">
                                        {user.lastLogin}
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={user.status} />
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-slate-400 hover:text-[#2b4ea7] p-2 hover:bg-blue-50 rounded-full transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={9} className="p-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Users size={48} className="mb-4 opacity-10"/>
                                            <p className="text-sm font-medium text-slate-500 mb-1">검색 결과가 없습니다.</p>
                                            <p className="text-xs text-slate-400">검색어를 변경하거나 필터를 초기화해보세요.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-xs text-slate-500 font-medium">총 {filteredUsers.length}명</span>
                    {/* Mock Pagination */}
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 bg-white hover:bg-slate-50 disabled:opacity-50" disabled>1</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;