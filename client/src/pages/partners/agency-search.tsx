import { useState } from "react";
import Layout from "@/components/layout/layout";
import SearchBar from "@/components/common/search-bar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Settings, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CompanyCard from "@/components/work/company-card";
import portfolio1 from "@assets/A000561001259B_1760322383639.jpg";
import portfolio2 from "@assets/A000561002A4A6_1760322383641.jpg";
import portfolio3 from "@assets/5_1760322393353.png";
import portfolio4 from "@assets/Image_1760322393356.png";

export default function AgencySearch() {
  const [activeTab, setActiveTab] = useState<'agency' | 'production'>('agency');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [excludeAlignment, setExcludeAlignment] = useState(true);
  const { toast } = useToast();

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast({
        description: "즐겨찾기 해제 완료",
        duration: 2000,
      });
    } else {
      newFavorites.add(id);
      toast({
        description: "즐겨찾기 추가 완료",
        duration: 2000,
      });
    }
    setFavorites(newFavorites);
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 헤더 섹션 */}
          <div className="text-center mb-8">
            <h1 className="page-title">
              "국내 최대 광고 플랫폼, TVCF에서 활동중인 전문기업"
            </h1>
            <p className="page-subtitle mb-6">
              TVCF의 광고 이력과 포트폴리오 정보를 통해 최적의 대행사를 선택할 수 있습니다.
            </p>
            
            {/* 검색 바 */}
            <div className="flex gap-3 max-w-2xl mx-auto mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="검색어를 입력하세요"
                className="flex-1"
              />
              <Button variant="outline" className="btn-white-compact" data-testid="button-register">
                대행사·제작사 등록
              </Button>
            </div>
          </div>

          {/* 탭 메뉴 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('agency')}
                  className={`px-5 py-2 rounded-full font-medium transition-colors ${
                    activeTab === 'agency' 
                      ? 'bg-black text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  data-testid="tab-agency"
                >
                  대행사
                </button>
                <button
                  onClick={() => setActiveTab('production')}
                  className={`px-5 py-2 rounded-full font-medium transition-colors ${
                    activeTab === 'production' 
                      ? 'bg-black text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  data-testid="tab-production"
                >
                  제작사
                </button>
                <button className="px-5 py-2 text-gray-500 hover:text-gray-700">전체</button>
                <button className="px-5 py-2 text-gray-500 hover:text-gray-700">인증기업 ⓘ</button>
                
                {activeTab === 'agency' ? (
                  <>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">종합대행</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">전략 중심</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">Creative 중심</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">제작 중심</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">퍼포먼스 중심</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">소규모</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">프리랜서</button>
                  </>
                ) : (
                  <>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">영상 중심</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">그래픽·애니메이션</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">기획·콘셉트형</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">촬영 전문</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">후반전문</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">소규모</button>
                    <button className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800">프리랜서</button>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800" data-testid="button-sort-dropdown">
                  보도블로만 받을 수 (3건 이내)
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">정렬식 수렴안계 제외</span>
                  <Settings className="w-4 h-4 text-gray-400" />
                  <Switch
                    checked={excludeAlignment}
                    onCheckedChange={setExcludeAlignment}
                    data-testid="switch-exclude-alignment"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* 왼쪽 필터 사이드바 */}
            <aside className="w-64 flex-shrink-0">
              <div className="space-y-6">
                {/* Service options */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-900">Service options</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-gray-700">의뢰 범위</h4>
                      <div className="space-y-2">
                        {activeTab === 'agency' ? (
                          <>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                              <Checkbox />
                              전략수립
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                              <Checkbox />
                              영상제작
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                              <Checkbox />
                              매체집행/운영
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                              <Checkbox />
                              성과분석 및 리포트
                            </label>
                          </>
                        ) : (
                          <>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                              <Checkbox />
                              영상 기획
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                              <Checkbox />
                              영상 촬영
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                              <Checkbox />
                              편집 및 후반작업
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                              <Checkbox />
                              음악/BGM
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                              <Checkbox />
                              모델/배우 섭외
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                              <Checkbox />
                              매체 집행
                            </label>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2 text-gray-700">의뢰 산업</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          정보통신
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          전기/전자
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          음료/기호식품
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          식품/제과
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          생활/가정용품
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          화장품
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          패션/스포츠
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          제약/의료/복지
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          금융/보험
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          아파트/건설
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          출판/교욱/문화
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          서비스/유통/레저
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          관공서/단체/공익/기업PR
                        </label>
                      </div>
                    </div>

                    {activeTab === 'agency' ? (
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-700">광고목적</h4>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            제품 판매 촉진
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            브랜드 인지도 향상
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            브랜드 이미지 제고
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            고객 행동 유도
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            기업 PR
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            공공 캠페인
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            리브랜딩
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            브랜드 런칭
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            이벤트/프로모션
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-700">제작기법</h4>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            AI
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            라이브액션
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            특수촬영
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            2D/3D
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            모션그래픽
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            애니메이션
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            제품 모델
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            캐릭터/동물 모델
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            판타지/SF
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            특수기법
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            CM Song형
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <Checkbox />
                            VR/AR
                          </label>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium mb-2 text-gray-700">광고매체</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          TV/ 극장 광고
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          디지털 광고
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          옥외광고 (OOH)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          전시/ 홍보/ 이벤트
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2 text-gray-700">최소제작비</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          1억 미만
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          1억 ~ 5억
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          5억 ~ 10억
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          10억 ~ 30억
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          30억 ~ 60억
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          60억 ~ 100억
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox />
                          100억 이상
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* 메인 컨텐츠 영역 */}
            <main className="flex-1">
              {/* 정렬 옵션 */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <select className="px-3 py-1.5 border rounded-md text-sm" data-testid="select-sort">
                    <option>포트폴리오 많은 순 (3년 이내)</option>
                    <option>최신순</option>
                    <option>인기순</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <Checkbox />
                  경쟁사 수행업체 제외
                </label>
              </div>

              {/* 업체 카드 목록 */}
              <div className="space-y-6">
                <CompanyCard
                  id={1}
                  logoText="솜"
                  companyName="솜사탕애드"
                  companyType={activeTab === 'agency' ? 'Creative중심 대행사' : '영상 중심 제작사'}
                  clients="골드백화점, 블루리조트, 달콤커피, 스마트전자 [최근6개월] 아름건설, 하늘항공, 뷰티코스메틱, 마이패션"
                  stats="[최근 3년] 35회 75작품 | 직원 20명 이상 | 최소 제작비 2억 ↑"
                  industryTags={['전기전자', '기업PR', '식품/제과', '공사/단체/공익/기업PR']}
                  specialtyTags={['#공공기관_정책캠페인', '#뷰티_숏폼', '#급행제작 대응']}
                  cottonCandyWorks="✓ Cotton Candy 활동 - 3작품"
                  portfolioImages={[portfolio1, portfolio2, portfolio3, portfolio4]}
                  isFavorite={favorites.has(1)}
                  onToggleFavorite={toggleFavorite}
                  showMessageButton={true}
                  variant="agency-search"
                />

                <CompanyCard
                  id={2}
                  logoText={activeTab === 'agency' ? '솜' : 'V'}
                  companyName={activeTab === 'agency' ? '솜사탕애드' : 'VEGA'}
                  companyType={activeTab === 'agency' ? 'Creative중심 대행사' : '영상 중심 제작사'}
                  clients="골드백화점, 블루리조트, 달콤커피, 스마트전자 [최근6개월] 아름건설, 하늘항공, 뷰티코스메틱, 마이패션"
                  stats="[최근 3년] 35회 75작품 | 직원 20명 이상 | 최소 제작비 2억 ↑"
                  industryTags={['전기전자', '기업PR', '식품/제과', '공사/단체/공익/기업PR']}
                  specialtyTags={['#공공기관_정책캠페인', '#뷰티_숏폼', '#급행제작 대응']}
                  cottonCandyWorks="✓ Cotton Candy 활동 - 3작품"
                  portfolioImages={[portfolio1, portfolio2, portfolio3, portfolio4]}
                  isFavorite={favorites.has(2)}
                  onToggleFavorite={toggleFavorite}
                  showMessageButton={true}
                  variant="agency-search"
                />

                <CompanyCard
                  id={3}
                  logoText="솜"
                  companyName="솜사탕애드"
                  companyType={activeTab === 'agency' ? 'Creative중심 대행사' : '영상 중심 제작사'}
                  clients="골드백화점, 블루리조트, 달콤커피, 스마트전자 [최근6개월] 아름건설, 하늘항공, 뷰티코스메틱, 마이패션"
                  stats="[최근 3년] 35회 75작품 | 직원 20명 이상 | 최소 제작비 2억 ↑"
                  industryTags={['전기전자', '기업PR', '식품/제과', '공사/단체/공익/기업PR']}
                  specialtyTags={['#공공기관_정책캠페인', '#뷰티_숏폼', '#급행제작 대응']}
                  cottonCandyWorks="✓ Cotton Candy 활동 - 3작품"
                  portfolioImages={[portfolio1, portfolio2, portfolio3, portfolio4]}
                  isFavorite={favorites.has(3)}
                  onToggleFavorite={toggleFavorite}
                  showMessageButton={true}
                  variant="agency-search"
                />

              </div>

              {/* 페이지네이션 */}
              <div className="flex justify-center gap-2 mt-8">
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">&lt;&lt;</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">&lt;</button>
                <button className="px-3 py-1 bg-pink-600 text-white rounded">1</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">2</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">3</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">4</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">5</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">6</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">7</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">8</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">9</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">10</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">&gt;</button>
                <button className="px-3 py-1 text-gray-600 hover:text-gray-900">&gt;&gt;</button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
