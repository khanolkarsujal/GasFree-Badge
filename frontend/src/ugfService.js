// Teammate 3 (UGF Integration) handles this file exclusively
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contractConfig';
import { UGFClient } from '@tychilabs/ugf-testnet-js';

/**
 * Handles the UGF gasless transaction logic.
 * @param {ethers.Signer} signer - The connected wallet signer
 * @returns {Promise<string>} The transaction hash on success
 */
export const executeGaslessClaim = async (signer) => {
  // Initialize the UGF client for Testnet (Base Sepolia only)
  const client = new UGFClient();

  // 1. Authenticate — prove wallet ownership to UGF
  console.log("Authenticating with UGF...");
  await client.auth.login(signer);

  // 2. Prepare transaction payload data
  const iface = new ethers.Interface(CONTRACT_ABI);
  const data = iface.encodeFunctionData("claimBadge");
  const payerAddress = await signer.getAddress();

  // 3. Quote — describe the destination action, get settlement amount + digest
  console.log("Requesting UGF gas quote...");
  const quote = await client.quote.get({
    payer_address: payerAddress,
    tx_object: JSON.stringify({
      from: payerAddress,
      to: CONTRACT_ADDRESS,
      data: data,
      value: "0",
    }),
  });

  // 4. Settle — authorize TYI mock USD transfer via ERC-3009 signature (no on-chain tx/gas from user)
  console.log("Settling with TYI mock USD signature...");
  await client.payment.x402.execute({ quote, signer });

  // 5. Execute — UGF sponsors ETH at destination, completes the call to BadgeNFT.sol
  console.log("Executing transaction sponsored by UGF...");
  const { userTxHash } = await client.chains.evm.sponsorAndExecute(
    quote.digest,
    signer,
    async () => ({
      to: CONTRACT_ADDRESS,
      data: data,
      value: 0n,
    })
  );

  return userTxHash;
};
