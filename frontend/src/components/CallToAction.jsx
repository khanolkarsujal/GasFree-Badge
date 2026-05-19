export function CallToAction({ onConnect, isWalletReady }) {
  return (
    <section className="mt-20 mb-8 w-full relative">
      {/* Background glow behind the container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative bg-[#090b11]/30 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 sm:p-12 md:p-16 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">

        {/* Left Side */}
        <div className="flex-1 max-w-[550px]">
          <span className="text-[10px] text-purple-400 font-extrabold tracking-[0.2em] uppercase mb-4 block">
            Ready to claim
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight text-white mb-6">
            Give recipients a badge experience that feels as credible as the credential.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-8 max-w-[440px] font-medium">
            Connect a wallet, verify the contract, and launch a gas-sponsored claim page for your next professional cohort.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {!isWalletReady ? (
              <button
                onClick={onConnect}
                className="bg-white hover:bg-slate-100 text-black px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-colors cursor-default"
              >
                Wallet Connected
              </button>
            )}
            <a
              href="https://universalgasframework.com/docs/overview"
              target="_blank"
              rel="noreferrer"
              className="bg-transparent hover:bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-block"
            >
              Read UGF Docs
            </a>
          </div>
        </div>

        {/* Right Side - Readiness list */}
        <div className="w-full lg:w-[320px] shrink-0 lg:pt-2">
          <h3 className="text-xs text-white font-extrabold tracking-wider uppercase mb-5">
            Claim readiness
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-200">
              <span className="text-xs font-semibold text-slate-400">Wallet</span>
              <span className="text-xs font-bold text-slate-300">Required</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-200">
              <span className="text-xs font-semibold text-slate-400">Gas</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                Sponsored
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-200">
              <span className="text-xs font-semibold text-slate-400">Network</span>
              <span className="text-xs font-bold text-slate-300">Base Sepolia</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
