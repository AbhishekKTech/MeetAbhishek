"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  isEditing: boolean
  className?: string
  inputClassName?: string
  maxLength?: number
}

export default function EditableText({
  value,
  onChange,
  isEditing,
  className = "",
  inputClassName = "",
  maxLength,
}: EditableTextProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <AnimatePresence mode="wait">
      {!isEditing ? (
        <motion.span
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {value}
        </motion.span>
      ) : (
        <>
          <Input
            type="text"
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value)
              onChange(e.target.value)
            }}
            className={`editable-element ${inputClassName}`}
            onClick={(e) => e.preventDefault()}
            maxLength={maxLength}
          />
          {isEditing && maxLength && (
            <div
              className={`text-sm text-right mt-1 ${
                localValue.length === maxLength
                  ? "text-yellow-500 dark:text-yellow-400"
                  : localValue.length > maxLength
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {localValue.length}/{maxLength} characters
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

