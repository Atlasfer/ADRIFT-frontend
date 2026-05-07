"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";
import { createCourse } from "@/services/adminService";

const schema = z.object({
  code: z.string().min(1, { message: "Kode wajib diisi" }),
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  credit: z.number({ message: "Harus angka" }).min(1),
  semester: z.number({ message: "Harus angka" }).min(1).max(8),
  is_elective: z.boolean(),
  description: z.string().optional(),
  lab: z.string().min(1, { message: "Lab wajib diisi" }),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all";

export default function NewCoursePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_elective: false, credit: 3, semester: 1 },
  });

  const mut = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-course-groups"] });
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      router.push("/admin/courses");
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-5"
        >
          <ArrowLeft size={14} /> Kembali ke Mata Kuliah
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <BookOpen size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tambah Mata Kuliah</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Isi detail mata kuliah baru</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="space-y-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Informasi Dasar</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Kode Mata Kuliah</label>
              <input {...register("code")} placeholder="KI1101" className={inputClass} />
              {errors.code && <p className="text-xs text-red-400">{errors.code.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Lab</label>
              <input {...register("lab")} placeholder="KI" className={inputClass} />
              {errors.lab && <p className="text-xs text-red-400">{errors.lab.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Nama Mata Kuliah</label>
            <input {...register("name")} placeholder="Dasar Pemrograman" className={inputClass} />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">SKS</label>
              <input {...register("credit", { valueAsNumber: true })} type="number" min={1} max={6} placeholder="3" className={inputClass} />
              {errors.credit && <p className="text-xs text-red-400">{errors.credit.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Semester</label>
              <input {...register("semester", { valueAsNumber: true })} type="number" min={1} max={8} placeholder="1" className={inputClass} />
              {errors.semester && <p className="text-xs text-red-400">{errors.semester.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Deskripsi (opsional)</label>
            <textarea
              {...register("description")}
              placeholder="Deskripsi singkat mata kuliah..."
              rows={3}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" {...register("is_elective")} className="sr-only peer" />
              <div className="w-10 h-5 bg-zinc-700 rounded-full peer-checked:bg-indigo-600 transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Mata kuliah pilihan</p>
              <p className="text-xs text-zinc-600">Centang jika ini adalah mata kuliah pilihan (bukan wajib)</p>
            </div>
          </label>
        </div>

        {mut.error && (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{mut.error.message}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href="/admin/courses"
            className="flex-1 py-3 text-center border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl transition-all"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={mut.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all"
          >
            {mut.isPending ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</> : "Simpan Mata Kuliah"}
          </button>
        </div>
      </form>
    </div>
  );
}
