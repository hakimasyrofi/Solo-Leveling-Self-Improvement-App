"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Zap, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CombatVisualizationProps {
  playerName: string;
  enemyName: string;
  isPlayerTurn: boolean;
  isAttacking: boolean;
  isDefending: boolean;
  attackDamage?: number;
  isCritical?: boolean;
  skillName?: string;
  playerHp: number;
  playerMaxHp: number;
  playerMp: number;
  playerMaxMp: number;
  playerLevel: number;
  enemyHp: number;
  enemyMaxHp: number;
  playerStats: {
    str: number;
    agi: number;
    per: number;
    int: number;
    vit: number;
  };
  onAnimationComplete: () => void;
}

export function CombatVisualization({
  playerName,
  enemyName,
  isPlayerTurn,
  isAttacking,
  isDefending,
  attackDamage = 0,
  isCritical = false,
  skillName,
  playerHp,
  playerMaxHp,
  playerMp,
  playerMaxMp,
  playerLevel,
  enemyHp,
  enemyMaxHp,
  playerStats,
  onAnimationComplete,
}: CombatVisualizationProps) {
  const [playerPosition] = useState({ x: 100, y: 200 });
  const [enemyPosition] = useState({ x: 300, y: 200 });
  const [playerColor, setPlayerColor] = useState("#4cc9ff");
  const [enemyColor, setEnemyColor] = useState("#ff4c4c");
  const [effectPosition, setEffectPosition] = useState({ x: 0, y: 0 });
  const [showEffect, setShowEffect] = useState(false);
  const [effectType, setEffectType] = useState<"attack" | "defend" | "damage">(
    "attack"
  );
  const [damageText, setDamageText] = useState("");
  const [showDamageText, setShowDamageText] = useState(false);
  const [damageTextPosition, setDamageTextPosition] = useState({ x: 0, y: 0 });
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [combatMessage, setCombatMessage] = useState("");
  const [showCombatMessage, setShowCombatMessage] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animation logic
  useEffect(() => {
    if (isAttacking) {
      // Determine who is attacking and who is receiving
      const isPlayerAttacking = isPlayerTurn;

      // Set combat message
      if (isPlayerAttacking) {
        if (skillName) {
          setCombatMessage(
            `You used ${skillName} for ${attackDamage} damage${
              isCritical ? " (Critical!)" : ""
            }!`
          );
        } else {
          setCombatMessage(
            `You attacked for ${attackDamage} damage${
              isCritical ? " (Critical!)" : ""
            }!`
          );
        }
      } else {
        setCombatMessage(
          `${enemyName} attacked you for ${attackDamage} damage!`
        );
      }
      setShowCombatMessage(true);

      // Clear any existing timeout
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }

      // Set timeout to hide message
      messageTimeoutRef.current = setTimeout(() => {
        setShowCombatMessage(false);
      }, 2000);

      if (isPlayerAttacking) {
        // Player attacking enemy - static effect at enemy position
        setEffectType("damage");
        setEffectPosition({ x: enemyPosition.x, y: enemyPosition.y });
        setShowEffect(true);

        // Set damage text
        if (skillName) {
          setDamageText(
            `${skillName}! ${attackDamage}${isCritical ? " CRIT!" : ""}`
          );
        } else {
          setDamageText(`${attackDamage}${isCritical ? " CRIT!" : ""}`);
        }

        // Show damage text
        setDamageTextPosition({
          x: enemyPosition.x,
          y: enemyPosition.y - 50,
        });
        setShowDamageText(true);

        // Show effect for a short time
        const timer = setTimeout(() => {
          setShowEffect(false);
          setShowDamageText(false);
          onAnimationComplete();
        }, 800);

        return () => clearTimeout(timer);
      } else {
        // Enemy attacking player - static effect at player position
        setEffectType("damage");
        setEffectPosition({ x: playerPosition.x, y: playerPosition.y });
        setShowEffect(true);

        // Set damage text
        setDamageText(`${attackDamage}`);

        // Show damage text
        setDamageTextPosition({
          x: playerPosition.x,
          y: playerPosition.y - 50,
        });
        setShowDamageText(true);

        // Show effect for a short time
        const timer = setTimeout(() => {
          setShowEffect(false);
          setShowDamageText(false);
          onAnimationComplete();
        }, 800);

        return () => clearTimeout(timer);
      }
    } else if (isDefending) {
      // Defending animation
      setEffectType("defend");
      setEffectPosition(isPlayerTurn ? playerPosition : enemyPosition);
      setShowEffect(true);

      // Set defend text
      setDamageText("Defending!");
      setDamageTextPosition({
        x: isPlayerTurn ? playerPosition.x : enemyPosition.x,
        y: (isPlayerTurn ? playerPosition.y : enemyPosition.y) - 50,
      });
      setShowDamageText(true);

      // Set combat message
      setCombatMessage("You are defending! Damage reduced by 50%");
      setShowCombatMessage(true);

      // Clear any existing timeout
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }

      // Set timeout to hide message
      messageTimeoutRef.current = setTimeout(() => {
        setShowCombatMessage(false);
      }, 2000);

      // Show defend effect for a short time
      const timer = setTimeout(() => {
        setShowEffect(false);
        setShowDamageText(false);
        onAnimationComplete();
      }, 500);

      return () => clearTimeout(timer);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, [
    isAttacking,
    isDefending,
    isPlayerTurn,
    onAnimationComplete,
    attackDamage,
    isCritical,
    skillName,
    enemyName,
    playerPosition,
    enemyPosition,
  ]);

  // Draw the combat scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = "#0a0e14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = playerColor;
    ctx.beginPath();
    ctx.arc(playerPosition.x, playerPosition.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw player name
    ctx.fillStyle = "#e0f2ff";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(playerName, playerPosition.x, playerPosition.y - 30);

    // Draw enemy
    ctx.fillStyle = enemyColor;
    ctx.beginPath();
    ctx.arc(enemyPosition.x, enemyPosition.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemy name
    ctx.fillStyle = "#e0f2ff";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(enemyName, enemyPosition.x, enemyPosition.y - 30);

    // Draw effect if needed
    if (showEffect) {
      if (effectType === "attack") {
        // Draw slash effect
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(effectPosition.x - 15, effectPosition.y - 15);
        ctx.lineTo(effectPosition.x + 15, effectPosition.y + 15);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(effectPosition.x + 15, effectPosition.y - 15);
        ctx.lineTo(effectPosition.x - 15, effectPosition.y + 15);
        ctx.stroke();
      } else if (effectType === "defend") {
        // Draw shield effect
        ctx.strokeStyle = "#4cc9ff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(effectPosition.x, effectPosition.y, 25, 0, Math.PI * 2);
        ctx.stroke();
      } else if (effectType === "damage") {
        // Draw damage effect
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.arc(effectPosition.x, effectPosition.y, 25, 0, Math.PI * 2);
        ctx.fill();

        // Draw impact lines
        ctx.strokeStyle = "#ff4c4c";
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const angle = ((Math.PI * 2) / 8) * i;
          ctx.beginPath();
          ctx.moveTo(effectPosition.x, effectPosition.y);
          ctx.lineTo(
            effectPosition.x + Math.cos(angle) * 30,
            effectPosition.y + Math.sin(angle) * 30
          );
          ctx.stroke();
        }
      }
    }

    // Draw damage text
    if (showDamageText) {
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";

      // Draw text with outline for better visibility
      if (isCritical) {
        ctx.fillStyle = "#ff0000";
      } else {
        ctx.fillStyle = "#ffffff";
      }

      // Draw text shadow/outline
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.strokeText(damageText, damageTextPosition.x, damageTextPosition.y);

      // Draw text
      ctx.fillText(damageText, damageTextPosition.x, damageTextPosition.y);
    }

    // Draw arena floor
    ctx.fillStyle = "#1e2a3a";
    ctx.fillRect(50, 230, 300, 20);
  }, [
    playerPosition,
    enemyPosition,
    playerColor,
    enemyColor,
    showEffect,
    effectPosition,
    effectType,
    playerName,
    enemyName,
    showDamageText,
    damageText,
    damageTextPosition,
    isCritical,
  ]);

  return (
    <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
      <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
      <CardContent className="p-4 relative z-10">
        {/* Stats Bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Heart className="h-3 w-3 text-red-400 mr-1" />
                <span className="text-xs">
                  {playerHp}/{playerMaxHp}
                </span>
              </div>
              <span className="text-xs">Lv.{playerLevel}</span>
            </div>
            <Progress
              value={(playerHp / playerMaxHp) * 100}
              className="h-2 bg-[#1e2a3a]"
            >
              <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
            </Progress>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center">
                <Zap className="h-3 w-3 text-blue-400 mr-1" />
                <span className="text-xs">
                  {playerMp}/{playerMaxMp}
                </span>
              </div>
              <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-3 w-3" />
                    <span className="sr-only">Stats</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0e14] border-[#1e2a3a] text-[#e0f2ff]">
                  <DialogHeader>
                    <DialogTitle className="text-[#4cc9ff]">
                      Player Stats
                    </DialogTitle>
                    <DialogDescription className="text-[#8bacc1]">
                      Detailed stats for {playerName}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex items-center">
                      <span className="text-[#8bacc1] mr-2">STR:</span>
                      <span>{playerStats.str}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[#8bacc1] mr-2">VIT:</span>
                      <span>{playerStats.vit}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[#8bacc1] mr-2">AGI:</span>
                      <span>{playerStats.agi}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[#8bacc1] mr-2">INT:</span>
                      <span>{playerStats.int}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[#8bacc1] mr-2">PER:</span>
                      <span>{playerStats.per}</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="w-8"></div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">
                Lv.{enemyName.includes("Lv") ? "" : ""}
              </span>
              <div className="flex items-center">
                <Heart className="h-3 w-3 text-red-400 mr-1" />
                <span className="text-xs">
                  {enemyHp}/{enemyMaxHp}
                </span>
              </div>
            </div>
            <Progress
              value={(enemyHp / enemyMaxHp) * 100}
              className="h-2 bg-[#1e2a3a]"
            >
              <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
            </Progress>
          </div>
        </div>
        {showCombatMessage && (
          <div className="absolute top-16 left-0 right-0 z-20 flex justify-center">
            <div className="bg-[#0a0e14]/90 border border-[#4cc9ff]/30 px-4 py-2 rounded-md text-sm animate-fadeIn">
              {combatMessage}
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="border border-[#1e2a3a] rounded-md"
          />
        </div>
      </CardContent>
    </Card>
  );
}
