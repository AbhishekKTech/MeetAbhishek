import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExperienceCardProps {
  title: string
  company: string
  location: string
  startYear: string
  endYear: string
  isOngoing: boolean
  description: string[]
}

export function ExperienceCard({
  title,
  company,
  location,
  startYear,
  endYear,
  isOngoing,
  description,
}: ExperienceCardProps) {
  const duration = `${startYear} - ${isOngoing ? "Present" : endYear}`

  return (
    <Card className="hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/10 transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="text-muted-foreground">
          {company} • {location}
          <div className="text-sm">{duration}</div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-4 space-y-1">
          {description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

