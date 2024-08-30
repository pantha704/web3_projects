import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

const Airdrop = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState();

  async function sendAirdropToUser() {
    var error;
    try {
      await connection.requestAirdrop(
        wallet.publicKey,
        balance * LAMPORTS_PER_SOL
      );
    } catch (err) {
      alert(err);
      error = err;
    }

    if (!error) alert("airdropped");
  }

  async function getBalance() {
    if (wallet.publicKey) {
      setBalance(
        (await connection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL
      );
    }
  }

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Amount ( in SOL )"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      />
      <button onClick={sendAirdropToUser}>Send</button>
      <br />
      hi you have {balance} <button onClick={getBalance}>Fetch Balance</button>
    </div>
  );
};
export default Airdrop;
