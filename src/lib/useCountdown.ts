import { useEffect, useState } from 'react'

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

function compute(targetIso: string): TimeLeft {
  const target = new Date(targetIso).getTime()
  const now = Date.now()
  let diff = Math.max(0, target - now)
  const done = target - now <= 0
  const days = Math.floor(diff / 86400000)
  diff -= days * 86400000
  const hours = Math.floor(diff / 3600000)
  diff -= hours * 3600000
  const minutes = Math.floor(diff / 60000)
  diff -= minutes * 60000
  const seconds = Math.floor(diff / 1000)
  return { days, hours, minutes, seconds, done }
}

/**
 * Live countdown. Works across timezones because it compares absolute epoch
 * milliseconds (the target ISO string carries its own offset, e.g. +05:30 for
 * IST). Recomputes from the real clock every second so it survives refreshes
 * and tab sleep. Never returns negative values.
 */
export function useCountdown(targetIso: string): TimeLeft {
  const [time, setTime] = useState<TimeLeft>(() => compute(targetIso))
  useEffect(() => {
    setTime(compute(targetIso))
    const id = setInterval(() => setTime(compute(targetIso)), 1000)
    return () => clearInterval(id)
  }, [targetIso])
  return time
}
