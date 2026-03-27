import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import SearchBar from "@/components/common/search-bar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { UserCircle, Building2, FileText, Users, Heart, HelpCircle, X } from "lucide-react";

type TabType = "all" | "active" | "pending";
type FilterMode = "department" | "initial";

// 한글 초성 추출 함수
const getInitialConsonant = (name: string): string => {
  if (!name) return "";
  const firstChar = name.charAt(0);
  const code = firstChar.charCodeAt(0);
  
  // 한글 유니코드 범위 (가-힣)
  if (code >= 0xAC00 && code <= 0xD7A3) {
    const initials = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const initialIndex = Math.floor((code - 0xAC00) / 588);
    return initials[initialIndex];
  }
  
  // 영문자
  if (/[a-zA-Z]/.test(firstChar)) {
    return 'A-Z';
  }
  
  return "";
};

export default function MemberManagement() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [filterMode, setFilterMode] = useState<FilterMode>("department");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [initialFilter, setInitialFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // 구성원 목록 (mock data)
  const members = [
    {
      id: 1,
      name: "이애드",
      nickname: "왕솜사탕",
      email: "king@somsatang.com",
      role: "대표관리자",
      department: "경영지원",
      position: "대표이사",
      status: "active",
    },
    {
      id: 2,
      name: "김애드",
      nickname: "중솜사탕",
      email: "middle@somsatang.com",
      role: "부관리자",
      department: "마케팅",
      position: "팀장",
      status: "active",
    },
    {
      id: 3,
      name: "나애드",
      nickname: "솜사탕",
      email: "middle2@somsatang.com",
      role: "일반직원",
      department: "디자인",
      position: "과장",
      status: "active",
    },
    {
      id: 6,
      name: "최애드",
      nickname: "큐티솜사탕",
      email: "choi@somsatang.com",
      role: "일반직원",
      department: "개발",
      position: "사원",
      status: "active",
    },
    {
      id: 7,
      name: "정애드",
      nickname: "스몰사탕",
      email: "jung@somsatang.com",
      role: "부관리자",
      department: "기획",
      position: "차장",
      status: "active",
    },
  ];

  // 합류대기 목록 (mock data)
  const pendingInvites = [
    {
      id: 4,
      name: "박애드",
      nickname: "미니사탕",
      email: "mini@somsatang.com",
      role: "일반직원",
      department: "영업",
      position: "부장",
      status: "pending",
      isMember: true,
    },
    {
      id: 5,
      name: "",
      nickname: "",
      email: "choi@somsatang.com",
      role: "일반직원",
      department: "개발",
      position: "사원",
      status: "pending",
      isMember: false,
    },
  ];

  const allMembers = [...members, ...pendingInvites];

  // 통계 계산
  const totalMembers = allMembers.length;
  const activeMembers = members.length;
  const pendingMembers = pendingInvites.length;

  // 필터링 및 정렬된 구성원
  const filteredMembers = allMembers
    .filter((member) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && member.status === "active") ||
        (activeTab === "pending" && member.status === "pending");

      const matchesRole = roleFilter === "all" || member.role === roleFilter;

      const matchesDepartment = 
        filterMode === "initial" ||
        departmentFilter === "all" || 
        member.department === departmentFilter;

      const matchesInitial = 
        filterMode === "department" ||
        initialFilter === "all" || 
        getInitialConsonant(member.name) === initialFilter;

      const matchesSearch =
        !searchQuery ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesRole && matchesDepartment && matchesInitial && matchesSearch;
    })
    .sort((a, b) => {
      // 권한 순서: 대표관리자 > 부관리자 > 일반직원
      const roleOrder: { [key: string]: number } = { "대표관리자": 1, "부관리자": 2, "일반직원": 3 };
      return roleOrder[a.role] - roleOrder[b.role];
    });

  const menuItems = [
    { icon: UserCircle, label: "내정보", path: "/mypage/profile" },
    { icon: Building2, label: "기업 정보", path: "/mypage/company" },
    { icon: FileText, label: "사업자 정보", path: "/mypage/business" },
    { icon: Users, label: "구성원 관리", path: "/mypage/members", active: true },
    { icon: Heart, label: "♡ 즐겨찾기", path: "/mypage/favorites" },
    { icon: HelpCircle, label: "1:1문의", path: "/mypage/inquiry" },
  ];

  const handleInvite = () => {
    console.log("초대:", { inviteEmail });
    setInviteDialogOpen(false);
    setInviteEmail("");
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(filteredMembers.map((m) => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, id]);
    } else {
      setSelectedMembers(selectedMembers.filter((mId) => mId !== id));
    }
  };

  const handleBulkApprove = () => {
    console.log("일괄 승인:", selectedMembers);
    setSelectedMembers([]);
  };

  const handleBulkRemove = () => {
    console.log("일괄 탈퇴:", selectedMembers);
    setSelectedMembers([]);
  };

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-8">
            {/* 왼쪽 사이드바 */}
            <div className="w-56 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => setLocation(item.path)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
                        item.active
                          ? "bg-pink-50 text-pink-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      data-testid={`menu-${item.label}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 오른쪽 컨텐츠 */}
            <div className="flex-1">
              {/* 헤더 */}
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h1 className="page-title" data-testid="title-page">
                  구성원 관리
                </h1>
                <p className="page-subtitle mt-4" data-testid="subtitle-page">
                  구성원을 초대하시거나 관리하실 수 있어요
                </p>
              </div>

              {/* 검색 및 초대 */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="이름, 닉네임, 이메일로 검색"
                    className="flex-1"
                  />
                  <button
                    onClick={() => setInviteDialogOpen(true)}
                    className="btn-pink-compact"
                    data-testid="button-invite"
                  >
                    구성원 초대
                  </button>
                </div>
              </div>

              {/* 탭 */}
              <div className="bg-white border border-gray-200 rounded-lg mb-6">
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === "all"
                          ? "bg-gray-100 text-gray-900"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                      data-testid="tab-all"
                    >
                      전체 ({totalMembers})
                    </button>
                    <div className="w-px bg-gray-200"></div>
                    <button
                      onClick={() => setActiveTab("active")}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === "active"
                          ? "bg-gray-100 text-gray-900"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                      data-testid="tab-active"
                    >
                      활성 구성원 ({activeMembers})
                    </button>
                    <div className="w-px bg-gray-200"></div>
                    <button
                      onClick={() => setActiveTab("pending")}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === "pending"
                          ? "bg-gray-100 text-gray-900"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                      data-testid="tab-pending"
                    >
                      합류대기 ({pendingMembers})
                    </button>
                  </div>
                </div>
              </div>

              {/* 필터 */}
              <div className="p-4">
                  <div className="flex items-center gap-3">
                    {/* 필터 모드 전환 */}
                    <Select 
                      value={filterMode} 
                      onValueChange={(value: "department" | "initial") => {
                        setFilterMode(value);
                        if (value === "department") {
                          setInitialFilter("all");
                        } else {
                          setDepartmentFilter("all");
                        }
                      }}
                    >
                      <SelectTrigger className="w-24 border-0 text-left" data-testid="select-filter-mode">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="department">부서별</SelectItem>
                        <SelectItem value="initial">가나다</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* 부서별/가나다 필터 버튼 */}
                    <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
                      {filterMode === "department" ? (
                        // 부서별 필터
                        ['all', '경영지원', '마케팅', '영업', '기획', '디자인', '개발'].map((dept) => (
                          <button
                            key={dept}
                            onClick={() => setDepartmentFilter(dept)}
                            className={`px-3 py-1.5 text-sm rounded transition-colors whitespace-nowrap ${
                              departmentFilter === dept
                                ? "bg-pink-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                            data-testid={`button-dept-${dept}`}
                          >
                            {dept === 'all' ? '전체' : dept}
                          </button>
                        ))
                      ) : (
                        // 초성 필터
                        ['all', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'A-Z'].map((initial) => (
                          <button
                            key={initial}
                            onClick={() => setInitialFilter(initial)}
                            className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                              initialFilter === initial
                                ? "bg-pink-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                            data-testid={`button-initial-${initial}`}
                          >
                            {initial === 'all' ? '전체' : initial}
                          </button>
                        ))
                      )}
                    </div>

                    {/* 권한 필터 */}
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-28 border-0" data-testid="select-role-filter">
                        <SelectValue placeholder="권한 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 권한</SelectItem>
                        <SelectItem value="대표관리자">대표관리자</SelectItem>
                        <SelectItem value="부관리자">부관리자</SelectItem>
                        <SelectItem value="일반직원">일반직원</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              {/* 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                          이름
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                          닉네임
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                          부서
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                          직책
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                          권한
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                          이메일
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 whitespace-nowrap">
                          활동승인
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 whitespace-nowrap">
                          탈퇴
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => {
                        const isManager = member.role === "대표관리자" || member.role === "부관리자";
                        const isPending = member.status === "pending";
                        const isNotMember = isPending && 'isMember' in member && !member.isMember;
                        
                        return (
                        <tr 
                          key={member.id} 
                          className={`hover:bg-gray-50 ${isManager && !isPending ? "bg-gray-50" : ""}`}
                        >
                          <td className={`px-4 py-4 text-sm whitespace-nowrap ${isPending ? "text-gray-400" : "text-gray-900"}`} data-testid={`member-name-${member.id}`}>
                            {isNotMember ? "" : (member.name || "-")}
                          </td>
                          <td className={`px-4 py-4 text-sm whitespace-nowrap ${isPending ? "text-gray-400" : "text-gray-900"}`} data-testid={`member-nickname-${member.id}`}>
                            {isNotMember ? "" : (
                              <div className="flex items-center gap-2">
                                <UserCircle className="w-8 h-8 text-gray-400" />
                                {member.nickname || "-"}
                              </div>
                            )}
                          </td>
                          <td className={`px-4 py-4 text-sm whitespace-nowrap w-32 ${isPending ? "text-gray-400" : "text-gray-900"}`} data-testid={`member-department-${member.id}`}>
                            {isNotMember ? "" : member.department}
                          </td>
                          <td className={`px-4 py-4 text-sm whitespace-nowrap w-32 ${isPending ? "text-gray-400" : "text-gray-900"}`} data-testid={`member-position-${member.id}`}>
                            {isNotMember ? "" : member.position}
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap w-24" data-testid={`member-role-${member.id}`}>
                            {isNotMember ? "" : (
                              member.role === "대표관리자" ? (
                                <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-pink-100 text-pink-600">
                                  대표관리자
                                </span>
                              ) : (
                                <Select
                                  value={member.role}
                                  onValueChange={(value) => {
                                    console.log(`권한 변경: ${member.name} → ${value}`);
                                  }}
                                  disabled={isPending}
                                >
                                  <SelectTrigger className={`w-32 h-8 text-xs ${isPending ? "opacity-50 cursor-not-allowed" : ""}`} data-testid={`select-role-${member.id}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="부관리자">부관리자</SelectItem>
                                    <SelectItem value="일반직원">일반직원</SelectItem>
                                  </SelectContent>
                                </Select>
                              )
                            )}
                          </td>
                          <td className={`px-4 py-4 text-sm whitespace-nowrap ${isPending ? "text-gray-400" : "text-gray-900"}`} data-testid={`member-email-${member.id}`}>
                            {member.email}
                          </td>
                          <td className="px-3 py-4 text-sm w-20" data-testid={`member-status-${member.id}`}>
                            {member.status === "pending" ? (
                              <span className={`text-xs ${'isMember' in member && member.isMember ? 'text-green-600' : 'text-gray-500'}`}>
                                {'isMember' in member && member.isMember ? "수락대기" : "미가입"}
                              </span>
                            ) : isManager ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <Switch
                                checked={member.status === "active"}
                                onCheckedChange={(checked) => {
                                  console.log(`활동승인 변경: ${member.name} → ${checked ? 'active' : 'pending'}`);
                                }}
                                data-testid={`switch-status-${member.id}`}
                              />
                            )}
                          </td>
                          <td className="px-3 py-4 text-center w-12">
                            {member.role === "대표관리자" ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <button
                                onClick={() => {
                                  console.log(`직원 삭제: ${member.name}`);
                                }}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                data-testid={`button-remove-${member.id}`}
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                        );
                      })}
                      {filteredMembers.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                            조건에 맞는 구성원이 없습니다
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* 구성원 초대 다이얼로그 */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-invite">
          <DialogHeader>
            <DialogTitle>구성원 초대하기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="cotton-candy-pink">*</span> 이메일
              </label>
              <Input
                type="email"
                placeholder="example@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                data-testid="input-invite-email"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setInviteDialogOpen(false)}
              className="btn-white flex-1"
              data-testid="button-invite-cancel"
            >
              취소
            </Button>
            <Button
              onClick={handleInvite}
              className="btn-pink flex-1"
              data-testid="button-invite-confirm"
            >
              초대하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
