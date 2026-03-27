import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { COMMON_MESSAGES } from "@/lib/messages";

export default function Step5() {
  const stepNumber = 5;
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [, setLocation] = useLocation();

  const techniques = [
    { id: "ai", title: "AI", description: "AI 기반 영상·이미지·음성 합성" },
    { id: "live-action", title: "라이브액션", description: "실사 중심 촬영 및 현장 연출" },
    { id: "special-shooting", title: "특수촬영", description: "드론, 고속카메라, 수중촬영" },
    { id: "2d-3d", title: "2D/3D", description: "2D/3D 그래픽 및 모델링, 애니메이션" },
    { id: "motion-graphics", title: "모션그래픽", description: "텍스트·그래픽 요소 애니메이션화" },
    { id: "animation", title: "애니메이션", description: "캐릭터 및 셀·3D 애니메이션 연출" },
    { id: "product-model", title: "제품 모델", description: "제품 렌더링, 고퀄리티 촬영·합성" },
    { id: "character-animal", title: "캐릭터/동물 모델", description: "캐릭터·동물 CG 및 촬영" },
    { id: "fantasy-sf", title: "판타지/SF", description: "CG·특수효과로 판타지/SF 구현" },
    { id: "special-technique", title: "특수기법", description: "트릭영상, 착시, 스톱모션 등" },
    { id: "cm-song", title: "CM Song형", description: "CM송·음악 중심 연출" },
    { id: "vr-ar", title: "VR/AR", description: "가상현실·증강현실 콘텐츠" }
  ];

  const handleToggle = (id: string) => {
    setSelectedTechniques(prev => {
      if (prev.includes(id)) {
        return prev.filter(t => t !== id);
      } else if (prev.length < 4) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handlePrevious = () => {
    setLocation('/create-project/step4');
  };

  const handleNext = () => {
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (6 > currentMax) {
      localStorage.setItem('maxVisitedStep', '6');
    }

    localStorage.setItem('techniques', JSON.stringify(selectedTechniques));
    setLocation('/create-project/step6');
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
              [Step{stepNumber}] 제작 기법
            </h1>
            <p className="page-subtitle mt-4" data-testid="subtitle-page">
              최대 4개까지 선택할 수 있어요.
            </p>
          </motion.div>

          {/* Technique Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="w-full mx-auto card-grid-3cols">
              {techniques.map((technique, index) => {
                const isSelected = selectedTechniques.includes(technique.id);
                return (
                  <motion.button
                    key={technique.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                    onClick={() => handleToggle(technique.id)}
                    className={`selection-card ${isSelected ? 'selection-card-selected' : ''}`}
                    data-testid={`card-${technique.id}`}
                  >
                    <h3 className="card-title">{technique.title}</h3>
                    <p className="card-description">{technique.description}</p>
                  </motion.button>
                );
              })}
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
    </Layout>
  );
}
