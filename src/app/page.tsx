"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/auth/SplashScreen";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
    router.push("/auth/login");
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
    </>
  );
}
