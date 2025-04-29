import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/context/user-context";
import { MobileNav } from "@/components/mobile-nav";
import { LevelUpNotification } from "@/components/level-up-notification";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Solo Level Up - Self-Improvement App</title>
        <meta
          name="description"
          content="A self-improvement app inspired by Solo Leveling"
        />
      </head>
      <body className="bg-[#0a0e14]">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
            <MobileNav />
            <LevelUpNotification />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
