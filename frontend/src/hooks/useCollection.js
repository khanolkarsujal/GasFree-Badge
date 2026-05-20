import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { getCollectionStats, getClaimedBadges } from '../services/ugfService';

// Cache provider to avoid recreation
let cachedProvider = null;

function getProvider() {
  if (!cachedProvider) {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        cachedProvider = new ethers.BrowserProvider(window.ethereum);
      } else {
        cachedProvider = new ethers.JsonRpcProvider('https://sepolia.base.org');
      }
    } catch (e) {
      console.error("Failed to create provider:", e);
      return null;
    }
  }
  return cachedProvider;
}

/**
 * Manages on-chain collection data — supply stats, TYI balance, claimed badges.
 * Exposes a single `refresh(account?)` function for consistent re-fetching.
 */
export function useCollection(account) {
  const [stats,      setStats]      = useState({ minted: 0, remaining: 10_000, total: 10_000 });
  const [tyiBalance, setTYIBalance] = useState(null);
  const [claimed,    setClaimed]    = useState([]);

  const refresh = useCallback(async (overrideAccount) => {
    const provider = getProvider();
    if (!provider) return;

    const addr = overrideAccount ?? account;

    try {
      const [s, clChain] = await Promise.all([
        getCollectionStats(provider),
        addr ? getClaimedBadges(provider, addr) : Promise.resolve([]),
      ]);

      setStats(s);
      setClaimed(clChain);
      setTYIBalance(null); // TYI balance check removed as platform integration was removed
    } catch (err) {
      console.error("Error refreshing collection data:", err);
    }
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
