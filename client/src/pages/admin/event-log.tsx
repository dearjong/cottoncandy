import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
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
import { RefreshCw, Search } from "lucide-react";

interface AnalyticsEventRow {
  id: number;
  eventName: string;
  properties: Record<string, unknown>;
  sessionId?: string;
  userId?: string;
  createdAt?: string;
}

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
  { value: "실험", label: "A/B 실험" },
  { value: "유입", label: "유입" },
  { value: "전환", label: "전환" },
];

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

export default function EventLogPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data = [], refetch, isFetching } = useQuery<AnalyticsEventRow[]>({
    queryKey: ["/api/analytics/events"],
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const handleRefresh = useCallback(() => { void refetch(); }, [refetch]);

  // 필터 + 검색
  const rows = data
    .slice()
    .reverse()
    .map((ev) => ({ ...ev, parsed: describeEvent(ev.eventName, ev.properties) }))
    .filter((ev) => {
      if (filter !== "all" && ev.parsed.badge !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          ev.parsed.label.toLowerCase().includes(q) ||
          ev.parsed.detail.toLowerCase().includes(q) ||
          ev.eventName.toLowerCase().includes(q)
        );
      }
      return true;
    });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="클릭 이벤트 로그"
        description="홈 카테고리·카드·FAQ·GNB 등 사용자 클릭을 실시간으로 확인합니다"
        hidePeriodFilter
      />

      {/* 컨트롤 바 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
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

          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="이벤트·카테고리명·FAQ 내용 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
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

          <span className="text-xs text-gray-400 ml-auto">
            총 {rows.length}건
          </span>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-36">시간</TableHead>
              <TableHead className="w-20">구분</TableHead>
              <TableHead className="w-48">이벤트</TableHead>
              <TableHead>세부 내용</TableHead>
              <TableHead className="w-28 text-right">세션 ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-16">
                  {isFetching ? "불러오는 중…" : "이벤트가 없습니다. 홈 화면에서 버튼을 눌러보세요."}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((ev) => (
                <TableRow key={ev.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="text-xs text-gray-500 font-mono">{fmt(ev.createdAt)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_COLORS[ev.parsed.badge] ?? BADGE_COLORS["기타"]}`}
                    >
                      {ev.parsed.badge}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{ev.parsed.label}</TableCell>
                  <TableCell className="text-sm text-gray-600">{ev.parsed.detail || "—"}</TableCell>
                  <TableCell className="text-right text-xs text-gray-400 font-mono truncate max-w-28">
                    {ev.sessionId?.slice(0, 8) ?? "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
