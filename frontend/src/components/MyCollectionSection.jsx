import React from "react";
import { Check } from "lucide-react";

export function MyCollectionSection({ claimed, badges }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="rounded-3xl border border-[#6D18FF]/20 p-6 bg-[#05031F]/50 backdrop-blur-md shadow-[0_0_30px_rgba(109,24,255,0.1)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D9B6FF]">Your collection</div>
        <h3 className="mt-2 font-heading text-xl font-bold text-white">Collected Badges</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {claimed.map((id) => {
            const badge = badges.find((b) => b.id === id);
            if (!badge) return null;
            return (
              <span key={id} className="inline-flex items-center gap-2 rounded-full border border-[#6D18FF]/40 bg-[#6D18FF]/10 px-4 py-2 text-xs font-semibold text-[#D9B6FF] shadow-sm">
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
                <Check className="h-3 w-3" />
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
