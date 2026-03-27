import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import CompanyCard from '@/components/work/company-card';
import portfolio1 from "@assets/A000561001259B_1760322383639.jpg";
import portfolio2 from "@assets/A000561002A4A6_1760322383641.jpg";
import portfolio3 from "@assets/5_1760322393353.png";
import portfolio4 from "@assets/Image_1760322393356.png";

export default function CompanyPortfolio() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    { id: 'company-info', label: '기업 정보' },
    { id: 'manager-info', label: '담당자 정보' },
    { id: 'experience', label: '경험·특화 분야/광고매체' },
    { id: 'purpose', label: '광고 목적별 전문 분야' },
    { id: 'technique', label: '제작 기법별 전문분야' },
    { id: 'clients', label: '대표 광고주' },
    { id: 'awards', label: '대표 수상내역' },
    { id: 'portfolio', label: '대표 포트폴리오' },
    { id: 'staff', label: '대표 스태프' },
    { id: 'recent-projects', label: '최근 참여 프로젝트' },
    { id: 'cotton-candy', label: '최근 Cotton Candy 활동' },
    { id: 'file-upload', label: '파일 업로드' },
    { id: 'intro', label: '기업 소개글' },
  ];

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <h1 className="work-title">회사소개서 & 포트폴리오</h1>

              {/* 소개서 카드 미리보기 */}
              <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
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
                <p className="text-sm text-gray-600 mt-4">※ 소개서 카드 - 다른 사용자에게 이렇게 보여집니다. ↑</p>
                <p className="text-sm text-blue-600 cursor-pointer hover:underline">※ 소개서 상세 내용 예시 ⓘ</p>
              </div>

              {/* 소개서 목록 */}
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-sm text-gray-600 w-20">공개</span>
                      <span className="text-sm font-medium flex-1">기본소개서 (자동생성됨)</span>
                      <span className="text-sm text-gray-500">2025-05-01</span>
                      <div className="flex gap-2">
                        <button className="text-sm text-gray-600 hover:text-pink-600" data-testid="button-view-1">보기</button>
                        <button className="text-sm text-gray-600 hover:text-pink-600" data-testid="button-copy-1">복사하기</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-sm text-gray-600 w-20">공개</span>
                      <span className="text-sm font-medium flex-1">Campaign creators 솜사탕애드 입</span>
                      <span className="text-sm text-gray-500">2025-07-03</span>
                      <div className="flex gap-2">
                        <button className="text-sm text-gray-600 hover:text-pink-600" data-testid="button-view-2">보기</button>
                        <button className="text-sm text-gray-600 hover:text-pink-600" data-testid="button-copy-2">복사하기</button>
                        <button className="text-sm text-gray-600 hover:text-pink-600" data-testid="button-edit-2">수정하기</button>
                        <button className="text-sm text-gray-600 hover:text-pink-600" data-testid="button-delete-2">삭제하기</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 새 소개서 등록하기 버튼 */}
              <div className="flex justify-center">
                <button className="btn-pink" data-testid="button-new-portfolio">
                  새 소개서 등록하기 +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
