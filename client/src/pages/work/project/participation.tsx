import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import CompanyCard from '@/components/work/company-card';

export default function WorkProjectParticipation() {
  const [userMode, setUserMode] = useState<'request' | 'participate'>('request');
  const [filterStatus, setFilterStatus] = useState<'ongoing' | 'all'>('ongoing');
  const [companyStatuses, setCompanyStatuses] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
  });

  useEffect(() => {
    const savedMode = (localStorage.getItem('userMode') as 'request' | 'participate') || 'request';
    setUserMode(savedMode);
  }, []);

  const handleStatusChange = (id: number, checked: boolean) => {
    setCompanyStatuses(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const tabs = [
    { id: 'application', label: '참여신청', count: 2 },
    { id: 'ot', label: 'OT', count: 2 },
    { id: 'pt1', label: 'PT1st', count: 2 },
    { id: 'pt2', label: 'PT2nd', count: 0 },
    { id: 'final', label: '최종선정', count: 1 },
  ];

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="work-title">[참여현황] 참여신청</h1>
              </div>

              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {userMode === 'request' ? 'AI 추천기업 (2) | ♥ 관심기업 (2)' : 'AI 추천프로젝트 (2) | ♥ 관심프로젝트 (2)'}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-b">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded" data-testid="select-project">
                    <option>[베스트전자] TV 신제품 판매촉진 프로모션</option>
                  </select>
                </div>

                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-8">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          className="text-sm font-medium text-gray-800"
                          data-testid={`tab-${tab.id}`}
                        >
                          {tab.label} <span className="text-gray-500">({tab.count})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">[ 참여기업 총: 7 ]</div>
                    <div className="flex gap-4 items-center">
                      <select className="text-sm border border-gray-300 rounded px-3 py-1" data-testid="select-sort">
                        <option>등록순</option>
                      </select>
                      <button
                        onClick={() => setFilterStatus('ongoing')}
                        className={`text-sm px-3 py-1 rounded ${
                          filterStatus === 'ongoing' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                        data-testid="filter-ongoing"
                      >
                        진행중
                      </button>
                      <button
                        onClick={() => setFilterStatus('all')}
                        className={`text-sm px-3 py-1 rounded ${
                          filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                        data-testid="filter-all"
                      >
                        종료/ 취소 포함
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {userMode === 'request' ? (
                    <>
                      <Link href="/work/project/company-profile" className="block">
                        <CompanyCard
                          id={1}
                          logoText="V"
                          companyName="VEGA"
                          companyType="Creative중심 제작사"
                          clients="베스트전자, 대한항공, 자이, 서울특별시 [최근6개월] 알바천국, 기아자동차, LG유플러스, SK텔레콤, 현대자동차"
                          stats="[최근 3년] 35회 75작품 | 직원 20명 이상 | 최소 제작비 2억 ↑"
                          industryTags={['전기전자', '기업PR', '식품/제과', '공사/단체/공익/기업PR']}
                          specialtyTags={['#공공기관_정책캠페인', '#뷰티_숏폼', '#급행제작 대응']}
                          cottonCandyWorks="✓ Cotton Candy 활동 - 3작품"
                          showMessageButton={true}
                          showStatusSwitch={true}
                          statusLabel="초대"
                          statusChecked={companyStatuses[1]}
                          onStatusChange={(checked) => handleStatusChange(1, checked)}
                          variant="participation"
                        />
                      </Link>

                      <Link href="/work/project/company-profile" className="block">
                        <CompanyCard
                          id={2}
                          logoText="솜"
                          companyName="솜사탕애드"
                          companyType="Creative중심 대행사"
                          clients="골드백화점, 블루리조트, 달콤커피, 스마트전자 [최근6개월] 아름건설, 하늘항공, 뷰티코스메틱, 마이패션"
                          stats="[최근 3년] 35회 75작품 | 직원 20명 이상 | 최소 제작비 2억 ↑"
                          industryTags={['전기전자', '기업PR', '식품/제과', '공사/단체/공익/기업PR']}
                          specialtyTags={['#공공기관_정책캠페인', '#뷰티_숏폼', '#급행제작 대응']}
                          cottonCandyWorks="✓ Cotton Candy 활동 - 3작품"
                          showMessageButton={true}
                          showStatusSwitch={true}
                          statusLabel="초대"
                          statusChecked={companyStatuses[2]}
                          onStatusChange={(checked) => handleStatusChange(2, checked)}
                          variant="participation"
                        />
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4 flex-1">
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-2xl font-bold">
                              B
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-mono">PN-20250721-0001</span>
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">접수중</span>
                                <span className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded">참여공고</span>
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">대행사 모집</span>
                                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">경쟁PT</span>
                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded">참여중</span>
                              </div>
                              <h3 className="font-bold text-lg mb-2">[베스트전자] 스탠바이미2 - 판매촉진 프로모션</h3>
                              <p className="text-sm text-gray-600 mb-3">베스트전자 대기업 전기전자</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <span>접수마감 2025.08.19</span>
                                <span>납품기한 2025.12.25</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                전략기획 크리에이티브 기획 영상 제작 미디어 집행 성과 측정 및 리포팅
                              </p>
                              <div className="flex gap-2 mb-3">
                                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">#제품판매촉진</span>
                                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">#브랜드 인지도 향상</span>
                                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">#이벤트/프로모션</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-xs text-gray-600">✓ 급행 제작 대응</span>
                                <span className="text-xs text-gray-600">✓ 경쟁사 수행기업 제외</span>
                                <span className="text-xs text-gray-600">✓ 리젝션 Fee</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600 mb-1">총예산</div>
                              <div className="text-xl font-bold">10~20억원</div>
                              <div className="text-xs text-gray-500 mb-3">(제작비 3억~6억원)</div>
                              <div className="text-sm text-pink-600 font-bold">PT D-35</div>
                            </div>
                          </div>
                          <button className="text-sm text-gray-600 hover:text-pink-600 ml-4" data-testid="button-message-project">
                            메세지
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="px-6 py-4 border-t">
                  <div className="flex justify-center gap-2">
                    <button className="px-3 py-1 text-sm">&lt;&lt;</button>
                    <button className="px-3 py-1 text-sm">&lt;</button>
                    <button className="px-3 py-1 text-sm bg-pink-600 text-white rounded">1</button>
                    <button className="px-3 py-1 text-sm">2</button>
                    <button className="px-3 py-1 text-sm">3</button>
                    <button className="px-3 py-1 text-sm">...</button>
                    <button className="px-3 py-1 text-sm">10</button>
                    <button className="px-3 py-1 text-sm">&gt;</button>
                    <button className="px-3 py-1 text-sm">&gt;&gt;</button>
                  </div>
                </div>

                {userMode === 'request' && (
                  <div className="px-6 py-4 border-t">
                    <div className="flex justify-center gap-4">
                      <button className="btn-white" data-testid="button-send-message">
                        메세지 발송
                      </button>
                      <button className="btn-white" data-testid="button-send-rejection">
                        미선정 메세지 발송
                      </button>
                      <button className="btn-pink" data-testid="button-confirm-invite">
                        초대 확정
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
