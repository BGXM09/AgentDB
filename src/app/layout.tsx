import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import "@fontsource-variable/archivo";
import "./globals.css";
import "./wallet.css";
import "./altana.css";

export const metadata: Metadata = { title: "AgentDB", description: "Explore. Verify. Hire." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Providers><SiteHeader />{children}<SiteFooter /></Providers></body></html>;
}
