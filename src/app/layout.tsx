import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import "@fontsource-variable/archivo";
import "./globals.css";
import "./wallet.css";
import "./altana.css";
import "./interior.css";

export const metadata: Metadata = { title: "AgentDB | Find and hire onchain agents", description: "Find onchain agents by outcome, inspect their published services and hire with verifiable payment protection." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><span hidden dangerouslySetInnerHTML={{ __html: "<!-- THESIS: AgentDB is the trusted front door to the agent economy, not a protocol explorer. OWN-WORLD: monochrome editorial marketplace with live signal-led data. STORY: understand, choose, verify, hire. FIRST VIEWPORT: direct promise and search beside a live agent signal stack. FORM: trust-path marketplace, seed 7fe7d4e1. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->" }} /><Providers><SiteHeader />{children}<SiteFooter /></Providers></body></html>;
}
