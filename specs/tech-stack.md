# Технологический стек AgentClinic

## Обзор

Монорепозиторий из двух приложений:

```
agentproject/
├── backend/    # Java 21 + Spring Boot — REST API, владеет базой данных
├── frontend/   # Next.js + TypeScript — UI, ходит только в REST API
└── specs/      # конституция проекта и спецификации
```

**Граница ответственности:** базой данных владеет только бэкенд. Фронтенд не
обращается к БД напрямую — весь доступ к данным идёт через REST API.

## Бэкенд

| Область        | Выбор                                            |
|----------------|--------------------------------------------------|
| Язык           | Java 21                                          |
| Фреймворк      | Spring Boot 4 (WebMVC, Validation, Data JPA)     |
| Сборка         | Maven (с Maven Wrapper)                          |
| База данных    | SQLite (`backend/data/agentclinic.db`); путь миграции на PostgreSQL |
| Доступ к БД    | Spring Data JPA / Hibernate 7 (`hibernate-community-dialects` для SQLite) |
| Миграции       | Flyway                                           |
| API-контракт   | OpenAPI (springdoc-openapi) — с фазы 1           |
| Тесты          | JUnit 5, Spring Boot Test, MockMvc               |

## Фронтенд

| Область        | Выбор                                            |
|----------------|--------------------------------------------------|
| Язык           | TypeScript (strict)                              |
| Среда          | Node.js 24 LTS, пакетный менеджер npm            |
| Фреймворк      | Next.js 16 (App Router)                          |
| Стили          | Tailwind CSS 4                                   |
| UI-компоненты  | shadcn/ui (на Base UI)                           |
| Клиент API     | Типы, сгенерированные из OpenAPI-спецификации бэкенда (с фазы 1; до этого — вручную в `src/lib/api/`) |
| Доступ к API   | Прокси Next.js: `/api/*` → `BACKEND_URL` (по умолчанию `http://localhost:8080`), один origin, без CORS |
| Стиль кода     | ESLint + Prettier                                |
| Юнит-тесты     | Vitest + React Testing Library                   |
| E2E-тесты      | Playwright, Chromium (поднимает фронтенд и бэкенд вместе) |

## Целевая платформа

Современные evergreen-браузеры (последние версии Chrome, Firefox, Safari, Edge),
адаптивная вёрстка для десктопа и мобильных.

## Соглашения

- Сущности предметной области: **Agent**, **Ailment** (недуг), **Treatment**
  (метод лечения), **Appointment** (запись на приём), **Staff** (персонал).
- Изменения схемы БД — только через миграции Flyway.
- Каждый PR проходит в GitHub Actions `./mvnw verify` в `backend/`,
  `lint` + `format:check` + `test` + `build` во `frontend/` и E2E-smoke на Playwright.
