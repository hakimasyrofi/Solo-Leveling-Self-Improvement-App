// Import the InventoryItem interface
import type { InventoryItem } from "@/data/enemies"

// Define the user data structure
export interface UserStats {
  name: string // Add this line
  level: number
  exp: number
  expToNextLevel: number
  job: string | null
  title: string | null
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  fatigue: number
  gold: number // Add gold currency
  stats: {
    str: number
    agi: number
    per: number
    int: number
    vit: number
  }
  statPoints: number
  equipment: Equipment[]
  quests: Quest[]
  completedQuests: string[]
  inventory: InventoryItem[] // Add inventory array
}

export interface Equipment {
  id: string
  name: string
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
  stats: string[]
  setBonus: string
  slot: string
  equipped: boolean
}

// Update the Quest interface to include a custom flag
export interface Quest {
  id: string
  title: string
  description: string
  reward: string
  progress: number
  difficulty: "S" | "A" | "B" | "C" | "D" | "E"
  expiry: string
  expReward: number
  statPointsReward: number
  active: boolean
  completed: boolean
  isCustom?: boolean // Flag to identify user-created quests
  statRewards?: {
    str?: number
    agi?: number
    per?: number
    int?: number
    vit?: number
  }
  itemRewards?: InventoryItem[] // Add item rewards
  goldReward?: number // Add gold reward
}

// Add some sample quests to the initial user stats
export const initialUserStats: UserStats = {
  name: "", // Add this line with empty string as default
  level: 1,
  exp: 0,
  expToNextLevel: 100, // Level 1 needs 100 XP to reach level 2
  job: null,
  title: null,
  hp: 100,
  maxHp: 100,
  mp: 10,
  maxMp: 10,
  fatigue: 0,
  gold: 0, // Start with 0 gold
  stats: {
    str: 10,
    agi: 10,
    per: 10,
    int: 10,
    vit: 10,
  },
  statPoints: 0,
  equipment: [],
  quests: [
    {
      id: "q1",
      title: "Daily Workout Routine",
      description: "Complete your strength training exercises",
      reward: "+5 Strength, +3 Vitality",
      progress: 0,
      difficulty: "B",
      expiry: "Daily",
      expReward: 50,
      statPointsReward: 2,
      active: true,
      completed: false,
      statRewards: {
        str: 5,
        vit: 3,
      },
      goldReward: 50,
    },
    {
      id: "q2",
      title: "Study Session",
      description: "Read chapter 5 of your textbook",
      reward: "+4 Intelligence, +2 Perception",
      progress: 0,
      difficulty: "C",
      expiry: "Daily",
      expReward: 30,
      statPointsReward: 1,
      active: true,
      completed: false,
      statRewards: {
        int: 4,
        per: 2,
      },
      goldReward: 30,
    },
    {
      id: "q3",
      title: "Meditation Practice",
      description: "Complete 20 minutes of focused meditation",
      reward: "+3 Perception, +2 Intelligence",
      progress: 0,
      difficulty: "D",
      expiry: "Daily",
      expReward: 20,
      statPointsReward: 1,
      active: true,
      completed: false,
      statRewards: {
        per: 3,
        int: 2,
      },
      goldReward: 20,
    },
    {
      id: "q4",
      title: "Project Deadline",
      description: "Complete your work project before the deadline",
      reward: "+10 Intelligence, +5 Agility",
      progress: 0,
      difficulty: "A",
      expiry: "Weekly",
      expReward: 100,
      statPointsReward: 5,
      active: true,
      completed: false,
      statRewards: {
        int: 10,
        agi: 5,
      },
      goldReward: 100,
      itemRewards: [
        {
          id: "item-focus-potion",
          name: "Focus Potion",
          type: "Consumable",
          rarity: "Uncommon",
          description: "Increases Intelligence by 5 for 1 hour.",
          quantity: 1,
        },
      ],
    },
  ],
  completedQuests: [],
  inventory: [
    {
      id: "item-health-potion",
      name: "Health Potion",
      type: "Consumable",
      rarity: "Common",
      description: "Restores 100 HP when consumed.",
      quantity: 3,
    },
    {
      id: "item-mana-potion",
      name: "Mana Potion",
      type: "Consumable",
      rarity: "Common",
      description: "Restores 50 MP when consumed.",
      quantity: 2,
    },
  ],
}

// Save user data to localStorage
export const saveUserStats = (stats: UserStats): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("soloLevelUpUserStats", JSON.stringify(stats))
  }
}

// Load user data from localStorage
export const loadUserStats = (): UserStats => {
  if (typeof window !== "undefined") {
    const savedStats = localStorage.getItem("soloLevelUpUserStats")
    if (savedStats) {
      return JSON.parse(savedStats)
    }
  }
  return initialUserStats
}

// Calculate XP needed for next level
export const calculateExpToNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.1, level - 1))
}

// Level up function
export const levelUp = (stats: UserStats): UserStats => {
  const newLevel = stats.level + 1

  // Automatic stat increases (small boost to all stats)
  const newStats = {
    str: stats.stats.str + 1,
    agi: stats.stats.agi + 1,
    per: stats.stats.per + 1,
    int: stats.stats.int + 1,
    vit: stats.stats.vit + 1,
  }

  // HP and MP increases based on level and vitality/intelligence
  const newMaxHp = Math.floor(100 + newLevel * 10 + newStats.vit * 5)
  const newMaxMp = Math.floor(10 + newLevel * 2 + newStats.int * 2)

  return {
    ...stats,
    level: newLevel,
    exp: stats.exp - stats.expToNextLevel,
    expToNextLevel: calculateExpToNextLevel(newLevel),
    maxHp: newMaxHp,
    hp: newMaxHp, // Fully heal on level up
    maxMp: newMaxMp,
    mp: newMaxMp, // Fully restore MP on level up
    stats: newStats,
    statPoints: stats.statPoints + 10, // Add 10 stat points per level
  }
}

// Add experience points
export const addExperience = (stats: UserStats, exp: number): UserStats => {
  let updatedStats = { ...stats, exp: stats.exp + exp }

  // Check if leveled up
  while (updatedStats.exp >= updatedStats.expToNextLevel) {
    updatedStats = levelUp(updatedStats)
  }

  return updatedStats
}

// Allocate stat point
export const allocateStat = (stats: UserStats, stat: keyof UserStats["stats"]): UserStats => {
  if (stats.statPoints <= 0) return stats

  const newStats = { ...stats }
  newStats.stats[stat]++
  newStats.statPoints--

  // Update derived stats
  if (stat === "vit") {
    newStats.maxHp = Math.floor(100 + newStats.level * 10 + newStats.stats.vit * 5)
  }
  if (stat === "int") {
    newStats.maxMp = Math.floor(10 + newStats.level * 2 + newStats.stats.int * 2)
  }

  return newStats
}

// Remove stat point (for UI)
export const deallocateStat = (stats: UserStats, stat: keyof UserStats["stats"]): UserStats => {
  if (stats.stats[stat] <= 10) return stats // Can't go below base value

  const newStats = { ...stats }
  newStats.stats[stat]--
  newStats.statPoints++

  // Update derived stats
  if (stat === "vit") {
    newStats.maxHp = Math.floor(100 + newStats.level * 10 + newStats.stats.vit * 5)
  }
  if (stat === "int") {
    newStats.maxMp = Math.floor(10 + newStats.level * 2 + newStats.stats.int * 2)
  }

  return newStats
}

// Add item to inventory
export const addItemToInventory = (stats: UserStats, item: InventoryItem): UserStats => {
  const newStats = { ...stats }
  const existingItem = newStats.inventory.find((i) => i.id === item.id)

  if (existingItem && existingItem.quantity) {
    // If item exists and has quantity, increment quantity
    existingItem.quantity += item.quantity || 1
  } else {
    // Otherwise add as new item
    newStats.inventory.push({
      ...item,
      quantity: item.quantity || 1,
    })
  }

  return newStats
}

// Remove item from inventory
export const removeItemFromInventory = (stats: UserStats, itemId: string, quantity = 1): UserStats => {
  const newStats = { ...stats }
  const itemIndex = newStats.inventory.findIndex((i) => i.id === itemId)

  if (itemIndex === -1) return stats

  const item = newStats.inventory[itemIndex]

  if (item.quantity && item.quantity > quantity) {
    // Reduce quantity if there are more than requested
    item.quantity -= quantity
  } else {
    // Remove item completely
    newStats.inventory.splice(itemIndex, 1)
  }

  return newStats
}

// Use consumable item
export const useConsumableItem = (stats: UserStats, itemId: string): UserStats => {
  const newStats = { ...stats }
  const item = newStats.inventory.find((i) => i.id === itemId)

  if (!item || item.type !== "Consumable") return stats

  // Apply item effects based on item id
  switch (item.id) {
    case "item-health-potion":
      newStats.hp = Math.min(newStats.maxHp, newStats.hp + 100)
      break
    case "item-mana-potion":
      newStats.mp = Math.min(newStats.maxMp, newStats.mp + 50)
      break
    case "item-focus-potion":
      // This would need a temporary buff system to be implemented
      break
    default:
      // Unknown consumable
      return stats
  }

  // Remove one of the item
  return removeItemFromInventory(newStats, itemId, 1)
}
