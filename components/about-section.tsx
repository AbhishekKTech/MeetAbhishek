"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { SectionHeading } from "./section-heading"
import EditableText from "./editable-text"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { validateUrl, formatUrl } from "@/lib/utils"

// CHANGE 1: Tumhari Image URL constant
const DEFAULT_IMAGE = "https://firebasestorage.googleapis.com/v0/b/dropbox-clone-7b8ff.appspot.com/o/users%2Fuser_39Hf0HYSX3M659UUWL4vID7Yvcx%2Ffiles%2FtQfui5QG3iqCGrThI6Yh?alt=media&token=d51ee2c6-50a3-468f-8bd0-23821c05f620"

interface AboutSectionProps {
  data: {
    bio: string
    location: string
    name: string
    imageUrl?: string
  }
  isEditing: boolean
  onChange: (newData: {
    bio: string
    location: string
    imageUrl?: string
  }) => void
}

export function AboutSection({ data, isEditing, onChange }: AboutSectionProps) {
  // CHANGE 2: Default logic (Placeholder ki jagah Default Image)
  const initialImage = (!data.imageUrl || data.imageUrl === "/placeholder.svg") 
    ? DEFAULT_IMAGE 
    : data.imageUrl

  const [imageUrl, setImageUrl] = useState(initialImage)
  const [imageError, setImageError] = useState<string | null>(null)

  // useEffect taaki data change hone par image bhi update ho
  useEffect(() => {
    if (!data.imageUrl || data.imageUrl === "/placeholder.svg") {
      setImageUrl(DEFAULT_IMAGE)
    } else {
      setImageUrl(data.imageUrl)
    }
  }, [data.imageUrl])

  const handleImageUrlChange = (value: string) => {
    // CHANGE 3: Empty input handling
    if (!value) {
      setImageUrl(DEFAULT_IMAGE)
      onChange({ ...data, imageUrl: DEFAULT_IMAGE })
      setImageError(null)
      return
    }

    if (!validateUrl(value)) {
      setImageError("Please enter a valid image URL")
      return
    }

    const formattedUrl = formatUrl(value)
    setImageUrl(formattedUrl)
    onChange({ ...data, imageUrl: formattedUrl })
    setImageError(null)
  }

  return (
    <section id="about" className="py-20 relative">
      <div className="absolute inset-0 pattern-dots opacity-[0.05] pointer-events-none" />
      <SectionHeading>About Me</SectionHeading>
      <div className="grid md:grid-cols-2 gap-8 items-center relative">
        <div className="relative aspect-square max-w-md w-full mx-auto group">
          <Image
            src={imageUrl}
            alt={data.name}
            fill
            // CHANGE 4: 'priority' add kiya hai taaki image turant load ho
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              // Error fallback logic
              if (img.src !== DEFAULT_IMAGE) {
                 img.src = DEFAULT_IMAGE
              } else {
                 img.src = "/placeholder.svg"
              }
              if (isEditing) {
                setImageError("Failed to load image.")
              }
            }}
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg w-full max-w-[80%]">
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  value={imageUrl === DEFAULT_IMAGE ? "" : imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="Enter image URL"
                  className={`editable-element ${imageError ? "border-destructive" : ""}`}
                  onClick={(e) => e.preventDefault()}
                />
                {imageError && <p className="text-sm text-destructive mt-1">{imageError}</p>}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={data.bio}
                onChange={(e) => onChange({ ...data, bio: e.target.value })}
                placeholder="Enter your bio"
                className="editable-element min-h-[200px] text-lg leading-relaxed w-full"
                maxLength={500}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                  }
                }}
              />
              <p className="text-sm text-muted-foreground text-right">{data.bio.length}/500 characters</p>
            </div>
          ) : (
            <p className="text-lg text-muted-foreground">{data.bio}</p>
          )}
          <div className="flex items-center gap-2">
            <span>📍</span>
            <EditableText
              value={data.location}
              onChange={(value) => onChange({ ...data, location: value })}
              isEditing={isEditing}
              className="text-muted-foreground"
              inputClassName="editable-element text-muted-foreground text-base w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}