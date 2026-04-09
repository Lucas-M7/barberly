interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white border border-zinc-200 rounded-xl p-6 dark:bg-zinc-900 dark:border-zinc-700 ${className}`}>
      {children}
    </div>
  )
}