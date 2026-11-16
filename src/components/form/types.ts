export type NeedId = "calcaire" | "boisson" | "gout_odeur" | "indecis";
export type HousingId = "maison" | "appartement";
export type OccupancyId = "proprietaire" | "locataire";
export type HouseholdId = "1" | "2" | "3-4" | "5+";

export type QuoteFormData = {
  needs: NeedId[];
  housing: HousingId | "";
  occupancy: OccupancyId | "";
  household: HouseholdId | "";
  postalCode: string;
  city: string;
  citiesOptions: string[];
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  consent: boolean;
};

export const initialFormData: QuoteFormData = {
  needs: [],
  housing: "",
  occupancy: "",
  household: "",
  postalCode: "",
  city: "",
  citiesOptions: [],
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  consent: false,
};

export type FieldErrors = Partial<Record<keyof QuoteFormData, string>>;

export type StepId =
  | "needs"
  | "housing"
  | "occupancy"
  | "household"
  | "postal"
  | "contact"
  | "searching"
  | "eligiblePartners"
  | "phoneVerify"
  | "confirmation";

/** Questions shown with the progress bar. */
export const QUESTION_STEPS: StepId[] = [
  "needs",
  "housing",
  "occupancy",
  "household",
  "postal",
  "contact",
];

export const FLOW_STEPS: StepId[] = [
  ...QUESTION_STEPS,
  "searching",
  "eligiblePartners",
  "phoneVerify",
  "confirmation",
];

/** Minimum time on the searching screen even if eligibility is instant. */
export const ELIGIBILITY_MIN_LOADING_MS = 3500;

export type EligiblePartner = { id: string; name: string };

export type EligibilityResponse = {
  eligible: boolean;
  partners: EligiblePartner[];
  eligibilityToken: string;
};

const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function isValidEmailAddress(value: string): boolean {
  const email = value.trim();
  if (email.length > 254 || /\.\./.test(email)) return false;
  const tld = email.split(".").pop() ?? "";
  return EMAIL_RE.test(email) && /^[A-Za-z]{2,}$/.test(tld);
}
