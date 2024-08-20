import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import {
  getKeypairFromEnvironment,
  addKeypairToEnvFile,
} from "@solana-developers/helpers";

const suppliedToPubkey =
  process.argv[2] || "HyYY4pMjsoXABSei7qmFHTenXVVBfGgt1n9EmY3iirKV";

if (!suppliedToPubkey) {
  console.log(`Please provide a public key to send to`);
  process.exit(1);
}

const keypair = Keypair.generate();
// console.log(keypair.secretKey);

try {
  await addKeypairToEnvFile(keypair, "SECRET_KEY", ".env");
} catch (error) {
  console.log();
}
const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
console.log(senderKeypair.publicKey.toBase58());

console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

const toPubkey = new PublicKey(suppliedToPubkey);

const connection = new Connection(
  "https://api.testnet.solana.com",
  "confirmed"
);

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
