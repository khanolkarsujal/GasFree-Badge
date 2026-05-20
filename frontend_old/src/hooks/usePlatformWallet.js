import { useCallback, useEffect, useState } from 'react';
import { platformApi } from '@/api/platformClient';

export function usePlatformWallet(isAuthenticated, refreshKey = 0) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setDashboard(null);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await platformApi.dashboard();
      setDashboard(data);
    } catch (e) {
      setError(e.message);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  const sendMoney = useCallback(async (destination, amount, description) => {
    const result = await platformApi.transfer(destination, amount, description, `send-${Date.now()}`);
    await refresh();
    return result;
  }, [refresh]);

  const topup = useCallback(async (amount, topupSecret) => {
    await platformApi.topup(amount, topupSecret);
    await refresh();
  }, [refresh]);

  return {
    dashboard,
    platformBalance: dashboard?.balances?.platform_available ?? null,
    onChainTyi: dashboard?.balances?.on_chain_tyi ?? null,
    recentActivity: dashboard?.recent_activity ?? [],
    loading,
    error,
    refresh,
    sendMoney,
    topup,
  };
}
