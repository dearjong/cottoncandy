import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { COMMON_MESSAGES } from "@/lib/messages";
import { trackCreateProjectCta } from "@/lib/analytics";

export default function Step7() {
  const stepNumber = 7;
  const [selectedAge, setSelectedAge] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<string[]>([]);
  const [selectedInterest, setSelectedInterest] = useState<string[]>([]);
  const [location, setLocation] = useLocation();

  const ageOptions = [
    { id: "all-age", label: "전체" },
    { id: "infant", label: "유아" },
    { id: "elementary", label: "초등학생" },
    { id: "teen", label: "10대" },
    { id: "20s", label: "20대" },
    { id: "30s", label: "30대" },
    { id: "40s", label: "40대" },
    { id: "50s", label: "50대" },
    { id: "60s-plus", label: "60대 이상" }
  ];

  const genderOptions = [
    { id: "all-gender", label: "전체" },
    { id: "male", label: "남성" },
    { id: "female", label: "여성" }
  ];

  const jobOptions = [
    { id: "all-job", label: "전체" },
    { id: "office", label: "직장인" },
    { id: "freelancer", label: "프리랜서" },
    { id: "self-employed", label: "자영업자" },
    { id: "homemaker", label: "주부" },
    { id: "unemployed", label: "무직/구직자" },
    { id: "retired", label: "은퇴자" },
    { id: "student", label: "학생" }
  ];

  const interestOptions = [
    { id: "all-interest", label: "전체" },
    { id: "it", label: "정보통신" },
    { id: "electronics", label: "전기/전자" },
    { id: "auto", label: "자동차" },
    { id: "beverage", label: "음료/주류" },
    { id: "confectionery", label: "제과" },
    { id: "food", label: "식품" },
    { id: "living", label: "생활용품" },
    { id: "cosmetics", label: "화장품" },
    { id: "fashion", label: "패션/스포츠" },
    { id: "pharma", label: "제약/의료" },
    { id: "finance", label: "금융/보험" },
    { id: "corporate", label: "기업/건설" },
    { id: "public", label: "공익" }
  ];

  const handleToggle = (category: 'age' | 'gender' | 'job' | 'interest', id: string) => {
    const setters = {
      age: setSelectedAge,
      gender: setSelectedGender,
      job: setSelectedJob,
      interest: setSelectedInterest
    };
    
    const setter = setters[category];
    
    setter(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handlePrevious = () => {
    trackCreateProjectCta(location, "back");
    setLocation('/create-project/step6');
  };

  const handleNext = () => {
    trackCreateProjectCta(location, "next");
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (8 > currentMax) {
      localStorage.setItem('maxVisitedStep', '8');
    }

    localStorage.setItem('targetAge', JSON.stringify(selectedAge));
    localStorage.setItem('targetGender', JSON.stringify(selectedGender));
    localStorage.setItem('targetJob', JSON.stringify(selectedJob));
    localStorage.setItem('targetInterest', JSON.stringify(selectedInterest));
    setLocation('/create-project/step8');
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
              [Step{stepNumber}] "주요 고객을 선택해주세요"
            </h1>
            <p className="page-subtitle mt-4" data-testid="subtitle-page">
              광고가 노출될 주요 매체를 선택해 주세요.
            </p>
          </motion.div>

          {/* Target Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="space-y-8">
              {/* 연령대 */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">연령대</h3>
                <div className="w-full mx-auto card-grid-3cols">
                  {ageOptions.map((option) => {
                    const isSelected = selectedAge.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleToggle('age', option.id)}
                        className={`selection-card ${isSelected ? 'selection-card-selected' : ''}`}
                        data-testid={`age-${option.id}`}
                      >
                        <span className="text-sm md:text-base">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 성별 */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">성별</h3>
                <div className="w-full mx-auto card-grid-3cols">
                  {genderOptions.map((option) => {
                    const isSelected = selectedGender.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleToggle('gender', option.id)}
                        className={`selection-card ${isSelected ? 'selection-card-selected' : ''}`}
                        data-testid={`gender-${option.id}`}
                      >
                        <span className="text-sm md:text-base">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 직업 */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">직업</h3>
                <div className="w-full mx-auto card-grid-3cols">
                  {jobOptions.map((option) => {
                    const isSelected = selectedJob.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleToggle('job', option.id)}
                        className={`selection-card ${isSelected ? 'selection-card-selected' : ''}`}
                        data-testid={`job-${option.id}`}
                      >
                        <span className="text-sm md:text-base">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 관심사 */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">관심사</h3>
                <div className="w-full mx-auto card-grid-3cols">
                  {interestOptions.map((option) => {
                    const isSelected = selectedInterest.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleToggle('interest', option.id)}
                        className={`selection-card ${isSelected ? 'selection-card-selected' : ''}`}
                        data-testid={`interest-${option.id}`}
                      >
                        <span className="text-sm md:text-base">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
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
