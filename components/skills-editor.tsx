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
import { SkillForm } from "./skill-form"
import { SkillCategoryForm } from "./skill-category-form"

interface Skill {
  name: string
  icon: string
}

interface SkillCategory {
  category: string
  items: Skill[]
}

interface SkillsEditorProps {
  skills: SkillCategory[]
  onChange: (skills: SkillCategory[]) => void
  isEditing: boolean
}

export function SkillsEditor({ skills, onChange, isEditing }: SkillsEditorProps) {
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null)
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null)
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleteCategoryIndex, setDeleteCategoryIndex] = useState<number | null>(null)
  const [deleteSkillIndices, setDeleteSkillIndices] = useState<{ category: number; skill: number } | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteType, setDeleteType] = useState<"category" | "skill" | null>(null)

  const handleSaveCategory = useCallback(
    (categoryData: SkillCategory) => {
      if (editingCategoryIndex !== null) {
        const updatedSkills = [...skills]
        updatedSkills[editingCategoryIndex] = categoryData
        onChange(updatedSkills)
        setEditingCategoryIndex(null)
      } else {
        onChange([...skills, categoryData])
      }

      setEditingCategory(null)
      setError(null)
      setIsAddCategoryDialogOpen(false)
    },
    [editingCategoryIndex, onChange, skills],
  )

  const handleSaveSkill = useCallback(
    (skillData: Skill) => {
      if (selectedCategoryIndex === null) return

      const updatedSkills = [...skills]
      if (editingSkillIndex !== null) {
        updatedSkills[selectedCategoryIndex].items[editingSkillIndex] = skillData
      } else {
        updatedSkills[selectedCategoryIndex].items.push(skillData)
      }

      onChange(updatedSkills)
      setEditingSkill(null)
      setEditingSkillIndex(null)
      setError(null)
      setIsAddSkillDialogOpen(false)
    },
    [selectedCategoryIndex, editingSkillIndex, onChange, skills],
  )

  const handleDeleteCategory = useCallback(
    (index: number) => {
      const updatedSkills = skills.filter((_, i) => i !== index)
      onChange(updatedSkills)
      setIsDeleteDialogOpen(false)
      setDeleteCategoryIndex(null)
      setDeleteType(null)
    },
    [onChange, skills],
  )

  const handleDeleteSkill = useCallback(
    (categoryIndex: number, skillIndex: number) => {
      const updatedSkills = [...skills]
      updatedSkills[categoryIndex].items = updatedSkills[categoryIndex].items.filter((_, i) => i !== skillIndex)
      onChange(updatedSkills)
      setIsDeleteDialogOpen(false)
      setDeleteSkillIndices(null)
      setDeleteType(null)
    },
    [onChange, skills],
  )

  if (!isEditing) {
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {skills.map((category) => (
          <div key={category.category}>
            <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
            <div className="flex flex-wrap gap-3">
              {category.items.map((skill) => (
                <div key={skill.name} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5 text-sm">
                  <img src={skill.icon || "/placeholder.svg"} alt={skill.name} className="w-4 h-4" />
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Skill Category</DialogTitle>
              <DialogDescription>Create a new category to group related skills.</DialogDescription>
            </DialogHeader>
            <SkillCategoryForm
              category={editingCategory || { category: "", items: [] }}
              setCategory={setEditingCategory}
              onSave={() => editingCategory && handleSaveCategory(editingCategory)}
              onCancel={() => {
                setIsAddCategoryDialogOpen(false)
                setEditingCategory(null)
                setEditingCategoryIndex(null)
              }}
              error={error}
              setError={setError}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {skills.map((category, categoryIndex) => (
          <div key={category.category} className="group relative space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{category.category}</h3>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setDeleteType("category")
                    setDeleteCategoryIndex(categoryIndex)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete category</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditingCategory({ ...category })
                    setEditingCategoryIndex(categoryIndex)
                    setIsAddCategoryDialogOpen(true)
                    setError(null)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit category</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {category.items.map((skill, skillIndex) => (
                <div
                  key={skill.name}
                  className="group/skill relative flex items-center gap-2 bg-muted/50 rounded-full pl-3 pr-1 py-1.5 text-sm"
                >
                  <img src={skill.icon || "/placeholder.svg"} alt={skill.name} className="w-4 h-4" />
                  <span>{skill.name}</span>
                  <div className="flex opacity-0 group-hover/skill:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setDeleteType("skill")
                        setDeleteSkillIndices({ category: categoryIndex, skill: skillIndex })
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Delete skill</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setSelectedCategoryIndex(categoryIndex)
                        setEditingSkill({ ...skill })
                        setEditingSkillIndex(skillIndex)
                        setIsAddSkillDialogOpen(true)
                        setError(null)
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                      <span className="sr-only">Edit skill</span>
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  setSelectedCategoryIndex(categoryIndex)
                  setEditingSkill(null)
                  setEditingSkillIndex(null)
                  setIsAddSkillDialogOpen(true)
                }}
              >
                <Plus className="h-3 w-3" />
                Add Skill
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddSkillDialogOpen} onOpenChange={setIsAddSkillDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
            <DialogDescription>
              {editingSkill
                ? "Update the skill details."
                : `Add a new skill to ${selectedCategoryIndex !== null ? skills[selectedCategoryIndex].category : ""}`}
            </DialogDescription>
          </DialogHeader>
          <SkillForm
            skill={editingSkill || { name: "", icon: "" }}
            setSkill={setEditingSkill}
            onSave={() => editingSkill && handleSaveSkill(editingSkill)}
            onCancel={() => {
              setIsAddSkillDialogOpen(false)
              setEditingSkill(null)
              setEditingSkillIndex(null)
            }}
            error={error}
            setError={setError}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteType === "category" ? "Category" : "Skill"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteCategoryIndex(null)
                setDeleteSkillIndices(null)
                setDeleteType(null)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteType === "category" && deleteCategoryIndex !== null) {
                  handleDeleteCategory(deleteCategoryIndex)
                } else if (deleteType === "skill" && deleteSkillIndices !== null) {
                  handleDeleteSkill(deleteSkillIndices.category, deleteSkillIndices.skill)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}