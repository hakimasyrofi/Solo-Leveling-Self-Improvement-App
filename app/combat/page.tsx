"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Sword, Shield, Zap, Heart, Brain, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/context/user-context"
import { enemies, type Enemy } from "@/data/enemies"
import { CombatLog } from "@/components/combat-log"
import { CombatActions } from "@/components/combat-actions"
import { EnemySelection } from "@/components/enemy-selection"

export default function CombatPage() {
  const { userStats, setUserStats, addExp, addItem, addGold } = useUser()
  const { toast } = useToast()

  // Combat states
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null)
  const [inCombat, setInCombat] = useState(false)
  const [playerTurn, setPlayerTurn] = useState(true)
  const [playerHp, setPlayerHp] = useState(userStats.hp)
  const [playerMp, setPlayerMp] = useState(userStats.mp)
  const [enemyHp, setEnemyHp] = useState(0)
  const [enemyMaxHp, setEnemyMaxHp] = useState(0)
  const [combatLog, setCombatLog] = useState<string[]>([])
  const [showRewards, setShowRewards] = useState(false)
  const [rewards, setRewards] = useState<{
    exp: number
    gold: number
    items: any[]
  }>({ exp: 0, gold: 0, items: [] })
  const [isDefending, setIsDefending] = useState(false)
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({})

  // Reset combat state when component unmounts
  useEffect(() => {
    return () => {
      if (inCombat) {
        // Save player HP/MP state when leaving combat
        setUserStats((prev) => ({
          ...prev,
          hp: playerHp,
          mp: playerMp,
        }))
      }
    }
  }, [inCombat, playerHp, playerMp, setUserStats])

  // Start combat with selected enemy
  const startCombat = (enemy: Enemy) => {
    setSelectedEnemy(enemy)
    setEnemyHp(calculateEnemyHp(enemy))
    setEnemyMaxHp(calculateEnemyHp(enemy))
    setPlayerHp(userStats.hp)
    setPlayerMp(userStats.mp)
    setPlayerTurn(true)
    setInCombat(true)
    setIsDefending(false)
    setSkillCooldowns({})
    setCombatLog([`Combat with ${enemy.name} has begun!`])
  }

  // Calculate enemy HP based on level and vitality
  const calculateEnemyHp = (enemy: Enemy) => {
    return Math.floor(100 + enemy.level * 10 + enemy.stats.vit * 5)
  }

  // Calculate damage based on attacker's strength and defender's vitality
  const calculateDamage = (attackerStr: number, defenderVit: number, isCritical = false) => {
    const baseDamage = Math.max(1, Math.floor(attackerStr * 1.5 - defenderVit * 0.5))
    const randomFactor = 0.8 + Math.random() * 0.4 // 80% to 120% damage variation
    const criticalMultiplier = isCritical ? 1.5 : 1
    return Math.floor(baseDamage * randomFactor * criticalMultiplier)
  }

  // Check for critical hit based on agility
  const checkCritical = (agility: number) => {
    const critChance = agility * 0.5 // 0.5% per agility point
    return Math.random() * 100 < critChance
  }

  // Player attacks enemy
  const playerAttack = () => {
    if (!selectedEnemy || !inCombat || !playerTurn) return

    const isCritical = checkCritical(userStats.stats.agi)
    const damage = calculateDamage(userStats.stats.str, selectedEnemy.stats.vit, isCritical)

    const newEnemyHp = Math.max(0, enemyHp - damage)
    setEnemyHp(newEnemyHp)

    const logMessage = isCritical
      ? `You land a critical hit on ${selectedEnemy.name} for ${damage} damage!`
      : `You attack ${selectedEnemy.name} for ${damage} damage.`

    addToCombatLog(logMessage)

    if (newEnemyHp <= 0) {
      endCombat(true)
    } else {
      setPlayerTurn(false)
      // Enemy's turn after a short delay
      setTimeout(() => enemyTurn(), 1000)
    }
  }

  // Player defends to reduce incoming damage
  const playerDefend = () => {
    if (!inCombat || !playerTurn) return

    setIsDefending(true)
    addToCombatLog("You take a defensive stance, reducing incoming damage by 50%.")

    setPlayerTurn(false)
    // Enemy's turn after a short delay
    setTimeout(() => enemyTurn(), 1000)
  }

  // Player uses a skill
  const playerUseSkill = (skillName: string, mpCost: number, cooldown: number) => {
    if (!selectedEnemy || !inCombat || !playerTurn) return

    if (playerMp < mpCost) {
      toast({
        title: "Not enough MP",
        description: `You need ${mpCost} MP to use this skill.`,
        variant: "destructive",
      })
      return
    }

    if (skillCooldowns[skillName] && skillCooldowns[skillName] > 0) {
      toast({
        title: "Skill on cooldown",
        description: `This skill will be available in ${skillCooldowns[skillName]} turns.`,
        variant: "destructive",
      })
      return
    }

    // Reduce MP
    setPlayerMp((prev) => prev - mpCost)

    // Set cooldown
    setSkillCooldowns((prev) => ({
      ...prev,
      [skillName]: cooldown,
    }))

    let damage = 0
    let logMessage = ""

    // Different skills have different effects
    switch (skillName) {
      case "Power Strike":
        damage = calculateDamage(userStats.stats.str * 2, selectedEnemy.stats.vit)
        logMessage = `You use Power Strike, dealing ${damage} damage to ${selectedEnemy.name}!`
        break
      case "Double Slash":
        const hit1 = calculateDamage(userStats.stats.str * 0.7, selectedEnemy.stats.vit)
        const hit2 = calculateDamage(userStats.stats.str * 0.7, selectedEnemy.stats.vit)
        damage = hit1 + hit2
        logMessage = `You use Double Slash, hitting ${selectedEnemy.name} twice for ${hit1} and ${hit2} damage!`
        break
      case "Fireball":
        damage = calculateDamage(userStats.stats.int * 2, selectedEnemy.stats.vit)
        logMessage = `You cast Fireball, dealing ${damage} magical damage to ${selectedEnemy.name}!`
        break
      case "Heal":
        const healAmount = Math.floor(userStats.stats.int * 1.5)
        setPlayerHp((prev) => Math.min(userStats.maxHp, prev + healAmount))
        logMessage = `You cast Heal, restoring ${healAmount} HP!`
        damage = 0
        break
      default:
        damage = 0
        logMessage = `You attempt to use ${skillName}, but nothing happens.`
    }

    addToCombatLog(logMessage)

    if (damage > 0) {
      const newEnemyHp = Math.max(0, enemyHp - damage)
      setEnemyHp(newEnemyHp)

      if (newEnemyHp <= 0) {
        endCombat(true)
        return
      }
    }

    setPlayerTurn(false)
    // Enemy's turn after a short delay
    setTimeout(() => enemyTurn(), 1000)
  }

  // Player uses an item
  const playerUseItem = (itemId: string) => {
    // This would be implemented to use items from inventory during combat
    // For now, we'll just add a placeholder
    addToCombatLog("Item use is not implemented yet.")
  }

  // Enemy takes their turn
  const enemyTurn = () => {
    if (!selectedEnemy || !inCombat) return

    // Reduce cooldowns
    setSkillCooldowns((prev) => {
      const newCooldowns = { ...prev }
      Object.keys(newCooldowns).forEach((skill) => {
        if (newCooldowns[skill] > 0) {
          newCooldowns[skill] -= 1
        }
      })
      return newCooldowns
    })

    // Enemy decides what to do (for now, just basic attack)
    const damage = calculateDamage(selectedEnemy.stats.str, userStats.stats.vit)

    // Apply defense reduction if player is defending
    const actualDamage = isDefending ? Math.floor(damage * 0.5) : damage

    const newPlayerHp = Math.max(0, playerHp - actualDamage)
    setPlayerHp(newPlayerHp)

    const logMessage = isDefending
      ? `${selectedEnemy.name} attacks you for ${actualDamage} damage (reduced by defense).`
      : `${selectedEnemy.name} attacks you for ${actualDamage} damage.`

    addToCombatLog(logMessage)

    // Reset defending status
    setIsDefending(false)

    if (newPlayerHp <= 0) {
      endCombat(false)
    } else {
      setPlayerTurn(true)
    }
  }

  // Add message to combat log
  const addToCombatLog = (message: string) => {
    setCombatLog((prev) => [...prev, message])
  }

  // End combat and determine rewards or penalties
  const endCombat = (victory: boolean) => {
    if (!selectedEnemy) return

    if (victory) {
      addToCombatLog(`You have defeated ${selectedEnemy.name}!`)

      // Set rewards
      const combatRewards = {
        exp: selectedEnemy.rewards.exp,
        gold: selectedEnemy.rewards.gold,
        items: selectedEnemy.rewards.items,
      }

      setRewards(combatRewards)
      setShowRewards(true)
    } else {
      addToCombatLog(`You have been defeated by ${selectedEnemy.name}.`)

      // Apply defeat penalties (lose some gold, etc.)
      const goldLoss = Math.floor(userStats.gold * 0.1) // Lose 10% of gold

      setUserStats((prev) => ({
        ...prev,
        hp: Math.max(1, Math.floor(prev.maxHp * 0.1)), // Restore to 10% HP
        gold: Math.max(0, prev.gold - goldLoss),
      }))

      addToCombatLog(`You lost ${goldLoss} gold and barely escaped with your life.`)
    }

    setInCombat(false)
  }

  // Claim rewards after victory
  const claimRewards = () => {
    if (!selectedEnemy) return

    // Add experience
    addExp(rewards.exp)

    // Add gold
    addGold(rewards.gold)

    // Add items to inventory
    rewards.items.forEach((item) => {
      addItem(item)
    })

    // Show toast notification
    toast({
      title: "Rewards Claimed",
      description: `You gained ${rewards.exp} EXP, ${rewards.gold} Gold, and ${rewards.items.length} items.`,
    })

    // Reset combat
    setShowRewards(false)
    setSelectedEnemy(null)
  }

  // Skip turn (for testing)
  const skipTurn = () => {
    if (!inCombat) return

    if (playerTurn) {
      setPlayerTurn(false)
      setTimeout(() => enemyTurn(), 500)
    } else {
      setPlayerTurn(true)
    }
  }

  // Flee from combat
  const fleeCombat = () => {
    if (!inCombat || !selectedEnemy) return

    // 50% chance to successfully flee based on agility difference
    const fleeChance = 50 + (userStats.stats.agi - selectedEnemy.stats.agi) * 2

    if (Math.random() * 100 < fleeChance) {
      addToCombatLog("You successfully fled from combat!")
      setInCombat(false)
      setSelectedEnemy(null)
    } else {
      addToCombatLog("You failed to flee!")
      setPlayerTurn(false)
      setTimeout(() => enemyTurn(), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#e0f2ff] pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <Button variant="ghost" size="icon" className="hover:bg-[#1e2a3a]">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[#4cc9ff]">Combat Arena</h1>
          </div>
          <div className="flex items-center">
            <div className="bg-[#1e2a3a] px-3 py-1 rounded-lg flex items-center">
              <span className="text-[#8bacc1] mr-2">Gold:</span>
              <span className="text-yellow-400 font-bold">{userStats.gold}</span>
            </div>
          </div>
        </header>

        {/* Main Combat Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Player Stats */}
          <div className="lg:col-span-1">
            <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative h-full">
              <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-[#4cc9ff]">Your Stats</CardTitle>
                <CardDescription>Level {userStats.level} Hunter</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                {/* HP/MP Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 text-red-400 mr-1" />
                        <span>HP</span>
                      </span>
                      <span>
                        {playerHp}/{userStats.maxHp}
                      </span>
                    </div>
                    <Progress value={(playerHp / userStats.maxHp) * 100} className="h-2 bg-[#1e2a3a]">
                      <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
                    </Progress>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="flex items-center">
                        <Zap className="h-3 w-3 text-blue-400 mr-1" />
                        <span>MP</span>
                      </span>
                      <span>
                        {playerMp}/{userStats.maxMp}
                      </span>
                    </div>
                    <Progress value={(playerMp / userStats.maxMp) * 100} className="h-2 bg-[#1e2a3a]">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                    </Progress>
                  </div>
                </div>

                <Separator className="my-4 bg-[#1e2a3a]" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex items-center">
                    <Sword className="h-4 w-4 text-[#4cc9ff] mr-2" />
                    <span className="text-[#8bacc1] mr-1">STR:</span>
                    <span>{userStats.stats.str}</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-[#4cc9ff] mr-2" />
                    <span className="text-[#8bacc1] mr-1">VIT:</span>
                    <span>{userStats.stats.vit}</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-[#4cc9ff] mr-2" />
                    <span className="text-[#8bacc1] mr-1">AGI:</span>
                    <span>{userStats.stats.agi}</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 text-[#4cc9ff] mr-2" />
                    <span className="text-[#8bacc1] mr-1">INT:</span>
                    <span>{userStats.stats.int}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-[#4cc9ff] mr-2" />
                    <span className="text-[#8bacc1] mr-1">PER:</span>
                    <span>{userStats.stats.per}</span>
                  </div>
                </div>

                {inCombat && (
                  <>
                    <Separator className="my-4 bg-[#1e2a3a]" />

                    {/* Combat Status */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#8bacc1]">Status:</span>
                        <Badge className={playerTurn ? "bg-green-700" : "bg-red-700"}>
                          {playerTurn ? "Your Turn" : "Enemy Turn"}
                        </Badge>
                      </div>
                      {isDefending && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#8bacc1]">Defending:</span>
                          <Badge className="bg-blue-700">50% Damage Reduction</Badge>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Combat Area */}
          <div className="lg:col-span-1">
            {!selectedEnemy && !inCombat ? (
              <EnemySelection enemies={enemies} onSelectEnemy={startCombat} />
            ) : (
              <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
                <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
                {selectedEnemy && (
                  <>
                    <CardHeader className="pb-2 relative z-10">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-[#4cc9ff]">{selectedEnemy.name}</CardTitle>
                        <Badge className="bg-[#1e2a3a]">Level {selectedEnemy.level}</Badge>
                      </div>
                      <CardDescription>{selectedEnemy.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      {/* Enemy HP Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="flex items-center">
                            <Heart className="h-3 w-3 text-red-400 mr-1" />
                            <span>HP</span>
                          </span>
                          <span>
                            {enemyHp}/{enemyMaxHp}
                          </span>
                        </div>
                        <Progress value={(enemyHp / enemyMaxHp) * 100} className="h-2 bg-[#1e2a3a]">
                          <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
                        </Progress>
                      </div>

                      {/* Enemy Stats */}
                      <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                        <div className="flex flex-col items-center p-2 bg-[#1e2a3a] rounded-md">
                          <Sword className="h-3 w-3 text-[#4cc9ff] mb-1" />
                          <span className="text-[#8bacc1]">STR</span>
                          <span>{selectedEnemy.stats.str}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-[#1e2a3a] rounded-md">
                          <Shield className="h-3 w-3 text-[#4cc9ff] mb-1" />
                          <span className="text-[#8bacc1]">VIT</span>
                          <span>{selectedEnemy.stats.vit}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-[#1e2a3a] rounded-md">
                          <Zap className="h-3 w-3 text-[#4cc9ff] mb-1" />
                          <span className="text-[#8bacc1]">AGI</span>
                          <span>{selectedEnemy.stats.agi}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-[#1e2a3a] rounded-md">
                          <Brain className="h-3 w-3 text-[#4cc9ff] mb-1" />
                          <span className="text-[#8bacc1]">INT</span>
                          <span>{selectedEnemy.stats.int}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-[#1e2a3a] rounded-md">
                          <Eye className="h-3 w-3 text-[#4cc9ff] mb-1" />
                          <span className="text-[#8bacc1]">PER</span>
                          <span>{selectedEnemy.stats.per}</span>
                        </div>
                      </div>

                      {/* Enemy Image Placeholder */}
                      <div className="w-full h-40 bg-[#1e2a3a] rounded-md flex items-center justify-center mb-4">
                        <span className="text-[#8bacc1]">{selectedEnemy.name} Image</span>
                      </div>
                    </CardContent>
                    <CardFooter className="relative z-10">
                      {!inCombat && !showRewards && (
                        <Button
                          className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
                          onClick={() => startCombat(selectedEnemy)}
                        >
                          Start Combat
                        </Button>
                      )}
                      {showRewards && (
                        <Button
                          className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
                          onClick={claimRewards}
                        >
                          Claim Rewards
                        </Button>
                      )}
                    </CardFooter>
                  </>
                )}
              </Card>
            )}
          </div>

          {/* Right Column - Combat Log */}
          <div className="lg:col-span-1">
            <CombatLog messages={combatLog} />
          </div>
        </div>

        {/* Combat Actions */}
        {inCombat && playerTurn && (
          <div className="mt-6">
            <CombatActions
              onAttack={playerAttack}
              onDefend={playerDefend}
              onUseSkill={playerUseSkill}
              onUseItem={playerUseItem}
              onFlee={fleeCombat}
              playerStats={userStats}
              playerMp={playerMp}
              skillCooldowns={skillCooldowns}
            />
          </div>
        )}

        {/* Rewards Dialog */}
        <Dialog open={showRewards} onOpenChange={setShowRewards}>
          <DialogContent className="bg-[#0a0e14] border-[#1e2a3a] text-[#e0f2ff]">
            <DialogHeader>
              <DialogTitle className="text-[#4cc9ff]">Victory Rewards</DialogTitle>
              <DialogDescription className="text-[#8bacc1]">You have defeated {selectedEnemy?.name}!</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Experience:</span>
                  <span className="text-[#4cc9ff] font-bold">{rewards.exp} EXP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Gold:</span>
                  <span className="text-yellow-400 font-bold">{rewards.gold} Gold</span>
                </div>
                <Separator className="bg-[#1e2a3a]" />
                <div>
                  <h4 className="mb-2 font-medium">Items:</h4>
                  <div className="space-y-2">
                    {rewards.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-[#1e2a3a] rounded-md">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              item.rarity === "Common"
                                ? "bg-gray-400"
                                : item.rarity === "Uncommon"
                                  ? "bg-green-400"
                                  : item.rarity === "Rare"
                                    ? "bg-[#4cc9ff]"
                                    : item.rarity === "Epic"
                                      ? "bg-purple-400"
                                      : "bg-yellow-400"
                            }`}
                          ></div>
                          <span>{item.name}</span>
                        </div>
                        <Badge
                          className={
                            item.type === "Material"
                              ? "bg-amber-900 text-amber-200"
                              : item.type === "Weapon"
                                ? "bg-red-900 text-red-200"
                                : item.type === "Armor"
                                  ? "bg-blue-900 text-blue-200"
                                  : item.type === "Accessory"
                                    ? "bg-purple-900 text-purple-200"
                                    : "bg-green-900 text-green-200"
                          }
                        >
                          {item.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
                onClick={claimRewards}
              >
                Claim Rewards
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
