"use client"

import type React from "react"
import Link from "next/link"
import { ChevronLeft, Shield, Zap, Eye, Brain, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/context/user-context"

export default function EquipmentPage() {
  const { userStats } = useUser()

  // Sample equipment data - in a real app, this would come from the user context
  const equippedItems = [
    {
      id: "e1",
      name: "Shadow Monarch's Helmet",
      rarity: "Legendary" as const,
      stats: ["+15% Intelligence", "+10% Perception"],
      setBonus: "Shadow Monarch Set (2/5)",
      slot: "Head",
      equipped: true,
    },
    {
      id: "e2",
      name: "Gauntlets of Strength",
      rarity: "Epic" as const,
      stats: ["+12 Strength", "+8% Critical Rate"],
      setBonus: "Warrior's Set (1/5)",
      slot: "Hands",
      equipped: true,
    },
    {
      id: "e3",
      name: "Boots of Agility",
      rarity: "Rare" as const,
      stats: ["+10 Agility", "+5% Movement Speed"],
      setBonus: "None",
      slot: "Feet",
      equipped: true,
    },
    {
      id: "e4",
      name: "Shadow Monarch's Armor",
      rarity: "Legendary" as const,
      stats: ["+20 Defense", "+15% Vitality"],
      setBonus: "Shadow Monarch Set (2/5)",
      slot: "Chest",
      equipped: true,
    },
    {
      id: "e5",
      name: "Empty Slot",
      rarity: "Common" as const,
      stats: [],
      setBonus: "None",
      slot: "Accessory",
      equipped: false,
    },
    {
      id: "e6",
      name: "Empty Slot",
      rarity: "Common" as const,
      stats: [],
      setBonus: "None",
      slot: "Weapon",
      equipped: false,
    },
  ]

  const inventoryItems = [
    {
      id: "i1",
      name: "Amulet of Wisdom",
      rarity: "Epic" as const,
      stats: ["+15 Intelligence", "+10% Mana Regeneration"],
      setBonus: "Scholar's Set (1/3)",
      slot: "Accessory",
    },
    {
      id: "i2",
      name: "Dagger of Precision",
      rarity: "Rare" as const,
      stats: ["+8 Perception", "+12% Critical Damage"],
      setBonus: "Assassin's Set (1/4)",
      slot: "Weapon",
    },
    {
      id: "i3",
      name: "Bracers of Vitality",
      rarity: "Uncommon" as const,
      stats: ["+6 Vitality", "+5% Health Regeneration"],
      setBonus: "None",
      slot: "Hands",
    },
    {
      id: "i4",
      name: "Shadow Monarch's Greaves",
      rarity: "Legendary" as const,
      stats: ["+12 Agility", "+15% Movement Speed"],
      setBonus: "Shadow Monarch Set (1/5)",
      slot: "Feet",
    },
  ]

  // Calculate stat bonuses from equipment
  const calculateStatBonuses = () => {
    // In a real app, this would parse the equipment stats and calculate actual bonuses
    return {
      str: 18,
      agi: 10,
      per: 10,
      int: 10,
      vit: 10,
    }
  }

  const statBonuses = calculateStatBonuses()

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#e0f2ff] pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center mb-8">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon" className="hover:bg-[#1e2a3a]">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#4cc9ff]">Equipment</h1>
        </header>

        {/* Equipment Stats */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 border border-[#4cc9ff]/30 rounded-lg shadow-[0_0_15px_rgba(76,201,255,0.15)]"></div>
          <div className="absolute inset-0 border-t-2 border-l-2 border-r-2 border-b-2 border-[#4cc9ff]/20 rounded-lg"></div>
          <div className="absolute top-0 left-0 w-[20px] h-[20px] border-t-2 border-l-2 border-[#4cc9ff]"></div>
          <div className="absolute top-0 right-0 w-[20px] h-[20px] border-t-2 border-r-2 border-[#4cc9ff]"></div>
          <div className="absolute bottom-0 left-0 w-[20px] h-[20px] border-b-2 border-l-2 border-[#4cc9ff]"></div>
          <div className="absolute bottom-0 right-0 w-[20px] h-[20px] border-b-2 border-r-2 border-[#4cc9ff]"></div>

          <div className="p-6 relative z-10">
            <h2 className="text-xl uppercase tracking-wider text-[#4cc9ff] mb-6">Equipment Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatBonus
                icon={<Shield className="h-5 w-5 text-[#4cc9ff]" />}
                name="STR"
                baseValue={userStats.stats.str}
                bonusValue={statBonuses.str}
              />
              <StatBonus
                icon={<Zap className="h-5 w-5 text-[#4cc9ff]" />}
                name="AGI"
                baseValue={userStats.stats.agi}
                bonusValue={statBonuses.agi}
              />
              <StatBonus
                icon={<Eye className="h-5 w-5 text-[#4cc9ff]" />}
                name="PER"
                baseValue={userStats.stats.per}
                bonusValue={statBonuses.per}
              />
              <StatBonus
                icon={<Brain className="h-5 w-5 text-[#4cc9ff]" />}
                name="INT"
                baseValue={userStats.stats.int}
                bonusValue={statBonuses.int}
              />
              <StatBonus
                icon={<Heart className="h-5 w-5 text-[#4cc9ff]" />}
                name="VIT"
                baseValue={userStats.stats.vit}
                bonusValue={statBonuses.vit}
              />
            </div>
          </div>
        </div>

        {/* Equipment Slots */}
        <div className="mb-8">
          <Tabs defaultValue="equipped">
            <TabsList className="grid w-full grid-cols-2 bg-[#1e2a3a] border border-[#1e2a3a]">
              <TabsTrigger
                value="equipped"
                className="data-[state=active]:bg-[#0a0e14] data-[state=active]:border-t-2 data-[state=active]:border-[#4cc9ff]"
              >
                Equipped
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="data-[state=active]:bg-[#0a0e14] data-[state=active]:border-t-2 data-[state=active]:border-[#4cc9ff]"
              >
                Inventory
              </TabsTrigger>
            </TabsList>
            <TabsContent value="equipped" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equippedItems.map((item) => (
                  <EquipmentSlotCard
                    key={item.id}
                    name={item.name}
                    rarity={item.rarity}
                    stats={item.stats}
                    setBonus={item.setBonus}
                    slot={item.slot}
                    equipped={item.equipped}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="inventory" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inventoryItems.map((item) => (
                  <EquipmentCard
                    key={item.id}
                    name={item.name}
                    rarity={item.rarity}
                    stats={item.stats}
                    setBonus={item.setBonus}
                    slot={item.slot}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Set Bonuses */}
        <div>
          <h2 className="text-xl uppercase tracking-wider text-[#4cc9ff] mb-4">Set Bonuses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
              <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-base text-yellow-400">Shadow Monarch Set (2/5)</CardTitle>
                <CardDescription>Legendary Set</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#4cc9ff] mr-2"></div>
                    <span className="text-[#4cc9ff]">(2) Set: +15% Intelligence, +10% Perception</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#1e2a3a] mr-2"></div>
                    <span className="text-[#8bacc1]">(3) Set: +20% Mana Regeneration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#1e2a3a] mr-2"></div>
                    <span className="text-[#8bacc1]">(4) Set: +25% Skill Damage</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#1e2a3a] mr-2"></div>
                    <span className="text-[#8bacc1]">(5) Set: Unlock Shadow Extraction Ability</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
              <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-base text-purple-400">Warrior's Set (1/5)</CardTitle>
                <CardDescription>Epic Set</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#1e2a3a] mr-2"></div>
                    <span className="text-[#8bacc1]">(2) Set: +15% Strength, +10% Vitality</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#1e2a3a] mr-2"></div>
                    <span className="text-[#8bacc1]">(3) Set: +20% Physical Damage</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#1e2a3a] mr-2"></div>
                    <span className="text-[#8bacc1]">(4) Set: +25% Defense</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#1e2a3a] mr-2"></div>
                    <span className="text-[#8bacc1]">(5) Set: Unlock Berserker Rage Ability</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBonus({
  icon,
  name,
  baseValue,
  bonusValue,
}: {
  icon: React.ReactNode
  name: string
  baseValue: number
  bonusValue: number
}) {
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-[#0a0e14] border border-[#1e2a3a]">
      <div className="flex items-center justify-center mb-2">{icon}</div>
      <div className="text-xs text-[#8bacc1] mb-1">{name}</div>
      <div className="text-lg font-bold flex items-center">
        {baseValue} <span className="text-[#4cc9ff] text-sm ml-1">+{bonusValue}</span>
      </div>
    </div>
  )
}

function EquipmentSlotCard({
  name,
  rarity,
  stats,
  setBonus,
  slot,
  equipped,
}: {
  name: string
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
  stats: string[]
  setBonus: string
  slot: string
  equipped: boolean
}) {
  const rarityColors = {
    Common: "text-gray-400",
    Uncommon: "text-green-400",
    Rare: "text-[#4cc9ff]",
    Epic: "text-purple-400",
    Legendary: "text-yellow-400",
  }

  return (
    <Card className={`bg-[#0a0e14]/80 border-[#1e2a3a] overflow-hidden relative ${!equipped ? "opacity-50" : ""}`}>
      <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
      <div
        className={`h-1 w-full bg-gradient-to-r ${
          rarity === "Common"
            ? "from-gray-500 to-gray-600"
            : rarity === "Uncommon"
              ? "from-green-500 to-green-600"
              : rarity === "Rare"
                ? "from-[#4cc9ff] to-[#4cc9ff]/60"
                : rarity === "Epic"
                  ? "from-purple-500 to-purple-600"
                  : "from-yellow-500 to-yellow-600"
        }`}
      ></div>
      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-start">
          <CardTitle className={`text-base ${rarityColors[rarity]}`}>{name}</CardTitle>
          <span className="text-xs text-[#8bacc1]">{slot}</span>
        </div>
        <CardDescription className={rarityColors[rarity]}>{rarity}</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-1">
          {stats.length > 0 ? (
            stats.map((stat, index) => (
              <div key={index} className="text-xs">
                {stat}
              </div>
            ))
          ) : (
            <div className="text-xs text-[#8bacc1]">No item equipped</div>
          )}
          {stats.length > 0 && (
            <>
              <Separator className="my-2 bg-[#1e2a3a]" />
              <div className="text-xs text-[#8bacc1]">{setBonus}</div>
            </>
          )}
        </div>
      </CardContent>
      {equipped && (
        <CardFooter className="relative z-10">
          <Button variant="outline" className="w-full border-[#1e2a3a] hover:bg-[#1e2a3a] hover:text-white">
            Unequip
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

function EquipmentCard({
  name,
  rarity,
  stats,
  setBonus,
  slot,
}: {
  name: string
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
  stats: string[]
  setBonus: string
  slot: string
}) {
  const rarityColors = {
    Common: "text-gray-400",
    Uncommon: "text-green-400",
    Rare: "text-[#4cc9ff]",
    Epic: "text-purple-400",
    Legendary: "text-yellow-400",
  }

  return (
    <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] overflow-hidden relative">
      <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
      <div
        className={`h-1 w-full bg-gradient-to-r ${
          rarity === "Common"
            ? "from-gray-500 to-gray-600"
            : rarity === "Uncommon"
              ? "from-green-500 to-green-600"
              : rarity === "Rare"
                ? "from-[#4cc9ff] to-[#4cc9ff]/60"
                : rarity === "Epic"
                  ? "from-purple-500 to-purple-600"
                  : "from-yellow-500 to-yellow-600"
        }`}
      ></div>
      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-start">
          <CardTitle className={`text-base ${rarityColors[rarity]}`}>{name}</CardTitle>
          <span className="text-xs text-[#8bacc1]">{slot}</span>
        </div>
        <CardDescription className={rarityColors[rarity]}>{rarity}</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-1">
          {stats.map((stat, index) => (
            <div key={index} className="text-xs">
              {stat}
            </div>
          ))}
          <Separator className="my-2 bg-[#1e2a3a]" />
          <div className="text-xs text-[#8bacc1]">{setBonus}</div>
        </div>
      </CardContent>
      <CardFooter className="relative z-10">
        <Button className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]">
          Equip
        </Button>
      </CardFooter>
    </Card>
  )
}
