import { useState, useEffect, useCallback } from 'react';
import { BASE_SEPOLIA_CHAIN_ID, BASE_SEPOLIA_CHAIN_HEX } from '../lib/constants';

/**
 * Manages wallet connection state, chain detection, and auto-reconnect.
 * Persists connection across page refreshes via eth_accounts.
 */
export function useWallet() {
  const [account,  setAccount]  = useState('');
  const [chainId,  setChainId]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const isConnected  = !!account;
  const isRightChain = chainId === BASE_SEPOLIA_CHAIN_ID;
  const hasProvider  = typeof window !== 'undefined' && !!window.ethereum;

  // ── Listeners ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasProvider) return;

    const onChainChanged  = (hex)    => setChainId(parseInt(hex, 16));
    const onAccountsChanged = ([acct]) => { setAccount(acct ?? ''); };

    window.ethereum.on('chainChanged',    onChainChanged);
    window.ethereum.on('accountsChanged', onAccountsChanged);

    // Auto-reconnect on mount
    Promise.all([
      window.ethereum.request({ method: 'eth_chainId' }),
      window.ethereum.request({ method: 'eth_accounts' }),
    ]).then(([hex, accounts]) => {
      setChainId(parseInt(hex, 16));
      if (accounts[0]) setAccount(accounts[0]);
    }).catch(() => {});

    return () => {
      window.ethereum.removeListener('chainChanged',    onChainChanged);
      window.ethereum.removeListener('accountsChanged', onAccountsChanged);
    };
  }, [hasProvider]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    if (!hasProvider) {
      setError('no_provider');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [acct] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const hex    = await window.ethereum.request({ method: 'eth_chainId' });
      setAccount(acct);
      setChainId(parseInt(hex, 16));
    } catch (e) {
      if (e.code !== 4001) setError('Connection failed.');
      // 4001 = user rejected — silent
    } finally {
      setLoading(false);
    }
  }, [hasProvider]);

  const switchToBaseSepolia = useCallback(async () => {
    if (!hasProvider) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_CHAIN_HEX }],
      });
    } catch (e) {
      if (e.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId:         BASE_SEPOLIA_CHAIN_HEX,
            chainName:       'Base Sepolia Testnet',
            nativeCurrency:  { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls:         ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org'],
          }],
        });
      }
    }
  }, [hasProvider]);

  return {
    account,
    chainId,
    isConnected,
    isRightChain,
    hasProvider,
    loading,
    error,
    connect,
    switchToBaseSepolia,
  };
}
