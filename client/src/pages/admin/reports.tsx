import { useState, useEffect, useRef } from "react";
import { StatisticsDashboard } from "@/components/admin/statistics-dashboard";
import { PageHeader } from "@/components/admin/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

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
  directEntryBreakdown: Record<string, number>;
  portfolioFunnelBreakdown: Record<number, number>;
  portfolioDropoffBreakdown: Record<number, number>;
  errors: string[];
  startedAt: number;
  completedAt?: number;
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

function ActivityTab() {
  const [data, setData] = useState<{ jobId: string; job: SimJob } | null>(null);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [, navigate] = useLocation();

  async function fetchLatest() {
    try {
      const res = await fetch("/api/admin/simulate/latest");
      const json = await res.json();
      setData(json);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLatest();
    pollRef.current = setInterval(fetchLatest, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const job = data?.job ?? null;
  const isRunning = job && (job.status === "pending" || job.status === "generating" || job.status === "sending");
  const isDone = job?.status === "done";

  const siteVisit = job?.funnelBreakdown["site_visit"] ?? 0;
  const utmBreakdown = job?.utmBreakdown ?? {};
  const userTypeBreakdown = job?.userTypeBreakdown ?? {};
  const geoBreakdown = job?.geoBreakdown ?? {};

  if (loading) {
    return <div className="py-20 text-center text-gray-400 text-sm">불러오는 중...</div>;
  }

  if (!job) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-gray-400 text-sm">아직 실행된 시뮬레이션이 없습니다.</p>
        <Button className="btn-pink" onClick={() => navigate("/admin/simulate")}>
          ▶ 시뮬레이션 실행하기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 요약 헤더 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">마지막 시뮬레이션</span>
              {isRunning && <Badge className="bg-blue-100 text-blue-700 animate-pulse border-0 text-[10px]">실행 중</Badge>}
              {isDone   && <Badge className="bg-green-100 text-green-700 border-0 text-[10px]">완료</Badge>}
              {job.status === "error" && <Badge variant="destructive" className="text-[10px]">오류</Badge>}
            </div>
            <p className="text-xs text-gray-400">
              {new Date(job.startedAt).toLocaleString("ko-KR")} &nbsp;·&nbsp;
              <span className="text-gray-600 font-medium">{job.totalUsers.toLocaleString()}명</span> &nbsp;·&nbsp;
              <span className="text-gray-600 font-medium">{job.totalEvents.toLocaleString()}개 이벤트</span>
            </p>
          </div>
          <Button variant="outline" className="text-xs" onClick={() => navigate("/admin/simulate")}>
            시뮬레이션 설정
          </Button>
        </div>

        {isRunning && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{job.message}</span>
              <span>{job.progress}%</span>
            </div>
            <Progress value={job.progress} className="h-1.5" />
          </div>
        )}
      </div>

      {/* 결과 카드 (이벤트 있을 때만) */}
      {job.totalEvents > 0 && (
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
                    const pct = job.totalUsers > 0 ? Math.round((count / job.totalUsers) * 100) : 0;
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
                      { key: "milogin",    label: "미로그인", color: "bg-gray-300",   count: job.totalUsers - authSum },
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
                  ✅ GA4 + Mixpanel 전송 완료
                </div>
              )}
            </div>
          </div>

          {/* 직접 유입 / 북마크 랜딩 페이지 */}
          {Object.keys(job.directEntryBreakdown ?? {}).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div>
                <p className="font-medium text-gray-800">직접 유입 / 북마크 랜딩 페이지</p>
                <p className="text-[10px] text-gray-400">북마크하거나 URL을 직접 입력해 들어온 페이지 분포</p>
              </div>
              <div className="space-y-2">
                {(() => {
                  const entries = Object.entries(job.directEntryBreakdown ?? {}).sort(([, a], [, b]) => b - a);
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
                        <div className="w-28 text-xs text-gray-600 truncate shrink-0">{PAGE_LABELS[path] ?? path}</div>
                        <div className="text-[10px] text-gray-400 w-36 truncate shrink-0">{path}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div className={`${PAGE_COLORS[path] ?? "bg-gray-400"} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${Math.max(barPct, 2)}%` }} />
                        </div>
                        <div className="w-12 text-right text-xs font-medium text-gray-700">{count.toLocaleString()}</div>
                        <div className="w-8 text-right text-xs text-gray-400">{sharePct}%</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* 프로젝트 등록 단계별 퍼널 */}
          {Object.keys(job.stepFunnelBreakdown ?? {}).length > 0 && (
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
                {Array.from({ length: 18 }, (_, i) => i + 1).map((step) => {
                  const reached = job.stepFunnelBreakdown[step] ?? 0;
                  const dropped = job.stepDropoffBreakdown[step] ?? 0;
                  const pct = Math.round((reached / Math.max(...Object.values(job.stepFunnelBreakdown), 1)) * 100);
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
          )}

          {/* 포트폴리오 등록 섹션별 퍼널 */}
          {Object.keys(job.portfolioFunnelBreakdown ?? {}).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div>
                <p className="font-medium text-gray-800">포트폴리오 등록 섹션별 퍼널</p>
                <p className="text-[10px] text-gray-400">파트너가 어느 섹션에서 포트폴리오 작성을 멈추는지 확인합니다</p>
              </div>
              <div className="space-y-1.5">
                {(() => {
                  const pfFunnel = job.portfolioFunnelBreakdown ?? {};
                  const pfDropoff = job.portfolioDropoffBreakdown ?? {};
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
          )}
        </>
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="통계/리포트" description="플랫폼 성과 데이터와 상세 리포트를 확인하세요" hidePeriodFilter />

      <Tabs defaultValue="platform">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="platform">플랫폼 현황</TabsTrigger>
          <TabsTrigger value="activity">활동현황</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="mt-6">
          <StatisticsDashboard />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
