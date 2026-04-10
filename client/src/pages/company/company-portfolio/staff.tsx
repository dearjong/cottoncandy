import { useLocation } from 'wouter';
import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight } from 'lucide-react';
import { COMMON_MESSAGES } from '@/lib/messages';

export default function Staff() {
  const [, setLocation] = useLocation();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <h1 className="work-title">Step9. 대표 스태프</h1>
              
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <select 
                    className="flex-1 px-4 py-2 border rounded-lg text-base font-medium" 
                    data-testid="select-company"
                  >
                    <option>Campaign creators 솜사탕애드 입니다.</option>
                    <option>크리에이티브 스튜디오 코튼캔디</option>
                    <option>브랜드 컨설팅 그룹</option>
                  </select>
                  <button
                    onClick={() => setIsDetailOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    data-testid="button-company-detail"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">왼쪽 스태프부터 우선노출 됩니다. 마우스로 드래그 하여 중요도 순으로 노출할 수 있어요.</p>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-3 mb-4">
                  <button className="px-3 py-1.5 border rounded text-sm" data-testid="button-filter-all">전체</button>
                  <button className="px-3 py-1.5 border rounded text-sm" data-testid="button-filter-ae">AE</button>
                  <button className="px-3 py-1.5 border rounded text-sm" data-testid="button-filter-industry">산업</button>
                  <button className="px-3 py-1.5 border rounded text-sm" data-testid="button-filter-recent">최근 3개월</button>
                  <button className="px-3 py-1.5 border rounded text-sm" data-testid="button-sort-works">작품수순</button>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border rounded-lg p-4" data-testid={`staff-item-${item}`}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <h3 className="font-medium">김플랜</h3>
                          <p className="text-sm text-gray-600">CW,조감독, LINE PD</p>
                          <p className="text-sm text-gray-600 mt-2">전산업, 전매체</p>
                          <p className="text-sm text-gray-600">(2023) 서울영상광고제</p>
                          <p className="text-xs text-blue-600 cursor-pointer">- 외 9 수상 more...</p>
                        </div>
                        <div className="flex-1">
                          <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3].map((work) => (
                              <div key={work} data-testid={`staff-work-${item}-${work}`}>
                                <div className="aspect-video bg-gray-200 rounded mb-1"></div>
                                <p className="text-xs">[베스트전자] 스타일러 써보셨어요?</p>
                                <p className="text-xs text-gray-500">2025.06.08</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-blue-600 cursor-pointer mt-2">+ 7 more...</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">선택된 스태프</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {['Executive Creative Director 이상상 (0개)', 'Creative Director 최디렉 (0개)', 'Copywriter 이카피 (0개)', 'Art Director 나아트 (0개)'].map((staff) => (
                      <div key={staff} className="border rounded-lg p-3">
                        <div className="aspect-square bg-gray-200 rounded mb-2"></div>
                        <p className="text-xs text-center">{staff}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button variant="outline" className="btn-white" data-testid="button-staff-prev" onClick={() => setLocation('/work/company-portfolio/portfolio')}>
                    이전
                  </Button>
                  <Button className="btn-pink" data-testid="button-staff-next" onClick={() => setLocation('/work/company-portfolio/recent-projects')}>
                    다음
                  </Button>
                </div>

                <p className="project-description mt-4">
                  {COMMON_MESSAGES.TEMP_SAVE_NOTICE}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 회사 상세 팝업 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Campaign creators 솜사탕애드</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="text-sm text-gray-600">
              솜사탕애드는 크리에이티브 캠페인 전문 광고 대행사입니다.
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 pb-3 border-b">
                <div className="text-sm font-medium text-gray-700">기업명</div>
                <div className="col-span-2 text-sm">솜사탕애드</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pb-3 border-b">
                <div className="text-sm font-medium text-gray-700">기업유형</div>
                <div className="col-span-2 text-sm">광고대행사 - 종합광고대행사</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pb-3 border-b">
                <div className="text-sm font-medium text-gray-700">업종</div>
                <div className="col-span-2 text-sm">전기전자</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pb-3 border-b">
                <div className="text-sm font-medium text-gray-700">기업규모</div>
                <div className="col-span-2 text-sm">중견기업</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pb-3 border-b">
                <div className="text-sm font-medium text-gray-700">직원수</div>
                <div className="col-span-2 text-sm">100명 이상</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
