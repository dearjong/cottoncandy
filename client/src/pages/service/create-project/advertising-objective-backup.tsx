import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { COMMON_MESSAGES } from "@/lib/messages";

export default function Step4() {
  const stepNumber = 4;
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [, setLocation] = useLocation();

  const purposes = [
    {
      category: "제품을 많이 팔고 싶어요",
      options: [
        { id: "short-impact", label: "짧고 임팩트 있게 전환시키고 싶어요." },
        { id: "product-demo", label: "제품을 직접 써보는 느낌으로 보여주고 싶어요." },
        { id: "user-review", label: "실제 사용자 후기 중심으로 만들고 싶어요." }
      ]
    },
    {
      category: "브랜드를 많은 사람에게 알리고 싶어요",
      options: [
        { id: "viral-content", label: "재미있고 확산 가능한 콘텐츠를 원해요." },
        { id: "emotional-message", label: "브랜드 메시지를 감성적으로 전달하고 싶어요." },
        { id: "integrated-campaign", label: "TV광고부터 디지털까지 통합 캠페인이 필요해요." }
      ]
    },
    {
      category: "브랜드를 멋지게 만들고 싶어요",
      options: [
        { id: "emotional-stylish", label: "감성적이고 세련된 영상이 필요해요." },
        { id: "fashion-beauty", label: "패션·뷰티처럼 스타일 강조가 필요해요." },
        { id: "luxury-brand", label: "고급 브랜드 느낌의 광고를 원해요." }
      ]
    },
    {
      category: "고객 행동을 유도하고 싶어요",
      options: [
        { id: "app-conversion", label: "앱 설치나 회원가입 전환이 필요해요." },
        { id: "website-traffic", label: "웹사이트 유입을 늘리고 싶어요." },
        { id: "event-participation", label: "이벤트나 체험 신청 유도가 필요해요." }
      ]
    },
    {
      category: "우리 회사나 브랜드를 소개하고 싶어요",
      options: [
        { id: "company-vision", label: "기업 철학·비전 중심 브랜딩 영상을 만들고 싶어요." },
        { id: "employee-interview", label: "임직원 인터뷰나 행사 영상이 필요해요." },
        { id: "ir-pr", label: "투자자·채용 대상자에게 신뢰 주는 IR/PR." }
      ]
    },
    {
      category: "공공 캠페인을 진행하고 싶어요",
      options: [
        { id: "social-message", label: "사회적 메시지를 감동적으로 표현하고 싶어요." },
        { id: "policy-education", label: "정책 안내나 교육용 콘텐츠가 필요해요." },
        { id: "public-experience", label: "공공기관 수주 경험이 있는 곳이 좋아요." }
      ]
    },
    {
      category: "브랜드를 새롭게 리브랜딩하고 싶어요",
      options: [
        { id: "trendy-rebrand", label: "기존 브랜드를 트렌디하게 바꾸고 싶어요." },
        { id: "philosophy-redefine", label: "브랜드 철학을 재정의하고 영상으로 표현하고 싶어요." },
        { id: "campaign-direction", label: "전체 캠페인 방향까지 함께 설계할 수 있는 팀이 필요해요." }
      ]
    },
    {
      category: "새 브랜드를 런칭하고 싶어요",
      options: [
        { id: "launch-planning", label: "브랜드 런칭 기획부터 광고, 운영까지." },
        { id: "naming-concept", label: "네이밍, 슬로건, 영상 콘셉트까지 함께 기획하고 싶어요." },
        { id: "launch-series", label: "런칭 이벤트 영상, 티저 영상 등 시리즈로 만들고 싶어요." }
      ]
    },
    {
      category: "이벤트/프로모션을 알리고 싶어요",
      options: [
        { id: "event-campaign", label: "명절/할인/이벤트 캠페인" },
        { id: "offline-event", label: "오프라인 행사/전시 홍보 광고가 필요해요." },
        { id: "online-shopping", label: "온라인 쇼핑몰 기획전 홍보 광고가 필요해요." }
      ]
    }
  ];

  const handleToggle = (id: string) => {
    setSelectedPurposes(prev => {
      if (prev.includes(id)) {
        return prev.filter(p => p !== id);
      } else if (prev.length < 5) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handlePrevious = () => {
    setLocation('/create-project/step3');
  };

  const handleNext = () => {
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (5 > currentMax) {
      localStorage.setItem('maxVisitedStep', '5');
    }

    if (selectedPurposes.length > 0) {
      localStorage.setItem('adPurposes', JSON.stringify(selectedPurposes));
      setLocation('/create-project/step5');
    }
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
              [Step{stepNumber}] "이번 광고로 이루고 싶은 목표는? :)"
            </h1>
            <p className="page-subtitle mt-4" data-testid="subtitle-page">
              최대 5개(세부 항목 기준) 까지 선택할 수 있어요.
            </p>
          </motion.div>

          {/* Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="space-y-8">
              {purposes.map((purpose, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-800">{purpose.category}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {purpose.options.map((option) => {
                      const isSelected = selectedPurposes.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleToggle(option.id)}
                          className={`selection-card ${isSelected ? 'selection-card-selected' : ''}`}
                          data-testid={`option-${option.id}`}
                        >
                          <span className="text-sm md:text-base">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
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
                disabled={selectedPurposes.length === 0}
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
