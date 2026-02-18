"use client";

import { MonitorSmartphone } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import * as GroupNation from "@/components/group-nation";
import {
  AdToggle,
  HelpButton,
  LanguageToggle,
  LoginButton,
  ThemeToggle,
  TrialButton,
} from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrialEntrySection } from "../trial-entry";
import { BackgroundCanvas } from "./background-canvas";
import { ConceptSection } from "./concept-section";
import { DeclarationsSection } from "./declarations-section";
import { FinalGoalSection } from "./final-goal-section";
import { Footer } from "./footer";
import { HeroSection } from "./hero-section";
import { IdentitySection } from "./identity-section";
import { InspirationSection } from "./inspiration-section";
import { PurposeSection } from "./purpose-section";
import { SiteMissionSection } from "./site-mission-section";

export const TalesClaireLP = () => {
  return (
    <SidebarProvider>
      <div className="antialiased selection:bg-blue-500 selection:text-white min-h-screen relative text-foreground font-sans bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-[#0a0a0a] dark:bg-none w-full transition-colors duration-500 text-lg">
        {/* Header (No Sidebar Trigger) - User requested removal */}
        {/* <GlobalHeader showSidebarTrigger={false} /> */}

        {/* Top Left Dev Link (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute top-4 left-4 z-50">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Link href="/dev-dashboard">
                      <MonitorSmartphone className="h-6 w-6" />
                      <span className="sr-only">Dev Dashboard</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dev Dashboard (Development Only)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Top Right Utility Buttons and Actions */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <TrialButton />
            <LoginButton />
          </div>

          <Separator
            orientation="vertical"
            className="mx-2 h-4 hidden sm:block"
          />

          <TooltipProvider>
            <AdToggle />
            <LanguageToggle />
            <ThemeToggle />
            <HelpButton />
          </TooltipProvider>
        </div>

        {/* Background Animation */}
        <BackgroundCanvas />

        {/* Main Container */}
        <main className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-32 pb-20 flex flex-col gap-24">
          {/* 1. Name & Catchphrase */}
          <HeroSection />
          <SiteMissionSection />

          {/* 2. Description (Declarations & Concept) */}
          <section id="about" className="space-y-24">
            <IdentitySection />
            <div className="animate-fade-in-up delay-500">
              <GroupNation.GroupNationComparison />
            </div>
            <DeclarationsSection />
            <ConceptSection />
          </section>

          {/* 3. Start Links (Trial Entry) */}
          <TrialEntrySection />

          {/* 4. Purpose Section */}
          <PurposeSection />

          {/* 4. Reference Video & Explanation */}
          <Suspense fallback={null}>
            <InspirationSection />
          </Suspense>

          {/* 5. Final Goal Section */}
          <FinalGoalSection />

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
};
