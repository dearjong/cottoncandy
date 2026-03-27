import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COMMON_MESSAGES } from "@/lib/messages";
import { trackCreateProjectCta } from "@/lib/analytics";

export default function Step14() {
  const stepNumber = 14;
  const [location, setLocation] = useLocation();

  const handlePrevious = () => {
    trackCreateProjectCta(location, "back");
    setLocation('/create-project/step13');
  };

  const handleNext = () => {
    trackCreateProjectCta(location, "next");
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (15 > currentMax) {
      localStorage.setItem('maxVisitedStep', '15');
    }

    setLocation('/create-project/step15');
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
              [Step{stepNumber}] "참여기업 상세 조건"
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">기업 세부유형</span>
              <div className="flex-1">
                <Input placeholder="종합 광고대행사" data-testid="input-company-type" />
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">광고 Awards 수상작</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="10" className="w-32" data-testid="input-awards" />
                <span className="text-sm text-gray-600">작품 이상</span>
                <span className="text-sm text-gray-600">최근 3년간</span>
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">TVCF 명예의 전당</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="1" className="w-32" data-testid="input-hall-of-fame" />
                <span className="text-sm text-gray-600">작품 이상</span>
                <span className="text-sm text-gray-600">최근 3년간</span>
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">TVCF 연간 Creative 100위</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="10" className="w-32" data-testid="input-creative-100" />
                <span className="text-sm text-gray-600">작품 이상</span>
                <span className="text-sm text-gray-600">최근 3년간</span>
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">TVCF 연간 Best 100위</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="10" className="w-32" data-testid="input-best-100" />
                <span className="text-sm text-gray-600">작품 이상</span>
                <span className="text-sm text-gray-600">최근 3년간</span>
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">TVCF 포트폴리오</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="10" className="w-32" data-testid="input-portfolio" />
                <span className="text-sm text-gray-600">작품 이상</span>
                <span className="text-sm text-gray-600">최근 3년간</span>
              </div>
            </div>

            <div className="project-section project-section-horizontal">
              <span className="project-section-title">최소 제작비</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="2" className="w-32" data-testid="input-min-budget" />
                <span className="text-sm text-gray-600">억 이상</span>
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
