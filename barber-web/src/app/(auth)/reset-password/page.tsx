'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { api } from '@/src/lib/api'
import { Card } from '@/src/components/ui/Card'
import { Input } from '@/src/components/ui/Input'
import { Button } from '@/src/components/ui/Button'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ newPassword: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (form.newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (form.newPassword !== form.confirm) {
      toast.error('As senhas não coincidem.')
      return
    }

    if (!token) {
      toast.error('Token inválido. Solicite um novo link.')
      return
    }

    setLoading(true)
    try {
      await api.post('/api/auth/reset-password', {
        token,
        newPassword: form.newPassword,
      })
      setSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao redefinir senha.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">✂️ Barberly</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Redefinir senha</p>
        </div>

        <Card>
          {success ? (
            <div className="text-center flex flex-col gap-4">
              <div className="text-4xl">🔒</div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Senha redefinida!
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Sua senha foi alterada com sucesso. Faça login com a nova senha.
              </p>
              <Link href="/login">
                <Button className="w-full">Ir para o login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Nova senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required
              />
              <Input
                label="Confirmar nova senha"
                type="password"
                placeholder="Repita a senha"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
              />
              <Button type="submit" loading={loading} className="w-full mt-2">
                Redefinir senha
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}