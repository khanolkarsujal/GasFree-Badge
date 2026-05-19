import { motion } from "framer-motion";
import { Wallet, CreditCard, Cpu, CheckCircle2, ArrowDown } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    label: "User Wallet",
    sub: "ETH Balance: 0",
    color: "#6D18FF",
    glow: "rgba(109,24,255,0.5)",
    accent: "#D9B6FF",
    tag: "Any EVM Wallet",
  },
  {
    icon: CreditCard,
    label: "Mock USD",
    sub: "TYI Stablecoin",
    color: "#43256E",
    glow: "rgba(67,37,110,0.6)",
    accent: "#D9B6FF",
    tag: "Gas Settlement",
  },
  {
    icon: Cpu,
    label: "UGF Layer",
    sub: "Universal Gas Framework",
    color: "#6D18FF",
    glow: "rgba(109,24,255,0.5)",
    accent: "#D9B6FF",
    tag: "EIP-191 · ERC-3009",
  },
  {
    icon: CheckCircle2,
    label: "Base Sepolia",
    sub: "L2 Blockchain",
    color: "#5E43F3",
    glow: "rgba(94,67,243,0.5)",
    accent: "#D9B6FF",
    tag: "Fast · Secure",
  },
  {
    icon: CheckCircle2,
    label: "Transaction Success",
    sub: "Zero ETH spent",
    color: "#10b981",
    glow: "rgba(16,185,129,0.4)",
    accent: "#6ee7b7",
    tag: "✓ Confirmed On-Chain",
    isSuccess: true,
  },
];

function FlowNode({ icon: Icon, label, sub, color, glow, accent, tag, isSuccess, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: index * 0.1 }}
      className="flex items-center gap-5"
    >
      {/* Node */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        className="relative flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: `${color}18`,
          border: `1.5px solid ${color}50`,
          boxShadow: `0 0 24px ${glow}`,
        }}
      >
        <Icon className="w-6 h-6" style={{ color: isSuccess ? accent : color }} />
        {/* Pulse ring for active nodes */}
        {!isSuccess && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ border: `1px solid ${color}`, boxShadow: `0 0 16px ${glow}` }}
          />
        )}
      </motion.div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2.5">
          <span className={`font-heading text-base font-bold ${isSuccess ? "text-emerald-400" : "text-white"}`}>
            {label}
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              color: isSuccess ? "#6ee7b7" : accent,
              background: `${color}18`,
              border: `1px solid ${color}30`,
            }}
          >
            {tag}
          </span>
        </div>
        <div className="text-sm text-white/40 mt-0.5">{sub}</div>
      </div>

      {/* Right indicator */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: isSuccess ? "#10b981" : color, boxShadow: `0 0 8px ${glow}` }}
      />
    </motion.div>
  );
}

function ConnectorLine({ index }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      whileInView={{ height: "32px", opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
      className="flex items-center justify-start ml-7 overflow-hidden"
    >
      <div className="flex flex-col items-center gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 + index * 0.2 }}
            className="w-px h-2 bg-gradient-to-b from-[#6D18FF] to-[#D9B6FF]"
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function TransactionFlow() {
  return (
    <section id="how-it-works" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#05031F]" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#6D18FF]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute right-0 top-1/3 w-72 h-72 bg-[#43256E]/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D9B6FF] bg-[#6D18FF]/15 border border-[#6D18FF]/30 px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9B6FF]" />
              Transaction Flow
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight">
              How every gasless
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #D9B6FF 0%, #6D18FF 100%)" }}
              >
                transaction works
              </span>
            </h2>
            <p className="mt-6 text-white/45 text-base leading-relaxed max-w-md">
              Under the hood, UGF orchestrates a seamless 4-step flow: authenticate, quote, settle in Mock USD, and execute on-chain — all with zero ETH.
            </p>

            {/* Steps summary */}
            <div className="mt-10 space-y-4">
              {[
                { step: "01", label: "Authenticate", desc: "EIP-191 wallet signature creates a UGF session." },
                { step: "02", label: "Quote", desc: "UGF oracle prices the gas fee in Mock USD (TYI)." },
                { step: "03", label: "Settle", desc: "ERC-3009 signature authorizes Mock USD deduction." },
                { step: "04", label: "Execute", desc: "UGF sponsors the ETH gas and sends your transaction." },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <span
                    className="font-heading text-xs font-bold pt-0.5 flex-shrink-0 w-8"
                    style={{ color: "#6D18FF" }}
                  >
                    {s.step}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-white">{s.label}</div>
                    <div className="text-sm text-white/40 mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual Flow */}
          <div className="relative">
            {/* Card */}
            <div className="relative rounded-3xl border border-[#6D18FF]/20 bg-gradient-to-br from-[#0f0828] to-[#05031F] p-8 shadow-[0_0_80px_rgba(109,24,255,0.15)]">
              {/* Glow overlay */}
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(109,24,255,0.12),transparent_60%)] pointer-events-none" />

              {/* Header */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-[#6D18FF] animate-pulse" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">UGF Transaction Pipeline</span>
              </div>

              {/* Flow nodes */}
              <div className="relative">
                {steps.map((step, i) => (
                  <div key={step.label}>
                    <FlowNode {...step} index={i} />
                    {i < steps.length - 1 && <ConnectorLine index={i} />}
                  </div>
                ))}
              </div>

              {/* Footer stat */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-4"
              >
                {[
                  { label: "ETH Used", value: "0.00", accent: true },
                  { label: "Time", value: "~2s" },
                  { label: "Network", value: "Base L2" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className={`font-heading text-lg font-bold ${s.accent ? "text-emerald-400" : "text-white"}`}>
                      {s.value}
                    </div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
