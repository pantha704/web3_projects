'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useCounterProgram } from './counter-data-access'
import { CounterCreate } from './counter-ui'
import { CounterList } from './counter-list'
import { AppHero } from '../app-hero'
import { ellipsify } from '@/lib/utils'
import { Notebook, PenLine, Plus, Sparkles, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CounterFeature() {
  const { publicKey } = useWallet()
  const { programId, accounts } = useCounterProgram()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(true)

  // Track scroll position for subtle UI adjustments
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      if (window.scrollY > 50) {
        setShowScrollHint(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 transition-colors duration-300">
        <div className="text-center max-w-md w-full">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/40 to-purple-500/40 rounded-xl blur-sm opacity-75 transition-all duration-500"></div>
              <div className="relative bg-[#121215] p-3.5 rounded-xl border border-[#2a2a2f]">
                <Notebook className="h-10 w-10 text-indigo-400" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-3 tracking-[-0.02em]">
            Solana Journal
          </h1>

          <p className="text-gray-400 mb-8 text-base leading-relaxed max-w-sm mx-auto">
            A private, permanent journal built on Solana. Your thoughts, securely stored and owned by you.
          </p>

          <div className="flex justify-center">
            <WalletButton className="px-6 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 active:scale-[0.98] shadow-[0_0_20px_rgba(99,102,241,0.15)]" />
          </div>

          <div className="mt-8 text-xs text-gray-500 flex items-center justify-center gap-1.5 opacity-70">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span>End-to-end encrypted • Permanently stored on-chain</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white relative">
      {/* Subtle top gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-1.5 bg-[#1a1a1f] rounded-lg">
              <Notebook className="h-5 w-5 text-indigo-400" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 tracking-[-0.015em]">
              Solana Journal
            </h1>
          </div>

          <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
            Write entries that are permanently stored on the Solana blockchain. Your data is yours forever, with no
            central authority.
          </p>

          <div className="mt-3.5 flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium text-gray-300">Program:</span>
            <ExplorerLink
              path={`account/${programId}`}
              label={ellipsify(programId.toString())}
              className="text-indigo-400 hover:text-indigo-300 transition-colors break-all"
            />
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <span className="px-2 py-0.5 bg-[#1a1a1f] rounded text-gray-300">
              {accounts.data?.length || 0} {accounts.data?.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,2fr] gap-7">
          <div className="lg:order-1 order-2">
            <div className="sticky top-6">
              <CounterCreate />
            </div>
          </div>

          <div className="lg:order-2 order-1">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <PenLine className="h-4.5 w-4.5 text-indigo-400" strokeWidth={1.8} />
                <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 tracking-[-0.01em]">
                  Your Journal
                </h2>
              </div>

              {accounts.data && accounts.data.length > 0 && (
                <span className="px-2.5 py-0.5 bg-[#1a1a1f] rounded text-xs text-gray-300">
                  {accounts.data.length} {accounts.data.length === 1 ? 'entry' : 'entries'}
                </span>
              )}
            </div>

            <CounterList />

            {showScrollHint && accounts.data && accounts.data.length > 3 && (
              <div className="mt-6 flex flex-col items-center py-4">
                <ChevronDown className="h-4 w-4 text-gray-500 animate-bounce" />
                <span className="text-xs text-gray-500 mt-1">Scroll to see more entries</span>
              </div>
            )}
          </div>
        </div>

        {/* Subtle decorative element */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent rounded-full" />
      </div>
    </div>
  )
}
