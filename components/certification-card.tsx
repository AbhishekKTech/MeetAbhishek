import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { CertificationStatusBadge, type CertificationStatus } from "./certification-status-badge"
import Image from "next/image"

interface CertificationCardProps {
  title: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId: string
  credentialUrl?: string
  badgeUrl?: string
  description: string
}

export function CertificationCard({
  title,
  issuer,
  issueDate,
  expiryDate,
  credentialId,
  credentialUrl,
  badgeUrl,
  description,
}: CertificationCardProps) {
  // Calculate certification status
  const calculateStatus = (): CertificationStatus => {
    if (!expiryDate) return "no-expiry"
    const currentYear = new Date().getFullYear()
    const expiryYear = Number.parseInt(expiryDate)
    return expiryYear >= currentYear ? "active" : "expired"
  }

  const status = calculateStatus()

  return (
    <Card className="hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/10 transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            <div className="text-muted-foreground">
              <p>{issuer}</p>
              <div className="flex items-center gap-2 text-sm">
                <span>
                  Issued {issueDate}
                  {expiryDate && <span> • Expires {expiryDate}</span>}
                </span>
                <CertificationStatusBadge status={status} />
              </div>
            </div>
          </div>
          {badgeUrl && (
            <div className="flex-shrink-0">
              <a href={badgeUrl} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-background hover:opacity-90 transition-opacity">
                  <Image
                    src={badgeUrl || "/placeholder.svg"}
                    alt={`${title} certification badge`}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      img.src = "/placeholder.svg"
                    }}
                  />
                </div>
              </a>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Credential ID: {credentialId}</span>
          {credentialUrl ? (
            <Button variant="ghost" size="sm" className="h-8" asChild>
              <a href={credentialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Verify
                <ExternalLink className="size-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}