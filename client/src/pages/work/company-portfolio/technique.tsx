import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight } from 'lucide-react';
import { COMMON_MESSAGES } from '@/lib/messages';

export default function Technique() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const techniques = [
    { title: 'AI', desc: 'AI 기반 영상·이미지·음성 합성' },
    { title: '라이브액션', desc: '실사 중심 촬영 및 현장 연출' },
    { title: '특수촬영', desc: '드론, 고속카메라, 수중촬영' },
    { title: '2D/3D', desc: '2D/3D 그래픽 및 모델링, 애니메이션' },
    { title: '모션그래픽', desc: '텍스트·그래픽 요소 애니메이션화' },
    { title: '애니메이션', desc: '캐릭터 및 셀·3D 애니메이션 연출' },
    { title: '제품 모델', desc: '제품 렌더링, 고퀄리티 촬영·합성' },
    { title: '캐릭터/동물 모델', desc: '캐릭터·동물 CG 및 촬영' },
    { title: '판타지/SF', desc: 'CG·특수효과로 판타지/SF 구현' },
    { title: '특수기법', desc: '트릭영상, 착시, 스톱모션 등' },
    { title: 'CM Song형', desc: 'CM송·음악 중심 연출' },
    { title: 'VR/AR', desc: '가상현실·증강현실 콘텐츠' }
  ];

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <h1 className="work-title">Step5. 제작 기법별 전문 분야</h1>
              
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

              <p className="text-sm text-gray-600 mb-6">아이템을 마우스로 드래그하여 중요도에 따라 순서를 변경하실 수 있어요.</p>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-2 gap-4">
                  {techniques.map((tech, index) => (
                    <div key={tech.title} className="p-4 border rounded-lg hover:bg-gray-50 cursor-move" data-testid={`technique-item-${index}`}>
                      <h3 className="font-medium mb-1">{tech.title}</h3>
                      <p className="text-sm text-gray-600">{tech.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button variant="outline" className="btn-white" data-testid="button-technique-prev">
                    이전
                  </Button>
                  <Button className="btn-pink" data-testid="button-technique-next">
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
