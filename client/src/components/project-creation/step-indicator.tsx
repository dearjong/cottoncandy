import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface StepInfo {
  number: number;
  title: string;
  path: string;
}

const steps: StepInfo[] = [
  {
    number: 1,
    title: "어떤 방식으로 파트너를 찾으시나요?",
    path: "/create-project/step1"
  },
  {
    number: 2,
    title: "어떤 파트너를 찾고 계신가요?",
    path: "/create-project/step2"
  },
  {
    number: 3,
    title: "프로젝트명을 입력해주세요",
    path: "/create-project/step3"
  },
  {
    number: 4,
    title: "광고 목적",
    path: "/create-project/step4"
  },
  {
    number: 5,
    title: "제작 기법",
    path: "/create-project/step5"
  },
  {
    number: 6,
    title: "노출 매체",
    path: "/create-project/step6"
  },
  {
    number: 7,
    title: "주요 고객",
    path: "/create-project/step7"
  },
  {
    number: 8,
    title: "예산",
    path: "/create-project/step8"
  },
  {
    number: 9,
    title: "대금 지급",
    path: "/create-project/step9"
  },
  {
    number: 10,
    title: "일정",
    path: "/create-project/step10"
  },
  {
    number: 11,
    title: "제품정보",
    path: "/create-project/step11"
  },
  {
    number: 12,
    title: "담당자정보",
    path: "/create-project/step12"
  },
  {
    number: 13,
    title: "경쟁사 제외",
    path: "/create-project/step13"
  },
  {
    number: 14,
    title: "참여기업 조건",
    path: "/create-project/step14"
  },
  {
    number: 15,
    title: "제출자료",
    path: "/create-project/step15"
  },
  {
    number: 16,
    title: "기업정보",
    path: "/create-project/step16"
  },
  {
    number: 17,
    title: "상세설명",
    path: "/create-project/step17"
  },
  {
    number: 18,
    title: "프로젝트 등록하기",
    path: "/create-project/step18"
  }
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  
  const maxVisitedStep = parseInt(localStorage.getItem('maxVisitedStep') || '1');

  const handleStepClick = (path: string, stepNumber: number) => {
    if (stepNumber <= maxVisitedStep) {
      setLocation(path);
    }
  };

  return (
    <div className="step-indicator-container">
      {steps
        .filter((step) => step.number <= maxVisitedStep)
        .map((step) => {
          const isActive = step.number === currentStep;
          const isHovered = hoveredStep === step.number;

          return (
            <div 
              key={step.number} 
              className="relative"
              onMouseEnter={() => setHoveredStep(step.number)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <button
                onClick={() => handleStepClick(step.path, step.number)}
                className={`step-button ${
                  isActive 
                    ? 'step-button-active' 
                    : 'step-button-inactive'
                }`}
                data-testid={`step-indicator-${step.number}`}
              >
                {step.number}
              </button>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="step-tooltip"
                    data-testid={`step-tooltip-${step.number}`}
                  >
                    {step.title}
                    {/* Arrow */}
                    <div className="step-tooltip-arrow"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
    </div>
  );
}
