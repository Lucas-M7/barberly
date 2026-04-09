'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/src/lib/api'
import { Card } from '@/src/components/ui/Card'
import { Button } from '@/src/components/ui/Button'

type Status = 'loading' | 'success' | 'error'

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function confirm() {
      if (!token) {
        setStatus('error')
        setMessage('Token não encontrado na URL.')
        return
      }

      try {
        await api.post(`/api/auth/confirm-email?token=${token}`, {})
        setStatus('success')
        setMessage('Seu e-mail foi confirmado com sucesso!')
      } catch (err: unknown) {
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Token inválido ou expirado.')
      }
    }

    confirm()
  }, [token])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">✂️ Barberly</h1>
        </div>

        <Card>
          {status === 'loading' && (
            <div className="text-center py-4">
              <p className="text-zinc-500 dark:text-zinc-400">Confirmando seu e-mail...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center flex flex-col gap-4">
              <div className="text-4xl">✅</div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                E-mail confirmado!
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
              <Link href="/login">
                <Button className="w-full">Ir para o login</Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center flex flex-col gap-4">
              <div className="text-4xl">❌</div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Não foi possível confirmar
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
              <Link href="/login">
                <Button variant="secondary" className="w-full">Voltar ao login</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}