import { useState } from 'react';
import { Link, useParams } from 'wouter';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { FileText, Download, ExternalLink, Plus, Edit, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const CONCEPT_TABS = [
  { value: 'concept1', label: 'Concept 영상' },
  { value: 'concept2', label: 'Concept 곰' },
  { value: 'concept3', label: 'Concept 봄날의 곰' },
  { value: 'concept4', label: 'Concept 솜+남' },
];

const MOCK_CONCEPT_OVERVIEW = `[베스트전자] 스탠바이미2 판매촉진 프로모션은 제품의 핵심 특성인 이동성과 감성적 사용 경험을 소비자의 일상 속에서 자연스럽게 스며들도록 제안하는 캠페인입니다.

이노션은 '움직이는 무드, 나만의 TV'라는 메시지 아래, 스탠바이미2를 감성적으로 각인시키는 영상 중심의 체험 기반 콘텐츠를 제시합니다.

이번 프로젝트는 제품 인지도 제고, 감성 브랜드 포지셔닝, 구매 전환율 상승을 주요 KPI로 설정하여 MZ세대와 1인 가구 중심의 고객에게 다가갑니다.`;

const MOCK_SIANS = [
  {
    no: '시안1',
    title: '봄날의 젤리를 좋아하세요?',
    desc: '스탠바이미2의 부드럽고 감성적인 이미지와 함께, 사용자의 일상에 따뜻하게 스며드는 스토리를 전개. 벚꽃 아래 분홍 곰과의 교감으로 브랜드 친밀도를 높임.',
    type: '박보영',
    cost: '6억',
  },
  {
    no: '시안2',
    title: '봄날의 젤리를 좋아하세요?',
    desc: '모델이 젤리인형을 안고 행복해 한다.',
    type: '박보영',
    cost: '6억',
  },
  {
    no: '시안3',
    title: '봄날의 젤리를 좋아하세요?',
    desc: '모델이 젤리인형을 안고 행복해 한다.',
    type: '박보영',
    cost: '6억',
  },
  {
    no: '시안4',
    title: '봄날의 젤리를 좋아하세요?',
    desc: '모델이 젤리인형을 안고 행복해 한다.',
    type: '박보영',
    cost: '6억',
  },
];

const MOCK_DOCUMENTS = [
  { name: '[HSAD] 포트폴리오_20250607.pdf', date: '2025-04-06' },
  { name: '[HSAD] 사업자 현황 2025.pdf', date: '2025-04-06' },
  { name: '[HSAD] 소포제, 기획서 2025.pdf', date: '2025-04-06' },
];

const MOCK_COMPANY_NAMES: Record<string, string> = {
  '1': '솜사탕애드',
  '2': '목화솜기획',
  '3': '광고천재',
  '4': '웃음꽃기획',
  '5': '무지개애드',
  '6': '블루밍기획',
};

/** 체리블로섬 히어로 이미지 플레이스홀더 */
function ConceptHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 aspect-[16/7] flex items-end">
      {/* 배경 장식 */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden select-none pointer-events-none">
        <div className="relative w-full h-full">
          {/* 벚꽃 배경 원형 */}
          <div className="absolute top-4 left-1/4 w-32 h-32 rounded-full bg-pink-200/60 blur-2xl" />
          <div className="absolute top-8 right-1/4 w-24 h-24 rounded-full bg-rose-200/70 blur-xl" />
          <div className="absolute bottom-8 left-1/3 w-40 h-40 rounded-full bg-pink-100/80 blur-3xl" />
          {/* 핑크 곰 실루엣 */}
          <div className="absolute right-16 bottom-0 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-pink-300/80 relative">
              <div className="absolute -top-5 left-2 w-7 h-7 rounded-full bg-pink-300/80" />
              <div className="absolute -top-5 right-2 w-7 h-7 rounded-full bg-pink-300/80" />
            </div>
            <div className="w-16 h-24 rounded-b-3xl bg-pink-300/80 -mt-2" />
          </div>
          {/* 벚꽃 잎 */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-pink-300/50"
              style={{
                top: `${10 + (i * 7) % 60}%`,
                left: `${5 + (i * 13) % 80}%`,
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
      </div>
      {/* 재생 버튼 */}
      <button
        type="button"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/80 flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        aria-label="영상 재생"
      >
        <Play className="w-6 h-6 text-pink-600 fill-pink-600 ml-1" />
      </button>
      {/* 하단 캡션 */}
      <div className="relative w-full px-5 py-4 bg-gradient-to-t from-black/40 to-transparent">
        <p className="text-white text-sm font-bold">{title}</p>
        <p className="text-white/80 text-xs mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

/** 시안 썸네일 */
function SianThumb() {
  return (
    <div className="w-16 h-12 rounded overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-pink-300 flex items-center justify-center shrink-0">
      <Play className="w-4 h-4 text-pink-500 fill-pink-400" />
    </div>
  );
}

export default function WorkProjectProposalView() {
  const params = useParams<{ companyId: string }>();
  const companyId = params.companyId ?? '1';
  const companyName = MOCK_COMPANY_NAMES[companyId] ?? '솜사탕애드';

  const [projectOpen, setProjectOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('concept1');

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="work-title mb-5">제안서·시안 <span className="text-gray-400 font-normal text-lg">(보기)</span></h1>

              {/* 프로젝트 아코디언 */}
              <div className="mb-5 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {/* 프로젝트 행 */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                  onClick={() => setProjectOpen((v) => !v)}
                >
                  <span className="text-sm font-semibold text-slate-800">
                    ● [베스트전자] TV 신제품 판매촉진 프로모션
                  </span>
                  {projectOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {/* 버전 행 */}
                <div className="border-t border-slate-100">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors"
                    onClick={() => setVersionOpen((v) => !v)}
                  >
                    <span className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      <span className="text-pink-500">▼</span>
                      [{companyName}] Version_1
                    </span>
                    {versionOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>
              </div>

              <div className="space-y-5">

                {/* ─── 섹션 1: 선진입 설정 안내 ─── */}
                <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800">1. 선진입 설정 안내</h2>
                  </div>
                  <div className="px-5 py-5">
                    <p className="text-xs font-semibold text-slate-500 mb-3">Concept Overview</p>
                    <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{MOCK_CONCEPT_OVERVIEW}</p>
                  </div>
                </section>

                {/* ─── 섹션 2: 제안서 ─── */}
                <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800">2. 제안서</h2>
                  </div>
                  <div className="px-5 py-5 grid grid-cols-2 gap-4">
                    {/* 전략 제안서 */}
                    <div className="rounded-xl overflow-hidden border border-pink-100">
                      <div className="px-4 py-2.5 bg-pink-50 border-b border-pink-100">
                        <p className="text-xs font-semibold text-pink-700">전략 제안서</p>
                      </div>
                      <div className="bg-pink-50 px-4 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-pink-200 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-pink-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-pink-700 truncate">Strategic Proposal.pdf</p>
                          <p className="text-xs text-pink-400 mt-0.5">2024-11-05 · 5.2 MB</p>
                        </div>
                      </div>
                    </div>
                    {/* 크리에이티브 제안서 시안 */}
                    <div className="rounded-xl overflow-hidden border border-rose-100">
                      <div className="px-4 py-2.5 bg-rose-50 border-b border-rose-100">
                        <p className="text-xs font-semibold text-rose-700">크리에이티브 제안서 시안</p>
                      </div>
                      <div className="bg-rose-50 px-4 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-rose-200 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-rose-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-rose-700 truncate">Creative Proposal.pdf</p>
                          <p className="text-xs text-rose-400 mt-0.5">2024-11-05 · 8.7 MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ─── 섹션 3: 컨셉물 시안 ─── */}
                <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800">3. 컨셉물 시안</h2>
                  </div>
                  <div className="px-5 py-5 space-y-5">
                    {/* 히어로 시안 */}
                    <ConceptHero
                      title="[Concept1] 펄리 - 봄날의 젤리를 좋아하세요? (시안1)"
                      subtitle="스탠바이미2의 부드럽고 감성적인 이미지와 함께, 사용자의 일상에 따뜻하게 스며드는 스토리를 전개."
                    />
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">상징적</span> 0.5 s
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">전략</span> 20 초
                      </span>
                    </div>

                    {/* 탭 */}
                    <div>
                      <div className="flex border-b border-slate-200 gap-0 overflow-x-auto">
                        {CONCEPT_TABS.map((tab) => (
                          <button
                            key={tab.value}
                            type="button"
                            onClick={() => setActiveTab(tab.value)}
                            className={cn(
                              'shrink-0 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap',
                              activeTab === tab.value
                                ? 'border-pink-500 text-pink-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700',
                            )}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* 시안 테이블 */}
                      <div className="mt-3 rounded-lg border border-slate-200 overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="text-center py-2.5 px-3 font-semibold text-slate-600 w-14">No</th>
                              <th className="text-left py-2.5 px-3 font-semibold text-slate-600 w-20">탐방하지/파일</th>
                              <th className="text-left py-2.5 px-3 font-semibold text-slate-600">설명</th>
                              <th className="text-center py-2.5 px-3 font-semibold text-slate-600 w-20">유형</th>
                              <th className="text-center py-2.5 px-3 font-semibold text-slate-600 w-16">레저</th>
                            </tr>
                          </thead>
                          <tbody>
                            {MOCK_SIANS.map((row) => (
                              <tr key={row.no} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                <td className="text-center py-3 px-3 text-slate-500 font-medium">{row.no}</td>
                                <td className="py-3 px-3">
                                  <SianThumb />
                                </td>
                                <td className="py-3 px-3">
                                  <p className="font-semibold text-slate-700 text-[11px] mb-0.5">{row.title}</p>
                                  <p className="text-slate-500 text-[11px] leading-relaxed">{row.desc}</p>
                                </td>
                                <td className="text-center py-3 px-3 text-slate-600">{row.type}</td>
                                <td className="text-center py-3 px-3 text-slate-600">{row.cost}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <p className="mt-2 text-xs text-slate-400">제작비 6억원 · 총견적 20억원</p>
                    </div>
                  </div>
                </section>

                {/* ─── 섹션 4: 파트너사 & 포트폴리오 ─── */}
                <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800">4. 파트너사 & 포트폴리오</h2>
                  </div>
                  <div className="px-5 py-4">
                    <Link
                      href="/work/project/company-profile"
                      className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700"
                    >
                      🌸 [{companyName}] 기본 파트너사 파일 &amp; 포트폴리오
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </section>

                {/* ─── 섹션 5: 제출물 ─── */}
                <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-5 py-3.5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-800">5. 제출물</h2>
                  </div>
                  <div className="px-5 py-4">
                    <div className="space-y-2 mb-4">
                      {MOCK_DOCUMENTS.map((f) => (
                        <div key={f.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50">
                          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 truncate">{f.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{f.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      전체파일 다운로드
                    </button>

                    {/* 자료열람기간 */}
                    <div className="mt-4 space-y-1 text-[11px] text-slate-400 leading-relaxed">
                      <p className="font-semibold text-slate-500 mb-1">[자료열람기간]</p>
                      <p>※ 자료열람기간: 프로젝트 종료 후 6개월까지 열람 가능.</p>
                      <p>※ 선정된 기업의 자료는 프로젝트 종료 후 6개월까지 열람이 가능합니다.</p>
                      <p>※ 미선정된 기업의 자료는 의뢰기업에 즉시 비공개되며, 자료를 업로드한 참여기업은 등록 후 6개월까지 확인 가능합니다.</p>
                    </div>
                  </div>
                </section>

                {/* ─── 하단 버튼 (2행) ─── */}
                <div className="pb-8 space-y-2">
                  {/* 1행 */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      제안서 추가
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      수정하기
                    </button>
                    <button
                      type="button"
                      className="ml-auto px-4 py-2 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors"
                    >
                      이 파트너사와 협의를 원해요
                    </button>
                  </div>
                  {/* 2행 */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3 py-2 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      AI 소비자반응 실험
                    </button>
                    <button
                      type="button"
                      className="ml-auto px-5 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
                    >
                      파트너 제안서 채택
                    </button>
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
