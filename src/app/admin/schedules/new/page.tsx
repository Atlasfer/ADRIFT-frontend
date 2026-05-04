"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Calendar } from "lucide-react";
import { createSchedule, getAllLectures } from "@/services/adminService";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const PRODI_OPTIONS = ["IF", "IUP", "RKA", "RPL", "S2", "S3"];
const TERM_OPTIONS = ["GANJIL", "GENAP"];

const schema = z.object({
  course_name: z.string().min(1, { message: "Nama mata kuliah wajib" }),
  lecture_id: z.string().min(1, { message: "Dosen wajib dipilih" }),
  class: z.string().min(1, { message: "Kelas wajib diisi" }),
  day: z.string().min(1, { message: "Hari wajib dipilih" }),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, { message: "Format HH:MM" }),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, { message: "Format HH:MM" }),
  room: z.string().min(1, { message: "Ruangan wajib diisi" }),
  semester: z.coerce.number().min(1).max(8),
  academic_year: z.string().min(1, { message: "Tahun akademik wajib diisi" }),
  capacity: z.coerce.number().min(1),
  sks: z.coerce.number().min(1),
  prodi: z.string().min(1, { message: "Prodi wajib dipilih" }),
  term: z.string().min(1, { message: "Term wajib dipilih" }),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all";
const selectClass =
  "w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all";

export default function NewSchedulePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { data: lectures = [] } = useQuery({
    queryKey: ["admin-lectures-select"],
    queryFn: getAllLectures,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sks: 3, capacity: 40, semester: 1 },
  });

  const mut = useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-schedule-groups"] });
      qc.invalidateQueries({ queryKey: ["admin-schedules"] });
      router.push("/admin/schedules");
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/schedules" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-5">
          <ArrowLeft size={14} /> Kembali ke Jadwal
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <Calendar size={18} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tambah Jadwal</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Isi detail jadwal kuliah baru</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="space-y-5">
        {/* Mata Kuliah & Dosen */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Mata Kuliah & Dosen</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Nama Mata Kuliah</label>
            <input {...register("course_name")} placeholder="Dasar Pemrograman" className={inputClass} />
            {errors.course_name && <p className="text-xs text-red-400">{errors.course_name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Dosen Pengampu</label>
            <select {...register("lecture_id")} className={selectClass}>
              <option value="">-- Pilih Dosen --</option>
              {lectures.map((l) => (
                <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
              ))}
            </select>
            {errors.lecture_id && <p className="text-xs text-red-400">{errors.lecture_id.message}</p>}
          </div>
        </div>

        {/* Waktu & Tempat */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Waktu & Tempat</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Kelas</label>
              <input {...register("class")} placeholder="A" className={inputClass} />
              {errors.class && <p className="text-xs text-red-400">{errors.class.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Hari</label>
              <select {...register("day")} className={selectClass}>
                <option value="">-- Pilih --</option>
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.day && <p className="text-xs text-red-400">{errors.day.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Mulai (HH:MM)</label>
              <input {...register("start_time")} placeholder="07:00" className={inputClass} />
              {errors.start_time && <p className="text-xs text-red-400">{errors.start_time.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Selesai (HH:MM)</label>
              <input {...register("end_time")} placeholder="08:40" className={inputClass} />
              {errors.end_time && <p className="text-xs text-red-400">{errors.end_time.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Ruangan</label>
              <input {...register("room")} placeholder="TC-101" className={inputClass} />
              {errors.room && <p className="text-xs text-red-400">{errors.room.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Kapasitas</label>
              <input {...register("capacity")} type="number" min={1} placeholder="40" className={inputClass} />
              {errors.capacity && <p className="text-xs text-red-400">{errors.capacity.message}</p>}
            </div>
          </div>
        </div>

        {/* Akademik */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Info Akademik</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">SKS</label>
              <input {...register("sks")} type="number" min={1} max={6} placeholder="3" className={inputClass} />
              {errors.sks && <p className="text-xs text-red-400">{errors.sks.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Semester</label>
              <input {...register("semester")} type="number" min={1} max={8} placeholder="1" className={inputClass} />
              {errors.semester && <p className="text-xs text-red-400">{errors.semester.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Tahun Akademik</label>
              <input {...register("academic_year")} placeholder="2024/2025" className={inputClass} />
              {errors.academic_year && <p className="text-xs text-red-400">{errors.academic_year.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Term</label>
              <select {...register("term")} className={selectClass}>
                <option value="">-- Pilih --</option>
                {TERM_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.term && <p className="text-xs text-red-400">{errors.term.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Program Studi</label>
            <select {...register("prodi")} className={selectClass}>
              <option value="">-- Pilih Prodi --</option>
              {PRODI_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.prodi && <p className="text-xs text-red-400">{errors.prodi.message}</p>}
          </div>
        </div>

        {mut.error && (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{mut.error.message}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/admin/schedules" className="flex-1 py-3 text-center border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl transition-all">
            Batal
          </Link>
          <button type="submit" disabled={mut.isPending} className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all">
            {mut.isPending ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</> : "Simpan Jadwal"}
          </button>
        </div>
      </form>
    </div>
  );
}
