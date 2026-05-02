// src/hooks/useFrs.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSchedules,
  fetchPlans,
  fetchPlanDetail,
  savePlan,
  fetchAlternatives,
  ScheduleFilterParams,
  SavePlanPayload,
} from "@/services/frsService";

export function useSchedules(params: ScheduleFilterParams) {
  return useQuery({
    queryKey: ["frs-schedules", params],
    queryFn: async () => {
      const result = await fetchSchedules(params);
      return result ?? [];
    },
    enabled: !!params.academic_year && !!params.term,
  });
}

export function usePlans() {
  return useQuery({
    queryKey: ["frs-plans"],
    queryFn: fetchPlans,
  });
}

export function usePlanDetail(planId: string | null) {
  return useQuery({
    queryKey: ["frs-plan", planId],
    queryFn: () => fetchPlanDetail(planId!),
    enabled: !!planId,
  });
}

export function useSavePlan(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SavePlanPayload) => savePlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frs-plans"] });
      onSuccess?.();
    },
  });
}

export function useAlternatives() {
  return useMutation({
    mutationFn: (payload: SavePlanPayload) => fetchAlternatives(payload),
  });
}