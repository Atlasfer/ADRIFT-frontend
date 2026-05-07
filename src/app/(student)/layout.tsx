// src/app/(student)/layout.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import StudentNav from "@/components/layout/StudentNav";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const allowAdminSkillTree = user?.role === "ADMIN" && pathname === "/skill-tree";

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (user?.role === "ADMIN" && !allowAdminSkillTree) {
      router.push("/admin");
    }
  }, [isAuthenticated, user, router, allowAdminSkillTree]);

  if (!isAuthenticated || (user?.role !== "STUDENT" && !allowAdminSkillTree)) {
    return null;
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0d0d1a] text-white flex flex-col">
      {user?.role === "STUDENT" && <StudentNav />}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
