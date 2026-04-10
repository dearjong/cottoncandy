import { useState } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import { COMMON_MESSAGES } from '@/lib/messages';

export default function Intro() {
  const [, setLocation] = useLocation();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(true);

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* 전체 너비 타이틀 */}
        <div className="text-center py-8 border-b border-gray-100">
          <h1 className="text-2xl font-bold mb-2">Step2. 회사소개</h1>
          <p className="text-sm text-gray-500">
            회사소개서 &amp; 포트폴리오의 제목과 기업소개글을 입력합니다.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-8">
            <WorkSidebar />

            <div className="flex-1 min-w-0">
              {/* 소개서 선택 헤더 */}
              <div className="flex items-center justify-between mb-5 border border-gray-200 rounded-lg px-4 py-3">
                <button
                  className="flex items-center gap-1 text-pink-600 font-medium text-sm"
                  onClick={() => setSectionOpen(!sectionOpen)}
                >
                  {sectionOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  Campaign creators 솜사탕애드 입니다.
                </button>
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

              {sectionOpen && (
                <div className="space-y-5">
                  {/* 제목 */}
                  <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                    <label className="text-sm font-medium text-gray-700 pt-2.5">제목</label>
                    <input
                      type="text"
                      placeholder="회사소개서 & 포트폴리오 제목을 입력 해 주세요."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                      data-testid="input-title"
                    />
                  </div>

                  {/* 기업 소개글 */}
                  <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                    <label className="text-sm font-medium text-gray-700 pt-2.5">기업 소개글</label>
                    <div className="relative">
                      <textarea
                        placeholder={"기업 소개글을 입력 해 주세요.\n아래 소개서 예시 클릭하여 확인하신 후 참고하여 작성해주세요."}
                        rows={8}
                        className="w-full px-3 py-2.5 border border-pink-200 rounded-lg text-sm focus:outline-none focus:border-pink-400 bg-pink-50 resize-none"
                        data-testid="textarea-content"
                      />
                      <div className="text-right mt-1">
                        <button className="text-xs text-pink-500 hover:underline">
                          ※ 여기를 클릭하여 소개서 예시를 확인 해 주세요.
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 버튼 */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="w-full font-normal"
                      data-testid="button-intro-prev"
                      onClick={() => setLocation('/work/company-portfolio/manager-info')}
                    >
                      이전
                    </Button>
                    <Button
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-500 font-normal"
                      data-testid="button-intro-next"
                      onClick={() => setLocation('/work/company-portfolio/experience')}
                    >
                      다음
                    </Button>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    {COMMON_MESSAGES.TEMP_SAVE_NOTICE}
                  </p>

                  {/* 진행 도트 */}
                  <div className="flex justify-center gap-2 pt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300 flex items-center justify-center text-[8px] text-white">1</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
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
