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
| Фреймворк      | Spring Boot 3 (Web, Validation, Data JPA)        |
| Сборка         | Maven (с Maven Wrapper)                          |
| База данных    | SQLite на старте; путь миграции на PostgreSQL    |
| Доступ к БД    | Spring Data JPA / Hibernate (`hibernate-community-dialects` для SQLite) |
| Миграции       | Flyway                                           |
| API-контракт   | OpenAPI (springdoc-openapi)                      |
| Тесты          | JUnit 5, Spring Boot Test, MockMvc               |

## Фронтенд

| Область        | Выбор                                            |
|----------------|--------------------------------------------------|
| Язык           | TypeScript (strict)                              |
| Фреймворк      | Next.js (App Router)                             |
| Стили          | Tailwind CSS                                     |
| UI-компоненты  | shadcn/ui                                        |
| Клиент API     | Типы, сгенерированные из OpenAPI-спецификации бэкенда |
| Юнит-тесты     | Vitest + React Testing Library                   |
| E2E-тесты      | Playwright (поднимает фронтенд и бэкенд вместе)  |

## Целевая платформа

Современные evergreen-браузеры (последние версии Chrome, Firefox, Safari, Edge),
адаптивная вёрстка для десктопа и мобильных.

## Соглашения

- Сущности предметной области: **Agent**, **Ailment** (недуг), **Treatment**
  (метод лечения), **Appointment** (запись на приём), **Staff** (персонал).
- Изменения схемы БД — только через миграции Flyway.
- Каждый PR проходит `./mvnw verify` в `backend/` и `lint` + `test` во `frontend/`.
