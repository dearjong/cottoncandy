import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight } from 'lucide-react';
import { COMMON_MESSAGES } from '@/lib/messages';

export default function ManagerInfo() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <h1 className="work-title">Step 2. 담당자 정보</h1>
              
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

              <p className="text-sm text-gray-600 mb-6">기존 TVCF에 등록된 정보 기준으로 노출됩니다. 수정하실 경우 TVCF와 연동되어 업데이트 됩니다.</p>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">담당자명</label>
                    <input type="text" placeholder="ex) 이애드" className="w-full px-4 py-2 border rounded-lg" data-testid="input-manager-name" />
                  </div>

                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">└ 부서</label>
                    <input type="text" placeholder="ex) 전략기획팀" className="w-full px-4 py-2 border rounded-lg" data-testid="input-department" />
                  </div>

                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">└ 직책</label>
                    <input type="text" placeholder="ex) 선임연구원" className="w-full px-4 py-2 border rounded-lg" data-testid="input-position" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                    <div className="flex gap-2 items-center">
                      <input type="text" placeholder="02" className="w-20 px-4 py-2 border rounded-lg" data-testid="input-contact-1" />
                      <span>-</span>
                      <input type="text" placeholder="ex) 1234" className="flex-1 px-4 py-2 border rounded-lg" data-testid="input-contact-2" />
                      <span>-</span>
                      <input type="text" placeholder="ex) 1234" className="flex-1 px-4 py-2 border rounded-lg" data-testid="input-contact-3" />
                      <label className="flex items-center gap-2">
                        <input type="checkbox" data-testid="checkbox-contact-private" />
                        <span className="text-sm">미공개</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">휴대폰</label>
                    <div className="flex gap-2 items-center">
                      <input type="text" placeholder="010" className="w-20 px-4 py-2 border rounded-lg" data-testid="input-mobile-1" />
                      <span>-</span>
                      <input type="text" placeholder="ex) 1234" className="flex-1 px-4 py-2 border rounded-lg" data-testid="input-mobile-2" />
                      <span>-</span>
                      <input type="text" placeholder="ex) 1234" className="flex-1 px-4 py-2 border rounded-lg" data-testid="input-mobile-3" />
                      <label className="flex items-center gap-2">
                        <input type="checkbox" data-testid="checkbox-mobile-private" />
                        <span className="text-sm">미공개</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                    <input type="email" placeholder="ex) adcream@tvcf.co.kr" className="w-full px-4 py-2 border rounded-lg" data-testid="input-email" />
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button variant="outline" className="btn-white" data-testid="button-manager-info-prev">
                    이전
                  </Button>
                  <Button className="btn-pink" data-testid="button-manager-info-next">
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
