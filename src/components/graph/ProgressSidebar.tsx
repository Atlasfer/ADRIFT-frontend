'use client'

import { ProgressSummary } from '@/types'

interface ProgressSidebarProps {
  summary: ProgressSummary
}

export default function ProgressSidebar({ summary }: ProgressSidebarProps) {
  const stats = [
    { label: 'Selesai', value: summary.completed, color: '#1D9E75', bg: 'rgba(29,158,117,0.15)' },
    { label: 'Tersedia', value: summary.available, color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
    { label: 'Terkunci', value: summary.locked, color: '#6B7280', bg: 'rgba(107,114,128,0.15)' },
  ]

  return (
    <div
      className="flex flex-col gap-4 p-4 rounded-2xl"
      style={{
        background: 'rgba(10, 22, 40, 0.9)',
        border: '1px solid rgba(59, 130, 246, 0.15)',
        backdropFilter: 'blur(16px)',
        minWidth: '220px',
      }}>
      {/* Header */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">Progress</h3>
        <div className="text-2xl font-bold" style={{ color: '#60A5FA' }}>
          {summary.progress_percentage.toFixed(1)}%
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          Semester {summary.current_semester_estimate} · {summary.enrollment_year}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${summary.progress_percentage}%`,
            background: 'linear-gradient(90deg, #1D9E75, #3B82F6)',
          }}/>
      </div>

      {/* SKS */}
      <div className="text-xs text-gray-500">
        <span className="text-white font-bold">{summary.total_credits_completed}</span>
        {' / '}{summary.total_credits_required} SKS
      </div>

      {/* Stats */}
      <div className="space-y-2">
        {stats.map(s => (
          <div key={s.label} className="flex items-center justify-between px-3 py-2 rounded-xl"
            style={{ background: s.bg, border: `1px solid ${s.color}30` }}>
            <span className="text-xs font-medium" style={{ color: s.color }}>{s.label}</span>
            <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-white/5 space-y-1.5">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Keterangan</div>
        {[
          { label: 'Prasyarat', color: '#4B5563', dash: false },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <svg width="24" height="12">
              <line x1="0" y1="6" x2="24" y2="6"
                stroke={l.color} strokeWidth="2"
                strokeDasharray={l.dash ? '4 2' : 'none'} />
              <polygon points="20,3 24,6 20,9" fill={l.color} />
            </svg>
            <span className="text-xs text-gray-500">{l.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1">
          <div className="w-6 h-4 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-red-500/60" />
          </div>
          <span className="text-xs text-gray-500">Mata Kuliah Wajib</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-6 h-4 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-purple-500/60" />
          </div>
          <span className="text-xs text-gray-500">Mata Kuliah Pilihan</span>
        </div>
      </div>
    </div>
  )
}
