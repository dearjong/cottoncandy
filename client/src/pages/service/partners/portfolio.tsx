import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Home, 
  Mail, 
  FolderOpen, 
  Folder,
  Eye,
  Copy,
  Edit,
  Trash2
} from "lucide-react";

export default function Portfolio() {
  const [selectedMenu, setSelectedMenu] = useState('portfolio');
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* 왼쪽 사이드바 */}
            <aside className="w-64 flex-shrink-0">
              <div className="space-y-1">
                <div className="mb-6">
                  <div className="flex gap-4 mb-4">
                    <button className="flex-1 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:border-gray-300">
                      My의뢰
                    </button>
                    <button className="flex-1 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:border-gray-300">
                      My 참여
                    </button>
                  </div>
                </div>

                <button 
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                    selectedMenu === 'home' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedMenu('home');
                    setLocation('/work/home');
                  }}
                  data-testid="menu-work-home"
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Work 홈
                </button>

                <button 
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                    selectedMenu === 'messages' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMenu('messages')}
                  data-testid="menu-messages"
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  메세시·알림 <span className="text-red-500">2</span>
                </button>

                <button 
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                    selectedMenu === 'projects' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedMenu('projects');
                    setLocation('/work/project/list');
                  }}
                  data-testid="menu-projects"
                >
                  <FolderOpen className="w-4 h-4 inline mr-2" />
                  프로젝트 관리
                </button>

                <button 
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                    selectedMenu === 'portfolio' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedMenu('portfolio');
                    setLocation('/work/company-portfolio');
                  }}
                  data-testid="menu-portfolio"
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  회사소개서 & 포트폴리오
                </button>

                <div className="pl-8 space-y-1">
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/company-info')}
                  >
                    └ 기업 정보
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/manager-info')}
                  >
                    └ 담당자 정보
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/experience')}
                  >
                    └ 경험·특화 분야/광고매체
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/purpose')}
                  >
                    └ 광고 목적별 전문 분야
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/technique')}
                  >
                    └ 제작 기법별 전문분야
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/clients')}
                  >
                    └ 대표 광고주
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/awards')}
                  >
                    └ 대표 수상내역
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/portfolio')}
                  >
                    └ 대표 포트폴리오
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/staff')}
                  >
                    └ 대표 스태프
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/recent-projects')}
                  >
                    └ 최근 참여 프로젝트
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/cotton-candy-activity')}
                  >
                    └ 최근 Cotton Candy 활동
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/file-upload')}
                  >
                    └ 파일 업로드
                  </button>
                  <button
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation('/work/company-portfolio/intro')}
                  >
                    └ 기업 소개글
                  </button>
                </div>

                <button 
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                    selectedMenu === 'files' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMenu('files')}
                  data-testid="menu-files"
                >
                  <Folder className="w-4 h-4 inline mr-2" />
                  파일함
                </button>
              </div>
            </aside>

            {/* 메인 컨텐츠 */}
            <main className="flex-1">
              <h1 className="text-2xl font-bold mb-6">회사소개서 & 포트폴리오</h1>

              {/* 회사 소개 카드 */}
              <div className="border rounded-lg p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">솜사탕애드</h2>
                    <p className="text-gray-600 mb-3">Creative중심 대행사</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="btn-white-compact" data-testid="button-contact">
                      문의하기
                    </Button>
                    <Button className="btn-pink" data-testid="button-request">
                      1:1 의뢰하기
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <p className="text-gray-700">
                    골드백화점, 블루리조트, 달콤커피, 스마트전자 <span className="text-gray-500">[최근6개월]</span> 아름건설, 하늘항공, 뷰티코스메틱, 마이패션
                  </p>
                  <p className="text-gray-600">
                    [최근 3년] 35회 75작품 | 직원 20명 이상 | 최소 제작비 2억 ↑
                  </p>
                </div>

                <div className="mt-4 border-t pt-4">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700">빙그레</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700">초록우산 어린이재단</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700">동원식품</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700">해양수산부</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">전기전자</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">기업PR</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">식품/제과</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">공사/단체/공익/기업PR</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">#공공기관_정책캠페인</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">#뷰티_숏폼</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">#급행제작 대응</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">+ 7 more...</span>
                  </div>

                  <div className="mt-3 text-sm text-gray-600">
                    ✓ Cotton Candy 활동 - 3작품
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  ※ 소개서 카드 - 다른 사용자에게 이렇게 보여집니다. ↑
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  ※ 소개서 상세 내용 예시 ⓘ
                </p>
              </div>

              {/* 소개서 목록 */}
              <div className="space-y-3 mb-6">
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded">공개</span>
                    <span className="text-gray-900 font-medium">기본소개서 (자동생성됨)</span>
                    <span className="text-gray-500 text-sm">2025-05-01</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600" data-testid="button-view-1">
                      <Eye className="w-4 h-4 mr-1" />
                      보기
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600" data-testid="button-copy-1">
                      <Copy className="w-4 h-4 mr-1" />
                      복사하기
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded">공개</span>
                    <span className="text-gray-900 font-medium">Campaign creators 솜사탕애드 입</span>
                    <span className="text-gray-500 text-sm">2025-07-03</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600" data-testid="button-view-2">
                      <Eye className="w-4 h-4 mr-1" />
                      보기
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600" data-testid="button-copy-2">
                      <Copy className="w-4 h-4 mr-1" />
                      복사하기
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600" data-testid="button-edit-2">
                      <Edit className="w-4 h-4 mr-1" />
                      수정하기
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600" data-testid="button-delete-2">
                      <Trash2 className="w-4 h-4 mr-1" />
                      삭제하기
                    </Button>
                  </div>
                </div>
              </div>

              {/* 새 소개서 등록 버튼 */}
              <div className="text-center">
                <Button variant="outline" className="btn-white" data-testid="button-new-portfolio">
                  새 소개서 등록하기 +
                </Button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
