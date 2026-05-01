// src/app/frs-simulator/page.tsx
"use client";

import { useState } from "react";
import FilterBar from "@/components/frs/FilterBar";
import ScheduleList from "@/components/frs/ScheduleList";
import SelectedPanel from "@/components/frs/SelectedPanel";
import AlternativePanel from "@/components/frs/AlternativePanel";
import SavedPlans from "@/components/frs/SavedPlans";
import { useSchedules } from "@/hooks/useFrs";
import { ScheduleFilterParams, Alternative } from "@/services/frsService";
import { useFrsStore } from "@/store/frsStore";
import { LayoutGrid, BookMarked } from "lucide-react";

type Tab = "simulator" | "saved";

export default function FrsSimulatorPage() {
  const [tab, setTab] = useState<Tab>("simulator");
  const [filters, setFilters] = useState<ScheduleFilterParams>({});
  const [alternatives, setAlternatives] = useState<Alternative[] | null>(null);
  const { setAcademicYear, setTerm, selectedSchedules } = useFrsStore();

  const { data: schedules = [], isLoading } = useSchedules(filters);

  function handleFilterChange(newFilters: ScheduleFilterParams) {
    setFilters(newFilters);
    if (newFilters.academic_year) setAcademicYear(newFilters.academic_year);
    if (newFilters.term) setTerm(newFilters.term);
  }

  function handleSaveSuccess() {
    setTab("saved");
  }

  return (
    <div className="flex flex-col h-screen bg-[#0d0d1a] text-white">

      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0f0f1a] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-blue-400 font-bold tracking-tight text-lg">ADRIFT</span>
          <span className="text-white/20 text-sm">FRS Simulator</span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setTab("simulator")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              tab === "simulator"
                ? "bg-blue-600 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Simulasi
          </button>
          <button
            onClick={() => setTab("saved")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              tab === "saved"
                ? "bg-blue-600 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            Tersimpan
          </button>
        </div>

        {/* SKS counter */}
        <div className="text-xs text-white/30">
          <span className="text-white font-semibold">
            {selectedSchedules.reduce((s, c) => s + c.sks, 0)}
          </span>{" "}
          SKS dipilih
        </div>
      </header>

      {tab === "simulator" ? (
        <div className="flex flex-1 overflow-hidden">

          {/* Left — schedule list */}
          <div className="flex flex-col flex-1 overflow-hidden border-r border-white/10">
            <FilterBar filters={filters} onChange={handleFilterChange} />
            <div className="flex-1 overflow-y-auto">
              <ScheduleList schedules={schedules} isLoading={isLoading} />
            </div>
          </div>

          {/* Right — selected panel */}
          <div className="w-72 bg-[#0f0f1a] overflow-y-auto shrink-0">
            <SelectedPanel
              onAlternativesFound={setAlternatives}
              onSaveSuccess={handleSaveSuccess}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <SavedPlans />
        </div>
      )}

      {/* Alternative modal */}
      {alternatives && (
        <AlternativePanel
          alternatives={alternatives}
          onClose={() => setAlternatives(null)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}