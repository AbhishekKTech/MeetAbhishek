import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateUrl(url: string): boolean {
  if (!url) return false

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

export function formatUrl(url: string): string {
  if (!url) return url

  // Add https:// to URLs starting with www. or without protocol
  if (!url.startsWith("http")) {
    return `https://${url.startsWith("www.") ? url : url}`
  }

  return url
}

export function generateDataFileContent(data: any): string {
  // Map icon components to their names
  const iconMap = {
    Github: "Github",
    Globe: "Globe",
    Linkedin: "Linkedin",
    Mail: "Mail",
    Twitter: "Twitter",
  }

  // Process social links to preserve icon references
  const processSocialLinks = (links: any[]) => {
    return links.map((link) => {
      const iconName =
        link.platform === "github"
          ? "Github"
          : link.platform === "linkedin"
            ? "Linkedin"
            : link.platform === "twitter"
              ? "Twitter"
              : link.platform === "email"
                ? "Mail"
                : "Globe"
      return {
        ...link,
        icon: iconName,
      }
    })
  }

  // Process project links to preserve icon references
  const processProjectLinks = (links: any[]) => {
    return links.map((link) => {
      const iconName = link.url.includes("github.com") ? "Github" : "Globe"
      return {
        ...link,
        icon: iconName,
      }
    })
  }

  // Process projects to handle their links
  const processedProjects = data.projects.map((project: any) => ({
    ...project,
    links: processProjectLinks(project.links),
  }))

  // Create the file content with proper icon handling
  const fileContent = `import { Github, Globe, Linkedin, Mail, Twitter } from 'lucide-react'

export const navigationLinks = ${JSON.stringify(data.navigationLinks, null, 2)}

export const socialLinks = ${JSON.stringify(processSocialLinks(data.socialLinks), null, 2)
    .replace(/"icon":\s*"Github"/g, "icon: Github")
    .replace(/"icon":\s*"Linkedin"/g, "icon: Linkedin")
    .replace(/"icon":\s*"Twitter"/g, "icon: Twitter")
    .replace(/"icon":\s*"Mail"/g, "icon: Mail")}

export const personalInfo = ${JSON.stringify(data.personalInfo, null, 2)}

export const projects = ${JSON.stringify(processedProjects, null, 2)
    .replace(/"icon":\s*"Github"/g, "icon: Github")
    .replace(/"icon":\s*"Globe"/g, "icon: Globe")}

export const skills = ${JSON.stringify(data.skills, null, 2)}

export const experience = ${JSON.stringify(data.experience, null, 2)}

export const education = ${JSON.stringify(data.education, null, 2)}

export const certifications = ${JSON.stringify(data.certifications, null, 2)}
`

  return fileContent
}

export function downloadDataFile(data: any) {
  const fileContent = generateDataFileContent(data)

  // Create a blob with the file content
  const blob = new Blob([fileContent], { type: "text/typescript" })
  const url = URL.createObjectURL(blob)

  // Create a temporary link and trigger the download
  const link = document.createElement("a")
  link.href = url
  link.download = "data.ts"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export type LogoFormat = "initials" | "firstTwo" | "firstThree" | "initialPlusTwo"

export function formatLogo(name: string, format: LogoFormat): string {
  const names = name.split(" ")
  const firstName = names[0]
  const lastName = names.length > 1 ? names[names.length - 1] : ""

  switch (format) {
    case "initials":
      return lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : firstName[0].toUpperCase()
    case "firstTwo":
      return firstName.slice(0, 2)
    case "firstThree":
      return firstName.slice(0, 3)
    case "initialPlusTwo":
      return lastName ? `${firstName[0]}${lastName.slice(0, 2)}` : firstName[0]
    default:
      return firstName
  }
}

export const LOGO_FORMAT_LABELS: Record<LogoFormat, string> = {
  initials: "Initials",
  firstTwo: "First Two Letters",
  firstThree: "First Three Letters",
  initialPlusTwo: "Initial + Two Letters",
}

