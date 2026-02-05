import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type CertificationStatus = "active" | "expired" | "no-expiry"

interface CertificationStatusBadgeProps {
  status: CertificationStatus
  className?: string
}

export function CertificationStatusBadge({ status, className }: CertificationStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-normal",
        {
          "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400": status === "active",
          "bg-red-500/15 text-red-600 dark:bg-red-500/25 dark:text-red-400": status === "expired",
          "bg-slate-500/15 text-slate-600 dark:bg-slate-500/25 dark:text-slate-400": status === "no-expiry",
        },
        className,
      )}
    >
      {status === "active" && "Active"}
      {status === "expired" && "Expired"}
      {status === "no-expiry" && "No Expiry"}
    </Badge>
  )
}

