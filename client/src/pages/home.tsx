import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { getSubtitle } from "@/config/global-events";
import SearchBar from "@/components/common/search-bar";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // 전체 사이트 서브타이틀 사용 (홈페이지는 특정 메뉴에 속하지 않음)
  const eventInfo = getSubtitle();

  const categories = [
    { name: "정보통신", icon: "💻" },
    { name: "전기/전자", icon: "🔌" },
    { name: "자동차/정유", icon: "🚗" },
    { name: "음료/기호식품", icon: "🥤" },
    { name: "식품/제과", icon: "🍰" },
    { name: "생활/가정용품", icon: "🏠" },
    { name: "화장품", icon: "💄" },
    { name: "패션/스포츠", icon: "👕" },
    { name: "제약/의료/복지", icon: "💊" }
  ];

  const projects = [
    {
      title: "제1회 안전한 대한민국 영상 공",
      company: "대한산업안전협회",
      dDay: "D-120",
      period: "2025-04-14 ~ 2025-06-08",
      status: "접수예정"
    },
    {
      title: "[KUDAF] 대한민국 대학생 디",
      company: "(사)한국디지털광고협회",
      dDay: "D-50",
      period: "2025-06-02 ~ 2025-09-26",
      status: "접수중"
    },
    {
      title: "제12회 청소년 통일문화 경연",
      company: "통일부 국립통일교육원",
      dDay: "D-30",
      period: "2025-03-27 ~ 2025-04-23",
      status: "접수중"
    }
  ];

  const features = [
    {
      title: "국내최초 광고 전문 플랫폼!",
      description: "광고 제작 프로세스부터 비딩, PT, KPI 관리까지 광고 업계 표준에 맞춘 특화 시스템을 제공합니다."
    },
    {
      title: "검증된 파트너",
      description: "국내 최대 광고 플랫폼 TVCF에서 다수의 포트폴리오가 등록된 실적과 평판이 검증된 대행사와 제작사만이 참여합니다."
    },
    {
      title: "이 모든것이 무료!",
      description: "국내 최대 광고 플랫폼 TVCF에서 다수의 포트폴리오가 등록된 실적과 평판이 검증된 대행사와 제작사만이 참여합니다."
    }
  ];

  const partners = [
    "제일기획 - CHE", "이노션월드와이", "HS Ad", "대홍기획", "TBWA코리아",
    "SM C&C", "대학내일", "빅밴드앤코", "그랑몬스터", "금강오길비",
    "레오버넷", "맥켄에릭슨-mc", "웰콤", "오리콤", "차이커뮤니케이",
    "BBDO코리아", "하쿠호도제일", "메이트인디펜던", "디블렌트", "타이타늄22"
  ];

  const faqs = [
    { question: "프로젝트 등록은 어떻게 시작하나요?", answer: "" },
    { 
      question: "기업 등급이 뭔가요?",
      answer: `
        Gold: TVCF.co.kr 포트폴리오 100건 이상, 리뷰 평균 4.7점 이상
        Silver: TVCF.co.kr 포트폴리오 50건 이상, 리뷰 평균 4.5점 이상
        Bronze: TVCF.co.kr 포트폴리오 30건 이상, 리뷰 평균 4.0점 이상
        신규: 활동 이력 없음
      `
    },
    { question: "등록한 프로젝트는 수정할 수 있나요?", answer: "" },
    { question: "직접 제작사를 선택할 수 있나요?", answer: "" },
    { question: "계약은 어떻게 진행되나요?", answer: "" }
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(1);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" data-testid="hero-title">
            "프로가 만드는 광고,<br className="sm:hidden" />
            <br className="hidden sm:block" /> 프로가 선택한 전문기업"
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6" data-testid="hero-subtitle">
            광고주는 선택만, 제작은 전문가가, 이 모든것이 무료!
          </p>
          <div className="p-4 mb-8 max-w-3xl mx-auto">
            <p className="text-sm text-gray-700" data-testid="promotion-text">
              {eventInfo.subtitle} 
              <a href={eventInfo.link} className="text-pink-600 underline ml-1">{eventInfo.linkText}</a>
            </p>
          </div>
          <Button className="btn-pink mb-8 max-w-md mx-auto" data-testid="button-recommend">
            내 마음에 쏙드는 전문기업 추천받기 Go~*
          </Button>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            className="max-w-2xl mx-auto"
          />

          {/* Categories */}
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4 mt-12">
            {categories.map((category, index) => (
              <button
                key={index}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white hover:shadow-md transition-all"
                data-testid={`category-${index}`}
              >
                <div className="text-3xl">{category.icon}</div>
                <span className="text-xs sm:text-sm text-gray-700">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" data-testid="projects-title">
            "프로젝트공고 · 입찰·공모전"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow" data-testid={`project-${index}`}>
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{project.company}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-pink-600">{project.dDay}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === '접수예정' ? 'bg-gray-100 text-gray-600' : 'bg-pink-100 text-pink-600'
                  }`}>{project.status}</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">{project.period}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" data-testid="features-title">
            "영상광고의 시작은 왜 CottonCandy 인가"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm" data-testid={`feature-${index}`}>
                <h3 className="text-xl font-bold mb-4 text-pink-600">+ {feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" data-testid="partners-title">
            Partners (대행사)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                data-testid={`partner-${index}`}
              >
                <span className="text-sm text-gray-700">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Flow */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" data-testid="flow-title">
            프로젝트 Flow
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {["광고제작 의뢰", "참여신청 접수/제안", "OT/PT/계약", "영상 제작", "온 에어", "AS 및 정산"].map((step, index) => (
              <div key={index} className="flex items-center" data-testid={`flow-${index}`}>
                <div className="bg-white border border-gray-200 rounded-lg px-6 py-3">
                  <span className="font-medium">{step}</span>
                </div>
                {index < 5 && <span className="mx-2 text-gray-400">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8" data-testid="pricing-title">
            이용 요금
          </h2>
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-8">
            <p className="text-lg font-medium mb-2">모든 과정 무료!</p>
            <p className="text-gray-600">(프로젝트 등록/ 대행사·제작사추천/ 프로젝트 관리 서비스)</p>
            <p className="text-sm text-gray-500 mt-4">프리미엄 서비스 (전담 전문가 배정 요청 시 20만원 부터~)</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" data-testid="faq-title">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden" data-testid={`faq-${index}`}>
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-left">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaqIndex === index && faq.answer && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">{faq.answer}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
}
