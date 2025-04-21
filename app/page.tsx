"use client"

import type React from "react"
import Link from "next/link"
import { Shield, Zap, Eye, Brain, Heart, Menu, X, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useUser } from "@/context/user-context"

export default function Dashboard() {
  const { userStats, addExp, completeQuest } = useUser()

  // Calculate progress percentage for XP bar
  const expPercentage = (userStats.exp / userStats.expToNextLevel) * 100

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#e0f2ff]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Award className="h-8 w-8 text-[#4cc9ff]" />
            <h1 className="text-2xl font-bold tracking-tight text-[#4cc9ff]">SOLO LEVEL UP</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <Link href="/quests" className="text-sm font-medium hover:text-[#4cc9ff] transition-colors">
                Quests
              </Link>
              <Link href="/inventory" className="text-sm font-medium hover:text-[#4cc9ff] transition-colors">
                Inventory
              </Link>
              <Link href="/equipment" className="text-sm font-medium hover:text-[#4cc9ff] transition-colors">
                Equipment
              </Link>
              <Link href="/combat" className="text-sm font-medium hover:text-[#4cc9ff] transition-colors">
                Combat
              </Link>
              <Link href="/skills" className="text-sm font-medium hover:text-[#4cc9ff] transition-colors">
                Skills
              </Link>
              <Link href="/profile" className="text-sm font-medium hover:text-[#4cc9ff] transition-colors">
                Profile
              </Link>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0e14] border-[#1e2a3a]">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-[#4cc9ff]">Menu</h2>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col gap-4">
                  <Link href="/quests" className="text-base font-medium hover:text-[#4cc9ff] transition-colors">
                    Quests
                  </Link>
                  <Link href="/inventory" className="text-base font-medium hover:text-[#4cc9ff] transition-colors">
                    Inventory
                  </Link>
                  <Link href="/equipment" className="text-base font-medium hover:text-[#4cc9ff] transition-colors">
                    Equipment
                  </Link>
                  <Link href="/combat" className="text-base font-medium hover:text-[#4cc9ff] transition-colors">
                    Combat
                  </Link>
                  <Link href="/skills" className="text-base font-medium hover:text-[#4cc9ff] transition-colors">
                    Skills
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Status Panel */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 border border-[#4cc9ff]/30 rounded-lg shadow-[0_0_15px_rgba(76,201,255,0.15)]"></div>
          <div className="absolute inset-0 border-t-2 border-l-2 border-r-2 border-b-2 border-[#4cc9ff]/20 rounded-lg"></div>
          <div className="absolute top-0 left-0 w-[20px] h-[20px] border-t-2 border-l-2 border-[#4cc9ff]"></div>
          <div className="absolute top-0 right-0 w-[20px] h-[20px] border-t-2 border-r-2 border-[#4cc9ff]"></div>
          <div className="absolute bottom-0 left-0 w-[20px] h-[20px] border-b-2 border-l-2 border-[#4cc9ff]"></div>
          <div className="absolute bottom-0 right-0 w-[20px] h-[20px] border-b-2 border-r-2 border-[#4cc9ff]"></div>

          <div className="p-6 relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-xl uppercase tracking-wider text-[#4cc9ff] border-b border-[#4cc9ff]/30 pb-2 inline-block">
                STATUS
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              {/* Level and Title */}
              <div className="text-center">
                <div className="text-7xl font-bold text-[#4cc9ff] mb-1">{userStats.level}</div>
                <div className="text-sm uppercase tracking-wider text-[#8bacc1]">LEVEL</div>
                <div className="mt-4">
                  <div className="text-xs text-[#8bacc1]">JOB:</div>
                  <div className="text-sm">{userStats.job || "None"}</div>
                </div>
                <div className="mt-2">
                  <div className="text-xs text-[#8bacc1]">TITLE:</div>
                  <div className="text-sm">{userStats.title || "None"}</div>
                </div>
              </div>

              {/* HP/MP Bars */}
              <div className="w-full max-w-md">
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center">
                      <span className="text-[#4cc9ff] mr-1">HP</span>
                    </span>
                    <span>
                      {userStats.hp}/{userStats.maxHp}
                    </span>
                  </div>
                  <Progress value={(userStats.hp / userStats.maxHp) * 100} className="h-2 bg-[#1e2a3a]">
                    <div className="h-full bg-gradient-to-r from-[#4cc9ff] to-[#4cc9ff]/70 rounded-full" />
                  </Progress>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center">
                      <span className="text-[#4cc9ff] mr-1">MP</span>
                    </span>
                    <span>
                      {userStats.mp}/{userStats.maxMp}
                    </span>
                  </div>
                  <Progress value={(userStats.mp / userStats.maxMp) * 100} className="h-2 bg-[#1e2a3a]">
                    <div className="h-full bg-gradient-to-r from-[#4cc9ff] to-[#4cc9ff]/70 rounded-full" />
                  </Progress>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center">
                      <span className="text-[#4cc9ff] mr-1">EXP</span>
                    </span>
                    <span>
                      {userStats.exp}/{userStats.expToNextLevel}
                    </span>
                  </div>
                  <Progress value={expPercentage} className="h-2 bg-[#1e2a3a]">
                    <div className="h-full bg-gradient-to-r from-[#4cc9ff] to-[#4cc9ff]/70 rounded-full" />
                  </Progress>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center">
                      <span className="text-[#4cc9ff] mr-1">FATIGUE</span>
                    </span>
                    <span>{userStats.fatigue}</span>
                  </div>
                  <Progress value={userStats.fatigue} className="h-2 bg-[#1e2a3a]">
                    <div className="h-full bg-gradient-to-r from-[#ff4c4c] to-[#ff4c4c]/70 rounded-full" />
                  </Progress>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 border border-[#4cc9ff]/20 rounded-lg"></div>
              <div className="p-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-12">
                  <StatDisplay
                    icon={<Shield className="h-5 w-5 text-[#4cc9ff]" />}
                    name="STR"
                    value={userStats.stats.str}
                  />
                  <StatDisplay
                    icon={<Heart className="h-5 w-5 text-[#4cc9ff]" />}
                    name="VIT"
                    value={userStats.stats.vit}
                  />
                  <StatDisplay
                    icon={<Zap className="h-5 w-5 text-[#4cc9ff]" />}
                    name="AGI"
                    value={userStats.stats.agi}
                  />
                  <StatDisplay
                    icon={<Brain className="h-5 w-5 text-[#4cc9ff]" />}
                    name="INT"
                    value={userStats.stats.int}
                  />
                  <StatDisplay
                    icon={<Eye className="h-5 w-5 text-[#4cc9ff]" />}
                    name="PER"
                    value={userStats.stats.per}
                  />
                  <div className="flex items-center">
                    <div>
                      <div className="text-xs text-[#8bacc1] mb-1">Available Points</div>
                      <div className="text-3xl font-bold text-[#4cc9ff]">{userStats.statPoints}</div>
                    </div>
                    <Link href="/stats">
                      <Button className="ml-4 bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]">
                        Allocate
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Section */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 border border-[#4cc9ff]/30 rounded-lg shadow-[0_0_15px_rgba(76,201,255,0.15)]"></div>
          <div className="absolute inset-0 border-t-2 border-l-2 border-r-2 border-b-2 border-[#4cc9ff]/20 rounded-lg"></div>
          <div className="absolute top-0 left-0 w-[20px] h-[20px] border-t-2 border-l-2 border-[#4cc9ff]"></div>
          <div className="absolute top-0 right-0 w-[20px] h-[20px] border-t-2 border-r-2 border-[#4cc9ff]"></div>
          <div className="absolute bottom-0 left-0 w-[20px] h-[20px] border-b-2 border-l-2 border-[#4cc9ff]"></div>
          <div className="absolute bottom-0 right-0 w-[20px] h-[20px] border-b-2 border-r-2 border-[#4cc9ff]"></div>

          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl uppercase tracking-wider text-[#4cc9ff]">EQUIPMENT</h2>
              <Link href="/equipment">
                <Button variant="outline" className="border-[#4cc9ff]/50 hover:bg-[#4cc9ff]/10 text-[#4cc9ff]">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EquipmentCard
                name="Shadow Monarch's Helmet"
                rarity="Legendary"
                stats={["+15% Intelligence", "+10% Perception"]}
                setBonus="Shadow Monarch Set (2/5)"
                slot="Head"
              />
              <EquipmentCard
                name="Gauntlets of Strength"
                rarity="Epic"
                stats={["+12 Strength", "+8% Critical Rate"]}
                setBonus="Warrior's Set (1/5)"
                slot="Hands"
              />
              <EquipmentCard
                name="Boots of Agility"
                rarity="Rare"
                stats={["+10 Agility", "+5% Movement Speed"]}
                setBonus="None"
                slot="Feet"
              />
            </div>
          </div>
        </div>

        {/* Active Quests Section */}
        <div className="relative">
          <div className="absolute inset-0 border border-[#4cc9ff]/30 rounded-lg shadow-[0_0_15px_rgba(76,201,255,0.15)]"></div>
          <div className="absolute inset-0 border-t-2 border-l-2 border-r-2 border-b-2 border-[#4cc9ff]/20 rounded-lg"></div>
          <div className="absolute top-0 left-0 w-[20px] h-[20px] border-t-2 border-l-2 border-[#4cc9ff]"></div>
          <div className="absolute top-0 right-0 w-[20px] h-[20px] border-t-2 border-r-2 border-[#4cc9ff]"></div>
          <div className="absolute bottom-0 left-0 w-[20px] h-[20px] border-b-2 border-l-2 border-[#4cc9ff]"></div>
          <div className="absolute bottom-0 right-0 w-[20px] h-[20px] border-b-2 border-r-2 border-[#4cc9ff]"></div>

          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl uppercase tracking-wider text-[#4cc9ff]">ACTIVE QUESTS</h2>
              <Link href="/quests">
                <Button variant="outline" className="border-[#4cc9ff]/50 hover:bg-[#4cc9ff]/10 text-[#4cc9ff]">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userStats.quests
                .filter((q) => !q.completed)
                .slice(0, 4)
                .map((quest) => (
                  <QuestCard
                    key={quest.id}
                    title={quest.title}
                    description={quest.description}
                    reward={quest.reward}
                    progress={quest.progress}
                    difficulty={quest.difficulty}
                    onComplete={() => completeQuest(quest.id)}
                  />
                ))}
              {userStats.quests.filter((q) => !q.completed).length === 0 && (
                <div className="col-span-2 text-center py-8 text-[#8bacc1]">
                  No active quests. Create some quests to start leveling up!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatDisplay({ icon, name, value }: { icon: React.ReactNode; name: string; value: number }) {
  return (
    <div className="flex items-center">
      <div className="mr-3">{icon}</div>
      <div>
        <div className="text-xs text-[#8bacc1] mb-1">{name}</div>
        <div className="text-3xl font-bold text-[#4cc9ff]">{value}</div>
      </div>
    </div>
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
    </Card>
  )
}

function QuestCard({
  title,
  description,
  reward,
  progress,
  difficulty,
  onComplete,
}: {
  title: string
  description: string
  reward: string
  progress: number
  difficulty: "S" | "A" | "B" | "C" | "D" | "E"
  onComplete: () => void
}) {
  const difficultyColors = {
    S: "bg-red-500",
    A: "bg-orange-500",
    B: "bg-yellow-500",
    C: "bg-green-500",
    D: "bg-blue-500",
    E: "bg-purple-500",
  }

  return (
    <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
      <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{title}</CardTitle>
          <div
            className={`${difficultyColors[difficulty]} w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold`}
          >
            {difficulty}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-[#1e2a3a]">
            <div className="h-full bg-gradient-to-r from-[#4cc9ff] to-[#4cc9ff]/60 rounded-full" />
          </Progress>
          <div className="text-xs mt-2">
            <span className="text-[#8bacc1]">Reward: </span>
            <span className="text-[#4cc9ff]">{reward}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="relative z-10">
        <Button
          className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
          onClick={progress === 100 ? onComplete : undefined}
        >
          {progress === 0 ? "Start Quest" : progress === 100 ? "Claim Reward" : "Continue Quest"}
        </Button>
      </CardFooter>
    </Card>
  )
}
