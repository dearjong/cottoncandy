import { useLocation } from 'wouter';
import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight } from 'lucide-react';
import { COMMON_MESSAGES } from '@/lib/messages';

export default function CottonCandyActivity() {
  const [, setLocation] = useLocation();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <h1 className="work-title">Step11. 최근 Cotton Candy 활동</h1>
              
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

              <p className="text-sm text-gray-600 mb-6">3년 이내의 작품이 노출됩니다.</p>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm">OnAir 일자</span>
                  <select className="px-3 py-1.5 border rounded text-sm" data-testid="select-cotton-candy-onair-date">
                    <option>2025년 3월</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 border rounded-lg">
                      <span className="text-sm">2025-06-06</span>
                      <div className="flex-1">
                        <p className="text-sm">삼성 갤럭시 S25 - 갤럭시 Z 플립5 – "플립 더 월드" 캠페인</p>
                      </div>
                      <span className="text-sm text-gray-600">공개</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">선택된 작품</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium">삼성 갤럭시 S25 - 갤럭시 Z 플립5 – "플립 더 월드" 캠페인</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium">아디다스 러닝 캠페인 - "러닝의 미래" 캠페인</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button variant="outline" className="btn-white" data-testid="button-cotton-candy-prev" onClick={() => setLocation('/work/company-portfolio/recent-projects')}>
                    이전
                  </Button>
                  <Button className="btn-pink" data-testid="button-cotton-candy-next" onClick={() => setLocation('/work/company-portfolio/file-upload')}>
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
