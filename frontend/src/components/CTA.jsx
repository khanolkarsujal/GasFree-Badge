import { motion } from "framer-motion";
import { Zap, ArrowRight, GitBranch } from "lucide-react";

export default function CTA({ wallet, onConnect }) {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[#05031F]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,24,255,0.15),transparent_65%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative rounded-3xl border border-[#6D18FF]/30 overflow-hidden"
          style={{
            background: "linear-gradient(155deg, rgba(109,24,255,0.15) 0%, rgba(5,3,31,0.98) 50%, rgba(67,37,110,0.2) 100%)",
            boxShadow: "0 0 100px rgba(109,24,255,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#6D18FF]/30 blur-[60px] pointer-events-none"
          />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D9B6FF] bg-[#6D18FF]/20 border border-[#6D18FF]/35 px-4 py-2 rounded-full mb-6"
            >
              <Zap className="w-3 h-3" fill="currentColor" />
              Start building gasless
            </motion.span>

            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] max-w-3xl mx-auto">
              The Stripe for{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #D9B6FF 0%, #6D18FF 100%)" }}
              >
                gasless Web3
              </span>
            </h2>
            <p className="mt-6 text-white/45 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              Launch your product with zero gas friction. Connect a wallet and experience the future of onchain UX — powered by UGF.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              <button
                onClick={
                  !wallet?.account
                    ? onConnect
                    : !wallet?.isRightChain
                    ? wallet.switchToBaseSepolia
                    : undefined
                }
                className="group relative flex items-center gap-2 px-8 py-4 rounded-full bg-[#6D18FF] text-white text-sm font-semibold shadow-[0_0_40px_rgba(109,24,255,0.5)] hover:shadow-[0_0_60px_rgba(109,24,255,0.7)] transition-all duration-300 overflow-hidden"
              >
                <Zap className="w-4 h-4" fill="white" />
                {!wallet?.account
                  ? "Launch App"
                  : !wallet?.isRightChain
                  ? "Switch Network"
                  : "Connected — Explore App"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="https://github.com/khanolkarsujal/GasFree-Badge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-7 py-4 rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:text-white text-sm font-semibold backdrop-blur-sm hover:bg-white/[0.08] transition-all"
              >
                <GitBranch className="w-4 h-4" />
                View on GitHub
              </a>
            </motion.div>

            <p className="mt-8 text-[11px] text-white/25 uppercase tracking-widest font-semibold">
              Base Sepolia · UGF · Mock USD · Zero ETH Required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
