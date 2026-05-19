import { motion } from "framer-motion";
import { GitBranch, ExternalLink } from "lucide-react";
import GaslessioLogo from "@/components/brand/GaslessioLogo";
import { CONTRACT_ADDRESS } from "@/contractConfig";
import { basescanAddress } from "@/lib/utils";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Rewards", href: "#rewards" },
  { label: "Launch App", href: "#app" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#05031F]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#" className="group transition-opacity hover:opacity-90">
              <GaslessioLogo markClassName="h-9 w-auto text-white" />
            </a>
            <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-xs">
              Onchain actions. Zero gas friction. Powered by Universal Gas Framework on Base Sepolia.
            </p>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#D9B6FF]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D18FF]" />
              Built on Base
            </motion.div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">Product</div>
            <nav className="flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/50 hover:text-white transition-colors w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">Resources</div>
            <nav className="flex flex-col gap-3">
              <a
                href="https://github.com/khanolkarsujal/GasFree-Badge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2 w-fit"
              >
                <GitBranch className="w-3.5 h-3.5" />
                GitHub
              </a>
              <a
                href="https://universalgasframework.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2 w-fit"
              >
                UGF Docs
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={basescanAddress(CONTRACT_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2 w-fit"
              >
                BaseScan
                <ExternalLink className="w-3 h-3" />
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Gaslessio. Universal Gas Framework.
          </p>
          <p className="text-xs text-white/25 font-mono">
            {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}
          </p>
        </div>
      </div>
    </footer>
  );
}
