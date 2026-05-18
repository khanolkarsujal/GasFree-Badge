import { useState } from 'react'
import { ethers } from 'ethers'
import { executeGaslessClaim } from './ugfService' // Teammate 3's logic
// import './App.css' // Import CSS if it exists

function App() {
  const [account, setAccount] = useState("")
  const [isMinting, setIsMinting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [txHash, setTxHash] = useState("")

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
      } catch (err) {
        console.error("Failed to connect wallet", err)
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet!")
    }
  }

  const claimBadge = async () => {
    if (!account) return
    setIsMinting(true)
    setSuccess(false)
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Teammate 2 (UI): We just call Teammate 3's function here!
      const hash = await executeGaslessClaim(signer)
      
      setTxHash(hash)
      setSuccess(true)
    } catch (err) {
      console.error("Minting failed", err)
      alert("Minting failed. Check console for details.")
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="container">
      <h1>NFT Badge Claim</h1>
      
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <button 
            onClick={claimBadge} 
            disabled={isMinting}
          >
            {isMinting ? "Claiming..." : "Claim Badge (Gasless via UGF)"}
          </button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <p>Successfully claimed badge!</p>
          <p>
            <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer">
              View on BaseScan
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export default App
