export type BillingCycle =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "semi_annually"
  | "yearly";

export interface Category {
  id: string;
  name: string;
  color: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryPayload {
  name: string;
  color?: string | null;
}

export interface Service {
  id: string;
  name: string;
  icon_url: string | null;
  url: string | null;
  default_category_id: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateServicePayload {
  name: string;
  icon_url?: string | null;
  url?: string | null;
  default_category_id?: string | null;
}

export interface Subscription {
  id: string;
  service_id: string | null;
  category_id: string | null;
  custom_name: string;
  amount_cents: number;
  currency: string;
  billing_cycle: BillingCycle;
  start_date: string;
  next_billing_date: string | null;
  payment_method: string | null;
  reminder_days: number | null;
  note: string | null;
  is_active: boolean;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionPayload {
  service_id?: string | null;
  category_id?: string | null;
  custom_name: string;
  amount_cents: number;
  currency?: string;
  billing_cycle?: BillingCycle;
  start_date: string;
  next_billing_date?: string | null;
  payment_method?: string | null;
  reminder_days?: number | null;
  note?: string | null;
}

export interface UpdateSubscriptionPayload {
  custom_name?: string;
  service_id?: string | null;
  category_id?: string | null;
  amount_cents?: number;
  currency?: string;
  billing_cycle?: BillingCycle;
  start_date?: string;
  next_billing_date?: string | null;
  payment_method?: string | null;
  reminder_days?: number | null;
  note?: string | null;
  is_active?: boolean;
  cancelled_at?: string | null;
}

/** Flattened view returned by the list query (JOINs services + categories). */
export interface SubscriptionView {
  id: string;
  custom_name: string;
  service_name: string | null;
  service_icon_url: string | null;
  service_url: string | null;
  category_name: string | null;
  category_color: string | null;
  amount_cents: number;
  currency: string;
  billing_cycle: BillingCycle;
  start_date: string;
  next_billing_date: string | null;
  payment_method: string | null;
  reminder_days: number | null;
  note: string | null;
  is_active: boolean;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Display name: prefer service name, fall back to custom name. */
export function displayName(sub: SubscriptionView): string {
  return sub.service_name ?? sub.custom_name;
}

/** Format cents to a decimal string, e.g. 1499 → "14.99". */
export function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}
