import type { SocialLink } from "./social-utils"

export interface ValidationError {
  field: string
  message: string
}

export function validatePortfolioData(data: any): ValidationError[] {
  const errors: ValidationError[] = []

  // Validate personal info
  if (!data.personalInfo.name || data.personalInfo.name.length < 2) {
    errors.push({
      field: "name",
      message: "Name must be at least 2 characters long",
    })
  }

  if (!data.personalInfo.title || data.personalInfo.title.length < 2) {
    errors.push({
      field: "title",
      message: "Title must be at least 2 characters long",
    })
  }

  if (!data.personalInfo.bio || data.personalInfo.bio.length < 50) {
    errors.push({
      field: "bio",
      message: "Bio must be at least 50 characters long",
    })
  }

  if (!data.personalInfo.location || data.personalInfo.location.length < 2) {
    errors.push({
      field: "location",
      message: "Location must be at least 2 characters long",
    })
  }

  // Validate resume URL if provided
  if (data.personalInfo.resumeUrl) {
    try {
      new URL(data.personalInfo.resumeUrl)
    } catch {
      errors.push({
        field: "resumeUrl",
        message: "Invalid resume URL format",
      })
    }
  }

  // Validate social links
  if (!Array.isArray(data.socialLinks) || data.socialLinks.length === 0) {
    errors.push({
      field: "socialLinks",
      message: "At least one social link is required",
    })
  } else {
    data.socialLinks.forEach((link: SocialLink, index: number) => {
      if (!link.url) {
        errors.push({
          field: `socialLinks[${index}]`,
          message: "Social link URL is required",
        })
      }
      try {
        if (!link.url.startsWith("mailto:")) {
          new URL(link.url)
        }
      } catch {
        errors.push({
          field: `socialLinks[${index}]`,
          message: "Invalid social link URL format",
        })
      }
    })
  }

  // Validate projects
  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    errors.push({
      field: "projects",
      message: "At least one project is required",
    })
  } else {
    data.projects.forEach((project: any, index: number) => {
      if (!project.title || project.title.length < 5) {
        errors.push({
          field: `projects[${index}].title`,
          message: "Project title must be at least 5 characters long",
        })
      }
      if (!project.description || project.description.length < 20) {
        errors.push({
          field: `projects[${index}].description`,
          message: "Project description must be at least 20 characters long",
        })
      }
      if (!Array.isArray(project.tags) || project.tags.length === 0) {
        errors.push({
          field: `projects[${index}].tags`,
          message: "At least one project tag is required",
        })
      }
    })
  }

  // Validate skills
  if (!Array.isArray(data.skills) || data.skills.length === 0) {
    errors.push({
      field: "skills",
      message: "At least one skill category is required",
    })
  } else {
    data.skills.forEach((category: any, index: number) => {
      if (!category.category || category.category.length < 3) {
        errors.push({
          field: `skills[${index}].category`,
          message: "Skill category name must be at least 3 characters long",
        })
      }
      if (!Array.isArray(category.items) || category.items.length === 0) {
        errors.push({
          field: `skills[${index}].items`,
          message: "At least one skill is required in each category",
        })
      }
    })
  }

  return errors
}

