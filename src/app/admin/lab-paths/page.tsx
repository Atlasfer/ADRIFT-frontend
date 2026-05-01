// src/app/admin/lab-paths/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAllLabPaths, createLabPath, updateLabPath, deleteLabPath } from "@/services/adminService";
import type { AdminLabPathResponse } from "@/types/admin";
import { AdminModal } from "@/components/admin/AdminModal";
import { FormField } from "@/components/admin/FormField";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Format hex: #RRGGBB"),
});

type LabPathForm = z.infer<typeof schema>;

export default function AdminLabPathsPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminLabPathResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminLabPathResponse | null>(null);

  const { data: labPaths = [], isLoading } = useQuery({
    queryKey: ["admin-lab-paths"],
    queryFn: getAllLabPaths,
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<LabPathForm>({
    resolver: zodResolver(schema),
    defaultValues: { color: "#6366f1" },
  });

  const colorValue = watch("color");

  const createMut = useMutation({
    mutationFn: createLabPath,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-lab-paths"] }); setModalOpen(false); reset(); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LabPathForm }) => updateLabPath(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-lab-paths"] }); setModalOpen(false); setEditing(null); reset(); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteLabPath,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-lab-paths"] }); setDeleteTarget(null); },
  });

  const openCreate = () => { setEditing(null); reset({ color: "#6366f1" }); setModalOpen(true); };
  const openEdit = (l: AdminLabPathResponse) => { setEditing(l); reset({ name: l.name, color: l.color }); setModalOpen(true); };
  const onSubmit = (data: LabPathForm) => {
    if (editing) updateMut.mutate({ id: editing.id, data });
    else createMut.mutate(data);
  };

  const mutError = createMut.error || updateMut.error;
  const mutLoading = createMut.isPending || updateMut.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Lab Path</h1>
          <p className="text-zinc-400 text-sm mt-1">Kelola jalur laboratorium untuk skill tree</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
          <Plus size={15} /> Tambah Lab Path
        </button>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-sm">Memuat data...</div>
      ) : labPaths.length === 0 ? (
        <div className="text-zinc-500 text-sm">Belum ada lab path</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {labPaths.map((lp) => (
            <div key={lp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: lp.color }}
                />
                <div>
                  <p className="text-sm font-medium text-white">{lp.name}</p>
                  <p className="text-xs text-zinc-500 font-mono">{lp.color}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(lp)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => setDeleteTarget(lp)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); reset(); }} title={editing ? "Edit Lab Path" : "Tambah Lab Path"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Nama Lab Path" {...register("name")} placeholder="Rekayasa Perangkat Lunak" error={errors.name?.message} />
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Warna</label>
            <div className="flex items-center gap-3">
              <input type="color" value={colorValue} onChange={(e) => {}} {...register("color")} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
              <input {...register("color")} placeholder="#6366f1" className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 font-mono" />
            </div>
            {errors.color && <p className="mt-1 text-xs text-red-400">{errors.color.message}</p>}
          </div>

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

      <AdminModal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Hapus Lab Path">
        <p className="text-sm text-zinc-300 mb-6">
          Yakin ingin menghapus lab path <strong className="text-white">{deleteTarget?.name}</strong>?
        </p>
        {deleteMut.error && (
          <div className="px-3 py-2 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">{deleteMut.error.message}</div>
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
