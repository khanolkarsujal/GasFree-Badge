import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ethers } from "ethers";

// Component imports
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Dashboard } from "@/components/site/Dashboard";
import { Footer } from "@/components/site/Footer";
import { WhatYouGet } from "@/components/site/WhatYouGet";
import { HowUGFWorks } from "@/components/site/HowUGFWorks";
import { WhyThisMatters } from "@/components/site/WhyThisMatters";

// State hooks and services imports
import { useWallet } from "@/hooks/useWallet";
import { useCollection } from "@/hooks/useCollection";
import { executeGaslessClaim, executeGaslessClaimWithSteps } from "@/services/ugfService";

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
  const wallet = useWallet();
  const collection = useCollection(wallet.account);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const handleMint = async (badgeType: number = 0) => {
    if (!wallet.account) {
      await wallet.connect();
      return;
    }
    if (!wallet.isRightChain) {
      await wallet.switchToBaseSepolia();
      return;
    }

    setIsMinting(true);
    setMintSuccess(false);
    setActiveStep(0);
    setTxHash(undefined);
    setError(undefined);
    setClaimModalOpen(true);

    try {
      const provider = (window as any).ethereum;
      const signer = await new ethers.BrowserProvider(provider).getSigner();
      
      const hash = await executeGaslessClaimWithSteps(signer, badgeType, (step: number) => setActiveStep(step));
      setTxHash(hash);
      setMintSuccess(true);
      setActiveStep(0);
      collection.refresh(wallet.account);
    } catch (err: any) {
      console.error("Mint failed:", err);
      setError(err.message || "Transaction failed");
      setActiveStep(0);
    } finally {
      setIsMinting(false);
    }
  };

  const handleCloseClaimModal = () => {
    setClaimModalOpen(false);
    setActiveStep(0);
    setError(null);
    if (mintSuccess) {
      setMintSuccess(false);
      setTxHash(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-indigo-500/30 selection:text-indigo-100 overflow-x-hidden">
      <Navbar
        wallet={wallet}
        collection={collection}
        platform={null}
        platformAuth={null}
        setPlatformTick={() => {}}
      />
      <main>
        <Hero
          wallet={wallet}
          collection={collection}
          onMint={handleMint}
          isMinting={isMinting}
          mintSuccess={mintSuccess}
          activeStep={activeStep}
          txHash={txHash}
          error={error}
          claimModalOpen={claimModalOpen}
          onCloseClaimModal={handleCloseClaimModal}
        />
        <WhatYouGet />
        <HowUGFWorks />
        <WhyThisMatters />
        <Dashboard
          wallet={wallet}
          collection={collection}
          paymentCompleted={mintSuccess}
          simStep={mintSuccess ? 5 : 0}
          simActive={isMinting}
          progress={activeStep * 25}
        />
      </main>
      <Footer />
    </div>
  );
}
