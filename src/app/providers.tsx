"use client";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      {children}
      <Analytics />
    </ThemeProvider>
  );
}
