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
`npm run build`.

## Тесты и проверки

**Бэкенд** (`backend/`):

```bash
./mvnw verify                 # JUnit: health-эндпоинт и миграции Flyway
                              # Windows (PowerShell): .\mvnw.cmd verify
```

**Фронтенд** (`frontend/`):

```bash
npm run lint                  # ESLint
npm run format:check          # Prettier (исправить: npm run format)
npm test                      # Vitest + React Testing Library
npm run build                 # production-сборка и проверка типов
```

**E2E** (`frontend/`) — Playwright сам поднимает бэкенд и фронтенд:

```bash
npx playwright install chromium   # один раз
npm run test:e2e
```

Если Chromium не скачивается, можно использовать установленный Google Chrome:
`PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` (PowerShell:
`$env:PLAYWRIGHT_CHANNEL="chrome"; npm run test:e2e`).

Все эти проверки запускаются в GitHub Actions (`.github/workflows/ci.yml`).

## Вводные данные от стейкхолдеров

- Мэри из инженерной команды хочет надёжный сайт на популярном технологическом стеке на базе TypeScript (фронтенд) и Java (бэкенд), предоставляющий агентам и сотрудникам удобную панель управления.

- Сьюзан из продуктовой команды подготовила набор функций, связанных с агентами, их заболеваниями, методами лечения и записью на приём.

- Стив из отдела маркетинга хочет привлекательный сайт, который хорошо работает в современном браузере.
