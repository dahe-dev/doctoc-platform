import { cn } from "@/presentation/utils/cn"

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "muted" | "white"
  align?: "left" | "center" | "right"
}

const sizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg"
}

const variants = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  white: "text-white"
}

const aligns = {
  left: "text-left",
  center: "text-center",
  right: "text-right"
}

export function Text({ 
  size = "md",
  variant = "default",
  align = "left",
  className, 
  children, 
  ...props 
}: TextProps) {
  return (
    <p 
      className={cn(sizes[size], variants[variant], aligns[align], className)} 
      {...props}
    >
      {children}
    </p>
  )
}
