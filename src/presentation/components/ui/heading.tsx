import { cn } from "@/presentation/utils/cn"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  align?: "left" | "center" | "right"
}

const sizes = {
  sm: "text-xl sm:text-2xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl",
  xl: "text-4xl sm:text-5xl",
  "2xl": "text-4xl sm:text-5xl md:text-6xl"
}

const aligns = {
  left: "text-left",
  center: "text-center",
  right: "text-right"
}

export function Heading({ 
  as: Component = "h2", 
  size = "lg",
  align = "left",
  className, 
  children, 
  ...props 
}: HeadingProps) {
  return (
    <Component 
      className={cn("font-bold tracking-tight", sizes[size], aligns[align], className)} 
      {...props}
    >
      {children}
    </Component>
  )
}
