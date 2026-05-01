// src/app/admin/page.tsx
"use client";

import Link from "next/link";
import { BookOpen, Calendar, GraduationCap, FlaskConical, GitMerge, ArrowRight } from "lucide-react";

const CARDS = [
  {
    href: "/admin/courses",
    icon: BookOpen,
    label: "Mata Kuliah",
    desc: "Kelola daftar mata kuliah per semester",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    href: "/admin/schedules",
    icon: Calendar,
    label: "Jadwal",
    desc: "Kelola jadwal kuliah dan kelas",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    href: "/admin/lectures",
    icon: GraduationCap,
    label: "Dosen",
    desc: "Kelola data dosen pengampu",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    href: "/admin/lab-paths",
    icon: FlaskConical,
    label: "Lab Path",
    desc: "Kelola jalur laboratorium",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    href: "/admin/prerequisites",
    icon: GitMerge,
    label: "Prasyarat & Edge",
    desc: "Kelola relasi prasyarat dan path edge",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Kelola data akademik ADRIFT dari sini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map(({ href, icon: Icon, label, desc, color, bg }) => (
          <Link
            key={href}
            href={href}
            className="group p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{label}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{desc}</p>
            </div>
            <div className={`flex items-center gap-1 text-xs ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
              Kelola <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
