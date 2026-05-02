"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
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
    <div className="min-h-screen flex bg-zinc-950 text-white">
      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-xs">A</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-sm tracking-tight">ADRIFT</span>
              <span className="text-indigo-400 text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-600/90 text-white shadow-sm shadow-indigo-900/50"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} className={active ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"} />
                  {label}
                </div>
                {active && <ChevronRight size={12} className="text-indigo-300" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-zinc-800/60 space-y-2">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-zinc-800/40">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">{user?.name ?? "Admin"}</p>
              <p className="text-[10px] text-zinc-500 truncate leading-tight mt-0.5">{user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={13} />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto min-h-screen">{children}</main>
    </div>
  );
}
