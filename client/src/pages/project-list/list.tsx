import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import SearchBar from "@/components/common/search-bar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockProjects } from "@/lib/mockProjectData";

export default function ProjectList() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterOngoing, setFilterOngoing] = useState(false);
  const [filterQuick, setFilterQuick] = useState(false);
  const [filterPublic, setFilterPublic] = useState(false);
  const [filterPrivate, setFilterPrivate] = useState(false);
  const [filterClosed, setFilterClosed] = useState(false);

  // 필터 섹션 열림/닫힘 상태
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    companyType: true,
    serviceScope: false,
    industry: false,
    adPurpose: false,
    adMedia: false,
    budget: false,
    rejectionFee: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Layout>
      <div className="py-8 sm:py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 검색 섹션 */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="page-title">
              이 광고에 자신있는 전문가를 찾습니다.
            </h1>
            <p className="page-subtitle mb-6">나에게 딱 맞는 비딩공고를 찾아드려요!</p>
            
            <div className="max-w-3xl mx-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="검색어를 입력하세요"
              />
            </div>
          </div>

          <div className="mb-8 sm:mb-12 md:mb-16">
            <div className="flex gap-8">
              {/* 왼쪽 필터 */}
              <div className="w-64 flex-shrink-0">
                {/* 기업유형 */}
                <div className="bg-white rounded-lg shadow-sm mb-4">
                <button
                  onClick={() => toggleSection('companyType')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  data-testid="button-filter-companyType"
                >
                  <span className="font-semibold">기업유형</span>
                  {expandedSections.companyType ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.companyType && (
                  <div className="px-4 pb-4 space-y-2">
                    {["대기업", "중견기업", "중소기업", "스타트업", "벤처기업", "외국계기업", "공공기관/공기업", "비영리기관/단체"].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox data-testid={`checkbox-${type}`} />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

                {/* 서비스범위 */}
                <div className="bg-white rounded-lg shadow-sm mb-4">
                <button
                  onClick={() => toggleSection('serviceScope')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  data-testid="button-filter-serviceScope"
                >
                  <span className="font-semibold">서비스범위</span>
                  {expandedSections.serviceScope ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.serviceScope && (
                  <div className="px-4 pb-4 space-y-2">
                    {["전략수립", "영상제작", "매체집행/운영", "성과분석 및 리포트"].map(scope => (
                      <label key={scope} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox data-testid={`checkbox-${scope}`} />
                        <span className="text-sm">{scope}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

                {/* 광고목적 */}
                <div className="bg-white rounded-lg shadow-sm mb-4">
                <button
                  onClick={() => toggleSection('adPurpose')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  data-testid="button-filter-adPurpose"
                >
                  <span className="font-semibold">광고목적</span>
                  {expandedSections.adPurpose ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.adPurpose && (
                  <div className="px-4 pb-4 space-y-2">
                    {["제품 판매 촉진", "브랜드 인지도 향상", "브랜드 이미지 제고", "고객 행동 유도", "기업 PR", "공공 캠페인", "리브랜딩", "브랜드 런칭", "이벤트/ 프로모션"].map(purpose => (
                      <label key={purpose} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox data-testid={`checkbox-${purpose}`} />
                        <span className="text-sm">{purpose}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

                {/* 예산 */}
                <div className="bg-white rounded-lg shadow-sm mb-4">
                <button
                  onClick={() => toggleSection('budget')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  data-testid="button-filter-budget"
                >
                  <span className="font-semibold">예산</span>
                  {expandedSections.budget ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.budget && (
                  <div className="px-4 pb-4 space-y-2">
                    {["1억 미만", "1억 ~ 5억", "5억 ~ 10억", "10억 ~ 30억", "30억 ~ 60억", "60억 ~ 100억", "100억 이상"].map(budget => (
                      <label key={budget} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox data-testid={`checkbox-${budget}`} />
                        <span className="text-sm">{budget}</span>
                      </label>
                    ))}
                  </div>
                )}
                </div>
              </div>

              {/* 오른쪽 공고 리스트 */}
              <div className="flex-1">
                {/* 탭 & 필터 */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-4">
                    <Button variant="default" className="bg-pink-600 hover:bg-pink-700" data-testid="button-tab-all">
                      전체공고
                    </Button>
                    <Button variant="outline" data-testid="button-tab-agency">
                      대행사를 찾아요
                    </Button>
                    <Button variant="outline" data-testid="button-tab-production">
                      제작사를 찾아요
                    </Button>
                  </div>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40" data-testid="select-sort">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">최신 등록순</SelectItem>
                      <SelectItem value="deadline">마감임박순</SelectItem>
                      <SelectItem value="budget-high">예산 높은순</SelectItem>
                      <SelectItem value="budget-low">예산 낮은순</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filterOngoing} onCheckedChange={(checked) => setFilterOngoing(checked as boolean)} data-testid="checkbox-ongoing" />
                    <span className="text-sm">진행중인 공고만</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filterQuick} onCheckedChange={(checked) => setFilterQuick(checked as boolean)} data-testid="checkbox-quick" />
                    <span className="text-sm">바로제작 프로젝트만</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filterPublic} onCheckedChange={(checked) => setFilterPublic(checked as boolean)} data-testid="checkbox-public" />
                    <span className="text-sm">공개 비딩</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filterPrivate} onCheckedChange={(checked) => setFilterPrivate(checked as boolean)} data-testid="checkbox-private" />
                    <span className="text-sm">비공개 비딩</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={filterClosed} onCheckedChange={(checked) => setFilterClosed(checked as boolean)} data-testid="checkbox-closed" />
                    <span className="text-sm">종료된 공고</span>
                  </label>
                  </div>
                </div>

                {/* 프로젝트 카드 */}
                <div className="space-y-4">
                  {mockProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setLocation(`/project-list/${project.id}`)}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                    data-testid={`card-project-${project.id}`}
                  >
                    {/* 헤더 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-lg">
                          B
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-600">{project.id}</span>
                            <Badge variant="outline" className="text-xs">{project.status}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {project.type && <span>{project.type}</span>}
                            {project.partnerType && <span>{project.partnerType}</span>}
                            {project.bidType && <span>{project.bidType}</span>}
                            {project.myStatus && <Badge className="bg-blue-600">{project.myStatus}</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900 mb-1">
                          총예산 {project.totalBudget}
                        </div>
                        {project.productionBudget && (
                          <div className="text-xs text-gray-500">
                            (제작비 {project.productionBudget})
                          </div>
                        )}
                        <div className="text-sm text-pink-600 font-semibold mt-1">
                          접수마감 D-{project.daysLeft}
                        </div>
                      </div>
                    </div>

                    {/* 제목 */}
                    <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                    <div className="text-sm text-gray-600 mb-3">
                      {project.company} {project.companyType} {project.industry}
                    </div>

                    {/* 일정 */}
                    <div className="flex gap-4 text-sm text-gray-600 mb-3">
                      <span>접수마감 {project.deadline}</span>
                      {project.deliveryDate && <span>납품기한 {project.deliveryDate}</span>}
                    </div>

                    {/* 서비스 범위 */}
                    {project.services.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.services.map((service, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* 태그 */}
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs text-blue-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 특징 */}
                    {project.features.length > 0 && (
                      <div className="flex gap-3 text-sm">
                        {project.features.map((feature, idx) => (
                          <span key={idx} className="flex items-center gap-1">
                            <span className="text-green-600">✓</span>
                            <span className="text-gray-600">{feature}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    </div>
                  ))}
                </div>

                {/* 페이지네이션 */}
                <div className="flex justify-center gap-2 mt-8">
                  <Button variant="outline" size="sm">&lt;&lt;</Button>
                <Button variant="outline" size="sm">&lt;</Button>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(page => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="sm"
                    className={page === 1 ? "bg-pink-600 hover:bg-pink-700" : ""}
                  >
                    {page}
                  </Button>
                ))}
                  <Button variant="outline" size="sm">&gt;</Button>
                  <Button variant="outline" size="sm">&gt;&gt;</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
