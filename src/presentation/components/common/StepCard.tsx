import { Badge } from "@/presentation/components/ui/badge"

interface StepCardProps {
  number: string
  title: string
  description: string
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="text-center">
      <Badge 
        variant="default" 
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto"
      >
        {number}
      </Badge>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
