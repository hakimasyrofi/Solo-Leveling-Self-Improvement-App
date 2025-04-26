"use client";

import type React from "react";

import Link from "next/link";
import { ChevronLeft, Search, Trash2, MoreVertical, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/context/user-context";
import { useState } from "react";
import { AddQuestForm } from "@/components/add-quest-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function QuestsPage() {
  const {
    userStats,
    completeQuest,
    updateQuestProgress,
    deleteQuest,
    updateQuest,
  } = useUser();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter quests based on search term and status
  const activeQuests = userStats.quests.filter(
    (quest) =>
      !quest.completed &&
      (quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const completedQuests = userStats.quests.filter(
    (quest) =>
      quest.completed &&
      (quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteQuest = (questId: string) => {
    deleteQuest(questId);
  };

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
          <h1 className="text-2xl font-bold tracking-tight text-[#4cc9ff]">
            Quests
          </h1>
        </header>

        {/* Search and Filter */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 border border-[#4cc9ff]/30 rounded-lg shadow-[0_0_15px_rgba(76,201,255,0.15)]"></div>
          <div className="p-4 relative z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8bacc1]" />
              <Input
                placeholder="Search quests..."
                className="pl-9 bg-[#0a0e14] border-[#1e2a3a] focus-visible:ring-[#4cc9ff]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Quests Tabs */}
        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2 bg-[#1e2a3a] border border-[#1e2a3a]">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-[#0a0e14] data-[state=active]:border-t-2 data-[state=active]:border-[#4cc9ff]"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-[#0a0e14] data-[state=active]:border-t-2 data-[state=active]:border-[#4cc9ff]"
            >
              Completed
            </TabsTrigger>
          </TabsList>

          {/* Active Quests */}
          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {activeQuests.length > 0 ? (
                activeQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={() => completeQuest(quest.id)}
                    onProgress={(progress) =>
                      updateQuestProgress(quest.id, progress)
                    }
                    onDelete={() => handleDeleteQuest(quest.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-[#8bacc1]">
                  {searchTerm
                    ? "No active quests match your search."
                    : "No active quests available."}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <AddQuestForm />
            </div>
          </TabsContent>

          {/* Completed Quests */}
          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {completedQuests.length > 0 ? (
                completedQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onDelete={() => handleDeleteQuest(quest.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-[#8bacc1]">
                  {searchTerm
                    ? "No completed quests match your search."
                    : "No completed quests yet."}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function QuestCard({
  quest,
  onComplete,
  onProgress,
  onDelete,
}: {
  quest: {
    id: string;
    title: string;
    description: string;
    reward: string;
    progress: number;
    difficulty: "S" | "A" | "B" | "C" | "D" | "E";
    expiry: string;
    expReward: number;
    statPointsReward: number;
    completed?: boolean;
    isCustom?: boolean;
  };
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  onDelete?: () => void;
}) {
  const { updateQuest } = useUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: quest.title,
    description: quest.description,
    reward: quest.reward,
    difficulty: quest.difficulty,
    expiry: quest.expiry,
    expReward: quest.expReward,
    statPointsReward: quest.statPointsReward,
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuest(quest.id, editForm);
    setIsEditDialogOpen(false);
  };

  const difficultyColors = {
    S: "bg-red-500",
    A: "bg-orange-500",
    B: "bg-yellow-500",
    C: "bg-green-500",
    D: "bg-blue-500",
    E: "bg-purple-500",
  };

  const handleButtonClick = () => {
    if (quest.completed) return;

    if (quest.progress === 100 && onComplete) {
      onComplete();
    } else if (quest.progress < 100 && onProgress) {
      // Increment progress by 25% each time
      const newProgress = Math.min(100, quest.progress + 25);
      onProgress(newProgress);
    }
  };

  return (
    <Card
      className={`bg-[#0a0e14]/80 border-[#1e2a3a] relative ${
        quest.completed ? "opacity-70" : ""
      }`}
    >
      <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
      <CardHeader className="pb-2 relative z-10">
        {/* Action bar with difficulty and menu - positioned above the title */}
        <div className="flex justify-between items-center mb-2">
          <div
            className={`${
              difficultyColors[quest.difficulty]
            } w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold`}
          >
            {quest.difficulty}
          </div>

          {/* Dropdown menu for actions */}
          {onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#0a0e14] border-[#1e2a3a] text-[#e0f2ff]"
              >
                {quest.isCustom && !quest.completed && (
                  <DropdownMenuItem
                    className="focus:bg-[#1e2a3a]"
                    onSelect={(e) => {
                      e.preventDefault();
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Quest
                  </DropdownMenuItem>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-400 focus:text-red-400 focus:bg-red-900/20"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Quest
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    className="bg-[#0a0e14] border-[#1e2a3a] text-[#e0f2ff] w-[90%] sm:max-w-md animate-solo-modal"
                    style={
                      {
                        "--solo-expand-duration": "0.5s",
                        "--solo-expand-easing": "cubic-bezier(0.16, 1, 0.3, 1)",
                      } as React.CSSProperties
                    }
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-[#4cc9ff]">
                        Delete Quest
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-[#8bacc1]">
                        Are you sure you want to delete this quest? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-[#1e2a3a] text-[#e0f2ff] hover:bg-[#2a3a4a]">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-900 text-[#e0f2ff] hover:bg-red-800"
                        onClick={onDelete}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-[#0a0e14] border-[#1e2a3a] text-[#e0f2ff] sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-[#4cc9ff]">Edit Quest</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="bg-[#0a0e14] border-[#1e2a3a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="bg-[#0a0e14] border-[#1e2a3a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reward">Reward</Label>
                  <Input
                    id="reward"
                    value={editForm.reward}
                    onChange={(e) =>
                      setEditForm({ ...editForm, reward: e.target.value })
                    }
                    className="bg-[#0a0e14] border-[#1e2a3a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={editForm.difficulty}
                    onValueChange={(value) =>
                      setEditForm({
                        ...editForm,
                        difficulty: value as "S" | "A" | "B" | "C" | "D" | "E",
                      })
                    }
                  >
                    <SelectTrigger className="bg-[#0a0e14] border-[#1e2a3a]">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0e14] border-[#1e2a3a]">
                      {["S", "A", "B", "C", "D", "E"].map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    value={editForm.expiry}
                    onChange={(e) =>
                      setEditForm({ ...editForm, expiry: e.target.value })
                    }
                    className="bg-[#0a0e14] border-[#1e2a3a]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expReward">EXP Reward</Label>
                    <Input
                      id="expReward"
                      type="number"
                      value={editForm.expReward}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          expReward: parseInt(e.target.value),
                        })
                      }
                      className="bg-[#0a0e14] border-[#1e2a3a]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statPointsReward">Stat Points</Label>
                    <Input
                      id="statPointsReward"
                      type="number"
                      value={editForm.statPointsReward}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          statPointsReward: parseInt(e.target.value),
                        })
                      }
                      className="bg-[#0a0e14] border-[#1e2a3a]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-[#4cc9ff] text-[#0a0e14] hover:bg-[#4cc9ff]/90"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Title and custom tag */}
        <div className="flex items-center">
          <CardTitle className="text-base">{quest.title}</CardTitle>
          {quest.isCustom && (
            <span className="ml-2 text-xs bg-[#1e2a3a] text-[#8bacc1] px-2 py-0.5 rounded-full">
              Custom
            </span>
          )}
        </div>
        <CardDescription>{quest.description}</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{quest.progress}%</span>
          </div>
          <Progress value={quest.progress} className="h-2 bg-[#1e2a3a]">
            <div className="h-full bg-gradient-to-r from-[#4cc9ff] to-[#4cc9ff]/60 rounded-full" />
          </Progress>
          <div className="flex justify-between text-xs mt-2">
            <div>
              <span className="text-[#8bacc1]">Reward: </span>
              <span className="text-[#4cc9ff]">{quest.reward}</span>
            </div>
            <div className="text-[#8bacc1]">{quest.expiry}</div>
          </div>
          <div className="flex justify-between text-xs">
            <div>
              <span className="text-[#8bacc1]">EXP: </span>
              <span className="text-[#4cc9ff]">{quest.expReward}</span>
            </div>
            <div>
              <span className="text-[#8bacc1]">Stat Points: </span>
              <span className="text-[#4cc9ff]">{quest.statPointsReward}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="relative z-10">
        {!quest.completed && (
          <Button
            className="w-full bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
            onClick={handleButtonClick}
          >
            {quest.progress === 0
              ? "Start Quest"
              : quest.progress === 100
              ? "Claim Reward"
              : "Update Progress"}
          </Button>
        )}
        {quest.completed && (
          <Button className="w-full bg-[#1e2a3a] hover:bg-[#2a3a4a]" disabled>
            Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
