export function scrollToSection(sectionId: string, preventScroll = false) {
  if (preventScroll) return

  const element = document.getElementById(sectionId)
  if (!element) return

  const header = document.querySelector("header")
  const headerOffset = header ? header.getBoundingClientRect().height : 0
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  })
}

