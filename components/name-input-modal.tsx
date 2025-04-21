"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { useUser } from "@/context/user-context"

export function NameInputModal() {
  const { userStats, setUserStats } = useUser()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")

  // Check if name is empty on component mount
  useEffect(() => {
    if (!userStats.name) {
      setOpen(true)
    }
  }, [userStats.name])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setUserStats((prev) => ({
        ...prev,
        name: name.trim(),
      }))
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#0a0e14] border-[#1e2a3a] text-[#e0f2ff]">
        <DialogHeader>
          <DialogTitle className="text-[#4cc9ff]">Welcome, Hunter</DialogTitle>
          <DialogDescription className="text-[#8bacc1]">
            Before you begin your journey, please tell us your name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-[#0a0e14] border-[#1e2a3a] focus-visible:ring-[#4cc9ff]"
                required
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
              disabled={!name.trim()}
            >
              Begin Adventure
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
