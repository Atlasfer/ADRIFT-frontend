// src/components/frs/SavedPlans.tsx
"use client";

import { usePlans, usePlanDetail, useDeletePlan } from "@/hooks/useFrs";
import { useState } from "react";
import { ChevronDown, ChevronUp, CalendarDays, Trash2 } from "lucide-react";

export default function SavedPlans() {
  const { data: plans, isLoading } = usePlans();
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const { data: detail, isLoading: isDetailLoading } = usePlanDetail(expandedPlanId);
  const { mutate: deletePlan, isPending: isDeleting } = useDeletePlan();

  if (isLoading) {
    return <div className="text-sm text-white/30 p-6">Memuat rencana...</div>;
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-white/20">
        <CalendarDays className="w-10 h-10" />
        <p className="text-sm">Belum ada rencana tersimpan.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-6 max-w-3xl mx-auto w-full">
      <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-2">
        Rencana Tersimpan
      </h2>

      {plans.map((plan) => {
        const isExpanded = expandedPlanId === plan.id;
        return (
          <div key={plan.id} className="border border-white/10 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
              <button
                className="flex-1 text-left"
                onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
              >
                <div className="text-sm font-medium text-white">{plan.plan_name}</div>
                <div className="text-xs text-white/30 mt-0.5">
                  {plan.academic_year} · {plan.term} · {plan.total_credit} SKS · {plan.course_count} matkul
                </div>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (confirm(`Hapus rencana "${plan.plan_name}"?`)) {
                      deletePlan(plan.id, {
                        onSuccess: () => {
                          if (expandedPlanId === plan.id) setExpandedPlanId(null);
                        },
                      });
                    }
                  }}
                  disabled={isDeleting}
                  className="text-white/20 hover:text-red-400 transition-colors disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 text-white/30" />
                    : <ChevronDown className="w-4 h-4 text-white/30" />
                  }
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-white/10 px-4 py-3">
                {isDetailLoading ? (
                  <p className="text-xs text-white/30">Memuat detail...</p>
                ) : detail ? (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-white/30 border-b border-white/10">
                        <th className="text-left py-2">Mata Kuliah</th>
                        <th className="text-left py-2">Kelas</th>
                        <th className="text-left py-2">Jadwal</th>
                        <th className="text-left py-2">Dosen</th>
                        <th className="text-right py-2">SKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.items.map((item) => (
                        <tr key={item.id} className="border-b border-white/5">
                          <td className="py-2 text-white font-medium">{item.course_name}</td>
                          <td className="py-2 text-white/50">{item.class}</td>
                          <td className="py-2 text-white/50">{item.day}, {item.start_time}–{item.end_time}</td>
                          <td className="py-2 text-white/50">{item.lecture_name}</td>
                          <td className="py-2 text-right text-white/50">{item.credit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}