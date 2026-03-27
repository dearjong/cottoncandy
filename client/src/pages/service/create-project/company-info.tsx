import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { COMMON_MESSAGES } from "@/lib/messages";
import { trackCreateProjectCta } from "@/lib/analytics";

export default function Step16() {
  const stepNumber = 16;
  const [location, setLocation] = useLocation();

  const handlePrevious = () => {
    trackCreateProjectCta(location, "back");
    setLocation('/create-project/step15');
  };

  const handleNext = () => {
    trackCreateProjectCta(location, "next");
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (17 > currentMax) {
      localStorage.setItem('maxVisitedStep', '17');
    }

    setLocation('/create-project/step17');
  };

  return (
    <Layout>
      <div className="py-8 sm:py-12 md:py-20 bg-white">
        <div className="page-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h1 className="page-title" data-testid="title-page">
              [Step{stepNumber}] "기업정보"
            </h1>
            <p className="page-subtitle mt-4" data-testid="subtitle-page">
              TVCF의 기업정보와 연동되어 업데이트 됩니다.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">기업로고</span>
              <div className="flex-1 flex items-center gap-3">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                  LOGO
                </div>
                <Button className="btn-white" data-testid="button-upload-logo">Upload</Button>
                <div className="privacy-checkbox-group">
                  <Checkbox id="hide-logo" data-testid="checkbox-hide-logo" />
                  <Label htmlFor="hide-logo" className="project-option-label">미공개</Label>
                </div>
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">기업명</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="ex) 베스트전자" data-testid="input-company-name" />
                <div className="privacy-checkbox-group">
                  <Checkbox id="hide-company-name" data-testid="checkbox-hide-company-name" />
                  <Label htmlFor="hide-company-name" className="project-option-label">미공개</Label>
                </div>
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">기업형태</span>
              <div className="flex-1 flex gap-3">
                <button className="selection-card selection-card-selected" data-testid="option-corporation">법인</button>
                <button className="selection-card" data-testid="option-individual">개인사업자</button>
                <button className="selection-card" data-testid="option-freelancer">프리랜서</button>
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">기업유형</span>
              <div className="flex-1">
                <Input placeholder="광고주" data-testid="input-company-category" />
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">└ 세부유형</span>
              <div className="flex-1">
                <Input placeholder="Creative 중심 대행사" data-testid="input-company-subtype" />
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">전화번호</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="ex) 02" className="w-20" data-testid="input-company-phone1" />
                <span>-</span>
                <Input placeholder="ex) 1234" className="w-28" data-testid="input-company-phone2" />
                <span>-</span>
                <Input placeholder="ex) 1234" className="w-28" data-testid="input-company-phone3" />
                <div className="privacy-checkbox-group">
                  <Checkbox id="hide-company-phone" data-testid="checkbox-hide-company-phone" />
                  <Label htmlFor="hide-company-phone" className="project-option-label">미공개</Label>
                </div>
              </div>
            </div>

            <div className="project-section project-section-horizontal">
              <span className="project-section-title">Website</span>
              <div className="flex-1">
                <Input placeholder="ex) http://www.tvcf.co.kr" data-testid="input-website" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex gap-3">
              <Button onClick={handlePrevious} className="btn-white" data-testid="button-previous">
                이전
              </Button>
              <Button onClick={handleNext} className="btn-pink" data-testid="button-next">
                다음
              </Button>
            </div>
            
            <p className="project-description mt-4">
              {COMMON_MESSAGES.TEMP_SAVE_NOTICE}
            </p>

            <StepIndicator currentStep={stepNumber} />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
