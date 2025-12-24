export interface Enemy {
  id: string;
  name: string;
  level: number;
  stats: {
    str: number;
    vit: number;
    agi: number;
    int: number;
    per: number;
  };
  rewards: {
    gold: number;
    items: InventoryItem[];
    exp: number;
  };
  description?: string;
  imageUrl?: string;
}

export interface InventoryItem {
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
  stats?: {
    str?: number;
    vit?: number;
    agi?: number;
    int?: number;
    per?: number;
    resistance?: {
      fire?: number;
      ice?: number;
      lightning?: number;
      poison?: number;
      dark?: number;
    };
  };
  value?: number;
  imageUrl?: string;
}

export const enemies: Enemy[] = [
  {
    id: "enemy-goblin",
    name: "Goblin Scout",
    level: 5,
    stats: {
      str: 12,
      vit: 10,
      agi: 15,
      int: 5,
      per: 10,
    },
    rewards: {
      gold: 50,
      items: [
        {
          id: "item-goblin-ear",
          name: "Goblin Ear",
          type: "Material",
          rarity: "Common",
          description:
            "A proof of defeating a goblin. Can be traded for a small amount of gold.",
        },
      ],
      exp: 100,
    },
    description:
      "A small, green-skinned creature. Weak individually, but dangerous in groups.",
  },
  {
    id: "enemy-1",
    name: "Steel-fanged Lycan",
    level: 15,
    stats: {
      str: 22,
      vit: 18,
      agi: 28,
      int: 5,
      per: 15,
    },
    rewards: {
      gold: 200,
      items: [
        {
          id: "item-lycan-fang",
          name: "Lycan Fang",
          type: "Material",
          rarity: "Uncommon",
          description:
            "A sharp fang from a Steel-fanged Lycan. Used in crafting weapons and potions.",
        },
        {
          id: "item-minor-health-potion",
          name: "Minor Health Potion",
          type: "Consumable",
          rarity: "Common",
          description: "Restores 50 HP when consumed.",
        },
      ],
      exp: 400,
    },
    description:
      "A wolf-like creature with fangs as hard as steel. They hunt in packs and are known for their relentless speed.",
  },
  {
    id: "enemy-spider",
    name: "Giant Swamp Spider",
    level: 25,
    stats: {
      str: 35,
      vit: 40,
      agi: 20,
      int: 10,
      per: 25,
    },
    rewards: {
      gold: 500,
      items: [
        {
          id: "item-spider-venom",
          name: "Spider Venom",
          type: "Material",
          rarity: "Uncommon",
          description:
            "Potent venom from a giant spider. Can be used to coat weapons.",
        },
      ],
      exp: 1000,
    },
    description:
      "A massive arachnid that lurks in the shadows of dungeons. Its webs can trap even experienced hunters.",
  },
  {
    id: "enemy-cerberus",
    name: "Cerberus, Keeper of Hell",
    level: 40,
    stats: {
      str: 60,
      vit: 50,
      agi: 55,
      int: 20,
      per: 40,
    },
    rewards: {
      gold: 1200,
      items: [
        {
          id: "item-cerberus-tooth",
          name: "Cerberus Tooth",
          type: "Material",
          rarity: "Rare",
          description:
            "A tooth from the three-headed guardian of hell. Radiates intense heat.",
        },
        {
          id: "item-hellfire-essence",
          name: "Hellfire Essence",
          type: "Material",
          rarity: "Rare",
          description:
            "A concentrated essence of hellfire. Used to imbue weapons with fire damage.",
        },
      ],
      exp: 2500,
    },
    description:
      "The three-headed guardian of the Demon Castle's lower floors. A true gatekeeper that tests a hunter's limits.",
  },
  {
    id: "enemy-igris",
    name: "Blood-Red Commander Igris",
    level: 65,
    stats: {
      str: 110,
      vit: 90,
      agi: 120,
      int: 50,
      per: 80,
    },
    rewards: {
      gold: 5000,
      items: [
        {
          id: "item-igris-longsword",
          name: "Igris's Longsword",
          type: "Weapon",
          rarity: "Epic",
          description:
            "A sharp longsword used by the commander of the undead army.",
          stats: {
            str: 15,
            agi: 10,
          },
        },
        {
          id: "item-knights-helmet",
          name: "Knight's Helmet",
          type: "Armor",
          rarity: "Rare",
          description: "A sturdy helmet that provides excellent protection.",
          stats: {
            vit: 10,
          },
        },
      ],
      exp: 10000,
    },
    description:
      "The commander of the undead army and the final trial of the Job Change Quest. His speed and swordsmanship are legendary.",
  },
  {
    id: "enemy-kargalgan",
    name: "Kargalgan, High Orc Shaman",
    level: 95,
    stats: {
      str: 80,
      vit: 100,
      agi: 70,
      int: 200,
      per: 120,
    },
    rewards: {
      gold: 15000,
      items: [
        {
          id: "item-orb-of-avarice",
          name: "Orb of Avarice",
          type: "Accessory",
          rarity: "Epic",
          description:
            "A powerful orb that doubles the effectiveness of magic spells.",
          stats: {
            int: 30,
          },
        },
        {
          id: "item-high-orc-staff",
          name: "High Orc Staff",
          type: "Weapon",
          rarity: "Rare",
          description:
            "A staff used by High Orc shamans to channel their dark magic.",
          stats: {
            int: 20,
          },
        },
      ],
      exp: 25000,
    },
    description:
      "The leader of the High Orcs and a master of dark magic. His curses can weaken even the strongest warriors.",
  },
  {
    id: "enemy-5",
    name: "Baran, the Demon King",
    level: 120,
    stats: {
      str: 200,
      vit: 180,
      agi: 150,
      int: 220,
      per: 140,
    },
    rewards: {
      gold: 30000,
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
          description:
            "The crown worn by Baran, the Demon King. Grants immense power to the wearer.",
          stats: {
            str: 25,
            int: 25,
          },
        },
      ],
      exp: 50000,
    },
    description:
      "The ruler of the Demon Castle. He commands lightning and fire, standing at the pinnacle of the demon race.",
  },
  {
    id: "enemy-beru",
    name: "Beru, the Ant King",
    level: 160,
    stats: {
      str: 300,
      vit: 280,
      agi: 350,
      int: 200,
      per: 250,
    },
    rewards: {
      gold: 100000,
      items: [
        {
          id: "item-ant-king-mandible",
          name: "Ant King's Mandible",
          type: "Weapon",
          rarity: "Legendary",
          description:
            "A razor-sharp mandible from the Ant King. Can cut through almost anything.",
          stats: {
            str: 40,
            agi: 30,
          },
        },
        {
          id: "item-shadow-soldier-essence",
          name: "Shadow Soldier Essence",
          type: "Material",
          rarity: "Legendary",
          description:
            "A rare essence that can be used to strengthen shadow soldiers.",
        },
      ],
      exp: 150000,
    },
    description:
      "The ultimate lifeform from Jeju Island. A predator that evolved specifically to hunt and kill S-rank hunters.",
  },
  {
    id: "enemy-frost-monarch",
    name: "The Frost Monarch",
    level: 250,
    stats: {
      str: 400,
      vit: 350,
      agi: 450,
      int: 600,
      per: 350,
    },
    rewards: {
      gold: 500000,
      items: [
        {
          id: "item-frost-monarch-dagger",
          name: "Frost Monarch's Dagger",
          type: "Weapon",
          rarity: "Legendary",
          description:
            "A dagger made of eternal ice. Freezes the very soul of its target.",
          stats: {
            agi: 60,
          },
        },
        {
          id: "item-eternal-ice-crystal",
          name: "Eternal Ice Crystal",
          type: "Material",
          rarity: "Legendary",
          description:
            "A crystal that never melts, radiating a bone-chilling cold from the abyss.",
        },
      ],
      exp: 500000,
    },
    description:
      "One of the nine Monarchs. He rules over the world of ice and snow, possessing power that transcends human understanding.",
  },
  {
    id: "enemy-antares",
    name: "Antares, Monarch of Destruction",
    level: 400,
    stats: {
      str: 1000,
      vit: 900,
      agi: 800,
      int: 700,
      per: 600,
    },
    rewards: {
      gold: 2000000,
      items: [
        {
          id: "item-kamish-wrath",
          name: "Kamish's Wrath",
          type: "Weapon",
          rarity: "Legendary",
          description:
            "A dagger crafted from the tooth of the dragon Kamish. The ultimate weapon of destruction.",
          stats: {
            str: 150,
            agi: 120,
          },
        },
        {
          id: "item-dragon-heart",
          name: "Dragon Heart",
          type: "Material",
          rarity: "Legendary",
          description: "The heart of a dragon, the source of absolute power.",
        },
      ],
      exp: 2000000,
    },
    description:
      "The Monarch of Destruction and the King of Berserk Dragons. The strongest being in existence, whose power is absolute annihilation.",
  },
];
