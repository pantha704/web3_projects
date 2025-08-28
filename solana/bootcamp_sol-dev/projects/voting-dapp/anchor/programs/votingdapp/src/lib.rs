#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod votingdapp {
    use super::*;

    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        poll_id: u64,
        poll_name: String,
        poll_description: String,
        poll_start_time: u64,
        poll_end_time: u64,
        total_candidates: u64,
    ) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        poll.poll_id = poll_id;
        poll.poll_name = poll_name;
        poll.poll_description = poll_description;
        poll.total_candidates = total_candidates;
        poll.poll_start_time = poll_start_time;
        poll.poll_end_time = poll_end_time;
        Ok(())
    }

    pub fn initialize_candidate(
        ctx: Context<InitializeCandidate>,
        _candidate_name: String,
        _poll_id: u64,
    ) -> Result<()> {
        // Initialize candidate logic here
        let candidate = &mut ctx.accounts.candidate;
        let poll = &mut ctx.accounts.poll;
        poll.total_candidates += 1;
        candidate.candidate_name = _candidate_name;
        candidate.candidate_votes = 0;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, _candidate_name: String, _poll_id: u64) -> Result<()> {
        // Voting logic here
        let candidate = &mut ctx.accounts.candidate;
        let current_time = Clock::get()?.unix_timestamp;

        if current_time > (ctx.accounts.poll.poll_end_time as i64) {
            return Err(ErrorCode::VotingEnded.into());
        }

        if current_time <= (ctx.accounts.poll.poll_start_time as i64) {
            return Err(ErrorCode::VotingNotStarted.into());
        }

        candidate.candidate_votes += 1;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(candidate_name: String, poll_id: u64)]
pub struct Vote<'info> {
    pub signer: Signer<'info>,

    #[account(
      seeds = [poll_id.to_le_bytes().as_ref()],
      bump,
    )]
    pub poll: Account<'info, Poll>,

    #[account(
    seeds = [candidate_name.as_bytes(), poll_id.to_le_bytes().as_ref()],
    bump,
    )]
    pub candidate: Account<'info, Candidate>,
}

#[derive(Accounts)]
#[instruction(candidate_name: String, poll_id: u64)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
      seeds = [poll_id.to_le_bytes().as_ref()],
      bump,
    )]
    pub poll: Account<'info, Poll>,

    #[account(init,
    payer = signer,
    space = 8 + Candidate::INIT_SPACE,
    seeds = [candidate_name.as_bytes(), poll_id.to_le_bytes().as_ref()],
    bump,
    )]
    pub candidate: Account<'info, Candidate>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Candidate {
    #[max_len(32)]
    pub candidate_name: String,
    pub candidate_votes: u64,
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
    pub total_candidates: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Voting has not started yet")]
    VotingNotStarted,
    #[msg("Voting has ended")]
    VotingEnded,
}
