import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";

const MOCK_COMPANIES = [
  { id: 1, name: "애드크림", address: "서울특별시 강남구 도산대로12길 25 1논현동" },
  { id: 2, name: "애드팜", address: "서울특별시 서초구 강남대로 123 4층" },
  { id: 3, name: "애드웍스", address: "서울특별시 마포구 월드컵북로 56길 11" },
];

export default function SignupAccountType() {
  const [, setLocation] = useLocation();
  const [accountType, setAccountType] = useState<"freelancer" | "company">("company");
  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<{ id: number; name: string; address: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [job, setJob] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [agreed, setAgreed] = useState(false);

  const filteredCompanies = MOCK_COMPANIES.filter((c) =>
    companySearch.length > 0 && c.name.includes(companySearch)
  );

  const isFormValid = agreed && (accountType === "freelancer" || (companySearch && job));

  const handleCompanySelect = (company: typeof MOCK_COMPANIES[0]) => {
    setSelectedCompany(company);
    setCompanySearch(company.name);
    setShowDropdown(false);
  };

  const handleNewCompany = () => {
    setSelectedCompany({ id: 0, name: companySearch, address: "신규 등록" });
    setShowDropdown(false);
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    setLocation("/signup/email");
  };

  return (
    <Layout>
      <div className="py-8 sm:py-10 md:py-12 bg-white min-h-screen">
        <div className="page-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h1 className="page-title">"계정 유형을 선택해 주세요."</h1>
            <p className="page-subtitle mt-4">
              광고주 또는 신규 가입자가 광고제작 의뢰 등록 시 TVCF PRO서비스 1년 무료!{" "}
              <button className="text-pink-500 underline text-sm">자세히&gt;</button>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="options-container"
          >
            {/* 계정 유형 선택 카드 */}
            <div className="flex gap-4 mb-8 justify-center">
              <button
                onClick={() => setAccountType("freelancer")}
                className={`w-52 py-6 px-4 rounded-lg border-2 text-center transition-all ${
                  accountType === "freelancer"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                data-testid="card-freelancer"
              >
                <div className="text-4xl mb-3">🐰</div>
                <div className="font-medium text-gray-900 mb-1">1인 프리랜서</div>
                <div className="text-xs text-gray-500">나 혼자 운영하는 계정을 만들어요.</div>
                {accountType === "freelancer" && (
                  <div className="mt-3 flex justify-center">
                    <Check className="w-4 h-4 text-pink-500" />
                  </div>
                )}
              </button>

              <button
                onClick={() => setAccountType("company")}
                className={`w-52 py-6 px-4 rounded-lg border-2 text-center transition-all ${
                  accountType === "company"
                    ? "border-pink-500 bg-pink-500 text-white"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                data-testid="card-company"
              >
                <div className="text-4xl mb-3">🐰</div>
                <div className={`font-medium mb-1 ${accountType === "company" ? "text-white" : "text-gray-900"}`}>
                  기업 (팀활동)
                </div>
                <div className={`text-xs ${accountType === "company" ? "text-pink-100" : "text-gray-500"}`}>
                  활동 멤버들과 팀원과 함께 공유해요.
                </div>
                {accountType === "company" && (
                  <div className="mt-3 flex justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            </div>

            {/* 직업 정보 폼 */}
            <div className="space-y-5">
              {/* 기업명 (사업자번호) */}
              <div className="project-section project-section-horizontal">
                <span className="project-section-title">
                  <span className="text-pink-500 mr-0.5">*</span> 기업명
                </span>
                <div className="flex-1">
                  <Input
                    placeholder='프리랜서인 경우에는 " 프리랜서" 로 입력해주세요.'
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
                      {selectedCompany.name}{" "}
                      <span className="text-gray-400">{selectedCompany.address}</span>
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

              {/* 약관 동의 */}
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(v) => setAgreed(!!v)}
                  className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                  data-testid="checkbox-agree"
                />
                <label htmlFor="agree" className="text-xs text-gray-600 cursor-pointer">
                  Cotton Candy TVCF 통합회원 가입 및 이용약관과 개인정보 수집·이용, 개인정보 취급방침에 동의합니다.
                </label>
              </div>

              {/* 제출 버튼 */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`w-full py-3 rounded-md text-sm font-medium mt-4 transition-colors ${
                  isFormValid
                    ? "bg-pink-500 hover:bg-pink-600 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                data-testid="button-submit"
              >
                이메일로 인증번호발송
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
