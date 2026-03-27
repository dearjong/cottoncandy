import { Link } from "wouter";
import Layout from "@/components/layout/layout";
import { ChevronRight } from "lucide-react";

export default function GuideIndex() {
  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="page-title text-center mb-12">"이용안내"</h1>

          <div className="flex gap-8">
            {/* 좌측 사이드바 메뉴 */}
            <aside className="w-64 flex-shrink-0">
              <nav className="space-y-2">
                <Link href="/guide/features" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors" data-testid="link-features">
                  Cotton Candy 특장점
                </Link>
                <Link href="/guide/how-to-use" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors" data-testid="link-how-to-use">
                  이용방법
                </Link>
                <Link href="/guide/faq" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors" data-testid="link-faq">
                  자주 묻는 질문
                </Link>
                <Link href="/guide/inquiry" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors" data-testid="link-inquiry">
                  1:1 문의
                </Link>
                <Link href="/guide/notice" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors" data-testid="link-notice">
                  공지사항
                </Link>
                <Link href="/guide/event" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors" data-testid="link-event">
                  이벤트
                </Link>
              </nav>
            </aside>

            {/* 우측 컨텐츠 영역 */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 특장점 */}
                <Link href="/guide/features" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow" data-testid="card-features">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">"영상광고의 시작은 왜 Cotton Candy인가?"</h3>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>

                {/* 이용방법 */}
                <Link href="/guide/how-to-use" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow" data-testid="card-how-to-use">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">이용방법</h3>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 회원가입 및 인증</li>
                    <li>• 프로젝트 등록</li>
                    <li>• 제안서 제출</li>
                    <li>• 계약 및 제작</li>
                    <li>• 정산 및 후기 작성</li>
                  </ul>
                </Link>

                {/* FAQ */}
                <Link href="/guide/faq" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow" data-testid="card-faq">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">자주 묻는 질문 (FAQ)</h3>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 프로젝트 등록이나 참여 신청에 비용이 발생하나요?</li>
                    <li>• 플랫폼 수수료는 얼마인가요?</li>
                    <li>• 우리 회사 정보를 노출하고 싶지 않아요</li>
                    <li>• 계약은 어떻게 진행되나요?</li>
                    <li>• 계약 후 분쟁이 발생하면 어떻게 처리되나요?</li>
                  </ul>
                </Link>

                {/* 1:1 문의 */}
                <Link href="/guide/inquiry" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow" data-testid="card-inquiry">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">1:1 문의 (Q&A)</h3>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">이용에 궁금하신 점이 있으신가요?</p>
                </Link>

                {/* 공지사항 */}
                <Link href="/guide/notice" className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow" data-testid="card-notice">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">공지사항</h3>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Cotton Candy가 드리는 포인트 안내입니다.</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
