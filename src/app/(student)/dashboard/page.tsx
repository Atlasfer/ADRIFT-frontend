// src/app/(student)/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutGrid,
  GitBranch,
  User,
  Calendar,
  BookOpen,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const quickLinks = [
    {
      title: "FRS Simulator",
      description: "Simulasi pengambilan mata kuliah",
      icon: LayoutGrid,
      href: "/frs-simulator",
      color: "from-blue-600 to-blue-700",
      iconBg: "bg-blue-600",
    },
    {
      title: "Skill Tree",
      description: "Visualisasi kurikulum & dependency",
      icon: GitBranch,
      href: "/skill-tree",
      color: "from-violet-600 to-violet-700",
      iconBg: "bg-violet-600",
    },
    {
      title: "Profile",
      description: "Kelola informasi akun Anda",
      icon: User,
      href: "/profile",
      color: "from-green-600 to-green-700",
      iconBg: "bg-green-600",
    },
  ];

  const stats = [
    {
      label: "Tahun Angkatan",
      value: user?.enrollment_year || "-",
      icon: Calendar,
      color: "text-blue-400",
    },
    {
      label: "Status",
      value: user?.is_verified ? "Verified" : "Not Verified",
      icon: user?.is_verified ? CheckCircle2 : Clock,
      color: user?.is_verified ? "text-green-400" : "text-yellow-400",
    },
    {
      label: "Role",
      value: user?.role || "-",
      icon: BookOpen,
      color: "text-violet-400",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0d0d1a] py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl sm:text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Selamat datang, {user?.name?.split(" ")[0] || "User"}! 👋
              </h1>
              <p className="text-white/40 text-sm sm:text-base mt-1">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-[#0f0f1a] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40">{stat.label}</p>
                      <p className={`text-base font-semibold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Quick Access</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative bg-[#0f0f1a] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />

                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-lg ${link.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-white/40 mb-4">
                      {link.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-blue-400 font-medium">
                      <span>Buka</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* About ADRIFT */}
          <div className="bg-gradient-to-br from-blue-600/10 to-violet-600/10 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Tentang ADRIFT
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              <strong className="text-white">ADRIFT</strong> (Academic
              Dependency Route & Integrated FRS Tracker) adalah platform
              akademik yang membantu mahasiswa merencanakan studi dengan lebih
              cerdas melalui visualisasi kurikulum dan simulasi FRS.
            </p>
            <div className="space-y-2">
              {[
                "Visualisasi dependency mata kuliah",
                "Simulasi FRS dengan deteksi konflik",
                "Tracking progress akademik real-time",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-white/70">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Mulai Menggunakan
            </h3>
            <div className="space-y-3">
              {[
                {
                  step: "1",
                  title: "Lengkapi Profile",
                  desc: "Update informasi akademik Anda",
                },
                {
                  step: "2",
                  title: "Eksplorasi Skill Tree",
                  desc: "Lihat visualisasi kurikulum",
                },
                {
                  step: "3",
                  title: "Simulasi FRS",
                  desc: "Rencanakan mata kuliah semester depan",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/30">
            © 2026 ADRIFT · Academic Dependency Route & Integrated FRS Tracker
          </p>
        </div>
      </div>
    </div>
  );
}
