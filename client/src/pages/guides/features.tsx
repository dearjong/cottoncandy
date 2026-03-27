import GuideLayout from "@/components/guide/guide-layout";

export default function Features() {
  return (
    <GuideLayout>
      <div>
        <h1 className="page-title mb-8">"영상광고의 시작은 왜 Cotton Candy인가?"</h1>
        
        <div className="space-y-8">
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">국내최초 광고 전문 플랫폼!</h3>
            <p className="text-gray-700">
              광고 제작 프로세스부터 비딩, PT, KPI 관리까지 광고 업계 표준에 맞춘 특화 시스템을 제공합니다.
            </p>
          </div>

          <div className="p-6 bg-pink-50 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">검증된 파트너</h3>
            <p className="text-gray-700">
              국내 최대 광고 플랫폼 TVCF에서 다수의 포트폴리오가 등록된 실적과 평판이 검증된 대행사와 제작사만이 참여합니다.
            </p>
          </div>

          <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">이 모든것이 무료!</h3>
            <p className="text-gray-700">
              프로젝트 등록부터 파트너 매칭까지 모든 서비스를 무료로 이용하실 수 있습니다.
            </p>
          </div>

          <div className="p-6 bg-purple-50 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">가장 적합한 파트너를 찾아드립니다.</h3>
            <p className="text-gray-700">
              광고주가 원하는 산업, 예산, 스타일에 맞춰 AI와 전문가 추천을 통해 가장 적합한 파트너를 매칭합니다.
            </p>
          </div>

          <div className="p-6 bg-yellow-50 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">체계적인 시스템</h3>
            <p className="text-gray-700">
              광고 제작 프로세스부터 비딩, PT, KPI 관리까지 광고 업계 표준에 맞춘 특화 시스템을 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </GuideLayout>
  );
}
