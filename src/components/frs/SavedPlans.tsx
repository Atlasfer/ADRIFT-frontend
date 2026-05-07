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
    <div className="flex flex-col gap-4 p-6 max-w-4xl mx-auto w-full h-full bg-[#0d0d1a]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          Rencana Tersimpan
        </h2>
        <span className="text-[10px] text-white/20 bg-white/5 px-2 py-1 rounded border border-white/10">
          Total {plans.length} Rencana
        </span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {plans.map((plan) => {
          const isExpanded = expandedPlanId === plan.id;
          return (
            <div 
              key={plan.id} 
              className={`border transition-all duration-200 rounded-xl overflow-hidden ${
                isExpanded 
                ? "border-blue-500/30 bg-blue-500/[0.02]" 
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              {/* Header Rencana */}
              <div className="flex items-center justify-between px-5 py-4">
                <button
                  className="flex-1 text-left min-w-0"
                  onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                >
                  <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">
                    {plan.plan_name}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/10 uppercase">
                      {plan.total_credit} SKS
                    </span>
                    <span className="text-[10px] text-white/30 font-medium uppercase tracking-tighter">
                      {plan.academic_year} • {plan.term} • {plan.course_count} MATKUL
                    </span>
                  </div>
                </button>

                <div className="flex items-center gap-4 ml-4">
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
                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                    className={`p-2 rounded-lg transition-colors ${isExpanded ? "bg-blue-500/10 text-blue-400" : "text-white/20 hover:text-white"}`}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Detail Rencana (Accordion) */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="border-t border-white/10 pt-4">
                    {isDetailLoading ? (
                      <div className="flex items-center gap-2 py-8 justify-center">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-white/30 font-mono tracking-tighter">FETCHING_DETAIL...</p>
                      </div>
                    ) : detail ? (
                      <div className="flex flex-col gap-1">
                        {detail.items.map((item) => (
                          <div key={item.id} className="grid grid-cols-[100px_1fr] gap-4 items-start py-3 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] px-2 rounded-lg transition-colors">
                            {/* Hari & Jam (Sejajar Nama Matkul) */}
                            <div className="flex flex-col mt-[4px] shrink-0">
                              <span className="text-[10px] font-bold text-white/50 uppercase leading-none tracking-wide">
                                {item.day}
                              </span>
                              <span className="text-[9px] text-white/20 font-mono mt-1.5 leading-none tracking-tight italic">
                                {item.start_time} - {item.end_time}
                              </span>
                            </div>

                            {/* Info Kuliah & Ruangan */}
                            <div className="min-w-0">
                              <div className="text-[13px] font-bold text-white/90 truncate uppercase leading-tight mb-2 tracking-tight">
                                {item.course_name}
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-x-3">
                                  <span className="text-[10px] text-blue-400 font-bold bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/10 uppercase">
                                    Kelas {item.class}
                                  </span>
                                  <span className="text-[10px] text-white/40 italic">
                                    👨‍🏫 {item.lecture_name}
                                  </span>
                                  <span className="text-[10px] text-white/20 font-medium ml-auto uppercase tracking-tighter">
                                    {item.credit} SKS
                                  </span>
                                </div>
                                {/* Ruangan Info */}
                                <div className="text-[10px] text-white/20 flex items-center gap-1 italic">
                                  <span>📍</span>
                                  <span className="truncate tracking-wide">Ruang: {item.room || "TBA"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}