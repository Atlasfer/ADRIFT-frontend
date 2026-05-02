"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  BookOpen, Calendar, GraduationCap, FlaskConical,
  GitMerge, ArrowUpRight, Sparkles, Zap, TrendingUp,
} from "lucide-react";

const MODULES = [
  {
    href: "/admin/courses",
    icon: BookOpen,
    label: "Mata Kuliah",
    desc: "Kelola kurikulum per semester",
    accent: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/20 hover:border-blue-400/40",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    tag: "Kurikulum",
    tagColor: "bg-blue-500/10 text-blue-400",
  },
  {
    href: "/admin/schedules",
    icon: Calendar,
    label: "Jadwal",
    desc: "Atur jadwal kuliah & kelas",
    accent: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20 hover:border-violet-400/40",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    tag: "Akademik",
    tagColor: "bg-violet-500/10 text-violet-400",
  },
  {
    href: "/admin/lectures",
    icon: GraduationCap,
    label: "Dosen",
    desc: "Data dosen pengampu",
    accent: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-500/20 hover:border-amber-400/40",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    tag: "SDM",
    tagColor: "bg-amber-500/10 text-amber-400",
  },
  {
    href: "/admin/lab-paths",
    icon: FlaskConical,
    label: "Lab Path",
    desc: "Jalur laboratorium & spesialisasi",
    accent: "from-emerald-500/20 to-green-500/10",
    border: "border-emerald-500/20 hover:border-emerald-400/40",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    tag: "Lab",
    tagColor: "bg-emerald-500/10 text-emerald-400",
  },
  {
    href: "/admin/prerequisites",
    icon: GitMerge,
    label: "Prasyarat & Edge",
    desc: "Relasi antar mata kuliah",
    accent: "from-orange-500/20 to-red-500/10",
    border: "border-orange-500/20 hover:border-orange-400/40",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-400",
    tag: "Relasi",
    tagColor: "bg-orange-500/10 text-orange-400",
  },
];

const QUICK_ACTIONS = [
  { href: "/admin/courses/new", label: "Tambah Mata Kuliah", icon: BookOpen, color: "text-blue-400" },
  { href: "/admin/schedules/new", label: "Tambah Jadwal", icon: Calendar, color: "text-violet-400" },
  { href: "/admin/lectures/new", label: "Tambah Dosen", icon: GraduationCap, color: "text-amber-400" },
  { href: "/admin/lab-paths/new", label: "Tambah Lab Path", icon: FlaskConical, color: "text-emerald-400" },
];

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat pagi" : hour < 17 ? "Selamat siang" : "Selamat malam";

  return (
    <div className="min-h-full bg-zinc-950">
      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-zinc-800/60 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-950">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative px-8 py-10">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-400" />
                <span className="text-indigo-400 text-xs font-medium tracking-wide uppercase">
                  {greeting}, {user?.name?.split(" ")[0] ?? "Admin"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-zinc-500 text-sm max-w-md">
                Kelola seluruh data akademik ADRIFT — kurikulum, jadwal, dosen, dan relasi antar mata kuliah.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300 text-xs font-medium">Sistem aktif</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-8">
            {[
              { icon: TrendingUp, label: "Modul tersedia", value: "5" },
              { icon: Zap, label: "Aksi cepat", value: "4" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
                  <Icon size={14} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-none">{value}</p>
                  <p className="text-zinc-600 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Quick actions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Aksi Cepat</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-800/60 transition-all"
              >
                <Icon size={15} className={`${color} flex-shrink-0`} />
                <span className="text-zinc-300 text-xs font-medium group-hover:text-white transition-colors leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Modul Manajemen</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map(({ href, icon: Icon, label, desc, accent, border, iconBg, iconColor, tag, tagColor }) => (
              <Link
                key={href}
                href={href}
                className={`group relative overflow-hidden p-5 bg-zinc-900 border ${border} rounded-2xl transition-all duration-200 flex flex-col gap-4`}
              >
                {/* Gradient bg */}
                <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon size={18} className={iconColor} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColor}`}>{tag}</span>
                    <ArrowUpRight
                      size={15}
                      className="text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <p className="font-semibold text-white text-base">{label}</p>
                  <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
