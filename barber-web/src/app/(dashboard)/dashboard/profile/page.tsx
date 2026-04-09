'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '@/src/lib/api'
import { Profile } from '@/src/types'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Card } from '@/src/components/ui/Card'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    displayName: '',
    businessName: '',
    phone: '',
    slug: '',
  })

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<Profile>('/api/profile')
        setForm({
          displayName: data.displayName,
          businessName: data.businessName,
          phone: data.phone,
          slug: data.slug,
        })
      } catch {
        // Perfil ainda não existe
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.displayName.trim()) { toast.error('Nome de exibição é obrigatório.'); return }
    if (!form.businessName.trim()) { toast.error('Nome do negócio é obrigatório.'); return }
    if (!form.slug.trim()) { toast.error('Slug é obrigatório.'); return }
    if (!/^[a-z0-9-]+$/.test(form.slug)) {
      toast.error('Slug deve conter apenas letras minúsculas, números e hífens.')
      return
    }

    setSaving(true)
    try {
      await api.put('/api/profile', form)
      toast.success('Perfil salvo!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  function handleSlugChange(value: string) {
    const slug = value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    setForm({ ...form, slug })
  }

  if (loading) return <p className="text-zinc-500 dark:text-zinc-400">Carregando...</p>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Meu Perfil</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm mt-1">
          Configure as informações públicas da sua barbearia
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Seu nome (exibido para clientes)"
            placeholder="Lucas Barber"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            required
          />
          <Input
            label="Nome da barbearia"
            placeholder="Barbearia do Lucas"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            required
          />
          <Input
            label="Telefone / WhatsApp (sem código do país, ex: 81999999999)"
            placeholder="81999999999"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div>
            <Input
              label="Slug (seu link público)"
              placeholder="lucas-barber"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              required
            />
            {form.slug && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Seu link:{' '}
                  <a href={'/b/' + form.slug}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-700 dark:text-zinc-300 font-medium hover:underline"
                >
                  {typeof window !== 'undefined' ? window.location.origin : ''}/b/{form.slug}
                </a>
              </p>
            )}
          </div>

          <Button className="w-full sm:w-auto mt-2" type="submit" loading={saving}>
            Salvar perfil
          </Button>
        </form>
      </Card>
    </div>
  )
}