import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const MOCK_PROJECTS = [{ id: '1', label: '[베스트전자] TV 신제품 판매촉진 프로모션' }];

const REVIEW_ITEMS = [
  '전반적 만족도',
  '기획의 명확성',
  '제작완성도',
  '피드백 반영과 응답 속도',
  '일정준수',
  '커뮤니케이션 명확성',
  '의사결정 및 응답 속도',
  '계약 및 정산 신뢰도',
  '협업 만족도',
] as const;

export default function WorkProjectReview() {
  const [projectId, setProjectId] = useState('1');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reviewText, setReviewText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const setRating = (item: string, value: number) => {
    setRatings((prev) => ({ ...prev, [item]: value }));
  };

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1 min-w-0">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="work-title">제작 리뷰</h1>
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
                {/* 파트너기업 / 등록자 — PDF */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500 text-sm">파트너기업</Label>
                      <p className="mt-1 font-medium text-gray-800">솜사탕애드</p>
                    </div>
                    <div>
                      <Label className="text-gray-500 text-sm">등록자</Label>
                      <p className="mt-1 font-medium text-gray-800">김비비고</p>
                    </div>
                  </div>
                </div>

                {/* 평점 항목 — PDF 리스트 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-sm font-semibold text-gray-800 mb-4">평가 항목</h2>
                  <div className="space-y-4">
                    {REVIEW_ITEMS.map((item) => (
                      <div key={item} className="flex flex-wrap items-center justify-between gap-4">
                        <Label className="text-gray-700 text-sm w-48 shrink-0">{item}</Label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => setRating(item, score)}
                              className={cn(
                                'p-1 rounded transition-colors',
                                (ratings[item] ?? 0) >= score
                                  ? 'text-pink-500 hover:text-pink-600'
                                  : 'text-gray-300 hover:text-gray-400'
                              )}
                            >
                              <Star
                                className="w-6 h-6"
                                fill={(ratings[item] ?? 0) >= score ? 'currentColor' : 'none'}
                                stroke="currentColor"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 리뷰 입력 — PDF */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <Label className="text-gray-700 text-sm font-medium block mb-2">리뷰</Label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="김비비고님의 객관적이고 멋진 리뷰를 기대합니다. ^^"
                    className="min-h-[120px]"
                  />
                </div>

                {/* 안내 — PDF */}
                <div className="text-sm text-gray-500 space-y-1">
                  <p>입력하신 정보는 프로젝트 관리와 서비스 제공 목적에만 사용되는 것에 동의합니다.</p>
                  <p>등록 후 7일 이내에만 수정이 가능합니다.</p>
                </div>

                {/* 버튼 — PDF: 임시저장 | 등록하기 / 수정 | 완료 */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" size="default" className="border-gray-300">
                    임시저장
                  </Button>
                  {!isSubmitted ? (
                    <Button
                      size="default"
                      className="bg-pink-600 hover:bg-pink-700"
                      onClick={() => setIsSubmitted(true)}
                    >
                      등록하기
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="default" className="border-gray-300">
                        수정 (등록후 7일 이내)
                      </Button>
                      <Button size="default" className="bg-pink-600 hover:bg-pink-700">
                        완료
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
