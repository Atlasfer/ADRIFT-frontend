"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  // step 0 → blank
  // step 1 → logo circle scales in
  // step 2 → "ADRIFT" text slides in from left
  // step 3 → tagline fades in
  // step 4 → everything fades out → onComplete
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 200);   // logo in
    const t2 = setTimeout(() => setStep(2), 900);   // text slides in
    const t3 = setTimeout(() => setStep(3), 1600);  // tagline
    const t4 = setTimeout(() => setStep(4), 3000);  // exit
    const t5 = setTimeout(() => onComplete(), 3700); // redirect

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {step < 4 && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] bg-zinc-950 flex items-center justify-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Orbiting rings */}
          <motion.div
            className="absolute w-[380px] h-[380px] rounded-full border border-indigo-500/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-[280px] h-[280px] rounded-full border border-violet-500/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          {/* Center content */}
          <div className="relative flex items-center gap-5">
            {/* Logo circle */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 13, stiffness: 130 }}
                  className="relative flex-shrink-0"
                >
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-indigo-500/50"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Circle — image fills directly, no dark inner bg */}
                  <div
                    className="w-20 h-20 rounded-full overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      boxShadow: "0 0 32px rgba(99,102,241,0.5)",
                      padding: "2px",
                    }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <Image
                        src="/LogoADRIFT.png"
                        alt="ADRIFT"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Text group — slides in from left */}
            <AnimatePresence>
              {step >= 2 && (
                <motion.div
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 18, stiffness: 120 }}
                  className="flex flex-col"
                >
                  <span
                    className="text-5xl font-extrabold tracking-[0.18em] text-white leading-none"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    ADRIFT
                  </span>

                  {/* Tagline slides up */}
                  <AnimatePresence>
                    {step >= 3 && (
                      <motion.span
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="text-zinc-500 text-xs tracking-[0.25em] uppercase mt-1.5"
                      >
                        Academic Dependency Route
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom bar progress */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: step >= 1 ? "100%" : "0%" }}
              transition={{ duration: 2.6, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
