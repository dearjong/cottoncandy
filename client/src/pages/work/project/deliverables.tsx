import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Video, Image, Play } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { trackDeliverableSubmitted, trackDeliverableConfirmed } from '@/lib/analytics';

const MOCK_PROJECTS = [{ id: '1', label: '[베스트전자] TV 신제품 판매촉진 프로모션' }];

type MediaType = 'video' | 'image';

const MOCK_DELIVERABLES = [
  {
    id: '1',
    phase: 1,
    type: 'video' as MediaType,
    title: '1차 산출물입니다.',
    description: '스탠바이미2의 부드럽고 감성적인 이미지와 함께, 사용자의 일상에 스며드는 스토리와 감성으로.',
    registeredAt: '2025.10.15',
  },
  {
    id: '2',
    phase: 2,
    type: 'video' as MediaType,
    title: '2차 산출물입니다.',
    description: '스탠바이미2의 부드럽고 감성적인 이미지와 함께, 사용자의 일상에 스며드는 스토리와 감성으로.',
    registeredAt: '2025.10.15',
  },
  {
    id: '3',
    phase: 2,
    type: 'image' as MediaType,
    title: '2차 산출물입니다.',
    description: '스탠바이미2의 부드럽고 감성적인 이미지와 함께, 사용자의 일상에 스며드는 스토리와 감성으로.',
    registeredAt: '2025.10.15',
  },
];

const MOCK_REVISION_REQUESTS = [
  { id: '1', opinion: "엔딩 문구 '함께 만드는 혁신' 자막 색상을 브랜드 블루로 변경해주세요", author: '김광고', date: '2025-11-25' },
  { id: '2', opinion: "엔딩 문구 '함께 만드는 혁신' 자막 색상을 브랜드 블루로 변경해주세요", author: '김광고', date: '2025-11-25' },
];

const OPINION_LABEL = '[ 광고주 의견 ] 요청사항이나 보내실 내용이 있을 경우 입력해주세요';
const OPINION_HINT = '만약 변경하실 내용이 없으시면 입력하지 않으시면 됩니다.';
const OPINION_NOTE = '※ 무상 수정은 기본 2회까지 제공되며, 초과 시 별도 비용이 발생할 수 있습니다.';

const PHASE_TABS = [
  { key: 1, label: '1차 산출물' },
  { key: 2, label: '2차 산출물' },
] as const;

type PopupKey = 'upload_request' | 'final_request' | 'selection_complete' | 'final_confirm' | null;

function TwoStepPopup({
  confirmTitle,
  confirmSub,
  successTitle,
  onConfirm,
  onClose,
}: {
  confirmTitle: string;
  confirmSub?: string;
  successTitle: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [done, setDone] = useState(false);

  function handleConfirm() {
    onConfirm();
    setDone(true);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-72 p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
          onClick={onClose}
        >
          ✕
        </button>
        {!done ? (
          <>
            <p className="popup-title text-center mb-1">{confirmTitle}</p>
            {confirmSub && (
              <p className="text-xs text-pink-500 text-center mb-5">{confirmSub}</p>
            )}
            {!confirmSub && <div className="mb-5" />}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full font-normal" onClick={onClose}>
                취소
              </Button>
              <Button
                className="flex-1 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-normal"
                onClick={handleConfirm}
              >
                확인
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="popup-title text-center mb-6">{successTitle}</p>
            <Button
              className="w-full rounded-full bg-pink-600 hover:bg-pink-700 text-white font-normal"
              onClick={onClose}
            >
              확인
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function WorkProjectDeliverables() {
  const [projectId, setProjectId] = useState('1');
  const [phaseTab, setPhaseTab] = useState<1 | 2>(1);
  const [opinions, setOpinions] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activePopup, setActivePopup] = useState<PopupKey>(null);

  const filteredDeliverables = MOCK_DELIVERABLES.filter((d) => d.phase === phaseTab);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const setOpinion = (id: string, value: string) => {
    setOpinions((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1 min-w-0">
              {/* 헤더 */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="work-title">산출물</h1>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="w-full sm:w-[320px]">
                    <SelectValue placeholder="프로젝트 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PROJECTS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                {/* 1차/2차 탭 */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
                  {PHASE_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setPhaseTab(tab.key)}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        phaseTab === tab.key
                          ? 'bg-white text-pink-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 산출물 카드 리스트 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80">
                    <h2 className="text-sm font-semibold text-gray-800">{phaseTab}차 산출물</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      선택한 작품을 최종 산출물로 확정할 수 있습니다.
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {filteredDeliverables.length === 0 ? (
                      <div className="p-12 text-center">
                        <p className="text-gray-500 text-sm">등록된 산출물이 없습니다.</p>
                      </div>
                    ) : (
                      filteredDeliverables.map((d, idx) => (
                        <div key={d.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                          <div className="flex gap-4 mb-4">
                            <div className="flex items-start gap-3 shrink-0">
                              <label className="flex items-center pt-1 cursor-pointer">
                                <Checkbox
                                  checked={selectedIds.includes(d.id)}
                                  onCheckedChange={() => toggleSelect(d.id)}
                                />
                              </label>
                              <span className="text-sm text-gray-400 w-5 pt-1">{idx + 1}</span>
                              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-gray-200 overflow-hidden group">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  {d.type === 'video' ? (
                                    <Play className="w-8 h-8 text-white/80 drop-shadow" fill="currentColor" />
                                  ) : (
                                    <Image className="w-8 h-8 text-gray-400" />
                                  )}
                                </div>
                                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/50 text-white">
                                  {d.type === 'video' ? '영상' : '이미지'}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                              <p className="font-semibold text-gray-800">{d.title}</p>
                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{d.description}</p>
                              <p className="text-gray-400 text-xs mt-2">{d.registeredAt}</p>
                            </div>
                          </div>
                          <div className="ml-14 pl-4 border-l-2 border-pink-100 bg-pink-50/30 rounded-r-lg py-3 px-4">
                            <Label className="text-gray-700 text-sm font-medium block mb-1">
                              {OPINION_LABEL}
                            </Label>
                            <p className="text-xs text-gray-500 mb-1">{OPINION_HINT}</p>
                            <p className="text-xs text-gray-500 mb-3">{OPINION_NOTE}</p>
                            <Textarea
                              value={opinions[d.id] ?? ''}
                              onChange={(e) => setOpinion(d.id, e.target.value)}
                              placeholder="광고주 의견을 입력해주세요."
                              className="min-h-[80px] bg-white border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 수정요청 리스트 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">작품 선택 완료 및 수정요청</h3>
                  <div className="space-y-3">
                    {MOCK_REVISION_REQUESTS.map((req) => (
                      <div key={req.id} className="flex gap-2 text-sm">
                        <span className="text-pink-400 shrink-0">└</span>
                        <div>
                          <p className="text-gray-700">[ 광고주 의견 ] {req.opinion}</p>
                          <p className="text-xs text-gray-400 mt-0.5">by {req.author} ({req.date})</p>
                        </div>
                      </div>
                    ))}
                    {MOCK_REVISION_REQUESTS.length === 0 && (
                      <p className="text-gray-500 text-sm">수정요청 내역이 없습니다.</p>
                    )}
                  </div>
                </div>

                {/* CTA 버튼 4개 */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {/* ① 산출물 업로드 완료 및 선택요청 (파트너) */}
                  <Button
                    variant="outline"
                    className="font-normal"
                    onClick={() => setActivePopup('upload_request')}
                  >
                    의뢰사에 산출물 선택 요청하기
                  </Button>

                  {/* ② 최종산출물 확정요청 (파트너) */}
                  <Button
                    variant="outline"
                    className="font-normal"
                    onClick={() => setActivePopup('final_request')}
                  >
                    의뢰사에 최종산출물 확정 요청하기
                  </Button>

                  {/* ③ 선택완료 및 수정요청 (의뢰사) */}
                  <Button
                    variant="outline"
                    className="font-normal"
                    onClick={() => setActivePopup('selection_complete')}
                  >
                    작품 선택완료 및 수정요청
                  </Button>

                  {/* ④ 최종 산출물 확정 등록 (의뢰사) */}
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white font-normal shadow-md"
                    disabled={selectedIds.length === 0}
                    onClick={() => setActivePopup('final_confirm')}
                  >
                    선택된 작품을 최종 산출물로 확정 등록하기
                    {selectedIds.length > 0 && ` (${selectedIds.length}개)`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ① 산출물 업로드 완료 및 선택요청 팝업 */}
      {activePopup === 'upload_request' && (
        <TwoStepPopup
          confirmTitle={"의뢰사에\n산출물 선택을 요청할까요?"}
          confirmSub="산출물 선택 요청 후에는 새 버전으로 업로드 됩니다."
          successTitle="요청되었어요."
          onConfirm={() =>
            trackDeliverableSubmitted({ project_title: MOCK_PROJECTS[0].label, phase: phaseTab })
          }
          onClose={() => setActivePopup(null)}
        />
      )}

      {/* ② 최종산출물 확정요청 팝업 */}
      {activePopup === 'final_request' && (
        <TwoStepPopup
          confirmTitle={"의뢰사에\n최종산출물 확정을 요청할까요?"}
          successTitle="요청되었어요."
          onConfirm={() =>
            trackDeliverableSubmitted({ project_title: MOCK_PROJECTS[0].label, phase: phaseTab })
          }
          onClose={() => setActivePopup(null)}
        />
      )}

      {/* ③ 선택완료 및 수정요청 팝업 */}
      {activePopup === 'selection_complete' && (
        <TwoStepPopup
          confirmTitle="작품 선택완료 및 수정요청할까요?"
          confirmSub="산출물을 결정 후 선택변경이 불가능합니다."
          successTitle="완료되었어요."
          onConfirm={() => {}}
          onClose={() => setActivePopup(null)}
        />
      )}

      {/* ④ 최종산출물 선택완료 팝업 */}
      {activePopup === 'final_confirm' && (
        <TwoStepPopup
          confirmTitle={"선택하신 작품을\n최종산출물로 결정할까요?"}
          confirmSub="최종 산출물 결정 후 더이상 수정이 불가합니다."
          successTitle="최종산출물 선택이 완료되었어요."
          onConfirm={() =>
            trackDeliverableConfirmed({ project_title: MOCK_PROJECTS[0].label, phase: phaseTab })
          }
          onClose={() => setActivePopup(null)}
        />
      )}
    </Layout>
  );
}
