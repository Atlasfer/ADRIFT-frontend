// src/components/frs/SavedPlans.tsx
"use client";

import { usePlans, usePlanDetail } from "@/hooks/useFrs";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SavedPlans() {
  const { data: plans, isLoading } = usePlans();
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const { data: detail, isLoading: isDetailLoading } =
    usePlanDetail(expandedPlanId);

  if (isLoading) {
    return (
      <div className="text-sm text-gray-400 p-4">Memuat rencana...</div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-sm text-gray-400 p-4">
        Belum ada rencana tersimpan.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">
        Rencana Tersimpan
      </h2>
      {plans.map((plan) => {
        const isExpanded = expandedPlanId === plan.id;
        return (
          <div
            key={plan.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
              onClick={() =>
                setExpandedPlanId(isExpanded ? null : plan.id)
              }
            >
              <div className="text-left">
                <div className="font-medium text-gray-800">
                  {plan.plan_name}
                </div>
                <div className="text-xs text-gray-400">
                  {plan.academic_year} — {plan.term} — {plan.total_credit} SKS
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100 px-4 py-3">
                {isDetailLoading ? (
                  <p className="text-xs text-gray-400">Memuat detail...</p>
                ) : detail ? (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-100">
                        <th className="text-left py-1">Mata Kuliah</th>
                        <th className="text-left py-1">Kelas</th>
                        <th className="text-left py-1">Jadwal</th>
                        <th className="text-left py-1">Dosen</th>
                        <th className="text-right py-1">SKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-50"
                        >
                          <td className="py-1.5 font-medium">
                            {item.course_name}
                          </td>
                          <td className="py-1.5 text-gray-600">
                            {item.class}
                          </td>
                          <td className="py-1.5 text-gray-600">
                            {item.day}, {item.start_time}–{item.end_time}
                          </td>
                          <td className="py-1.5 text-gray-600">
                            {item.lecture_name}
                          </td>
                          <td className="py-1.5 text-right text-gray-600">
                            {item.credit}
                          </td>
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