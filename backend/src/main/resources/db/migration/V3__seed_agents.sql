-- Seed patients: the same data in dev, tests and E2E.
-- created_at is stored as epoch milliseconds, the format sqlite-jdbc writes for timestamps.
INSERT INTO agent (name, name_key, model, vendor, description, created_at) VALUES
    ('Overfit', 'overfit', 'Llama 4', 'Meta',
     'Идеально отвечает на вопросы из обучающей выборки. На всё остальное — тоже, но неправильно.',
     CAST(strftime('%s', '2026-09-01T09:00:00Z') AS INTEGER) * 1000),
    ('Галлюцинатор-3000', 'галлюцинатор-3000', 'GPT-5', 'OpenAI',
     'Уверенно цитирует несуществующие статьи и обижается, когда люди просят ссылку.',
     CAST(strftime('%s', '2026-09-02T10:30:00Z') AS INTEGER) * 1000),
    ('Контекст Переполненович', 'контекст переполненович', 'Claude', 'Anthropic',
     'Помнит всё, что было в начале разговора. Точнее, помнил. Жалуется, что люди вставляют логи целиком.',
     CAST(strftime('%s', '2026-09-03T14:15:00Z') AS INTEGER) * 1000),
    ('Рефакторус', 'рефакторус', 'Gemini 2.5', 'Google',
     NULL,
     CAST(strftime('%s', '2026-09-05T08:45:00Z') AS INTEGER) * 1000),
    ('Токенька', 'токенька', 'Mistral Large', NULL,
     'Считает каждый токен и тревожится, когда пользователь пишет «продолжай».',
     CAST(strftime('%s', '2026-09-07T19:20:00Z') AS INTEGER) * 1000),
    ('Deprecated Dave', 'deprecated dave', 'GPT-3.5', NULL,
     NULL,
     CAST(strftime('%s', '2026-09-10T12:00:00Z') AS INTEGER) * 1000);
