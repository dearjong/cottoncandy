import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { Input } from "@/components/ui/input";
import { Building2, Info } from "lucide-react";
import { trackCompanyRegistered, trackCompanyVerificationRequested } from "@/lib/analytics";

const MOCK_COMPANIES = [
  { id: 1, name: "애드크림", address: "서울특별시 강남구 도산대로12길 25 1논현동" },
  { id: 2, name: "애드팜", address: "서울특별시 서초구 강남대로 123 4층" },
  { id: 3, name: "애드웍스", address: "서울특별시 마포구 월드컵북로 56길 11" },
  { id: 4, name: "솜사탕광고", address: "서울특별시 강남구 테헤란로 152" },
];

export default function SignupJobInfo() {
  const [, setLocation] = useLocation();
  const [companySearch, setCompanySearch] = useState("애드크림");
  const [selectedCompany, setSelectedCompany] = useState<{ id: number; name: string; address: string } | null>(
    { id: 1, name: "애드크림", address: "서울특별시 강남구 도산대로12길 25 1논현동" }
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [job, setJob] = useState("기획자");
  const [department, setDepartment] = useState("기획팀");
  const [position, setPosition] = useState("선임연구원");

  const filteredCompanies = MOCK_COMPANIES.filter(
    (c) => companySearch.length > 0 && c.name.includes(companySearch)
  );

  const isValid = (selectedCompany !== null || isNewCompany) && job.length > 0;

  const handleCompanySelect = (company: typeof MOCK_COMPANIES[0]) => {
    setSelectedCompany(company);
    setCompanySearch(company.name);
    setIsNewCompany(false);
    setShowDropdown(false);
  };

  const handleNewCompany = () => {
    setSelectedCompany({ id: 0, name: companySearch, address: "" });
    setIsNewCompany(true);
    setShowDropdown(false);
  };

  const handleSubmit = () => {
    if (!isValid || !selectedCompany) return;
    if (isNewCompany) {
      trackCompanyRegistered({ company_name: selectedCompany.name, company_type: "agency" });
    } else {
      trackCompanyVerificationRequested({
        company_name: selectedCompany.name,
        verification_type: "employment",
        company_id: String(selectedCompany.id),
      });
    }
    setLocation("/");
  };

  return (
    <Layout>
      <div className="py-10 sm:py-14 bg-white min-h-screen">
        <div className="page-content max-w-2xl mx-auto">

          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="page-title">"소속 기업 정보를 등록해 주세요."</h1>
            <p className="page-subtitle mt-3">
              기업 admin의 승인 후 기업 계정이 활성화돼요. 승인 전까지는 개인으로 활동할 수 있어요.
            </p>
          </motion.div>

          {/* 안내 배너 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-sm text-blue-700"
          >
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              기업 소속으로 활동한 프로젝트·계약 내역은 기업 admin도 볼 수 있어요.
              <strong className="ml-1">내 개인 기록은 별도로 보관되며, 기업을 나가도 사라지지 않아요.</strong>
            </span>
          </motion.div>

          {/* 폼 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="options-container space-y-5"
          >
            {/* 기업명 검색 */}
            <div className="project-section project-section-horizontal">
              <span className="project-section-title">
                <span className="text-pink-500 mr-0.5">*</span> 기업명
              </span>
              <div className="flex-1 relative">
                <Input
                  placeholder="기업명으로 검색해 주세요"
                  value={companySearch}
                  onChange={(e) => {
                    setCompanySearch(e.target.value);
                    setSelectedCompany(null);
                    setIsNewCompany(false);
                    setShowDropdown(true);
                  }}
                  onFocus={() => companySearch && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  className="w-full"
                  data-testid="input-company-search"
                />
                {showDropdown && companySearch && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-md mt-0">
                    {filteredCompanies.length > 0 && filteredCompanies.map((company) => (
                      <button
                        key={company.id}
                        onMouseDown={() => handleCompanySelect(company)}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        data-testid={`company-option-${company.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                          <div>
                            <span className="font-medium text-gray-900">{company.name}</span>
                            <span className="ml-2 text-xs text-gray-400">{company.address}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                    <button
                      onMouseDown={handleNewCompany}
                      className="w-full text-left px-4 py-3 text-sm text-pink-600 hover:bg-pink-50 flex items-center gap-2"
                      data-testid="company-new"
                    >
                      <span className="font-medium">+ "{companySearch}" 신규 등록</span>
                      <span className="text-xs text-pink-400">기업이 존재하지 않으면 새로 만들어요</span>
                    </button>
                  </div>
                )}

                {/* 선택된 기업 표시 */}
                {selectedCompany && !showDropdown && (
                  <div className={`mt-2 flex items-center gap-2 text-xs px-3 py-2 rounded-md ${isNewCompany ? "bg-pink-50 text-pink-700" : "bg-green-50 text-green-700"}`}>
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isNewCompany
                        ? `"${selectedCompany.name}" 신규 등록 — 기업 정보 검토 후 활성화돼요`
                        : `${selectedCompany.name} · ${selectedCompany.address} — 기업 admin 승인 후 활성화돼요`}
                    </span>
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
                onClick={() => setLocation("/")}
                className="btn-white flex-1 py-3 text-sm"
                data-testid="button-skip"
              >
                나중에 등록할게요
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isValid}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isValid
                    ? "bg-pink-500 hover:bg-pink-600 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                data-testid="button-submit"
              >
                등록 신청하기
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}
