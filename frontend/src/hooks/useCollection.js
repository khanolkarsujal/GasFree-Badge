import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { getCollectionStats, getTYIBalance, getClaimedBadges } from '../services/ugfService';

/**
 * Manages on-chain collection data — supply stats, TYI balance, claimed badges.
 * Exposes a single `refresh(account?)` function for consistent re-fetching.
 */
export function useCollection(account) {
  const [stats,      setStats]      = useState({ minted: 0, remaining: 10_000, total: 10_000 });
  const [tyiBalance, setTYIBalance] = useState(null);
  const [claimed,    setClaimed]    = useState([]);

  const refresh = useCallback(async (overrideAccount) => {
    if (!window.ethereum) return;

    const addr     = overrideAccount ?? account;
    const provider = new ethers.BrowserProvider(window.ethereum);

    const [s, tyi, cl] = await Promise.all([
      getCollectionStats(provider),
      addr ? getTYIBalance(provider, addr)    : Promise.resolve(null),
      addr ? getClaimedBadges(provider, addr) : Promise.resolve([]),
    ]);

    setStats(s);
    setTYIBalance(tyi);
    setClaimed(cl);
  }, [account]);

  return {
    stats,
    tyiBalance,
    claimed,
    hasClaimed:   claimed.length > 0,
    hasNoTYI:     tyiBalance !== null && tyiBalance <= 0,
    refresh,
  };
}
