import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle, ExternalLink } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useWallet } from "@/hooks/useWallet";
import { useCollection } from "@/hooks/useCollection";
import { useUGFTransaction } from "@/hooks/useUGFTransaction";

export const Route = createFileRoute("/success")({
  component: SuccessPage,
});

function SuccessPage() {
  const navigate = useNavigate({ from: "/success" });
  const wallet = useWallet();
  const collection = useCollection(wallet.account);
  const { txHash, state, reset } = useUGFTransaction();

  useEffect(() => {
    if (state !== "success" || !txHash) {
      navigate({ to: '/' });
    }
  }, [txHash, state, navigate]);

  if (!txHash) return null;

  return (
    <Layout wallet={wallet} collection={collection}>
      <div className="flex items-center justify-center min-h-[70vh] p-4 bg-background animate-in fade-in duration-300">
        <div className="relative bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-[0_0_60px_rgba(16,185,129,0.3)] text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          
          <h3 className="font-display font-bold text-2xl text-white mb-2">
            Transaction Successful!
          </h3>
          
          <p className="text-sm text-muted-foreground mb-6">
            Your action has been confirmed on Base Sepolia via Universal Gas Framework.
          </p>
          
          <div className="w-full space-y-4">
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                Transaction Hash
              </div>
              <div className="font-mono text-xs text-[var(--violet)] break-all">
                {txHash}
              </div>
            </div>
            
            <a
              href={`https://sepolia.basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-full bg-white text-black px-4 py-3 text-sm font-bold hover:bg-white/90 transition"
            >
              <ExternalLink className="w-4 h-4" />
              View on BaseScan
            </a>
            
            <button
              onClick={() => {
                reset();
                navigate({ to: '/' });
              }}
              className="flex items-center justify-center w-full rounded-full border border-border bg-card/30 px-4 py-3 text-sm font-medium hover:bg-card transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
