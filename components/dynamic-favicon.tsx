"use client"

import { useEffect, useRef } from "react"
import { generatePWAIcons, updateAllIcons } from "@/lib/favicon-utils"
import { formatLogo } from "@/lib/utils"
import type { LogoFormat } from "@/lib/utils"

interface DynamicFaviconProps {
  name: string
  format: LogoFormat
}

export function DynamicFavicon({ name, format }: DynamicFaviconProps) {
  const lastUpdate = useRef<string>("")

  useEffect(() => {
    // Generate favicon text using the same format as the logo
    const faviconText = formatLogo(name, format)

    // Get system color scheme
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Use the same colors as the theme
    const background = isDark ? "#000000" : "#FFFFFF"
    const foreground = isDark ? "#FFFFFF" : "#000000"

    // Create a unique key for this update to prevent unnecessary regeneration
    const updateKey = `${faviconText}-${background}-${foreground}`
    if (updateKey === lastUpdate.current) return

    // Generate and update all icons
    const icons = generatePWAIcons(faviconText, background, foreground)
    updateAllIcons(icons)
    lastUpdate.current = updateKey

    // Update icons when color scheme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      const background = e.matches ? "#000000" : "#FFFFFF"
      const foreground = e.matches ? "#FFFFFF" : "#000000"
      const updateKey = `${faviconText}-${background}-${foreground}`
      if (updateKey === lastUpdate.current) return

      const icons = generatePWAIcons(faviconText, background, foreground)
      updateAllIcons(icons)
      lastUpdate.current = updateKey
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [name, format])

  return null
}