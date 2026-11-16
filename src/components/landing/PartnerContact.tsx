"use client";

import { useState, type FormEvent } from "react";
import { isValidEmailAddress } from "@/components/form/types";
import { isValidV2Phone } from "@/lib/phone";

const INPUT =
  "mt-1 min-h-14 w-full rounded-[14px] border-2 border-brand-muted bg-white px-4 py-3 text-[1.05rem] outline-none placeholder:text-zinc-400 focus:border-brand focus:ring-[3px] focus:ring-brand/15";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

/** « Vous souhaitez devenir partenaire ? » — B2B contact form under the final CTA. */
export function PartnerContact() {
  const [form, setForm] = useState({ company: "", contactName: "", email: "", phone: "", website: "" });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const ready =
    form.company.trim() && form.contactName.trim() && isValidEmailAddress(form.email) && isValidV2Phone(form.phone);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!ready || status.kind === "sending") return;
    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/partner-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !json?.ok) throw new Error(json?.error || "L’envoi a échoué. Réessayez plus tard.");
      setStatus({ kind: "sent" });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "L’envoi a échoué." });
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <section aria-labelledby="devenir-partenaire" className="mx-auto w-full max-w-[640px] px-4 pb-12">
      <div className="rounded-[22px] border border-brand-muted/70 bg-brand-soft/50 p-5 sm:p-6">
        <h2 id="devenir-partenaire" className="text-center text-[1.35rem] font-extrabold tracking-[-0.02em] text-brand-deep">
          Vous souhaitez devenir partenaire&nbsp;?
        </h2>
        <p className="mt-1 text-center text-[1rem] text-zinc-600">Professionnel du traitement de l’eau&nbsp;: contactez-nous&nbsp;!</p>

        {status.kind === "sent" ? (
          <p className="mt-5 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-center font-semibold text-emerald-900" role="status">
            Merci&nbsp;! Votre demande a bien été envoyée, nous revenons vers vous rapidement.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-5 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-[0.98rem] font-medium">
                Nom de l’entreprise
                <input autoComplete="organization" className={INPUT} {...field("company")} />
              </label>
              <label className="block text-[0.98rem] font-medium">
                Nom du contact
                <input autoComplete="name" className={INPUT} {...field("contactName")} />
              </label>
              <label className="block text-[0.98rem] font-medium">
                E-mail
                <input type="email" inputMode="email" autoComplete="email" className={INPUT} {...field("email")} />
              </label>
              <label className="block text-[0.98rem] font-medium">
                Téléphone
                <input type="tel" inputMode="tel" autoComplete="tel" className={INPUT} {...field("phone")} />
              </label>
            </div>
            {/* Honeypot — hidden from humans */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label>
                Site web
                <input tabIndex={-1} autoComplete="off" {...field("website")} />
              </label>
            </div>
            {status.kind === "error" ? (
              <p className="text-[0.95rem] font-medium text-error" role="alert">
                {status.message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={!ready || status.kind === "sending"}
              className="mt-1 inline-flex min-h-14 w-full items-center justify-center rounded-full border-[2.5px] border-brand bg-white px-6 text-[1.05rem] font-extrabold text-brand transition hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-zinc-300 disabled:text-zinc-400 disabled:hover:bg-white"
            >
              {status.kind === "sending" ? "Envoi…" : "Envoyer ma demande de partenariat"}
            </button>
            <p className="text-center text-[0.8rem] leading-snug text-zinc-500">
              Vos informations sont utilisées uniquement pour répondre à votre demande de partenariat.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
