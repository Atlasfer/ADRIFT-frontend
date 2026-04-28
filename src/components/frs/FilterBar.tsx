// src/components/frs/FilterBar.tsx
"use client";

import { ScheduleFilterParams } from "@/services/frsService";

interface FilterBarProps {
  filters: ScheduleFilterParams;
  onChange: (filters: ScheduleFilterParams) => void;
}

const ACADEMIC_YEARS = ["2024/2025", "2025/2026", "2026/2027"];
const TERMS = ["GANJIL", "GENAP"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  function update(key: keyof ScheduleFilterParams, value: string | number) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-white border-b border-gray-200">
      {/* Academic Year */}
      <select
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filters.academic_year ?? ""}
        onChange={(e) => update("academic_year", e.target.value)}
      >
        <option value="">Tahun Akademik</option>
        {ACADEMIC_YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {/* Term */}
      <select
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filters.term ?? ""}
        onChange={(e) => update("term", e.target.value)}
      >
        <option value="">Semester</option>
        {TERMS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Semester */}
      <select
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filters.semester ?? ""}
        onChange={(e) =>
          update("semester", e.target.value ? Number(e.target.value) : "")
        }
      >
        <option value="">Pilih Semester</option>
        {SEMESTERS.map((s) => (
          <option key={s} value={s}>
            Semester {s}
          </option>
        ))}
      </select>

      {/* Course Name Search */}
      <input
        type="text"
        placeholder="Cari Mata Kuliah..."
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
        value={filters.course_name ?? ""}
        onChange={(e) => update("course_name", e.target.value)}
      />
    </div>
  );
}