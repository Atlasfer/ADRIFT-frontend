'use client'

import { useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
  MarkerType,
  NodeMouseHandler,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { GraphData } from '@/types'
import { getLayoutedElements } from '@/lib/dagreLayout'
import { computeChain } from '@/lib/graphUtils'
import { useGraphStore } from '@/store/graphStore'
import CourseNode, { CourseNodeData, CourseNodeType } from './CourseNode'
import DetailModal from './DetailModal'

const nodeTypes = { courseNode: CourseNode }

interface CurriculumGraphProps {
  data: GraphData
  mode: 'view' | 'progress'
  onClaim?: (courseId: string) => void
  onUnclaim?: (courseId: string) => void
}

function buildRFNodes(
  data: GraphData,
  mode: 'view' | 'progress',
  selectedId: string | null,
  upstream: Set<string>,
  downstream: Set<string>,
  onOpenDetail: (id: string) => void
): CourseNodeType[] {
  return data.nodes.map((n) => {
    const isSelected = n.id === selectedId
    const isHighlighted = upstream.has(n.id) || downstream.has(n.id) || isSelected
    const isDimmed = selectedId !== null && !isHighlighted

    return {
      id: n.id,
      type: 'courseNode' as const,
      position: { x: 0, y: 0 },
      data: {
        code: n.code,
        name: n.name,
        credit: n.credit,
        semester: n.semester,
        is_elective: n.is_elective,
        lab_paths: n.lab_paths,
        status: n.status,
        grade: n.grade,
        mode,
        isHighlighted,
        isDimmed,
        onOpenDetail,
      },
    }
  })
}

function buildRFEdges(
  data: GraphData,
  selectedId: string | null,
  upstream: Set<string>,
  downstream: Set<string>
): Edge[] {
  return data.edges.map((e) => {
    const noSelection = selectedId === null
    const srcIsUp = upstream.has(e.source) || e.source === selectedId
    const tgtIsDown = downstream.has(e.target) || e.target === selectedId
    const tgtIsUp = upstream.has(e.target)
    const srcIsDown = downstream.has(e.source)
    const inChain = noSelection || srcIsUp || tgtIsDown || tgtIsUp || srcIsDown

    const color = noSelection
      ? '#374151'
      : inChain
        ? '#94A3B8'
        : '#1F2937'

    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: color,
        strokeWidth: noSelection ? 1.5 : inChain ? 2.5 : 0.5,
        strokeDasharray: undefined,
        opacity: noSelection ? 0.5 : inChain ? 1 : 0.08,
        transition: 'all 0.3s ease',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color,
        width: 16,
        height: 16,
      },
    }
  })
}

function GraphInner({ data, mode, onClaim, onUnclaim }: CurriculumGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<CourseNodeType>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { fitView } = useReactFlow()

  const selectedId = useGraphStore(s => s.selectedNodeId)
  const chain = useGraphStore(s => s.chain)
  const detailNodeId = useGraphStore(s => s.detailNodeId)
  const selectNode = useGraphStore(s => s.selectNode)
  const clearSelection = useGraphStore(s => s.clearSelection)
  const openDetail = useGraphStore(s => s.openDetail)
  const closeDetail = useGraphStore(s => s.closeDetail)

  useEffect(() => {
    const rfNodes = buildRFNodes(data, mode, selectedId, chain.upstream, chain.downstream, openDetail)
    const rfEdges = buildRFEdges(data, selectedId, chain.upstream, chain.downstream)
    const { nodes: layouted, edges: layoutedEdges } = getLayoutedElements(rfNodes as Node[], rfEdges, 'LR')
    setNodes(layouted as CourseNodeType[])
    setEdges(layoutedEdges)
  }, [data, mode, selectedId, chain, openDetail, setNodes, setEdges])

  useEffect(() => {
    const timer = setTimeout(() => fitView({ padding: 0.15, duration: 600 }), 150)
    return () => clearTimeout(timer)
  }, [fitView])

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    if (selectedId === node.id) {
      clearSelection()
    } else {
      const c = computeChain(node.id, data.edges)
      selectNode(node.id, c.upstream, c.downstream)
    }
  }

  const detailNode = detailNodeId ? data.nodes.find(n => n.id === detailNodeId) : null

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={clearSelection}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.15}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
        className="bg-[#060B14]"
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="rgba(255,255,255,0.05)" />

        <Controls className="bg-[#0A1628]/90 border border-white/10 rounded-xl overflow-hidden" />

        <MiniMap className="bg-[#0A1628]/90! border! border-white/10! rounded-xl!"
          nodeColor={(node) => {
            const d = node.data as CourseNodeData
            if (d.mode === 'progress') {
              if (d.status === 'COMPLETED') return '#1D9E75'
              if (d.status === 'AVAILABLE') return '#F59E0B'
              return '#374151'
            }
            return d.is_elective ? '#7C3AED' : '#2563EB'
          }}
          maskColor="rgba(6,11,20,0.75)"
        />

        {/* Chain info panel */}
        {selectedId && (
          <Panel position="bottom-center" className="mb-2">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0A1628]/95 border border-blue-500/30 backdrop-blur-md shadow-2xl text-xs">
              <span className="text-gray-400">
                <span className="text-red-400 font-bold">{chain.upstream.size}</span> prasyarat upstream
              </span>
              <span className="text-gray-700">·</span>
              <span className="text-gray-400">
                <span className="text-emerald-400 font-bold">{chain.downstream.size}</span> matakuliah terbuka
              </span>
              <button
                onClick={clearSelection}
                className="ml-1 text-gray-500 hover:text-white transition-colors px-2 py-0.5 rounded-md"
              >
                ✕ Clear
              </button>
            </div>
          </Panel>
        )}

        {/* Legend */}
        <Panel position="top-left" className="mt-2 ml-2">
          <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[#0A1628]/85 border border-white/5 backdrop-blur-md text-[11px] text-gray-500 shadow-lg">
            <div className="font-bold text-gray-400 mb-0.5 tracking-wider text-[10px] uppercase">
              Keterangan
            </div>
            
            {[
              { label: 'Prasyarat', color: '#94A3B8', dash: false },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <svg width="28" height="12">
                  <line 
                    x1="0" y1="6" x2="22" y2="6" 
                    stroke={l.color} 
                    strokeWidth="2" 
                    strokeDasharray={l.dash ? '5 2' : 'none'} 
                  />
                  <polygon points="18,3 24,6 18,9" fill={l.color} />
                </svg>
                <span>{l.label}</span>
              </div>
            ))}

            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-4 h-4 rounded-full border-[1.5px] border-dashed border-purple-600 opacity-70" />
              <span>Matakuliah Pilihan</span>
            </div>

            {mode === 'progress' && (
              <div className="mt-1 pt-1.5 border-t border-white/10 flex flex-col gap-1.5">
                {[
                  { label: 'Selesai', color: 'bg-[#1D9E75]' },
                  { label: 'Tersedia', color: 'bg-[#F59E0B]' },
                  { label: 'Terkunci', color: 'bg-[#374151]' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>

      <DetailModal
        nodeId={detailNodeId}
        mode={mode}
        nodeStatus={detailNode?.status}
        onClose={closeDetail}
        onClaim={onClaim}
        onUnclaim={onUnclaim}
      />
    </div>
  )
}

export default function CurriculumGraph(props: CurriculumGraphProps) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  )
}