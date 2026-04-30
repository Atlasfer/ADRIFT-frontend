'use client'

import { NodeStatus } from '@/types'
import { useNodeDetail } from '@/lib/api/graphQueries'
import { BookOpen, Layers, Lock } from 'lucide-react'

interface DetailModalProps {
  nodeId: string | null
  mode: 'view' | 'progress'
  onClose: () => void
  onClaim?: (courseId: string) => void
  onUnclaim?: (courseId: string) => void
  nodeStatus?: NodeStatus
}

const DAY_MAP: Record<string, string> = {
  SENIN: 'Sen', SELASA: 'Sel', RABU: 'Rab',
  KAMIS: 'Kam', JUMAT: 'Jum', SABTU: 'Sab'
}

export default function DetailModal({ nodeId, mode, onClose, onClaim, onUnclaim, nodeStatus }: DetailModalProps) {
  const { data: detail, isLoading } = useNodeDetail(nodeId)

  if (!nodeId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />
      
      {/* Modal Container */}
      <div
        className={`
          relative z-10 w-full max-w-lg rounded-2xl overflow-hidden
          bg-linear-to-br from-[#0D1B2E] to-[#0A1628]
          border border-blue-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(37,99,235,0.1)]
          animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out
        `}
        onClick={e => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
            <span className="text-gray-500 text-sm font-medium">Memuat detail...</span>
          </div>
        ) : !detail ? (
          <div className="flex items-center justify-center h-48 text-gray-500 italic">Gagal memuat data</div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-wider uppercase font-mono">
                      {detail.code}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                      detail.is_elective 
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {detail.is_elective ? 'Pilihan' : 'Wajib'}
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
                    {detail.name}
                  </h2>
                  <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span>Semester {detail.semester}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      <span>{detail.credit} SKS</span>
                    </div>
                  </div>                  
                </div>
                <button 
                  onClick={onClose}
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all active:scale-90">
                  ✕
                </button>
              </div>

              {detail.lab_paths.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {detail.lab_paths.map(lp => (
                    <span 
                      key={lp.id} 
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${lp.color}22`, 
                        border: `1px solid ${lp.color}44`, 
                        color: lp.color 
                      }}>
                      {lp.name}
                    </span>
                  ))}
                </div>
              )}

              {detail.description && (
                <p className="text-sm text-gray-400 mt-4 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                  {detail.description}
                </p>
              )}
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-5 max-h-85 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              {detail.prerequisites.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Prasyarat</h3>
                  <div className="flex flex-wrap gap-2">
                    {detail.prerequisites.map(p => (
                      <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-red-500/10 border border-red-500/20">
                        <span className="font-mono font-bold text-red-400">{p.code}</span>
                        <span className="text-gray-300">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail.unlocks.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Membuka Akses</h3>
                  <div className="flex flex-wrap gap-2">
                    {detail.unlocks.map(u => (
                      <div key={u.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-emerald-500/10 border border-emerald-500/20">
                        <span className="font-mono font-bold text-emerald-400">{u.code}</span>
                        <span className="text-gray-300">{u.name}</span>
                        {u.is_elective && <span className="text-purple-400 animate-pulse">✦</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail.schedules_this_semester.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Jadwal Semester Ini</h3>
                  <div className="space-y-2">
                    {detail.schedules_this_semester.map(s => (
                      <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3 border border-white/6 hover:bg-white/5 transition-colors">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-blue-400 bg-blue-500/15 border border-blue-500/20">
                          {s.class}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{s.lecture_name}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {DAY_MAP[s.day] ?? s.day} • {s.start_time}–{s.end_time} • {s.room}
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                          {s.capacity} <span className="hidden sm:inline">kursi</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {mode === 'progress' && (
              <div className="px-6 py-4 border-t border-white/5 bg-black/20">
                {nodeStatus === 'AVAILABLE' && (
                  <button 
                    onClick={() => { onClaim?.(nodeId!); onClose() }}
                    className={`
                      w-full py-3 px-4 rounded-xl font-bold text-sm text-white
                      bg-linear-to-r from-emerald-600 to-teal-600
                      shadow-[0_4px_20px_rgba(16,185,129,0.3)]
                      hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)]
                      hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                      transition-all duration-200
                    `}
                  >
                    Klaim Matakuliah
                  </button>
                )}
                {nodeStatus === 'COMPLETED' && (
                  <button 
                    onClick={() => { onUnclaim?.(nodeId!); onClose() }}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-[0.98]"
                  >
                    Batalkan Klaim
                  </button>
                )}
                {nodeStatus === 'LOCKED' && (
                  <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500 py-2 bg-white/5 rounded-lg">
                    <span><Lock className="w-4 h-4" /></span>
                    <span>Selesaikan prasyarat terlebih dahulu</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}