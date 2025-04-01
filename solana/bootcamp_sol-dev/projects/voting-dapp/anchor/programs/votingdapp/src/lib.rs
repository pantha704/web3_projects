#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod votingdapp {
    use super::*;

    pub fn initialize_poll(ctx: Context<InitializePoll>,
                      poll_id: u64,
                      poll_name: String,
                      poll_description: String,
                      poll_start_time: u64,
                      poll_end_time: u64,
                      total_votes: u64,
                    ) -> Result<()> {
      let poll = &mut ctx.accounts.poll;
      poll.poll_id = poll_id;
      poll.poll_name = poll_name;
      poll.poll_description = poll_description;
      poll.total_votes = total_votes;
      poll.poll_start_time = poll_start_time;
      poll.poll_end_time = poll_end_time;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
  #[account(mut)]
  pub signer: Signer<'info>,
  #[account(init,
    payer = signer,
    space = 8 + Poll::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump,
  )]
  pub poll: Account<'info, Poll>,

  pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
  pub poll_id: u64,
  #[max_len(32)]
  pub poll_name: String,
  #[max_len(255)]
  pub poll_description: String,
  pub poll_start_time: u64,
  pub poll_end_time: u64,
  pub total_votes: u64,
}

#[account]
pub struct Vote {
  
}