// src/components/frs/AlternativePanel.tsx
"use client";

import { Alternative } from "@/services/frsService";
import { useFrsStore } from "@/store/frsStore";
import { X, CheckCircle } from "lucide-react";

interface AlternativePanelProps {
  alternatives: Alternative[];
  onClose: () => void;
}

export default function AlternativePanel({
  alternatives,
  onClose,
}: AlternativePanelProps) {
  const { addSchedule } = useFrsStore();

  function handlePilih(alt: Alternative) {
    alt.schedules.forEach((s) => {
      addSchedule({
        id: s.schedule_id,
        course_id: s.schedule_id,
        course_name: s.course_name,
        sks: s.sks,
        class: s.class,
        day: s.day,
        start_time: s.start_at,
        end_time: s.end_at,
        lecture_id: "",
        lecture_name: s.lecture_name,
        room: "",
        capacity: 0,
        semester: 0,
        prodi: "",
      });
    });
    onClose();
  }

return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#0d0d1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0f0f1a]">
          <div>
            <h2 className="font-bold text-white">Alternatif Jadwal</h2>
            <p className="text-xs text-white/40">Pilih kombinasi jadwal yang tidak bentrok</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          {alternatives.length === 0 ? (
            <div className="text-center py-20 text-white/20 text-sm italic">
              Tidak ada alternatif ditemukan.
            </div>
          ) : (
            alternatives.map((alt, i) => {
              const totalSks = alt.schedules.reduce((sum, s) => sum + s.sks, 0);
              return (
                <div key={i} className="flex flex-col gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter bg-blue-500/10 px-2 py-0.5 rounded">
                      Opsi {i + 1}
                    </span>
                    <span className="text-xs font-medium text-white/40">{totalSks} SKS</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {alt.schedules.map((s, j) => (
                      <div key={j} className="grid grid-cols-[80px_1fr] gap-4 items-start">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-white/60 uppercase">{s.day}</span>
                          <span className="text-[10px] text-white/20 font-mono">{s.start_at}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-white/90 font-medium truncate">{s.course_name}</div>
                          <div className="text-[10px] text-white/40 mt-0.5">
                            Kelas {s.class} • {s.lecture_name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePilih(alt)}
                    className="mt-2 w-full bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/20 rounded-lg py-2 text-xs font-bold transition-all"
                  >
                    Pakai Alternatif Ini
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}