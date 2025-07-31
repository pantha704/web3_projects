'use client'

import { useCounterProgram } from './counter-data-access'
import { CounterCard } from './counter-ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon, Notebook, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function CounterList() {
  const { accounts } = useCounterProgram()

  if (accounts.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-700"
          >
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
        ))}
      </div>
    )
  }

  if (accounts.error) {
    return (
      <Alert variant="destructive" className="bg-gray-900/50 border border-red-900/50 rounded-xl">
        <InfoIcon className="h-4 w-4 text-red-400 mt-0.5" />
        <AlertTitle className="font-medium text-red-400">Error</AlertTitle>
        <AlertDescription className="text-gray-300">Failed to load entries: {accounts.error.message}</AlertDescription>
        <Button
          variant="outline"
          size="sm"
          onClick={() => accounts.refetch()}
          className="ml-auto border-red-900/50 hover:bg-red-900/20 text-red-300 hover:text-red-100"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </Alert>
    )
  }

  if (!accounts.data || accounts.data.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-900/30 rounded-xl border border-gray-800 p-8 text-center">
        <div className="mb-6 p-4 bg-gray-900/50 rounded-2xl">
          <Notebook className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No journal entries yet</h3>
        <p className="text-gray-400 max-w-md mb-6">
          Create your first journal entry using the form on the left. Your thoughts will be stored permanently on the
          Solana blockchain.
        </p>
        <div className="flex items-center text-sm text-gray-500 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-800">
          <Plus className="h-4 w-4 mr-2 text-blue-400" />
          Start writing your first entry
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.data.map((account) => (
        <CounterCard key={account.publicKey.toString()} account={account.publicKey} />
      ))}
    </div>
  )
}
