"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LevelUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  levelUpCount: number;
}

export function LevelUpModal({
  open,
  onOpenChange,
  levelUpCount,
}: LevelUpModalProps) {
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    if (open && !audioPlayed) {
      // Create and play the audio when the modal is opened
      const audio = new Audio("/glitch-screen.mp3");
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      setAudioPlayed(true);
    }

    if (!open) {
      // Reset audio played state when modal is closed
      setAudioPlayed(false);
    }
  }, [open, audioPlayed]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0a0e14]/95 border-[#1e2a3a] text-[#e0f2ff]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#4cc9ff]">
            NOTIFICATION
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6">
          {/* Repeat "Leveled Up!" based on levelUpCount */}
          {Array.from({ length: levelUpCount }).map((_, index) => (
            <div
              key={index}
              className="text-xl font-bold text-[#4cc9ff] mb-2 animate-pulse"
            >
              Leveled Up!
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
