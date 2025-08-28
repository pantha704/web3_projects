import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Votingdapp } from "../target/types/votingdapp";
import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { VotingdappCreate } from "../../src/components/votingdapp/votingdapp-ui";
import { getVotingdappProgram } from "@project/anchor";

const IDL = require("../target/idl/votingdapp.json");

const votingAddress = new PublicKey(
  "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF"
);

describe("Voting", () => {
  let context;
  let provider;
  let votingProgram: Program<Votingdapp>;

  beforeAll(async () => {
    context = await startAnchor(
      "",
      [{ name: "votingdapp", programId: votingAddress }],
      []
    );
    provider = new BankrunProvider(context);

    votingProgram = new Program<Votingdapp>(IDL, provider);
  });

  it("Initialize poll", async () => {
    context = await startAnchor(
      "",
      [{ name: "votingdapp", programId: votingAddress }],
      []
    );
    provider = new BankrunProvider(context);

    votingProgram = new Program<Votingdapp>(IDL, provider);

    await votingProgram.methods
      .initializePoll(
        new anchor.BN(1),
        "What is your favorite type of peanut butter?",
        "Please select your favorite type of peanut butter from the options below.",
        new anchor.BN(0),
        new anchor.BN(1821246480),
        new anchor.BN(100) // Added missing sixth argument
      )
      .rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log("Poll initialized:", poll);

    expect(poll.pollId.toNumber()).toBe(1);
    expect(poll.pollName).toBe("What is your favorite type of peanut butter?");
    expect(poll.pollDescription).toBe(
      "Please select your favorite type of peanut butter from the options below."
    );
    expect(poll.pollStartTime.toNumber()).toBeLessThan(
      poll.pollEndTime.toNumber()
    );
    expect(poll.pollEndTime.toNumber()).toBe(1821246480);
  });

  it("Initialize candidates", async () => {
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );

    await votingProgram.methods
      .initializeCandidate("Smooth", new anchor.BN(1))
      .rpc();

    await votingProgram.methods
      .initializeCandidate("Crunchy", new anchor.BN(1))
      .rpc();

    const [smoothAddress, bump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("candidate"),
        Buffer.from("Smooth"),
        new anchor.BN(1).toArrayLike(Buffer, "le", 8),
      ],
      votingAddress
    );
    const smoothCandidate = await votingProgram.account.candidate.fetch(
      smoothAddress
    );
    console.log("Smooth candidate initialized:", smoothCandidate);

    const [crunchyAddress, bump2] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("candidate"),
        Buffer.from("Crunchy"),
        new anchor.BN(1).toArrayLike(Buffer, "le", 8),
      ],
      votingAddress
    );
    console.log(
      "crunchyAddress",
      crunchyAddress.toBase58(),
      "bump",
      bump2.toString()
    );

    // const acct = await provider.connection.getAccountInfo(crunchyAddress);
    // console.log("getAccountInfo crunchy:", !!acct, acct ? acct.lamports : null);
    const crunchyCandidate = await votingProgram.account.candidate.fetch(
      crunchyAddress
    );
    console.log("Crunchy candidate initialized:", crunchyCandidate);

    expect(crunchyCandidate.candidateVotes.toNumber()).toBe(0);
    expect(smoothCandidate.candidateVotes.toNumber()).toBe(0);
  });

  it("vote", async () => {
    await votingProgram.methods.vote("Smooth", new anchor.BN(1)).rpc();
  });
});
