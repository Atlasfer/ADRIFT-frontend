'use client'

import { useState } from 'react'
import { Handle, Position, NodeProps, Node } from '@xyflow/react'
import { NodeStatus } from '@/types'
import { Lock } from 'lucide-react'

export interface CourseNodeData extends Record<string, unknown> {
  code: string
  name: string
  credit: number
  semester: number
  is_elective: boolean
  lab_paths: { id: string; name: string; color: string }[]
  status?: NodeStatus
  grade?: string | null
  mode: 'view' | 'progress'
  isHighlighted?: boolean
  isDimmed?: boolean
  onOpenDetail: (id: string) => void
}

export type CourseNodeType = Node<CourseNodeData, 'courseNode'>

const STATUS_STYLES: Record<NodeStatus, {
  container: string; code: string; name: string;
}> = {
  COMPLETED: {
    container: 'bg-[radial-gradient(circle_at_40%_40%,#0D3B2B,#061A12)]',
    code: 'text-[#34D399]',
    name: 'text-[#6EE7B7]',
  },
  AVAILABLE: {
    container: 'bg-[radial-gradient(circle_at_40%_40%,#3B2800,#1A1000)]',
    code: 'text-[#FCD34D]',
    name: 'text-[#FDE68A]',
  },
  LOCKED: {
    container: 'bg-[radial-gradient(circle_at_40%_40%,#1A1A2E,#0D0D1A)]',
    code: 'text-[#6B7280]',
    name: 'text-[#4B5563]',
  },
}

const VIEW_STYLE = {
  required: {
    container: 'bg-[radial-gradient(circle_at_40%_40%,#2D0D0D,#1A0606)]',
    code: 'text-[#93C5FD]',
    name: 'text-[#BFDBFE]',
  },
  elective: {
    container: 'bg-[radial-gradient(circle_at_40%_40%,#1E0D3E,#0D061E)]',
    code: 'text-[#C4B5FD]',
    name: 'text-[#DDD6FE]',
  },
}

const BORDER_CONFIG = {
  required: { border: '#EF4444' },
  elective:  { border: '#7C3AED' },
}

export default function CourseNode({ id, data }: NodeProps<CourseNodeType>) {
  const [hovered, setHovered] = useState(false)

  const status = data.status ?? 'LOCKED'

  const style = data.mode === 'progress'
    ? STATUS_STYLES[status]
    : data.is_elective ? VIEW_STYLE.elective : VIEW_STYLE.required

  const borderConfig = data.is_elective ? BORDER_CONFIG.elective : BORDER_CONFIG.required
  const labPath = data.lab_paths?.[0]

  const opacityClass = data.isDimmed ? 'opacity-15' : 'opacity-100'
  const scaleClass = data.isHighlighted ? 'scale-[1.08]' : hovered ? 'scale-105' : 'scale-100'

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        w-60 h-40 rounded-full border-[2.5px]
        cursor-pointer select-none transition-all duration-300
        ${style.container}
        ${opacityClass} ${scaleClass}
      `}
      style={{ borderColor: borderConfig.border }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* Lab badge */}
      {labPath && (
        <div
          className="absolute bottom-5 text-[9px] font-extrabold font-mono tracking-wider text-white px-1.5 py-px rounded-full opacity-90"
          style={{ backgroundColor: labPath.color }}
        >
          {labPath.name}
        </div>
      )}

      {/* Course code */}
      <div className={`absolute top-5 text-[12px] font-extrabold font-mono tracking-wider mb-0.5 ${style.code}`}>
        {data.code}
      </div>

      {/* Course name */}
      <div className={`text-[14px] font-bold opacity-90 text-center px-2 leading-[1.4] max-w-[170px] ${style.name}`}>
        {data.name}
      </div>

      {/* Grade badge (Completed) */}
      {data.mode === 'progress' && status === 'COMPLETED' && data.grade && (
        <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#1D9E75] flex items-center justify-center text-[9px] font-extrabold text-white border-[1.5px] border-[#060B14]">
          {data.grade}
        </div>
      )}

      {/* Lock badge (Locked) */}
      {data.mode === 'progress' && status === 'LOCKED' && (
        <div className="absolute -top-1 -right-1 text-[13px]">
          <Lock size={15} color="gray" />
        </div>
      )}

      {/* Info button */}
      {hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            data.onOpenDetail(id)
          }}
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#1E293B] border-[1.5px] text-[10px] font-bold text-white flex items-center justify-center z-10 transition-all hover:border-white shadow-lg"
          style={{ borderColor: borderConfig.border }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = borderConfig.border
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1E293B'
          }}
        >
          Info
        </button>
      )}

      <Handle type="target" position={Position.Top} className="opacity-0 pointer-events-none" />
      <Handle type="source" position={Position.Bottom} className="opacity-0 pointer-events-none" />
    </div>
  )
}
