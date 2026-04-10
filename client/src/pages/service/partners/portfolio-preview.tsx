import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import WorkSidebar from "@/components/work/sidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Globe,
  MessageCircle,
  Mail,
  Edit2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
} from "lucide-react";

const AWARD_ITEMS = [
  { year: "2025", title: "대한민국 광고대상 대상", org: "한국광고총연합회" },
  { year: "2024", title: "칸 라이언즈 브론즈", org: "칸 라이언즈" },
  { year: "2024", title: "부산국제광고제 금상", org: "부산국제광고제" },
];

const PORTFOLIO_ITEMS = [
  { title: "골드백화점 브랜드 캠페인", sub: "TV-CF 30s", color: "bg-orange-200" },
  { title: "블루리조트 여름시즌", sub: "디지털 영상", color: "bg-blue-200" },
  { title: "달콤커피 신제품 런칭", sub: "SNS 숏폼", color: "bg-pink-200" },
  { title: "스마트전자 브랜드", sub: "TV-CF 15s", color: "bg-gray-300" },
  { title: "아름건설 기업PR", sub: "기업PR 영상", color: "bg-green-200" },
];

const STAFF_ITEMS = [
  { name: "김창의", role: "Creative Director", career: "15년", thumbs: ["bg-orange-200","bg-blue-200","bg-pink-200","bg-gray-300"] },
  { name: "이기획", role: "Account Director", career: "12년", thumbs: ["bg-green-200","bg-yellow-200","bg-purple-200","bg-teal-200"] },
];

const RECENT_PROJECTS = [
  { date: "2025-06-15", title: "골드백화점 하반기 브랜드 캠페인", budget: "3억", status: "완료" },
  { date: "2025-05-20", title: "블루리조트 여름 시즌 광고", budget: "1.5억", status: "완료" },
  { date: "2025-04-10", title: "달콤커피 신제품 런칭 캠페인", budget: "8천만", status: "완료" },
  { date: "2025-03-05", title: "스마트전자 스마트폰 브랜드 광고", budget: "5억", status: "완료" },
  { date: "2025-02-14", title: "아름건설 브랜드 이미지 캠페인", budget: "2억", status: "완료" },
];

const CC_ACTIVITIES = [
  { title: "2025 솜사탕 영상제 참여작", color: "bg-pink-200" },
  { title: "브랜드 필름 공모전 수상작", color: "bg-orange-200" },
  { title: "사회공헌 캠페인 영상", color: "bg-blue-200" },
];

type Tab = "intro" | "tvcf";

export default function PortfolioPreview() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("intro");
  const [agreed, setAgreed] = useState(false);
  const [awardsOpen, setAwardsOpen] = useState(true);
  const [portfolioOpen, setPortfolioOpen] = useState(true);
  const [staffOpen, setStaffOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [ccOpen, setCcOpen] = useState(true);

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <WorkSidebar />

            {/* 메인 */}
            <main className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-4">회사소개서 &amp; 포트폴리오</h1>

              {/* 브레드크럼 */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                <span
                  className="text-pink-600 font-medium cursor-pointer hover:underline"
                  onClick={() => setLocation("/portfolio")}
                >
                  MY 기업정보
                </span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-800">Campaign creators 솜사탕애드 입니다</span>
                <button
                  className="ml-1 text-gray-400 hover:text-pink-600"
                  onClick={() => setLocation("/work/company-portfolio/intro")}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 탭 */}
              <div className="flex border-b border-gray-200 mb-5">
                {(["intro", "tvcf"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === t
                        ? "border-pink-600 text-pink-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t === "intro" ? "회사소개서" : "TVCF 포트폴리오"}
                  </button>
                ))}
              </div>

              {/* 회사 헤더 카드 */}
              <div className="border border-gray-200 rounded-xl p-5 mb-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-pink-100 flex items-center justify-center text-2xl flex-shrink-0">
                    🍭
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">솜사탕애드</span>
                      <span className="text-yellow-400 text-sm">★★★★★</span>
                      <span className="text-xs text-gray-400">4.9</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      🥇 Creative중심 대행사 · 서울 마포구 · premium@cottoncandy.com
                    </div>
                  </div>
                  <Heart className="w-5 h-5 text-gray-300 flex-shrink-0 mt-1" />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <button className="p-1.5 text-gray-400 hover:text-pink-600"><Globe className="w-4 h-4" /></button>
                  <button className="p-1.5 text-gray-400 hover:text-pink-600"><MessageCircle className="w-4 h-4" /></button>
                  <button className="p-1.5 text-gray-400 hover:text-pink-600"><Mail className="w-4 h-4" /></button>
                  <div className="flex-1" />
                  <Button variant="outline" size="sm" className="text-xs h-8 px-3">연락처</Button>
                  <Button size="sm" className="text-xs h-8 px-3 bg-pink-600 hover:bg-pink-700 text-white">
                    1:1 의뢰하기
                  </Button>
                </div>

                {/* 회사 소개글 */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    Campaign creators 솜사탕애드 입니다.
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Cotton Candy는 창의적인 아이디어와 혁신적인 제작 기술을 결합하여 최고의 광고 캠페인을 만드는
                    전문 광고대행사입니다. TV-CF, 디지털 영상, SNS 콘텐츠 등 다양한 매체에서 탁월한 성과를 이뤄온
                    저희 솜사탕애드는 여러분의 브랜드가 소비자의 마음속에 깊이 각인될 수 있도록 최선을 다합니다.
                  </p>
                </div>

                {/* 상세 정보 */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs mb-3">
                  {[
                    ["경험년수", "15년 이상"],
                    ["최근 3년 제작 편수", "35회"],
                    ["직원수", "20명 이상"],
                    ["최소 제작비", "2억 이상"],
                    ["주요 업종", "전기전자, 식품/제과, 기업PR"],
                    ["제작 유형", "TV-CF, 디지털영상, SNS"],
                  ].map(([label, val]) => (
                    <div key={label} className="flex gap-2">
                      <span className="text-gray-400 w-28 shrink-0">{label}</span>
                      <span className="text-gray-700">{val}</span>
                    </div>
                  ))}
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {["전기전자", "기업PR", "식품/제과", "공사/단체/공익/기업PR", "#공공기관_정책캠페인", "#뷰티_숏폼", "#급행제작 대응"].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-700">{tag}</span>
                  ))}
                </div>

                {/* 대표 광고주 */}
                <p className="text-xs text-gray-600">
                  <span className="text-gray-400">[대표광고주]</span> 골드백화점, 블루리조트, 달콤커피, 스마트전자{" "}
                  <span className="text-gray-400">[최근6개월]</span> 아름건설, 하늘항공, 뷰티코스메틱, 마이패션
                </p>
              </div>

              {/* 섹션 공통 컴포넌트 팩토리 */}
              {/* 대표 수상내역 */}
              <div className="border border-gray-200 rounded-xl mb-4">
                <button
                  className="w-full flex items-center justify-between px-5 py-4"
                  onClick={() => setAwardsOpen(!awardsOpen)}
                >
                  <span className="font-semibold text-sm">대표 수상내역</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-gray-400 hover:text-pink-600"
                      onClick={(e) => { e.stopPropagation(); setLocation("/work/company-portfolio/awards"); }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </span>
                    {awardsOpen
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>
                {awardsOpen && (
                  <div className="px-5 pb-4 space-y-0 border-t border-gray-100">
                    {AWARD_ITEMS.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                        <span className="text-xs text-gray-400 w-10 shrink-0">{a.year}</span>
                        <span className="text-sm text-gray-800 flex-1">{a.title}</span>
                        <span className="text-xs text-gray-400">{a.org}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 대표 포트폴리오 */}
              <div className="border border-gray-200 rounded-xl mb-4">
                <button
                  className="w-full flex items-center justify-between px-5 py-4"
                  onClick={() => setPortfolioOpen(!portfolioOpen)}
                >
                  <span className="font-semibold text-sm">대표 포트폴리오</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-gray-400 hover:text-pink-600"
                      onClick={(e) => { e.stopPropagation(); setLocation("/work/company-portfolio/portfolio"); }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </span>
                    {portfolioOpen
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>
                {portfolioOpen && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="grid grid-cols-5 gap-3 mt-4">
                      {PORTFOLIO_ITEMS.map((p, i) => (
                        <div key={i}>
                          <div className={`${p.color} rounded-lg h-24 mb-1.5`} />
                          <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">{p.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{p.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 대표 스태프 */}
              <div className="border border-gray-200 rounded-xl mb-4">
                <button
                  className="w-full flex items-center justify-between px-5 py-4"
                  onClick={() => setStaffOpen(!staffOpen)}
                >
                  <span className="font-semibold text-sm">대표 스태프</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-gray-400 hover:text-pink-600"
                      onClick={(e) => { e.stopPropagation(); setLocation("/work/company-portfolio/staff"); }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </span>
                    {staffOpen
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>
                {staffOpen && (
                  <div className="px-5 pb-5 border-t border-gray-100 divide-y divide-gray-50">
                    {STAFF_ITEMS.map((s, i) => (
                      <div key={i} className="flex gap-4 py-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold shrink-0">
                          {s.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm">{s.name}</span>
                            <span className="text-xs text-gray-400">{s.role}</span>
                            <span className="text-xs text-gray-400">경력 {s.career}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {s.thumbs.map((cls, j) => (
                              <div key={j} className={`${cls} rounded-lg h-16`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 최근 참여 프로젝트 */}
              <div className="border border-gray-200 rounded-xl mb-4">
                <button
                  className="w-full flex items-center justify-between px-5 py-4"
                  onClick={() => setProjectsOpen(!projectsOpen)}
                >
                  <span className="font-semibold text-sm">최근 참여 프로젝트</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-gray-400 hover:text-pink-600"
                      onClick={(e) => { e.stopPropagation(); setLocation("/work/company-portfolio/recent-projects"); }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </span>
                    {projectsOpen
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>
                {projectsOpen && (
                  <div className="px-5 pb-4 border-t border-gray-100 divide-y divide-gray-50">
                    {RECENT_PROJECTS.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 py-2.5 text-sm">
                        <span className="text-xs text-gray-400 w-24 shrink-0">{p.date}</span>
                        <span className="flex-1 text-gray-800 text-xs">{p.title}</span>
                        <span className="text-xs text-gray-500 w-12 text-right shrink-0">{p.budget}</span>
                        <span className="text-xs text-green-600 w-8 shrink-0">{p.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 최근 Cotton Candy 활동 */}
              <div className="border border-gray-200 rounded-xl mb-6">
                <button
                  className="w-full flex items-center justify-between px-5 py-4"
                  onClick={() => setCcOpen(!ccOpen)}
                >
                  <span className="font-semibold text-sm">최근 Cotton Candy 활동</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-gray-400 hover:text-pink-600"
                      onClick={(e) => { e.stopPropagation(); setLocation("/work/company-portfolio/cotton-candy-activity"); }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </span>
                    {ccOpen
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>
                {ccOpen && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {CC_ACTIVITIES.map((c, i) => (
                        <div key={i}>
                          <div className={`${c.color} rounded-lg h-36 mb-2`} />
                          <p className="text-xs text-gray-700 text-center">{c.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 하단 약관 + 버튼 */}
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-start gap-2.5 mb-5">
                  <Checkbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={(v) => setAgreed(!!v)}
                    className="mt-0.5 shrink-0"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                    이 소개서의 내용은 사실에 근거하며, Cotton Candy 플랫폼의 이용약관 및 개인정보처리방침에 동의합니다.
                    허위 정보 등록 시 서비스 이용이 제한될 수 있습니다.
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 font-normal"
                    onClick={() => setLocation("/portfolio")}
                  >
                    이전
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 font-normal"
                    onClick={() => setLocation("/portfolio")}
                  >
                    요청하기
                  </Button>
                  <Button
                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-normal"
                    disabled={!agreed}
                    onClick={() => setLocation("/portfolio")}
                  >
                    등록하기
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
