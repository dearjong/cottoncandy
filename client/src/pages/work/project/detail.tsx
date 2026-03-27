import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { useLocation } from 'wouter';

export default function WorkProjectDetail() {
  const [, setLocation] = useLocation();

  const handleBackToList = () => {
    setLocation('/work/project/list');
  };

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="work-title">[참여공고] 프로젝트 상세</h1>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-sm font-medium">PID-20250721-0001</span>
                      <span className="text-sm px-3 py-1 bg-gray-100 rounded">임시저장</span>
                      <span className="text-sm px-3 py-1 bg-pink-100 text-pink-600 rounded">참여공고</span>
                      <span className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded">대행사 모집</span>
                      <span className="text-sm px-3 py-1 bg-purple-100 text-purple-600 rounded">경쟁PT</span>
                      <span className="text-sm px-3 py-1 bg-green-100 text-green-600 rounded">My담당</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3">[베스트전자] 신제품 판매촉진 프로모션 대행사 모집</h2>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>베스트전자</span>
                      <span>대기업</span>
                      <span>전기전자</span>
                    </div>

                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span>✓</span>
                        <span>급행 제작 대응</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>✓</span>
                        <span>경쟁사 수행기업 제외</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>✓</span>
                        <span>리젝션 Fee</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        총예산 <span className="text-lg font-bold text-gray-800">10~20억</span>
                      </div>
                      <div className="text-xs text-gray-500">(제작비 3억~6억)</div>
                    </div>
                  </div>

                  <div className="space-y-6">
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
                        성과 측정 및 리포팅 인플루언서/SNS 마케팅<br/>
                        PR/언론보도 대응 오프라인 이벤트/프로모션
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                      <div className="text-sm font-medium text-gray-700">일정대응</div>
                      <div className="col-span-3 text-sm text-gray-600">
                        #급행 제작 대응, #당일 피드백 반영 가능, #일정 유동성 대응, #이벤트/행사 대응
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                      <div className="text-sm font-medium text-gray-700">광고목적</div>
                      <div className="col-span-3 text-sm">
                        제품판매촉진 / 리뷰형 콘텐츠 제작 #실사용<br/>
                        브랜드 인지도 향상 #바이럴 확산형 콘텐츠 기획 및 제작, #TV·디지털 연계 캠페인 기획<br/>
                        이벤트/프로모션 #명절/할인/이벤트 캠페인
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
                      <div className="text-sm font-medium text-gray-700">주요 고객</div>
                      <div className="col-span-3">
                        <div className="text-sm mb-1">10대, 20대,</div>
                        <div className="text-xs text-gray-600">└ 성별: 전체</div>
                        <div className="text-xs text-gray-600">└ 직업: 직장인, 주부, 자영업자</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                      <div className="text-sm font-medium text-gray-700">경쟁사 수행기업 제외</div>
                      <div className="col-span-3">
                        <div className="text-sm mb-1">제한업종 - 전기/전자,</div>
                        <div className="text-sm">#삼성전자, #애플, #HP, #소니,</div>
                        <div className="text-xs text-gray-500">(최근 6개월)</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                      <div className="text-sm font-medium text-gray-700">모집 파트너</div>
                      <div className="col-span-3">
                        <div className="text-sm mb-1">대행사</div>
                        <div className="text-xs text-gray-600 mb-2">└ 세부유형: 종합 광고대행사</div>
                        <div className="text-xs text-gray-600">└ 상세조건:</div>
                        <div className="text-xs text-gray-600 ml-4">
                          광고 Awards 수상작 10작품 이상 (최근 3년간)<br/>
                          TVCF 명예의 전당 5작품 이상 (최근 3년간)<br/>
                          TVCF 포트폴리오 50건 이상 (최근 3년간)<br/>
                          최소제작비 2억 이상
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pb-4 border-b">
                      <div className="text-sm font-medium text-gray-700">상세설명</div>
                      <div className="col-span-3 text-sm text-gray-600">
                        베스트전자는 전자, 가전 분야의 혁신적인 기술로<br/>
                        세계적인 일류기업 자리를 지켜나가도록 최선을 다하겠습니다.<br/><br/>
                        베스트전자는 고객을 위한 가치창조와<br/>
                        인간존중의 경영을 실현합니다.<br/><br/>
                        자세한 내용은 OT에서 전달드리겠습니다.
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium mb-2">접수마감</div>
                        <div className="text-sm text-gray-600">(0팀 참여)</div>
                        <div className="text-2xl font-bold text-pink-600">D-35</div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-sm font-medium mb-1">접수기간</div>
                        <div className="text-sm">2025.11.10(월) ~ 2025.08.19(금)</div>
                        <div className="text-xs text-gray-500">(총 30일)</div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-sm font-medium mb-1">사전미팅(OT)</div>
                        <div className="text-sm">2025.12.20 (목) 10:00 온라인</div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-sm font-medium mb-1">제출자료 마감</div>
                        <div className="text-sm">2025.12.20</div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-sm font-medium mb-1">경쟁PT</div>
                        <div className="text-sm">2025.12.25 (수) 12:00 서울시 강남구</div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-sm font-medium mb-1">리젝션 Fee</div>
                        <div className="text-lg font-bold">30만원</div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-sm font-medium mb-1">납품기한</div>
                        <div className="text-sm">2025.12.20</div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-sm font-medium mb-1">OnAir</div>
                        <div className="text-sm">2025.12.25</div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-sm font-medium mb-1">담당자</div>
                        <div className="text-sm">나해피 선임</div>
                        <div className="text-sm">nhappy@yesc.com</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div className="space-y-3">
                      <label className="flex items-start gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="mt-1" data-testid="checkbox-terms" />
                        <span>입력하신 정보는 Cotton Candy 이용자에게 전체 공개되며, 프로젝트 관리 및 서비스 제공 목적에 활용됩니다.</span>
                      </label>
                      <label className="flex items-start gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="mt-1" data-testid="checkbox-privacy" />
                        <span>입력하신 정보는 지원한 파트너에게 공개되며, 파트너 선정 목적에 활용됩니다.</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button className="btn-white" onClick={handleBackToList} data-testid="button-back-1">
                        리스트
                      </button>
                      <button className="btn-pink" data-testid="button-submit">
                        접수하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
