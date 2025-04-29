"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Zap, Info, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  // Base canvas dimensions (will be scaled)
  const baseWidth = 400;
  const baseHeight = 300;

  // State for canvas size
  const [canvasSize, setCanvasSize] = useState({
    width: baseWidth,
    height: baseHeight,
  });

  // Container ref to measure available width
  const containerRef = useRef<HTMLDivElement>(null);

  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 200 });
  const [enemyPosition, setEnemyPosition] = useState({ x: 300, y: 200 });
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

  // Resize handler for responsive canvas
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Get container width
        const containerWidth = containerRef.current.clientWidth;

        // Calculate responsive canvas size
        let newWidth = containerWidth;

        // Cap maximum width for larger screens (to avoid too large visualizations)
        const maxWidth = 600;
        newWidth = Math.min(newWidth, maxWidth);

        // Maintain aspect ratio
        const aspectRatio = baseHeight / baseWidth;
        const newHeight = Math.floor(newWidth * aspectRatio);

        // Update canvas size
        setCanvasSize({ width: newWidth, height: newHeight });

        // Update player and enemy positions based on new dimensions
        const scaleX = newWidth / baseWidth;
        setPlayerPosition({
          x: Math.floor(100 * scaleX),
          y: Math.floor(200 * (newHeight / baseHeight)),
        });
        setEnemyPosition({
          x: Math.floor(300 * scaleX),
          y: Math.floor(200 * (newHeight / baseHeight)),
        });
      }
    };

    // Initial sizing
    handleResize();

    // Set up resize listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [baseWidth, baseHeight]);

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

    // Scale for responsive drawing
    const scaleX = canvasSize.width / baseWidth;
    const scaleY = canvasSize.height / baseHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = "#0a0e14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = playerColor;
    ctx.beginPath();
    ctx.arc(playerPosition.x, playerPosition.y, 15 * scaleY, 0, Math.PI * 2);
    ctx.fill();

    // Draw player name
    ctx.fillStyle = "#e0f2ff";
    ctx.font = `${14 * scaleY}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(playerName, playerPosition.x, playerPosition.y - 30 * scaleY);

    // Draw enemy
    ctx.fillStyle = enemyColor;
    ctx.beginPath();
    ctx.arc(enemyPosition.x, enemyPosition.y, 15 * scaleY, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemy name
    ctx.fillStyle = "#e0f2ff";
    ctx.font = `${14 * scaleY}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(enemyName, enemyPosition.x, enemyPosition.y - 30 * scaleY);

    // Draw effect if needed
    if (showEffect) {
      if (effectType === "attack") {
        // Draw slash effect
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3 * scaleY;
        ctx.beginPath();
        ctx.moveTo(
          effectPosition.x - 15 * scaleX,
          effectPosition.y - 15 * scaleY
        );
        ctx.lineTo(
          effectPosition.x + 15 * scaleX,
          effectPosition.y + 15 * scaleY
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(
          effectPosition.x + 15 * scaleX,
          effectPosition.y - 15 * scaleY
        );
        ctx.lineTo(
          effectPosition.x - 15 * scaleX,
          effectPosition.y + 15 * scaleY
        );
        ctx.stroke();
      } else if (effectType === "defend") {
        // Draw shield effect
        ctx.strokeStyle = "#4cc9ff";
        ctx.lineWidth = 3 * scaleY;
        ctx.beginPath();
        ctx.arc(
          effectPosition.x,
          effectPosition.y,
          25 * scaleY,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      } else if (effectType === "damage") {
        // Draw damage effect
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.arc(
          effectPosition.x,
          effectPosition.y,
          25 * scaleY,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Draw impact lines
        ctx.strokeStyle = "#ff4c4c";
        ctx.lineWidth = 2 * scaleY;
        for (let i = 0; i < 8; i++) {
          const angle = ((Math.PI * 2) / 8) * i;
          ctx.beginPath();
          ctx.moveTo(effectPosition.x, effectPosition.y);
          ctx.lineTo(
            effectPosition.x + Math.cos(angle) * 30 * scaleX,
            effectPosition.y + Math.sin(angle) * 30 * scaleY
          );
          ctx.stroke();
        }
      }
    }

    // Draw damage text
    if (showDamageText) {
      ctx.font = `bold ${16 * scaleY}px sans-serif`;
      ctx.textAlign = "center";

      // Draw text with outline for better visibility
      if (isCritical) {
        ctx.fillStyle = "#ff0000";
      } else {
        ctx.fillStyle = "#ffffff";
      }

      // Draw text shadow/outline
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3 * scaleY;
      ctx.strokeText(damageText, damageTextPosition.x, damageTextPosition.y);

      // Draw text
      ctx.fillText(damageText, damageTextPosition.x, damageTextPosition.y);
    }

    // Draw arena floor
    ctx.fillStyle = "#1e2a3a";
    ctx.fillRect(50 * scaleX, 230 * scaleY, 300 * scaleX, 20 * scaleY);
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
    canvasSize,
    baseWidth,
    baseHeight,
  ]);

  return (
    <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
      <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
      <CardContent className="p-4 relative z-10">
        {/* Stats Bar with vertical alignment */}
        <div className="flex flex-col gap-4 mb-4">
          {/* Player and Enemy stats row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Player side */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs">{playerName}</span>
                <span className="text-xs">Lv.{playerLevel}</span>
              </div>
              <div className="flex items-center mb-1">
                <Heart className="h-3 w-3 text-red-400 mr-1" />
                <Progress
                  value={(playerHp / playerMaxHp) * 100}
                  className="h-2 bg-[#1e2a3a] flex-1"
                >
                  <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
                </Progress>
                <span className="text-xs ml-2">
                  {playerHp}/{playerMaxHp}
                </span>
              </div>
              <div className="flex items-center">
                <Zap className="h-3 w-3 text-blue-400 mr-1" />
                <Progress
                  value={(playerMp / playerMaxMp) * 100}
                  className="h-2 bg-[#1e2a3a] flex-1"
                >
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                </Progress>
                <span className="text-xs ml-2">
                  {playerMp}/{playerMaxMp}
                </span>
              </div>
            </div>

            {/* Enemy side */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs">{enemyName}</span>
                <span className="text-xs">
                  Lv.{enemyName.includes("Lv") ? "" : ""}
                </span>
              </div>
              <div className="flex items-center mb-1">
                <Heart className="h-3 w-3 text-red-400 mr-1" />
                <Progress
                  value={(enemyHp / enemyMaxHp) * 100}
                  className="h-2 bg-[#1e2a3a] flex-1"
                >
                  <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
                </Progress>
                <span className="text-xs ml-2">
                  {enemyHp}/{enemyMaxHp}
                </span>
              </div>
            </div>
          </div>

          {/* Turn Status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
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

              {isDefending && (
                <Badge className="bg-blue-700 text-xs flex items-center">
                  <Shield className="h-3 w-3 mr-1" /> Defending
                </Badge>
              )}
            </div>

            <Badge
              className={`text-xs ${
                isPlayerTurn ? "bg-green-700" : "bg-red-700"
              }`}
            >
              {isPlayerTurn ? "Your Turn" : "Enemy Turn"}
            </Badge>
          </div>
        </div>
        {showCombatMessage && (
          <div className="absolute top-16 left-0 right-0 z-20 flex justify-center">
            <div className="bg-[#0a0e14]/90 border border-[#4cc9ff]/30 px-4 py-2 rounded-md text-sm animate-fadeIn">
              {combatMessage}
            </div>
          </div>
        )}
        <div ref={containerRef} className="flex justify-center w-full">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="border border-[#1e2a3a] rounded-md max-w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
