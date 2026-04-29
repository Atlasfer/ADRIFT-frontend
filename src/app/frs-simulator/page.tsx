// src/app/frs-simulator/page.tsx
"use client";

import { useState } from "react";
import FilterBar from "@/components/frs/FilterBar";
import ScheduleList from "@/components/frs/ScheduleList";
import SelectedPanel from "@/components/frs/SelectedPanel";
import AlternativePanel from "@/components/frs/AlternativePanel";
import SavedPlans from "@/components/frs/SavedPlans";
import { useSchedules } from "@/hooks/useFrs";
import { ScheduleFilterParams } from "@/services/frsService";
import { Alternative } from "@/services/frsService";
import { useFrsStore } from "@/store/frsStore";

type Tab = "simulator" | "saved";

export default function FrsSimulatorPage() {
  const [tab, setTab] = useState<Tab>("simulator");
  const [filters, setFilters] = useState<ScheduleFilterParams>({});
  const [alternatives, setAlternatives] = useState<Alternative[] | null>(null);
  const { setAcademicYear, setTerm } = useFrsStore();

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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top nav */}
      <div className="flex items-center gap-1 px-4 pt-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => setTab("simulator")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "simulator"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Simulasi FRS
        </button>
        <button
          onClick={() => setTab("saved")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "saved"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Rencana Tersimpan
        </button>
      </div>

      {tab === "simulator" ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Left — filter + schedule list */}
          <div className="flex flex-col flex-1 overflow-hidden border-r border-gray-200">
            <FilterBar filters={filters} onChange={handleFilterChange} />
            <div className="flex-1 overflow-y-auto">
              <ScheduleList schedules={schedules} isLoading={isLoading} />
            </div>
          </div>

          {/* Right — selected panel */}
          <div className="w-80 bg-white overflow-y-auto shrink-0">
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