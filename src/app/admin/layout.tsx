// src/app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import {
  BookOpen,
  Calendar,
  FlaskConical,
  GraduationCap,
  GitMerge,
  LogOut,
  LayoutDashboard,
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
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-zinc-800">
          <span className="text-lg font-bold tracking-tight text-white">
            ADRIFT <span className="text-indigo-400 text-xs font-semibold ml-1 bg-indigo-500/10 px-1.5 py-0.5 rounded">Admin</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-4 py-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name ?? "Admin"}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={13} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
