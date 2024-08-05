// Get Balance
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const publicKey = new PublicKey("YOUR PUBLIC KEY");

var connection = new Connection("https://api.devnet.solana.com", "confirmed");

var balanceInLamps = await connection.getBalance(publicKey);

var balanceInSOL = balanceInLamps / LAMPORTS_PER_SOL;

console.log(
  `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`
);
