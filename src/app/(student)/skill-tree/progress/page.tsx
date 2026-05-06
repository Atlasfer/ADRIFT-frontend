'use client'

import Link from 'next/link'
import { useProgressGraph, useProgressSummary, useClaimCourse, useUnclaimCourse } from '@/lib/api/graphQueries'
import { useGraphStore } from '@/store/graphStore'
import { useAuthStore } from '@/store/authStore'
import CurriculumGraph from '@/components/graph/CurriculumGraph'
import ProgressSidebar from '@/components/graph/ProgressSidebar'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export default function ProgressPage() {
  const { data: graphData, isLoading: graphLoading, isError: graphError } = useProgressGraph()
  const { data: summary, isLoading: summaryLoading } = useProgressSummary()
  const { mutate: claim } = useClaimCourse()
  const { mutate: unclaim } = useUnclaimCourse()

  const toast = useGraphStore(s => s.toast)
  const user = useAuthStore(s => s.user)

  const handleClaim = (courseId: string) => {
    claim({ courseId, grade: 'A' })
  }

  const handleUnclaim = (courseId: string) => {
    unclaim({ courseId })
  }

  if (graphLoading || summaryLoading) {
    return (
      <div className="h-screen bg-[#060B14] flex items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <span className="text-gray-500 text-sm font-medium">Memuat data progress...</span>
      </div>
    )
  }

  if (graphError || !graphData || !summary) {
    return (
      <div className="h-screen bg-[#060B14] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" />
            <p className="text-gray-500 font-medium">Gagal memuat data progress</p>
          </div>
          <Link href="/" className="text-sm text-blue-400 hover:underline inline-block">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#060B14]">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-6 py-4 bg-[#0A1628]/95 border-b border-white/5 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#2563EB] shadow-lg hover:opacity-80 transition-all active:scale-95">
            <span className="text-white font-black text-xs">TC</span>
          </Link>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Progress Kurikulum</h1>
            <p className="text-[11px] text-gray-500 font-medium">
              {user ? `${user.name} · ${user.nrp}` : 'Informatika ITS · Student Tracking'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2.5">
            {[
              { label: 'Selesai', color: 'bg-[#1D9E75]', text: 'text-[#1D9E75]', border: 'border-[#1D9E75]/30', bg: 'bg-[#1D9E75]/10' },
              { label: 'Tersedia', color: 'bg-[#F59E0B]', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/30', bg: 'bg-[#F59E0B]/10' },
              { label: 'Terkunci', color: 'bg-[#6B7280]', text: 'text-[#6B7280]', border: 'border-[#6B7280]/30', bg: 'bg-[#6B7280]/10' },
            ].map(s => (
              <div 
                key={s.label} 
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${s.bg} ${s.text} ${s.border}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                {s.label}
              </div>
            ))}
          </div>
          
          <Link 
            href="/skill-tree"
            className="flex item-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 transition-all active:scale-95">
            <ArrowLeft className="w-4 h-4" />Kembali
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Canvas Graph */}
        <main className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0A1628] via-[#060B14] to-[#060B14]">
          <CurriculumGraph
            data={graphData}
            mode="progress"
            onClaim={handleClaim}
            onUnclaim={handleUnclaim}/>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 shrink-0 bg-[#060B14]/40 border-l border-white/5 backdrop-blur-sm overflow-y-auto hidden xl:block scrollbar-hide">
          <div className="p-4">
            <ProgressSidebar summary={summary} />
          </div>
        </aside>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div 
          className={`
            fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-2xl z-[100]
            animate-in fade-in slide-in-from-bottom-4 duration-300
            ${toast.type === 'success' ? 'bg-[#1D9E75]/95 border-emerald-500/20' : 'bg-red-500/95 border-red-500/20'}
            backdrop-blur-md border shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          `}
        >
          <div className="flex items-center gap-2.5">
            <span>{toast.type === 'success' ? '✨' : <AlertTriangle className="text-yellow-500" />}</span>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}