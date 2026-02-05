import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { personalInfo, skills, projects, experience, socialLinks } from "@/lib/data"
import type React from "react"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const skillKeywords = skills.flatMap((category) => category.items.map((item) => item.name))
  const projectKeywords = projects.flatMap((project) => project.tags)
  const keywords = Array.from(new Set([personalInfo.title, ...skillKeywords, ...projectKeywords]))

  const latestRole = experience[0]
  const enhancedDescription = `${personalInfo.bio} Currently ${
    latestRole.isOngoing ? "working as" : "worked as"
  } ${latestRole.title} at ${latestRole.company}.`

  const githubUrl = socialLinks.find((link) => link.platform === "github")?.url
  const twitterUrl = socialLinks.find((link) => link.platform === "twitter")?.url

  return {
    title: {
      default: `${personalInfo.name} - ${personalInfo.title}`,
      template: `%s | ${personalInfo.name}`,
    },
    description: enhancedDescription,
    keywords: keywords,
    authors: [{ name: personalInfo.name }],
    creator: personalInfo.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      title: `${personalInfo.name} - ${personalInfo.title}`,
      description: enhancedDescription,
      siteName: personalInfo.name,
      images: [
        {
          url: personalInfo.imageUrl,
          width: 1200,
          height: 630,
          alt: personalInfo.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${personalInfo.name} - ${personalInfo.title}`,
      description: enhancedDescription,
      images: [personalInfo.imageUrl],
      creator: twitterUrl ? twitterUrl.split("/").pop() : undefined,
    },
  }
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={jetbrainsMono.className} suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}