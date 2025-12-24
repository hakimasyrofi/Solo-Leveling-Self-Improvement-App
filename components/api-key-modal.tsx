"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { storeAPIKey, getAPIKey, getAIProvider } from "@/utils/ai-service";

interface APIKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeySubmit: (provider: string) => void;
  mode?: "initial" | "edit";
}

export function APIKeyModal({
  open,
  onOpenChange,
  onKeySubmit,
  mode = "initial",
}: APIKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<"openai" | "gemini">("openai");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if API key already exists when modal opens
  useEffect(() => {
    if (open) {
      const existingProvider = getAIProvider() as "openai" | "gemini";
      if (existingProvider) {
        setProvider(existingProvider);
      }

      if (mode === "initial") {
        const existingKey = getAPIKey();
        if (existingKey) {
          // If key exists, auto-submit and close modal
          onKeySubmit(existingProvider || provider);
          onOpenChange(false);
        }
      }
    }
  }, [open, mode, onKeySubmit, onOpenChange, provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!apiKey.trim()) {
        throw new Error("API key is required");
      }

      // Simple validation based on provider
      if (provider === "openai" && !apiKey.trim().startsWith("sk-")) {
        throw new Error(
          "Invalid OpenAI API key format. OpenAI keys typically start with 'sk-'"
        );
      }

      // Store the API key with the selected provider
      storeAPIKey(provider, apiKey.trim());

      // Call the onKeySubmit callback with the provider
      onKeySubmit(provider);

      // Close the modal
      onOpenChange(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[#0a0e14] border-[#1e2a3a] text-[#e0f2ff] w-[90%] sm:max-w-md animate-solo-modal"
        style={
          {
            "--solo-expand-duration": "0.5s",
            "--solo-expand-easing": "cubic-bezier(0.16, 1, 0.3, 1)",
          } as React.CSSProperties
        }
      >
        <DialogHeader>
          <DialogTitle className="text-[#4cc9ff]">
            AI API Key Required
          </DialogTitle>
          <DialogDescription className="text-[#8bacc1]">
            To use AI features, please enter your API key. This key will be
            stored securely in your browser for future use.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select AI Provider</Label>
              <RadioGroup
                value={provider}
                onValueChange={(value) =>
                  setProvider(value as "openai" | "gemini")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="openai" id="openai" />
                  <Label htmlFor="openai" className="cursor-pointer">
                    OpenAI
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gemini" id="gemini" />
                  <Label htmlFor="gemini" className="cursor-pointer">
                    Gemini
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="apiKey">
                {provider === "openai" ? "OpenAI" : "Gemini"} API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  provider === "openai" ? "sk-..." : "Enter your Gemini API key"
                }
                className="bg-[#0a0e14] border-[#1e2a3a] focus-visible:ring-[#4cc9ff]"
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <p className="text-[#8bacc1] text-xs mt-1">
                Your API key is stored locally in your browser and is never sent
                to our servers. You can get an API key from{" "}
                {provider === "openai" ? (
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4cc9ff] hover:underline"
                  >
                    OpenAI's website
                  </a>
                ) : (
                  <a
                    href="https://ai.google.dev/tutorials/setup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4cc9ff] hover:underline"
                  >
                    Google AI Studio
                  </a>
                )}
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
  );
}
