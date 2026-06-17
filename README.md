# Центр мониторинга Минтруда России

Дашборд для мониторинга социальной поддержки отдельных категорий граждан.

## Стек

React 19 · TypeScript · Zustand · React Router v7 · Vite 8 · Chart.js · Sentry

## Запуск

```bash
cp .env.example .env   # заполнить VITE_SENTRY_DSN
npm install
npm run dev
```

## Команды

| Команда | Описание |
|---|---|
| `npm run dev` | Дев-сервер |
| `npm run build` | Продакшн-билд |
| `npm test` | Тесты (Vitest) |
| `npm run test:coverage` | Покрытие тестами |
| `npm run preview` | Превью продакшн-билда |

## Структура

```
src/
  components/     — UI-компоненты
    blocks/       — детализация по блокам
  hooks/          — Zustand store, SF, анимации
  layouts/        — DashboardLayout
  lib/            — утилиты (storage, formatters, config)
  pages/          — страницы (Home, Dashboard, Map, NotFound)
  services/       — API-слой (mockApi → заменить на реальный)
  styles/         — CSS по секциям
  tests/          — Vitest тесты
  types/          — TypeScript типы
```

## Деплой

Настроен для Netlify (`netlify.toml`). Security headers в `public/_headers`.

Перед деплоем установить переменные окружения:
- `VITE_SENTRY_DSN` — DSN из sentry.io
- `VITE_APP_ENV=production`
- `VITE_APP_VERSION=1.0.0`
