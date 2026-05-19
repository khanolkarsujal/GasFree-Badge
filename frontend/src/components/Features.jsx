import { motion } from "framer-motion";
import { Zap, CreditCard, Gift, Wallet, Activity, Gauge, Users, Layers } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Gasless Transactions",
    desc: "Execute any onchain action without holding ETH. UGF sponsors 100% of gas fees automatically.",
    color: "#6D18FF",
    glow: "rgba(109,24,255,0.35)",
  },
  {
    icon: CreditCard,
    title: "Mock USD Payments",
    desc: "Pay with stablecoins (TYI Mock USD) for all gas settlements. No native token juggling required.",
    color: "#D9B6FF",
    glow: "rgba(217,182,255,0.25)",
  },
  {
    icon: Gift,
    title: "NFT Rewards",
    desc: "Claim verifiable on-chain badges and credentials with zero friction. One click, permanently yours.",
    color: "#43256E",
    glow: "rgba(67,37,110,0.5)",
  },
  {
    icon: Wallet,
    title: "Wallet Simplicity",
    desc: "Users connect any wallet and start transacting. No faucets, no bridging, no technical barriers.",
    color: "#6D18FF",
    glow: "rgba(109,24,255,0.35)",
  },
  {
    icon: Activity,
    title: "Real-Time Tracking",
    desc: "Watch every step of your gasless transaction — auth, quote, settle, execute — in live terminal view.",
    color: "#D9B6FF",
    glow: "rgba(217,182,255,0.25)",
  },
  {
    icon: Gauge,
    title: "Instant Execution",
    desc: "Transactions settle in seconds on Base Sepolia's fast L2 infrastructure. No waiting, no delays.",
    color: "#43256E",
    glow: "rgba(67,37,110,0.5)",
  },
  {
    icon: Users,
    title: "Beginner-Friendly UX",
    desc: "Designed for first-time Web3 users. If you can use a website, you can use Gaslessio.",
    color: "#6D18FF",
    glow: "rgba(109,24,255,0.35)",
  },
  {
    icon: Layers,
    title: "Base Sepolia Integration",
    desc: "Built natively on Base Sepolia — fast, secure, and scalable L2 with full EVM compatibility.",
    color: "#D9B6FF",
    glow: "rgba(217,182,255,0.25)",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

function FeatureCard({ icon: Icon, title, desc, color, glow }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative group rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 overflow-hidden cursor-default"
      style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04)` }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ boxShadow: `inset 0 0 40px ${glow}` }}
      />
      {/* Top border glow on hover */}
      <div
        className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 relative"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: `0 0 20px ${glow}` }}
        />
      </div>

      <h3 className="font-heading text-base font-bold text-white mb-2.5">{title}</h3>
      <p className="text-sm leading-relaxed text-white/45">{desc}</p>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#05031F]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#6D18FF]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(217,182,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D9B6FF] bg-[#6D18FF]/15 border border-[#6D18FF]/30 px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9B6FF]" />
            Key Features
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Everything you need for{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #D9B6FF 0%, #6D18FF 100%)" }}
            >
              gasless Web3
            </span>
          </h2>
          <p className="mt-5 text-white/45 text-base leading-relaxed">
            Built on the Universal Gas Framework — the infrastructure layer that makes blockchain invisible to end users.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
