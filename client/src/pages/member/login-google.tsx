import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { identifyUser, trackLogin, trackSsoLogin, publishAnalytics } from "@/lib/analytics";
import googleLogo from "@assets/Logo_Google_1759383453744.png";

export default function LoginGoogle() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("test@cottoncandy.kr");
  const [password, setPassword] = useState("test1234!");
  const [step, setStep] = useState<"email" | "password">("email");

  // 퍼널 1단계: 구글 로그인 화면 진입
  useEffect(() => {
    publishAnalytics("google_form_viewed", { method: "google" });
  }, []);

  const handleEmailNext = () => {
    if (!email) return;
    // 퍼널 2단계: 이메일 입력 완료 → 비밀번호 단계 진입
    publishAnalytics("google_email_submitted", { email });
    setStep("password");
  };

  const handleLogin = () => {
    if (!password) return;
    const userId = `google-${email}`;
    identifyUser({ userId, userType: "advertiser", email });
    trackSsoLogin({ method: "google", source: "google_email", user_type: "advertiser" });
    trackLogin({ method: "google", user_type: "advertiser" });
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", email.split("@")[0]);
    localStorage.setItem("userType", "의뢰");
    localStorage.setItem("userMode", "request");
    setLocation("/work/home");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[400px] px-8 py-10 border border-gray-200 rounded-xl shadow-sm">
        <div className="flex justify-center mb-5">
          <img src={googleLogo} alt="Google" className="w-10 h-10" />
        </div>

        {step === "email" ? (
          <>
            <h2 className="text-2xl font-normal text-center text-gray-800 mb-1">로그인</h2>
            <p className="text-sm text-center text-gray-600 mb-6">Google 계정으로 이동</p>

            <input
              type="email"
              placeholder="이메일 또는 휴대전화"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailNext()}
              className="w-full border border-gray-400 rounded px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4"
              autoFocus
            />

            <p className="text-xs text-blue-600 mb-6 cursor-pointer hover:underline">
              이메일을 잊으셨나요?
            </p>

            <p className="text-xs text-gray-600 mb-6">
              내 컴퓨터가 아닌가요? 게스트 모드를 사용하여 비공개로 로그인하세요.{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">자세히 알아보기</span>
            </p>

            <div className="flex items-center justify-between">
              <button className="text-sm text-blue-600 hover:underline font-medium">
                계정 만들기
              </button>
              <button
                onClick={handleEmailNext}
                disabled={!email}
                className="px-6 py-2 rounded text-sm text-white font-medium disabled:opacity-50"
                style={{ backgroundColor: "#1a73e8" }}
              >
                다음
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-normal text-center text-gray-800 mb-1">환영합니다</h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-gray-600 border border-gray-300 rounded-full px-3 py-1">
                {email}
              </span>
            </div>

            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-gray-400 rounded px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-2"
              autoFocus
            />

            <p className="text-xs text-blue-600 mb-6 cursor-pointer hover:underline">
              비밀번호 찾기
            </p>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep("email")}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                뒤로
              </button>
              <button
                onClick={handleLogin}
                disabled={!password}
                className="px-6 py-2 rounded text-sm text-white font-medium disabled:opacity-50"
                style={{ backgroundColor: "#1a73e8" }}
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
