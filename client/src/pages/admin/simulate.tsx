import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
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
  geoBreakdown: Record<string, number>;
  stepFunnelBreakdown: Record<number, number>;
  stepDropoffBreakdown: Record<number, number>;
  draftSavedCount: number;
  draftResumedCount: number;
  errors: string[];
  startedAt: number;
  completedAt?: number;
}

const PROJECT_STEP_LABELS: Record<number, string> = {
  1:  "파트너 찾기 방식", 2:  "파트너 유형",     3:  "프로젝트명",
  4:  "광고 목적",         5:  "제작 기법",        6:  "노출 매체",
  7:  "주요 고객",         8:  "예산",              9:  "대금 지급",
  10: "일정",              11: "제품정보",          12: "담당자정보",
  13: "경쟁사 제외",       14: "참여기업 조건",     15: "제출자료",
  16: "기업정보",          17: "상세설명",           18: "최종 확인 & 등록",
};

interface SimConfig {
  userCount: number;
  pctAdvertiser: number; pctAgency: number; pctProduction: number;
  pctTvcf: number; pctGoogle: number; pctNaver: number; pctKakao: number; pctOrganic: number;
  pctSsoLogin: number; pctManualLogin: number; pctSignup: number;
  pctMale: number; pctFemale: number;
  pct20s: number; pct30s: number; pct40s: number; pct50s: number;
  pctSeoul: number; pctGyeonggi: number; pctBusan: number; pctIncheon: number;
  pctDaegu: number; pctDaejeon: number; pctGwangju: number; pctOtherRegion: number; pctAbroad: number;
}

const DEFAULTS: SimConfig = {
  userCount: 1000,
  pctAdvertiser: 5, pctAgency: 30, pctProduction: 65,
  pctTvcf: 85, pctGoogle: 5, pctNaver: 5, pctKakao: 3, pctOrganic: 2,
  pctSsoLogin: 17, pctManualLogin: 17, pctSignup: 3,
  pctMale: 60, pctFemale: 40,
  pct20s: 10, pct30s: 35, pct40s: 35, pct50s: 20,
  pctSeoul: 35, pctGyeonggi: 20, pctBusan: 8, pctIncheon: 5,
  pctDaegu: 4, pctDaejeon: 3, pctGwangju: 3, pctOtherRegion: 17, pctAbroad: 5,
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
  const geoBreakdown = job?.geoBreakdown ?? {} as Record<string, number>;

  const utmSum     = cfg.pctTvcf + cfg.pctGoogle + cfg.pctNaver + cfg.pctKakao + cfg.pctOrganic;
  const userSum    = cfg.pctAdvertiser + cfg.pctAgency + cfg.pctProduction;
  const loginSum   = cfg.pctSsoLogin + cfg.pctManualLogin + cfg.pctSignup;
  const genderSum  = cfg.pctMale + cfg.pctFemale;
  const ageSum     = cfg.pct20s + cfg.pct30s + cfg.pct40s + cfg.pct50s;
  const geoSum     = cfg.pctSeoul + cfg.pctGyeonggi + cfg.pctBusan + cfg.pctIncheon
                   + cfg.pctDaegu + cfg.pctDaejeon + cfg.pctGwangju + cfg.pctOtherRegion + cfg.pctAbroad;

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
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400 leading-tight">가상 사용자 수</span>
            <Select value={String(cfg.userCount)} onValueChange={(v) => set("userCount", Number(v))}>
              <SelectTrigger className="w-32 h-8 text-xs border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[100, 300, 500, 1000, 2000, 3000, 5000, 10000].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n.toLocaleString()}명</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="btn-pink ml-auto" onClick={() => setConfirmOpen(true)}
            disabled={!!isRunning || loading}>
            {loading ? "시작 중..." : isRunning ? "실행 중..." : "▶ 시뮬레이션 시작"}
          </Button>
        </div>

        <hr className="border-gray-100" />

        {/* 인증 현황 (전체 방문자 기준 %) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-600">인증 현황</span>
            <span className="text-[10px] text-gray-400">전체 방문자 기준 % — 나머지는 미로그인</span>
            {loginSum > 100 && <span className="text-[10px] text-red-500">합계 {loginSum}% (100% 초과)</span>}
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <NumInput label="SSO 로그인"  value={cfg.pctSsoLogin}    onChange={(v) => set("pctSsoLogin", v)} />
            <NumInput label="수동 로그인"  value={cfg.pctManualLogin} onChange={(v) => set("pctManualLogin", v)} />
            <NumInput label="신규 가입"    value={cfg.pctSignup}      onChange={(v) => set("pctSignup", v)} />
            <div className="flex flex-col gap-0.5 pb-1">
              <span className="text-[10px] text-gray-400">미로그인</span>
              <span className="text-sm font-semibold text-gray-700">{Math.max(0, 100 - loginSum)}%</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* 로그인 유저 내 구성 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-600">로그인 유저 내 구성</span>
            {sumWarn([cfg.pctAdvertiser, cfg.pctAgency, cfg.pctProduction], "유저 타입")}
          </div>
          <div className="flex flex-wrap gap-4">
            <NumInput label="광고주" value={cfg.pctAdvertiser} onChange={(v) => set("pctAdvertiser", v)} />
            <NumInput label="대행사" value={cfg.pctAgency}     onChange={(v) => set("pctAgency", v)} />
            <NumInput label="제작사" value={cfg.pctProduction} onChange={(v) => set("pctProduction", v)} />
            <div className="flex items-end pb-1">
              <span className={`text-xs font-semibold ${userSum === 100 ? "text-green-600" : "text-amber-500"}`}>합계 {userSum}%</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* UTM 유입 비율 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-600">UTM 유입 비율</span>
            {sumWarn([cfg.pctTvcf, cfg.pctGoogle, cfg.pctNaver, cfg.pctKakao, cfg.pctOrganic], "UTM")}
          </div>
          <div className="flex flex-wrap gap-4">
            <NumInput label="tvcf.co.kr" value={cfg.pctTvcf}    onChange={(v) => set("pctTvcf", v)} />
            <NumInput label="Google"     value={cfg.pctGoogle}   onChange={(v) => set("pctGoogle", v)} />
            <NumInput label="Naver"      value={cfg.pctNaver}    onChange={(v) => set("pctNaver", v)} />
            <NumInput label="Kakao"      value={cfg.pctKakao}    onChange={(v) => set("pctKakao", v)} />
            <NumInput label="Organic"    value={cfg.pctOrganic}  onChange={(v) => set("pctOrganic", v)} />
            <div className="flex items-end pb-1">
              <span className={`text-xs font-semibold ${utmSum === 100 ? "text-green-600" : "text-amber-500"}`}>합계 {utmSum}%</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* 성별 + 연령대 (가로 2열) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-600">성별</span>
              {sumWarn([cfg.pctMale, cfg.pctFemale], "성별")}
            </div>
            <div className="flex flex-wrap gap-4">
              <NumInput label="남성" value={cfg.pctMale}   onChange={(v) => set("pctMale", v)} />
              <NumInput label="여성" value={cfg.pctFemale} onChange={(v) => set("pctFemale", v)} />
              <div className="flex items-end pb-1">
                <span className={`text-xs font-semibold ${genderSum === 100 ? "text-green-600" : "text-amber-500"}`}>합계 {genderSum}%</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-600">연령대</span>
              {sumWarn([cfg.pct20s, cfg.pct30s, cfg.pct40s, cfg.pct50s], "연령대")}
            </div>
            <div className="flex flex-wrap gap-4">
              <NumInput label="20대" value={cfg.pct20s} onChange={(v) => set("pct20s", v)} />
              <NumInput label="30대" value={cfg.pct30s} onChange={(v) => set("pct30s", v)} />
              <NumInput label="40대" value={cfg.pct40s} onChange={(v) => set("pct40s", v)} />
              <NumInput label="50대" value={cfg.pct50s} onChange={(v) => set("pct50s", v)} />
              <div className="flex items-end pb-1">
                <span className={`text-xs font-semibold ${ageSum === 100 ? "text-green-600" : "text-amber-500"}`}>합계 {ageSum}%</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* 접속 지역 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-600">접속 지역</span>
            {sumWarn([cfg.pctSeoul,cfg.pctGyeonggi,cfg.pctBusan,cfg.pctIncheon,cfg.pctDaegu,cfg.pctDaejeon,cfg.pctGwangju,cfg.pctOtherRegion,cfg.pctAbroad], "지역")}
          </div>
          <div className="flex flex-wrap gap-4">
            <NumInput label="서울"    value={cfg.pctSeoul}       onChange={(v) => set("pctSeoul", v)} />
            <NumInput label="경기도"  value={cfg.pctGyeonggi}    onChange={(v) => set("pctGyeonggi", v)} />
            <NumInput label="부산"    value={cfg.pctBusan}       onChange={(v) => set("pctBusan", v)} />
            <NumInput label="인천"    value={cfg.pctIncheon}     onChange={(v) => set("pctIncheon", v)} />
            <NumInput label="대구"    value={cfg.pctDaegu}       onChange={(v) => set("pctDaegu", v)} />
            <NumInput label="대전"    value={cfg.pctDaejeon}     onChange={(v) => set("pctDaejeon", v)} />
            <NumInput label="광주"    value={cfg.pctGwangju}     onChange={(v) => set("pctGwangju", v)} />
            <NumInput label="기타지방" value={cfg.pctOtherRegion} onChange={(v) => set("pctOtherRegion", v)} />
            <NumInput label="해외"    value={cfg.pctAbroad}      onChange={(v) => set("pctAbroad", v)} />
            <div className="flex items-end pb-1">
              <span className={`text-xs font-semibold ${geoSum === 100 ? "text-green-600" : "text-amber-500"}`}>합계 {geoSum}%</span>
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

            {/* 접속 지역 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
              <p className="font-medium text-gray-800">접속 지역</p>
              <div className="space-y-2">
                {[
                  { key: "서울",    color: "bg-blue-500"   },
                  { key: "경기도",  color: "bg-blue-400"   },
                  { key: "부산",    color: "bg-purple-400" },
                  { key: "인천",    color: "bg-green-400"  },
                  { key: "대구",    color: "bg-yellow-400" },
                  { key: "대전",    color: "bg-orange-400" },
                  { key: "광주",    color: "bg-pink-400"   },
                  { key: "기타지방",color: "bg-gray-400"   },
                  { key: "해외",    color: "bg-indigo-400" },
                ].map(({ key, color }) => {
                  const count = geoBreakdown[key] ?? 0;
                  const pct = job.totalUsers > 0 ? Math.round((count / job.totalUsers) * 100) : 0;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-16 text-xs text-gray-600 shrink-0">{key}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className={`${color} h-3 rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="w-10 text-right text-xs font-medium text-gray-700">{count.toLocaleString()}</div>
                      <div className="w-8 text-right text-xs text-gray-400">{pct}%</div>
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

      {/* 프로젝트 등록 단계별 퍼널 */}
      {job && Object.keys(job.stepFunnelBreakdown ?? {}).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="font-medium text-gray-800">프로젝트 등록 단계별 퍼널</p>
              <p className="text-[10px] text-gray-400">광고주가 어느 단계에서 이탈하는지 확인합니다</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                임시저장 <strong>{job.draftSavedCount ?? 0}건</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                저장 후 재개 <strong>{job.draftResumedCount ?? 0}건</strong>
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            {(() => {
              const stepFunnel = job.stepFunnelBreakdown ?? {};
              const stepDropoff = job.stepDropoffBreakdown ?? {};
              const maxCount = Math.max(...Object.values(stepFunnel), 1);
              return Array.from({ length: 18 }, (_, i) => i + 1).map((step) => {
                const reached = stepFunnel[step] ?? 0;
                const dropped = stepDropoff[step] ?? 0;
                const pct = Math.round((reached / maxCount) * 100);
                const dropPct = reached > 0 ? Math.round((dropped / reached) * 100) : 0;
                const label = PROJECT_STEP_LABELS[step];
                const isHighDropoff = dropPct >= 15;
                return (
                  <div key={step} className="flex items-center gap-2">
                    <div className="w-5 text-[10px] text-gray-400 text-right shrink-0">{step}</div>
                    <div className="w-28 text-xs text-gray-600 truncate shrink-0">{label}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-indigo-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, reached > 0 ? 2 : 0)}%` }} />
                    </div>
                    <div className="w-12 text-right text-xs font-medium text-gray-700">{reached.toLocaleString()}</div>
                    {dropped > 0 ? (
                      <div className={`w-20 text-right text-xs ${isHighDropoff ? "text-red-500 font-semibold" : "text-amber-500"}`}>
                        -{dropped} ({dropPct}%)
                      </div>
                    ) : (
                      <div className="w-20 text-right text-xs text-gray-300">—</div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
          <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-1">
            <span className="flex items-center gap-1"><span className="text-red-500 font-semibold">빨간색</span> = 이탈률 15% 이상 (주요 이탈 구간)</span>
            <span className="flex items-center gap-1"><span className="text-amber-500">주황색</span> = 일부 이탈</span>
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
