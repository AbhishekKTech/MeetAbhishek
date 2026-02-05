"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const LIMITS = {
  DEGREE_MAX_LENGTH: 100,
  INSTITUTION_MAX_LENGTH: 75,
  LOCATION_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
} as const

const VALIDATION = {
  DEGREE_MIN_LENGTH: 5,
  INSTITUTION_MIN_LENGTH: 2,
  LOCATION_MIN_LENGTH: 2,
  DESCRIPTION_MIN_LENGTH: 20,
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

interface Education {
  degree: string
  institution: string
  location: string
  startYear: string
  endYear: string
  isOngoing: boolean
  description: string
}

interface EducationFormProps {
  education: Education
  setEducation: (education: Education) => void
  onSave: () => void
  onCancel: () => void
  error: string | null
  setError: (error: string | null) => void
}

export function EducationForm({ education, setEducation, onSave, onCancel, error, setError }: EducationFormProps) {
  const degreeInputRef = useRef<HTMLInputElement>(null)

  // Focus management for degree input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (degreeInputRef.current) {
        degreeInputRef.current.focus()
      }
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

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

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      <div className="space-y-2">
        <Label htmlFor="degree">Degree</Label>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-muted-foreground">Maximum {LIMITS.DEGREE_MAX_LENGTH} characters</span>
          {renderCharacterCount(education.degree.length, LIMITS.DEGREE_MAX_LENGTH)}
        </div>
        <Input
          ref={degreeInputRef}
          id="degree"
          value={education.degree}
          onChange={(e) => setEducation({ ...education, degree: e.target.value })}
          placeholder="e.g., Bachelor of Science in Computer Science"
          maxLength={LIMITS.DEGREE_MAX_LENGTH}
          aria-describedby="degree-count"
        />
        {education.degree && education.degree.length < VALIDATION.DEGREE_MIN_LENGTH && (
          <p className="text-sm text-destructive">Degree must be at least {VALIDATION.DEGREE_MIN_LENGTH} characters</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="institution">Institution</Label>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-muted-foreground">Maximum {LIMITS.INSTITUTION_MAX_LENGTH} characters</span>
          {renderCharacterCount(education.institution.length, LIMITS.INSTITUTION_MAX_LENGTH)}
        </div>
        <Input
          id="institution"
          value={education.institution}
          onChange={(e) => setEducation({ ...education, institution: e.target.value })}
          placeholder="e.g., University of Technology"
          maxLength={LIMITS.INSTITUTION_MAX_LENGTH}
          aria-describedby="institution-count"
        />
        {education.institution && education.institution.length < VALIDATION.INSTITUTION_MIN_LENGTH && (
          <p className="text-sm text-destructive">
            Institution must be at least {VALIDATION.INSTITUTION_MIN_LENGTH} characters
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-muted-foreground">Maximum {LIMITS.LOCATION_MAX_LENGTH} characters</span>
          {renderCharacterCount(education.location.length, LIMITS.LOCATION_MAX_LENGTH)}
        </div>
        <Input
          id="location"
          value={education.location}
          onChange={(e) => setEducation({ ...education, location: e.target.value })}
          placeholder="e.g., San Francisco, CA"
          maxLength={LIMITS.LOCATION_MAX_LENGTH}
          aria-describedby="location-count"
        />
        {education.location && education.location.length < VALIDATION.LOCATION_MIN_LENGTH && (
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
            value={education.startYear}
            onChange={(e) => setEducation({ ...education, startYear: e.target.value })}
            placeholder="YYYY"
            maxLength={4}
          />
          {education.startYear && validateYear(education.startYear, "start") && (
            <p className="text-sm text-destructive">{validateYear(education.startYear, "start")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endYear">End Year</Label>
          <Input
            id="endYear"
            value={education.endYear}
            onChange={(e) => setEducation({ ...education, endYear: e.target.value })}
            placeholder="YYYY"
            maxLength={4}
            disabled={education.isOngoing}
          />
          {education.endYear && validateYear(education.endYear, "end", education.startYear) && (
            <p className="text-sm text-destructive">{validateYear(education.endYear, "end", education.startYear)}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isOngoing"
          checked={education.isOngoing}
          onCheckedChange={(checked) => {
            setEducation({
              ...education,
              isOngoing: checked as boolean,
              endYear: checked ? "" : education.endYear,
            })
          }}
        />
        <Label htmlFor="isOngoing">Currently studying here</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-muted-foreground">Maximum {LIMITS.DESCRIPTION_MAX_LENGTH} characters</span>
          {renderCharacterCount(education.description.length, LIMITS.DESCRIPTION_MAX_LENGTH)}
        </div>
        <Textarea
          id="description"
          value={education.description}
          onChange={(e) => setEducation({ ...education, description: e.target.value })}
          placeholder="Describe your academic achievements, research focus, or relevant coursework"
          className="min-h-[100px] resize-none"
          maxLength={LIMITS.DESCRIPTION_MAX_LENGTH}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
            }
          }}
          aria-describedby="description-count"
        />
        {education.description && education.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH && (
          <p className="text-sm text-destructive">
            Description must be at least {VALIDATION.DESCRIPTION_MIN_LENGTH} characters
          </p>
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
            !education.degree ||
            !education.institution ||
            !education.location ||
            !education.startYear ||
            (!education.endYear && !education.isOngoing) ||
            !education.description ||
            education.degree.length < VALIDATION.DEGREE_MIN_LENGTH ||
            education.institution.length < VALIDATION.INSTITUTION_MIN_LENGTH ||
            education.location.length < VALIDATION.LOCATION_MIN_LENGTH ||
            education.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH ||
            validateYear(education.startYear, "start") !== null ||
            (education.endYear && validateYear(education.endYear, "end", education.startYear) !== null)
          }
        >
          Save Education
        </Button>
      </DialogFooter>
    </div>
  )
}