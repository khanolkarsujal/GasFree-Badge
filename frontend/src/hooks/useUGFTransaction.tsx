import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { executeGaslessClaim } from "@/services/ugfService";

export type TxState = "idle" | "auth" | "quote" | "settle" | "execute" | "success" | "error";

interface TransactionContextType {
  state: TxState;
  progress: number;
  txHash: string | null;
  error: string | null;
  startTransaction: (signer: any, badgeType: number) => Promise<void>;
  reset: () => void;
  retryTransaction: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TxState>("idle");
  const [progress, setProgress] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startTransaction = useCallback(async (signer: any, badgeType: number) => {
    setState("auth"); // Initial starting state before the SDK takes over
    setProgress(0);
    setError(null);
    setTxHash(null);

    try {
      const hash = await executeGaslessClaim(
        signer, 
        badgeType, 
        (p) => {
          setProgress(p);
        },
        (stage) => {
          setState(stage as TxState);
        }
      );
      
      setTxHash(hash);
      setProgress(100);
      setState("success");
    } catch (err: any) {
      setError(err.message || "Transaction failed");
      setState("error");
    }
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setProgress(0);
    setTxHash(null);
    setError(null);
    sessionStorage.removeItem("ugf_tx_state");
  }, []);

  const retryTransaction = useCallback(() => {
    reset();
  }, [reset]);

  // Handle refresh edge case
  React.useEffect(() => {
    const saved = sessionStorage.getItem("ugf_tx_state");
    if (saved && state !== "idle") {
      sessionStorage.setItem("ugf_tx_state", state);
    }
  }, [state]);

  React.useEffect(() => {
    // If we mount and have a saved state that's not idle/success/error, it means we refreshed during execution.
    // We can't recover the ethers Signer promise, so safely reset to prevent UI hanging.
    const saved = sessionStorage.getItem("ugf_tx_state");
    if (saved && ["auth", "quote", "settle", "execute"].includes(saved)) {
      reset();
    }
  }, [reset]);

  return (
    <TransactionContext.Provider value={{ state, progress, txHash, error, startTransaction, reset, retryTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useUGFTransaction() {
  const ctx = useContext(TransactionContext);
  if (!ctx) {
    throw new Error("useUGFTransaction must be used within TransactionProvider");
  }
  return ctx;
}
