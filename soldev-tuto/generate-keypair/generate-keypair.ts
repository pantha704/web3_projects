// Generate Keypair
import { Keypair } from "@solana/web3.js";

var keypair = Keypair.generate();
console.log(
  keypair.publicKey.toBase58() + " : Public key\n\n",
  keypair.secretKey + " : Secret key\n\n",
  keypair + "\n\n"
);
console.log("✅ Generated Keypair!");
// Loading keypair from .env
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

var keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  keypair +
    "\n\n✅ Finished! We've loaded our secret key securely, using an env file!"
);
