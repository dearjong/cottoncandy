import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

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


export function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState<number>(15)

  const mockData: DayActivity[] = [
    { date: 1, activities: { approvals: 5, rejections: 2, biddingDeadlines: 3, contracts: 4, completions: 6, settlements: 3, reviews: 8 }},
    { date: 2, activities: { approvals: 3, rejections: 1, biddingDeadlines: 2, contracts: 2, completions: 4, settlements: 5, reviews: 6 }},
    { date: 3, activities: { approvals: 8, rejections: 3, biddingDeadlines: 5, contracts: 6, completions: 7, settlements: 4, reviews: 9 }},
    { date: 4, activities: { approvals: 2, rejections: 0, biddingDeadlines: 1, contracts: 3, completions: 2, settlements: 2, reviews: 4 }},
    { date: 5, activities: { approvals: 6, rejections: 2, biddingDeadlines: 4, contracts: 5, completions: 8, settlements: 6, reviews: 7 }},
    { date: 8, activities: { approvals: 4, rejections: 1, biddingDeadlines: 2, contracts: 3, completions: 5, settlements: 4, reviews: 6 }},
    { date: 10, activities: { approvals: 9, rejections: 2, biddingDeadlines: 6, contracts: 7, completions: 8, settlements: 5, reviews: 11 }},
    { date: 12, activities: { approvals: 5, rejections: 3, biddingDeadlines: 4, contracts: 4, completions: 6, settlements: 7, reviews: 8 }},
    { date: 15, activities: { approvals: 12, rejections: 4, biddingDeadlines: 8, contracts: 9, completions: 11, settlements: 7, reviews: 15 }},
    { date: 18, activities: { approvals: 6, rejections: 2, biddingDeadlines: 3, contracts: 5, completions: 7, settlements: 4, reviews: 9 }},
    { date: 20, activities: { approvals: 7, rejections: 1, biddingDeadlines: 3, contracts: 4, completions: 6, settlements: 8, reviews: 10 }},
    { date: 22, activities: { approvals: 8, rejections: 2, biddingDeadlines: 5, contracts: 6, completions: 9, settlements: 5, reviews: 12 }},
    { date: 25, activities: { approvals: 10, rejections: 3, biddingDeadlines: 7, contracts: 8, completions: 10, settlements: 6, reviews: 14 }},
    { date: 28, activities: { approvals: 4, rejections: 1, biddingDeadlines: 2, contracts: 3, completions: 4, settlements: 3, reviews: 5 }},
  ]

  const getDayData = (date: number) => {
    return mockData.find(data => data.date === date)
  }

  const getTotalActivities = (activities: DayActivity['activities']) => {
    return Object.values(activities).reduce((sum, count) => sum + count, 0)
  }

  const monthTotal = mockData.reduce((sum, day) => sum + getTotalActivities(day.activities), 0)
  const monthApprovals = mockData.reduce((sum, day) => sum + day.activities.approvals, 0)
  const monthRejections = mockData.reduce((sum, day) => sum + day.activities.rejections, 0)
  const monthContracts = mockData.reduce((sum, day) => sum + day.activities.contracts, 0)

  const daysInMonth = 30
  const firstDayOffset = 5
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"]

  return (
    <div className="space-y-4">
      <Card data-testid="card-admin-calendar">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">2024</span>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">6월 현황</span>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            월간 총 <span className="font-semibold text-foreground">{monthTotal}</span>개 
            ( 승인 <span className="text-green-600">{monthApprovals}</span> / 
            반려 <span className="text-red-600">-{monthRejections}</span> / 
            계약 <span className="text-purple-600">{monthContracts}</span> )
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 border-b bg-muted/30">
              {weekDays.map((day, i) => (
                <div 
                  key={day} 
                  className={`p-2 text-center text-sm font-medium border-r last:border-r-0 ${
                    i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-muted-foreground"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="border-r border-b p-2 min-h-[100px] bg-muted/10" />
              ))}
              
              {calendarDays.map((date) => {
                const dayData = getDayData(date)
                const totalActivities = dayData ? getTotalActivities(dayData.activities) : 0
                const isSelected = selectedDate === date
                const dayOfWeek = (date + firstDayOffset - 1) % 7
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                
                return (
                  <div
                    key={date}
                    className={`border-r border-b p-2 min-h-[100px] cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/5 ring-2 ring-primary ring-inset" : "hover:bg-muted/30"
                    }`}
                    onClick={() => setSelectedDate(date)}
                    data-testid={`calendar-day-${date}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isSelected ? "text-primary" : 
                      dayOfWeek === 0 ? "text-red-500" : 
                      dayOfWeek === 6 ? "text-blue-500" : ""
                    }`}>
                      {date}
                    </div>
                    {dayData && (
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs">
                        <div className="text-green-600">{dayData.activities.approvals} 승인</div>
                        <div className="text-purple-600">{dayData.activities.contracts} 계약</div>
                        <div className="text-red-500">{dayData.activities.rejections} 반려</div>
                        <div className="text-blue-600">{dayData.activities.biddingDeadlines} 비딩</div>
                        <div className="text-orange-500">{dayData.activities.completions} 완료</div>
                        <div className="text-muted-foreground font-medium">{totalActivities} 총계</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
