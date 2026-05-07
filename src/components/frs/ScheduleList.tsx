"use client";

import { Schedule } from "@/services/frsService";
import { useFrsStore } from "@/store/frsStore";

interface ScheduleListProps {
  schedules: Schedule[];
  isLoading: boolean;
}

function groupByCourse(schedules: Schedule[]): Record<string, Schedule[]> {
  return schedules.reduce(
    (acc, s) => {
      const key = s.course_name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    },
    {} as Record<string, Schedule[]>
  );
}

export default function ScheduleList({ schedules, isLoading }: ScheduleListProps) {
  const { selectedSchedules, addSchedule, removeSchedule } = useFrsStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-white/30 text-sm">
        Memuat jadwal...
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-white/30 text-sm">
        Tidak ada jadwal. Pilih filter terlebih dahulu.
      </div>
    );
  }

  const grouped = groupByCourse(schedules);

  return (
    <div className="flex flex-col gap-3 p-4">
      {Object.entries(grouped).map(([courseName, classes]) => {
        const first = classes[0];
        return (
          <div
            key={courseName}
            className="border border-white/10 rounded-lg overflow-hidden"
          >
            {/* Course header */}
            <div className="bg-white/5 px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                {first.course_name}
              </span>
              <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                {first.sks} SKS · Sem {first.semester} · {first.prodi}
              </span>
            </div>

            {/* Class rows */}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-white/30 border-b border-white/5">
                  <th className="px-4 py-2 text-left w-8"></th>
                  <th className="px-4 py-2 text-left">Kelas</th>
                  <th className="px-4 py-2 text-left">Dosen</th>
                  <th className="px-4 py-2 text-left">Jadwal</th>
                  <th className="px-4 py-2 text-left">Ruang</th>
                  <th className="px-4 py-2 text-left">Kapasitas</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((s) => {
                  const isSelected = selectedSchedules.some((sel) => sel.id === s.id);
                  return (
                    <tr
                      key={s.id}
                      onClick={() => isSelected ? removeSchedule(s.id) : addSchedule(s)}
                      className={`border-b border-white/5 cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-600/20" : "hover:bg-white/5"
                      }`}
                    >
                      <td className="px-4 py-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isSelected ? "bg-blue-600 border-blue-600" : "border-white/20"
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-medium text-white">{s.class}</td>
                      <td className="px-4 py-2.5 text-white/60">{s.lecture_name}</td>
                      <td className="px-4 py-2.5 text-white/60">
                        {s.day}, {s.start_time}–{s.end_time}
                      </td>
                      <td className="px-4 py-2.5 text-white/60">{s.room}</td>
                      <td className="px-4 py-2.5 text-white/60">{s.capacity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}