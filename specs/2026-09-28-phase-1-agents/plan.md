# Фаза 1. Агенты — план

Решения и контекст — в [`requirements.md`](requirements.md), критерии готовности —
в [`validation.md`](validation.md).

Правило: **одна группа — один коммит**. Группа закрывается, только когда все её
проверки зелёные. Группы выполняются строго по порядку. Тесты пишутся до кода.

## 1. Бэкенд: сущность Agent и список (roadmap 1.1)

1.1. Миграция `V2__create_agent.sql`: таблица `agent` (`id` INTEGER PK AUTOINCREMENT,
     `name`, `name_key` UNIQUE, `model`, `vendor`, `description`, `created_at`).
1.2. Миграция `V3__seed_agents.sql`: 5–6 сатирических агентов (разные модели и
     вендоры, у части `vendor`/`description` пустые), `name_key` в нижнем регистре.
1.3. Entity `Agent` в `dev.polina.agentclinic.agent`, `AgentRepository`
     (`findAll` с сортировкой по `nameKey`, `existsByNameKey`).
1.4. Проверить, что `ddl-auto: validate` проходит, и отдельно — маппинг
     `Instant` ↔ SQLite. Результат записать в `requirements.md`.
1.5. **Тест первым:** MockMvc `GET /api/agents` → `200`, JSON-массив из seed-агентов,
     отсортированный по имени; у каждого есть `id`, `name`, `model`, `createdAt`.
1.6. DTO `AgentResponse` (record), `AgentService.findAll()`, `AgentController`.
1.7. Тест миграций: `flyway_schema_history` содержит версии 1–3 со статусом success.
1.8. Проверка: `./mvnw verify`, ручной `curl localhost:8080/api/agents`.

## 2. OpenAPI и типы для фронтенда (roadmap 1.1, tech-stack)

2.1. Зависимость `springdoc-openapi-starter-webmvc-api` (версия под Boot 4),
     фиксированный `servers` и заголовок API в конфигурации.
2.2. **Тест снимка:** `OpenApiSnapshotTest` получает `/v3/api-docs` через MockMvc и
     сравнивает JSON-дерево с `openapi/openapi.json`. С `-Dopenapi.update=true`
     тест перезаписывает файл вместо сравнения.
2.3. Сгенерировать и закоммитить `openapi/openapi.json`.
2.4. Фронтенд: dev-зависимость `openapi-typescript`, скрипт
     `api:generate` → `src/lib/api/schema.d.ts`; файл коммитится и исключается из Prettier.
2.5. CI, job `frontend`: после `npm ci` выполнить `npm run api:generate` и
     `git diff --exit-code src/lib/api/schema.d.ts`.
2.6. `README.md`: как обновить контракт (две команды).
2.7. Проверка: `./mvnw verify`, `npm run api:generate` без диффа, `npm run build`.

## 3. Фронтенд: список агентов (roadmap 1.2)

3.1. Серверный хелпер `src/lib/api/server.ts`: `backendUrl()` из `BACKEND_URL` с тем
     же значением по умолчанию, что в `next.config.ts` (вынести константу в общий модуль).
3.2. `src/lib/api/agents.ts`: типы `Agent` из `schema.d.ts`, `fetchAgents()` и
     `fetchAgent(id)` для сервера (`cache: "no-store"`; `fetchAgent` возвращает
     `null` на 404).
3.3. **Тест первым:** `AgentList` рендерит имя, модель и вендор каждого агента,
     ссылки ведут на `/agents/{id}`; пустой список показывает понятный текст и
     ссылку на регистрацию.
3.4. `AgentList` (shadcn `Card` или таблица) и страница `app/agents/page.tsx`
     (Server Component, `dynamic = "force-dynamic"`), кнопка «Зарегистрировать агента».
     `app/agents/error.tsx`: понятное сообщение и кнопка «Повторить», если бэкенд
     недоступен.
3.5. Шапка: «Агенты» → ссылка на `/agents`, `aria-current` по `usePathname()`
     (навигацию вынести в маленький клиентский компонент); обновить тест layout.
3.6. Проверка: `lint`, `format:check`, `test`, `build` (без запущенного бэкенда);
     вручную `/agents` в браузере с seed-данными.

## 4. Профиль агента (roadmap 1.3)

4.1. **Тест первым (бэкенд):** `GET /api/agents/{id}` → `200` с полным телом;
     несуществующий id → `404` `application/problem+json`; `id=abc` → `400` ProblemDetail.
4.2. Включить `spring.mvc.problemdetails.enabled`, `AgentNotFoundException` →
     `404` через `@RestControllerAdvice` в `dev.polina.agentclinic.web`.
4.3. `AgentService.findById`, эндпоинт в `AgentController`. Обновить снимок OpenAPI и
     `schema.d.ts`.
4.4. **Тест первым (фронтенд):** `AgentProfile` показывает все поля; `createdAt` —
     дата на русском; пустые `vendor`/`description` не рендерят пустые строки.
4.5. `AgentProfile` и `app/agents/[id]/page.tsx` (`notFound()` при `null`),
     ссылка «← Все агенты».
4.6. Проверка: `./mvnw verify`, все проверки фронтенда; вручную `/agents/1` и
     `/agents/999999` (страница 404).

## 5. Регистрация агента (roadmap 1.4)

5.1. **Тест первым (бэкенд):** `POST /api/agents`:
     - валидное тело → `201`, `Location`, тело с `id`;
     - пустое `name` / слишком длинные поля → `400` с `errors.<поле>`;
     - дубль имени в другом регистре (кириллица и латиница) → `409` с `errors.name`;
     - пробелы обрезаются, пустой `vendor` сохраняется как `null`.
5.2. `CreateAgentRequest` (record + Bean Validation, сообщения на русском),
     `AgentService.create` (trim, `name_key`, проверка дубля),
     `DuplicateAgentNameException` → `409`; `DataIntegrityViolationException` на
     `name_key` тоже → `409`.
5.3. `MethodArgumentNotValidException` → `400` ProblemDetail с `errors` (поле → сообщение).
5.4. Обновить снимок OpenAPI и `schema.d.ts`; `createAgent()` в `src/lib/api/agents.ts`
     (через прокси `/api`) возвращает агента или ошибки полей.
5.5. **Тест первым (фронтенд):** `AgentRegistrationForm`:
     - `201` → `router.push("/agents/{id}")`;
     - `400` → сообщения у полей;
     - `409` → сообщение у поля «Имя»;
     - сетевая ошибка → общее сообщение;
     - во время отправки кнопка неактивна.
5.6. Компоненты shadcn `input`, `textarea`, `label`; форма и `app/agents/new/page.tsx`.
     Ограничения `required`/`maxLength` в HTML повторяют серверные. Источник истины —
     сервер.
5.7. Проверка: все проверки обоих приложений; вручную регистрация, дубль, пустая форма.

## 6. E2E, документация, завершение фазы

6.1. `frontend/e2e/agents.spec.ts`:
     - `/agents` показывает seed-агента → клик → профиль с его данными;
     - `/agents/new` → отправка пустой формы → видны ошибки полей;
     - регистрация агента с уникальным именем (суффикс из времени) → открылся его
       профиль → он есть в `/agents`.
6.2. Убедиться, что smoke-тест фазы 0 по-прежнему зелёный (навигация изменилась).
6.3. `README.md`: новые страницы и эндпоинты, Swagger/OpenAPI-JSON, обновление контракта.
6.4. `CHANGELOG.md`: запись о фазе 1. `tech-stack.md`: уточнить строку про OpenAPI
     (где лежит снимок, как генерируются типы).
6.5. Отметить 1.1–1.4 в `specs/roadmap.md`; дописать в `requirements.md` решения,
     принятые при реализации.
6.6. Пройти весь [`validation.md`](validation.md), затем открыть PR в `main`.
