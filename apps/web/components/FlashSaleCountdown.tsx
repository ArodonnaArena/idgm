'use client'

import { useState, useEffect } from 'react'

interface FlashSaleCountdownProps {
  endTime: string
  onExpire?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function FlashSaleCountdown({ endTime, onExpire }: FlashSaleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    // Validate endTime
    if (!endTime) {
      return
    }

    const calculateTimeLeft = (): TimeLeft | null => {
      try {
        const endDate = new Date(endTime)
        
        // Check if date is valid
        if (isNaN(endDate.getTime())) {
          return null
        }
        
        const now = new Date()
        const difference = endDate.getTime() - now.getTime()
        
        if (difference <= 0) {
          setIsExpired(true)
          onExpire?.()
          return null
        }

        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      } catch (error) {
        console.error('FlashSaleCountdown error:', error)
        return null
      }
    }

    // Calculate immediately
    const initial = calculateTimeLeft()
    setTimeLeft(initial)

    // Update every second
    const timer = setInterval(() => {
      const time = calculateTimeLeft()
      setTimeLeft(time)
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, onExpire])

  if (isExpired || !timeLeft) {
    return (
      <div className="text-red-500 font-bold text-sm">
        Sale Ended
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 text-white">
      {timeLeft.days > 0 && (
        <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
          {String(timeLeft.days).padStart(2, '0')}d
        </div>
      )}
      <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
        {String(timeLeft.hours).padStart(2, '0')}h
      </div>
      <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
        {String(timeLeft.minutes).padStart(2, '0')}m
      </div>
      <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold animate-pulse">
        {String(timeLeft.seconds).padStart(2, '0')}s
      </div>
    </div>
  )
}
