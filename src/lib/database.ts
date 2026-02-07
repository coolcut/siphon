import Database from "@tauri-apps/plugin-sql";
import type {
  Category,
  CreateCategoryPayload,
  CreateServicePayload,
  CreateSubscriptionPayload,
  Service,
  SubscriptionView,
  UpdateSubscriptionPayload,
} from "./types";

let db: Database | null = null;

async function getDb(): Promise<Database> {
  if (!db) {
    db = await Database.load("sqlite:siphon.db");
  }
  return db;
}

// ── Categories ────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const database = await getDb();
  return await database.select<Category[]>(
    "SELECT * FROM categories ORDER BY name ASC"
  );
}

export async function createCategory(
  payload: CreateCategoryPayload
): Promise<string> {
  const database = await getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await database.execute(
    "INSERT INTO categories (id, name, color, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
    [id, payload.name, payload.color ?? null, now, now]
  );

  return id;
}

export async function deleteCategory(id: string): Promise<void> {
  const database = await getDb();
  await database.execute("DELETE FROM categories WHERE id = $1", [id]);
}

// ── Services ──────────────────────────────────────────────

export async function getAllServices(): Promise<Service[]> {
  const database = await getDb();
  return await database.select<Service[]>(
    "SELECT * FROM services ORDER BY name ASC"
  );
}

export async function createService(
  payload: CreateServicePayload
): Promise<string> {
  const database = await getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await database.execute(
    `INSERT INTO services (id, name, icon_url, url, default_category_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      id,
      payload.name,
      payload.icon_url ?? null,
      payload.url ?? null,
      payload.default_category_id ?? null,
      now,
      now,
    ]
  );

  return id;
}

export async function deleteService(id: string): Promise<void> {
  const database = await getDb();
  await database.execute("DELETE FROM services WHERE id = $1", [id]);
}

// ── Subscriptions ─────────────────────────────────────────

export async function getAllSubscriptions(): Promise<SubscriptionView[]> {
  const database = await getDb();
  return await database.select<SubscriptionView[]>(
    `SELECT
        sub.id,
        sub.custom_name,
        svc.name        AS service_name,
        svc.icon_url    AS service_icon_url,
        svc.url         AS service_url,
        cat.name        AS category_name,
        cat.color       AS category_color,
        sub.amount_cents,
        sub.currency,
        sub.billing_cycle,
        sub.start_date,
        sub.next_billing_date,
        sub.payment_method,
        sub.reminder_days,
        sub.note,
        sub.is_active,
        sub.cancelled_at,
        sub.created_at,
        sub.updated_at
     FROM subscriptions sub
     LEFT JOIN services   svc ON sub.service_id  = svc.id
     LEFT JOIN categories cat ON sub.category_id = cat.id
     ORDER BY sub.next_billing_date ASC`
  );
}

export async function createSubscription(
  payload: CreateSubscriptionPayload
): Promise<string> {
  const database = await getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await database.execute(
    `INSERT INTO subscriptions
        (id, service_id, category_id, custom_name, amount_cents, currency,
         billing_cycle, start_date, next_billing_date, payment_method,
         reminder_days, note, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      id,
      payload.service_id ?? null,
      payload.category_id ?? null,
      payload.custom_name,
      payload.amount_cents,
      payload.currency ?? "EUR",
      payload.billing_cycle ?? "monthly",
      payload.start_date,
      payload.next_billing_date ?? null,
      payload.payment_method ?? null,
      payload.reminder_days ?? 0,
      payload.note ?? null,
      now,
      now,
    ]
  );

  return id;
}

export async function updateSubscription(
  id: string,
  payload: UpdateSubscriptionPayload
): Promise<void> {
  const database = await getDb();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  fields.push(`updated_at = $${paramIndex}`);
  values.push(now);
  paramIndex++;

  values.push(id);

  await database.execute(
    `UPDATE subscriptions SET ${fields.join(", ")} WHERE id = $${paramIndex}`,
    values
  );
}

export async function deleteSubscription(id: string): Promise<void> {
  const database = await getDb();
  await database.execute("DELETE FROM subscriptions WHERE id = $1", [id]);
}
