"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Sword,
  Shield,
  Zap,
  Heart,
  Brain,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/user-context";
import { enemies, type Enemy } from "@/data/enemies";
import { CombatActions } from "@/components/combat-actions";
import { EnemySelection } from "@/components/enemy-selection";
import { CombatVisualization } from "@/components/combat-visualization";

export default function CombatPage() {
  const { userStats, setUserStats, addExp, addItem, addGold, removeItem } =
    useUser();
  const { toast } = useToast();

  // Combat states
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
  const [inCombat, setInCombat] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerHp, setPlayerHp] = useState(userStats.hp);
  const [playerMp, setPlayerMp] = useState(userStats.mp);
  const [enemyHp, setEnemyHp] = useState(0);
  const [enemyMaxHp, setEnemyMaxHp] = useState(0);
  const [showRewards, setShowRewards] = useState(false);
  const [rewards, setRewards] = useState<{
    exp: number;
    gold: number;
    items: any[];
  }>({ exp: 0, gold: 0, items: [] });
  const [isDefending, setIsDefending] = useState(false);
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>(
    {}
  );
  const [combatLog, setCombatLog] = useState<string[]>([]);

  // Animation states
  const [isAttacking, setIsAttacking] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentDamage, setCurrentDamage] = useState(0);
  const [isCriticalHit, setIsCriticalHit] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<string | undefined>(
    undefined
  );

  // Reset combat state when component unmounts
  useEffect(() => {
    return () => {
      if (inCombat) {
        // Save player HP/MP state when leaving combat
        setUserStats((prev) => ({
          ...prev,
          hp: playerHp,
          mp: playerMp,
        }));
      }
    };
  }, [inCombat, playerHp, playerMp, setUserStats]);

  // Start combat with selected enemy
  const startCombat = (enemy: Enemy) => {
    setSelectedEnemy(enemy);
    setEnemyHp(calculateEnemyHp(enemy));
    setEnemyMaxHp(calculateEnemyHp(enemy));
    setPlayerHp(userStats.hp);
    setPlayerMp(userStats.mp);
    setPlayerTurn(true);
    setInCombat(true);
    setIsDefending(false);
    setSkillCooldowns({});
    setCombatLog([]);
  };

  // Calculate enemy HP based on level and vitality
  const calculateEnemyHp = (enemy: Enemy) => {
    return Math.floor(100 + enemy.level * 10 + enemy.stats.vit * 5);
  };

  // Calculate damage based on attacker's strength and defender's vitality
  const calculateDamage = (
    attackerStr: number,
    defenderVit: number,
    isCritical = false
  ) => {
    const baseDamage = Math.max(
      1,
      Math.floor(attackerStr * 1.5 - defenderVit * 0.5)
    );
    const randomFactor = 0.8 + Math.random() * 0.4; // 80% to 120% damage variation
    const criticalMultiplier = isCritical ? 1.5 : 1;
    return Math.floor(baseDamage * randomFactor * criticalMultiplier);
  };

  // Check for critical hit based on agility
  const checkCritical = (agility: number) => {
    const critChance = agility * 0.5; // 0.5% per agility point
    return Math.random() * 100 < critChance;
  };

  // Player attacks enemy
  const playerAttack = () => {
    if (!selectedEnemy || !inCombat || !playerTurn || isAnimating) return;

    const isCritical = checkCritical(userStats.stats.agi);
    const damage = calculateDamage(
      userStats.stats.str,
      selectedEnemy.stats.vit,
      isCritical
    );

    // Set current damage for visualization
    setCurrentDamage(damage);
    setIsCriticalHit(isCritical);
    setCurrentSkill(undefined);

    setIsAnimating(true);
    setIsAttacking(true);
    addToCombatLog(`You attacked ${selectedEnemy.name} for ${damage} damage!`);
  };

  // Handle animation completion
  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setIsAttacking(false);

    if (!selectedEnemy || !inCombat) return;

    if (playerTurn) {
      // Player attack logic after animation
      const newEnemyHp = Math.max(0, enemyHp - currentDamage);
      setEnemyHp(newEnemyHp);

      if (newEnemyHp <= 0) {
        endCombat(true);
        return; // Important: Stop execution here to prevent enemy turn
      } else {
        setPlayerTurn(false);
        // Enemy's turn after a shorter delay
        setTimeout(() => enemyTurn(), 300); // Reduced from 1000ms to 300ms
      }
    } else {
      // Enemy attack logic after animation
      if (isDefending) {
        setIsDefending(false);
      }

      // Check if player is defeated
      if (playerHp <= 0) {
        endCombat(false);
        return; // Important: Stop execution here
      }

      setPlayerTurn(true);
    }
  };

  // Player defends to reduce incoming damage
  const playerDefend = () => {
    if (!inCombat || !playerTurn || isAnimating) return;

    setIsAnimating(true);
    setIsDefending(true);
    addToCombatLog("You defended!");

    setTimeout(() => {
      setIsAnimating(false);
      setPlayerTurn(false);
      // Enemy's turn after a shorter delay
      setTimeout(() => enemyTurn(), 300); // Reduced from 500ms to 300ms
    }, 600); // Reduced from 1000ms to 600ms
  };

  // Player uses a skill
  const playerUseSkill = (
    skillName: string,
    mpCost: number,
    cooldown: number
  ) => {
    if (!selectedEnemy || !inCombat || !playerTurn || isAnimating) return;

    if (playerMp < mpCost) {
      toast({
        title: "Not enough MP",
        description: `You need ${mpCost} MP to use this skill.`,
        variant: "destructive",
      });
      return;
    }

    if (skillCooldowns[skillName] && skillCooldowns[skillName] > 0) {
      toast({
        title: "Skill on cooldown",
        description: `This skill will be available in ${skillCooldowns[skillName]} turns.`,
        variant: "destructive",
      });
      return;
    }

    // Reduce MP
    setPlayerMp((prev) => prev - mpCost);

    // Set cooldown
    setSkillCooldowns((prev) => ({
      ...prev,
      [skillName]: cooldown,
    }));

    let damage = 0;

    // Different skills have different effects
    switch (skillName) {
      case "Power Strike":
        damage = calculateDamage(
          userStats.stats.str * 2,
          selectedEnemy.stats.vit
        );
        break;
      case "Double Slash":
        const hit1 = calculateDamage(
          userStats.stats.str * 0.7,
          selectedEnemy.stats.vit
        );
        const hit2 = calculateDamage(
          userStats.stats.str * 0.7,
          selectedEnemy.stats.vit
        );
        damage = hit1 + hit2;
        break;
      case "Fireball":
        damage = calculateDamage(
          userStats.stats.int * 2,
          selectedEnemy.stats.vit
        );
        break;
      case "Heal":
        const healAmount = Math.floor(userStats.stats.int * 1.5);
        setPlayerHp((prev) => Math.min(userStats.maxHp, prev + healAmount));
        damage = 0;
        break;
      default:
        damage = 0;
    }

    // Set current damage and skill for visualization
    setCurrentDamage(damage);
    setIsCriticalHit(false);
    setCurrentSkill(skillName);

    setIsAnimating(true);
    setIsAttacking(true);
    addToCombatLog(`You used ${skillName} for ${damage} damage!`);
  };

  // Player uses an item
  const playerUseItem = (itemId: string) => {
    if (!inCombat || !playerTurn || isAnimating) return;

    const item = userStats.inventory.find((i) => i.id === itemId);

    if (!item) {
      toast({
        title: "Item not found",
        description: "The selected item could not be found in your inventory.",
        variant: "destructive",
      });
      return;
    }

    let effectApplied = false;

    // Apply item effects based on item type and id
    if (item.type === "Consumable") {
      switch (item.id) {
        case "item-health-potion":
          const healAmount = 100;
          setPlayerHp((prev) => Math.min(userStats.maxHp, prev + healAmount));
          toast({
            title: "Health Restored",
            description: `You used a Health Potion and restored ${healAmount} HP.`,
          });
          effectApplied = true;
          break;
        case "item-mana-potion":
          const manaAmount = 50;
          setPlayerMp((prev) => Math.min(userStats.maxMp, prev + manaAmount));
          toast({
            title: "Mana Restored",
            description: `You used a Mana Potion and restored ${manaAmount} MP.`,
          });
          effectApplied = true;
          break;
        default:
          toast({
            title: "Item Effect Unknown",
            description: "This item's effect is not implemented yet.",
            variant: "destructive",
          });
      }
    } else {
      toast({
        title: "Cannot Use Item",
        description: "Only consumable items can be used in combat.",
        variant: "destructive",
      });
      return;
    }

    if (effectApplied) {
      // Remove the item from inventory
      removeItem(itemId, 1);

      // End player's turn
      setPlayerTurn(false);
      setTimeout(() => enemyTurn(), 300); // Reduced from 1000ms to 300ms
    }
  };

  // Enemy takes their turn
  const enemyTurn = () => {
    if (!selectedEnemy || !inCombat) return;

    // Reduce cooldowns
    setSkillCooldowns((prev) => {
      const newCooldowns = { ...prev };
      Object.keys(newCooldowns).forEach((skill) => {
        if (newCooldowns[skill] > 0) {
          newCooldowns[skill] -= 1;
        }
      });
      return newCooldowns;
    });

    // Enemy decides what to do (for now, just basic attack)
    const damage = calculateDamage(
      selectedEnemy.stats.str,
      userStats.stats.vit
    );

    // Apply defense reduction if player is defending
    const actualDamage = isDefending ? Math.floor(damage * 0.5) : damage;

    // Set current damage for visualization
    setCurrentDamage(actualDamage);
    setIsCriticalHit(false);
    setCurrentSkill(undefined);

    setIsAnimating(true);
    setIsAttacking(true);

    // Update player HP
    const newPlayerHp = Math.max(0, playerHp - actualDamage);
    setPlayerHp(newPlayerHp);
    addToCombatLog(
      `${selectedEnemy.name} attacked you for ${actualDamage} damage!`
    );

    // Check if player is defeated - this will be handled in handleAnimationComplete
  };

  // Add message to combat log
  const addToCombatLog = (message: string) => {
    setCombatLog((prev) => [...prev, message]);
  };

  // End combat and determine rewards or penalties
  const endCombat = (victory: boolean) => {
    if (!selectedEnemy) return;

    if (victory) {
      addToCombatLog(`You have defeated ${selectedEnemy.name}!`);

      // Set rewards
      const combatRewards = {
        exp: selectedEnemy.rewards.exp,
        gold: selectedEnemy.rewards.gold,
        items: selectedEnemy.rewards.items,
      };

      setRewards(combatRewards);
      setShowRewards(true);

      toast({
        title: "Victory!",
        description: `You have defeated ${selectedEnemy.name}!`,
      });
    } else {
      addToCombatLog(`You have been defeated by ${selectedEnemy.name}.`);

      // Apply defeat penalties (lose some gold, etc.)
      const goldLoss = Math.floor(userStats.gold * 0.1); // Lose 10% of gold

      setUserStats((prev) => ({
        ...prev,
        hp: Math.max(1, Math.floor(prev.maxHp * 0.1)), // Restore to 10% HP
        gold: Math.max(0, prev.gold - goldLoss),
      }));

      addToCombatLog(
        `You lost ${goldLoss} gold and barely escaped with your life.`
      );
    }

    setInCombat(false);
    setIsAnimating(false);
    setIsAttacking(false);
  };

  // Claim rewards after victory
  const claimRewards = () => {
    if (!selectedEnemy) return;

    // Add experience
    addExp(rewards.exp);

    // Add gold
    addGold(rewards.gold);

    // Add items to inventory
    rewards.items.forEach((item) => {
      addItem(item);
    });

    // Show toast notification
    toast({
      title: "Rewards Claimed",
      description: `You gained ${rewards.exp} EXP, ${rewards.gold} Gold, and ${rewards.items.length} items.`,
    });

    // Reset combat
    setShowRewards(false);
    setSelectedEnemy(null);
  };

  // Skip turn (for testing)
  const skipTurn = () => {
    if (!inCombat) return;

    if (playerTurn) {
      setPlayerTurn(false);
      setTimeout(() => enemyTurn(), 500);
    } else {
      setPlayerTurn(true);
    }
  };

  // Flee from combat
  const fleeCombat = () => {
    if (!inCombat || !selectedEnemy || isAnimating) return;

    // 50% chance to successfully flee based on agility difference
    const fleeChance = 50 + (userStats.stats.agi - selectedEnemy.stats.agi) * 2;

    if (Math.random() * 100 < fleeChance) {
      toast({
        title: "Escaped",
        description: "You successfully fled from combat!",
      });
      setInCombat(false);
      setSelectedEnemy(null);
    } else {
      toast({
        title: "Failed to Escape",
        description: "You failed to flee!",
      });
      setPlayerTurn(false);
      setTimeout(() => enemyTurn(), 300); // Reduced from 1000ms to 300ms
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#e0f2ff] pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[#1e2a3a]"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[#4cc9ff]">
              Combat Arena
            </h1>
          </div>
          <div className="flex items-center">
            <div className="bg-[#1e2a3a] px-3 py-1 rounded-lg flex items-center">
              <span className="text-[#8bacc1] mr-2">Gold:</span>
              <span className="text-yellow-400 font-bold">
                {userStats.gold}
              </span>
            </div>
          </div>
        </header>

        {/* Main Combat Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Combat Area */}
          <div className="lg:col-span-1">
            {!selectedEnemy && !inCombat ? (
              <EnemySelection enemies={enemies} onSelectEnemy={startCombat} />
            ) : (
              <>
                {/* Combat Visualization */}
                {inCombat && selectedEnemy && (
                  <CombatVisualization
                    playerName={userStats.name || "Hunter"}
                    enemyName={selectedEnemy.name}
                    isPlayerTurn={playerTurn}
                    isAttacking={isAttacking}
                    isDefending={isDefending}
                    attackDamage={currentDamage}
                    isCritical={isCriticalHit}
                    skillName={currentSkill}
                    playerHp={playerHp}
                    playerMaxHp={userStats.maxHp}
                    playerMp={playerMp}
                    playerMaxMp={userStats.maxMp}
                    playerLevel={userStats.level}
                    enemyHp={enemyHp}
                    enemyMaxHp={enemyMaxHp}
                    playerStats={userStats.stats}
                    onAnimationComplete={handleAnimationComplete}
                  />
                )}

                {!inCombat && selectedEnemy && (
                  <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative mb-4">
                    <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
                    <CardHeader className="pb-2 relative z-10">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-[#4cc9ff]">
                          {selectedEnemy.name}
                        </CardTitle>
                        <Badge className="bg-[#1e2a3a]">
                          Level {selectedEnemy.level}
                        </Badge>
                      </div>
                      <CardDescription>
                        {selectedEnemy.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
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
                    </CardContent>
                    {!inCombat && !showRewards && (
                      <CardFooter className="relative z-10">
                        <Button
                          className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
                          onClick={() => startCombat(selectedEnemy)}
                        >
                          Start Combat
                        </Button>
                      </CardFooter>
                    )}
                    {showRewards && (
                      <CardFooter className="relative z-10">
                        <Button
                          className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
                          onClick={claimRewards}
                        >
                          Claim Rewards
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                )}
              </>
            )}
          </div>

          {/* Right Column - Player Stats (hidden during combat) */}
          {!inCombat && (
            <div className="lg:col-span-1">
              <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative h-full">
                <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-[#4cc9ff]">Your Stats</CardTitle>
                  <CardDescription>
                    Level {userStats.level} Hunter
                  </CardDescription>
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
                      <Progress
                        value={(playerHp / userStats.maxHp) * 100}
                        className="h-2 bg-[#1e2a3a]"
                      >
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
                      <Progress
                        value={(playerMp / userStats.maxMp) * 100}
                        className="h-2 bg-[#1e2a3a]"
                      >
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
                </CardContent>
              </Card>
            </div>
          )}
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
          <DialogContent
            className="bg-[#0a0e14] border-[#1e2a3a] text-[#e0f2ff] w-[90%] sm:max-w-md animate-solo-modal"
            style={
              {
                "--solo-expand-duration": "0.5s",
                "--solo-expand-easing": "cubic-bezier(0.16, 1, 0.3, 1)",
              } as React.CSSProperties
            }
          >
            <DialogHeader>
              <DialogTitle className="text-[#4cc9ff]">
                Victory Rewards
              </DialogTitle>
              <DialogDescription className="text-[#8bacc1]">
                You have defeated {selectedEnemy?.name}!
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Experience:</span>
                  <span className="text-[#4cc9ff] font-bold">
                    {rewards.exp} EXP
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Gold:</span>
                  <span className="text-yellow-400 font-bold">
                    {rewards.gold} Gold
                  </span>
                </div>
                <Separator className="bg-[#1e2a3a]" />
                <div>
                  <h4 className="mb-2 font-medium">Items:</h4>
                  <div className="space-y-2">
                    {rewards.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-[#1e2a3a] rounded-md"
                      >
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
  );
}
