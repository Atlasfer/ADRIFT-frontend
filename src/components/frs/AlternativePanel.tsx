// src/components/frs/AlternativePanel.tsx
"use client";

import { Alternative } from "@/services/frsService";
import { useFrsStore } from "@/store/frsStore";
import { useSavePlan } from "@/hooks/useFrs";
import { X } from "lucide-react";

interface AlternativePanelProps {
  alternatives: Alternative[];
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function AlternativePanel({
  alternatives,
  onClose,
  onSaveSuccess,
}: AlternativePanelProps) {
  const { planName, setPlanName, reset } = useFrsStore();

  const { mutate: save, isPending } = useSavePlan(() => {
    reset();
    onSaveSuccess();
    onClose();
  });

  function handleSaveAlt(alt: Alternative) {
    if (!planName.trim()) return alert("Isi nama rencana dulu!");
    const totalSks = alt.schedules.reduce((sum, s) => sum + s.sks, 0);
    save({
      plan_name: planName,
      academic_year: "",
      term: "",
      total_credit: totalSks,
      schedule_ids: alt.schedules.map((s) => s.schedule_id),
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Alternatif Jadwal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alternatives */}
        <div className="p-4 flex flex-col gap-4">
          {alternatives.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              Tidak ada alternatif ditemukan.
            </p>
          )}

          {alternatives.map((alt, i) => {
            const totalSks = alt.schedules.reduce((sum, s) => sum + s.sks, 0);
            return (
              <div
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">
                    Kelas Alternatif {i + 1}
                  </span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-100">
                      <th className="px-4 py-2 text-left">Kelas</th>
                      <th className="px-4 py-2 text-left">Dosen</th>
                      <th className="px-4 py-2 text-left">Waktu</th>
                      <th className="px-4 py-2 text-right">SKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alt.schedules.map((s, j) => (
                      <tr key={j} className="border-b border-gray-50">
                        <td className="px-4 py-2">
                          <div className="font-medium">{s.course_name}</div>
                          <div className="text-xs text-gray-400">
                            Kelas {s.class}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {s.lecture_name}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {s.day}, {s.start_at}–{s.end_at}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">
                          {s.sks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-2 text-xs text-right text-gray-500 border-t border-gray-100">
                  Total SKS: {totalSks}
                </div>

                {/* Save this alternative */}
                <div className="px-4 py-3 flex gap-2 border-t border-gray-100">
                  <input
                    type="text"
                    placeholder="Nama Rencana..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                  />
                  <button
                    onClick={() => handleSaveAlt(alt)}
                    disabled={isPending}
                    className="bg-blue-600 text-white rounded-md px-4 py-1.5 text-sm hover:bg-blue-700 disabled:opacity-40"
                  >
                    Simpan
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