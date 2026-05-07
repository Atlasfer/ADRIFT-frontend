// src/app/admin/frs/page.tsx
"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  uploadFrsFile,
  previewFrsSchedule,
  reviseFrsSchedule,
  submitFrsSchedule,
} from "@/services/adminService";
import type { FrsScheduleRow, FrsUploadScheduleResponse } from "@/types/admin";
import {
  Upload, FileSpreadsheet, AlertTriangle, CheckCircle2,
  RotateCcw, Send, ChevronRight, Loader2, Eye,
} from "lucide-react";

function StepBar({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Upload Excel" },
    { n: 2, label: "Preview Data" },
    { n: 3, label: "Selesai" },
  ];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <div key={s.n} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                style={{
                  background: done
                    ? "linear-gradient(135deg,#10b981,#059669)"
                    : active
                    ? "linear-gradient(135deg,#3b82f6,#6366f1)"
                    : "rgba(255,255,255,0.07)",
                  border: done
                    ? "1px solid rgba(16,185,129,0.4)"
                    : active
                    ? "1px solid rgba(59,130,246,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                  color: done || active ? "#fff" : "rgba(148,163,184,0.5)",
                  boxShadow: active ? "0 0 12px rgba(59,130,246,0.35)" : "none",
                }}
              >
                {done ? <CheckCircle2 size={14} /> : s.n}
              </div>
              <span
                className="text-xs font-medium hidden sm:block"
                style={{ color: active ? "#93c5fd" : done ? "#6ee7b7" : "rgba(148,163,184,0.4)" }}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-12 sm:w-20 h-px mx-2"
                style={{
                  background: done
                    ? "linear-gradient(90deg,#10b981,#059669)"
                    : "rgba(255,255,255,0.08)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function NullBadge({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
        NULL
      </span>
    );
  }
  return <span className="text-zinc-300 text-xs">{String(value)}</span>;
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return iso;
  }
}

export default function AdminFrsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [objectKey, setObjectKey] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [term, setTerm] = useState<string>("GANJIL");
  const [preview, setPreview] = useState<FrsUploadScheduleResponse | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Step 1 — upload file
  const uploadFileMut = useMutation({
    mutationFn: (file: File) => uploadFrsFile(file),
    onSuccess: async (data) => {
      setObjectKey(data.object_key);
      previewMut.mutate({ object_key: data.object_key, academic_year: academicYear, term });
    },
  });

  const previewMut = useMutation({
    mutationFn: previewFrsSchedule,
    onSuccess: (data) => {
      setObjectKey(data.object_key); // use the processed key for revise/submit
      setPreview(data);
      setStep(2);
    },
  });

  const reviseMut = useMutation({
    mutationFn: reviseFrsSchedule,
    onSuccess: () => {
      setStep(1);
      setSelectedFile(null);
      setObjectKey("");
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const submitMut = useMutation({
    mutationFn: submitFrsSchedule,
    onSuccess: () => {
      setStep(3);
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Hanya file Excel (.xlsx / .xls) yang diterima.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = () => {
    if (!selectedFile || !academicYear.trim() || !term.trim()) return;
    uploadFileMut.mutate(selectedFile);
  };

  const isUploading = uploadFileMut.isPending || previewMut.isPending;
  const uploadError = uploadFileMut.error || previewMut.error;
  const canUpload = !!selectedFile && academicYear.trim().length > 0 && term.trim().length > 0 && !isUploading;

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FileSpreadsheet size={20} className="text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">Upload Jadwal FRS</h1>
        </div>
        <p className="text-zinc-400 text-sm">
          Import jadwal kuliah massal dari file Excel. Data akan divalidasi sebelum disimpan ke database.
        </p>
      </div>

      <StepBar current={step} />

      {/* STEP 1: UPLOAD */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-12 flex flex-col items-center justify-center gap-4 select-none"
            style={{
              borderColor: dragOver ? "rgba(99,102,241,0.6)" : selectedFile ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)",
              background: dragOver
                ? "rgba(99,102,241,0.06)"
                : selectedFile
                ? "rgba(16,185,129,0.04)"
                : "rgba(255,255,255,0.02)",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
            />

            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: selectedFile
                  ? "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.2))"
                  : "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(99,102,241,0.15))",
                border: selectedFile
                  ? "1px solid rgba(16,185,129,0.25)"
                  : "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {selectedFile ? (
                <FileSpreadsheet size={28} className="text-emerald-400" />
              ) : (
                <Upload size={28} className="text-indigo-400" />
              )}
            </div>

            {selectedFile ? (
              <div className="text-center">
                <p className="text-sm font-semibold text-emerald-400">{selectedFile.name}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB — Klik untuk ganti file
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-semibold text-white">Drag & drop file Excel di sini</p>
                <p className="text-xs text-zinc-500 mt-1">atau klik untuk memilih file (.xlsx, .xls)</p>
              </div>
            )}
          </div>

          {/* Error */}
          {uploadError && (
            <div className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">{(uploadError as Error).message}</p>
            </div>
          )}

          {/* Academic Year & Term */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Tahun Akademik</label>
              <input
                type="text"
                placeholder="Contoh: 2025/2026"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: academicYear.trim() ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Semester</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(99,102,241,0.4)",
                  appearance: "none",
                }}
              >
                <option value="GANJIL" style={{ background: "#0d1426" }}>GANJIL</option>
                <option value="GENAP" style={{ background: "#0d1426" }}>GENAP</option>
              </select>
            </div>
          </div>

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!canUpload}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: canUpload
                ? "linear-gradient(135deg,#3b82f6,#6366f1)"
                : "rgba(255,255,255,0.05)",
              color: canUpload ? "#fff" : "rgba(148,163,184,0.4)",
              border: canUpload
                ? "1px solid rgba(59,130,246,0.4)"
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: canUpload ? "0 0 20px rgba(59,130,246,0.25)" : "none",
            }}
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Memproses file...
              </>
            ) : (
              <>
                <Eye size={16} />
                Upload & Preview Jadwal
              </>
            )}
          </button>

          {/* Info box */}
          <div
            className="px-4 py-3 rounded-xl text-xs text-zinc-400 space-y-1"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="font-semibold text-zinc-300 mb-2">Petunjuk penggunaan:</p>
            <p>1. Upload file Excel (.xlsx) yang berisi data jadwal kuliah.</p>
            <p>2. Sistem akan mem-preview seluruh baris data dan menandai field yang kosong (NULL).</p>
            <p>3. Jika ada field NULL, pilih <span className="text-yellow-400 font-medium">Revise</span> untuk memperbaiki file Excel, atau pilih <span className="text-indigo-400 font-medium">Submit</span> untuk tetap menyimpan.</p>
          </div>
        </div>
      )}

      {/* STEP 2: PREVIEW */}
      {step === 2 && preview && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {preview.null_records.length > 0 ? (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-red-300 font-medium">{preview.null_records.length}</span>
                <span className="text-zinc-400">baris memiliki field NULL/kosong</span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}
              >
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-emerald-300 font-medium">Semua data lengkap</span>
              </div>
            )}

            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              <FileSpreadsheet size={14} className="text-blue-400" />
              <span className="text-blue-300 font-medium">{preview.academic_year}</span>
              <span className="text-zinc-400">{preview.term}</span>
            </div>
          </div>

          {/* Table */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full min-w-[900px] text-xs">
                <thead className="sticky top-0 z-10" style={{ background: "#0d1426" }}>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {[
                      "#", "Mata Kuliah", "Kode Dosen", "Kelas", "Hari",
                      "Mulai", "Selesai", "Ruangan", "Sem", "SKS",
                      "Kapasitas", "Prodi", "Term", "T.A.",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left font-semibold whitespace-nowrap uppercase tracking-wide"
                        style={{ color: "rgba(148,163,184,0.6)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.null_records.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="px-3 py-8 text-center text-zinc-500 text-xs">
                        Tidak ada baris bermasalah — semua field terisi lengkap.
                      </td>
                    </tr>
                  ) : (
                    preview.null_records.map((row: FrsScheduleRow, i) => (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          background: "rgba(239,68,68,0.05)",
                        }}
                      >
                        <td className="px-3 py-2.5 text-zinc-600">{i + 1}</td>
                        <td className="px-3 py-2.5 max-w-[160px] truncate">
                          <NullBadge value={row.course_name} />
                        </td>
                        <td className="px-3 py-2.5"><NullBadge value={row.lecture_code} /></td>
                        <td className="px-3 py-2.5"><NullBadge value={row.class} /></td>
                        <td className="px-3 py-2.5"><NullBadge value={row.day} /></td>
                        <td className="px-3 py-2.5"><NullBadge value={row.start_time ? formatTime(row.start_time) : row.start_time} /></td>
                        <td className="px-3 py-2.5"><NullBadge value={row.end_time ? formatTime(row.end_time) : row.end_time} /></td>
                        <td className="px-3 py-2.5"><NullBadge value={row.room} /></td>
                        <td className="px-3 py-2.5"><NullBadge value={row.semester} /></td>
                        <td className="px-3 py-2.5"><NullBadge value={row.sks} /></td>
                        <td className="px-3 py-2.5"><NullBadge value={row.capacity === 0 ? null : row.capacity} /></td>
                        <td className="px-3 py-2.5"><NullBadge value={row.prodi} /></td>
                        <td className="px-3 py-2.5"><NullBadge value={row.term} /></td>
                        <td className="px-3 py-2.5"><NullBadge value={row.academic_year} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Missing lecture codes */}
          {preview.missing_lecture_codes.length > 0 && (
            <div
              className="px-4 py-3 rounded-xl text-xs space-y-1"
              style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)" }}
            >
              <p className="font-semibold text-yellow-400 mb-1 flex items-center gap-1.5">
                <AlertTriangle size={13} /> Kode dosen tidak ditemukan di sistem:
              </p>
              <div className="flex flex-wrap gap-2">
                {preview.missing_lecture_codes.map((code) => (
                  <span
                    key={code}
                    className="px-2 py-0.5 rounded-md bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 font-mono"
                  >
                    {code || "<empty>"}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Errors */}
          {(reviseMut.error || submitMut.error) && (
            <div className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">
                {((reviseMut.error || submitMut.error) as Error).message}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {/*  kembali & perbaiki Excel */}
            <button
              onClick={() => reviseMut.mutate({ object_key: objectKey, academic_year: academicYear, term })}
              disabled={reviseMut.isPending || submitMut.isPending}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.3)",
                color: reviseMut.isPending ? "rgba(148,163,184,0.4)" : "#fbbf24",
              }}
            >
              {reviseMut.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RotateCcw size={14} />
              )}
              Revise (Batalkan & Perbaiki)
            </button>

            {/* Submit */}
            <button
              onClick={() => submitMut.mutate({ object_key: objectKey, academic_year: academicYear, term })}
              disabled={submitMut.isPending || reviseMut.isPending}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background:
                  submitMut.isPending || reviseMut.isPending
                    ? "rgba(255,255,255,0.05)"
                    : "linear-gradient(135deg,#3b82f6,#6366f1)",
                border:
                  submitMut.isPending || reviseMut.isPending
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(59,130,246,0.4)",
                color:
                  submitMut.isPending || reviseMut.isPending ? "rgba(148,163,184,0.4)" : "#fff",
                boxShadow:
                  submitMut.isPending || reviseMut.isPending
                    ? "none"
                    : "0 0 20px rgba(59,130,246,0.25)",
              }}
            >
              {submitMut.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              {preview.null_records.length > 0 ? "Tetap Submit" : "Submit ke Database"}
            </button>
          </div>

          {preview.null_records.length > 0 && (
            <p className="text-xs text-center text-zinc-500">
              ⚠️ Terdapat <span className="text-red-400 font-medium">{preview.null_records.length} baris</span> dengan field NULL/kosong.
              Disarankan untuk memilih <span className="text-yellow-400">Revise</span> dan memperbaiki file Excel terlebih dahulu.
            </p>
          )}
        </div>
      )}

      {/* STEP 3: SUKSES */}
      {step === 3 && (
        <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.2))",
              border: "1px solid rgba(16,185,129,0.3)",
              boxShadow: "0 0 40px rgba(16,185,129,0.2)",
            }}
          >
            <CheckCircle2 size={36} className="text-emerald-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">Jadwal Berhasil Disimpan!</h2>
            <p className="text-zinc-400 text-sm max-w-sm">
              Seluruh data jadwal dari file Excel telah berhasil diimpor ke database.
            </p>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => {
                setStep(1);
                setSelectedFile(null);
                setObjectKey("");
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(148,163,184,0.8)",
              }}
            >
              <Upload size={14} />
              Upload File Lain
            </button>

            <a
              href="/admin/schedules"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                border: "1px solid rgba(59,130,246,0.4)",
                color: "#fff",
                boxShadow: "0 0 16px rgba(59,130,246,0.25)",
              }}
            >
              Lihat Jadwal
              <ChevronRight size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
