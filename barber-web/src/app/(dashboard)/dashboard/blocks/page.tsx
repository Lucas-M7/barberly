'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '@/src/lib/api'
import { Block } from '@/src/types'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Card } from '@/src/components/ui/Card'

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '' })

  useEffect(() => { loadBlocks() }, [])

  async function loadBlocks() {
    try {
      const data = await api.get<Block[]>('/api/blocks')
      setBlocks(data)
    } catch {
      toast.error('Erro ao carregar bloqueios.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/api/blocks', {
        startDate: form.startDate,
        endDate: form.endDate || form.startDate,
        reason: form.reason || null,
      })
      toast.success('Bloqueio criado!')
      setShowForm(false)
      setForm({ startDate: '', endDate: '', reason: '' })
      loadBlocks()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar bloqueio.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este bloqueio?')) return
    try {
      await api.delete(`/api/blocks/${id}`)
      toast.success('Bloqueio removido!')
      loadBlocks()
    } catch {
      toast.error('Erro ao remover.')
    }
  }

  function formatDate(d: string) {
    const [y, m, day] = d.split('-')
    return `${day}/${m}/${y}`
  }

  if (loading) return <p className="text-zinc-500 dark:text-zinc-400">Carregando...</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Bloqueios</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm mt-1">Dias em que você não vai atender</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Novo bloqueio</Button>
        )}
      </div>

      {showForm && (
        <Card>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Novo bloqueio</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data de início"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
              />
              <Input
                label="Data de fim (opcional)"
                type="date"
                value={form.endDate}
                min={form.startDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
            <Input
              label="Motivo (opcional)"
              placeholder="Ex: Férias, Feriado..."
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <Button className='w-full sm:w-auto' type="submit" loading={saving}>Salvar</Button>
              <Button className='w-full sm:w-auto' type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {blocks.length === 0 ? (
          <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-500">Nenhum bloqueio cadastrado.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {blocks.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <div>
                  <p className="text-xs md:text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {b.startDate === b.endDate
                      ? formatDate(b.startDate)
                      : `${formatDate(b.startDate)} até ${formatDate(b.endDate)}`}
                  </p>
                  {b.reason && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{b.reason}</p>
                  )}
                </div>
                <Button variant="danger" onClick={() => handleDelete(b.id)}>
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}