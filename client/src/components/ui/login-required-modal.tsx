import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface LoginRequiredModalProps {
  onClose: () => void;
}

export default function LoginRequiredModal({ onClose }: LoginRequiredModalProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[320px] px-8 py-8 flex flex-col items-center gap-4">
        <div className="text-3xl">🔒</div>
        <p className="popup-title text-center">로그인이 필요해요</p>
        <p className="popup-description text-center">
          이 기능은 로그인 후 이용할 수 있어요.<br />
          로그인하거나 회원가입을 해주세요.
        </p>
        <div className="popup-buttons w-full flex flex-col gap-2 mt-2">
          <Button
            className="btn-pink w-full"
            onClick={() => { onClose(); setLocation("/login"); }}
          >
            로그인
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => { onClose(); setLocation("/signup"); }}
          >
            회원가입
          </Button>
        </div>
      </div>
    </div>
  );
}
