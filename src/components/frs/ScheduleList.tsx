// src/components/frs/ScheduleList.tsx
"use client";

import { Schedule } from "@/services/frsService";
import { useFrsStore } from "@/store/frsStore";

interface ScheduleListProps {
  schedules: Schedule[];
  isLoading: boolean;
}

// group schedules by course
function groupByCourse(schedules: Schedule[]): Record<string, Schedule[]> {
  return schedules.reduce(
    (acc, s) => {
      if (!acc[s.course_id]) acc[s.course_id] = [];
      acc[s.course_id].push(s);
      return acc;
    },
    {} as Record<string, Schedule[]>
  );
}

export default function ScheduleList({
  schedules,
  isLoading,
}: ScheduleListProps) {
  const { selectedSchedules, addSchedule, removeSchedule } = useFrsStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Memuat jadwal...
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Tidak ada jadwal ditemukan. Pilih filter terlebih dahulu.
      </div>
    );
  }

  const grouped = groupByCourse(schedules);

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto">
      {Object.entries(grouped).map(([courseId, classes]) => {
        const first = classes[0];
        return (
          <div
            key={courseId}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Course header */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-700">
                {first.course_name}
              </span>
              <span className="ml-2 text-xs text-gray-400">
                {first.sks} sks — IF Semester {first.semester}
              </span>
            </div>

            {/* Class rows */}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="px-4 py-2 text-left w-8">Pilih</th>
                  <th className="px-4 py-2 text-left">Kelas</th>
                  <th className="px-4 py-2 text-left">Dosen</th>
                  <th className="px-4 py-2 text-left">Jadwal</th>
                  <th className="px-4 py-2 text-left">Ruang</th>
                  <th className="px-4 py-2 text-left">Kapasitas</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((s) => {
                  const isSelected = selectedSchedules.some(
                    (sel) => sel.id === s.id
                  );
                  return (
                    <tr
                      key={s.id}
                      className={`border-b border-gray-50 cursor-pointer hover:bg-blue-50 transition-colors ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                      onClick={() =>
                        isSelected
                          ? removeSchedule(s.id)
                          : addSchedule(s)
                      }
                    >
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            isSelected
                              ? removeSchedule(s.id)
                              : addSchedule(s)
                          }
                          className="accent-blue-600"
                        />
                      </td>
                      <td className="px-4 py-2 font-medium">{s.class}</td>
                      <td className="px-4 py-2 text-gray-600">
                        {s.lecture_name}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {s.day}, {s.start_time}–{s.end_time}
                      </td>
                      <td className="px-4 py-2 text-gray-600">{s.room}</td>
                      <td className="px-4 py-2 text-gray-600">{s.capacity}</td>
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