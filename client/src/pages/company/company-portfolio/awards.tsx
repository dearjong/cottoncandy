import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight } from 'lucide-react';
import { COMMON_MESSAGES } from '@/lib/messages';

export default function Awards() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <h1 className="work-title">Step7. 대표 수상내역</h1>
              
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

              <p className="text-sm text-gray-600 mb-6">중요한 수상 내역이 최상위로 오도록 정렬해주세요.</p>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border rounded-lg p-4" data-testid={`award-item-${item}`}>
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded" data-testid={`award-image-${item}`}></div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">[빙그레] 처음입는 광복</h3>
                          <p className="text-sm text-gray-600 mb-2">2024.08.01</p>
                          <div className="text-sm text-gray-700">
                            <p>* 서울영상 광고제 - 공공서비스 광고(PSA) 금상 2024</p>
                            <p>* 한국PR대상 - 디지털PR 최우수상 2024</p>
                            <p>* 대한민국광고대상 - PR 금상 2024</p>
                            <p className="text-blue-600 cursor-pointer">+ 7 more...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">선택된 수상명</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((item) => (
                      <div key={item} className="border rounded-lg p-3">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gray-200 rounded"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">[빙그레] 처음입는 광복</p>
                            <p className="text-xs text-gray-600">2024.08.01</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 mt-2">* 서울영상 광고제 - 공공서비스 광고(PSA) 금상 2024</p>
                        <p className="text-xs text-blue-600 cursor-pointer">+ 7 more...</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button variant="outline" className="btn-white" data-testid="button-awards-prev">
                    이전
                  </Button>
                  <Button className="btn-pink" data-testid="button-awards-next">
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
