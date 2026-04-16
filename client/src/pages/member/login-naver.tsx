import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { identifyUser, trackLogin, trackSsoLogin, publishAnalytics } from "@/lib/analytics";

export default function LoginNaver() {
  const [, setLocation] = useLocation();
  const [id, setId] = useState("tvcfad");
  const [password, setPassword] = useState("test1234!");
  const [tab, setTab] = useState<"id" | "otp" | "qr">("id");
  const [keepLogin, setKeepLogin] = useState(false);
  const [ipProtect, setIpProtect] = useState(true);

  // 퍼널 1단계: 네이버 로그인 화면 진입
  useEffect(() => {
    publishAnalytics("naver_form_viewed", { method: "naver" });
  }, []);

  const handleTabSwitch = (newTab: "id" | "otp" | "qr") => {
    setTab(newTab);
    // 퍼널 2단계(선택): 로그인 방식 전환 추적
    publishAnalytics("naver_tab_switched", { from: tab, to: newTab });
  };

  const handleLogin = () => {
    if (!id || !password) return;
    const userId = `naver-${id}`;
    identifyUser({ userId, userType: "advertiser", email: id });
    trackSsoLogin({ method: "naver", source: "naver_id", user_type: "advertiser" });
    trackLogin({ method: "naver", user_type: "advertiser" });
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", id);
    localStorage.setItem("userType", "의뢰");
    localStorage.setItem("userMode", "request");
    setLocation("/work/home");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[400px] px-6 py-10">
        <h1
          className="text-center font-extrabold text-4xl mb-2"
          style={{ color: "#03c75a", fontFamily: "Arial, sans-serif", letterSpacing: 2 }}
        >
          NAVER
        </h1>
        <p className="text-center text-sm mb-1" style={{ color: "#03c75a" }}>
          NO1AD PORTAL - TVCF 이용을 위해 네이버로 로그인해 주세요.
        </p>
        <p className="text-center text-xs text-gray-600 mb-5">
          ⚠️ <strong>여러 사람이 쓰는 PC</strong>라면
          <br />
          ⊙ '로그인 상태 유지' 체크하지 않기 ⊙ 사용 후 로그아웃하기
        </p>

        <div className="border border-gray-300 rounded-sm overflow-hidden">
          <div className="flex border-b border-gray-300">
            {[
              { key: "id", label: "ID/전화번호" },
              { key: "otp", label: "일회용 번호" },
              { key: "qr", label: "QR코드" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => handleTabSwitch(t.key as "id" | "otp" | "qr")}
                className={`flex-1 py-3 text-sm font-medium border-r last:border-r-0 border-gray-300 transition-colors ${
                  tab === t.key
                    ? "bg-white text-gray-900 font-bold"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-2">
            <input
              type="text"
              placeholder="아이디 또는 전화번호"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-500"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-500"
            />
          </div>

          <div className="px-4 pb-3 flex items-center justify-between text-xs text-gray-600">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepLogin}
                onChange={(e) => setKeepLogin(e.target.checked)}
                className="accent-green-500"
              />
              로그인 상태 유지
            </label>
            <div className="flex items-center gap-1">
              <span>IP보안</span>
              <button
                onClick={() => setIpProtect(!ipProtect)}
                className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors ${
                  ipProtect ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    ipProtect ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={ipProtect ? "text-green-600 font-bold" : "text-gray-400"}>
                {ipProtect ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={handleLogin}
              disabled={!id || !password}
              className="w-full py-3 rounded text-white text-sm font-bold transition-colors disabled:opacity-50"
              style={{ backgroundColor: id && password ? "#03c75a" : "#9e9e9e" }}
            >
              로그인
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
          <button className="hover:underline">비밀번호 찾기</button>
          <span className="text-gray-300">|</span>
          <button className="hover:underline">아이디 찾기</button>
          <span className="text-gray-300">|</span>
          <button className="hover:underline">회원가입</button>
        </div>
      </div>
    </div>
  );
}
