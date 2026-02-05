import { Github, Linkedin, Mail, Twitter, type LucideIcon, Globe } from "lucide-react"

export type SocialPlatform = "github" | "linkedin" | "twitter" | "email" | "custom"

export interface SocialLink {
  platform: SocialPlatform
  url: string
  icon: LucideIcon
}

export function detectPlatform(url: string): SocialPlatform {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.toLowerCase()

    if (domain.includes("github.com")) return "github"
    if (domain.includes("linkedin.com")) return "linkedin"
    if (domain.includes("twitter.com")) return "twitter"
    if (url.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "email"
    return "custom" // Default to custom for any other valid URL
  } catch {
    // Check if it's an email
    if (url.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "email"
    return "custom"
  }
}

export function getPlatformIcon(platform: SocialPlatform): LucideIcon {
  switch (platform) {
    case "github":
      return Github
    case "linkedin":
      return Linkedin
    case "twitter":
      return Twitter
    case "email":
      return Mail
    case "custom":
      return Globe
    default:
      return Globe
  }
}

export function formatSocialUrl(url: string, platform: SocialPlatform): string {
  if (platform === "email" && !url.startsWith("mailto:")) {
    return `mailto:${url}`
  }

  // Add https:// to URLs starting with www. or without protocol
  if (!url.startsWith("http") && !url.startsWith("mailto:")) {
    return `https://${url.startsWith("www.") ? url : url}`
  }

  return url
}

export function validateSocialUrl(url: string, platform: SocialPlatform): boolean {
  if (platform === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)
  }

  // Allow URLs starting with www.
  if (url.startsWith("www.")) {
    url = "https://" + url
  }

  try {
    new URL(url.startsWith("http") ? url : "https://" + url)
    return true
  } catch {
    return false
  }
}

