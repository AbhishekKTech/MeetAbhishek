"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DeploymentModal } from "@/components/deployment-modal"
import { Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FloatingDeployButtonProps {
  portfolioData: any 
}

export function FloatingDeployButton({ portfolioData }: FloatingDeployButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <motion.div
          className="fixed bottom-24 right-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => setIsModalOpen(true)}
              >
                <Rocket className="h-5 w-5" />
                <span className="sr-only">Deploy portfolio</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Deploy portfolio</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </TooltipProvider>

      <DeploymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} portfolioData={portfolioData} />
    </>
  )
}

