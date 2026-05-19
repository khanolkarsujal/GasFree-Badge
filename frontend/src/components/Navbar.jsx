import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, Menu, X } from "lucide-react";
import GaslessioLogo from "@/components/brand/GaslessioLogo";

export default function Navbar({ wallet, collection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayTYI = collection?.tyiBalance !== null && collection?.tyiBalance !== undefined 
    ? parseFloat(collection.tyiBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "150.00";

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "Rewards", href: "#rewards" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 border-b border-white/[0.06] bg-[#05031F]/80 backdrop-blur-2xl"
          : "py-5 border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#" className="group transition-opacity hover:opacity-90">
          <GaslessioLogo markClassName="h-8 w-auto text-white" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/khanolkarsujal/GasFree-Badge"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium"
          >
            <GitBranch className="w-4 h-4" />
            GitHub
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!wallet.account ? (
            <button
              onClick={wallet.connect}
              className="relative group px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden bg-[#6D18FF] text-white hover:bg-[#D9B6FF] hover:text-black shadow-[0_0_20px_rgba(109,24,255,0.4)]"
            >
              <span className="relative z-10">Connect Wallet</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          ) : !wallet.isRightChain ? (
            <button
              onClick={wallet.switchToBaseSepolia}
              className="relative group px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden bg-amber-500 text-black hover:bg-amber-400"
            >
              <span className="relative z-10">Switch to Base Sepolia</span>
            </button>
          ) : (
            <div className="flex items-center bg-[#05031F]/80 border border-white/10 rounded-full p-1 pr-3 shadow-[0_0_15px_rgba(109,24,255,0.15)] backdrop-blur-md">
              <div className="flex items-center px-3 py-1.5 border-r border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">Base Sepolia</span>
              </div>
              <div className="flex items-center px-3 py-1.5 border-r border-white/10 gap-3">
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[10px] text-white/50">ETH Balance</span>
                  <span className="text-[11px] font-bold text-emerald-400">0.00</span>
                </div>
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[10px] text-white/50">TYI (Mock USD)</span>
                  <span className="text-[11px] font-bold text-[#D9B6FF]">{displayTYI}</span>
                </div>
              </div>
              <div className="flex items-center pl-3 py-1.5 gap-2">
                <span className="text-sm font-mono text-white bg-white/5 px-2 py-1 rounded-md border border-white/5">
                  {wallet.account.slice(0, 6)}...{wallet.account.slice(-4)}
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white/70 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#05031F]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white/70 hover:text-white text-sm font-medium transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com/khanolkarsujal/GasFree-Badge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium py-1"
              >
                <GitBranch className="w-4 h-4" />
                GitHub
              </a>
              {!wallet.account ? (
                <button
                  onClick={wallet.connect}
                  className="mt-2 w-full py-3 rounded-full bg-[#6D18FF] text-white text-sm font-semibold shadow-[0_0_20px_rgba(109,24,255,0.4)]"
                >
                  Connect Wallet
                </button>
              ) : !wallet.isRightChain ? (
                <button
                  onClick={wallet.switchToBaseSepolia}
                  className="mt-2 w-full py-3 rounded-full bg-amber-500 text-black text-sm font-semibold"
                >
                  Switch Network
                </button>
              ) : (
                <div className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-white/80">
                      {wallet.account.slice(0, 6)}...{wallet.account.slice(-4)}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Base Sepolia</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 rounded-lg p-2">
                      <div className="text-[10px] text-white/50">ETH</div>
                      <div className="text-xs font-bold text-emerald-400 mt-0.5">0.00</div>
                    </div>
                    <div className="bg-[#6D18FF]/20 rounded-lg p-2">
                      <div className="text-[10px] text-white/50">TYI</div>
                      <div className="text-xs font-bold text-[#D9B6FF] mt-0.5">{displayTYI}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
