import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COMMON_MESSAGES } from "@/lib/messages";
import { getSubtitle } from "@/config/global-events";
import { trackCreateProjectCta } from "@/lib/analytics";
import { useAuthGate } from "@/hooks/use-auth-gate";
import LoginRequiredModal from "@/components/ui/login-required-modal";

export default function Step3() {
  const stepNumber = 3;
  const [projectName, setProjectName] = useState<string>("");
  const [location, setLocation] = useLocation();
  const { showLoginModal, setShowLoginModal, requireAuth } = useAuthGate();

  // 메뉴별 서브타이틀 가져오기 (광고제작 의뢰하기 메뉴)
  const eventInfo = getSubtitle(undefined, 'request');

  const handlePrevious = () => {
    trackCreateProjectCta(location, "back");
    setLocation('/create-project/step2');
  };

  const handleNext = () => {
    trackCreateProjectCta(location, "next");
    requireAuth(() => {
      const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
      if (4 > currentMax) {
        localStorage.setItem('maxVisitedStep', '4');
      }

      if (projectName.trim()) {
        localStorage.setItem('projectName', projectName);
        setLocation('/create-project/step4');
      }
    });
  };

  return (
    <Layout>
      <div className="py-8 sm:py-12 md:py-20 bg-white">
        <div className="page-content">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h1 className="page-title" data-testid="title-page">
              [Step{stepNumber}] "프로젝트명을 입력해주세요"
            </h1>
            {/* 메뉴별 서브타이틀 - global-events.ts에서 관리 */}
            <p className="page-subtitle mt-4" data-testid="subtitle-page">
              {eventInfo.subtitle} <a href={eventInfo.link} className="cotton-pink cursor-pointer hover:underline">{eventInfo.linkText}</a>
            </p>
          </motion.div>

          {/* Project Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 sm:mb-12 md:mb-16 options-container"
          >
            <div className="project-section project-section-horizontal">
              <span className="project-section-title">
                <span className="cotton-candy-pink">*</span> 프로젝트명
              </span>
              <div className="flex-1">
                <Input
                  id="project-name"
                  type="text"
                  placeholder="ex) [한국전자] 가전제품 런칭 프로모션"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full text-base"
                  data-testid="input-project-name"
                />
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex gap-3">
              <Button
                onClick={handlePrevious}
                className="btn-white"
                data-testid="button-previous"
              >
                이전
              </Button>
              <Button
                onClick={handleNext}
                disabled={!projectName.trim()}
                className="btn-pink"
                data-testid="button-next"
              >
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
      {showLoginModal && (
        <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
      )}
    </Layout>
  );
}
