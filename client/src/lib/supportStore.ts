export type SupportTicketType = "INQUIRY" | "REPORT"

export type SupportReportTargetType = "PROJECT" | "PROFILE" | "MESSAGE" | "OTHER"

export type SupportTicket = {
  id: string
  type: SupportTicketType
  title: string
  content: string
  reportTargetType?: SupportReportTargetType
  reportTargetId?: string
  reportTargetTitle?: string
  createdAt: string // ISO
}

const STORAGE_KEY = "admarket_support_tickets_v1"

function safeParse(json: string | null): SupportTicket[] {
  if (!json) return []
  try {
    const parsed = JSON.parse(json) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(Boolean) as SupportTicket[]
  } catch {
    return []
  }
}

export function getSupportTickets(): SupportTicket[] {
  if (typeof window === "undefined") return []
  return safeParse(window.localStorage.getItem(STORAGE_KEY))
}

export function addSupportTicket(input: Omit<SupportTicket, "id" | "createdAt">): SupportTicket {
  const now = new Date()
  const ticket: SupportTicket = {
    id: `SUP-${now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
    createdAt: now.toISOString(),
    ...input,
  }

  if (typeof window !== "undefined") {
    const prev = getSupportTickets()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([ticket, ...prev]))
  }

  return ticket
}

export function getReportsOnly(): SupportTicket[] {
  return getSupportTickets().filter((t) => t.type === "REPORT")
}

