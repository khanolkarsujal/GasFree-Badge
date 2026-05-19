// The icon background uses a diluted version of the badge gradient
// rather than a solid fill — feels more refined at small sizes.
function BadgeIcon({ icon, colors }) {
  return (
    <div
      className="w-[42px] h-[42px] rounded-[9px] flex-shrink-0 flex items-center justify-center text-[1.3rem] relative z-10"
      style={{
        background: `linear-gradient(135deg, ${colors[0]}1a, ${colors[1]}1a)`,
        border: `1px solid ${colors[0]}30`,
        boxShadow: `0 2px 8px ${colors[0]}18`,
      }}
      aria-hidden
    >
      {icon}
    </div>
  );
}

export function BadgeCard({ badge, isClaimed, disabled, onClaim, labelOverride, isWalletReady = true }) {
  const isEpic = badge.rarity === 'Epic';
  const isRare = badge.rarity === 'Rare';

  const renderCTA = () => {
    if (isClaimed) {
      return (
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#10b981] text-[0.85rem] font-bold whitespace-nowrap bg-emerald-500/10 px-5 py-2.5 rounded-[8px] border border-emerald-500/20">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
            <circle cx="6" cy="6" r="5.5" stroke="#10b981" strokeOpacity="0.5" />
            <path d="M3.5 6l2 2 3-3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Collected
        </div>
      );
    }
    
    if (!isWalletReady) {
      return (
        <button
          type="button"
          onClick={onClaim} // This triggers connect wallet now based on App.jsx
          className="w-full sm:w-auto px-5 py-2 rounded-[8px] border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500/10 text-[0.85rem] font-bold whitespace-nowrap transition-colors"
        >
          Connect to Claim
        </button>
      );
    }

    return (
      <button
        type="button"
        id={`btn-claim-${badge.id}`}
        onClick={() => onClaim(badge)}
        disabled={disabled}
        aria-label={`Claim ${badge.name} badge`}
        className="w-full sm:w-auto px-6 py-2.5 rounded-[8px] text-white text-[0.85rem] font-bold border-none cursor-pointer whitespace-nowrap transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:pointer-events-none shadow-[0_4px_14px_rgba(245,158,11,0.3)]"
        style={{ background: `linear-gradient(135deg, ${badge.colors[0]}, ${badge.colors[1]})` }}
      >
        {labelOverride || 'Claim free'}
      </button>
    );
  };

  if (isEpic) {
    return (
      <article
        className={[
          'group relative flex flex-col sm:flex-row items-center gap-0 rounded-[14px] border overflow-hidden min-h-[160px]',
          'transition-[border-color,transform,box-shadow] duration-300',
          isClaimed
            ? 'bg-[#0a1a0f] border-[#10b981]/[0.2]'
            : 'bg-[#0a0a0a] border-amber-500/20 hover:border-amber-500/40 hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]',
        ].join(' ')}
        aria-label={`${badge.name} Badge${isClaimed ? ' — collected' : ''}`}
      >
        {/* Animated glow border inside */}
        {!isClaimed && (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" aria-hidden />
        )}

        {/* Distinct Illustration Left Side */}
        <div className="relative w-full sm:w-[220px] h-[140px] sm:h-auto sm:self-stretch flex items-center justify-center bg-gradient-to-br from-[#050505] to-[#111111] border-b sm:border-b-0 sm:border-r border-white/5 p-6 overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-rose-500/10 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="relative w-[84px] h-[84px] rounded-full flex items-center justify-center text-[2.5rem] bg-[#0a0a0a] border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.2)] z-10 group-hover:scale-110 transition-transform duration-500">
            {badge.icon}
          </div>
        </div>

        {/* Content Right Side */}
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-6 w-full p-6 sm:px-8 sm:py-8 z-10">
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
              <h3 className="text-[1.2rem] font-bold tracking-tight text-[#f1f5f9]">
                {badge.name} Badge
              </h3>
              <span
                className="flex-shrink-0 text-[9px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                style={{
                  background: `linear-gradient(135deg, ${badge.colors[0]}, ${badge.colors[1]})`,
                  color: '#fff',
                }}
              >
                {badge.rarity}
              </span>
            </div>
            <p className="text-[13px] text-gray-400 leading-relaxed max-w-lg">
              {badge.desc}
            </p>
          </div>

          <div className="flex-shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
            {renderCTA()}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={[
        'group relative flex items-center gap-0 rounded-[10px] border overflow-hidden',
        'transition-[border-color,transform,box-shadow] duration-150',
        isClaimed
          ? 'bg-[#0a1a0f] border-[#10b981]/[0.16]'
          : 'bg-[#0e1520] border-white/[0.06] hover:-translate-y-px',
        isRare && !isClaimed ? 'hover:border-white/[0.15]' : 'hover:border-white/[0.11]',
      ].join(' ')}
      aria-label={`${badge.name} Badge${isClaimed ? ' — collected' : ''}`}
    >
      {/* Rare Shimmer Border */}
      {isRare && !isClaimed && (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[10px]">
          <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        </div>
      )}

      {/* Left accent — gradient bar, 3px */}
      <div
        className="w-[3px] self-stretch flex-shrink-0 relative z-10"
        style={{ background: `linear-gradient(180deg, ${badge.colors[0]}, ${badge.colors[1]})` }}
        aria-hidden
      />

      <div className="flex items-center gap-3.5 flex-1 min-w-0 px-4 py-3.5 relative z-10">
        <BadgeIcon icon={badge.icon} colors={badge.colors} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[0.86rem] font-semibold tracking-[-0.015em] text-[#cbd5e1] truncate">
              {badge.name} Badge
            </h3>
            <span
              className="flex-shrink-0 text-[9px] font-bold uppercase tracking-[0.07em] px-1.5 py-0.5 rounded-full"
              style={{
                background: `${badge.colors[1]}14`,
                border: `1px solid ${badge.colors[1]}25`,
                color: badge.colors[1],
              }}
            >
              {badge.rarity}
            </span>
          </div>
          <p className="text-[13px] text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
            {badge.desc}
          </p>
        </div>
      </div>

      {/* CTA — right column, separated */}
      <div className="flex-shrink-0 self-stretch flex items-center px-4 border-l border-white/[0.045] relative z-10">
        {renderCTA()}
      </div>
    </article>
  );
}
