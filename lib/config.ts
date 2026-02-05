// Deployment-related configuration
export const DEPLOYMENT_CONFIG = {
  APP_NAME_PREFIX: "folio-",
  APP_NAME_SUFFIX: "-abuilds",
  MAX_APP_NAME_LENGTH: 28,
  POLLING_INTERVAL: 5000, // 5 seconds
}

// OAuth window configuration
export const OAUTH_CONFIG = {
  WINDOW_NAME: "heroku-oauth",
  WINDOW_WIDTH: 600,
  WINDOW_HEIGHT: 700,
}

// API endpoints configuration
export const API_URLS = {
  LAMBDA_BASE_URL: process.env.NEXT_PUBLIC_LAMBDA_BASE_URL || "https://YOUR_DEPLOY_SERVICE",
  get LAMBDA_DEPLOY_URL() {
    return `${this.LAMBDA_BASE_URL}/deploy`
  },
  get LAMBDA_DEPLOY_APP() {
    return `${this.LAMBDA_BASE_URL}/deploy_app`
  },
  get LAMBDA_DEPLOY_STATUS() {
    return `${this.LAMBDA_BASE_URL}/deploy_status`
  },
  get LAMBDA_CHECK_APP() {
    return `${this.LAMBDA_BASE_URL}/check_app`
  },
}

// Links configuration
export const LINKS = {
  CUSTOM_DOMAIN_DOCS: "https://devcenter.heroku.com/articles/custom-domains",
  DISCORD_INVITE: "https://discord.gg/rMQ7qxHQ",
  GITHUB_REPO: "https://github.com/abhishekbuilds/project-two-clicks",
}

// Static content configuration
export const CONTENT = {
  DEPLOYMENT: {
    TITLE: "Deploy Your Portfolio",
    DESCRIPTION:
      "Deploy your portfolio to Heroku with just a few clicks. You'll need to authorize the application to deploy on your behalf.",
    PROCESS_STEPS: [
      "Create a new Heroku application",
      "Set up the necessary buildpacks and configurations",
      "Deploy your portfolio code",
      "Provide you with a live URL once completed",
    ],
    SUCCESS_MESSAGE: "Deployment successful! Your portfolio is now live at",
    CUSTOM_DOMAIN_MESSAGE: "Soon our deployment process will setup custom domain for your portfolio. For now you can",
    CUSTOM_DOMAIN_LINK_TEXT: "view how to setup custom domain",
    DISCORD_MESSAGE: "or join our",
    DISCORD_LINK_TEXT: "Discord channel",
    GITHUB_MESSAGE: "If you love Project Two Clicks, please give us a star on",
    GITHUB_LINK_TEXT: "GitHub",
    REDEPLOY_MESSAGE: "An older version of your portfolio already exists. Would you like to redeploy this version?",
    ERRORS: {
      POPUP_BLOCKED: "Please enable popups to continue with deployment.",
      AUTH_WINDOW_CLOSED: "Authentication window was closed. Please try again.",
      DEPLOYMENT_FAILED: "Failed to initiate deployment. Please try again.",
      AUTH_FAILED: "Authentication failed. Please ensure pop-ups are enabled and try again.",
      UNEXPECTED: "An unexpected error occurred. Please refresh the page and try again.",
    },
  },
  DOWNLOAD_DIALOG: {
    TITLE: "Download Portfolio Data",
    DESCRIPTION: "The data.ts file contains all your portfolio content. You can use this file to:",
    LIST_ITEMS: [
      "Deploy the portfolio on your own server or hosting service",
      "Make manual edits to the data structure",
      "Back up your portfolio content",
    ],
    DEPLOY_TITLE: "Want to deploy on your own?",
    DEPLOY_DESCRIPTION: "Check out our deployment guide for step-by-step instructions.",
    DEPLOY_LINK: "deployment guide",
    BUTTONS: {
      CANCEL: "Cancel",
      DOWNLOAD: "Download data.ts",
    },
  },
}