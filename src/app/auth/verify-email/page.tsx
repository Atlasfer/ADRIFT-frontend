// src/app/(auth)/verify-email/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { verifyEmail, sendVerificationEmail } from "@/services/authService";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      setStatus("loading");
      verifyEmail(token)
        .then(() => {
          setStatus("success");
        })
        .catch((err) => {
          setStatus("error");
          setMessage(err instanceof Error ? err.message : "Verifikasi gagal");
        });
    }
  }, [token]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await sendVerificationEmail({ email });
      setResendSuccess(true);
    } catch {
      // ignore
    } finally {
      setResending(false);
    }
  };

  // Jika ada token, tampilkan hasil verifikasi
  if (token) {
    return (
      <div className="w-full max-w-md px-8 py-10 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-zinc-300">Memverifikasi email...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Email Terverifikasi!</h2>
            <p className="text-zinc-400 text-sm mb-6">Akun kamu sudah aktif. Silakan masuk.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              Masuk Sekarang
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Verifikasi Gagal</h2>
            <p className="text-zinc-400 text-sm mb-6">{message ?? "Token tidak valid atau sudah kadaluarsa."}</p>
            <Link href="/login" className="text-indigo-400 text-sm hover:text-indigo-300">
              Kembali ke Login
            </Link>
          </>
        )}
      </div>
    );
  }

  // Halaman instruksi kirim ulang (setelah register)
  return (
    <div className="w-full max-w-md px-8 py-10 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl text-center">
      <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Cek Email Kamu</h2>
      <p className="text-zinc-400 text-sm mb-2">
        Kami telah mengirimkan link verifikasi ke:
      </p>
      {email && <p className="text-indigo-400 font-medium text-sm mb-6">{email}</p>}
      <p className="text-zinc-500 text-xs mb-6">
        Klik link di email untuk mengaktifkan akun. Cek folder spam jika tidak menemukan.
      </p>

      {resendSuccess ? (
        <p className="text-green-400 text-sm">Email berhasil dikirim ulang!</p>
      ) : (
        <button
          onClick={handleResend}
          disabled={resending || !email}
          className="text-indigo-400 hover:text-indigo-300 text-sm disabled:opacity-50 transition-colors"
        >
          {resending ? "Mengirim..." : "Kirim ulang email verifikasi"}
        </button>
      )}

      <div className="mt-4">
        <Link href="/login" className="text-zinc-500 text-xs hover:text-zinc-400 transition-colors">
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-zinc-400">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
