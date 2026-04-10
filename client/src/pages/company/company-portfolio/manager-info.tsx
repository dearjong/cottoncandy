import { useState } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import { COMMON_MESSAGES } from '@/lib/messages';

export default function ManagerInfo() {
  const [, setLocation] = useLocation();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(true);

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* 전체 너비 타이틀 */}
        <div className="text-center py-8 border-b border-gray-100">
          <h1 className="text-2xl font-bold mb-2">Step 1. 담당자 정보</h1>
          <p className="text-sm text-gray-500">
            기존 TVCF에 등록된 정보 기준으로 노출됩니다. 수정하실 경우 TVCF와 연동되어 업데이트 됩니다.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-8">
            <WorkSidebar />

            <div className="flex-1 min-w-0">
              {/* 소개서 선택 헤더 */}
              <div className="flex items-center justify-between mb-5 border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1 text-pink-600 font-medium text-sm"
                    onClick={() => setSectionOpen(!sectionOpen)}
                  >
                    {sectionOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    Campaign creators 솜사탕애드 입니다.
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                  <button
                    onClick={() => setIsDetailOpen(true)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    data-testid="button-company-detail"
                  >
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* 폼 */}
              {sectionOpen && (
                <div className="space-y-5">
                  {/* 담당자명 */}
                  <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                    <label className="text-sm font-medium text-gray-700 pt-2.5">
                      <span className="text-pink-600 mr-0.5">*</span>담당자명
                    </label>
                    <input
                      type="text"
                      placeholder="ex) 이애드"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                      data-testid="input-manager-name"
                    />
                  </div>

                  {/* 부서 */}
                  <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                    <label className="text-sm text-gray-500 pt-2.5 pl-3">└ 부서</label>
                    <input
                      type="text"
                      placeholder="ex) 전략기획팀"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                      data-testid="input-department"
                    />
                  </div>

                  {/* 직책 */}
                  <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                    <label className="text-sm text-gray-500 pt-2.5 pl-3">└ 직책</label>
                    <input
                      type="text"
                      placeholder="ex) 선임연구원"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                      data-testid="input-position"
                    />
                  </div>

                  {/* 연락처 */}
                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                      <span className="text-pink-600 mr-0.5">*</span>연락처
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 rounded-lg px-2 py-2.5 gap-1 w-20">
                        <span className="text-sm text-gray-700">02</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <span className="text-gray-400">-</span>
                      <input
                        type="text"
                        placeholder="ex) 1234"
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                        data-testid="input-contact-2"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="text"
                        placeholder="ex) 1234"
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                        data-testid="input-contact-3"
                      />
                      <label className="flex items-center gap-1.5 text-sm text-gray-500 shrink-0 ml-1">
                        <input type="checkbox" className="w-3.5 h-3.5" data-testid="checkbox-contact-private" />
                        미공개
                      </label>
                    </div>
                  </div>

                  {/* 휴대폰 */}
                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">휴대폰</label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 rounded-lg px-2 py-2.5 gap-1 w-20">
                        <span className="text-sm text-gray-700">010</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <span className="text-gray-400">-</span>
                      <input
                        type="text"
                        placeholder="ex) 1234"
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                        data-testid="input-mobile-2"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="text"
                        placeholder="ex) 1234"
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                        data-testid="input-mobile-3"
                      />
                      <label className="flex items-center gap-1.5 text-sm text-gray-500 shrink-0 ml-1">
                        <input type="checkbox" className="w-3.5 h-3.5" data-testid="checkbox-mobile-private" />
                        미공개
                      </label>
                    </div>
                  </div>

                  {/* 이메일 */}
                  <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                    <label className="text-sm font-medium text-gray-700 pt-2.5">
                      <span className="text-pink-600 mr-0.5">*</span>이메일
                    </label>
                    <input
                      type="email"
                      placeholder="ex) adcream@tvcf.co.kr"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                      data-testid="input-email"
                    />
                  </div>

                  {/* 다음 버튼 */}
                  <div className="pt-4">
                    <Button
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-500 font-normal"
                      data-testid="button-manager-info-next"
                      onClick={() => setLocation('/work/company-portfolio/intro')}
                    >
                      다음
                    </Button>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      {COMMON_MESSAGES.TEMP_SAVE_NOTICE}
                    </p>
                  </div>
                </div>
              )}
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
          <div className="space-y-3 mt-4">
            {[
              ["기업명", "솜사탕애드"],
              ["기업유형", "광고대행사 - 종합광고대행사"],
              ["업종", "전기전자"],
              ["기업규모", "중견기업"],
              ["직원수", "100명 이상"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-4 pb-3 border-b">
                <div className="text-sm font-medium text-gray-700">{k}</div>
                <div className="col-span-2 text-sm">{v}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
