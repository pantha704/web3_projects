import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import Airdrop from "./Airdrop";
import { clusterApiUrl } from "@solana/web3.js";

function App() {
  return (
    <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />
          <div>
            hi there <b>hello</b>
          </div>
          <Airdrop />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
