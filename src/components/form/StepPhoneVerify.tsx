"use client";

import { useEffect, useRef, useState } from "react";
import { INPUT } from "./formStyles";

type Props = {
  phone: string;
  verifying: boolean;
  errorMessage: string | null;
  onConfirm: (code: string) => void;
  onEditPhone: () => void;
};

/**
 * OTP screen — demo adapter (no SMS is sent yet).
 * Wire to the same Twilio Verify endpoints as Couverture Mutuelle before go-live.
 */
export function StepPhoneVerify({
  phone,
  verifying,
  errorMessage,
  onConfirm,
  onEditPhone,
}: Props) {
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputClass = INPUT;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const canSubmit = /^\d{6}$/.test(code) && !verifying;

  return (
    <div>
      <div className="rounded-[22px] bg-brand-soft/70 px-4 py-3.5 text-center">
        <p className="text-[1.35rem] font-extrabold tracking-tight text-brand-deep">
          Plus qu’une étape&nbsp;!
        </p>
        <p className="mt-1.5 text-[0.95rem] leading-snug text-zinc-600">
          Saisissez le code reçu par SMS pour confirmer votre numéro.
        </p>
        <p className="mt-2 text-sm font-semibold text-brand-deep">{phone}</p>
      </div>

      <label
        htmlFor="phone-otp"
        className="mt-5 block text-base font-semibold text-brand-deep"
      >
        Code à 6 chiffres
      </label>
      <input
        ref={inputRef}
        id="phone-otp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={6}
        value={code}
        disabled={verifying}
        onChange={(event) => {
          setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && canSubmit) {
            onConfirm(code);
          }
        }}
        className={`${inputClass} text-center text-[1.75rem] font-extrabold tracking-[0.35em] text-brand-deep`}
      />

      {errorMessage ? (
        <p className="mt-2 text-center text-sm text-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onConfirm(code)}
          className="inline-flex min-h-16 w-full items-center justify-center rounded-full bg-cta px-6 py-3.5 text-[1.2rem] font-extrabold text-white shadow-[0_12px_28px_-10px_rgba(3,105,161,0.55)] ring-2 ring-cta/35 transition hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifying ? "Vérification…" : "Confirmer mon numéro"}
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 text-sm">
        <button
          type="button"
          disabled={verifying}
          onClick={onEditPhone}
          className="text-zinc-600 underline underline-offset-2 disabled:opacity-50"
        >
          Modifier mon numéro
        </button>
      </div>
    </div>
  );
}
