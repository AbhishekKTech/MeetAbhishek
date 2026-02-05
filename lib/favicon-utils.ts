export function generateFavicon(text: string, background = "#000000", foreground = "#FFFFFF"): string {
    // Create canvas
    const canvas = document.createElement("canvas")
    canvas.width = 32
    canvas.height = 32
  
    // Get context
    const ctx = canvas.getContext("2d")
    if (!ctx) return ""
  
    // Draw background
    ctx.fillStyle = background
    ctx.fillRect(0, 0, 32, 32)
  
    // Configure text
    ctx.fillStyle = foreground
    ctx.font = "bold 16px system-ui"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
  
    // Draw text
    ctx.fillText(text, 16, 16)
  
    // Convert to data URL
    return canvas.toDataURL("image/png")
  }
  
  export function generatePWAIcons(
    text: string,
    background = "#000000",
    foreground = "#FFFFFF",
  ): {
    favicon16: string
    favicon32: string
    apple: string
    android192: string
    android512: string
  } {
    const sizes = {
      favicon16: 16,
      favicon32: 32,
      apple: 180,
      android192: 192,
      android512: 512,
    }
  
    const icons: Record<string, string> = {}
  
    Object.entries(sizes).forEach(([key, size]) => {
      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size
  
      const ctx = canvas.getContext("2d")
      if (!ctx) return
  
      // Draw background
      ctx.fillStyle = background
      ctx.fillRect(0, 0, size, size)
  
      // Configure text
      ctx.fillStyle = foreground
      const fontSize = size / 2
      ctx.font = `bold ${fontSize}px system-ui`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
  
      // Draw text
      ctx.fillText(text, size / 2, size / 2)
  
      // Convert to data URL
      icons[key] = canvas.toDataURL("image/png")
    })
  
    return icons as {
      favicon16: string
      favicon32: string
      apple: string
      android192: string
      android512: string
    }
  }
  
  export function updateAllIcons(dataUrls: {
    favicon16: string
    favicon32: string
    apple: string
    android192: string
    android512: string
  }) {
    // Remove existing icons
    const existingIcons = document.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"]')
    existingIcons.forEach((icon) => icon.remove())
  
    // Create new icons
    const iconLinks = [
      { rel: "icon", size: "16x16", href: dataUrls.favicon16 },
      { rel: "icon", size: "32x32", href: dataUrls.favicon32 },
      { rel: "apple-touch-icon", size: "180x180", href: dataUrls.apple },
      {
        rel: "manifest",
        href:
          "data:application/manifest+json," +
          encodeURIComponent(
            JSON.stringify({
              name: "Portfolio",
              short_name: "Portfolio",
              icons: [
                {
                  src: dataUrls.android192,
                  sizes: "192x192",
                  type: "image/png",
                },
                {
                  src: dataUrls.android512,
                  sizes: "512x512",
                  type: "image/png",
                },
              ],
              theme_color: "#ffffff",
              background_color: "#ffffff",
              display: "standalone",
            }),
          ),
      },
    ]
  
    iconLinks.forEach(({ rel, size, href }) => {
      const link = document.createElement("link")
      link.rel = rel
      if (size) link.sizes = size
      link.href = href
      document.head.appendChild(link)
    })
  }  