import { motion } from "framer-motion";
import { Gift, Shield, Star, Sparkles, Check } from "lucide-react";

const badges = [
  {
    name: "Gasless Pioneer",
    rarity: "Legendary",
    desc: "First onchain action with zero ETH gas. Verifiable on Base Sepolia.",
    icon: "⚡",
    gradient: "from-[#6D18FF] to-[#43256E]",
  },
  {
    name: "UGF Early Adopter",
    rarity: "Epic",
    desc: "Completed a gasless transaction via Universal Gas Framework.",
    icon: "🛡️",
    gradient: "from-[#43256E] to-[#05031F]",
  },
  {
    name: "Mock USD Master",
    rarity: "Rare",
    desc: "Settled gas fees entirely in TYI stablecoins — no native ETH used.",
    icon: "💎",
    gradient: "from-[#D9B6FF]/30 to-[#6D18FF]",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

export default function Rewards() {
  return (
    <section id="rewards" className="relative py-28 overflow-hidden scroll-mt-24 border-t border-white/[0.04]">
      <div className="absolute inset-0 bg-[#05031F]" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#43256E]/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D9B6FF] bg-[#6D18FF]/15 border border-[#6D18FF]/30 px-4 py-2 rounded-full mb-5">
            <Gift className="w-3 h-3" />
            NFT Rewards
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Earn credentials{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #D9B6FF 0%, #6D18FF 100%)" }}
            >
              gaslessly
            </span>
          </h2>
          <p className="mt-5 text-white/45 text-base leading-relaxed">
            Claim verifiable on-chain NFT badges as rewards. Zero ETH required — powered by UGF on Base Sepolia.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {badges.map((badge) => (
            <motion.div
              key={badge.name}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
            >
              <motion.div
                className={`h-40 bg-gradient-to-br ${badge.gradient} flex items-center justify-center relative overflow-hidden`}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: "conic-gradient(from 0deg, transparent, rgba(217,182,255,0.4), transparent)",
                  }}
                />
                <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                  {badge.icon}
                </span>
                <motion.div
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-black/40 border border-emerald-400/30 px-2 py-1 rounded-full backdrop-blur-sm"
                >
                  <Check className="w-2.5 h-2.5" />
                  0 ETH Gas
                </motion.div>
              </motion.div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9B6FF] bg-[#6D18FF]/15 border border-[#6D18FF]/25 px-2 py-0.5 rounded-full">
                    {badge.rarity}
                  </span>
                  <Star className="w-3.5 h-3.5 text-[#D9B6FF]/50" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">{badge.name}</h3>
                <p className="mt-2 text-sm text-white/45 leading-relaxed">{badge.desc}</p>
                <a
                  href="#app"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#D9B6FF] hover:text-white transition-colors group/link"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Claim gaslessly
                  <Shield className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
