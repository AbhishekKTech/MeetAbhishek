import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EducationCardProps {
  degree: string
  institution: string
  location: string
  startYear: string
  endYear: string
  isOngoing: boolean
  description: string
}

export function EducationCard({
  degree,
  institution,
  location,
  startYear,
  endYear,
  isOngoing,
  description,
}: EducationCardProps) {
  const duration = `${startYear} - ${isOngoing ? "Present" : endYear}`

  return (
    <Card className="hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/10 transition-shadow">
      <CardHeader>
        <CardTitle>{degree}</CardTitle>
        <div className="text-muted-foreground">
          {institution} • {location}
          <div className="text-sm">{duration}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

