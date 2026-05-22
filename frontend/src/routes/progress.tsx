import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useWallet } from "@/hooks/useWallet";
import { useCollection } from "@/hooks/useCollection";
import { useUGFTransaction } from "@/hooks/useUGFTransaction";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  const navigate = useNavigate({ from: "/progress" });
  const wallet = useWallet();
  const collection = useCollection(wallet.account);
  
  const { state, progress, error, reset } = useUGFTransaction();
  const [statusMsg, setStatusMsg] = useState("Executing transaction...");

  useEffect(() => {
    if (state === "idle") {
      navigate({ to: '/' });
    } else if (state === "success") {
      setTimeout(() => {
        navigate({ to: '/success' });
      }, 800);
    }
  }, [state, navigate]);

  useEffect(() => {
    if (state === "auth") setStatusMsg("Authenticating wallet...");
    else if (state === "quote") setStatusMsg("Getting transaction quote...");
    else if (state === "settle") setStatusMsg("Settling UGF payment...");
    else if (state === "execute") setStatusMsg("Sponsoring gas and executing...");
    else if (state === "success") setStatusMsg("Transaction complete!");
  }, [state]);

  const handleRetry = () => {
    reset();
    navigate({ to: '/' });
  };

  return (
    <Layout wallet={wallet} collection={collection}>
      <div className="flex items-center justify-center min-h-[70vh] p-4 bg-background animate-in fade-in duration-300">
        <div className="relative bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-[0_0_60px_rgba(139,92,246,0.3)] text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--pink)] flex items-center justify-center mb-6 mx-auto animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="font-display font-bold text-2xl text-white mb-2">
            Processing Transaction
          </h3>
          
          <p className="text-sm text-muted-foreground mb-6">
            Please wait while UGF processes your gasless transaction on Base Sepolia.
          </p>
          
          {error ? (
             <div className="flex flex-col gap-4">
               <div className="text-red-400 font-semibold text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                 {error}
               </div>
               <button onClick={handleRetry} className="bg-white text-black font-bold py-2 px-4 rounded-full hover:bg-white/90">
                 Retry Transaction
               </button>
             </div>
          ) : (
            <div className="w-full">
              <div className="flex justify-between text-sm font-semibold text-white mb-3">
                <span>Transaction Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden border border-border/50 relative">
                <div 
                  className="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-[var(--violet)] to-[var(--pink)] shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                  style={{ width: `${Math.max(progress, 5)}%` }}
                />
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center animate-pulse">
                {statusMsg}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
