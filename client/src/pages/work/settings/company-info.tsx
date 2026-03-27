import { useState } from "react";
import Layout from "@/components/layout/layout";
import WorkSidebar from "@/components/work/sidebar";

export default function SettingsCompanyInfo() {
  const [companyType, setCompanyType] = useState('');

  const agencySubTypes = ['종합대행', '전략중심', 'Creative 중심', '제작 중심', '퍼포먼스 중심', '소규모', '프리랜서'];
  const productionSubTypes = ['종합 제작', '연출 중심', '촬영 중심', '편집/후반 중심', '콘텐츠 중심', '소규모', '프리랜서'];

  const getSubTypes = () => {
    if (companyType === '대행사') return agencySubTypes;
    if (companyType === '제작사') return productionSubTypes;
    return [];
  };

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1">
            <h1 className="work-title">기업 정보</h1>
            <p className="text-sm text-gray-500 mb-8">TVCF의 기업정보와 연동되어 업데이트 됩니다.</p>

            <div className="inline-block bg-gray-800 text-white text-xs px-3 py-1 rounded mb-4">1. 기본정보</div>
            <div className="space-y-4 mb-8 pb-8 border-b">
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 기업명</label>
                <input type="text" placeholder="ex) 예스 커뮤니케이션" className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">기업명 (영어)</label>
                <input type="text" placeholder="Inc, Ltd 등은 빼고 기재해주세요" className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 한줄소개</label>
                <input type="text" placeholder="ex) 한줄소개를 입력해 주세요." className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 업종</label>
                <input type="text" placeholder="최대 4개까지 등록 가능합니다." className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 설립년월</label>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="ex) 2001" className="w-32 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
                  <span className="text-sm">년</span>
                  <input type="text" placeholder="ex) 5" className="w-24 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
                  <span className="text-sm">월</span>
                </div>
              </div>
            </div>

            <div className="inline-block bg-gray-800 text-white text-xs px-3 py-1 rounded mb-4">2. 상세정보</div>
            <div className="space-y-4 mb-8 pb-8 border-b">
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 대표자 성명</label>
                <input type="text" placeholder="ex) 김영석" className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 대표 전화</label>
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white">
                    <span>+</span>
                    <select className="bg-transparent border-none text-sm">
                      <option>▼</option>
                    </select>
                  </div>
                  <span>-</span>
                  <input type="text" placeholder="ex) 02-1234-5678" className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 대표 이메일</label>
                <input type="email" placeholder="ex) ceo@tvcf.co.kr" className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 우편번호</label>
                <div className="flex items-center gap-4 flex-1">
                  <input type="text" placeholder="ex) 06039" className="w-32 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
                  <span className="text-sm text-pink-500 cursor-pointer">주소검색</span>
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 주소</label>
                <input type="text" placeholder="ex) 서울 강남구 도산대로73길 25-7" className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 상세주소</label>
                <input type="text" placeholder="ex) 중앙프라자 본관 A동" className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">Website</label>
                <input type="text" placeholder="ex) www.tvcf.co.kr" className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
              </div>
            </div>

            <div className="inline-block bg-gray-800 text-white text-xs px-3 py-1 rounded mb-4">3. 상세소개</div>
            <div className="space-y-4 mb-8 pb-8 border-b">
              <div className="flex items-start">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0 pt-2">로고</label>
                <div className="w-20 h-20 border border-gray-300 rounded-lg flex items-center justify-center bg-white">
                  <span className="text-gray-400 text-xs">LOGO</span>
                </div>
              </div>
              <div className="flex items-start">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0 pt-2">상세소개</label>
                <textarea 
                  placeholder="ex) 회사소개 등에 입력해 주세요."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm h-24 resize-none bg-white"
                />
              </div>
            </div>

            <div className="inline-block bg-gray-800 text-white text-xs px-3 py-1 rounded mb-4">4. 기업정보</div>
            <div className="space-y-4 mb-8 pb-8 border-b">
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 기업유형</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="companyType" 
                      className="accent-pink-500" 
                      checked={companyType === '광고주'}
                      onChange={() => setCompanyType('광고주')}
                    />
                    <span className="text-sm">광고주</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="companyType" 
                      className="accent-pink-500"
                      checked={companyType === '대행사'}
                      onChange={() => setCompanyType('대행사')}
                    />
                    <span className="text-sm">대행사</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="companyType" 
                      className="accent-pink-500"
                      checked={companyType === '제작사'}
                      onChange={() => setCompanyType('제작사')}
                    />
                    <span className="text-sm">제작사</span>
                  </label>
                </div>
              </div>
              {(companyType === '대행사' || companyType === '제작사') && (
                <div className="flex items-center">
                  <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 세부유형</label>
                  <select className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="">선택해 주세요</option>
                    {getSubTypes().map((subType) => (
                      <option key={subType} value={subType}>{subType}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 최소 제작비</label>
                <select className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="">선택해 주세요</option>
                  <option value="5천만 원 미만">5천만 원 미만</option>
                  <option value="5천만 원 ~ 1억">5천만 원 ~ 1억</option>
                  <option value="1억 ~ 2억">1억 ~ 2억</option>
                  <option value="2억 ~ 5억">2억 ~ 5억</option>
                  <option value="5억 이상">5억 이상</option>
                </select>
              </div>
              <div className="flex items-start">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0 pt-1">* 서비스 범위</label>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-pink-500" />
                      <span className="text-sm">전략기획</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-pink-500" />
                      <span className="text-sm">크리에이티브 기획</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-pink-500" />
                      <span className="text-sm">영상 제작</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-pink-500" />
                      <span className="text-sm">미디어 집행</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-pink-500" />
                      <span className="text-sm">성과 측정 및 리포팅</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-pink-500" />
                      <span className="text-sm">인플루언서/SNS/바이럴</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-pink-500" />
                      <span className="text-sm">PR/컨텐츠/오피스 대응</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-pink-500" />
                      <span className="text-sm">오프라인 이벤트/프로모션</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0 pt-1">업종 대응</label>
                <div className="flex-1 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-pink-500" />
                    <span className="text-sm">금융 패키 대응</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-pink-500" />
                    <span className="text-sm">성인 성인목/담배/가능</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-pink-500" />
                    <span className="text-sm">일반 유흥/성인대응</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-pink-500" />
                    <span className="text-sm">아테/인/의료/대응</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 기업규모</label>
                <select className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="">선택해 주세요</option>
                  <option value="대기업">대기업 (상장사 또는 연매출 1,000억 이상)</option>
                  <option value="중견기업">중견기업 (연매출 100억~1,000억 또는 임직원 100명 이상)</option>
                  <option value="중소기업">중소기업 (연매출 100억 미만 또는 임직원 100명 이하)</option>
                  <option value="스타트업">스타트업 (창업 7년 이내, 빠르게 성장 중인 기업)</option>
                  <option value="외국계 기업">외국계 기업 (본사가 해외에 있는 기업 또는 다국적 법인)</option>
                  <option value="공공기관/공기업">공공기관/공기업 (정부 부처, 지자체, 산하기관 등)</option>
                  <option value="비영리기관">비영리기관 (비영리 재단, 협회, 단체 등)</option>
                  <option value="개인">개인 (프리랜서, 크리에이터 브랜드, 1인 기업 등)</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 직원수</label>
                <select className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="">선택해 주세요</option>
                  <option value="1명">1명</option>
                  <option value="2명 이상">2명 이상</option>
                  <option value="5명 이상">5명 이상</option>
                  <option value="10명 이상">10명 이상</option>
                  <option value="20명 이상">20명 이상</option>
                  <option value="30명 이상">30명 이상</option>
                  <option value="50명 이상">50명 이상</option>
                  <option value="100명 이상">100명 이상</option>
                  <option value="300명 이상">300명 이상</option>
                  <option value="500명 이상">500명 이상</option>
                  <option value="1000명 이상">1000명 이상</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">TVCF 포트폴리오</label>
                <input type="text" placeholder="ex) star.tvcf.co.kr/vega" className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
              </div>
              <div className="flex items-start">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0"></label>
                <p className="text-xs text-gray-400">* TVCF 연계 홈페이지 프로필 및 회사소개와 포트폴리오가 업데이트 됩니다.</p>
              </div>
            </div>

            <div className="inline-block bg-gray-800 text-white text-xs px-3 py-1 rounded mb-4">5. 사업자정보</div>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0 pt-2">* 사업자등록번호</label>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="ex) 1" className="w-24 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
                    <span>-</span>
                    <input type="text" placeholder="ex) 12" className="w-24 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
                    <span>-</span>
                    <input type="text" placeholder="ex) 12345" className="w-32 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" />
                    <span className="text-sm text-pink-500 cursor-pointer">국세청 인증</span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>법인사: 예스커뮤니케이션(주) 법인 2025-11-05 19:22</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>확인된 거래정보:사업자 정보 완료 (5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">●</span>
                      <span>폐업 조회 (요청 시..)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0">* 사업자유형</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="bizType" className="accent-pink-500" />
                    <span className="text-sm">법인사업자</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="bizType" className="accent-pink-500" />
                    <span className="text-sm">개인사업자</span>
                  </label>
                </div>
              </div>
              <div className="flex items-start">
                <label className="w-32 text-sm text-gray-600 flex-shrink-0 pt-2">* 사업자<br/>등록증</label>
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <input type="text" placeholder="등록증/사업자등록증을 업로드해 주세요. 업로드 시 승인처리 등의 필요한 절차를 위한 필수 제출서류입니다." className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white" readOnly />
                    <span className="text-sm text-pink-500 cursor-pointer">Upload</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              <button className="px-4 py-3 text-sm text-gray-600 bg-gray-100 rounded-lg">사업자 인증 요청</button>
              <button className="px-4 py-3 text-sm text-gray-600 bg-gray-100 rounded-lg">사업자기준신청</button>
              <button className="px-4 py-3 text-sm text-gray-600 bg-gray-100 rounded-lg">사업자중대 인증요청(비밀번호재입력)</button>
              <button className="px-4 py-3 text-sm text-white bg-pink-500 rounded-lg">등록하기</button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
