#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod voting {
    use super::*;

    pub fn initialize_poll(ctx: Context<InitializePoll>, _poll_id: u64) -> ProgramResult {
      let poll = &mut ctx.accounts.poll;
      poll.poll_id = _poll_id;
      poll.options = options;
      poll.votes = vec![0; options.len()];
      Ok(())
}
}

#[derive(Accounts)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
      init,
      payer = signer,
      space = 8 + Poll::INIT_SPACE,
      seeds = [b"poll".as_ref()],
      bump,
      )]
    pub poll: Account<'info, Poll>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub poll_id: u64,
    #[max_len(280)]
    pub description: String,
    pub poll_start_time: u64,
    pub poll_end_time: u64,
    pub candidate_amount: u64,
    // pub options: Vec<String>,
    // pub votes: Vec<u64>,
}

