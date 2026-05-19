import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";

// ── Hooks & Services ───────────────────────────────────────────────────────
import { useWallet }    from "@/hooks/useWallet";
import { useCollection } from "@/hooks/useCollection";
import { executeGaslessClaim, executeGaslessTokenTransfer } from "@/services/ugfService";
import { BADGES }         from "@/lib/constants";
import { CONTRACT_ADDRESS } from "@/contractConfig";
import { basescanAddress }  from "@/lib/utils";

// ── New Premium Components ─────────────────────────────────────────────────
import Navbar           from "@/components/Navbar";
import Hero             from "@/components/Hero";
import ProblemSection   from "@/components/ProblemSection";
import SolutionSection  from "@/components/SolutionSection";
import TransactionFlow  from "@/components/TransactionFlow";
import Features         from "@/components/Features";
import DashboardPreview from "@/components/DashboardPreview";
import Rewards          from "@/components/Rewards";
import CTA              from "@/components/CTA";
import Footer           from "@/components/Footer";

// ── Preserved Functional Components ───────────────────────────────────────
import { ClaimModal }           from "@/components/badge/ClaimModal";
import { MyCollectionSection }  from "@/components/MyCollectionSection";
import { UGFPlaygroundsSection } from "@/components/UGFPlaygroundsSection";

// ─────────────────────────────────────────────────────────────────────────
export default function App() {
  const wallet     = useWallet();
  const collection = useCollection(wallet.account);

  // ── Claim Modal State ─────────────────────────────────────────────────
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [activeStep,    setActiveStep]    = useState(0);
  const [txHash,        setTxHash]        = useState("");
  const [claimError,    setClaimError]    = useState("");

  const isClaiming    = activeStep > 0 && !txHash && !claimError;
  const isWalletReady = wallet.account && wallet.isRightChain;

  // ── Playground Tab State ──────────────────────────────────────────────
  const [activeTrack,       setActiveTrack]       = useState("minting");
  const [donationAmount,    setDonationAmount]    = useState("10");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount,    setTransferAmount]    = useState("");

  // ── Simulation State ──────────────────────────────────────────────────
  const [simActive,  setSimActive]  = useState(false);
  const [simStep,    setSimStep]    = useState(0);
  const [simLogs,    setSimLogs]    = useState([]);
  const [simSuccess, setSimSuccess] = useState(false);
  const [simTxHash,  setSimTxHash]  = useState("");
  const [simError,   setSimError]   = useState("");

  const [paymentCompleted,    setPaymentCompleted]    = useState(false);
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(false);
  const [agentPreauthorized,  setAgentPreauthorized]  = useState(false);
  const [agentLogs,           setAgentLogs]           = useState([]);

  // ── Collection Polling ────────────────────────────────────────────────
  useEffect(() => {
    collection.refresh(wallet.account);
    const id = setInterval(() => collection.refresh(wallet.account), 30_000);
    return () => clearInterval(id);
  }, [wallet.account]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Agent Log Effect ──────────────────────────────────────────────────
  useEffect(() => {
    if (!agentPreauthorized) {
      setAgentLogs([]);
      return;
    }
    const initialLogs = [
      { time: new Date().toLocaleTimeString(), text: "[Agent] Autonomous yield routing agent initialized." },
      { time: new Date().toLocaleTimeString(), text: "[Agent] Pre-authorized daily gas quota: 50 TYI." },
    ];
    setAgentLogs(initialLogs);

    const actions = [
      "Analyzing liquidity pools in Base Sepolia...",
      "Sensed 0.4% price arbitrage on Uniswap vs Sushiswap...",
      "Executing gasless arbitrage trade... Sponsored 0 ETH gas!",
      "Harvested yield: +0.85 Mock USD. Trade completed.",
      "Scanning Aave lending market for stablecoin rate optimization...",
      "Rebalancing collateral from USDC to DAI gaslessly (UGF Session Active)...",
      "Yield reallocated. Portfolio value updated (+1.45 Mock USD).",
    ];

    let counter = 0;
    const interval = setInterval(() => {
      setAgentLogs((prev) =>
        [...prev, { time: new Date().toLocaleTimeString(), text: `[Agent] ${actions[counter % actions.length]}` }].slice(-8)
      );
      counter++;
    }, 5000);

    return () => clearInterval(interval);
  }, [agentPreauthorized]);

  // ── Simulation Runner ─────────────────────────────────────────────────
  const runSimulation = async (type, details) => {
    if (simActive) return;
    setSimActive(true);
    setSimStep(1);
    setSimSuccess(false);
    setSimTxHash("");
    setSimError("");

    const logs = [];
    const addLog = (msg) => {
      logs.push({ time: new Date().toLocaleTimeString(), text: msg });
      setSimLogs([...logs]);
    };

    // ── Real On-Chain Path ──────────────────────────────────────────────
    if (wallet.account && wallet.isRightChain) {
      addLog(`[UGF Client] Initializing REAL on-chain transaction for ${type} (${details})...`);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer   = await provider.getSigner();

        let recipientAddress = CONTRACT_ADDRESS;
        let transferVal      = "1";

        if (type === "Donation") {
          recipientAddress = CONTRACT_ADDRESS;
          transferVal      = donationAmount || "10";
        } else if (type === "Checkout") {
          recipientAddress = CONTRACT_ADDRESS;
          transferVal      = "15";
        } else if (type === "Transfer") {
          if (!transferRecipient || !transferAmount)
            throw new Error("Recipient address and amount must be provided.");
          recipientAddress = transferRecipient;
          transferVal      = transferAmount;
        } else if (type === "Reward Claim") {
          recipientAddress = wallet.account;
          transferVal      = "1";
        } else if (type === "Agent Pre-Authorization") {
          recipientAddress = wallet.account;
          transferVal      = "0.01";
        }

        addLog(`[Step 1/4: Auth] Requesting EIP-191 signature for wallet session login...`);

        const realTxHash = await executeGaslessTokenTransfer(
          signer,
          recipientAddress,
          transferVal,
          (step) => {
            setSimStep(step);
            if (step === 1) {
              addLog(`[Step 1/4: Auth] Requesting EIP-191 signature...`);
            } else if (step === 2) {
              addLog(`[Step 1/4: Auth] Authentication successful! JWT Session established.`);
              addLog(`[Step 2/4: Quote] Encoding transfer payload on TYI token contract...`);
              addLog(`[Step 2/4: Quote] Retrieving gas quote from UGF testnet oracle...`);
            } else if (step === 3) {
              addLog(`[Step 2/4: Quote] Gas Quoted! Sponsorship covers 100% of native network fee.`);
              addLog(`[Step 3/4: Settle] Requesting ERC-3009 transfer signature for settlement...`);
            } else if (step === 4) {
              addLog(`[Step 3/4: Settle] Settlement signature verified! Zero native ETH required.`);
              addLog(`[Step 4/4: Execute] Submitting transaction to Base Sepolia node...`);
            }
          }
        );

        setSimTxHash(realTxHash);
        addLog(`[Step 4/4: Execute] Real transaction successfully mined on-chain!`);
        addLog(`[Tx Hash] ${realTxHash}`);
        setSimSuccess(true);
        setSimStep(5);
        setSimActive(false);

        if (type === "Checkout") setPaymentCompleted(true);
        collection.refresh(wallet.account);
      } catch (err) {
        const errMsg  = err?.message ?? String(err);
        const shortMsg = errMsg.length > 80 ? errMsg.slice(0, 80) + "..." : errMsg;
        addLog(`[UGF Error] Transaction failed: ${shortMsg}`);
        setSimError(errMsg === "NO_MOCK_USD" || errMsg.includes("NO_MOCK_USD") ? "NO_MOCK_USD" : shortMsg);
        setSimActive(false);
        setSimStep(0);
      }
      return;
    }

    // ── Simulated Fallback Path ─────────────────────────────────────────
    addLog(`[UGF Client] Initializing gasless session for ${type} (${details})...`);
    await new Promise((r) => setTimeout(r, 600));

    setSimStep(1);
    addLog(`[Step 1/4: Auth] Requesting EIP-191 signature for wallet session login...`);
    await new Promise((r) => setTimeout(r, 800));
    addLog(`[Step 1/4: Auth] Signature received from provider. Exchanging for UGF JWT...`);
    await new Promise((r) => setTimeout(r, 600));
    addLog(`[Step 1/4: Auth] Authentication successful! Session valid for 60 minutes.`);

    await new Promise((r) => setTimeout(r, 400));
    setSimStep(2);
    addLog(`[Step 2/4: Quote] Encoding EVM calldata for transaction payload...`);
    await new Promise((r) => setTimeout(r, 600));
    addLog(`[Step 2/4: Quote] Requested quote from UGF testnet oracle.`);
    addLog(`[Step 2/4: Quote] Gas Quoted: 0.18 TYI_MOCK_USD (100% sponsored gas).`);

    await new Promise((r) => setTimeout(r, 400));
    setSimStep(3);
    addLog(`[Step 3/4: Settle] Requesting ERC-3009 transfer signature for 0.18 TYI.`);
    await new Promise((r) => setTimeout(r, 800));
    addLog(`[Step 3/4: Settle] Settlement authorization received. Sponsoring 0 ETH gas fee...`);

    await new Promise((r) => setTimeout(r, 400));
    setSimStep(4);
    addLog(`[Step 4/4: Execute] Submitting transaction to Base Sepolia EVM node...`);
    await new Promise((r) => setTimeout(r, 800));
    const randomHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setSimTxHash(randomHash);
    addLog(`[Step 4/4: Execute] Transaction successfully mined on-chain!`);
    addLog(`[Tx Hash] ${randomHash}`);
    setSimSuccess(true);
    setSimStep(5);
    setSimActive(false);

    if (type === "Checkout") setPaymentCompleted(true);
  };

  // ── Badge Claim Handler ───────────────────────────────────────────────
  const handleClaim = async (badge) => {
    if (!isWalletReady || isClaiming) return;
    setSelectedBadge(badge);
    setClaimError("");
    setTxHash("");
    setActiveStep(1);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer   = await provider.getSigner();
      const hash     = await executeGaslessClaim(signer, setActiveStep);
      setTxHash(hash);
      setActiveStep(5);
      await collection.refresh();
    } catch (err) {
      const msg    = err?.message ?? String(err);
      const mapped =
        msg === "NO_MOCK_USD"           ? "NO_MOCK_USD"
        : msg === "MAX_SUPPLY"          ? "All badges have been claimed."
        : msg === "PAUSED"              ? "Claiming is paused."
        : msg.includes("user rejected") ? "Signature cancelled."
        : msg.length > 120              ? `${msg.slice(0, 120)}...`
        : msg;

      setClaimError(mapped);
      setActiveStep(0);
    }
  };

  const handleModalClose = () => {
    if (isClaiming) return;
    setSelectedBadge(null);
    setActiveStep(0);
    setTxHash("");
    setClaimError("");
  };

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#05031F] text-white overflow-x-hidden">

      {/* ── Sticky Navbar ─────────────────────────────────────────────── */}
      <Navbar wallet={wallet} collection={collection} />

      <main>
        {/* ── 1. Hero ──────────────────────────────────────────────────── */}
        <Hero wallet={wallet} onConnect={wallet.connect} />

        {/* ── 2. Problem Section ───────────────────────────────────────── */}
        <ProblemSection />

        {/* ── 3. Solution Section ──────────────────────────────────────── */}
        <SolutionSection />

        {/* ── 4. Transaction Flow Visualization ───────────────────────── */}
        <TransactionFlow />

        {/* ── 5. Features Grid ─────────────────────────────────────────── */}
        <Features />

        {/* ── 6. Dashboard Preview ─────────────────────────────────────── */}
        <DashboardPreview wallet={wallet} collection={collection} />

        {/* ── 7. NFT Rewards Preview ───────────────────────────────────── */}
        <Rewards />

        {/* ── 8. Live Playground (functional app) ─────────────────────── */}
        <section className="border-t border-white/[0.05]">
          {/* User's collected badges (shows when wallet connected) */}
          {isWalletReady && collection.claimed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MyCollectionSection claimed={collection.claimed} badges={BADGES} />
            </motion.div>
          )}

          {/* Interactive UGF Playground */}
          <UGFPlaygroundsSection
            badges={BADGES}
            claimed={collection.claimed}
            isWalletReady={isWalletReady}
            onClaim={handleClaim}
            wallet={wallet}
            isClaiming={isClaiming}
            activeTrack={activeTrack}
            setActiveTrack={setActiveTrack}
            donationAmount={donationAmount}
            setDonationAmount={setDonationAmount}
            transferRecipient={transferRecipient}
            setTransferRecipient={setTransferRecipient}
            transferAmount={transferAmount}
            setTransferAmount={setTransferAmount}
            simActive={simActive}
            simStep={simStep}
            simLogs={simLogs}
            simSuccess={simSuccess}
            simTxHash={simTxHash}
            simError={simError}
            setSimError={setSimError}
            runSimulation={runSimulation}
            paymentCompleted={paymentCompleted}
            setPaymentCompleted={setPaymentCompleted}
            subscriptionEnabled={subscriptionEnabled}
            setSubscriptionEnabled={setSubscriptionEnabled}
            agentPreauthorized={agentPreauthorized}
            setAgentPreauthorized={setAgentPreauthorized}
            agentLogs={agentLogs}
          />
        </section>

        {/* ── 9. CTA Section ───────────────────────────────────────────── */}
        <CTA wallet={wallet} onConnect={wallet.connect} />
      </main>

      {/* ── 10. Footer ────────────────────────────────────────────────── */}
      <Footer />

      {/* ── Claim Modal (functional) ─────────────────────────────────── */}
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
