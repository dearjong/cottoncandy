import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ExternalLink, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const CLIENT_ITEMS = [
  '전반적 만족도',
  '카피의 명확성',
  '제작완성도',
  '피드백 반영과 응답 속도',
  '일정준수',
];

const PARTNER_ITEMS = [
  '전반적 만족도',
  '커뮤니케이션 명확성',
  'SI사결정 및 응답 속도',
  '계약 및 정산 신뢰도',
  '협업 만족도',
];

type SubmitState = 'editing' | 'submitted' | 'completed';

function StarRow({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700 w-48">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(score => (
          <button
            key={score}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(score)}
            className={cn(
              'transition-colors',
              disabled ? 'cursor-default' : 'cursor-pointer',
            )}
          >
            <Star
              className="w-5 h-5"
              fill={value >= score ? '#EA4C89' : 'none'}
              stroke={value >= score ? '#EA4C89' : '#d1d5db'}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WorkProjectReview() {
  const { toast } = useToast();
  const [open, setOpen] = useState(true);
  const [clientRatings, setClientRatings] = useState<Record<string, number>>({ '전반적 만족도': 5 });
  const [partnerRatings, setPartnerRatings] = useState<Record<string, number>>({ '전반적 만족도': 5 });
  const [reviewText, setReviewText] = useState('');
  const [agree1, setAgree1] = useState(true);
  const [agree2, setAgree2] = useState(true);
  const [submitState, setSubmitState] = useState<SubmitState>('editing');

  const isReadonly = submitState !== 'editing';

  function handleSave() {
    toast({ title: '임시저장', description: '임시저장되었습니다.', duration: 2000 });
  }

  function handleSubmit() {
    setSubmitState('submitted');
    toast({ title: '등록 완료', description: '리뷰가 등록되었습니다.', duration: 2000 });
  }

  function handleEdit() {
    setSubmitState('editing');
    toast({ title: '수정 모드', description: '리뷰를 수정할 수 있습니다.', duration: 2000 });
  }

  function handleComplete() {
    setSubmitState('completed');
    toast({ title: '완료', description: '리뷰가 최종 완료되었습니다.', duration: 2000 });
  }

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-center mb-6">제작 리뷰</h1>

              <div className="bg-white rounded-lg border">
                {/* 프로젝트 헤더 */}
                <div className="px-5 py-3 border-b flex items-center justify-between">
                  <button
                    className="flex items-center gap-2 font-medium text-gray-800 hover:text-pink-600"
                    onClick={() => setOpen(v => !v)}
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${open ? '' : '-rotate-90'}`} />
                    [베스트전자] TV 신제품 판매촉진 프로모션
                  </button>
                  <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>

                {open && (
                  <div className="p-6 space-y-0">
                    {/* 파트너기업 / 등록자 */}
                    <div className="flex gap-12 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">파트너기업</span>
                        <p className="font-medium text-gray-800 mt-0.5">솜사탕애드</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">등록자</span>
                        <p className="font-medium text-gray-800 mt-0.5">김비비고</p>
                      </div>
                    </div>

                    <hr className="my-4" />

                    {/* 의뢰사 만족도 */}
                    <div className="mb-2">
                      {CLIENT_ITEMS.map(item => (
                        <StarRow
                          key={item}
                          label={item}
                          value={clientRatings[item] ?? 0}
                          onChange={v => setClientRatings(prev => ({ ...prev, [item]: v }))}
                          disabled={isReadonly}
                        />
                      ))}
                    </div>

                    <hr className="my-4" />

                    {/* 파트너사 만족도 */}
                    <div className="mb-2">
                      {PARTNER_ITEMS.map(item => (
                        <StarRow
                          key={item}
                          label={item}
                          value={partnerRatings[item] ?? 0}
                          onChange={v => setPartnerRatings(prev => ({ ...prev, [item]: v }))}
                          disabled={isReadonly}
                        />
                      ))}
                    </div>

                    <hr className="my-4" />

                    {/* 리뷰 텍스트 */}
                    <div className="mb-4">
                      <Textarea
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        placeholder="김비비고님의 객관적이고 멋진 리뷰를 기대합니다. ^^"
                        className="min-h-[120px] resize-none"
                        disabled={isReadonly}
                      />
                    </div>

                    {/* 동의 체크박스 */}
                    <div className="space-y-2 mb-6">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <Checkbox
                          checked={agree1}
                          onCheckedChange={v => setAgree1(!!v)}
                          disabled={isReadonly}
                          className="mt-0.5"
                        />
                        <span className="text-sm text-gray-600">
                          입력하신 정보는 프로젝트 관리와 서비스 제공 목적에만 사용되는 것에 동의합니다.
                        </span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <Checkbox
                          checked={agree2}
                          onCheckedChange={v => setAgree2(!!v)}
                          disabled={isReadonly}
                          className="mt-0.5"
                        />
                        <span className="text-sm text-gray-600">
                          등록 후 7일 이내에만 수정이 가능합니다.
                        </span>
                      </label>
                    </div>

                    {/* 버튼 영역 */}
                    {submitState === 'editing' && (
                      <div className="space-y-2">
                        {/* 비활성 미리보기 (디자인 참고용) */}
                        <div className="flex gap-2">
                          <button disabled className="flex-1 py-2 rounded-full text-sm text-gray-400 bg-gray-100 cursor-not-allowed">
                            임시저장
                          </button>
                          <button disabled className="flex-1 py-2 rounded-full text-sm text-gray-400 bg-gray-100 cursor-not-allowed">
                            등록하기
                          </button>
                        </div>
                        {/* 활성 버튼 */}
                        <div className="flex gap-2">
                          <button className="btn-white flex-1" onClick={handleSave}>임시저장</button>
                          <button className="btn-pink flex-1" onClick={handleSubmit}>등록하기</button>
                        </div>
                      </div>
                    )}

                    {submitState === 'submitted' && (
                      <div className="space-y-2">
                        <button
                          className="w-full py-2.5 rounded-full text-sm font-medium text-white bg-gray-800 hover:bg-gray-900"
                          onClick={handleEdit}
                        >
                          수정 (등록후 7일 이내)
                        </button>
                        <button
                          className="w-full py-2.5 rounded-full text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200"
                          onClick={handleComplete}
                        >
                          완료
                        </button>
                      </div>
                    )}

                    {submitState === 'completed' && (
                      <div>
                        <button
                          disabled
                          className="w-full py-2.5 rounded-full text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed"
                        >
                          완료
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
