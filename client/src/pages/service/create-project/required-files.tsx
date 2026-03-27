import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { COMMON_MESSAGES } from "@/lib/messages";
import { trackCreateProjectCta } from "@/lib/analytics";

export default function Step15() {
  const stepNumber = 15;
  const [location, setLocation] = useLocation();

  const handlePrevious = () => {
    trackCreateProjectCta(location, "back");
    setLocation('/create-project/step14');
  };

  const handleNext = () => {
    trackCreateProjectCta(location, "next");
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (16 > currentMax) {
      localStorage.setItem('maxVisitedStep', '16');
    }

    setLocation('/create-project/step16');
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
              [Step{stepNumber}] "제출자료"
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">지원 서류</h3>
                <div className="space-y-4">
                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title">참여 신청서</span>
                    <div className="flex-1 flex gap-3">
                      <button className="selection-card selection-card-selected" data-testid="option-basic-form">
                        첨부된 양식
                      </button>
                      <button className="selection-card" data-testid="option-custom-form">
                        자율양식
                      </button>
                    </div>
                  </div>
                  
                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title">회사소개서</span>
                    <div className="flex-1 flex gap-3">
                      <button className="selection-card selection-card-selected" data-testid="option-basic-company">
                        첨부된 양식
                      </button>
                      <button className="selection-card" data-testid="option-custom-company">
                        자율양식
                      </button>
                    </div>
                  </div>

                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title">비밀유지협약서 (NDA)</span>
                    <div className="flex-1 flex gap-3">
                      <button className="selection-card" data-testid="option-attached-nda">
                        첨부된 양식
                      </button>
                      <button className="selection-card selection-card-selected" data-testid="option-custom-nda">
                        자율양식
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">PT시 제출 자료</h3>
                <p className="text-sm text-gray-600 mb-4">필요한 제출 자료를 선택하고 양식을 지정할 수 있습니다.</p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">계약 체결 시 제출 서류</h3>
                <p className="text-sm text-gray-600 mb-4">계약 시 필요한 서류 목록이 표시됩니다.</p>
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
