use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BillingCycle {
    Weekly,
    Monthly,
    Quarterly,
    SemiAnnually,
    Yearly,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub color: Option<String>,
    pub is_default: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateCategoryPayload {
    pub name: String,
    pub color: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Service {
    pub id: String,
    pub name: String,
    pub icon_url: Option<String>,
    pub url: Option<String>,
    pub default_category_id: Option<String>,
    pub is_default: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateServicePayload {
    pub name: String,
    pub icon_url: Option<String>,
    pub url: Option<String>,
    pub default_category_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Subscription {
    pub id: String,
    pub service_id: Option<String>,
    pub category_id: Option<String>,
    pub custom_name: String,
    pub amount_cents: i64,
    pub currency: String,
    pub billing_cycle: BillingCycle,
    pub start_date: String,
    pub next_billing_date: Option<String>,
    pub payment_method: Option<String>,
    pub reminder_days: Option<i64>,
    pub note: Option<String>,
    pub is_active: bool,
    pub cancelled_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateSubscriptionPayload {
    pub service_id: Option<String>,
    pub category_id: Option<String>,
    pub custom_name: String,
    pub amount_cents: i64,
    pub currency: Option<String>,
    pub billing_cycle: Option<BillingCycle>,
    pub start_date: String,
    pub next_billing_date: Option<String>,
    pub payment_method: Option<String>,
    pub reminder_days: Option<i64>,
    pub note: Option<String>,
}

/// Flattened view returned by the list query (JOINs services + categories).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubscriptionView {
    pub id: String,
    pub custom_name: String,
    pub service_name: Option<String>,
    pub service_icon_url: Option<String>,
    pub service_url: Option<String>,
    pub category_name: Option<String>,
    pub category_color: Option<String>,
    pub amount_cents: i64,
    pub currency: String,
    pub billing_cycle: BillingCycle,
    pub start_date: String,
    pub next_billing_date: Option<String>,
    pub payment_method: Option<String>,
    pub reminder_days: Option<i64>,
    pub note: Option<String>,
    pub is_active: bool,
    pub cancelled_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}
