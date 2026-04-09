import { useState } from "react";
import Layout from "@/components/layout/layout";
import WorkSidebar from "@/components/work/sidebar";
import { Search, X, ChevronDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  trackMemberApproved,
  trackMemberActivityToggled,
  trackMemberRemoved,
  trackMemberRoleChanged,
} from "@/lib/analytics";

type Member = {
  id: string;
  name: string;
  nickname: string;
  department: string;
  position: string;
  role: string;
  email: string;
  isActive: boolean;
  isPending: boolean;
  section: "approved" | "active" | "pending";
  hasProject?: boolean;
};

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: '이애드', nickname: '왕솜사탕', department: '경영지원', position: '대표이사', role: '대표관리자', email: 'king@somsatang.com', isActive: false, isPending: false, section: 'approved' },
  { id: '2', name: '김애드', nickname: '중솜사탕', department: '기획', position: '부장', role: '부관리자', email: 'middle@somsatang.com', isActive: false, isPending: false, section: 'approved' },
  { id: '3', name: '나애드', nickname: '솜사탕', department: '마케팅', position: '차장', role: '부관리자', email: 'middle2@somsatang.com', isActive: false, isPending: false, section: 'approved', hasProject: true },
  { id: '4', name: '나애드', nickname: '솜사탕', department: '마케팅', position: '차장', role: '일반직원', email: 'middle2@somsatang.com', isActive: true, isPending: false, section: 'active' },
  { id: '5', name: '나애드', nickname: '솜사탕', department: '마케팅', position: '차장', role: '일반직원', email: 'middle2@somsatang.com', isActive: true, isPending: false, section: 'active' },
  { id: '6', name: '박에드', nickname: '미니사탕', department: '디자인', position: '과장', role: '일반직원', email: 'mini@somsatang.com', isActive: false, isPending: true, section: 'pending' },
  { id: '7', name: '차환류', nickname: '미니사탕', department: '-', position: '-', role: '일반직원', email: 'cha@somsatang.com', isActive: false, isPending: true, section: 'pending' },
];

const tabs = [
  { id: 'all', label: '전체' },
  { id: 'approved', label: '활동승인' },
  { id: 'stopped', label: '활동중지' },
  { id: 'pending', label: '구성원 승인대기' },
];

const departments = ['전체', '경영지원', '기획', '마케팅', '디자인'];
const alphabets = ['전체', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'A-Z'];

type PopupState =
  | { type: "none" }
  | { type: "role_confirm"; member: Member; newRole: string }
  | { type: "role_done" }
  | { type: "approve_confirm"; member: Member }
  | { type: "approve_done" }
  | { type: "remove_confirm"; member: Member }
  | { type: "remove_done" }
  | { type: "remove_blocked" };

export default function SettingsMemberManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeDept, setActiveDept] = useState('전체');
  const [activeAlpha, setActiveAlpha] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [popup, setPopup] = useState<PopupState>({ type: "none" });
  const [removeAlsoTvcf, setRemoveAlsoTvcf] = useState(false);

  const approvedMembers = members.filter(m => m.section === 'approved');
  const activeMembers = members.filter(m => m.section === 'active');
  const pendingMembers = members.filter(m => m.section === 'pending');

  const tabCounts = {
    all: members.length,
    approved: approvedMembers.length + activeMembers.length,
    stopped: 0,
    pending: pendingMembers.length,
  };

  const handleToggleActivity = (member: Member) => {
    const newIsActive = !member.isActive;
    const newSection: "approved" | "active" = newIsActive ? "active" : "approved";
    setMembers(prev =>
      prev.map(m => m.id === member.id ? { ...m, isActive: newIsActive, section: newSection } : m)
    );
    trackMemberActivityToggled({ member_id: member.id, is_active: newIsActive, member_name: member.name });
  };

  const handleRemoveClick = (member: Member) => {
    if (member.hasProject) {
      setPopup({ type: "remove_blocked" });
    } else {
      setRemoveAlsoTvcf(false);
      setPopup({ type: "remove_confirm", member });
    }
  };

  const handleRemoveConfirm = () => {
    if (popup.type !== "remove_confirm") return;
    const member = popup.member;
    setMembers(prev => prev.filter(m => m.id !== member.id));
    trackMemberRemoved({ member_id: member.id, member_name: member.name, section: member.section });
    setPopup({ type: "remove_done" });
  };

  const handleApprovePendingClick = (member: Member) => {
    setPopup({ type: "approve_confirm", member });
  };

  const handleApproveConfirm = () => {
    if (popup.type !== "approve_confirm") return;
    const member = popup.member;
    setMembers(prev =>
      prev.map(m => m.id === member.id ? { ...m, isPending: false, section: 'approved' } : m)
    );
    trackMemberApproved({ member_id: member.id, member_name: member.name });
    setPopup({ type: "approve_done" });
  };

  const handleRoleChange = (member: Member, newRole: string) => {
    setPopup({ type: "role_confirm", member, newRole });
  };

  const handleRoleConfirm = () => {
    if (popup.type !== "role_confirm") return;
    const { member, newRole } = popup;
    const prevRole = member.role;
    setMembers(prev =>
      prev.map(m => m.id === member.id ? { ...m, role: newRole } : m)
    );
    trackMemberRoleChanged({ member_id: member.id, member_name: member.name, prev_role: prevRole, new_role: newRole });
    setPopup({ type: "role_done" });
  };

  const closePopup = () => setPopup({ type: "none" });

  const renderMemberRow = (member: Member, isPendingRow = false) => (
    <tr key={member.id} className="border-b border-gray-100">
      <td className="py-4 px-3 text-[14px] text-gray-900">{member.name}</td>
      <td className="py-4 px-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
          <span className="text-[14px] text-gray-900">{member.nickname}</span>
        </div>
      </td>
      <td className="py-4 px-3 text-[14px] text-gray-900">{member.department}</td>
      <td className="py-4 px-3 text-[14px] text-gray-900">{member.position}</td>
      <td className="py-4 px-3">
        {isPendingRow ? (
          <span className="text-[14px] text-gray-600">{member.role}</span>
        ) : (
          <select
            className={`text-[14px] bg-transparent border-0 cursor-pointer focus:outline-none appearance-none pr-5 ${member.isActive ? 'text-gray-600' : 'text-pink-500'}`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
            value={member.role}
            onChange={(e) => handleRoleChange(member, e.target.value)}
          >
            <option value="대표관리자">대표관리자</option>
            <option value="부관리자">부관리자</option>
            <option value="일반직원">일반직원</option>
          </select>
        )}
      </td>
      <td className="py-4 px-3 text-[14px] text-gray-900">{member.email}</td>
      <td className="py-4 px-3 text-center">
        {isPendingRow ? (
          <button
            onClick={() => handleApprovePendingClick(member)}
            className="px-3 py-1 text-[12px] border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            구성원승인
          </button>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => handleToggleActivity(member)}
              className={`w-[52px] h-[30px] rounded-full relative transition-colors ${member.isActive ? 'bg-pink-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-[22px] h-[22px] bg-white rounded-full transition-all ${member.isActive ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        )}
      </td>
      <td className="py-4 px-3 text-center">
        <button
          onClick={() => handleRemoveClick(member)}
          className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center mx-auto"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </td>
    </tr>
  );

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1">
              <div className="text-center mb-8">
                <h1 className="text-[32px] font-bold text-gray-900 mb-2">구성원 관리</h1>
                <p className="text-gray-500 text-[15px]">구성원을 초대하시거나 수락하실 수 있어요</p>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative w-[710px]">
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-[55px] pl-7 pr-16 border border-gray-200 rounded-full text-[15px] focus:outline-none focus:border-pink-400"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden">
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 text-center text-[16px] border border-gray-200 rounded-t-md ${
                        activeTab === tab.id ? 'bg-gray-100 font-bold' : 'bg-white'
                      }`}
                    >
                      <span className="font-bold">{tab.label}</span>
                      <span className="text-gray-400 font-normal"> ({tabCounts[tab.id as keyof typeof tabCounts]})</span>
                    </button>
                  ))}
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-900">부서별</span>
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex gap-1">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => setActiveDept(dept)}
                          className={`px-[10px] py-[8px] text-[14px] font-bold rounded-md ${
                            activeDept === dept ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-900'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 flex justify-end">
                      <select className="text-[12px] text-gray-900 bg-transparent border-0 cursor-pointer focus:outline-none appearance-none pr-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}>
                        <option>전체 권한</option>
                        <option>대표관리자</option>
                        <option>부관리자</option>
                        <option>일반직원</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-900">가나다</span>
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {alphabets.map((alpha) => (
                        <button
                          key={alpha}
                          onClick={() => setActiveAlpha(alpha)}
                          className={`px-[10px] py-[8px] text-[14px] font-bold rounded-md ${
                            activeAlpha === alpha ? 'bg-pink-500 text-white' : 'bg-white border border-gray-200 text-gray-900'
                          }`}
                        >
                          {alpha}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 flex justify-end">
                      <select className="text-[12px] text-gray-900 bg-transparent border-0 cursor-pointer focus:outline-none appearance-none pr-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}>
                        <option>전체 권한</option>
                        <option>대표관리자</option>
                        <option>부관리자</option>
                        <option>일반직원</option>
                      </select>
                    </div>
                  </div>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="border-y border-gray-200">
                      <th className="py-4 px-3 text-left text-[14px] font-bold text-gray-900 w-[100px]">이름</th>
                      <th className="py-4 px-3 text-left text-[14px] font-bold text-gray-900 w-[130px]">닉네임</th>
                      <th className="py-4 px-3 text-left text-[14px] font-bold text-gray-900 w-[110px]">부서</th>
                      <th className="py-4 px-3 text-left text-[14px] font-bold text-gray-900 w-[100px]">직책</th>
                      <th className="py-4 px-3 text-left text-[14px] font-bold text-gray-900 w-[130px]">권한</th>
                      <th className="py-4 px-3 text-left text-[14px] font-bold text-gray-900 w-[220px]">이메일</th>
                      <th className="py-4 px-3 text-center text-[14px] font-bold text-gray-900 w-[76px]">활동승인</th>
                      <th className="py-4 px-3 text-center text-[14px] font-bold text-gray-900 w-[54px]">탈퇴</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedMembers.map(m => renderMemberRow(m))}
                    <tr><td colSpan={8} className="py-4 border-b border-gray-300"></td></tr>
                    {activeMembers.map(m => renderMemberRow(m))}
                    <tr><td colSpan={8} className="py-4 border-b border-gray-300"></td></tr>
                    {pendingMembers.map(m => renderMemberRow(m, true))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 권한 변경 확인 팝업 ── */}
      <Dialog open={popup.type === "role_confirm"} onOpenChange={closePopup}>
        <DialogContent className="sm:max-w-[280px] p-6">
          <p className="text-[16px] font-bold text-gray-900 mb-6">권한을 변경하시겠습니까?</p>
          <div className="popup-buttons">
            <button onClick={closePopup} className="btn-white">취소</button>
            <button onClick={handleRoleConfirm} className="btn-pink">확인</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 권한 변경 완료 팝업 ── */}
      <Dialog open={popup.type === "role_done"} onOpenChange={closePopup}>
        <DialogContent className="sm:max-w-[280px] p-6">
          <p className="text-[16px] font-bold text-gray-900 mb-6">변경이 완료되었어요.</p>
          <button onClick={closePopup} className="btn-pink w-full">확인</button>
        </DialogContent>
      </Dialog>

      {/* ── 구성원 승인 확인 팝업 ── */}
      <Dialog open={popup.type === "approve_confirm"} onOpenChange={closePopup}>
        <DialogContent className="sm:max-w-[280px] p-6">
          <p className="text-[16px] font-bold text-gray-900 mb-6">구성원으로 승인하시겠습니까?</p>
          <div className="popup-buttons">
            <button onClick={closePopup} className="btn-white">취소</button>
            <button onClick={handleApproveConfirm} className="btn-pink">확인</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 구성원 승인 완료 팝업 ── */}
      <Dialog open={popup.type === "approve_done"} onOpenChange={closePopup}>
        <DialogContent className="sm:max-w-[280px] p-6">
          <p className="text-[16px] font-bold text-gray-900 mb-6">승인되었어요.</p>
          <button onClick={closePopup} className="btn-pink w-full">확인</button>
        </DialogContent>
      </Dialog>

      {/* ── 구성원 제외 확인 팝업 ── */}
      <Dialog open={popup.type === "remove_confirm"} onOpenChange={closePopup}>
        <DialogContent className="sm:max-w-[280px] p-6">
          <p className="text-[16px] font-bold text-gray-900 mb-3">구성원을 제외하시겠습니까?</p>
          <label className="flex items-center gap-2 text-[12px] text-gray-500 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={removeAlsoTvcf}
              onChange={(e) => setRemoveAlsoTvcf(e.target.checked)}
              className="w-3.5 h-3.5 accent-pink-500"
            />
            TVCF 구성원에서도 삭제합니다.
          </label>
          <div className="popup-buttons">
            <button onClick={closePopup} className="btn-white">취소</button>
            <button onClick={handleRemoveConfirm} className="btn-pink">확인</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 구성원 제외 완료 팝업 ── */}
      <Dialog open={popup.type === "remove_done"} onOpenChange={closePopup}>
        <DialogContent className="sm:max-w-[280px] p-6">
          <p className="text-[16px] font-bold text-gray-900 mb-6">제외되었어요.</p>
          <button onClick={closePopup} className="btn-pink w-full">확인</button>
        </DialogContent>
      </Dialog>

      {/* ── 제외 불가 (담당 프로젝트 있음) 팝업 ── */}
      <Dialog open={popup.type === "remove_blocked"} onOpenChange={closePopup}>
        <DialogContent className="sm:max-w-[280px] p-6">
          <p className="text-[16px] font-bold text-gray-900 text-center mb-6 leading-snug">
            담당프로젝트를 모두 이관하신 후<br />제외가 가능합니다.
          </p>
          <button onClick={closePopup} className="btn-pink w-full">확인</button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
