# Фаза 0. Скелет — план

Решения и контекст — в [`requirements.md`](requirements.md), критерии готовности —
в [`validation.md`](validation.md).

Правило: **одна группа — один коммит**. Группа закрывается, только когда все её
проверки зелёные. Группы выполняются строго по порядку.

## 1. Бэкенд: Spring Boot и health (roadmap 0.1)

1.1. Создать `backend/`, перенести туда `pom.xml`; удалить корневой `src/` с шаблонным
     `Main.java`.
1.2. Переписать `pom.xml`: parent `spring-boot-starter-parent` 4.x, `dev.polina:agentclinic-backend`,
     Java 21, стартеры `webmvc` и `validation`, тестовые стартеры.
1.3. Добавить Maven Wrapper (`mvnw`, `mvnw.cmd`, `.mvn/`).
1.4. Класс `dev.polina.agentclinic.AgentClinicApplication`.
1.5. **Тест первым:** MockMvc-тест `GET /api/health` → `200`, `{"status":"ok"}`.
1.6. `HealthController`, после него тест зелёный.
1.7. `backend/.gitignore` (`target/`, `data/`); корневой `.gitignore` для файлов IDE и ОС.
1.8. Проверка: `./mvnw verify`, ручной `curl localhost:8080/api/health`.

## 2. Бэкенд: SQLite, JPA, Flyway (roadmap 0.2)

2.1. Зависимости: `sqlite-jdbc`, Data JPA, `hibernate-community-dialects`,
     `spring-boot-starter-flyway` (и модуль Flyway для SQLite, если он нужен).
2.2. `application.yml`: datasource `jdbc:sqlite:./data/agentclinic.db`, диалект
     `SQLiteDialect`, `ddl-auto: validate`, создание каталога `data/` при старте.
2.3. Миграция `db/migration/V1__init.sql` (пустая, с комментарием).
2.4. Тестовый профиль: временная БД SQLite (файл во временном каталоге).
2.5. **Тест:** контекст поднимается, `flyway_schema_history` содержит версию `1`
     со статусом success.
2.6. Проверка на Windows и через CI-образ Linux (локально хотя бы `./mvnw verify`).
     Если есть проблемы совместимости Boot 4 / Hibernate 7 / SQLite, записать их
     в `requirements.md`.

## 3. Фронтенд: Next.js (roadmap 0.3)

3.1. `create-next-app` в `frontend/`: TypeScript, App Router, Tailwind, ESLint,
     `src/`-каталог, npm. Node 24 LTS зафиксировать в `.nvmrc` и `engines`.
3.2. Проверить, что включён `strict: true` в `tsconfig.json`.
3.3. Стартовая страница с заголовком «Добро пожаловать в AgentClinic» и коротким
     сатирическим подзаголовком.
3.4. Подключить Prettier (+ `eslint-config-prettier`), скрипты `format` и `format:check`.
3.5. Подключить Vitest + React Testing Library + jsdom, скрипт `test`;
     **тест:** стартовая страница рендерит заголовок.
3.6. Проверка: `npm run lint`, `npm run format:check`, `npm test`, `npm run build`.

## 4. Связка фронтенда и бэкенда (roadmap 0.4)

4.1. `rewrites` в `next.config`: `/api/:path*` → `${BACKEND_URL ?? "http://localhost:8080"}/api/:path*`.
4.2. Тип `HealthResponse` и функция `fetchHealth()` в `src/lib/api/`.
4.3. **Тест первым:** компонент `BackendStatus` показывает три состояния:
     «проверяем…», «ok», «недоступен» (fetch замокан).
4.4. Реализовать `BackendStatus` (клиентский компонент), вывести его на главной.
4.5. Проверка: оба приложения запущены — видно «ok»; бэкенд остановлен — видно
     «недоступен», страница не падает.

## 5. shadcn/ui и общий layout (roadmap 0.5)

5.1. `npx shadcn init` (совместимо с установленной версией Tailwind), базовые компоненты,
     которые реально используются (например, `button`, `badge`).
5.2. Компоненты `SiteHeader` (логотип-текст + навигация), `SiteFooter`; подключить
     в `app/layout.tsx`.
5.3. Навигация: «Главная» + заглушки будущих разделов («Агенты», «Недуги»), которые
     пока неактивны (фазы 1–2).
5.4. `BackendStatus` оформить через shadcn `Badge`.
5.5. **Тест:** layout рендерит шапку, навигацию и футер.
5.6. Проверка ширины: 375 px и 1280 px без горизонтального скролла.

## 6. Playwright, CI, документация (roadmap 0.6)

6.1. Playwright в `frontend/e2e/`, только Chromium; `webServer` поднимает бэкенд
     (`mvnw` / `mvnw.cmd` по платформе) и фронтенд, ждёт `/api/health` и `/`.
6.2. **Smoke-тест:** главная содержит заголовок, шапку и статус бэкенда «ok».
6.3. Скрипт `test:e2e`.
6.4. `.github/workflows/ci.yml`: job `backend` (Temurin 21, `./mvnw verify`),
     job `frontend` (Node 24, `npm ci`, `lint`, `format:check`, `test`, `build`),
     job `e2e` (после двух предыдущих: браузеры Playwright + `test:e2e`),
     кэши Maven и npm.
6.5. `README.md` в корне: требования (JDK 21, Node 24), запуск в двух терминалах,
     команды тестов.
6.6. Обновить `specs/tech-stack.md`: Spring Boot 4, Node 24, npm, прокси `/api`.
6.7. Отметить 0.1–0.6 в `specs/roadmap.md`.
6.8. Пройти весь [`validation.md`](validation.md), затем открыть PR.
