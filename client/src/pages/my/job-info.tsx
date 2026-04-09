import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import MySidebar from "@/components/my/my-sidebar";
import { Input } from "@/components/ui/input";

const MOCK_COMPANIES = [
  { id: 1, name: "애드크림", address: "서울특별시 강남구 도산대로12길 25 1논현동" },
  { id: 2, name: "애드팜", address: "서울특별시 서초구 강남대로 123 4층" },
  { id: 3, name: "애드웍스", address: "서울특별시 마포구 월드컵북로 56길 11" },
];

export default function JobInfo() {
  const [, setLocation] = useLocation();
  const [companyBiz, setCompanyBiz] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<{ id: number; name: string; address: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [job, setJob] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");

  const filteredCompanies = MOCK_COMPANIES.filter((c) =>
    companySearch.length > 0 && c.name.includes(companySearch)
  );

  const isValid = companySearch.length > 0 && job.length > 0;

  const handleCompanySelect = (company: typeof MOCK_COMPANIES[0]) => {
    setSelectedCompany(company);
    setCompanySearch(company.name);
    setShowDropdown(false);
  };

  const handleNewCompany = () => {
    setSelectedCompany({ id: 0, name: companySearch, address: "신규 등록" });
    setShowDropdown(false);
  };

  const handleConfirm = () => {
    if (!isValid) return;
    alert("직업 정보가 저장되었습니다.");
    setLocation("/my/profile");
  };

  return (
    <Layout>
      <div className="py-10 sm:py-12 md:py-16 bg-white min-h-screen">
        <div className="page-content">
          <div className="flex gap-12">
            <MySidebar />

            <div className="flex-1">
              {/* 헤더 */}
              <div className="text-center mb-10">
                <h1 className="page-title">"직업 정보"</h1>
                <p className="page-subtitle mt-4">
                  [프로젝트 등록·참여]를 하시려면 회사·직업정보를 입력해주세요.
                </p>
              </div>

              {/* 폼 */}
              <div className="options-container space-y-5">
                {/* 기업명 (사업자번호) */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title">
                    <span className="text-pink-500 mr-0.5">*</span> 기업명
                  </span>
                  <div className="flex-1">
                    <Input
                      placeholder='프리랜서인 경우에는 " 프리랜서" 로 입력해주세요.'
                      value={companyBiz}
                      onChange={(e) => setCompanyBiz(e.target.value)}
                      className="w-full"
                      data-testid="input-company-biz"
                    />
                  </div>
                </div>

                {/* 기업명 검색 */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title">
                    <span className="text-pink-500 mr-0.5">*</span> 기업명
                  </span>
                  <div className="flex-1 relative">
                    <Input
                      placeholder='프리랜서인 경우에는 " 프리랜서" 로 입력해주세요.'
                      value={companySearch}
                      onChange={(e) => {
                        setCompanySearch(e.target.value);
                        setSelectedCompany(null);
                        setShowDropdown(true);
                      }}
                      onFocus={() => companySearch && setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                      className="w-full"
                      data-testid="input-company-search"
                    />
                    {showDropdown && companySearch && (
                      <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-sm mt-0">
                        {filteredCompanies.map((company) => (
                          <button
                            key={company.id}
                            onMouseDown={() => handleCompanySelect(company)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                            data-testid={`company-option-${company.id}`}
                          >
                            <span className="font-medium text-gray-900">{company.name}</span>{" "}
                            <span className="text-gray-500 text-xs">{company.address}</span>
                          </button>
                        ))}
                        <button
                          onMouseDown={handleNewCompany}
                          className="w-full text-left px-4 py-2.5 text-sm text-pink-500 hover:bg-pink-50"
                          data-testid="company-new"
                        >
                          "{companySearch}" 신규등록
                        </button>
                      </div>
                    )}
                    {selectedCompany && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{selectedCompany.name}</span>{" "}
                        <span>{selectedCompany.address}</span>
                        {selectedCompany.id === 0 && (
                          <button
                            className="ml-2 text-pink-500 underline"
                            data-testid="company-new-link"
                          >
                            "{selectedCompany.name}" 신규등록
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 직무 */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title">
                    <span className="text-pink-500 mr-0.5">*</span> 직무
                  </span>
                  <div className="flex-1">
                    <Input
                      placeholder="ex) 기획자"
                      value={job}
                      onChange={(e) => setJob(e.target.value)}
                      className="w-full"
                      data-testid="input-job"
                    />
                  </div>
                </div>

                {/* 부서 */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title">부서</span>
                  <div className="flex-1">
                    <Input
                      placeholder="ex) 기획팀"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full"
                      data-testid="input-department"
                    />
                  </div>
                </div>

                {/* 직책 */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title">직책</span>
                  <div className="flex-1">
                    <Input
                      placeholder="ex) 신입연구원"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full"
                      data-testid="input-position"
                    />
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setLocation("/my/profile")}
                    className="btn-white flex-1 py-3 text-sm"
                    data-testid="button-later"
                  >
                    다음에 하기
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!isValid}
                    className={`flex-1 py-3 rounded-md text-sm font-medium transition-colors ${
                      isValid
                        ? "bg-pink-500 hover:bg-pink-600 text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    data-testid="button-confirm"
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
