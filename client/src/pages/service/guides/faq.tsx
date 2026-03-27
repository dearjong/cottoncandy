import { useState } from "react";
import GuideLayout from "@/components/guide/guide-layout";
import SearchBar from "@/components/common/search-bar";
import { Shield, Star, Award } from "lucide-react";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <GuideLayout>
      <div>
        <h1 className="page-title mb-8">"자주 묻는 질문 (FAQ)"</h1>
        
        <div className="space-y-6">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">프로젝트 등록이나 참여 신청에 비용이 발생하나요?</h3>
            <p className="text-gray-600">
              아니요, 프로젝트 등록과 참여 신청은 완전 무료입니다. 실제 계약이 체결된 후에만 수수료가 발생합니다.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">등급 기준이 어떻게 되나요?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Gold</p>
                  <p className="text-sm text-gray-600">TVCF.co.kr 포트폴리오 100건 이상, 리뷰 평균 4.7점 이상</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Silver</p>
                  <p className="text-sm text-gray-600">TVCF.co.kr 포트폴리오 50건 이상, 리뷰 평균 4.5점 이상</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bronze</p>
                  <p className="text-sm text-gray-600">TVCF.co.kr 포트폴리오 30건 이상, 리뷰 평균 4.0점 이상</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">신규</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">신규</p>
                  <p className="text-sm text-gray-600">활동 이력 없음</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p>※ 현재는 TVCF에 등록된 포트폴리오 기준으로 등급이 부여됩니다.</p>
              <p>※ 추후 Cotton Candy 내 실제 계약 건수 및 리뷰를 기준으로 등급이 조정될 예정입니다.</p>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">우리 회사 정보를 노출하고 싶지 않아요</h3>
            <p className="text-gray-600">
              비공개 프로젝트로 등록하시면 선택한 업체에게만 정보가 공개됩니다.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">계약은 어떻게 진행되나요?</h3>
            <p className="text-gray-600">
              파트너 선정 후 Cotton Candy 플랫폼을 통해 안전하게 계약서를 작성하고 전자서명으로 계약을 체결합니다.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">계약 후 분쟁이 발생하면 어떻게 처리되나요?</h3>
            <p className="text-gray-600">
              Cotton Candy 고객센터를 통해 분쟁 조정 서비스를 제공하며, 필요시 법적 지원도 연계해드립니다.
            </p>
          </div>

          <div className="mt-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="검색어를 입력하세요"
              testId="input-faq-search"
            />
          </div>
        </div>
      </div>
    </GuideLayout>
  );
}
