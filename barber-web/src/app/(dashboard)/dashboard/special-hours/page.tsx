'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '@/src/lib/api'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Card } from '@/src/components/ui/Card'

interface SpecialHour {
  id: string
  date: string
  isOpen: boolean
  startTime: string
  endTime: string
  hasLunchBreak: boolean
  lunchStart: string | null
  lunchEnd: string | null
  reason: string | null
}

const emptyForm = {
  date: '',
  isOpen: true,
  startTime: '09:00',
  endTime: '18:00',
  hasLunchBreak: false,
  lunchStart: '12:00',
  lunchEnd: '13:00',
  reason: '',
}

export default function SpecialHoursPage() {
  const [items, setItems] = useState<SpecialHour[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadItems() }, [])

  async function loadItems() {
    try {
      const data = await api.get<SpecialHour[]>('/api/specialhours')
      setItems(data)
    } catch {
      toast.error('Erro ao carregar dias especiais.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date) { toast.error('Selecione uma data.'); return }

    setSaving(true)
    try {
      await api.post('/api/specialhours', {
        date: form.date,
        isOpen: form.isOpen,
        startTime: form.startTime,
        endTime: form.endTime,
        hasLunchBreak: form.hasLunchBreak,
        lunchStart: form.hasLunchBreak ? form.lunchStart : null,
        lunchEnd: form.hasLunchBreak ? form.lunchEnd : null,
        reason: form.reason || null,
      })
      toast.success('Dia especial salvo!')
      setShowForm(false)
      setForm(emptyForm)
      loadItems()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este dia especial?')) return
    try {
      await api.delete(`/api/specialhours/${id}`)
      toast.success('Removido!')
      loadItems()
    } catch {
      toast.error('Erro ao remover.')
    }
  }

  function formatDate(d: string) {
    const [y, m, day] = d.split('-')
    return `${day}/${m}/${y}`
  }

  const timeInputClass = 'border border-zinc-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100'

  if (loading) return <p className="text-zinc-500 dark:text-zinc-400">Carregando...</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dias especiais</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Horários diferentes para datas específicas (sobrepõe o horário semanal)
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Novo dia especial</Button>
        )}
      </div>

      {showForm && (
        <Card>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Configurar dia especial</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
              <Input
                label="Motivo (opcional)"
                placeholder="Ex: Feriado, Evento..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>

            {/* Aberto ou fechado nesse dia */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isOpen}
                onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
                className="w-4 h-4 accent-zinc-900 dark:accent-zinc-100"
              />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Aberto nesse dia
              </span>
            </label>

            {form.isOpen && (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400 w-24">Horário:</span>
                  <input type="time" value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className={timeInputClass}
                  />
                  <span className="text-zinc-400 text-sm">até</span>
                  <input type="time" value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className={timeInputClass}
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hasLunchBreak}
                    onChange={(e) => setForm({ ...form, hasLunchBreak: e.target.checked })}
                    className="w-4 h-4 accent-zinc-900 dark:accent-zinc-100"
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Pausa para almoço</span>
                </label>

                {form.hasLunchBreak && (
                  <div className="flex items-center gap-3 flex-wrap ml-6">
                    <input type="time" value={form.lunchStart}
                      onChange={(e) => setForm({ ...form, lunchStart: e.target.value })}
                      className={timeInputClass}
                    />
                    <span className="text-zinc-400 text-sm">até</span>
                    <input type="time" value={form.lunchEnd}
                      onChange={(e) => setForm({ ...form, lunchEnd: e.target.value })}
                      className={timeInputClass}
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex gap-3 mt-2">
              <Button type="submit" loading={saving}>Salvar</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setForm(emptyForm) }}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {items.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">Nenhum dia especial configurado.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {formatDate(item.date)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.isOpen
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {item.isOpen ? 'Aberto' : 'Fechado'}
                    </span>
                  </div>
                  {item.isOpen && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {item.startTime} - {item.endTime}
                      {item.hasLunchBreak && item.lunchStart && item.lunchEnd
                        ? ` · Almoço ${item.lunchStart} - ${item.lunchEnd}`
                        : ''}
                    </p>
                  )}
                  {item.reason && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{item.reason}</p>
                  )}
                </div>
                <Button variant="danger" onClick={() => handleDelete(item.id)}>
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