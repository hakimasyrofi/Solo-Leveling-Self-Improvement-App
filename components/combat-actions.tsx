"use client"

import { useState } from "react"
import { Sword, Shield, Zap, Flame, Heart, Backpack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { UserStats } from "@/utils/storage"

interface CombatActionsProps {
  onAttack: () => void
  onDefend: () => void
  onUseSkill: (skillName: string, mpCost: number, cooldown: number) => void
  onUseItem: (itemId: string) => void
  onFlee: () => void
  playerStats: UserStats
  playerMp: number
  skillCooldowns: Record<string, number>
}

export function CombatActions({
  onAttack,
  onDefend,
  onUseSkill,
  onUseItem,
  onFlee,
  playerStats,
  playerMp,
  skillCooldowns,
}: CombatActionsProps) {
  const [activeTab, setActiveTab] = useState("basic")

  // Define available skills based on player stats
  const availableSkills = [
    {
      name: "Power Strike",
      description: "A powerful strike that deals double damage.",
      icon: <Sword className="h-4 w-4" />,
      mpCost: 10,
      cooldown: 2,
      requiredStat: "str",
      requiredValue: 15,
      available: playerStats.stats.str >= 15,
    },
    {
      name: "Double Slash",
      description: "Strike twice in quick succession.",
      icon: <Sword className="h-4 w-4" />,
      mpCost: 15,
      cooldown: 3,
      requiredStat: "agi",
      requiredValue: 15,
      available: playerStats.stats.agi >= 15,
    },
    {
      name: "Fireball",
      description: "Cast a ball of fire that deals magical damage.",
      icon: <Flame className="h-4 w-4" />,
      mpCost: 20,
      cooldown: 3,
      requiredStat: "int",
      requiredValue: 15,
      available: playerStats.stats.int >= 15,
    },
    {
      name: "Heal",
      description: "Restore HP based on your intelligence.",
      icon: <Heart className="h-4 w-4" />,
      mpCost: 25,
      cooldown: 4,
      requiredStat: "int",
      requiredValue: 15,
      available: playerStats.stats.int >= 15,
    },
  ]

  // Filter consumable items from inventory
  const consumableItems = playerStats.inventory.filter((item) => item.type === "Consumable")

  return (
    <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
      <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
      <CardContent className="p-4 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-[#1e2a3a] border border-[#1e2a3a]">
            <TabsTrigger
              value="basic"
              className="data-[state=active]:bg-[#0a0e14] data-[state=active]:border-t-2 data-[state=active]:border-[#4cc9ff]"
            >
              Basic Actions
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-[#0a0e14] data-[state=active]:border-t-2 data-[state=active]:border-[#4cc9ff]"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="data-[state=active]:bg-[#0a0e14] data-[state=active]:border-t-2 data-[state=active]:border-[#4cc9ff]"
            >
              Items
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff] flex items-center justify-center"
                      onClick={onAttack}
                    >
                      <Sword className="h-4 w-4 mr-2" />
                      Attack
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Basic attack using your strength.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff] flex items-center justify-center"
                      onClick={onDefend}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Defend
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Take a defensive stance, reducing incoming damage by 50%.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-full bg-red-900/50 border border-red-700 hover:bg-red-800/50 text-red-200 flex items-center justify-center"
                      onClick={onFlee}
                    >
                      <SkipForward className="h-4 w-4 mr-2" />
                      Flee
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Attempt to flee from combat. Success chance based on agility.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSkills.map((skill) => (
                <TooltipProvider key={skill.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className={`w-full flex items-center justify-between ${
                          skill.available &&
                          playerMp >= skill.mpCost &&
                          (!skillCooldowns[skill.name] || skillCooldowns[skill.name] <= 0)
                            ? "bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
                            : "bg-[#1e2a3a] border border-[#1e2a3a] text-[#8bacc1] cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (
                            skill.available &&
                            playerMp >= skill.mpCost &&
                            (!skillCooldowns[skill.name] || skillCooldowns[skill.name] <= 0)
                          ) {
                            onUseSkill(skill.name, skill.mpCost, skill.cooldown)
                          }
                        }}
                        disabled={
                          !skill.available ||
                          playerMp < skill.mpCost ||
                          (skillCooldowns[skill.name] && skillCooldowns[skill.name] > 0)
                        }
                      >
                        <div className="flex items-center">
                          {skill.icon}
                          <span className="ml-2">{skill.name}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Zap className="h-3 w-3 mr-1 text-blue-400" />
                          {skill.mpCost} MP
                          {skillCooldowns[skill.name] && skillCooldowns[skill.name] > 0 && (
                            <span className="ml-2 bg-[#0a0e14] px-1 rounded">CD: {skillCooldowns[skill.name]}</span>
                          )}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p>{skill.description}</p>
                        {!skill.available && (
                          <p className="text-red-400">
                            Requires {skill.requiredStat.toUpperCase()} {skill.requiredValue}
                          </p>
                        )}
                        <p className="text-xs">
                          MP Cost: {skill.mpCost} | Cooldown: {skill.cooldown} turns
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {availableSkills.filter((skill) => skill.available).length === 0 && (
                <div className="col-span-2 text-center py-4 text-[#8bacc1]">
                  No skills available. Increase your stats to unlock skills.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="items" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consumableItems.length > 0 ? (
                consumableItems.map((item) => (
                  <TooltipProvider key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="w-full bg-transparent border border-green-600 hover:bg-green-900/20 text-green-400 flex items-center justify-between"
                          onClick={() => onUseItem(item.id)}
                        >
                          <div className="flex items-center">
                            <Backpack className="h-4 w-4 mr-2" />
                            <span>{item.name}</span>
                          </div>
                          <span className="text-xs">x{item.quantity}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))
              ) : (
                <div className="col-span-2 text-center py-4 text-[#8bacc1]">No consumable items in your inventory.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
