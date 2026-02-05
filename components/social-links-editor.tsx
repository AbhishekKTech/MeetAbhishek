"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, X, Edit2 } from "lucide-react"
import type { SocialLink, SocialPlatform } from "@/lib/social-utils"
import { detectPlatform, getPlatformIcon, formatSocialUrl, validateSocialUrl } from "@/lib/social-utils"
import { AnimatePresence, motion } from "framer-motion"

interface SocialLinksEditorProps {
  links: SocialLink[]
  onChange: (links: SocialLink[]) => void
  isEditing: boolean
}

const MAX_LINKS = 5
const AVAILABLE_PLATFORMS: SocialPlatform[] = ["github", "linkedin", "twitter", "email"]

export function SocialLinksEditor({ links, onChange, isEditing }: SocialLinksEditorProps) {
  const [newUrl, setNewUrl] = useState("")
  const [editUrl, setEditUrl] = useState("")
  const [error, setError] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Get currently used platforms
  const usedPlatforms = links.map((link) => link.platform)

  // Calculate available platforms
  const availablePlatforms = AVAILABLE_PLATFORMS.filter((platform) => !usedPlatforms.includes(platform))

  const handleAddLink = () => {
    const platform = detectPlatform(newUrl)
    if (!platform) {
      setError("Invalid URL. Please enter a valid GitHub, LinkedIn, Twitter URL, or email address.")
      return
    }

    if (usedPlatforms.includes(platform)) {
      setError(`A ${platform} link already exists. Please remove it first to add a new one.`)
      return
    }

    if (!validateSocialUrl(newUrl, platform)) {
      setError("Please enter a valid URL or email address.")
      return
    }

    const formattedUrl = formatSocialUrl(newUrl, platform)
    const icon = getPlatformIcon(platform)

    const newLink: SocialLink = {
      platform,
      url: formattedUrl,
      icon,
    }

    onChange([...links, newLink])
    setNewUrl("")
    setError("")
    setIsAddDialogOpen(false)
  }

  const handleEditLink = () => {
    if (!editingLink) return

    const platform = detectPlatform(editUrl)
    if (!platform) {
      setError("Invalid URL. Please enter a valid URL for the selected platform.")
      return
    }

    if (platform !== editingLink.platform) {
      setError(`Please enter a valid ${editingLink.platform} URL.`)
      return
    }

    if (!validateSocialUrl(editUrl, platform)) {
      setError("Please enter a valid URL or email address.")
      return
    }

    const formattedUrl = formatSocialUrl(editUrl, platform)
    const updatedLinks = links.map((link) =>
      link.platform === editingLink.platform ? { ...link, url: formattedUrl } : link,
    )

    onChange(updatedLinks)
    setEditUrl("")
    setError("")
    setIsEditDialogOpen(false)
    setEditingLink(null)
  }

  const handleRemoveLink = (url: string) => {
    onChange(links.filter((link) => link.url !== url))
  }

  const openEditDialog = (link: SocialLink) => {
    setEditingLink(link)
    setEditUrl(link.url.replace("mailto:", ""))
    setError("")
    setIsEditDialogOpen(true)
  }

  if (!isEditing) {
    return (
      <div className="flex justify-center gap-4 pt-8">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <motion.a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-muted-foreground transition-colors
                ${link.platform === "github" && "hover:text-[#333333] dark:hover:text-[#fafafa]"}
                ${link.platform === "linkedin" && "hover:text-[#0A66C2]"}
                ${link.platform === "twitter" && "hover:text-[#1DA1F2]"}
                ${link.platform === "email" && "hover:text-[#EA4335]"}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
            >
              <Icon className="size-6" />
              <span className="sr-only">Link to {link.platform}</span>
            </motion.a>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-8">
      <AnimatePresence mode="popLayout">
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {links.map((link) => {
            const Icon = link.icon
            return (
              <motion.div
                key={link.url}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 bg-muted/50 backdrop-blur-sm rounded-full px-3 py-1.5"
              >
                <Icon className="size-4" />
                <span className="text-sm">{link.url}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 p-0.5 hover:bg-muted transition-colors duration-200"
                    onClick={() => openEditDialog(link)}
                  >
                    <Edit2 className="size-4 transition-transform duration-200 hover:scale-110" />
                    <span className="sr-only">Edit {link.platform} link</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 p-0.5 hover:bg-muted transition-colors duration-200"
                    onClick={() => handleRemoveLink(link.url)}
                  >
                    <X className="size-4 transition-transform duration-200 hover:scale-110" />
                    <span className="sr-only">Remove {link.platform} link</span>
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Add Link Dialog */}
        {links.length < MAX_LINKS && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 transition-all duration-200 hover:scale-105">
                  <Plus className="size-4" />
                  Add Social Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md duration-200">
                <DialogHeader>
                  <DialogTitle>Add Social Link</DialogTitle>
                  <DialogDescription>
                    Available platforms: GitHub, LinkedIn, Twitter, Email, or enter any custom URL (up to {MAX_LINKS}{" "}
                    total links)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input
                      value={newUrl}
                      onChange={(e) => {
                        setNewUrl(e.target.value)
                        setError("")
                      }}
                      placeholder="https://github.com/username or email@example.com"
                      className={`transition-colors duration-200 ${error ? "border-destructive" : ""}`}
                    />
                    {error && (
                      <motion.p
                        className="text-sm text-destructive mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddLink}>Add Link</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}

        {/* Edit Link Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md duration-200">
            <DialogHeader>
              <DialogTitle>Edit {editingLink?.platform} Link</DialogTitle>
              <DialogDescription>Enter a new URL for your {editingLink?.platform} profile</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  value={editUrl}
                  onChange={(e) => {
                    setEditUrl(e.target.value)
                    setError("")
                  }}
                  placeholder={`Enter your ${editingLink?.platform} URL`}
                  className={`transition-colors duration-200 ${error ? "border-destructive" : ""}`}
                />
                {error && (
                  <motion.p
                    className="text-sm text-destructive mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingLink(null)
                    setError("")
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditLink}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    </div>
  )
}