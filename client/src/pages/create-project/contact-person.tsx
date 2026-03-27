import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { COMMON_MESSAGES } from "@/lib/messages";

export default function Step12() {
  const stepNumber = 12;
  const [, setLocation] = useLocation();

  const handlePrevious = () => {
    setLocation('/create-project/step11');
  };

  const handleNext = () => {
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (13 > currentMax) {
      localStorage.setItem('maxVisitedStep', '13');
    }

    setLocation('/create-project/step13');
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
              [Step{stepNumber}] 담당자 정보
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">담당자명</span>
              <div className="flex-1">
                <Input placeholder="ex) 이애드" data-testid="input-contact-name" />
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">└ 부서</span>
              <div className="flex-1">
                <Input placeholder="ex) 전략기획팀" data-testid="input-department" />
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">└ 직책</span>
              <div className="flex-1">
                <Input placeholder="ex) 선임연구원" data-testid="input-position" />
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">연락처</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="02" className="w-20" data-testid="input-phone1" />
                <span>-</span>
                <Input placeholder="ex) 1234" className="w-28" data-testid="input-phone2" />
                <span>-</span>
                <Input placeholder="ex) 1234" className="w-28" data-testid="input-phone3" />
                <div className="privacy-checkbox-group">
                  <Checkbox id="hide-phone" data-testid="checkbox-hide-phone" />
                  <Label htmlFor="hide-phone" className="project-option-label">미공개</Label>
                </div>
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">휴대폰</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="010" className="w-20" data-testid="input-mobile1" />
                <span>-</span>
                <Input placeholder="ex) 1234" className="w-28" data-testid="input-mobile2" />
                <span>-</span>
                <Input placeholder="ex) 1234" className="w-28" data-testid="input-mobile3" />
                <div className="privacy-checkbox-group">
                  <Checkbox id="hide-mobile" data-testid="checkbox-hide-mobile" />
                  <Label htmlFor="hide-mobile" className="project-option-label">미공개</Label>
                </div>
              </div>
            </div>

            <div className="project-section project-section-horizontal">
              <span className="project-section-title">이메일</span>
              <div className="flex-1">
                <Input placeholder="ex) adcream@tvcf.co.kr" data-testid="input-email" />
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
