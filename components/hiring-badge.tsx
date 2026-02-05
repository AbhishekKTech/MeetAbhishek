"use client"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { Briefcase } from "lucide-react"

interface HiringBadgeProps {
  openToWork: boolean
  onChange?: (value: boolean) => void
  isEditing?: boolean
}

export function HiringBadge({ openToWork, onChange, isEditing = false }: HiringBadgeProps) {
  if (!openToWork && !isEditing) return null

  return (
    <div className="flex items-center justify-center gap-4 mb-2">
      {openToWork && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <Badge
            variant="default"
            className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 dark:bg-emerald-500/25 dark:text-emerald-400 dark:hover:bg-emerald-500/35 transition-colors flex items-center gap-1.5"
          >
            <Briefcase className="h-3 w-3" />
            Open to Work
          </Badge>
        </motion.div>
      )}

      {isEditing && (
        <div className="flex items-center gap-2">
          <Switch
            id="hiring-status"
            checked={openToWork}
            onCheckedChange={onChange}
            aria-label="Toggle hiring status"
          />
          <label htmlFor="hiring-status" className="text-sm text-muted-foreground">
            Show &quot;Open to Work&quot; badge
          </label>
        </div>
      )}
    </div>
  )
}