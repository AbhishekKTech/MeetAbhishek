"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { AlertCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ApiKeyForm } from "@/components/api-key-form"

type FormData = {
  name: string
  email: string
  message: string
}

interface ContactFormProps {
  apiKey?: string
  onApiKeyChange?: (key: string) => void
  isEditing?: boolean
}

export function ContactForm({ apiKey, onApiKeyChange, isEditing = false }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Contact form is not properly configured. Please set your Web3Forms API key.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("access_key", apiKey)
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("message", data.message)

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Message Sent",
          description: "Thank you for your message. I'll get back to you soon!",
        })
        reset() // Reset form
      } else {
        throw new Error(result.message || "Something went wrong")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!apiKey && !isEditing) {
    return (
      <div className="text-center space-y-4 py-8">
        <p className="text-muted-foreground">Contact form is not configured.</p>
        <p className="text-sm text-muted-foreground">Please enable editing mode to set up the contact form.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {isEditing && <ApiKeyForm currentKey={apiKey} onSave={(key) => onApiKeyChange?.(key)} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <Input
            id="name"
            className={errors.name ? "border-destructive" : ""}
            {...register("name", { required: "Name is required" })}
            disabled={isSubmitting}
          />
          {errors.name && (
            <div className="flex items-center gap-2 mt-1 text-sm text-destructive">
              <AlertCircle className="size-4" />
              <span>{errors.name.message}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            className={errors.email ? "border-destructive" : ""}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            disabled={isSubmitting}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <div className="flex items-center gap-2 mt-1 text-sm text-destructive">
              <AlertCircle className="size-4" />
              <span>{errors.email.message}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <Textarea
            id="message"
            className={errors.message ? "border-destructive" : ""}
            {...register("message", { required: "Message is required" })}
            rows={5}
            disabled={isSubmitting}
          />
          {errors.message && (
            <div className="flex items-center gap-2 mt-1 text-sm text-destructive">
              <AlertCircle className="size-4" />
              <span>{errors.message.message}</span>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || !apiKey}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  )
}