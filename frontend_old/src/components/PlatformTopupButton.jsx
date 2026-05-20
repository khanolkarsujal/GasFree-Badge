import { useState } from 'react';
import { platformApi } from '@/api/platformClient';

/**
 * Dev/testnet top-up — requires VITE_TOPUP_SECRET matching platform TOPUP_SECRET.
 */
export function PlatformTopupButton({ onSuccess, className = '' }) {
  const [loading, setLoading] = useState(false);
  const secret = import.meta.env.VITE_TOPUP_SECRET;

  if (!secret) return null;

  const handleTopup = async () => {
    setLoading(true);
    try {
      await platformApi.topup('100', secret);
      onSuccess?.();
    } catch (e) {
      alert(e.message || 'Top-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTopup}
      disabled={loading}
      className={className || 'text-xs text-indigo-300 hover:text-indigo-200 underline'}
    >
      {loading ? 'Adding…' : '+ Add 100 TYI (test)'}
    </button>
  );
}
