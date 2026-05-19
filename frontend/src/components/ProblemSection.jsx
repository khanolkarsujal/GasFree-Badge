import { motion } from "framer-motion";
import { AlertTriangle, XCircle, Ban } from "lucide-react";

const painPoints = [
  {
    icon: XCircle,
    title: "ETH required for every action",
    desc: "Users must hold native gas tokens before they can do anything onchain — a non-starter for newcomers.",
  },
  {
    icon: Ban,
    title: "Faucets & bridges add friction",
    desc: "Onboarding flows break when users need to hunt for testnet ETH or bridge assets just to claim a reward.",
  },
  {
    icon: AlertTriangle,
    title: "Web3 UX breaks at step one",
    desc: "Products lose 80%+ of users at the wallet connection when gas complexity enters the picture.",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 mx-auto max-w-7xl px-6"
      >
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D9B6FF] bg-[#6D18FF]/15 border border-[#6D18FF]/30 px-4 py-2 rounded-full">
            The Problem
          </span>
          <h2 className="mt-6 font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Web3 UX breaks when users need{" "}
            <span className="text-white/40">ETH.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/45 max-w-2xl">
            Every onchain product forces users to understand gas, networks, and native tokens before they
            can experience value. That friction kills adoption before your product even starts.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-14 grid gap-4 md:grid-cols-3"
        >
          {painPoints.map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
              }}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 hover:border-[#6D18FF]/25 hover:bg-white/[0.04] transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5"
              >
                <item.icon className="w-5 h-5 text-red-400/80" />
              </motion.div>
              <h3 className="font-heading text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/45">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
