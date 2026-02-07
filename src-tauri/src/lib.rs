use tauri_plugin_sql::{Builder as SqlBuilder, Migration, MigrationKind};

pub mod models;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_tables",
            sql: r#"
                CREATE TABLE IF NOT EXISTS categories (
                    id          TEXT    PRIMARY KEY NOT NULL,
                    name        TEXT    NOT NULL UNIQUE,
                    color       TEXT,
                    is_default  INTEGER NOT NULL DEFAULT 0,
                    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
                    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
                );

                CREATE TABLE IF NOT EXISTS services (
                    id                  TEXT    PRIMARY KEY NOT NULL,
                    name                TEXT    NOT NULL UNIQUE,
                    icon_url            TEXT,
                    url                 TEXT,
                    default_category_id TEXT,
                    is_default          INTEGER NOT NULL DEFAULT 0,
                    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
                    updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (default_category_id) REFERENCES categories(id) ON DELETE SET NULL
                );

                CREATE TABLE IF NOT EXISTS subscriptions (
                    id                TEXT    PRIMARY KEY NOT NULL,
                    service_id        TEXT,
                    category_id       TEXT,
                    custom_name       TEXT    NOT NULL,
                    amount_cents      INTEGER NOT NULL,
                    currency          TEXT    NOT NULL DEFAULT 'EUR',
                    billing_cycle     TEXT    NOT NULL DEFAULT 'monthly'
                                      CHECK (billing_cycle IN ('weekly','monthly','quarterly','semi_annually','yearly')),
                    start_date        TEXT    NOT NULL,
                    next_billing_date TEXT,
                    payment_method    TEXT,
                    reminder_days     INTEGER DEFAULT 0,
                    note              TEXT,
                    is_active         INTEGER NOT NULL DEFAULT 1,
                    cancelled_at      TEXT,
                    created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
                    updated_at        TEXT    NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (service_id)  REFERENCES services(id)   ON DELETE SET NULL,
                    FOREIGN KEY (category_id) REFERENCES categories(id)  ON DELETE SET NULL
                );

                CREATE INDEX IF NOT EXISTS idx_sub_service   ON subscriptions(service_id);
                CREATE INDEX IF NOT EXISTS idx_sub_category  ON subscriptions(category_id);
                CREATE INDEX IF NOT EXISTS idx_sub_active    ON subscriptions(is_active);
                CREATE INDEX IF NOT EXISTS idx_sub_next_bill ON subscriptions(next_billing_date);
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "seed_default_data",
            sql: r#"
                -- Default categories
                INSERT OR IGNORE INTO categories (id, name, color, is_default) VALUES
                    ('cat-entertainment',  'Entertainment',    '#E74C3C', 1),
                    ('cat-productivity',   'Productivity',     '#3498DB', 1),
                    ('cat-cloud',          'Cloud Services',   '#9B59B6', 1),
                    ('cat-music',          'Music',            '#E67E22', 1),
                    ('cat-gaming',         'Gaming',           '#2ECC71', 1),
                    ('cat-news',           'News & Media',     '#1ABC9C', 1),
                    ('cat-health',         'Health & Fitness', '#F39C12', 1),
                    ('cat-education',      'Education',        '#34495E', 1),
                    ('cat-other',          'Other',            '#95A5A6', 1);

                -- Default services
                INSERT OR IGNORE INTO services (id, name, icon_url, url, default_category_id, is_default) VALUES
                    ('svc-netflix',         'Netflix',          'https://logo.clearbit.com/netflix.com',       'https://netflix.com',        'cat-entertainment', 1),
                    ('svc-spotify',         'Spotify',          'https://logo.clearbit.com/spotify.com',       'https://spotify.com',        'cat-music',         1),
                    ('svc-disney',          'Disney+',          'https://logo.clearbit.com/disneyplus.com',    'https://disneyplus.com',     'cat-entertainment', 1),
                    ('svc-youtube',         'YouTube Premium',  'https://logo.clearbit.com/youtube.com',       'https://youtube.com',        'cat-entertainment', 1),
                    ('svc-apple-music',     'Apple Music',      'https://logo.clearbit.com/apple.com',         'https://music.apple.com',    'cat-music',         1),
                    ('svc-github',          'GitHub Pro',       'https://logo.clearbit.com/github.com',        'https://github.com',         'cat-cloud',         1),
                    ('svc-icloud',          'iCloud+',          'https://logo.clearbit.com/icloud.com',        'https://icloud.com',         'cat-cloud',         1),
                    ('svc-dropbox',         'Dropbox',          'https://logo.clearbit.com/dropbox.com',       'https://dropbox.com',        'cat-cloud',         1),
                    ('svc-adobe',           'Adobe CC',         'https://logo.clearbit.com/adobe.com',         'https://adobe.com',          'cat-productivity',  1),
                    ('svc-chatgpt',         'ChatGPT Plus',     'https://logo.clearbit.com/openai.com',        'https://chat.openai.com',    'cat-productivity',  1),
                    ('svc-xbox',            'Xbox Game Pass',   'https://logo.clearbit.com/xbox.com',          'https://xbox.com',           'cat-gaming',        1),
                    ('svc-playstation',     'PlayStation Plus',  'https://logo.clearbit.com/playstation.com',  'https://playstation.com',    'cat-gaming',        1),
                    ('svc-notion',          'Notion',           'https://logo.clearbit.com/notion.so',         'https://notion.so',          'cat-productivity',  1),
                    ('svc-1password',       '1Password',        'https://logo.clearbit.com/1password.com',     'https://1password.com',      'cat-productivity',  1),
                    ('svc-todoist',         'Todoist',          'https://logo.clearbit.com/todoist.com',       'https://todoist.com',        'cat-productivity',  1);
            "#,
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            SqlBuilder::default()
                .add_migrations("sqlite:siphon.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
