import { ethers } from 'ethers';

// Isolated module-level state.
// This is not accessible to global window scope or React state inspection.
let sessionWallet = null;

export const sessionStore = {
  /**
   * Create a new ephemeral session keypair.
   * @param {ethers.Provider} provider Optional provider to connect the wallet.
   * @returns {string} The public address of the session wallet.
   */
  create(provider) {
    sessionWallet = ethers.Wallet.createRandom(provider);
    return sessionWallet.address;
  },

  /**
   * Get the session wallet's public address.
   * @returns {string|null} Public address or null if session is inactive.
   */
  getAddress() {
    return sessionWallet ? sessionWallet.address : null;
  },

  /**
   * Get an ethers.Wallet instance for signing transactions on-the-fly.
   * @param {ethers.Provider} provider Provider instance to connect to.
   * @returns {ethers.Wallet|null} Wallet instance or null if session is inactive.
   */
  getSigner(provider) {
    if (!sessionWallet) return null;
    return new ethers.Wallet(sessionWallet.privateKey, provider);
  },

  /**
   * Check if an active session exists.
   * @returns {boolean} True if active, false otherwise.
   */
  isActive() {
    return sessionWallet !== null;
  },

  /**
   * Purge the session keypair from memory.
   */
  clear() {
    sessionWallet = null;
  }
};
