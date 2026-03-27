import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Clock, AlertTriangle, CheckCircle } from "lucide-react"

interface AlertItem {
  id: string
  type: 'urgent' | 'info' | 'warning' | 'success'
  title: string
  description: string
  time: string
  actionLabel?: string
}

export function AdminAlerts() {
  // TODO: remove mock data - replace with real API data
  const alerts: AlertItem[] = [
    {
      id: "1",
      type: "urgent",
      title: "승인 대기 프로젝트",
      description: "15개 프로젝트가 승인을 기다리고 있습니다",
      time: "2시간 전",
      actionLabel: "확인하기"
    },
    {
      id: "2", 
      type: "warning",
      title: "계약 기한 임박",
      description: "3개 계약이 내일까지 완료되어야 합니다",
      time: "4시간 전",
      actionLabel: "처리하기"
    },
    {
      id: "3",
      type: "info",
      title: "새로운 회원 가입",
      description: "8명의 신규 회원이 승인을 기다리고 있습니다",
      time: "6시간 전",
      actionLabel: "검토하기"
    },
    {
      id: "4",
      type: "success",
      title: "정산 완료",
      description: "이번 주 정산이 성공적으로 완료되었습니다",
      time: "1일 전"
    }
  ]

  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-destructive" />
      case 'warning':
        return <Clock className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
      case 'info':
        return <Bell className="h-3.5 w-3.5 shrink-0 text-blue-500" />
      case 'success':
        return <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
    }
  }

  const getBadgeVariant = (type: AlertItem['type']) => {
    switch (type) {
      case 'urgent':
        return 'destructive' as const
      case 'warning':
        return 'secondary' as const
      case 'info':
        return 'secondary' as const
      case 'success':
        return 'secondary' as const
    }
  }

  const handleAlertAction = (alertId: string, actionType: string) => {
    console.log(`Alert ${alertId} action: ${actionType}`)
    // TODO: replace with real action handling
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
                  className={alert.type !== 'urgent' ? 'text-[10px] px-1.5 py-0 h-4 text-white bg-slate-600 border-0 shrink-0' : 'text-[10px] px-1.5 py-0 h-4 shrink-0'}
                >
                  {alert.type === 'urgent' ? '긴급' : 
                   alert.type === 'warning' ? '주의' :
                   alert.type === 'info' ? '정보' : '완료'}
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
                    onClick={() => handleAlertAction(alert.id, alert.actionLabel!)}
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