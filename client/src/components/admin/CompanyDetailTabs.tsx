import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainStatusLabels } from "@/types/project-status";
import { MOCK_ADMIN_COMPANIES_V1, MOCK_ADMIN_PROJECTS_V1 } from "@/data/mockData";
import {
  ProcessStepper,
  getActiveStepIndexFromMainStatus,
  getProjectSteps,
} from "@/components/project/ProcessStepper";
import { CheckCircle, Folder, Search, User, Users, XCircle } from "lucide-react";
import { Link } from "wouter";

interface Member {
  id: string;
  name: string;
  nickname: string;
  department: string;
  position: string;
  role: "대표관리자" | "부관리자" | "일반직원";
  email: string;
  phone?: string;
  status: "active" | "inactive" | "pending";
  joinedAt: string;
  lastLoginAt?: string;
  projectCount?: number;
}

// NOTE: 현재는 v1 목업 기반. 실제 연동 시 API로 교체.
const mockMembers: Member[] = [
  {
    id: "1",
    name: "이애드",
    nickname: "왕솜사탕",
    department: "경영지원",
    position: "대표이사",
    role: "대표관리자",
    email: "king@somsatang.com",
    phone: "010-1234-5678",
    status: "active",
    joinedAt: "2024-01-15",
    lastLoginAt: "2025-01-20",
    projectCount: 8,
  },
  {
    id: "2",
    name: "김애드",
    nickname: "중솜사탕",
    department: "기획",
    position: "부장",
    role: "부관리자",
    email: "middle@somsatang.com",
    phone: "010-2345-6789",
    status: "active",
    joinedAt: "2024-01-20",
    lastLoginAt: "2025-01-19",
    projectCount: 5,
  },
  {
    id: "3",
    name: "나애드",
    nickname: "솜사탕",
    department: "마케팅",
    position: "차장",
    role: "부관리자",
    email: "na@somsatang.com",
    phone: "010-3456-7890",
    status: "active",
    joinedAt: "2024-02-01",
    lastLoginAt: "2025-01-18",
    projectCount: 3,
  },
  {
    id: "4",
    name: "박에드",
    nickname: "미니사탕",
    department: "디자인",
    position: "과장",
    role: "일반직원",
    email: "mini@somsatang.com",
    phone: "010-4567-8901",
    status: "inactive",
    joinedAt: "2024-02-15",
    lastLoginAt: "2024-12-01",
    projectCount: 2,
  },
  {
    id: "5",
    name: "차환류",
    nickname: "새사탕",
    department: "-",
    position: "-",
    role: "일반직원",
    email: "cha@somsatang.com",
    status: "pending",
    joinedAt: "2024-03-01",
  },
];

const companyProfiles: Record<
  string,
  {
    address: string;
    addressDetail: string;
    zipCode: string;
    website?: string;
    intro: string;
    foundedYear: string;
    foundedMonth: string;
    companySize: string;
    employeeCount: string;
  }
> = {
  "COM-001": {
    address: "서울 강남구 테헤란로 123",
    addressDetail: "크리에이티브빌딩 3층",
    zipCode: "06234",
    website: "www.creativelab.com",
    intro: "크리에이티브 중심의 영상 제작 전문 기업",
    foundedYear: "2018",
    foundedMonth: "3",
    companySize: "중소기업",
    employeeCount: "20명 이상",
  },
  "COM-002": {
    address: "서울 마포구 월드컵북로 98",
    addressDetail: "스마트타워 7층",
    zipCode: "03992",
    website: "www.smartagency.kr",
    intro: "브랜딩부터 집행까지 종합대행을 제공합니다.",
    foundedYear: "2016",
    foundedMonth: "7",
    companySize: "중소기업",
    employeeCount: "10명 이상",
  },
  "COM-003": {
    address: "경기 성남시 분당구 판교로 25",
    addressDetail: "비주얼센터 2층",
    zipCode: "13488",
    intro: "촬영 중심의 프로덕션. 급행 제작 대응 가능.",
    foundedYear: "2020",
    foundedMonth: "1",
    companySize: "소기업",
    employeeCount: "10명 미만",
  },
  "COM-004": {
    address: "서울 영등포구 여의대로 100",
    addressDetail: "테크브랜드 본사 12층",
    zipCode: "07326",
    website: "www.techbrand.co.kr",
    intro: "테크 제품 기반의 브랜드 마케팅을 운영합니다.",
    foundedYear: "2012",
    foundedMonth: "9",
    companySize: "중견기업",
    employeeCount: "50명 이상",
  },
};

const roleColors: Record<Member["role"], string> = {
  대표관리자: "bg-purple-500",
  부관리자: "bg-blue-500",
  일반직원: "bg-gray-400",
};

const memberStatusLabels: Record<Member["status"], { label: string; color: string }> =
  {
    active: { label: "활동중", color: "bg-green-500" },
    inactive: { label: "활동중지", color: "bg-gray-400" },
    pending: { label: "승인대기", color: "bg-yellow-500" },
  };

export function CompanyDetailTabs({
  companyId,
  showPortfolio = true,
}: {
  companyId: string;
  showPortfolio?: boolean;
}) {
  const company =
    MOCK_ADMIN_COMPANIES_V1.find((c) => c.id === companyId) ?? MOCK_ADMIN_COMPANIES_V1[0];
  const profile = companyProfiles[company?.id] ?? companyProfiles["COM-001"];

  const projectsAll = useMemo(
    () =>
      MOCK_ADMIN_PROJECTS_V1.filter(
        (p) =>
          p.ownerCompanyId === company?.id ||
          (p.participantCompanyIds ?? []).includes(company?.id)
      ),
    [company?.id]
  );
  const projectsOwned = useMemo(
    () => MOCK_ADMIN_PROJECTS_V1.filter((p) => p.ownerCompanyId === company?.id),
    [company?.id]
  );
  const projectsParticipating = useMemo(
    () =>
      MOCK_ADMIN_PROJECTS_V1.filter((p) =>
        (p.participantCompanyIds ?? []).includes(company?.id)
      ),
    [company?.id]
  );

  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filteredMembers = useMemo(
    () =>
      mockMembers.filter(
        (m) =>
          m.name.includes(memberSearchTerm) ||
          m.email.includes(memberSearchTerm) ||
          m.department.includes(memberSearchTerm)
      ),
    [memberSearchTerm]
  );

  const activeMembers = useMemo(() => mockMembers.filter((m) => m.status === "active").length, []);
  const inactiveMembers = useMemo(
    () => mockMembers.filter((m) => m.status === "inactive").length,
    []
  );
  const pendingMembers = useMemo(() => mockMembers.filter((m) => m.status === "pending").length, []);

  return (
    <>
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info">회사 정보</TabsTrigger>
          <TabsTrigger value="projects">프로젝트</TabsTrigger>
          {showPortfolio && <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>}
          <TabsTrigger value="members">구성원</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-0 space-y-4">
          {/* 상단 요약 카드 */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">기업명</p>
                <p className="text-sm font-semibold truncate">{company.companyName}</p>
                {company.companyNameEn && (
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {company.companyNameEn}
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">기업유형</p>
                <p className="text-sm font-semibold">{company.companyType}</p>
                {company.subType && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {company.subType}
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">기업규모 / 직원수</p>
                <p className="text-sm font-semibold">{profile.companySize}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {profile.employeeCount}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">설립년월</p>
                <p className="text-sm font-semibold">
                  {profile.foundedYear}년 {profile.foundedMonth}월
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                  {company.businessNumber}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* 기업 기본 정보 */}
            <Card className="col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">기업 기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-muted-foreground">대표자</p>
                    <p className="font-medium">{company.representativeName}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">사업자등록번호</p>
                    <p className="font-medium font-mono">{company.businessNumber}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">기업유형</p>
                    <p className="font-medium">
                      {company.companyType}
                      {company.subType ? ` · ${company.subType}` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">설립년월</p>
                    <p className="font-medium">
                      {profile.foundedYear}년 {profile.foundedMonth}월
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">기업규모</p>
                    <p className="font-medium">{profile.companySize}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">직원수</p>
                    <p className="font-medium">{profile.employeeCount}</p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-[11px] text-muted-foreground mb-1">한줄소개</p>
                  <p className="font-medium leading-snug">{profile.intro}</p>
                </div>
              </CardContent>
            </Card>

            {/* 연락처 / 주소 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">연락처 / 주소</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-[11px] text-muted-foreground">이메일</p>
                  <p className="font-medium break-all">{company.email}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">전화</p>
                  <p className="font-medium">{company.phone}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">주소</p>
                  <p className="font-medium">
                    [{profile.zipCode}] {profile.address}
                  </p>
                  <p className="font-medium">{profile.addressDetail}</p>
                </div>
                {profile.website && (
                  <div>
                    <p className="text-[11px] text-muted-foreground">웹사이트</p>
                    <a
                      href={`https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {showPortfolio && (
          <TabsContent value="portfolio" className="mt-0">
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
              <iframe
                title="company-portfolio-preview"
                src="/work/project/company-profile?embed=1"
                className="w-full h-[900px] bg-white"
              />
            </div>
          </TabsContent>
        )}

        <TabsContent value="projects" className="mt-0">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  프로젝트
                </CardTitle>
                <Link
                  href="/admin/projects"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  전체 프로젝트 보기
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">전체 ({projectsAll.length})</TabsTrigger>
                  <TabsTrigger value="owned">의뢰/등록 ({projectsOwned.length})</TabsTrigger>
                  <TabsTrigger value="participating">
                    참여 ({projectsParticipating.length})
                  </TabsTrigger>
                </TabsList>
                {(
                  [
                    { key: "all", list: projectsAll },
                    { key: "owned", list: projectsOwned },
                    { key: "participating", list: projectsParticipating },
                  ] as const
                ).map(({ key, list }) => (
                  <TabsContent key={key} value={key}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-28">ID</TableHead>
                          <TableHead>프로젝트명</TableHead>
                          <TableHead className="w-20 text-center">타입</TableHead>
                          <TableHead className="w-28 text-center">진행</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {list.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center py-8 text-muted-foreground"
                            >
                              연결된 프로젝트가 없습니다
                            </TableCell>
                          </TableRow>
                        ) : (
                          list.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell className="font-mono text-sm">{p.id}</TableCell>
                              <TableCell>
                                <Link
                                  href={`/admin/projects/${p.id}`}
                                  className="font-medium hover:text-pink-600"
                                >
                                  {p.title}
                                </Link>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {MainStatusLabels[p.status as keyof typeof MainStatusLabels] ??
                                    p.status}
                                </div>
                              </TableCell>
                              <TableCell className="text-center text-sm text-muted-foreground">
                                {p.type}
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex flex-col items-center gap-1.5">
                                  <span className="text-sm text-gray-600">
                                    {MainStatusLabels[p.status as keyof typeof MainStatusLabels] ??
                                      p.status}
                                  </span>
                                  <ProcessStepper
                                    currentStepIndex={getActiveStepIndexFromMainStatus(
                                      p.status,
                                      getProjectSteps(p.type === "1:1" ? "1:1" : "PUBLIC")
                                    )}
                                    steps={getProjectSteps(
                                      p.type === "1:1" ? "1:1" : "PUBLIC"
                                    )}
                                    mode="MINI"
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-0">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  구성원
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="이름, 이메일, 부서 검색"
                    className="pl-9"
                    value={memberSearchTerm}
                    onChange={(e) => setMemberSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">전체 ({mockMembers.length})</TabsTrigger>
                  <TabsTrigger value="active">활동중 ({activeMembers})</TabsTrigger>
                  <TabsTrigger value="inactive">활동중지 ({inactiveMembers})</TabsTrigger>
                  <TabsTrigger value="pending">승인대기 ({pendingMembers})</TabsTrigger>
                </TabsList>

                {(
                  [
                    { key: "all", list: filteredMembers },
                    { key: "active", list: filteredMembers.filter((m) => m.status === "active") },
                    { key: "inactive", list: filteredMembers.filter((m) => m.status === "inactive") },
                    { key: "pending", list: filteredMembers.filter((m) => m.status === "pending") },
                  ] as const
                ).map(({ key, list }) => (
                  <TabsContent key={key} value={key}>
                    {key === "pending" && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        구성원 승인은 해당 기업의 관리자가 처리합니다. 요청 시 대리 처리가 가능합니다.
                      </div>
                    )}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>이름</TableHead>
                          <TableHead>닉네임</TableHead>
                          <TableHead>부서</TableHead>
                          <TableHead>직위</TableHead>
                          <TableHead>권한</TableHead>
                          <TableHead>이메일</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>가입일</TableHead>
                          {key === "pending" && <TableHead className="text-right">대리 처리</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {list.map((member) => {
                          const statusInfo = memberStatusLabels[member.status];
                          return (
                            <TableRow key={member.id}>
                              <TableCell
                                className="font-medium cursor-pointer hover:text-pink-600"
                                onClick={() => setSelectedMember(member)}
                              >
                                {member.name}
                              </TableCell>
                              <TableCell>{member.nickname}</TableCell>
                              <TableCell>{member.department}</TableCell>
                              <TableCell>{member.position}</TableCell>
                              <TableCell>
                                <Badge className={`${roleColors[member.role]} text-white`}>
                                  {member.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{member.email}</TableCell>
                              <TableCell>
                                <Badge className={`${statusInfo.color} text-white`}>
                                  {statusInfo.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {member.joinedAt}
                              </TableCell>
                              {key === "pending" && (
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => alert("기업 관리자 대신 승인 처리되었습니다.")}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      대리 승인
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => alert("기업 관리자 대신 거절 처리되었습니다.")}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      대리 거절
                                    </Button>
                                  </div>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>회원 정보</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedMember.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedMember.nickname}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">이메일</p>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">연락처</p>
                  <p className="font-medium">{selectedMember.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">부서</p>
                  <p className="font-medium">{selectedMember.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">직위</p>
                  <p className="font-medium">{selectedMember.position}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">권한</p>
                  <Badge className={`${roleColors[selectedMember.role]} text-white`}>
                    {selectedMember.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">상태</p>
                  <Badge className={`${memberStatusLabels[selectedMember.status].color} text-white`}>
                    {memberStatusLabels[selectedMember.status].label}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

