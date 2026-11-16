import { detectV2EmailDomainTypo } from "@/lib/email-typos";
import { getV2PhoneInputError, isValidV2Phone } from "@/lib/phone";
import { isValidEmailAddress, type FieldErrors, type QuoteFormData } from "./types";

export const EMAIL_INVALID_MESSAGE = "Veuillez saisir une adresse e-mail valide.";
export const EMAIL_VERIFYING_MESSAGE = "Vérification de votre e-mail…";

export type EmailClientIssue =
  | { kind: "format"; message: string }
  | { kind: "typo"; message: string; suggestion: string };

/** Levels 1–2 (client): strict format + known consumer-domain typos. Level 3 (MX) is server-side. */
export function getEmailClientIssue(value: string): EmailClientIssue | null {
  const email = value.trim();
  if (!email || /\s/.test(email) || !isValidEmailAddress(email)) {
    return { kind: "format", message: EMAIL_INVALID_MESSAGE };
  }
  const typo = detectV2EmailDomainTypo(email);
  if (typo) {
    return {
      kind: "typo",
      message: `Vérifiez votre adresse e-mail. Vouliez-vous dire ${typo.suggestedEmail} ?`,
      suggestion: typo.suggestedEmail,
    };
  }
  return null;
}

export type EmailServerResult = { ok: true } | { ok: false; message: string; suggestion?: string };

export async function validateEmailOnServer(email: string): Promise<EmailServerResult> {
  type Json = { ok?: boolean; message?: string; suggestion?: string };
  let json: Json | null = null;
  let httpOk = false;
  try {
    const response = await fetch("/api/v2/validate-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    httpOk = response.ok;
    json = (await response.json()) as Json;
  } catch {
    json = null;
  }
  if (!httpOk || !json?.ok) {
    return {
      ok: false,
      message: json?.message?.trim() || EMAIL_INVALID_MESSAGE,
      ...(typeof json?.suggestion === "string" ? { suggestion: json.suggestion } : {}),
    };
  }
  return { ok: true };
}

export function validateEmailPhone(data: QuoteFormData): FieldErrors {
  const errors: FieldErrors = {};
  const emailIssue = getEmailClientIssue(data.email);
  if (emailIssue) errors.email = emailIssue.message;
  const phoneError = getV2PhoneInputError(data.phone);
  if (phoneError) errors.phone = phoneError;
  return errors;
}

export function isPhoneComplete(data: QuoteFormData): boolean {
  return isValidV2Phone(data.phone);
}
