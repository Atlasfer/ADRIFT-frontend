"use client";

import { ScheduleFilterParams } from "@/services/frsService";
import { Search } from "lucide-react";

interface FilterBarProps {
  filters: ScheduleFilterParams;
  onChange: (filters: ScheduleFilterParams) => void;
}

const ACADEMIC_YEARS = ["2024/2025", "2025/2026", "2026/2027"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const PRODIS = ["IF", "IUP", "RKA", "RPL", "S2", "S3"];

const selectClass =
  "bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer";

function termFromSemester(semester: number): string {
  return semester % 2 !== 0 ? "GANJIL" : "GENAP";
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-2 p-4 border-b border-white/10 bg-[#0f0f1a]">
      {/* Row 1 — dropdowns */}
      <div className="flex flex-wrap gap-2">
        {/* Tahun Akademik */}
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

        {/* Semester */}
        <select
          className={selectClass}
          value={filters.semester ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            if (!val) {
              onChange({ ...filters, semester: undefined, term: undefined });
            } else {
              const sem = Number(val);
              onChange({ ...filters, semester: sem, term: termFromSemester(sem) });
            }
          }}
        >
          <option value="" className="bg-[#1a1a2e]">Semester</option>
          {SEMESTERS.map((s) => (
            <option key={s} value={s} className="bg-[#1a1a2e]">Semester {s}</option>
          ))}
        </select>

        {/* Term — auto dari semester tapi bisa override */}
        <select
          className={selectClass}
          value={filters.term ?? ""}
          onChange={(e) => onChange({ ...filters, term: e.target.value })}
        >
          <option value="" className="bg-[#1a1a2e]">Term</option>
          <option value="GANJIL" className="bg-[#1a1a2e]">GANJIL</option>
          <option value="GENAP" className="bg-[#1a1a2e]">GENAP</option>
        </select>

        {/* Prodi */}
        <select
          className={selectClass}
          value={filters.prodi ?? ""}
          onChange={(e) => onChange({ ...filters, prodi: e.target.value })}
        >
          <option value="" className="bg-[#1a1a2e]">Semua Prodi</option>
          {PRODIS.map((p) => (
            <option key={p} value={p} className="bg-[#1a1a2e]">{p}</option>
          ))}
        </select>
      </div>

      {/* Row 2 — search */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Cari mata kuliah..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.course_name ?? ""}
            onChange={(e) => onChange({ ...filters, course_name: e.target.value })}
          />
        </div>

        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Cari dosen..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.lecture_name ?? ""}
            onChange={(e) => onChange({ ...filters, lecture_name: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}