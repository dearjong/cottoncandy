import { useState } from "react";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/common/search-bar";

const categories = [
  "광고(캠페인)",
  "뮤직비디오",
  "단편영상",
  "유튜브(숏폼,UCC)",
  "애니메이션",
  "다큐멘터리",
  "공익/공공"
];

const contests = [
  {
    title: "제1회 안전한 대한민국 영상 공모전",
    organizer: "대한산업안전협회",
    period: "2025-04-14 ~ 2025-06-08",
    image: ""
  },
  {
    title: "[KUDAF] 대한민국 대학생 디지털",
    organizer: "(사)한국디지털광고협회",
    period: "2025-06-02 ~ 2025-09-26",
    image: ""
  },
  {
    title: "제12회 청소년 통일문화 경연대회",
    organizer: "통일부 국립통일교육원",
    period: "2025-03-27 ~ 2025-04-23",
    image: ""
  },
  {
    title: "금호 이웃사촌마을 [문화ㆍ예술ㆍ",
    organizer: "스마트크리에이터",
    period: "2025-04-07 ~ 2025-06-24",
    image: ""
  }
];

const faqs = [
  "공모전 등록은 어떻게 시작하나요?",
  "어떤 정보를 등록해야 하나요?",
  "등록한 공모전은 수정할 수 있나요?",
  "당선자 선정은 어떻게 하나요?",
  "상금 수여는 어떻게 진행되나요?"
];

export default function Contest() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              "영상공모전을 등록해보세요!
            </h1>
            <p className="text-2xl text-pink-600 mb-2">
              생기발랄 반짝이는 아이디어가 우르르~! ^0^"
            </p>
            <p className="text-xl text-gray-600">
              당신만의 프로젝트가 빛날 시간!
            </p>
          </div>

          {/* 검색 & 등록 버튼 */}
          <div className="flex gap-4 max-w-4xl mx-auto mb-12 items-center">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              className="flex-[3]"
              testId="input-contest-search"
            />
            <Button 
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full text-sm whitespace-nowrap"
              data-testid="button-register-contest"
            >
              공모전 등록하기~*
            </Button>
          </div>

          {/* 카테고리 탭 */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {categories.map((category, idx) => (
              <button
                key={idx}
                className="px-6 py-2 rounded-full bg-white border border-gray-200 hover:border-pink-600 hover:text-pink-600 transition-colors"
                data-testid={`button-category-${idx}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 진행중인 공모전 */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              "진행중인 공모전"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contests.map((contest, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden cursor-pointer"
                  data-testid={`card-contest-${idx}`}
                >
                  {/* 이미지 영역 */}
                  <div className="aspect-video bg-gradient-to-br from-pink-100 to-blue-100"></div>
                  
                  {/* 내용 */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3rem]">
                      {contest.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {contest.organizer}
                    </p>
                    <p className="text-sm text-pink-600">
                      {contest.period}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 자주 묻는 질문 */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              자주 묻는 질문
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:border-pink-600 transition-colors cursor-pointer"
                  data-testid={`faq-${idx}`}
                >
                  <p className="font-medium">{faq}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
