// src/app/frs-simulator/page.tsx
"use client";

import { useState, useRef, useCallback } from "react";
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

  // resizable panel
  const [leftWidth, setLeftWidth] = useState(65); // percentage
  const isResizing = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: schedules = [], isLoading } = useSchedules(filters);

  function handleFilterChange(newFilters: ScheduleFilterParams) {
    setFilters(newFilters);
    if (newFilters.academic_year) setAcademicYear(newFilters.academic_year);
    if (newFilters.term) setTerm(newFilters.term);
  }

  function handleSaveSuccess() {
    setTab("saved");
  }

  const handleMouseDown = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isResizing.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
    if (newLeftWidth > 30 && newLeftWidth < 80) {
      setLeftWidth(newLeftWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0d0d1a] text-white">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0f0f1a] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-blue-400 font-bold tracking-tight text-lg">ADRIFT</span>
          <span className="text-white/20 text-sm">FRS Simulator</span>
        </div>

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

        <div className="text-xs text-white/30">
          <span className="text-white font-semibold">
            {selectedSchedules.reduce((s, c) => s + c.sks, 0)}
          </span>{" "}
          SKS dipilih
        </div>
      </header>

      {tab === "simulator" ? (
        <div
          ref={containerRef}
          className="flex flex-1 overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Left — schedule list */}
          <div
            className="flex flex-col overflow-hidden border-r border-white/10"
            style={{ width: `${leftWidth}%` }}
          >
            <FilterBar filters={filters} onChange={handleFilterChange} />
            <div className="flex-1 overflow-y-auto">
              <ScheduleList schedules={schedules} isLoading={isLoading} />
            </div>
          </div>

          {/* Divider */}
          <div
            onMouseDown={handleMouseDown}
            className="w-1 bg-white/5 hover:bg-blue-500/50 active:bg-blue-500 cursor-col-resize transition-colors shrink-0 relative group"
          >
            {/* grip dots */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-white/50" />
              ))}
            </div>
          </div>

          {/* Right — selected panel */}
          <div
            className="bg-[#0f0f1a] overflow-y-auto shrink-0"
            style={{ width: `${100 - leftWidth}%` }}
          >
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