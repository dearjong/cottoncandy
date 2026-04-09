import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { User, Building2, Lock, Users, CheckCircle2 } from "lucide-react";

export default function SignupAccountType() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<"personal" | "company" | null>(null);

  const handleStart = () => {
    if (selected === "personal") {
      setLocation("/");
    } else if (selected === "company") {
      setLocation("/signup/job-info");
    }
  };

  return (
    <Layout>
      <div className="py-10 sm:py-14 bg-white min-h-screen">
        <div className="page-content">

          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h1 className="page-title">어떻게 활동하실 건가요?</h1>
            <p className="page-subtitle mt-3">
              활동 방식에 따라 정보 공개 범위가 달라져요. 나중에 변경할 수도 있어요.
            </p>
          </motion.div>

          <div className="options-container">
            {/* 개념 설명 배너 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#EA4C89] mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong className="text-gray-800">개인 기록은 항상 나만 볼 수 있어요.</strong>{" "}
                  개인으로 활동한 이력·리뷰·계약은 어떤 상황에서도 본인 계정에만 남아요.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong className="text-gray-800">기업 활동은 소속 기업 admin과 공유돼요.</strong>{" "}
                  기업 소속으로 진행한 프로젝트·계약은 기업 관리자도 볼 수 있어요. 기업을 나가면 해당 기록은 기업에 귀속됩니다.
                </p>
              </div>
            </motion.div>

            {/* 선택 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="card-grid-2cols mb-8"
            >
              {/* 개인으로 시작 */}
              <div
                onClick={() => setSelected("personal")}
                className={`unified-card ${selected === "personal" ? "unified-card-selected" : "bg-white"}`}
                data-testid="card-personal"
              >
                <div className="unified-card-icon">
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${selected === "personal" ? "bg-white/20" : "bg-pink-100"}`}>
                    <User className={`w-8 h-8 ${selected === "personal" ? "text-white" : "text-[#EA4C89]"}`} />
                  </div>
                </div>
                <div className="unified-card-title">개인으로 시작하기</div>
                <div className="unified-card-description">
                  프리랜서이거나 혼자 활동할 경우.<br />
                  모든 활동 기록은 나만 볼 수 있어요.
                </div>
                <div className="unified-card-check">
                  <CheckCircle2 className={`w-5 h-5 ${selected === "personal" ? "text-white" : "text-gray-200"}`} />
                </div>
              </div>

              {/* 기업 소속으로 시작 */}
              <div
                onClick={() => setSelected("company")}
                className={`unified-card ${selected === "company" ? "unified-card-selected" : "bg-white"}`}
                data-testid="card-company"
              >
                <div className="unified-card-icon">
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${selected === "company" ? "bg-white/20" : "bg-blue-100"}`}>
                    <Building2 className={`w-8 h-8 ${selected === "company" ? "text-white" : "text-blue-500"}`} />
                  </div>
                </div>
                <div className="unified-card-title">기업 소속으로 시작하기</div>
                <div className="unified-card-description">
                  대행사·제작사 소속이거나 팀으로 활동할 경우.<br />
                  기업 admin과 활동 내역이 공유돼요.
                </div>
                <div className="unified-card-check">
                  <CheckCircle2 className={`w-5 h-5 ${selected === "company" ? "text-white" : "text-gray-200"}`} />
                </div>
              </div>
            </motion.div>

            {/* 기업 선택 시 추가 안내 */}
            {selected === "company" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-700"
              >
                <Building2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>다음 단계에서 소속 기업을 검색하거나 신규 등록할 수 있어요. 기업 admin의 승인 후 기업 계정이 활성화됩니다.</span>
              </motion.div>
            )}

            {/* CTA 버튼 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="btn-group flex-col"
            >
              <button
                onClick={handleStart}
                disabled={!selected}
                className="btn-pink"
                data-testid="button-start"
              >
                {selected === "company" ? "기업 정보 등록하러 가기" : "시작하기"}
              </button>
              <button
                onClick={() => setLocation("/")}
                className="btn-white"
                data-testid="button-skip"
              >
                나중에 결정할게요
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
