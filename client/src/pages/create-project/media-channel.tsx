import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { COMMON_MESSAGES } from "@/lib/messages";

export default function Step6() {
  const stepNumber = 6;
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedMainMedia, setSelectedMainMedia] = useState<string[]>([]);
  const [selectedExpandMedia, setSelectedExpandMedia] = useState<string[]>([]);
  const [, setLocation] = useLocation();

  const formatOptions = [
    "일반광고", "숏폼/롱폼", "브랜디드", "인플루언서/UGC", 
    "라이브", "인터랙티브", "뮤직비디오", "단편", "애니메이션"
  ];

  const mainMediaOptions = [
    "TV/극장", "디지털/SNS", "옥외", "전시/홍보"
  ];

  const expandMediaOptions = [
    "라디오", "인쇄", "PR/이벤트", "웹/앱 배너"
  ];

  const handleFormatToggle = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const handleMainMediaToggle = (media: string) => {
    setSelectedMainMedia(prev => 
      prev.includes(media) ? prev.filter(m => m !== media) : [...prev, media]
    );
  };

  const handleExpandMediaToggle = (media: string) => {
    setSelectedExpandMedia(prev => 
      prev.includes(media) ? prev.filter(m => m !== media) : [...prev, media]
    );
  };

  const handlePrevious = () => {
    setLocation('/create-project/step5');
  };

  const handleNext = () => {
    // Update max visited step
    const currentMax = parseInt(localStorage.getItem('maxVisitedStep') || '1');
    if (7 > currentMax) {
      localStorage.setItem('maxVisitedStep', '7');
    }

    if (selectedFormats.length > 0 && selectedMainMedia.length > 0) {
      localStorage.setItem('formats', JSON.stringify(selectedFormats));
      localStorage.setItem('mainMedia', JSON.stringify(selectedMainMedia));
      localStorage.setItem('expandMedia', JSON.stringify(selectedExpandMedia));
      setLocation('/create-project/step7');
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
              [Step{stepNumber}] "어느 매체에 광고하나요?"
            </h1>
            <p className="page-subtitle mt-4" data-testid="subtitle-page">
              광고가 노출될 주요 매체와 제작 형태를 선택해 주세요.
            </p>
          </motion.div>

          {/* 제작 형태 Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="text-lg mb-4">
              <span className="cotton-candy-pink">*</span> <span className="font-semibold">🎥 제작 형태 (콘텐츠 형식)</span>
            </h2>
            <div className="border-t border-gray-300 mb-4"></div>
            <div className="flex flex-wrap gap-3">
              {formatOptions.map((format) => (
                <button
                  key={format}
                  onClick={() => handleFormatToggle(format)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedFormats.includes(format)
                      ? 'bg-pink-50 border-pink-500 text-pink-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                  data-testid={`format-${format}`}
                >
                  {format}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 영상매체 선택 Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-lg mb-4">
              <span className="cotton-candy-pink">*</span> <span className="font-semibold">📺 영상매체 선택 (필수)</span>
            </h2>
            <div className="border-t border-gray-300 mb-4"></div>
            <div className="flex flex-wrap gap-3">
              {mainMediaOptions.map((media) => (
                <button
                  key={media}
                  onClick={() => handleMainMediaToggle(media)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedMainMedia.includes(media)
                      ? 'bg-pink-50 border-pink-500 text-pink-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                  data-testid={`main-media-${media}`}
                >
                  {media}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 확장 매체 Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📣</span>
              <span>확장 매체 (선택)</span>
            </h2>
            <div className="border-t border-gray-300 mb-4"></div>
            <div className="flex flex-wrap gap-3">
              {expandMediaOptions.map((media) => (
                <button
                  key={media}
                  onClick={() => handleExpandMediaToggle(media)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedExpandMedia.includes(media)
                      ? 'bg-pink-50 border-pink-500 text-pink-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                  data-testid={`expand-media-${media}`}
                >
                  {media}
                </button>
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
                disabled={selectedFormats.length === 0 || selectedMainMedia.length === 0}
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
