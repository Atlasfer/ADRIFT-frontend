// src/app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPassword } from "@/services/authService";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md px-8 py-10 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Email Terkirim!</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Cek email kamu untuk link reset password.
        </p>
        <Link href="/login" className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
          Kembali ke Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-8 py-10 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Lupa Password</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Masukkan email terdaftar untuk mendapat link reset password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
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
          {loading ? "Mengirim..." : "Kirim Link Reset"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          ← Kembali ke Login
        </Link>
      </p>
    </div>
  );
}
