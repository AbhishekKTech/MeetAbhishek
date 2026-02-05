"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check } from "lucide-react"
import { cn, validateUrl } from "@/lib/utils"
import { getAllSkills } from "@/lib/skill-icons"

interface Skill {
  name: string
  icon: string
}

interface SkillFormProps {
  skill: Skill
  setSkill: (skill: Skill) => void
  onSave: (skill: Skill) => void
  onCancel: () => void
  error: string | null
  setError: (error: string | null) => void
}

const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 30,
}

export function SkillForm({ skill, setSkill, onSave, onCancel, error, setError }: SkillFormProps) {
  const [mode, setMode] = useState<"search" | "custom">("search")
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const customNameInputRef = useRef<HTMLInputElement>(null)

  // Get all available skills for searching
  const allSkills = getAllSkills()
  const flatSkills = allSkills.flatMap((category) => ({
    category: category.category,
    items: category.items,
  }))

  // Filter skills based on search query
  const filteredSkills = searchQuery
    ? flatSkills
        .map((category) => ({
          category: category.category,
          items: category.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
        }))
        .filter((category) => category.items.length > 0)
    : []

  // Focus management
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mode === "search" && searchInputRef.current) {
        searchInputRef.current.focus()
      } else if (mode === "custom" && customNameInputRef.current) {
        customNameInputRef.current.focus()
      }
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [mode])

  const handleSelect = (selectedSkill: Skill) => {
    setSkill(selectedSkill)
    setSearchQuery("")
    setError(null)
  }

  const validateCustomSkill = (name: string, icon: string) => {
    if (name.length < VALIDATION.NAME_MIN_LENGTH) {
      return `Skill name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`
    }
    if (name.length > VALIDATION.NAME_MAX_LENGTH) {
      return `Skill name must be ${VALIDATION.NAME_MAX_LENGTH} characters or less`
    }
    if (!icon) {
      return "Icon URL is required"
    }
    if (!validateUrl(icon)) {
      return "Please enter a valid icon URL"
    }
    return null
  }

  const handleSave = () => {
    if (mode === "search") {
      if (!skill.name || !skill.icon) {
        setError("Please select a skill")
        return
      }
    } else {
      const validationError = validateCustomSkill(skill.name, skill.icon)
      if (validationError) {
        setError(validationError)
        return
      }
    }
    onSave(skill)
  }

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      <Tabs value={mode} onValueChange={(value) => setMode(value as "search" | "custom")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Skills</TabsTrigger>
          <TabsTrigger value="custom">Custom Skill</TabsTrigger>
        </TabsList>
        <TabsContent value="search" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search Skills</Label>
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Start typing to search skills..."
                  className="w-full"
                />
                {searchQuery && filteredSkills.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border">
                    <ScrollArea className="h-[300px]">
                      {filteredSkills.map((category) => (
                        <div key={category.category} className="p-2">
                          <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                            {category.category}
                          </div>
                          <div className="space-y-1">
                            {category.items.map((item) => (
                              <button
                                key={item.name}
                                onClick={() => handleSelect(item)}
                                className={cn(
                                  "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm",
                                  "hover:bg-accent hover:text-accent-foreground",
                                  "focus:outline-none focus:bg-accent focus:text-accent-foreground",
                                  skill.name === item.name && "bg-accent text-accent-foreground",
                                )}
                              >
                                <img src={item.icon || "/placeholder.svg"} alt="" className="w-4 h-4" />
                                <span className="flex-1 text-left">{item.name}</span>
                                {skill.name === item.name && <Check className="h-4 w-4" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>
            {skill.name && (
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <img src={skill.icon || "/placeholder.svg"} alt="" className="w-4 h-4" />
                <span>Selected: {skill.name}</span>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="custom" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skillName">Skill Name</Label>
            <Input
              ref={customNameInputRef}
              id="skillName"
              value={skill.name}
              onChange={(e) => {
                setSkill({ ...skill, name: e.target.value })
                setError(null)
              }}
              placeholder="e.g., Custom Framework"
              maxLength={VALIDATION.NAME_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iconUrl">Icon URL</Label>
            <Input
              id="iconUrl"
              value={skill.icon}
              onChange={(e) => {
                setSkill({ ...skill, icon: e.target.value })
                setError(null)
              }}
              placeholder="https://example.com/icon.svg"
            />
            {skill.icon && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Preview:</span>
                <img
                  src={skill.icon || "/placeholder.svg"}
                  alt=""
                  className="w-6 h-6"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement
                    img.src = "/placeholder.svg"
                  }}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!skill.name || !skill.icon}>
          Save Skill
        </Button>
      </DialogFooter>
    </div>
  )
}