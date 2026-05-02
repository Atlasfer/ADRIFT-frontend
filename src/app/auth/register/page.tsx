"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye, EyeOff, Mail, Lock, User, Hash, CalendarDays,
  ArrowRight, Loader2, BookOpen, GitBranch, BarChart3,
} from "lucide-react";
import { registerUser, sendVerificationEmail } from "@/services/authService";
import { AdriftLogo } from "@/components/auth/AdriftLogo";

const schema = z
  .object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    nrp: z.string().min(1, "NRP wajib diisi"),
    email: z.string().email("Email tidak valid"),
    enrollment_year: z.number(),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

const STEPS = [
  { id: 1, label: "Data Diri" },
  { id: 2, label: "Password" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const goNext = async () => {
    const valid = await trigger(["name", "nrp", "email", "enrollment_year"]);
    if (valid) setStep(2);
  };

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
      await sendVerificationEmail({ email: data.email });
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all";

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-indigo-950 via-zinc-900 to-zinc-950 flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <AdriftLogo size="md" />
        </div>

        <div className="relative space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-indigo-300 text-xs font-medium">Platform Akademik Mahasiswa</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Mulai perjalanan<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                akademikmu.
              </span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Daftar dan akses semua fitur perencanaan studi — dari skill tree hingga simulasi FRS.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: GitBranch, title: "Skill Tree Interaktif", desc: "Visualisasi semua mata kuliah & relasi prasyarat", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
              { icon: BookOpen, title: "Simulasi FRS", desc: "Pilih jadwal dengan deteksi konflik otomatis", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
              { icon: BarChart3, title: "Progress Tracking", desc: "Pantau SKS & estimasi semester kelulusan", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
            ].map(({ icon: Icon, title, desc, color, bg, border }) => (
              <div key={title} className={`flex items-start gap-3 p-3.5 rounded-xl border ${border} bg-white/[0.03]`}>
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon size={15} className={color} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-zinc-700 text-xs">© 2026 ADRIFT · Academic Dependency Route & Integrated FRS Tracker</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-10 lg:hidden">
            <AdriftLogo size="sm" />
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white">Buat akun baru</h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center mb-7">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.id
                      ? "bg-indigo-600 text-white"
                      : step === s.id
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-600/20"
                      : "bg-zinc-800 text-zinc-500"
                  }`}>
                    {step > s.id ? "✓" : s.id}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${step >= s.id ? "text-zinc-300" : "text-zinc-600"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-3 h-px w-10 transition-colors ${step > s.id ? "bg-indigo-600" : "bg-zinc-800"}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ── Step 1: Data Diri ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Nama Lengkap</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input {...register("name")} placeholder="Nama lengkapmu" autoComplete="name" className={inputBase} />
                  </div>
                  {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">NRP</label>
                  <div className="relative">
                    <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input {...register("nrp")} placeholder="Nomor Registrasi Pokok" className={inputBase} />
                  </div>
                  {errors.nrp && <p className="text-xs text-red-400">{errors.nrp.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input {...register("email")} type="email" placeholder="nama@mahasiswa.ac.id" autoComplete="email" className={inputBase} />
                  </div>
                  {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Tahun Angkatan</label>
                  <div className="relative">
                    <CalendarDays size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input {...register("enrollment_year", { valueAsNumber: true })} type="number" placeholder="2023" className={inputBase} />
                  </div>
                  {errors.enrollment_year && <p className="text-xs text-red-400">{errors.enrollment_year.message}</p>}
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all mt-2"
                >
                  Lanjut <ArrowRight size={15} />
                </button>
              </div>
            )}

            {/* ── Step 2: Password ── */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-11 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Konfirmasi Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input
                      {...register("confirm_password")}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Ulangi password"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-11 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirm_password && <p className="text-xs text-red-400">{errors.confirm_password.message}</p>}
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl transition-all"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all"
                  >
                    {loading ? <><Loader2 size={15} className="animate-spin" /> Mendaftar...</> : <>Daftar <ArrowRight size={15} /></>}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-xs text-zinc-700">
            Dengan mendaftar, kamu menyetujui penggunaan data untuk keperluan akademik.
          </p>
        </div>
      </div>
    </div>
  );
}
