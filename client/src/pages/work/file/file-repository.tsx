import { useState } from "react";
import Layout from "@/components/layout/layout";
import WorkSidebar from "@/components/work/sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowUpRight } from "lucide-react";

export default function FileRepository() {
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const files = [
    { id: 1, name: '[HSAD] LG 스탠바이미2 프로모션 참가신청서.pdf', type: '참가신청서', date: '2024-04-06' },
    { id: 2, name: '[HSAD] 사업자 등록증 사본.pdf', type: '사업자등록증사본', date: '2024-04-06' },
    { id: 3, name: '[HSAD] 포트폴리오_20250807.pdf', type: '포트폴리오', date: '2024-04-06' },
    { id: 4, name: '[HSAD] 회사소개서 2025.pdf', type: '회사소개서', date: '2024-04-06' },
    { id: 5, name: '[HSAD] 비밀유지 서약서 2025.pdf', type: '비밀유지 서약서', date: '2024-04-06' },
    { id: 6, name: '[HSAD] 프로젝트 기획서 2025.pdf', type: '프로젝트 기획서', date: '2024-04-06' },
    { id: 7, name: '[HSAD] 사업자등록증.pdf', type: '사업자등록증', date: '2024-04-06' },
    { id: 8, name: '[HSAD] 법인등기부등본.pdf', type: '법인등기부등본', date: '2024-04-06' },
  ];

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <h1 className="work-title">파일함</h1>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <select 
                      className="flex-1 px-4 py-2 border rounded-lg text-lg font-medium" 
                      data-testid="select-project"
                    >
                      <option>[베스트전자] TV 신제품 판매촉진 프로모션</option>
                      <option>[베스트전자] 스탠바이미 신제품 런칭</option>
                      <option>[베스트전자] 기업홍보 광고 영상 제작</option>
                    </select>
                    <button
                      onClick={() => setIsProjectDetailOpen(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      data-testid="button-project-detail"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                  <Button className="btn-pink w-full" data-testid="button-attach-file">
                    파일 첨부
                  </Button>
                </div>

                <div className="space-y-3">
                  {files.map((file) => (
                    <div 
                      key={file.id} 
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      data-testid={`file-item-${file.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1" data-testid={`file-name-${file.id}`}>
                            {file.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span data-testid={`file-type-${file.id}`}>{file.type}</span>
                            <span className="text-gray-400">|</span>
                            <span data-testid={`file-date-${file.id}`}>{file.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 프로젝트 상세 팝업 */}
      <Dialog open={isProjectDetailOpen} onOpenChange={setIsProjectDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">[베스트전자] 신제품 판매촉진 프로모션 대행사 모집</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* 프로젝트 기본 정보 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm font-medium">PID-20250721-0001</span>
                <span className="text-sm px-3 py-1 bg-gray-100 rounded">임시저장</span>
                <span className="text-sm px-3 py-1 bg-pink-100 text-pink-600 rounded">참여공고</span>
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded">대행사 모집</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>베스트전자</span>
                <span>대기업</span>
                <span>전기전자</span>
              </div>

              <div className="text-right mb-4">
                <div className="text-sm text-gray-600">
                  총예산 <span className="text-lg font-bold text-gray-800">10~20억</span>
                </div>
                <div className="text-xs text-gray-500">(제작비 3억~6억)</div>
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-gray-700">제품명</div>
                <div className="col-span-3">
                  <div className="text-sm mb-1">[OLED] 스탠바이미2</div>
                  <div className="text-xs text-gray-500">└ 제품유형 카메라/영상/음향가전</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-gray-700">의뢰항목</div>
                <div className="col-span-3 text-sm">
                  전략기획 크리에이티브 기획 영상 제작 미디어 집행<br/>
                  성과 측정 및 리포팅 인플루언서/SNS 마케팅
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-gray-700">광고목적</div>
                <div className="col-span-3 text-sm">
                  제품판매촉진 / 리뷰형 콘텐츠 제작 #실사용<br/>
                  브랜드 인지도 향상 #바이럴 확산형 콘텐츠 기획 및 제작
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-gray-700">제작기법</div>
                <div className="col-span-3 text-sm">
                  #AI, #라이브액션, #특수촬영, #캐릭터/동물 모델
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-gray-700">매체</div>
                <div className="col-span-3 text-sm">
                  TV   Youtube   디지털광고   옥외
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-gray-700">모집 파트너</div>
                <div className="col-span-3">
                  <div className="text-sm mb-1">대행사</div>
                  <div className="text-xs text-gray-600">└ 세부유형: 종합 광고대행사</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                <div className="text-sm font-medium text-gray-700">상세설명</div>
                <div className="col-span-3 text-sm text-gray-600">
                  베스트전자는 전자, 가전 분야의 혁신적인 기술로<br/>
                  세계적인 일류기업 자리를 지켜나가도록 최선을 다하겠습니다.<br/><br/>
                  자세한 내용은 OT에서 전달드리겠습니다.
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
