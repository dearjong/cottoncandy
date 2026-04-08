import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function MySidebar() {
  const [location, setLocation] = useLocation();
  const [inquiryOpen, setInquiryOpen] = useState(location.startsWith("/my/inquiry"));
  const [favoriteOpen, setFavoriteOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <div className="w-48 shrink-0 pr-6">
      <nav className="space-y-1 text-sm">
        <button
          onClick={() => setLocation("/my/profile")}
          className={`w-full text-left py-2 px-1 font-medium ${isActive("/my/profile") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
        >
          내정보
        </button>

        <div>
          <button
            onClick={() => setFavoriteOpen(!favoriteOpen)}
            className="w-full flex items-center justify-between py-2 px-1 text-gray-600 hover:text-gray-900"
          >
            <span>♡ 즐겨찾기</span>
            {favoriteOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div>
          <button
            onClick={() => setInquiryOpen(!inquiryOpen)}
            className="w-full flex items-center justify-between py-2 px-1 text-gray-600 hover:text-gray-900"
          >
            <span>1:1문의</span>
            {inquiryOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {inquiryOpen && (
            <div className="pl-3 space-y-1">
              <button
                onClick={() => setLocation("/my/inquiry")}
                className={`w-full text-left py-1.5 px-2 text-xs rounded ${isActive("/my/inquiry") ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900"}`}
              >
                └ 문의하기
              </button>
              <span className="w-full text-left py-1.5 px-2 text-xs rounded text-gray-400 block cursor-default">
                └ 문의리스트
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setLocation("/my/notification-settings")}
          className={`w-full text-left py-2 px-1 font-medium ${isActive("/my/notification-settings") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
        >
          알림설정
        </button>
      </nav>
    </div>
  );
}
