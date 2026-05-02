"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, GraduationCap } from "lucide-react";
import { createLecture } from "@/services/adminService";

const schema = z.object({
  code: z.string().min(1, { message: "Kode wajib diisi" }),
  name: z.string().min(1, { message: "Nama wajib diisi" }),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all";

export default function NewLecturePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mut = useMutation({
    mutationFn: createLecture,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-lectures"] });
      router.push("/admin/lectures");
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/lectures" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-5">
          <ArrowLeft size={14} /> Kembali ke Dosen
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <GraduationCap size={18} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tambah Dosen</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Isi data dosen pengampu baru</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="space-y-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Data Dosen</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Kode Dosen</label>
            <input {...register("code")} placeholder="KI001" className={inputClass} />
            {errors.code && <p className="text-xs text-red-400">{errors.code.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Nama Lengkap</label>
            <input {...register("name")} placeholder="Dr. Budi Santoso, M.T." className={inputClass} />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
        </div>

        {mut.error && (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{mut.error.message}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/admin/lectures" className="flex-1 py-3 text-center border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl transition-all">
            Batal
          </Link>
          <button type="submit" disabled={mut.isPending} className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all">
            {mut.isPending ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</> : "Simpan Dosen"}
          </button>
        </div>
      </form>
    </div>
  );
}
