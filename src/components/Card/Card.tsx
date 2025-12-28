import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        bg-bg-surface rounded-card shadow-card p-4
        transition-colors duration-150
        hover:bg-bg-surface-hover
        ${className}
      `}
    >
      {children}
    </div>
  )
}
