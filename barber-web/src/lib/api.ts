import { da } from "date-fns/locale"
import path from "path"
import { json } from "stream/consumers"

// URL base da API
const API_URL = process.env.NEXT_PUBLIC_API_URL

// Função interna que faz toda as requests
// Lê o token do localStorage e coloca no header
async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    // Pega o token salvo no navegador (se tiver)
    const token = typeof window !== 'undefined' ?
        localStorage.getItem('token') : null

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    }

    // Se tiver token, adiciona no header Authorization
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options, headers,
    })

    if (response.status === 204) {
        return undefined as T
    }

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || 'Erro inesperado.')
    }

    return data
}

// Funções públicas que serão usadas nas telas

export const api = {
    get: <T>(path: string) =>
        request<T>(path),

    post: <T>(path:string, body: unknown) =>
        request<T>(path, {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    put: <T>(path: string, body: unknown) =>
        request<T>(path, {
            method: 'PUT',
            body: JSON.stringify(body),
        }),

    patch: <T>(path: string, body?: unknown) =>
        request<T>(path, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: <T>(path: string) =>
        request<T>(path, { method: 'DELETE' }),
}