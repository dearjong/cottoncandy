import { useState, useEffect, useRef } from "react";
import { useSearch } from "wouter";
import { StatisticsDashboard } from "@/components/admin/statistics-dashboard";
import { PageHeader } from "@/components/admin/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
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
  userTypeBreakdown: Record<string, number>;
  geoBreakdown: Record<string, number>;
  stepFunnelBreakdown: Record<number, number>;
  stepDropoffBreakdown: Record<number, number>;
  draftSavedCount: number;
  draftResumedCount: number;
  projectTypeBreakdown: Record<string, number>;
  consultingRegisteredCount: number;
  firstVisitCount: number;
  returnVisitCount: number;
  genderBreakdown: Record<string, number>;
  directEntryBreakdown: Record<string, number>;
  portfolioFunnelBreakdown: Record<number, number>;
  portfolioDropoffBreakdown: Record<number, number>;
  errors: string[];
  startedAt: number;
  completedAt?: number;
}

interface SimConfig {
  userCount: number; periodDays: number;
  pctAdvertiser: number; pctAgency: number; pctProduction: number;
  pctTvcf: number; pctGoogle: number; pctNaver: number; pctKakao: number; pctOrganic: number;
  pctSsoLogin: number; pctManualLogin: number; pctSignup: number;
  pctMale: number; pctFemale: number;
  pct20s: number; pct30s: number; pct40s: number; pct50s: number;
  pctSeoul: number; pctGyeonggi: number; pctLocal: number; pctAbroad: number;
  projectRegCount: number;
  portfolioRegCount: number;
}

const DEFAULTS: SimConfig = {
  userCount: 1000, periodDays: 3,
  pctAdvertiser: 5,  pctAgency: 30,       pctProduction: 65,
  pctTvcf: 85,       pctGoogle: 5,         pctNaver: 5,        pctKakao: 3,   pctOrganic: 2,
  pctSsoLogin: 17,   pctManualLogin: 17,   pctSignup: 3,
  pctMale: 45,       pctFemale: 55,
  pct20s: 10,        pct30s: 35,           pct40s: 35,          pct50s: 20,
  pctSeoul: 35, pctGyeonggi: 20, pctLocal: 40, pctAbroad: 5,
  projectRegCount: 30,
  portfolioRegCount: 50,
};

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

const SIM_CFG_KEY = "admarket_sim_cfg";

function loadSavedCfg(): SimConfig {
  try {
    const s = localStorage.getItem(SIM_CFG_KEY);
    return s ? { ...DEFAULTS, ...JSON.parse(s) } : DEFAULTS;
  } catch { return DEFAULTS; }
}

function ActivityTab({ autoOpen, openSignal }: { autoOpen?: boolean; openSignal?: number }) {
  const [data, setData] = useState<{ jobId: string; job: SimJob } | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cfg, setCfg] = useState<SimConfig>(loadSavedCfg);
  const [dialogCfg, setDialogCfg] = useState<SimConfig>(loadSavedCfg);
  const [loading, setLoading] = useState(false);

  function setD<K extends keyof SimConfig>(key: K, val: SimConfig[K]) {
    setDialogCfg((prev) => ({ ...prev, [key]: val }));
  }

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }

  useEffect(() => {
    if (autoOpen) {
      setDialogCfg(cfg);
      setDialogOpen(true);
    }
  }, [autoOpen]);

  useEffect(() => {
    if (openSignal && openSignal > 0) {
      setDialogCfg(cfg);
      setDialogOpen(true);
    }
  }, [openSignal]);

  async function startSim(runCfg: SimConfig) {
    setCfg(runCfg);
    try { localStorage.setItem(SIM_CFG_KEY, JSON.stringify(runCfg)); } catch {}
    setDialogOpen(false);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/simulate/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(runCfg),
      });
      await res.json();
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  async function fetchLatest() {
    try {
      const res = await fetch("/api/admin/simulate/latest");
      const json = await res.json();
      setData(json);
    } catch { /* ignore */ }
  }

  useEffect(() => {
    fetchLatest();
    pollRef.current = setInterval(fetchLatest, 3000);
    return () => stopPolling();
  }, []);

  const job = data?.job ?? null;
  const isRunning = job && (job.status === "pending" || job.status === "generating" || job.status === "sending");
  const isDone = job?.status === "done";

  const totalUsers = job?.totalUsers ?? 0;
  const siteVisit = job?.funnelBreakdown?.["site_visit"] ?? 0;
  const utmBreakdown = job?.utmBreakdown ?? {};
  const userTypeBreakdown = job?.userTypeBreakdown ?? {};
  const geoBreakdown = job?.geoBreakdown ?? {};

  const dUtmSum    = dialogCfg.pctTvcf + dialogCfg.pctGoogle + dialogCfg.pctNaver + dialogCfg.pctKakao + dialogCfg.pctOrganic;
  const dUserSum   = dialogCfg.pctAdvertiser + dialogCfg.pctAgency + dialogCfg.pctProduction;
  const dLoginSum  = dialogCfg.pctSsoLogin + dialogCfg.pctManualLogin + dialogCfg.pctSignup;
  const dGenderSum = dialogCfg.pctMale + dialogCfg.pctFemale;
  const dAgeSum    = dialogCfg.pct20s + dialogCfg.pct30s + dialogCfg.pct40s + dialogCfg.pct50s;
  const dGeoSum    = dialogCfg.pctSeoul + dialogCfg.pctGyeonggi + dialogCfg.pctLocal + dialogCfg.pctAbroad;

  return (
    <div className="space-y-6">
      {isRunning && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{job.message}</span>
            <span>{job.progress}%</span>
          </div>
          <Progress value={job.progress} className="h-1.5" />
        </div>
      )}

      {/* 항상 표시되는 차트들 */}
      {(
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* UTM 유입 채널 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                <p className="font-medium text-gray-800">UTM 유입 채널</p>
                <div className="space-y-2">
                  {[
                    { key: "tvcf",    label: "tvcf.co.kr", color: "bg-pink-500"   },
                    { key: "google",  label: "Google",     color: "bg-blue-400"   },
                    { key: "naver",   label: "Naver",      color: "bg-green-500"  },
                    { key: "kakao",   label: "Kakao",      color: "bg-yellow-400" },
                    { key: "organic", label: "Organic",    color: "bg-gray-400"   },
                  ].map(({ key, label, color }) => {
                    const count = utmBreakdown[key] ?? 0;
                    const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div className="w-20 text-xs text-gray-600 shrink-0">{label}</div>
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

              {/* 접속 지역 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                <p className="font-medium text-gray-800">접속 지역</p>
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
                  <p className="font-medium text-gray-800">인증 현황</p>
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
                <p className="font-medium text-gray-800">AARRR 퍼널</p>
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
                  <p className="font-medium text-gray-800">방문 유형</p>
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
                <p className="font-medium text-gray-800">성별</p>
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
                <p className="font-medium text-gray-800">직접 유입 / 북마크 랜딩 페이지</p>
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

          {/* 퍼널 2개 나란히 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 프로젝트 등록 단계별 퍼널 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-medium text-gray-800">프로젝트 등록 단계별 퍼널</p>
                  <p className="text-[10px] text-gray-400">광고주가 어느 단계에서 이탈하는지 확인합니다</p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                    공고 <strong>{job?.projectTypeBreakdown?.["공고"] ?? 0}건</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                    1:1 비공개 <strong>{job?.projectTypeBreakdown?.["1:1"] ?? 0}건</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
                    컨설팅 <strong>{job?.consultingRegisteredCount ?? 0}건</strong>
                  </span>
                  <span className="text-gray-200">|</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
                    임시저장 <strong>{job?.draftSavedCount ?? 0}건</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    재개 <strong>{job?.draftResumedCount ?? 0}건</strong>
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                {Array.from({ length: 18 }, (_, i) => i + 1).map((step) => {
                  const stepFunnel = job?.stepFunnelBreakdown ?? {};
                  const reached = stepFunnel[step] ?? 0;
                  const dropped = (job?.stepDropoffBreakdown ?? {})[step] ?? 0;
                  const pct = Math.round((reached / Math.max(...Object.values(stepFunnel), 1)) * 100);
                  const dropPct = reached > 0 ? Math.round((dropped / reached) * 100) : 0;
                  const isHighDropoff = dropPct >= 15;
                  return (
                    <div key={step} className="flex items-center gap-2">
                      <div className="w-5 text-[10px] text-gray-400 text-right shrink-0">{step}</div>
                      <div className="w-28 text-xs text-gray-600 truncate shrink-0">{PROJECT_STEP_LABELS[step]}</div>
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
                })}
              </div>
              <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-1">
                <span><span className="text-red-500 font-semibold">빨간색</span> = 이탈률 15% 이상</span>
                <span><span className="text-amber-500">주황색</span> = 일부 이탈</span>
              </div>
            </div>

          {/* 포트폴리오 등록 섹션별 퍼널 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div>
                <p className="font-medium text-gray-800">포트폴리오 등록 섹션별 퍼널</p>
                <p className="text-[10px] text-gray-400">파트너가 어느 섹션에서 포트폴리오 작성을 멈추는지 확인합니다</p>
              </div>
              <div className="space-y-1.5">
                {(() => {
                  const pfFunnel = job?.portfolioFunnelBreakdown ?? {};
                  const pfDropoff = job?.portfolioDropoffBreakdown ?? {};
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
      )}

      {/* 시뮬레이션 설정 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="pb-2">
            <DialogTitle>시뮬레이션 설정</DialogTitle>
          </DialogHeader>

          {/* 기본 설정 행 */}
          <div className="flex items-center gap-6 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">가상 사용자</span>
              <Select value={String(dialogCfg.userCount)} onValueChange={(v) => setD("userCount", Number(v))}>
                <SelectTrigger className="w-28 h-8 text-xs border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[100, 300, 500, 1000, 2000, 3000, 5000, 10000].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n.toLocaleString()}명</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">이벤트 분산 기간</span>
              <Select value={String(dialogCfg.periodDays)} onValueChange={(v) => setD("periodDays", Number(v))}>
                <SelectTrigger className="w-28 h-8 text-xs border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 7, 14, 30, 60, 90].map((d) => (
                    <SelectItem key={d} value={String(d)}>{d}일간 분산</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 설정 테이블 */}
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-1.5 pr-4 text-[10px] font-medium text-gray-400 w-28">구분</th>
                <th className="text-left py-1.5 text-[10px] font-medium text-gray-400">항목별 비율 (%)</th>
                <th className="text-right py-1.5 pl-4 text-[10px] font-medium text-gray-400 w-20">합계</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="py-2.5 pr-4 font-medium text-gray-600 align-middle text-[11px]">
                  인증 현황
                  <div className="text-[9px] font-normal text-gray-400 mt-0.5">전체 방문자 기준</div>
                </td>
                <td className="py-2.5">
                  <div className="flex flex-wrap gap-3 items-end">
                    <NumInput label="SSO 로그인"  value={dialogCfg.pctSsoLogin}    onChange={(v) => setD("pctSsoLogin", v)} />
                    <NumInput label="수동 로그인"  value={dialogCfg.pctManualLogin} onChange={(v) => setD("pctManualLogin", v)} />
                    <NumInput label="신규 가입"    value={dialogCfg.pctSignup}      onChange={(v) => setD("pctSignup", v)} />
                    <div className="flex flex-col gap-0.5 pb-1">
                      <span className="text-[10px] text-gray-400">미로그인</span>
                      <span className="text-sm font-semibold text-gray-700">{Math.max(0, 100 - dLoginSum)}%</span>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 pl-4 text-right align-middle">
                  <span className={`font-semibold ${dLoginSum > 100 ? "text-red-500" : "text-gray-400"}`}>{dLoginSum}%</span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-gray-600 align-middle text-[11px]">
                  유저 타입
                  <div className="text-[9px] font-normal text-gray-400 mt-0.5">로그인 유저 내</div>
                </td>
                <td className="py-2.5">
                  <div className="flex flex-wrap gap-3 items-end">
                    <NumInput label="광고주" value={dialogCfg.pctAdvertiser} onChange={(v) => setD("pctAdvertiser", v)} />
                    <NumInput label="대행사" value={dialogCfg.pctAgency}     onChange={(v) => setD("pctAgency", v)} />
                    <NumInput label="제작사" value={dialogCfg.pctProduction} onChange={(v) => setD("pctProduction", v)} />
                  </div>
                </td>
                <td className="py-2.5 pl-4 text-right align-middle">
                  <span className={`font-semibold ${dUserSum === 100 ? "text-green-600" : "text-amber-500"}`}>{dUserSum}%</span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-gray-600 align-middle text-[11px]">UTM 유입</td>
                <td className="py-2.5">
                  <div className="flex flex-wrap gap-3 items-end">
                    <NumInput label="tvcf.co.kr" value={dialogCfg.pctTvcf}    onChange={(v) => setD("pctTvcf", v)} />
                    <NumInput label="Google"     value={dialogCfg.pctGoogle}   onChange={(v) => setD("pctGoogle", v)} />
                    <NumInput label="Naver"      value={dialogCfg.pctNaver}    onChange={(v) => setD("pctNaver", v)} />
                    <NumInput label="Kakao"      value={dialogCfg.pctKakao}    onChange={(v) => setD("pctKakao", v)} />
                    <NumInput label="Organic"    value={dialogCfg.pctOrganic}  onChange={(v) => setD("pctOrganic", v)} />
                  </div>
                </td>
                <td className="py-2.5 pl-4 text-right align-middle">
                  <span className={`font-semibold ${dUtmSum === 100 ? "text-green-600" : "text-amber-500"}`}>{dUtmSum}%</span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-gray-600 align-middle text-[11px]">성별</td>
                <td className="py-2.5">
                  <div className="flex flex-wrap gap-3 items-end">
                    <NumInput label="여성" value={dialogCfg.pctFemale} onChange={(v) => setD("pctFemale", v)} />
                    <NumInput label="남성" value={dialogCfg.pctMale}   onChange={(v) => setD("pctMale", v)} />
                  </div>
                </td>
                <td className="py-2.5 pl-4 text-right align-middle">
                  <span className={`font-semibold ${dGenderSum === 100 ? "text-green-600" : "text-amber-500"}`}>{dGenderSum}%</span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-gray-600 align-middle text-[11px]">연령대</td>
                <td className="py-2.5">
                  <div className="flex flex-wrap gap-3 items-end">
                    <NumInput label="20대" value={dialogCfg.pct20s} onChange={(v) => setD("pct20s", v)} />
                    <NumInput label="30대" value={dialogCfg.pct30s} onChange={(v) => setD("pct30s", v)} />
                    <NumInput label="40대" value={dialogCfg.pct40s} onChange={(v) => setD("pct40s", v)} />
                    <NumInput label="50대" value={dialogCfg.pct50s} onChange={(v) => setD("pct50s", v)} />
                  </div>
                </td>
                <td className="py-2.5 pl-4 text-right align-middle">
                  <span className={`font-semibold ${dAgeSum === 100 ? "text-green-600" : "text-amber-500"}`}>{dAgeSum}%</span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-gray-600 align-middle text-[11px]">접속 지역</td>
                <td className="py-2.5">
                  <div className="flex flex-wrap gap-3 items-end">
                    <NumInput label="서울"  value={dialogCfg.pctSeoul}    onChange={(v) => setD("pctSeoul", v)} />
                    <NumInput label="경기"  value={dialogCfg.pctGyeonggi} onChange={(v) => setD("pctGyeonggi", v)} />
                    <NumInput label="지방"  value={dialogCfg.pctLocal}    onChange={(v) => setD("pctLocal", v)} />
                    <NumInput label="해외"  value={dialogCfg.pctAbroad}   onChange={(v) => setD("pctAbroad", v)} />
                  </div>
                </td>
                <td className="py-2.5 pl-4 text-right align-middle">
                  <span className={`font-semibold ${dGeoSum === 100 ? "text-green-600" : "text-amber-500"}`}>{dGeoSum}%</span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-gray-600 align-middle text-[11px]">퍼널 인원</td>
                <td className="py-2.5">
                  <div className="flex flex-wrap gap-3 items-end">
                    <NumInput label="프로젝트 등록" value={dialogCfg.projectRegCount}  onChange={(v) => setD("projectRegCount", v)}  min={0} max={10000} unit="명" />
                    <NumInput label="포트폴리오 등록" value={dialogCfg.portfolioRegCount} onChange={(v) => setD("portfolioRegCount", v)} min={0} max={10000} unit="명" />
                  </div>
                </td>
                <td className="py-2.5 pl-4 text-right align-middle">
                  <span className="text-[10px] text-gray-400">단계 랜덤</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700">
            ⚠ 실행 시 실제 GA4 + Mixpanel 계정에 가상 이벤트가 추가됩니다.
          </div>

          <DialogFooter className="gap-2 pt-1">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => startSim(dialogCfg)}
              disabled={!!isRunning || loading}
            >
              {loading ? "시작 중..." : `▶ ${dialogCfg.userCount.toLocaleString()}명 / ${dialogCfg.periodDays}일간 분산 시작`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ReportsPage() {
  const search = useSearch();
  const autoOpenSim = new URLSearchParams(search).get("simulate") === "1";
  const [simSignal, setSimSignal] = useState(0);
  const [activeTab, setActiveTab] = useState("activity");

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="통계/리포트" description="플랫폼 성과 데이터와 상세 리포트를 확인하세요" hidePeriodFilter />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center gap-2">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="activity">활동현황</TabsTrigger>
            <TabsTrigger value="platform">플랫폼 현황</TabsTrigger>
          </TabsList>
          {activeTab === "activity" && (
            <Button
              className="btn-pink-compact text-xs h-7 py-0 px-3"
              onClick={() => setSimSignal(s => s + 1)}
            >
              시뮬레이션
            </Button>
          )}
        </div>

        <TabsContent value="activity" className="mt-6">
          <ActivityTab autoOpen={autoOpenSim} openSignal={simSignal} />
        </TabsContent>

        <TabsContent value="platform" className="mt-6">
          <StatisticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
