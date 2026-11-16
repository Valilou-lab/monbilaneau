import { NextResponse } from "next/server";
import { isValidEmailAddress } from "@/components/form/types";
import { normalizeV2PhoneToE164 } from "@/lib/phone";

export const runtime = "nodejs";

type Body = {
  company?: unknown;
  contactName?: unknown;
  email?: unknown;
  phone?: unknown;
  /** Honeypot: hidden field, must stay empty. */
  website?: unknown;
};

function clean(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/**
 * « Devenir partenaire » → e-mail to CONTACT_TO (default contact@valeadata.com) via Resend.
 * Env (Vercel): RESEND_API_KEY, CONTACT_FROM (address on a domain verified in Resend), CONTACT_TO.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  // Bots fill every field: pretend success, send nothing.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const company = clean(body.company);
  const contactName = clean(body.contactName);
  const email = clean(body.email, 254);
  const phoneRaw = clean(body.phone, 40);
  const phone = normalizeV2PhoneToE164(phoneRaw);

  if (!company || !contactName || !isValidEmailAddress(email) || !phone) {
    return NextResponse.json({ ok: false, error: "Merci de remplir correctement tous les champs." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO || "contact@valeadata.com";
  if (!apiKey || !from) {
    return NextResponse.json(
      { ok: false, error: "Le formulaire n’est pas encore activé. Écrivez-nous directement à contact@valeadata.com." },
      { status: 503 },
    );
  }

  const rows: [string, string][] = [
    ["Entreprise", company],
    ["Contact", contactName],
    ["E-mail", email],
    ["Téléphone", phone],
  ];
  const html = `<h2>Nouvelle demande de partenariat — devis.monbilaneau.fr</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>`;
  const text = rows.map(([k, v]) => `${k} : ${v}`).join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Partenariat Mon Bilan Eau — ${company}`,
        html,
        text,
      }),
    });
    if (!response.ok) throw new Error(`resend ${response.status}`);
  } catch {
    return NextResponse.json(
      { ok: false, error: "L’envoi a échoué. Réessayez ou écrivez-nous à contact@valeadata.com." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
