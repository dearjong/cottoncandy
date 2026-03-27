import GuideLayout from "@/components/guide/guide-layout";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Event() {
  const events = [
    {
      id: 2,
      title: "지난 이벤트 1",
      date: "2025-09-12",
    },
    {
      id: 3,
      title: "지난 이벤트 2",
      date: "2025-09-12",
    },
    {
      id: 4,
      title: "지난 이벤트 3",
      date: "2025-09-12",
    },
    {
      id: 5,
      title: "지난 이벤트 4",
      date: "2025-09-12",
    },
  ];

  return (
    <GuideLayout>
      <div>
        <h1 className="page-title mb-8">"이벤트"</h1>
        
        {/* 진행중인 이벤트 */}
        <div className="p-6 bg-gradient-to-r from-pink-50 to-blue-50 border border-pink-200 rounded-lg mb-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              광고주 프로젝트 등록시 혜택
            </h3>
            <span className="px-3 py-1 bg-pink-600 text-white text-xs font-medium rounded-full">
              진행중
            </span>
          </div>
          <p className="text-gray-700 mb-2">
            업체 계약 완료까지 된 경우, 1억이상 계약 한 경우로 한정
          </p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">2025-09-12</span>
          </div>
        </div>

        {/* 지난 이벤트 목록 */}
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              data-testid={`event-item-${event.id}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-gray-900">{event.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{event.date}</span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">종료</span>
                </div>
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
      </div>
    </GuideLayout>
  );
}
