"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmail, sendVerificationEmail } from "@/services/authService";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
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
        .then(() => setStatus("success"))
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

  // Token flow — show verification result
  if (token) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          {status === "loading" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
                <Loader2 size={28} className="text-indigo-400 animate-spin" />
              </div>
              <p className="text-zinc-300 font-medium">Memverifikasi email...</p>
              <p className="text-zinc-600 text-sm">Mohon tunggu sebentar</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Email Terverifikasi!</h2>
                <p className="text-zinc-500 text-sm mt-2">Akun kamu sudah aktif. Silakan masuk.</p>
              </div>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all"
              >
                Masuk Sekarang
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <XCircle size={28} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Verifikasi Gagal</h2>
                <p className="text-zinc-500 text-sm mt-2">{message ?? "Token tidak valid atau sudah kadaluarsa."}</p>
              </div>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl transition-all"
              >
                Kembali ke Login
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Post-register — waiting for email click
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
          <Mail size={28} className="text-indigo-400" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Cek Email Kamu</h2>
          <p className="text-zinc-500 text-sm mt-2">
            Kami mengirimkan link verifikasi ke
          </p>
          {email && (
            <p className="text-indigo-400 font-semibold text-sm mt-1">{email}</p>
          )}
          <p className="text-zinc-600 text-xs mt-3">
            Klik link di email untuk mengaktifkan akun. Cek folder spam jika tidak menemukan.
          </p>
        </div>

        <div className="space-y-3">
          {resendSuccess ? (
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
              <CheckCircle2 size={15} />
              Email berhasil dikirim ulang!
            </div>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending || !email}
              className="w-full flex items-center justify-center gap-2 py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? <><Loader2 size={14} className="animate-spin" /> Mengirim...</> : "Kirim ulang email verifikasi"}
            </button>
          )}

          <Link
            href="/auth/login"
            className="block text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={24} className="text-indigo-400 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
