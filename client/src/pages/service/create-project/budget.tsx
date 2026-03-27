import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMMON_MESSAGES } from "@/lib/messages";
import { trackCreateProjectCta } from "@/lib/analytics";

// 캠페인 규모에 따른 제작비/총 예산 매핑
const BUDGET_MAPPING: Record<string, { production: string; total: string }> = {
  'small': { production: 'under-50m', total: '100m-500m' },
  'medium-digital': { production: '50m-100m', total: '500m-1b' },
  'large-quarterly': { production: '100m-300m', total: '1b-3b' },
  'integrated-annual': { production: '300m-500m', total: '3b-6b' },
  'large-annual': { production: '500m-1b', total: '6b-10b' },
  'nationwide': { production: '1b-3b', total: 'over-10b' },
  'global': { production: 'over-3b', total: 'over-10b' },
};

export default function Step8() {
  const stepNumber = 8;
  const [budgetType, setBudgetType] = useState<"fixed" | "proposal">("fixed");
  const [campaignScale, setCampaignScale] = useState<string | undefined>(undefined);
  const [productionBudget, setProductionBudget] = useState<string>("");
  const [totalBudget, setTotalBudget] = useState<string>("");
  const [productionRange, setProductionRange] = useState<string | undefined>(undefined);
  const [totalRange, setTotalRange] = useState<string | undefined>(undefined);
  const [hideProduction, setHideProduction] = useState(false);
  const [hideTotal, setHideTotal] = useState(false);
  const [location, setLocation] = useLocation();

  // 캠페인 규모 변경 시 제작비/총 예산 자동 설정
  const handleCampaignScaleChange = (value: string) => {
    setCampaignScale(value);
    
    // 매핑된 값으로 자동 설정
    const mapping = BUDGET_MAPPING[value];
    if (mapping) {
      setProductionRange(mapping.production);
      setTotalRange(mapping.total);
    }
  };

  const handlePrevious = () => {
    trackCreateProjectCta(location, "back");
    setLocation('/create-project/step7');
  };

  const handleNext = () => {
    trackCreateProjectCta(location, "next");
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (9 > currentMax) {
      localStorage.setItem('maxVisitedStep', '9');
    }

    localStorage.setItem('budgetType', budgetType);
    localStorage.setItem('campaignScale', campaignScale || '');
    if (budgetType === 'fixed') {
      localStorage.setItem('productionBudget', productionBudget);
      localStorage.setItem('totalBudget', totalBudget);
    } else {
      localStorage.setItem('productionRange', productionRange || '');
      localStorage.setItem('totalRange', totalRange || '');
    }
    setLocation('/create-project/step9');
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
              [Step{stepNumber}] "캠페인 규모와 예산을 선택해주세요"
            </h1>
            <p className="page-subtitle mt-4" data-testid="subtitle-page">
              대략적인 정보를 선택해 주세요. 상세하면 더욱 좋습니다.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            {/* Budget Type Selection */}
            <div className="w-full mx-auto card-grid-2cols mb-8">
              <button
                onClick={() => setBudgetType('fixed')}
                className={`selection-card ${budgetType === 'fixed' ? 'selection-card-selected' : ''}`}
                data-testid="option-fixed-budget"
              >
                <span className="text-sm md:text-base">금액이 확정되었어요.</span>
              </button>
              <button
                onClick={() => setBudgetType('proposal')}
                className={`selection-card ${budgetType === 'proposal' ? 'selection-card-selected' : ''}`}
                data-testid="option-proposal-budget"
              >
                <span className="text-sm md:text-base">금액을 제안받고 싶어요</span>
              </button>
            </div>

            {budgetType === 'proposal' && (
              <div className="project-section project-section-horizontal mb-6">
                <span className="project-section-title">캠페인 규모</span>
                <div className="flex-1">
                  <Select value={campaignScale} onValueChange={handleCampaignScaleChange}>
                    <SelectTrigger data-testid="select-campaign-scale">
                      <SelectValue placeholder="캠페인 규모를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">소규모, 단발성</SelectItem>
                      <SelectItem value="medium-digital">중견 브랜드, 디지털 중심</SelectItem>
                      <SelectItem value="large-quarterly">대기업 단기/분기 캠페인</SelectItem>
                      <SelectItem value="integrated-annual">온·오프 통합, 연간의 일부</SelectItem>
                      <SelectItem value="large-annual">연간 대형 캠페인 중심</SelectItem>
                      <SelectItem value="nationwide">전국 단위, 복수 매체 대량 집행</SelectItem>
                      <SelectItem value="global">초대형/글로벌 브랜드 연간 예산</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {budgetType === 'fixed' ? (
              <>
                <div className="project-section project-section-horizontal mb-6">
                  <span className="project-section-title">제작비</span>
                  <div className="flex-1 flex items-center gap-3">
                    <Input
                      placeholder="ex) 200,000,000 원"
                      value={productionBudget}
                      onChange={(e) => setProductionBudget(e.target.value)}
                      data-testid="input-production-budget"
                    />
                    <span className="text-sm text-gray-600 whitespace-nowrap">VAT 포함</span>
                    <div className="privacy-checkbox-group">
                      <Checkbox
                        id="hide-production"
                        checked={hideProduction}
                        onCheckedChange={(checked) => setHideProduction(checked as boolean)}
                        data-testid="checkbox-hide-production"
                      />
                      <Label htmlFor="hide-production" className="project-option-label">미공개</Label>
                    </div>
                  </div>
                </div>

                <div className="project-section project-section-horizontal mb-6">
                  <span className="project-section-title">총 예산<br/>(매체비포함)</span>
                  <div className="flex-1 flex items-center gap-3">
                    <Input
                      placeholder="ex) 2,000,000,000 원"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      data-testid="input-total-budget"
                    />
                    <span className="text-sm text-gray-600 whitespace-nowrap">VAT 포함</span>
                    <div className="privacy-checkbox-group">
                      <Checkbox
                        id="hide-total"
                        checked={hideTotal}
                        onCheckedChange={(checked) => setHideTotal(checked as boolean)}
                        data-testid="checkbox-hide-total"
                      />
                      <Label htmlFor="hide-total" className="project-option-label">미공개</Label>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">※VAT 포함 가격</p>
              </>
            ) : (
              <>
                <div className="project-section project-section-horizontal mb-6">
                  <span className="project-section-title">제작비</span>
                  <div className="flex-1 flex items-center gap-3">
                    <Select value={productionRange} onValueChange={setProductionRange}>
                      <SelectTrigger data-testid="select-production-range">
                        <SelectValue placeholder="제작비를 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-50m">5천만 이하</SelectItem>
                        <SelectItem value="50m-100m">5천만 ~ 1억</SelectItem>
                        <SelectItem value="100m-300m">1억~3억</SelectItem>
                        <SelectItem value="300m-500m">3억~5억</SelectItem>
                        <SelectItem value="500m-1b">5억~10억</SelectItem>
                        <SelectItem value="1b-3b">10억~30억</SelectItem>
                        <SelectItem value="over-3b">30억 이상</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="privacy-checkbox-group">
                      <Checkbox
                        id="hide-production-range"
                        checked={hideProduction}
                        onCheckedChange={(checked) => setHideProduction(checked as boolean)}
                        data-testid="checkbox-hide-production-range"
                      />
                      <Label htmlFor="hide-production-range" className="project-option-label">미공개</Label>
                    </div>
                  </div>
                </div>

                <div className="project-section project-section-horizontal mb-6">
                  <span className="project-section-title">총 예산<br/>(매체비포함)</span>
                  <div className="flex-1 flex items-center gap-3">
                    <Select value={totalRange} onValueChange={setTotalRange}>
                      <SelectTrigger data-testid="select-total-range">
                        <SelectValue placeholder="총 예산을 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100m-500m">1억 ~ 5억</SelectItem>
                        <SelectItem value="500m-1b">5억 ~ 10억</SelectItem>
                        <SelectItem value="1b-3b">10억 ~ 30억</SelectItem>
                        <SelectItem value="3b-6b">30억 ~ 60억</SelectItem>
                        <SelectItem value="6b-10b">60억 ~ 100억</SelectItem>
                        <SelectItem value="over-10b">100억 이상</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="privacy-checkbox-group">
                      <Checkbox
                        id="hide-total-range"
                        checked={hideTotal}
                        onCheckedChange={(checked) => setHideTotal(checked as boolean)}
                        data-testid="checkbox-hide-total-range"
                      />
                      <Label htmlFor="hide-total-range" className="project-option-label">미공개</Label>
                    </div>
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
