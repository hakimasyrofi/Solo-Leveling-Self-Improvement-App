"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  type UserStats,
  initialUserStats,
  loadUserStats,
  saveUserStats,
  addExperience,
  allocateStat,
  deallocateStat,
  addItemToInventory,
  removeItemFromInventory,
  useConsumableItem,
} from "@/utils/storage";
import type { InventoryItem } from "@/data/enemies";
// Add these imports
import { v4 as uuidv4 } from "uuid";
import { Quest } from "@/interface/quest.interface";

// Update the UserContextType interface to include quest management functions
interface UserContextType {
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  addExp: (exp: number) => void;
  allocateStatPoint: (stat: keyof UserStats["stats"]) => void;
  deallocateStatPoint: (stat: keyof UserStats["stats"]) => void;
  completeQuest: (questId: string) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  updateQuest: (
    questId: string,
    updates: Partial<Omit<Quest, "id" | "completed" | "progress">>
  ) => void;
  addCustomQuest: (
    quest: Omit<Quest, "id" | "active" | "completed" | "progress">
  ) => void;
  deleteQuest: (questId: string) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  useItem: (itemId: string) => void;
  addGold: (amount: number) => void;
  levelUpCount: number;
  showLevelUpModal: boolean;
  setShowLevelUpModal: (show: boolean) => void;
  resetLevelUpCount: () => void;
  inCombat: boolean;
  setInCombat: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
  const [isInitialized, setIsInitialized] = useState(false);
  const [itemToUse, setItemToUse] = useState<string | null>(null);
  // Add state to track level up events
  const [levelUpCount, setLevelUpCount] = useState(0);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  // Track last recovery time for HP and MP regeneration
  const [lastRecoveryTime, setLastRecoveryTime] = useState<number>(Date.now());
  const recoveryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Add state to track if player is in combat
  const [inCombat, setInCombat] = useState(false);

  // Reset level up count
  const resetLevelUpCount = () => {
    setLevelUpCount(0);
  };

  // Load user stats from localStorage on initial render
  useEffect(() => {
    let loadedStats = loadUserStats();

    // Check if there's a last recovery time stored in localStorage
    const storedLastRecoveryTime = localStorage.getItem("lastRecoveryTime");
    if (storedLastRecoveryTime) {
      setLastRecoveryTime(parseInt(storedLastRecoveryTime, 10));
    }

    // Check for recovery that should have happened while offline
    if (storedLastRecoveryTime) {
      const lastTime = parseInt(storedLastRecoveryTime, 10);
      const now = Date.now();
      const RECOVERY_INTERVAL = 500 * 60 * 10; // 5 minutes in milliseconds
      const RECOVERY_PERCENTAGE = 0.1; // 10%

      // Calculate how many recovery periods have passed
      const timeDifference = now - lastTime;
      const recoveryPeriods = Math.floor(timeDifference / RECOVERY_INTERVAL);

      if (recoveryPeriods > 0) {
        // Apply recovery for the time user was away
        const newStats = { ...loadedStats };

        if (newStats.hp < newStats.maxHp || newStats.mp < newStats.maxMp) {
          // Calculate total recovery amount (capped at max values)
          const hpRecoveryTotal = Math.min(
            newStats.maxHp - newStats.hp,
            Math.floor(newStats.maxHp * RECOVERY_PERCENTAGE * recoveryPeriods)
          );

          const mpRecoveryTotal = Math.min(
            newStats.maxMp - newStats.mp,
            Math.floor(newStats.maxMp * RECOVERY_PERCENTAGE * recoveryPeriods)
          );

          // Apply the recovery
          newStats.hp = Math.min(newStats.maxHp, newStats.hp + hpRecoveryTotal);
          newStats.mp = Math.min(newStats.maxMp, newStats.mp + mpRecoveryTotal);

          // Update the recovery time to reflect the most recent recovery
          const mostRecentRecoveryTime =
            lastTime + recoveryPeriods * RECOVERY_INTERVAL;
          setLastRecoveryTime(mostRecentRecoveryTime);
          localStorage.setItem(
            "lastRecoveryTime",
            mostRecentRecoveryTime.toString()
          );

          // Set the updated stats
          loadedStats = newStats;
        }
      }
    }

    setUserStats(loadedStats);
    setIsInitialized(true);
  }, []);

  // Save user stats to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      saveUserStats(userStats);
    }
  }, [userStats, isInitialized]);

  // Natural HP and MP recovery system - 10% every 5 minutes when not in combat
  useEffect(() => {
    if (!isInitialized) return;

    // Clear any existing interval
    if (recoveryIntervalRef.current) {
      clearInterval(recoveryIntervalRef.current);
    }

    const RECOVERY_INTERVAL = 500 * 60 * 10; // 5 minutes (changed from 5)
    const RECOVERY_PERCENTAGE = 0.1; // 10%
    const CHECK_INTERVAL = 60000; // Check every minute

    // Only proceed with recovery if not in combat
    if (!inCombat) {
      // Check if player needs recovery (if HP or MP is below max)
      const needsRecovery =
        userStats.hp < userStats.maxHp || userStats.mp < userStats.maxMp;

      if (needsRecovery) {
        // Set up interval for recovery
        recoveryIntervalRef.current = setInterval(() => {
          const now = Date.now();
          const timeSinceLastRecovery = now - lastRecoveryTime;

          // Check if enough time has passed for recovery
          if (timeSinceLastRecovery >= RECOVERY_INTERVAL) {
            setUserStats((prevStats) => {
              // Don't apply recovery if player is in combat
              if (inCombat) return prevStats;

              // Calculate recovery amounts (10% of max values)
              const hpRecoveryAmount = Math.floor(
                prevStats.maxHp * RECOVERY_PERCENTAGE
              );
              const mpRecoveryAmount = Math.floor(
                prevStats.maxMp * RECOVERY_PERCENTAGE
              );

              // Calculate new HP and MP values, not exceeding max values
              const newHp = Math.min(
                prevStats.maxHp,
                prevStats.hp + hpRecoveryAmount
              );
              const newMp = Math.min(
                prevStats.maxMp,
                prevStats.mp + mpRecoveryAmount
              );

              // Only update if there's actual recovery
              if (newHp === prevStats.hp && newMp === prevStats.mp) {
                return prevStats;
              }

              return {
                ...prevStats,
                hp: newHp,
                mp: newMp,
              };
            });

            // Update last recovery time and store in localStorage
            const newRecoveryTime = now;
            setLastRecoveryTime(newRecoveryTime);
            localStorage.setItem(
              "lastRecoveryTime",
              newRecoveryTime.toString()
            );
          }
        }, CHECK_INTERVAL); // Check every minute
      }
    }

    return () => {
      if (recoveryIntervalRef.current) {
        clearInterval(recoveryIntervalRef.current);
      }
    };
  }, [
    isInitialized,
    userStats.hp,
    userStats.mp,
    userStats.maxHp,
    userStats.maxMp,
    lastRecoveryTime,
    inCombat,
  ]);

  // Update lastRecoveryTime in localStorage when component unmounts
  useEffect(() => {
    return () => {
      localStorage.setItem("lastRecoveryTime", lastRecoveryTime.toString());
    };
  }, [lastRecoveryTime]);

  // Add experience points
  const addExp = (exp: number) => {
    const prevLevel = userStats.level;

    setUserStats((prevStats) => {
      const updatedStats = addExperience(prevStats, exp);

      // Check if level increased and by how much
      const levelDifference = updatedStats.level - prevLevel;

      if (levelDifference > 0) {
        // Update level up count and show modal
        setLevelUpCount(levelDifference);
        setShowLevelUpModal(true);
      }

      return updatedStats;
    });
  };

  // Allocate a stat point
  const allocateStatPoint = (stat: keyof UserStats["stats"]) => {
    setUserStats((prevStats) => allocateStat(prevStats, stat));
  };

  // Deallocate a stat point
  const deallocateStatPoint = (stat: keyof UserStats["stats"]) => {
    setUserStats((prevStats) => deallocateStat(prevStats, stat));
  };

  // Add these functions to the UserProvider component
  // Complete a quest
  const completeQuest = (questId: string) => {
    const prevLevel = userStats.level;

    setUserStats((prevStats) => {
      // Find the quest
      const quest = prevStats.quests.find((q) => q.id === questId);
      if (!quest) return prevStats;

      // First add the experience
      let newStats = addExperience(prevStats, quest.expReward);

      // Check if level increased and by how much
      const levelDifference = newStats.level - prevLevel;

      if (levelDifference > 0) {
        // Update level up count and show modal
        setLevelUpCount(levelDifference);
        setShowLevelUpModal(true);
      }

      // Then add the stat points
      newStats = {
        ...newStats,
        statPoints: newStats.statPoints + quest.statPointsReward,
        completedQuests: [...newStats.completedQuests, questId],
        quests: newStats.quests.map((q) =>
          q.id === questId
            ? {
                ...q,
                progress: 100,
                completed: true,
                active: false,
                completedAt: Date.now(), // Set completed timestamp
              }
            : q
        ),
      };

      // Apply stat rewards if any
      if (quest.statRewards) {
        Object.entries(quest.statRewards).forEach(([stat, value]) => {
          if (value && value > 0) {
            newStats.stats[stat as keyof UserStats["stats"]] += value;
          }
        });

        // Update derived stats
        if (quest.statRewards.vit) {
          newStats.maxHp = Math.floor(
            100 + newStats.level * 10 + newStats.stats.vit * 5
          );
          newStats.hp = newStats.maxHp; // Fully heal on stat increase
        }
        if (quest.statRewards.int) {
          newStats.maxMp = Math.floor(
            10 + newStats.level * 2 + newStats.stats.int * 2
          );
          newStats.mp = newStats.maxMp; // Fully restore MP on stat increase
        }
      }

      // Add gold reward if any
      if (quest.goldReward) {
        newStats.gold += quest.goldReward;
      }

      // Add item rewards if any
      if (quest.itemRewards && quest.itemRewards.length > 0) {
        quest.itemRewards.forEach((item) => {
          newStats = addItemToInventory(newStats, item);
        });
      }

      return newStats;
    });
  };

  // Update quest progress
  const updateQuestProgress = (questId: string, progress: number) => {
    setUserStats((prevStats) => ({
      ...prevStats,
      quests: prevStats.quests.map((quest) =>
        quest.id === questId ? { ...quest, progress } : quest
      ),
    }));
  };

  // Add a custom quest
  const addCustomQuest = (
    quest: Omit<Quest, "id" | "active" | "completed" | "progress">
  ) => {
    const newQuest = {
      ...quest,
      id: uuidv4(),
      active: true,
      completed: false,
      progress: 0,
      isCustom: true,
      createdAt: Date.now(), // Set created timestamp
    };

    setUserStats((prevStats) => ({
      ...prevStats,
      quests: [...prevStats.quests, newQuest],
    }));
  };

  // Delete a quest
  const deleteQuest = (questId: string) => {
    setUserStats((prevStats) => ({
      ...prevStats,
      quests: prevStats.quests.filter((quest) => quest.id !== questId),
    }));
  };

  // Add an item to inventory
  const addItem = (item: InventoryItem) => {
    setUserStats((prevStats) => addItemToInventory(prevStats, item));
  };

  // Remove an item from inventory
  const removeItem = (itemId: string, quantity?: number) => {
    setUserStats((prevStats) =>
      removeItemFromInventory(prevStats, itemId, quantity)
    );
  };

  // Use a consumable item
  const useItem = (itemId: string) => {
    setItemToUse(itemId);
  };

  // Add gold
  const addGold = (amount: number) => {
    setUserStats((prevStats) => ({
      ...prevStats,
      gold: prevStats.gold + amount,
    }));
  };

  const handleUseConsumableItem = useCallback(() => {
    if (itemToUse) {
      setUserStats((prevStats) => useConsumableItem(prevStats, itemToUse));
      setItemToUse(null);
    }
  }, [itemToUse, setUserStats]);

  useEffect(() => {
    handleUseConsumableItem();
  }, [handleUseConsumableItem]);

  // Add update quest function
  const updateQuest = (
    questId: string,
    updates: Partial<Omit<Quest, "id" | "completed" | "progress">>
  ) => {
    setUserStats((prevStats) => ({
      ...prevStats,
      quests: prevStats.quests.map((quest) =>
        quest.id === questId
          ? {
              ...quest,
              ...updates,
            }
          : quest
      ),
    }));
  };

  // Update the UserContext.Provider value
  return (
    <UserContext.Provider
      value={{
        userStats,
        setUserStats,
        addExp,
        allocateStatPoint,
        deallocateStatPoint,
        completeQuest,
        updateQuestProgress,
        updateQuest,
        addCustomQuest,
        deleteQuest,
        addItem,
        removeItem,
        useItem,
        addGold,
        levelUpCount,
        showLevelUpModal,
        setShowLevelUpModal,
        resetLevelUpCount,
        inCombat,
        setInCombat,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
