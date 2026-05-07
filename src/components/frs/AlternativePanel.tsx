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
            <h2 className="font-bold text-white tracking-tight">Alternatif Jadwal</h2>
            <p className="text-[11px] text-white/40 mt-0.5">Pilih kombinasi jadwal yang tidak bentrok untuk simulasi ini.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar bg-[#0d0d1a]">
          {alternatives.length === 0 ? (
            <div className="text-center py-20 text-white/20 text-sm italic">
              Tidak ada alternatif ditemukan.
            </div>
          ) : (
            alternatives.map((alt, i) => {
              const totalSks = alt.schedules.reduce((sum, s) => sum + s.sks, 0);
              return (
                <div key={i} className="flex flex-col gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      OPSI {i + 1}
                    </span>
                    <span className="text-xs font-bold text-white/40">{totalSks} SKS TERPILIH</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {alt.schedules.map((s, j) => (
                      <div key={j} className="grid grid-cols-[85px_1fr] gap-4 items-start">
                        {/* Hari Sejajar Matkul */}
                        <div className="flex flex-col mt-[3px] shrink-0">
                          <span className="text-[10px] font-bold text-white/60 uppercase leading-none tracking-wider">{s.day}</span>
                          <span className="text-[9px] text-white/20 font-mono mt-1.5 leading-none tracking-tighter italic">
                            {s.start_at} - {s.end_at}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-white/90 font-semibold truncate leading-tight mb-1.5">{s.course_name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-blue-400 font-bold bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/10">
                              Kelas {s.class}
                            </span>
                            <span className="text-white/10 text-[8px]">•</span>
                            <span className="text-[10px] text-white/40 truncate italic">{s.lecture_name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePilih(alt)}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2.5 text-xs font-bold transition-all shadow-lg shadow-blue-600/10 active:scale-[0.98]"
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