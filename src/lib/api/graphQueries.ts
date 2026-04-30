import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getGraph,
  getProgressGraph,
  getProgressSummary,
  getNodeDetail,
  claimCourse,
  unclaimCourse,
} from '@/lib/api/graph'
import { useGraphStore } from '@/store/graphStore'

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

    onSuccess: (data) => {
      const newlyAvailable = data.newly_available.map(na => na.course_id)
      // Refech data
      queryClient.invalidateQueries({ queryKey: graphKeys.progress() })
      queryClient.invalidateQueries({ queryKey: graphKeys.summary() })
      showToast(`✓ Berhasil diklaim! ${newlyAvailable.length} matakuliah baru tersedia.`)
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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: graphKeys.progress() })
      queryClient.invalidateQueries({ queryKey: graphKeys.summary() })
      showToast('Klaim matakuliah dibatalkan')
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