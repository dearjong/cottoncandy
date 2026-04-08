import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout/layout";
import MySidebar from "@/components/my/my-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackMyPageView, trackMyInquirySubmitted } from "@/lib/analytics";

export default function MyInquiry() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"general" | "report">("general");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    trackMyPageView("inquiry");
  }, []);

  const handleSubmit = () => {
    trackMyInquirySubmitted({ tab: activeTab, has_attachment: !!fileName });
    toast({ description: "문의가 접수되었습니다." });
  };

  return (
    <Layout>
      <div className="py-12 bg-white min-h-screen">
        <div className="page-content">
          <h1 className="page-title mb-12">1:1 문의</h1>

          <div className="flex gap-8">
            <MySidebar />

            <div className="flex-1 max-w-2xl">
              {/* 탭 */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeTab === "general"
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  일반문의
                </button>
                <button
                  onClick={() => setActiveTab("report")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeTab === "report"
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  신고
                </button>
              </div>

              <div className="space-y-4">
                <div className="project-section project-section-horizontal">
                  <span className="project-section-title"><span className="cotton-candy-pink">*</span> 제목</span>
                  <Input placeholder="ex) 결제는 어떻게 하는건가요?" className="flex-1" />
                </div>

                <div>
                  <textarea
                    className="w-full border border-gray-200 rounded-md p-4 text-sm text-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                    rows={8}
                    placeholder={`ex) 안녕하세요.\n프로젝트 계약이 완료된 후 결제 절차와 정산 방식에 대해 문의드립니다.\n계약금, 중도금, 잔금이 어떤 방식으로 지급되는지와 정산 완료 처리는 어떤 절차로 진행되는지 알고 싶습니다.\n또한, 영수증이나 세금계산서 발급은 어떻게 받을 수 있는지도 함께 확인 부탁드립니다.\n답변 기다리겠습니다. 감사합니다.`}
                  />
                </div>

                <div className="project-section project-section-horizontal">
                  <span className="project-section-title flex items-center gap-1">
                    <Paperclip className="w-4 h-4" /> 첨부파일
                  </span>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="업로드해주세요"
                      className="flex-1"
                      readOnly
                      value={fileName}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                    />
                    <Button
                      variant="outline"
                      className="px-4 text-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1 py-3 rounded-full text-sm"
                    onClick={() => setLocation("/my/profile")}
                  >
                    취소
                  </Button>
                  <Button
                    className="flex-1 py-3 rounded-full text-sm bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={handleSubmit}
                  >
                    확인
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
