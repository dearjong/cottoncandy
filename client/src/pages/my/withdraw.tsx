import { useEffect, useState, useRef } from "react";
import Layout from "@/components/layout/layout";
import MySidebar from "@/components/my/my-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { trackMyPageView, trackMyWithdrawAttempted } from "@/lib/analytics";

const REASONS = [
  { id: "no-work", label: "이 일을 더이상 하지 않아요" },
  { id: "too-many-msgs", label: "에세지가 너무 자주와요" },
  { id: "privacy", label: "개인정보가 우려돼요" },
  { id: "no-service", label: "원하는 서비스가 없어요" },
  { id: "lack-guide", label: "안내가 부족해요" },
  { id: "other-app", label: "앱에도는 다른 서비스가 있어요" },
  { id: "errors", label: "오류가 자주 발생해요" },
  { id: "bad-cs", label: "고객 응대서비스가 아쉬워요" },
  { id: "slow", label: "빠르지 않은 서비스 처리가 아쉬워요" },
];

export default function MyWithdraw() {
  const [checkedReasons, setCheckedReasons] = useState<string[]>([]);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTV, setAgreeTV] = useState(false);
  const otherTextRef = useRef<HTMLTextAreaElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    trackMyPageView("withdraw");
  }, []);

  const toggleReason = (id: string) => {
    setCheckedReasons(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleWithdraw = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    trackMyWithdrawAttempted({
      reason_count: checkedReasons.length,
      has_other_text: !!(otherTextRef.current?.value?.trim()),
    });
    setShowConfirm(false);
    setShowDone(true);
  };

  return (
    <Layout>
      <div className="py-12 bg-white min-h-screen">
        <div className="page-content">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              정말 탈퇴하시겠습니까?<br />
              등록하신 프로젝트, 제안서, 정산 내역 등<br />
              모든 데이터가 삭제됩니다.
            </h1>
          </div>

          <div className="flex gap-8">
            <MySidebar />

            <div className="flex-1 max-w-2xl">
              <p className="text-sm font-medium text-gray-900 mb-4">
                이유를 남겨주시면, 서비스를 개선하는데 큰 도움이 됩니다
              </p>

              <div className="grid grid-cols-3 gap-x-6 gap-y-3 mb-6">
                {REASONS.map(reason => (
                  <div key={reason.id} className="flex items-center gap-2">
                    <Checkbox
                      id={reason.id}
                      checked={checkedReasons.includes(reason.id)}
                      onCheckedChange={() => toggleReason(reason.id)}
                    />
                    <Label htmlFor={reason.id} className="text-sm text-gray-700 cursor-pointer">{reason.label}</Label>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">기타</p>
                <textarea
                  ref={otherTextRef}
                  className="w-full border border-gray-200 rounded-md p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                  rows={3}
                  placeholder="기타 사유를 입력해주세요."
                />
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-2">비밀번호</p>
                <Input type="password" placeholder="비밀번호를 입력해주세요." />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 text-xs text-gray-500 space-y-2">
                <p>현재 사용 중인 계정 정보는 탈퇴 후 복구가 불가능합니다.</p>
                <p>진행 중인 프로젝트가 있거나, 분쟁이 진행 중일 경우 탈퇴 신청이 불가합니다.</p>
                <p>탈퇴 후 회원님의 개인정보는 전자상거래 등에서의 소비자보호에 관한 법률 및 ADMarket 개인정보처리방침에 따라 일정 기간 보관 후 안전하게 삭제됩니다.</p>
                <p>별점, 리뷰, 게시글 등 공개된 활동 이력은 자동으로 삭제되지 않습니다.<br />탈퇴 후 계정 정보와 사제되어 본인 확인이 불가능하므로,<br />탈퇴 신청 전 게시글 및 각종 사물을 요청해 주시기 바랍니다.</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                  <Checkbox id="agree-all" checked={agreeAll} onCheckedChange={(v) => setAgreeAll(!!v)} />
                  <Label htmlFor="agree-all" className="text-sm text-gray-700 cursor-pointer">주의사항을 모두 읽었으며, 이에 동의합니다.</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="agree-tv" checked={agreeTV} onCheckedChange={(v) => setAgreeTV(!!v)} />
                  <Label htmlFor="agree-tv" className="text-sm text-gray-700 cursor-pointer">ADMarket에서 탈퇴하면 TV 계정에서도 탈퇴됩니다.</Label>
                </div>
              </div>

              <Button
                className="w-full py-3 bg-gray-200 text-gray-500 rounded-full text-sm font-normal hover:bg-gray-300"
                disabled={!agreeAll || !agreeTV}
                onClick={handleWithdraw}
              >
                탈퇴확인
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 1단계: 탈퇴 진행 확인 */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm rounded-2xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-900 mb-8">탈퇴처리를 진행할까요?</p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-full text-sm"
              onClick={() => setShowConfirm(false)}
            >
              취소
            </Button>
            <Button
              className="flex-1 rounded-full text-sm bg-pink-500 hover:bg-pink-600 text-white"
              onClick={handleConfirm}
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2단계: 탈퇴 완료 */}
      <Dialog open={showDone} onOpenChange={setShowDone}>
        <DialogContent className="max-w-sm rounded-2xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-900 mb-8">탈퇴처리되었습니다.</p>
          <Button
            className="w-full rounded-full text-sm bg-pink-500 hover:bg-pink-600 text-white"
            onClick={() => setShowDone(false)}
          >
            확인
          </Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
