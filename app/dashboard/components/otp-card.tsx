"use client";

import { useState, useEffect, useCallback } from "react";
import * as OTPAuth from "otpauth";
import type { TOTPAccount } from "@/types";

const INITIAL_STYLE: Record<string, string> = {
  aws:    "bg-orange-500/20 text-orange-300",
  github: "bg-white/10 text-white",
  google: "bg-blue-500/20 text-blue-300",
  other:  "bg-indigo-500/20 text-indigo-300",
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
    setTimeout(() => setCopied(false), 1800);
  };

  const isExpiring = timeRemaining <= 7;
  const progress = (timeRemaining / 30) * 100;
  const initStyle = INITIAL_STYLE[service] ?? INITIAL_STYLE.other;

  return (
    <div className="card card-hover animate-in p-5 flex flex-col gap-4 transition-all duration-200">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${initStyle}`}>
          {issuer.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{issuer}</p>
          <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>{name}</p>
        </div>
      </div>

      {/* OTP display */}
      <button
        onClick={copyOTP}
        className="w-full rounded-2xl py-4 text-center transition-all active:scale-[0.98]"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: `1px solid ${isExpiring ? "rgba(251,191,36,0.2)" : "var(--border)"}`,
        }}
      >
        {copied ? (
          <span className="flex items-center justify-center gap-2 text-sm font-semibold"
                style={{ color: "#4ade80" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </span>
        ) : (
          <span
            className="font-code text-3xl font-bold tracking-[0.3em]"
            style={{ color: isExpiring ? "#fbbf24" : "var(--text)" }}
          >
            {otp.slice(0, 3)}&thinsp;{otp.slice(3)}
          </span>
        )}
      </button>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progress}%`,
              background: isExpiring
                ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                : "var(--accent)",
            }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>tap to copy</span>
          <span
            className="text-[10px] font-medium tabular-nums"
            style={{ color: isExpiring ? "#fbbf24" : "var(--text-muted)" }}
          >
            {timeRemaining}s
          </span>
        </div>
      </div>
    </div>
  );
}
