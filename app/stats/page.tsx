"use client"

import type React from "react"
import Link from "next/link"
import { Shield, Zap, Eye, Brain, Heart, ChevronLeft, Plus, Minus, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUser } from "@/context/user-context"
import type { UserStats } from "@/utils/storage"

export default function StatsPage() {
  const { userStats, allocateStatPoint, deallocateStatPoint } = useUser()

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#e0f2ff]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center mb-8">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon" className="hover:bg-[#1e2a3a]">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#4cc9ff]">Stat Allocation</h1>
        </header>

        {/* Stats Overview */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 border border-[#4cc9ff]/30 rounded-lg shadow-[0_0_15px_rgba(76,201,255,0.15)]"></div>
          <div className="absolute inset-0 border-t-2 border-l-2 border-r-2 border-b-2 border-[#4cc9ff]/20 rounded-lg"></div>
          <div className="absolute top-0 left-0 w-[20px] h-[20px] border-t-2 border-l-2 border-[#4cc9ff]"></div>
          <div className="absolute top-0 right-0 w-[20px] h-[20px] border-t-2 border-r-2 border-[#4cc9ff]"></div>
          <div className="absolute bottom-0 left-0 w-[20px] h-[20px] border-b-2 border-l-2 border-[#4cc9ff]"></div>
          <div className="absolute bottom-0 right-0 w-[20px] h-[20px] border-b-2 border-r-2 border-[#4cc9ff]"></div>

          <div className="p-6 relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl uppercase tracking-wider text-[#4cc9ff]">Available Points</h2>
              <div className="text-3xl font-bold text-[#4cc9ff]">{userStats.statPoints}</div>
            </div>
            <CardContent className="space-y-6 p-0">
              <StatAllocationRow
                icon={<Shield className="h-5 w-5 text-[#4cc9ff]" />}
                name="str"
                displayName="STR"
                value={userStats.stats.str}
                description="Enhances physical power and attack damage. Ideal for physical tasks and strength training."
                onIncrease={() => allocateStatPoint("str")}
                onDecrease={() => deallocateStatPoint("str")}
                canIncrease={userStats.statPoints > 0}
                canDecrease={userStats.stats.str > 10}
              />

              <StatAllocationRow
                icon={<Zap className="h-5 w-5 text-[#4cc9ff]" />}
                name="agi"
                displayName="AGI"
                value={userStats.stats.agi}
                description="Boosts speed, reflexes, and critical hit rate. Represents quickness and dexterity."
                onIncrease={() => allocateStatPoint("agi")}
                onDecrease={() => deallocateStatPoint("agi")}
                canIncrease={userStats.statPoints > 0}
                canDecrease={userStats.stats.agi > 10}
              />

              <StatAllocationRow
                icon={<Eye className="h-5 w-5 text-[#4cc9ff]" />}
                name="per"
                displayName="PER"
                value={userStats.stats.per}
                description="Increases precision and awareness. Reflects focus, attention to detail, and consistency."
                onIncrease={() => allocateStatPoint("per")}
                onDecrease={() => deallocateStatPoint("per")}
                canIncrease={userStats.statPoints > 0}
                canDecrease={userStats.stats.per > 10}
              />

              <StatAllocationRow
                icon={<Brain className="h-5 w-5 text-[#4cc9ff]" />}
                name="int"
                displayName="INT"
                value={userStats.stats.int}
                description="Enhances cognitive abilities and reduces skill cooldowns. Suitable for learning and problem-solving."
                onIncrease={() => allocateStatPoint("int")}
                onDecrease={() => deallocateStatPoint("int")}
                canIncrease={userStats.statPoints > 0}
                canDecrease={userStats.stats.int > 10}
              />

              <StatAllocationRow
                icon={<Heart className="h-5 w-5 text-[#4cc9ff]" />}
                name="vit"
                displayName="VIT"
                value={userStats.stats.vit}
                description="Increases health and defense. Represents endurance, resilience, and overall wellbeing."
                onIncrease={() => allocateStatPoint("vit")}
                onDecrease={() => deallocateStatPoint("vit")}
                canIncrease={userStats.statPoints > 0}
                canDecrease={userStats.stats.vit > 10}
              />
            </CardContent>
            <CardFooter className="px-0 pt-6">
              <Link href="/" className="w-full">
                <Button className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]">
                  Return to Dashboard
                </Button>
              </Link>
            </CardFooter>
          </div>
        </div>

        {/* Stat Effects */}
        <div>
          <h2 className="text-xl uppercase tracking-wider text-[#4cc9ff] mb-4">Stat Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
              <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-base text-[#4cc9ff]">Strength Effects</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Base Attack Power</span>
                    <span className="font-medium">{userStats.stats.str * 2}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Physical Task Efficiency</span>
                    <span className="font-medium">+{userStats.stats.str}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Carry Capacity</span>
                    <span className="font-medium">{userStats.stats.str * 3} units</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
              <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-base text-[#4cc9ff]">Agility Effects</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Critical Hit Rate</span>
                    <span className="font-medium">{(userStats.stats.agi * 0.5).toFixed(1)}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Reaction Time</span>
                    <span className="font-medium">-{(userStats.stats.agi * 0.4).toFixed(1)}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Movement Speed</span>
                    <span className="font-medium">+{userStats.stats.agi}%</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
              <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-base text-[#4cc9ff]">Perception Effects</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Accuracy</span>
                    <span className="font-medium">+{userStats.stats.per}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Detection Range</span>
                    <span className="font-medium">{userStats.stats.per * 2} meters</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Minimum Damage</span>
                    <span className="font-medium">{userStats.stats.per} points</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
              <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-base text-[#4cc9ff]">Intelligence Effects</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Mana Points (MP)</span>
                    <span className="font-medium">{userStats.maxMp}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Skill Cooldown Reduction</span>
                    <span className="font-medium">-{(userStats.stats.int * 0.5).toFixed(1)}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Learning Efficiency</span>
                    <span className="font-medium">+{userStats.stats.int}%</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
              <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-base text-[#4cc9ff]">Vitality Effects</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Health Points (HP)</span>
                    <span className="font-medium">{userStats.maxHp}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Defense</span>
                    <span className="font-medium">{userStats.stats.vit * 2}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Stamina Recovery</span>
                    <span className="font-medium">+{(userStats.stats.vit * 0.5).toFixed(1)}%</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatAllocationRow({
  icon,
  name,
  displayName,
  value,
  description,
  onIncrease,
  onDecrease,
  canIncrease,
  canDecrease,
}: {
  icon: React.ReactNode
  name: keyof UserStats["stats"]
  displayName: string
  value: number
  description: string
  onIncrease: () => void
  onDecrease: () => void
  canIncrease: boolean
  canDecrease: boolean
}) {
  return (
    <div className="flex items-center">
      <div className="flex items-center w-1/2">
        <div className="flex items-center justify-center mr-3">{icon}</div>
        <div>
          <div className="flex items-center">
            <div className="text-sm font-medium">{displayName}</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                    <HelpCircle className="h-3 w-3" />
                    <span className="sr-only">Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-[#0a0e14] border-[#1e2a3a]">
                  <p className="text-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="w-full mt-1">
            <div
              className="h-1 rounded-full bg-gradient-to-r from-[#4cc9ff] to-[#4cc9ff]/60"
              style={{ width: `${Math.min(100, value * 2)}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end w-1/2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full border-[#1e2a3a] hover:bg-[#1e2a3a] mr-3"
          onClick={onDecrease}
          disabled={!canDecrease}
        >
          <Minus className="h-3 w-3" />
          <span className="sr-only">Decrease</span>
        </Button>
        <div className="text-lg font-bold w-10 text-center">{value}</div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-full border-[#1e2a3a] hover:bg-[#1e2a3a] ml-3"
          onClick={onIncrease}
          disabled={!canIncrease}
        >
          <Plus className="h-3 w-3" />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
    </div>
  )
}
