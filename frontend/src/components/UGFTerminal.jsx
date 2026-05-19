import React from "react";
import { motion } from "framer-motion";
import { Terminal, CheckCircle2, AlertCircle, ExternalLink, Coins } from "lucide-react";

export function UGFTerminal({
  simActive,
  simStep,
  simLogs,
  simSuccess,
  simTxHash,
  simError,
  setSimError,
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-12 rounded-3xl border border-white/10 bg-[#05031F]/80 backdrop-blur-xl p-6 font-mono text-xs leading-relaxed max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
    >
      {/* Dynamic Glowing Cyber Grid and Scanline when active */}
      {simActive && (
        <>
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(109,24,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(109,24,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px] animate-[pulse_1.5s_infinite]" />
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D9B6FF]/50 to-transparent pointer-events-none animate-scan z-10" />
        </>
      )}
      
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,24,255,0.15),transparent_70%)]" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-[#D9B6FF] animate-pulse" />
          <span className="font-sans font-bold text-white">Gaslessio Execution Console</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${simActive ? "bg-[#D9B6FF] animate-pulse" : simSuccess ? "bg-[#6D18FF] animate-pulse" : simError ? "bg-red-500 animate-pulse" : "bg-white/20"}`} />
          <span className="font-sans text-[10px] text-white/50 uppercase font-bold tracking-wider">
            {simActive ? "Executing Transaction" : simSuccess ? "Session Success" : simError ? "Execution Failed" : "Ready"}
          </span>
        </div>
      </div>
      
      {/* Steps Indicator */}
      {(simActive || simSuccess) && (
        <div className="relative z-10 grid grid-cols-4 gap-2 mb-6 font-sans">
          {[
            { step: 1, label: "Auth (EIP-191)" },
            { step: 2, label: "Quote (Mock USD)" },
            { step: 3, label: "Settle (ERC-3009)" },
            { step: 4, label: "Execute (Sponsor)" }
          ].map((s) => (
            <div key={s.step} className="flex flex-col gap-1.5">
              <div className="h-1.5 rounded-full overflow-hidden bg-[#43256E]/30 relative">
                <motion.div 
                  className={`h-full relative overflow-hidden ${
                    simStep === s.step 
                      ? "bg-gradient-to-r from-[#6D18FF] to-[#D9B6FF]" 
                      : "bg-[#6D18FF]/50"
                  }`}
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: simStep > s.step 
                      ? "100%" 
                      : simStep === s.step 
                      ? "65%" 
                      : "0%" 
                  }}
                  transition={{ type: "spring", stiffness: 70, damping: 14 }}
                >
                  {simStep === s.step && (
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_1.8s_infinite]" style={{ width: "200%", left: "-50%" }} />
                  )}
                </motion.div>
              </div>
              <span className={`text-[10px] font-bold transition-colors duration-300 ${
                simStep > s.step 
                  ? "text-[#D9B6FF] font-bold" 
                  : simStep === s.step 
                  ? "text-[#D9B6FF] font-extrabold" 
                  : "text-white/40"
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Logs list */}
      <div className="relative z-10 space-y-2 min-h-[150px] max-h-[220px] overflow-y-auto custom-scrollbar font-mono text-[#a8afc0] pr-2">
        {simLogs.length === 0 ? (
          <div className="text-center py-8 text-white/40 italic font-sans">
            No active transaction. Trigger a Payment or Wallet/Agent action above to inspect live execution.
          </div>
        ) : (
          simLogs.map((log, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 6, filter: "blur(1px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              <span className="text-[#6D18FF] shrink-0 font-semibold select-none">[{log.time}]</span>
              <span className={
                log.text.includes("success") || log.text.includes("successful") || log.text.includes("successfully")
                  ? "text-[#D9B6FF] font-semibold"
                  : log.text.includes("failed") || log.text.includes("Error")
                  ? "text-red-400 font-semibold animate-pulse"
                  : log.text.includes("Step")
                  ? "text-white font-semibold"
                  : ""
              }>
                {log.text}
              </span>
            </motion.div>
          ))
        )}
      </div>
      
      {/* SUCCESS RECEIPT CARD */}
      {simSuccess && simTxHash && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.25 }}
          className="relative z-10 mt-6 rounded-2xl border border-[#6D18FF]/40 bg-[#6D18FF]/10 p-6 flex flex-col md:flex-row items-center gap-6 shadow-[0_20px_50px_rgba(109,24,255,0.15)] overflow-hidden backdrop-blur-md"
        >
          {/* Neon radial backdrop */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(109,24,255,0.15),transparent_70%)]" />
          
          <div className="w-12 h-12 rounded-full bg-[#6D18FF]/20 border border-[#6D18FF]/50 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(109,24,255,0.3)] animate-pulse">
            <CheckCircle2 className="w-6 h-6 text-[#D9B6FF]" />
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            <div className="text-[10px] font-bold text-[#D9B6FF] uppercase tracking-widest">UGF remote execution confirmed!</div>
            <h4 className="font-heading text-base font-bold text-white mt-1">Transaction Settled Gaslessly</h4>
            
            <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-sans border-t border-white/10 pt-3.5">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/60">Native ETH Cost:</span>
                <span className="text-[#D9B6FF] font-extrabold">0.00 ETH (100% Sponsored)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/60">Settlement Asset:</span>
                <span className="text-white font-semibold">TYI Mock USD</span>
              </div>
              <div className="flex justify-between col-span-1 sm:col-span-2 pt-1">
                <span className="text-white/60">Transaction Hash:</span>
                <span className="text-[#D9B6FF] font-mono text-[10px] truncate max-w-[200px] sm:max-w-sm md:max-w-md">{simTxHash}</span>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 w-full md:w-auto">
            <a
              href={simTxHash.startsWith("0x") && simTxHash.length === 66 ? `https://sepolia.basescan.org/tx/${simTxHash}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-5 py-3 text-xs font-bold text-black hover:bg-[#D9B6FF] hover:shadow-[0_0_20px_rgba(217,182,255,0.4)] transition-all text-center w-full shadow-md"
            >
              View on BaseScan <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      )}

      {/* ERROR CARD */}
      {simError && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.25 }}
          className="relative z-10 mt-6 rounded-2xl border border-red-500/30 bg-red-950/20 p-6 flex flex-col md:flex-row items-center gap-6 shadow-[0_20px_50px_rgba(239,68,68,0.15)] overflow-hidden backdrop-blur-md"
        >
          {/* Neon radial backdrop */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1),transparent_70%)]" />
          
          <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(239,68,68,0.2)]">
            <AlertCircle className="w-6 h-6 text-red-400 animate-bounce" />
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">UGF remote execution failed</div>
            <h4 className="font-heading text-base font-bold text-white mt-1">Transaction Execution Halted</h4>
            <p className="text-xs text-white/70 mt-2 leading-relaxed">
              {simError === "NO_MOCK_USD" 
                ? "Your wallet does not have sufficient Mock USD (TYI) stablecoins to cover the sponsored gas fee. Please acquire Mock USD from the official faucet."
                : `Error Reason: ${simError}`}
            </p>
          </div>
          
          <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-2">
            {simError === "NO_MOCK_USD" && (
              <a
                href="https://universalgasframework.com/faucets"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-5 py-3 text-xs font-bold text-black hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all text-center w-full"
              >
                <Coins className="h-3.5 w-3.5" /> Faucet
              </a>
            )}
            <button
              onClick={() => setSimError("")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold text-white hover:bg-white/10 transition-all text-center w-full"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
