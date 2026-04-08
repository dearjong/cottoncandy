import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SimJob {
  status: "pending" | "generating" | "sending" | "done" | "error";
  progress: number;
  message: string;
  totalUsers: number;
  totalEvents: number;
  batchesSent: number;
  totalBatches: number;
  funnelBreakdown: Record<string, number>;
  abBreakdown: {
    control: { viewed: number; ctaClicked: number };
    variant_question: { viewed: number; ctaClicked: number };
  };
  errors: string[];
  startedAt: number;
  completedAt?: number;
}

const FUNNEL_ORDER = [
  { key: "site_visit",              label: "유입",             color: "bg-blue-400",    aarrr: "Acquisition" },
  { key: "experiment_viewed",       label: "A/B 실험 노출",    color: "bg-purple-400",  aarrr: "" },
  { key: "home_cta_clicked",        label: "CTA 클릭",         color: "bg-pink-400",    aarrr: "" },
  { key: "signup_complete",         label: "가입 완료",        color: "bg-orange-400",  aarrr: "Activation" },
  { key: "activation_achieved",     label: "핵심행동 달성",    color: "bg-yellow-400",  aarrr: "" },
  { key: "project_submitted",       label: "프로젝트 등록",    color: "bg-green-400",   aarrr: "" },
  { key: "partner_applied",         label: "공고 지원",        color: "bg-teal-400",    aarrr: "" },
  { key: "contract_signed",         label: "계약 체결",        color: "bg-emerald-500", aarrr: "Revenue" },
  { key: "review_submitted",        label: "리뷰 등록",        color: "bg-gray-400",    aarrr: "" },
  { key: "referral_sent",           label: "추천 공유",        color: "bg-indigo-400",  aarrr: "Referral" },
];

export default function AdminSimulatePage() {
  const [userCount, setUserCount] = useState("1000");
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<SimJob | null>(null);
  const [loading, setLoading] = useState(false);
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
  const ctrl = job?.abBreakdown.control ?? { viewed: 0, ctaClicked: 0 };
  const varq = job?.abBreakdown.variant_question ?? { viewed: 0, ctaClicked: 0 };
  const ctrlCtr = ctrl.viewed > 0 ? ((ctrl.ctaClicked / ctrl.viewed) * 100).toFixed(1) : "-";
  const varCtr  = varq.viewed > 0 ? ((varq.ctaClicked / varq.viewed) * 100).toFixed(1) : "-";

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
            <span>의뢰사 10% / 파트너사 90%</span>
            <span>·</span>
            <span>UTM: google/naver/kakao/referral/organic</span>
            <span>·</span>
            <span>A/B: control vs variant_question (50:50)</span>
          </div>
          <Button
            className="btn-pink ml-auto"
            onClick={startSim}
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

      {/* A/B + AARRR 나란히 */}
      {job && job.totalEvents > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* A/B 테스트 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
            <p className="font-medium text-gray-800">A/B 테스트 — home_hero_title</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "control",          label: "control",          desc: "2줄 타이틀 + 프로모", viewed: ctrl.viewed, clicked: ctrl.ctaClicked, ctr: ctrlCtr, highlight: false },
                { key: "variant_question", label: "variant_question", desc: "1줄 + 서브 텍스트",    viewed: varq.viewed, clicked: varq.ctaClicked, ctr: varCtr,  highlight: true  },
              ].map((v) => (
                <div key={v.key} className={`rounded-lg border p-4 space-y-3 ${v.highlight ? "border-pink-200 bg-pink-50/30" : "border-gray-200"}`}>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{v.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{v.desc}</div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">노출</span><span>{v.viewed.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">CTA 클릭</span><span>{v.clicked.toLocaleString()}</span></div>
                    <div className="flex justify-between border-t pt-1.5">
                      <span className="font-medium text-gray-700">CTR</span>
                      <span className={`font-bold text-lg ${v.highlight ? "text-pink-600" : "text-gray-700"}`}>{v.ctr}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {isDone && (
              <p className="text-xs text-gray-400">variant_question(~22%)이 control(~15%)보다 높은 CTR로 설계됨</p>
            )}
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
            <li>가상 사용자별로 AARRR 퍼널을 따라 이벤트 자동 생성</li>
            <li>Acquisition → Activation(가입+첫행동) → Retention(재방문) → Revenue(계약) → Referral(추천)</li>
            <li>A/B: control 50% / variant_question 50%, CTR이 각각 ~15% / ~22%로 다르게 설계</li>
            <li>Mixpanel HTTP API로 배치 전송 (50개씩) — 완료 후 대시보드에서 퍼널·코호트·A/B 분석 가능</li>
          </ul>
        </div>
      )}
    </div>
  );
}
