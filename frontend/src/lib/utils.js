export const shortenAddress = (address, chars = 4) => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
};

export const shortenHash = (hash, chars = 6) => {
  if (!hash) return '';
  return `${hash.slice(0, chars + 2)}…${hash.slice(-chars)}`;
};

export const basescanTx = (hash) =>
  `https://sepolia.basescan.org/tx/${hash}`;

export const basescanAddress = (address) =>
  `https://sepolia.basescan.org/address/${address}`;
