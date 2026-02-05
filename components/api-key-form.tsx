"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ApiKeyFormProps {
  currentKey?: string
  onSave: (key: string) => void
}

export function ApiKeyForm({ currentKey, onSave }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState(currentKey || "")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid API key",
      })
      return
    }

    onSave(apiKey.trim())
    setIsOpen(false)
    toast({
      title: "API Key Saved",
      description: "Your Web3Forms API key has been saved successfully.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {currentKey ? "Update Web3Forms API Key" : "Set Web3Forms API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Web3Forms API Key</DialogTitle>
          <DialogDescription>
            To enable the contact form, please enter your Web3Forms API key. You can get one by:
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>
                Going to{" "}
                <a
                  href="https://web3forms.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  web3forms.com
                </a>
              </li>
              <li>Creating an Access Key by entering your email</li>
            </ol>
            The API key will be sent to your email address.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Web3Forms API key"
            />
            {!apiKey && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>Required to receive contact form submissions</span>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save API Key</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}