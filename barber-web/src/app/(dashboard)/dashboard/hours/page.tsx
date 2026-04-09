'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '@/src/lib/api'
import { WorkingHour } from '@/src/types'
import { Button } from '@/src/components/ui/Button'
import { Card } from '@/src/components/ui/Card'

const DAY_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const DAY_LABELS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const defaultHours = DAY_LABELS.map((_, i) => ({
  dayOfWeek: i,
  isOpen: i >= 1 && i <= 5,
  startTime: '09:00',
  endTime: '18:00',
  hasLunchBreak: false,
  lunchStart: '12:00',
  lunchEnd: '13:00',
}))

export default function HoursPage() {
  const [hours, setHours] = useState(defaultHours)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<WorkingHour[]>('/api/workinghours')
        if (data.length > 0) {
          setHours(defaultHours.map((def) => {
            const found = data.find((d) => d.dayOfWeek === def.dayOfWeek)
            return found ? {
              dayOfWeek: found.dayOfWeek,
              isOpen: found.isOpen,
              startTime: found.startTime,
              endTime: found.endTime,
              hasLunchBreak: found.hasLunchBreak,
              lunchStart: found.lunchStart ?? '12:00',
              lunchEnd: found.lunchEnd ?? '13:00',
            } : def
          }))
        }
      } catch {
        toast.error('Erro ao carregar horários.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function updateDay(dayOfWeek: number, field: string, value: string | boolean) {
    setHours((prev) =>
      prev.map((h) => h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h)
    )
  }

  async function handleSave() {
    setSaving(true)
    try {
      await api.put('/api/workinghours', { hours })
      toast.success('Horários salvos!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const timeInputClass = `
    border border-zinc-300 rounded-lg px-2 md:px-3 py-1.5 text-sm
    focus:outline-none focus:ring-2 focus:ring-zinc-900
    dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 dark:focus:ring-zinc-400
    w-full
  `

  if (loading) return <p className="text-zinc-500 dark:text-zinc-400">Carregando...</p>

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Horários</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm mt-1">
          Configure os dias e horários em que você atende
        </p>
      </div>

      <Card>
        <div className="flex flex-col gap-5">
          {hours.map((h) => (
            <div key={h.dayOfWeek} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 pb-5 last:pb-0">

              {/* Linha principal: dia + toggle + horários */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer sm:w-28">
                  <input
                    type="checkbox"
                    checked={h.isOpen}
                    onChange={(e) => updateDay(h.dayOfWeek, 'isOpen', e.target.checked)}
                    className="w-4 h-4 accent-zinc-900 dark:accent-zinc-100 shrink-0"
                  />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <span className="hidden sm:inline">{DAY_LABELS[h.dayOfWeek]}</span>
                    <span className="sm:hidden">{DAY_LABELS_SHORT[h.dayOfWeek]}</span>
                  </span>
                </label>

                {h.isOpen ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={h.startTime}
                      onChange={(e) => updateDay(h.dayOfWeek, 'startTime', e.target.value)}
                      className={timeInputClass}
                    />
                    <span className="text-zinc-400 text-sm shrink-0">até</span>
                    <input
                      type="time"
                      value={h.endTime}
                      onChange={(e) => updateDay(h.dayOfWeek, 'endTime', e.target.value)}
                      className={timeInputClass}
                    />
                  </div>
                ) : (
                  <span className="text-sm text-zinc-400 dark:text-zinc-500">Fechado</span>
                )}
              </div>

              {/* Almoço */}
              {h.isOpen && (
                <div className="mt-3 ml-0 sm:ml-30 flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={h.hasLunchBreak}
                      onChange={(e) => updateDay(h.dayOfWeek, 'hasLunchBreak', e.target.checked)}
                      className="w-4 h-4 accent-zinc-900 dark:accent-zinc-100"
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Pausa almoço</span>
                  </label>

                  {h.hasLunchBreak && (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={h.lunchStart}
                        onChange={(e) => updateDay(h.dayOfWeek, 'lunchStart', e.target.value)}
                        className={timeInputClass}
                      />
                      <span className="text-zinc-400 text-sm shrink-0">até</span>
                      <input
                        type="time"
                        value={h.lunchEnd}
                        onChange={(e) => updateDay(h.dayOfWeek, 'lunchEnd', e.target.value)}
                        className={timeInputClass}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <Button onClick={handleSave} loading={saving} className="mt-6 w-full sm:w-auto">
          Salvar horários
        </Button>
      </Card>
    </div>
  )
}