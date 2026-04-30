'use client'

import Link from 'next/link'
import { usePublicGraph } from '@/lib/api/graphQueries'
import { useGraphStore } from '@/store/graphStore'
import CurriculumGraph from '@/components/graph/CurriculumGraph'
import { AlertTriangle, ArrowRight, Eye, X, Check } from 'lucide-react'

export default function HomePage() {
  const { data: graphData, isLoading, isError } = usePublicGraph()
  const toast = useGraphStore(s => s.toast)

  if (isLoading) {
    return (
      <div className="h-screen bg-[#060B14] flex items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <span className="text-gray-500 text-sm font-medium">Memuat graph...</span>
      </div>
    )
  }

  if (isError || !graphData) {
    return (
      <div className="h-screen bg-[#060B14] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-3xl"><AlertTriangle className="w-8 h-8 text-yellow-500" /></div>
          <p className="text-gray-500 font-medium">Gagal memuat data graph</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-xs text-blue-500 hover:underline">
            Coba lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#060B14]">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-6 py-4 bg-[#0A1628]/90 border-b border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-500 shadow-lg">
            <span className="text-white font-black text-xs">TC</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Kurikulum Graph</h1>
            <p className="text-[11px] text-gray-500 font-medium">Teknik Informatika · ITS</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <span className="text-xs"><Eye/></span>
            <span>View Only</span>
          </div>
          <Link 
            href="/progress"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-green-700 shadow-[0_4px_20px_rgba(29,158,117,0.3)] transition-all hover:scale-[1.03] active:scale-95">
            My Progress <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Instructions Bar */}
      <div className="shrink-0 px-6 py-2 bg-white/2 border-b border-white/4">
        <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
          Klik node untuk melihat <span className="text-gray-300 italic">dependency chain</span> · 
          Klik tombol <span className="font-bold text-blue-400">info</span> untuk detail 
        </p>
      </div>

      {/* Main Graph Area */}
      <main className="flex-1 relative overflow-hidden">
        <CurriculumGraph data={graphData} mode="view" />
      </main>

      {toast && (
        <div 
          className={`
            fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-sm font-semibold text-white shadow-2xl z-100 animate-in fade-in slide-in-from-bottom-4 duration-300
            ${toast.type === 'success' ? 'bg-[#1D9E75]/95' : 'bg-red-500/95'}
            backdrop-blur-md border border-white/10
          `}>
          <div className="flex items-center gap-2">
            <span>{toast.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}</span>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}