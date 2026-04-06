import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Clock, AlertTriangle, CheckCircle, FileCheck, MessageSquare, ShieldCheck, Ban } from "lucide-react"
import { useLocation } from "wouter"

interface AlertItem {
  id: string
  type: 'urgent' | 'warning' | 'info' | 'success'
  title: string
  description: string
  time: string
  actionLabel?: string
  actionPath?: string
}

export function AdminAlerts() {
  const [, setLocation] = useLocation()

  const alerts: AlertItem[] = [
    {
      id: "1",
      type: "urgent",
      title: "프로젝트 승인 요청",
      description: "공개 프로젝트 2건이 운영자 승인을 기다리고 있습니다",
      time: "30분 전",
      actionLabel: "승인하기",
      actionPath: "/admin/pending-approval"
    },
    {
      id: "2",
      type: "warning",
      title: "중단·취소 요청",
      description: "검토 대기 중인 중단/취소 요청이 1건 있습니다",
      time: "2시간 전",
      actionLabel: "처리하기",
      actionPath: "/admin/stop-cancel"
    },
    {
      id: "3",
      type: "info",
      title: "기업 인증 심사",
      description: "신규 기업 인증 신청 3건이 검토 대기 중입니다",
      time: "4시간 전",
      actionLabel: "심사하기",
      actionPath: "/admin/company-portfolios"
    },
    {
      id: "4",
      type: "info",
      title: "미답변 1:1 문의",
      description: "답변을 기다리는 1:1 문의가 5건 있습니다",
      time: "6시간 전",
      actionLabel: "답변하기",
      actionPath: "/admin/communication"
    }
  ]

  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-destructive" />
      case 'warning':
        return <Ban className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
      case 'info':
        return <Bell className="h-3.5 w-3.5 shrink-0 text-blue-500" />
      case 'success':
        return <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
    }
  }

  const getBadgeVariant = (type: AlertItem['type']) => {
    switch (type) {
      case 'urgent': return 'destructive' as const
      default: return 'secondary' as const
    }
  }

  const getBadgeLabel = (type: AlertItem['type']) => {
    switch (type) {
      case 'urgent': return '긴급'
      case 'warning': return '주의'
      case 'info': return '확인'
      case 'success': return '완료'
    }
  }

  return (
    <Card data-testid="card-admin-alerts">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 px-5 pb-2">
        <CardTitle className="text-base font-semibold">관리자 알림 및 할 일</CardTitle>
        <Bell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-5 pb-4 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex flex-col gap-2 py-3 px-3 rounded-lg border hover-elevate min-w-0"
              data-testid={`alert-item-${alert.id}`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                {getAlertIcon(alert.type)}
                <h4 className="text-sm font-semibold truncate">{alert.title}</h4>
                <Badge
                  variant={getBadgeVariant(alert.type)}
                  className={
                    alert.type !== 'urgent'
                      ? 'text-[10px] px-1.5 py-0 h-4 text-white bg-slate-600 border-0 shrink-0'
                      : 'text-[10px] px-1.5 py-0 h-4 shrink-0'
                  }
                >
                  {getBadgeLabel(alert.type)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
              <div className="flex items-center justify-between gap-2 mt-auto">
                <span className="text-xs text-muted-foreground">{alert.time}</span>
                {alert.actionLabel && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-2.5 shrink-0"
                    onClick={() => alert.actionPath && setLocation(alert.actionPath)}
                    data-testid={`button-alert-action-${alert.id}`}
                  >
                    {alert.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
