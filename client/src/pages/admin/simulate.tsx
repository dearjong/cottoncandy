import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
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
  userTypeBreakdown: Record<string, number>;
  errors: string[];
  startedAt: number;
  completedAt?: number;
}

interface SimConfig {
  userCount: number;
  pctAdvertiser: number; pctAgency: number; pctProduction: number;
  pctTvcf: number; pctGoogle: number; pctNaver: number; pctKakao: number; pctOrganic: number;
  tvcfSsoRate: number; tvcfManualLoginRate: number; signupRate: number;
}

const DEFAULTS: SimConfig = {
  userCount: 1000,
  pctAdvertiser: 5, pctAgency: 30, pctProduction: 65,
  pctTvcf: 85, pctGoogle: 5, pctNaver: 5, pctKakao: 3, pctOrganic: 2,
  tvcfSsoRate: 50, tvcfManualLoginRate: 60, signupRate: 5,
};

const FUNNEL_ORDER = [
  { key: "site_visit",            label: "유입",            color: "bg-blue-400",    aarrr: "Acquisition" },
  { key: "sso_login",             label: "SSO 로그인",      color: "bg-pink-400",    aarrr: "" },
  { key: "login",                 label: "수동 로그인",     color: "bg-rose-400",    aarrr: "" },
  { key: "signup_complete",       label: "가입 완료",       color: "bg-orange-400",  aarrr: "Activation" },
  { key: "activation_achieved",   label: "핵심행동 달성",   color: "bg-yellow-400",  aarrr: "" },
  { key: "portfolio_registered",  label: "포트폴리오 등록", color: "bg-purple-400",  aarrr: "" },
  { key: "project_submitted",     label: "프로젝트 등록",   color: "bg-green-400",   aarrr: "" },
  { key: "partner_applied",       label: "공고 지원",       color: "bg-teal-400",    aarrr: "" },
  { key: "contract_signed",       label: "계약 체결",       color: "bg-emerald-500", aarrr: "Revenue" },
  { key: "draft_submitted",       label: "시안 등록",       color: "bg-sky-400",     aarrr: "" },
  { key: "draft_confirmed",       label: "시안 확정",       color: "bg-sky-500",     aarrr: "" },
  { key: "deliverable_submitted", label: "산출물 등록",     color: "bg-violet-400",  aarrr: "" },
  { key: "deliverable_confirmed", label: "산출물 확정",     color: "bg-violet-500",  aarrr: "" },
  { key: "project_completed",     label: "프로젝트 완료",   color: "bg-pink-500",    aarrr: "" },
  { key: "review_submitted",      label: "리뷰 등록",       color: "bg-gray-400",    aarrr: "" },
  { key: "referral_sent",         label: "추천 공유",       color: "bg-indigo-400",  aarrr: "Referral" },
];

function NumInput({ label, value, onChange, min = 0, max = 100, unit = "%" }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; unit?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-gray-400 leading-tight">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number" min={min} max={max} value={value}
          onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))}
          className="w-16 border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 text-right focus:outline-none focus:ring-1 focus:ring-pink-300"
        />
        <span className="text-xs text-gray-400">{unit}</span>
      </div>
    </div>
  );
}

function sumWarn(vals: number[], label: string) {
  const s = vals.reduce((a, b) => a + b, 0);
  if (s !== 100) return <span className="text-[10px] text-amber-500">합계 {s}% (100% 권장) — {label}</span>;
  return null;
}

export default function AdminSimulatePage() {
  const [cfg, setCfg] = useState<SimConfig>(DEFAULTS);
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<SimJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function set<K extends keyof SimConfig>(key: K, val: SimConfig[K]) {
    setCfg((prev) => ({ ...prev, [key]: val }));
  }

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
        body: JSON.stringify(cfg),
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
  const userTypeBreakdown = job?.userTypeBreakdown ?? {} as Record<string, number>;

  const utmSum = cfg.pctTvcf + cfg.pctGoogle + cfg.pctNaver + cfg.pctKakao + cfg.pctOrganic;
  const userSum = cfg.pctAdvertiser + cfg.pctAgency + cfg.pctProduction;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Analytics 시뮬레이션"
        description="가상 사용자를 생성해 GA4 + Mixpanel에 AARRR 이벤트를 전송합니다."
        hidePeriodFilter
      />

      {/* 설정 패널 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">

        {/* 유저 수 */}
        <div className="flex items-center gap-4 flex-wrap">
          <NumInput label="가상 사용자 수" value={cfg.userCount} unit="명"
            min={10} max={10000} onChange={(v) => set("userCount", v)} />
          <Button className="btn-pink ml-auto" onClick={() => setConfirmOpen(true)}
            disabled={!!isRunning || loading}>
            {loading ? "시작 중..." : isRunning ? "실행 중..." : "▶ 시뮬레이션 시작"}
          </Button>
        </div>

        <hr className="border-gray-100" />

        {/* 유저 타입 비율 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">로그인 유저 내 구성</span>
            <span className="text-[10px] text-gray-400">미로그인 유저는 인증 전환율에 따라 자동 계산</span>
            {sumWarn([cfg.pctAdvertiser, cfg.pctAgency, cfg.pctProduction], "유저 타입")}
          </div>
          <div className="flex flex-wrap gap-4">
            <NumInput label="광고주" value={cfg.pctAdvertiser} onChange={(v) => set("pctAdvertiser", v)} />
            <NumInput label="대행사" value={cfg.pctAgency}     onChange={(v) => set("pctAgency", v)} />
            <NumInput label="제작사" value={cfg.pctProduction} onChange={(v) => set("pctProduction", v)} />
            <div className="flex items-end pb-1">
              <span className={`text-xs font-semibold ${userSum === 100 ? "text-green-600" : "text-amber-500"}`}>
                합계 {userSum}%
              </span>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* UTM 비율 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">UTM 유입 비율</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <NumInput label="tvcf.co.kr" value={cfg.pctTvcf}    onChange={(v) => set("pctTvcf", v)} />
            <NumInput label="Google"     value={cfg.pctGoogle}   onChange={(v) => set("pctGoogle", v)} />
            <NumInput label="Naver"      value={cfg.pctNaver}    onChange={(v) => set("pctNaver", v)} />
            <NumInput label="Kakao"      value={cfg.pctKakao}    onChange={(v) => set("pctKakao", v)} />
            <NumInput label="Organic"    value={cfg.pctOrganic}  onChange={(v) => set("pctOrganic", v)} />
            <div className="flex items-end pb-1">
              <span className={`text-xs font-semibold ${utmSum === 100 ? "text-green-600" : "text-amber-500"}`}>
                합계 {utmSum}%
              </span>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* 인증 전환율 */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-600">인증 전환율</span>
          <div className="flex flex-wrap gap-4">
            <NumInput label="tvcf SSO 자동 로그인율"   value={cfg.tvcfSsoRate}         onChange={(v) => set("tvcfSsoRate", v)} />
            <NumInput label="비SSO 수동 로그인율"       value={cfg.tvcfManualLoginRate} onChange={(v) => set("tvcfManualLoginRate", v)} />
            <NumInput label="신규 가입 전환율"           value={cfg.signupRate}          onChange={(v) => set("signupRate", v)} />
            <div className="flex items-end pb-1 text-[10px] text-gray-400 max-w-xs leading-tight">
              SSO → tvcf 유입 중 자동 로그인 비율<br />
              수동 → 비SSO tvcf 유저 중 직접 로그인 비율
            </div>
          </div>
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
              { label: "전송 배치",   value: `${job.batchesSent} / ${job.totalBatches}` },
              { label: "오류",        value: job.errors.length + "건" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-gray-800">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {job.errors.length > 0 && (
            <div className="bg-red-50 rounded-lg p-3 text-xs text-red-700 space-y-1 max-h-28 overflow-y-auto">
              {job.errors.slice(0, 10).map((e, i) => <div key={i}>⚠ {e}</div>)}
              {job.errors.length > 10 && <div className="text-red-400">외 {job.errors.length - 10}건...</div>}
            </div>
          )}
        </div>
      )}

      {/* UTM + AARRR */}
      {job && job.totalEvents > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 유입 채널 + 유저 타입 */}
          <div className="space-y-4">
            {/* UTM */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
              <p className="font-medium text-gray-800">UTM 유입 채널</p>
              <div className="space-y-2">
                {[
                  { key: "tvcf",    label: "tvcf.co.kr", color: "bg-pink-500",   pct: cfg.pctTvcf    },
                  { key: "google",  label: "Google",     color: "bg-blue-400",   pct: cfg.pctGoogle  },
                  { key: "naver",   label: "Naver",      color: "bg-green-500",  pct: cfg.pctNaver   },
                  { key: "kakao",   label: "Kakao",      color: "bg-yellow-400", pct: cfg.pctKakao   },
                  { key: "organic", label: "Organic",    color: "bg-gray-400",   pct: cfg.pctOrganic },
                ].map(({ key, label, color, pct }) => {
                  const count = utmBreakdown[key] ?? Math.round((job.totalUsers * pct) / 100);
                  const actualPct = job.totalUsers > 0 ? Math.round((count / job.totalUsers) * 100) : pct;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-20 text-xs text-gray-600 shrink-0">{label}</div>
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

            {/* 유저 타입 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div>
                <p className="font-medium text-gray-800">인증 현황</p>
                <p className="text-[10px] text-gray-400">미로그인 = 전체 - 로그인 유저 합계</p>
              </div>
              <div className="space-y-2">
                {(() => {
                  const authSum = Object.values(userTypeBreakdown).reduce((a, b) => a + b, 0);
                  const miloginCount = job.totalUsers - authSum;
                  const rows = [
                    { key: "advertiser", label: "광고주", color: "bg-blue-500",   count: userTypeBreakdown["advertiser"] ?? 0 },
                    { key: "agency",     label: "대행사", color: "bg-green-500",  count: userTypeBreakdown["agency"] ?? 0 },
                    { key: "production", label: "제작사", color: "bg-purple-500", count: userTypeBreakdown["production"] ?? 0 },
                    { key: "milogin",    label: "미로그인", color: "bg-gray-300", count: miloginCount },
                  ];
                  return rows.map(({ key, label, color, count }) => {
                    const pct = job.totalUsers > 0 ? Math.round((count / job.totalUsers) * 100) : 0;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div className="w-14 text-xs text-gray-600 shrink-0">{label}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div className={`${color} h-3 rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <div className="w-10 text-right text-xs font-medium text-gray-700">{count.toLocaleString()}</div>
                        <div className="w-8 text-right text-xs text-gray-400">{pct}%</div>
                      </div>
                    );
                  });
                })()}
              </div>
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
                      <div className={`${color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(pct, count > 0 ? 1 : 0)}%` }} />
                    </div>
                    <div className="w-12 text-right text-xs font-medium text-gray-700">{count.toLocaleString()}</div>
                    <div className="w-8 text-right text-xs text-gray-400">{pct}%</div>
                  </div>
                );
              })}
            </div>
            {isDone && (
              <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700">
                ✅ GA4 + Mixpanel 전송 완료 — GA4 실시간 개요 / Mixpanel Funnels에서 확인하세요.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 시작 확인 팝업 */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>시뮬레이션을 시작할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              가상 사용자 <strong>{cfg.userCount.toLocaleString()}명</strong>의 이벤트를 생성하여
              GA4 + Mixpanel에 전송합니다. 실제 데이터에 시뮬레이션 이벤트가 추가됩니다.
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
