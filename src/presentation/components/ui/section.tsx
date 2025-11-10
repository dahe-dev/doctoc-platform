import { cn } from "@/presentation/utils/cn"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "primary" | "gradient"
  size?: "sm" | "md" | "lg" | "xs" | "default"
}

const variants = {
  default: "bg-background",
  muted: "bg-muted",
  primary: "bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground",
  gradient: "bg-gradient-to-b from-primary/5 via-background to-background"
}

const sizes = {
  default: "py-4 sm:py-6",
  xs: "py-8 sm:py-10",
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32"
}

export function Section({ 
  variant = "default", 
  size = "md",
  className, 
  children, 
  ...props 
}: SectionProps) {
  return (
    <section 
      className={cn(variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </section>
  )
}
