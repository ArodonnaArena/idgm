'use client'

import React from 'react'

const nf = new Intl.NumberFormat('en-NG', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatNGN(amount: number) {
  return `\u20A6${nf.format(Number(amount || 0))}`
}

export function Price({ amount, className }: { amount: number | string; className?: string }) {
  const n = Number(amount || 0)
  return (
    <span className={className}>
      <span
        aria-hidden="true"
        className="mr-0.5"
        style={{ fontFamily: "'Segoe UI Symbol','Noto Sans','Noto Sans Symbols 2', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
      >
        {'\u20A6'}
      </span>
      {nf.format(n)}
    </span>
  )
}