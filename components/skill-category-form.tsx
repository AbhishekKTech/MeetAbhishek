"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Skill {
  name: string
  icon: string
}

interface SkillCategory {
  category: string
  items: Skill[]
}

interface SkillCategoryFormProps {
  category: SkillCategory
  setCategory: (category: SkillCategory) => void
  onSave: () => void
  onCancel: () => void
  error: string | null
  setError: (error: string | null) => void
}

const VALIDATION = {
  CATEGORY_MIN_LENGTH: 3,
  CATEGORY_MAX_LENGTH: 50,
}

export function SkillCategoryForm({
  category,
  setCategory,
  onSave,
  onCancel,
  error,
  setError,
}: SkillCategoryFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const validateCategory = (name: string) => {
    if (name.length < VALIDATION.CATEGORY_MIN_LENGTH) {
      return `Category name must be at least ${VALIDATION.CATEGORY_MIN_LENGTH} characters`
    }
    if (name.length > VALIDATION.CATEGORY_MAX_LENGTH) {
      return `Category name must be ${VALIDATION.CATEGORY_MAX_LENGTH} characters or less`
    }
    return null
  }

  const handleSave = () => {
    const validationError = validateCategory(category.category)
    if (validationError) {
      setError(validationError)
      return
    }
    onSave()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category Name</Label>
        <Input
          ref={inputRef}
          id="category"
          value={category.category}
          onChange={(e) => {
            setCategory({ ...category, category: e.target.value })
            setError(null)
          }}
          placeholder="e.g., Programming Languages"
          maxLength={VALIDATION.CATEGORY_MAX_LENGTH}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!category.category.trim()}>
          Save Category
        </Button>
      </DialogFooter>
    </div>
  )
}