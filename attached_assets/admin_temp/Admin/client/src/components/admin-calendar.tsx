import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface DayActivity {
  date: number
  activities: {
    approvals: number
    rejections: number
    biddingDeadlines: number
    contracts: number
    completions: number
    settlements: number
    reviews: number
  }
}

interface DayDetailsProps {
  date: number
  activities: DayActivity['activities']
}

function DayDetails({ date, activities }: DayDetailsProps) {
  const activityList = [
    { label: "프로젝트 승인", count: activities.approvals, color: "bg-green-500" },
    { label: "프로젝트 반려", count: activities.rejections, color: "bg-red-500" },
    { label: "비딩 마감", count: activities.biddingDeadlines, color: "bg-blue-500" },
    { label: "계약 완료", count: activities.contracts, color: "bg-purple-500" },
    { label: "제작 완료", count: activities.completions, color: "bg-orange-500" },
    { label: "정산 완료", count: activities.settlements, color: "bg-emerald-500" },
    { label: "리뷰 등록", count: activities.reviews, color: "bg-yellow-500" },
  ]

  return (
    <div className="space-y-3">
      <h3 className="font-medium">2024년 6월 {date}일 활동 내역</h3>
      <div className="grid gap-2">
        {activityList.map((activity) => (
          <div 
            key={activity.label} 
            className="flex items-center justify-between p-2 rounded border"
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${activity.color}`} />
              <span className="text-sm">{activity.label}</span>
            </div>
            <Badge variant="secondary">{activity.count}건</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminCalendar() {
  const [currentMonth, setCurrentMonth] = useState(6) // June
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  // TODO: remove mock data - replace with real API data
  const mockData: DayActivity[] = [
    { date: 1, activities: { approvals: 5, rejections: 2, biddingDeadlines: 3, contracts: 4, completions: 6, settlements: 3, reviews: 8 }},
    { date: 2, activities: { approvals: 3, rejections: 1, biddingDeadlines: 2, contracts: 2, completions: 4, settlements: 5, reviews: 6 }},
    { date: 3, activities: { approvals: 8, rejections: 3, biddingDeadlines: 5, contracts: 6, completions: 7, settlements: 4, reviews: 9 }},
    { date: 4, activities: { approvals: 2, rejections: 0, biddingDeadlines: 1, contracts: 3, completions: 2, settlements: 2, reviews: 4 }},
    { date: 5, activities: { approvals: 6, rejections: 2, biddingDeadlines: 4, contracts: 5, completions: 8, settlements: 6, reviews: 7 }},
    { date: 15, activities: { approvals: 12, rejections: 4, biddingDeadlines: 8, contracts: 9, completions: 11, settlements: 7, reviews: 15 }},
    { date: 20, activities: { approvals: 7, rejections: 1, biddingDeadlines: 3, contracts: 4, completions: 6, settlements: 8, reviews: 10 }},
  ]

  const getDayData = (date: number) => {
    return mockData.find(data => data.date === date)
  }

  const getTotalActivities = (activities: DayActivity['activities']) => {
    return Object.values(activities).reduce((sum, count) => sum + count, 0)
  }

  const handleDateClick = (date: number) => {
    setSelectedDate(date)
  }

  // Generate calendar days (simplified)
  const daysInMonth = 30
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <Card data-testid="card-admin-calendar">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium">관리자 캘린더</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-20 text-center">2024년 6월</span>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground font-medium">
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div>토</div>
            <div>일</div>
          </div>
          
          {/* 캘린더 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date) => {
              const dayData = getDayData(date)
              const totalActivities = dayData ? getTotalActivities(dayData.activities) : 0
              
              return (
                <Dialog key={date}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-12 w-full p-1 flex flex-col items-center justify-center hover-elevate"
                      onClick={() => handleDateClick(date)}
                      data-testid={`calendar-day-${date}`}
                    >
                      <span className="text-sm">{date}</span>
                      {totalActivities > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-1 py-0 h-4 min-w-4"
                        >
                          {totalActivities}
                        </Badge>
                      )}
                    </Button>
                  </DialogTrigger>
                  {dayData && (
                    <DialogContent data-testid={`dialog-day-details-${date}`}>
                      <DialogHeader>
                        <DialogTitle>일일 활동 내역</DialogTitle>
                        <DialogDescription>
                          선택한 날짜의 상세 업무 현황을 확인할 수 있습니다
                        </DialogDescription>
                      </DialogHeader>
                      <DayDetails date={date} activities={dayData.activities} />
                    </DialogContent>
                  )}
                </Dialog>
              )
            })}
          </div>
          
          {/* 범례 */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>숫자는 해당 날짜의 총 업무 건수입니다</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}