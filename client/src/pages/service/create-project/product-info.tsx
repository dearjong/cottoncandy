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
import { trackCreateProjectCta } from "@/lib/analytics";

export default function Step11() {
  const stepNumber = 11;
  const [location, setLocation] = useLocation();

  const handlePrevious = () => {
    trackCreateProjectCta(location, "back");
    setLocation('/create-project/step10');
  };

  const handleNext = () => {
    trackCreateProjectCta(location, "next");
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (12 > currentMax) {
      localStorage.setItem('maxVisitedStep', '12');
    }

    setLocation('/create-project/step12');
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
              [Step{stepNumber}] "제품정보"
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">브랜드명</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="입력해주세요." data-testid="input-brand-name" />
                <div className="privacy-checkbox-group">
                  <Checkbox id="hide-brand" data-testid="checkbox-hide-brand" />
                  <Label htmlFor="hide-brand" className="project-option-label">미공개</Label>
                </div>
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">제품명</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="입력해주세요." data-testid="input-product-name" />
                <div className="privacy-checkbox-group">
                  <Checkbox id="hide-product" data-testid="checkbox-hide-product" />
                  <Label htmlFor="hide-product" className="project-option-label">미공개</Label>
                </div>
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title">└ 산업/품목</span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="전기전자" data-testid="input-industry" />
                <div className="privacy-checkbox-group">
                  <Checkbox id="hide-industry" data-testid="checkbox-hide-industry" />
                  <Label htmlFor="hide-industry" className="project-option-label">미공개</Label>
                </div>
              </div>
            </div>

            <div className="project-section project-section-horizontal mb-6">
              <span className="project-section-title"></span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="카메라/영상/음향가전" data-testid="input-category" />
                <div className="privacy-checkbox-group">
                  <Checkbox id="hide-category" data-testid="checkbox-hide-category" />
                  <Label htmlFor="hide-category" className="project-option-label">미공개</Label>
                </div>
              </div>
            </div>

            <div className="project-section project-section-horizontal">
              <span className="project-section-title"></span>
              <div className="flex-1 flex items-center gap-3">
                <Input placeholder="TV" data-testid="input-subcategory" />
                <div className="privacy-checkbox-group">
                  <Checkbox id="hide-subcategory" data-testid="checkbox-hide-subcategory" />
                  <Label htmlFor="hide-subcategory" className="project-option-label">미공개</Label>
                </div>
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
