// src/components/frs/ConflictAlert.tsx
"use client";

import { Conflict } from "@/store/frsStore";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface ConflictAlertProps {
  conflicts: Conflict[];
}

export default function ConflictAlert({ conflicts }: ConflictAlertProps) {
  if (conflicts.length === 0) return null;

  const timeConflicts = conflicts.filter((c) => c.type === "TIME");
  const lecturerConflicts = conflicts.filter((c) => c.type === "LECTURER");

  return (
    <div className="flex flex-col gap-2 mt-3">
      {timeConflicts.map((c, i) => (
        <div
          key={i}
          className="flex items-start gap-2 bg-red-50 border border-red-300 rounded-md px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{c.message}</span>
        </div>
      ))}
      {lecturerConflicts.map((c, i) => (
        <div
          key={i}
          className="flex items-start gap-2 bg-yellow-50 border border-yellow-300 rounded-md px-3 py-2 text-sm text-yellow-700"
        >
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{c.message}</span>
        </div>
      ))}
    </div>
  );
}