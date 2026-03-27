import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COMMON_MESSAGES } from "@/lib/messages";
import { trackCreateProjectCta } from "@/lib/analytics";

export default function Step13() {
  const stepNumber = 13;
  const [excludeCompetitors, setExcludeCompetitors] = useState(false);
  const [location, setLocation] = useLocation();

  const handlePrevious = () => {
    trackCreateProjectCta(location, "back");
    setLocation('/create-project/step12');
  };

  const handleNext = () => {
    trackCreateProjectCta(location, "next");
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (14 > currentMax) {
      localStorage.setItem('maxVisitedStep', '14');
    }

    localStorage.setItem('excludeCompetitors', String(excludeCompetitors));
    setLocation('/create-project/step14');
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
              [Step{stepNumber}] "경쟁사 수행 기업을 제외할까요?"
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="w-full mx-auto card-grid-2cols mb-8">
              <button
                onClick={() => setExcludeCompetitors(true)}
                className={`selection-card ${excludeCompetitors ? 'selection-card-selected' : ''}`}
                data-testid="option-exclude"
              >
                <h3 className="card-title mb-2">경쟁사 수행기업 제외</h3>
                <p className="card-description text-center">일정 기간동안 경쟁사 프로젝트 수행 이력이 없는 기업과 함께 하고 싶어요.</p>
              </button>
              <button
                onClick={() => setExcludeCompetitors(false)}
                className={`selection-card ${!excludeCompetitors ? 'selection-card-selected' : ''}`}
                data-testid="option-all"
              >
                <h3 className="card-title mb-2">모든 기업 접수 가능</h3>
              </button>
            </div>

            {excludeCompetitors && (
              <>
                <div className="project-section project-section-horizontal mb-6">
                  <span className="project-section-title">제외기간</span>
                  <div className="flex-1">
                    <Input placeholder="온에어 후 3개월 미만" data-testid="input-exclude-period" />
                  </div>
                </div>

                <div className="project-section project-section-horizontal">
                  <span className="project-section-title">제한기업</span>
                  <div className="flex-1 flex items-center gap-3 flex-wrap">
                    <span className="text-sm text-gray-600">전체</span>
                    <Input placeholder="HP" className="w-32" data-testid="input-company1" />
                    <Input placeholder="소니" className="w-32" data-testid="input-company2" />
                    <Input placeholder="삼성전자" className="w-32" data-testid="input-company3" />
                    <Input placeholder="Option" className="w-32" data-testid="input-company4" />
                    <Input placeholder="Option" className="w-32" data-testid="input-company5" />
                  </div>
                </div>
              </>
            )}
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
