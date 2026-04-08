import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  { key: "site_visit", label: "유입 (site_visit)", color: "bg-blue-500" },
  { key: "experiment_viewed", label: "A/B 실험 노출", color: "bg-purple-500" },
  { key: "home_cta_clicked", label: "CTA 클릭", color: "bg-pink-500" },
  { key: "signup_complete", label: "가입 완료 (Activation)", color: "bg-orange-500" },
  { key: "activation_achieved", label: "핵심행동 달성", color: "bg-yellow-500" },
  { key: "project_submitted", label: "프로젝트 등록", color: "bg-green-500" },
  { key: "partner_applied", label: "공고 지원", color: "bg-teal-500" },
  { key: "contract_signed", label: "계약 체결 (Revenue)", color: "bg-emerald-600" },
  { key: "review_submitted", label: "리뷰 등록 (완료)", color: "bg-gray-500" },
  { key: "referral_sent", label: "추천 공유 (Referral)", color: "bg-indigo-500" },
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
  const isError = job?.status === "error";

  function elapsedSec(job: SimJob) {
    const end = job.completedAt ?? Date.now();
    return ((end - job.startedAt) / 1000).toFixed(1);
  }

  const siteVisit = job?.funnelBreakdown["site_visit"] ?? 0;

  const ctrlViewed = job?.abBreakdown.control.viewed ?? 0;
  const ctrlClicked = job?.abBreakdown.control.ctaClicked ?? 0;
  const varViewed = job?.abBreakdown.variant_question.viewed ?? 0;
  const varClicked = job?.abBreakdown.variant_question.ctaClicked ?? 0;
  const ctrlCtr = ctrlViewed > 0 ? ((ctrlClicked / ctrlViewed) * 100).toFixed(1) : "-";
  const varCtr = varViewed > 0 ? ((varClicked / varViewed) * 100).toFixed(1) : "-";

  return (
    <div className="page-container">
      <PageHeader
        title="Analytics 시뮬레이션"
        description="가상 사용자를 생성해 Mixpanel에 AARRR 이벤트를 전송합니다."
        hidePeriodFilter
      />

      <div className="page-content space-y-6">
        {/* 설정 카드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">시뮬레이션 설정</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4 flex-wrap">
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

            <div className="text-xs text-gray-400 border rounded px-3 py-2 bg-gray-50">
              <span className="font-medium text-gray-600">이벤트 구성</span>
              &nbsp;· 의뢰사 10% / 파트너 90%
              &nbsp;· UTM: google/naver/kakao/referral/organic
              &nbsp;· A/B: control vs variant_question (50:50)
            </div>

            <Button
              className="btn-pink ml-auto"
              onClick={startSim}
              disabled={!!isRunning || loading}
            >
              {loading ? "시작 중..." : isRunning ? "실행 중..." : "▶ 시뮬레이션 시작"}
            </Button>
          </CardContent>
        </Card>

        {/* 진행 상황 */}
        {job && (
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">진행 상황</CardTitle>
              <div className="flex items-center gap-2">
                {isRunning && <Badge className="bg-blue-100 text-blue-700 animate-pulse">실행 중</Badge>}
                {isDone && <Badge className="bg-green-100 text-green-700">완료</Badge>}
                {isError && <Badge variant="destructive">오류</Badge>}
                {job && <span className="text-xs text-gray-400">{elapsedSec(job)}초 경과</span>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{job.message}</span>
                  <span className="font-medium">{job.progress}%</span>
                </div>
                <Progress value={job.progress} className="h-2" />
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
                <div className="bg-red-50 rounded p-3 text-xs text-red-700 space-y-1 max-h-32 overflow-y-auto">
                  {job.errors.map((e, i) => <div key={i}>⚠ {e}</div>)}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* A/B 테스트 결과 */}
        {job && (isDone || isRunning) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">A/B 테스트 — home_hero_title</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "control", desc: "2줄 타이틀 + 프로모 텍스트", viewed: ctrlViewed, clicked: ctrlClicked, ctr: ctrlCtr, color: "border-gray-300" },
                  { label: "variant_question", desc: "1줄 타이틀 + 서브 텍스트", viewed: varViewed, clicked: varClicked, ctr: varCtr, color: "border-pink-300" },
                ].map((v) => (
                  <div key={v.label} className={`border-2 ${v.color} rounded-lg p-4 space-y-3`}>
                    <div>
                      <div className="font-semibold text-sm">{v.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{v.desc}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">노출</span>
                        <span className="font-medium">{v.viewed.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">CTA 클릭</span>
                        <span className="font-medium">{v.clicked.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t pt-2">
                        <span className="text-gray-600 font-medium">CTR</span>
                        <span className={`font-bold text-base ${v.label === "variant_question" ? "text-pink-600" : "text-gray-700"}`}>
                          {v.ctr}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {isDone && (
                <p className="text-xs text-gray-400 mt-3">
                  * variant_question(22%)이 control(15%)보다 높은 CTR로 설계됨.
                  Mixpanel 대시보드 → 실험 보고서에서 실제 수치 확인 가능.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* AARRR 퍼널 */}
        {job && job.totalEvents > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">AARRR 퍼널 — 이벤트 발생 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {FUNNEL_ORDER.map(({ key, label, color }) => {
                  const count = job.funnelBreakdown[key] ?? 0;
                  const pct = siteVisit > 0 ? Math.round((count / siteVisit) * 100) : 0;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-44 text-xs text-gray-600 truncate shrink-0">{label}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className={`${color} h-4 rounded-full transition-all duration-500`} style={{ width: `${Math.max(pct, count > 0 ? 1 : 0)}%` }} />
                      </div>
                      <div className="w-16 text-right text-sm font-medium text-gray-700">{count.toLocaleString()}</div>
                      <div className="w-10 text-right text-xs text-gray-400">{pct}%</div>
                    </div>
                  );
                })}
              </div>
              {isDone && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                  ✅ Mixpanel에 전송 완료. Mixpanel 대시보드 → Insights / Funnels / A/B Tests 에서 확인하세요.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 설명 */}
        {!job && (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="pt-6 text-sm text-gray-500 space-y-2">
              <p className="font-medium text-gray-700">시뮬레이션 동작 방식</p>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>가상 사용자별로 AARRR 퍼널을 따라 이벤트 자동 생성</li>
                <li>Acquisition(유입) → Activation(가입+첫행동) → Retention(재방문) → Revenue(계약) → Referral(추천)</li>
                <li>A/B 실험: control 50% / variant_question 50% — CTR이 각각 15% / 22%로 다르게 설계</li>
                <li>Mixpanel HTTP API로 배치 전송 (50개씩)</li>
                <li>전송 완료 후 Mixpanel 대시보드에서 퍼널·코호트·A/B 분석 가능</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
