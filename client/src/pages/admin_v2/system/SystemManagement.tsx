import React, { useState } from 'react';
import { 
    Server, Activity, Database, Shield, FileText, 
    Users, Settings, Search, Download, CheckCircle, 
    XCircle, AlertTriangle, Lock, RefreshCw, Power,
    Cpu, HardDrive, Network, Key
} from 'lucide-react';

// Mock Data
const SYSTEM_HEALTH = {
    apiStatus: 'NORMAL',
    dbStatus: 'NORMAL',
    storageUsage: 45, // %
    avgLatency: '42ms',
    cpuUsage: 28, // %
    memoryUsage: 3.2 // GB / 8GB
};

const AUDIT_LOGS = [
    { id: 'LOG-8821', time: '2024.11.15 14:30:22', actor: 'master (최고관리자)', action: 'LOGIN', target: 'System', ip: '211.245.xx.xx', status: 'SUCCESS', desc: '관리자 콘솔 로그인', level: 'INFO' },
    { id: 'LOG-8820', time: '2024.11.15 14:28:10', actor: 'system_bot', action: 'AUTO_BACKUP', target: 'DB_MAIN', ip: '127.0.0.1', status: 'SUCCESS', desc: '정기 데이터베이스 백업 완료', level: 'INFO' },
    { id: 'LOG-8819', time: '2024.11.15 14:15:00', actor: 'kim_op (운영자)', action: 'UPDATE_STATUS', target: 'P-2411-005', ip: '58.123.xx.xx', status: 'SUCCESS', desc: '프로젝트 상태 변경 (심사중 -> 승인)', level: 'WARN' },
    { id: 'LOG-8818', time: '2024.11.15 13:55:42', actor: 'unknown', action: 'LOGIN_FAIL', target: 'System', ip: '182.22.xx.xx', status: 'FAIL', desc: '비밀번호 5회 오류로 인한 접속 차단', level: 'DANGER' },
    { id: 'LOG-8817', time: '2024.11.15 13:40:11', actor: 'master (최고관리자)', action: 'DELETE_USER', target: 'U-2401-999', ip: '211.245.xx.xx', status: 'SUCCESS', desc: '스팸 계정 강제 탈퇴 처리', level: 'WARN' },
    { id: 'LOG-8816', time: '2024.11.15 13:00:05', actor: 'lee_fin (정산팀)', action: 'DOWNLOAD', target: 'Settlement_List', ip: '14.33.xx.xx', status: 'SUCCESS', desc: '10월 정산 리스트 엑셀 다운로드', level: 'INFO' },
];

const ADMIN_ACCOUNTS = [
    { id: 'ADM-001', name: '최고관리자', email: 'master@admarket.com', role: 'SUPER_ADMIN', lastLogin: '방금 전', status: 'ACTIVE', department: '경영지원' },
    { id: 'ADM-002', name: '김운영', email: 'kim_op@admarket.com', role: 'OPERATOR', lastLogin: '30분 전', status: 'ACTIVE', department: '운영팀' },
    { id: 'ADM-003', name: '이정산', email: 'lee_fin@admarket.com', role: 'FINANCE', lastLogin: '1일 전', status: 'ACTIVE', department: '재무팀' },
    { id: 'ADM-004', name: '박감사', email: 'park_audit@admarket.com', role: 'AUDITOR', lastLogin: '1주일 전', status: 'SUSPENDED', department: '감사팀' },
];

const SystemManagement = () => {
    const [activeTab, setActiveTab] = useState('LOGS');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [signupAllowed, setSignupAllowed] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const LogLevelBadge = ({ level }: { level: string }) => {
        const styles: Record<string, string> = {
            INFO: 'bg-blue-50 text-blue-600 border-blue-100',
            WARN: 'bg-amber-50 text-amber-600 border-amber-100',
            DANGER: 'bg-rose-50 text-rose-600 border-rose-100'
        };
        return (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${styles[level]}`}>
                {level}
            </span>
        );
    };

    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">시스템 및 감사</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">서버 상태를 모니터링하고 관리자 활동 로그 및 시스템 설정을 관리합니다.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    System Online
                </div>
            </div>

            {/* System Health Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* API Status */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Server size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-500">API Server</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Normal</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-slate-900">99.9%</span>
                        <span className="text-xs font-medium text-slate-400 mb-1">Uptime</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[99.9%]"></div>
                    </div>
                </div>

                {/* DB Status */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Database size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-500">Database</span>
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Active</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-slate-900">{SYSTEM_HEALTH.avgLatency}</span>
                        <span className="text-xs font-medium text-slate-400 mb-1">Avg Latency</span>
                    </div>
                     <div className="mt-3 flex gap-1">
                        {[1,2,3,4,5,6,7,8].map(i => (
                             <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 7 ? 'bg-blue-400' : 'bg-slate-100'}`}></div>
                        ))}
                    </div>
                </div>

                {/* CPU Usage */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Cpu size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-500">CPU Load</span>
                        </div>
                        <span className="text-xs font-bold text-slate-600">{SYSTEM_HEALTH.cpuUsage}%</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-slate-900">0.28</span>
                        <span className="text-xs font-medium text-slate-400 mb-1">Load Avg (15m)</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full w-[28%]"></div>
                    </div>
                </div>

                {/* Storage */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                <HardDrive size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-500">Storage</span>
                        </div>
                         <span className="text-xs font-bold text-slate-600">{SYSTEM_HEALTH.storageUsage}%</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-slate-900">450GB</span>
                        <span className="text-xs font-medium text-slate-400 mb-1">/ 1TB Used</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full w-[45%]"></div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    {[
                        { id: 'LOGS', label: '감사 로그 (Audit)', icon: Shield },
                        { id: 'ADMINS', label: '관리자 계정', icon: Users },
                        { id: 'SETTINGS', label: '환경 설정', icon: Settings },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all ${
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

                {/* Tab Content: Logs */}
                {activeTab === 'LOGS' && (
                    <div className="flex-1 flex flex-col animate-in fade-in">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="로그 검색 (Action, User, IP)" 
                                    className="pl-9 pr-4 h-10 w-80 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#2b4ea7] transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                <Download size={16} /> 로그 다운로드 (CSV)
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                        <th className="p-4 font-bold">시간</th>
                                        <th className="p-4 font-bold">수행자 (Actor)</th>
                                        <th className="p-4 font-bold">활동 (Action)</th>
                                        <th className="p-4 font-bold">대상 (Target)</th>
                                        <th className="p-4 font-bold">내용</th>
                                        <th className="p-4 font-bold">IP 주소</th>
                                        <th className="p-4 font-bold">상태</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {AUDIT_LOGS.map(log => (
                                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="p-4 text-xs font-medium text-slate-500 font-mono">{log.time}</td>
                                            <td className="p-4 text-xs font-bold text-slate-700">{log.actor}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <LogLevelBadge level={log.level} />
                                                    <span className="text-xs font-bold text-slate-600">{log.action}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs font-medium text-slate-500">{log.target}</td>
                                            <td className="p-4 text-xs text-slate-600">{log.desc}</td>
                                            <td className="p-4 text-xs font-mono text-slate-400">{log.ip}</td>
                                            <td className="p-4">
                                                {log.status === 'SUCCESS' ? (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                                                        <CheckCircle size={10} /> SUCCESS
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 w-fit">
                                                        <XCircle size={10} /> FAIL
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab Content: Admins */}
                {activeTab === 'ADMINS' && (
                    <div className="p-6 animate-in fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">관리자 계정 목록</h3>
                                <p className="text-xs text-slate-500">내부 관리자 계정을 조회하고 권한을 설정합니다.</p>
                            </div>
                            <button className="h-10 px-4 rounded-lg bg-[#2b4ea7] text-white text-sm font-bold hover:bg-[#203b80] flex items-center gap-2 shadow-sm transition-colors">
                                <Users size={16} /> 관리자 초대
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ADMIN_ACCOUNTS.map(admin => (
                                <div key={admin.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:border-[#2b4ea7]/50 transition-colors group bg-slate-50/30">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                                            {admin.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800">{admin.name}</span>
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                                    admin.role === 'SUPER_ADMIN' ? 'bg-slate-800 text-white border-slate-800' :
                                                    admin.role === 'AUDITOR' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                    {admin.role}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-0.5">{admin.email} | {admin.department}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xs font-bold mb-1 ${admin.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {admin.status}
                                        </div>
                                        <div className="text-[10px] text-slate-400">최근 접속: {admin.lastLogin}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab Content: Settings */}
                {activeTab === 'SETTINGS' && (
                    <div className="p-6 animate-in fade-in max-w-3xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">시스템 환경 설정</h3>
                        
                        <div className="space-y-6">
                            {/* Maintenance Mode */}
                            <div className="flex items-center justify-between p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${maintenanceMode ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">시스템 점검 모드 (Maintenance Mode)</h4>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            활성화 시 일반 사용자의 접속이 차단되고 점검 페이지가 표시됩니다.<br/>
                                            관리자 권한 계정은 계속 접속할 수 있습니다.
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b4ea7] focus:ring-offset-2 ${
                                        maintenanceMode ? 'bg-rose-500' : 'bg-slate-200'
                                    }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>

                            {/* Signup Control */}
                            <div className="flex items-center justify-between p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">신규 회원가입 허용</h4>
                                        <p className="text-xs text-slate-500 mt-1">
                                            비활성화 시 신규 회원가입이 일시적으로 중단됩니다.
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSignupAllowed(!signupAllowed)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b4ea7] focus:ring-offset-2 ${
                                        signupAllowed ? 'bg-emerald-500' : 'bg-slate-200'
                                    }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        signupAllowed ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>

                             {/* Security Settings Mock */}
                             <div className="flex items-center justify-between p-5 border border-slate-200 rounded-xl bg-white shadow-sm opacity-60">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-slate-100 text-slate-500">
                                        <Lock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">2단계 인증 강제 (Global 2FA)</h4>
                                        <p className="text-xs text-slate-500 mt-1">
                                            모든 관리자 계정에 대해 2단계 인증을 강제합니다. (Enterprise 플랜 전용)
                                        </p>
                                    </div>
                                </div>
                                <button disabled className="bg-slate-100 text-slate-400 px-3 py-1.5 rounded text-xs font-bold border border-slate-200 cursor-not-allowed">
                                    Upgrade Plan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemManagement;