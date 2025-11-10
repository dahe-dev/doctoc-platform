import { Card, CardContent } from "@/presentation/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  variant?: "default" | "bordered"
}

export function FeatureCard({ 
  icon, 
  title, 
  description,
  variant = "default"
}: FeatureCardProps) {
  return (
    <Card variant={variant} hoverable>
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
