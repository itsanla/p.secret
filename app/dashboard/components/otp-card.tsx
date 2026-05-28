"use client";

import { useState, useEffect, useCallback } from "react";
import * as OTPAuth from "otpauth";

interface OTPCardProps {
  email: string;
  secret: string;
  backupCodes: string[];
}

export default function OTPCard({ email, secret, backupCodes }: OTPCardProps) {
  const [otp, setOtp] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [copied, setCopied] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState<number | null>(null);

  const generateOTP = useCallback(() => {
    try {
      const totp = new OTPAuth.TOTP({
        issuer: "Google",
        label: email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret.replace(/\s/g, "").toUpperCase()),
      });
      return totp.generate();
    } catch {
      return "------";
    }
  }, [email, secret]);

  useEffect(() => {
    const update = () => {
      const now = Math.floor(Date.now() / 1000);
      setTimeRemaining(30 - (now % 30));
      setOtp(generateOTP());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [generateOTP]);

  const copyOTP = async () => {
    await navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copyBackup = async (code: string, index: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedBackup(index);
    setTimeout(() => setCopiedBackup(null), 1500);
  };

  const isExpiring = timeRemaining <= 5;
  const progress = (timeRemaining / 30) * 100;
  const initials = email.charAt(0).toUpperCase();

  return (
    <>
      <div className="bg-[var(--ios-surface)] rounded-3xl border border-[var(--ios-border)] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.07)] animate-in zoom-in-95">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 font-medium text-sm truncate">{email}</p>
            <p className="text-slate-400 text-xs">Google Authenticator</p>
          </div>
        </div>

        <button
          onClick={copyOTP}
          className="w-full py-3 px-4 bg-[var(--ios-surface-alt)] rounded-2xl mb-3 transition-all active:scale-[0.98] border border-transparent hover:border-[var(--ios-border)]"
        >
          {copied ? (
            <span className="flex items-center justify-center gap-2 text-emerald-500 font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </span>
          ) : (
            <span className={`font-code text-2xl font-semibold tracking-[0.25em] ${isExpiring ? "text-amber-500 animate-pulse" : "text-slate-900"}`}>
              {otp.slice(0, 3)} {otp.slice(3)}
            </span>
          )}
        </button>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Expires in</span>
            <span className={isExpiring ? "text-amber-500" : ""}>{timeRemaining}s</span>
          </div>
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${isExpiring ? "bg-amber-400" : "bg-slate-900"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {backupCodes.length > 0 && (
          <button
            onClick={() => setShowBackup(true)}
            className="w-full py-2 px-3 text-xs font-medium text-slate-500 hover:text-slate-700 bg-[var(--ios-surface-alt)] rounded-xl transition-colors"
          >
            View Backup Codes ({backupCodes.length})
          </button>
        )}
      </div>

      {showBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowBackup(false)} />
          <div className="relative bg-[var(--ios-surface)] rounded-3xl border border-[var(--ios-border)] p-6 w-full max-w-sm shadow-[0_30px_80px_rgba(15,23,42,0.15)] animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">Backup Codes</h3>
                <p className="text-xs text-slate-500 truncate max-w-[220px]">{email}</p>
              </div>
              <button onClick={() => setShowBackup(false)} className="p-2 rounded-full hover:bg-[var(--ios-surface-alt)]">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {backupCodes.map((code, i) => (
                <button
                  key={i}
                  onClick={() => copyBackup(code, i)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-[var(--ios-surface-alt)] border border-[var(--ios-border)] rounded-xl text-sm transition-colors hover:bg-slate-100"
                >
                  <span className="font-code text-slate-900">{code}</span>
                  {copiedBackup === i ? (
                    <span className="text-emerald-500 text-xs">Copied!</span>
                  ) : (
                    <span className="text-slate-400 text-xs">Copy</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
