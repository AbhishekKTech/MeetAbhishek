"use client"

import { Download, Edit, Save, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadDataFile } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

interface FloatingActionButtonsProps {
  isEditing: boolean
  onEditToggle: () => void
  onSave: () => void
  onCancel: () => void
  data: any
}

export function FloatingActionButtons({ isEditing, onEditToggle, onSave, onCancel, data }: FloatingActionButtonsProps) {
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false)

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <motion.div
          className="fixed bottom-6 right-6 flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isEditing && (
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setIsDownloadDialogOpen(true)}
                      className="rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download data</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Download portfolio data</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="default"
                      onClick={onSave}
                      className="rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
                    >
                      <Save className="h-4 w-4" />
                      <span className="sr-only">Save changes</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Save changes</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={isEditing ? "destructive" : "default"}
                    onClick={() => (isEditing ? onCancel() : onEditToggle())}
                    className="rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: isEditing ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    </motion.div>
                    <span className="sr-only">{isEditing ? "Cancel editing" : "Toggle edit mode"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{isEditing ? "Cancel editing" : "Edit portfolio"}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </TooltipProvider>

      <Dialog open={isDownloadDialogOpen} onOpenChange={setIsDownloadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Portfolio Data</DialogTitle>
            <DialogDescription>
              The data.ts file contains all your portfolio content. You can use this file to:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Deploy the portfolio on your own server or hosting service</li>
              <li>Make manual edits to the data structure</li>
              <li>Back up your portfolio content</li>
            </ul>
            <div className="flex items-start gap-2 rounded-lg border p-4 text-sm">
              <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Want to deploy on your own?</p>
                <p className="text-muted-foreground mt-1">
                  Check out our{" "}
                  <a
                    href="https://github.com/abhishekbuilds/project-two-clicks#deploying-on-your-own"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    deployment guide
                    <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  for step-by-step instructions.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDownloadDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                downloadDataFile(data)
                setIsDownloadDialogOpen(false)
              }}
            >
              Download data.ts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}