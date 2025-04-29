// Import the InventoryItem interface
import type { InventoryItem } from "@/data/enemies";

// Define the user data structure
export interface UserStats {
  name: string; // Add this line
  level: number;
  exp: number;
  expToNextLevel: number;
  job: string | null;
  title: string | null;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  fatigue: number;
  gold: number; // Add gold currency
  stats: {
    str: number;
    agi: number;
    per: number;
    int: number;
    vit: number;
  };
  statPoints: number;
  equipment: Equipment[];
  quests: Quest[];
  completedQuests: string[];
  inventory: InventoryItem[]; // Add inventory array
}

export interface Equipment {
  id: string;
  name: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  stats: string[];
  setBonus: string;
  slot: string;
  equipped: boolean;
}

// Update the Quest interface to include a custom flag
export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  difficulty: "S" | "A" | "B" | "C" | "D" | "E";
  expiry: string;
  expReward: number;
  statPointsReward: number;
  active: boolean;
  completed: boolean;
  isCustom?: boolean; // Flag to identify user-created quests
  statRewards?: {
    str?: number;
    agi?: number;
    per?: number;
    int?: number;
    vit?: number;
  };
  itemRewards?: InventoryItem[]; // Add item rewards
  goldReward?: number; // Add gold reward
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
  quests: [], // Removed initial quests
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
};

// Save user data to localStorage
export const saveUserStats = (stats: UserStats): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("soloLevelUpUserStats", JSON.stringify(stats));
  }
};

// Load user data from localStorage
export const loadUserStats = (): UserStats => {
  if (typeof window !== "undefined") {
    const savedStats = localStorage.getItem("soloLevelUpUserStats");
    if (savedStats) {
      return JSON.parse(savedStats);
    }
  }
  return initialUserStats;
};

// Calculate XP needed for next level
export const calculateExpToNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.1, level - 1));
};

// Update the levelUp function to automatically add 1 point to all stats
export const levelUp = (stats: UserStats): UserStats => {
  const newLevel = stats.level + 1;

  // Automatically increase all stats by 1 point
  const newStats = {
    str: stats.stats.str + 1,
    agi: stats.stats.agi + 1,
    per: stats.stats.per + 1,
    int: stats.stats.int + 1,
    vit: stats.stats.vit + 1,
  };

  // HP and MP increases based on level and vitality/intelligence
  const newMaxHp = Math.floor(100 + newLevel * 10 + newStats.vit * 5);
  const newMaxMp = Math.floor(10 + newLevel * 2 + newStats.int * 2);

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
    // No longer adding stat points since we automatically increase all stats
  };
};

// Add experience points
export const addExperience = (stats: UserStats, exp: number): UserStats => {
  let updatedStats = { ...stats, exp: stats.exp + exp };

  // Check if leveled up
  while (updatedStats.exp >= updatedStats.expToNextLevel) {
    updatedStats = levelUp(updatedStats);
  }

  return updatedStats;
};

// Allocate stat point
export const allocateStat = (
  stats: UserStats,
  stat: keyof UserStats["stats"]
): UserStats => {
  if (stats.statPoints <= 0) return stats;

  const newStats = { ...stats };
  newStats.stats[stat]++;
  newStats.statPoints--;

  // Update derived stats
  if (stat === "vit") {
    newStats.maxHp = Math.floor(
      100 + newStats.level * 10 + newStats.stats.vit * 5
    );
  }
  if (stat === "int") {
    newStats.maxMp = Math.floor(
      10 + newStats.level * 2 + newStats.stats.int * 2
    );
  }

  return newStats;
};

// Remove stat point (for UI)
export const deallocateStat = (
  stats: UserStats,
  stat: keyof UserStats["stats"]
): UserStats => {
  if (stats.stats[stat] <= 10) return stats; // Can't go below base value

  const newStats = { ...stats };
  newStats.stats[stat]--;
  newStats.statPoints++;

  // Update derived stats
  if (stat === "vit") {
    newStats.maxHp = Math.floor(
      100 + newStats.level * 10 + newStats.stats.vit * 5
    );
  }
  if (stat === "int") {
    newStats.maxMp = Math.floor(
      10 + newStats.level * 2 + newStats.stats.int * 2
    );
  }

  return newStats;
};

// Add item to inventory
export const addItemToInventory = (
  stats: UserStats,
  item: InventoryItem
): UserStats => {
  const newStats = { ...stats };
  const existingItem = newStats.inventory.find((i) => i.id === item.id);

  if (existingItem && existingItem.quantity) {
    // If item exists and has quantity, increment quantity
    existingItem.quantity += item.quantity || 1;
  } else {
    // Otherwise add as new item
    newStats.inventory.push({
      ...item,
      quantity: item.quantity || 1,
    });
  }

  return newStats;
};

// Remove item from inventory
export const removeItemFromInventory = (
  stats: UserStats,
  itemId: string,
  quantity = 1
): UserStats => {
  const newStats = { ...stats };
  const itemIndex = newStats.inventory.findIndex((i) => i.id === itemId);

  if (itemIndex === -1) return stats;

  const item = newStats.inventory[itemIndex];

  if (item.quantity && item.quantity > quantity) {
    // Reduce quantity if there are more than requested
    item.quantity -= quantity;
  } else {
    // Remove item completely
    newStats.inventory.splice(itemIndex, 1);
  }

  return newStats;
};

// Use consumable item
export const useConsumableItem = (
  stats: UserStats,
  itemId: string
): UserStats => {
  const newStats = { ...stats };
  const item = newStats.inventory.find((i) => i.id === itemId);

  if (!item || item.type !== "Consumable") return stats;

  // First try specific item IDs for built-in items
  switch (item.id) {
    case "item-health-potion":
      newStats.hp = Math.min(newStats.maxHp, newStats.hp + 100);
      break;
    case "item-mana-potion":
      newStats.mp = Math.min(newStats.maxMp, newStats.mp + 50);
      break;
    case "item-focus-potion":
      // This would need a temporary buff system to be implemented
      break;
    default:
      // For custom/generated items, check name patterns instead of relying on specific IDs
      if (
        item.name.toLowerCase().includes("health") ||
        item.name.toLowerCase().includes("healing") ||
        item.name.toLowerCase().includes("hp")
      ) {
        // Default healing amount (can be customized based on rarity)
        let healAmount = 50;
        if (item.rarity === "Uncommon") healAmount = 100;
        if (item.rarity === "Rare") healAmount = 200;
        if (item.rarity === "Epic") healAmount = 350;
        if (item.rarity === "Legendary") healAmount = 500;

        newStats.hp = Math.min(newStats.maxHp, newStats.hp + healAmount);
      } else if (
        item.name.toLowerCase().includes("mana") ||
        item.name.toLowerCase().includes("mp")
      ) {
        // Default mana restoration amount
        let manaAmount = 25;
        if (item.rarity === "Uncommon") manaAmount = 50;
        if (item.rarity === "Rare") manaAmount = 100;
        if (item.rarity === "Epic") manaAmount = 175;
        if (item.rarity === "Legendary") manaAmount = 250;

        newStats.mp = Math.min(newStats.maxMp, newStats.mp + manaAmount);
      } else {
        // Unknown consumable effect
        return stats;
      }
  }

  // Remove one of the item
  return removeItemFromInventory(newStats, itemId, 1);
};
