import { Link, useParams } from 'wouter';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Download, ExternalLink, Plus, Edit, CheckCircle } from 'lucide-react';

const CONCEPT_TABS = [
  { value: 'concept1', label: 'Concept1 - 젤리' },
  { value: 'concept2', label: 'Concept2 - 곰' },
  { value: 'concept3', label: 'Concept3 - 봄날의 곰' },
  { value: 'concept4', label: 'Concept4 - 솜사탕' },
];

const MOCK_CONCEPT = `[베스트전자] 스탠바이미2 판매촉진 프로모션은 제품의 핵심 특성인 '이동성과 감성적 사용 경험'을 소비자의 일상 속에서 자연스럽게 스며들도록 제안하는 캠페인입니다.

이노션은 '움직이는 무드, 나만의 TV'라는 메시지 아래, 스탠바이미2를 감성적으로 각인시키는 영상 중심의 체험 기반 콘텐츠를 제시합니다.

이번 프로젝트는 제품 인지도 제고, 감성 브랜드 포지셔닝, 구매 전환율 상승을 주요 KPI로 설정하여 MZ세대와 1인 가구 중심의 고객에게 다가갑니다.`;

const MOCK_PROPOSAL_FILES = [
  { name: 'Strategic Proposal.pdf', label: '전략 제안서' },
  { name: 'Creative Proposal.pdf', label: '크리에이티브 제안서' },
];

const MOCK_SIANS = [
  { no: '시안1', title: '봄날의 젤리을 좋아하세요?', desc: '스탠바이미2의 부드럽고 감성적인 이미지와 함께, 사용자의 일상에 따뜻하게 스며드는 스토리를 전개. 벚꽃 아래 분홍 곰과의 교감으로 브랜드 친밀도를 높임.', model: '박보영', cost: '6억' },
  { no: '시안2', title: '봄날의 젤리을 좋아하세요?', desc: '모델이 젤리인형을 안고 행복해 한다.', model: '박보영', cost: '6억' },
  { no: '시안3', title: '봄날의 젤리을 좋아하세요?', desc: '모델이 젤리인형을 안고 행복해 한다.', model: '박보영', cost: '6억' },
  { no: '시안4', title: '봄날의 젤리을 좋아하세요?', desc: '모델이 젤리인형을 안고 행복해 한다.', model: '박보영', cost: '6억' },
];

const MOCK_DOCUMENTS = [
  { name: '[HSAD] 포트폴리오_20250807.pdf', type: '포트폴리오', date: '2024-04-06' },
  { name: '[HSAD] 회사소개서 2025.pdf', type: '회사소개서', date: '2024-04-06' },
  { name: '[HSAD] 프로젝트 기획서 2025.pdf', type: '프로젝트 기획서', date: '2024-04-06' },
];

const MOCK_COMPANY_NAMES: Record<string, string> = {
  '1': '솜사탕애드',
  '2': '목화솜기획',
  '3': '광고천재',
  '4': '웃음꽃기획',
  '5': '무지개애드',
  '6': '블루밍기획',
};

export default function WorkProjectProposalView() {
  const params = useParams<{ companyId: string }>();
  const companyId = params.companyId ?? '1';
  const companyName = MOCK_COMPANY_NAMES[companyId] ?? '솜사탕애드';

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="work-title">제안서·시안 (보기)</h1>
                <Link href="/work/project/proposal">
                  <Button variant="outline" size="sm">제출현황으로 돌아가기</Button>
                </Link>
              </div>

              <div className="space-y-6">
                {/* 전체 컨셉 안내 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-base font-semibold text-gray-800 mb-3">전체 컨셉 안내</h2>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Concept Overview</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{MOCK_CONCEPT}</p>
                </div>

                {/* 제안서 - 컨셉·명·시안 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-base font-semibold text-gray-800 mb-4">제안서</h2>
                  <p className="text-sm text-gray-600 mb-3">[베스트전자] TV 신제품 판매촉진 프로모션</p>
                  <p className="text-sm font-medium text-gray-800 mb-4">[{companyName}] Version.1</p>
                  <div className="space-y-2">
                    {MOCK_PROPOSAL_FILES.map((f) => (
                      <div key={f.name} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-800">{f.name}</span>
                        <span className="text-sm text-gray-500">— {f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 시안 테이블 */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-800 mb-3">컨셉·시안</h2>
                    <Tabs defaultValue="concept1" className="w-full">
                      <TabsList className="bg-gray-100 p-0.5 h-auto flex flex-wrap gap-1">
                        {CONCEPT_TABS.map((tab) => (
                          <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded px-3 py-2 text-sm"
                          >
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {CONCEPT_TABS.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value} className="mt-0">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b bg-gray-50">
                                  <th className="py-3 px-4 text-left font-medium text-gray-700 w-20">No.</th>
                                  <th className="py-3 px-4 text-left font-medium text-gray-700">영상/이미지</th>
                                  <th className="py-3 px-4 text-left font-medium text-gray-700">제목/설명</th>
                                  <th className="py-3 px-4 text-left font-medium text-gray-700 w-24">모델</th>
                                  <th className="py-3 px-4 text-left font-medium text-gray-700 w-24">제작비</th>
                                </tr>
                              </thead>
                              <tbody>
                                {MOCK_SIANS.map((row) => (
                                  <tr key={row.no} className="border-b border-gray-100 hover:bg-gray-50/50">
                                    <td className="py-3 px-4 text-gray-700">{row.no}</td>
                                    <td className="py-3 px-4 text-gray-500">—</td>
                                    <td className="py-3 px-4">
                                      <div>
                                        <div className="font-medium text-gray-800">{row.title}</div>
                                        <div className="text-gray-500 text-xs mt-0.5">{row.desc}</div>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-700">{row.model}</td>
                                    <td className="py-3 px-4 text-gray-700">{row.cost}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="px-6 py-3 bg-gray-50/80 text-sm text-gray-600">
                            제작비 6억원 · 총견적 20억원
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                </div>

                {/* 회사소개서 & 포트폴리오 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-base font-semibold text-gray-800 mb-3">회사소개서 & 포트폴리오</h2>
                  <Link
                    href="/work/project/company-profile"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
                  >
                    💼 [{companyName}] 기본 회사소개서 & 포트폴리오
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                {/* 제출문서 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-base font-semibold text-gray-800 mb-4">제출문서</h2>
                  <ul className="space-y-2 mb-4">
                    {MOCK_DOCUMENTS.map((f) => (
                      <li key={f.name} className="flex items-center gap-3 text-sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-800">{f.name}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500">{f.type}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-400">{f.date}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    전체파일 다운로드
                  </Button>
                </div>

                {/* 자료열람기간 안내 */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <h3 className="font-semibold mb-2">[자료열람기간]</h3>
                  <p>※ 선정된 기업의 자료는 프로젝트 종료 후 6개월까지 열람이 가능합니다.</p>
                  <p className="mt-1">※ 미선정된 기업의 자료는 의뢰기업에 즉시 비공개되며, 자료를 업로드한 참여기업은 등록 후 6개월까지 확인 가능합니다.</p>
                </div>

                {/* 하단 액션 */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    제안서 추가
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    수정하기
                  </Button>
                  <Button variant="outline" size="sm">최종 제안서로 확정신청</Button>
                  <Button variant="outline" size="sm">AI 소비자평가 신청</Button>
                  <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    최종 제안서로 확정
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
