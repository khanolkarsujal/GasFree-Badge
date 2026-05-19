import { motion } from "framer-motion";
import { Layers, Shield, Sparkles, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: Layers,
    title: "Gas abstraction layer",
    desc: "UGF routes every transaction through a universal settlement layer — users never touch native gas.",
  },
  {
    icon: Shield,
    title: "Mock USD settlement",
    desc: "Gas fees are quoted and paid in TYI stablecoins. Zero ETH balance required, ever.",
  },
  {
    icon: Sparkles,
    title: "Invisible blockchain UX",
    desc: "Connect wallet, sign once, done. The complexity disappears behind infrastructure-grade abstraction.",
  },
];

export default function SolutionSection() {
  return (
    <section className="relative py-28 overflow-hidden border-y border-white/[0.04]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 mx-auto max-w-7xl px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl border border-[#6D18FF]/25 overflow-hidden"
          style={{
            background: "linear-gradient(155deg, rgba(109,24,255,0.12) 0%, rgba(5,3,31,0.95) 50%, rgba(67,37,110,0.15) 100%)",
            boxShadow: "0 0 80px rgba(109,24,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(109,24,255,0.2),transparent_55%)] pointer-events-none" />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-[#D9B6FF]/10 rounded-full blur-[80px] pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-8 sm:p-12 lg:p-16"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400/90 bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-full">
                  The Solution
                </span>
                <h2 className="mt-6 font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                  Making the blockchain{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #D9B6FF 0%, #6D18FF 100%)" }}
                  >
                    invisible.
                  </span>
                </h2>
                <p className="mt-6 text-base leading-relaxed text-white/50 max-w-lg">
                  Gaslessio powered by Universal Gas Framework lets users perform any onchain action
                  without ETH. Gas is abstracted, settled in Mock USD, and executed on Base Sepolia —
                  automatically.
                </p>
                <a
                  href="#how-it-works"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#D9B6FF] hover:text-white transition-colors group"
                >
                  See how it works
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="space-y-4">
                {pillars.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#6D18FF]/20 border border-[#6D18FF]/30 flex items-center justify-center flex-shrink-0">
                      <p.icon className="w-5 h-5 text-[#D9B6FF]" />
                    </div>
                    <motion.div>
                      <h3 className="font-heading text-base font-bold text-white">{p.title}</h3>
                      <p className="mt-1 text-sm text-white/45 leading-relaxed">{p.desc}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
