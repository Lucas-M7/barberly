'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextData {
    isAuthenticated: boolean
    userName: string | null
    login: (token: string, name: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider ({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userName, setUserName] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const name = localStorage.getItem('userName')
        if (token && name) {
            setIsAuthenticated(true)
            setUserName(name)
        }
    }, [])

    function login(token: string, name: string) {
        localStorage.setItem('token', token)
        localStorage.setItem('userName', name)
        setIsAuthenticated(true)
        setUserName(name)
        router.push('/dashboard')
    }

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        setIsAuthenticated(false)
        setUserName(null)
        router.push('/login')
    }

    return(
        <AuthContext.Provider value={{ isAuthenticated, userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}