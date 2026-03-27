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
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Bell className="h-4 w-4 text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-medium">관리자 알림 및 할 일</CardTitle>
        <Bell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className="flex items-start gap-3 p-3 rounded-lg border hover-elevate"
              data-testid={`alert-item-${alert.id}`}
            >
              {getAlertIcon(alert.type)}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">{alert.title}</h4>
                  <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
                    {alert.type === 'urgent' ? '긴급' : 
                     alert.type === 'warning' ? '주의' :
                     alert.type === 'info' ? '정보' : '완료'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{alert.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                  {alert.actionLabel && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAlertAction(alert.id, alert.actionLabel!)}
                      data-testid={`button-alert-action-${alert.id}`}
                    >
                      {alert.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}