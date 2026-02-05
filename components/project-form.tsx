"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { X, Globe, Github } from "lucide-react"
import { cn, validateUrl, formatUrl } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

const LIMITS = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  TAG_MAX_LENGTH: 20,
  MAX_TAGS: 6,
  LINK_NAME_MAX_LENGTH: 30,
  MAX_LINKS: 3,
} as const

const VALIDATION = {
  TITLE_MIN_LENGTH: 5,
  DESCRIPTION_MIN_LENGTH: 20,
  TAG_MIN_LENGTH: 2,
  LINK_NAME_MIN_LENGTH: 2,
} as const

interface Project {
  title: string
  description: string
  tags: string[]
  links: {
    name: string
    url: string
    icon: LucideIcon
  }[]
  inDevelopment: boolean
}

interface ProjectFormProps {
  project: Project
  setProject: (project: Project) => void
  onSave: () => void
  onCancel: () => void
  error: string | null
  setError: (error: string | null) => void
  newTag: string
  setNewTag: (value: string) => void
  newLink: { name: string; url: string }
  setNewLink: (value: { name: string; url: string }) => void
}

export function ProjectForm({
  project,
  setProject,
  onSave,
  onCancel,
  error,
  setError,
  newTag,
  setNewTag,
  newLink,
  setNewLink,
}: ProjectFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)
  const linkNameInputRef = useRef<HTMLInputElement>(null)

  // Focus management for title input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus()
      }
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const handleAddTag = () => {
    if (!newTag.trim()) return

    if (newTag.length > LIMITS.TAG_MAX_LENGTH) {
      setError(`Tag must be ${LIMITS.TAG_MAX_LENGTH} characters or less`)
      return
    }

    if (newTag.length < VALIDATION.TAG_MIN_LENGTH) {
      setError(`Tag must be at least ${VALIDATION.TAG_MIN_LENGTH} characters`)
      return
    }

    if (project.tags.length >= LIMITS.MAX_TAGS) {
      setError(`Maximum ${LIMITS.MAX_TAGS} tags allowed`)
      return
    }

    if (project.tags.includes(newTag.trim())) {
      setError("Tag already exists")
      return
    }

    setProject({
      ...project,
      tags: [...project.tags, newTag.trim()],
    })
    setNewTag("")
    setError(null)

    // Focus back on tag input after adding
    requestAnimationFrame(() => {
      if (tagInputRef.current) {
        tagInputRef.current.focus()
      }
    })
  }

  const handleRemoveTag = (index: number) => {
    setProject({
      ...project,
      tags: project.tags.filter((_, i) => i !== index),
    })
  }

  const handleAddLink = () => {
    if (!newLink.name.trim() || !newLink.url.trim()) return

    if (newLink.name.length > LIMITS.LINK_NAME_MAX_LENGTH) {
      setError(`Link name must be ${LIMITS.LINK_NAME_MAX_LENGTH} characters or less`)
      return
    }

    if (newLink.name.length < VALIDATION.LINK_NAME_MIN_LENGTH) {
      setError(`Link name must be at least ${VALIDATION.LINK_NAME_MIN_LENGTH} characters`)
      return
    }

    if (project.links.length >= LIMITS.MAX_LINKS) {
      setError(`Maximum ${LIMITS.MAX_LINKS} links allowed`)
      return
    }

    if (!validateUrl(newLink.url)) {
      setError("Please enter a valid URL")
      return
    }

    const formattedUrl = formatUrl(newLink.url)
    const icon = formattedUrl.includes("github.com") ? Github : Globe

    setProject({
      ...project,
      links: [...project.links, { ...newLink, url: formattedUrl, icon }],
    })
    setNewLink({ name: "", url: "" })
    setError(null)

    // Focus back on link name input after adding
    requestAnimationFrame(() => {
      if (linkNameInputRef.current) {
        linkNameInputRef.current.focus()
      }
    })
  }

  const handleRemoveLink = (index: number) => {
    setProject({
      ...project,
      links: project.links.filter((_, i) => i !== index),
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

  const hasReachedMaxTags = project.tags.length >= LIMITS.MAX_TAGS
  const hasReachedMaxLinks = project.links.length >= LIMITS.MAX_LINKS

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-muted-foreground">Maximum {LIMITS.TITLE_MAX_LENGTH} characters</span>
          {renderCharacterCount(project.title.length, LIMITS.TITLE_MAX_LENGTH)}
        </div>
        <Input
          ref={titleInputRef}
          id="title"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          placeholder="e.g., Distributed Task Queue System"
          maxLength={LIMITS.TITLE_MAX_LENGTH}
          aria-describedby="title-count"
        />
        {project.title && project.title.length < VALIDATION.TITLE_MIN_LENGTH && (
          <p className="text-sm text-destructive">Title must be at least {VALIDATION.TITLE_MIN_LENGTH} characters</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-muted-foreground">Maximum {LIMITS.DESCRIPTION_MAX_LENGTH} characters</span>
          {renderCharacterCount(project.description.length, LIMITS.DESCRIPTION_MAX_LENGTH)}
        </div>
        <Textarea
          id="description"
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          placeholder="Describe your project, its features, and technologies used"
          className="min-h-[100px] resize-none"
          maxLength={LIMITS.DESCRIPTION_MAX_LENGTH}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
            }
          }}
          aria-describedby="description-count"
        />
        {project.description && project.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH && (
          <p className="text-sm text-destructive">
            Description must be at least {VALIDATION.DESCRIPTION_MIN_LENGTH} characters
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label as="span">Tags</Label>
          <span
            className={cn(
              "text-sm",
              project.tags.length === LIMITS.MAX_TAGS
                ? "text-yellow-500 dark:text-yellow-400"
                : "text-muted-foreground",
            )}
            role="status"
            aria-live="polite"
          >
            {project.tags.length}/{LIMITS.MAX_TAGS} tags
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="gap-2 pr-1">
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemoveTag(index)
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove tag</span>
              </Button>
            </Badge>
          ))}
        </div>

        {!hasReachedMaxTags && (
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-muted-foreground">Maximum {LIMITS.TAG_MAX_LENGTH} characters</span>
                {renderCharacterCount(newTag.length, LIMITS.TAG_MAX_LENGTH)}
              </div>
              <Input
                ref={tagInputRef}
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value)
                  setError(null)
                }}
                placeholder="Add a tag"
                maxLength={LIMITS.TAG_MAX_LENGTH}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                aria-label="New tag"
              />
            </div>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                handleAddTag()
              }}
              disabled={!newTag.trim()}
            >
              Add Tag
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label as="span">Links</Label>
          <span
            className={cn(
              "text-sm",
              project.links.length === LIMITS.MAX_LINKS
                ? "text-yellow-500 dark:text-yellow-400"
                : "text-muted-foreground",
            )}
            role="status"
            aria-live="polite"
          >
            {project.links.length}/{LIMITS.MAX_LINKS} links
          </span>
        </div>

        <div className="space-y-3">
          {project.links.map((link, index) => (
            <div key={index} className="group flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <link.icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-shrink-0">{link.name}</span>
                <span className="text-sm truncate max-w-[200px]">{link.url}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemoveLink(index)
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove link</span>
              </Button>
            </div>
          ))}
        </div>

        {!hasReachedMaxLinks && (
          <div className="flex gap-2 max-w-full">
            <div className="flex-shrink-0 w-[30%]">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-muted-foreground">Max {LIMITS.LINK_NAME_MAX_LENGTH}</span>
                {renderCharacterCount(newLink.name.length, LIMITS.LINK_NAME_MAX_LENGTH)}
              </div>
              <Input
                ref={linkNameInputRef}
                value={newLink.name}
                onChange={(e) => {
                  setNewLink({ ...newLink, name: e.target.value })
                  setError(null)
                }}
                placeholder="Link name"
                maxLength={LIMITS.LINK_NAME_MAX_LENGTH}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-muted-foreground">Link URL</span>
              </div>
              <Input
                value={newLink.url}
                onChange={(e) => {
                  setNewLink({ ...newLink, url: e.target.value })
                  setError(null)
                }}
                placeholder="Link URL"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddLink()
                  }
                }}
              />
            </div>
            <div className="flex-shrink-0 self-end">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleAddLink()
                }}
                disabled={!newLink.name.trim() || !newLink.url.trim()}
              >
                Add Link
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="inDevelopment"
          checked={project.inDevelopment}
          onCheckedChange={(checked) => {
            setProject({
              ...project,
              inDevelopment: checked,
            })
          }}
        />
        <Label htmlFor="inDevelopment">Project is in development</Label>
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
            !project.title ||
            !project.description ||
            project.tags.length === 0 ||
            project.links.length === 0 ||
            project.title.length < VALIDATION.TITLE_MIN_LENGTH ||
            project.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH
          }
        >
          Save Project
        </Button>
      </DialogFooter>
    </div>
  )
}