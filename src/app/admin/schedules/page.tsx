// src/app/admin/schedules/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Filter } from "lucide-react";
import {
  listScheduleGroups,
  listSchedulesByFilter,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAllLectures,
} from "@/services/adminService";
import type { AdminScheduleResponse, AdminScheduleGroupResponse } from "@/types/admin";
import { AdminModal } from "@/components/admin/AdminModal";
import { FormField } from "@/components/admin/FormField";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const PRODI_OPTIONS = ["D4-TI", "D4-SI", "D4-MI"];
const TERM_OPTIONS = ["Ganjil", "Genap"];

const scheduleSchema = z.object({
  course_name: z.string().min(1, "Nama mata kuliah wajib"),
  lecture_id: z.string().min(1, "Dosen wajib dipilih"),
  class: z.string().min(1, "Kelas wajib diisi"),
  day: z.string().min(1, "Hari wajib dipilih"),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM"),
  room: z.string().min(1, "Ruangan wajib diisi"),
  semester: z.number({ invalid_type_error: "Harus angka" }).min(1).max(8),
  academic_year: z.string().min(1, "Tahun akademik wajib diisi"),
  capacity: z.number({ invalid_type_error: "Harus angka" }).min(1),
  sks: z.number({ invalid_type_error: "Harus angka" }).min(1),
  prodi: z.string().min(1, "Prodi wajib dipilih"),
  term: z.string().min(1, "Term wajib dipilih"),
});

type ScheduleForm = z.infer<typeof scheduleSchema>;

export default function AdminSchedulesPage() {
  const qc = useQueryClient();
  const [activeGroup, setActiveGroup] = useState<AdminScheduleGroupResponse | null>(null);
  const [courseName, setCourseName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminScheduleResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminScheduleResponse | null>(null);

  const { data: groups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ["admin-schedule-groups"],
    queryFn: listScheduleGroups,
  });

  const { data: schedules = [], isLoading: loadingSchedules } = useQuery({
    queryKey: ["admin-schedules", activeGroup, courseName],
    queryFn: () =>
      listSchedulesByFilter({
        academic_year: activeGroup!.academic_year,
        term: activeGroup!.term,
        prodi: activeGroup!.prodi,
        semester: String(activeGroup!.semester),
        course_name: courseName || undefined,
      }),
    enabled: activeGroup !== null,
  });

  const { data: lectures = [] } = useQuery({
    queryKey: ["admin-lectures-select"],
    queryFn: getAllLectures,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleForm>({ resolver: zodResolver(scheduleSchema) });

  const createMut = useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-schedule-groups"] });
      qc.invalidateQueries({ queryKey: ["admin-schedules"] });
      setModalOpen(false);
      reset();
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ScheduleForm }) =>
      updateSchedule(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-schedules"] });
      setModalOpen(false);
      setEditing(null);
      reset();
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-schedule-groups"] });
      qc.invalidateQueries({ queryKey: ["admin-schedules"] });
      setDeleteTarget(null);
    },
  });

  const openCreate = () => {
    setEditing(null);
    reset({
      academic_year: activeGroup?.academic_year ?? "",
      term: activeGroup?.term ?? "",
      prodi: activeGroup?.prodi ?? "",
      semester: activeGroup?.semester ?? 1,
      sks: 3,
      capacity: 40,
    });
    setModalOpen(true);
  };

  const openEdit = (s: AdminScheduleResponse) => {
    setEditing(s);
    reset({
      course_name: s.course_name,
      lecture_id: "", // lecture_id isn't returned; user must re-select
      class: s.class,
      day: s.day,
      start_time: s.start_time,
      end_time: s.end_time,
      room: s.room,
      semester: s.semester,
      academic_year: s.academic_year,
      capacity: s.capacity,
      sks: s.sks,
      prodi: s.prodi,
      term: s.term,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: ScheduleForm) => {
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
          <h1 className="text-2xl font-bold text-white">Jadwal</h1>
          <p className="text-zinc-400 text-sm mt-1">Kelola jadwal kuliah per periode</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={15} /> Tambah Jadwal
        </button>
      </div>

      {/* Groups */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {loadingGroups ? (
          <div className="text-zinc-500 text-sm col-span-full">Memuat...</div>
        ) : groups.length === 0 ? (
          <div className="text-zinc-500 text-sm col-span-full">Belum ada grup jadwal</div>
        ) : (
          groups.map((g) => {
            const isActive =
              activeGroup?.academic_year === g.academic_year &&
              activeGroup?.term === g.term &&
              activeGroup?.prodi === g.prodi &&
              activeGroup?.semester === g.semester;
            return (
              <button
                key={`${g.academic_year}-${g.term}-${g.prodi}-${g.semester}`}
                onClick={() => setActiveGroup(g)}
                className={`p-3 rounded-xl text-left text-xs border transition-colors ${
                  isActive
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white"
                }`}
              >
                <p className="font-semibold">{g.academic_year} {g.term}</p>
                <p className="opacity-70 mt-0.5">{g.prodi} — Sem {g.semester}</p>
              </button>
            );
          })
        )}
      </div>

      {/* Schedules table */}
      {activeGroup && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
            <Filter size={14} className="text-zinc-500" />
            <input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Cari mata kuliah..."
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Mata Kuliah", "Kelas", "Dosen", "Hari & Waktu", "Ruangan", "Kapasitas", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingSchedules ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 text-sm">Memuat data...</td>
                  </tr>
                ) : schedules.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 text-sm">Tidak ada jadwal</td>
                  </tr>
                ) : (
                  schedules.map((s) => (
                    <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-white">{s.course_name}</td>
                      <td className="px-4 py-3 text-sm text-zinc-300">{s.class}</td>
                      <td className="px-4 py-3 text-sm text-zinc-300">{s.lecture_name}</td>
                      <td className="px-4 py-3 text-sm text-zinc-300 whitespace-nowrap">
                        {s.day} {s.start_time}–{s.end_time}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-300">{s.room}</td>
                      <td className="px-4 py-3 text-sm text-zinc-300">{s.capacity}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
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
        </div>
      )}

      {/* Create/Edit Modal */}
      <AdminModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); reset(); }}
        title={editing ? "Edit Jadwal" : "Tambah Jadwal"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Nama Mata Kuliah" {...register("course_name")} placeholder="Dasar Pemrograman" error={errors.course_name?.message} />
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Dosen</label>
            <select
              {...register("lecture_id")}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              <option value="">-- Pilih Dosen --</option>
              {lectures.map((l) => (
                <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
              ))}
            </select>
            {errors.lecture_id && <p className="mt-1 text-xs text-red-400">{errors.lecture_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Kelas" {...register("class")} placeholder="A" error={errors.class?.message} />
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Hari</label>
              <select {...register("day")} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
                <option value="">-- Pilih --</option>
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.day && <p className="mt-1 text-xs text-red-400">{errors.day.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Mulai (HH:MM)" {...register("start_time")} placeholder="07:00" error={errors.start_time?.message} />
            <FormField label="Selesai (HH:MM)" {...register("end_time")} placeholder="08:40" error={errors.end_time?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ruangan" {...register("room")} placeholder="TC-101" error={errors.room?.message} />
            <FormField label="Kapasitas" {...register("capacity", { valueAsNumber: true })} type="number" min={1} error={errors.capacity?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="SKS" {...register("sks", { valueAsNumber: true })} type="number" min={1} max={6} error={errors.sks?.message} />
            <FormField label="Semester" {...register("semester", { valueAsNumber: true })} type="number" min={1} max={8} error={errors.semester?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tahun Akademik" {...register("academic_year")} placeholder="2024/2025" error={errors.academic_year?.message} />
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Term</label>
              <select {...register("term")} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
                <option value="">-- Pilih --</option>
                {TERM_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.term && <p className="mt-1 text-xs text-red-400">{errors.term.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Prodi</label>
            <select {...register("prodi")} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500">
              <option value="">-- Pilih Prodi --</option>
              {PRODI_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.prodi && <p className="mt-1 text-xs text-red-400">{errors.prodi.message}</p>}
          </div>

          {mutError && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
              {mutError.message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditing(null); reset(); }} className="flex-1 py-2 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-800 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={mutLoading} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm font-semibold rounded-lg transition-colors">
              {mutLoading ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Modal */}
      <AdminModal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Hapus Jadwal">
        <p className="text-sm text-zinc-300 mb-6">
          Yakin ingin menghapus jadwal <strong className="text-white">{deleteTarget?.course_name} — {deleteTarget?.class}</strong>?
        </p>
        {deleteMut.error && (
          <div className="px-3 py-2 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
            {deleteMut.error.message}
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-800 transition-colors">Batal</button>
          <button onClick={() => deleteTarget && deleteMut.mutate(deleteTarget.id)} disabled={deleteMut.isPending} className="flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-900 text-white text-sm font-semibold rounded-lg transition-colors">
            {deleteMut.isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
