import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Folder, FileCheck, CreditCard, Star } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<{ className?: string }>
}

function StatsCard({ title, value, change, changeType, icon: Icon }: StatsCardProps) {
  return (
    <Card data-testid={`card-stats-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-xl font-bold leading-tight" data-testid={`text-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          {changeType === 'increase' ? (
            <TrendingUp className="h-2.5 w-2.5 text-green-500" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5 text-red-500" />
          )}
          <span>{change}</span>
          <span className="text-muted-foreground">전월 대비</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  // TODO: remove mock data - replace with real API data
  const stats = [
    {
      title: "프로젝트 등록 수",
      value: "1,234",
      change: "+12.5%",
      changeType: 'increase' as const,
      icon: Folder,
    },
    {
      title: "계약 수",
      value: "856",
      change: "+8.3%",
      changeType: 'increase' as const,
      icon: FileCheck,
    },
    {
      title: "제작 완료 수", 
      value: "743",
      change: "+15.7%",
      changeType: 'increase' as const,
      icon: FileCheck,
    },
    {
      title: "정산 완료 수",
      value: "692",
      change: "-2.1%",
      changeType: 'decrease' as const,
      icon: CreditCard,
    },
    {
      title: "리뷰 등록 수",
      value: "521",
      change: "+9.4%",
      changeType: 'increase' as const,
      icon: Star,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}