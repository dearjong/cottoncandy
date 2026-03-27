import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight } from 'lucide-react';
import { COMMON_MESSAGES } from '@/lib/messages';

export default function CompanyInfo() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <h1 className="work-title">Step1. 기업 정보</h1>
              
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

              <p className="text-sm text-gray-600 mb-6">TVCF의 기업정보와 연동되어 업데이트 됩니다.</p>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기업로고</label>
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center" data-testid="logo-upload-area">
                      <span className="text-gray-400">LOGO</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기업명</label>
                    <input type="text" value="예쓰커뮤니케이션" className="w-full px-4 py-2 border rounded-lg" readOnly data-testid="input-company-name" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기업형태</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="companyType" value="corporation" defaultChecked data-testid="radio-company-type-corporation" />
                        <span className="text-sm">법인</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="companyType" value="private" data-testid="radio-company-type-private" />
                        <span className="text-sm">개인사업자</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="companyType" value="freelancer" data-testid="radio-company-type-freelancer" />
                        <span className="text-sm">프리랜서</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기업유형</label>
                    <select className="w-full px-4 py-2 border rounded-lg" data-testid="select-company-category">
                      <option>광고대행사</option>
                    </select>
                  </div>

                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">└ 세부유형</label>
                    <select className="w-full px-4 py-2 border rounded-lg" data-testid="select-company-subcategory">
                      <option>종합광고대행사</option>
                    </select>
                  </div>

                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">└ 산업/품목</label>
                    <select className="w-full px-4 py-2 border rounded-lg" data-testid="select-industry">
                      <option>전기전자</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기업규모</label>
                    <select className="w-full px-4 py-2 border rounded-lg" data-testid="select-company-size">
                      <option>중견기업 (연매출 100억~1,000억 또는 임직원 100명 이상)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">직원수</label>
                    <select className="w-full px-4 py-2 border rounded-lg" data-testid="select-employee-count">
                      <option>100명 이상</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                    <div className="flex gap-2 items-center">
                      <input type="text" placeholder="02" className="w-20 px-4 py-2 border rounded-lg" data-testid="input-phone-1" />
                      <span>-</span>
                      <input type="text" placeholder="ex) 1234" className="flex-1 px-4 py-2 border rounded-lg" data-testid="input-phone-2" />
                      <span>-</span>
                      <input type="text" placeholder="ex) 5678" className="flex-1 px-4 py-2 border rounded-lg" data-testid="input-phone-3" />
                      <label className="flex items-center gap-2">
                        <input type="checkbox" data-testid="checkbox-phone-private" />
                        <span className="text-sm">미공개</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input type="text" placeholder="ex) tvcf.co.kr" className="w-full px-4 py-2 border rounded-lg" data-testid="input-website" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기업인증</label>
                    <Button variant="outline" className="btn-white" data-testid="button-business-verify">
                      사업자 정보·인증
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button variant="outline" className="btn-white" data-testid="button-company-info-back">
                    돌아가기
                  </Button>
                  <Button className="btn-pink" data-testid="button-company-info-next">
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
