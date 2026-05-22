import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ethers } from "ethers";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/site/Hero";
import { Dashboard } from "@/components/site/Dashboard";
import { useWallet } from "@/hooks/useWallet";
import { useCollection } from "@/hooks/useCollection";
import { useUGFTransaction } from "@/hooks/useUGFTransaction";
import { toast } from "sonner";

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
  const navigate = useNavigate({ from: "/" });
  const wallet = useWallet();
  const collection = useCollection(wallet.account);
  const { startTransaction, state, progress, txHash } = useUGFTransaction();

  const handleMint = async (badgeType: number = 0) => {
    if (!wallet.account || !wallet.isRightChain) {
      toast.error("Please connect your wallet and switch to Base Sepolia before minting.", {
        style: { background: "rgba(0,0,0,0.8)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }
      });
      if (!wallet.account) {
        await wallet.connect();
      } else {
        await wallet.switchToBaseSepolia();
      }
      return;
    }

    try {
      const provider = (window as any).ethereum;
      const signer = await new ethers.BrowserProvider(provider).getSigner();
      
      // Start the actual UGF SDK transaction in the background
      startTransaction(signer, badgeType);
      
      // Immediately navigate to loading screen
      navigate({ to: '/loading' });
    } catch (err) {
      console.error("Failed to start transaction:", err);
    }
  };

  return (
    <Layout wallet={wallet} collection={collection}>
      <Hero
        wallet={wallet}
        collection={collection}
        onMint={handleMint}
        isMinting={state !== "idle" && state !== "success" && state !== "error"}
        mintSuccess={state === "success"}
        progress={progress}
        txHash={txHash || ""}
      />
      <Dashboard
        wallet={wallet}
        collection={collection}
        paymentCompleted={false}
        simStep={0}
        simActive={false}
        progress={0}
      />
    </Layout>
  );
}
