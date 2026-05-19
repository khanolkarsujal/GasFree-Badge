import { HOW_IT_WORKS } from '../lib/constants';

/**
 * Horizontal 4-step stepper showing the UGF gasless flow.
 * Cards are connected by animated dashed arrows.
 */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="border-t border-white/[0.055] pt-10">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-8">
        <h2 id="how-title" className="text-sm font-medium tracking-widest uppercase text-gray-400">
          How UGF makes this gasless
        </h2>
        <a
          href="https://universalgasframework.com"
          target="_blank" rel="noreferrer"
          className="text-[0.75rem] text-[#475569] hover:text-[#818cf8] transition-colors no-underline self-start sm:self-auto"
        >
          UGF documentation →
        </a>
      </div>

      <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-2 relative">
        {HOW_IT_WORKS.map(({ icon, step, desc }, i) => {
          // Hardcode Step 3 (index 2) as the green highlighted step per specs
          const isExecute = i === 2;
          const isLast = i === HOW_IT_WORKS.length - 1;

          return (
            <div key={step} className="flex-1 flex flex-col md:flex-row items-center relative group">
              {/* Card */}
              <div className="w-full flex flex-col items-center md:items-start text-center md:text-left bg-[#0A0A0A] border border-white/5 p-5 rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:border-white/10 z-10 relative">
                
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isExecute ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'bg-[#0e1520] text-slate-500 border-white/10'}`}>
                    {i + 1}
                  </div>
                  <span aria-hidden className="text-[1.2rem]">{icon}</span>
                </div>

                <h3 className={`font-semibold tracking-tight mb-2 ${isExecute ? 'text-green-400 text-base' : 'text-slate-200 text-[0.88rem]'}`}>
                  {step}
                </h3>
                
                <p className="text-[13px] text-gray-400 leading-6">
                  {desc}
                </p>
              </div>

              {/* Connecting Arrow (hidden on mobile, visible on desktop) */}
              {!isLast && (
                <div className="hidden md:flex flex-1 items-center justify-center min-w-[20px] mx-1 z-0 relative">
                  <svg width="100%" height="20" className="absolute top-1/2 -translate-y-1/2 left-0 overflow-visible">
                    <line x1="0" y1="10" x2="100%" y2="10" stroke="#475569" strokeWidth="1.5" className="animate-dash" strokeLinecap="round" />
                    <polygon points="0,-4 8,0 0,4" fill="#475569" style={{ transform: 'translate(calc(100% - 8px), 10px)' }} />
                  </svg>
                </div>
              )}
              
              {/* Mobile connecting arrow (vertical) */}
              {!isLast && (
                <div className="md:hidden h-8 flex justify-center items-center w-full my-1">
                  <svg width="20" height="100%">
                    <line x1="10" y1="0" x2="10" y2="100%" stroke="#475569" strokeWidth="1.5" className="animate-dash" strokeLinecap="round" />
                    <polygon points="-4,0 0,8 4,0" fill="#475569" style={{ transform: 'translate(10px, calc(100% - 8px))' }} />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
