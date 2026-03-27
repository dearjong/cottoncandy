import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Heart, MessageCircle, Star } from "lucide-react"

export interface ParticipationCompanyCardData {
  id: string
  companyName: string
  type: string
  isFavorite: boolean
  representativeAdvertisers: string
  recent6Months: string
  recent3Years: string
  workCount: number
  staff: string
  minProductionCost: string
  tags: string[]
  cottonCandyActivityCount: number
  rating: number
}

interface ParticipationCompanyCardProps {
  data: ParticipationCompanyCardData
  otDone: boolean
  statusLabel?: string
  onChangeOtDone: (checked: boolean) => void
  onClickMessage?: () => void
}

export function ParticipationCompanyCard({
  data,
  otDone,
  statusLabel = "OT참석완료",
  onChangeOtDone,
  onClickMessage,
}: ParticipationCompanyCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex gap-4">
        <div className="flex shrink-0 items-start gap-2">
          <Checkbox className="mt-1" />
          <button type="button" className="text-muted-foreground hover:text-rose-500 mt-1">
            <Heart className={cn("h-5 w-5", data.isFavorite && "fill-rose-500 text-rose-500")} />
          </button>
          <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            {data.companyName.slice(0, 1)}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-lg">{data.companyName}</span>
            <div className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(data.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs font-normal">
              OT참석확정
            </Badge>
            <label className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">{statusLabel}</span>
              <Switch checked={otDone} onCheckedChange={onChangeOtDone} />
            </label>
          </div>

          <p className="text-sm text-muted-foreground mb-2">{data.type}</p>
          <p className="text-sm mb-0.5">
            <span className="text-muted-foreground">[대표광고주]</span> {data.representativeAdvertisers}
          </p>
          <p className="text-sm mb-0.5">
            <span className="text-muted-foreground">[최근6개월]</span> {data.recent6Months}
          </p>
          <p className="text-sm mb-2">
            <span className="text-muted-foreground">[최근 3년]</span> {data.recent3Years}, {data.workCount}작품,{" "}
            {data.staff}, {data.minProductionCost}
          </p>

          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 w-24 shrink-0 rounded border border-border bg-muted/50"
                aria-hidden
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-1">
            {data.tags.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          {data.cottonCandyActivityCount > 0 && (
            <p className="text-sm text-muted-foreground">
              ✓ Cotton Candy 활동 {data.cottonCandyActivityCount}작품
            </p>
          )}
        </div>

        <div className="shrink-0">
          <Button variant="outline" size="sm" className="gap-1" onClick={onClickMessage}>
            <MessageCircle className="h-4 w-4" />
            메세지
          </Button>
        </div>
      </div>
    </div>
  )
}

