import { TimeSlot } from "@/core/domain/value-objects/TimeSlot"
import { Button } from "@/presentation/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card"
import { cn } from "@/presentation/utils/cn"

interface ScheduleGridProps {
  timeSlots: TimeSlot[]
  selectedSlot?: TimeSlot
  onSelectSlot: (slot: TimeSlot) => void
  disabled?: boolean
}

export function ScheduleGrid({
  timeSlots,
  selectedSlot,
  onSelectSlot,
  disabled,
}: ScheduleGridProps) {
  if (timeSlots.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No hay horarios disponibles para esta fecha
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Horarios Disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {timeSlots.map((slot, index) => {
            const isSelected =
              selectedSlot?.startTime === slot.startTime &&
              selectedSlot?.endTime === slot.endTime

            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onSelectSlot(slot)}
                disabled={disabled}
                className={cn(
                  "flex flex-col h-auto py-2",
                  isSelected && "ring-2 ring-ring ring-offset-2"
                )}
              >
                <span className="text-xs font-medium">
                  {slot.startTime}
                </span>
                <span className="text-xs opacity-70">
                  {slot.endTime}
                </span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
