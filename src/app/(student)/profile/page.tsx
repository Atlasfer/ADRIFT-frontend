// src/app/(student)/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getMe, updateUser } from "@/services/authService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, CreditCard, Calendar, Save, Loader2, CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  nrp: z.string().min(1, "NRP wajib diisi"),
  enrollment_year: z.number().min(2000, "Tahun angkatan tidak valid"),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      nrp: user?.nrp || "",
      enrollment_year: user?.enrollment_year || new Date().getFullYear(),
    },
  });

  // Refresh user data on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getMe();
        setUser(userData);
        reset({
          name: userData.name,
          nrp: userData.nrp,
          enrollment_year: userData.enrollment_year,
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    }
    fetchUser();
  }, [setUser, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const updatedUser = await updateUser(data);
      setUser(updatedUser);
      reset(data); // Reset form to mark as not dirty
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0d0d1a] py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile Saya</h1>
          <p className="text-white/40 text-sm mt-2">
            Kelola informasi akun dan data akademik Anda
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Card */}
          <div className="bg-[#0f0f1a] border border-white/10 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 px-6 py-8 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                  <p className="text-white/60 text-sm mt-1">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user?.is_verified
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {user?.is_verified ? "Verified" : "Not Verified"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                  <User className="w-4 h-4" />
                  Nama Lengkap
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan nama lengkap"
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* NRP */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                  <CreditCard className="w-4 h-4" />
                  NRP
                </label>
                <input
                  {...register("nrp")}
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan NRP"
                />
                {errors.nrp && (
                  <p className="text-xs text-red-400">{errors.nrp.message}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/40 cursor-not-allowed"
                />
                <p className="text-xs text-white/30">Email tidak dapat diubah</p>
              </div>

              {/* Enrollment Year */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                  <Calendar className="w-4 h-4" />
                  Tahun Angkatan
                </label>
                <input
                  {...register("enrollment_year", { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="2024"
                />
                {errors.enrollment_year && (
                  <p className="text-xs text-red-400">
                    {errors.enrollment_year.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <p className="text-sm text-green-400">
                    Profile berhasil diperbarui!
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isDirty}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Account Info */}
          <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Informasi Akun
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-white/40">User ID</span>
                <span className="text-white/70 font-mono">{user?.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-white/40">Role</span>
                <span className="text-white/70">{user?.role}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/40">Status Verifikasi</span>
                <span
                  className={`font-medium ${
                    user?.is_verified ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {user?.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
