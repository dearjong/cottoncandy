import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import CompanyCard from '@/components/work/company-card';
import { BackToListButton } from '@/components/BackToListButton';
import portfolio1 from "@assets/A000561001259B_1760322383639.jpg";
import portfolio2 from "@assets/A000561002A4A6_1760322383641.jpg";
import portfolio3 from "@assets/5_1760322393353.png";
import portfolio4 from "@assets/Image_1760322393356.png";

const CompanyProfileBody = () => (
  <div>
    <h1 className="work-title mb-6">참여기업 회사소개&amp;포트폴리오</h1>

    {/* 1. 상단 참여기업 카드 영역 */}
    <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
      <CompanyCard
        logoText="솜"
        companyName="솜사탕애드"
        companyType="Creative중심 대행사"
        clients="골드백화점, 블루리조트, 달콤커피, 스마트전자 [최근6개월] 아름건설, 하늘항공, 뷰티코스메틱, 마이패션"
        stats="[최근 3년] 35회 75작품 | 직원 20명 이상 | 최소 제작비 2억 ↑"
        industryTags={['전기전자', '기업PR', '식품/제과', '공사/단체/공익/기업PR']}
        specialtyTags={['#공공기관_정책캠페인', '#뷰티_숏폼', '#급행제작 대응']}
        cottonCandyWorks="✓ Cotton Candy 활동 - 3작품"
        portfolioImages={[portfolio1, portfolio2, portfolio3, portfolio4]}
        showMessageButton={true}
        variant="agency-search"
      />
    </div>

    {/* 2. 회사 소개 텍스트 영역 */}
    <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
      <h2 className="text-lg font-semibold mb-4">Company creators 솜사탕애드 입니다.</h2>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        Campaign creative 솜사탕애드는 전기전자, 식품/제과, 공공기관/정책캠페인 영역에서
        다수의 브랜드와 함께 해 온 크리에이티브 중심 대행사입니다. 브랜드 인지도 제고부터
        제품 판매 촉진까지, 온·오프라인을 아우르는 통합 캠페인을 기획·제작합니다.
      </p>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        주요 클라이언트로는 베스트전자, 골드백화점, 블루리조트, 달콤커피 등이 있으며,
        TVCF와 디지털 영상 포트폴리오를 기반으로 브랜드 메시지를 효과적으로 전달하는
        스토리텔링에 강점을 가지고 있습니다.
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">
        급행 제작 대응, 경쟁사 수행기업 제외, 리젝션 Fee 등 까다로운 조건의 프로젝트도
        안정적으로 수행해 온 경험을 기반으로, 광고주와 파트너십을 중요하게 생각합니다.
      </p>
    </div>

    {/* 3. 대표 포트폴리오 섹션 */}
    <div className="bg-white rounded-lg shadow-sm mb-8">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-base font-semibold">대표 포트폴리오</h2>
        <span className="text-xs text-gray-500">최근 3년 기준</span>
      </div>
      <div className="p-6 grid grid-cols-4 gap-4">
        {[portfolio1, portfolio2, portfolio3, portfolio4].map((img, idx) => (
          <div key={idx} className="bg-gray-100 rounded overflow-hidden">
            <img src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-32 object-cover" />
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-gray-800 truncate">
                프로젝트 제목 {idx + 1}
              </p>
              <p className="text-[11px] text-gray-500 truncate">
                전기전자 · 브랜드 캠페인
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 4. 주요 스태프 섹션 */}
    <div className="bg-white rounded-lg shadow-sm mb-8">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-base font-semibold">주요 스태프</h2>
      </div>
      <div className="p-6 space-y-3">
        {[
          { name: "김크리에이티브", role: "CD / 총괄", desc: "전기전자/브랜드 캠페인 15년 경력" },
          { name: "이프로듀서", role: "CP", desc: "글로벌 캠페인 / 대형 프로모션 경험 다수" },
          { name: "박디렉터", role: "Film Director", desc: "TVC / 디지털 영상 연출" },
        ].map((m) => (
          <div key={m.name} className="flex items-start justify-between border-b last:border-b-0 pb-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{m.name}</p>
              <p className="text-xs text-gray-600">{m.role}</p>
            </div>
            <p className="text-xs text-gray-500 max-w-md text-right">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* 5. 최근 참여 프로젝트 섹션 */}
    <div className="bg-white rounded-lg shadow-sm mb-8">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-base font-semibold">최근 참여 프로젝트</h2>
      </div>
      <div className="p-6 space-y-2 text-sm text-gray-700">
        <div className="flex items-center justify-between">
          <span>[베스트전자] 스탠바이미2 판매촉진 프로모션</span>
          <span className="text-xs text-gray-500">TVC / 디지털 캠페인</span>
        </div>
        <div className="flex items-center justify-between">
          <span>[골드백화점] 봄 시즌 프로모션 캠페인</span>
          <span className="text-xs text-gray-500">옥외 / 디지털</span>
        </div>
        <div className="flex items-center justify-between">
          <span>[달콤커피] 브랜디드 콘텐츠 영상 시리즈</span>
          <span className="text-xs text-gray-500">유튜브 / SNS</span>
        </div>
      </div>
    </div>

    {/* 6. Cotton Candy 활동 섹션 */}
    <div className="bg-white rounded-lg shadow-sm mb-10">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-base font-semibold">Cotton Candy 내 활동</h2>
        <span className="text-xs text-gray-500">총 3작품</span>
      </div>
      <div className="p-6 grid grid-cols-4 gap-4">
        {[portfolio2, portfolio3, portfolio4].map((img, idx) => (
          <div key={idx} className="bg-gray-100 rounded overflow-hidden">
            <img src={img} alt={`CC Activity ${idx + 1}`} className="w-full h-24 object-cover" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function WorkCompanyProfile() {
  const isEmbed = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === '1';

  if (isEmbed) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <CompanyProfileBody />
      </div>
    );
  }

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <BackToListButton href="/work/project/participation" />
              </div>
              <CompanyProfileBody />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
