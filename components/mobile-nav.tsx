"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Scroll, Backpack, Sword, Shield } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Quests",
      href: "/quests",
      icon: <Scroll className="h-5 w-5" />,
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: <Backpack className="h-5 w-5" />,
    },
    {
      name: "Combat",
      href: "/combat",
      icon: <Sword className="h-5 w-5" />,
    },
    {
      name: "Stats",
      href: "/stats",
      icon: <Shield className="h-5 w-5" />,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0e14] border-t border-[#1e2a3a] shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? "text-[#4cc9ff]" : "text-[#8bacc1] hover:text-[#e0f2ff]"
              }`}
            >
              <div className="flex flex-col items-center">
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
