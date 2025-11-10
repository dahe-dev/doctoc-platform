interface StatCardProps {
  number: string
  label: string
}

export function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold mb-2">{number}</div>
      <div className="opacity-90">{label}</div>
    </div>
  )
}
