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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="font-semibold text-white">Alternatif Jadwal</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {alternatives.length === 0 && (
            <p className="text-sm text-white/40 text-center py-8">
              Tidak ada alternatif ditemukan.
            </p>
          )}

          {alternatives.map((alt, i) => {
            const totalSks = alt.schedules.reduce((sum, s) => sum + s.sks, 0);
            return (
              <div key={i} className="border border-white/10 rounded-lg overflow-hidden">
                <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    Alternatif {i + 1}
                  </span>
                  <span className="text-xs text-white/30">{totalSks} SKS</span>
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-white/30 border-b border-white/10">
                      <th className="px-4 py-2 text-left">Kelas</th>
                      <th className="px-4 py-2 text-left">Dosen</th>
                      <th className="px-4 py-2 text-left">Waktu</th>
                      <th className="px-4 py-2 text-right">SKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alt.schedules.map((s, j) => (
                      <tr key={j} className="border-b border-white/5">
                        <td className="px-4 py-2">
                          <div className="font-medium text-white">{s.course_name}</div>
                          <div className="text-xs text-white/40">Kelas {s.class}</div>
                        </td>
                        <td className="px-4 py-2 text-white/60">{s.lecture_name}</td>
                        <td className="px-4 py-2 text-white/60">
                          {s.day}, {s.start_at}–{s.end_at}
                        </td>
                        <td className="px-4 py-2 text-right text-white/60">{s.sks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="px-4 py-3 border-t border-white/10">
                  <button
                    onClick={() => handlePilih(alt)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 text-sm transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Pakai Alternatif Ini
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}