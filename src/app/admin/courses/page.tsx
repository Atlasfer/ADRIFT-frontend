// src/app/admin/courses/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Search, ChevronDown } from "lucide-react";
import {
  listCourseGroups,
  listCoursesBySemester,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/services/adminService";
import type { AdminCourseResponse } from "@/types/admin";
import { AdminModal } from "@/components/admin/AdminModal";
import { FormField } from "@/components/admin/FormField";

const courseSchema = z.object({
  code: z.string().min(1, "Kode wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi"),
  credit: z.number({ invalid_type_error: "Harus angka" }).min(1),
  semester: z.number({ invalid_type_error: "Harus angka" }).min(1).max(8),
  is_elective: z.boolean(),
  description: z.string().optional(),
  lab: z.string().min(1, "Lab wajib diisi"),
});

type CourseForm = z.infer<typeof courseSchema>;

export default function AdminCoursesPage() {
  const qc = useQueryClient();
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCourseResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCourseResponse | null>(null);

  const { data: groups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ["admin-course-groups"],
    queryFn: listCourseGroups,
  });

  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ["admin-courses", selectedSemester, search],
    queryFn: () => listCoursesBySemester(selectedSemester!, search || undefined),
    enabled: selectedSemester !== null,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseForm>({ resolver: zodResolver(courseSchema) });

  const createMut = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-course-groups"] });
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      setModalOpen(false);
      reset();
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CourseForm }) =>
      updateCourse(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      setModalOpen(false);
      setEditing(null);
      reset();
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-course-groups"] });
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      setDeleteTarget(null);
    },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ is_elective: false, semester: selectedSemester ?? 1, credit: 3 });
    setModalOpen(true);
  };

  const openEdit = (course: AdminCourseResponse) => {
    setEditing(course);
    reset({
      code: course.code,
      name: course.name,
      credit: course.credit,
      semester: course.semester,
      is_elective: course.is_elective,
      description: course.description ?? "",
      lab: course.lab,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: CourseForm) => {
    if (editing) {
      updateMut.mutate({ id: editing.id, data });
    } else {
      createMut.mutate(data);
    }
  };

  const mutError = createMut.error || updateMut.error;
  const mutLoading = createMut.isPending || updateMut.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mata Kuliah</h1>
          <p className="text-zinc-400 text-sm mt-1">Kelola daftar mata kuliah per semester</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={15} /> Tambah Mata Kuliah
        </button>
      </div>

      {/* Semester selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {loadingGroups ? (
          <div className="text-zinc-500 text-sm">Memuat...</div>
        ) : (
          groups.map((g) => (
            <button
              key={g.semester}
              onClick={() => setSelectedSemester(g.semester)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedSemester === g.semester
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
            >
              Semester {g.semester}
              <span className="ml-1.5 text-xs opacity-60">({g.total_course})</span>
            </button>
          ))
        )}
      </div>

      {/* Courses table */}
      {selectedSemester !== null && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {/* Search */}
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
            <Search size={15} className="text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama mata kuliah..."
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                {["Kode", "Nama", "SKS", "Lab", "Pilihan", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingCourses ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-500 text-sm">Memuat data...</td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-500 text-sm">Tidak ada mata kuliah</td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-indigo-400">{c.code}</td>
                    <td className="px-4 py-3 text-sm text-white">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-zinc-300">{c.credit}</td>
                    <td className="px-4 py-3 text-sm text-zinc-300">{c.lab}</td>
                    <td className="px-4 py-3">
                      {c.is_elective ? (
                        <span className="px-2 py-0.5 text-xs bg-yellow-500/10 text-yellow-400 rounded-full">Pilihan</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs bg-zinc-700 text-zinc-400 rounded-full">Wajib</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); reset(); }}
        title={editing ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Kode" {...register("code")} placeholder="KI1101" error={errors.code?.message} />
            <FormField label="Lab" {...register("lab")} placeholder="KI" error={errors.lab?.message} />
          </div>
          <FormField label="Nama Mata Kuliah" {...register("name")} placeholder="Dasar Pemrograman" error={errors.name?.message} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="SKS" {...register("credit", { valueAsNumber: true })} type="number" min={1} max={6} error={errors.credit?.message} />
            <FormField label="Semester" {...register("semester", { valueAsNumber: true })} type="number" min={1} max={8} error={errors.semester?.message} />
          </div>
          <FormField label="Deskripsi" as="textarea" {...register("description")} placeholder="Deskripsi singkat (opsional)" />
          <div className="flex items-center gap-2">
            <input
              id="is_elective"
              type="checkbox"
              {...register("is_elective")}
              className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="is_elective" className="text-sm text-zinc-300">Mata kuliah pilihan</label>
          </div>

          {mutError && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
              {mutError.message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setModalOpen(false); setEditing(null); reset(); }}
              className="flex-1 py-2 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={mutLoading}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {mutLoading ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirm Modal */}
      <AdminModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Mata Kuliah"
      >
        <p className="text-sm text-zinc-300 mb-6">
          Yakin ingin menghapus <strong className="text-white">{deleteTarget?.name}</strong>? Tindakan ini tidak bisa dibatalkan.
        </p>
        {deleteMut.error && (
          <div className="px-3 py-2 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
            {deleteMut.error.message}
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="flex-1 py-2 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
            disabled={deleteMut.isPending}
            className="flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-900 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {deleteMut.isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
