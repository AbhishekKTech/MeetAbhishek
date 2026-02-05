"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionHeading } from "@/components/section-heading"
import { Download, Menu, X } from "lucide-react"
import {
  navigationLinks,
  socialLinks,
  personalInfo,
  projects,
  skills,
  experience,
  education,
  certifications,
} from "@/lib/data"
import { ThemeToggle } from "@/components/theme-toggle"
import { useForm } from "react-hook-form"
import { FloatingActionButtons } from "@/components/floating-action-buttons"
import EditableText from "@/components/editable-text"
import { SocialLinksEditor } from "@/components/social-links-editor"
import { motion } from "framer-motion"
import { AboutSection } from "@/components/about-section"
import { ProjectEditor } from "@/components/project-editor"
import { ExperienceEditor } from "@/components/experience-editor"
import { EducationEditor } from "@/components/education-editor"
import { CertificationEditor } from "@/components/certification-editor"
import { SkillsEditor } from "@/components/skills-editor" // Import SkillsEditor
import { scrollToSection } from "@/lib/scroll-utils"
import { FloatingDeployButton } from "@/components/floating-deploy-button" // Import FloatingDeployButton
import { LogoFormatSelect } from "@/components/logo-format-select"
import { formatLogo } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { validatePortfolioData } from "@/lib/validation"
import { DynamicFavicon } from "@/components/dynamic-favicon" // Import DynamicFavicon
import { HiringBadge } from "@/components/hiring-badge" // Add the import
import { ContactForm } from "@/components/contact-form" // Import ContactForm
import { LINKS } from "@/lib/config" // Add this import

// Add this type for our form
type FormData = {
  name: string
  email: string
  message: string
}

// Define the initial data structure
const initialData = {
  navigationLinks,
  socialLinks,
  personalInfo,
  projects,
  skills,
  experience,
  education,
  certifications,
}

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [portfolioData, setPortfolioData] = useState(initialData)
  const [unsavedData, setUnsavedData] = useState(initialData)
  const [windowWidth, setWindowWidth] = useState<number | null>(null)

  const { toast } = useToast()

  const handleSave = () => {
    // Validate the data
    const validationErrors = validatePortfolioData(unsavedData)

    if (validationErrors.length > 0) {
      // Show error toast with the first error
      toast({
        variant: "destructive",
        title: "Cannot save changes",
        description: validationErrors[0].message,
      })
      return
    }

    // If validation passes, proceed with save
    setPortfolioData(unsavedData)
    setIsEditing(false)

    // Show success toast
    toast({
      title: "Changes saved successfully",
      description: "Your portfolio has been updated.",
    })
  }

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        isMenuOpen &&
        !target.closest("#mobile-menu") &&
        !target.closest("#menu-button") &&
        !target.closest("#menu-button-desktop")
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [isMenuOpen])

  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Add your form submission logic here
  }

  return (
    <div className="min-h-screen bg-background">
      <DynamicFavicon name={unsavedData.personalInfo.name} format={unsavedData.personalInfo.logoFormat} />
      {/* Header/Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-background"
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo and Format Select */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href="#home" className="text-xl font-bold">
                {formatLogo(unsavedData.personalInfo.name, unsavedData.personalInfo.logoFormat)}
              </a>
              {isEditing && (
                <LogoFormatSelect
                  name={unsavedData.personalInfo.name}
                  format={unsavedData.personalInfo.logoFormat}
                  onChange={(format) =>
                    setUnsavedData({
                      ...unsavedData,
                      personalInfo: {
                        ...unsavedData.personalInfo,
                        logoFormat: format,
                      },
                    })
                  }
                />
              )}
            </div>

            {/* Desktop Navigation */}
            {windowWidth !== null && (
              <ul className="hidden sm:flex items-center gap-4 xl:gap-6 flex-wrap justify-end flex-1 px-4">
                {unsavedData.navigationLinks
                  .filter((link) => {
                    // Always show Home and About
                    if (link.name === "Home" || link.name === "About" || link.name === "Contact") return true
                    // Check if corresponding section has content
                    if (link.name === "Projects") return unsavedData.projects.length > 0
                    if (link.name === "Skills") return unsavedData.skills.length > 0
                    if (link.name === "Experience") return unsavedData.experience.length > 0
                    if (link.name === "Education") return unsavedData.education.length > 0
                    if (link.name === "Certifications") return unsavedData.certifications.length > 0
                    return true
                  })
                  .map((link, index) => {
                    const isVisible =
                      index < 2 || // Always show first 2
                      (index < 4 && windowWidth >= 768) || // Show 4 at md
                      (index < 6 && windowWidth >= 1024) || // Show 6 at lg
                      windowWidth >= 1280 // Show all at xl

                    return isVisible ? (
                      <li key={link.href} className="whitespace-nowrap">
                        <a
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                          onClick={(e) => {
                            e.preventDefault()
                            const sectionId = link.href.replace("#", "")
                            scrollToSection(sectionId, isEditing)
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              const sectionId = link.href.replace("#", "")
                              scrollToSection(sectionId, isEditing)
                            }
                          }}
                        >
                          {link.name}
                        </a>
                      </li>
                    ) : null
                  })}
              </ul>
            )}

            {/* Mobile Navigation Controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {/* Show hamburger menu on mobile or when there are hidden items */}
              <button
                id="menu-button"
                className="hover:bg-accent rounded-full p-2 transition-colors sm:hidden"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMenuOpen(!isMenuOpen)
                }}
              >
                {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>

              {/* Show hamburger menu on larger screens only when there are hidden items */}
              {windowWidth !== null &&
                windowWidth >= 640 &&
                unsavedData.navigationLinks.some(
                  (_, index) =>
                    !(
                      // Check if item is NOT visible
                      (
                        index < 2 || // First 2 always visible
                        (index < 4 && windowWidth >= 768) || // 4 visible at md
                        (index < 6 && windowWidth >= 1024) || // 6 visible at lg
                        windowWidth >= 1280
                      ) // All visible at xl
                    ),
                ) && (
                  <button
                    id="menu-button-desktop"
                    className="hover:bg-accent rounded-full p-2 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsMenuOpen(!isMenuOpen)
                    }}
                  >
                    {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                  </button>
                )}
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && windowWidth !== null && (
          <div
            id="mobile-menu"
            className="border-t bg-background/80 backdrop-blur-sm animate-in slide-in-from-top duration-300 absolute top-full left-0 right-0 z-50"
          >
            <nav className="container mx-auto px-4 py-4">
              <ul className="flex flex-col gap-4">
                {/* Show all items on mobile */}
                {windowWidth < 640 &&
                  unsavedData.navigationLinks
                    .filter((link) => {
                      // Always show Home and About
                      if (link.name === "Home" || link.name === "About" || link.name === "Contact") return true
                      // Check if corresponding section has content
                      if (link.name === "Projects") return unsavedData.projects.length > 0
                      if (link.name === "Skills") return unsavedData.skills.length > 0
                      if (link.name === "Experience") return unsavedData.experience.length > 0
                      if (link.name === "Education") return unsavedData.education.length > 0
                      if (link.name === "Certifications") return unsavedData.certifications.length > 0
                      return true
                    })
                    .map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground transition-colors block py-2"
                          onClick={(e) => {
                            e.preventDefault()
                            const sectionId = link.href.replace("#", "")
                            scrollToSection(sectionId, isEditing)
                            setIsMenuOpen(false)
                          }}
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}

                {/* Show only hidden items on larger screens */}
                {windowWidth >= 640 &&
                  unsavedData.navigationLinks.map((link, index) => {
                    const isVisible =
                      index < 2 || // First 2 always visible
                      (index < 4 && windowWidth >= 768) || // 4 visible at md
                      (index < 6 && windowWidth >= 1024) || // 6 visible at lg
                      windowWidth >= 1280 // All visible at xl

                    return !isVisible ? (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground transition-colors block py-2"
                          onClick={(e) => {
                            e.preventDefault()
                            const sectionId = link.href.replace("#", "")
                            scrollToSection(sectionId, isEditing)
                            setIsMenuOpen(false)
                          }}
                        >
                          {link.name}
                        </a>
                      </li>
                    ) : null
                  })}
              </ul>
            </nav>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 pt-16">
        {/* Home Section - Added gradient animation */}
        <section
          id="home"
          className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 gradient-animation"
        >
          <motion.div className="text-center space-y-4">
            <HiringBadge
              openToWork={unsavedData.personalInfo.openToWork}
              onChange={
                isEditing
                  ? (value) => {
                      setUnsavedData({
                        ...unsavedData,
                        personalInfo: {
                          ...unsavedData.personalInfo,
                          openToWork: value,
                        },
                      })
                    }
                  : undefined
              }
              isEditing={isEditing}
            />
            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EditableText
                value={unsavedData.personalInfo.name}
                onChange={(value) => {
                  setUnsavedData({
                    ...unsavedData,
                    personalInfo: {
                      ...unsavedData.personalInfo,
                      name: value,
                    },
                  })
                }}
                isEditing={isEditing}
                className="focus:outline-none"
                inputClassName="text-4xl md:text-6xl font-bold tracking-tight text-center w-full min-w-[300px] h-auto"
                maxLength={50}
              />
            </motion.h1>
            <motion.div
              className="text-xl md:text-2xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EditableText
                value={unsavedData.personalInfo.title}
                onChange={(value) => {
                  setUnsavedData({
                    ...unsavedData,
                    personalInfo: {
                      ...unsavedData.personalInfo,
                      title: value,
                    },
                  })
                }}
                isEditing={isEditing}
                className="focus:outline-none"
                inputClassName="text-xl md:text-2xl text-muted-foreground text-center"
                maxLength={80}
              />
            </motion.div>
            <motion.div
              className="flex justify-center gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button asChild>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("contact", isEditing)
                  }}
                  role="button"
                >
                  Contact Me
                </a>
              </Button>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <Input
                    value={unsavedData.personalInfo.resumeUrl || ""}
                    onChange={(e) => {
                      // Allow any input, but store it in state
                      setUnsavedData({
                        ...unsavedData,
                        personalInfo: {
                          ...unsavedData.personalInfo,
                          resumeUrl: e.target.value,
                        },
                      })
                    }}
                    placeholder="Enter resume URL"
                    className={`max-w-[200px] ${
                      !unsavedData.personalInfo.resumeUrl ||
                      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.+)*$/.test(
                        unsavedData.personalInfo.resumeUrl,
                      )
                        ? ""
                        : "border-destructive"
                    }`}
                  />
                  {unsavedData.personalInfo.resumeUrl &&
                    !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.+)*$/.test(
                      unsavedData.personalInfo.resumeUrl,
                    ) && <p className="text-sm text-destructive">Please enter a valid URL</p>}
                </div>
              ) : (
                <Button variant="outline" asChild>
                  <a
                    href={unsavedData.personalInfo.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="button"
                    onClick={(e) => {
                      if (!unsavedData.personalInfo.resumeUrl) {
                        e.preventDefault()
                      }
                    }}
                    className={!unsavedData.personalInfo.resumeUrl ? "cursor-not-allowed opacity-50" : ""}
                  >
                    <Download className="mr-2 size-4" />
                    Download Resume
                  </a>
                </Button>
              )}
            </motion.div>
            <SocialLinksEditor
              links={unsavedData.socialLinks}
              onChange={(newLinks) => {
                setUnsavedData({
                  ...unsavedData,
                  socialLinks: newLinks,
                })
              }}
              isEditing={isEditing}
            />
          </motion.div>
        </section>

        {/* About Section - Added dot pattern */}
        <section id="about" className="py-20 relative">
          <AboutSection
            data={{
              bio: unsavedData.personalInfo.bio,
              location: unsavedData.personalInfo.location,
              name: unsavedData.personalInfo.name,
              imageUrl: unsavedData.personalInfo.imageUrl,
            }}
            isEditing={isEditing}
            onChange={(newData) => {
              setUnsavedData({
                ...unsavedData,
                personalInfo: {
                  ...unsavedData.personalInfo,
                  ...newData,
                },
              })
            }}
          />
        </section>

        {/* Projects Section */}
        {unsavedData.projects.length > 0 && (
          <section id="projects" className="py-20">
            <SectionHeading>Projects</SectionHeading>
            <ProjectEditor
              projects={unsavedData.projects}
              onChange={(newProjects) => {
                setUnsavedData({
                  ...unsavedData,
                  projects: newProjects,
                })
              }}
              isEditing={isEditing}
            />
          </section>
        )}

        {/* Skills Section */}
        {unsavedData.skills.length > 0 && (
          <section id="skills" className="py-20 relative">
            <div className="absolute inset-0 pattern-dots opacity-[0.05] pointer-events-none" />
            <SectionHeading>Skills</SectionHeading>
            <SkillsEditor
              skills={unsavedData.skills}
              onChange={(newSkills) => {
                setUnsavedData({
                  ...unsavedData,
                  skills: newSkills,
                })
              }}
              isEditing={isEditing}
            />
          </section>
        )}

        {/* Experience Section */}
        {unsavedData.experience.length > 0 && (
          <section id="experience" className="py-20">
            <SectionHeading>Work Experience</SectionHeading>
            <ExperienceEditor
              experiences={unsavedData.experience}
              onChange={(newExperiences) => {
                setUnsavedData({
                  ...unsavedData,
                  experience: newExperiences,
                })
              }}
              isEditing={isEditing}
            />
          </section>
        )}

        {/* Education Section */}
        {unsavedData.education.length > 0 && (
          <section id="education" className="py-20">
            <SectionHeading>Education</SectionHeading>
            <EducationEditor
              education={unsavedData.education}
              onChange={(newEducation) => {
                setUnsavedData({
                  ...unsavedData,
                  education: newEducation,
                })
              }}
              isEditing={isEditing}
            />
          </section>
        )}

        {/* Certifications Section */}
        {unsavedData.certifications.length > 0 && (
          <section id="certifications" className="py-20">
            <SectionHeading>Certifications</SectionHeading>
            <CertificationEditor
              certifications={unsavedData.certifications}
              onChange={(newCertifications) => {
                setUnsavedData({
                  ...unsavedData,
                  certifications: newCertifications,
                })
              }}
              isEditing={isEditing}
            />
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <SectionHeading>Contact Me</SectionHeading>
          <div className="max-w-md mx-auto">
            <ContactForm
              apiKey={unsavedData.personalInfo.web3formsKey}
              onApiKeyChange={(key) => {
                setUnsavedData({
                  ...unsavedData,
                  personalInfo: {
                    ...unsavedData.personalInfo,
                    web3formsKey: key,
                  },
                })
              }}
              isEditing={isEditing}
            />
          </div>
        </section>
        <FloatingDeployButton portfolioData={unsavedData} />
        <FloatingActionButtons
          isEditing={isEditing}
          onEditToggle={() => {
            setIsEditing(!isEditing)
            // Reset Web3Forms API key when entering edit mode
            if (!isEditing) {
              setUnsavedData((prev) => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo,
                  web3formsKey: "",
                },
              }))
            }
          }}
          onSave={handleSave}
          onCancel={() => {
            setUnsavedData(portfolioData)
            setIsEditing(false)
          }}
          data={unsavedData}
        />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-20">
        <div className="container mx-auto px-4 text-center space-y-2 text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {unsavedData.personalInfo.name}. All rights reserved.
          </p>
          <p>
            Portfolio developed under{" "}
            <a
              href={LINKS.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline transition-colors"
            >
              #ProjectTwoClicks
            </a>
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  )
}