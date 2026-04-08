import {
  Bell,
  User,
  Menu,
  MessageCircle,
  Home,
  Mail,
  FolderOpen,
  Heart,
  HelpCircle,
  LogOut,
  FileText,
  Folder,
  UserCircle,
  Building,
  Shield,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import profileImage from "@assets/로그인_1759283590388.png";
import { publishAnalytics } from "@/lib/analytics";

type GnbMenuKey =
  | "create_ad"
  | "agency_search"
  | "project_list"
  | "guide"
  | "contest"
  | "shop";

function trackGnbMenuClick(payload: {
  menu_key: GnbMenuKey;
  href: string;
  /** 보고·필터용 고정 라벨(풀 네임) */
  menu_label: string;
  /** 사용자 화면에 실제로 보였던 텍스트 */
  label_shown: string;
  source: "desktop" | "tablet" | "mobile";
  testid?: string;
}) {
  publishAnalytics("gnb_menu_click", payload);
}

function trackHeaderInteraction(props: {
  target: string;
  item?: string;
  path?: string;
  open?: boolean;
  mode?: string;
}) {
  publishAnalytics("header_interaction", props);
}

/** GNB 단일 정의 — menu_key / 경로 / 풀 라벨 / 태블릿 축약 라벨 / test id */
const GNB_MENU_ITEMS = [
  {
    menu_key: "create_ad",
    href: "/create-project/step1",
    menu_label: "광고제작 의뢰하기",
    label_tablet: "의뢰하기",
    testid: "link-create-ad",
  },
  {
    menu_key: "agency_search",
    href: "/agency-search",
    menu_label: "대행사·제작사 찾기",
    label_tablet: "대행사·제작사",
    testid: "link-agency",
  },
  {
    menu_key: "project_list",
    href: "/project-list",
    menu_label: "프로젝트 공고",
    label_tablet: "프로젝트",
    testid: "link-bidding",
  },
  {
    menu_key: "guide",
    href: "/guide",
    menu_label: "이용안내",
    label_tablet: "이용안내",
    testid: "link-guide",
  },
  {
    menu_key: "contest",
    href: "/contest",
    menu_label: "영상공모전",
    label_tablet: "공모전",
    testid: "link-contest",
  },
  {
    menu_key: "shop",
    href: "#",
    menu_label: "소규모 제작 Shop",
    label_tablet: "소규모 제작",
    testid: "link-shop",
  },
] as const satisfies ReadonlyArray<{
  menu_key: GnbMenuKey;
  href: string;
  menu_label: string;
  label_tablet: string;
  testid: string;
}>;

// 데스크톱 공통 메뉴 스타일
const desktopMenuBaseClass =
  "hover:text-primary transition-colors whitespace-nowrap px-2.5 pt-[3px] pb-[1px] rounded-md";

// 태블릿 공통 메뉴 스타일
const tabletMenuBaseClass =
  "hover:text-primary transition-colors whitespace-nowrap px-2 pt-[3px] pb-[1px] rounded-md";

type MobileMenuProps = {
  mobileMenuOpen: boolean;
  isCreateAdPage: boolean;
  onGnbItemClick: (item: (typeof GNB_MENU_ITEMS)[number]) => void;
};

/* ==============================================
   Mobile Menu Dropdown
   - 데스크톱/태블릿과 동일한 정보 구조를
     모바일 터치 UX에 맞게 세로 목록으로 표현
   ============================================== */
const MobileMenu = ({
  mobileMenuOpen,
  isCreateAdPage,
  onGnbItemClick,
}: MobileMenuProps) => {
  // 2) 메뉴가 닫혀 있을 때는 렌더링 자체를 생략해 DOM 가벼움 유지
  if (!mobileMenuOpen) return null;

  return (
    // 3) 모바일 전용 wrapper: 상단 헤더와 시각적으로 분리되는 보더/패딩
    <nav className="md:hidden border-t border-gray-100 py-4">
      <ul
        className={clsx(
          // 4) 레이아웃 + 타이포: 세로 목록, 여백, 의미 기반 색상(text-neutral)
          "flex flex-col space-y-1.5 px-2",
          "text-[15px] text-neutral",
        )}
      >
        {GNB_MENU_ITEMS.map((item) => {
          const isActive =
            item.href === "/create-project/step1" && isCreateAdPage;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => onGnbItemClick(item)}
                className={clsx(
                  // 5) 링크 스타일: 공통 padding/rounding + primary 컬러로 hover/active 강조
                  "block px-2.5 py-2 rounded-md transition-colors hover:text-primary",
                  isActive && "text-primary bg-gray-100",
                )}
              >
                {item.menu_label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMode, setUserMode] = useState<'request' | 'participate'>('request');
  const [location, setLocation] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');

  // 광고 제작 의뢰 플로우 내에 있는지 여부 (GNB 활성화 판단용)
  const isCreateAdPage = location.includes('/create-project/');

  // 로그인 상태 초기화 (간단한 fake auth)
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const name = localStorage.getItem('userName') || '';
    const type = localStorage.getItem('userType') || '';
    const mode = (localStorage.getItem('userMode') as 'request' | 'participate') || 'request';
    setIsLoggedIn(loggedIn);
    setUserName(name);
    setUserType(type);
    setUserMode(mode);
  }, [location]);

  // 로그아웃 처리
  const handleLogout = () => {
    trackHeaderInteraction({ target: "dropdown_item", item: "Log Out" });
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setUserName('');
    setUserType('');
    setLocation('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[70px]">
          <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-8">
            {/* Mobile Menu Button - 모바일에서 로고 옆에 배치 */}
            <button 
              className="md:hidden text-gray-600 hover:text-primary"
              onClick={() =>
                setMobileMenuOpen((prev) => {
                  const next = !prev;
                  trackHeaderInteraction({ target: "mobile_menu", open: next });
                  return next;
                })
              }
              data-testid="button-mobile-menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <a
              href="/"
              onClick={() => trackHeaderInteraction({ target: "logo" })}
              className="text-lg sm:text-xl font-bold whitespace-nowrap"
              data-testid="link-logo"
            >
              <span className="cotton-pastel-cobalt">Cotton</span>
              <span className="cotton-candy-pink"> Candy</span>
            </a>
            
            {/* ==============================================
               Desktop Menu - 1024px 이상
               - 모바일 메뉴와 동일한 메뉴 구조 유지
               - hover/active 상태 의미 기반 색상 적용
               ============================================== */}
            <div className="hidden lg:flex space-x-3 xl:space-x-4 text-[15px] text-neutral">
              {GNB_MENU_ITEMS.map((item) => {
                const isActive =
                  item.href === "/create-project/step1" && isCreateAdPage;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    data-testid={item.testid}
                    onClick={() =>
                      trackGnbMenuClick({
                        menu_key: item.menu_key,
                        href: item.href,
                        menu_label: item.menu_label,
                        label_shown: item.menu_label,
                        source: "desktop",
                        testid: item.testid,
                      })
                    }
                    className={clsx(
                      desktopMenuBaseClass,                // 공통 스타일: padding, rounding, transition
                      isActive && "text-primary bg-gray-100", // 활성 메뉴 강조
                    )}
                  >
                    {item.menu_label}
                  </a>
                );
              })}
            </div>

            {/* ==============================================
               Tablet Menu - 768px ~ 1023px
               - 데스크톱/모바일과 동일한 정보 구조
               - 좁은 가로폭에 맞게 라벨만 축약
               ============================================== */}
            <div className="hidden md:flex lg:hidden space-x-2.5 text-[15px] text-neutral">
              {GNB_MENU_ITEMS.map((item) => {
                const isActive =
                  item.href === "/create-project/step1" && isCreateAdPage;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() =>
                      trackGnbMenuClick({
                        menu_key: item.menu_key,
                        href: item.href,
                        menu_label: item.menu_label,
                        label_shown: item.label_tablet,
                        source: "tablet",
                      })
                    }
                    className={clsx(
                      tabletMenuBaseClass,
                      isActive && "text-primary bg-gray-100",
                    )}
                  >
                    {item.label_tablet}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {isLoggedIn ? (
              <>
                {/* 메시지 (MessageCircle) Icon with Hover Card */}
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <div
                      className="relative flex-shrink-0 cursor-pointer"
                      data-testid="icon-message"
                      onClick={() =>
                        trackHeaderInteraction({ target: "message_icon" })
                      }
                    >
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">1</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80" align="end">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="text-sm font-semibold">메시지</h4>
                        <span className="text-xs text-gray-500">1개의 새 메시지</span>
                      </div>
                      <div className="space-y-2">
                        <div
                          className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() =>
                            trackHeaderInteraction({
                              target: "message_preview_row",
                            })
                          }
                        >
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">김철수 님</p>
                              <span className="text-xs text-gray-400">1시간 전</span>
                            </div>
                            <p className="text-xs text-gray-600 truncate mt-0.5">프로젝트 관련 문의드립니다...</p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="w-full text-center text-xs text-gray-500 hover:text-gray-700 pt-2 border-t"
                        onClick={() =>
                          trackHeaderInteraction({
                            target: "see_all_messages",
                          })
                        }
                      >
                        모든 메시지 보기
                      </button>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {/* 알림 (Bell) Icon with Hover Card */}
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <div
                      className="relative flex-shrink-0 cursor-pointer"
                      data-testid="icon-notification"
                      onClick={() =>
                        trackHeaderInteraction({ target: "notification_icon" })
                      }
                    >
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">1</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80" align="end">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="text-sm font-semibold">알림</h4>
                        <span className="text-xs text-gray-500">1개의 새 알림</span>
                      </div>
                      <div className="space-y-2">
                        <div
                          className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() =>
                            trackHeaderInteraction({
                              target: "notification_preview_row",
                            })
                          }
                        >
                          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5 text-pink-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">새로운 입찰 제안</p>
                              <span className="text-xs text-gray-400">30분 전</span>
                            </div>
                            <p className="text-xs text-gray-600 truncate mt-0.5">프로젝트에 새로운 입찰이 등록되었습니다.</p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="w-full text-center text-xs text-gray-500 hover:text-gray-700 pt-2 border-t"
                        onClick={() =>
                          trackHeaderInteraction({
                            target: "see_all_notifications",
                          })
                        }
                      >
                        모든 알림 보기
                      </button>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {/* User Profile - 반응형 */}
                <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors flex-shrink-0"
                  data-testid="button-user"
                  onClick={() =>
                    trackHeaderInteraction({ target: "user_menu_trigger" })
                  }
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  <div className="hidden lg:flex flex-col leading-tight text-center min-w-0">
                    <span className="font-medium text-xs whitespace-nowrap">{userName}님</span>
                    <span className="text-gray-400 font-light text-[11px] whitespace-nowrap">({userType})</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-0">
                {/* Profile Header */}
                <div className="px-6 py-4 pb-3 border-b border-gray-200">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                      <img 
                        src={profileImage} 
                        alt="프로필" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="font-medium text-sm">{userName}</p>
                    <p className="text-xs text-gray-500">({userType})</p>
                  </div>
                  
                  {/* 개인/기업 Toggle Switch */}
                  <div className="relative bg-gray-200 rounded-full p-[0.5px] mt-3">
                    <div className="flex relative">
                      <button
                        type="button"
                        onClick={() => {
                          trackHeaderInteraction({
                            target: "profile_mode",
                            mode: "request",
                          });
                          setUserMode('request');
                          localStorage.setItem('userMode', 'request');
                          window.location.reload();
                        }}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition-all z-10 ${
                          userMode === 'request'
                            ? 'text-white'
                            : 'text-gray-600'
                        }`}
                      >
                        개인
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          trackHeaderInteraction({
                            target: "profile_mode",
                            mode: "participate",
                          });
                          setUserMode('participate');
                          localStorage.setItem('userMode', 'participate');
                          window.location.reload();
                        }}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition-all z-10 ${
                          userMode === 'participate'
                            ? 'text-white'
                            : 'text-gray-600'
                        }`}
                      >
                        기업
                      </button>
                      {/* Sliding background */}
                      <div
                        className={`absolute top-[0.5px] bottom-[0.5px] w-[calc(50%-0.5px)] bg-gray-800 rounded-full transition-transform duration-200 ${
                          userMode === 'participate' ? 'translate-x-[calc(100%+0.5px)]' : 'translate-x-[0.5px]'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Work 홈 Section */}
                <div className="py-1">
                  <DropdownMenuItem
                    className="px-6 py-2 cursor-pointer"
                    onClick={() => {
                      trackHeaderInteraction({
                        target: "dropdown_item",
                        item: "Work 홈",
                        path: "/work/home",
                      });
                      setLocation("/work/home");
                    }}
                  >
                    <span className="whitespace-nowrap">Work 홈</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-6 py-2 cursor-pointer"
                    onClick={() => {
                      trackHeaderInteraction({
                        target: "dropdown_item",
                        item: "메세지·알림",
                        path: "/work/message/received",
                      });
                      setLocation("/work/message/received");
                    }}
                  >
                    <span className="whitespace-nowrap">메세지·알림</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-6 py-2 cursor-pointer"
                    onClick={() => {
                      trackHeaderInteraction({
                        target: "dropdown_item",
                        item: "프로젝트 관리",
                        path: "/work/home",
                      });
                      setLocation("/work/home");
                    }}
                  >
                    <span className="whitespace-nowrap">프로젝트 관리</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-6 py-2 cursor-pointer"
                    onClick={() => {
                      trackHeaderInteraction({
                        target: "dropdown_item",
                        item: "회사소개서 & 포트폴리오",
                        path: "/portfolio",
                      });
                      setLocation("/portfolio");
                    }}
                  >
                    <span className="whitespace-nowrap">회사소개서 & 포트폴리오</span>
                  </DropdownMenuItem>
                  {userMode === 'participate' && (
                    <>
                      <div className="my-1 border-t border-gray-100"></div>
                      <DropdownMenuItem
                        className="px-6 py-2 cursor-pointer"
                        onClick={() =>
                          trackHeaderInteraction({
                            target: "dropdown_item",
                            item: "기업 정보",
                          })
                        }
                      >
                        <span className="whitespace-nowrap">기업 정보</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="px-6 py-2 cursor-pointer"
                        onClick={() =>
                          trackHeaderInteraction({
                            target: "dropdown_item",
                            item: "사업자 정보·인증",
                          })
                        }
                      >
                        <span className="whitespace-nowrap">사업자 정보·인증</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="px-6 py-2 cursor-pointer"
                        onClick={() => {
                          trackHeaderInteraction({
                            target: "dropdown_item",
                            item: "구성원 관리",
                            path: "/mypage/members",
                          });
                          setLocation("/mypage/members");
                        }}
                      >
                        <span className="whitespace-nowrap">구성원 관리</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem
                    className="px-6 py-2 cursor-pointer"
                    onClick={() =>
                      trackHeaderInteraction({
                        target: "dropdown_item",
                        item: "파일함",
                      })
                    }
                  >
                    <span className="whitespace-nowrap">파일함</span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />

                {/* 내정보 Section */}
                <div className="py-1">
                  <DropdownMenuItem
                    className="px-6 py-2 cursor-pointer"
                    onClick={() => {
                      trackHeaderInteraction({
                        target: "dropdown_item",
                        item: "내정보",
                        path: "/my/profile",
                      });
                      setLocation("/my/profile");
                    }}
                  >
                    <span className="whitespace-nowrap">내정보</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-6 py-2 cursor-pointer"
                    onClick={() =>
                      trackHeaderInteraction({
                        target: "dropdown_item",
                        item: "즐겨찾기",
                      })
                    }
                  >
                    <Heart className="w-4 h-4" />
                    <span className="whitespace-nowrap">즐겨찾기</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-6 py-2 cursor-pointer"
                    onClick={() => {
                      trackHeaderInteraction({
                        target: "dropdown_item",
                        item: "1:1 문의",
                        path: "/guide/inquiry",
                      });
                      setLocation("/guide/inquiry");
                    }}
                  >
                    <span className="whitespace-nowrap">1:1 문의</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-6 py-2 cursor-pointer"
                    onClick={() => {
                      trackHeaderInteraction({
                        target: "dropdown_item",
                        item: "운영자 화면",
                        path: "/admin",
                      });
                      setLocation("/admin");
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="whitespace-nowrap">운영자 화면</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="px-6 py-2 cursor-pointer">
                    <span className="whitespace-nowrap">Log Out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    trackHeaderInteraction({ target: "signup" });
                    setLocation("/signup");
                  }}
                  className="btn-dark w-auto px-5"
                  data-testid="button-signup-header"
                >
                  무료로 시작하기
                </Button>
                <button
                  onClick={() => {
                    trackHeaderInteraction({ target: "login" });
                    setLocation("/login");
                  }}
                  className="w-11 h-11 aspect-square shrink-0 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  data-testid="button-login-icon"
                  title="로그인"
                >
                  <User className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          isCreateAdPage={isCreateAdPage}
          onGnbItemClick={(item) =>
            trackGnbMenuClick({
              menu_key: item.menu_key,
              href: item.href,
              menu_label: item.menu_label,
              label_shown: item.menu_label,
              source: "mobile",
            })
          }
        />
      </div>
    </nav>
  );
}
