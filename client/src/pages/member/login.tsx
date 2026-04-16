import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Check } from "lucide-react";
import { NaverIcon } from "@/components/ui/naver-icon";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSubtitle } from "@/config/global-events";
import { identifyUser, trackLogin, trackLoginStarted, trackLoginCompleted } from "@/lib/analytics";
import memberImage from "@assets/로그인 회원_1759381986859.png";
import nonMemberImage from "@assets/로그인 비회원_1759381986859.png";
import googleLogo from "@assets/Logo_Google_1759383453744.png";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("test@cottoncandy.kr");
  const [selectedCard, setSelectedCard] = useState<'existing' | 'new' | null>('existing');
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [customerType, setCustomerType] = useState<string>('advertiser');
  const [password, setPassword] = useState("test1234!");
  const [passwordConfirm, setPasswordConfirm] = useState("test1234!");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // 팝업 상태
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  
  // 에러 상태
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  
  // 메뉴별 서브타이틀 가져오기 (광고제작 의뢰하기 메뉴)
  const eventInfo = getSubtitle(undefined, 'request');

  // 이메일 검증
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("이메일을 입력해주세요.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
      return false;
    }
    setEmailError("");
    return true;
  };

  // 비밀번호 검증
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("비밀번호를 입력해주세요.");
      return false;
    }
    if (value.length < 8) {
      setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // 비밀번호 확인 검증
  const validatePasswordConfirm = (value: string) => {
    if (!value) {
      setPasswordConfirmError("비밀번호 확인을 입력해주세요.");
      return false;
    }
    if (value !== password) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    setPasswordConfirmError("");
    return true;
  };

  const handleExistingUserClick = () => {
    setSelectedCard('existing');
    setLoginStep(1);
    setEmailError("");
    setPasswordError("");
    setPasswordConfirmError("");
  };

  const handleNewUserClick = () => {
    setSelectedCard('new');
    setLoginStep(1);
    setEmailError("");
    setPasswordError("");
    setPasswordConfirmError("");
  };

  const handleEmailNext = () => {
    if (!validateEmail(email)) return;
    trackLoginStarted({ method: "email" });
    setLoginStep(2);
  };

  const handleLogin = () => {
    if (!validatePassword(password)) return;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', '이꽃별');
    localStorage.setItem('userType', '의뢰');
    localStorage.setItem('userMode', 'request');
    identifyUser({ userId: `user-${email}`, userType: "advertiser", email });
    trackLogin({ method: "email", user_type: "advertiser" });
    trackLoginCompleted({ method: "email", user_type: "advertiser" });
    setLocation('/work/home');
  };

  const handleNext = () => {
    // 버튼 클릭시 검증
    let hasError = false;
    
    if (!validateEmail(email)) {
      hasError = true;
    }
    if (!validatePassword(password)) {
      hasError = true;
    }
    if (!validatePasswordConfirm(passwordConfirm)) {
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
    
    // 회원가입 정보 저장
    localStorage.setItem('signupEmail', email);
    localStorage.setItem('signupCustomerType', customerType);
    // 다음 단계로 이동 (휴대폰 인증)
    setLocation('/signup/phone');
  };

  return (
    <Layout>
      <div className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="page-content">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h1 className="page-title" data-testid="title-page">
              {selectedCard === 'new' ? '"신규 이용자 입니다."' : '"Cotton Candy & TVCF 통합 로그인"'}
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
                  <div className="unified-card-icon relative overflow-hidden">
                    <img 
                      src={nonMemberImage} 
                      alt="신규 이용자" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="unified-card-title">신규 이용자예요</h3>
                  <p className="unified-card-description">
                    TVCF나 Cotton Candy가 처음이예요.
                  </p>
                  <div className="unified-card-check">
                    <Check className={`w-6 h-6 ${selectedCard === 'new' ? 'text-white' : 'text-gray-300'}`} strokeWidth={3} />
                  </div>
                </div>
              </motion.div>

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
                  <div className="unified-card-icon relative overflow-hidden">
                    <img 
                      src={memberImage} 
                      alt="TVCF 회원" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="unified-card-title">Cotton Candy·TVCF 회원</h3>
                  <p className="unified-card-description">
                    TVCF 기존 회원은 별도 절차없이 바로 로그인
                  </p>
                  <div className="unified-card-check">
                    <Check className={`w-6 h-6 ${selectedCard === 'existing' ? 'text-white' : 'text-gray-300'}`} strokeWidth={3} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Login Form - 기존 회원 선택 시 */}
          {selectedCard === 'existing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10 sm:mb-14 options-container"
            >
              <div className="space-y-8">
                {/* ── 1단계: 이메일 입력 ── */}
                {loginStep === 1 && (
                  <>
                    <div className="project-section project-section-horizontal">
                      <span className="project-section-title"><span className="cotton-candy-pink">*</span> 이메일</span>
                      <div className="flex-1">
                        <Input
                          type="email"
                          placeholder="ex) tvcfad@tvcf.co.kr"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) validateEmail(e.target.value);
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleEmailNext()}
                          className="w-full"
                          data-testid="input-email"
                          autoFocus
                        />
                        {emailError && (
                          <p className="text-xs text-red-500 mt-1">※ {emailError}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-center space-y-4 pt-4">
                      <Button
                        onClick={handleEmailNext}
                        className="btn-pink"
                        disabled={!email}
                        data-testid="button-email-next"
                      >
                        다음
                      </Button>

                      <div className="space-y-2">
                        <Button
                          onClick={() => {
                            trackLoginStarted({ method: "naver" });
                            setLocation('/login/naver');
                          }}
                          className="btn-white"
                          data-testid="button-naver"
                        >
                          <NaverIcon className="w-5 h-5 mr-2 icon-naver" />
                          네이버 로그인
                        </Button>
                        <Button
                          onClick={() => {
                            trackLoginStarted({ method: "google" });
                            setLocation('/login/google');
                          }}
                          className="btn-white"
                          data-testid="button-google"
                        >
                          <img src={googleLogo} alt="Google" className="w-5 h-5 mr-2" />
                          구글 로그인
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ── 2단계: 비밀번호 입력 ── */}
                {loginStep === 2 && (
                  <>
                    <div className="project-section project-section-horizontal">
                      <span className="project-section-title">이메일</span>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-sm text-gray-700">{email}</span>
                        <button
                          type="button"
                          onClick={() => { setLoginStep(1); setPassword(""); setPasswordError(""); }}
                          className="text-xs text-gray-400 hover:text-gray-600 underline"
                        >
                          변경
                        </button>
                      </div>
                    </div>

                    <div className="project-section project-section-horizontal">
                      <span className="project-section-title"><span className="cotton-candy-pink">*</span> 비밀번호</span>
                      <div className="flex-1">
                        <Input
                          type="password"
                          placeholder="비밀번호를 입력해주세요"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) validatePassword(e.target.value);
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                          className="w-full"
                          data-testid="input-password"
                          autoFocus
                        />
                        {passwordError && (
                          <p className="text-xs text-red-500 mt-1">※ {passwordError}</p>
                        )}
                        <div className="flex justify-end mt-1">
                          <button type="button" className="text-xs text-gray-400 hover:text-gray-600">
                            비밀번호 찾기
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-4">
                      <Button
                        onClick={handleLogin}
                        className="btn-pink"
                        disabled={!password}
                        data-testid="button-login"
                      >
                        통합 로그인 (Cotton Candy/TVCF)
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

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
                  <span className="project-section-title"><span className="cotton-candy-pink">*</span> 고객유형</span>
                  <div className="flex-1">
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
                </div>

                {/* 이메일 */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title"><span className="cotton-candy-pink">*</span> 이메일</span>
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="ex) tvcfad@tvcf.co.kr"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) {
                          validateEmail(e.target.value);
                        }
                      }}
                      className="w-full"
                      data-testid="input-signup-email"
                    />
                    {emailError && (
                      <p className="text-xs text-red-500 mt-1">※ {emailError}</p>
                    )}
                  </div>
                </div>

                {/* 비밀번호 */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title"><span className="cotton-candy-pink">*</span> 비밀번호</span>
                  <div className="flex-1">
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력해주세요"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) {
                          validatePassword(e.target.value);
                        }
                      }}
                      className="w-full"
                      data-testid="input-signup-password"
                    />
                    {passwordError ? (
                      <p className="text-xs text-red-500 mt-1">※ {passwordError}</p>
                    ) : password && password.length >= 8 ? null : (
                      <p className="text-xs text-gray-400 mt-1">※ 영문, 숫자 조합 8자 이상 입력해주세요.</p>
                    )}
                  </div>
                </div>

                {/* 비밀번호 확인 */}
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title"><span className="cotton-candy-pink">*</span> 비밀번호 확인</span>
                  <div className="flex-1">
                    <Input
                      type="password"
                      placeholder="비밀번호를 다시 입력해주세요"
                      value={passwordConfirm}
                      onChange={(e) => {
                        setPasswordConfirm(e.target.value);
                        if (passwordConfirmError) {
                          validatePasswordConfirm(e.target.value);
                        }
                      }}
                      className="w-full"
                      data-testid="input-password-confirm"
                    />
                    {passwordConfirmError ? (
                      <p className="text-xs text-red-500 mt-1">※ {passwordConfirmError}</p>
                    ) : passwordConfirm && passwordConfirm === password ? null : (
                      <p className="text-xs text-gray-400 mt-1">※ 비밀번호 확인을 위해 한번 더 입력해주세요.</p>
                    )}
                  </div>
                </div>

                {/* 회원가입 동의 */}
                <div className="pt-4">
                  <div className="flex items-start gap-2 mb-6">
                    <Checkbox
                      id="agree-terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      data-testid="checkbox-agree-terms"
                    />
                    <label
                      htmlFor="agree-terms"
                      className="text-sm cursor-pointer leading-tight"
                      style={{ color: 'rgba(0, 0, 0, 0.5)' }}
                    >
                      Cotton Candy·TVCF 통합회원 가입 및 {' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsDialog(true);
                        }}
                        className="underline hover:text-gray-700"
                      >
                        이용약관
                      </button>
                      과 개인정보 수집·이용, {' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPrivacyDialog(true);
                        }}
                        className="underline hover:text-gray-700"
                      >
                        개인정보 취급방침
                      </button>
                      에 동의합니다.
                    </label>
                  </div>
                </div>

                {/* 다음 버튼 */}
                <div className="text-center">
                  <Button
                    onClick={handleNext}
                    className="btn-pink"
                    disabled={!customerType || !email || !password || !passwordConfirm || !agreeToTerms}
                    data-testid="button-next"
                  >
                    다음
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 이용약관 팝업 */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="popup-title">이용약관</DialogTitle>
          </DialogHeader>
          <div className="popup-description text-left space-y-4 mt-4">
            <p className="font-bold">제1조 (목적)</p>
            <p>이 약관은 Cotton Candy·TVCF(이하 "회사"라 합니다)가 제공하는 광고 제작 및 매칭 서비스(이하 "서비스"라 합니다)의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
            
            <p className="font-bold">제2조 (용어의 정의)</p>
            <p>1. "회원"이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</p>
            <p>2. "아이디(ID)"라 함은 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.</p>
            
            <p className="font-bold">제3조 (약관의 게시와 개정)</p>
            <p>1. 회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</p>
            <p>2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
            
            <p className="font-bold">제4조 (서비스의 제공 및 변경)</p>
            <p>1. 회사는 다음과 같은 업무를 수행합니다.</p>
            <p>- 광고 제작 프로젝트 매칭 서비스</p>
            <p>- 광고 제작사 및 대행사 소개 서비스</p>
            <p>- 기타 회사가 정하는 업무</p>
          </div>
          <div className="popup-buttons">
            <Button
              onClick={() => setShowTermsDialog(false)}
              className="btn-pink flex-1"
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 개인정보 취급방침 팝업 */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="popup-title">개인정보 취급방침</DialogTitle>
          </DialogHeader>
          <div className="popup-description text-left space-y-4 mt-4">
            <p className="font-bold">1. 개인정보의 수집 및 이용목적</p>
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <p>- 회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</p>
            <p>- 서비스 제공: 광고 제작 프로젝트 매칭, 맞춤 서비스 제공</p>
            
            <p className="font-bold">2. 수집하는 개인정보 항목</p>
            <p>회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
            <p>- 필수항목: 이메일, 비밀번호, 휴대전화번호, 회원구분(의뢰/제작)</p>
            
            <p className="font-bold">3. 개인정보의 보유 및 이용기간</p>
            <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
            <p>- 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)</p>
            
            <p className="font-bold">4. 개인정보의 파기</p>
            <p>회사는 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다.</p>
          </div>
          <div className="popup-buttons">
            <Button
              onClick={() => setShowPrivacyDialog(false)}
              className="btn-pink flex-1"
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
