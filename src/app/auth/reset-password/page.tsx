// src/app/(auth)/reset-password/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPassword } from "@/services/authService";

const schema = z
  .object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setError("Token tidak ditemukan");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await resetPassword(token, { password: data.password });
      router.push("/login?reset=success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset password gagal");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md px-8 py-10 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl text-center">
        <p className="text-red-400 text-sm">Token tidak valid.</p>
        <Link href="/forgot-password" className="mt-4 block text-indigo-400 text-sm hover:text-indigo-300">
          Minta link baru
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-8 py-10 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
        <p className="mt-1 text-sm text-zinc-400">Buat password baru untuk akunmu.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password Baru</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Minimal 8 karakter"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Konfirmasi Password</label>
          <input
            {...register("confirm_password")}
            type="password"
            placeholder="Ulangi password baru"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {errors.confirm_password && (
            <p className="mt-1 text-xs text-red-400">{errors.confirm_password.message}</p>
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
          {loading ? "Menyimpan..." : "Simpan Password Baru"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-zinc-400">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
