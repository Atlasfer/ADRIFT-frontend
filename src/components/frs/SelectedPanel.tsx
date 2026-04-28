// src/components/frs/SelectedPanel.tsx
"use client";

import { useFrsStore } from "@/store/frsStore";
import { useSavePlan, useAlternatives } from "@/hooks/useFrs";
import ConflictAlert from "./ConflictAlert";
import { Trash2 } from "lucide-react";

interface SelectedPanelProps {
  onAlternativesFound: (alts: any[]) => void;
  onSaveSuccess: () => void;
}

export default function SelectedPanel({
  onAlternativesFound,
  onSaveSuccess,
}: SelectedPanelProps) {
  const {
    selectedSchedules,
    conflicts,
    planName,
    academicYear,
    term,
    setPlanName,
    removeSchedule,
    reset,
  } = useFrsStore();

  const totalSks = selectedSchedules.reduce((sum, s) => sum + s.sks, 0);
  const hasTimeConflict = conflicts.some((c) => c.type === "TIME");

  const { mutate: save, isPending: isSaving } = useSavePlan(() => {
    reset();
    onSaveSuccess();
  });

  const { mutate: findAlts, isPending: isFindingAlts } = useAlternatives();

  function buildPayload() {
    return {
      plan_name: planName,
      academic_year: academicYear,
      term: term,
      total_credit: totalSks,
      schedule_ids: selectedSchedules.map((s) => s.id),
    };
  }

  function handleSave() {
    if (!planName.trim()) return alert("Isi nama rencana dulu!");
    if (hasTimeConflict)
      return alert("Selesaikan konflik jadwal sebelum menyimpan!");
    save(buildPayload());
  }

  function handleAlternative() {
    if (selectedSchedules.length === 0)
      return alert("Pilih mata kuliah dulu!");
    findAlts(buildPayload(), {
      onSuccess: (data) => onAlternativesFound(data),
    });
  }

  return (
    <div className="flex flex-col gap-3 p-4 h-full">
      <h2 className="text-sm font-semibold text-gray-700">Kelas Pilihan</h2>

      {selectedSchedules.length === 0 ? (
        <p className="text-xs text-gray-400 mt-2">
          Belum ada kelas dipilih.
        </p>
      ) : (
        <>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="text-left py-1">Kelas</th>
                <th className="text-left py-1">Dosen</th>
                <th className="text-left py-1">Waktu</th>
                <th className="text-right py-1">SKS</th>
                <th className="py-1"></th>
              </tr>
            </thead>
            <tbody>
              {selectedSchedules.map((s) => (
                <tr key={s.id} className="border-b border-gray-50">
                  <td className="py-1.5">
                    <div className="font-medium">{s.course_name}</div>
                    <div className="text-gray-400">
                      Kelas {s.class}
                    </div>
                  </td>
                  <td className="py-1.5 text-gray-600">{s.lecture_name}</td>
                  <td className="py-1.5 text-gray-600">
                    {s.day}, {s.start_time}–{s.end_time}
                  </td>
                  <td className="py-1.5 text-right text-gray-600">{s.sks}</td>
                  <td className="py-1.5 text-right">
                    <button
                      onClick={() => removeSchedule(s.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total SKS */}
          <div className="text-xs font-semibold text-gray-700 text-right border-t border-gray-100 pt-2">
            Total SKS: {totalSks}
          </div>

          {/* Conflict alerts */}
          <ConflictAlert conflicts={conflicts} />
        </>
      )}

      {/* Plan Name Input */}
      <input
        type="text"
        placeholder="Nama Rencana..."
        className="mt-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={planName}
        onChange={(e) => setPlanName(e.target.value)}
      />

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleAlternative}
          disabled={isFindingAlts || selectedSchedules.length === 0}
          className="flex-1 border border-blue-600 text-blue-600 rounded-md py-2 text-sm hover:bg-blue-50 transition-colors disabled:opacity-40"
        >
          {isFindingAlts ? "Mencari..." : "Alternatif"}
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || selectedSchedules.length === 0}
          className="flex-1 bg-blue-600 text-white rounded-md py-2 text-sm hover:bg-blue-700 transition-colors disabled:opacity-40"
        >
          {isSaving ? "Menyimpan..." : "Simpan Jadwal"}
        </button>
      </div>
    </div>
  );
}