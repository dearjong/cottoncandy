import { Link, useLocation } from "wouter";
import Layout from "@/components/layout/layout";

interface GuideLayoutProps {
  children: React.ReactNode;
}

export default function GuideLayout({ children }: GuideLayoutProps) {
  const [location] = useLocation();

  const menuItems = [
    { path: "/guide/features", label: "Cotton Candy 특장점", testId: "link-features" },
    { path: "/guide/how-to-use", label: "이용방법", testId: "link-how-to-use" },
    { path: "/guide/faq", label: "자주 묻는 질문", testId: "link-faq" },
    { path: "/guide/inquiry", label: "1:1 문의", testId: "link-inquiry" },
    { path: "/guide/notice", label: "공지사항", testId: "link-notice" },
    { path: "/guide/event", label: "이벤트", testId: "link-event" },
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex gap-8">
            {/* 좌측 사이드바 메뉴 */}
            <aside className="w-64 flex-shrink-0">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`block px-4 py-2 rounded-md transition-colors ${
                      location === item.path
                        ? 'bg-pink-50 text-pink-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    data-testid={item.testId}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* 우측 컨텐츠 영역 */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
