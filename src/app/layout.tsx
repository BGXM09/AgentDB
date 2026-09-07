import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import "@fontsource-variable/archivo";
import "./globals.css";
import "./wallet.css";
import "./altana.css";
import "./interior.css";
import "./refinements.css";

export const metadata: Metadata = { title: "AgentDB — Discover & connect to onchain agents", description: "Find AI agents on BNB Chain, inspect their onchain history, and connect directly to published services." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Providers><SiteHeader />{children}<SiteFooter /></Providers></body></html>;
}
