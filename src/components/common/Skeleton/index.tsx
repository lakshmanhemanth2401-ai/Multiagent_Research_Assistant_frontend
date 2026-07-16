import React from 'react'
import { cn } from '@/utils/helpers'

export interface SkeletonProps {
  className?: string
  variant?: 'line' | 'circle' | 'rect'
  width?: string | number
  height?: string | number
  lines?: number
}

const base = 'animate-pulse rounded bg-gray-200 dark:bg-gray-700'

function SkeletonItem({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn(base, className)} style={style} aria-hidden="true" />
}

export default function Skeleton({
  className,
  variant = 'line',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  if (variant === 'circle') {
    return (
      <SkeletonItem
        className={cn('rounded-full', !height && 'h-10', !width && 'w-10', className)}
        style={style as React.CSSProperties}
      />
    )
  }

  if (variant === 'rect') {
    return (
      <SkeletonItem
        className={cn('rounded-lg', !height && 'h-32', !width && 'w-full', className)}
        style={style as React.CSSProperties}
      />
    )
  }

  if (lines > 1) {
    return (
      <div className={cn('space-y-2', className)} role="status" aria-label="Loading…">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonItem
            key={i}
            className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
          />
        ))}
        <span className="sr-only">Loading…</span>
      </div>
    )
  }

  return (
    <SkeletonItem
      className={cn('h-4 w-full', className)}
      style={style as React.CSSProperties}
    />
  )
}
