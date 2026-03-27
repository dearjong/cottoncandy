// 서브타이틀 시스템 - 3단계 우선순위
// 1순위: 페이지 전용 서브타이틀 (각 페이지에서 직접 설정)
// 2순위: 메뉴별 서브타이틀 (아래에서 설정)
// 3순위: 전체 사이트 서브타이틀 (기본값)

// 전체 사이트 이벤트 서브타이틀 (모든 페이지 기본값)
export const GLOBAL_EVENT_SUBTITLE = "광고주 또는 신규 가입자가 광고제작 의뢰 등록 시 TVCF PRO서비스 1년 무료!";
export const GLOBAL_EVENT_LINK = "#";
export const GLOBAL_EVENT_LINK_TEXT = "자세히>";

// 메뉴별 이벤트 서브타이틀
export const MENU_EVENTS = {
  // 광고제작 의뢰하기 메뉴
  request: {
    subtitle: "광고주 또는 신규 가입자가 광고제작 의뢰 등록 시 TVCF PRO서비스 1년 무료!",
    link: "#",
    linkText: "자세히>"
  },
  // 대행사·제작사 찾기 메뉴
  search: {
    subtitle: "검증된 대행사와 제작사를 한눈에! TVCF 파트너 네트워크를 만나보세요.",
    link: "#",
    linkText: "자세히>"
  },
  // 프로젝트 공고 메뉴
  projects: {
    subtitle: "최신 프로젝트 공고를 확인하고 참여 신청하세요!",
    link: "#",
    linkText: "자세히>"
  },
  // 이용안내 메뉴
  guide: {
    subtitle: "Cotton Candy 이용방법을 쉽고 빠르게 알려드립니다.",
    link: "#",
    linkText: "자세히>"
  }
};

// 서브타이틀 가져오기 헬퍼 함수
// pageSubtitle: 페이지 전용 서브타이틀 (우선순위 1)
// menuKey: 메뉴 키 ('request' | 'search' | 'projects' | 'guide') (우선순위 2)
// 둘 다 없으면 전체 사이트 서브타이틀 사용 (우선순위 3)
export function getSubtitle(pageSubtitle?: string, menuKey?: keyof typeof MENU_EVENTS) {
  if (pageSubtitle) {
    return { subtitle: pageSubtitle, link: GLOBAL_EVENT_LINK, linkText: GLOBAL_EVENT_LINK_TEXT };
  }
  if (menuKey && MENU_EVENTS[menuKey]) {
    return MENU_EVENTS[menuKey];
  }
  return { subtitle: GLOBAL_EVENT_SUBTITLE, link: GLOBAL_EVENT_LINK, linkText: GLOBAL_EVENT_LINK_TEXT };
}
