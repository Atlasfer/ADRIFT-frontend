// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser, sendVerificationEmail } from "@/services/authService";

const schema = z
  .object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    nrp: z.string().min(1, "NRP wajib diisi"),
    email: z.string().email("Email tidak valid"),
    enrollment_year: z
      .number({ invalid_type_error: "Tahun angkatan harus angka" })
      .min(2000, "Tahun angkatan tidak valid")
      .max(new Date().getFullYear(), "Tahun angkatan tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await registerUser({
        name: data.name,
        nrp: data.nrp,
        email: data.email,
        password: data.password,
        enrollment_year: data.enrollment_year,
      });
      // Kirim email verifikasi otomatis
      await sendVerificationEmail({ email: data.email });
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-8 py-10 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Daftar ke <span className="text-indigo-400">ADRIFT</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Buat akun untuk mulai merencanakan studimu
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Nama Lengkap
          </label>
          <input
            {...register("name")}
            placeholder="Nama lengkapmu"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* NRP */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            NRP
          </label>
          <input
            {...register("nrp")}
            placeholder="Nomor Registrasi Pokok"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {errors.nrp && (
            <p className="mt-1 text-xs text-red-400">{errors.nrp.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="nama@mahasiswa.ac.id"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Enrollment Year */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Tahun Angkatan
          </label>
          <input
            {...register("enrollment_year", { valueAsNumber: true })}
            type="number"
            placeholder="2023"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {errors.enrollment_year && (
            <p className="mt-1 text-xs text-red-400">
              {errors.enrollment_year.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="Minimal 8 karakter"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Konfirmasi Password
          </label>
          <input
            {...register("confirm_password")}
            type="password"
            placeholder="Ulangi password"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {errors.confirm_password && (
            <p className="mt-1 text-xs text-red-400">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors"
        >
          {loading ? "Mendaftar..." : "Daftar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}
