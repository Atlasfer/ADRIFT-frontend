"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "@/services/authService";

const schema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-black text-xs">A</span>
          </div>
          <span className="text-white font-bold tracking-tight">ADRIFT</span>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Email Terkirim!</h2>
              <p className="text-zinc-500 text-sm mt-2">
                Cek email kamu untuk link reset password.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl transition-all"
            >
              Kembali ke Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Lupa Password</h1>
              <p className="mt-1.5 text-sm text-zinc-500">
                Masukkan email terdaftar untuk mendapat link reset password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="nama@mahasiswa.ac.id"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>

              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all"
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /> Mengirim...</> : "Kirim Link Reset"}
              </button>
            </form>

            <Link
              href="/auth/login"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <ArrowLeft size={13} /> Kembali ke Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
