// src/app/(student)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import StudentNav from "@/components/layout/StudentNav";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (user?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "STUDENT") {
    return null;
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0d0d1a] text-white flex flex-col">
      <StudentNav />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
