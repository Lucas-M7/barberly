interface BadgeProps {
  status: 'Scheduled' | 'Completed' | 'Cancelled'
}

const config = {
  Scheduled: { label: 'Agendado', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  Completed: { label: 'Concluído', className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  Cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
}

export function Badge({ status }: BadgeProps) {
  const { label, className } = config[status]
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${className}`}>
      {label}
    </span>
  )
}