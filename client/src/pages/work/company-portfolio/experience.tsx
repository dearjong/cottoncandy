import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight } from 'lucide-react';
import { COMMON_MESSAGES } from '@/lib/messages';

export default function Experience() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <h1 className="work-title">Step3. 경험·특화 분야/광고매체</h1>
              
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

              <p className="text-sm text-gray-600 mb-6">아이템을 마우스로 위↑아래↓로 드래그하여 중요도에 따라 순서를 변경하실 수 있어요.</p>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">경험분야</label>
                    <div className="flex flex-wrap gap-2" data-testid="experience-fields">
                      {['정보통신', '전기/전자', '자동차/정유', '음료/기호식품', '식품/제과', '생활/가정용품', '화장품', '패션/스포츠', '제약/의료/복지', '금융/보험', '아파트/건설', '출판/교육/문화', '서비스/유통/레저'].map((item) => (
                        <span key={item} className="px-3 py-1 bg-gray-100 rounded text-sm">{item}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">특화분야</label>
                    <p className="text-sm text-gray-500 mb-2">ex) #공공기관_정책캠페인, #뷰티브랜드_숏폼전문, #SNS인플루언서활용</p>
                    <div className="flex gap-2 mb-2" data-testid="special-fields">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm">#공공기관_정책캠페인</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm">#뷰티브랜드_숏폼전문</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm">#SNS인플루언서활용</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">전문매체</label>
                    <div className="flex gap-4">
                      {['TV/극장 광고', '디지털 광고', '옥외광고 (OOH)', '전시/홍보/이벤트'].map((item, index) => (
                        <label key={item} className="flex items-center gap-2">
                          <input type="checkbox" data-testid={`checkbox-media-${index}`} />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button variant="outline" className="btn-white" data-testid="button-experience-prev">
                    이전
                  </Button>
                  <Button className="btn-pink" data-testid="button-experience-next">
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
