import { useState, useEffect, useRef } from "react";
import { StatisticsDashboard } from "@/components/admin/statistics-dashboard";
import { PageHeader } from "@/components/admin/page-header";
import { EventLogTab } from "@/pages/admin/event-log";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

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
  channelBreakdown: Record<string, number>;
  referrerBreakdown: Record<string, number>;
  userTypeBreakdown: Record<string, number>;
  geoBreakdown: Record<string, number>;
  stepFunnelBreakdown: Record<number, number>;
  stepDropoffBreakdown: Record<number, number>;
  draftSavedCount: number;
  draftOpenedCount: number;
  draftReturnHoursSum: number;
  projectCompletedCount: number;
  projDaysSum: number;
  projSessionsSum: number;
  projWritingMinSum: number;
  portfolioCompletedCount: number;
  pfDaysSum: number;
  pfSessionsSum: number;
  pfWritingMinSum: number;
  projectTypeBreakdown: Record<string, number>;
  stepFunnelByType: Record<string, Record<number, number>>;
  stepDropoffByType: Record<string, Record<number, number>>;
  consultingRegisteredCount: number;
  firstVisitCount: number;
  returnVisitCount: number;
  genderBreakdown: Record<string, number>;
  directEntryBreakdown: Record<string, number>;
  portfolioFunnelBreakdown: Record<number, number>;
  portfolioDropoffBreakdown: Record<number, number>;
  pfVisitFunnelBreakdown: Record<number, Record<number, number>>;
  visitFunnelBreakdown: Record<number, Record<number, number>>;
  homeClickBreakdown: Record<string, number>;
  dwellSecSum: Record<string, number>;
  dwellCount: Record<string, number>;
  pageViewBreakdown: Record<string, number>;
  exitPageBreakdown: Record<string, number>;
  aidaBreakdown: { attention: number; interest: number; desire: number; action: number };
  errors: string[];
  startedAt: number;
  completedAt?: number;
}

const PERIOD_OPTIONS = [
  { secs: 0,      label: "즉시" },
  { secs: 600,    label: "10분 분산" },
  { secs: 1800,   label: "30분 분산" },
  { secs: 3600,   label: "1시간 분산" },
  { secs: 86400,  label: "1일 분산" },
  { secs: 259200, label: "3일 분산" },
  { secs: 604800, label: "7일 분산" },
];

interface SimConfig {
  userCount: number; periodSecs: number;
  pctAdvertiser: number; pctAgency: number; pctProduction: number;
  pctTvcf: number; pctGoogle: number; pctNaver: number; pctKakao: number; pctOrganic: number;
  pctSsoLogin: number; pctManualLogin: number; pctSignup: number;
  pctMale: number; pctFemale: number;
  pct20s: number; pct30s: number; pct40s: number; pct50s: number;
  pctSeoul: number; pctGyeonggi: number; pctLocal: number; pctAbroad: number;
  projectRegCount: number;
  portfolioRegCount: number;
  partnerApplyCount: number;
  minProjectCompletions: number;
  minPortfolioCompletions: number;
}

const DEFAULTS: SimConfig = {
  userCount: 200, periodSecs: 600,
  pctAdvertiser: 10, pctAgency: 30,       pctProduction: 60,
  pctTvcf: 85,       pctGoogle: 5,         pctNaver: 5,        pctKakao: 3,   pctOrganic: 2,
  pctSsoLogin: 20,   pctManualLogin: 15,   pctSignup: 5,
  pctMale: 45,       pctFemale: 55,
  pct20s: 10,        pct30s: 35,           pct40s: 35,          pct50s: 20,
  pctSeoul: 35, pctGyeonggi: 20, pctLocal: 40, pctAbroad: 5,
  projectRegCount: 12,
  portfolioRegCount: 40,
  partnerApplyCount: 30,
  minProjectCompletions: 5,
  minPortfolioCompletions: 5,
};

function NumInput({ label, value, onChange, min = 0, max = 100, unit = "%" }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; unit?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-gray-400 leading-tight whitespace-pre-line">{label}</span>
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

const PROJECT_STEP_LABELS: Record<number, string> = {
  1: "파트너 찾기 방식", 2: "파트너 유형",    3: "프로젝트명",
  4: "광고 목적",        5: "제작 기법",       6: "노출 매체",
  7: "주요 고객",        8: "예산",            9: "대금 지급",
  10: "일정",           11: "제품정보",        12: "담당자정보",
  13: "경쟁사 제외",    14: "참여기업 조건",   15: "제출자료",
  16: "기업정보",       17: "상세설명",         18: "최종 확인 & 등록",
};

const FUNNEL_ORDER = [
  { key: "site_visit",            label: "유입",            color: "bg-blue-400",    aarrr: "Acquisition" },
  { key: "sso_login",             label: "SSO 로그인",      color: "bg-pink-400",    aarrr: "" },
  { key: "login",                 label: "수동 로그인",     color: "bg-rose-400",    aarrr: "" },
  { key: "signup_complete",       label: "가입 완료",       color: "bg-orange-400",  aarrr: "Activation" },
  { key: "portfolio_registered",  label: "포트폴리오 등록", color: "bg-purple-400",  aarrr: "" },
  { key: "project_submitted",     label: "프로젝트 등록",   color: "bg-green-400",   aarrr: "" },
  { key: "partner_applied",       label: "공고 지원",       color: "bg-teal-400",    aarrr: "" },
  { key: "contract_signed",       label: "계약 체결",       color: "bg-emerald-500", aarrr: "Revenue" },
  { key: "draft_reviewed",        label: "시안 확정",       color: "bg-sky-500",     aarrr: "" },
  { key: "deliverable_submitted", label: "산출물 등록",     color: "bg-violet-400",  aarrr: "" },
  { key: "project_completed",     label: "프로젝트 완료",   color: "bg-pink-500",    aarrr: "" },
  { key: "review_submitted",      label: "리뷰 등록",       color: "bg-gray-400",    aarrr: "" },
  { key: "referral_sent",         label: "추천 공유",       color: "bg-indigo-400",  aarrr: "Referral" },
];

const SIM_CFG_KEY = "admarket_sim_cfg";
const SIM_CFG_VERSION = 4;
const VALID_COUNTS = [10, 100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000];

function loadSavedCfg(): SimConfig {
  try {
    const s = localStorage.getItem(SIM_CFG_KEY);
    if (!s) return DEFAULTS;
    const parsed = JSON.parse(s);
    if (parsed._v !== SIM_CFG_VERSION) return DEFAULTS;
    if (!VALID_COUNTS.includes(parsed.userCount)) return DEFAULTS;
    return { ...DEFAULTS, ...parsed };
  } catch { return DEFAULTS; }
}

function NoDataCard({ title, subtitle, icon, accent = "gray" }: { title: string; subtitle?: string; icon?: string; accent?: "gray" | "indigo" | "purple" | "blue" | "amber" }) {
  const headerCls: Record<string, string> = {
    gray:   "bg-gray-50 border-b border-gray-100",
    indigo: "bg-indigo-50 border-b border-indigo-100",
    purple: "bg-purple-50 border-b border-purple-100",
    blue:   "bg-blue-50 border-b border-blue-100",
    amber:  "bg-amber-50 border-b border-amber-100",
  };
  const titleCls: Record<string, string> = {
    gray:   "text-gray-700",
    indigo: "text-indigo-700",
    purple: "text-purple-700",
    blue:   "text-blue-700",
    amber:  "text-amber-700",
  };
  const subCls: Record<string, string> = {
    gray:   "text-gray-400",
    indigo: "text-indigo-400",
    purple: "text-purple-400",
    blue:   "text-blue-400",
    amber:  "text-amber-400",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`${headerCls[accent]} px-5 py-3 flex items-center gap-2`}>
        {icon && <span className="text-base">{icon}</span>}
        <div>
          <p className={`font-semibold text-sm ${titleCls[accent]}`}>{title}</p>
          {subtitle && <p className={`text-[10px] ${subCls[accent]}`}>{subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <div className="text-2xl text-gray-200">—</div>
        <p className="text-xs text-gray-300">시뮬레이션 실행 후 표시됩니다</p>
      </div>
    </div>
  );
}

function ActivityTab({ openSignal, runSignal }: { openSignal?: number; runSignal?: number }) {
  const [data, setData] = useState<{ jobId: string; job: SimJob } | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"settings" | "status">("status");
  const [cfg, setCfg] = useState<SimConfig>(loadSavedCfg);
  const [dialogCfg, setDialogCfg] = useState<SimConfig>(loadSavedCfg);
  const [loading, setLoading] = useState(false);
  const [projTypeFilter, setProjTypeFilter] = useState<"all" | "public" | "private" | "consulting">("all");
  const [visitFilter, setVisitFilter] = useState<0 | 1 | 2 | 3 | 4>(0); // 0=전체
  const [pfVisitFilter, setPfVisitFilter] = useState<0 | 1 | 2 | 3 | 4>(0); // 포트폴리오 방문 회차
  const [codeEditorOpen, setCodeEditorOpen] = useState(false);
  const [simCode, setSimCode] = useState<string>("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeSaving, setCodeSaving] = useState(false);
  const [codeSaveMsg, setCodeSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function loadSimCode() {
    setCodeLoading(true);
    try {
      const res = await fetch("/api/admin/simulate/code");
      const json = await res.json();
      setSimCode(json.code ?? "");
    } catch { setSimCode("// 코드 로드 실패"); }
    finally { setCodeLoading(false); }
  }

  async function saveSimCode() {
    setCodeSaving(true);
    setCodeSaveMsg(null);
    try {
      const res = await fetch("/api/admin/simulate/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: simCode }),
      });
      if (res.ok) { setCodeSaveMsg({ ok: true, text: "저장 완료 — 다음 실행부터 반영됩니다" }); }
      else { const j = await res.json(); setCodeSaveMsg({ ok: false, text: j.error ?? "저장 실패" }); }
    } catch { setCodeSaveMsg({ ok: false, text: "네트워크 오류" }); }
    finally { setCodeSaving(false); }
  }

  function setD<K extends keyof SimConfig>(key: K, val: SimConfig[K]) {
    setDialogCfg((prev) => ({ ...prev, [key]: val }));
  }

  // 비회원 % 직접 입력 시 → SSO/수동/신규가입 비율 유지하며 자동 조정
  function setGuestPct(newGuest: number) {
    const clamped = Math.min(100, Math.max(0, newGuest));
    const loginTotal = 100 - clamped;
    setDialogCfg((prev) => {
      const { pctSsoLogin, pctManualLogin, pctSignup } = prev;
      const curSum = pctSsoLogin + pctManualLogin + pctSignup;
      if (curSum === 0) {
        // 기존 합계가 0이면 균등 분배
        const each = Math.round(loginTotal / 3);
        return { ...prev, pctSsoLogin: each, pctManualLogin: each, pctSignup: loginTotal - each * 2 };
      }
      // 기존 비율 유지하며 스케일
      const scale = loginTotal / curSum;
      const sso  = Math.round(pctSsoLogin    * scale);
      const man  = Math.round(pctManualLogin  * scale);
      const sig  = loginTotal - sso - man;
      return { ...prev, pctSsoLogin: sso, pctManualLogin: man, pctSignup: Math.max(0, sig) };
    });
  }

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }

  useEffect(() => {
    if (openSignal && openSignal > 0) { setDialogCfg(cfg); setActiveSubTab("settings"); }
  }, [openSignal]);

  useEffect(() => {
    if (runSignal && runSignal > 0) { startSim(dialogCfg); }
  }, [runSignal]);

  const isRunningRef = useRef(false);

  async function fetchLatest() {
    try {
      const res = await fetch("/api/admin/simulate/latest");
      const json = await res.json();
      setData(json);
    } catch { /* ignore */ }
  }

  const job = data?.job ?? null;
  const isRunning = job && (job.status === "pending" || job.status === "generating" || job.status === "sending");

  useEffect(() => {
    isRunningRef.current = !!isRunning;
  }, [isRunning]);

  useEffect(() => {
    fetchLatest();
    let lastFetch = Date.now();
    pollRef.current = setInterval(() => {
      const delay = isRunningRef.current ? 3000 : 30000;
      if (Date.now() - lastFetch >= delay) {
        lastFetch = Date.now();
        fetchLatest();
      }
    }, 1000);
    return () => stopPolling();
  }, []);

  async function startSim(runCfg: SimConfig) {
    setCfg(runCfg);
    try { localStorage.setItem(SIM_CFG_KEY, JSON.stringify({ ...runCfg, _v: SIM_CFG_VERSION })); } catch {}
    setActiveSubTab("status");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/simulate/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(runCfg),
      });
      await res.json();
      isRunningRef.current = true;
      await fetchLatest();
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }
  const isDone = job?.status === "done";

  const totalUsers = job?.totalUsers ?? 0;
  const siteVisit = job?.funnelBreakdown?.["site_visit"] ?? 0;
  const utmBreakdown = job?.utmBreakdown ?? {};
  const channelBreakdown = job?.channelBreakdown ?? {};
  const referrerBreakdown = job?.referrerBreakdown ?? {};
  const userTypeBreakdown = job?.userTypeBreakdown ?? {};
  const geoBreakdown = job?.geoBreakdown ?? {};

  const dUtmSum    = dialogCfg.pctTvcf + dialogCfg.pctGoogle + dialogCfg.pctNaver + dialogCfg.pctKakao + dialogCfg.pctOrganic;
  const dUserSum   = dialogCfg.pctAdvertiser + dialogCfg.pctAgency + dialogCfg.pctProduction;
  const dLoginSum  = dialogCfg.pctSsoLogin + dialogCfg.pctManualLogin + dialogCfg.pctSignup;
  const dGenderSum = dialogCfg.pctMale + dialogCfg.pctFemale;
  const dAgeSum    = dialogCfg.pct20s + dialogCfg.pct30s + dialogCfg.pct40s + dialogCfg.pct50s;
  const dGeoSum    = dialogCfg.pctSeoul + dialogCfg.pctGyeonggi + dialogCfg.pctLocal + dialogCfg.pctAbroad;

  return (
    <div>
      {/* 서브 탭 헤더 */}
      <div className="flex items-center border-b border-gray-200 mb-6">
        {(["status", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeSubTab === tab
                ? "border-pink-600 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "settings" ? "시뮬레이션 설정" : "활동 현황"}
          </button>
        ))}
      </div>

      {/* ── 설정 탭 ── */}
      {activeSubTab === "settings" && (
        <div className="space-y-4">
            {/* 기본 설정 행 */}
            <div className="flex items-center gap-6 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">가상 사용자</span>
                <Select value={String(dialogCfg.userCount)} onValueChange={(v) => setD("userCount", Number(v))}>
                  <SelectTrigger className="w-28 h-8 text-xs border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VALID_COUNTS.map((n) => (
                      <SelectItem key={n} value={String(n)}>{n.toLocaleString()}명</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">이벤트 분산 기간</span>
                <Select value={String(dialogCfg.periodSecs)} onValueChange={(v) => setD("periodSecs", Number(v))}>
                  <SelectTrigger className="w-28 h-8 text-xs border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERIOD_OPTIONS.map(({ secs, label }) => (
                      <SelectItem key={secs} value={String(secs)}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 설정 테이블 */}
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 w-28">구분</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500">항목별 비율</th>
                  <th className="text-right py-2 pl-4 text-xs font-semibold text-gray-500 w-16">합계</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 pr-4 font-semibold text-gray-700 align-middle text-sm">
                    인증 현황
                    <div className="text-[10px] font-normal text-gray-400">방문자 기준</div>
                  </td>
                  <td className="py-1">
                    <div className="flex flex-wrap gap-2 items-end">
                      <NumInput label="비회원"      value={Math.max(0, 100 - dLoginSum)} onChange={(v) => setGuestPct(v)} />
                      <NumInput label="SSO 로그인"  value={dialogCfg.pctSsoLogin}    onChange={(v) => setD("pctSsoLogin", v)} />
                      <NumInput label="수동 로그인"  value={dialogCfg.pctManualLogin} onChange={(v) => setD("pctManualLogin", v)} />
                      <NumInput label="신규 가입"    value={dialogCfg.pctSignup}      onChange={(v) => setD("pctSignup", v)} />
                    </div>
                  </td>
                  <td className="py-1 pl-4 text-right align-middle">
                    <span className={`font-semibold ${dLoginSum > 100 ? "text-red-500" : "text-gray-400"}`}>100%</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-gray-700 align-middle text-sm">
                    유저 타입
                    <div className="text-[10px] font-normal text-gray-400">로그인 유저</div>
                  </td>
                  <td className="py-1">
                    <div className="flex flex-wrap gap-2 items-end">
                      <NumInput label="광고주" value={dialogCfg.pctAdvertiser} onChange={(v) => setD("pctAdvertiser", v)} />
                      <NumInput label="대행사" value={dialogCfg.pctAgency}     onChange={(v) => setD("pctAgency", v)} />
                      <NumInput label="제작사" value={dialogCfg.pctProduction} onChange={(v) => setD("pctProduction", v)} />
                    </div>
                  </td>
                  <td className="py-1 pl-4 text-right align-middle">
                    <span className={`font-semibold ${dUserSum === 100 ? "text-green-600" : "text-amber-500"}`}>{dUserSum}%</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-gray-700 align-middle text-sm">
                    유입 채널
                    <div className="text-[10px] font-normal text-gray-400">UTM · 자사 포함</div>
                  </td>
                  <td className="py-1">
                    <div className="flex flex-wrap gap-2 items-end">
                      <NumInput label="자사(tvcf)" value={dialogCfg.pctTvcf}    onChange={(v) => setD("pctTvcf", v)} />
                      <NumInput label="Google"     value={dialogCfg.pctGoogle}   onChange={(v) => setD("pctGoogle", v)} />
                      <NumInput label="Naver"      value={dialogCfg.pctNaver}    onChange={(v) => setD("pctNaver", v)} />
                      <NumInput label="Kakao"      value={dialogCfg.pctKakao}    onChange={(v) => setD("pctKakao", v)} />
                      <NumInput label={"Organic\n(비광고)"}    value={dialogCfg.pctOrganic}  onChange={(v) => setD("pctOrganic", v)} />
                    </div>
                  </td>
                  <td className="py-1 pl-4 text-right align-middle">
                    <span className={`font-semibold ${dUtmSum === 100 ? "text-green-600" : "text-amber-500"}`}>{dUtmSum}%</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-gray-700 align-top text-sm pt-2">성별·연령대</td>
                  <td className="py-1">
                    <div className="flex flex-wrap gap-x-6 gap-y-1 items-end">
                      <div className="flex gap-2 items-end">
                        <NumInput label="여성" value={dialogCfg.pctFemale} onChange={(v) => setD("pctFemale", v)} />
                        <NumInput label="남성" value={dialogCfg.pctMale}   onChange={(v) => setD("pctMale", v)} />
                        <span className={`text-[10px] font-semibold pb-1 ${dGenderSum === 100 ? "text-green-600" : "text-amber-500"}`}>{dGenderSum}%</span>
                      </div>
                      <div className="flex gap-2 items-end">
                        <NumInput label="20대" value={dialogCfg.pct20s} onChange={(v) => setD("pct20s", v)} />
                        <NumInput label="30대" value={dialogCfg.pct30s} onChange={(v) => setD("pct30s", v)} />
                        <NumInput label="40대" value={dialogCfg.pct40s} onChange={(v) => setD("pct40s", v)} />
                        <NumInput label="50대" value={dialogCfg.pct50s} onChange={(v) => setD("pct50s", v)} />
                        <span className={`text-[10px] font-semibold pb-1 ${dAgeSum === 100 ? "text-green-600" : "text-amber-500"}`}>{dAgeSum}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-1 pl-4 align-middle" />
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-gray-700 align-middle text-sm">
                    접속 지역
                    <div className="text-[10px] font-normal text-gray-400">방문자 기준</div>
                  </td>
                  <td className="py-1.5">
                    <div className="flex gap-2 items-end">
                      <NumInput label="서울"  value={dialogCfg.pctSeoul}    onChange={(v) => setD("pctSeoul", v)} />
                      <NumInput label="경기"  value={dialogCfg.pctGyeonggi} onChange={(v) => setD("pctGyeonggi", v)} />
                      <NumInput label="지방"  value={dialogCfg.pctLocal}    onChange={(v) => setD("pctLocal", v)} />
                      <NumInput label="해외"  value={dialogCfg.pctAbroad}   onChange={(v) => setD("pctAbroad", v)} />
                    </div>
                  </td>
                  <td className="py-1.5 pl-4 text-right align-middle">
                    <span className={`font-semibold ${dGeoSum === 100 ? "text-green-600" : "text-amber-500"}`}>{dGeoSum}%</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-gray-700 align-middle text-sm">
                    활동 인원
                    <div className="text-[10px] font-normal text-gray-400">행동 전환 목표</div>
                  </td>
                  <td className="py-1.5">
                    <div className="flex gap-2 items-end">
                      <NumInput label="프로젝트 등록"  value={dialogCfg.projectRegCount}  onChange={(v) => setD("projectRegCount", v)}  min={0} max={10000} unit="명" />
                      <NumInput label="포트폴리오 등록" value={dialogCfg.portfolioRegCount} onChange={(v) => setD("portfolioRegCount", v)} min={0} max={10000} unit="명" />
                      <NumInput label="공고 지원"       value={dialogCfg.partnerApplyCount} onChange={(v) => setD("partnerApplyCount", v)} min={0} max={10000} unit="명" />
                    </div>
                  </td>
                  <td className="py-1.5 pl-4 align-middle" />
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-gray-700 align-top text-sm pt-2">
                    완주 최소 보장
                    <div className="text-[10px] font-normal text-gray-400">부족하면 자동 보충</div>
                  </td>
                  <td className="py-1">
                    <div className="flex gap-2 items-end">
                      <NumInput label="프로젝트 최소" value={dialogCfg.minProjectCompletions}  onChange={(v) => setD("minProjectCompletions", v)}  min={0} max={1000} unit="건" />
                      <NumInput label="포트폴리오 최소" value={dialogCfg.minPortfolioCompletions} onChange={(v) => setD("minPortfolioCompletions", v)} min={0} max={1000} unit="건" />
                    </div>
                  </td>
                  <td className="py-1 pl-4 align-middle" />
                </tr>
              </tbody>
            </table>

            {/* 코드 에디터 섹션 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-left"
                onClick={() => {
                  const next = !codeEditorOpen;
                  setCodeEditorOpen(next);
                  if (next && simCode === "") loadSimCode();
                }}
              >
                <span className="text-xs font-semibold text-gray-600 font-mono">{"{ }"} 실행 코드 편집</span>
                <span className="text-[10px] text-gray-400">{codeEditorOpen ? "▲ 접기" : "▼ 펼치기"}</span>
              </button>

              {codeEditorOpen && (
                <div className="p-3 space-y-2 bg-white">
                  {codeLoading ? (
                    <div className="text-xs text-gray-400 py-6 text-center">코드 로딩 중...</div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-gray-400 font-mono">server/simulate-analytics.ts</p>
                        <div className="flex items-center gap-2">
                          <button onClick={loadSimCode} className="text-[10px] text-blue-500 hover:underline">↺ 새로고침</button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-[10px] px-2"
                            onClick={saveSimCode}
                            disabled={codeSaving}
                          >
                            {codeSaving ? "저장 중..." : "💾 저장"}
                          </Button>
                        </div>
                      </div>
                      <textarea
                        value={simCode}
                        onChange={(e) => { setSimCode(e.target.value); setCodeSaveMsg(null); }}
                        spellCheck={false}
                        className="w-full h-96 text-[11px] font-mono bg-gray-950 text-green-300 rounded p-3 resize-y border-0 outline-none leading-relaxed"
                        style={{ tabSize: 2 }}
                      />
                      {codeSaveMsg && (
                        <p className={`text-[10px] ${codeSaveMsg.ok ? "text-green-600" : "text-red-500"}`}>
                          {codeSaveMsg.ok ? "✓" : "✗"} {codeSaveMsg.text}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded px-2 py-1">
              ⚠ 실행 시 실제 GA4 + Mixpanel 계정에 가상 이벤트가 추가됩니다.
            </div>

        </div>
      )}

      {/* ── 현황 탭 ── */}
      {activeSubTab === "status" && (
        <div className="space-y-6">
          <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* 유입 경로 + UTM 유입 채널 나란히 */}
              <div className="grid grid-cols-2 gap-4">
                {/* 유입 경로 (referrer 도메인 기준) */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                  <div>
                    <p className="font-semibold text-pink-700 text-sm">유입 경로</p>
                    <p className="text-xs text-gray-400 mt-0.5">원천 도메인 기준</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: "tvcf.co.kr",  label: "tvcf.co.kr", color: "bg-pink-500"   },
                      { key: "naver.com",   label: "naver.com",  color: "bg-green-500"  },
                      { key: "google.com",  label: "google.com", color: "bg-blue-400"   },
                      { key: "kakao.com",   label: "kakao.com",  color: "bg-yellow-400" },
                      { key: "daum.net",    label: "daum.net",   color: "bg-orange-400" },
                      { key: "(직접 유입)",  label: "직접 유입",   color: "bg-gray-400"   },
                    ].map(({ key, label, color }) => {
                      const count = referrerBreakdown[key] ?? 0;
                      const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <div className="w-16 text-xs text-gray-600 shrink-0 truncate">{label}</div>
                          <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                          <div className="w-8 text-right text-xs font-medium text-gray-700">{count}</div>
                          <div className="w-7 text-right text-xs text-gray-400">{pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* UTM 유입 채널 (유료광고) */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                  <div>
                    <p className="font-semibold text-indigo-700 text-sm">UTM 유입 채널(유료광고)</p>
                    <p className="text-xs text-gray-400 mt-0.5">유료광고 파라미터 기준</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: "google",     label: "Google",      color: "bg-blue-400"   },
                      { key: "naver",      label: "Naver",       color: "bg-green-500"  },
                      { key: "kakao",      label: "Kakao",       color: "bg-yellow-400" },
                      { key: "organic",    label: "Organic\n(비광고)", color: "bg-gray-400"   },
                    ].map(({ key, label, color }) => {
                      const count = utmBreakdown[key] ?? 0;
                      const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <div className="w-20 text-xs text-gray-600 shrink-0 whitespace-pre-line leading-tight">{label}</div>
                          <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                          <div className="w-8 text-right text-xs font-medium text-gray-700">{count}</div>
                          <div className="w-7 text-right text-xs text-gray-400">{pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 접속 지역 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                <p className="font-semibold text-teal-700 text-sm">접속 지역</p>
                <div className="space-y-2">
                  {[
                    { key: "서울",  color: "bg-blue-500"   },
                    { key: "경기도", color: "bg-blue-400"   },
                    { key: "지방",  color: "bg-purple-400" },
                    { key: "해외",  color: "bg-indigo-400" },
                  ].map(({ key, color }) => {
                    const count = geoBreakdown[key] ?? 0;
                    const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
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

              {/* 인증 현황 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                <div>
                  <p className="font-semibold text-blue-700 text-sm">유저 유형</p>
                  <p className="text-[10px] text-gray-400">미로그인 = 전체 - 로그인 유저 합계</p>
                </div>
                <div className="space-y-2">
                  {(() => {
                    const authSum = Object.values(userTypeBreakdown).reduce((a, b) => a + b, 0);
                    const rows = [
                      { key: "advertiser", label: "광고주",   color: "bg-blue-500",   count: userTypeBreakdown["advertiser"] ?? 0 },
                      { key: "agency",     label: "대행사",   color: "bg-green-500",  count: userTypeBreakdown["agency"] ?? 0 },
                      { key: "production", label: "제작사",   color: "bg-purple-500", count: userTypeBreakdown["production"] ?? 0 },
                      { key: "milogin",    label: "미로그인", color: "bg-gray-300",   count: totalUsers - authSum },
                    ];
                    return rows.map(({ key, label, color, count }) => {
                      const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
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

            <div className="space-y-4">
              {/* AARRR 퍼널 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                <p className="font-semibold text-violet-700 text-sm">AARRR 퍼널</p>
                <div className="space-y-2">
                  {FUNNEL_ORDER.map(({ key, label, color, aarrr }) => {
                    const count = job?.funnelBreakdown?.[key] ?? 0;
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
                    ✅ GA4 + Mixpanel 전송 완료
                  </div>
                )}
              </div>

              {/* 방문 유형 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                <div>
                  <p className="font-semibold text-sky-700 text-sm">방문 유형</p>
                  <p className="text-[10px] text-gray-400">GA4 신규 방문자 / 재방문자 기준</p>
                </div>
                <div className="space-y-2">
                  {(() => {
                    const first = job?.firstVisitCount ?? 0;
                    const ret   = job?.returnVisitCount ?? 0;
                    const total = first + ret;
                    return [
                      { label: "첫방문", count: first, color: "bg-teal-400"   },
                      { label: "재방문", count: ret,   color: "bg-orange-400" },
                    ].map(({ label, count, color }) => {
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={label} className="flex items-center gap-3">
                          <div className="w-14 text-xs text-gray-600 shrink-0">{label}</div>
                          <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div className={`${color} h-3 rounded-full transition-all duration-500`}
                              style={{ width: `${Math.max(pct, count > 0 ? 1 : 0)}%` }} />
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
          </div>

          {/* 성별 + 직접 유입 나란히 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 성별 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div>
                <p className="font-semibold text-rose-700 text-sm">성별</p>
                <p className="text-[10px] text-gray-400">전체 방문자 기준</p>
              </div>
              <div className="space-y-2">
                {(() => {
                  const gd = job?.genderBreakdown ?? {};
                  const male   = gd["male"]   ?? 0;
                  const female = gd["female"] ?? 0;
                  const total  = male + female;
                  return [
                    { label: "남성", count: male,   color: "bg-blue-400" },
                    { label: "여성", count: female, color: "bg-pink-400" },
                  ].map(({ label, count, color }) => {
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-14 text-xs text-gray-600 shrink-0">{label}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div className={`${color} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${Math.max(pct, count > 0 ? 1 : 0)}%` }} />
                        </div>
                        <div className="w-10 text-right text-xs font-medium text-gray-700">{count.toLocaleString()}</div>
                        <div className="w-8 text-right text-xs text-gray-400">{pct}%</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* 직접 유입 / 북마크 랜딩 페이지 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div>
                <p className="font-semibold text-orange-700 text-sm">직접 유입 / 북마크 랜딩 페이지</p>
                <p className="text-[10px] text-gray-400">북마크하거나 URL을 직접 입력해 들어온 페이지 분포</p>
              </div>
              <div className="space-y-2">
                {(() => {
                  const entries = Object.entries(job?.directEntryBreakdown ?? {}).sort(([, a], [, b]) => b - a);
                  const totalDirect = entries.reduce((s, [, v]) => s + v, 0);
                  const maxCount = entries[0]?.[1] ?? 1;
                  const PAGE_LABELS: Record<string, string> = {
                    "/": "홈", "/work/home": "마이페이지 홈", "/work/projects": "내 프로젝트",
                    "/partner": "파트너 찾기", "/create-project/step1": "프로젝트 등록",
                    "/work/profile": "프로필", "/work/proposals": "제안 현황", "/work/contracts": "계약 관리",
                  };
                  const PAGE_COLORS: Record<string, string> = {
                    "/": "bg-pink-400", "/work/home": "bg-blue-400", "/work/projects": "bg-indigo-400",
                    "/partner": "bg-green-400", "/create-project/step1": "bg-amber-400",
                    "/work/profile": "bg-purple-400", "/work/proposals": "bg-sky-400", "/work/contracts": "bg-orange-400",
                  };
                  return entries.map(([path, count]) => {
                    const barPct = Math.round((count / maxCount) * 100);
                    const sharePct = totalDirect > 0 ? Math.round((count / totalDirect) * 100) : 0;
                    return (
                      <div key={path} className="flex items-center gap-3">
                        <div className="w-24 text-xs text-gray-600 truncate shrink-0">{PAGE_LABELS[path] ?? path}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div className={`${PAGE_COLORS[path] ?? "bg-gray-400"} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${Math.max(barPct, 2)}%` }} />
                        </div>
                        <div className="w-10 text-right text-xs font-medium text-gray-700">{count.toLocaleString()}</div>
                        <div className="w-8 text-right text-xs text-gray-400">{sharePct}%</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>{/* /성별+직접유입 2열 */}

          {/* 메인화면 클릭 분석 */}
          {(() => {
            const HOME_ELEMENT_META: Record<string, { label: string; color: string; dest: string }> = {
              cta:            { label: "메인 Hero CTA (무료로 의뢰하기)", color: "bg-pink-500",    dest: "→ /create-project/step1" },
              free_start_btn: { label: "무료로 시작하기 (헤더 버튼)",      color: "bg-rose-400",    dest: "→ /signup" },
              login_btn:      { label: "로그인 아이콘 (헤더)",             color: "bg-blue-400",    dest: "→ /login" },
              project_card:   { label: "공모전 · 프로젝트 카드",           color: "bg-amber-400",   dest: "→ 공고 상세" },
              category:       { label: "카테고리 탐색",                    color: "bg-green-400",   dest: "→ /agency-search" },
              faq:            { label: "FAQ 질문 클릭",                    color: "bg-violet-400",  dest: "(패널 열림)" },
              feature_card:   { label: "서비스 특징 카드",                 color: "bg-indigo-400",  dest: "→ /guide/features" },
              partner:        { label: "파트너 카드",                      color: "bg-teal-400",    dest: "→ /agency-search" },
              flow_step:      { label: "이용 방법 단계",                   color: "bg-orange-400",  dest: "→ /guide/how-to-use" },
              faq_more:       { label: "FAQ 전체보기",                     color: "bg-gray-400",    dest: "→ /guide/faq" },
              etc:            { label: "기타 (이용약관 · Footer 등)",        color: "bg-slate-300",   dest: "(기타 클릭)" },
            };
            const breakdown = job?.homeClickBreakdown ?? {};
            const entries = Object.entries(breakdown)
              .filter(([key]) => key && key !== "undefined")
              .sort(([, a], [, b]) => b - a);
            const total = entries.reduce((s, [, v]) => s + v, 0);
            const maxCount = entries[0]?.[1] ?? 1;
            return (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-pink-700 text-sm">메인화면 클릭 분석</p>
                    <p className="text-[10px] text-gray-400">홈(/)에서 사용자가 어떤 요소를 눌러 다음 화면으로 이동하는지{total > 0 ? ` — 총 ${total.toLocaleString()}회 클릭` : ""}</p>
                  </div>
                  <div className="text-[10px] text-gray-400 text-right shrink-0 pt-1">
                    cta / 카드 / 로그인 등<br />11개 요소 추적
                  </div>
                </div>
                {entries.length === 0 ? (
                  <div className="text-xs text-gray-400 py-4 text-center">시뮬레이션 실행 후 데이터가 표시됩니다</div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {entries.map(([element, count]) => {
                        const meta = HOME_ELEMENT_META[element] ?? { label: element, color: "bg-gray-300", dest: "" };
                        const barPct  = Math.round((count / maxCount) * 100);
                        const sharePct = total > 0 ? Math.round((count / total) * 100) : 0;
                        return (
                          <div key={element} className="flex items-center gap-3">
                            <div className="w-40 shrink-0">
                              <div className="text-xs text-gray-700 truncate">{meta.label}</div>
                              <div className="text-[10px] text-gray-400 truncate">{meta.dest}</div>
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                              <div className={`${meta.color} h-3 rounded-full transition-all duration-500`}
                                style={{ width: `${Math.max(barPct, 2)}%` }} />
                            </div>
                            <div className="w-10 text-right text-xs font-medium text-gray-700">{count.toLocaleString()}</div>
                            <div className="w-8 text-right text-xs text-gray-400">{sharePct}%</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-pink-50 rounded-lg px-3 py-2 text-[10px] text-pink-700 mt-1">
                      💡 CTA 클릭이 {Math.round(((breakdown["cta"] ?? 0) / Math.max(total, 1)) * 100)}%로 가장 높습니다.
                      공모전 카드는 비로그인 유저의 주요 탐색 경로입니다.
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          {/* 멀티세션 작성 패턴 */}
          {job && (job.projectCompletedCount > 0 || job.portfolioCompletedCount > 0) ? (() => {
            const pjN  = job.projectCompletedCount   || 1;
            const pfN  = job.portfolioCompletedCount || 1;
            const drN  = job.draftOpenedCount        || 1;
            const avgProjDays    = +(job.projDaysSum     / pjN).toFixed(1);
            const avgProjSess    = +(job.projSessionsSum / pjN).toFixed(1);
            const avgProjMin     = Math.round(job.projWritingMinSum / pjN);
            const avgPfDays      = +(job.pfDaysSum      / pfN).toFixed(1);
            const avgPfSess      = +(job.pfSessionsSum  / pfN).toFixed(1);
            const avgPfMin       = Math.round(job.pfWritingMinSum  / pfN);
            const avgReturnHours = +(job.draftReturnHoursSum / drN).toFixed(1);
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 프로젝트 등록 카드 */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-indigo-50 border-b border-indigo-100 px-5 py-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📋</span>
                        <div>
                          <p className="font-semibold text-indigo-800 text-sm">프로젝트 등록 — 멀티세션 패턴</p>
                          <p className="text-[10px] text-indigo-400">완주한 {job.projectCompletedCount}건 기준</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-indigo-50 rounded-xl">
                          <div className="text-xl font-bold text-indigo-700">{avgProjDays}일</div>
                          <div className="text-xs text-indigo-500 mt-0.5">평균 완주 기간</div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-indigo-50 rounded-xl">
                          <div className="text-xl font-bold text-indigo-700">{avgProjSess}회</div>
                          <div className="text-xs text-indigo-500 mt-0.5">평균 세션 수</div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-indigo-50 rounded-xl">
                          <div className="text-xl font-bold text-indigo-700">{avgProjMin}분</div>
                          <div className="text-xs text-indigo-500 mt-0.5">평균 작성시간</div>
                          <div className="text-[10px] text-indigo-300 mt-0.5">갭 제외 순수</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 포트폴리오 등록 카드 */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-purple-50 border-b border-purple-100 px-5 py-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🖼️</span>
                        <div>
                          <p className="font-semibold text-purple-800 text-sm">포트폴리오 등록 — 멀티세션 패턴</p>
                          <p className="text-[10px] text-purple-400">완주한 {job.portfolioCompletedCount}건 기준</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-purple-50 rounded-xl">
                          <div className="text-xl font-bold text-purple-700">{avgPfDays}일</div>
                          <div className="text-xs text-purple-500 mt-0.5">평균 완주 기간</div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-purple-50 rounded-xl">
                          <div className="text-xl font-bold text-purple-700">{avgPfSess}회</div>
                          <div className="text-xs text-purple-500 mt-0.5">평균 세션 수</div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-purple-50 rounded-xl">
                          <div className="text-xl font-bold text-purple-700">{avgPfMin}분</div>
                          <div className="text-xs text-purple-500 mt-0.5">평균 작성시간</div>
                          <div className="text-[10px] text-purple-300 mt-0.5">갭 제외 순수</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 임시저장 공통 인사이트 */}
                {job.draftOpenedCount > 0 && (
                  <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 flex items-center gap-3 text-xs text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block shrink-0" />
                    임시저장 후 평균 <strong className="mx-0.5">{avgReturnHours}시간</strong> 뒤에 돌아와서 이어서 작성
                    <span className="text-green-300">|</span>
                    총 <strong className="mx-0.5">{job.draftOpenedCount}회</strong> 재방문
                  </div>
                )}
              </div>
            );
          })() : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NoDataCard title="프로젝트 등록 — 멀티세션 패턴" subtitle="완주한 유저 기준 작성 행동 분석" icon="📋" accent="indigo" />
              <NoDataCard title="포트폴리오 등록 — 멀티세션 패턴" subtitle="완주한 유저 기준 작성 행동 분석" icon="🖼️" accent="purple" />
            </div>
          )}

          {/* 화면별 평균 체류시간 */}
          {job && job.dwellSecSum && Object.keys(job.dwellSecSum).length > 0 ? (() => {
            const PAGE_ORDER = ["홈 (/)", "파트너 탐색", "공고 상세", "프로젝트 등록", "포트폴리오 등록", "컨설팅 문의", "계약 화면", "납품/산출물"];
            const PAGE_COLORS: Record<string, string> = {
              "홈 (/)":        "bg-blue-400",
              "파트너 탐색":    "bg-teal-400",
              "공고 상세":      "bg-sky-400",
              "프로젝트 등록":  "bg-orange-400",
              "포트폴리오 등록": "bg-purple-400",
              "컨설팅 문의":    "bg-pink-400",
              "계약 화면":      "bg-emerald-400",
              "납품/산출물":    "bg-violet-400",
            };
            const entries = PAGE_ORDER
              .map((page) => {
                const sum   = job.dwellSecSum[page] ?? 0;
                const count = job.dwellCount[page]  ?? 0;
                const avg   = count > 0 ? Math.round(sum / count) : 0;
                return { page, avg, count };
              })
              .filter((e) => e.count > 0)
              .sort((a, b) => b.avg - a.avg);

            const maxAvg = entries[0]?.avg ?? 1;

            function fmtSec(s: number) {
              if (s >= 60) return `${Math.floor(s / 60)}분 ${s % 60}초`;
              return `${s}초`;
            }

            const totalVisits = entries.reduce((s, e) => s + e.count, 0);

            return (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-teal-700 text-sm">화면별 평균 체류시간</p>
                    <p className="text-[10px] text-gray-400">유저가 각 화면에서 평균 몇 초를 머물렀는지 — 총 {totalVisits.toLocaleString()}회 페이지뷰 기준</p>
                  </div>
                  <div className="text-[10px] text-gray-400 bg-gray-50 rounded px-2 py-1 shrink-0">
                    GA4 <code className="text-gray-500">time_on_page</code> 이벤트 기반
                  </div>
                </div>
                <div className="space-y-2.5">
                  {entries.map(({ page, avg, count }, idx) => {
                    const barPct = Math.round((avg / maxAvg) * 100);
                    const color  = PAGE_COLORS[page] ?? "bg-gray-300";
                    return (
                      <div key={page} className="flex items-center gap-3">
                        <div className="w-4 text-[10px] text-gray-300 text-right shrink-0 font-medium">{idx + 1}</div>
                        <div className="w-24 text-xs text-gray-600 shrink-0 leading-tight">{page}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div className={`${color} h-2.5 rounded-full transition-all duration-500`}
                            style={{ width: `${Math.max(barPct, 2)}%` }} />
                        </div>
                        <div className="w-16 text-right text-xs font-semibold text-gray-700 shrink-0">{fmtSec(avg)}</div>
                        <div className="w-14 text-right text-[10px] text-gray-400 shrink-0">{count.toLocaleString()}회</div>
                      </div>
                    );
                  })}
                </div>
                {entries.length > 0 && (() => {
                  const top = entries[0];
                  const bottom = entries[entries.length - 1];
                  return (
                    <div className="bg-blue-50 rounded-lg px-3 py-2 text-[10px] text-blue-700">
                      💡 <strong>{top.page}</strong>에서 평균 <strong>{fmtSec(top.avg)}</strong>으로 가장 오래 머물고,
                      <strong className="ml-1">{bottom.page}</strong>는 평균 <strong>{fmtSec(bottom.avg)}</strong>으로 상대적으로 짧습니다.
                    </div>
                  );
                })()}
              </div>
            );
          })() : (
            <NoDataCard title="화면별 평균 체류시간" subtitle="유저가 각 화면에 머문 평균 시간" icon="⏱️" accent="gray" />
          )}

          {/* AIDA 퍼널 */}
          {job ? (() => {
            const aida = job.aidaBreakdown ?? { attention: 0, interest: 0, desire: 0, action: 0 };
            const { attention, interest, desire, action } = aida;
            const stages = [
              {
                key: "A", label: "Attention", sublabel: "인지",
                desc: "플랫폼 방문",
                count: attention,
                color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700",
                badge: "bg-blue-100 text-blue-600",
                tip: "유입 채널(UTM) 최적화로 Attention 모수를 늘리세요.",
              },
              {
                key: "I", label: "Interest", sublabel: "관심",
                desc: "파트너 탐색 또는 공고 상세 조회",
                count: interest,
                color: "bg-teal-500", light: "bg-teal-50", text: "text-teal-700",
                badge: "bg-teal-100 text-teal-600",
                tip: "파트너 카드 디자인·검색 필터 개선으로 Interest 전환율을 높이세요.",
              },
              {
                key: "D", label: "Desire", sublabel: "욕구",
                desc: "프로젝트 등록 시작 / 컨설팅 문의 / 포트폴리오 등록",
                count: desire,
                color: "bg-pink-500", light: "bg-pink-50", text: "text-pink-700",
                badge: "bg-pink-100 text-pink-600",
                tip: "프로젝트 등록 중간 이탈 방지를 위해 임시저장·진행률 표시를 강화하세요.",
              },
              {
                key: "A2", label: "Action", sublabel: "행동",
                desc: "계약 체결 / 프로젝트 제출 / 파트너 지원",
                count: action,
                color: "bg-orange-500", light: "bg-orange-50", text: "text-orange-700",
                badge: "bg-orange-100 text-orange-600",
                tip: "계약 검토 단계의 마찰을 줄이면 Action 전환율이 높아집니다.",
              },
            ];

            return (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-indigo-700 text-sm">AIDA 마케팅 퍼널</p>
                    <p className="text-[10px] text-gray-400">Attention → Interest → Desire → Action 단계별 유저 전환 현황</p>
                  </div>
                  <div className="text-[10px] text-gray-400 bg-gray-50 rounded px-2 py-1 shrink-0">
                    총 유입 <strong className="text-gray-600">{attention.toLocaleString()}명</strong> 기준
                  </div>
                </div>

                {attention === 0 && (
                  <div className="py-6 text-center text-sm text-gray-400">
                    시뮬레이션을 새로 실행하면 AIDA 데이터가 표시됩니다.
                  </div>
                )}

                {/* 퍼널 바 + 전환율 + 인사이트 */}
                {attention > 0 ? (
                  <>
                    <div className="space-y-3">
                      {stages.map((s, idx) => {
                        const pct = Math.round((s.count / attention) * 100);
                        const prevCount = idx === 0 ? attention : stages[idx - 1].count;
                        const dropPct = prevCount > 0 ? Math.round(((prevCount - s.count) / prevCount) * 100) : 0;
                        return (
                          <div key={s.key} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className={`${s.badge} text-[10px] font-bold px-1.5 py-0.5 rounded`}>{s.label}</span>
                                <span className="text-gray-500">{s.sublabel}</span>
                                <span className="text-gray-300 text-[10px]">— {s.desc}</span>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                {idx > 0 && dropPct > 0 && (
                                  <span className="text-[10px] text-red-400">▼ {dropPct}% 이탈</span>
                                )}
                                <span className="font-semibold text-gray-700">{s.count.toLocaleString()}명</span>
                                <span className="text-gray-400 w-8 text-right">{pct}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                              <div
                                className={`${s.color} h-3 rounded-full transition-all duration-700`}
                                style={{ width: `${Math.max(pct, 1)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 전환율 요약 */}
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      {[
                        { label: "A→I 전환율", val: Math.round((interest / attention) * 100), color: "text-teal-600" },
                        { label: "I→D 전환율", val: interest > 0 ? Math.round((desire / interest) * 100) : 0, color: "text-pink-600" },
                        { label: "D→A 전환율", val: desire > 0 ? Math.round((action / desire) * 100) : 0, color: "text-orange-600" },
                      ].map((r) => (
                        <div key={r.label} className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className={`text-xl font-bold ${r.color}`}>{r.val}%</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{r.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* 가장 낮은 전환 단계 인사이트 */}
                    {(() => {
                      const rates = [
                        { label: "Attention → Interest", val: interest / attention },
                        { label: "Interest → Desire",    val: interest > 0 ? desire / interest : 1 },
                        { label: "Desire → Action",      val: desire   > 0 ? action / desire   : 1 },
                      ];
                      const worst = rates.reduce((a, b) => (a.val < b.val ? a : b));
                      const tips: Record<string, string> = {
                        "Attention → Interest": "파트너 탐색·공고 상세 유입이 낮습니다. 홈 CTA와 추천 알고리즘을 개선하세요.",
                        "Interest → Desire":    "관심은 있지만 등록·문의로 이어지지 않습니다. 등록 진입 장벽(복잡성·신뢰)을 낮추세요.",
                        "Desire → Action":      "등록 시작 후 완료 전환이 낮습니다. 퍼널 중간 이탈 요인(오류·복잡한 단계)을 점검하세요.",
                      };
                      return (
                        <div className="bg-amber-50 rounded-lg px-3 py-2 text-[10px] text-amber-700">
                          💡 가장 낮은 전환 구간: <strong>{worst.label}</strong> ({Math.round(worst.val * 100)}%)<br />
                          {tips[worst.label]}
                        </div>
                      );
                    })()}
                  </>
                ) : null}
              </div>
            );
          })() : (
            <NoDataCard title="AIDA 마케팅 퍼널" subtitle="Attention → Interest → Desire → Action 전환 흐름" icon="📊" accent="gray" />
          )}

          {/* 방문 화면 순위 + 이탈 페이지 순위 */}
          {job && (job.pageViewBreakdown || job.exitPageBreakdown) ? (() => {
            const PAGE_ORDER = ["홈 (/)", "파트너 탐색", "공고 상세", "프로젝트 등록", "포트폴리오 등록", "컨설팅 문의", "계약 화면", "납품/산출물", "리뷰 등록"];
            const PAGE_COLORS: Record<string, string> = {
              "홈 (/)":         "bg-blue-400",
              "파트너 탐색":     "bg-teal-400",
              "공고 상세":       "bg-sky-400",
              "프로젝트 등록":   "bg-orange-400",
              "포트폴리오 등록": "bg-purple-400",
              "컨설팅 문의":     "bg-pink-400",
              "계약 화면":       "bg-emerald-400",
              "납품/산출물":     "bg-violet-400",
              "리뷰 등록":       "bg-gray-400",
            };

            // 방문 순위
            const pvTotal = Object.values(job.pageViewBreakdown ?? {}).reduce((s, v) => s + v, 0) || 1;
            const pvEntries = PAGE_ORDER
              .map((page) => ({ page, count: (job.pageViewBreakdown ?? {})[page] ?? 0 }))
              .filter((e) => e.count > 0)
              .sort((a, b) => b.count - a.count);
            const pvMax = pvEntries[0]?.count ?? 1;

            // 이탈 순위
            const exTotal = Object.values(job.exitPageBreakdown ?? {}).reduce((s, v) => s + v, 0) || 1;
            const exEntries = PAGE_ORDER
              .map((page) => ({ page, count: (job.exitPageBreakdown ?? {})[page] ?? 0 }))
              .filter((e) => e.count > 0)
              .sort((a, b) => b.count - a.count);
            const exMax = exEntries[0]?.count ?? 1;
            const topExit = exEntries[0];

            const BarRow = ({ page, count, max, total, idx }: { page: string; count: number; max: number; total: number; idx: number }) => (
              <div className="flex items-center gap-3">
                <div className="w-4 text-[10px] text-gray-300 text-right shrink-0 font-medium">{idx + 1}</div>
                <div className="w-24 text-xs text-gray-600 shrink-0 leading-tight">{page}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`${PAGE_COLORS[page] ?? "bg-gray-300"} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(Math.round((count / max) * 100), 2)}%` }} />
                </div>
                <div className="w-10 text-right text-xs font-semibold text-gray-700 shrink-0">{count.toLocaleString()}</div>
                <div className="w-8 text-right text-[10px] text-gray-400 shrink-0">{Math.round((count / total) * 100)}%</div>
              </div>
            );

            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 방문 화면 순위 */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-blue-50 border-b border-blue-100 px-5 py-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">👁️</span>
                      <div>
                        <p className="font-semibold text-blue-800 text-sm">방문 화면 순위</p>
                        <p className="text-[10px] text-blue-500">유저가 가장 많이 방문한 화면 — 총 {pvTotal.toLocaleString()}회</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-blue-400 bg-blue-100 rounded px-2 py-1 shrink-0">
                      <code>page_view</code>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="space-y-2.5">
                      {pvEntries.map(({ page, count }, idx) => (
                        <BarRow key={page} page={page} count={count} max={pvMax} total={pvTotal} idx={idx} />
                      ))}
                    </div>
                    {pvEntries[0] && (
                      <div className="bg-blue-50 rounded-lg px-3 py-2 text-[10px] text-blue-700">
                        💡 <strong>{pvEntries[0].page}</strong>이 전체 방문의 {Math.round((pvEntries[0].count / pvTotal) * 100)}%를 차지합니다.
                        {pvEntries[0].page === "홈 (/)" && " 홈 화면의 콘텐츠 품질과 CTA 배치가 핵심 전환 포인트입니다."}
                        {pvEntries[0].page === "파트너 탐색" && " 파트너 탐색 화면이 핵심 경로입니다. 검색·필터 UX를 지속 개선하세요."}
                        {pvEntries[0].page === "공고 상세" && " 공고 상세 조회가 높습니다. 지원 CTA를 더 눈에 띄게 배치해 보세요."}
                      </div>
                    )}
                  </div>
                </div>

                {/* 이탈 페이지 순위 */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🚪</span>
                      <div>
                        <p className="font-semibold text-amber-800 text-sm">이탈 페이지 순위</p>
                        <p className="text-[10px] text-amber-500">유저가 마지막으로 머물다 떠난 화면 — 총 {exTotal.toLocaleString()}명</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-amber-500 bg-amber-100 rounded px-2 py-1 shrink-0">
                      <code>page_exit</code>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="space-y-2.5">
                      {exEntries.map(({ page, count }, idx) => (
                        <BarRow key={page} page={page} count={count} max={exMax} total={exTotal} idx={idx} />
                      ))}
                    </div>
                    {topExit && (
                      <div className="bg-amber-50 rounded-lg px-3 py-2 text-[10px] text-amber-700">
                        💡 <strong>{topExit.page}</strong>에서 {Math.round((topExit.count / exTotal) * 100)}%의 유저가 이탈합니다.
                        {topExit.page === "홈 (/)" && " 랜딩 페이지 메시지와 CTA를 개선하면 이탈률을 줄일 수 있습니다."}
                        {topExit.page === "프로젝트 등록" && " 등록 퍼널 중간 이탈이 많습니다. 임시저장 안내를 강화해 보세요."}
                        {topExit.page === "파트너 탐색" && " 파트너 탐색 후 전환이 낮습니다. 필터·추천 알고리즘을 점검해 보세요."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })() : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NoDataCard title="방문 화면 순위" subtitle="유저가 가장 많이 방문한 화면" icon="👁️" accent="blue" />
              <NoDataCard title="이탈 페이지 순위" subtitle="유저가 마지막으로 머물다 떠난 화면" icon="🚪" accent="amber" />
            </div>
          )}

          {/* 퍼널 2개 나란히 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 프로젝트 등록 단계별 퍼널 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              {/* 헤더 */}
              <div>
                <p className="font-semibold text-orange-700 text-sm">프로젝트 등록 단계별 퍼널</p>
                <p className="text-[10px] text-gray-400">광고주가 어느 단계에서 이탈하는지 확인합니다</p>
              </div>

              {/* 의뢰 유형 필터 탭 */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["all", "public", "private", "consulting"] as const).map((type) => {
                  const labelMap: Record<string, string> = { all: "전체", public: "공개", private: "비공개", consulting: "컨설팅" };
                  const count = type === "all"
                    ? (job?.projectTypeBreakdown?.["public"] ?? 0) + (job?.projectTypeBreakdown?.["private"] ?? 0) + (job?.consultingRegisteredCount ?? 0)
                    : type === "consulting"
                    ? (job?.consultingRegisteredCount ?? 0)
                    : (job?.projectTypeBreakdown?.[type] ?? 0);
                  const active = projTypeFilter === type;
                  const colorMap: Record<string, string> = {
                    "all":        active ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600",
                    "public":     active ? "bg-blue-500 text-white border-blue-500"     : "border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600",
                    "private":    active ? "bg-violet-500 text-white border-violet-500" : "border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600",
                    "consulting": active ? "bg-pink-500 text-white border-pink-500"     : "border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-600",
                  };
                  return (
                    <button
                      key={type}
                      onClick={() => setProjTypeFilter(type)}
                      className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${colorMap[type]}`}
                    >
                      {labelMap[type]} {count > 0 && <span className="opacity-80">{count}건</span>}
                    </button>
                  );
                })}
                <span className="text-gray-200 mx-1">|</span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                  임시저장 {job?.draftSavedCount ?? 0}건
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  불러오기 {job?.draftOpenedCount ?? 0}건
                </span>
              </div>

              {/* 방문 회차 필터 */}
              {projTypeFilter !== "consulting" && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 shrink-0">방문 회차</span>
                  {([0, 1, 2, 3, 4] as const).map((v) => {
                    const label = v === 0 ? "전체" : v === 4 ? "4회차+" : `${v}회차`;
                    const visitData = v === 0 ? null : (job?.visitFunnelBreakdown?.[v] ?? {});
                    const visitTotal = visitData ? Object.values(visitData).reduce((a, b) => a + b, 0) : null;
                    const active = visitFilter === v;
                    const colors: Record<number, string> = {
                      0: active ? "bg-gray-600 text-white border-gray-600" : "border-gray-200 text-gray-500 hover:border-gray-400",
                      1: active ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600",
                      2: active ? "bg-cyan-500 text-white border-cyan-500" : "border-gray-200 text-gray-500 hover:border-cyan-300 hover:text-cyan-600",
                      3: active ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600",
                      4: active ? "bg-rose-500 text-white border-rose-500" : "border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-600",
                    };
                    return (
                      <button
                        key={v}
                        onClick={() => setVisitFilter(v)}
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-medium transition-all ${colors[v]}`}
                      >
                        {label}
                        {visitTotal !== null && visitTotal > 0 && (
                          <span className="opacity-80 ml-0.5">{visitTotal}</span>
                        )}
                      </button>
                    );
                  })}
                  {visitFilter > 0 && (
                    <span className="text-[10px] text-gray-400 ml-1">
                      {visitFilter === 1 && "처음 방문 — 주로 1~6단계"}
                      {visitFilter === 2 && "2번째 방문 — 중반 작성 구간"}
                      {visitFilter === 3 && "3번째 방문 — 마무리 단계"}
                      {visitFilter === 4 && "4회차 이상 — 완주 집중 구간"}
                    </span>
                  )}
                </div>
              )}

              {/* 컨설팅 선택 시: 단계 없는 요약 */}
              {projTypeFilter === "consulting" ? (
                <div className="space-y-3">
                  <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-sm text-pink-800">
                    <p className="font-semibold mb-1">컨설팅 문의 현황</p>
                    <p className="text-[11px] text-pink-600">컨설팅은 18단계 등록 프로세스 없이 직접 문의로 접수됩니다.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-pink-600">{job?.consultingRegisteredCount ?? 0}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">총 컨설팅 접수</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xl font-bold text-gray-700">
                        {(() => {
                          const total = (job?.projectTypeBreakdown?.["public"] ?? 0) + (job?.projectTypeBreakdown?.["private"] ?? 0) + (job?.consultingRegisteredCount ?? 0);
                          return total > 0 ? Math.round(((job?.consultingRegisteredCount ?? 0) / total) * 100) + "%" : "—";
                        })()}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">전체 의뢰 중 비중</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {Array.from({ length: 18 }, (_, i) => i + 1).map((step) => {
                    const baseStepFunnel = projTypeFilter === "all"
                      ? (job?.stepFunnelBreakdown ?? {})
                      : (job?.stepFunnelByType?.[projTypeFilter] ?? {});
                    const baseStepDropoff = projTypeFilter === "all"
                      ? (job?.stepDropoffBreakdown ?? {})
                      : (job?.stepDropoffByType?.[projTypeFilter] ?? {});
                    // 방문 회차 필터 적용 (visitFilter > 0이면 visitFunnelBreakdown 사용)
                    const stepFunnel = visitFilter > 0
                      ? (job?.visitFunnelBreakdown?.[visitFilter] ?? {})
                      : baseStepFunnel;
                    const stepDropoff = visitFilter > 0 ? {} : baseStepDropoff;
                    const reached = stepFunnel[step] ?? 0;
                    const dropped = stepDropoff[step] ?? 0;
                    const pct = Math.round((reached / Math.max(...Object.values(stepFunnel), 1)) * 100);
                    const dropPct = reached > 0 ? Math.round((dropped / reached) * 100) : 0;
                    const isHighDropoff = dropPct >= 15;
                    const visitBarColors: Record<number, string> = { 1: "bg-emerald-400", 2: "bg-cyan-400", 3: "bg-amber-400", 4: "bg-rose-400" };
                    const barColor = visitFilter > 0
                      ? (visitBarColors[visitFilter] ?? "bg-indigo-400")
                      : projTypeFilter === "public" ? "bg-blue-400" : projTypeFilter === "private" ? "bg-violet-400" : "bg-indigo-400";
                    return (
                      <div key={step} className="flex items-center gap-2">
                        <div className="w-5 text-[10px] text-gray-400 text-right shrink-0">{step}</div>
                        <div className="w-28 text-xs text-gray-600 truncate shrink-0">{PROJECT_STEP_LABELS[step]}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div className={`${barColor} h-3 rounded-full transition-all duration-500`}
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
                  })}
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-1">
                    <span><span className="text-red-500 font-semibold">빨간색</span> = 이탈률 15% 이상</span>
                    <span><span className="text-amber-500">주황색</span> = 일부 이탈</span>
                  </div>
                </div>
              )}
            </div>

          {/* 포트폴리오 등록 섹션별 퍼널 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div>
                <p className="font-semibold text-purple-700 text-sm">포트폴리오 등록 섹션별 퍼널</p>
                <p className="text-[10px] text-gray-400">파트너가 어느 섹션에서 포트폴리오 작성을 멈추는지 확인합니다</p>
              </div>
              {/* 방문 회차 필터 */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400 shrink-0">방문 회차</span>
                {([0, 1, 2, 3, 4] as const).map((v) => {
                  const label = v === 0 ? "전체" : v === 4 ? "4회차+" : `${v}회차`;
                  const visitData = v === 0 ? null : (job?.pfVisitFunnelBreakdown?.[v] ?? {});
                  const visitTotal = visitData ? Object.values(visitData).reduce((a, b) => a + b, 0) : null;
                  const active = pfVisitFilter === v;
                  const colors: Record<number, string> = {
                    0: active ? "bg-gray-600 text-white border-gray-600" : "border-gray-200 text-gray-500 hover:border-gray-400",
                    1: active ? "bg-emerald-500 text-white border-emerald-500" : "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600",
                    2: active ? "bg-cyan-500 text-white border-cyan-500" : "border-gray-200 text-gray-500 hover:border-cyan-300 hover:text-cyan-600",
                    3: active ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600",
                    4: active ? "bg-rose-500 text-white border-rose-500" : "border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-600",
                  };
                  return (
                    <button key={v} onClick={() => setPfVisitFilter(v)}
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-medium transition-all ${colors[v]}`}>
                      {label}
                      {visitTotal !== null && visitTotal > 0 && <span className="opacity-80 ml-0.5">{visitTotal}</span>}
                    </button>
                  );
                })}
                {pfVisitFilter > 0 && (
                  <span className="text-[10px] text-gray-400 ml-1">
                    {pfVisitFilter === 1 && "처음 방문 — 초반 섹션"}
                    {pfVisitFilter === 2 && "2번째 방문 — 중반 섹션"}
                    {pfVisitFilter === 3 && "3번째 방문 — 마무리 섹션"}
                    {pfVisitFilter === 4 && "4회차 이상"}
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                {(() => {
                  const pfFunnel = pfVisitFilter > 0
                    ? (job?.pfVisitFunnelBreakdown?.[pfVisitFilter] ?? {})
                    : (job?.portfolioFunnelBreakdown ?? {});
                  const pfDropoff = pfVisitFilter > 0 ? {} : (job?.portfolioDropoffBreakdown ?? {});
                  const PORTFOLIO_LABELS: Record<number, string> = {
                    1: "기업 정보", 2: "담당자 정보", 3: "경험·특화 분야",
                    4: "광고 목적별 분야", 5: "제작 기법별 분야", 6: "대표 광고주",
                    7: "대표 수상내역", 8: "대표 포트폴리오", 9: "대표 스태프",
                    10: "최근 참여 프로젝트", 11: "Cotton Candy 활동", 12: "파일 업로드",
                    13: "기업 소개글",
                  };
                  const maxCount = Math.max(...Object.values(pfFunnel), 1);
                  return Array.from({ length: 13 }, (_, i) => i + 1).map((sec) => {
                    const reached = pfFunnel[sec] ?? 0;
                    const dropped = pfDropoff[sec] ?? 0;
                    const barPct = Math.round((reached / maxCount) * 100);
                    const dropPct = reached > 0 ? Math.round((dropped / reached) * 100) : 0;
                    const isHighDropoff = dropPct >= 20;
                    return (
                      <div key={sec} className="flex items-center gap-2">
                        <div className="w-4 text-[10px] text-gray-400 text-right shrink-0">{sec}</div>
                        <div className="w-32 text-xs text-gray-600 truncate shrink-0">{PORTFOLIO_LABELS[sec]}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-purple-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(barPct, reached > 0 ? 2 : 0)}%` }} />
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
              <div className="text-[10px] text-gray-400">
                <span className="text-red-500 font-semibold">빨간색</span> = 이탈률 20% 이상 &nbsp;|&nbsp;
                <span className="text-amber-500">주황색</span> = 일부 이탈
              </div>
            </div>

          </div>{/* /퍼널 2열 grid */}
          </>
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const [openSignal, setOpenSignal] = useState(0);
  const [runSignal, setRunSignal] = useState(0);
  const [simStatus, setSimStatus] = useState<{ progress: number; message: string; status: string } | null>(null);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/admin/simulate/latest");
        const json = await res.json();
        setSimStatus(json?.job ?? null);
      } catch { /* ignore */ }
    }, 3000);
    return () => clearInterval(poll);
  }, []);

  const isRunning = simStatus && ["pending", "generating", "sending"].includes(simStatus.status);

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-4">
        <PageHeader title="활동현황" description="시뮬레이션 데이터와 주요 활동 지표를 확인하세요" hidePeriodFilter />
        {isRunning && simStatus && (
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <span className="text-[11px] text-gray-500 shrink-0 whitespace-nowrap">{simStatus.message}</span>
            <Progress value={simStatus.progress} className="flex-1 h-1.5" />
            <span className="text-[11px] font-semibold text-pink-600 shrink-0">{simStatus.progress}%</span>
          </div>
        )}
        <Button
          className="btn-pink-compact text-xs h-7 py-0 px-3 shrink-0"
          onClick={() => setRunSignal(s => s + 1)}
          disabled={!!isRunning}
        >
          시뮬레이션 실행
        </Button>
      </div>
      <ActivityTab openSignal={openSignal} runSignal={runSignal} />
    </div>
  );
}
