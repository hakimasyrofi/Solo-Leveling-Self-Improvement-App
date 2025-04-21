export interface Enemy {
  id: string
  name: string
  level: number
  stats: {
    str: number
    vit: number
    agi: number
    int: number
    per: number
  }
  rewards: {
    gold: number
    items: InventoryItem[]
    exp: number
  }
  description?: string
  imageUrl?: string
}

export interface InventoryItem {
  id: string
  name: string
  type: "Material" | "Weapon" | "Armor" | "Accessory" | "Consumable" | "Quest" | "Rune"
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
  description: string
  quantity?: number
  stats?: {
    str?: number
    vit?: number
    agi?: number
    int?: number
    per?: number
    resistance?: {
      fire?: number
      ice?: number
      lightning?: number
      poison?: number
      dark?: number
    }
  }
  value?: number
  imageUrl?: string
}

export const enemies: Enemy[] = [
  {
    id: "enemy-1",
    name: "Blue Mane Lycan",
    level: 15,
    stats: {
      str: 20,
      vit: 18,
      agi: 25,
      int: 5,
      per: 10,
    },
    rewards: {
      gold: 150,
      items: [
        {
          id: "item-lycan-fang",
          name: "Lycan Fang",
          type: "Material",
          rarity: "Uncommon",
          description: "A sharp fang from a Blue Mane Lycan. Used in crafting weapons and potions.",
        },
        {
          id: "item-minor-health-potion",
          name: "Minor Health Potion",
          type: "Consumable",
          rarity: "Common",
          description: "Restores 50 HP when consumed.",
        },
      ],
      exp: 300,
    },
    description: "A wolf-like creature with a distinctive blue mane. Known for their speed and ferocity.",
  },
  {
    id: "enemy-2",
    name: "Cave Rock Golem",
    level: 25,
    stats: {
      str: 30,
      vit: 35,
      agi: 10,
      int: 5,
      per: 15,
    },
    rewards: {
      gold: 300,
      items: [
        {
          id: "item-golem-core",
          name: "Golem Core",
          type: "Material",
          rarity: "Rare",
          description: "The magical core that animates a rock golem. Highly valued by enchanters.",
        },
        {
          id: "item-defense-rune",
          name: "Defense Rune",
          type: "Rune",
          rarity: "Uncommon",
          description: "A rune that increases Vitality by 2 when applied to armor.",
          stats: {
            vit: 2,
          },
        },
      ],
      exp: 600,
    },
    description: "A massive creature formed from cave rocks and animated by ancient magic. Slow but incredibly tough.",
  },
  {
    id: "enemy-3",
    name: "Undead Knight",
    level: 35,
    stats: {
      str: 40,
      vit: 30,
      agi: 20,
      int: 15,
      per: 20,
    },
    rewards: {
      gold: 450,
      items: [
        {
          id: "item-cursed-blade",
          name: "Cursed Blade",
          type: "Weapon",
          rarity: "Rare",
          description: "A blade that drains life from its victims. Grants a chance to steal HP on hit.",
          stats: {
            str: 5,
          },
        },
        {
          id: "item-shadow-essence",
          name: "Shadow Essence",
          type: "Material",
          rarity: "Rare",
          description: "A dark, swirling essence extracted from undead creatures. Used in shadow magic.",
        },
      ],
      exp: 900,
    },
    description: "A knight who continues to fight long after death. Retains the combat skills it had in life.",
  },
  {
    id: "enemy-4",
    name: "Red-eyed Ice Bear",
    level: 45,
    stats: {
      str: 50,
      vit: 45,
      agi: 15,
      int: 10,
      per: 25,
    },
    rewards: {
      gold: 600,
      items: [
        {
          id: "item-ice-bear-pelt",
          name: "Ice Bear Pelt",
          type: "Material",
          rarity: "Rare",
          description: "A thick, insulating pelt from a Red-eyed Ice Bear. Used to craft cold-resistant gear.",
        },
        {
          id: "item-frost-amulet",
          name: "Frost Amulet",
          type: "Accessory",
          rarity: "Epic",
          description: "An amulet that grants resistance to ice damage and cold environments.",
          stats: {
            resistance: {
              ice: 5,
            },
          },
        },
      ],
      exp: 1200,
    },
    description:
      "A massive bear with glowing red eyes, adapted to the coldest environments. Its roar can freeze the air.",
  },
  {
    id: "enemy-5",
    name: "Baran, the Demon King",
    level: 60,
    stats: {
      str: 70,
      vit: 60,
      agi: 40,
      int: 50,
      per: 35,
    },
    rewards: {
      gold: 1200,
      items: [
        {
          id: "item-barans-flame",
          name: "Baran's Flame",
          type: "Material",
          rarity: "Legendary",
          description:
            "The eternal flame that burns within the Demon King's heart. Used in the most powerful enchantments.",
        },
        {
          id: "item-demon-kings-crown",
          name: "Demon King's Crown",
          type: "Accessory",
          rarity: "Legendary",
          description: "The crown worn by Baran, the Demon King. Grants immense power to the wearer.",
          stats: {
            str: 10,
            int: 10,
          },
        },
      ],
      exp: 2500,
    },
    description: "The ruler of the demon realm, Baran possesses immense power and commands legions of lesser demons.",
  },
]
