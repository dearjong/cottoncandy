import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info, Building2, CheckCircle2 } from "lucide-react";
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
  const [confirmOpen, setConfirmOpen] = useState(false);
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
    if (!isValid) return;
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedCompany) return;
    if (isNewCompany) {
      trackCompanyRegistered({ company_name: selectedCompany.name, company_type: "agency" });
    } else {
      trackCompanyVerificationRequested({
        company_name: selectedCompany.name,
        verification_type: "employment",
        company_id: String(selectedCompany.id),
      });
    }
    setConfirmOpen(false);
    setLocation("/");
  };

  return (
    <Layout>
      <div className="py-10 sm:py-14 bg-white min-h-screen">
        <div className="page-content">

          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h1 className="page-title">"소속 기업 정보를 등록해 주세요."</h1>
            <p className="page-subtitle mt-3">
              기업 admin의 승인 후 기업 계정이 활성화돼요. 승인 전까지는 개인으로 활동할 수 있어요.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="options-container"
          >
            {/* 안내 배너 */}
            <div className="flex items-start gap-2.5 border border-blue-200 bg-blue-50 rounded-lg px-4 py-3 mb-8">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-700 leading-relaxed">
                기업 소속으로 활동한 프로젝트·계약 내역은 기업 admin도 볼 수 있어요.{" "}
                <strong>내 개인 기록은 별도로 보관되며, 기업을 나가도 사라지지 않아요.</strong>
              </p>
            </div>

            {/* 기업명 검색 */}
            <div className="project-section project-section-horizontal">
              <span className="project-section-title">
                <span className="cotton-candy-pink">*</span> 기업명
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
                  data-testid="input-company-search"
                />
                {showDropdown && companySearch && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-b-md shadow-md">
                    {filteredCompanies.map((company) => (
                      <button
                        key={company.id}
                        onMouseDown={() => handleCompanySelect(company)}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        data-testid={`company-option-${company.id}`}
                      >
                        <span className="font-medium text-gray-900">{company.name}</span>
                        <span className="ml-2 text-xs text-gray-400">{company.address}</span>
                      </button>
                    ))}
                    <button
                      onMouseDown={handleNewCompany}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-pink-50"
                      data-testid="company-new"
                    >
                      <span className="cotton-candy-pink font-medium">+ "{companySearch}" 신규 등록</span>
                      <span className="ml-2 text-xs text-gray-400">기업이 없으면 새로 만들어요</span>
                    </button>
                  </div>
                )}
                {selectedCompany && !showDropdown && (
                  <p className={`project-description mt-2 flex items-center gap-1.5 ${isNewCompany ? "text-[#EA4C89]" : "text-green-600"}`}>
                    {isNewCompany
                      ? `"${selectedCompany.name}" 신규 등록 — 검토 후 활성화돼요`
                      : `${selectedCompany.name} · ${selectedCompany.address} — 기업 admin 승인 후 활성화돼요`}
                  </p>
                )}
              </div>
            </div>

            {/* 직무 */}
            <div className="project-section project-section-horizontal">
              <span className="project-section-title">
                <span className="cotton-candy-pink">*</span> 직무
              </span>
              <div className="flex-1">
                <Input
                  placeholder="ex) 기획자"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
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
                  data-testid="input-position"
                />
              </div>
            </div>

            {/* 버튼 */}
            <div className="btn-group pt-2">
              <button
                onClick={() => setLocation("/")}
                className="btn-white"
                data-testid="button-skip"
              >
                나중에 등록할게요
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isValid}
                className="btn-pink"
                data-testid="button-submit"
              >
                등록 신청하기
              </button>
            </div>

          </motion.div>
        </div>
      </div>
      {/* 등록 신청 확인 팝업 */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="popup-title">기업 소속 등록을 신청할게요</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* 입력 내용 요약 */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-gray-900">{selectedCompany?.name}</span>
                  {selectedCompany?.address && (
                    <p className="text-xs text-gray-400 mt-0.5">{selectedCompany.address}</p>
                  )}
                </div>
              </div>
              {job && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-gray-400 text-xs w-8 shrink-0">직무</span>
                  <span>{job}{department ? ` · ${department}` : ""}{position ? ` · ${position}` : ""}</span>
                </div>
              )}
            </div>
            {/* 안내 문구 */}
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#EA4C89] mt-0.5 shrink-0" />
              <span>
                {isNewCompany
                  ? "신규 기업으로 등록되며, 관리자 검토 후 활성화됩니다."
                  : "기업 admin에게 소속 신청이 전달돼요. 승인 전까지는 개인으로 활동할 수 있어요."}
              </span>
            </div>
          </div>
          <div className="popup-buttons">
            <button
              onClick={() => setConfirmOpen(false)}
              className="btn-white"
              data-testid="button-cancel"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="btn-pink"
              data-testid="button-confirm"
            >
              신청하기
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
