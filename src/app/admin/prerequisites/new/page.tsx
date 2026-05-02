"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, GitMerge, ArrowRight } from "lucide-react";
import {
  createPrerequisite,
  createPathEdge,
  listCourseGroups,
  listCoursesBySemester,
} from "@/services/adminService";
import type { AdminCourseResponse } from "@/types/admin";
import { useState } from "react";

const prereqSchema = z.object({
  course_id: z.string().min(1, { message: "Mata kuliah wajib dipilih" }),
  require_id: z.string().min(1, { message: "Prasyarat wajib dipilih" }),
});

const edgeSchema = z.object({
  from_course_id: z.string().min(1, { message: "Wajib dipilih" }),
  to_course_id: z.string().min(1, { message: "Wajib dipilih" }),
});

type PrereqForm = z.infer<typeof prereqSchema>;
type EdgeForm = z.infer<typeof edgeSchema>;

const selectClass =
  "w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all";

function useFlatCourses() {
  const { data: groups = [] } = useQuery({
    queryKey: ["admin-course-groups"],
    queryFn: listCourseGroups,
  });
  return useQuery({
    queryKey: ["admin-all-courses-flat", groups.map((g) => g.semester).join(",")],
    queryFn: async () => {
      const all: AdminCourseResponse[] = [];
      for (const g of groups) {
        const courses = await listCoursesBySemester(g.semester);
        all.push(...courses);
      }
      return all;
    },
    enabled: groups.length > 0,
  });
}

export default function NewPrerequisitePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"prereq" | "edge">("prereq");

  const { data: allCourses = [], isLoading: loadingCourses } = useFlatCourses();

  const {
    register: regPrereq,
    handleSubmit: handlePrereq,
    formState: { errors: prereqErrors },
  } = useForm<PrereqForm>({ resolver: zodResolver(prereqSchema) });

  const {
    register: regEdge,
    handleSubmit: handleEdge,
    formState: { errors: edgeErrors },
  } = useForm<EdgeForm>({ resolver: zodResolver(edgeSchema) });

  const prereqMut = useMutation({
    mutationFn: createPrerequisite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-prereqs"] });
      router.push("/admin/prerequisites");
    },
  });

  const edgeMut = useMutation({
    mutationFn: createPathEdge,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-edges"] });
      router.push("/admin/prerequisites");
    },
  });

  const courseOptions = allCourses.map((c) => (
    <option key={c.id} value={c.id}>
      [{c.code}] {c.name} — Sem {c.semester}
    </option>
  ));

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/prerequisites" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-5">
          <ArrowLeft size={14} /> Kembali ke Prasyarat & Edge
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
            <GitMerge size={18} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tambah Relasi</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Buat prasyarat atau path edge baru</p>
          </div>
        </div>
      </div>

      {/* Tab */}
      <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit mb-6">
        <button
          onClick={() => setTab("prereq")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === "prereq" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          Prasyarat
        </button>
        <button
          onClick={() => setTab("edge")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === "edge" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          Path Edge
        </button>
      </div>

      {loadingCourses ? (
        <div className="flex items-center gap-2 text-zinc-500 text-sm py-8">
          <Loader2 size={15} className="animate-spin" /> Memuat data mata kuliah...
        </div>
      ) : (
        <>
          {tab === "prereq" && (
            <form onSubmit={handlePrereq((d) => prereqMut.mutate(d))} className="space-y-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Relasi Prasyarat</h2>
                <p className="text-xs text-zinc-600">Mata kuliah A membutuhkan mata kuliah B sebagai prasyarat.</p>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Mata Kuliah (yang membutuhkan prasyarat)</label>
                  <select {...regPrereq("course_id")} className={selectClass}>
                    <option value="">-- Pilih Mata Kuliah --</option>
                    {courseOptions}
                  </select>
                  {prereqErrors.course_id && <p className="text-xs text-red-400">{prereqErrors.course_id.message}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <div className="flex items-center gap-1.5 text-zinc-600 text-xs">
                    <ArrowRight size={12} />
                    <span>membutuhkan</span>
                  </div>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Prasyarat (harus diselesaikan lebih dulu)</label>
                  <select {...regPrereq("require_id")} className={selectClass}>
                    <option value="">-- Pilih Prasyarat --</option>
                    {courseOptions}
                  </select>
                  {prereqErrors.require_id && <p className="text-xs text-red-400">{prereqErrors.require_id.message}</p>}
                </div>
              </div>

              {prereqMut.error && (
                <div className="flex items-start gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-red-400">{prereqMut.error.message}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Link href="/admin/prerequisites" className="flex-1 py-3 text-center border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl transition-all">
                  Batal
                </Link>
                <button type="submit" disabled={prereqMut.isPending} className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all">
                  {prereqMut.isPending ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</> : "Simpan Prasyarat"}
                </button>
              </div>
            </form>
          )}

          {tab === "edge" && (
            <form onSubmit={handleEdge((d) => edgeMut.mutate(d))} className="space-y-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Path Edge</h2>
                <p className="text-xs text-zinc-600">Hubungkan dua mata kuliah dalam jalur skill tree.</p>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Dari Mata Kuliah</label>
                  <select {...regEdge("from_course_id")} className={selectClass}>
                    <option value="">-- Pilih --</option>
                    {courseOptions}
                  </select>
                  {edgeErrors.from_course_id && <p className="text-xs text-red-400">{edgeErrors.from_course_id.message}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <ArrowRight size={16} className="text-indigo-400 flex-shrink-0" />
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Ke Mata Kuliah</label>
                  <select {...regEdge("to_course_id")} className={selectClass}>
                    <option value="">-- Pilih --</option>
                    {courseOptions}
                  </select>
                  {edgeErrors.to_course_id && <p className="text-xs text-red-400">{edgeErrors.to_course_id.message}</p>}
                </div>
              </div>

              {edgeMut.error && (
                <div className="flex items-start gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-red-400">{edgeMut.error.message}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Link href="/admin/prerequisites" className="flex-1 py-3 text-center border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl transition-all">
                  Batal
                </Link>
                <button type="submit" disabled={edgeMut.isPending} className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all">
                  {edgeMut.isPending ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</> : "Simpan Path Edge"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
