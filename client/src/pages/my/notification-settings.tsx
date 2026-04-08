import Layout from "@/components/layout/layout";
import MySidebar from "@/components/my/my-sidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function MyNotificationSettings() {
  const [, setLocation] = useLocation();
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(true);
  const [toggle3, setToggle3] = useState(true);

  return (
    <Layout>
      <div className="py-12 bg-white min-h-screen">
        <div className="page-content">
          <h1 className="page-title mb-12">알림설정</h1>

          <div className="flex gap-8">
            <MySidebar />

            <div className="flex-1 max-w-2xl">
              <div className="space-y-4">
                <div className="project-section project-section-horizontal items-center">
                  <span className="project-section-title"><span className="cotton-candy-pink">*</span> 제목</span>
                  <div className="flex-1 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Value</span>
                      <Switch checked={toggle1} onCheckedChange={setToggle1} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Value</span>
                      <Switch checked={toggle2} onCheckedChange={setToggle2} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Value</span>
                      <Switch checked={toggle3} onCheckedChange={setToggle3} />
                    </div>
                  </div>
                </div>

                <div>
                  <textarea
                    className="w-full border border-gray-200 rounded-md p-4 text-sm text-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                    rows={8}
                    placeholder={`ex) 안녕하세요.\n프로젝트 계약이 완료된 후 결제 절차와 정산 방식에 대해 문의드립니다.\n계약금, 중도금, 잔금이 어떤 방식으로 지급되는지와 정산 완료 처리는 어떤 절차로 진행되는지 알고 싶습니다.\n또한, 영수증이나 세금계산서 발급은 어떻게 받을 수 있는지도 함께 확인 부탁드립니다.\n답변 기다리겠습니다. 감사합니다.`}
                    readOnly
                  />
                </div>

                <div className="project-section project-section-horizontal">
                  <span className="project-section-title flex items-center gap-1">
                    <Paperclip className="w-4 h-4" /> 첨부파일
                  </span>
                  <div className="flex-1 flex gap-2">
                    <Input placeholder="업로드해주세요" className="flex-1" readOnly />
                    <Button variant="outline" className="px-4 text-sm">Upload</Button>
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
                  <Button className="flex-1 py-3 rounded-full text-sm bg-pink-500 hover:bg-pink-600 text-white">
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
