import { motion } from "framer-motion";
import {
  Wallet,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Gift,
  Clock,
  Zap,
} from "lucide-react";

const activities = [
  { label: "NFT Badge claimed", time: "2m ago" },
  { label: "Mock USD transfer", time: "14m ago" },
  { label: "UGF gas settlement", time: "1h ago" },
];

function ActivityItem({ label, time }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#6D18FF]/15 border border-[#6D18FF]/25 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-[#D9B6FF]" />
        </div>
        <div>
          <div className="text-xs font-semibold text-white">{label}</div>
          <div className="text-[10px] text-white/35 flex items-center gap-1 mt-0.5">
            <Clock className="w-2.5 h-2.5" />
            {time}
          </div>
        </div>
      </div>
      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
        Success
      </span>
    </div>
  );
}

export default function DashboardPreview({ wallet, collection }) {
  const address = wallet?.account
    ? `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`
    : "0x3f4a...8b21";

  const displayTYI = collection?.tyiBalance !== null && collection?.tyiBalance !== undefined 
    ? parseFloat(collection.tyiBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "1,250.00";

  return (
    <section id="dashboard" className="relative py-28 overflow-hidden scroll-mt-24">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D9B6FF] bg-[#6D18FF]/15 border border-[#6D18FF]/30 px-4 py-2 rounded-full mb-5">
            Dashboard Preview
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Infrastructure-grade{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #D9B6FF 0%, #6D18FF 100%)" }}
            >
              fintech UX
            </span>
          </h2>
          <p className="mt-5 text-white/45 text-base leading-relaxed">
            A clean, real-time dashboard that makes gasless transactions feel as simple as any modern SaaS product.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-[#6D18FF]/15 blur-3xl pointer-events-none" />

          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0828]/90 to-[#05031F]/95 backdrop-blur-xl overflow-hidden shadow-[0_40px_100px_rgba(109,24,255,0.15)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(109,24,255,0.08),transparent_50%)] pointer-events-none" />

            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                ))}
              </div>
              <span className="flex-1 text-center text-[11px] font-semibold text-white/30 uppercase tracking-widest">
                Gaslessio Dashboard
              </span>
              <div className="w-12" />
            </div>

            <div className="p-6 sm:p-8 grid lg:grid-cols-[1.2fr_1fr] gap-6">
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#6D18FF]/25 bg-[#6D18FF]/5 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#6D18FF]/25 border border-[#6D18FF]/40 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-[#D9B6FF]" />
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Wallet</div>
                        <div className="text-sm font-mono text-white/80">{address}</div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-black/30 border border-white/5 p-4">
                      <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">ETH Balance</div>
                      <div className="mt-1 text-2xl font-heading font-bold text-white">
                        0.00 <span className="text-sm text-white/30">ETH</span>
                      </div>
                      <div className="mt-1.5 text-[10px] text-[#D9B6FF]/70">No gas token needed</div>
                    </div>
                    <div className="rounded-xl bg-[#6D18FF]/10 border border-[#6D18FF]/20 p-4">
                      <div className="text-[10px] text-[#D9B6FF]/60 uppercase tracking-wider font-semibold">Mock USD</div>
                      <div className="mt-1 text-2xl font-heading font-bold text-[#D9B6FF]">${displayTYI}</div>
                      <div className="mt-1.5 text-[10px] text-white/35">TYI · Base Sepolia</div>
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ boxShadow: ["0 0 20px rgba(16,185,129,0.1)", "0 0 40px rgba(16,185,129,0.2)", "0 0 20px rgba(16,185,129,0.1)"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex items-center gap-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-emerald-400">Transaction Successful</div>
                    <div className="text-xs text-white/40 mt-0.5">0.00 ETH gas · UGF sponsored · Base Sepolia</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400/60" />
                </motion.div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#D9B6FF]" />
                      <span className="text-sm font-bold text-white">Activity Feed</span>
                    </div>
                    <span className="text-[10px] text-white/30 font-mono">Real-time</span>
                  </div>
                  {activities.map((a) => (
                    <ActivityItem key={a.label} label={a.label} time={a.time} />
                  ))}
                </div>

                <motion.div className="rounded-2xl border border-[#43256E]/40 bg-[#43256E]/15 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6D18FF] to-[#43256E] flex items-center justify-center shadow-[0_0_24px_rgba(109,24,255,0.4)]">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#D9B6FF]/70 uppercase tracking-wider font-semibold">NFT Rewards</div>
                      <div className="text-sm font-bold text-white">Gasless Pioneer Badge</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Ready to claim · 0 ETH</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
