'use client'

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10  rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-48 h-48 bg-accent/20  rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-primary/10  rounded-full blur-3xl animate-pulse" />
    </div>
  )
}
