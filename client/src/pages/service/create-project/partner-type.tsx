import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import SelectionCard from "@/components/project-creation/selection-card";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Step2Option } from "@/lib/types";
import { COMMON_MESSAGES } from "@/lib/messages";
import { trackCreateProjectCta } from "@/lib/analytics";

const step2Options: Step2Option[] = [
  {
    id: 'advertising',
    title: '광고 총괄 대행',
    subtitle: '대행사',
    description: '전략부터 제작, 집행까지 함께할 믿음직한 파트너',
    icon: 'custom-public',
    bgColor: 'bg-cotton-light-pink',
    iconColor: 'text-pink-600'
  },
  {
    id: 'video',
    title: '영상 제작',
    subtitle: '제작사',
    description: '기획은 완료됐고, 제작 or 제작+집행까지 필요',
    icon: 'custom-robot',
    bgColor: 'bg-white',
    iconColor: 'text-blue-600'
  }
];

export default function Step2() {
  const stepNumber = 2; // 가변 step 번호
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [requestPurpose, setRequestPurpose] = useState<string[]>([]);
  const [productionPurpose, setProductionPurpose] = useState<string[]>([]);
  const [scheduleResponse, setScheduleResponse] = useState<string[]>([]);
  const [viewPermission, setViewPermission] = useState<string[]>([]);
  const [location, setLocation] = useLocation();
  
  // localStorage에서 이전 선택값 복원
  useEffect(() => {
    const savedOption = localStorage.getItem('step2Selection');
    if (savedOption) {
      setSelectedOption(savedOption);
      
      if (savedOption === 'advertising') {
        const savedRequestPurpose = localStorage.getItem('requestPurpose');
        const savedScheduleResponse = localStorage.getItem('scheduleResponse');
        const savedViewPermission = localStorage.getItem('viewPermission');
        
        if (savedRequestPurpose) setRequestPurpose(JSON.parse(savedRequestPurpose));
        if (savedScheduleResponse) setScheduleResponse(JSON.parse(savedScheduleResponse));
        if (savedViewPermission) setViewPermission(JSON.parse(savedViewPermission));
      } else if (savedOption === 'video') {
        const savedProductionPurpose = localStorage.getItem('productionPurpose');
        const savedScheduleResponse = localStorage.getItem('scheduleResponse');
        const savedViewPermission = localStorage.getItem('viewPermission');
        
        if (savedProductionPurpose) setProductionPurpose(JSON.parse(savedProductionPurpose));
        if (savedScheduleResponse) setScheduleResponse(JSON.parse(savedScheduleResponse));
        if (savedViewPermission) setViewPermission(JSON.parse(savedViewPermission));
      }
    }
  }, []);
  
  const handleProductionPurposeToggle = (purpose: string) => {
    setProductionPurpose(prev => 
      prev.includes(purpose) 
        ? prev.filter(p => p !== purpose)
        : [...prev, purpose]
    );
  };

  const handleRequestPurposeToggle = (purpose: string) => {
    setRequestPurpose(prev => 
      prev.includes(purpose) 
        ? prev.filter(p => p !== purpose)
        : [...prev, purpose]
    );
  };

  const handleScheduleResponseToggle = (response: string) => {
    setScheduleResponse(prev => 
      prev.includes(response) 
        ? prev.filter(r => r !== response)
        : [...prev, response]
    );
  };

  const handleViewPermissionToggle = (permission: string) => {
    setViewPermission(prev => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleNext = () => {
    trackCreateProjectCta(location, "next");
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (3 > currentMax) {
      localStorage.setItem('maxVisitedStep', '3');
    }

    if (selectedOption) {
      // Store selection in localStorage - 선택된 카드의 옵션만 저장
      localStorage.setItem('step2Selection', selectedOption);
      
      if (selectedOption === 'advertising') {
        localStorage.setItem('requestPurpose', JSON.stringify(requestPurpose));
        localStorage.setItem('scheduleResponse', JSON.stringify(scheduleResponse));
        localStorage.setItem('viewPermission', JSON.stringify(viewPermission));
      } else if (selectedOption === 'video') {
        localStorage.setItem('productionPurpose', JSON.stringify(productionPurpose));
        localStorage.setItem('scheduleResponse', JSON.stringify(scheduleResponse));
        localStorage.setItem('viewPermission', JSON.stringify(viewPermission));
      }
      
      // Navigate to step3
      setLocation('/create-project/step3');
    }
  };

  const handlePrevious = () => {
    trackCreateProjectCta(location, "back");
    setLocation('/create-project/step1');
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
            <h1 className="page-title">
              [Step{stepNumber}] "어떤 파트너를 찾고 계신가요?"
            </h1>
            <p className="page-subtitle mt-4">
              브랜드 목적과 타겟에 맞는 전략 수립부터, 영상 제작과 광고 집행까지 한 번에 진행해요.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 sm:mb-12 md:mb-16"
          >
            <div className="w-full mx-auto card-grid-2cols">
              {step2Options.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <SelectionCard
                    {...option}
                    isSelected={selectedOption === option.id}
                    onClick={() => setSelectedOption(option.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Options - Only shown when advertising is selected */}
          {selectedOption === 'advertising' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10 sm:mb-14 options-container"
            >
              {/* 의뢰항목 */}
              <div className="project-section project-section-horizontal">
                <span className="project-section-title"><span className="cotton-candy-pink">*</span> 의뢰항목</span>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="strategy" 
                      checked={requestPurpose.includes('strategy')}
                      onCheckedChange={() => handleRequestPurposeToggle('strategy')}
                      data-testid="checkbox-strategy"
                    />
                    <Label htmlFor="strategy" className="project-option-label">전략기획</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="creative" 
                      checked={requestPurpose.includes('creative')}
                      onCheckedChange={() => handleRequestPurposeToggle('creative')}
                      data-testid="checkbox-creative"
                    />
                    <Label htmlFor="creative" className="project-option-label">크리에이티브 기획</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="video" 
                      checked={requestPurpose.includes('video')}
                      onCheckedChange={() => handleRequestPurposeToggle('video')}
                      data-testid="checkbox-video"
                    />
                    <Label htmlFor="video" className="project-option-label">영상 제작</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="media" 
                      checked={requestPurpose.includes('media')}
                      onCheckedChange={() => handleRequestPurposeToggle('media')}
                      data-testid="checkbox-media"
                    />
                    <Label htmlFor="media" className="project-option-label">미디어 집행</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="performance" 
                      checked={requestPurpose.includes('performance')}
                      onCheckedChange={() => handleRequestPurposeToggle('performance')}
                      data-testid="checkbox-performance"
                    />
                    <Label htmlFor="performance" className="project-option-label">성과 측정 및 리포팅</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="influencer" 
                      checked={requestPurpose.includes('influencer')}
                      onCheckedChange={() => handleRequestPurposeToggle('influencer')}
                      data-testid="checkbox-influencer"
                    />
                    <Label htmlFor="influencer" className="project-option-label">인플루언서/SNS 마케팅</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pr" 
                      checked={requestPurpose.includes('pr')}
                      onCheckedChange={() => handleRequestPurposeToggle('pr')}
                      data-testid="checkbox-pr"
                    />
                    <Label htmlFor="pr" className="project-option-label">PR/언론보도 대응</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="offline" 
                      checked={requestPurpose.includes('offline')}
                      onCheckedChange={() => handleRequestPurposeToggle('offline')}
                      data-testid="checkbox-offline"
                    />
                    <Label htmlFor="offline" className="project-option-label">오프라인 이벤트/프로모션</Label>
                  </div>
                </div>
              </div>

              {/* 일정 대응 */}
              <div className="project-section project-section-horizontal">
                <span className="project-section-title"><span style={{ color: '#d1d5db' }}>*</span> 일정 대응</span>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="urgent" 
                      checked={scheduleResponse.includes('urgent')}
                      onCheckedChange={() => handleScheduleResponseToggle('urgent')}
                      data-testid="checkbox-urgent"
                    />
                    <Label htmlFor="urgent" className="project-option-label">급행 제작 대응</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="same-day" 
                      checked={scheduleResponse.includes('same-day')}
                      onCheckedChange={() => handleScheduleResponseToggle('same-day')}
                      data-testid="checkbox-same-day"
                    />
                    <Label htmlFor="same-day" className="project-option-label">당일 피드백 반영 가능</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="flexible" 
                      checked={scheduleResponse.includes('flexible')}
                      onCheckedChange={() => handleScheduleResponseToggle('flexible')}
                      data-testid="checkbox-flexible"
                    />
                    <Label htmlFor="flexible" className="project-option-label">일정 유동성 대응</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="event" 
                      checked={scheduleResponse.includes('event')}
                      onCheckedChange={() => handleScheduleResponseToggle('event')}
                      data-testid="checkbox-event"
                    />
                    <Label htmlFor="event" className="project-option-label">이벤트/행사 대응</Label>
                  </div>
                </div>
              </div>

              {/* Only 열람 가능 */}
              <div className="project-section project-section-horizontal">
                <span className="project-section-title"><span style={{ color: '#d1d5db' }}>*</span> Only 열람 가능</span>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="all-users" 
                        checked={viewPermission.includes('all-users')}
                        onCheckedChange={() => handleViewPermissionToggle('all-users')}
                        data-testid="checkbox-all-users"
                      />
                      <Label htmlFor="all-users" className="project-option-label">모든 이용자에게</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="advertiser" 
                        checked={viewPermission.includes('advertiser')}
                        onCheckedChange={() => handleViewPermissionToggle('advertiser')}
                        data-testid="checkbox-advertiser"
                      />
                      <Label htmlFor="advertiser" className="project-option-label">광고주</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agency" 
                        checked={viewPermission.includes('agency')}
                        onCheckedChange={() => handleViewPermissionToggle('agency')}
                        data-testid="checkbox-agency"
                      />
                      <Label htmlFor="agency" className="project-option-label">대행사</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="production" 
                        checked={viewPermission.includes('production')}
                        onCheckedChange={() => handleViewPermissionToggle('production')}
                        data-testid="checkbox-production"
                      />
                      <Label htmlFor="production" className="project-option-label">제작사</Label>
                    </div>
                  </div>
                  <div className="space-y-1 mt-1">
                    <p className="project-description">※ 선택한 유형의 회원만 작성하신 내용을 열람 할 수 있습니다. 공고예시 ⓘ</p>
                    <p className="project-description">※ 미선택 시 Cotton Candy 이용자에게 모두에게 공개됩니다. 공고예시 ⓘ</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Additional Options - Only shown when video is selected */}
          {selectedOption === 'video' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10 sm:mb-14 options-container"
            >
              {/* 의뢰항목 */}
              <div className="project-section project-section-horizontal">
                <span className="project-section-title"><span className="cotton-candy-pink">*</span> 의뢰항목</span>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="video-planning" 
                      checked={productionPurpose.includes('video-planning')}
                      onCheckedChange={() => handleProductionPurposeToggle('video-planning')}
                      data-testid="checkbox-video-planning"
                    />
                    <Label htmlFor="video-planning" className="project-option-label">영상 기획</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="shooting" 
                      checked={productionPurpose.includes('shooting')}
                      onCheckedChange={() => handleProductionPurposeToggle('shooting')}
                      data-testid="checkbox-shooting"
                    />
                    <Label htmlFor="shooting" className="project-option-label">영상 촬영</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="editing" 
                      checked={productionPurpose.includes('editing')}
                      onCheckedChange={() => handleProductionPurposeToggle('editing')}
                      data-testid="checkbox-editing"
                    />
                    <Label htmlFor="editing" className="project-option-label">편집 및 후반작업</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="music" 
                      checked={productionPurpose.includes('music')}
                      onCheckedChange={() => handleProductionPurposeToggle('music')}
                      data-testid="checkbox-music"
                    />
                    <Label htmlFor="music" className="project-option-label">음악/BGM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="casting" 
                      checked={productionPurpose.includes('casting')}
                      onCheckedChange={() => handleProductionPurposeToggle('casting')}
                      data-testid="checkbox-casting"
                    />
                    <Label htmlFor="casting" className="project-option-label">모델/배우 섭외</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="media-execution" 
                      checked={productionPurpose.includes('media-execution')}
                      onCheckedChange={() => handleProductionPurposeToggle('media-execution')}
                      data-testid="checkbox-media-execution"
                    />
                    <Label htmlFor="media-execution" className="project-option-label">매체 집행</Label>
                  </div>
                </div>
              </div>

              {/* 일정 대응 */}
              <div className="project-section project-section-horizontal">
                <span className="project-section-title"><span style={{ color: '#d1d5db' }}>*</span> 일정 대응</span>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="urgent-video" 
                      checked={scheduleResponse.includes('urgent')}
                      onCheckedChange={() => handleScheduleResponseToggle('urgent')}
                      data-testid="checkbox-urgent-video"
                    />
                    <Label htmlFor="urgent-video" className="project-option-label">급행 제작 대응</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="same-day-video" 
                      checked={scheduleResponse.includes('same-day')}
                      onCheckedChange={() => handleScheduleResponseToggle('same-day')}
                      data-testid="checkbox-same-day-video"
                    />
                    <Label htmlFor="same-day-video" className="project-option-label">당일 피드백 반영 가능</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="flexible-video" 
                      checked={scheduleResponse.includes('flexible')}
                      onCheckedChange={() => handleScheduleResponseToggle('flexible')}
                      data-testid="checkbox-flexible-video"
                    />
                    <Label htmlFor="flexible-video" className="project-option-label">일정 유동성 대응</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="event-video" 
                      checked={scheduleResponse.includes('event')}
                      onCheckedChange={() => handleScheduleResponseToggle('event')}
                      data-testid="checkbox-event-video"
                    />
                    <Label htmlFor="event-video" className="project-option-label">이벤트/행사 대응</Label>
                  </div>
                </div>
              </div>

              {/* Only 열람 가능 */}
              <div className="project-section project-section-horizontal">
                <span className="project-section-title"><span style={{ color: '#d1d5db' }}>*</span> Only 열람 가능</span>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="all-users-video" 
                        checked={viewPermission.includes('all-users')}
                        onCheckedChange={() => handleViewPermissionToggle('all-users')}
                        data-testid="checkbox-all-users-video"
                      />
                      <Label htmlFor="all-users-video" className="project-option-label">모든 이용자에게</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="advertiser-video" 
                        checked={viewPermission.includes('advertiser')}
                        onCheckedChange={() => handleViewPermissionToggle('advertiser')}
                        data-testid="checkbox-advertiser-video"
                      />
                      <Label htmlFor="advertiser-video" className="project-option-label">광고주</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agency-video" 
                        checked={viewPermission.includes('agency')}
                        onCheckedChange={() => handleViewPermissionToggle('agency')}
                        data-testid="checkbox-agency-video"
                      />
                      <Label htmlFor="agency-video" className="project-option-label">대행사</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="production-video" 
                        checked={viewPermission.includes('production')}
                        onCheckedChange={() => handleViewPermissionToggle('production')}
                        data-testid="checkbox-production-video"
                      />
                      <Label htmlFor="production-video" className="project-option-label">제작사</Label>
                    </div>
                  </div>
                  <div className="space-y-1 mt-1">
                    <p className="project-description">※ 선택한 유형의 회원만 작성하신 내용을 열람 할 수 있습니다. 공고예시 ⓘ</p>
                    <p className="project-description">※ 미선택 시 Cotton Candy 이용자에게 모두에게 공개됩니다. 공고예시 ⓘ</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

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
                disabled={
                  !selectedOption || 
                  (selectedOption === 'advertising' && requestPurpose.length === 0) ||
                  (selectedOption === 'video' && productionPurpose.length === 0)
                }
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
