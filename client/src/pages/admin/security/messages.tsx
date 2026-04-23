import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/admin/page-header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AdminActionGate } from "@/components/admin/admin-action-gate"
import { MOCK_ADMIN_PROJECTS_V1 } from "@/data/mockData"

type MessageSenderType = "CLIENT" | "PARTNER" | "ADMIN"
/** 보안자료 검색 유형 — 분쟁 대비 증빙(대화·계약·제안·산출물·정산·계산서·영수증) */
type DataType =
  | "MESSAGES"
  | "CONTRACT"
  | "PROPOSAL"
  | "PRODUCTION"
  | "SETTLEMENT"
  | "TAX_INVOICE"
  | "RECEIPT"

type NonMessageDataType = Exclude<DataType, "MESSAGES">

/** 목업: 프로젝트 상태로 자료 존재 여부를 가정 (실제 연동 시 문서 메타데이터로 교체) */
const DOCUMENT_STATUS_FILTERS: Record<NonMessageDataType, string[]> = {
  CONTRACT: [
    "CONTRACT",
    "SHOOTING",
    "EDITING",
    "DRAFT_SUBMITTED",
    "FINAL_APPROVED",
    "PRODUCTION_COMPLETE",
    "ONAIR_STARTED",
    "AFTER_SERVICE",
    "COMPLETE",
    "ADMIN_CHECKING",
    "ADMIN_CONFIRMED",
  ],
  PROPOSAL: [
    "PROPOSAL_SUBMIT",
    "PROPOSAL_SUBMITTED",
    "PT_SCHEDULED",
    "PT_COMPLETED",
    "NO_SELECTION",
    "SELECTED",
    "CONTRACT",
    "SHOOTING",
    "EDITING",
    "DRAFT_SUBMITTED",
    "FINAL_APPROVED",
    "PRODUCTION_COMPLETE",
    "ONAIR_STARTED",
    "AFTER_SERVICE",
    "COMPLETE",
    "ADMIN_CHECKING",
    "ADMIN_CONFIRMED",
  ],
  PRODUCTION: [
    "SHOOTING",
    "EDITING",
    "DRAFT_SUBMITTED",
    "FINAL_APPROVED",
    "PRODUCTION_COMPLETE",
    "ONAIR_STARTED",
    "AFTER_SERVICE",
    "COMPLETE",
    "ADMIN_CHECKING",
    "ADMIN_CONFIRMED",
  ],
  /** 정산 단계 자료(지급 비율·정산표 등) */
  SETTLEMENT: ["PRODUCTION_COMPLETE", "ONAIR_STARTED", "AFTER_SERVICE", "COMPLETE", "ADMIN_CHECKING", "ADMIN_CONFIRMED"],
  /** 세금계산서 — 종료·검수 이후 발행 가정 */
  TAX_INVOICE: ["COMPLETE", "ADMIN_CHECKING", "ADMIN_CONFIRMED"],
  /** 영수증 — 계약 이후 지급·증빙 구간 */
  RECEIPT: [
    "CONTRACT",
    "SHOOTING",
    "EDITING",
    "DRAFT_SUBMITTED",
    "FINAL_APPROVED",
    "PRODUCTION_COMPLETE",
    "ONAIR_STARTED",
    "AFTER_SERVICE",
    "COMPLETE",
    "ADMIN_CHECKING",
    "ADMIN_CONFIRMED",
  ],
}

const DOCUMENT_ROW_LABELS: Record<NonMessageDataType, string> = {
  CONTRACT: "계약",
  PROPOSAL: "제안서·시안",
  PRODUCTION: "산출물(제작)",
  SETTLEMENT: "정산",
  TAX_INVOICE: "세금계산서",
  RECEIPT: "영수증",
}

interface ProjectMessage {
  id: string
  projectId: string
  senderType: MessageSenderType
  senderName: string
  createdAt: string
  content: string
}

// 목업: 분쟁/신고 처리 목적의 메시지 열람을 시뮬레이션
const MOCK_PROJECT_MESSAGES: ProjectMessage[] = [
  // PID-20240615-0001: OT 일정 조율 관련 대화
  {
    id: "MSG-001",
    projectId: "PID-20240615-0001",
    senderType: "CLIENT",
    senderName: "의뢰사 담당자",
    createdAt: "2025-02-10 10:12",
    content: "안녕하세요, OT 일정 관련해서 2월 20일 오후로 조정 가능할까요?",
  },
  {
    id: "MSG-002",
    projectId: "PID-20240615-0001",
    senderType: "PARTNER",
    senderName: "수행사 PM",
    createdAt: "2025-02-10 10:25",
    content: "네, 20일(목) 15시로 확정해 두겠습니다.",
  },
  {
    id: "MSG-003",
    projectId: "PID-20240615-0001",
    senderType: "ADMIN",
    senderName: "운영자",
    createdAt: "2025-02-10 10:32",
    content: "OT 링크는 일정 확정 후 하루 전에 자동 발송됩니다.",
  },

  // PID-20240614-0001: 견적 범위 및 일정 관련 논의
  {
    id: "MSG-010",
    projectId: "PID-20240614-0001",
    senderType: "CLIENT",
    senderName: "마케팅팀 과장",
    createdAt: "2025-02-05 09:01",
    content: "영상 러닝타임을 30초 기준으로 견적을 받아보고 싶습니다.",
  },
  {
    id: "MSG-011",
    projectId: "PID-20240614-0001",
    senderType: "PARTNER",
    senderName: "제작사 PD",
    createdAt: "2025-02-05 09:19",
    content: "30초 기준과 60초 확장 버전 2가지 옵션으로 견적서 준비해서 올리겠습니다.",
  },
  {
    id: "MSG-012",
    projectId: "PID-20240614-0001",
    senderType: "ADMIN",
    senderName: "운영자",
    createdAt: "2025-02-05 09:27",
    content: "최종 견적 확정 전까지는 의뢰 내용 수정 가능하니, 변경사항 있으면 이 스레드에 남겨 주세요.",
  },

  // PID-20240613-0001: 피드백 표현 수위 관련 CS 상황 가정
  {
    id: "MSG-020",
    projectId: "PID-20240613-0001",
    senderType: "CLIENT",
    senderName: "브랜드 매니저",
    createdAt: "2025-02-12 14:03",
    content: "지난 시안은 방향성이 너무 다른 것 같습니다. 처음 공유드린 레퍼런스를 다시 한번 참고해 주세요.",
  },
  {
    id: "MSG-021",
    projectId: "PID-20240613-0001",
    senderType: "PARTNER",
    senderName: "크리에이티브 디렉터",
    createdAt: "2025-02-12 14:18",
    content: "피드백 주셔서 감사합니다. 레퍼런스 기준으로 톤앤매너 재정리해서 2차 시안 드리겠습니다.",
  },
  {
    id: "MSG-022",
    projectId: "PID-20240613-0001",
    senderType: "ADMIN",
    senderName: "운영자",
    createdAt: "2025-02-12 14:25",
    content: "양측 모두 2차 시안까지는 메이저 방향성을 맞추는 데 집중 부탁드립니다. 세부 표현은 이후 라운드에서 조율 가능합니다.",
  },

  // PID-20240610-0004: 제작 완료·납품 후 AS 관련 대화
  {
    id: "MSG-030",
    projectId: "PID-20240610-0004",
    senderType: "CLIENT",
    senderName: "홍보팀장",
    createdAt: "2025-03-02 11:10",
    content: "최종본 잘 받았습니다. 엔딩 크레딧에 파트너사 로고를 조금 더 키워 넣을 수 있을까요?",
  },
  {
    id: "MSG-031",
    projectId: "PID-20240610-0004",
    senderType: "PARTNER",
    senderName: "제작사 PM",
    createdAt: "2025-03-02 11:24",
    content: "네, 크레딧 사이즈 조정해서 재렌더링 후 오늘 중으로 전달드리겠습니다.",
  },
  {
    id: "MSG-032",
    projectId: "PID-20240610-0004",
    senderType: "ADMIN",
    senderName: "운영자",
    createdAt: "2025-03-02 11:35",
    content: "본 수정은 계약서 내 무상 수정 범위 안에 포함되어 처리됩니다. 추가 비용 청구는 없습니다.",
  },

  // PID-20240520-0009: 온에어 후 효과 공유 및 리뷰 요청
  {
    id: "MSG-040",
    projectId: "PID-20240520-0009",
    senderType: "CLIENT",
    senderName: "마케팅실장",
    createdAt: "2025-03-05 09:05",
    content: "지난 주 온에어 이후 검색량이 35% 정도 상승했습니다. 좋은 결과 만들어 주셔서 감사합니다.",
  },
  {
    id: "MSG-041",
    projectId: "PID-20240520-0009",
    senderType: "PARTNER",
    senderName: "크리에이티브 디렉터",
    createdAt: "2025-03-05 09:18",
    content: "성과 공유 감사드립니다. 후속 캠페인 아이디어도 내부적으로 정리해서 제안 드리겠습니다.",
  },
  {
    id: "MSG-042",
    projectId: "PID-20240520-0009",
    senderType: "ADMIN",
    senderName: "운영자",
    createdAt: "2025-03-05 09:25",
    content: "캠페인 리뷰 등록 메뉴에서 이번 프로젝트에 대한 평가를 남겨주시면, 향후 매칭 추천에 반영됩니다.",
  },

  // PID-20240510-0010: 시즌 캠페인 종료 후 정산·리포트 관련
  {
    id: "MSG-050",
    projectId: "PID-20240510-0010",
    senderType: "CLIENT",
    senderName: "브랜드매니저",
    createdAt: "2025-04-01 15:02",
    content: "정산 세부 내역과 노출·전환 리포트 원본 파일도 함께 전달 부탁드립니다.",
  },
  {
    id: "MSG-051",
    projectId: "PID-20240510-0010",
    senderType: "PARTNER",
    senderName: "미디어 플래너",
    createdAt: "2025-04-01 15:16",
    content: "광고계정 리포트와 집행 내역 정리해서 오늘 안에 업로드 드리겠습니다.",
  },
  {
    id: "MSG-052",
    projectId: "PID-20240510-0010",
    senderType: "ADMIN",
    senderName: "운영자",
    createdAt: "2025-04-01 15:25",
    content: "정산 확정 처리 후 세금계산서 발행 안내 알림이 자동 발송될 예정입니다.",
  },
]

const parseMessageTime = (value: string): number | null => {
  // "YYYY-MM-DD HH:mm" -> ISO 형태로 변환
  const iso = value.replace(" ", "T")
  const ms = new Date(iso).getTime()
  return Number.isFinite(ms) ? ms : null
}

const formatMessageTime = (value: string): string => {
  const ms = parseMessageTime(value)
  if (!ms) return value
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ms))
  } catch {
    return value
  }
}

export default function AdminSecurityMessagesPage() {
  const projects = MOCK_ADMIN_PROJECTS_V1 as unknown as { id: string; title: string }[]

  const [dataTypeInput, setDataTypeInput] = useState<DataType>("MESSAGES")
  const [senderInput, setSenderInput] = useState("ALL")
  const [keywordInput, setKeywordInput] = useState("")

  const [appliedFilters, setAppliedFilters] = useState({
    dataType: "MESSAGES" as DataType,
    sender: "ALL",
    keyword: "",
  })

  const senderOptions = useMemo(() => {
    const unique = Array.from(new Set(MOCK_PROJECT_MESSAGES.filter((m) => m.senderType !== "ADMIN").map((m) => m.senderName)))
    unique.sort((a, b) => a.localeCompare(b, "ko"))
    return unique
  }, [])

  const filteredMessages = useMemo(() => {
    const kw = appliedFilters.keyword.trim().toLowerCase()
    return MOCK_PROJECT_MESSAGES.filter((m) => {
      if (appliedFilters.sender !== "ALL" && m.senderName !== appliedFilters.sender) return false
      if (kw) {
        const projTitle = projects.find((p) => p.id === m.projectId)?.title ?? ""
        const match =
          m.projectId.toLowerCase().includes(kw) ||
          projTitle.toLowerCase().includes(kw) ||
          m.content.toLowerCase().includes(kw) ||
          m.senderName.toLowerCase().includes(kw)
        if (!match) return false
      }
      return true
    })
  }, [appliedFilters, projects])

  const filteredUserMessages = useMemo(() => {
    // 분쟁 시 확인 목적: 사용자 간(의뢰사/수행사) 송수신 내용만 표시
    return filteredMessages.filter((m) => m.senderType !== "ADMIN")
  }, [filteredMessages])

  const grouped = useMemo(() => {
    if (appliedFilters.dataType !== "MESSAGES") return []
    const map = new Map<
      string,
      { projectId: string; title: string; count: number; lastCreatedAtRaw: string; lastCreatedAtMs: number }
    >()

    for (const msg of filteredUserMessages) {
      const projTitle = projects.find((p) => p.id === msg.projectId)?.title ?? "알 수 없음"
      const msgMs = parseMessageTime(msg.createdAt) ?? 0
      const prev = map.get(msg.projectId)
      if (!prev) {
        map.set(msg.projectId, {
          projectId: msg.projectId,
          title: projTitle,
          count: 1,
          lastCreatedAtRaw: msg.createdAt,
          lastCreatedAtMs: msgMs,
        })
      } else {
        prev.count += 1
        if (msgMs >= prev.lastCreatedAtMs) {
          prev.lastCreatedAtMs = msgMs
          prev.lastCreatedAtRaw = msg.createdAt
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => b.lastCreatedAtMs - a.lastCreatedAtMs)
  }, [filteredUserMessages, projects])

  const documentGrouped = useMemo(() => {
    if (appliedFilters.dataType === "MESSAGES") return null
    const dt = appliedFilters.dataType as NonMessageDataType
    const allowed = DOCUMENT_STATUS_FILTERS[dt]
    const rows = (projects as unknown as { id: string; title: string; status?: string }[])
      .filter((p) => allowed.includes(String(p.status ?? "")))
      .map((p) => ({
        projectId: p.id,
        title: p.title,
        count: 1,
        lastCreatedAtRaw: "",
        lastCreatedAtMs: 0,
      }))
    return { rows, rowLabel: DOCUMENT_ROW_LABELS[dt] }
  }, [appliedFilters.dataType, projects])

  const [gateOpen, setGateOpen] = useState(false)
  const [contentOpen, setContentOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const selectedProjectMessages = useMemo(() => {
    if (!selectedProjectId) return []
    return filteredUserMessages.filter((m) => m.projectId === selectedProjectId)
  }, [selectedProjectId, filteredUserMessages])

  const selectedProjectTitle = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId)?.title ?? ""
    : ""

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="보안자료"
        description="대화·계약서·제안서·산출물·정산·세금계산서·영수증 등 분쟁 대비 증빙을 한곳에서 검색합니다. 원문 열람은 사유·로그가 남으며, 목록은 존재 여부 수준으로만 안내됩니다."
      />

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5 min-w-[130px]">
            <Label>유형</Label>
            <Select value={dataTypeInput} onValueChange={(v) => setDataTypeInput(v as DataType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MESSAGES">대화 기록</SelectItem>
                <SelectItem value="CONTRACT">계약서</SelectItem>
                <SelectItem value="PROPOSAL">제안서·시안</SelectItem>
                <SelectItem value="PRODUCTION">산출물(제작)</SelectItem>
                <SelectItem value="SETTLEMENT">정산</SelectItem>
                <SelectItem value="TAX_INVOICE">세금계산서</SelectItem>
                <SelectItem value="RECEIPT">영수증</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-[130px]">
            <Label>담당자</Label>
            <Select value={senderInput} onValueChange={setSenderInput}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="담당자 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                {senderOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <Label>검색어</Label>
            <Input
              placeholder="프로젝트 ID·명, 담당자명, 대화 내용"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setAppliedFilters({ dataType: dataTypeInput, sender: senderInput, keyword: keywordInput })
                }
              }}
            />
          </div>
          <div className="flex gap-2 pb-0.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDataTypeInput("MESSAGES")
                setSenderInput("ALL")
                setKeywordInput("")
                setAppliedFilters({ dataType: "MESSAGES", sender: "ALL", keyword: "" })
              }}
            >
              초기화
            </Button>
            <Button
              type="button"
              onClick={() => {
                setAppliedFilters({ dataType: dataTypeInput, sender: senderInput, keyword: keywordInput })
              }}
            >
              검색
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">검색 결과</h2>
          <span className="text-sm text-gray-500">
            {appliedFilters.dataType === "MESSAGES"
              ? grouped.length > 0
                ? `${grouped.length}건`
                : "조건에 해당하는 결과가 없습니다."
              : documentGrouped && documentGrouped.rows.length > 0
                ? `${documentGrouped.rows.length}건`
                : "조건에 해당하는 결과가 없습니다."}
          </span>
        </div>

        <div className="mt-3 rounded-lg border border-gray-200 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[120px]">프로젝트 ID</TableHead>
                <TableHead className="w-[360px]">프로젝트명</TableHead>
                <TableHead className="w-[180px]">
                  {appliedFilters.dataType === "MESSAGES" ? "최근 대화" : "자료 유형"}
                </TableHead>
                <TableHead className="w-[120px]">
                  {appliedFilters.dataType === "MESSAGES" ? "메시지 수" : "존재"}
                </TableHead>
                <TableHead className="text-right w-[160px]">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appliedFilters.dataType === "MESSAGES" ? (
                grouped.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-gray-500">
                      결과가 없습니다. 조건을 변경해 검색해 보세요.
                    </TableCell>
                  </TableRow>
                ) : (
                  grouped.map((g) => (
                    <TableRow key={g.projectId}>
                      <TableCell className="font-medium text-gray-900 whitespace-nowrap">{g.projectId}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <div className="truncate max-w-[520px]" title={g.title}>
                          {g.title}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-gray-600">{formatMessageTime(g.lastCreatedAtRaw)}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-gray-600">{g.count}</TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          className="px-2 text-lg leading-none text-gray-500 hover:text-gray-800 disabled:text-gray-300"
                          onClick={() => {
                            setSelectedProjectId(g.projectId)
                            setGateOpen(true)
                          }}
                          disabled={g.count === 0}
                          aria-label="보안 열람"
                          title="보안 열람"
                        >
                          …
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : !documentGrouped || documentGrouped.rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-gray-500">
                    결과가 없습니다. 조건을 변경해 검색해 보세요.
                  </TableCell>
                </TableRow>
              ) : (
                documentGrouped.rows.map((g) => (
                  <TableRow key={g.projectId}>
                    <TableCell className="font-medium text-gray-900 whitespace-nowrap">{g.projectId}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      <div className="truncate max-w-[520px]" title={g.title}>
                        {g.title}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-600">{documentGrouped.rowLabel}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-600">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        존재
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        className="px-2 text-lg leading-none text-gray-500 hover:text-gray-800 disabled:text-gray-300"
                        onClick={() => {
                          setSelectedProjectId(g.projectId)
                          setGateOpen(true)
                        }}
                        disabled={g.count === 0}
                        aria-label="보안 열람"
                        title="보안 열람"
                      >
                        …
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AdminActionGate
        open={
          gateOpen &&
          selectedProjectId != null &&
          (appliedFilters.dataType !== "MESSAGES" || selectedProjectMessages.length > 0)
        }
        title="자료 열람"
        description="보안사항: 자료에는 개인정보, 대화·첨부·계약조건 등 민감한 내부 자산이 포함될 수 있습니다. 업무상 목적을 벗어난 열람·캡처·공유·유출 시 관련 법령 및 내부 보안규정 위반으로 처벌 및 징계 대상이 될 수 있습니다. 모든 열람 이력과 사유는 시스템에 보관됩니다."
        reasonLabel="사유"
        reasonPlaceholder="예: 클레임 대응, 분쟁 근거 확인 등"
        variant="danger"
        initialPassword="1234"
        initialReason={
          selectedProjectId ? `테스트: 자료 열람 (${selectedProjectId})` : "테스트: 자료 열람"
        }
        onCancel={() => {
          setGateOpen(false)
        }}
        onConfirm={(reason) => {
          const adminId =
            typeof window !== "undefined" ? localStorage.getItem("adminId") ?? "unknown" : "unknown"

          console.log("[자료 열람 로그]", {
            type: "DATA_ACCESS",
            projectId: selectedProjectId,
            projectTitle: selectedProjectTitle,
            reason,
            adminId,
            filters: appliedFilters,
            timestamp: new Date().toISOString(),
          })

          setGateOpen(false)
          setContentOpen(true)
        }}
      />

      <Dialog
        open={contentOpen}
        onOpenChange={(open) => {
          setContentOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>자료 열람</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-xs text-gray-600">
              검색 조건(날짜/담당자)에 해당하는 항목만 표시됩니다. 캡처·무단 공유를 금지합니다.
            </p>

            {appliedFilters.dataType === "CONTRACT" ? (
              <div className="rounded-md border border-gray-200 overflow-hidden bg-white">
                <iframe
                  title="workflow-embed-contract-secure"
                  className="w-full h-[520px] bg-white"
                  src="/admin/workflow-embed/contract?embed=1"
                />
              </div>
            ) : appliedFilters.dataType === "PROPOSAL" ? (
              <div className="rounded-md border border-gray-200 overflow-hidden bg-white">
                <iframe
                  title="workflow-embed-proposal-secure"
                  className="w-full h-[520px] bg-white"
                  src="/admin/workflow-embed/proposal?embed=1"
                />
              </div>
            ) : appliedFilters.dataType === "PRODUCTION" ? (
              <div className="rounded-md border border-gray-200 overflow-hidden bg-white">
                <iframe
                  title="workflow-embed-production-secure"
                  className="w-full h-[520px] bg-white"
                  src="/admin/workflow-embed/production?embed=1"
                />
              </div>
            ) : appliedFilters.dataType === "SETTLEMENT" ||
              appliedFilters.dataType === "TAX_INVOICE" ||
              appliedFilters.dataType === "RECEIPT" ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">
                  {appliedFilters.dataType === "SETTLEMENT" && "정산 비율·지급 단계·계산서 업로드 여부 등은 아래 화면에서 확인합니다. 원문 파일은 보안 저장소 연동 시 노출됩니다."}
                  {appliedFilters.dataType === "TAX_INVOICE" &&
                    "세금계산서 원문·발행 이력은 정산·세무 연계 저장소에서 관리합니다. (목업: 정산 워크플로 연동 화면)"}
                  {appliedFilters.dataType === "RECEIPT" &&
                    "지급·환불 영수증은 정산 흐름과 연동됩니다. (목업: 정산 워크플로에서 업로드 여부 확인)"}
                </p>
                <div className="rounded-md border border-gray-200 overflow-hidden bg-white">
                  <iframe
                    title="workflow-embed-settlement-secure"
                    className="w-full h-[520px] bg-white"
                    src="/admin/workflow-embed/settlement?embed=1"
                  />
                </div>
              </div>
            ) : selectedProjectMessages.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                조건에 해당하는 메시지가 없습니다.
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto rounded-lg border border-gray-200 bg-white px-4 py-3">
                {selectedProjectMessages.map((msg) => {
                  const isClient = msg.senderType === "CLIENT"
                  const isPartner = msg.senderType === "PARTNER"
                  const isAdmin = msg.senderType === "ADMIN"
                  const badgeLabel = isClient ? "의뢰사" : isPartner ? "수행사" : "운영자"

                  const badgeColor = isAdmin
                    ? "bg-gray-800 text-white"
                    : isClient
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"

                  return (
                    <div key={msg.id} className="flex gap-3 text-sm">
                      <div className="flex flex-col items-center mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${badgeColor}`}>
                          {badgeLabel}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="font-medium text-gray-900 text-xs">{msg.senderName}</span>
                          </div>
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">{formatMessageTime(msg.createdAt)}</span>
                        </div>
                        <div className="mt-1 inline-block max-w-full rounded-md bg-gray-50 px-3 py-2 text-gray-800 text-sm leading-relaxed border border-gray-200 whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setContentOpen(false)}
              >
                닫기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

