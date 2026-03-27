import { useState } from "react";
import GuideLayout from "@/components/guide/guide-layout";
import SearchBar from "@/components/common/search-bar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Notice() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const notices = [
    {
      id: 1,
      title: "광고주 또는 신규 가입자가 광고제작 의뢰 등록 시 TVCF PRO서비스 1년 무료!",
      date: "2025-09-12",
    },
    {
      id: 2,
      title: "광고주 또는 신규 가입자가 광고제작 의뢰 등록 시 TVCF PRO서비스 1년 무료!",
      date: "2025-09-12",
    },
    {
      id: 3,
      title: "광고주 또는 신규 가입자가 광고제작 의뢰 등록 시 TVCF PRO서비스 1년 무료!",
      date: "2025-09-12",
    },
    {
      id: 4,
      title: "광고주 또는 신규 가입자가 광고제작 의뢰 등록 시 TVCF PRO서비스 1년 무료!",
      date: "2025-09-12",
    },
    {
      id: 5,
      title: "광고주 또는 신규 가입자가 광고제작 의뢰 등록 시 TVCF PRO서비스 1년 무료!",
      date: "2025-09-12",
    },
  ];

  return (
    <GuideLayout>
      <div>
        <h1 className="page-title mb-8">"공지사항"</h1>
        
        {/* 첫 번째 공지 - 확장된 형태 */}
        <div className="p-6 border border-gray-200 rounded-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              광고주 또는 신규 가입자가 광고제작 의뢰 등록 시 TVCF PRO서비스 1년 무료!
            </h3>
            <span className="text-sm text-gray-500">2025-09-12</span>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">특별 혜택 안내</h4>
              <p className="text-sm">광고주 및 신규 가입자 전용 프로모션</p>
            </div>

            <p className="font-medium">지금 광고 제작 의뢰를 등록하시면,</p>
            <p className="font-medium">TVCF PRO 서비스 1년 무료 이용권을 드립니다!</p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">혜택 내용</h4>
              <ul className="space-y-2 text-sm">
                <li>• 대상: 광고주 또는 신규 가입 회원</li>
                <li>• 조건: 광고 제작 의뢰 등록 완료 시</li>
                <li>• 혜택: TVCF PRO 서비스 1년 무료 제공</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">PRO 서비스란?</h4>
              <ul className="space-y-2 text-sm">
                <li>• 광고 제작사/대행사 고급 검색 및 필터</li>
                <li>• 프로젝트 관리 고도화 기능</li>
              </ul>
            </div>

            <p className="font-medium">지금 바로 광고 제작 의뢰를 등록하시고,</p>
            <p className="font-medium">프리미엄 기능을 1년간 무료로 경험해 보세요!</p>
          </div>
        </div>

        {/* 나머지 공지사항 목록 */}
        <div className="space-y-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              data-testid={`notice-item-${notice.id}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-gray-900">{notice.title}</h3>
                <span className="text-sm text-gray-500">{notice.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="p-2 hover:bg-gray-100 rounded" data-testid="button-pagination-first">
            <ChevronLeft className="w-4 h-4" />
            <ChevronLeft className="w-4 h-4 -ml-3" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded" data-testid="button-pagination-prev">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${
                page === 1 ? 'bg-pink-600 text-white' : 'hover:bg-gray-100'
              }`}
              data-testid={`button-page-${page}`}
            >
              {page}
            </button>
          ))}
          <button className="p-2 hover:bg-gray-100 rounded" data-testid="button-pagination-next">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded" data-testid="button-pagination-last">
            <ChevronRight className="w-4 h-4" />
            <ChevronRight className="w-4 h-4 -ml-3" />
          </button>
        </div>

        {/* 검색 */}
        <div className="mt-8">
          <div className="max-w-md mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="검색어를 입력하세요"
              testId="input-notice-search"
            />
          </div>
        </div>
      </div>
    </GuideLayout>
  );
}
