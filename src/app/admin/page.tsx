"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  BookOpen, Calendar, GraduationCap, FlaskConical,
  GitMerge, ArrowUpRight, Plus, Activity, Database,
  Layers, Network, Clock, FileUp,
} from "lucide-react";

const MODULES = [
  {
    href: "/admin/courses",
    addHref: "/admin/courses/new",
    icon: BookOpen,
    label: "Mata Kuliah",
    desc: "Kelola kurikulum & silabus per semester",
    iconGradient: "linear-gradient(135deg,#3b82f6,#6366f1)",
    iconGlow: "rgba(59,130,246,0.35)",
    border: "rgba(59,130,246,0.18)",
    hoverBorder: "rgba(59,130,246,0.45)",
    hoverBg: "rgba(59,130,246,0.06)",
    tag: "Kurikulum",
    tagBg: "rgba(59,130,246,0.12)",
    tagColor: "#60a5fa",
  },
  {
    href: "/admin/schedules",
    addHref: "/admin/schedules/new",
    icon: Calendar,
    label: "Jadwal Kuliah",
    desc: "Atur jadwal, kelas, dan periode akademik",
    iconGradient: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    iconGlow: "rgba(139,92,246,0.35)",
    border: "rgba(139,92,246,0.18)",
    hoverBorder: "rgba(139,92,246,0.45)",
    hoverBg: "rgba(139,92,246,0.06)",
    tag: "Akademik",
    tagBg: "rgba(139,92,246,0.12)",
    tagColor: "#a78bfa",
  },
  {
    href: "/admin/lectures",
    addHref: "/admin/lectures/new",
    icon: GraduationCap,
    label: "Dosen",
    desc: "Manajemen data dosen pengampu mata kuliah",
    iconGradient: "linear-gradient(135deg,#14b8a6,#06b6d4)",
    iconGlow: "rgba(20,184,166,0.35)",
    border: "rgba(20,184,166,0.18)",
    hoverBorder: "rgba(20,184,166,0.45)",
    hoverBg: "rgba(20,184,166,0.06)",
    tag: "SDM",
    tagBg: "rgba(20,184,166,0.12)",
    tagColor: "#2dd4bf",
  },
  {
    href: "/admin/lab-paths",
    addHref: "/admin/lab-paths/new",
    icon: FlaskConical,
    label: "Lab Path",
    desc: "Jalur laboratorium & spesialisasi mahasiswa",
    iconGradient: "linear-gradient(135deg,#10b981,#059669)",
    iconGlow: "rgba(16,185,129,0.35)",
    border: "rgba(16,185,129,0.18)",
    hoverBorder: "rgba(16,185,129,0.45)",
    hoverBg: "rgba(16,185,129,0.06)",
    tag: "Lab",
    tagBg: "rgba(16,185,129,0.12)",
    tagColor: "#34d399",
  },
  {
    href: "/admin/prerequisites",
    addHref: "/admin/prerequisites/new",
    icon: GitMerge,
    label: "Prasyarat & Edge",
    desc: "Relasi prasyarat & path edge skill tree",
    iconGradient: "linear-gradient(135deg,#f59e0b,#eab308)",
    iconGlow: "rgba(245,158,11,0.35)",
    border: "rgba(245,158,11,0.18)",
    hoverBorder: "rgba(245,158,11,0.45)",
    hoverBg: "rgba(245,158,11,0.06)",
    tag: "Relasi",
    tagBg: "rgba(245,158,11,0.12)",
    tagColor: "#fbbf24",
  },
  {
    href: "/admin/frs",
    addHref: "/admin/frs",
    icon: FileUp,
    label: "Upload FRS",
    desc: "Import jadwal massal via file Excel dengan validasi otomatis",
    iconGradient: "linear-gradient(135deg,#ec4899,#db2777)",
    iconGlow: "rgba(236,72,153,0.35)",
    border: "rgba(236,72,153,0.18)",
    hoverBorder: "rgba(236,72,153,0.45)",
    hoverBg: "rgba(236,72,153,0.06)",
    tag: "Import",
    tagBg: "rgba(236,72,153,0.12)",
    tagColor: "#f9a8d4",
  },
];

const STATS = [
  { icon: Layers,   label: "Total Modul",   value: "6",   sub: "Manajemen data",  color: "#3b82f6" },
  { icon: Database, label: "Data Entities", value: "6+",  sub: "Tipe data aktif", color: "#8b5cf6" },
  { icon: Network,  label: "Relasi",        value: "N:N", sub: "Prasyarat & edge",color: "#14b8a6" },
  { icon: Activity, label: "Status",        value: "Live",sub: "Sistem berjalan", color: "#10b981" },
];

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat pagi" : hour < 17 ? "Selamat siang" : "Selamat malam";
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* ── Hero Header ── */}
      <div
        className="relative overflow-hidden px-8 py-8"
        style={{
          background: "linear-gradient(135deg,#0d1426 0%,#0f172a 60%,#0a0f1e 100%)",
          borderBottom: "1px solid rgba(59,130,246,0.12)",
        }}
      >
        <div className="absolute top-0 right-0 w-[480px] h-[260px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top right,rgba(59,130,246,0.13) 0%,transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/3 w-56 h-28 pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(99,102,241,0.08) 0%,transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,#60a5fa 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {greeting}, {user?.name?.split(" ")[0] ?? "Admin"}
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(148,163,184,0.4)" }}>
                <Clock size={11} />
                {dateStr}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-syne)" }}>
              Admin Dashboard
            </h1>
            <p className="text-sm mt-1.5 max-w-lg" style={{ color: "rgba(148,163,184,0.55)" }}>
              Kelola seluruh data akademik ADRIFT — kurikulum, jadwal, dosen, dan relasi antar mata kuliah.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-xs font-semibold text-emerald-400">Sistem Aktif</p>
              <p className="text-[10px]" style={{ color: "rgba(148,163,184,0.4)" }}>All services running</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
          {STATS.map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-none">{value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(148,163,184,0.45)" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-8 py-8 space-y-8">

        {/* Quick Actions */}
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(180deg,#3b82f6,#6366f1)" }} />
            <h2 className="text-sm font-semibold text-white tracking-wide">Aksi Cepat</h2>
            <span className="text-xs px-2 py-0.5 rounded-full ml-1"
              style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>
              {MODULES.length} modul
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {MODULES.map(({ addHref, label, icon: Icon, iconGradient, iconGlow }) => (
              <Link key={addHref} href={addHref}
                className="group flex flex-col items-center gap-2.5 px-3 py-4 rounded-xl text-center transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(59,130,246,0.07)";
                  e.currentTarget.style.border = "1px solid rgba(59,130,246,0.22)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: iconGradient, boxShadow: `0 0 12px ${iconGlow}` }}>
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-tight">{label}</p>
                  <p className="text-[10px] mt-0.5 flex items-center justify-center gap-0.5"
                    style={{ color: "rgba(148,163,184,0.45)" }}>
                    <Plus size={9} /> Tambah
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Module Cards */}
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(180deg,#8b5cf6,#a855f7)" }} />
            <h2 className="text-sm font-semibold text-white tracking-wide">Modul Manajemen</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map(({ href, addHref, icon: Icon, label, desc, iconGradient, iconGlow, border, hoverBorder, hoverBg, tag, tagBg, tagColor }) => (
              <div
                key={href}
                className="group relative rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.02) 100%)",
                  border: `1px solid ${border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `1px solid ${hoverBorder}`;
                  e.currentTarget.style.background = hoverBg;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 32px ${iconGlow.replace("0.35","0.12")}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = `1px solid ${border}`;
                  e.currentTarget.style.background = "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.02) 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Top stripe */}
                <div className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: `linear-gradient(90deg,transparent,${iconGlow.replace("0.35","0.6")},transparent)` }} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: iconGradient, boxShadow: `0 0 16px ${iconGlow}` }}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{ background: tagBg, color: tagColor, border: `1px solid ${tagColor}30` }}>
                      {tag}
                    </span>
                  </div>

                  {/* Body */}
                  <h3 className="text-base font-bold text-white mb-1">{label}</h3>
                  <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(148,163,184,0.55)" }}>{desc}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={href}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                    >
                      <ArrowUpRight size={12} /> Kelola
                    </Link>
                    <Link href={addHref}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150"
                      style={{ background: iconGradient, color: "#fff", boxShadow: `0 0 10px ${iconGlow.replace("0.35","0.25")}` }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                    >
                      <Plus size={12} /> Tambah
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
