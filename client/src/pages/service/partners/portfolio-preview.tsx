import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import {
  FileText, Home, Mail, FolderOpen, Folder,
  Star, Share2, Bookmark, Pencil, X, ChevronLeft, ChevronRight,
} from "lucide-react";

const GRAY = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='%23e5e7eb'/%3E%3C/svg%3E";
const T1 = GRAY, T2 = GRAY, T3 = GRAY, T4 = GRAY;
const P1 = GRAY, P2 = GRAY, P3 = GRAY;
const LOGO = GRAY;

const infoRows = [
  "#전략기획 #크리에이티브 기획 영상 제작 #성과 측정 및 리포팅 #인플루언서/SNS 마케팅, #PR/언론보도 대응 #급행제작 대응 #이벤트/행사 대응",
  "[대표광고주]   골드백화점, 블루리조트, 달콤커피, 스마트전자",
  "[최근6개월]   아름건설, 하늘항공, 뷰티코스메틱, 마이패션",
  "직원 20명 이상  |  최소 제작비 2억  |  평균 제작비 3억",
  "[최근 3년 활동]   🏆 수상 35회  |  📂 포트폴리오 75작품",
  "✓ Cotton Candy 활동 3작품",
];

const portfolioCards = [
  {
    id: 1, title: "기본소개서 (자동생성됨)", visible: "공개", auto: true,
    date: "2025.05.01", thumbs: [T1, T2, T3],
  },
  {
    id: 2, title: "Campaign creators 솜사탕애드 입니다.", visible: "공개", auto: false,
    date: "2025.07.03", thumbs: [T1, T4],
  },
];

const gridItems = [
  { id: 1, thumb: T1, title: "[베스트전자] 스타일러 써보셨어요?", sub: "완전히 새로워진 에어랩", date: "2025.06.08" },
  { id: 2, thumb: T2, title: "[빙그레] 바나나맛우유 30주년", sub: "기업 PR 영상", date: "2025.04.12" },
  { id: 3, thumb: T3, title: "[해양수산부] 수산물 소비촉진", sub: "정책 캠페인", date: "2025.03.01" },
  { id: 4, thumb: T4, title: "[초록우산] 어린이재단 공익광고", sub: "사회공헌 광고", date: "2024.12.20" },
  { id: 5, thumb: T1, title: "[동원식품] 브랜드 리뉴얼 TVC", sub: "브랜드 영상", date: "2024.10.05" },
  { id: 6, thumb: T2, title: "[골드백화점] 시즌 캠페인", sub: "유통 광고", date: "2024.08.15" },
];

const staffList = [
  { name: "나해피", role: "크리에이티브 디렉터", desc: "15년 경력 광고 전문가", img: P1, works: [T1, T2, T3] },
  { name: "김창의", role: "영상 프로듀서", desc: "CF·바이럴 영상 전문", img: P2, works: [T2, T4, T3] },
  { name: "이기획", role: "전략기획 팀장", desc: "데이터 기반 마케팅", img: P3, works: [T3, T1, T4] },
];

const ccActivities = [
  { year: "2024", title: "빙그레 바나나맛 우유 30주년 캠페인", budget: "3억", status: "완료", award: "대상" },
  { year: "2024", title: "초록우산 어린이재단 사회공헌 광고", budget: "1.5억", status: "완료", award: "" },
  { year: "2023", title: "해양수산부 수산물 소비촉진 캠페인", budget: "2억", status: "완료", award: "은상" },
  { year: "2023", title: "동원식품 브랜드 리뉴얼 TVC", budget: "4억", status: "완료", award: "" },
  { year: "2023", title: "골드백화점 시즌 캠페인", budget: "2.5억", status: "완료", award: "금상" },
];

export default function PortfolioPreview() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"intro" | "portfolio">("intro");
  const [fav, setFav] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">

            {/* ── 사이드바 ── */}
            <aside className="w-60 flex-shrink-0">
              <div className="space-y-0.5 text-sm">
                <div className="flex gap-4 mb-5 border-b pb-3">
                  <button className="flex-1 text-center text-gray-500 hover:text-gray-800">My의뢰</button>
                  <button className="flex-1 text-center text-gray-500 hover:text-gray-800">My 참여</button>
                </div>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-gray-500 hover:bg-gray-50" onClick={() => setLocation("/work/home")}>
                  <Home className="w-4 h-4" /> Work 홈
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-gray-500 hover:bg-gray-50">
                  <Mail className="w-4 h-4" /> 메세지·알림 <span className="text-red-500 ml-auto">2</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-gray-500 hover:bg-gray-50" onClick={() => setLocation("/work/project/list")}>
                  <FolderOpen className="w-4 h-4" /> 프로젝트 관리
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded bg-gray-100 font-medium text-gray-900" onClick={() => setLocation("/portfolio")}>
                  <FileText className="w-4 h-4" /> 회사소개서 &amp; 포트폴리오
                </button>
                <div className="pl-7 space-y-0.5 text-gray-500">
                  {["기업 정보","담당자 정보","경험·특화 분야","광고 목적별 전문 분야","제작 기법별 전문분야","대표 광고주","대표 수상내역","대표 포트폴리오","대표 스태프","최근 참여 프로젝트","Cotton Candy 활동","파일 업로드","기업 소개글"].map(m => (
                    <button key={m} className="w-full text-left px-3 py-1 hover:text-gray-900">└ {m}</button>
                  ))}
                </div>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-gray-500 hover:bg-gray-50 mt-1">
                  <Folder className="w-4 h-4" /> 파일함
                </button>
              </div>
            </aside>

            {/* ── 메인 ── */}
            <main className="flex-1 min-w-0 pb-4">

              {/* 상단 내비게이션 */}
              <div className="flex items-center justify-between mb-5">
                <button
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5"
                  onClick={() => setLocation("/portfolio")}
                >
                  <ChevronLeft className="w-4 h-4" /> 목록으로 돌아가기
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                  <span>이전 / 다음 소개서</span>
                  <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              {/* 제목 */}
              <h1 className="text-2xl font-bold text-center mb-5">회사소개서 &amp; 포트폴리오</h1>

              {/* 소개서 breadcrumb */}
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium text-gray-800">▶ Campaign creators 솜사탕애드 입니다.</span>
                </div>
                <button className="text-gray-400 hover:text-gray-700" onClick={() => setLocation("/portfolio")}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 회사 카드 */}
              <div className="border rounded-xl p-5 mb-0">
                <div className="flex items-start gap-4">
                  <img src={LOGO} alt="logo" className="w-[72px] h-[72px] rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl font-bold">솜사탕애드</span>
                          <span className="text-[13px] text-blue-500">✓</span>
                          <div className="flex items-center gap-0.5 ml-1">
                            {[1,2,3,4].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                            <Star className="w-3 h-3 fill-gray-200 text-gray-200" />
                          </div>
                          <span className="text-xs text-gray-400">·TVCF 평점</span>
                          <span className="text-base">🥇</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <span className="px-1.5 py-0.5 border border-gray-200 rounded text-[11px]">대행사</span>
                          <span>Creative중심 대행사</span>
                          <span>·</span>
                          <span>서울특별시</span>
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          className={`p-1.5 rounded border transition-colors ${fav ? "border-yellow-300 bg-yellow-50" : "border-gray-200 hover:bg-gray-50"}`}
                          onClick={() => setFav(!fav)}
                        >
                          <Star className={`w-4 h-4 ${fav ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                        </button>
                        <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-50">
                          <Share2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          className={`p-1.5 rounded border transition-colors ${saved ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                          onClick={() => setSaved(!saved)}
                        >
                          <Bookmark className={`w-4 h-4 ${saved ? "fill-blue-400 text-blue-400" : "text-gray-400"}`} />
                        </button>
                        <Button variant="outline" size="sm" className="text-xs h-8 px-3">포트폴리오 보기</Button>
                        <Button size="sm" className="btn-pink text-xs h-8 px-4">1:1 의뢰하기</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 담당자 */}
                <div className="mt-4 flex items-center gap-5 bg-gray-50 rounded-lg px-4 py-2.5 text-xs text-gray-600">
                  <span className="text-gray-400">담당자</span>
                  <span className="font-medium text-gray-800">나해피</span>
                  <span>☎ 02-1234-5679</span>
                  <span>nhappy@yesc.com</span>
                </div>
              </div>

              {/* 탭 */}
              <div className="flex border-b">
                <button
                  className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "intro" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("intro")}
                >회사소개서</button>
                <button
                  className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "portfolio" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("portfolio")}
                >기업 포트폴리오</button>
              </div>

              {/* ── 회사소개서 탭 ── */}
              {activeTab === "intro" && (
                <div className="pt-6 space-y-7">

                  {/* 소개글 */}
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 mb-2">Campaign creators 솜사탕애드 입니다.</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        솜사탕애드(AdPrime)은 브랜드가 직면한 과제에 최적의 해답을 제시하고, 전하고 싶은 메시지를 가장 효과적인 방식으로 세상과 연결하는 크리에이티브 파트너입니다. 우리는 브랜드의 순간을 가장 빛나게 만드는 프라임 타임을 설계하며, 단순한 광고를 넘어 긍정적 변화를 이끄는 캠페인을 만듭니다. 솜사탕애드은 "Better Ideas, Better Impact"라는 철학 아래, 더 나은 내일을 위한 브랜드 스토리를 만들고, 이를 통해 세상과 사람들의 마음을 움직이는 캠페인 크리에이터(Campaign Creators)입니다.
                      </p>
                    </div>
                    <button className="text-gray-300 hover:text-gray-500 flex-shrink-0 mt-0.5">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <hr />

                  {/* 정보 행 */}
                  <div className="space-y-2.5">
                    {infoRows.map((row, i) => (
                      <div key={i} className="flex items-start justify-between gap-4">
                        <span className="text-sm text-gray-700 flex-1 leading-relaxed">{row}</span>
                        <button className="text-gray-300 hover:text-gray-500 flex-shrink-0 mt-0.5">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <hr />

                  {/* 소개서 카드 */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900">소개서</h3>
                      <div className="flex gap-1 text-gray-400">
                        <button><ChevronLeft className="w-4 h-4" /></button>
                        <button><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {portfolioCards.map(card => (
                        <div key={card.id} className="border rounded-xl overflow-hidden">
                          <div className="flex gap-0.5 h-32 bg-gray-100">
                            {card.thumbs.map((t, i) => (
                              <img key={i} src={t} alt="" className="flex-1 object-cover" />
                            ))}
                          </div>
                          <div className="px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={`text-xs px-2 py-0.5 rounded ${card.visible === "공개" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                {card.visible}
                              </span>
                              <span className="text-sm font-medium text-gray-900">{card.title}</span>
                              {card.auto && <span className="text-[11px] text-gray-400 border border-gray-200 rounded px-1.5">자동생성됨</span>}
                              <span className="text-xs text-gray-400">{card.date}</span>
                            </div>
                            <div className="flex gap-1">
                              <button className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1">보기</button>
                              <button className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1">복사하기</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <hr />

                  {/* 기업 포트폴리오 그리드 */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900">기업 포트폴리오</h3>
                      <div className="flex gap-1 text-gray-400">
                        <button><ChevronLeft className="w-4 h-4" /></button>
                        <button><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {gridItems.map(item => (
                        <div key={item.id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                          <img src={item.thumb} alt="" className="w-full h-28 object-cover" />
                          <div className="p-3">
                            <p className="text-sm font-bold text-gray-900 leading-snug mb-0.5">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.sub}</p>
                            <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <hr />

                  {/* 대표 스태프 */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900">대표 스태프</h3>
                      <div className="flex gap-1 text-gray-400">
                        <button><ChevronLeft className="w-4 h-4" /></button>
                        <button><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="space-y-5">
                      {staffList.map(s => (
                        <div key={s.name} className="flex gap-5">
                          <div className="flex-shrink-0 w-48">
                            <div className="flex items-center gap-3 mb-3">
                              <img src={s.img} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
                              <div>
                                <p className="text-sm font-bold text-gray-900">{s.name}</p>
                                <p className="text-xs text-gray-500">{s.role}</p>
                                <p className="text-xs text-gray-400">{s.desc}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            {s.works.map((w, i) => (
                              <img key={i} src={w} alt="" className="w-full h-20 object-cover rounded-lg border border-gray-100" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <hr />

                  {/* Cotton Candy 활동 */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900">🍭 Cotton Candy 활동</h3>
                      <div className="flex gap-1 text-gray-400">
                        <button><ChevronLeft className="w-4 h-4" /></button>
                        <button><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="border rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                          <tr className="text-gray-500 text-xs">
                            <th className="text-left px-4 py-3 font-medium w-12">연도</th>
                            <th className="text-left px-4 py-3 font-medium">프로젝트명</th>
                            <th className="text-right px-4 py-3 font-medium w-20">예산</th>
                            <th className="text-center px-4 py-3 font-medium w-16">상태</th>
                            <th className="text-center px-4 py-3 font-medium w-20">수상</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ccActivities.map((a, i) => (
                            <tr key={i} className="border-t hover:bg-gray-50 transition-colors cursor-pointer">
                              <td className="px-4 py-3 text-gray-400 text-xs">{a.year}</td>
                              <td className="px-4 py-3 text-gray-800">{a.title}</td>
                              <td className="px-4 py-3 text-right text-gray-600">{a.budget}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">{a.status}</span>
                              </td>
                              <td className="px-4 py-3 text-center text-xs text-yellow-600">
                                {a.award ? `🏆 ${a.award}` : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-center mt-3">
                      <button className="text-xs text-gray-400 hover:text-gray-600">+ 더 많은 프로젝트 보기</button>
                    </div>
                  </section>

                </div>
              )}

              {/* ── 기업 포트폴리오 탭 ── */}
              {activeTab === "portfolio" && (
                <div className="pt-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[...gridItems, ...gridItems.slice(0, 3)].map((item, i) => (
                      <div key={i} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <img src={item.thumb} alt="" className="w-full h-36 object-cover" />
                        <div className="p-3">
                          <p className="text-sm font-bold text-gray-900 leading-snug mb-0.5">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.sub}</p>
                          <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 하단 내비게이션 */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t">
                <button
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5"
                  onClick={() => setLocation("/portfolio")}
                >
                  <ChevronLeft className="w-4 h-4" /> 목록으로 돌아가기
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                  <span>이전 / 다음 소개서</span>
                  <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

            </main>
          </div>
        </div>
      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200" style={{ zIndex: 9999 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
          <button
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
            onClick={() => setLocation("/portfolio")}
          >
            <ChevronLeft className="w-4 h-4" /> 목록으로 돌아가기
          </button>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="btn-white h-9">문의하기</Button>
            <Button variant="outline" className="btn-white h-9">포트폴리오 보기</Button>
            <Button className="btn-pink h-9">1:1 의뢰하기</Button>
          </div>
        </div>
      </div>
      {/* 하단 여백 (fixed bar 높이만큼) */}
      <div className="h-16" />
    </Layout>
  );
}
