// src/services/frsService.ts
import apiClient from "@/lib/axios";

export interface Schedule {
  id: string;
  course_id: string;
  course_name: string;
  sks: number;
  class: string;
  day: string;
  start_time: string;
  end_time: string;
  lecture_id: string;
  lecture_name: string;
  room: string;
  capacity: number;
  semester: number;
  prodi: string;
}

export interface FrsPlan {
  id: string;
  plan_name: string;
  academic_year: string;
  term: string;
  total_credit: number;
  course_count: number;
  created_at: string;
}

export interface FrsPlanDetail extends FrsPlan {
  items: {
    id: string;
    schedule_id: string;
    course_code: string;
    course_name: string;
    class: string;
    day: string;
    start_time: string;
    end_time: string;
    lecture_name: string;
    room: string;
    credit: number;
  }[];
}

export interface AlternativeSchedule {
  schedule_id: string;
  course_name: string;
  class: string;
  lecture_name: string;
  day: string;
  start_at: string;
  end_at: string;
  sks: number;
}

export interface Alternative {
  schedules: AlternativeSchedule[];
}

export interface ScheduleFilterParams {
  academic_year?: string;
  term?: string;
  prodi?: string;
  semester?: number;
  course_name?: string;
  lecture_name?: string;
}

export interface SavePlanPayload {
  plan_name: string;
  academic_year: string;
  term: string;
  total_credit: number;
  schedule_ids: string[];
}

// GET /api/frs/schedules
export async function fetchSchedules(
  params: ScheduleFilterParams
): Promise<Schedule[]> {
  const firstRes = await apiClient.get("/api/frs/schedules", {
    params: { ...params, take: 100, page: 0 },
  });
  return firstRes.data.data ?? [];
}

export async function savePlan(payload: SavePlanPayload): Promise<void> {
  await apiClient.post("/api/frs", payload);
}

export async function fetchPlans(): Promise<FrsPlan[]> {
  const res = await apiClient.get("/api/frs");
  return res.data.data ?? [];
}

export async function fetchPlanDetail(planId: string): Promise<FrsPlanDetail> {
  const res = await apiClient.get(`/api/frs/${planId}`);
  return res.data.data;
}


// POST /frs/alternative
export async function fetchAlternatives(
  payload: SavePlanPayload
): Promise<Alternative[]> {
  const res = await apiClient.post("/api/frs/alternative", payload);
  return res.data.data.alternatives;
}