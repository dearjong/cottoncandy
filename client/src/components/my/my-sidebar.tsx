import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function MySidebar() {
  const [location, setLocation] = useLocation();
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

        <button
          onClick={() => setLocation("/my/inquiry")}
          className={`w-full text-left py-2 px-1 font-medium ${isActive("/my/inquiry") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
        >
          1:1문의
        </button>

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
