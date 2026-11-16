export function isCompletePostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode);
}

/** Browser → same-origin /api/communes (server proxies geo.api.gouv.fr + fallback). */
export async function fetchCitiesByPostalCode(
  postalCode: string,
  signal?: AbortSignal,
): Promise<string[]> {
  if (!isCompletePostalCode(postalCode)) return [];
  const response = await fetch(`/api/communes?codePostal=${encodeURIComponent(postalCode)}`, { signal });
  if (!response.ok) throw new Error("location-lookup-failed");
  const payload = (await response.json()) as { cities?: unknown };
  if (!Array.isArray(payload.cities)) throw new Error("location-lookup-failed");
  return payload.cities.filter((city): city is string => typeof city === "string" && city.length > 0);
}
