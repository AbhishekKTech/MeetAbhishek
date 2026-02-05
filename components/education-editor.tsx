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
import { EducationCard } from "./education-card"
import { EducationForm } from "./education-form"

interface Education {
  degree: string
  institution: string
  location: string
  startYear: string
  endYear: string
  isOngoing: boolean
  description: string
}

interface EducationEditorProps {
  education: Education[]
  onChange: (education: Education[]) => void
  isEditing: boolean
}

const VALIDATION = {
  DEGREE_MIN_LENGTH: 5,
  INSTITUTION_MIN_LENGTH: 2,
  LOCATION_MIN_LENGTH: 2,
  DESCRIPTION_MIN_LENGTH: 20,
}

const MAX_EDUCATION = 5

export function EducationEditor({ education, onChange, isEditing }: EducationEditorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newEducation, setNewEducation] = useState<Education>({
    degree: "",
    institution: "",
    location: "",
    startYear: "",
    endYear: "",
    isOngoing: false,
    description: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const validateEducation = useCallback((education: Education) => {
    if (!education.degree.trim()) return "Degree is required"
    if (education.degree.length < VALIDATION.DEGREE_MIN_LENGTH)
      return `Degree must be at least ${VALIDATION.DEGREE_MIN_LENGTH} characters`

    if (!education.institution.trim()) return "Institution is required"
    if (education.institution.length < VALIDATION.INSTITUTION_MIN_LENGTH)
      return `Institution must be at least ${VALIDATION.INSTITUTION_MIN_LENGTH} characters`

    if (!education.location.trim()) return "Location is required"
    if (education.location.length < VALIDATION.LOCATION_MIN_LENGTH)
      return `Location must be at least ${VALIDATION.LOCATION_MIN_LENGTH} characters`

    if (!education.startYear) return "Start year is required"
    if (!/^\d{4}$/.test(education.startYear)) return "Start year must be a 4-digit number"

    if (!education.isOngoing && !education.endYear) return "End year is required when not ongoing"
    if (education.endYear && !/^\d{4}$/.test(education.endYear)) return "End year must be a 4-digit number"

    if (!education.description.trim()) return "Description is required"
    if (education.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH)
      return `Description must be at least ${VALIDATION.DESCRIPTION_MIN_LENGTH} characters`

    return null
  }, [])

  const handleSaveEducation = useCallback(
    (educationData: Education) => {
      const validationError = validateEducation(educationData)
      if (validationError) {
        setError(validationError)
        return
      }

      if (editingIndex !== null) {
        const updatedEducation = [...education]
        updatedEducation[editingIndex] = educationData
        onChange(updatedEducation)
        setEditingIndex(null)
      } else {
        onChange([...education, educationData])
      }

      setNewEducation({
        degree: "",
        institution: "",
        location: "",
        startYear: "",
        endYear: "",
        isOngoing: false,
        description: "",
      })
      setError(null)
      setIsAddDialogOpen(false)
      setEditingEducation(null)
    },
    [editingIndex, onChange, education, validateEducation],
  )

  const handleDeleteEducation = useCallback(
    (index: number) => {
      const updatedEducation = education.filter((_, i) => i !== index)
      onChange(updatedEducation)
      setIsDeleteDialogOpen(false)
      setDeleteIndex(null)
    },
    [onChange, education],
  )

  const sortEducationByStartYear = (educationList: Education[]) => {
    return [...educationList].sort((a, b) => {
      if (a.isOngoing && !b.isOngoing) return -1
      if (!a.isOngoing && b.isOngoing) return 1
      return Number(b.startYear) - Number(a.startYear)
    })
  }

  if (!isEditing) {
    return (
      <div className="grid gap-6">
        {education.length >= MAX_EDUCATION && (
          <p className="text-sm text-muted-foreground text-center mb-4">
            Maximum of {MAX_EDUCATION} education entries allowed
          </p>
        )}
        {sortEducationByStartYear(education).map((edu) => (
          <EducationCard key={edu.degree + edu.institution} {...edu} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={education.length >= MAX_EDUCATION}>
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Education</DialogTitle>
              <DialogDescription>Fill in the details for your educational background.</DialogDescription>
            </DialogHeader>
            <EducationForm
              education={newEducation}
              setEducation={setNewEducation}
              onSave={() => handleSaveEducation(newEducation)}
              onCancel={() => setIsAddDialogOpen(false)}
              error={error}
              setError={setError}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {sortEducationByStartYear(education).map((edu, index) => (
          <div key={edu.degree + edu.institution} className="group relative">
            <EducationCard {...edu} />
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
                <span className="sr-only">Delete education</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setEditingEducation({ ...edu })
                  setEditingIndex(index)
                  setIsAddDialogOpen(true)
                  setError(null)
                }}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit education</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Education</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this education entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteIndex(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteIndex !== null) {
                  handleDeleteEducation(deleteIndex)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isAddDialogOpen && editingEducation !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setEditingEducation(null)
            setEditingIndex(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Education</DialogTitle>
            <DialogDescription>Update your educational background details.</DialogDescription>
          </DialogHeader>
          {editingEducation && (
            <EducationForm
              education={editingEducation}
              setEducation={setEditingEducation}
              onSave={() => handleSaveEducation(editingEducation)}
              onCancel={() => {
                setIsAddDialogOpen(false)
                setEditingEducation(null)
                setEditingIndex(null)
              }}
              error={error}
              setError={setError}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

