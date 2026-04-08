import { useState } from 'react';
import { Link } from 'wouter';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ExternalLink, Globe, Bookmark, Mail, Star, Trophy, CheckCircle2 } from 'lucide-react';
import portfolio1 from '@assets/A000561001259B_1760322383639.jpg';
import portfolio2 from '@assets/A000561002A4A6_1760322383641.jpg';
import portfolio3 from '@assets/5_1760322393353.png';
import portfolio4 from '@assets/Image_1760322393356.png';

const TABS = [
  { id: 'application', label: '참여신청', count: 2 },
  { id: 'ot',          label: 'OT',       count: 2 },
  { id: 'pt1',         label: 'PT1차',    count: 2 },
  { id: 'pt2',         label: 'PT2차',    count: 0 },
  { id: 'final',       label: '최종선정', count: 1 },
];

const COMPANIES = [
  {
    id: 1,
    initial: '솜',
    name: '솜사탕애드',
    type: 'Creative 중심 대행사',
    stars: 5,
    recentClients: '골드백화점, 블루리조트, 달콤커피, 스마트전자',
    pastClients: '아름건설, 하늘항공, 뷰티코스메틱, 마이패션',
    stats: ['35회', '75직원', '직원 20명 이상', '최소 제작비 2억↑'],
    industryTags: ['전기전자', '기업PR', '식품/제과', '공사/단체/공익/기업PR', '공공기관,정책캠페인', '#뷰티_쇼핑', '#급행제작 대응'],
    cottonCount: 3,
  },
  {
    id: 2,
    initial: '이',
    name: '이노선',
    type: 'Creative 중심 대행사',
    stars: 5,
    recentClients: '삼성전자, 소니, 오뚜기, 빙그레',
    pastClients: '아름건설, 하늘항공, 뷰티코스메틱, 마이패션',
    stats: ['35회', '75직원', '직원 20명 이상', '최소 제작비 2억↑'],
    industryTags: ['전기전자', '기업PR', '식품/제과', '공사/단체/공익/기업PR', '공공기관,정책캠페인', '#뷰티_쇼핑', '#급행제작 대응'],
    cottonCount: 3,
  },
];

const VISIBLE_TAGS = 4;

type TabToggles = Record<number, Record<string, boolean>>;

function TabActions({
  tab,
  companyId,
  toggles,
  onToggle,
}: {
  tab: string;
  companyId: number;
  toggles: TabToggles;
  onToggle: (companyId: number, key: string, v: boolean) => void;
}) {
  const val = (key: string) => toggles[companyId]?.[key] ?? false;
  const set = (key: string, v: boolean) => onToggle(companyId, key, v);

  if (tab === 'application') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">초대</span>
        <Switch checked={val('invite')} onCheckedChange={v => set('invite', v)} />
      </div>
    );
  }

  if (tab === 'ot') {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">OT참석확정</span>
          <Switch checked={val('ot_confirmed')} onCheckedChange={v => set('ot_confirmed', v)} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">OT참석완료</span>
          <Switch checked={val('ot_done')} onCheckedChange={v => set('ot_done', v)} />
        </div>
      </div>
    );
  }

  if (tab === 'pt1' || tab === 'pt2') {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">PT참석확정</span>
          <Switch
            checked={val('pt_confirmed')}
            onCheckedChange={v => set('pt_confirmed', v)}
            className="data-[state=checked]:bg-pink-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">PT완료</span>
          <Switch
            checked={val('pt_done')}
            onCheckedChange={v => set('pt_done', v)}
            className="data-[state=checked]:bg-pink-500"
          />
        </div>
      </div>
    );
  }

  if (tab === 'final') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">최종선정</span>
        <Switch checked={val('final_selected')} onCheckedChange={v => set('final_selected', v)} />
      </div>
    );
  }

  return null;
}

interface CompanyRowProps {
  company: typeof COMPANIES[0];
  activeTab: string;
  toggles: TabToggles;
  onToggle: (companyId: number, key: string, v: boolean) => void;
}

function CompanyRow({ company, activeTab, toggles, onToggle }: CompanyRowProps) {
  const visibleTags = company.industryTags.slice(0, VISIBLE_TAGS);
  const extraCount = company.industryTags.length - VISIBLE_TAGS;

  return (
    <div className="border rounded-lg p-5 bg-white">
      {/* 상단 행: 로고 + 회사정보 + 탭별 토글 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-pink-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {company.initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="font-bold text-base">{company.name}</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: company.stars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              {company.type}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <TabActions
            tab={activeTab}
            companyId={company.id}
            toggles={toggles}
            onToggle={onToggle}
          />
          <Bookmark className="w-4 h-4 text-gray-400 cursor-pointer hover:text-pink-500" />
        </div>
      </div>

      {/* 거래 클라이언트 */}
      <p className="text-sm text-gray-600 mb-1">
        [대표고주] <span className="text-gray-800">{company.recentClients}</span>
        <span className="text-gray-500 mx-1">[최근6개월]</span>
        {company.pastClients}
      </p>

      {/* 통계 */}
      <p className="text-sm text-gray-500 mb-3">
        [최근 3년]{' '}
        {company.stats.map((s, i) => (
          <span key={i}>
            {s}{i < company.stats.length - 1 && <span className="mx-1 text-gray-300">|</span>}
          </span>
        ))}
      </p>

      {/* 포트폴리오 이미지 */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[portfolio1, portfolio2, portfolio3, portfolio4].map((img, i) => (
          <div key={i} className="aspect-video rounded overflow-hidden bg-gray-100">
            <img src={img} alt={`포트폴리오 ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* 산업 태그 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {visibleTags.map((tag, i) => (
          <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
            {tag}
          </span>
        ))}
        {extraCount > 0 && (
          <span className="text-xs text-gray-400">+ {extraCount} more...</span>
        )}
      </div>

      {/* 하단: Cotton Candy 활동 + 아이콘 */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          ✓ Cotton Candy 활동 · {company.cottonCount}작품
        </span>
        <div className="flex items-center gap-3 text-gray-400">
          <Globe className="w-4 h-4 cursor-pointer hover:text-gray-600" />
          <Bookmark className="w-4 h-4 cursor-pointer hover:text-gray-600" />
          <Mail className="w-4 h-4 cursor-pointer hover:text-gray-600" />
        </div>
      </div>
    </div>
  );
}

export default function WorkProjectParticipation() {
  const [activeTab, setActiveTab] = useState('application');
  const [includeEnded, setIncludeEnded] = useState(false);
  const [toggles, setToggles] = useState<TabToggles>({});
  const [projectOpen, setProjectOpen] = useState(true);

  const handleToggle = (companyId: number, key: string, v: boolean) => {
    setToggles(prev => ({
      ...prev,
      [companyId]: { ...prev[companyId], [key]: v },
    }));
  };

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-center mb-6">참여현황</h1>

              <div className="bg-white rounded-lg border">
                {/* 프로젝트 헤더 */}
                <div className="px-5 py-3 border-b flex items-center justify-between">
                  <button
                    className="flex items-center gap-2 font-medium text-gray-800 hover:text-pink-600"
                    onClick={() => setProjectOpen(v => !v)}
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${projectOpen ? '' : '-rotate-90'}`} />
                    [베스트전자] TV 신제품 판매촉진 프로모션
                  </button>
                  <div className="flex items-center gap-4">
                    <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    <span className="text-sm text-gray-500">
                      AI 추천기업(2) | <span className="text-pink-500">♥</span> 관심기업(2)
                    </span>
                  </div>
                </div>

                {projectOpen && (
                  <>
                    {/* 단계 탭 */}
                    <div className="px-5 border-b">
                      <div className="flex gap-6">
                        {TABS.map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                              activeTab === tab.id
                                ? 'border-pink-500 text-pink-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {tab.label}
                            <span className={`ml-1 ${activeTab === tab.id ? 'text-pink-500' : 'text-gray-400'}`}>
                              ({tab.count})
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 필터 바 */}
                    <div className="px-5 py-3 border-b flex items-center justify-between">
                      <span className="text-sm text-gray-600">[ 참여기업 총: 7 ]</span>
                      <div className="flex items-center gap-4">
                        <select className="text-sm border border-gray-300 rounded px-2 py-1">
                          <option>등록순</option>
                          <option>이름순</option>
                        </select>
                        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                          <Checkbox
                            checked={!includeEnded}
                            onCheckedChange={v => setIncludeEnded(!v)}
                          />
                          진행중
                        </label>
                        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                          <Checkbox
                            checked={includeEnded}
                            onCheckedChange={v => setIncludeEnded(!!v)}
                          />
                          종료/취소 포함
                        </label>
                      </div>
                    </div>

                    {/* 카드 목록 */}
                    <div className="p-5 space-y-4">
                      {COMPANIES.map(c => (
                        <Link key={c.id} href="/work/project/company-profile">
                          <CompanyRow
                            company={c}
                            activeTab={activeTab}
                            toggles={toggles}
                            onToggle={handleToggle}
                          />
                        </Link>
                      ))}
                    </div>

                    {/* 페이지네이션 */}
                    <div className="px-5 py-3 border-t flex justify-center gap-1">
                      {['<<', '<', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '>', '>>'].map((p, i) => (
                        <button
                          key={i}
                          className={`px-2.5 py-1 text-sm rounded ${
                            p === 1 ? 'bg-pink-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    {/* 하단 액션 버튼 */}
                    <div className="px-5 py-4 border-t flex justify-center gap-3">
                      <button className="btn-white">메세지 발송</button>
                      <button className="btn-white">미선정 메세지 발송</button>
                      <button className="btn-pink">초대 확정</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
