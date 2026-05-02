// src/components/frs/SelectedPanel.tsx
"use client";

import { useFrsStore } from "@/store/frsStore";
import { useSavePlan, useAlternatives } from "@/hooks/useFrs";
import ConflictAlert from "./ConflictAlert";
import { Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";

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

  const [error, setError] = useState<string | null>(null);

  const totalSks = selectedSchedules.reduce((sum, s) => sum + s.sks, 0);
  const hasTimeConflict = conflicts.some((c) => c.type === "TIME");

  const { mutate: save, isPending: isSaving } = useSavePlan(() => {
    reset();
    setError(null);
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
  if (selectedSchedules.length === 0) {
    setError("Kamu belum memilih kelas apapun. Pilih kelas dulu dari daftar di sebelah kiri.");
    return;
  }
  if (!planName.trim()) {
    setError("Kasih nama rencana ini dulu, biar gampang dicari nanti. Isi kolom nama di bawah.");
    return;
  }
  if (!academicYear) {
    setError("Pilih tahun akademik dulu lewat filter di sebelah kiri.");
    return;
  }
  if (!term) {
    setError("Pilih semester dulu lewat filter di sebelah kiri.");
    return;
  }
  if (hasTimeConflict) {
    setError("Ada jadwal yang bentrok! Ganti salah satu kelas yang konflik sebelum menyimpan.");
    return;
  }
  setError(null);
  save(buildPayload(), {
    onError: () => setError("Gagal menyimpan rencana. Coba lagi dalam beberapa saat."),
  });
}

  function handleAlternative() {
    if (selectedSchedules.length === 0) {
      setError("Kamu belum memilih kelas apapun. Pilih kelas dulu dari daftar di sebelah kiri.");
      return;
    }
    if (!planName.trim()) {
      setError("Kasih nama rencana ini dulu sebelum mencari alternatif. Isi kolom nama di bawah.");
      return;
    }
    if (!academicYear || !term) {
      setError("Pilih tahun akademik dan semester dulu lewat filter di sebelah kiri.");
      return;
    }
    setError(null);
    findAlts(buildPayload(), {
      onSuccess: (data) => onAlternativesFound(data),
      onError: () => setError("Gagal mencari alternatif. Coba lagi dalam beberapa saat."),
    });
  }

  return (
    <div className="flex flex-col gap-3 p-4 h-full">
      <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">
        Kelas Pilihan
      </h2>

      {selectedSchedules.length === 0 ? (
        <p className="text-xs text-white/30 mt-2">Belum ada kelas dipilih.</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {selectedSchedules.map((s) => (
              <div
                key={s.id}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 flex items-start justify-between gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {s.course_name}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">
                    Kelas {s.class} · {s.day} {s.start_time}–{s.end_time}
                  </div>
                  <div className="text-xs text-white/30">{s.lecture_name}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-blue-400 font-medium">
                    {s.sks} SKS
                  </span>
                  <button
                    onClick={() => removeSchedule(s.id)}
                    className="text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-2">
            <span className="text-xs text-white/40">Total SKS</span>
            <span className="text-sm font-bold text-white">{totalSks}</span>
          </div>

          <ConflictAlert conflicts={conflicts} />
        </>
      )}

      <div className="flex-1" />

      {/* Error notif */}
      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <input
        type="text"
        placeholder="Nama Rencana..."
        className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={planName}
        onChange={(e) => {
          setPlanName(e.target.value);
          if (error) setError(null);
        }}
      />

      <div className="flex gap-2">
        <button
          onClick={handleAlternative}
          disabled={isFindingAlts}
          className="flex-1 border border-white/20 text-white/70 rounded-md py-2 text-sm hover:bg-white/5 transition-colors disabled:opacity-30"
        >
          {isFindingAlts ? "Mencari..." : "Alternatif"}
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 bg-blue-600 text-white rounded-md py-2 text-sm hover:bg-blue-700 transition-colors disabled:opacity-30"
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}