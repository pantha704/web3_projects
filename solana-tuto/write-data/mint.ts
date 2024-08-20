import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { TokenMetadata } from "@solana/spl-token-metadata";
import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";

// Establishing connection on testnet
const connetion = new Connection(clusterApiUrl("testnet"));

// Getting Keypair
const payer = await getKeypairFromEnvironment("SECRET_KEY");
console.log("payer : ", payer.publicKey.toBase58());

// Generating new Keypair
const mint = Keypair.generate();
console.log("mint : ", mint.publicKey.toBase58());

// Initializing metadata
const metadata: TokenMetadata = {
  mint: mint.publicKey,
  name: "Meowlicious",
  symbol: "MEOW",
  uri: "https://ipfs.io/ipfs/QmXfWjHj9RTMEa7XRsjDRS2x8Hb2tHgAqHMG7aEg7Rk3UQ",
  additionalMetadata: [["key", "value"]],
};
