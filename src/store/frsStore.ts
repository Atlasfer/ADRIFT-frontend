import { create } from "zustand";
import { Schedule } from "@/services/frsService";

export interface Conflict {
  type: "TIME" | "LECTURER";
  scheduleA: Schedule;
  scheduleB: Schedule;
  message: string;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function checkConflict(a: Schedule, b: Schedule): Conflict | null {
  if (a.id === b.id) return null;

  const sameDay = a.day === b.day;
  const aStart = toMinutes(a.start_time);
  const aEnd = toMinutes(a.end_time);
  const bStart = toMinutes(b.start_time);
  const bEnd = toMinutes(b.end_time);
  const timeOverlap = sameDay && aStart < bEnd && bStart < aEnd;

  if (timeOverlap) {
    return {
      type: "TIME",
      scheduleA: a,
      scheduleB: b,
      message: `${a.course_name} (${a.class}) bentrok dengan ${b.course_name} (${b.class}) — ${a.day} ${a.start_time}–${a.end_time}`,
    };
  }

  return null;
}

function computeConflicts(selected: Schedule[]): Conflict[] {
  const conflicts: Conflict[] = [];
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const c = checkConflict(selected[i], selected[j]);
      if (c) conflicts.push(c);
    }
  }
  return conflicts;
}

interface FrsState {
  selectedSchedules: Schedule[];
  conflicts: Conflict[];
  planName: string;
  academicYear: string;
  term: string;
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (scheduleId: string) => void;
  setPlanName: (name: string) => void;
  setAcademicYear: (year: string) => void;
  setTerm: (term: string) => void;
  reset: () => void;
}

export const useFrsStore = create<FrsState>((set, get) => ({
  selectedSchedules: [],
  conflicts: [],
  planName: "",
  academicYear: "",
  term: "",

addSchedule: (schedule) => {
  const current = get().selectedSchedules;
  const filtered = current.filter((s) => s.course_name !== schedule.course_name);
  const updated = [...filtered, schedule];
  set({ selectedSchedules: updated, conflicts: computeConflicts(updated) });
},
  
  removeSchedule: (scheduleId) => {
    const updated = get().selectedSchedules.filter((s) => s.id !== scheduleId);
    set({ selectedSchedules: updated, conflicts: computeConflicts(updated) });
  },

  setPlanName: (name) => set({ planName: name }),
  setAcademicYear: (year) => set({ academicYear: year }),
  setTerm: (term) => set({ term }),

  reset: () =>
    set({ selectedSchedules: [], conflicts: [], planName: "" }),
}));