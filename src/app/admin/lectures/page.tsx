// src/app/admin/lectures/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil } from "lucide-react";
import { getAllLectures, createLecture, updateLecture } from "@/services/adminService";
import type { AdminLectureResponse } from "@/types/admin";
import { AdminModal } from "@/components/admin/AdminModal";
import { FormField } from "@/components/admin/FormField";

const schema = z.object({
  code: z.string().min(1, "Kode wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi"),
});

type LectureForm = z.infer<typeof schema>;

export default function AdminLecturesPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminLectureResponse | null>(null);
  const [search, setSearch] = useState("");

  const { data: lectures = [], isLoading } = useQuery({
    queryKey: ["admin-lectures"],
    queryFn: getAllLectures,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LectureForm>({
    resolver: zodResolver(schema),
  });

  const createMut = useMutation({
    mutationFn: createLecture,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-lectures"] }); setModalOpen(false); reset(); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LectureForm }) => updateLecture(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-lectures"] }); setModalOpen(false); setEditing(null); reset(); },
  });

  const openCreate = () => { setEditing(null); reset(); setModalOpen(true); };
  const openEdit = (l: AdminLectureResponse) => { setEditing(l); reset({ code: l.code, name: l.name }); setModalOpen(true); };
  const onSubmit = (data: LectureForm) => {
    if (editing) updateMut.mutate({ id: editing.id, data });
    else createMut.mutate(data);
  };

  const filtered = lectures.filter(
    (l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.code.toLowerCase().includes(search.toLowerCase())
  );

  const mutError = createMut.error || updateMut.error;
  const mutLoading = createMut.isPending || updateMut.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dosen</h1>
          <p className="text-zinc-400 text-sm mt-1">Kelola data dosen pengampu</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
          <Plus size={15} /> Tambah Dosen
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau kode dosen..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Kode</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-zinc-500 text-sm">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-zinc-500 text-sm">Tidak ada dosen</td></tr>
            ) : (
              filtered.map((l) => (
                <tr key={l.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-indigo-400">{l.code}</td>
                  <td className="px-4 py-3 text-sm text-white">{l.name}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                      <Pencil size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); reset(); }} title={editing ? "Edit Dosen" : "Tambah Dosen"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Kode" {...register("code")} placeholder="KI001" error={errors.code?.message} />
          <FormField label="Nama Lengkap" {...register("name")} placeholder="Dr. Budi Santoso, M.T." error={errors.name?.message} />

          {mutError && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">{mutError.message}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditing(null); reset(); }} className="flex-1 py-2 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-800 transition-colors">Batal</button>
            <button type="submit" disabled={mutLoading} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm font-semibold rounded-lg transition-colors">
              {mutLoading ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
