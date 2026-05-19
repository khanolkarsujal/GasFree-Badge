import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch, Zap, CheckCircle2, Wallet, Activity } from "lucide-react";

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let w, h;

    const particles = [];
    const NUM = 60;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < NUM; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.4,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217,182,255,${p.alpha})`;
        ctx.fill();
      });

      // Draw subtle connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(109,24,255,${0.12 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

function FloatingWalletCard() {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Glow */}
      <div className="absolute -inset-4 rounded-3xl bg-[#6D18FF]/20 blur-2xl" />

      {/* Card */}
      <div className="relative rounded-2xl border border-[#6D18FF]/30 bg-gradient-to-br from-[#0f0828] to-[#180840] p-6 shadow-[0_0_60px_rgba(109,24,255,0.25)] backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6D18FF]/20 border border-[#6D18FF]/30 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#D9B6FF]" />
            </div>
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Wallet</div>
              <div className="text-xs font-mono text-white/70">0x3f4a...8b21</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>

        {/* ETH Balance - KEY VISUAL */}
        <div className="rounded-xl bg-black/30 border border-white/5 p-4 mb-4">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1 font-semibold">ETH Balance</div>
          <div className="text-3xl font-heading font-bold text-white">0.00 <span className="text-base text-white/30">ETH</span></div>
          <div className="mt-2 text-xs text-[#D9B6FF]/70">No ETH required for gas ✓</div>
        </div>

        {/* Mock USD Balance */}
        <div className="rounded-xl bg-[#6D18FF]/10 border border-[#6D18FF]/20 p-4 mb-5">
          <div className="text-[10px] text-[#D9B6FF]/60 uppercase tracking-wider mb-1 font-semibold">Mock USD Balance</div>
          <div className="text-2xl font-heading font-bold text-[#D9B6FF]">$1,250.00</div>
          <div className="mt-1 text-xs text-white/40">TYI Stablecoin · Base Sepolia</div>
        </div>

        {/* Transaction Success */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400">Transaction Successful</div>
            <div className="text-[10px] text-white/40 mt-0.5">0.00 ETH gas used · UGF sponsored</div>
          </div>
        </motion.div>

        {/* Mini activity dots */}
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/5">
          <Activity className="w-3 h-3 text-white/30" />
          <div className="flex gap-1 flex-1">
            {[40, 65, 85, 50, 90, 70, 55, 80, 45, 75].map((h, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [1, h / 50, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.12 }}
                className="flex-1 rounded-sm bg-[#6D18FF]/50 origin-bottom"
                style={{ height: `${h * 0.28}px` }}
              />
            ))}
          </div>
          <span className="text-[10px] text-white/30 font-mono">Live</span>
        </div>
      </div>

      {/* Floating Nodes */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#D9B6FF]/30 border border-[#D9B6FF]/50 backdrop-blur-sm"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-[#6D18FF]/40 border border-[#6D18FF]/60 backdrop-blur-sm"
      />
      <motion.div
        animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 -right-6 w-4 h-4 rounded-full bg-[#43256E] border border-[#D9B6FF]/30"
      />
    </motion.div>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1], delay },
});

export default function Hero({ wallet, onConnect }) {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#05031F]" />
      {/* Radial glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6D18FF]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#43256E]/20 rounded-full blur-[100px] pointer-events-none" />
      {/* Dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(217,182,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      {/* Particles */}
      <ParticleCanvas />

      <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <motion.div {...fadeUp(0.1)}>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D9B6FF] bg-[#6D18FF]/15 border border-[#6D18FF]/30 px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9B6FF] animate-pulse" />
                Powered by Universal Gas Framework
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              {...fadeUp(0.2)}
              className="mt-7 font-heading text-5xl sm:text-6xl lg:text-[68px] font-bold leading-[1.04] tracking-tight text-white"
            >
              Onchain actions.{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #D9B6FF 0%, #6D18FF 100%)" }}
              >
                Zero gas
                <br />
                friction.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p {...fadeUp(0.3)} className="mt-6 text-base leading-relaxed text-white/50 max-w-lg">
              Gaslessio enables seamless blockchain transactions powered by Universal Gas Framework.
              Users perform onchain actions without needing ETH — gas is settled in Mock USD automatically.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.4)} className="mt-9 flex flex-wrap items-center gap-3">
              <button
                id="hero-launch-btn"
                onClick={
                  !wallet.account
                    ? onConnect
                    : !wallet.isRightChain
                    ? wallet.switchToBaseSepolia
                    : () => document.getElementById("app")?.scrollIntoView({ behavior: "smooth" })
                }
                className="group relative flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#6D18FF] text-white text-sm font-semibold shadow-[0_0_30px_rgba(109,24,255,0.5)] hover:shadow-[0_0_45px_rgba(109,24,255,0.7)] transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Zap className="w-4 h-4" fill="white" />
                  {!wallet.account ? "Launch App" : !wallet.isRightChain ? "Switch Network" : `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7d28ff] to-[#6D18FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <a
                href="#dashboard"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/10 bg-white/[0.04] text-white text-sm font-semibold backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
              >
                View Demo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>

              <a
                href="https://github.com/khanolkarsujal/GasFree-Badge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/10 bg-white/[0.04] text-white/60 hover:text-white text-sm font-medium backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300"
              >
                <GitBranch className="w-4 h-4" />
                GitHub
              </a>
            </motion.div>

            {/* Stats Row */}
            <motion.div {...fadeUp(0.5)} className="mt-12 flex flex-wrap gap-6">
              {[
                { label: "Gas Cost", value: "0 ETH", accent: true },
                { label: "Network", value: "Base Sepolia" },
                { label: "Settlement", value: "Mock USD" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30">{s.label}</div>
                  <div className={`text-sm font-bold ${s.accent ? "text-emerald-400" : "text-white/80"}`}>{s.value}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Wallet Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <FloatingWalletCard />
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          {...fadeUp(0.8)}
          className="mt-16 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5"
          >
            <div className="w-0.5 h-2 bg-white/30 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
