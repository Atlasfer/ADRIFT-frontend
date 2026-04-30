import { CourseNode, CourseEdge } from '@/types'

export function computeLayout(
  nodes: CourseNode[],
  _edges: CourseEdge[],
  containerWidth: number
): { positions: Map<string, { x: number; y: number }>; height: number } {
  const NODE_RADIUS = 52
  const SEMESTER_GAP = 200
  const NODE_GAP = 130
  const PADDING_TOP = 80
  const PADDING_LEFT = 100

  // Group nodes by semester
  const bySemester = new Map<number, CourseNode[]>()
  for (const node of nodes) {
    const s = node.semester
    if (!bySemester.has(s)) bySemester.set(s, [])
    bySemester.get(s)!.push(node)
  }

  const semesters = Array.from(bySemester.keys()).sort((a, b) => a - b)
  const positions = new Map<string, { x: number; y: number }>()

  let maxY = 0
  semesters.forEach((sem, si) => {
    const semNodes = bySemester.get(sem)!
    const totalHeight = semNodes.length * NODE_GAP
    const startY = PADDING_TOP + (si % 2 === 0 ? 0 : 40)

    semNodes.forEach((node, ni) => {
      const x = PADDING_LEFT + si * SEMESTER_GAP + NODE_RADIUS
      const y = startY + ni * NODE_GAP + NODE_RADIUS
      positions.set(node.id, { x, y })
      maxY = Math.max(maxY, y + NODE_RADIUS + 40)
    })
  })

  return { positions, height: Math.max(maxY, 400) }
}

export function getEdgePath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourceRadius: number = 52,
  targetRadius: number = 52
): string {
  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist === 0) return ''

  const sx = sourceX + (dx / dist) * sourceRadius
  const sy = sourceY + (dy / dist) * sourceRadius
  const tx = targetX - (dx / dist) * targetRadius
  const ty = targetY - (dy / dist) * targetRadius

  // Curve control points
  const mx = (sx + tx) / 2
  const my = (sy + ty) / 2
  const offset = Math.min(60, dist * 0.3)
  // Perpendicular offset for curve
  const perpX = -dy / dist * offset
  const perpY = dx / dist * offset

  return `M ${sx},${sy} Q ${mx + perpX},${my + perpY} ${tx},${ty}`
}

export function computeChain(
  nodeId: string,
  edges: CourseEdge[]
): { upstream: Set<string>; downstream: Set<string> } {
  const upstream = new Set<string>()
  const downstream = new Set<string>()

  // BFS upstream (prerequisites)
  const upQueue = [nodeId]
  while (upQueue.length > 0) {
    const current = upQueue.shift()!
    for (const edge of edges) {
      if (edge.target === current && !upstream.has(edge.source)) {
        upstream.add(edge.source)
        upQueue.push(edge.source)
      }
    }
  }

  // BFS downstream (unlocks)
  const downQueue = [nodeId]
  while (downQueue.length > 0) {
    const current = downQueue.shift()!
    for (const edge of edges) {
      if (edge.source === current && !downstream.has(edge.target)) {
        downstream.add(edge.target)
        downQueue.push(edge.target)
      }
    }
  }

  return { upstream, downstream }
}
