'use client'

import { getCounterProgram, getCounterProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

interface CreateEntryArgs {
  title: string
  message: string
  owner: PublicKey
}

export function useCounterProgram() {
  const queryClient = useQueryClient()
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCounterProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCounterProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['counter', 'all', { cluster }],
    queryFn: () => program.account.journalEntryState.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['journalEntry', 'create', { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      return program.methods.createJournalEntry(title, message).rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      queryClient.invalidateQueries({
        queryKey: ['counter', 'all'],
      })
    },
    onError: (error) => {
      toast.error('Error creating entry: ' + error.message)
    },
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
  }
}

export function useCounterProgramAccount({ account }: { account: PublicKey }) {
  const queryClient = useQueryClient()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCounterProgram()

  const accountQuery = useQuery({
    queryKey: ['counter', 'fetch', { cluster, account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  })

  const updateEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['journalEntry', 'update', { cluster }],
    mutationFn: async ({ title, message, owner }) => {
      return program.methods.updateJournalEntry(title, message).rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      queryClient.invalidateQueries({
        queryKey: ['counter', 'all'],
      })
      queryClient.invalidateQueries({
        queryKey: ['counter', 'fetch'],
      })
    },
    onError: (error) => {
      toast.error('Error updating entry: ' + error.message)
    },
  })

  const deleteEntry = useMutation({
    mutationKey: ['journalEntry', 'delete', { cluster }],
    mutationFn: async (title: string) => {
      return program.methods.deleteJournalEntry(title).rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      queryClient.invalidateQueries({
        queryKey: ['counter', 'all'],
      })
    },
    onError: (error) => {
      toast.error('Error updating entry: ' + error.message)
    },
  })

  return {
    accountQuery,
    updateEntry,
    deleteEntry,
  }
}
