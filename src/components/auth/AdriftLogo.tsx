"use client";

import Image from "next/image";

interface AdriftLogoProps {
  size?: "sm" | "md" | "lg";
}

export function AdriftLogo({ size = "md" }: AdriftLogoProps) {
  const circleClass = size === "lg" ? "w-16 h-16" : size === "md" ? "w-12 h-12" : "w-9 h-9";
  const imgSize = size === "lg" ? 64 : size === "md" ? 48 : 36;
  const textClass = size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-base";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${circleClass} rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 p-0.5 shadow-[0_0_20px_rgba(99,102,241,0.4)] flex-shrink-0`}
      >
        <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
          <Image
            src="/LogoADRIFT.png"
            alt="ADRIFT Logo"
            width={imgSize}
            height={imgSize}
            className="object-cover scale-110"
          />
        </div>
      </div>
      <span
        className={`font-extrabold tracking-[0.15em] text-white ${textClass}`}
        style={{ fontFamily: "var(--font-syne)" }}
      >
        ADRIFT
      </span>
    </div>
  );
}
