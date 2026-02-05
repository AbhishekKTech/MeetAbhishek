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
import { ProjectCard } from "./project-card"
import { ProjectForm } from "./project-form"
import type { LucideIcon } from "lucide-react"

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

interface ProjectEditorProps {
  projects: Project[]
  onChange: (projects: Project[]) => void
  isEditing: boolean
}

const VALIDATION = {
  TITLE_MIN_LENGTH: 5,
  DESCRIPTION_MIN_LENGTH: 20,
  TAG_MIN_LENGTH: 2,
  LINK_NAME_MIN_LENGTH: 2,
}

const MAX_PROJECTS = 12

export function ProjectEditor({ projects, onChange, isEditing }: ProjectEditorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newProject, setNewProject] = useState<Project>({
    title: "",
    description: "",
    tags: [],
    links: [],
    inDevelopment: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newLink, setNewLink] = useState({ name: "", url: "" })

  const validateProject = useCallback((project: Project) => {
    if (!project.title.trim()) return "Title is required"
    if (project.title.length < VALIDATION.TITLE_MIN_LENGTH)
      return `Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters`

    if (!project.description.trim()) return "Description is required"
    if (project.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH)
      return `Description must be at least ${VALIDATION.DESCRIPTION_MIN_LENGTH} characters`

    if (project.tags.length === 0) return "At least one tag is required"
    if (project.links.length === 0) return "At least one link is required"

    return null
  }, [])

  const handleSaveProject = useCallback(
    (projectData: Project) => {
      const validationError = validateProject(projectData)
      if (validationError) {
        setError(validationError)
        return
      }

      if (editingIndex !== null) {
        const updatedProjects = [...projects]
        updatedProjects[editingIndex] = projectData
        onChange(updatedProjects)
        setEditingIndex(null)
      } else {
        onChange([...projects, projectData])
      }

      setNewProject({
        title: "",
        description: "",
        tags: [],
        links: [],
        inDevelopment: false,
      })
      setError(null)
      setIsAddDialogOpen(false)
      setEditingProject(null)
      setNewTag("")
      setNewLink({ name: "", url: "" })
    },
    [editingIndex, onChange, projects, validateProject],
  )

  const handleDeleteProject = useCallback(
    (index: number) => {
      const updatedProjects = projects.filter((_, i) => i !== index)
      onChange(updatedProjects)
      setIsDeleteDialogOpen(false)
      setDeleteIndex(null)
    },
    [onChange, projects],
  )

  if (!isEditing) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {projects.length >= MAX_PROJECTS && (
        <p className="text-sm text-muted-foreground text-center mb-4">Maximum of {MAX_PROJECTS} projects allowed</p>
      )}
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={projects.length >= MAX_PROJECTS}>
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>Fill in the details for your project.</DialogDescription>
            </DialogHeader>
            <ProjectForm
              project={newProject}
              setProject={setNewProject}
              onSave={() => handleSaveProject(newProject)}
              onCancel={() => setIsAddDialogOpen(false)}
              error={error}
              setError={setError}
              newTag={newTag}
              setNewTag={setNewTag}
              newLink={newLink}
              setNewLink={setNewLink}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {projects.map((project, index) => (
          <div key={project.title} className="group relative">
            <ProjectCard {...project} />
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
                <span className="sr-only">Delete project</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setEditingProject({ ...project })
                  setEditingIndex(index)
                  setIsAddDialogOpen(true)
                  setError(null)
                }}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit project</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteIndex(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteIndex !== null) {
                  handleDeleteProject(deleteIndex)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isAddDialogOpen && editingProject !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setEditingProject(null)
            setEditingIndex(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update your project details.</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <ProjectForm
              project={editingProject}
              setProject={setEditingProject}
              onSave={() => handleSaveProject(editingProject)}
              onCancel={() => {
                setIsAddDialogOpen(false)
                setEditingProject(null)
                setEditingIndex(null)
              }}
              error={error}
              setError={setError}
              newTag={newTag}
              setNewTag={setNewTag}
              newLink={newLink}
              setNewLink={setNewLink}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

