// src/components/frs/FilterBar.tsx
"use client";

import { ScheduleFilterParams } from "@/services/frsService";

interface FilterBarProps {
  filters: ScheduleFilterParams;
  onChange: (filters: ScheduleFilterParams) => void;
}

const ACADEMIC_YEARS = ["2024/2025", "2025/2026", "2026/2027"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const selectClass =
  "bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer";

function termFromSemester(semester: number): string {
  return semester % 2 !== 0 ? "GANJIL" : "GENAP";
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  function handleSemesterChange(semester: number | "") {
    if (semester === "") {
      onChange({ ...filters, semester: undefined, term: undefined });
    } else {
      onChange({ ...filters, semester, term: termFromSemester(semester) });
    }
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-white/10 bg-[#0f0f1a]">
      <select
        className={selectClass}
        value={filters.academic_year ?? ""}
        onChange={(e) => onChange({ ...filters, academic_year: e.target.value })}
      >
        <option value="" className="bg-[#1a1a2e]">Tahun Akademik</option>
        {ACADEMIC_YEARS.map((y) => (
          <option key={y} value={y} className="bg-[#1a1a2e]">{y}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.semester ?? ""}
        onChange={(e) =>
          handleSemesterChange(e.target.value ? Number(e.target.value) : "")
        }
      >
        <option value="" className="bg-[#1a1a2e]">Semester</option>
        {SEMESTERS.map((s) => (
          <option key={s} value={s} className="bg-[#1a1a2e]">
            Semester {s} — {termFromSemester(s)}
          </option>
        ))}
      </select>

      {/* Show derived term as badge */}
      {filters.term && (
        <div className="flex items-center px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-md text-xs text-blue-400">
          {filters.term}
        </div>
      )}

      <input
        type="text"
        placeholder="Cari mata kuliah..."
        className="bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
        value={filters.course_name ?? ""}
        onChange={(e) => onChange({ ...filters, course_name: e.target.value })}
      />
    </div>
  );
}