import { useCallback, useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers';
import { platformApi, getStoredToken, setStoredToken } from '@/api/platformClient';

/**
 * SIWE login synced with connected wallet — powers platform balance & transfers.
 */
export function usePlatformAuth(walletAccount, isRightChain) {
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerId, setCustomerId] = useState(null);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setCustomerId(null);
  }, []);

  const login = useCallback(async () => {
    if (!walletAccount || !window.ethereum) {
      setError('Connect wallet first');
      return false;
    }
    setLoading(true);
    setError('');
    try {
      const { message } = await platformApi.authNonce(walletAccount);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      const session = await platformApi.authVerify(message, signature);
      setStoredToken(session.access_token);
      setToken(session.access_token);
      setCustomerId(session.customer_id);
      return true;
    } catch (e) {
      setError(e.message || 'Sign-in failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [walletAccount]);

  useEffect(() => {
    if (!walletAccount) {
      logout();
      return;
    }
    const stored = getStoredToken();
    if (stored && isRightChain) {
      setToken(stored);
      platformApi.dashboard().catch(() => logout());
    }
  }, [walletAccount, isRightChain, logout]);

  return {
    isAuthenticated: !!token,
    token,
    customerId,
    loading,
    error,
    login,
    logout,
  };
}
