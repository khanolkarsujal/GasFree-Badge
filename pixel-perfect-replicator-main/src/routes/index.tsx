import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { HowItWorks } from "@/components/site/HowItWorks";
import { TransactionFlow } from "@/components/site/TransactionFlow";
import { Dashboard } from "@/components/site/Dashboard";
import { Playground } from "@/components/site/Playground";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gaslessio — Onchain actions. Zero gas friction." },
      { name: "description", content: "Build on-chain experiences without ETH friction. Gaslessio sponsors fees via Universal Gas Framework on Base Sepolia." },
      { property: "og:title", content: "Gaslessio — Onchain actions. Zero gas friction." },
      { property: "og:description", content: "Sponsored gas. Mock USD pricing. Frictionless Web3 onboarding." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <TransactionFlow />
        <Dashboard />
        <Playground />
      </main>
      <Footer />
    </div>
  );
}
