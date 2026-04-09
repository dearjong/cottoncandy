import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupEmail() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("123456");
  const [codeSent, setCodeSent] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [verificationCodeError, setVerificationCodeError] = useState("");

  useEffect(() => {
    // 회원가입 시 입력한 이메일 가져오기
    const signupEmail = localStorage.getItem('signupEmail') || '';
    setEmail(signupEmail);
  }, []);

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

  const validateVerificationCode = (value: string) => {
    if (!value) {
      setVerificationCodeError("인증번호를 입력해주세요.");
      return false;
    }
    setVerificationCodeError("");
    return true;
  };

  const handleSendCode = () => {
    // 버튼 클릭시 검증
    if (!validateEmail(email)) {
      return;
    }
    setCodeSent(true);
  };

  const handleVerify = () => {
    // 버튼 클릭시 검증
    let hasError = false;
    
    if (!validateEmail(email)) {
      hasError = true;
    }
    if (!validateVerificationCode(verificationCode)) {
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
    
    // 이메일 인증 완료 → 휴대폰 인증으로 이동
    setLocation('/signup/phone');
  };

  return (
    <Layout>
      <div className="py-8 sm:py-10 md:py-12 bg-white min-h-screen">
        <div className="page-content">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h1 className="page-title" data-testid="title-page">
              "이메일 인증을 해주세요."
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
              <p className="page-subtitle py-1">
                전문기업 추천을 위해 정확한 정보를 체크합니다.
              </p>
            </div>
          </motion.div>

          {/* Email Verification Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="space-y-8">
              {/* 이메일 + 인증번호 발송 */}
              <div className="project-section project-section-horizontal">
                <span className="project-section-title"><span className="cotton-candy-pink">*</span> 이메일</span>
                <div className="flex-1">
                  <div className="flex gap-2">
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
                      className="flex-1"
                      data-testid="input-email"
                    />
                    <Button
                      onClick={handleSendCode}
                      className="btn-white-compact"
                      data-testid="button-send-code"
                    >
                      인증번호 발송
                    </Button>
                  </div>
                  {emailError && (
                    <p className="text-xs text-red-500 mt-1">※ {emailError}</p>
                  )}
                </div>
              </div>

              {/* 인증번호 입력 */}
              <div className="project-section project-section-horizontal">
                <span className="project-section-title"><span className="cotton-candy-pink">*</span> 인증번호</span>
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="인증번호 입력"
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      if (verificationCodeError) {
                        validateVerificationCode(e.target.value);
                      }
                    }}
                    className="w-full"
                    data-testid="input-verification-code"
                  />
                  {verificationCodeError && (
                    <p className="text-xs text-red-500 mt-1">※ {verificationCodeError}</p>
                  )}
                </div>
              </div>

              {/* 이메일 인증 버튼 */}
              <div className="text-center pt-4">
                <Button
                  onClick={handleVerify}
                  className="btn-pink"
                  data-testid="button-verify"
                >
                  이메일 인증
                </Button>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
