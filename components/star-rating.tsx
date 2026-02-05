"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onChange: (rating: number) => void
  disabled?: boolean
}

export function StarRating({ rating, onChange, disabled = false }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "transition-colors hover:text-yellow-400",
            star <= rating ? "text-yellow-400" : "text-muted",
            disabled && "cursor-not-allowed opacity-50",
          )}
          onClick={() => !disabled && onChange(star)}
          disabled={disabled}
        >
          <Star className="h-6 w-6 fill-current" />
          <span className="sr-only">{star} stars</span>
        </button>
      ))}
    </div>
  )
}