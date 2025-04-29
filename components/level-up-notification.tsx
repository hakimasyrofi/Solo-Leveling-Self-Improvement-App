"use client";

import { useUser } from "@/context/user-context";
import { LevelUpModal } from "@/components/level-up-modal";

export function LevelUpNotification() {
  const {
    showLevelUpModal,
    setShowLevelUpModal,
    levelUpCount,
    resetLevelUpCount,
  } = useUser();

  const handleCloseModal = () => {
    setShowLevelUpModal(false);
    resetLevelUpCount();
  };

  return (
    <LevelUpModal
      open={showLevelUpModal}
      onOpenChange={handleCloseModal}
      levelUpCount={levelUpCount}
    />
  );
}
