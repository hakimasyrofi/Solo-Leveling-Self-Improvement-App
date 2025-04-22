"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface CombatVisualizationProps {
  playerName: string
  enemyName: string
  isPlayerTurn: boolean
  isAttacking: boolean
  isDefending: boolean
  onAnimationComplete: () => void
}

export function CombatVisualization({
  playerName,
  enemyName,
  isPlayerTurn,
  isAttacking,
  isDefending,
  onAnimationComplete,
}: CombatVisualizationProps) {
  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 200 })
  const [enemyPosition, setEnemyPosition] = useState({ x: 300, y: 200 })
  const [playerColor, setPlayerColor] = useState("#4cc9ff")
  const [enemyColor, setEnemyColor] = useState("#ff4c4c")
  const [effectPosition, setEffectPosition] = useState({ x: 0, y: 0 })
  const [showEffect, setShowEffect] = useState(false)
  const [effectType, setEffectType] = useState<"attack" | "defend" | "damage">("attack")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const originalPositions = useRef({ player: { x: 100, y: 200 }, enemy: { x: 300, y: 200 } })

  // Animation logic
  useEffect(() => {
    if (isAttacking) {
      // Determine who is attacking and who is receiving
      const isPlayerAttacking = isPlayerTurn

      if (isPlayerAttacking) {
        // Player attacking enemy
        setEffectType("attack")

        // Animate player moving toward enemy
        const startTime = Date.now()
        const duration = 500 // ms
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Move player toward enemy
          if (progress < 0.5) {
            // Moving toward
            setPlayerPosition({
              x:
                originalPositions.current.player.x +
                (originalPositions.current.enemy.x - originalPositions.current.player.x) * progress * 0.6,
              y: originalPositions.current.player.y,
            })
          } else {
            // Moving back
            const returnProgress = (progress - 0.5) * 2
            setPlayerPosition({
              x:
                originalPositions.current.enemy.x * 0.6 +
                originalPositions.current.player.x * (1 - 0.6) -
                (originalPositions.current.enemy.x - originalPositions.current.player.x) * returnProgress * 0.6,
              y: originalPositions.current.player.y,
            })
          }

          // Show attack effect when player reaches enemy
          if (progress >= 0.4 && progress <= 0.6) {
            setEffectPosition({ x: originalPositions.current.enemy.x, y: originalPositions.current.enemy.y })
            setShowEffect(true)
            setEffectType("damage")
          } else {
            setShowEffect(false)
          }

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate)
          } else {
            // Reset positions
            setPlayerPosition(originalPositions.current.player)
            setShowEffect(false)
            onAnimationComplete()
          }
        }

        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Enemy attacking player
        setEffectType("attack")

        // Animate enemy moving toward player
        const startTime = Date.now()
        const duration = 500 // ms
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Move enemy toward player
          if (progress < 0.5) {
            // Moving toward
            setEnemyPosition({
              x:
                originalPositions.current.enemy.x -
                (originalPositions.current.enemy.x - originalPositions.current.player.x) * progress * 0.6,
              y: originalPositions.current.enemy.y,
            })
          } else {
            // Moving back
            const returnProgress = (progress - 0.5) * 2
            setEnemyPosition({
              x:
                originalPositions.current.player.x * 0.6 +
                originalPositions.current.enemy.x * (1 - 0.6) +
                (originalPositions.current.enemy.x - originalPositions.current.player.x) * returnProgress * 0.6,
              y: originalPositions.current.enemy.y,
            })
          }

          // Show attack effect when enemy reaches player
          if (progress >= 0.4 && progress <= 0.6) {
            setEffectPosition({ x: originalPositions.current.player.x, y: originalPositions.current.player.y })
            setShowEffect(true)
            setEffectType("damage")
          } else {
            setShowEffect(false)
          }

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate)
          } else {
            // Reset positions
            setEnemyPosition(originalPositions.current.enemy)
            setShowEffect(false)
            onAnimationComplete()
          }
        }

        animationRef.current = requestAnimationFrame(animate)
      }
    } else if (isDefending) {
      // Defending animation
      setEffectType("defend")
      setEffectPosition(isPlayerTurn ? playerPosition : enemyPosition)
      setShowEffect(true)

      // Show defend effect for a short time
      const timer = setTimeout(() => {
        setShowEffect(false)
        onAnimationComplete()
      }, 1000)

      return () => clearTimeout(timer)
    }

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isAttacking, isDefending, isPlayerTurn, onAnimationComplete])

  // Draw the combat scene
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#0a0e14"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw player
    ctx.fillStyle = playerColor
    ctx.beginPath()
    ctx.arc(playerPosition.x, playerPosition.y, 20, 0, Math.PI * 2)
    ctx.fill()

    // Draw player name
    ctx.fillStyle = "#e0f2ff"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(playerName, playerPosition.x, playerPosition.y - 30)

    // Draw enemy
    ctx.fillStyle = enemyColor
    ctx.beginPath()
    ctx.arc(enemyPosition.x, enemyPosition.y, 20, 0, Math.PI * 2)
    ctx.fill()

    // Draw enemy name
    ctx.fillStyle = "#e0f2ff"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(enemyName, enemyPosition.x, enemyPosition.y - 30)

    // Draw effect if needed
    if (showEffect) {
      if (effectType === "attack") {
        // Draw slash effect
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(effectPosition.x - 15, effectPosition.y - 15)
        ctx.lineTo(effectPosition.x + 15, effectPosition.y + 15)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(effectPosition.x + 15, effectPosition.y - 15)
        ctx.lineTo(effectPosition.x - 15, effectPosition.y + 15)
        ctx.stroke()
      } else if (effectType === "defend") {
        // Draw shield effect
        ctx.strokeStyle = "#4cc9ff"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(effectPosition.x, effectPosition.y, 25, 0, Math.PI * 2)
        ctx.stroke()
      } else if (effectType === "damage") {
        // Draw damage effect
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
        ctx.beginPath()
        ctx.arc(effectPosition.x, effectPosition.y, 25, 0, Math.PI * 2)
        ctx.fill()

        // Draw impact lines
        ctx.strokeStyle = "#ff4c4c"
        ctx.lineWidth = 2
        for (let i = 0; i < 8; i++) {
          const angle = ((Math.PI * 2) / 8) * i
          ctx.beginPath()
          ctx.moveTo(effectPosition.x, effectPosition.y)
          ctx.lineTo(effectPosition.x + Math.cos(angle) * 30, effectPosition.y + Math.sin(angle) * 30)
          ctx.stroke()
        }
      }
    }

    // Draw arena floor
    ctx.fillStyle = "#1e2a3a"
    ctx.fillRect(50, 230, 300, 20)
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
  ])

  return (
    <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
      <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
      <CardContent className="p-4 relative z-10 flex justify-center">
        <canvas ref={canvasRef} width={400} height={300} className="border border-[#1e2a3a] rounded-md" />
      </CardContent>
    </Card>
  )
}
