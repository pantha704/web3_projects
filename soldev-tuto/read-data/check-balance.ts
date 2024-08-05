// Get Balance
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const publicKey = new PublicKey("FsTFGXVzZ3qyUeYUMm49E6o1nLwizopqcVpoYbcWZYwM");

var connection = new Connection("https://api.devnet.solana.com", "confirmed");

var balanceInLamps = await connection.getBalance(publicKey);

var balanceInSOL = balanceInLamps / LAMPORTS_PER_SOL;

console.log(
  `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`
);
