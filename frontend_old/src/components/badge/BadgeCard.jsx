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
            onClick={onClaim}
            className="w-full sm:w-auto px-4 py-2 rounded-[10px] bg-white hover:bg-gray-200 text-black text-[0.8rem] font-bold whitespace-nowrap transition-all shadow-sm"
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
        className="w-full sm:w-auto px-4 py-2 rounded-[10px] bg-[#2A2B3D] hover:bg-[#3f415c] text-white text-[0.8rem] font-bold border border-white/5 cursor-pointer whitespace-nowrap transition-all disabled:opacity-35 disabled:cursor-not-allowed"
      >
        {labelOverride || 'Claim free'}
      </button>
    );
  };

  if (isEpic) {
    return (
      <article
        className={[
          'group relative flex flex-row items-stretch rounded-xl border overflow-hidden min-h-[220px] md:col-span-2',
          'transition-[border-color,transform,box-shadow] duration-300',
          isClaimed
            ? 'bg-[#0a1a0f]/40 backdrop-blur-xl border-[#10b981]/[0.2] shadow-lg'
            : 'bg-[#0b0c10]/50 backdrop-blur-xl border-white/10 hover:border-white/20 hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)] shadow-xl',
        ].join(' ')}
        aria-label={`${badge.name} Badge${isClaimed ? ' — collected' : ''}`}
      >
        {/* Animated glow border inside */}
        {!isClaimed && (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" aria-hidden />
        )}

        {/* Distinct Illustration Left Side */}
        <div className="w-[200px] shrink-0 flex items-center justify-center bg-black/40 rounded-l-xl relative overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="w-[112px] h-[112px] rounded-full bg-white/[0.07] flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-500">
            <div className="w-[80px] h-[80px] flex items-center justify-center text-[4rem]">
              {badge.icon}
            </div>
          </div>
        </div>

        {/* Content Right Side */}
        <div className="flex-1 min-w-0 px-[28px] py-[24px] flex flex-col justify-center gap-[10px] z-10">
          <div>
            <span
              className="inline-block text-[10px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.2)] mb-1"
              style={{
                background: `linear-gradient(135deg, ${badge.colors[0]}, ${badge.colors[1]})`,
                color: '#fff',
              }}
            >
              {badge.rarity}
            </span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            {badge.name} Badge
          </h3>
          <p className="text-[14px] text-gray-400 leading-relaxed mb-2">
            {badge.desc}
          </p>

          <div className="w-fit mt-1">
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
          ? 'bg-[#0a1a0f]/40 backdrop-blur-xl border-[#10b981]/[0.16] shadow-lg'
          : 'bg-[#0b0c10]/50 backdrop-blur-xl border-white/10 hover:-translate-y-px shadow-lg',
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
