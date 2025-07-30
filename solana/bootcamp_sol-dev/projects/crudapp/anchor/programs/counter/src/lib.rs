#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("EweTZCiTVAURjHF8BHEo7C9kq3C614Ec1G4zgu2WSMzi");

#[program]
pub mod crudapp {
    use super::*;

    pub fn create_journal_entry(
        ctx: Context<CreateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        let entry = &mut ctx.accounts.journal_entry;
        entry.owner = *ctx.accounts.owner.key;
        entry.title = title;
        entry.message = message;
        Ok(())
    }

    pub fn update_journal_entry(
        ctx: Context<UpdateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.message = message;
        Ok(())
    }

    pub fn delete_journal_entry(ctx: Context<DeleteEntry>, title: String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)] // to get the title parameter from the create_journal_entry instruction
pub struct CreateEntry<'info> {
    // Initialize the journal entry account/PDA using [title, owner]
    #[account(
        init,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        payer = owner,
        space = 8 + JournalEntryState::INIT_SPACE,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    #[account(mut)] // owner account is mut because of changing its balance
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = 8 + JournalEntryState::INIT_SPACE,  // to increase the account rent if the account size(bytes) gets larger and vice versa
        realloc::payer = owner,   // owner receives/pays the extra rent
        realloc::zero = true,     // re-calculates the size of account from 0, clears old data
    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    #[account(mut)] // owner account is mut because of changing its balance
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner,    // if signer === owner, delete the account
    )]
    pub journal_entry: Account<'info, JournalEntryState>,

    #[account(mut)] // owner account is mut because of changing its balance
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// Journal Entry Account/PDA structure
#[account]
#[derive(InitSpace)]
pub struct JournalEntryState {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(1000)]
    pub message: String,
}
