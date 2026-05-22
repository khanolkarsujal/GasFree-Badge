import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Zap } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useWallet } from "@/hooks/useWallet";
import { useCollection } from "@/hooks/useCollection";
import { useUGFTransaction } from "@/hooks/useUGFTransaction";

export const Route = createFileRoute("/loading")({
  component: LoadingPage,
});

function LoadingPage() {
  const navigate = useNavigate({ from: "/loading" });
  const wallet = useWallet();
  const collection = useCollection(wallet.account);
  const { state } = useUGFTransaction();

  useEffect(() => {
    // If the state moved past the quoting/auth phases, move to progress page
    if (state === "executing" || state === "success" || state === "error") {
      navigate({ to: '/progress' });
    }
    // If the user lands here directly without starting a transaction
    if (state === "idle") {
      navigate({ to: '/' });
    }
  }, [state, navigate]);

  return (
    <Layout wallet={wallet} collection={collection}>
      <div className="flex items-center justify-center min-h-[70vh] p-4 bg-background animate-in fade-in duration-300">
        <div className="relative bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-[0_0_60px_rgba(139,92,246,0.15)] text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--pink)] flex items-center justify-center mb-6 mx-auto animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="font-display font-bold text-2xl text-white mb-2">
            {state === "auth" ? "Authenticating Wallet" : "Preparing Transaction"}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            {state === "auth" 
              ? "Please sign the secure message to authorize..." 
              : "Connecting to the Universal Gas Framework..."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
