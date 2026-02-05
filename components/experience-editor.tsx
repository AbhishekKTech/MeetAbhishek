"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { ExperienceCard } from "./experience-card"
import { ExperienceForm } from "./experience-form"

interface Experience {
  title: string
  company: string
  location: string
  startYear: string
  endYear: string
  isOngoing: boolean
  description: string[]
}

interface ExperienceEditorProps {
  experiences: Experience[]
  onChange: (experiences: Experience[]) => void
  isEditing: boolean
}

const VALIDATION = {
  TITLE_MIN_LENGTH: 5,
  COMPANY_MIN_LENGTH: 2,
  LOCATION_MIN_LENGTH: 2,
}

const MAX_EXPERIENCES = 10

export function ExperienceEditor({ experiences, onChange, isEditing }: ExperienceEditorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newExperience, setNewExperience] = useState<Experience>({
    title: "",
    company: "",
    location: "",
    startYear: "",
    endYear: "",
    isOngoing: false,
    description: [],
  })
  const [error, setError] = useState<string | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newDescriptionItem, setNewDescriptionItem] = useState("")

  const validateExperience = useCallback((experience: Experience) => {
    if (!experience.title.trim()) return "Title is required"
    if (experience.title.length < VALIDATION.TITLE_MIN_LENGTH)
      return `Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters`

    if (!experience.company.trim()) return "Company is required"
    if (experience.company.length < VALIDATION.COMPANY_MIN_LENGTH)
      return `Company must be at least ${VALIDATION.COMPANY_MIN_LENGTH} characters`

    if (!experience.location.trim()) return "Location is required"
    if (experience.location.length < VALIDATION.LOCATION_MIN_LENGTH)
      return `Location must be at least ${VALIDATION.LOCATION_MIN_LENGTH} characters`

    if (!experience.startYear) return "Start year is required"
    if (!/^\d{4}$/.test(experience.startYear)) return "Start year must be a 4-digit number"

    if (!experience.isOngoing && !experience.endYear) return "End year is required when not ongoing"
    if (experience.endYear && !/^\d{4}$/.test(experience.endYear)) return "End year must be a 4-digit number"

    if (experience.description.length === 0) return "At least one description item is required"

    return null
  }, [])

  const handleSaveExperience = useCallback(
    (experienceData: Experience) => {
      const validationError = validateExperience(experienceData)
      if (validationError) {
        setError(validationError)
        return
      }

      if (editingIndex !== null) {
        const updatedExperiences = [...experiences]
        updatedExperiences[editingIndex] = experienceData
        onChange(updatedExperiences)
        setEditingIndex(null)
      } else {
        onChange([...experiences, experienceData])
      }

      setNewExperience({
        title: "",
        company: "",
        location: "",
        startYear: "",
        endYear: "",
        isOngoing: false,
        description: [],
      })
      setError(null)
      setIsAddDialogOpen(false)
      setEditingExperience(null)
      setNewDescriptionItem("")
    },
    [editingIndex, onChange, experiences, validateExperience],
  )

  const handleDeleteExperience = useCallback(
    (index: number) => {
      const updatedExperiences = experiences.filter((_, i) => i !== index)
      onChange(updatedExperiences)
      setIsDeleteDialogOpen(false)
      setDeleteIndex(null)
    },
    [onChange, experiences],
  )

  const sortExperiencesByStartYear = (experienceList: Experience[]) => {
    return [...experienceList].sort((a, b) => {
      if (a.isOngoing && !b.isOngoing) return -1
      if (!a.isOngoing && b.isOngoing) return 1
      return Number(b.startYear) - Number(a.startYear)
    })
  }

  if (!isEditing) {
    return (
      <div className="grid gap-6">
        {experiences.length >= MAX_EXPERIENCES && (
          <p className="text-sm text-muted-foreground text-center mb-4">
            Maximum of {MAX_EXPERIENCES} experiences allowed
          </p>
        )}
        {sortExperiencesByStartYear(experiences).map((experience) => (
          <ExperienceCard key={experience.title + experience.company} {...experience} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={experiences.length >= MAX_EXPERIENCES}>
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Experience</DialogTitle>
              <DialogDescription>Fill in the details for your work experience.</DialogDescription>
            </DialogHeader>
            <ExperienceForm
              experience={newExperience}
              setExperience={setNewExperience}
              onSave={() => handleSaveExperience(newExperience)}
              onCancel={() => setIsAddDialogOpen(false)}
              error={error}
              setError={setError}
              newDescriptionItem={newDescriptionItem}
              setNewDescriptionItem={setNewDescriptionItem}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {sortExperiencesByStartYear(experiences).map((experience, index) => (
          <div key={experience.title + experience.company} className="group relative">
            <ExperienceCard {...experience} />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setDeleteIndex(index)
                  setIsDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete experience</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setEditingExperience({ ...experience })
                  setEditingIndex(index)
                  setIsAddDialogOpen(true)
                  setError(null)
                }}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit experience</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this experience? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteIndex(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteIndex !== null) {
                  handleDeleteExperience(deleteIndex)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isAddDialogOpen && editingExperience !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setEditingExperience(null)
            setEditingIndex(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
            <DialogDescription>Update your work experience details.</DialogDescription>
          </DialogHeader>
          {editingExperience && (
            <ExperienceForm
              experience={editingExperience}
              setExperience={setEditingExperience}
              onSave={() => handleSaveExperience(editingExperience)}
              onCancel={() => {
                setIsAddDialogOpen(false)
                setEditingExperience(null)
                setEditingIndex(null)
              }}
              error={error}
              setError={setError}
              newDescriptionItem={newDescriptionItem}
              setNewDescriptionItem={setNewDescriptionItem}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

