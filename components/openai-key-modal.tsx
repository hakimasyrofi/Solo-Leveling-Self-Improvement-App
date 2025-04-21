"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { storeOpenAIKey } from "@/utils/openai"

interface OpenAIKeyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onKeySubmit: () => void
}

export function OpenAIKeyModal({ open, onOpenChange, onKeySubmit }: OpenAIKeyModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!apiKey.trim()) {
        throw new Error("API key is required")
      }

      // Simple validation - OpenAI keys typically start with "sk-"
      if (!apiKey.trim().startsWith("sk-")) {
        throw new Error("Invalid API key format. OpenAI keys typically start with 'sk-'")
      }

      // Store the API key
      storeOpenAIKey(apiKey.trim())

      // Call the onKeySubmit callback
      onKeySubmit()

      // Close the modal
      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0e14] border-[#1e2a3a] text-[#e0f2ff]">
        <DialogHeader>
          <DialogTitle className="text-[#4cc9ff]">OpenAI API Key Required</DialogTitle>
          <DialogDescription className="text-[#8bacc1]">
            To use AI features, please enter your OpenAI API key. This key will be stored securely in your browser for
            future use.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="bg-[#0a0e14] border-[#1e2a3a] focus-visible:ring-[#4cc9ff]"
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <p className="text-[#8bacc1] text-xs mt-1">
                Your API key is stored locally in your browser and is never sent to our servers. You can get an API key
                from{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4cc9ff] hover:underline"
                >
                  OpenAI's website
                </a>
                .
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#1e2a3a] hover:bg-[#1e2a3a]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save API Key"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
