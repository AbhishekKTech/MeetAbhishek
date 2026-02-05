import { NextResponse } from "next/server"
import { personalInfo } from "@/lib/data"

export async function GET() {
  const manifest = {
    name: `${personalInfo.name} - Portfolio`,
    short_name: personalInfo.name,
    description: personalInfo.bio,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000"
  }

  // Return the manifest with proper content type
  return new NextResponse(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600",
    },
  })
}