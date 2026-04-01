import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type CtaMode = 'new_public' | 'edit_public' | 'edit_private';

export default function Step18() {
  const stepNumber = 18;
  const [, setLocation] = useLocation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isSaveCompleteOpen, setIsSaveCompleteOpen] = useState(false);
  const [ctaMode, setCtaMode] = useState<CtaMode>('new_public');

  const handleTempSave = () => {
    console.log('임시저장');
  };

  const handleSubmit = () => {
    setIsConfirmOpen(true);
  };

  const handleSwitchToPrivate = () => {
    setIsSaveCompleteOpen(true);
  };

  const handleSwitchToPublic = () => {
    setCtaMode('edit_public');
  };

  const handleCopyProject = () => {
    console.log('프로젝트 복사');
  };

  const handleCancelProject = () => {
    console.log('프로젝트 취소');
  };

  const handleStopProject = () => {
    console.log('프로젝트 중단');
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    setIsCompleteOpen(true);
  };

  const handleAIRecommend = () => {
    console.log('AI 추천기업 보기');
    setIsCompleteOpen(false);
  };

  const handleMyProject = () => {
    console.log('My 프로젝트 확인');
    setIsCompleteOpen(false);
  };

  const EditIcon = ({ testId, onClick }: { testId?: string; onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="text-gray-400 hover:text-gray-600 inline-flex ml-2" 
      data-testid={testId}
    >
      <Edit2 className="w-3.5 h-3.5" />
    </button>
  );

  const hasProjectData = () => {
    return localStorage.getItem('projectName') || 
           localStorage.getItem('adPurposes') || 
           localStorage.getItem('techniques');
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
              [공고로 등록] 프로젝트 등록하기
            </h1>
            <p className="page-subtitle mt-4" data-testid="subtitle-page">
              등록된 공고를 보고 전문 기업이 참여 신청을 합니다.
            </p>
          </motion.div>

          {/* Project Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 sm:mb-10 md:mb-12 w-full"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              {/* Top Header - PID and Tags */}
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
                <div>
                  <div className="text-sm text-gray-600 mb-3" data-testid="text-project-id">
                    PID-20250721-0001 임시저장
                  </div>
                </div>
                <div className="text-sm text-gray-600" data-testid="text-project-type">
                  참여공고 대행사 모집 경쟁PT My담당
                </div>
              </div>

              {/* Company and Project Title */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0" data-testid="avatar-company">
                    B
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-2" data-testid="title-project">
                      [베스트전자] 신제품 판매촉진 프로모션 대행사 모집
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-3">
                      <span data-testid="text-company-name">베스트전자</span>
                      <span className="text-gray-400">|</span>
                      <span data-testid="text-company-size">대기업</span>
                      <span className="text-gray-400">|</span>
                      <span data-testid="text-industry">전기전자</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1" data-testid="text-budget-label">총예산 10~20억</div>
                    <div className="text-xs text-gray-500" data-testid="text-budget-detail">(제작비 3억~6억)</div>
                  </div>
                </div>

                {/* Check Items */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-1" data-testid="tag-quick">
                    <span className="text-green-600">✓</span> 급행 제작 대응
                  </span>
                  <span className="flex items-center gap-1" data-testid="tag-exclude">
                    <span className="text-green-600">✓</span> 경쟁사 수행기업 제외
                  </span>
                  <span className="flex items-center gap-1" data-testid="tag-rejection-fee">
                    <span className="text-green-600">✓</span> 리젝션 Fee
                  </span>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
                {/* Left Column */}
                <div className="space-y-5">
                  {/* 제품명 */}
                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">제품명</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-product-name">
                        [OLED] 스탠바이미2
                        <EditIcon testId="button-edit-product-name" onClick={() => setLocation('/create-project/step11')} />
                      </div>
                    </div>
                  </div>

                  {/* 제품유형 */}
                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 제품유형</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-product-type">
                        카메라/영상/음향가전
                        <EditIcon testId="button-edit-product-type" onClick={() => setLocation('/create-project/step11')} />
                      </div>
                    </div>
                  </div>

                  {/* 의뢰항목 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">의뢰항목</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1" data-testid="text-request-items">
                        <div>전략기획 크리에이티브 기획 영상 제작 미디어 집행</div>
                        <div>성과 측정 및 리포팅 인플루언서/SNS 마케팅</div>
                        <div>PR/언론보도 대응 오프라인 이벤트/프로모션</div>
                        <EditIcon testId="button-edit-request-items" onClick={() => setLocation('/create-project/step2')} />
                      </div>
                    </div>
                  </div>

                  {/* 일정대응 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">일정대응</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-schedule-response">
                        #급행 제작 대응, #당일 피드백 반영 가능, #일정 유동성 대응, #이벤트/행사 대응
                        <EditIcon testId="button-edit-schedule-response" onClick={() => setLocation('/create-project/step2')} />
                      </div>
                    </div>
                  </div>

                  {/* 광고목적 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">광고목적</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1" data-testid="text-ad-purpose">
                        <div>제품판매촉진 /리뷰형 콘텐츠 제작 #실사용</div>
                        <div>브랜드 인지도 향상 #바이럴 확산형 콘텐츠 기획 및 제작, #TV·디지털 연계 캠페인 기획</div>
                        <div>이벤트/프로모션 #명절/할인/이벤트 캠페인</div>
                        <EditIcon testId="button-edit-ad-purpose" onClick={() => setLocation('/create-project/step4')} />
                      </div>
                    </div>
                  </div>

                  {/* 제작기법 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">제작기법</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-production-method">
                        #AI, #라이브액션, #특수촬영, #캐릭터/동물 모델
                        <EditIcon testId="button-edit-production-method" onClick={() => setLocation('/create-project/step5')} />
                      </div>
                    </div>
                  </div>

                  {/* 매체 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">매체</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-media">
                        TV Youtube 디지털광고 옥외
                        <EditIcon testId="button-edit-media" onClick={() => setLocation('/create-project/step6')} />
                      </div>
                    </div>
                  </div>

                  {/* 주요 고객 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">주요 고객</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-target-customer">
                        10대, 20대,
                        <EditIcon testId="button-edit-target-customer" onClick={() => setLocation('/create-project/step7')} />
                      </div>
                    </div>
                  </div>

                  {/* 성별 */}
                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 성별</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-gender">
                        전체
                        <EditIcon testId="button-edit-gender" onClick={() => setLocation('/create-project/step7')} />
                      </div>
                    </div>
                  </div>

                  {/* 직업 */}
                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 직업</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-occupation">
                        직장인, 주부, 자영업자
                        <EditIcon testId="button-edit-occupation" onClick={() => setLocation('/create-project/step7')} />
                      </div>
                    </div>
                  </div>

                  {/* 경쟁사 제한업종 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">경쟁사<br/>제한업종</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-restricted-industry">
                        전기/전자,
                        <EditIcon testId="button-edit-restricted-industry" onClick={() => setLocation('/create-project/step13')} />
                      </div>
                    </div>
                  </div>

                  {/* 수행기업 제외 */}
                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">수행기업<br/>제외</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-excluded-companies">
                        #삼성전자, #애플, #HP, #소니, (최근 6개월)
                        <EditIcon testId="button-edit-excluded-companies" onClick={() => setLocation('/create-project/step13')} />
                      </div>
                    </div>
                  </div>

                  {/* 모집 파트너 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">모집 파트너</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-partner-type">
                        대행사
                        <EditIcon testId="button-edit-partner-type" onClick={() => setLocation('/create-project/step14')} />
                      </div>
                    </div>
                  </div>

                  {/* 세부유형 */}
                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 세부유형</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-partner-subtype">
                        종합 광고대행사
                        <EditIcon testId="button-edit-partner-subtype" onClick={() => setLocation('/create-project/step14')} />
                      </div>
                    </div>
                  </div>

                  {/* 상세조건 */}
                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 상세조건</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1" data-testid="text-partner-requirements">
                        <div>광고 Awards 수상작 10작품 이상 (최근 3년간)</div>
                        <div>TVCF 명예의 전당 5작품 이상 (최근 3년간)</div>
                        <div>TVCF 포트폴리오 50건 이상 (최근 3년간)</div>
                        <div>최소제작비 2억 이상</div>
                        <EditIcon testId="button-edit-partner-requirements" onClick={() => setLocation('/create-project/step14')} />
                      </div>
                    </div>
                  </div>

                  {/* 상세설명 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">상세설명</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 leading-relaxed space-y-2" data-testid="text-description">
                        <p>베스트전자는 전자, 가전 분야의 혁신적인 기술로 세계적인 일류기업 자리를 지켜나가도록 최선을 다하겠습니다.</p>
                        <p>베스트전자는 고객을 위한 가치창조와 인간존중의 경영을 실현합니다.</p>
                        <p>자세한 내용은 OT에서 전달드리겠습니다.</p>
                        <EditIcon testId="button-edit-description" onClick={() => setLocation('/create-project/step17')} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5 lg:border-l lg:border-gray-200 lg:pl-12 mt-6 lg:mt-0">
                  {/* 접수마감 */}
                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">접수마감</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 font-medium" data-testid="text-deadline">
                        D-35
                        <EditIcon testId="button-edit-deadline" onClick={() => setLocation('/create-project/step10')} />
                      </div>
                      <div className="text-xs text-gray-500 mt-1" data-testid="text-deadline-participants">(0팀 참여)</div>
                    </div>
                  </div>

                  {/* 접수기간 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">접수기간</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-application-period">
                        2025.11.10(월) ~ 2025.12.10(수)
                        <EditIcon testId="button-edit-application-period" onClick={() => setLocation('/create-project/step10')} />
                      </div>
                      <div className="text-xs text-gray-500 mt-1" data-testid="text-period-days">(총 30일)</div>
                    </div>
                  </div>

                  {/* 사전미팅(OT) */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">사전미팅(OT)</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1" data-testid="text-ot-info">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded" data-testid="badge-up">UP</span>
                          <span>2025.12.20 (목) 10:00 온라인</span>
                        </div>
                        <div className="text-xs text-gray-500">※ OT 참석기업 &gt; 제안서 검토 후 5일이내 개별 안내</div>
                        <EditIcon testId="button-edit-ot-info" onClick={() => setLocation('/create-project/step10')} />
                      </div>
                    </div>
                  </div>

                  {/* 제출자료 마감 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">제출자료 마감</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-submission-deadline">
                        2025.12.20
                        <EditIcon testId="button-edit-submission-deadline" onClick={() => setLocation('/create-project/step10')} />
                      </div>
                    </div>
                  </div>

                  {/* 경쟁PT */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">경쟁PT</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1" data-testid="text-pt-info">
                        <div>2025.12.25 (수) 12:00 서울시 강남구</div>
                        <div className="text-xs text-gray-500">※ PT 참석기업 &gt; 제안서 검토 후 5일이내 개별 안내</div>
                        <EditIcon testId="button-edit-pt-info" onClick={() => setLocation('/create-project/step10')} />
                      </div>
                    </div>
                  </div>

                  {/* 리젝션 Fee */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">리젝션 Fee</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1" data-testid="text-rejection-fee">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded" data-testid="badge-new">new</span>
                          <span className="font-medium">30만원</span>
                        </div>
                        <div className="text-xs text-gray-500">※ PT후 미선정팀에 개별지급</div>
                        <EditIcon testId="button-edit-rejection-fee" onClick={() => setLocation('/create-project/step9')} />
                      </div>
                    </div>
                  </div>

                  {/* 파트너 선정 결과 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">파트너 선정 결과</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-selection-result">
                        PT발표 후 5일 이내 개별 안내
                        <EditIcon testId="button-edit-selection-result" onClick={() => setLocation('/create-project/step10')} />
                      </div>
                    </div>
                  </div>

                  {/* 납품기한 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">납품기한</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-delivery-date">
                        2025.12.20
                        <EditIcon testId="button-edit-delivery-date" onClick={() => setLocation('/create-project/step10')} />
                      </div>
                    </div>
                  </div>

                  {/* OnAir */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">OnAir</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900" data-testid="text-onair-date">
                        2025.12.25
                        <EditIcon testId="button-edit-onair-date" onClick={() => setLocation('/create-project/step10')} />
                      </div>
                    </div>
                  </div>

                  {/* 대금지급 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">대금지급</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1" data-testid="text-payment-terms">
                        <div>선금 30%,</div>
                        <div>중도금 30%,</div>
                        <div>잔금 40%</div>
                        <EditIcon testId="button-edit-payment-terms" onClick={() => setLocation('/create-project/step9')} />
                      </div>
                    </div>
                  </div>

                  {/* 지원 서류 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">지원 서류</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1" data-testid="text-application-docs">
                        <div><span className="text-pink-600">기본</span> 참여신청서 ⓘ</div>
                        <div><span className="text-pink-600">기본</span> 회사소개서 & 포트폴리오 ⓘ</div>
                        <div>사업자등록증사본</div>
                        <div>비밀유지 서약서</div>
                        <div className="font-medium mt-2">제안서·시안</div>
                        <div className="ml-4">제안서</div>
                        <div className="ml-4">시안</div>
                        <div className="ml-4">견적서</div>
                        <EditIcon testId="button-edit-application-docs" onClick={() => setLocation('/create-project/step15')} />
                      </div>
                    </div>
                  </div>

                  {/* 계약 체결 시 제출 서류 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">계약 체결 시<br/>제출 서류</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1" data-testid="text-contract-docs">
                        <div>용역계약서</div>
                        <div>법인 등기부등본</div>
                        <div>통장 사본</div>
                        <EditIcon testId="button-edit-contract-docs" onClick={() => setLocation('/create-project/step15')} />
                      </div>
                    </div>
                  </div>

                  {/* 기업 웹사이트 */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">기업 웹사이트</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-2" data-testid="text-contact-info">
                        <div>☎ 02-1234-5678</div>
                        <div className="pt-2 border-t border-gray-100">
                          <div>나해피 선임</div>
                          <div>☎ 02-1234-5679</div>
                          <div className="ml-4">010-1234-5679</div>
                          <div>nhappy@yesc.com</div>
                        </div>
                        <EditIcon testId="button-edit-contact-info" onClick={() => setLocation('/create-project/step16')} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-8 options-container"
          >
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-pink-600 text-sm">●</span>
                <p className="text-sm text-gray-700" data-testid="text-notice-1">
                  입력하신 정보는 Cotton Candy 이용자에게 전체 공개되며, 프로젝트 관리 및 서비스 제공 목적에 활용되는 것에 동의합니다.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-600 text-sm">●</span>
                <p className="text-sm text-gray-700" data-testid="text-notice-2">
                  참여기업 발생 후 날짜/내용 변경은 최대 3회까지 가능하며, 추가변경 시 관리자 승인이 필요합니다.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-600 text-sm">●</span>
                <p className="text-sm text-gray-700" data-testid="text-notice-3">
                  계약서 작성 및 프로젝트 관리 등 전 과정은 광고주, 대행사, 제작사가 직접 검토·체결·관리합니다. Cotton Candy는 해당 과정에 직접 참여하지 않으며, 이에 따른 법적 책임을 부담하지 않습니다. 법률 자문이 필요한 경우, 전문가 연결을 도와드립니다.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="options-container"
          >
            {/* 메인 CTA 행 */}
            <div className="flex gap-3 mb-3">
              <Button
                onClick={() => setLocation('/work/project/list')}
                className="btn-white flex-1"
                data-testid="button-list"
              >
                리스트
              </Button>
              <Button
                onClick={() => {}}
                className="btn-white flex-1"
                data-testid="button-view-public"
              >
                공고보기
              </Button>
              <Button
                onClick={handleTempSave}
                className="btn-white flex-1"
                data-testid="button-temp-save"
              >
                임시저장
              </Button>
              {ctaMode === 'new_public' && (
                <>
                  <Button
                    onClick={handleSwitchToPrivate}
                    className="btn-dark flex-1"
                    data-testid="button-switch-private-new"
                  >
                    비공개 직접의뢰 등록
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="btn-pink flex-1"
                    data-testid="button-submit"
                  >
                    공고등록
                  </Button>
                </>
              )}
              {ctaMode === 'edit_public' && (
                <>
                  <Button
                    onClick={handleSwitchToPrivate}
                    className="btn-dark flex-1"
                    data-testid="button-switch-private-edit"
                  >
                    비공개 직접의뢰로 전환
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="btn-pink flex-1"
                    data-testid="button-apply-public"
                  >
                    변경내용 적용
                  </Button>
                </>
              )}
              {ctaMode === 'edit_private' && (
                <>
                  <Button
                    onClick={handleSwitchToPublic}
                    className="btn-dark flex-1"
                    data-testid="button-switch-public"
                  >
                    공고로 전환
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="btn-pink flex-1"
                    data-testid="button-apply-private"
                  >
                    변경내용 적용
                  </Button>
                </>
              )}
            </div>

            {/* 보조 CTA 행 */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleCopyProject}
                className="btn-white flex-1"
                data-testid="button-copy-project"
              >
                프로젝트 복사
              </Button>
              <Button
                onClick={handleCancelProject}
                className="btn-white flex-1"
                data-testid="button-cancel-project"
              >
                프로젝트 취소
              </Button>
              <Button
                onClick={handleStopProject}
                className="btn-white flex-1"
                data-testid="button-stop-project"
              >
                프로젝트 중단
              </Button>
            </div>

            <StepIndicator currentStep={stepNumber} />
          </motion.div>
        </div>
      </div>

      {/* 확인 팝업 */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-confirm">
          <DialogHeader>
            <DialogTitle className="popup-title" data-testid="dialog-confirm-title">
              이 내용으로 승인신청을 할까요?
            </DialogTitle>
            <DialogDescription className="popup-description" data-testid="dialog-confirm-description">
              내용을 꼼꼼히 확인 해 주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="popup-buttons">
            <Button
              onClick={() => setIsConfirmOpen(false)}
              className="btn-white flex-1"
              data-testid="button-cancel"
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              className="btn-pink flex-1"
              data-testid="button-confirm"
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 완료 팝업 */}
      <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-complete">
          <DialogHeader>
            <DialogTitle className="popup-title" data-testid="dialog-complete-title">
              프로젝트 승인신청이 완료되었어요.
            </DialogTitle>
            <DialogDescription className="popup-description" data-testid="dialog-complete-description">
              <p>관리자 확인이 끝나면 바로 게시됩니다. (업일 3일 이내)</p>
              <p className="text-gray-500">(02-000-0000)</p>
            </DialogDescription>
          </DialogHeader>
          <div className="popup-buttons">
            <Button
              onClick={handleAIRecommend}
              className="btn-white flex-1"
              data-testid="button-ai-recommend"
            >
              AI 추천기업 보기
            </Button>
            <Button
              onClick={handleMyProject}
              className="btn-pink flex-1"
              data-testid="button-my-project"
            >
              My 프로젝트 확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 프로젝트 저장 완료 팝업 (1:1 비공개 의뢰로 전환) */}
      <Dialog open={isSaveCompleteOpen} onOpenChange={setIsSaveCompleteOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-save-complete">
          <DialogHeader>
            <DialogTitle className="popup-title" data-testid="dialog-save-complete-title">
              프로젝트 저장이 완료되었어요!
            </DialogTitle>
            <DialogDescription className="popup-description" data-testid="dialog-save-complete-description">
              AI추천기업을 보시고 파트너를 직접 선택하여 제안을 보내실 수 있어요.
            </DialogDescription>
          </DialogHeader>
          <div className="popup-buttons">
            <Button
              onClick={() => {
                console.log('AI 추천기업 보기');
                setIsSaveCompleteOpen(false);
              }}
              className="btn-white flex-1"
              data-testid="button-ai-recommend-save"
            >
              AI 추천기업 보기
            </Button>
            <Button
              onClick={() => {
                console.log('My 프로젝트 확인');
                setIsSaveCompleteOpen(false);
              }}
              className="btn-pink flex-1"
              data-testid="button-my-project-save"
            >
              My 프로젝트 확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
