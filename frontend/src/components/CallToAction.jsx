export function CallToAction({ onConnect, isWalletReady }) {
  return (
    <section className="mt-20 mb-8 w-full">
      <div className="bg-[#12141d] rounded-3xl p-10 sm:p-14 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8">

        {/* Left Side */}
        <div className="flex-1 max-w-[500px]">
          <span className="text-[10px] text-indigo-300/80 font-bold tracking-[0.15em] uppercase mb-4 block">
            Ready to claim
          </span>
          <h2 className="text-[2.2rem] sm:text-[2.75rem] font-serif leading-[1.05] tracking-tight text-white mb-6">
            Give recipients a badge<br />
            experience that feels as credible<br />
            as the credential.
          </h2>
          <p className="text-[1rem] text-[#94a3b8] leading-[1.6] mb-8 max-w-[420px] font-light">
            Connect a wallet, verify the contract, and launch a gas-sponsored claim page for your next professional cohort.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {!isWalletReady ? (
              <button
                onClick={onConnect}
                className="bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-full font-bold text-[0.95rem] transition-colors"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-full font-bold text-[0.95rem] transition-colors"
              >
                Wallet Connected
              </button>
            )}
            <a
              href="https://universalgasframework.com"
              target="_blank"
              rel="noreferrer"
              className="bg-transparent hover:bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-full font-bold text-[0.95rem] transition-colors inline-block"
            >
              Read UGF Docs
            </a>
          </div>
        </div>

        {/* Right Side - Readiness list */}
        <div className="w-full lg:w-[320px] shrink-0 lg:pt-2">
          <h3 className="text-[13px] text-white font-bold tracking-tight mb-5">
            Claim readiness
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#0f111a]">
              <span className="text-[0.9rem] text-[#64748b]">Wallet</span>
              <span className="text-[0.9rem] text-slate-300">Required</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#0f111a]">
              <span className="text-[0.9rem] text-[#64748b]">Gas</span>
              <span className="text-[0.9rem] text-emerald-400">Sponsored</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#0f111a]">
              <span className="text-[0.9rem] text-[#64748b]">Network</span>
              <span className="text-[0.9rem] text-slate-300">Base Sepolia</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
