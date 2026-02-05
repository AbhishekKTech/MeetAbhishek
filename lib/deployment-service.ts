import { API_URLS, DEPLOYMENT_CONFIG } from "@/lib/config"

export type DeploymentStatus = "pending" | "succeeded" | "failed"

interface DeploymentResponse {
  message: string
  app_id: string
  build_id: string
  deployed_url: string
}

interface DeploymentStatusResponse {
  app_id: string
  deployment_status: DeploymentStatus
  deployed_url: string
}

interface CheckAppResponse {
  exists: boolean
  message: string
  app_name: string
  app_id?: string // Add app_id
}

const POLLING_INTERVAL = DEPLOYMENT_CONFIG.POLLING_INTERVAL

export class DeploymentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "DeploymentError"
  }
}

export async function checkAppExists(accessToken: string, appName: string): Promise<CheckAppResponse> {
  try {
    const response = await fetch(`${API_URLS.LAMBDA_CHECK_APP}?app_name=${appName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new DeploymentError(`Failed to check app existence: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof DeploymentError) {
      throw error
    }
    throw new DeploymentError("Failed to check app existence")
  }
}

export async function startDeployment(
  accessToken: string,
  appName: string,
  fileContent: string,
  redeploy?: boolean,
  app_id?: string,
  retryCount = 3,
): Promise<DeploymentResponse> {
  let lastError: Error | null = null

  for (let i = 0; i < retryCount; i++) {
    try {
      const requestBody = {
        file_content: fileContent,
        file_name: "data.ts",
        redeploy: redeploy || false,
        app_id: app_id,
      }

      const response = await fetch(`${API_URLS.LAMBDA_DEPLOY_APP}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-App-Name": appName,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new DeploymentError(`Deployment failed: ${response.statusText}. ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error occurred")

      // Only retry on network errors or 5xx server errors
      if (
        i < retryCount - 1 &&
        (error instanceof TypeError || (error instanceof DeploymentError && error.message.includes("5")))
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))) // Exponential backoff
        continue
      }
      throw lastError
    }
  }

  throw lastError || new DeploymentError("Failed to start deployment after retries")
}

export async function checkDeploymentStatus(
  accessToken: string,
  appId: string,
  buildId: string,
  retryCount = 3,
): Promise<DeploymentStatusResponse> {
  let lastError: Error | null = null

  for (let i = 0; i < retryCount; i++) {
    try {
      const response = await fetch(`${API_URLS.LAMBDA_DEPLOY_STATUS}?app_id=${appId}&build_id=${buildId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new DeploymentError(`Failed to check deployment status: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error occurred")

      // Only retry on network errors or 5xx server errors
      if (
        i < retryCount - 1 &&
        (error instanceof TypeError || (error instanceof DeploymentError && error.message.includes("5")))
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))) // Exponential backoff
        continue
      }
      throw lastError
    }
  }

  throw lastError || new DeploymentError("Failed to check deployment status after retries")
}

export async function pollDeploymentStatus(
  accessToken: string,
  appId: string,
  buildId: string,
  onStatusUpdate: (status: DeploymentStatusResponse) => void,
  onError: (error: Error) => void,
): Promise<void> {
  const poll = async () => {
    try {
      const status = await checkDeploymentStatus(accessToken, appId, buildId)
      onStatusUpdate(status)

      if (status.deployment_status === "pending") {
        setTimeout(poll, POLLING_INTERVAL)
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Unknown error occurred"))
    }
  }

  await poll()
}