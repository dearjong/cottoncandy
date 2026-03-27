import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Home,
  Mail,
  FolderOpen,
  Folder,
  Star,
  Share2,
  Bookmark,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const THUMB_PLACEHOLDER = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=140&fit=crop";
const PERSON_PLACEHOLDER = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop";

const portfolioItems = [
  { id: 1, title: "기업 PR 영상 제작 대행사 솜사탕애드", category: "기업 PR", sub: "회사 홍보 영상", year: "2024", award: true, thumbs: [THUMB_PLACEHOLDER, THUMB_PLACEHOLDER, THUMB_PLACEHOLDER] },
  { id: 2, title: "스마트전자 신제품 론칭 캠페인", category: "전기전자", sub: "제품 광고", year: "2024", award: false, thumbs: [THUMB_PLACEHOLDER, THUMB_PLACEHOLDER] },
  { id: 3, title: "공공기관 정책 캠페인 시리즈", category: "공공기관", sub: "정책 캠페인", year: "2023", award: true, thumbs: [THUMB_PLACEHOLDER, THUMB_PLACEHOLDER, THUMB_PLACEHOLDER] },
];

const portfolioGrid = Array(8).fill(null).map((_, i) => ({ id: i + 1, thumb: THUMB_PLACEHOLDER, title: `포트폴리오 작품 ${i + 1}`, year: "2024", tag: "기업 PR" }));

const staffList = [
  { name: "나해피", role: "크리에이티브 디렉터", desc: "15년 경력의 광고 전문가", img: PERSON_PLACEHOLDER },
  { name: "김창의", role: "영상 프로듀서", desc: "CF·바이럴 영상 전문", img: PERSON_PLACEHOLDER },
  { name: "이기획", role: "전략기획 팀장", desc: "데이터 기반 마케팅 전문", img: PERSON_PLACEHOLDER },
];

const ccActivities = [
  { id: 1, year: "2024", title: "빙그레 바나나맛 우유 30주년 캠페인", budget: "3억", status: "완료", award: "대상" },
  { id: 2, year: "2024", title: "초록우산 어린이재단 사회공헌 광고", budget: "1.5억", status: "완료", award: "-" },
  { id: 3, year: "2023", title: "해양수산부 수산물 소비촉진 캠페인", budget: "2억", status: "완료", award: "은상" },
  { id: 4, year: "2023", title: "동원식품 브랜드 리뉴얼 TVC", budget: "4억", status: "완료", award: "-" },
  { id: 5, year: "2023", title: "골드백화점 시즌 캠페인", budget: "2.5억", status: "완료", award: "금상" },
];

export default function PortfolioPreview() {
  const [, setLocation] = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("portfolio");
  const [activeTab, setActiveTab] = useState<"intro" | "portfolio">("intro");
  const [favorite, setFavorite] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* 왼쪽 사이드바 */}
            <aside className="w-64 flex-shrink-0">
              <div className="space-y-1">
                <div className="mb-6">
                  <div className="flex gap-4 mb-4">
                    <button className="flex-1 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:border-gray-300">My의뢰</button>
                    <button className="flex-1 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:border-gray-300">My 참여</button>
                  </div>
                </div>
                <button className="w-full text-left px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors" onClick={() => setLocation("/work/home")}>
                  <Home className="w-4 h-4 inline mr-2" />Work 홈
                </button>
                <button className="w-full text-left px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  <Mail className="w-4 h-4 inline mr-2" />메세지·알림 <span className="text-red-500">2</span>
                </button>
                <button className="w-full text-left px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors" onClick={() => setLocation("/work/project/list")}>
                  <FolderOpen className="w-4 h-4 inline mr-2" />프로젝트 관리
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 rounded-lg bg-gray-100 text-gray-900 font-medium transition-colors"
                  onClick={() => setLocation("/portfolio")}
                >
                  <FileText className="w-4 h-4 inline mr-2" />회사소개서 &amp; 포트폴리오
                </button>
                <div className="pl-8 space-y-1 text-sm text-gray-600">
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer" onClick={() => setLocation("/work/company-portfolio/company-info")}>└ 기업 정보</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer" onClick={() => setLocation("/work/company-portfolio/manager-info")}>└ 담당자 정보</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer">└ 경험·특화 분야</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer">└ 광고 목적별 전문 분야</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer">└ 제작 기법별 전문분야</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer">└ 대표 광고주</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer">└ 대표 수상내역</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer">└ 대표 포트폴리오</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer">└ 대표 스태프</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer">└ 최근 참여 프로젝트</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer">└ Cotton Candy 활동</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer">└ 파일 업로드</div>
                  <div className="px-4 py-1.5 hover:text-gray-900 cursor-pointer">└ 기업 소개글</div>
                </div>
                <button className="w-full text-left px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  <Folder className="w-4 h-4 inline mr-2" />파일함
                </button>
              </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 min-w-0 pb-24">
              {/* 상단 타이틀 + 닫기 */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-800">▶ Campaign creators 솜사탕애드 입니다.</span>
                </p>
                <button
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                  onClick={() => setLocation("/portfolio")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 회사 카드 헤더 */}
              <div className="border rounded-xl p-5 mb-0 bg-white">
                <div className="flex items-start gap-4">
                  {/* 로고 */}
                  <div className="w-[56px] h-[56px] rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300 text-[10px] flex-shrink-0">
                    LOGO
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-lg font-bold">솜사탕애드</span>
                          <span className="text-blue-500 text-sm">✓</span>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          {[1,2,3,4].map(i => (
                            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                          <Star className="w-3.5 h-3.5 text-gray-200 fill-gray-200" />
                          <span className="text-xs text-gray-400 ml-1">TVCF 평점</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="px-1.5 py-0.5 border border-gray-200 rounded">대행사</span>
                          <span>Creative중심 대행사</span>
                          <span>·</span>
                          <span>서울특별시</span>
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          className={`p-2 rounded-lg border transition-colors ${favorite ? "border-yellow-300 bg-yellow-50" : "border-gray-200 hover:bg-gray-50"}`}
                          onClick={() => setFavorite(!favorite)}
                        >
                          <Star className={`w-4 h-4 ${favorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                        </button>
                        <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                          <Share2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          className={`p-2 rounded-lg border transition-colors ${bookmarked ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                          onClick={() => setBookmarked(!bookmarked)}
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-blue-400 text-blue-400" : "text-gray-400"}`} />
                        </button>
                        <Button variant="outline" size="sm" className="btn-white-compact text-xs">
                          포트폴리오 보기
                        </Button>
                        <Button size="sm" className="btn-pink text-xs">
                          1:1 의뢰하기
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 담당자 정보 */}
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2.5">
                  <span className="text-gray-400 text-xs">담당자</span>
                  <span className="font-medium text-gray-800 text-xs">나해피</span>
                  <span className="text-xs">☎ 02-1234-5679</span>
                  <span className="text-xs">nhappy@yesc.com</span>
                </div>
              </div>

              {/* 탭 */}
              <div className="flex border-b mt-0">
                <button
                  className={`flex-1 py-3.5 text-sm font-medium transition-colors border-b-2 ${activeTab === "intro" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("intro")}
                >
                  회사소개서
                </button>
                <button
                  className={`flex-1 py-3.5 text-sm font-medium transition-colors border-b-2 ${activeTab === "portfolio" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("portfolio")}
                >
                  기업 포트폴리오
                </button>
              </div>

              {/* 회사소개서 탭 */}
              {activeTab === "intro" && (
                <div className="pt-6 space-y-8">

                  {/* 기업 소개글 */}
                  <section>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 mb-2">
                          Campaign creators 솜사탕애드 입니다.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          솜사탕애드(AdPrime)은 브랜드가 직면한 과제에 최적의 해답을 제시하고, 전하고 싶은 메시지를 가장 효과적인 방식으로 세상과 연결하는 크리에이티브 파트너입니다. 우리는 브랜드의 순간을 가장 빛나게 만드는 프라임 타임을 설계하며, 단순한 광고를 넘어 긍정적 변화를 이끄는 캠페인을 만듭니다. 솜사탕애드은 "Better Ideas, Better Impact"라는 철학 아래, 더 나은 내일을 위한 브랜드 스토리를 만들고, 이를 통해 세상과 사람들의 마음을 움직이는 캠페인 크리에이터(Campaign Creators)입니다.
                        </p>
                      </div>
                      <button className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  {/* 상세 정보 행 */}
                  <section className="space-y-3">
                    {[
                      { label: "", text: "#전략기획 #크리에이티브 기획 영상 제작 #성과 측정 및 리포팅 #인플루언서/SNS 마케팅 #PR/언론보도 대응 #급행제작 대응 #이벤트/행사 대응" },
                      { label: "[대표광고주]", text: "골드백화점, 블루리조트, 달콤커피, 스마트전자" },
                      { label: "[최근6개월]", text: "아름건설, 하늘항공, 뷰티코스메틱, 마이패션" },
                      { label: "", text: "직원 20명 이상  |  최소 제작비 2억  |  평균 제작비 3억" },
                      { label: "[최근 3년 활동]", text: "🏆 수상 35회  |  📂 포트폴리오 75작품" },
                      { label: "", text: "✓ Cotton Candy 활동 3작품" },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-4 text-sm">
                        <div className="flex gap-3">
                          {row.label && <span className="text-gray-400 w-24 flex-shrink-0">{row.label}</span>}
                          <span className={`text-gray-700 ${!row.label ? "text-gray-500" : ""}`}>{row.text}</span>
                        </div>
                        <button className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </section>

                  <hr className="border-gray-100" />

                  {/* 회사소개서 목록 */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900">회사소개서</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <ChevronLeft className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      {portfolioItems.map((item) => (
                        <div key={item.id} className="border rounded-xl overflow-hidden">
                          {/* 썸네일 */}
                          <div className="flex gap-1 h-28 bg-gray-100">
                            {item.thumbs.map((t, i) => (
                              <img key={i} src={t} alt="" className="flex-1 object-cover" />
                            ))}
                          </div>
                          {/* 소개서 정보 */}
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">공개</span>
                                  {item.award && <span className="text-xs text-yellow-600">🏆 수상</span>}
                                </div>
                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.category} · {item.sub} · {item.year}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  {/* 기업 포트폴리오 그리드 */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900">기업 포트폴리오</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <ChevronLeft className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {portfolioGrid.slice(0, 8).map((item) => (
                        <div key={item.id} className="rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
                          <img src={item.thumb} alt="" className="w-full h-20 object-cover" />
                          <div className="p-2">
                            <p className="text-[11px] font-medium text-gray-800 truncate">{item.title}</p>
                            <p className="text-[10px] text-gray-400">{item.year} · {item.tag}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  {/* 대표 스태프 */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900">대표 스태프</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <ChevronLeft className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {staffList.map((s) => (
                        <div key={s.name} className="flex items-start gap-3 p-3 border rounded-xl">
                          <img src={s.img} alt={s.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{s.name}</p>
                            <p className="text-xs text-gray-500">{s.role}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  {/* Cotton Candy 활동 */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">🍭 Cotton Candy 활동</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <ChevronLeft className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {ccActivities.map((act) => (
                        <div key={act.id} className="flex items-center justify-between py-2.5 px-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400 text-xs w-10 flex-shrink-0">{act.year}</span>
                            <span className="text-gray-800">{act.title}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                            <span>{act.budget}</span>
                            <span className="text-green-600">{act.status}</span>
                            {act.award !== "-" && <span className="text-yellow-600">🏆 {act.award}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-4">
                      <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                        + 더 많은 프로젝트 보기
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {/* 기업 포트폴리오 탭 */}
              {activeTab === "portfolio" && (
                <div className="pt-6">
                  <div className="grid grid-cols-4 gap-3">
                    {portfolioGrid.map((item) => (
                      <div key={item.id} className="rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
                        <img src={item.thumb} alt="" className="w-full h-28 object-cover" />
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.year} · {item.tag}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              onClick={() => setLocation("/portfolio")}
            >
              ← 소개서 목록으로
            </button>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="btn-white">
                문의하기
              </Button>
              <Button variant="outline" className="btn-white">
                포트폴리오 보기
              </Button>
              <Button className="btn-pink">
                1:1 의뢰하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
