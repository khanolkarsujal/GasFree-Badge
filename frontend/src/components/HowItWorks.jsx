import { ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Connect Wallet',
      desc: 'Link your wallet to the dApp. Any EVM-compatible wallet works — MetaMask, Coinbase Wallet, WalletConnect, and more.',
    },
    {
      num: '02',
      title: 'Claim Badge',
      desc: 'Click claim. The transaction is submitted and gas fees are automatically sponsored via TYI Mock USD — you pay nothing.',
    },
    {
      num: '03',
      title: 'Verify On-Chain',
      desc: 'Your NFT badge is minted on Base Sepolia. View it on BaseScan, share it, or use it as proof of participation.',
    }
  ];

  return (
    <section className="py-24 max-w-[1000px] mx-auto text-center border-t border-white/5">
      <span className="text-[10px] text-indigo-400 font-bold tracking-[0.15em] uppercase mb-4 block">
        How it works
      </span>
      <h2 className="text-[2.2rem] sm:text-[2.75rem] font-bold tracking-tight text-white mb-20">
        Three steps to your gasless badge
      </h2>

      <div className="flex flex-col md:flex-row items-start justify-between gap-12 md:gap-4 text-left relative">
        {steps.map((step, i) => (
          <div key={i} className="flex-1 relative">
            <div className="text-[4rem] sm:text-[5rem] font-bold text-[#1e293b]/50 leading-none mb-4 -ml-1">
              {step.num}
            </div>
            <h3 className="text-[1.1rem] font-bold text-white mb-3">
              {step.title}
            </h3>
            <p className="text-[0.95rem] text-[#64748b] leading-relaxed max-w-[280px]">
              {step.desc}
            </p>
            
            {/* Arrow separator */}
            {i !== steps.length - 1 && (
              <div className="hidden md:block absolute top-[20%] right-[-20px] lg:right-[-10px] text-[#334155]">
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
