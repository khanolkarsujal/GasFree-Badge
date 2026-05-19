import { basescanTx, shortenHash } from '../../lib/utils';
import { motion } from 'framer-motion';
import { ExternalLink, Award } from 'lucide-react';

export function MyCollection({ claimed }) {
  if (claimed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-[#0b0c10] border border-dashed border-white/10"
        aria-label="No badges claimed yet">
        <Award className="w-8 h-8 text-slate-600 mb-3" />
        <p className="text-sm font-medium text-slate-400">No badges claimed yet</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.ul 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col list-none rounded-2xl border border-white/10 overflow-hidden bg-[#0b0c10]/50 backdrop-blur-xl shadow-xl"
      aria-label="Your claimed badges"
    >
      {claimed.map((badgeItem, i) => (
        <motion.li variants={item} key={badgeItem.tokenId} className="border-b border-white/5 last:border-b-0">
          <a
            href={basescanTx(badgeItem.txHash)}
            target="_blank" rel="noreferrer"
            className="flex items-center gap-5 px-6 py-4 hover:bg-slate-800/50 transition-colors no-underline text-inherit group relative overflow-hidden"
            aria-label={`GasFreeBadge #${badgeItem.tokenId}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Index */}
            <span className="text-xs text-slate-500 font-bold w-6 text-right flex-shrink-0 relative z-10">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Badge icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-lg flex-shrink-0 shadow-lg relative z-10 border border-white/10">
              🏅
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex items-center justify-between gap-4 relative z-10">
              <div>
                <span className="text-[0.95rem] font-bold text-slate-100 tracking-tight flex items-center gap-2">
                  GasFreeBadge 
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    #{badgeItem.tokenId}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="mono text-[0.75rem] text-slate-500 group-hover:text-indigo-300 transition-colors bg-slate-900/50 px-2 py-1 rounded border border-white/5">
                  {shortenHash(badgeItem.txHash, 6)}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}
