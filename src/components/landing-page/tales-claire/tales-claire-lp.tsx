import dynamic from "next/dynamic";

import { BackgroundCanvas } from "./components/background-canvas";
import { DeferredSection } from "./components/deferred-section";
import { ConceptContainer } from "@/components/landing-page/concept";
import { ConceptSection } from "./sections/concept-section";
import { DeclarationsSection } from "./sections/declarations-section";
import { FinalGoalSection } from "./sections/final-goal-section";
import { Footer } from "./sections/footer";
import { HeroSection } from "./sections/hero-section";
import { PurposeSection } from "./sections/purpose-section";
import { SiteMissionSection } from "./sections/site-mission-section";

import { TrialEntrySection } from "@/components/trial-entry";

const IdentitySection = dynamic(
    () => import("./sections/identity-section").then((module_) => module_.IdentitySection),
    {
        loading: () => <section className="h-64 animate-pulse rounded-2xl bg-slate-100/60 dark:bg-white/5" />,
    }
);

const InspirationSection = dynamic(
    () => import("./sections/inspiration-section").then((module_) => module_.InspirationSection),
    {
        loading: () => <section className="h-64 animate-pulse rounded-2xl bg-slate-100/60 dark:bg-white/5" />,
    }
);

export function LandingPage() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <BackgroundCanvas />
            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 pb-20 pt-24">
                <HeroSection />
                <ConceptContainer />
                <ConceptSection />
                <DeclarationsSection />
                <TrialEntrySection />
                <SiteMissionSection />
                <DeferredSection placeholderClassName="h-96 rounded-2xl bg-slate-100/60 dark:bg-white/5">
                    <IdentitySection />
                </DeferredSection>
                <PurposeSection />
                <DeferredSection placeholderClassName="h-80 rounded-2xl bg-slate-100/60 dark:bg-white/5">
                    <InspirationSection />
                </DeferredSection>
                <FinalGoalSection />
                <Footer />
            </div>
        </main>
    );
}

// Backward compatibility for existing imports.
export const TalesClaireLP = LandingPage;
