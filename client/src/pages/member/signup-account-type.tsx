import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { User, Building2, Lock, Users, ArrowRight, CheckCircle2 } from "lucide-react";

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
        <div className="page-content max-w-2xl mx-auto">

          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="page-title">어떻게 활동하실 건가요?</h1>
            <p className="page-subtitle mt-3">
              활동 방식에 따라 정보 공개 범위가 달라져요. 나중에 변경할 수도 있어요.
            </p>
          </motion.div>

          {/* 개념 설명 배너 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 text-sm text-gray-600 space-y-2"
          >
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" />
              <span><strong className="text-gray-800">개인 기록은 항상 나만 볼 수 있어요.</strong> 개인으로 활동한 이력·리뷰·계약은 어떤 상황에서도 본인 계정에만 남아요.</span>
            </div>
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <span><strong className="text-gray-800">기업 활동은 소속 기업 admin과 공유돼요.</strong> 기업 소속으로 진행한 프로젝트·계약은 기업 관리자도 볼 수 있어요. 기업을 나가면 해당 기록은 기업에 귀속됩니다.</span>
            </div>
          </motion.div>

          {/* 선택 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            {/* 개인으로 시작 */}
            <button
              onClick={() => setSelected("personal")}
              className={`relative rounded-xl border-2 p-6 text-left transition-all ${
                selected === "personal"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              data-testid="card-personal"
            >
              {selected === "personal" && (
                <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-pink-500" />
              )}
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-pink-500" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">개인으로 시작하기</div>
              <div className="text-xs text-gray-500 leading-relaxed">
                프리랜서이거나 혼자 활동할 경우.<br />
                모든 활동 기록은 나만 볼 수 있어요.
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  활동 이력 본인 보관
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  나중에 기업 소속 추가 가능
                </div>
              </div>
            </button>

            {/* 기업 소속으로 시작 */}
            <button
              onClick={() => setSelected("company")}
              className={`relative rounded-xl border-2 p-6 text-left transition-all ${
                selected === "company"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              data-testid="card-company"
            >
              {selected === "company" && (
                <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-blue-500" />
              )}
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-blue-500" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">기업 소속으로 시작하기</div>
              <div className="text-xs text-gray-500 leading-relaxed">
                대행사·제작사 소속이거나 팀으로 활동할 경우.<br />
                기업 admin과 활동 내역이 공유돼요.
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  팀원과 프로젝트 공유
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  개인 기록은 별도 보관됨
                </div>
              </div>
            </button>
          </motion.div>

          {/* 기업 선택 시 안내 */}
          {selected === "company" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-700 flex items-start gap-2"
            >
              <Building2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span>다음 단계에서 소속 기업을 검색하거나 신규 등록할 수 있어요. 기업 admin의 승인 후 기업 계정이 활성화됩니다.</span>
            </motion.div>
          )}

          {/* 확인 버튼 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              onClick={handleStart}
              disabled={!selected}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-medium transition-all ${
                selected
                  ? "bg-pink-500 hover:bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              data-testid="button-start"
            >
              {selected === "company" ? "기업 정보 등록하러 가기" : "시작하기"}
              {selected && <ArrowRight className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setLocation("/")}
              className="text-sm text-gray-400 hover:text-gray-600 underline"
              data-testid="button-skip"
            >
              나중에 결정할게요
            </button>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}
