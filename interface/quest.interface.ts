import { InventoryItem } from "@/data/enemies";
import { UserStats } from "@/utils/storage";

// Define the Quest type
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
  createdAt?: number;
  completedAt?: number;
}
