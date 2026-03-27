import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Check } from "lucide-react";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getSubtitle } from "@/config/global-events";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [selectedCard, setSelectedCard] = useState<'existing' | 'new'>('new');
  const [customerType, setCustomerType] = useState<string>('advertiser');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  
  // 메뉴별 서브타이틀 가져오기 (광고제작 의뢰하기 메뉴)
  const eventInfo = getSubtitle(undefined, 'request');

  const handleExistingUserClick = () => {
    setSelectedCard('existing');
    setLocation('/login');
  };

  const handleNewUserClick = () => {
    setSelectedCard('new');
  };

  const handleNext = () => {
    // 회원가입 정보 저장
    localStorage.setItem('signupEmail', email);
    localStorage.setItem('signupCustomerType', customerType);
    // 다음 단계로 이동 (휴대폰 인증)
    setLocation('/signup/phone');
  };

  return (
    <Layout>
      <div className="py-8 sm:py-12 md:py-20 bg-white min-h-screen">
        <div className="page-content">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h1 className="page-title" data-testid="title-page">
              "신규 이용자 입니다."
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
              {/* 메뉴별 서브타이틀 - global-events.ts에서 관리 */}
              <p className="page-subtitle py-1">
                {eventInfo.subtitle} <a href={eventInfo.link} className="text-gray-500 hover:underline">{eventInfo.linkText}</a>
              </p>
            </div>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 sm:mb-12 md:mb-16"
          >
            <div className="w-full mx-auto card-grid-2cols">
              {/* 기존 회원 카드 */}
              <motion.div
                whileHover={{ 
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExistingUserClick}
                className={`unified-card ${selectedCard === 'existing' ? 'unified-card-selected' : 'bg-white'}`}
                data-testid="card-existing-user"
              >
                <div className="text-center">
                  <h3 className="unified-card-title">TVCF/ Cotton Candy 회원</h3>
                  <p className="unified-card-description">
                    TVCF 기존 회원은 별도 절차없이 바로 로그인
                  </p>
                  <div className="unified-card-check">
                    <Check className={`w-6 h-6 ${selectedCard === 'existing' ? 'text-white' : 'text-gray-300'}`} strokeWidth={3} />
                  </div>
                </div>
              </motion.div>

              {/* 신규 이용자 카드 */}
              <motion.div
                whileHover={{ 
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewUserClick}
                className={`unified-card ${selectedCard === 'new' ? 'unified-card-selected' : 'bg-white'}`}
                data-testid="card-new-user"
              >
                <div className="text-center">
                  <h3 className="unified-card-title">신규 이용자예요</h3>
                  <p className="unified-card-description">
                    TVCF나 Cotton Candy가 처음이예요.
                  </p>
                  <div className="unified-card-check">
                    <Check className={`w-6 h-6 ${selectedCard === 'new' ? 'text-white' : 'text-gray-300'}`} strokeWidth={3} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Signup Form - 신규 이용자 선택 시 */}
          {selectedCard === 'new' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10 sm:mb-14 options-container"
            >
              <div className="space-y-8">
                {/* 고객유형 */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title">고객유형</span>
                  <RadioGroup value={customerType} onValueChange={setCustomerType} className="flex gap-3 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advertiser" id="advertiser" data-testid="radio-advertiser" />
                      <Label htmlFor="advertiser" className="project-option-label">광고주</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="agency" id="agency" data-testid="radio-agency" />
                      <Label htmlFor="agency" className="project-option-label">대행사</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="production" id="production" data-testid="radio-production" />
                      <Label htmlFor="production" className="project-option-label">제작사</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* 이메일 */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title">이메일</span>
                  <Input
                    type="email"
                    placeholder="ex)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    data-testid="input-email"
                  />
                </div>

                {/* 비밀번호 */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title">비밀번호</span>
                  <Input
                    type="password"
                    placeholder="ex)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1"
                    data-testid="input-password"
                  />
                </div>

                {/* 비밀번호 확인 */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title">비밀번호 확인</span>
                  <Input
                    type="password"
                    placeholder="ex)"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="flex-1"
                    data-testid="input-password-confirm"
                  />
                </div>

                {/* 다음 버튼 */}
                <div className="text-center pt-4">
                  <Button
                    onClick={handleNext}
                    className="btn-pink"
                    data-testid="button-next"
                  >
                    다음
                  </Button>
                </div>

                {/* 안내 문구 */}
                <div className="space-y-2 text-center">
                  <p className="project-description">
                    이미 Cotton Candy/TVCF 회원이신 경우 <a href="/login" className="text-pink-600 hover:underline">로그인</a> 해주세요.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
