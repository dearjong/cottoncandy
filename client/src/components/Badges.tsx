/**
 * Admin 페이지용 뱃지 컴포넌트
 */
import React from "react";
import { cn } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  WAITING: "대기",
  ANSWERED: "답변완료",
  URGENT: "긴급",
  PROCESS: "진행중",
  RESOLVED: "해결완료",
  APPROVED: "승인",
  PENDING: "대기",
  ACTIVE: "활성",
  SENT: "발송완료",
  SIGNING: "서명중",
  COMPLETED: "완료",
  DRAFT: "초안",
  REPORTED: "신고됨",
  PUBLISHED: "게시",
};

const typeLabels: Record<string, string> = {
  CLIENT: "의뢰",
  PARTNER: "파트너",
  COMPANY_MEMBER: "구성원",
  FREELANCER: "프리랜서",
  "PRJ-001": "승인완료",
  "PRJ-005": "계약안내",
  "OPS-001": "승인필요",
  "MBR-001": "가입완료",
  "NTC-001": "공지",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const label = statusLabels[status] ?? status;
  const variant =
    status === "WAITING" || status === "URGENT" || status === "PENDING"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : status === "ANSWERED" || status === "RESOLVED" || status === "COMPLETED" || status === "SENT"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : status === "PROCESS" || status === "SIGNING"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : status === "APPROVED"
            ? "bg-slate-100 text-slate-700 border-slate-200"
            : "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold", variant, className)}>
      {label}
    </span>
  );
}

export function UserTypeBadge({ type, className }: { type: string; className?: string }) {
  const label = typeLabels[type] ?? type;
  return (
    <span className={cn("text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded", className)}>
      {label}
    </span>
  );
}

export function NotificationTypeBadge({ type, className }: { type: string; className?: string }) {
  const label = typeLabels[type] ?? type;
  return (
    <span className={cn("text-[10px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded", className)}>
      {label}
    </span>
  );
}

export function CompanyTypeBadge({ type, className }: { type: string; className?: string }) {
  const label = type === "PARTNER" ? "파트너" : type === "CLIENT" ? "의뢰" : type;
  return (
    <span className={cn("text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded", className)}>
      {label}
    </span>
  );
}

export function CompanyGradeBadge({ grade, className }: { grade: string; className?: string }) {
  const colors: Record<string, string> = {
    GOLD: "bg-amber-50 text-amber-700 border-amber-200",
    SILVER: "bg-slate-100 text-slate-700 border-slate-200",
    BRONZE: "bg-orange-50 text-orange-700 border-orange-200",
    NEW: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", colors[grade] ?? "bg-slate-100", className)}>
      {grade}
    </span>
  );
}

export function ProjectTypeBadge({ type, className }: { type: string; className?: string }) {
  return (
    <span className={cn("text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded", className)}>
      {type}
    </span>
  );
}

export function NoticeTypeBadge({ type, className }: { type: string; className?: string }) {
  return (
    <span className={cn("text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded", className)}>
      {type}
    </span>
  );
}

export function RiskLevelBadge({ riskLevel, className }: { riskLevel: string; className?: string }) {
  const label = riskLevel === "WARNING" ? "경고" : riskLevel === "CAUTION" ? "주의" : riskLevel;
  return (
    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", riskLevel === "WARNING" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600", className)}>
      {label}
    </span>
  );
}
