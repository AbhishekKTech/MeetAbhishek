import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Construction } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  links: {
    name: string
    url: string
    icon: LucideIcon
  }[]
  inDevelopment?: boolean
}

export function ProjectCard({ title, description, tags, links, inDevelopment }: ProjectCardProps) {
  const [failedLinks, setFailedLinks] = useState<Set<string>>(new Set())

  const handleLinkError = (url: string) => {
    setFailedLinks((prev) => new Set([...prev, url]))
  }

  return (
    <Card className="group relative flex flex-col min-h-[350px] sm:min-h-[400px] transition-all duration-300 bg-background dark:bg-[#0A0A0A] border-border dark:border-[#1F1F1F] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/10">
      <CardHeader className="space-y-0 pb-2 sm:pb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <CardTitle className="text-2xl font-mono tracking-tight text-foreground dark:text-white break-words hyphens-none">
            {title}
          </CardTitle>
          {inDevelopment && (
            <Badge
              variant="secondary"
              className="bg-[#F5D90A] text-[#382F00] hover:bg-[#F5D90A] flex items-center gap-1 whitespace-nowrap font-normal dark:bg-[#F5D90A] dark:text-[#382F00] dark:hover:bg-[#F5D90A] shrink-0"
            >
              <Construction className="size-3" />
              In Development
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-4 sm:px-6">
        <div className="min-h-[120px] space-y-1">
          {description.split("\n").map((paragraph, index) => (
            <p
              key={index}
              className="font-mono text-muted-foreground dark:text-[#A1A1A1] leading-relaxed tracking-tight break-words hyphens-none"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground dark:bg-[#1F1F1F] dark:text-white dark:hover:bg-[#2F2F2F] font-normal transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-wrap gap-2 mt-4 sm:mt-auto pt-4 sm:pt-6 px-4 sm:px-6">
        {links
          .filter((link) => !failedLinks.has(link.url))
          .map((link) => {
            const Icon = link.icon
            return (
              <Button
                key={link.url}
                variant="outline"
                size="sm"
                asChild
                className="border-input hover:bg-accent dark:border-[#333333] dark:hover:bg-[#1F1F1F] dark:text-white transition-colors w-auto"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                  onError={() => handleLinkError(link.url)}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{link.name}</span>
                </a>
              </Button>
            )
          })}
      </CardFooter>
    </Card>
  )
}