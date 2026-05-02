"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import {
  BookOpen, Calendar, FlaskConical, GraduationCap,
  GitMerge, LogOut, LayoutDashboard, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Mata Kuliah", icon: BookOpen },
  { href: "/admin/schedules", label: "Jadwal", icon: Calendar },
  { href: "/admin/lectures", label: "Dosen", icon: GraduationCap },
  { href: "/admin/lab-paths", label: "Lab Path", icon: FlaskConical },
  { href: "/admin/prerequisites", label: "Prasyarat & Edge", icon: GitMerge },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex text-white" style={{ background: "#0a0f1e" }}>

      {/* ── Sidebar ── */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col relative"
        style={{
          background: "linear-gradient(180deg, #0d1426 0%, #0a0f1e 100%)",
          borderRight: "1px solid rgba(59,130,246,0.12)",
        }}
      >
        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-blue-600/5 pointer-events-none" />

        {/* Logo */}
        <div className="px-5 py-5 relative" style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
          <div className="flex items-center gap-3">
            {/* Circular logo — full fill, no black bg */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                boxShadow: "0 0 16px rgba(59,130,246,0.4)",
                padding: "2px",
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/LogoADRIFT.png"
                  alt="ADRIFT"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-white font-extrabold text-sm tracking-widest"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                ADRIFT
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{
                  background: "rgba(59,130,246,0.15)",
                  border: "1px solid rgba(59,130,246,0.3)",
                  color: "#60a5fa",
                }}
              >
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "rgba(148,163,184,0.4)" }}>
            Navigation
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={
                  active
                    ? {
                        background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.15))",
                        border: "1px solid rgba(59,130,246,0.3)",
                        color: "#93c5fd",
                        boxShadow: "0 0 12px rgba(59,130,246,0.1)",
                      }
                    : {
                        background: "transparent",
                        border: "1px solid transparent",
                        color: "rgba(148,163,184,0.6)",
                      }
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={15}
                    style={{ color: active ? "#60a5fa" : "rgba(148,163,184,0.5)" }}
                  />
                  {label}
                </div>
                {active && <ChevronRight size={12} style={{ color: "#60a5fa" }} />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 space-y-2" style={{ borderTop: "1px solid rgba(59,130,246,0.1)" }}>
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
            >
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">{user?.name ?? "Admin"}</p>
              <p className="text-[10px] truncate leading-tight mt-0.5" style={{ color: "rgba(148,163,184,0.5)" }}>
                {user?.email ?? ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-200"
            style={{ color: "rgba(148,163,184,0.5)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f87171";
              e.currentTarget.style.background = "rgba(239,68,68,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(148,163,184,0.5)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <LogOut size={13} />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto min-h-screen">{children}</main>
    </div>
  );
}
