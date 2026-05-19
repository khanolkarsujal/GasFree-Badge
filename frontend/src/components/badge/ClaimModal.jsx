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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={!isBusy ? onClose : undefined}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative z-10 w-full max-w-[640px] flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(120,80,220,0.35)]"
          >
            {/* ── Left: Summary panel ── */}
            <div
              className="sm:w-[240px] flex-shrink-0 flex flex-col gap-6 p-6 sm:p-8 relative overflow-hidden border-r border-white/5"
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-20" style={{ color: badge.colors[0] }}>
                <div className="w-40 h-40 rounded-full blur-[60px] bg-current absolute top-[-20px] right-[-20px]" />
              </div>

              {/* Badge visual */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl relative z-10 border border-white/10"
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
                <h3 className="font-heading text-2xl font-bold text-white tracking-tight leading-tight">
                  {badge.name} Badge
                </h3>
                <p className="text-xs text-muted-foreground mt-1">ERC-721 · Base Sepolia</p>
              </div>

              {/* Stripe-style cost breakdown */}
              <div className="flex flex-col gap-3 mt-auto pt-5 border-t border-white/10 relative z-10">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-muted-foreground">ETH gas</span>
                  <span className="text-[oklch(0.78_0.17_160)] bg-[oklch(0.78_0.17_160)]/10 px-2 py-0.5 rounded border border-[oklch(0.78_0.17_160)]/20 font-bold">
                    Sponsored
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Settlement</span>
                  <span className="text-white font-medium">TYI Mock USD</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-white/10 mt-1">
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
                  className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
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
                    <h3 className="font-heading text-2xl font-bold text-white">Badge Claimed!</h3>
                    <p className="text-sm text-muted-foreground mt-1">It is now permanently on-chain.</p>
                  </div>
                  <a
                    href={basescanTx(txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between w-full mt-2 px-5 py-3.5 rounded-xl border border-white/10 bg-white/[0.02] text-white hover:bg-white/5 transition-all text-sm font-semibold group"
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
                        <li
                          key={s.id}
                          className={[
                            "flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                            done ? "bg-emerald-950/10 border-emerald-500/20" : "",
                            active
                              ? "border-[oklch(0.75_0.18_295/0.3)] bg-[oklch(0.75_0.18_295/0.05)] shadow-[0_0_24px_-4px_oklch(0.75_0.18_295/0.3)] animate-pulse"
                              : "",
                            pending ? "bg-white/[0.01] border-white/5 opacity-55" : "",
                          ].join(" ")}
                        >
                          {active && (
                            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.75_0.18_295/0.05)] to-transparent" />
                          )}

                          {/* Step indicator */}
                          <div
                            className={[
                              "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold relative z-10 transition-colors duration-300",
                              done
                                ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                : "",
                              active
                                ? "bg-gradient-to-br from-[oklch(0.7_0.2_295)] to-[oklch(0.5_0.22_290)] text-white shadow-[0_0_15px_oklch(0.7_0.2_295/0.4)]"
                                : "",
                              pending ? "bg-white/5 border border-white/10 text-muted-foreground" : "",
                            ].join(" ")}
                          >
                            {done && <CheckCircle2 className="w-5 h-5" />}
                            {active && (
                              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            )}
                            {pending && s.id}
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
                                  ? "text-[oklch(0.75_0.18_295/0.8)]"
                                  : "text-muted-foreground/60"
                              }`}
                            >
                              {s.sub}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  {/* Trust footer */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground bg-white/[0.02] py-2.5 rounded-xl border border-white/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.17_160)]" />
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
