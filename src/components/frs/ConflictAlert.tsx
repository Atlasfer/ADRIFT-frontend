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
    <div className="flex flex-col gap-2">
      {timeConflicts.map((c, i) => (
        <div
          key={i}
          className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400"
        >
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{c.message}</span>
        </div>
      ))}
      {lecturerConflicts.map((c, i) => (
        <div
          key={i}
          className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-md px-3 py-2 text-xs text-yellow-400"
        >
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{c.message}</span>
        </div>
      ))}
    </div>
  );
}