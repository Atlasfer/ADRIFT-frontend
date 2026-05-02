import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {getGraph, getProgressGraph, getProgressSummary, getNodeDetail, claimCourse, unclaimCourse,} from '@/lib/api/graph'
import { useGraphStore } from '@/store/graphStore'
import { GraphData } from '@/types'

// Query key
export const graphKeys = {
  all: ['graph'] as const,
  public: () => [...graphKeys.all, 'public'] as const,
  progress: () => [...graphKeys.all, 'progress'] as const,
  summary: () => [...graphKeys.all, 'summary'] as const,
  nodeDetail: (courseId: string) => [...graphKeys.all, 'node', courseId] as const,
}

// Queries
// public graph 
export function usePublicGraph() {
  return useQuery({
    queryKey: graphKeys.public(),
    queryFn: getGraph,
    staleTime: 1000 * 60 * 5,
  })
}

// Proress Page
export function useProgressGraph() {
  return useQuery({
    queryKey: graphKeys.progress(),
    queryFn: getProgressGraph,
    staleTime: 0,
  })
}

// Progress summary
export function useProgressSummary() {
  return useQuery({
    queryKey: graphKeys.summary(),
    queryFn: getProgressSummary,
    staleTime: 0,
  })
}

// Node detail 
export function useNodeDetail(courseId: string | null) {
  return useQuery({
    queryKey: graphKeys.nodeDetail(courseId ?? ''),
    queryFn: () => getNodeDetail(courseId!),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 10,
  })
}

// Klaim matakuliah
export function useClaimCourse() {
  const queryClient = useQueryClient()
  const showToast = useGraphStore(s => s.showToast)

  return useMutation({
    mutationFn: ({ courseId, grade }: { courseId: string; grade?: string }) =>
      claimCourse(courseId, grade),
    onMutate: async ({ courseId }) => {
      // Cancel outgoing refetch
      await queryClient.cancelQueries({ queryKey: graphKeys.progress() })
      await queryClient.cancelQueries({ queryKey: graphKeys.summary() })

      // Simpan data lama
      const previousGraph = queryClient.getQueryData<GraphData>(graphKeys.progress())
      // Update cache graph
      if (previousGraph) {
        queryClient.setQueryData<GraphData>(graphKeys.progress(), {
          ...previousGraph,
          nodes: previousGraph.nodes.map(n => {
            if (n.id === courseId) {
              return { ...n, status: 'COMPLETED', grade: 'A', claimed_at: new Date().toISOString() }
            }
            // Node downstream AVAILABLE
            const isDirectChild = previousGraph.edges.some(
              e => e.source === courseId && e.target === n.id
            )
            if (isDirectChild && n.status === 'LOCKED') {
              return { ...n, status: 'AVAILABLE' }
            }
            return n
          }),
        })
      }

      return { previousGraph }
    },

    onSuccess: (data) => {
      const newlyAvailable = data.newly_available.map(na => na.course_id)
      // Refech data
      queryClient.invalidateQueries({ queryKey: graphKeys.progress() })
      queryClient.invalidateQueries({ queryKey: graphKeys.summary() })
      showToast(`Berhasil diklaim! ${newlyAvailable.length} mata kuliah baru tersedia.`)
    },

    onError: (_err, _vars, context: any) => {
      // Rollback data
      if (context?.previousGraph) {
        queryClient.setQueryData(graphKeys.progress(), context.previousGraph)
      }
      if (context?.previousSummary) {
        queryClient.setQueryData(graphKeys.summary(), context.previousSummary)
      }
      showToast('Gagal mengklaim matakuliah', 'error')
    },
  })
}

// Batalkan klaim matakuliah
export function useUnclaimCourse() {
  const queryClient = useQueryClient()
  const showToast = useGraphStore(s => s.showToast)

  return useMutation({
    mutationFn: ({ courseId }: { courseId: string }) =>
      unclaimCourse(courseId),
    onMutate: async ({ courseId }) => {
      await queryClient.cancelQueries({ queryKey: graphKeys.progress() })
      await queryClient.cancelQueries({ queryKey: graphKeys.summary() })

      const previousGraph = queryClient.getQueryData<GraphData>(graphKeys.progress())

      if (previousGraph) {
        queryClient.setQueryData<GraphData>(graphKeys.progress(), {
          ...previousGraph,
          nodes: previousGraph.nodes.map(n => {
            if (n.id === courseId) {
              return { ...n, status: 'AVAILABLE', grade: null, claimed_at: null }
            }
            // Node downstream LOCKED 
            const isDirectChild = previousGraph.edges.some(
              e => e.source === courseId && e.target === n.id
            )
            if (isDirectChild && n.status === 'AVAILABLE') {
              return { ...n, status: 'LOCKED' }
            }
            return n
          }),
        })
      }


      return { previousGraph }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: graphKeys.progress() })
      queryClient.invalidateQueries({ queryKey: graphKeys.summary() })
      showToast('Klaim mata kuliah dibatalkan')
    },

    onError: (_err, _vars, context: any) => {
      if (context?.previousGraph) {
        queryClient.setQueryData(graphKeys.progress(), context.previousGraph)
      }
      if (context?.previousSummary) {
        queryClient.setQueryData(graphKeys.summary(), context.previousSummary)
      }
      showToast('Gagal membatalkan klaim', 'error')
    },
  })
}