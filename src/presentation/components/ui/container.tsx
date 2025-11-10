import { cn } from "@/presentation/utils/cn"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

const sizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-full"
}

export function Container({ 
  size = "lg", 
  className, 
  children, 
  ...props 
}: ContainerProps) {
  return (
    <div 
      className={cn("container mx-auto px-4", sizes[size], className)} 
      {...props}
    >
      {children}
    </div>
  )
}
