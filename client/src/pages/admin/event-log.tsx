import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Search, Trash2 } from "lucide-react";
import { getLocalEventLog, clearLocalEventLog, type LocalEventRow } from "@/lib/analytics";


// 이벤트명 + properties → 한국어 설명
function describeEvent(name: string, props: Record<string, unknown>): { label: string; detail: string; badge: string } {
  const p = props as Record<string, string | number | undefined>;

  switch (name) {
    // ── 홈 화면
    case "home_cta_clicked":
      return { label: "홈 CTA 클릭", detail: `variant: ${p.variant ?? "-"}`, badge: "홈" };
    case "home_category_click":
      return { label: "홈 카테고리 클릭", detail: `${p.category ?? ""}`, badge: "홈" };
    case "home_project_card_click":
      return { label: "홈 프로젝트 카드 클릭", detail: `${p.title ?? ""} (${p.type ?? ""})`, badge: "홈" };
    case "home_feature_card_click":
      return { label: "홈 특장점 카드 클릭", detail: `${p.title ?? ""}`, badge: "홈" };
    case "home_partner_click":
      return { label: "홈 파트너 클릭", detail: `${p.partner ?? ""}`, badge: "홈" };
    case "home_flow_step_click":
      return { label: "홈 이용흐름 클릭", detail: `${p.step ?? ""}`, badge: "홈" };
    case "home_faq_click": {
      const num = typeof p.index === "number" ? p.index + 1 : p.index;
      return { label: `홈 FAQ ${num}번 클릭`, detail: `${p.question ?? ""}`, badge: "홈" };
    }
    case "home_faq_more_click":
      return { label: "홈 FAQ 전체보기 클릭", detail: "", badge: "홈" };

    // ── 채팅 / 맨위로
    case "chat_opened":
      return { label: "AI 채팅 열기", detail: `페이지: ${p.page ?? ""}`, badge: "채팅" };
    case "chat_closed": {
      const dur = p.duration_sec ?? 0;
      const cnt = p.messages_sent ?? 0;
      return { label: "AI 채팅 닫기", detail: `${dur}초 이용 · 메시지 ${cnt}건 전송`, badge: "채팅" };
    }
    case "chat_message_sent":
      return { label: "AI 채팅 메시지 전송", detail: `${p.message_index}번째 · ${p.message_length}자`, badge: "채팅" };
    case "scroll_to_top":
      return { label: "맨 위로 클릭", detail: `페이지: ${p.page ?? ""}`, badge: "UX" };

    // ── GNB / 헤더
    case "gnb_menu_click":
      return { label: "GNB 메뉴 클릭", detail: `${p.menu_label ?? p.menu_key ?? ""}`, badge: "헤더" };
    case "header_interaction":
      return { label: "헤더 인터랙션", detail: `${p.target ?? ""}${p.item ? ` > ${p.item}` : ""}`, badge: "헤더" };

    // ── A/B 실험
    case "experiment_viewed":
      return {
        label: "A/B 실험 노출",
        detail: `${p.experiment_id ?? ""} · ${p.variant ?? ""}`,
        badge: "실험",
      };

    // ── 페이지 체류 / 스크롤
    case "time_on_page": {
      const dur = p.duration_sec ?? 0;
      const scroll = p.max_scroll_pct ?? 0;
      return { label: "페이지 체류", detail: `${p.path ?? ""} · ${dur}초 · 최대 스크롤 ${scroll}%`, badge: "UX" };
    }
    case "page_exit": {
      const dur = p.time_on_page_sec ?? 0;
      const scroll = p.max_scroll_pct ?? 0;
      return { label: "페이지 이탈", detail: `${p.path ?? ""} · ${dur}초 · 최대 스크롤 ${scroll}%`, badge: "UX" };
    }
    case "scroll_depth":
      return { label: `스크롤 ${p.depth_pct}% 도달`, detail: `${p.path ?? ""}`, badge: "UX" };

    // ── 퍼널 이벤트
    case "site_visit":
      return { label: "사이트 방문", detail: `${p.landing_path ?? ""}`, badge: "유입" };
    case "signup_complete":
      return { label: "가입 완료", detail: `${p.user_type ?? ""}`, badge: "전환" };
    case "activation_achieved":
      return { label: "핵심행동 달성", detail: `${p.action ?? ""}`, badge: "전환" };
    case "project_submitted":
      return { label: "프로젝트 등록", detail: "", badge: "전환" };
    case "partner_applied":
      return { label: "공고 지원", detail: "", badge: "전환" };
    case "contract_signed":
      return { label: "계약 체결", detail: "", badge: "수익" };
    case "review_submitted":
      return { label: "리뷰 등록", detail: "", badge: "리텐션" };
    case "referral_sent":
      return { label: "추천 공유", detail: "", badge: "추천" };

    default:
      return { label: name, detail: JSON.stringify(props).slice(0, 80), badge: "기타" };
  }
}

const BADGE_COLORS: Record<string, string> = {
  "홈": "bg-pink-100 text-pink-700",
  "헤더": "bg-blue-100 text-blue-700",
  "채팅": "bg-emerald-100 text-emerald-700",
  "UX": "bg-amber-100 text-amber-700",
  "실험": "bg-purple-100 text-purple-700",
  "유입": "bg-gray-100 text-gray-700",
  "전환": "bg-orange-100 text-orange-700",
  "수익": "bg-green-100 text-green-700",
  "리텐션": "bg-teal-100 text-teal-700",
  "추천": "bg-indigo-100 text-indigo-700",
  "기타": "bg-gray-100 text-gray-500",
};

const FILTER_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "홈", label: "홈 클릭" },
  { value: "헤더", label: "GNB / 헤더" },
  { value: "채팅", label: "AI 채팅" },
  { value: "UX", label: "스크롤 / 체류 / 맨위로" },
  { value: "실험", label: "A/B 실험" },
  { value: "유입", label: "유입" },
  { value: "전환", label: "전환" },
];

const USER_TYPE_OPTIONS = [
  { value: "all", label: "전체 유저" },
  { value: "advertiser", label: "광고주" },
  { value: "partner", label: "파트너사" },
  { value: "admin", label: "관리자" },
  { value: "none", label: "비회원" },
];

const USER_TYPE_LABEL: Record<string, { label: string; cls: string }> = {
  advertiser: { label: "광고주", cls: "bg-blue-100 text-blue-700" },
  partner:    { label: "파트너사", cls: "bg-emerald-100 text-emerald-700" },
  admin:      { label: "관리자", cls: "bg-gray-100 text-gray-600" },
};

function fmt(dateStr?: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${min}:${ss}`;
}

const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function EventLogPage() {
  const [filter, setFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [data, setData] = useState<LocalEventRow[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const loadData = useCallback(() => {
    setData(getLocalEventLog());
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(loadData, 5000);
    return () => clearInterval(id);
  }, [autoRefresh, loadData]);

  // 필터 바뀌면 1페이지로
  useEffect(() => { setPage(1); }, [filter, userTypeFilter, search, dateFrom, dateTo]);

  const handleRefresh = useCallback(() => { loadData(); }, [loadData]);

  const handleClear = useCallback(() => {
    if (confirm("이벤트 로그를 전부 삭제할까요?")) {
      clearLocalEventLog();
      setData([]);
    }
  }, []);

  // 필터 + 검색 + 날짜 범위
  const filtered = data
    .slice()
    .reverse()
    .map((ev) => {
      const ut = (ev.properties?.user_type as string | undefined) ?? "";
      return { ...ev, parsed: describeEvent(ev.eventName, ev.properties), userType: ut };
    })
    .filter((ev) => {
      if (filter !== "all" && ev.parsed.badge !== filter) return false;
      if (userTypeFilter !== "all") {
        if (userTypeFilter === "none" && ev.userType) return false;
        if (userTypeFilter !== "none" && ev.userType !== userTypeFilter) return false;
      }
      if (dateFrom) {
        const from = new Date(dateFrom + "T00:00:00");
        if (new Date(ev.createdAt) < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo + "T23:59:59");
        if (new Date(ev.createdAt) > to) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          ev.parsed.label.toLowerCase().includes(q) ||
          ev.parsed.detail.toLowerCase().includes(q) ||
          ev.eventName.toLowerCase().includes(q) ||
          (ev.userId ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="클릭 이벤트 로그"
        description="홈 카테고리·카드·FAQ·GNB 등 사용자 클릭을 실시간으로 확인합니다"
        hidePeriodFilter
      />

      {/* 컨트롤 바 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        {/* 1행: 카테고리 + 유저타입 + 검색 + 버튼들 */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {USER_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="이벤트·카테고리명·FAQ 내용 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            새로고침
          </Button>

          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            className={autoRefresh ? "bg-pink-600 hover:bg-pink-700" : ""}
            onClick={() => setAutoRefresh((v) => !v)}
          >
            {autoRefresh ? "자동갱신 ON" : "자동갱신 OFF"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-red-500 hover:text-red-600 hover:border-red-300"
            onClick={handleClear}
          >
            <Trash2 className="h-4 w-4" />
            로그 초기화
          </Button>
        </div>

        {/* 2행: 날짜 범위 + 건수/페이지 */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500">기간</span>
          <Input
            type="date"
            className="w-40 text-sm"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <span className="text-gray-400">~</span>
          <Input
            type="date"
            className="w-40 text-sm"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          {(dateFrom || dateTo) && (
            <button
              className="text-xs text-gray-400 hover:text-gray-600 underline"
              onClick={() => { setDateFrom(""); setDateTo(""); }}
            >
              초기화
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-400">페이지당</span>
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}건</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-gray-400">총 {filtered.length}건</span>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-36">시간</TableHead>
              <TableHead className="w-20">구분</TableHead>
              <TableHead className="w-20">유저</TableHead>
              <TableHead className="w-44">이벤트</TableHead>
              <TableHead>세부 내용</TableHead>
              <TableHead className="w-28 text-right">유저 ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-16">
                  이벤트가 없습니다. 홈 화면에서 버튼을 눌러보세요.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((ev) => {
                const ut = USER_TYPE_LABEL[ev.userType];
                return (
                  <TableRow key={ev.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="text-xs text-gray-500 font-mono">{fmt(ev.createdAt)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_COLORS[ev.parsed.badge] ?? BADGE_COLORS["기타"]}`}>
                        {ev.parsed.badge}
                      </span>
                    </TableCell>
                    <TableCell>
                      {ut ? (
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ut.cls}`}>
                          {ut.label}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{ev.parsed.label}</TableCell>
                    <TableCell className="text-sm text-gray-600">{ev.parsed.detail || "—"}</TableCell>
                    <TableCell className="text-right text-xs text-gray-400 font-mono truncate max-w-28">
                      {ev.userId ? (
                        <span title={ev.userId}>{ev.userId.slice(0, 12)}</span>
                      ) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} / {filtered.length}건
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                처음
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                이전
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const p = start + i;
                return (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 text-xs p-0 ${p === page ? "bg-pink-600 hover:bg-pink-700" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
              >
                마지막
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
