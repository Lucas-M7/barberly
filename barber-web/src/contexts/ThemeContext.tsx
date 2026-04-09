'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextData {
  isDark: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextData>({
  isDark: false,
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Começa com false para evitar mismatch servidor/cliente
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Só roda no browser
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark)

    setIsDark(shouldBeDark)
    setMounted(true)
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')

    // Aplica/remove a classe dark no <html>
    if (next) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Evita renderizar com tema errado antes de ler o localStorage
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}