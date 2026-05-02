"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, FlaskConical } from "lucide-react";
import { createLabPath } from "@/services/adminService";

const schema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: "Format hex: #RRGGBB" }),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all";

export default function NewLabPathPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { color: "#6366f1" },
  });

  const colorValue = watch("color");

  const mut = useMutation({
    mutationFn: createLabPath,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-lab-paths"] });
      router.push("/admin/lab-paths");
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/lab-paths" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-5">
          <ArrowLeft size={14} /> Kembali ke Lab Path
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <FlaskConical size={18} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tambah Lab Path</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Buat jalur laboratorium baru</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mut.mutate(d))} className="space-y-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Detail Lab Path</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Nama Lab Path</label>
            <input {...register("name")} placeholder="Rekayasa Perangkat Lunak" className={inputClass} />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Warna</label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl border-2 border-zinc-700 flex-shrink-0 cursor-pointer relative overflow-hidden"
                style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(colorValue) ? colorValue : "#6366f1" }}
              >
                <input
                  type="color"
                  {...register("color")}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </div>
              <div className="flex-1 space-y-1">
                <input {...register("color")} placeholder="#6366f1" className={`${inputClass} font-mono`} />
                {errors.color && <p className="text-xs text-red-400">{errors.color.message}</p>}
              </div>
            </div>
            <p className="text-xs text-zinc-600">Klik kotak warna untuk memilih, atau ketik kode hex langsung</p>
          </div>
        </div>

        {mut.error && (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{mut.error.message}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/admin/lab-paths" className="flex-1 py-3 text-center border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl transition-all">
            Batal
          </Link>
          <button type="submit" disabled={mut.isPending} className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all">
            {mut.isPending ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</> : "Simpan Lab Path"}
          </button>
        </div>
      </form>
    </div>
  );
}
