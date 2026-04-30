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
  container: string; code: string; name: string; border: string;
}> = {
  COMPLETED: {
    container: 'bg-[radial-gradient(circle_at_40%_40%,#0D3B2B,#061A12)] border-[#1D9E75]',
    code: 'text-[#34D399]',
    name: 'text-[#6EE7B7]',
    border: '#1D9E75',
  },
  AVAILABLE: {
    container: 'bg-[radial-gradient(circle_at_40%_40%,#3B2800,#1A1000)] border-[#F59E0B]',
    code: 'text-[#FCD34D]',
    name: 'text-[#FDE68A]',
    border: '#F59E0B',
  },
  LOCKED: {
    container: 'bg-[radial-gradient(circle_at_40%_40%,#1A1A2E,#0D0D1A)] border-[#374151]',
    code: 'text-[#6B7280]',
    name: 'text-[#4B5563]',
    border: '#374151',
  },
}

const VIEW_STYLE = {
  required: {
    container: 'bg-[radial-gradient(circle_at_40%_40%,#0D1B3E,#060B1E)] border-[#2563EB]',
    code: 'text-[#93C5FD]',
    name: 'text-[#BFDBFE]',
    border: '#2563EB',
  },
  elective: {
    container: 'bg-[radial-gradient(circle_at_40%_40%,#1E0D3E,#0D061E)] border-[#7C3AED]',
    code: 'text-[#C4B5FD]',
    name: 'text-[#DDD6FE]',
    border: '#7C3AED',
  },
}

export default function CourseNode({ id, data }: NodeProps<CourseNodeType>) {
  const [hovered, setHovered] = useState(false)

  const status = data.status ?? 'LOCKED'
  const style = data.mode === 'progress'
    ? STATUS_STYLES[status]
    : data.is_elective ? VIEW_STYLE.elective : VIEW_STYLE.required

  const labPath = data.lab_paths?.[0]

  const opacityClass = data.isDimmed ? 'opacity-15' : 'opacity-100'
  const scaleClass = data.isHighlighted ? 'scale-[1.08]' : hovered ? 'scale-105' : 'scale-100'

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        w-30 h-30 rounded-full border-[2.5px]
        cursor-pointer select-none transition-all duration-300
        cubic-bezier-[0.34,1.56,0.64,1]
        ${style.container}
        ${opacityClass} ${scaleClass}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {/* Outer ring for elective */}
      {data.is_elective && (
        <div 
          className="absolute -inset-1.5 rounded-full border-[1.5px] border-dashed opacity-50 pointer-events-none"
          style={{ borderColor: style.border }}/>
      )}

      {/* Lab badge */}
      {labPath && (
        <div 
          className="absolute bottom-3 text-[7.5px] font-extrabold font-mono tracking-wider text-white px-1.5 py-px rounded-full opacity-90"
          style={{ backgroundColor: labPath.color }}>
          {labPath.name}
        </div>
      )}

      {/* Course code */}
      <div className={` text-[12px] font-extrabold font-mono tracking-wider mb-0.5 ${style.code}`}>
        {data.code}
      </div>

      {/* Course name */}
      <div className={`text-[8px] opacity-80 text-center px-3.5 leading-[1.3] max-w-22.5 ${style.name}`}>
        {data.name.length > 18 ? data.name.slice(0, 17) + '…' : data.name}
      </div>

      {/* Grade badge (Completed) */}
      {data.mode === 'progress' && status === 'COMPLETED' && data.grade && (
        <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#1D9E75] flex items-center justify-center text-[9px] font-extrabold text-white border-[1.5px] border-[#060B14]">
          {data.grade}
        </div>
      )}

      {/* Lock badge (Locked) */}
      {data.mode === 'progress' && status === 'LOCKED' && (
        <div className="absolute -top-1 -right-1 text-[13px] opacity-45"><Lock size={15} /></div>
      )}

      {/* Info button */}
      {hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            data.onOpenDetail(id)
          }}
          className={`
            absolute -bottom-7 left-1/2 -translate-x-1/2
            px-3 py-1 rounded-full 
            bg-[#1E293B] border-[1.5px] text-[10px] font-bold
            flex items-center justify-center z-10 transition-all
            hover:text-white hover:border-white shadow-lg 
          `}
          style={{ borderColor: style.border}}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = style.border
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1E293B'
          }}>
          Info
        </button>
      )}
      {/* Handles */}
      <Handle type="target" position={Position.Left} className="opacity-0 pointer-events-none" />
      <Handle type="source" position={Position.Right} className="opacity-0 pointer-events-none" />
    </div>
  )
}