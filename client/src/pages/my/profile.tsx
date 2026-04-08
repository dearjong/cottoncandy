import { useEffect } from "react";
import Layout from "@/components/layout/layout";
import MySidebar from "@/components/my/my-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { UserCircle, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { trackMyPageView, trackMyProfileSaved, generateReferralLink, trackReferralSent } from "@/lib/analytics";

export default function MyProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = () => {
    const link = generateReferralLink();
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackReferralSent({ method: "copy" });
      toast({ description: "추천 링크가 복사되었습니다." });
    });
  };

  useEffect(() => {
    trackMyPageView("profile");
  }, []);

  const handleSave = () => {
    trackMyProfileSaved();
    toast({ description: "저장되었습니다." });
  };

  return (
    <Layout>
      <div className="py-12 bg-white min-h-screen">
        <div className="page-content">
          <h1 className="page-title mb-12">내정보</h1>

          <div className="flex gap-8">
            <MySidebar />

            <div className="flex-1 max-w-2xl">
              {/* 1. 개인정보 */}
              <div className="mb-10">
                <div className="inline-flex items-center bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-8">
                  1. 개인정보
                </div>

                <div className="space-y-6">
                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title">프로필</span>
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <div className="text-center">
                        <UserCircle className="w-8 h-8 text-gray-400 mx-auto" />
                        <span className="text-xs text-gray-400 mt-1 block">Profile</span>
                      </div>
                    </div>
                  </div>

                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title"><span className="cotton-candy-pink">*</span> 이름</span>
                    <Input defaultValue="이꽃별" className="flex-1" />
                  </div>

                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title">닉네임</span>
                    <Input defaultValue="꽃별이" className="flex-1" />
                  </div>

                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title"><span className="cotton-candy-pink">*</span> 휴대폰</span>
                    <Input defaultValue="010-1234-5678" className="flex-1" />
                  </div>

                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title"><span className="cotton-candy-pink">*</span> 이메일</span>
                    <Input defaultValue="test@cottoncandy.kr" className="flex-1" />
                  </div>
                </div>
              </div>

              <hr className="my-8 border-gray-100" />

              {/* 2. 회사정보 */}
              <div className="mb-10">
                <div className="inline-flex items-center bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-8">
                  2. 회사정보
                </div>

                <div className="space-y-6">
                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title">회사명</span>
                    <Input placeholder='코리반시인 경우에는 " 코리반시 "를 입력하여주세요.' className="flex-1" />
                  </div>

                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title">직무</span>
                    <Input placeholder="ex) 기획자" className="flex-1" />
                  </div>

                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title">부서</span>
                    <Input placeholder="ex) 전략기획팀" className="flex-1" />
                  </div>

                  <div className="project-section project-section-horizontal">
                    <span className="project-section-title">직책</span>
                    <Input placeholder="ex) 전임연구원" className="flex-1" />
                  </div>
                </div>
              </div>

              {/* 내 추천 링크 */}
              <div className="mt-10 mb-2">
                <div className="inline-flex items-center bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                  추천 링크
                </div>
                <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-3">
                    아래 링크를 공유하면 지인이 가입할 때 추천인으로 기록됩니다.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 truncate font-mono select-all">
                      {generateReferralLink()}
                    </div>
                    <button
                      onClick={handleCopyReferral}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        copied
                          ? "bg-green-100 text-green-700"
                          : "bg-pink-600 text-white hover:bg-pink-700"
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "복사됨" : "복사"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  className="w-full py-3 bg-gray-200 text-gray-500 rounded-full text-sm font-normal hover:bg-gray-300 cursor-pointer"
                  onClick={handleSave}
                >
                  저장하기
                </Button>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setLocation("/my/withdraw")}
                  className="text-xs text-gray-300 hover:text-gray-400 font-light underline"
                >
                  회원탈퇴
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
