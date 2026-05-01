// src/app/admin/prerequisites/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import {
  createPrerequisite,
  deletePrerequisite,
  createPathEdge,
  deletePathEdge,
  listCourseGroups,
  listCoursesBySemester,
} from "@/services/adminService";
import { AdminModal } from "@/components/admin/AdminModal";

// We'll use a combined approach: fetch all courses for selection
import { useQuery as useQ } from "@tanstack/react-query";
import type { AdminCourseResponse } from "@/types/admin";

const prereqSchema = z.object({
  course_id: z.string().min(1, "Mata kuliah wajib dipilih"),
  require_id: z.string().min(1, "Prasyarat wajib dipilih"),
});

const edgeSchema = z.object({
  from_course_id: z.string().min(1, "Wajib dipilih"),
  to_course_id: z.string().min(1, "Wajib dipilih"),
});

type PrereqForm = z.infer<typeof prereqSchema>;
type EdgeForm = z.infer<typeof edgeSchema>;

function useFlatCourses() {
  const { data: groups = [] } = useQuery({
    queryKey: ["admin-course-groups"],
    queryFn: listCourseGroups,
  });

  const results = useQuery({
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

  return results;
}

export default function AdminPrerequisitesPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"prereq" | "edge">("prereq");
  const [prereqModal, setPrereqModal] = useState(false);
  const [edgeModal, setEdgeModal] = useState(false);
  const [deletePrereqTarget, setDeletePrereqTarget] = useState<{ courseId: string; requireId: string; label: string } | null>(null);
  const [deleteEdgeTarget, setDeleteEdgeTarget] = useState<{ id: string; label: string } | null>(null);

  const { data: allCourses = [], isLoading: loadingCourses } = useFlatCourses();

  const {
    register: regPrereq,
    handleSubmit: handlePrereq,
    reset: resetPrereq,
    formState: { errors: prereqErrors },
  } = useForm<PrereqForm>({ resolver: zodResolver(prereqSchema) });

  const {
    register: regEdge,
    handleSubmit: handleEdge,
    reset: resetEdge,
    formState: { errors: edgeErrors },
  } = useForm<EdgeForm>({ resolver: zodResolver(edgeSchema) });

  const createPrereqMut = useMutation({
    mutationFn: createPrerequisite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-prereqs"] });
      setPrereqModal(false);
      resetPrereq();
    },
  });

  const deletePrereqMut = useMutation({
    mutationFn: ({ courseId, requireId }: { courseId: string; requireId: string }) =>
      deletePrerequisite(courseId, requireId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-prereqs"] });
      setDeletePrereqTarget(null);
    },
  });

  const createEdgeMut = useMutation({
    mutationFn: createPathEdge,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-edges"] });
      setEdgeModal(false);
      resetEdge();
    },
  });

  const deleteEdgeMut = useMutation({
    mutationFn: ({ id }: { id: string }) => deletePathEdge(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-edges"] });
      setDeleteEdgeTarget(null);
    },
  });

  const courseOptions = allCourses.map((c) => (
    <option key={c.id} value={c.id}>
      [{c.code}] {c.name} — Sem {c.semester}
    </option>
  ));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Prasyarat & Path Edge</h1>
        <p className="text-zinc-400 text-sm mt-1">Kelola relasi antar mata kuliah</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-800 rounded-lg w-fit mb-6">
        <button
          onClick={() => setTab("prereq")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === "prereq" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
        >
          Prasyarat
        </button>
        <button
          onClick={() => setTab("edge")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === "edge" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
        >
          Path Edge
        </button>
      </div>

      {tab === "prereq" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-zinc-400">Mata kuliah yang membutuhkan prasyarat tertentu</p>
            <button
              onClick={() => setPrereqModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus size={15} /> Tambah Prasyarat
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <p className="text-zinc-500 text-sm">
              Tambah relasi prasyarat menggunakan tombol di atas. Data prasyarat dapat dilihat di halaman Skill Tree.
            </p>
          </div>
        </div>
      )}

      {tab === "edge" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-zinc-400">Edge yang menghubungkan jalur antar mata kuliah</p>
            <button
              onClick={() => setEdgeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus size={15} /> Tambah Path Edge
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <p className="text-zinc-500 text-sm">
              Tambah relasi path edge menggunakan tombol di atas. Data edge dapat dilihat di visualisasi Skill Tree.
            </p>
          </div>
        </div>
      )}

      {/* Prerequisite Modal */}
      <AdminModal open={prereqModal} onClose={() => { setPrereqModal(false); resetPrereq(); }} title="Tambah Prasyarat">
        <form onSubmit={handlePrereq((data) => createPrereqMut.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Mata Kuliah</label>
            <select {...regPrereq("course_id")} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
              <option value="">-- Pilih Mata Kuliah --</option>
              {courseOptions}
            </select>
            {prereqErrors.course_id && <p className="mt-1 text-xs text-red-400">{prereqErrors.course_id.message}</p>}
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <span>membutuhkan prasyarat</span>
              <ArrowRight size={12} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Prasyarat</label>
            <select {...regPrereq("require_id")} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
              <option value="">-- Pilih Prasyarat --</option>
              {courseOptions}
            </select>
            {prereqErrors.require_id && <p className="mt-1 text-xs text-red-400">{prereqErrors.require_id.message}</p>}
          </div>

          {createPrereqMut.error && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">{createPrereqMut.error.message}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setPrereqModal(false); resetPrereq(); }} className="flex-1 py-2 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-800 transition-colors">Batal</button>
            <button type="submit" disabled={createPrereqMut.isPending} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm font-semibold rounded-lg transition-colors">
              {createPrereqMut.isPending ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Path Edge Modal */}
      <AdminModal open={edgeModal} onClose={() => { setEdgeModal(false); resetEdge(); }} title="Tambah Path Edge">
        <form onSubmit={handleEdge((data) => createEdgeMut.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Dari Mata Kuliah</label>
            <select {...regEdge("from_course_id")} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
              <option value="">-- Pilih --</option>
              {courseOptions}
            </select>
            {edgeErrors.from_course_id && <p className="mt-1 text-xs text-red-400">{edgeErrors.from_course_id.message}</p>}
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight size={16} className="text-indigo-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Ke Mata Kuliah</label>
            <select {...regEdge("to_course_id")} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
              <option value="">-- Pilih --</option>
              {courseOptions}
            </select>
            {edgeErrors.to_course_id && <p className="mt-1 text-xs text-red-400">{edgeErrors.to_course_id.message}</p>}
          </div>

          {createEdgeMut.error && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">{createEdgeMut.error.message}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setEdgeModal(false); resetEdge(); }} className="flex-1 py-2 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-800 transition-colors">Batal</button>
            <button type="submit" disabled={createEdgeMut.isPending} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm font-semibold rounded-lg transition-colors">
              {createEdgeMut.isPending ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
