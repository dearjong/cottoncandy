import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useLocation } from "wouter";

interface SimJob {
  status: "pending" | "generating" | "sending" | "done" | "error";
  progress: number;
  message: string;
  totalUsers: number;
  totalEvents: number;
  batchesSent: number;
  totalBatches: number;
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
  userCount: number;
  periodSecs: number;
  pctAdvertiser: number; pctAgency: number; pctProduction: number;
  pctTvcf: number; pctGoogle: number; pctNaver: number; pctKakao: number; pctOrganic: number;
  pctSsoLogin: number; pctManualLogin: number; pctSignup: number;
  pctMale: number; pctFemale: number;
  pct20s: number; pct30s: number; pct40s: number; pct50s: number;
  pctSeoul: number; pctGyeonggi: number; pctLocal: number; pctAbroad: number;
  projectRegCount: number;
  portfolioRegCount: number;
  partnerApplyCount: number;
}

const DEFAULTS: SimConfig = {
  userCount: 200,
  periodSecs: 600,
  pctAdvertiser: 10, pctAgency: 30, pctProduction: 60,
  pctTvcf: 85, pctGoogle: 5, pctNaver: 5, pctKakao: 3, pctOrganic: 2,
  pctSsoLogin: 17, pctManualLogin: 17, pctSignup: 3,
  pctMale: 60, pctFemale: 40,
  pct20s: 10, pct30s: 35, pct40s: 35, pct50s: 20,
  pctSeoul: 35, pctGyeonggi: 20, pctLocal: 40, pctAbroad: 5,
  projectRegCount: 12,
  partnerApplyCount: 30,
  portfolioRegCount: 40,
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

export default function AdminSimulatePage() {
  const [cfg, setCfg] = useState<SimConfig>(DEFAULTS);
  const [dialogCfg, setDialogCfg] = useState<SimConfig>(DEFAULTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [job, setJob] = useState<SimJob | null>(null);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [, navigate] = useLocation();

  function setD<K extends keyof SimConfig>(key: K, val: SimConfig[K]) {
    setDialogCfg((prev) => ({ ...prev, [key]: val }));
  }

  function openDialog() {
    setDialogCfg(cfg);
    setDialogOpen(true);
  }

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }
  useEffect(() => () => stopPolling(), []);

  async function startSim(runCfg: SimConfig) {
    setCfg(runCfg);
    setDialogOpen(false);
    setLoading(true);
    setJob(null);
    try {
      const res = await fetch("/api/admin/simulate/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(runCfg),
      });
      const { jobId: id } = await res.json();
      setLoading(false);
      pollRef.current = setInterval(async () => {
        try {
          const r = await fetch(`/api/admin/simulate/status/${id}`);
          const data: SimJob = await r.json();
          setJob(data);
          if (data.status === "done" || data.status === "error") {
            stopPolling();
          }
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

  const dUtmSum   = dialogCfg.pctTvcf + dialogCfg.pctGoogle + dialogCfg.pctNaver + dialogCfg.pctKakao + dialogCfg.pctOrganic;
  const dUserSum  = dialogCfg.pctAdvertiser + dialogCfg.pctAgency + dialogCfg.pctProduction;
  const dLoginSum = dialogCfg.pctSsoLogin + dialogCfg.pctManualLogin + dialogCfg.pctSignup;
  const dGenderSum= dialogCfg.pctMale + dialogCfg.pctFemale;
  const dAgeSum   = dialogCfg.pct20s + dialogCfg.pct30s + dialogCfg.pct40s + dialogCfg.pct50s;
  const dGeoSum   = dialogCfg.pctSeoul + dialogCfg.pctGyeonggi + dialogCfg.pctLocal + dialogCfg.pctAbroad;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Analytics 시뮬레이션"
        description="가상 사용자를 생성해 GA4 + Mixpanel에 AARRR 이벤트를 전송합니다. 결과는 통계/리포트 → 활동현황에서 확인할 수 있습니다."
        hidePeriodFilter
      />

      {/* 액션 바 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs text-gray-400">
          {job ? (
            <span>
              마지막 실행: <span className="text-gray-600 font-medium">{new Date(job.startedAt).toLocaleString("ko-KR")}</span>
              {" · "}
              <span className="text-gray-600 font-medium">{cfg.userCount.toLocaleString()}명 / {PERIOD_OPTIONS.find(o => o.secs === cfg.periodSecs)?.label ?? ""}</span>
            </span>
          ) : "아직 실행된 시뮬레이션이 없습니다."}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-xs" onClick={() => navigate("/admin/reports?tab=activity")}>
            결과 보기 →
          </Button>
          <Button className="btn-pink" onClick={openDialog} disabled={!!isRunning || loading}>
            {loading ? "시작 중..." : isRunning ? "실행 중..." : "▶ 시뮬레이션 설정"}
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
              { label: "전송 배치",   value: `${job.batchesSent} / ${job.totalBatches}` },
              { label: "오류",        value: job.errors.length + "건" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-gray-800">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {isDone && (
            <div className="bg-green-50 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-sm text-green-700">✅ GA4 + Mixpanel 전송 완료</span>
              <Button size="sm" className="btn-pink text-xs" onClick={() => navigate("/admin/reports?tab=activity")}>
                결과 확인하기 →
              </Button>
            </div>
          )}

          {job.errors.length > 0 && (
            <div className="bg-red-50 rounded-lg p-3 text-xs text-red-700 space-y-1 max-h-28 overflow-y-auto">
              {job.errors.slice(0, 10).map((e, i) => <div key={i}>⚠ {e}</div>)}
              {job.errors.length > 10 && <div className="text-red-400">외 {job.errors.length - 10}건...</div>}
            </div>
          )}
        </div>
      )}

      {/* 시뮬레이션 설정 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>시뮬레이션 설정</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* 기본 설정 */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">기본 설정</p>
              <div className="flex flex-wrap gap-5 items-end">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-400 leading-tight">가상 사용자 수</span>
                  <Select value={String(dialogCfg.userCount)} onValueChange={(v) => setD("userCount", Number(v))}>
                    <SelectTrigger className="w-32 h-8 text-xs border-gray-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n.toLocaleString()}명</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-400 leading-tight">이벤트 기간</span>
                  <Select value={String(dialogCfg.periodSecs)} onValueChange={(v) => setD("periodSecs", Number(v))}>
                    <SelectTrigger className="w-32 h-8 text-xs border-gray-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PERIOD_OPTIONS.map(({ secs, label }) => (
                        <SelectItem key={secs} value={String(secs)}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 인증 현황 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-600">인증 현황</span>
                <span className="text-[10px] text-gray-400">전체 방문자 기준 % — 나머지는 미로그인</span>
                {dLoginSum > 100 && <span className="text-[10px] text-red-500">합계 {dLoginSum}% (100% 초과)</span>}
              </div>
              <div className="flex flex-wrap gap-4 items-end">
                <NumInput label="SSO 로그인"  value={dialogCfg.pctSsoLogin}    onChange={(v) => setD("pctSsoLogin", v)} />
                <NumInput label="수동 로그인"  value={dialogCfg.pctManualLogin} onChange={(v) => setD("pctManualLogin", v)} />
                <NumInput label="신규 가입"    value={dialogCfg.pctSignup}      onChange={(v) => setD("pctSignup", v)} />
                <div className="flex flex-col gap-0.5 pb-1">
                  <span className="text-[10px] text-gray-400">미로그인</span>
                  <span className="text-sm font-semibold text-gray-700">{Math.max(0, 100 - dLoginSum)}%</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 로그인 유저 내 구성 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-600">로그인 유저 내 구성</span>
                {sumWarn([dialogCfg.pctAdvertiser, dialogCfg.pctAgency, dialogCfg.pctProduction], "유저 타입")}
              </div>
              <div className="flex flex-wrap gap-4">
                <NumInput label="광고주" value={dialogCfg.pctAdvertiser} onChange={(v) => setD("pctAdvertiser", v)} />
                <NumInput label="대행사" value={dialogCfg.pctAgency}     onChange={(v) => setD("pctAgency", v)} />
                <NumInput label="제작사" value={dialogCfg.pctProduction} onChange={(v) => setD("pctProduction", v)} />
                <div className="flex items-end pb-1">
                  <span className={`text-xs font-semibold ${dUserSum === 100 ? "text-green-600" : "text-amber-500"}`}>합계 {dUserSum}%</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* UTM 유입 비율 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-600">UTM 유입 비율</span>
                {sumWarn([dialogCfg.pctTvcf, dialogCfg.pctGoogle, dialogCfg.pctNaver, dialogCfg.pctKakao, dialogCfg.pctOrganic], "UTM")}
              </div>
              <div className="flex flex-wrap gap-4">
                <NumInput label="tvcf.co.kr" value={dialogCfg.pctTvcf}    onChange={(v) => setD("pctTvcf", v)} />
                <NumInput label="Google"     value={dialogCfg.pctGoogle}   onChange={(v) => setD("pctGoogle", v)} />
                <NumInput label="Naver"      value={dialogCfg.pctNaver}    onChange={(v) => setD("pctNaver", v)} />
                <NumInput label="Kakao"      value={dialogCfg.pctKakao}    onChange={(v) => setD("pctKakao", v)} />
                <NumInput label="Organic"    value={dialogCfg.pctOrganic}  onChange={(v) => setD("pctOrganic", v)} />
                <div className="flex items-end pb-1">
                  <span className={`text-xs font-semibold ${dUtmSum === 100 ? "text-green-600" : "text-amber-500"}`}>합계 {dUtmSum}%</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 성별 + 연령대 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-600">성별</span>
                  {sumWarn([dialogCfg.pctMale, dialogCfg.pctFemale], "성별")}
                </div>
                <div className="flex flex-wrap gap-4">
                  <NumInput label="남성" value={dialogCfg.pctMale}   onChange={(v) => setD("pctMale", v)} />
                  <NumInput label="여성" value={dialogCfg.pctFemale} onChange={(v) => setD("pctFemale", v)} />
                  <div className="flex items-end pb-1">
                    <span className={`text-xs font-semibold ${dGenderSum === 100 ? "text-green-600" : "text-amber-500"}`}>합계 {dGenderSum}%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-600">연령대</span>
                  {sumWarn([dialogCfg.pct20s, dialogCfg.pct30s, dialogCfg.pct40s, dialogCfg.pct50s], "연령대")}
                </div>
                <div className="flex flex-wrap gap-4">
                  <NumInput label="20대" value={dialogCfg.pct20s} onChange={(v) => setD("pct20s", v)} />
                  <NumInput label="30대" value={dialogCfg.pct30s} onChange={(v) => setD("pct30s", v)} />
                  <NumInput label="40대" value={dialogCfg.pct40s} onChange={(v) => setD("pct40s", v)} />
                  <NumInput label="50대" value={dialogCfg.pct50s} onChange={(v) => setD("pct50s", v)} />
                  <div className="flex items-end pb-1">
                    <span className={`text-xs font-semibold ${dAgeSum === 100 ? "text-green-600" : "text-amber-500"}`}>합계 {dAgeSum}%</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 접속 지역 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-600">접속 지역</span>
                {sumWarn([dialogCfg.pctSeoul, dialogCfg.pctGyeonggi, dialogCfg.pctLocal, dialogCfg.pctAbroad], "지역")}
              </div>
              <div className="flex flex-wrap gap-4">
                <NumInput label="서울"  value={dialogCfg.pctSeoul}    onChange={(v) => setD("pctSeoul", v)} />
                <NumInput label="경기"  value={dialogCfg.pctGyeonggi} onChange={(v) => setD("pctGyeonggi", v)} />
                <NumInput label="지방"  value={dialogCfg.pctLocal}    onChange={(v) => setD("pctLocal", v)} />
                <NumInput label="해외"  value={dialogCfg.pctAbroad}   onChange={(v) => setD("pctAbroad", v)} />
                <div className="flex items-end pb-1">
                  <span className={`text-xs font-semibold ${dGeoSum === 100 ? "text-green-600" : "text-amber-500"}`}>합계 {dGeoSum}%</span>
                </div>
              </div>
            </div>

            {/* 등록유형 인원 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">등록유형</span>
                <span className="text-[10px] text-gray-400">단계는 랜덤</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <NumInput label="프로젝트 등록"  value={dialogCfg.projectRegCount}  onChange={(v) => setD("projectRegCount", v)}  min={0} max={10000} unit="명" />
                <NumInput label="포트폴리오 등록" value={dialogCfg.portfolioRegCount} onChange={(v) => setD("portfolioRegCount", v)} min={0} max={10000} unit="명" />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700">
              ⚠ 실행 시 실제 GA4 + Mixpanel 계정에 가상 이벤트가 추가됩니다.
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => startSim(dialogCfg)}
              disabled={!!isRunning || loading}
            >
              {loading ? "시작 중..." : `▶ ${dialogCfg.userCount.toLocaleString()}명 / ${PERIOD_OPTIONS.find(o => o.secs === dialogCfg.periodSecs)?.label ?? ""} 시작`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
