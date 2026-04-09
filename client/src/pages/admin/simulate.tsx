import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SimJob {
  status: "pending" | "generating" | "sending" | "done" | "error";
  progress: number;
  message: string;
  totalUsers: number;
  totalEvents: number;
  batchesSent: number;
  totalBatches: number;
  funnelBreakdown: Record<string, number>;
  utmBreakdown: Record<string, number>;
  errors: string[];
  startedAt: number;
  completedAt?: number;
}

const FUNNEL_ORDER = [
  { key: "site_visit",              label: "유입",             color: "bg-blue-400",    aarrr: "Acquisition" },
  { key: "signup_complete",         label: "가입 완료",        color: "bg-orange-400",  aarrr: "Activation" },
  { key: "activation_achieved",     label: "핵심행동 달성",    color: "bg-yellow-400",  aarrr: "" },
  { key: "portfolio_registered",    label: "포트폴리오 등록",  color: "bg-purple-400",  aarrr: "" },
  { key: "project_submitted",       label: "프로젝트 등록",    color: "bg-green-400",   aarrr: "" },
  { key: "partner_applied",         label: "공고 지원",        color: "bg-teal-400",    aarrr: "" },
  { key: "contract_signed",         label: "계약 체결",        color: "bg-emerald-500", aarrr: "Revenue" },
  { key: "draft_submitted",         label: "시안 등록",        color: "bg-sky-400",     aarrr: "" },
  { key: "draft_confirmed",         label: "시안 확정",        color: "bg-sky-500",     aarrr: "" },
  { key: "deliverable_submitted",   label: "산출물 등록",      color: "bg-violet-400",  aarrr: "" },
  { key: "deliverable_confirmed",   label: "산출물 확정",      color: "bg-violet-500",  aarrr: "" },
  { key: "project_completed",       label: "프로젝트 완료",    color: "bg-pink-500",    aarrr: "" },
  { key: "review_submitted",        label: "리뷰 등록",        color: "bg-gray-400",    aarrr: "" },
  { key: "referral_sent",           label: "추천 공유",        color: "bg-indigo-400",  aarrr: "Referral" },
];

export default function AdminSimulatePage() {
  const [userCount, setUserCount] = useState("1000");
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<SimJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }
  useEffect(() => () => stopPolling(), []);

  async function startSim() {
    setLoading(true);
    setJob(null);
    try {
      const res = await fetch("/api/admin/simulate/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userCount: parseInt(userCount) }),
      });
      const { jobId: id } = await res.json();
      setJobId(id);
      setLoading(false);
      pollRef.current = setInterval(async () => {
        try {
          const r = await fetch(`/api/admin/simulate/status/${id}`);
          const data: SimJob = await r.json();
          setJob(data);
          if (data.status === "done" || data.status === "error") stopPolling();
        } catch { /* ignore */ }
      }, 1500);
    } catch {
      setLoading(false);
    }
  }

  const isRunning = job && (job.status === "pending" || job.status === "generating" || job.status === "sending");
  const isDone = job?.status === "done";

  function elapsedSec(j: SimJob) {
    return (((j.completedAt ?? Date.now()) - j.startedAt) / 1000).toFixed(1);
  }

  const siteVisit = job?.funnelBreakdown["site_visit"] ?? 0;
  const utmBreakdown = job?.utmBreakdown ?? {} as Record<string, number>;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Analytics 시뮬레이션"
        description="가상 사용자를 생성해 Mixpanel에 AARRR 이벤트를 전송합니다."
        hidePeriodFilter
      />

      {/* 설정 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">가상 사용자 수</span>
            <Select value={userCount} onValueChange={setUserCount} disabled={!!isRunning}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100명</SelectItem>
                <SelectItem value="500">500명</SelectItem>
                <SelectItem value="1000">1,000명</SelectItem>
                <SelectItem value="2000">2,000명</SelectItem>
                <SelectItem value="5000">5,000명</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 border rounded px-3 py-1.5">
            <span>광고주 50% / 대행사 30% / 제작사 20%</span>
            <span>·</span>
            <span>UTM: google/naver/kakao/referral/organic</span>
            <span>·</span>
            <span>남 60% / 여 40% · 30~40대 중심</span>
          </div>
          <Button
            className="btn-pink ml-auto"
            onClick={() => setConfirmOpen(true)}
            disabled={!!isRunning || loading}
          >
            {loading ? "시작 중..." : isRunning ? "실행 중..." : "▶ 시뮬레이션 시작"}
          </Button>
        </div>
      </div>

      {/* 진행 상황 */}
      {job && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">진행 상황</span>
            <div className="flex items-center gap-2">
              {isRunning && <Badge className="bg-blue-100 text-blue-700 animate-pulse border-0">실행 중</Badge>}
              {isDone   && <Badge className="bg-green-100 text-green-700 border-0">완료</Badge>}
              {job.status === "error" && <Badge variant="destructive">오류</Badge>}
              <span className="text-xs text-gray-400">{elapsedSec(job)}초 경과</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{job.message}</span>
              <span className="font-medium text-gray-700">{job.progress}%</span>
            </div>
            <Progress value={job.progress} className="h-1.5" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "가상 사용자", value: job.totalUsers.toLocaleString() + "명" },
              { label: "생성 이벤트", value: job.totalEvents.toLocaleString() + "개" },
              { label: "전송 배치", value: `${job.batchesSent} / ${job.totalBatches}` },
              { label: "오류", value: job.errors.length + "건" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-gray-800">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {job.errors.length > 0 && (
            <div className="bg-red-50 rounded-lg p-3 text-xs text-red-700 space-y-1 max-h-28 overflow-y-auto">
              {job.errors.map((e, i) => <div key={i}>⚠ {e}</div>)}
            </div>
          )}
        </div>
      )}

      {/* UTM + AARRR 나란히 */}
      {job && job.totalEvents > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* UTM 유입 현황 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
            <p className="font-medium text-gray-800">UTM 유입 채널</p>
            <div className="space-y-2">
              {[
                { key: "google",   label: "Google",   color: "bg-blue-400",   pct: 35 },
                { key: "naver",    label: "Naver",    color: "bg-green-500",  pct: 30 },
                { key: "kakao",    label: "Kakao",    color: "bg-yellow-400", pct: 15 },
                { key: "referral", label: "Referral", color: "bg-purple-400", pct: 10 },
                { key: "organic",  label: "Organic",  color: "bg-gray-400",   pct: 10 },
              ].map(({ key, label, color, pct }) => {
                const count = utmBreakdown[key] ?? Math.round((job.totalUsers * pct) / 100);
                const total = job.totalUsers;
                const actualPct = total > 0 ? Math.round((count / total) * 100) : pct;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-gray-600 shrink-0">{label}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className={`${color} h-3 rounded-full`} style={{ width: `${actualPct}%` }} />
                    </div>
                    <div className="w-10 text-right text-xs font-medium text-gray-700">{count.toLocaleString()}</div>
                    <div className="w-8 text-right text-xs text-gray-400">{actualPct}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AARRR 퍼널 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
            <p className="font-medium text-gray-800">AARRR 퍼널</p>
            <div className="space-y-2">
              {FUNNEL_ORDER.map(({ key, label, color, aarrr }) => {
                const count = job.funnelBreakdown[key] ?? 0;
                const pct = siteVisit > 0 ? Math.round((count / siteVisit) * 100) : 0;
                return (
                  <div key={key} className="flex items-center gap-2">
                    {aarrr
                      ? <span className="w-20 shrink-0 text-[10px] font-semibold text-gray-400 uppercase">{aarrr}</span>
                      : <span className="w-20 shrink-0" />}
                    <div className="w-24 text-xs text-gray-600 truncate shrink-0">{label}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className={`${color} h-3 rounded-full transition-all duration-500`} style={{ width: `${Math.max(pct, count > 0 ? 1 : 0)}%` }} />
                    </div>
                    <div className="w-12 text-right text-xs font-medium text-gray-700">{count.toLocaleString()}</div>
                    <div className="w-8 text-right text-xs text-gray-400">{pct}%</div>
                  </div>
                );
              })}
            </div>
            {isDone && (
              <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700">
                ✅ Mixpanel 전송 완료 — Funnels / Insights / A/B Tests 에서 확인하세요.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 안내 (최초 상태) */}
      {!job && (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 space-y-2">
          <p className="font-medium text-gray-700">시뮬레이션 동작 방식</p>
          <ul className="space-y-1 list-disc list-inside text-xs text-gray-400">
            <li>광고주 50% / 대행사 30% / 제작사 20% · 남 60% / 여 40% · 30~40대 중심</li>
            <li>UTM: google 35% / naver 30% / kakao 15% / referral 10% / organic 10%</li>
            <li>유입 → 가입 → 핵심행동 → 포트폴리오/프로젝트 → 계약 → 시안 → 산출물 → 완료 → 리뷰</li>
            <li>GA4 + Mixpanel 동시 전송 — 완료 후 Mixpanel Funnels / GA4 탐색 분석에서 확인</li>
          </ul>
        </div>
      )}

      {/* 시작 확인 팝업 */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>시뮬레이션을 시작할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              가상 사용자 <strong>{parseInt(userCount).toLocaleString()}명</strong>의 이벤트를 생성하여
              Mixpanel에 전송합니다. 실제 데이터에 시뮬레이션 이벤트가 추가됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => { setConfirmOpen(false); startSim(); }}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
