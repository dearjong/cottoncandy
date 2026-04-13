import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import Layout from "@/components/layout/layout";
import SelectionCard from "@/components/project-creation/selection-card";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Step1Option } from "@/lib/types";
import { COMMON_MESSAGES } from "@/lib/messages";
import { getSubtitle } from "@/config/global-events";
import { trackCreateProjectCta, publishAnalytics } from "@/lib/analytics";

const step1Options: Step1Option[] = [
  {
    id: "public",
    title: "공개 프로젝트로 등록",
    subtitle: "무료",
    description: "등록된 공고를 보고\n전문 기업이 참여 신청합니다.",
    icon: "custom-public",
    bgColor: "bg-cotton-light-pink",
    iconColor: "text-pink-600",
  },
  {
    id: "private",
    title: "1:1 비공개 의뢰",
    subtitle: "무료",
    description: "AI가 추천 기업 or\n내가 원하는 기업에 직접 의뢰",
    icon: "custom-robot",
    bgColor: "bg-cotton-light-blue",
    iconColor: "text-blue-600",
  },
  {
    id: "consulting",
    title: "컨설턴트에게 맡길래요",
    subtitle: "20만원부터~",
    description: "간단상담, 기업매칭,\nOT, PT까지 관리",
    icon: "custom-lock",
    bgColor: "bg-cotton-gray",
    iconColor: "text-gray-400",
  },
];

export default function Step1PartnerSelection() {
  const stepNumber = 1;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [progressStage, setProgressStage] = useState<string>("");
  const [stageDetails, setStageDetails] = useState<string[]>(["video"]);
  const [onlyDiscount, setOnlyDiscount] = useState<boolean>(false);
  const [partnerSelection, setPartnerSelection] = useState<string>("");
  const [privateStageDetails, setPrivateStageDetails] = useState<string[]>(["video"]);
  const [showExampleDialog, setShowExampleDialog] = useState<boolean>(false);
  const [showGuideDialog, setShowGuideDialog] = useState<boolean>(false);
  const [location, setLocation] = useLocation();

  const eventInfo = getSubtitle(undefined, "request");

  const handleStageDetailToggle = (detail: string) => {
    setStageDetails((prev) =>
      prev.includes(detail) ? prev.filter((d) => d !== detail) : [...prev, detail],
    );
  };

  const handlePrivateStageDetailToggle = (detail: string) => {
    setPrivateStageDetails((prev) =>
      prev.includes(detail) ? prev.filter((d) => d !== detail) : [...prev, detail],
    );
  };

  const handleNext = () => {
    trackCreateProjectCta(location, "next");
    publishAnalytics("step1_cta_click", {
      selected_option: selectedOption ?? "none",
      destination: selectedOption === "consulting" ? "/create-project/consulting-inquiry" : "/create-project/step2",
    });
    if (selectedOption) {
      localStorage.setItem("step1Selection", selectedOption);

      if (selectedOption === "consulting") {
        setLocation("/create-project/consulting-inquiry");
      } else {
        const currentMax = parseInt(localStorage.getItem("maxVisitedStep") || "1");
        if (2 > currentMax) {
          localStorage.setItem("maxVisitedStep", "2");
        }

        if (selectedOption === "public") {
          localStorage.setItem("progressStage", progressStage);
          localStorage.setItem("stageDetails", JSON.stringify(stageDetails));
          localStorage.setItem("onlyDiscount", String(onlyDiscount));
        } else if (selectedOption === "private") {
          localStorage.setItem("partnerSelection", partnerSelection);
          localStorage.setItem("privateStageDetails", JSON.stringify(privateStageDetails));
        }

        setLocation("/create-project/step2");
      }
    }
  };

  useEffect(() => {
    // 기존 로직 유지 (선택 복원 등) - 현재는 초기 선택 없음
  }, []);

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
              [Step{stepNumber}] "내 마음을 알아주는 파트너,<br />어떻게 찾을까요?"
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
              <p className="page-subtitle py-1">
                {eventInfo.subtitle}{" "}
                <a href={eventInfo.link} className="text-gray-500 hover:underline">
                  {eventInfo.linkText}
                </a>
              </p>
              <button
                onClick={() => setShowGuideDialog(true)}
                className="px-4 py-1.5 bg-gray-800 text-white rounded-full text-xs hover:bg-gray-700 transition-colors whitespace-nowrap"
                data-testid="button-guide"
              >
                이용방법
              </button>
            </div>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 sm:mb-12 md:mb-16"
          >
            <div className="w-full mx-auto card-grid-3cols">
              {step1Options.map((option, index) => (
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

          {/* 공개 프로젝트 옵션 */}
          {selectedOption === "public" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10 sm:mb-14 options-container"
            >
              <div className="project-section project-section-horizontal">
                <span className="project-section-title">
                  <span className="cotton-candy-pink">*</span> 파트너 선정방식
                </span>
                <RadioGroup
                  value={progressStage}
                  onValueChange={setProgressStage}
                  className="flex gap-3 sm:gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="lightweight"
                      id="lightweight"
                      data-testid="radio-lightweight"
                    />
                    <Label htmlFor="lightweight" className="project-option-label">
                      경쟁 PT
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solo" id="solo" data-testid="radio-solo" />
                    <Label htmlFor="solo" className="project-option-label">
                      단독 PT
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="fashion"
                      id="fashion"
                      data-testid="radio-fashion"
                    />
                    <Label htmlFor="fashion" className="project-option-label">
                      제안서 or 포트폴리오
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="project-section project-section-horizontal">
                <span className="project-section-title">
                  <span className="cotton-candy-pink">*</span> 진행 단계 선택
                </span>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ot"
                      checked={stageDetails.includes("ot")}
                      onCheckedChange={() => handleStageDetailToggle("ot")}
                      data-testid="checkbox-ot"
                    />
                    <Label htmlFor="ot" className="project-option-label">
                      OT (사전미팅)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pt1"
                      checked={stageDetails.includes("pt1")}
                      onCheckedChange={() => handleStageDetailToggle("pt1")}
                      data-testid="checkbox-pt1"
                    />
                    <Label htmlFor="pt1" className="project-option-label">
                      PT (1차)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pt2"
                      checked={stageDetails.includes("pt2")}
                      onCheckedChange={() => handleStageDetailToggle("pt2")}
                      data-testid="checkbox-pt2"
                    />
                    <Label htmlFor="pt2" className="project-option-label">
                      PT (2차)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="video"
                      checked
                      disabled
                      data-testid="checkbox-video"
                    />
                    <Label htmlFor="video" className="project-option-label opacity-50">
                      영상제작
                    </Label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 1:1 비공개 옵션 */}
          {selectedOption === "private" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10 sm:mb-14 options-container"
            >
              <div className="project-section project-section-horizontal">
                <span className="project-section-title">
                  <span className="cotton-candy-pink">*</span> 파트너 선정방식
                </span>
                <RadioGroup
                  value={partnerSelection}
                  onValueChange={setPartnerSelection}
                  className="flex gap-3 sm:gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="competitive"
                      id="competitive"
                      data-testid="radio-competitive"
                    />
                    <Label htmlFor="competitive" className="project-option-label">
                      경쟁 PT
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="exclusive"
                      id="exclusive"
                      data-testid="radio-exclusive"
                    />
                    <Label htmlFor="exclusive" className="project-option-label">
                      단독 PT
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="proposal"
                      id="proposal"
                      data-testid="radio-proposal"
                    />
                    <Label htmlFor="proposal" className="project-option-label">
                      제안서 or 포트폴리오
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="project-section project-section-horizontal">
                <span className="project-section-title">
                  <span className="cotton-candy-pink">*</span> 진행 단계 선택
                </span>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="private-ot"
                      checked={privateStageDetails.includes("ot")}
                      onCheckedChange={() => handlePrivateStageDetailToggle("ot")}
                      data-testid="checkbox-private-ot"
                    />
                    <Label htmlFor="private-ot" className="project-option-label">
                      OT (사전미팅)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="private-pt1"
                      checked={privateStageDetails.includes("pt1")}
                      onCheckedChange={() => handlePrivateStageDetailToggle("pt1")}
                      data-testid="checkbox-private-pt1"
                    />
                    <Label htmlFor="private-pt1" className="project-option-label">
                      PT (1차)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="private-pt2"
                      checked={privateStageDetails.includes("pt2")}
                      onCheckedChange={() => handlePrivateStageDetailToggle("pt2")}
                      data-testid="checkbox-private-pt2"
                    />
                    <Label htmlFor="private-pt2" className="project-option-label">
                      PT (2차)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="private-video"
                      checked
                      disabled
                      data-testid="checkbox-private-video"
                    />
                    <Label htmlFor="private-video" className="project-option-label opacity-50">
                      영상제작
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-1 mt-8">
                <p className="project-description">
                  ※ 프로젝트 상세 내용은 의뢰하시는 기업에게만 1:1로 안전하게 열람됩니다.
                  <button
                    onClick={() => setShowExampleDialog(true)}
                    className="ml-1 cursor-pointer hover:opacity-70 transition-opacity"
                    type="button"
                  >
                    ⓘ
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* 하단 CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Button
              onClick={handleNext}
              disabled={
                !selectedOption ||
                (selectedOption === "public" && !progressStage) ||
                (selectedOption === "private" && !partnerSelection)
              }
              className="btn-pink"
              data-testid="button-next"
            >
              다음
            </Button>

            <p className="project-description mt-4">{COMMON_MESSAGES.TEMP_SAVE_NOTICE}</p>

            <StepIndicator currentStep={stepNumber} />
          </motion.div>
        </div>
      </div>

      {/* 1:1 비공개 예시 Dialog */}
      <Dialog open={showExampleDialog} onOpenChange={setShowExampleDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">
              [1:1비공개 의뢰] 외부표기 예시
            </DialogTitle>
          </DialogHeader>

          {/* Example Project Card */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">PN-20250721-0001</span>
                <span className="text-sm text-gray-700">정수중</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                  🔒 1:1 비공개
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  제작사 모집
                </span>
                <span className="px-3 py-1 bg-pink-50 text-pink-600 text-xs rounded-full">
                  비로제작
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🛡️ [1:1비공개] 직접 의뢰받은 기업에게만 공개됩니다.
              </h3>
              <div className="flex gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-gray-100 rounded">기업명비공개</span>
                <span className="px-2 py-1 bg-gray-100 rounded">Creative 중심 대행사</span>
              </div>
            </div>

            {/* Date */}
            <div className="text-sm text-gray-600 mb-4">
              마감 2025.08.19 납품기한 2025.12.25
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                영상 기획
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                영상 촬영
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                편집 및 후반작업
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                음악/BGM
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                모델/배우 섭외
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                매체 집행
              </span>
            </div>

            {/* Hashtags */}
            <div className="text-sm text-gray-500 mb-4">#AI #리브랜딩 #복수출연</div>

            {/* Bottom Info */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs rounded">
                  ✓ 급한 제작 대응
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">
                  제작비{" "}
                  <span className="text-xl font-bold text-pink-600">
                    3~6억원
                  </span>
                </div>
                <div className="text-xs text-gray-400">(총예산 10~20억원)</div>
                <div className="text-sm text-gray-700 mt-2">
                  마감 <span className="font-bold">D-35</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4 text-right">
              <Button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                ✉ 문의하기
              </Button>
            </div>
          </div>

          {/* Bottom Notice */}
          <p className="text-sm text-gray-500 mt-4 text-center">
            ※ 프로젝트 상세 내용은 의뢰하시는 기업에게 1:1로 안전하게 열람됩니다.
          </p>
        </DialogContent>
      </Dialog>

      {/* 이용방법 Dialog */}
      <Dialog open={showGuideDialog} onOpenChange={setShowGuideDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden [&>button]:z-20" data-testid="dialog-guide">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
            <DialogTitle className="text-2xl font-bold text-center">이용방법</DialogTitle>
          </DialogHeader>

          <div
            className="space-y-6 overflow-y-auto px-6 pb-6"
            style={{ maxHeight: "calc(80vh - 120px)" }}
          >
            {/* 회원가입 및 인증방법 안내 */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">회원가입 및 인증방법 안내</h3>
                <span className="text-sm text-gray-500">2025-09-12</span>
              </div>
            </div>

            {/* 프로젝트 등록 안내 */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">프로젝트 등록 안내</h3>
                <span className="text-sm text-gray-500">2025-09-12</span>
              </div>
            </div>

            {/* 등급안내 */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">등급안내</h3>
                <span className="text-sm text-gray-500">2025-09-12</span>
              </div>
              <div className="mt-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">메달 등급</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">조건</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Gold</td>
                      <td className="border border-gray-200 px-4 py-2">
                        TVCF.co.kr 포트폴리오 100건 이상, 리뷰 평균 4.7점 이상
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Silver</td>
                      <td className="border border-gray-200 px-4 py-2">
                        TVCF.co.kr 포트폴리오 50건 이상, 리뷰 평균 4.5점 이상
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">Bronze</td>
                      <td className="border border-gray-200 px-4 py-2">
                        TVCF.co.kr 포트폴리오 30건 이상, 리뷰 평균 4.0점 이상
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">신규</td>
                      <td className="border border-gray-200 px-4 py-2">활동 이력 없음</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p>※ 현재는 TVCF에 등록된 포트폴리오 기준으로 등급이 부여됩니다.</p>
                  <p>※ 추후 Cotton Candy 내 실제 계약 건수 및 리뷰를 기준으로 등급이 조정될 예정입니다.</p>
                </div>
              </div>
            </div>

            {/* 참여방법 안내 */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">참여방법 안내</h3>
                <span className="text-sm text-gray-500">2025-09-12</span>
              </div>
            </div>

            {/* 파트너 매칭방법 안내 */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">파트너 매칭방법 안내</h3>
                <span className="text-sm text-gray-500">2025-09-12</span>
              </div>
            </div>

            {/* 계약 및 결제 안내 */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">계약 및 결제 안내</h3>
                <span className="text-sm text-gray-500">2025-09-12</span>
              </div>
            </div>

            {/* 제작관리 안내 */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">제작관리 안내</h3>
                <span className="text-sm text-gray-500">2025-09-12</span>
              </div>
            </div>

            {/* 비용안내 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">비용안내</h3>
                <span className="text-sm text-gray-500">2025-09-12</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </Layout>
  );
}


