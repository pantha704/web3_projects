'use client'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCounterProgram } from './counter-data-access'
import { Button } from '@/components/ui/button'
import { useCounterProgramAccount } from './counter-data-access'
import { PublicKey } from '@solana/web3.js'
import { Sparkles, Pencil, Trash2, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardHeader, CardContent } from '../ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCcw } from 'lucide-react'
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'

export function CounterCreate() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const { createEntry } = useCounterProgram()
  const { publicKey } = useWallet()

  const isFormValid = title.trim() !== '' && message.trim() !== ''

  const handleSubmit = async () => {
    if (!publicKey) return toast.error('Connect your wallet first 🦊')

    try {
      setIsCreating(true)
      await createEntry.mutateAsync({ title, message, owner: publicKey })
      toast.success('Journal entry created successfully')
    } catch (error) {
      toast.error('Failed to create entry')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-lg shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20">
      <div className="p-6 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-purple-700/50 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Create Entry</h2>
        </div>
        <p className="text-gray-400 text-sm">Write your thoughts permanently on the Solana blockchain</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="My Journal Entry"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
              !title ? 'border-red-500/50 focus:ring-red-500/30' : 'border-gray-700 focus:ring-blue-500/50'
            } text-white placeholder-gray-500`}
            aria-required="true"
          />
          {!title && (
            <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
              <XMarkIcon className="h-3 w-3" />
              Title is required
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-300">
            Message
          </label>
          <textarea
            id="message"
            placeholder="What's on your mind today?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 min-h-[140px] transition-all duration-200 ${
              !message ? 'border-red-500/50 focus:ring-red-500/30' : 'border-gray-700 focus:ring-blue-500/50'
            } text-white placeholder-gray-500 resize-none`}
            aria-required="true"
          />
          {!message && (
            <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
              <XMarkIcon className="h-3 w-3" />
              Message is required
            </p>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isCreating || !isFormValid}
          className={`w-full py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
            isCreating || !isFormValid
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/10 hover:shadow-blue-500/20'
          }`}
          aria-label="Submit Entry"
        >
          {isCreating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </>
          ) : (
            'Create Entry'
          )}
        </Button>

        <div className="text-xs text-gray-500 flex items-center justify-center gap-1.5 pt-2 border-t border-gray-800/50">
          <CheckCircleIcon className="h-3 w-3 text-purple-400" />
          Entries are permanently stored on Solana blockchain
        </div>
      </div>
    </div>
  )
}

export function CounterCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useCounterProgramAccount({ account })
  const { publicKey } = useWallet()
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const title = accountQuery.data?.title
  const isFormValid = message.trim() !== ''
  const queryClient = useQueryClient()

  const handleSubmit = () => {
    if (!publicKey) return toast.error('Connect wallet 🔌')
    if (publicKey && isFormValid && title) {
      updateEntry.mutate(
        { title, message, owner: publicKey },
        {
          onSuccess: () => {
            setMessage('')
            setIsEditing(false)
            queryClient.invalidateQueries({
              queryKey: ['counter', 'all'],
            })
            queryClient.invalidateQueries({
              queryKey: ['counter', 'fetch'],
            })
          },
          onError: (error) => {
            toast.error(`Failed to update entry: ${error.message}`)
          },
        },
      )
    }
  }

  if (accountQuery.isLoading) {
    return (
      <Card className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-700">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-3/4 bg-gray-800 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full bg-gray-800 rounded" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 flex-1 bg-gray-800 rounded-lg" />
            <Skeleton className="h-10 flex-1 bg-gray-800 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (accountQuery.error) {
    return (
      <div className="bg-gray-900/50 border border-red-900/50 rounded-xl overflow-hidden transition-all duration-300">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="font-medium">Error loading entry</h3>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2">{accountQuery.error.message}</p>
          <Button
            variant="outline"
            onClick={() => accountQuery.refetch()}
            className="w-full border-red-900/50 hover:bg-red-900/20 text-red-300 hover:text-red-100"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-700 hover:shadow-lg hover:shadow-blue-500/5">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {title || 'Untitled'}
              </span>
              {accountQuery.data && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-900/30">
                  Journal Entry
                </span>
              )}
            </h2>
            {/* <p className="text-sm text-gray-500 mt-1">
              Created:{' '}
              {accountQuery.data ? new Date(accountQuery.data.createdAt.toNumber() * 1000).toLocaleDateString() : 'N/A'}
            </p> */}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
            className="hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
            aria-label={isEditing ? 'Cancel editing' : 'Edit entry'}
          >
            {isEditing ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <textarea
              placeholder="New message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-500 resize-none min-h-[120px]"
              aria-label="New message"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={updateEntry.isPending || !isFormValid}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  updateEntry.isPending || !isFormValid
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white'
                }`}
              >
                {updateEntry.isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Update Entry'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setMessage('')
                }}
                disabled={updateEntry.isPending}
                className="flex-1 py-3 border-gray-700 text-gray-300 hover:bg-gray-800/50"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-300 min-h-[80px] leading-relaxed">
              {accountQuery.data?.message || 'No message set.'}
            </p>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(true)
                  setMessage(accountQuery.data?.message || '')
                }}
                className="w-full py-3 border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:border-gray-600 transition-colors"
                disabled={deleteEntry.isPending}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Entry
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  if (
                    title &&
                    window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')
                  ) {
                    deleteEntry.mutate(title, {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: ['counter', 'all'],
                        })
                      },
                    })
                  }
                }}
                disabled={deleteEntry.isPending}
                className="w-full mt-2 py-3 bg-red-900/30 hover:bg-red-900/40 text-red-300 border border-red-900/50 hover:border-red-900/70 transition-colors"
              >
                {deleteEntry.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {deleteEntry.isPending ? 'Deleting...' : 'Delete Entry'}
              </Button>
            </div>
          </>
        )}
      </div>

      {updateEntry.isSuccess && (
        <div className="px-6 pb-4 pt-2 flex items-center text-sm text-green-400 bg-gray-900/30 border-t border-gray-800">
          <Check className="h-4 w-4 mr-2" />
          Entry updated successfully
        </div>
      )}
    </div>
  )
}
