export interface PredefinedItem {
  id: string;
  name: string;
  type:
    | "Material"
    | "Weapon"
    | "Armor"
    | "Accessory"
    | "Consumable"
    | "Quest"
    | "Rune";
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  description: string;
  quantity?: number;
}

// Define standard consumable items for quest rewards
export const predefinedConsumables: PredefinedItem[] = [
  {
    id: "item-health-potion",
    name: "Health Potion",
    type: "Consumable",
    rarity: "Common",
    description: "Restores 100 HP when consumed.",
    quantity: 1,
  },
  {
    id: "item-mana-potion",
    name: "Mana Potion",
    type: "Consumable",
    rarity: "Common",
    description: "Restores 50 MP when consumed.",
    quantity: 1,
  },
  {
    id: "item-greater-health-potion",
    name: "Greater Health Potion",
    type: "Consumable",
    rarity: "Uncommon",
    description: "Restores 200 HP when consumed.",
    quantity: 1,
  },
  {
    id: "item-greater-mana-potion",
    name: "Greater Mana Potion",
    type: "Consumable",
    rarity: "Uncommon",
    description: "Restores 100 MP when consumed.",
    quantity: 1,
  },
  {
    id: "item-healing-elixir",
    name: "Healing Elixir",
    type: "Consumable",
    rarity: "Rare",
    description: "Restores 350 HP when consumed.",
    quantity: 1,
  },
  {
    id: "item-mana-elixir",
    name: "Mana Elixir",
    type: "Consumable",
    rarity: "Rare",
    description: "Restores 175 MP when consumed.",
    quantity: 1,
  },
];
