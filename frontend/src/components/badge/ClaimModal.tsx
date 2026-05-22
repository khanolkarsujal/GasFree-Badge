import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, ExternalLink, X } from "lucide-react";
import { UGF_STEPS } from "../../lib/constants";
import { basescanTx, shortenHash } from "../../lib/utils";

export function ClaimModal({ badge, activeStep, txHash, error, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isBusy = activeStep > 0 && !txHash && !error;
  const isSuccess = !!txHash;
  const isError = !!error && !isSuccess;

  return (
    <AnimatePresence>
      {isOpen && badge && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0"
          role="dialog"
          aria-modal="true"
          aria-label={`Claim ${badge.name} badge`}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={!isBusy ? onClose : undefined}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative z-10 w-full max-w-[640px] max-h-[90vh] sm:max-h-none flex flex-col sm:flex-row overflow-y-auto sm:overflow-hidden rounded-3xl border border-border shadow-[0_30px_80px_-20px_rgba(120,80,220,0.45)] scrollbar-thin scrollbar-thumb-white/10"
          >
            {/* ── Left: Summary panel ── */}
            <div
              className="sm:w-[240px] flex-shrink-0 flex flex-col gap-6 p-6 sm:p-8 relative overflow-hidden border-b sm:border-b-0 sm:border-r border-border/5"
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-20" style={{ color: badge.colors[0] }}>
                <div className="w-40 h-40 rounded-full blur-[60px] bg-current absolute top-[-20px] right-[-20px]" />
              </div>

              {/* Badge visual */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl relative z-10 border border-border/10"
                style={{
                  background: `linear-gradient(135deg, ${badge.colors[0]}, ${badge.colors[1]})`,
                }}
                aria-hidden
              >
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-sm" />
                <span className="relative drop-shadow-md">{badge.icon}</span>
              </div>

              <div className="relative z-10">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                  Claiming
                </p>
                <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-tight">
                  {badge.name} Badge
                </h3>
                <p className="text-xs text-muted-foreground mt-1">ERC-721 · Base Sepolia</p>
              </div>

              {/* Dynamic Step Processing Detail Banner */}
              {isBusy && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-[var(--violet)/0.2] bg-[var(--violet)/0.05] p-3.5 relative overflow-hidden z-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--violet)/0.05] to-transparent animate-pulse" />
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--violet)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--violet)]"></span>
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--violet)]">
                      Processing
                    </span>
                  </div>
                  <p className="text-[11px] text-white/90 mt-2 font-medium leading-relaxed min-h-[36px]">
                    {activeStep === 1 && "Verifying identity & signature via JWT..."}
                    {activeStep === 2 && "Pricing action & quoting Mock USD..."}
                    {activeStep === 3 && "Sponsoring transaction with Zero ETH..."}
                    {activeStep === 4 && "Broadcasting claim event to Base Sepolia..."}
                  </p>
                </motion.div>
              )}

              {/* Stripe-style cost breakdown */}
              <div className="flex flex-col gap-3 mt-auto pt-5 border-t border-border/10 relative z-10">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-muted-foreground">ETH gas</span>
                  <span className="text-[var(--mint)] bg-[var(--mint)]/10 px-2 py-0.5 rounded border border-[var(--mint)]/20 font-bold">
                    Sponsored
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Settlement</span>
                  <span className="text-white font-medium">TYI Mock USD</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-border/10 mt-1">
                  <span className="text-white font-bold">ETH deducted</span>
                  <span className="text-white font-extrabold tracking-tight">0.00</span>
                </div>
              </div>
            </div>

            {/* ── Right: Steps + state ── */}
            <div className="flex-1 flex flex-col bg-[#0b0c10] p-6 sm:p-8 relative">
              {!isBusy && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full border border-border/10 z-20"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Success */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-5 py-4 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">Badge Claimed!</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">It is now permanently on-chain.</p>
                  </div>
                  <a
                    href={basescanTx(txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between w-full mt-2 px-5 py-3.5 rounded-xl border border-border/10 bg-white/[0.02] text-white hover:bg-white/5 transition-all text-sm font-semibold group"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-white" />
                      View on BaseScan
                    </span>
                    <span className="font-mono text-muted-foreground text-xs">{shortenHash(txHash)}</span>
                  </a>
                </motion.div>
              )}

              {/* Error */}
              {isError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col h-full justify-center gap-4 py-2"
                >
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-950/20 border border-red-500/20">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white tracking-tight">Transaction failed</p>
                      {error === "NO_MOCK_USD" ? (
                        <p className="text-xs text-red-400 mt-1.5 leading-relaxed font-medium">
                          No TYI balance —{" "}
                          <a
                            href="https://universalgasframework.com/faucets"
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-red-300 transition-colors"
                          >
                            get it free
                          </a>
                        </p>
                      ) : (
                        <p className="text-xs text-red-400 mt-1.5 leading-relaxed font-medium">
                          {error}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-all shadow-sm"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}

              {/* Active claim steps */}
              {!isSuccess && !isError && (
                <div className="flex flex-col h-full">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Authorization steps
                  </p>
                  <ol className="flex flex-col gap-2.5 list-none flex-1">
                    {UGF_STEPS.map((s) => {
                      const done = activeStep > s.id;
                      const active = activeStep === s.id;
                      const pending = activeStep < s.id;
                      return (
                        <motion.li
                          layout
                          key={s.id}
                          className={[
                            "flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                            done ? "bg-emerald-950/10 border-emerald-500/20" : "",
                            active
                              ? "border-[var(--violet)/0.3] bg-[var(--violet)/0.05] shadow-[0_0_30px_-5px_var(--violet)/0.25]"
                              : "",
                            pending ? "bg-white/[0.01] border-border/5 opacity-55" : "",
                          ].join(" ")}
                        >
                          {active && (
                            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[var(--violet)] to-[var(--pink)]" />
                          )}

                          {/* Step indicator */}
                          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center relative">
                            {done && (
                              <motion.div
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </motion.div>
                            )}

                            {active && (
                              <>
                                {/* Radar pulse rings */}
                                <span className="absolute inset-0 rounded-full bg-[var(--violet)] opacity-40 animate-radar" />
                                <span
                                  className="absolute inset-0.5 rounded-full bg-[var(--violet)] opacity-20 animate-radar"
                                  style={{ animationDelay: "0.6s" }}
                                />
                                {/* Center spinning indicator */}
                                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[var(--violet)] to-[var(--pink)] text-white shadow-[0_0_15px_var(--violet)/0.4] flex items-center justify-center">
                                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                </div>
                              </>
                            )}

                            {pending && (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-border/10 text-muted-foreground font-bold text-xs">
                                {s.id}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 relative z-10">
                            <p
                              className={`text-sm font-bold tracking-tight ${
                                done ? "text-emerald-400" : active ? "text-white" : "text-muted-foreground"
                              }`}
                            >
                              {s.label}
                            </p>
                            <p
                              className={`text-xs mt-0.5 font-medium ${
                                done
                                  ? "text-emerald-500/70"
                                  : active
                                  ? "text-[var(--violet)/0.85] font-semibold"
                                  : "text-muted-foreground/60"
                              }`}
                            >
                              {s.sub}
                            </p>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ol>

                  {/* Trust footer */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground bg-white/[0.02] py-2.5 rounded-xl border border-border/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--mint)]" />
                    Zero ETH deducted · Sponsored by UGF
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
