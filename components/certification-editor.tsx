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
import { CertificationCard } from "./certification-card"
import { CertificationForm } from "./certification-form"
import { validateUrl, formatUrl } from "@/lib/utils"

interface Certification {
  title: string
  issuer: string
  issueDate: string
  expiryDate: string
  credentialId: string
  credentialUrl: string
  description: string
}

interface CertificationEditorProps {
  certifications: Certification[]
  onChange: (certifications: Certification[]) => void
  isEditing: boolean
}

const VALIDATION = {
  TITLE_MIN_LENGTH: 5,
  ISSUER_MIN_LENGTH: 2,
  CREDENTIAL_ID_MIN_LENGTH: 3,
  DESCRIPTION_MIN_LENGTH: 20,
}

const MAX_CERTIFICATIONS = 8

export function CertificationEditor({ certifications, onChange, isEditing }: CertificationEditorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newCertification, setNewCertification] = useState<Certification>({
    title: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
    description: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const validateCertification = useCallback((certification: Certification) => {
    if (!certification.title.trim()) return "Title is required"
    if (certification.title.length < VALIDATION.TITLE_MIN_LENGTH)
      return `Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters`

    if (!certification.issuer.trim()) return "Issuer is required"
    if (certification.issuer.length < VALIDATION.ISSUER_MIN_LENGTH)
      return `Issuer must be at least ${VALIDATION.ISSUER_MIN_LENGTH} characters`

    if (!certification.issueDate.trim()) return "Issue date is required"
    // Remove expiry date validation as it's optional

    if (!certification.credentialId.trim()) return "Credential ID is required"
    if (certification.credentialId.length < VALIDATION.CREDENTIAL_ID_MIN_LENGTH)
      return `Credential ID must be at least ${VALIDATION.CREDENTIAL_ID_MIN_LENGTH} characters`

    // Make credential URL validation optional
    if (certification.credentialUrl) {
      try {
        new URL(certification.credentialUrl)
      } catch {
        return "Please enter a valid credential URL"
      }
    }

    if (!certification.description.trim()) return "Description is required"
    if (certification.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH)
      return `Description must be at least ${VALIDATION.DESCRIPTION_MIN_LENGTH} characters`

    return null
  }, [])

  const handleSaveCertification = useCallback(
    (certificationData: Certification) => {
      const validationError = validateCertification(certificationData)
      if (validationError) {
        setError(validationError)
        return
      }

      // Format the credential URL if provided
      const formattedCertification = {
        ...certificationData,
        credentialUrl: certificationData.credentialUrl ? formatUrl(certificationData.credentialUrl) : "",
      }

      if (editingIndex !== null) {
        const updatedCertifications = [...certifications]
        updatedCertifications[editingIndex] = formattedCertification
        onChange(updatedCertifications)
        setEditingIndex(null)
      } else {
        onChange([...certifications, formattedCertification])
      }

      setNewCertification({
        title: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        credentialUrl: "",
        description: "",
      })
      setError(null)
      setIsAddDialogOpen(false)
      setEditingCertification(null)
    },
    [editingIndex, onChange, certifications, validateCertification],
  )

  const handleDeleteCertification = useCallback(
    (index: number) => {
      const updatedCertifications = certifications.filter((_, i) => i !== index)
      onChange(updatedCertifications)
      setIsDeleteDialogOpen(false)
      setDeleteIndex(null)
    },
    [onChange, certifications],
  )

  // Sort certifications by priority
  //const sortedCertifications = [...certifications].sort((a, b) => a.priority - b.priority)

  if (!isEditing) {
    return (
      <div className="grid gap-6">
        {certifications.length >= MAX_CERTIFICATIONS && (
          <p className="text-sm text-muted-foreground text-center mb-4">
            Maximum of {MAX_CERTIFICATIONS} certifications allowed
          </p>
        )}
        {certifications.map((certification) => (
          <CertificationCard key={certification.credentialId} {...certification} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={certifications.length >= MAX_CERTIFICATIONS}>
              <Plus className="h-4 w-4" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Certification</DialogTitle>
              <DialogDescription>Fill in the details for your certification.</DialogDescription>
            </DialogHeader>
            <CertificationForm
              certification={newCertification}
              setCertification={setNewCertification}
              onSave={() => handleSaveCertification(newCertification)}
              onCancel={() => setIsAddDialogOpen(false)}
              error={error}
              setError={setError}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {certifications.map((certification, index) => (
          <div key={certification.credentialId} className="group relative">
            {/* Remove priority number display div */}
            <CertificationCard {...certification} />
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
                <span className="sr-only">Delete certification</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setEditingCertification({ ...certification })
                  setEditingIndex(index)
                  setIsAddDialogOpen(true)
                  setError(null)
                }}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit certification</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this certification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteIndex(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteIndex !== null) {
                  handleDeleteCertification(deleteIndex)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isAddDialogOpen && editingCertification !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setEditingCertification(null)
            setEditingIndex(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
            <DialogDescription>Update your certification details.</DialogDescription>
          </DialogHeader>
          {editingCertification && (
            <CertificationForm
              certification={editingCertification}
              setCertification={setEditingCertification}
              onSave={() => handleSaveCertification(editingCertification)}
              onCancel={() => {
                setIsAddDialogOpen(false)
                setEditingCertification(null)
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

