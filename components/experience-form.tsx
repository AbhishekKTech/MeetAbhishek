"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const LIMITS = {
  TITLE_MAX_LENGTH: 75,
  COMPANY_MAX_LENGTH: 50,
  LOCATION_MAX_LENGTH: 50,
  DESCRIPTION_ITEM_MAX_LENGTH: 150,
  MAX_DESCRIPTION_ITEMS: 5,
} as const

const VALIDATION = {
  TITLE_MIN_LENGTH: 5,
  COMPANY_MIN_LENGTH: 2,
  LOCATION_MIN_LENGTH: 2,
} as const

function validateYear(year: string, type: "start" | "end", startYear?: string): string | null {
  if (!year && type === "start") return "Start year is required"
  if (!year && type === "end") return null // End year is optional

  const yearNum = Number(year)
  const currentYear = new Date().getFullYear()

  if (!/^\d{4}$/.test(year)) {
    return "Year must be a 4-digit number"
  }

  if (yearNum < 1900 || yearNum > currentYear + 10) {
    return `Year must be between 1900 and ${currentYear + 10}`
  }

  if (type === "end" && startYear) {
    const startYearNum = Number(startYear)
    if (yearNum < startYearNum) {
      return "End year cannot be before start year"
    }
  }

  return null
}

interface Experience {
  title: string
  company: string
  location: string
  startYear: string
  endYear: string
  isOngoing: boolean
  description: string[]
}

interface ExperienceFormProps {
  experience: Experience
  setExperience: (experience: Experience) => void
  onSave: () => void
  onCancel: () => void
  error: string | null
  setError: (error: string | null) => void
  newDescriptionItem: string
  setNewDescriptionItem: (value: string) => void
}

export function ExperienceForm({
  experience,
  setExperience,
  onSave,
  onCancel,
  error,
  setError,
  newDescriptionItem,
  setNewDescriptionItem,
}: ExperienceFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus management for title input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus()
      }
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const handleAddItem = () => {
    if (!newDescriptionItem.trim()) return

    if (newDescriptionItem.length > LIMITS.DESCRIPTION_ITEM_MAX_LENGTH) {
      setError(`Description item must be ${LIMITS.DESCRIPTION_ITEM_MAX_LENGTH} characters or less`)
      return
    }

    if (experience.description.length >= LIMITS.MAX_DESCRIPTION_ITEMS) {
      setError(`Maximum ${LIMITS.MAX_DESCRIPTION_ITEMS} description items allowed`)
      return
    }

    setExperience({
      ...experience,
      description: [...experience.description, newDescriptionItem.trim()],
    })
    setNewDescriptionItem("")
    setError(null)

    // Focus back on textarea after adding item
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    })
  }

  const handleRemoveDescriptionItem = (index: number) => {
    setExperience({
      ...experience,
      description: experience.description.filter((_, i) => i !== index),
    })
  }

  const renderCharacterCount = (current: number, limit: number) => (
    <p
      className={cn(
        "text-sm text-right transition-colors",
        current === limit ? "text-yellow-500 dark:text-yellow-400" : "text-muted-foreground",
        current > limit && "text-destructive",
      )}
    >
      {current}/{limit}
    </p>
  )

  const hasReachedMaxItems = experience.description.length >= LIMITS.MAX_DESCRIPTION_ITEMS

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          ref={titleInputRef}
          id="title"
          value={experience.title}
          onChange={(e) => setExperience({ ...experience, title: e.target.value })}
          placeholder="e.g., Senior Backend Engineer"
          maxLength={LIMITS.TITLE_MAX_LENGTH}
          aria-describedby="title-count"
        />
        <div id="title-count">{renderCharacterCount(experience.title.length, LIMITS.TITLE_MAX_LENGTH)}</div>
        {experience.title && experience.title.length < VALIDATION.TITLE_MIN_LENGTH && (
          <p className="text-sm text-destructive">Title must be at least {VALIDATION.TITLE_MIN_LENGTH} characters</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={experience.company}
          onChange={(e) => setExperience({ ...experience, company: e.target.value })}
          placeholder="e.g., Tech Solutions Inc"
          maxLength={LIMITS.COMPANY_MAX_LENGTH}
          aria-describedby="company-count"
        />
        <div id="company-count">{renderCharacterCount(experience.company.length, LIMITS.COMPANY_MAX_LENGTH)}</div>
        {experience.company && experience.company.length < VALIDATION.COMPANY_MIN_LENGTH && (
          <p className="text-sm text-destructive">
            Company must be at least {VALIDATION.COMPANY_MIN_LENGTH} characters
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={experience.location}
          onChange={(e) => setExperience({ ...experience, location: e.target.value })}
          placeholder="e.g., San Francisco, CA"
          maxLength={LIMITS.LOCATION_MAX_LENGTH}
          aria-describedby="location-count"
        />
        <div id="location-count">{renderCharacterCount(experience.location.length, LIMITS.LOCATION_MAX_LENGTH)}</div>
        {experience.location && experience.location.length < VALIDATION.LOCATION_MIN_LENGTH && (
          <p className="text-sm text-destructive">
            Location must be at least {VALIDATION.LOCATION_MIN_LENGTH} characters
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startYear">Start Year</Label>
          <Input
            id="startYear"
            value={experience.startYear}
            onChange={(e) => setExperience({ ...experience, startYear: e.target.value })}
            placeholder="YYYY"
            maxLength={4}
          />
          {experience.startYear && validateYear(experience.startYear, "start") && (
            <p className="text-sm text-destructive">{validateYear(experience.startYear, "start")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endYear">End Year</Label>
          <Input
            id="endYear"
            value={experience.endYear}
            onChange={(e) => setExperience({ ...experience, endYear: e.target.value })}
            placeholder="YYYY"
            maxLength={4}
            disabled={experience.isOngoing}
          />
          {experience.endYear && validateYear(experience.endYear, "end", experience.startYear) && (
            <p className="text-sm text-destructive">{validateYear(experience.endYear, "end", experience.startYear)}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isOngoing"
          checked={experience.isOngoing}
          onCheckedChange={(checked) => {
            setExperience({
              ...experience,
              isOngoing: checked as boolean,
              endYear: checked ? "" : experience.endYear,
            })
          }}
        />
        <Label htmlFor="isOngoing">Currently working here</Label>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label as="span">Description Items</Label>
          <span
            className={cn(
              "text-sm",
              experience.description.length === LIMITS.MAX_DESCRIPTION_ITEMS
                ? "text-yellow-500 dark:text-yellow-400"
                : "text-muted-foreground",
            )}
            role="status"
            aria-live="polite"
          >
            {experience.description.length}/{LIMITS.MAX_DESCRIPTION_ITEMS} items
          </span>
        </div>

        <div className="space-y-3">
          {experience.description.map((item, index) => (
            <div key={index} className="group flex items-start gap-2 relative">
              <div className="flex-1 bg-muted/50 rounded-lg p-3 break-words">{item}</div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemoveDescriptionItem(index)
                }}
                aria-label={`Remove description item ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {!hasReachedMaxItems && (
          <div className="flex flex-col gap-2">
            <div className="group flex gap-2">
              <Textarea
                ref={textareaRef}
                value={newDescriptionItem}
                onChange={(e) => {
                  setNewDescriptionItem(e.target.value)
                  setError(null)
                }}
                placeholder="Add a description item"
                className="flex-1 min-h-[100px] resize-none p-3"
                maxLength={LIMITS.DESCRIPTION_ITEM_MAX_LENGTH}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleAddItem()
                  }
                }}
                aria-label="New description item"
                aria-describedby="description-count"
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 self-start opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                onClick={handleAddItem}
                disabled={!newDescriptionItem.trim()}
                aria-label="Add description item"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div id="description-count" className="flex justify-end px-0.5">
              {renderCharacterCount(newDescriptionItem.length, LIMITS.DESCRIPTION_ITEM_MAX_LENGTH)}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={
            !experience.title ||
            !experience.company ||
            !experience.location ||
            !experience.startYear ||
            (!experience.endYear && !experience.isOngoing) ||
            experience.description.length === 0 ||
            experience.title.length < VALIDATION.TITLE_MIN_LENGTH ||
            experience.company.length < VALIDATION.COMPANY_MIN_LENGTH ||
            experience.location.length < VALIDATION.LOCATION_MIN_LENGTH ||
            validateYear(experience.startYear, "start") !== null ||
            (experience.endYear && validateYear(experience.endYear, "end", experience.startYear) !== null)
          }
        >
          Save Experience
        </Button>
      </DialogFooter>
    </div>
  )
}