"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn, validateUrl, formatUrl } from "@/lib/utils"
import Image from "next/image"

const LIMITS = {
  TITLE_MAX_LENGTH: 100,
  ISSUER_MAX_LENGTH: 75,
  CREDENTIAL_ID_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
} as const

const VALIDATION = {
  TITLE_MIN_LENGTH: 5,
  ISSUER_MIN_LENGTH: 2,
  CREDENTIAL_ID_MIN_LENGTH: 3,
  DESCRIPTION_MIN_LENGTH: 20,
} as const

function validateDate(date: string, type: "issue" | "expiry", issueDate?: string): string | null {
  if (!date) return type === "issue" ? "Date is required" : null // Only issue date is required

  const dateRegex = /^\d{4}$/
  if (!dateRegex.test(date)) {
    return "Date must be a valid year (YYYY)"
  }

  const year = Number.parseInt(date)
  const currentYear = new Date().getFullYear()

  if (year < 1900 || year > currentYear + 10) {
    return `Year must be between 1900 and ${currentYear + 10}`
  }

  // Additional validation for expiry date
  if (type === "expiry" && issueDate) {
    const issueYear = Number.parseInt(issueDate)
    if (year < issueYear) {
      return "Expiry date cannot be before issue date"
    }
    if (year < currentYear) {
      return "Expiry date cannot be in the past"
    }
  }

  return null
}

interface Certification {
  title: string
  issuer: string
  issueDate: string
  expiryDate: string
  credentialId: string
  credentialUrl: string
  badgeUrl: string
  description: string
}

interface CertificationFormProps {
  certification: Certification
  setCertification: (certification: Certification) => void
  onSave: () => void
  onCancel: () => void
  error: string | null
  setError: (error: string | null) => void
}

export function CertificationForm({
  certification,
  setCertification,
  onSave,
  onCancel,
  error,
  setError,
}: CertificationFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Focus management for title input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus()
      }
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const validateCertification = (certification: Certification) => {
    if (!certification.title.trim()) return "Title is required"
    if (certification.title.length < VALIDATION.TITLE_MIN_LENGTH)
      return `Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters`

    if (!certification.issuer.trim()) return "Issuer is required"
    if (certification.issuer.length < VALIDATION.ISSUER_MIN_LENGTH)
      return `Issuer must be at least ${VALIDATION.ISSUER_MIN_LENGTH} characters`

    if (!certification.issueDate.trim()) return "Issue date is required"
    const issueDateError = validateDate(certification.issueDate, "issue")
    if (issueDateError) return issueDateError

    if (certification.expiryDate) {
      const expiryDateError = validateDate(certification.expiryDate, "expiry", certification.issueDate)
      if (expiryDateError) return expiryDateError
    }

    if (!certification.credentialId.trim()) return "Credential ID is required"
    if (certification.credentialId.length < VALIDATION.CREDENTIAL_ID_MIN_LENGTH)
      return `Credential ID must be at least ${VALIDATION.CREDENTIAL_ID_MIN_LENGTH} characters`

    // Make credential URL and badge URL validation optional but validate if provided
    if (certification.credentialUrl && !validateUrl(certification.credentialUrl)) {
      return "Please enter a valid credential URL"
    }

    if (certification.badgeUrl && !validateUrl(certification.badgeUrl)) {
      return "Please enter a valid badge URL"
    }

    if (!certification.description.trim()) return "Description is required"
    if (certification.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH)
      return `Description must be at least ${VALIDATION.DESCRIPTION_MIN_LENGTH} characters`

    return null
  }

  const handleSave = () => {
    const validationError = validateCertification(certification)
    if (validationError) {
      setError(validationError)
      return
    }

    // Format the URLs if provided
    const formattedCertification = {
      ...certification,
      credentialUrl: certification.credentialUrl ? formatUrl(certification.credentialUrl) : "",
      badgeUrl: certification.badgeUrl ? formatUrl(certification.badgeUrl) : "",
    }

    setCertification(formattedCertification)
    onSave()
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

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-muted-foreground">Maximum {LIMITS.TITLE_MAX_LENGTH} characters</span>
          {renderCharacterCount(certification.title.length, LIMITS.TITLE_MAX_LENGTH)}
        </div>
        <Input
          ref={titleInputRef}
          id="title"
          value={certification.title}
          onChange={(e) => setCertification({ ...certification, title: e.target.value })}
          placeholder="e.g., AWS Certified Solutions Architect"
          maxLength={LIMITS.TITLE_MAX_LENGTH}
          aria-describedby="title-count"
        />
        {certification.title && certification.title.length < VALIDATION.TITLE_MIN_LENGTH && (
          <p className="text-sm text-destructive">Title must be at least {VALIDATION.TITLE_MIN_LENGTH} characters</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="issuer">Issuer</Label>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-muted-foreground">Maximum {LIMITS.ISSUER_MAX_LENGTH} characters</span>
          {renderCharacterCount(certification.issuer.length, LIMITS.ISSUER_MAX_LENGTH)}
        </div>
        <Input
          id="issuer"
          value={certification.issuer}
          onChange={(e) => setCertification({ ...certification, issuer: e.target.value })}
          placeholder="e.g., Amazon Web Services"
          maxLength={LIMITS.ISSUER_MAX_LENGTH}
          aria-describedby="issuer-count"
        />
        {certification.issuer && certification.issuer.length < VALIDATION.ISSUER_MIN_LENGTH && (
          <p className="text-sm text-destructive">Issuer must be at least {VALIDATION.ISSUER_MIN_LENGTH} characters</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            value={certification.issueDate}
            onChange={(e) => setCertification({ ...certification, issueDate: e.target.value })}
            placeholder="YYYY"
          />
          {certification.issueDate && validateDate(certification.issueDate, "issue") && (
            <p className="text-sm text-destructive">{validateDate(certification.issueDate, "issue")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
          <Input
            id="expiryDate"
            value={certification.expiryDate}
            onChange={(e) => setCertification({ ...certification, expiryDate: e.target.value })}
            placeholder="YYYY"
          />
          {certification.expiryDate && validateDate(certification.expiryDate, "expiry", certification.issueDate) && (
            <p className="text-sm text-destructive">
              {validateDate(certification.expiryDate, "expiry", certification.issueDate)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="credentialId">Credential ID</Label>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-muted-foreground">Maximum {LIMITS.CREDENTIAL_ID_MAX_LENGTH} characters</span>
          {renderCharacterCount(certification.credentialId.length, LIMITS.CREDENTIAL_ID_MAX_LENGTH)}
        </div>
        <Input
          id="credentialId"
          value={certification.credentialId}
          onChange={(e) => setCertification({ ...certification, credentialId: e.target.value })}
          placeholder="e.g., AWS-PSA-123456"
          maxLength={LIMITS.CREDENTIAL_ID_MAX_LENGTH}
          aria-describedby="credential-id-count"
        />
        {certification.credentialId && certification.credentialId.length < VALIDATION.CREDENTIAL_ID_MIN_LENGTH && (
          <p className="text-sm text-destructive">
            Credential ID must be at least {VALIDATION.CREDENTIAL_ID_MIN_LENGTH} characters
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="credentialUrl">Credential URL (Optional)</Label>
        <Input
          id="credentialUrl"
          value={certification.credentialUrl}
          onChange={(e) => setCertification({ ...certification, credentialUrl: e.target.value })}
          placeholder="www.example.com or https://example.com"
        />
        {certification.credentialUrl && !validateUrl(certification.credentialUrl) && (
          <p className="text-sm text-destructive">Please enter a valid URL</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="badgeUrl">Badge Image URL (Optional)</Label>
        <Input
          id="badgeUrl"
          value={certification.badgeUrl}
          onChange={(e) => setCertification({ ...certification, badgeUrl: e.target.value })}
          placeholder="www.example.com/badge.png or https://example.com/badge.png"
        />
        {certification.badgeUrl && !validateUrl(certification.badgeUrl) && (
          <p className="text-sm text-destructive">Please enter a valid URL</p>
        )}
        {certification.badgeUrl && validateUrl(certification.badgeUrl) && (
          <div className="mt-2">
            <Label>Badge Preview</Label>
            <div className="relative w-20 h-20 mt-1 rounded-lg overflow-hidden bg-background">
              <Image
                src={certification.badgeUrl || "/placeholder.svg"}
                alt="Badge preview"
                fill
                className="object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement
                  img.src = "/placeholder.svg"
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-muted-foreground">Maximum {LIMITS.DESCRIPTION_MAX_LENGTH} characters</span>
          {renderCharacterCount(certification.description.length, LIMITS.DESCRIPTION_MAX_LENGTH)}
        </div>
        <Textarea
          id="description"
          value={certification.description}
          onChange={(e) => setCertification({ ...certification, description: e.target.value })}
          placeholder="Describe what this certification represents and what you learned"
          className="min-h-[100px] resize-none"
          maxLength={LIMITS.DESCRIPTION_MAX_LENGTH}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
            }
          }}
          aria-describedby="description-count"
        />
        {certification.description && certification.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH && (
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
          onClick={handleSave}
          disabled={
            !certification.title ||
            !certification.issuer ||
            !certification.issueDate ||
            !certification.credentialId ||
            !certification.description ||
            certification.title.length < VALIDATION.TITLE_MIN_LENGTH ||
            certification.issuer.length < VALIDATION.ISSUER_MIN_LENGTH ||
            certification.credentialId.length < VALIDATION.CREDENTIAL_ID_MIN_LENGTH ||
            certification.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH ||
            validateDate(certification.issueDate, "issue") !== null ||
            (certification.expiryDate &&
              validateDate(certification.expiryDate, "expiry", certification.issueDate) !== null) ||
            (certification.credentialUrl && !validateUrl(certification.credentialUrl)) ||
            (certification.badgeUrl && !validateUrl(certification.badgeUrl))
          }
        >
          Save Certification
        </Button>
      </DialogFooter>
    </div>
  )
}