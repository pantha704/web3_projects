use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
};

use crate::instructions::CounterInstructions;

pub mod instructions;

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq)]
pub struct CounterAccount {
    pub counter: u32,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {

    let instruction = CounterInstructions::unpack(instruction_data)?;
    let account = next_account_info(&mut accounts.iter())?;

    let mut counter_account = CounterAccount::try_from_slice(&account.data.borrow())?;

    match instruction {
        CounterInstructions::Increment(args) => {
            counter_account.counter += args.value;
        }
        CounterInstructions::Decrement(args) => {
            counter_account.counter -= args.value;
        }
        CounterInstructions::Update(args) => {
            counter_account.counter = args.value;
        }
        CounterInstructions::Reset => {
            counter_account.counter = 0;
        }
    }

    counter_account.serialize(&mut *account.data.borrow_mut())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_program::clock::Epoch;
    use std::mem;

    #[test]
    fn test_counter() -> Result<(), ProgramError> {
        let program_id = Pubkey::default();
        let key = Pubkey::default();
        let mut lamports =  0;
        /// Creates a mutable vector `data` initialized with zeros, where the length is determined
        /// by serializing a default `CounterAccount` (with `counter` set to 0) and using the length
        /// of the resulting byte vector. This ensures `data` has the exact size needed to store
        /// a serialized `CounterAccount`.
        let mut data = vec![0; CounterAccount { counter: 0 }.try_to_vec().unwrap().len()];
        let owner = Pubkey::default();

        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );

        let accounts = vec![account];
        let increment_instructuion_data: Vec<u8> = vec![0];
        let decrement_instructuion_data: Vec<u8> = vec![1];
        let mut update_instructuion_data: Vec<u8> = vec![2];
        let reset_instructuion_data: Vec<u8> = vec![3];


        // Increment
        let increment_value = 10u32;
        increment_instructuion_data.extend_from_slice(&update_value.to_le_bytes());

        process_instruction(&program_id, &accounts, &increment_instructuion_data)?;

        assert_eq!(
            CounterAccount::try_from_slice(&accounts[0].data.borrow())?.counter,
            1
        );

        // Decrement
        let decrement_value = 10u32;
        decrement_instructuion_data.extend_from_slice(&update_value.to_le_bytes());

        process_instruction(&program_id, &accounts, &decrement_instructuion_data)?;

        assert_eq!(
            CounterAccount::try_from_slice(&accounts[0].data.borrow())?.counter,
            0
        );

        // Update
        let update_value = 10u32;
        update_instructuion_data.extend_from_slice(&update_value.to_le_bytes());
        
        process_instruction(&program_id, &accounts, &update_instructuion_data)?;
        assert_eq!(
            CounterAccount::try_from_slice(&accounts[0].data.borrow())?.counter,
            10
        );

        // Reset
        process_instruction(&program_id, &accounts, &reset_instructuion_data)?;
        assert_eq!(
            CounterAccount::try_from_slice(&accounts[0].data.borrow())?.counter,
            0
        );
        
        Ok(())
    }
}