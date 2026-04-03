import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type FilterPeriod = "ALL" | "1Y" | "1M" | "CUSTOM"

export function PeriodFilter() {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("ALL")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Select value={filterPeriod} onValueChange={(v) => setFilterPeriod(v as FilterPeriod)}>
        <SelectTrigger className="w-32 h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">전체 기간</SelectItem>
          <SelectItem value="1Y">최근 1년</SelectItem>
          <SelectItem value="1M">이번 달</SelectItem>
          <SelectItem value="CUSTOM">직접 입력</SelectItem>
        </SelectContent>
      </Select>
      <input
        type="date"
        value={customFrom}
        onChange={(e) => setCustomFrom(e.target.value)}
        disabled={filterPeriod !== "CUSTOM"}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      />
      <span className="text-xs text-muted-foreground">~</span>
      <input
        type="date"
        value={customTo}
        onChange={(e) => setCustomTo(e.target.value)}
        disabled={filterPeriod !== "CUSTOM"}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </div>
  )
}
