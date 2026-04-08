import Layout from "@/components/layout/layout";
import MySidebar from "@/components/my/my-sidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type NotifRow = {
  id: string;
  label: string;
  app: boolean;
  email: boolean;
  sms: boolean;
};

const DEFAULT_SETTINGS: NotifRow[] = [
  { id: "project-apply", label: "프로젝트 지원·제안", app: true, email: true, sms: false },
  { id: "project-contract", label: "계약·정산 알림", app: true, email: true, sms: true },
  { id: "project-status", label: "프로젝트 진행 상태 변경", app: true, email: false, sms: false },
  { id: "message", label: "메시지·쪽지 수신", app: true, email: false, sms: false },
  { id: "review", label: "리뷰·평가 알림", app: true, email: false, sms: false },
  { id: "consulting", label: "컨설팅 문의 답변", app: true, email: true, sms: false },
  { id: "marketing", label: "마케팅·혜택 정보", app: false, email: false, sms: false },
  { id: "notice", label: "공지사항·시스템 점검", app: true, email: false, sms: false },
];

export default function MyNotificationSettings() {
  const { toast } = useToast();
  const [rows, setRows] = useState<NotifRow[]>(DEFAULT_SETTINGS);

  const toggle = (id: string, channel: "app" | "email" | "sms") => {
    setRows(prev =>
      prev.map(r => (r.id === id ? { ...r, [channel]: !r[channel] } : r))
    );
  };

  return (
    <Layout>
      <div className="py-12 bg-white min-h-screen">
        <div className="page-content">
          <h1 className="page-title mb-12">알림설정</h1>

          <div className="flex gap-8">
            <MySidebar />

            <div className="flex-1 max-w-2xl">
              {/* 헤더 행 */}
              <div className="flex items-center border-b border-gray-200 pb-3 mb-1">
                <span className="flex-1 text-sm font-medium text-gray-700">알림 종류</span>
                <div className="flex gap-8 text-xs text-gray-400 font-medium">
                  <span className="w-10 text-center">앱</span>
                  <span className="w-10 text-center">이메일</span>
                  <span className="w-10 text-center">SMS</span>
                </div>
              </div>

              {/* 알림 항목 */}
              <div className="divide-y divide-gray-100">
                {rows.map(row => (
                  <div key={row.id} className="flex items-center py-4">
                    <span className="flex-1 text-sm text-gray-700">{row.label}</span>
                    <div className="flex gap-8">
                      <div className="w-10 flex justify-center">
                        <Switch checked={row.app} onCheckedChange={() => toggle(row.id, "app")} />
                      </div>
                      <div className="w-10 flex justify-center">
                        <Switch checked={row.email} onCheckedChange={() => toggle(row.id, "email")} />
                      </div>
                      <div className="w-10 flex justify-center">
                        <Switch checked={row.sms} onCheckedChange={() => toggle(row.id, "sms")} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  variant="outline"
                  className="flex-1 py-3 rounded-full text-sm"
                  onClick={() => setRows(DEFAULT_SETTINGS)}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 py-3 rounded-full text-sm bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={() => toast({ description: "저장되었습니다." })}
                >
                  저장하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
