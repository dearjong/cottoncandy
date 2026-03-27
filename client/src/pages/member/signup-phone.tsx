import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPhone() {
  const [, setLocation] = useLocation();
  const [phone1, setPhone1] = useState("010");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");

  const handleVerify = () => {
    console.log('휴대폰 인증:', `${phone1}-${phone2}-${phone3}`);
    // 다음 단계로 이동 (이메일 인증)
    setLocation('/signup/email');
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
              "안심하고 진행할 수 있도록,<br />휴대폰인증이 필요해요."
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
              <p className="page-subtitle py-1">
                휴대폰/ 이메일 인증만 하면, 전문 기업이 우르르 대기중~*
              </p>
            </div>
          </motion.div>

          {/* Phone Verification Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 sm:mb-14 options-container"
          >
            <div className="space-y-8">
              {/* 휴대전화 */}
              <div className="project-section project-section-horizontal">
                <span className="project-section-title">휴대전화</span>
                <div className="flex-1">
                  <div className="flex gap-2 items-center">
                    <Input
                      type="text"
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value)}
                      className="w-20"
                      maxLength={3}
                      data-testid="input-phone1"
                    />
                    <span>-</span>
                    <Input
                      type="text"
                      placeholder="입력"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value)}
                      className="flex-1"
                      maxLength={4}
                      data-testid="input-phone2"
                    />
                    <span>-</span>
                    <Input
                      type="text"
                      placeholder="입력"
                      value={phone3}
                      onChange={(e) => setPhone3(e.target.value)}
                      className="flex-1"
                      maxLength={4}
                      data-testid="input-phone3"
                    />
                  </div>
                </div>
              </div>

              {/* 휴대폰 본인 인증 버튼 */}
              <div className="text-center pt-4">
                <Button
                  onClick={handleVerify}
                  className="btn-pink"
                  data-testid="button-verify"
                >
                  휴대폰 본인 인증
                </Button>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
