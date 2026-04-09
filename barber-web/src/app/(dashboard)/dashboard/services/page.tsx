'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '@/src/lib/api'
import { Service } from '@/src/types'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Card } from '@/src/components/ui/Card'

const emptyForm = { name: '', durationMinutes: 30, price: '' }

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadServices() }, [])

  async function loadServices() {
    try {
      const data = await api.get<Service[]>('/api/services')
      setServices(data)
    } catch {
      toast.error('Erro ao carregar serviços.')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(service: Service) {
    setEditingId(service.id)
    setForm({ name: service.name, durationMinutes: service.durationMinutes, price: service.price?.toString() ?? '' })
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const body = {
      name: form.name,
      durationMinutes: Number(form.durationMinutes),
      price: form.price ? Number(form.price) : null,
    }
    try {
      if (editingId) {
        await api.put(`/api/services/${editingId}`, body)
        toast.success('Serviço atualizado!')
      } else {
        await api.post('/api/services', body)
        toast.success('Serviço criado!')
      }
      cancelForm()
      loadServices()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(id: string) {
    try {
      await api.patch(`/api/services/${id}/toggle`)
      toast.success('Status atualizado!')
      loadServices()
    } catch {
      toast.error('Erro ao atualizar status.')
    }
  }

  if (loading) return <p className="text-zinc-500 dark:text-zinc-400">Carregando...</p>

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Serviços</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm mt-1">Gerencie o que você oferece</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="shrink-0">+ Novo</Button>
        )}
      </div>

      {showForm && (
        <Card>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 text-sm md:text-base">
            {editingId ? 'Editar serviço' : 'Novo serviço'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nome do serviço"
              placeholder="Ex: Corte Simples"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <Input
                label="Duração (min)"
                type="number"
                min={10}
                placeholder="30"
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                required
              />
              <Input
                label="Preço (opcional)"
                type="number"
                min={0}
                step={0.01}
                placeholder="35.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <Button type="submit" loading={saving} className="w-full sm:w-auto">Salvar</Button>
              <Button type="button" variant="secondary" onClick={cancelForm} className="w-full sm:w-auto">Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {services.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">Nenhum serviço cadastrado ainda.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{s.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {s.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {s.durationMinutes} min
                    {s.price ? ` · R$ ${s.price.toFixed(2).replace('.', ',')}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => startEdit(s)} className="flex-1 sm:flex-none">
                    Editar
                  </Button>
                  <Button
                    variant={s.isActive ? 'danger' : 'secondary'}
                    onClick={() => handleToggle(s.id)}
                    className="flex-1 sm:flex-none"
                  >
                    {s.isActive ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}