"use client"

import { useState } from "react"
import { Search, Shield, Zap, Eye, Brain, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Enemy } from "@/data/enemies"

interface EnemySelectionProps {
  enemies: Enemy[]
  onSelectEnemy: (enemy: Enemy) => void
}

export function EnemySelection({ enemies, onSelectEnemy }: EnemySelectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  // Filter enemies based on search term and difficulty
  const filteredEnemies = enemies.filter(
    (enemy) =>
      (enemy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (enemy.description && enemy.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedDifficulty === null || enemy.level.toString().includes(selectedDifficulty)),
  )

  // Group enemies by difficulty level
  const difficultyLevels = ["Beginner (1-20)", "Intermediate (21-40)", "Advanced (41-60)"]

  const getDifficultyFilter = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner (1-20)":
        return "1-20"
      case "Intermediate (21-40)":
        return "21-40"
      case "Advanced (41-60)":
        return "41-60"
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative">
        <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-[#4cc9ff]">Select an Enemy</CardTitle>
          <CardDescription>Choose an enemy to fight in the arena</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8bacc1]" />
            <Input
              placeholder="Search enemies..."
              className="pl-9 bg-[#0a0e14] border-[#1e2a3a] focus-visible:ring-[#4cc9ff]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {difficultyLevels.map((difficulty) => (
              <Badge
                key={difficulty}
                className={`cursor-pointer ${
                  selectedDifficulty === getDifficultyFilter(difficulty)
                    ? "bg-[#4cc9ff] text-[#0a0e14]"
                    : "bg-[#1e2a3a] hover:bg-[#2a3a4a]"
                }`}
                onClick={() => {
                  if (selectedDifficulty === getDifficultyFilter(difficulty)) {
                    setSelectedDifficulty(null)
                  } else {
                    setSelectedDifficulty(getDifficultyFilter(difficulty))
                  }
                }}
              >
                {difficulty}
              </Badge>
            ))}
            {selectedDifficulty && (
              <Badge className="bg-red-900 hover:bg-red-800 cursor-pointer" onClick={() => setSelectedDifficulty(null)}>
                Clear Filter
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEnemies.map((enemy) => (
          <Card
            key={enemy.id}
            className="bg-[#0a0e14]/80 border-[#1e2a3a] relative cursor-pointer hover:border-[#4cc9ff]/30 transition-colors"
            onClick={() => onSelectEnemy(enemy)}
          >
            <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{enemy.name}</CardTitle>
                <Badge className="bg-[#1e2a3a]">Level {enemy.level}</Badge>
              </div>
              <CardDescription className="line-clamp-2">{enemy.description}</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-5 gap-2 text-xs mb-4">
                <div className="flex flex-col items-center p-1 bg-[#1e2a3a] rounded-md">
                  <Shield className="h-3 w-3 text-[#4cc9ff] mb-1" />
                  <span className="text-[#8bacc1]">STR</span>
                  <span>{enemy.stats.str}</span>
                </div>
                <div className="flex flex-col items-center p-1 bg-[#1e2a3a] rounded-md">
                  <Heart className="h-3 w-3 text-[#4cc9ff] mb-1" />
                  <span className="text-[#8bacc1]">VIT</span>
                  <span>{enemy.stats.vit}</span>
                </div>
                <div className="flex flex-col items-center p-1 bg-[#1e2a3a] rounded-md">
                  <Zap className="h-3 w-3 text-[#4cc9ff] mb-1" />
                  <span className="text-[#8bacc1]">AGI</span>
                  <span>{enemy.stats.agi}</span>
                </div>
                <div className="flex flex-col items-center p-1 bg-[#1e2a3a] rounded-md">
                  <Brain className="h-3 w-3 text-[#4cc9ff] mb-1" />
                  <span className="text-[#8bacc1]">INT</span>
                  <span>{enemy.stats.int}</span>
                </div>
                <div className="flex flex-col items-center p-1 bg-[#1e2a3a] rounded-md">
                  <Eye className="h-3 w-3 text-[#4cc9ff] mb-1" />
                  <span className="text-[#8bacc1]">PER</span>
                  <span>{enemy.stats.per}</span>
                </div>
              </div>

              <div className="text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-[#8bacc1]">EXP Reward:</span>
                  <span className="text-[#4cc9ff]">{enemy.rewards.exp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8bacc1]">Gold Reward:</span>
                  <span className="text-yellow-400">{enemy.rewards.gold}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-10">
              <Button className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]">
                Fight
              </Button>
            </CardFooter>
          </Card>
        ))}
        {filteredEnemies.length === 0 && (
          <div className="col-span-2 text-center py-8 text-[#8bacc1] bg-[#0a0e14]/80 border border-[#1e2a3a] rounded-lg">
            No enemies match your search criteria.
          </div>
        )}
      </div>
    </div>
  )
}
