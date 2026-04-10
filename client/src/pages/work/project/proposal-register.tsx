import { useState } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, ExternalLink, FileText, ChevronDown } from 'lucide-react';
import { trackProposalSubmitted, trackDraftSubmitted } from '@/lib/analytics';

const PROJECT_TITLE = '[베스트킨티 TV 신제품 완제초점 프로포전]';

const CONCEPT_OVERVIEW_TEXT =
  `[베스트킨티] 스마트폰 판매촉진 프로모션은 고객이 겪는 어려움을 제품을 통해 직접 해결할 수 있도록 스토리를 제안합니다.\n\n이는 '브랜드가 시청자의 친구가 되자'는 메시지를 전달합니다. 사람들이 흔히 마주하는 상황과 스마트폰이 어떻게 그 상황을 도와주는지 보여주는 방식으로, 감정을 자연스럽게 브랜드와 연결시킵니다.\n\n이번 프로모션을 통해 첫번째 광고는 감성 중심 접근방식 1:1 브랜드 스토리텔링 방식으로 연결고리를 만들고 그를 통해서 더욱 감각적이고 현대적인 방식으로 소비자의 일상과 맞닿은 브랜드 경험을 제공합니다.`;

type ConceptType = 'Ani 감성형' | '영상형' | '이미지형' | '혼합형';

type ConceptItem = {
  id: string;
  thumbnail: string | null;
  description: string;
  type: ConceptType;
  duration: string;
};

type ConceptGroup = {
  id: string;
  label: string;
  items: ConceptItem[];
};

const INITIAL_GROUPS: ConceptGroup[] = [
  {
    id: 'g1',
    label: '전략별',
    items: [
      {
        id: 'c1',
        thumbnail: 'thumb',
        description: '긍정적 표현을 활용하여 브랜드 이미지를 강화하는 시각적 요소',
        type: 'Ani 감성형',
        duration: '0.5 s',
      },
      {
        id: 'c2',
        thumbnail: 'thumb',
        description: '컨셉을 활용한 감각 3단 현재 한 완료를 표현하는 방식',
        type: '영상형',
        duration: '20 초',
      },
    ],
  },
  {
    id: 'g2',
    label: '전략별',
    items: [
      {
        id: 'c3',
        thumbnail: 'thumb',
        description: '긍정적 표현을 활용하여 브랜드 이미지를 강화하는 시각적 요소',
        type: 'Ani 감성형',
        duration: '0.5 s',
      },
      {
        id: 'c4',
        thumbnail: 'thumb',
        description: '컨셉을 활용한 감각 3단 현재 한 완료를 표현하는 방식',
        type: '영상형',
        duration: '20 초',
      },
    ],
  },
];

const SUBMISSION_FILES = [
  { id: 1, name: '[HDA] 포트폴리오_20230087.pdf', date: '2024-11-05 · 3.2 MB' },
  { id: 2, name: '[HDA] 사업자등록증 사본.pdf', date: '2024-11-05 · 1.8 MB' },
  { id: 3, name: '[HDA] 프로젝트 기획서 2023.pdf', date: '2024-11-05 · 4.1 MB' },
];

const CONCEPT_TYPES: ConceptType[] = ['Ani 감성형', '영상형', '이미지형', '혼합형'];

function ThumbBox() {
  return (
    <div className="w-16 h-12 rounded bg-gradient-to-br from-pink-200 via-rose-100 to-pink-300 flex items-center justify-center shrink-0">
      <FileText className="w-5 h-5 text-pink-400" />
    </div>
  );
}

export default function WorkProjectProposalRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [groups, setGroups] = useState<ConceptGroup[]>(INITIAL_GROUPS);
  const [strategicFileUploaded] = useState(true);
  const [creativeFileUploaded] = useState(false);
  const [submissionFiles, setSubmissionFiles] = useState(SUBMISSION_FILES);
  const [portfolioValue, setPortfolioValue] = useState('[베스트킨티 스크롤링시리즈 소개서]');
  const [isDraft, setIsDraft] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addConceptItem = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              items: [
                ...g.items,
                {
                  id: `c${Date.now()}`,
                  thumbnail: null,
                  description: '',
                  type: 'Ani 감성형',
                  duration: '',
                },
              ],
            }
          : g,
      ),
    );
  };

  const addConceptGroup = () => {
    setGroups((prev) => [
      ...prev,
      {
        id: `g${Date.now()}`,
        label: '전략별',
        items: [],
      },
    ]);
  };

  const removeSubmissionFile = (id: number) => {
    setSubmissionFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDraftSave = () => {
    setIsDraft(true);
    toast({ title: '임시저장 완료', description: '제안서가 임시저장되었습니다.' });
  };

  const handleSave = () => {
    toast({ title: '저장 완료', description: '제안서가 저장되었습니다.' });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    trackDraftSubmitted({
      project_title: PROJECT_TITLE,
      concept_count: groups.reduce((sum, g) => sum + g.items.length, 0),
    });
    trackProposalSubmitted({
      project_title: PROJECT_TITLE,
      has_strategic_file: strategicFileUploaded,
      has_creative_file: creativeFileUploaded,
      concept_count: groups.reduce((sum, g) => sum + g.items.length, 0),
      submission_file_count: submissionFiles.length,
    });
    toast({ title: '제출 완료', description: '제안서가 성공적으로 제출되었습니다.' });
    setTimeout(() => setLocation('/work/project/proposal'), 1200);
  };

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="work-title mb-5">제안서·시안 (등록)</h1>

              {/* 프로젝트 뱃지 */}
              <div className="flex items-center gap-2 mb-6 border border-blue-200 bg-blue-50 rounded-lg px-4 py-2.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-sm font-medium text-blue-900">{PROJECT_TITLE}</span>
                <button
                  type="button"
                  className="ml-2 text-blue-400 hover:text-blue-600"
                  onClick={() => setLocation('/work/project/proposal')}
                  aria-label="닫기"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-6">

                {/* ─── 섹션 1: 선진입 설정 ─── */}
                <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800">1. 선진입 설정</h2>
                  </div>
                  <div className="px-5 py-5">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Concept Overview</p>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {CONCEPT_OVERVIEW_TEXT}
                    </div>
                  </div>
                </section>

                {/* ─── 섹션 2: 제안서 ─── */}
                <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800">2. 제안서</h2>
                  </div>
                  <div className="px-5 py-5 grid grid-cols-2 gap-4">
                    {/* 전략 제안서 */}
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                        <p className="text-xs font-semibold text-slate-600">전략 제안서</p>
                      </div>
                      {strategicFileUploaded ? (
                        <div className="bg-pink-50 border-pink-100 px-4 py-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-pink-200 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-pink-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-pink-700 truncate">Strategic Proposal.pdf</p>
                            <p className="text-xs text-pink-400 mt-0.5">2024-11-05 · 5.2 MB</p>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-full px-4 py-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                        >
                          <Plus className="w-6 h-6 mb-1" />
                          <span className="text-xs">(등록)</span>
                        </button>
                      )}
                    </div>

                    {/* 크리에이티브 제안서 */}
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                        <p className="text-xs font-semibold text-slate-600">크리에이티브 제안서</p>
                      </div>
                      {creativeFileUploaded ? (
                        <div className="bg-pink-50 px-4 py-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-pink-200 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-pink-600" />
                          </div>
                          <p className="text-sm font-semibold text-pink-700 truncate">Creative Proposal.pdf</p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-full px-4 py-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                        >
                          <Plus className="w-6 h-6 mb-1" />
                          <span className="text-xs">(등록)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </section>

                {/* ─── 섹션 3: 컨셉물·시안 ─── */}
                <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-800">3. 컨셉물·시안</h2>
                    <button
                      type="button"
                      onClick={addConceptGroup}
                      className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Concept 추가
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {groups.map((group, gi) => (
                      <div key={group.id} className="px-5 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-slate-500">{group.label}</span>
                          <button
                            type="button"
                            onClick={() => addConceptItem(group.id)}
                            className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 font-medium"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Concept 추가
                          </button>
                        </div>

                        <div className="rounded-lg border border-slate-200 overflow-hidden">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-center py-2 px-3 font-semibold text-slate-600 w-10">No</th>
                                <th className="text-left py-2 px-3 font-semibold text-slate-600">탐방하지/파일</th>
                                <th className="text-left py-2 px-3 font-semibold text-slate-600">시각화한 설명 <span className="font-normal text-slate-400">(150자 이내)</span></th>
                                <th className="text-center py-2 px-3 font-semibold text-slate-600 w-24">유형</th>
                                <th className="text-center py-2 px-3 font-semibold text-slate-600 w-16">전략</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.items.map((item, ii) => (
                                <tr key={item.id} className="border-b border-slate-100 last:border-0">
                                  <td className="text-center py-2.5 px-3 text-slate-500 tabular-nums">{ii + 1}</td>
                                  <td className="py-2.5 px-3">
                                    {item.thumbnail ? (
                                      <ThumbBox />
                                    ) : (
                                      <button
                                        type="button"
                                        className="w-16 h-12 rounded border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-pink-300 hover:text-pink-400 transition-colors"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    )}
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-700 max-w-[200px]">
                                    {item.description || <span className="text-slate-300">설명을 입력하세요</span>}
                                  </td>
                                  <td className="text-center py-2.5 px-3">
                                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                                      {item.type}
                                    </span>
                                  </td>
                                  <td className="text-center py-2.5 px-3 text-slate-500 tabular-nums">{item.duration}</td>
                                </tr>
                              ))}
                              {/* 빈 행 (추가 공간) */}
                              {[...Array(Math.max(0, 2 - group.items.length))].map((_, ei) => (
                                <tr key={`empty-${gi}-${ei}`} className="border-b border-slate-100 last:border-0">
                                  <td className="py-3 px-3 text-center text-slate-300 tabular-nums">{group.items.length + ei + 1}</td>
                                  <td className="py-3 px-3">
                                    <div className="w-16 h-10 rounded border border-dashed border-slate-200 bg-slate-50" />
                                  </td>
                                  <td className="py-3 px-3" />
                                  <td className="py-3 px-3" />
                                  <td className="py-3 px-3" />
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <button
                          type="button"
                          onClick={() => addConceptItem(group.id)}
                          className="mt-2.5 flex items-center gap-1 text-[11px] text-slate-400 hover:text-pink-500 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          시안 추가
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ─── 섹션 4: 기업 파트너스 포트폴리오 ─── */}
                <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800">4. 기업 파트너스 포트폴리오</h2>
                  </div>
                  <div className="px-5 py-4 flex items-center gap-3">
                    <div className="flex-1 relative">
                      <select
                        className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-pink-200"
                        value={portfolioValue}
                        onChange={(e) => setPortfolioValue(e.target.value)}
                      >
                        <option value="[베스트킨티 스크롤링시리즈 소개서]">[베스트킨티 스크롤링시리즈 소개서]</option>
                        <option value="[베스트킨티 TV CF 포트폴리오]">[베스트킨티 TV CF 포트폴리오]</option>
                        <option value="[베스트킨티 디지털 캠페인 결과보고]">[베스트킨티 디지털 캠페인 결과보고]</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      서보기
                    </button>
                  </div>
                </section>

                {/* ─── 섹션 5: 제출물 ─── */}
                <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800">5. 제출물</h2>
                  </div>
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-500">제출 형식</p>
                    </div>

                    <div className="space-y-2">
                      {submissionFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 group"
                        >
                          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 truncate">{file.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{file.date}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSubmissionFile(file.id)}
                            className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-slate-300 hover:text-slate-500 hover:bg-slate-200 transition-colors"
                            aria-label="파일 삭제"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {submissionFiles.length === 0 && (
                        <div className="py-6 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-lg">
                          <Plus className="w-6 h-6 mb-1" />
                          <span className="text-xs">파일을 추가해주세요</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 space-y-1 text-[11px] text-slate-400 leading-relaxed">
                      <p>※ 제출물은 PDF 형식으로 업로드해주세요.</p>
                      <p>※ 파일 크기는 최대 50MB까지 업로드 가능합니다.</p>
                      <p>※ 업로드된 파일은 클라이언트에게 공유되며, 수정은 제출 전까지만 가능합니다.</p>
                    </div>
                  </div>
                </section>

              </div>

              {/* ─── 하단 버튼 ─── */}
              <div className="flex items-center justify-end gap-2 mt-6 pb-8">
                <button
                  type="button"
                  onClick={() => setLocation('/work/project/proposal')}
                  className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  취소하기
                </button>
                <button
                  type="button"
                  onClick={handleDraftSave}
                  className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  임시저장
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  저장하기
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitted}
                  className="px-5 py-2 text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitted ? '제출완료' : '제출하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
