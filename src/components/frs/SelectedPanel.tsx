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
    <div className="flex flex-col gap-4 p-4 h-full bg-[#0f0f1a]">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          Kelas Pilihan
        </h2>
        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
          {selectedSchedules.length} Mata Kuliah
        </span>
      </div>

      {selectedSchedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/5 rounded-xl">
          <p className="text-xs text-white/20">Belum ada kelas yang dipilih.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
            {selectedSchedules.map((s) => (
              <div key={s.id} className="grid grid-cols-[80px_1fr] gap-3 items-start group">
                {/* Kolom Kiri: Waktu - Diberi margin top 3px agar sejajar teks kanan */}
                <div className="flex flex-col mt-[3px] shrink-0">
                  <span className="text-[11px] font-bold text-white/70 uppercase leading-none">
                    {s.day}
                  </span>
                  <span className="text-[9px] text-white/30 font-mono mt-1 leading-none">
                    {s.start_time} - {s.end_time}
                  </span>
                </div>

                {/* Kolom Kanan: Card */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 hover:bg-white/[0.06] transition-all relative">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate leading-tight">
                        {s.course_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-blue-400 font-bold bg-blue-400/10 px-1.5 py-0.5 rounded">
                          Kelas {s.class}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {s.sks} SKS
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSchedule(s.id)}
                      className="text-white/20 hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="mt-2.5 pt-2 border-t border-white/5 space-y-1">
                    <p className="text-[11px] text-white/40 truncate">👨‍🏫 {s.lecture_name}</p>
                    <p className="text-[11px] text-white/20 italic tracking-tight">📍 {s.room || "TBA"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 space-y-4">
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs text-white/40">Total Beban</span>
              <span className="text-sm font-bold text-white">{totalSks} SKS</span>
            </div>
            <ConflictAlert conflicts={conflicts} />
          </div>
        </>
      )}

      {/* Footer Controls tetap sama... */}
      <div className="mt-4 space-y-3">
        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-[11px] text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <input
          type="text"
          placeholder="Nama Rencana..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
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
            className="flex-1 bg-white/5 border border-white/10 text-white/60 rounded-lg py-2.5 text-xs font-semibold hover:bg-white/10 transition-all disabled:opacity-30"
          >
            {isFindingAlts ? "Memproses..." : "Alternatif"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-xs font-bold hover:bg-blue-500 transition-all disabled:opacity-30"
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}