"use client";

import Image from "next/image";

interface AdriftLogoProps {
  size?: "sm" | "md" | "lg";
}

export function AdriftLogo({ size = "md" }: AdriftLogoProps) {
  const px = size === "lg" ? 64 : size === "md" ? 48 : 36;
  const textClass = size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-base";

  return (
    <div className="flex items-center gap-3">
      {/* Circular logo — image fills the circle directly, no dark inner bg */}
      <div
        className="rounded-full overflow-hidden flex-shrink-0"
        style={{
          width: px,
          height: px,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          boxShadow: "0 0 20px rgba(99,102,241,0.45)",
          padding: "2px",
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          <Image
            src="/LogoADRIFT.png"
            alt="ADRIFT Logo"
            width={px}
            height={px}
            className="w-full h-full object-cover"
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
