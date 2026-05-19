import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { useCollection } from '@/hooks/useCollection';
import { executeGaslessClaim } from '@/services/ugfService';
import { BADGES } from '@/lib/constants';
import { CONTRACT_ADDRESS } from '@/contractConfig';

import {
  Header,
  Footer,
  HeroSection,
  BadgeCard,
  ClaimModal,
  MyCollection,
  HowItWorks,
  WalletStateBanners,
  Features,
  CallToAction,
} from '@/components';

const isDeployed = CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

export default function App() {
  const wallet = useWallet();
  const collection = useCollection(wallet.account);

  const [selectedBadge, setSelectedBadge] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [txHash, setTxHash] = useState('');
  const [claimError, setClaimError] = useState('');

  const isClaiming = activeStep > 0 && !txHash && !claimError;
  const isWalletReady = wallet.account && wallet.isRightChain;

  useEffect(() => {
    collection.refresh(wallet.account);
    const id = setInterval(() => collection.refresh(wallet.account), 30_000);
    return () => clearInterval(id);
  }, [wallet.account]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClaim = async (badge) => {
    if (!isWalletReady || isClaiming) return;

    setSelectedBadge(badge);
    setClaimError('');
    setTxHash('');
    setActiveStep(1);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const hash = await executeGaslessClaim(signer, setActiveStep);
      setTxHash(hash);
      setActiveStep(5);
      await collection.refresh();
    } catch (err) {
      const msg = err?.message ?? String(err);
      const mapped =
        msg === 'NO_MOCK_USD' ? 'NO_MOCK_USD'
          : msg === 'MAX_SUPPLY' ? 'All badges have been claimed.'
            : msg === 'PAUSED' ? 'Claiming is paused.'
              : msg.includes('user rejected') ? 'Signature cancelled.'
                : msg.length > 120 ? `${msg.slice(0, 120)}…`
                  : msg;

      setClaimError(mapped);
      setActiveStep(0);
    }
  };

  const handleModalClose = () => {
    if (isClaiming) return;
    setSelectedBadge(null);
    setActiveStep(0);
    setTxHash('');
    setClaimError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05070c] text-slate-100 relative selection:bg-indigo-500/30 selection:text-indigo-100 overflow-x-hidden">
      {/* Ambient focal glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[1000px] max-h-[1000px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 60%)', filter: 'blur(120px)' }} />
        <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 65%)', filter: 'blur(120px)' }} />
      </div>

      <Header
        account={wallet.account}
        isRightChain={wallet.isRightChain}
        tyiBalance={collection.tyiBalance}
        onConnect={wallet.connect}
      />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 relative z-10 w-full max-w-[1000px] mx-auto px-6 pt-12 pb-24"
      >
        <HeroSection stats={collection.stats} onConnect={wallet.connect} />

        <AnimatePresence>
          <WalletStateBanners wallet={wallet} collection={collection} />
        </AnimatePresence>

        {/* ── Badge catalog ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
          aria-labelledby="catalog-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 id="catalog-heading" className="text-[1.5rem] sm:text-[2rem] font-sans font-bold tracking-tight text-white mb-1">
                Available Badges
              </h2>
              <p className="text-[1rem] text-[#94a3b8] leading-relaxed">
                Verifiable on-chain credentials. Gas is completely sponsored.
              </p>
            </div>

            {/* Inline progress strip */}
            <div className="flex items-center">
              <div className="flex items-center gap-[6px]">
                {[0, 1, 2].map((i) => {
                  const isClaimed = collection.claimed.length > i;
                  return (
                    <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {isClaimed ? (
                        <>
                          <circle cx="8" cy="8" r="7.5" fill="#6366f1" stroke="#6366f1" />
                          <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      ) : (
                        <circle cx="8" cy="8" r="7.5" stroke="#334155" strokeWidth="1" fill="transparent" />
                      )}
                    </svg>
                  );
                })}
              </div>
              <span className="text-[12px] text-gray-500 ml-[8px]">
                {collection.claimed.length} of {BADGES.length} badges collected
              </span>
            </div>
          </div>

          {!isDeployed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 flex items-start gap-4 px-5 py-4 rounded-xl bg-amber-950/20 border border-amber-500/20 shadow-lg"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
              </div>
              <div className="pt-0.5">
                <p className="text-sm font-semibold text-amber-50 tracking-tight">Contract Missing</p>
                <p className="text-xs text-amber-500/80 mt-1.5 leading-relaxed">
                  The smart contract is not deployed yet. Please run <code className="font-mono bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-amber-400">npx hardhat run scripts/deploy.js</code>
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {BADGES.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isClaimed={isWalletReady ? collection.claimed.includes(badge.id) : false}
                isWalletReady={isWalletReady}
                disabled={(!isWalletReady && wallet.error === 'no_provider') || (isWalletReady && collection.hasNoTYI) || !isDeployed || isClaiming}
                onClaim={!isWalletReady ? wallet.connect : handleClaim}
              />
            ))}
          </div>
        </motion.section>

        {/* My Collection */}
        <AnimatePresence>
          {isWalletReady && collection.claimed.length > 0 && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-12"
              aria-labelledby="collection-heading"
            >
              <h2 id="collection-heading" className="text-sm font-medium tracking-widest uppercase text-gray-400 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                My Collection
              </h2>
              <MyCollection claimed={collection.claimed} />
            </motion.section>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-24"
        >
          <HowItWorks />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-24"
        >
          <Features />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <CallToAction
            onConnect={wallet.connect}
            isWalletReady={isWalletReady}
          />
        </motion.div>
      </motion.main>

      <Footer />

      <ClaimModal
        badge={selectedBadge}
        activeStep={activeStep}
        txHash={txHash}
        error={claimError}
        isOpen={!!selectedBadge}
        onClose={handleModalClose}
      />
    </div>
  );
}
