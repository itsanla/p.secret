"use client";

import { useState, useEffect, useCallback } from "react";
import * as OTPAuth from "otpauth";
import type { TOTPAccount } from "@/types";

const SERVICE_BADGE: Record<string, string> = {
  aws: "bg-orange-100 text-orange-700",
  github: "bg-slate-800 text-white",
  google: "bg-blue-100 text-blue-700",
  other: "bg-slate-100 text-slate-600",
};

export default function OTPCard({ name, secret, issuer, service }: TOTPAccount) {
  const [otp, setOtp] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [copied, setCopied] = useState(false);

  const generateOTP = useCallback(() => {
    try {
      const totp = new OTPAuth.TOTP({
        issuer,
        label: name,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret.replace(/\s/g, "").toUpperCase()),
      });
      return totp.generate();
    } catch {
      return "------";
    }
  }, [name, secret, issuer]);

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

  const isExpiring = timeRemaining <= 5;
  const progress = (timeRemaining / 30) * 100;
  const badgeClass = SERVICE_BADGE[service] ?? SERVICE_BADGE.other;

  return (
    <div className="bg-[var(--ios-surface)] rounded-3xl border border-[var(--ios-border)] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.07)] animate-in zoom-in-95">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {issuer.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${badgeClass}`}>
              {service}
            </span>
          </div>
          <p className="text-slate-900 font-semibold text-sm leading-tight">{issuer}</p>
          <p className="text-slate-400 text-xs truncate">{name}</p>
        </div>
      </div>

      {/* OTP Button */}
      <button
        onClick={copyOTP}
        className="w-full py-3 px-4 bg-[var(--ios-surface-alt)] rounded-2xl mb-3 transition-all active:scale-[0.98] border border-transparent hover:border-[var(--ios-border)]"
      >
        {copied ? (
          <span className="flex items-center justify-center gap-2 text-emerald-500 font-semibold text-sm">
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

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Expires in</span>
          <span className={isExpiring ? "text-amber-500 font-medium" : ""}>{timeRemaining}s</span>
        </div>
        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${isExpiring ? "bg-amber-400" : "bg-slate-900"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
