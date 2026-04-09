interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        className={`
          border border-zinc-300 rounded-lg px-3 py-2 text-sm
          bg-white text-zinc-900
          focus:outline-none focus:ring-2 focus:ring-zinc-900
          disabled:bg-zinc-50 disabled:text-zinc-500
          dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100
          dark:focus:ring-zinc-400 dark:disabled:bg-zinc-900
          ${error ? 'border-red-500 dark:border-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </div>
  )
}