import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getKeypairFromEnvironment,
  addKeypairToEnvFile,
  confirmTransaction,
  airdropIfRequired,
} from "@solana-developers/helpers";
import * as dotenv from "dotenv";

const suppliedToPubkey =
  process.argv[2] || "HyYY4pMjsoXABSei7qmFHTenXVVBfGgt1n9EmY3iirKV";

if (!suppliedToPubkey) {
  console.log(`Please provide a public key to send to`);
  process.exit(1);
}
// Generating a new keypair
const keypair = Keypair.generate();

try {
  // await addKeypairToEnvFile(keypair, "SECRET_KEY", ".env");
} catch (error) {
  console.log();
}

dotenv.config();
const senderKeypair = keypair; // getKeypairFromEnvironment("SECRET_KEY");
console.log("Sending from: " + senderKeypair.publicKey.toBase58());

console.log(`Sending to: ${suppliedToPubkey}`);

const toPubkey = new PublicKey(suppliedToPubkey);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Requesting Airdrop for gas fees
const drop = await connection.requestAirdrop(
  senderKeypair.publicKey,
  1 * LAMPORTS_PER_SOL
);
await confirmTransaction(connection, drop);

console.log(
  `✅ Loaded our own keypair, the destination public key, and connected to Solana`
);

const transaction = new Transaction();

const LAMPORTS_TO_SEND = 5000;

const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey,
  lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const signature = await sendAndConfirmTransaction(connection, transaction, [
  senderKeypair,
]);

console.log(
  `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `
);
console.log(`Transaction signature is ${signature}!`);
