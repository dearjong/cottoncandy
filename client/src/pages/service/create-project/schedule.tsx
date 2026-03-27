import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COMMON_MESSAGES } from "@/lib/messages";
import { trackCreateProjectCta } from "@/lib/analytics";
import { ChevronDown } from "lucide-react";

export default function Step10() {
  const stepNumber = 10;
  
  // 섹션 펼침/접힘 상태
  const [isApplicationOpen, setIsApplicationOpen] = useState(true);
  const [isOtOpen, setIsOtOpen] = useState(true);
  const [isProposalOpen, setIsProposalOpen] = useState(true);
  const [isPtOpen, setIsPtOpen] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [announceDays, setAnnounceDays] = useState("5");
  
  const [otDate, setOtDate] = useState("");
  const [otPeriod, setOtPeriod] = useState<"오전" | "오후">("오전");
  const [otHour, setOtHour] = useState("");
  const [otMinute, setOtMinute] = useState("");
  const [otLocation, setOtLocation] = useState<"온라인" | "오프라인">("온라인");
  const [otPlatform, setOtPlatform] = useState("Zoom - 안정적인 연결, 대규모 인원 지원");
  const [otRegion, setOtRegion] = useState("서울특별시 강남구");
  
  const [ptDate, setPtDate] = useState("");
  const [ptPeriod, setPtPeriod] = useState<"오전" | "오후">("오전");
  const [ptHour, setPtHour] = useState("");
  const [ptMinute, setPtMinute] = useState("");
  const [ptLocation, setPtLocation] = useState<"온라인" | "오프라인">("온라인");
  const [ptPlatform, setPtPlatform] = useState("Zoom - 안정적인 연결, 대규모 인원 지원");
  const [ptRegion, setPtRegion] = useState("서울특별시 강남구");
  const [rejectionFee, setRejectionFee] = useState("");
  
  const [selectionDays, setSelectionDays] = useState("5");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [onairDate, setOnairDate] = useState("");
  
  const [location, setLocation] = useLocation();

  const handlePrevious = () => {
    trackCreateProjectCta(location, "back");
    setLocation('/create-project/step9');
  };

  const handleNext = () => {
    trackCreateProjectCta(location, "next");
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (11 > currentMax) {
      localStorage.setItem('maxVisitedStep', '11');
    }

    // 값 저장
    const scheduleData = {
      startDate,
      endDate,
      announceDays,
      otDate,
      otPeriod,
      otHour,
      otMinute,
      otLocation,
      otPlatform,
      otRegion,
      ptDate,
      ptPeriod,
      ptHour,
      ptMinute,
      ptLocation,
      ptPlatform,
      ptRegion,
      rejectionFee,
      selectionDays,
      deliveryDate,
      onairDate
    };
    
    localStorage.setItem('schedule', JSON.stringify(scheduleData));
    setLocation('/create-project/step11');
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
              [Step{stepNumber}] "일정이 어떻게 되나요?"
            </h1>
            <p className="page-subtitle mt-4" data-testid="subtitle-page">
              ※ 참여기업 발생 이후에는 마감일 연장만 가능합니다.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="space-y-8">
              {/* 참여신청 */}
              <div>
                <button
                  onClick={() => setIsApplicationOpen(!isApplicationOpen)}
                  className="flex items-center justify-between w-full text-base font-semibold text-gray-800 mb-4 bg-gray-100 px-4 py-3 rounded-lg"
                >
                  <span>참여신청</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isApplicationOpen ? 'rotate-180' : ''}`} />
                </button>
                {isApplicationOpen && (
                  <>
                    <div className="project-section project-section-horizontal mb-4">
                      <span className="project-section-title">접수기간</span>
                      <div className="flex-1 flex items-center gap-3">
                        <Input 
                          type="date" 
                          className="w-40" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          data-testid="input-start-date" 
                        />
                        <span>~</span>
                        <Input 
                          type="date" 
                          className="w-40" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          data-testid="input-end-date" 
                        />
                        <span className="text-sm text-gray-600">총0일</span>
                      </div>
                    </div>
                    <div className="project-section project-section-horizontal">
                      <span className="project-section-title">접수결과 안내</span>
                      <div className="flex-1 flex items-center gap-3">
                        <span className="text-sm text-gray-600">참여신청 마감 후</span>
                        <Input 
                          placeholder="5" 
                          className="w-20" 
                          value={announceDays}
                          onChange={(e) => setAnnounceDays(e.target.value)}
                          data-testid="input-announce-days" 
                        />
                        <span className="text-sm text-gray-600">일이내</span>
                        <span className="text-sm text-gray-600">개별안내</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* OT */}
              <div>
                <button
                  onClick={() => setIsOtOpen(!isOtOpen)}
                  className="flex items-center justify-between w-full text-base font-semibold text-gray-800 mb-4 bg-gray-100 px-4 py-3 rounded-lg"
                >
                  <span>OT</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isOtOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOtOpen && (
                  <>
                    <div className="project-section project-section-horizontal mb-4">
                  <span className="project-section-title">일정</span>
                  <div className="flex-1 flex items-center gap-3">
                    <Input 
                      type="date" 
                      className="w-40" 
                      value={otDate}
                      onChange={(e) => setOtDate(e.target.value)}
                      data-testid="input-ot-date" 
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOtPeriod("오전")}
                        className={`px-4 py-1 rounded border ${otPeriod === "오전" ? "bg-pink-600 text-white border-pink-600" : "border-gray-300"}`}
                        data-testid="button-ot-morning"
                      >
                        오전
                      </button>
                      <button
                        onClick={() => setOtPeriod("오후")}
                        className={`px-4 py-1 rounded border ${otPeriod === "오후" ? "bg-pink-600 text-white border-pink-600" : "border-gray-300"}`}
                        data-testid="button-ot-afternoon"
                      >
                        오후
                      </button>
                    </div>
                    <Input 
                      placeholder="00" 
                      className="w-16" 
                      value={otHour}
                      onChange={(e) => setOtHour(e.target.value)}
                      data-testid="input-ot-hour" 
                    />
                    <span>:</span>
                    <Input 
                      placeholder="00" 
                      className="w-16" 
                      value={otMinute}
                      onChange={(e) => setOtMinute(e.target.value)}
                      data-testid="input-ot-minute" 
                    />
                  </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4 ml-40">
                  ※ 1~12간까지 입력할 수 있습니다.
                    </div>
                    <div className="project-section project-section-horizontal mb-4">
                  <span className="project-section-title">장소</span>
                  <div className="flex-1 flex items-center gap-3">
                    <button
                      onClick={() => setOtLocation("온라인")}
                      className={`px-4 py-1 rounded border ${otLocation === "온라인" ? "bg-pink-600 text-white border-pink-600" : "border-gray-300"}`}
                      data-testid="button-ot-online"
                    >
                      온라인
                    </button>
                    <button
                      onClick={() => setOtLocation("오프라인")}
                      className={`px-4 py-1 rounded border ${otLocation === "오프라인" ? "bg-pink-600 text-white border-pink-600" : "border-gray-300"}`}
                      data-testid="button-ot-offline"
                    >
                      오프라인
                    </button>
                  </div>
                    </div>
                {otLocation === "온라인" ? (
                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title">└ 플랫폼</span>
                    <div className="flex-1">
                      <Input 
                        value={otPlatform}
                        onChange={(e) => setOtPlatform(e.target.value)}
                        data-testid="input-ot-platform" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title">└ 지역</span>
                    <div className="flex-1">
                      <Input 
                        value={otRegion}
                        onChange={(e) => setOtRegion(e.target.value)}
                        data-testid="input-ot-region" 
                      />
                    </div>
                  </div>
                )}
                  </>
                )}
              </div>

              {/* 제안서·시안 */}
              <div>
                <button
                  onClick={() => setIsProposalOpen(!isProposalOpen)}
                  className="flex items-center justify-between w-full text-base font-semibold text-gray-800 mb-4 bg-gray-100 px-4 py-3 rounded-lg"
                >
                  <span>제안서·시안</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isProposalOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProposalOpen && (
                  <>
                    <div className="project-section project-section-horizontal">
                  <span className="project-section-title">업로드 마감</span>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-sm text-gray-600">PT 발표 전</span>
                    <span className="text-sm font-semibold text-gray-800">2시간 이내</span>
                    <span className="text-sm text-gray-600">업로드</span>
                  </div>
                    </div>
                  </>
                )}
              </div>

              {/* PT */}
              <div>
                <button
                  onClick={() => setIsPtOpen(!isPtOpen)}
                  className="flex items-center justify-between w-full text-base font-semibold text-gray-800 mb-4 bg-gray-100 px-4 py-3 rounded-lg"
                >
                  <span>PT</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isPtOpen ? 'rotate-180' : ''}`} />
                </button>
                {isPtOpen && (
                  <>
                    <div className="project-section project-section-horizontal mb-4">
                  <span className="project-section-title">일정</span>
                  <div className="flex-1 flex items-center gap-3">
                    <Input 
                      type="date" 
                      className="w-40" 
                      value={ptDate}
                      onChange={(e) => setPtDate(e.target.value)}
                      data-testid="input-pt-date" 
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPtPeriod("오전")}
                        className={`px-4 py-1 rounded border ${ptPeriod === "오전" ? "bg-pink-600 text-white border-pink-600" : "border-gray-300"}`}
                        data-testid="button-pt-morning"
                      >
                        오전
                      </button>
                      <button
                        onClick={() => setPtPeriod("오후")}
                        className={`px-4 py-1 rounded border ${ptPeriod === "오후" ? "bg-pink-600 text-white border-pink-600" : "border-gray-300"}`}
                        data-testid="button-pt-afternoon"
                      >
                        오후
                      </button>
                    </div>
                    <Input 
                      placeholder="00" 
                      className="w-16" 
                      value={ptHour}
                      onChange={(e) => setPtHour(e.target.value)}
                      data-testid="input-pt-hour" 
                    />
                    <span>:</span>
                    <Input 
                      placeholder="00" 
                      className="w-16" 
                      value={ptMinute}
                      onChange={(e) => setPtMinute(e.target.value)}
                      data-testid="input-pt-minute" 
                    />
                  </div>
                    </div>
                    <div className="project-section project-section-horizontal mb-4">
                  <span className="project-section-title">장소</span>
                  <div className="flex-1 flex items-center gap-3">
                    <button
                      onClick={() => setPtLocation("온라인")}
                      className={`px-4 py-1 rounded border ${ptLocation === "온라인" ? "bg-pink-600 text-white border-pink-600" : "border-gray-300"}`}
                      data-testid="button-pt-online"
                    >
                      온라인
                    </button>
                    <button
                      onClick={() => setPtLocation("오프라인")}
                      className={`px-4 py-1 rounded border ${ptLocation === "오프라인" ? "bg-pink-600 text-white border-pink-600" : "border-gray-300"}`}
                      data-testid="button-pt-offline"
                    >
                      오프라인
                    </button>
                  </div>
                    </div>
                {ptLocation === "온라인" ? (
                  <div className="project-section project-section-horizontal mb-4">
                    <span className="project-section-title">└ 플랫폼</span>
                    <div className="flex-1">
                      <Input 
                        value={ptPlatform}
                        onChange={(e) => setPtPlatform(e.target.value)}
                        data-testid="input-pt-platform" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="project-section project-section-horizontal mb-4">
                    <span className="project-section-title">└ 지역</span>
                    <div className="flex-1">
                      <Input 
                        value={ptRegion}
                        onChange={(e) => setPtRegion(e.target.value)}
                        data-testid="input-pt-region" 
                      />
                    </div>
                  </div>
                )}
                    <div className="project-section project-section-horizontal">
                  <span className="project-section-title">리젝션 Fee<br/>각 팀당</span>
                  <div className="flex-1 flex items-center gap-3">
                    <Input 
                      placeholder="ex) 1,000,000 원"
                      value={rejectionFee}
                      onChange={(e) => setRejectionFee(e.target.value)}
                      data-testid="input-rejection-fee" 
                    />
                    <span className="text-sm text-gray-600">VAT 포함</span>
                  </div>
                    </div>
                  </>
                )}
              </div>

              {/* 주요 일정 */}
              <div>
                <button
                  onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                  className="flex items-center justify-between w-full text-base font-semibold text-gray-800 mb-4 bg-gray-100 px-4 py-3 rounded-lg"
                >
                  <span>주요 일정</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isScheduleOpen ? 'rotate-180' : ''}`} />
                </button>
                {isScheduleOpen && (
                  <>
                    <div className="project-section project-section-horizontal mb-4">
                  <span className="project-section-title">파트너 선정 결과</span>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-sm text-gray-600">PT 발표 후</span>
                    <Input 
                      placeholder="5" 
                      className="w-20" 
                      value={selectionDays}
                      onChange={(e) => setSelectionDays(e.target.value)}
                      data-testid="input-selection-days" 
                    />
                    <span className="text-sm text-gray-600">일 이내</span>
                    <span className="text-sm text-gray-600">개별안내</span>
                  </div>
                    </div>
                    <div className="project-section project-section-horizontal mb-4">
                  <span className="project-section-title">최종 납품 (예상)</span>
                  <div className="flex-1">
                    <Input 
                      type="date" 
                      className="w-40" 
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      data-testid="input-delivery-date" 
                    />
                  </div>
                    </div>
                    <div className="project-section project-section-horizontal">
                  <span className="project-section-title">OnAir (예상)</span>
                  <div className="flex-1">
                    <Input 
                      type="date" 
                      className="w-40" 
                      value={onairDate}
                      onChange={(e) => setOnairDate(e.target.value)}
                      data-testid="input-onair-date" 
                    />
                  </div>
                    </div>
                  </>
                )}
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
