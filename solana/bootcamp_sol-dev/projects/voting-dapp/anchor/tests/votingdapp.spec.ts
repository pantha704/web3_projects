import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Votingdapp } from '../target/types/votingdapp'
import { startAnchor } from 'solana-bankrun'
import { BankrunProvider } from 'anchor-bankrun'

const IDL = require('../target/idl/votingdapp.json')

const votingAddress = new PublicKey(
  'coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF'
)

describe('votingdapp', () => {
  it('Initialize poll', async () => {
    const context = await startAnchor(
      'test/anchor-example',
      [{ name: 'votingdapp', programId: votingAddress }],
      []
    )
    const provider = new BankrunProvider(context)

    const votingProgram = new Program<Votingdapp>(IDL, provider)

    await votingProgram.methods.initializePoll(new anchor.BN(1))
  })
})
