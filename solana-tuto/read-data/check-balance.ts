// Get Balance
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

async function getBalance(publicKeyStr: string) {
  try {
    // Create a PublicKey object from the wallet address
    const publicKey = new PublicKey(publicKeyStr);

    // Connect to Solana mainnet
    const connection = new Connection(
      "https://api.mainnet-beta.solana.com",
      "confirmed"
    );

    // Get the balance in lamports (the smallest unit of SOL)
    const balanceInLamps = await connection.getBalance(publicKey);

    // Convert the balance to SOL
    const balanceInSOL = balanceInLamps / LAMPORTS_PER_SOL;

    // Output the balance
    console.log(
      `💰 Finished! The balance for the wallet at address ${publicKeyStr} is ${balanceInSOL} SOL.`
    );
  } catch (error) {
    // Handle errors, such as invalid wallet addresses
    console.error(
      `Error fetching balance for ${publicKeyStr}: ${error.message}`
    );
  }
}

// List of famous Solana wallet addresses
const walletAddresses = [
  "3CgvbiM3op4vjrrjH2zcrQUwsqh5veNVRjFCB9N6sRoD",
  "4vb9kUoSzRj4vSCznPr9YpherEkfXn128tAhzKszd18X",
  "FqRXiaGCPTknwME5xJDfKvTDctkMraBDqsVRcK7yG1kA",
  "9nnLbotNTcUhvbrsA6Mdkx45Sm82G35zo28AqUvjExn8",
];

// Get balance for each wallet address
walletAddresses.forEach((e) => getBalance(e));
