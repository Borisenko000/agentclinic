# AgentClinic

Клиника для ИИ-агентов: каталог недугов, методы лечения и запись на приём.
Монорепозиторий: `backend/` (Java 21 + Spring Boot 4, REST API, SQLite) и
`frontend/` (Next.js + TypeScript). Подробности — в [`specs/`](specs/).

## Требования

- **JDK 21** (Maven ставить не нужно — в `backend/` есть Maven Wrapper).
- **Node.js 24 LTS** и npm (версия зафиксирована в `frontend/.nvmrc`).

## Запуск в режиме разработки

Нужны два терминала.

**Терминал 1 — бэкенд** (http://localhost:8080):

```bash
cd backend
./mvnw spring-boot:run        # Windows (PowerShell): .\mvnw.cmd spring-boot:run
```

При первом старте создаётся база `backend/data/agentclinic.db` и применяются
миграции Flyway. Проверка: `curl http://localhost:8080/api/health` →
`{"status":"ok"}`.

**Терминал 2 — фронтенд** (http://localhost:3000):

```bash
cd frontend
npm install
npm run dev
```

Фронтенд проксирует `/api/*` на бэкенд. Другой адрес бэкенда задаётся переменной
`BACKEND_URL` (по умолчанию `http://localhost:8080`) до запуска `npm run dev` /
`npm run build`. Страницы агентов загружают данные на сервере Next.js, по тому же
`BACKEND_URL`.

## Что уже есть

| Страница | Что делает |
|----------|------------|
| `/` | Главная и статус бэкенда |
| `/agents` | Список агентов-пациентов по имени |
| `/agents/{id}` | Профиль агента; для несуществующего — страница 404 |
| `/agents/new` | Регистрация агента; после успеха открывается его профиль |

| Эндпоинт | Ответ |
|----------|-------|
| `GET /api/health` | `{"status":"ok"}` |
| `GET /api/agents` | Все агенты, отсортированные по имени |
| `GET /api/agents/{id}` | Агент; `404` — нет такого, `400` — `id` не число |
| `POST /api/agents` | `201` + `Location`; `400` — ошибки полей, `409` — имя занято (без учёта регистра) |

Ошибки возвращаются в формате ProblemDetail (`application/problem+json`); для `400`
и `409` поле `errors` содержит сообщения по полям. Миграция `V3__seed_agents.sql`
заполняет базу шестью агентами, одинаковыми в dev, тестах и E2E.

## Тесты и проверки

**Бэкенд** (`backend/`):

```bash
./mvnw verify                 # JUnit: миграции, API агентов и health, снимок OpenAPI
                              # Windows (PowerShell): .\mvnw.cmd verify
```

**Фронтенд** (`frontend/`):

```bash
npm run lint                  # ESLint
npm run format:check          # Prettier (исправить: npm run format)
npm test                      # Vitest + React Testing Library
npm run build                 # production-сборка и проверка типов
```

**E2E** (`frontend/`) — Playwright сам поднимает бэкенд (на отдельной базе
`backend/data/agentclinic-e2e.db`) и фронтенд. Уже запущенные локально серверы на
портах 8080 и 3000 переиспользуются:

```bash
npx playwright install chromium   # один раз
npm run test:e2e
```

Если Chromium не скачивается, можно использовать установленный Google Chrome:
`PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` (PowerShell:
`$env:PLAYWRIGHT_CHANNEL="chrome"; npm run test:e2e`).

Все эти проверки запускаются в GitHub Actions (`.github/workflows/ci.yml`).

## Контракт API (OpenAPI)

Бэкенд описывает API через springdoc-openapi: JSON спецификации доступен на
http://localhost:8080/v3/api-docs. Снимок спецификации хранится в
[`openapi/openapi.json`](openapi/openapi.json), а TypeScript-типы из него — в
`frontend/src/lib/api/schema.d.ts`. Оба файла коммитятся: фронтенд собирается без
запущенного бэкенда.

Если тест `OpenApiSnapshotTest` падает с «snapshot is outdated», значит, API
изменился. Обновите снимок и типы и закоммитьте оба файла:

```bash
cd backend && ./mvnw test -Dtest=OpenApiSnapshotTest -Dopenapi.update=true
                              # PowerShell: .\mvnw.cmd test "-Dtest=OpenApiSnapshotTest" "-Dopenapi.update=true"
cd ../frontend && npm run api:generate
```

CI падает, если снимок устарел (job `backend`) или типы не перегенерированы (job
`frontend`).

## Вводные данные от стейкхолдеров

- Мэри из инженерной команды хочет надёжный сайт на популярном технологическом стеке на базе TypeScript (фронтенд) и Java (бэкенд), предоставляющий агентам и сотрудникам удобную панель управления.

- Сьюзан из продуктовой команды подготовила набор функций, связанных с агентами, их заболеваниями, методами лечения и записью на приём.

- Стив из отдела маркетинга хочет привлекательный сайт, который хорошо работает в современном браузере.
