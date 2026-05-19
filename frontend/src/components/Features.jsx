import { Zap, ArrowLeftRight, ShieldCheck } from 'lucide-react';

export function Features() {
  return (
    <section className="py-24 max-w-[1000px] mx-auto text-center">

      {/* Heading */}
      <h2 className="text-[2.5rem] sm:text-[3.5rem] font-sans font-extrabold tracking-tight leading-[1.05] mb-6">
        <span className="text-white">Enterprise-grade infrastructure.</span><br />
        <span className="text-[#a855f7]">Invisible to the user.</span>
      </h2>

      <p className="text-[#94a3b8] text-[1.1rem] leading-[1.6] max-w-[650px] mx-auto mb-16 font-light">
        The Universal Gas Framework removes friction from onboarding by abstracting complex Web3 mechanics away from your end users.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">

        {/* Card 1 */}
        <div className="bg-[#0b0c10]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors flex flex-col justify-between shadow-lg">
          <div>
            <div className="w-12 h-12 rounded-[14px] bg-[#1a1528] border border-[#a855f7]/20 flex items-center justify-center mb-8">
              <Zap className="w-5 h-5 text-[#a855f7]" />
            </div>
            <h3 className="text-[1.15rem] text-white font-semibold tracking-tight mb-3">Zero ETH Requirement</h3>
            <p className="text-[#64748b] text-[0.95rem] leading-relaxed">
              Users can interact with your dApp immediately. Transactions are sponsored natively without requiring users to bridge or purchase native tokens first.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0b0c10]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors flex flex-col justify-between shadow-lg">
          <div>
            <div className="w-12 h-12 rounded-[14px] bg-[#1a1528] border border-[#a855f7]/20 flex items-center justify-center mb-8">
              <ArrowLeftRight className="w-5 h-5 text-[#a855f7]" />
            </div>
            <h3 className="text-[1.15rem] text-white font-semibold tracking-tight mb-3">Token Agnostic Settlement</h3>
            <p className="text-[#64748b] text-[0.95rem] leading-relaxed">
              Settle gas costs in stablecoins or your own protocol tokens. The framework handles the conversion behind the scenes seamlessly.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0b0c10]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors flex flex-col justify-between shadow-lg">
          <div>
            <div className="w-12 h-12 rounded-[14px] bg-[#101915] border border-emerald-500/20 flex items-center justify-center mb-8">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-[1.15rem] text-white font-semibold tracking-tight mb-3">No Bundlers Needed</h3>
            <p className="text-[#64748b] text-[0.95rem] leading-relaxed">
              A truly native experience that doesn't rely on ERC-4337 infrastructure, paymasters, or external bundler networks. Less complexity, higher reliability.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
