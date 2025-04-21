"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, Search, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useUser } from "@/context/user-context"
import type { InventoryItem } from "@/data/enemies"

export default function InventoryPage() {
  const { userStats, useItem, removeItem } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [itemDetailsOpen, setItemDetailsOpen] = useState(false)
  const [itemToUse, setItemToUse] = useState<InventoryItem | null>(null)
  const itemToUseRef = useRef<InventoryItem | null>(null)

  // Filter items based on search term and type
  const filterItems = (items: InventoryItem[], type?: string) => {
    return items.filter(
      (item) =>
        (type ? item.type === type : true) &&
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }

  // Group items by type
  const materials = filterItems(userStats.inventory, "Material")
  const consumables = filterItems(userStats.inventory, "Consumable")
  const equipment = filterItems(userStats.inventory, ["Weapon", "Armor", "Accessory", "Rune"] as unknown as string)
  const allItems = filterItems(userStats.inventory)

  // Handle item use
  const handleUseItem = useCallback(() => {
    if (itemToUseRef.current) {
      useItem(itemToUseRef.current.id)
      setItemDetailsOpen(false)
      itemToUseRef.current = null
    }
  }, [useItem])

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "text-gray-400"
      case "Uncommon":
        return "text-green-400"
      case "Rare":
        return "text-[#4cc9ff]"
      case "Epic":
        return "text-purple-400"
      case "Legendary":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Material":
        return "bg-amber-900 text-amber-200"
      case "Weapon":
        return "bg-red-900 text-red-200"
      case "Armor":
        return "bg-blue-900 text-blue-200"
      case "Accessory":
        return "bg-purple-900 text-purple-200"
      case "Consumable":
        return "bg-green-900 text-green-200"
      case "Rune":
        return "bg-indigo-900 text-indigo-200"
      case "Quest":
        return "bg-yellow-900 text-yellow-200"
      default:
        return "bg-gray-900 text-gray-200"
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
            <h1 className="text-2xl font-bold tracking-tight text-[#4cc9ff]">Inventory</h1>
          </div>
          <div className="flex items-center">
            <div className="bg-[#1e2a3a] px-3 py-1 rounded-lg flex items-center">
              <span className="text-[#8bacc1] mr-2">Gold:</span>
              <span className="text-yellow-400 font-bold">{userStats.gold}</span>
            </div>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 border border-[#4cc9ff]/30 rounded-lg shadow-[0_0_15px_rgba(76,201,255,0.15)]"></div>
          <div className="p-4 relative z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8bacc1]" />
              <Input
                placeholder="Search items..."
                className="pl-9 bg-[#0a0e14] border-[#1e2a3a] focus-visible:ring-[#4cc9ff]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Inventory Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4 bg-[#1e2a3a] border border-[#1e2a3a]">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#0a0e14] data-[state=active]:border-t-2 data-[state=active]:border-[#4cc9ff]"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="materials"
              className="data-[state=active]:bg-[#0a0e14] data-[state=active]:border-t-2 data-[state=active]:border-[#4cc9ff]"
            >
              Materials
            </TabsTrigger>
            <TabsTrigger
              value="consumables"
              className="data-[state=active]:bg-[#0a0e14] data-[state=active]:border-t-2 data-[state=active]:border-[#4cc9ff]"
            >
              Consumables
            </TabsTrigger>
            <TabsTrigger
              value="equipment"
              className="data-[state=active]:bg-[#0a0e14] data-[state=active]:border-t-2 data-[state=active]:border-[#4cc9ff]"
            >
              Equipment
            </TabsTrigger>
          </TabsList>

          {/* All Items */}
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allItems.length > 0 ? (
                allItems.map((item) => (
                  <InventoryItemCard
                    key={item.id}
                    item={item}
                    onSelect={() => {
                      setSelectedItem(item)
                      setItemDetailsOpen(true)
                    }}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-[#8bacc1]">
                  {searchTerm ? "No items match your search." : "Your inventory is empty."}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Materials */}
          <TabsContent value="materials" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {materials.length > 0 ? (
                materials.map((item) => (
                  <InventoryItemCard
                    key={item.id}
                    item={item}
                    onSelect={() => {
                      setSelectedItem(item)
                      setItemDetailsOpen(true)
                    }}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-[#8bacc1]">
                  {searchTerm ? "No materials match your search." : "You don't have any materials."}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Consumables */}
          <TabsContent value="consumables" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {consumables.length > 0 ? (
                consumables.map((item) => (
                  <InventoryItemCard
                    key={item.id}
                    item={item}
                    onSelect={() => {
                      setSelectedItem(item)
                      setItemDetailsOpen(true)
                    }}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-[#8bacc1]">
                  {searchTerm ? "No consumables match your search." : "You don't have any consumables."}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Equipment */}
          <TabsContent value="equipment" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {equipment.length > 0 ? (
                equipment.map((item) => (
                  <InventoryItemCard
                    key={item.id}
                    item={item}
                    onSelect={() => {
                      setSelectedItem(item)
                      setItemDetailsOpen(true)
                    }}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-[#8bacc1]">
                  {searchTerm ? "No equipment matches your search." : "You don't have any equipment."}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Item Details Dialog */}
        <Dialog open={itemDetailsOpen} onOpenChange={setItemDetailsOpen}>
          {selectedItem && (
            <DialogContent className="bg-[#0a0e14] border-[#1e2a3a] text-[#e0f2ff] max-w-md">
              <DialogHeader>
                <DialogTitle className={`${getRarityColor(selectedItem.rarity)}`}>{selectedItem.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Badge className={`${getTypeColor(selectedItem.type)}`}>{selectedItem.type}</Badge>
                  <span className={`${getRarityColor(selectedItem.rarity)}`}>{selectedItem.rarity}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-[#8bacc1] mb-4">{selectedItem.description}</p>

                {selectedItem.stats && Object.keys(selectedItem.stats).length > 0 && (
                  <>
                    <Separator className="my-2 bg-[#1e2a3a]" />
                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-2">Stats:</h4>
                      <ul className="space-y-1 text-sm">
                        {selectedItem.stats.str && (
                          <li className="flex justify-between">
                            <span>Strength</span>
                            <span className="text-[#4cc9ff]">+{selectedItem.stats.str}</span>
                          </li>
                        )}
                        {selectedItem.stats.agi && (
                          <li className="flex justify-between">
                            <span>Agility</span>
                            <span className="text-[#4cc9ff]">+{selectedItem.stats.agi}</span>
                          </li>
                        )}
                        {selectedItem.stats.per && (
                          <li className="flex justify-between">
                            <span>Perception</span>
                            <span className="text-[#4cc9ff]">+{selectedItem.stats.per}</span>
                          </li>
                        )}
                        {selectedItem.stats.int && (
                          <li className="flex justify-between">
                            <span>Intelligence</span>
                            <span className="text-[#4cc9ff]">+{selectedItem.stats.int}</span>
                          </li>
                        )}
                        {selectedItem.stats.vit && (
                          <li className="flex justify-between">
                            <span>Vitality</span>
                            <span className="text-[#4cc9ff]">+{selectedItem.stats.vit}</span>
                          </li>
                        )}
                        {selectedItem.stats.resistance && Object.keys(selectedItem.stats.resistance).length > 0 && (
                          <>
                            <li className="mt-1 font-medium">Resistances:</li>
                            {selectedItem.stats.resistance.fire && (
                              <li className="flex justify-between pl-2">
                                <span>Fire</span>
                                <span className="text-red-400">+{selectedItem.stats.resistance.fire}</span>
                              </li>
                            )}
                            {selectedItem.stats.resistance.ice && (
                              <li className="flex justify-between pl-2">
                                <span>Ice</span>
                                <span className="text-blue-400">+{selectedItem.stats.resistance.ice}</span>
                              </li>
                            )}
                            {selectedItem.stats.resistance.lightning && (
                              <li className="flex justify-between pl-2">
                                <span>Lightning</span>
                                <span className="text-yellow-400">+{selectedItem.stats.resistance.lightning}</span>
                              </li>
                            )}
                            {selectedItem.stats.resistance.poison && (
                              <li className="flex justify-between pl-2">
                                <span>Poison</span>
                                <span className="text-green-400">+{selectedItem.stats.resistance.poison}</span>
                              </li>
                            )}
                            {selectedItem.stats.resistance.dark && (
                              <li className="flex justify-between pl-2">
                                <span>Dark</span>
                                <span className="text-purple-400">+{selectedItem.stats.resistance.dark}</span>
                              </li>
                            )}
                          </>
                        )}
                      </ul>
                    </div>
                  </>
                )}

                {selectedItem.quantity && (
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-[#8bacc1]">Quantity:</span>
                    <span className="font-medium">{selectedItem.quantity}</span>
                  </div>
                )}
              </div>
              <DialogFooter className="flex gap-2">
                {selectedItem.type === "Consumable" && (
                  <Button
                    className="bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]"
                    onClick={() => {
                      itemToUseRef.current = selectedItem
                      handleUseItem()
                    }}
                  >
                    Use
                  </Button>
                )}
                {(selectedItem.type === "Weapon" ||
                  selectedItem.type === "Armor" ||
                  selectedItem.type === "Accessory") && (
                  <Button className="bg-transparent border border-[#4cc9ff] hover:bg-[#4cc9ff]/10 text-[#4cc9ff]">
                    Equip
                  </Button>
                )}
                <Button
                  variant="destructive"
                  className="bg-red-900 hover:bg-red-800 text-white"
                  onClick={() => {
                    removeItem(selectedItem.id, 1)
                    if ((selectedItem.quantity || 0) <= 1) {
                      setItemDetailsOpen(false)
                    }
                  }}
                >
                  Discard
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  )
}

function InventoryItemCard({
  item,
  onSelect,
}: {
  item: InventoryItem
  onSelect: () => void
}) {
  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "text-gray-400 border-gray-700"
      case "Uncommon":
        return "text-green-400 border-green-900"
      case "Rare":
        return "text-[#4cc9ff] border-[#4cc9ff]/30"
      case "Epic":
        return "text-purple-400 border-purple-900"
      case "Legendary":
        return "text-yellow-400 border-yellow-900"
      default:
        return "text-gray-400 border-gray-700"
    }
  }

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Material":
        return "bg-amber-900 text-amber-200"
      case "Weapon":
        return "bg-red-900 text-red-200"
      case "Armor":
        return "bg-blue-900 text-blue-200"
      case "Accessory":
        return "bg-purple-900 text-purple-200"
      case "Consumable":
        return "bg-green-900 text-green-200"
      case "Rune":
        return "bg-indigo-900 text-indigo-200"
      case "Quest":
        return "bg-yellow-900 text-yellow-200"
      default:
        return "bg-gray-900 text-gray-200"
    }
  }

  return (
    <Card
      className={`bg-[#0a0e14]/80 border-[#1e2a3a] relative cursor-pointer hover:border-[#4cc9ff]/30 transition-colors`}
      onClick={onSelect}
    >
      <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
      <div
        className={`h-1 w-full ${getRarityColor(item.rarity).replace("text-", "bg-").replace("border-", "bg-")}`}
      ></div>
      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-start">
          <CardTitle className={`text-base ${getRarityColor(item.rarity)}`}>{item.name}</CardTitle>
          {item.quantity && <span className="text-xs text-[#8bacc1]">x{item.quantity}</span>}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={`${getTypeColor(item.type)}`}>{item.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-xs text-[#8bacc1] line-clamp-2">{item.description}</p>

        {item.stats &&
          Object.keys(item.stats).some((key) => key !== "resistance" && item.stats[key as keyof typeof item.stats]) && (
            <div className="mt-2 text-xs">
              {item.stats.str && <div>+{item.stats.str} STR</div>}
              {item.stats.agi && <div>+{item.stats.agi} AGI</div>}
              {item.stats.per && <div>+{item.stats.per} PER</div>}
              {item.stats.int && <div>+{item.stats.int} INT</div>}
              {item.stats.vit && <div>+{item.stats.vit} VIT</div>}
            </div>
          )}
      </CardContent>
      <CardFooter className="relative z-10 pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs hover:bg-[#1e2a3a] text-[#4cc9ff]"
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <Info className="h-3 w-3 mr-1" /> Details
        </Button>
      </CardFooter>
    </Card>
  )
}
