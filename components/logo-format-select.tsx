"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { type LogoFormat, LOGO_FORMAT_LABELS, formatLogo } from "@/lib/utils"

interface LogoFormatSelectProps {
  name: string
  format: LogoFormat
  onChange: (format: LogoFormat) => void
}

export function LogoFormatSelect({ name, format, onChange }: LogoFormatSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 px-3 gap-1">
          {formatLogo(name, format)}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(LOGO_FORMAT_LABELS).map(([key, label]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onChange(key as LogoFormat)}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-sm text-muted-foreground">{label}</span>
            <span>{formatLogo(name, key as LogoFormat)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

