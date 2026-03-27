import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"

interface PlaceholderPageProps {
  title: string
  description: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            개발 예정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            이 기능은 현재 개발 중입니다. 곧 사용하실 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}