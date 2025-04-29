"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { APIKeyModal } from "@/components/api-key-modal";
import {
  hasAPIKey,
  generateQuestData,
  getAIProvider,
} from "@/utils/ai-service";
import { useToast } from "@/hooks/use-toast";
import { predefinedConsumables } from "@/data/items";

export function AddQuestForm() {
  const { addCustomQuest } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [hasAIKey, setHasAIKey] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "C" as "S" | "A" | "B" | "C" | "D" | "E",
    expiry: "One-time", // Changed default to One-time
    expReward: 30,
    statPointsReward: 1,
    goldReward: 0,
    strReward: 0,
    agiReward: 0,
    perReward: 0,
    intReward: 0,
    vitReward: 0,
    itemRewards: [] as {
      id?: string;
      name: string;
      type: string;
      description: string;
    }[],
  });

  // Check if AI API key exists on component mount
  useEffect(() => {
    setHasAIKey(hasAPIKey());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Reward") && name !== "expReward"
          ? Number.parseInt(value) || 0
          : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addItemReward = () => {
    setFormData((prev) => ({
      ...prev,
      itemRewards: [
        ...prev.itemRewards,
        {
          name: "",
          type: "Material",
          description: "",
        },
      ],
    }));
  };

  const removeItemReward = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itemRewards: prev.itemRewards.filter((_, i) => i !== index),
    }));
  };

  const updateItemReward = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      itemRewards: prev.itemRewards.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate reward string based on stat rewards
    const rewardParts = [];
    if (formData.goldReward > 0)
      rewardParts.push(`${formData.goldReward} Gold`);
    if (formData.strReward > 0)
      rewardParts.push(`+${formData.strReward} Strength`);
    if (formData.agiReward > 0)
      rewardParts.push(`+${formData.agiReward} Agility`);
    if (formData.perReward > 0)
      rewardParts.push(`+${formData.perReward} Perception`);
    if (formData.intReward > 0)
      rewardParts.push(`+${formData.intReward} Intelligence`);
    if (formData.vitReward > 0)
      rewardParts.push(`+${formData.vitReward} Vitality`);
    if (formData.itemRewards.length > 0) {
      formData.itemRewards.forEach((item) => {
        rewardParts.push(`${item.name} (${item.type})`);
      });
    }

    const rewardString =
      rewardParts.length > 0 ? rewardParts.join(", ") : "Experience only";

    // Create the quest object
    const newQuest = {
      title: formData.title,
      description: formData.description,
      reward: rewardString,
      difficulty: formData.difficulty,
      expiry: formData.expiry,
      expReward: Number.parseInt(formData.expReward.toString()),
      statPointsReward: formData.statPointsReward,
      goldReward: formData.goldReward,
      statRewards: {
        str: formData.strReward,
        agi: formData.agiReward,
        per: formData.perReward,
        int: formData.intReward,
        vit: formData.vitReward,
      },
      itemRewards: formData.itemRewards.map((item, index) => {
        // Check if it's a predefined consumable (has an id property)
        if (item.id && predefinedConsumables.some((p) => p.id === item.id)) {
          // Find the predefined consumable to get all its properties
          const predefined = predefinedConsumables.find(
            (p) => p.id === item.id
          );
          if (predefined) {
            return {
              id: predefined.id,
              name: predefined.name,
              type: predefined.type,
              rarity: predefined.rarity as
                | "Common"
                | "Uncommon"
                | "Rare"
                | "Epic"
                | "Legendary",
              description: predefined.description,
              quantity: 1,
            };
          }
        }

        // Default for custom items
        return {
          id: `custom-item-${Date.now()}-${index}`,
          name: item.name,
          type: item.type as any,
          rarity: "Common" as
            | "Common"
            | "Uncommon"
            | "Rare"
            | "Epic"
            | "Legendary",
          description: item.description,
          quantity: 1,
        };
      }),
    };

    // Add the quest
    addCustomQuest(newQuest);

    // Reset form and close dialog
    setFormData({
      title: "",
      description: "",
      difficulty: "C",
      expiry: "One-time", // Reset to One-time
      expReward: 30,
      statPointsReward: 1,
      goldReward: 0,
      strReward: 0,
      agiReward: 0,
      perReward: 0,
      intReward: 0,
      vitReward: 0,
      itemRewards: [],
    });
    setOpen(false);
  };

  const handleGenerateWithAI = async () => {
    // Check if description is empty
    if (!formData.description.trim()) {
      toast({
        title: "Description Required",
        description:
          "Please enter a quest description before using AI generation.",
        variant: "destructive",
      });
      return;
    }

    // Check if API key exists
    if (!hasAIKey) {
      setApiKeyModalOpen(true);
      return;
    }

    // Generate quest data with AI
    setIsGeneratingWithAI(true);
    try {
      const questData = await generateQuestData(formData.description);
      const provider = getAIProvider() || "AI";

      // Update form data with AI-generated data, but keep the current expiry
      setFormData((prev) => ({
        ...prev,
        title: questData.title || prev.title,
        description: questData.description || prev.description,
        difficulty: questData.difficulty || prev.difficulty,
        // Don't update expiry from AI
        expReward: questData.expReward || prev.expReward,
        statPointsReward: questData.statPointsReward || prev.statPointsReward,
        goldReward: questData.goldReward || prev.goldReward,
        strReward: questData.statRewards?.str || 0,
        agiReward: questData.statRewards?.agi || 0,
        perReward: questData.statRewards?.per || 0,
        intReward: questData.statRewards?.int || 0,
        vitReward: questData.statRewards?.vit || 0,
        itemRewards: questData.itemRewards || [],
      }));

      toast({
        title: `${provider} Generation Complete`,
        description:
          "Quest details have been generated. Feel free to make any adjustments.",
      });
    } catch (error) {
      toast({
        title: "AI Generation Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  const handleAPIKeySubmit = (provider: string) => {
    setHasAIKey(true);
    // Automatically trigger AI generation after API key is submitted
    setTimeout(() => {
      handleGenerateWithAI();
    }, 500);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]">
            <Plus className="mr-2 h-4 w-4" /> Create Custom Quest
          </Button>
        </DialogTrigger>
        <DialogContent
          className="bg-[#0a0e14] border-[#1e2a3a] text-[#e0f2ff] w-[90%] sm:max-w-md max-h-[90vh] overflow-y-auto animate-solo-modal"
          style={
            {
              "--solo-expand-duration": "0.5s",
              "--solo-expand-easing": "cubic-bezier(0.16, 1, 0.3, 1)",
            } as React.CSSProperties
          }
        >
          <DialogHeader>
            <DialogTitle className="text-[#4cc9ff]">
              Create New Quest
            </DialogTitle>
            <DialogDescription className="text-[#8bacc1]">
              Add a new quest to track your real-life progress
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Quest Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-[#0a0e14] border-[#1e2a3a]"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-[#0a0e14] border-[#1e2a3a] min-h-[80px]"
                  required
                />
              </div>

              {/* Moved AI button here, outside of the textarea */}
              <Button
                type="button"
                className="bg-[#1e2a3a] hover:bg-[#2a3a4a] text-[#4cc9ff] w-full"
                onClick={handleGenerateWithAI}
                disabled={isGeneratingWithAI || !formData.description.trim()}
              >
                {isGeneratingWithAI ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Enhance with AI
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      handleSelectChange("difficulty", value)
                    }
                  >
                    <SelectTrigger className="bg-[#0a0e14] border-[#1e2a3a]">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0e14] border-[#1e2a3a]">
                      <SelectItem value="S">S (Hardest)</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C (Medium)</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E (Easiest)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Frequency</Label>
                  <Select
                    value={formData.expiry}
                    onValueChange={(value) =>
                      handleSelectChange("expiry", value)
                    }
                  >
                    <SelectTrigger className="bg-[#0a0e14] border-[#1e2a3a]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0e14] border-[#1e2a3a]">
                      <SelectItem value="One-time">One-time</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expReward">EXP Reward</Label>
                  <Input
                    id="expReward"
                    name="expReward"
                    type="number"
                    min="1"
                    value={formData.expReward}
                    onChange={handleChange}
                    className="bg-[#0a0e14] border-[#1e2a3a]"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="statPointsReward">Stat Points</Label>
                  <Input
                    id="statPointsReward"
                    name="statPointsReward"
                    type="number"
                    min="0"
                    value={formData.statPointsReward}
                    onChange={handleChange}
                    className="bg-[#0a0e14] border-[#1e2a3a]"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goldReward">Gold Reward</Label>
                <Input
                  id="goldReward"
                  name="goldReward"
                  type="number"
                  min="0"
                  value={formData.goldReward}
                  onChange={handleChange}
                  className="bg-[#0a0e14] border-[#1e2a3a]"
                />
              </div>
              <div className="grid gap-2">
                <Label>Stat Rewards</Label>
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <Label htmlFor="strReward" className="text-xs">
                      STR
                    </Label>
                    <Input
                      id="strReward"
                      name="strReward"
                      type="number"
                      min="0"
                      value={formData.strReward}
                      onChange={handleChange}
                      className="bg-[#0a0e14] border-[#1e2a3a] h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agiReward" className="text-xs">
                      AGI
                    </Label>
                    <Input
                      id="agiReward"
                      name="agiReward"
                      type="number"
                      min="0"
                      value={formData.agiReward}
                      onChange={handleChange}
                      className="bg-[#0a0e14] border-[#1e2a3a] h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="perReward" className="text-xs">
                      PER
                    </Label>
                    <Input
                      id="perReward"
                      name="perReward"
                      type="number"
                      min="0"
                      value={formData.perReward}
                      onChange={handleChange}
                      className="bg-[#0a0e14] border-[#1e2a3a] h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="intReward" className="text-xs">
                      INT
                    </Label>
                    <Input
                      id="intReward"
                      name="intReward"
                      type="number"
                      min="0"
                      value={formData.intReward}
                      onChange={handleChange}
                      className="bg-[#0a0e14] border-[#1e2a3a] h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vitReward" className="text-xs">
                      VIT
                    </Label>
                    <Input
                      id="vitReward"
                      name="vitReward"
                      type="number"
                      min="0"
                      value={formData.vitReward}
                      onChange={handleChange}
                      className="bg-[#0a0e14] border-[#1e2a3a] h-8"
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Item Rewards</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 border-[#4cc9ff]/50 hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
                    onClick={addItemReward}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Item
                  </Button>
                </div>
                {formData.itemRewards.length > 0 ? (
                  <div className="space-y-3">
                    {formData.itemRewards.map((item, index) => (
                      <div
                        key={index}
                        className="grid gap-2 p-3 border border-[#1e2a3a] rounded-md relative"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => removeItemReward(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                        <div>
                          <Label
                            htmlFor={`item-name-${index}`}
                            className="text-xs"
                          >
                            Item Name
                          </Label>
                          <Input
                            id={`item-name-${index}`}
                            value={item.name}
                            onChange={(e) =>
                              updateItemReward(index, "name", e.target.value)
                            }
                            className="bg-[#0a0e14] border-[#1e2a3a] h-8"
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`item-type-${index}`}
                            className="text-xs"
                          >
                            Type
                          </Label>
                          <Select
                            value={item.type}
                            onValueChange={(value) =>
                              updateItemReward(index, "type", value)
                            }
                          >
                            <SelectTrigger className="bg-[#0a0e14] border-[#1e2a3a] h-8">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0a0e14] border-[#1e2a3a]">
                              <SelectItem value="Material">Material</SelectItem>
                              <SelectItem value="Consumable">
                                Consumable
                              </SelectItem>
                              <SelectItem value="Weapon">Weapon</SelectItem>
                              <SelectItem value="Armor">Armor</SelectItem>
                              <SelectItem value="Accessory">
                                Accessory
                              </SelectItem>
                              <SelectItem value="Rune">Rune</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Show preset consumables dropdown when Consumable type is selected */}
                        {item.type === "Consumable" && (
                          <div>
                            <Label
                              htmlFor={`item-preset-${index}`}
                              className="text-xs"
                            >
                              Preset Potions
                            </Label>
                            <Select
                              onValueChange={(presetId) => {
                                const preset = predefinedConsumables.find(
                                  (p) => p.id === presetId
                                );
                                if (preset) {
                                  updateItemReward(index, "name", preset.name);
                                  updateItemReward(
                                    index,
                                    "description",
                                    preset.description
                                  );
                                  // Store the ID for later use
                                  updateItemReward(index, "id", presetId);
                                }
                              }}
                            >
                              <SelectTrigger className="bg-[#0a0e14] border-[#1e2a3a] h-8">
                                <SelectValue placeholder="Select a preset potion" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#0a0e14] border-[#1e2a3a]">
                                {predefinedConsumables.map((potion) => (
                                  <SelectItem key={potion.id} value={potion.id}>
                                    {potion.name} ({potion.rarity})
                                  </SelectItem>
                                ))}
                                <SelectItem value="custom">
                                  Custom Consumable
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 text-[#8bacc1] text-sm border border-dashed border-[#1e2a3a] rounded-md">
                    No item rewards added
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
              >
                Create Quest
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* API Key Modal */}
      <APIKeyModal
        open={apiKeyModalOpen}
        onOpenChange={setApiKeyModalOpen}
        onKeySubmit={handleAPIKeySubmit}
      />
    </>
  );
}
