"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { startDeployment, pollDeploymentStatus, checkAppExists } from "@/lib/deployment-service"
import { generateDataFileContent } from "@/lib/utils"
import { API_URLS, OAUTH_CONFIG, DEPLOYMENT_CONFIG, LINKS, CONTENT } from "@/lib/config"
import { useToast } from "@/components/ui/use-toast"

interface DeploymentModalProps {
  isOpen: boolean
  onClose: () => void
  portfolioData: any
}

interface DeploymentState {
  status: "idle" | "authorizing" | "deploying" | "success" | "error" | "confirm-redeploy"
  deployedUrl?: string
  error?: string
  progress: number
}

const { DEPLOYMENT } = CONTENT

function formatAppName(firstName: string): string {
  const prefix = DEPLOYMENT_CONFIG.APP_NAME_PREFIX
  const suffix = DEPLOYMENT_CONFIG.APP_NAME_SUFFIX
  const maxLength = DEPLOYMENT_CONFIG.MAX_APP_NAME_LENGTH

  let formattedName = firstName.toLowerCase().replace(/[^a-z0-9-]/g, "")
  const totalLength = prefix.length + formattedName.length + suffix.length

  if (totalLength > maxLength) {
    const allowedNameLength = maxLength - (prefix.length + suffix.length)
    formattedName = formattedName.slice(0, allowedNameLength)
  }

  return `${prefix}${formattedName}${suffix}`
}

export function DeploymentModal({ isOpen, onClose, portfolioData }: DeploymentModalProps) {
  const [deploymentState, setDeploymentState] = useState<DeploymentState>({
    status: "idle",
    progress: 0,
  })
  const [pendingDeployment, setPendingDeployment] = useState<{
    accessToken: string
    appName: string
    fileContent: string
    app_id?: string
  } | null>(null)

  const { toast } = useToast()
  const popupRef = useRef<Window | null>(null)
  const checkIntervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setDeploymentState({ status: "idle", progress: 0 })
      setPendingDeployment(null)
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close()
      }
    }
  }, [isOpen])

  const handleStartDeployment = useCallback(
    async (accessToken: string, appName: string, fileContent: string, redeploy = false, app_id?: string) => {
      try {
        setDeploymentState((prev) => ({ ...prev, status: "deploying", progress: 20 }))

        const deployResponse = await startDeployment(accessToken, appName, fileContent, redeploy, app_id)
        setDeploymentState((prev) => ({ ...prev, progress: 40 }))

        await pollDeploymentStatus(
          accessToken,
          deployResponse.app_id,
          deployResponse.build_id,
          (status) => {
            if (status.deployment_status === "succeeded") {
              setDeploymentState({
                status: "success",
                deployedUrl: status.deployed_url,
                progress: 100,
              })
            } else if (status.deployment_status === "failed") {
              setDeploymentState({
                status: "error",
                error: "Deployment failed. Please try again.",
                progress: 0,
              })
            } else {
              setDeploymentState((prev) => ({
                ...prev,
                progress: Math.min(prev.progress + 10, 90),
              }))
            }
          },
          (error) => {
            setDeploymentState({
              status: "error",
              error: error.message,
              progress: 0,
            })
          },
        )
      } catch (error) {
        setDeploymentState({
          status: "error",
          error: error instanceof Error ? error.message : "Deployment failed",
          progress: 0,
        })
      }
    },
    [],
  )

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.origin.includes("execute-api.us-east-1.amazonaws.com")) return

      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }

      try {
        const { type, accessToken, error } = event.data

        if (type === "OAUTH_SUCCESS" && accessToken) {
          setDeploymentState((prev) => ({ ...prev, status: "deploying", progress: 20 }))

          try {
            const fileContent = generateDataFileContent(portfolioData)
            const firstName = portfolioData.personalInfo.name.split(" ")[0]
            const appName = formatAppName(firstName)

            const checkResponse = await checkAppExists(accessToken, appName).catch((err) => {
              throw new Error(`Failed to check if app exists: ${err.message}. Please try again.`)
            })

            if (checkResponse.exists) {
              setPendingDeployment({
                accessToken,
                appName,
                fileContent,
                app_id: checkResponse.app_id,
              })
              setDeploymentState((prev) => ({ ...prev, status: "confirm-redeploy", progress: 0 }))
            } else {
              await handleStartDeployment(accessToken, appName, fileContent)
            }
          } catch (error) {
            setDeploymentState({
              status: "error",
              error:
                error instanceof Error
                  ? `Deployment failed: ${error.message}. Please check your connection and try again.`
                  : "Deployment failed due to an unknown error. Please try again.",
              progress: 0,
            })
          }
        } else if (type === "OAUTH_ERROR" || error) {
          setDeploymentState({
            status: "error",
            error: error || DEPLOYMENT.ERRORS.AUTH_FAILED,
            progress: 0,
          })
        }
      } catch (err) {
        setDeploymentState({
          status: "error",
          error: DEPLOYMENT.ERRORS.UNEXPECTED,
          progress: 0,
        })
        console.error("Error processing OAuth message:", err)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [portfolioData, handleStartDeployment])

  const handleDeploy = () => {
    try {
      setDeploymentState({ status: "authorizing", progress: 10 })

      const width = OAUTH_CONFIG.WINDOW_WIDTH
      const height = OAUTH_CONFIG.WINDOW_HEIGHT
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      popupRef.current = window.open(
        API_URLS.LAMBDA_DEPLOY_URL,
        OAUTH_CONFIG.WINDOW_NAME,
        `width=${width},height=${height},left=${left},top=${top},popup=1`,
      )

      if (!popupRef.current || popupRef.current.closed || typeof popupRef.current.closed === "undefined") {
        setDeploymentState({
          status: "error",
          error: DEPLOYMENT.ERRORS.POPUP_BLOCKED,
          progress: 0,
        })
        return
      }

      checkIntervalRef.current = setInterval(() => {
        if (popupRef.current?.closed) {
          clearInterval(checkIntervalRef.current)
          if (deploymentState.status === "authorizing") {
            setDeploymentState({
              status: "error",
              error: DEPLOYMENT.ERRORS.AUTH_WINDOW_CLOSED,
              progress: 0,
            })
          }
        }
      }, 1000)
    } catch (err) {
      setDeploymentState({
        status: "error",
        error: DEPLOYMENT.ERRORS.DEPLOYMENT_FAILED,
        progress: 0,
      })
      console.error("Error opening OAuth window:", err)
    }
  }

  const handleClose = () => {
    if (deploymentState.status !== "deploying") {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close()
      }
      onClose()
    }
  }

  const handleRedeployConfirm = async () => {
    if (pendingDeployment) {
      const { accessToken, appName, fileContent, app_id } = pendingDeployment
      await handleStartDeployment(accessToken, appName, fileContent, true, app_id)
    }
  }

  const handleRedeployCancel = () => {
    setPendingDeployment(null)
    setDeploymentState({ status: "idle", progress: 0 })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{DEPLOYMENT.TITLE}</DialogTitle>
          <DialogDescription>{DEPLOYMENT.DESCRIPTION}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4 h-full">
          {deploymentState.status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{deploymentState.error}</AlertDescription>
            </Alert>
          )}

          {deploymentState.status === "success" && (
            <div className="space-y-6">
              <Alert className="border-green-500 dark:border-green-400">
                <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                <AlertDescription className="break-words">
                  {DEPLOYMENT.SUCCESS_MESSAGE}{" "}
                  <a
                    href={deploymentState.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline hover:text-primary"
                  >
                    {deploymentState.deployedUrl}
                  </a>
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertDescription className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-1 flex-shrink-0" />
                  <div className="space-y-2">
                    <p>
                      {DEPLOYMENT.CUSTOM_DOMAIN_MESSAGE}{" "}
                      <a
                        href={LINKS.CUSTOM_DOMAIN_DOCS}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline hover:text-primary inline-flex items-center gap-1"
                      >
                        {DEPLOYMENT.CUSTOM_DOMAIN_LINK_TEXT}
                        <ExternalLink className="h-3 w-3" />
                      </a>{" "}
                      {DEPLOYMENT.DISCORD_MESSAGE}{" "}
                      <a
                        href={LINKS.DISCORD_INVITE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline hover:text-primary inline-flex items-center gap-1"
                      >
                        {DEPLOYMENT.DISCORD_LINK_TEXT}
                        <ExternalLink className="h-3 w-3" />
                      </a>{" "}
                      for Project Two Clicks latest updates.
                    </p>
                    <p>
                      {DEPLOYMENT.GITHUB_MESSAGE}{" "}
                      <a
                        href={LINKS.GITHUB_REPO}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline hover:text-primary inline-flex items-center gap-1"
                      >
                        {DEPLOYMENT.GITHUB_LINK_TEXT}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      !
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {(deploymentState.status === "deploying" || deploymentState.status === "authorizing") && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {deploymentState.status === "authorizing" ? "Authorizing..." : "Deploying your portfolio..."}
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${deploymentState.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-right">{deploymentState.progress}%</p>
            </div>
          )}

          {deploymentState.status === "confirm-redeploy" && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{DEPLOYMENT.REDEPLOY_MESSAGE}</AlertDescription>
              </Alert>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleRedeployCancel}>
                  Cancel
                </Button>
                <Button onClick={handleRedeployConfirm}>Yes, Redeploy</Button>
              </div>
            </div>
          )}

          {deploymentState.status === "idle" && (
            <>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">The deployment process will:</p>
                <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-2">
                  {DEPLOYMENT.PROCESS_STEPS.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleDeploy}>Authorize & Deploy</Button>
              </div>
            </>
          )}

          {deploymentState.status === "success" && (
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}