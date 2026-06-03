# Структура Проекта Dashboard MT React

## 📁 Организация файлов

```
dashboard-mt-react/
│
├── 📂 public/                          # Статические файлы (доступны как /path)
│   ├── assets/
│   │   ├── images/                     # ФОТО И ИЛЛЮСТРАЦИИ
│   │   │   ├── icons/                  # Иконки (SVG, PNG)
│   │   │   └── backgrounds/            # Фоны, декоративные изображения
│   │   ├── css/
│   │   │   └── map.css
│   │   ├── js/
│   │   │   ├── data.js                 # TopoJSON данные для карты
│   │   │   └── map.js
│   │   └── data/
│   ├── map.html                        # Интерактивная карта
│   └── index.html                      # Точка входа
│
├── 📂 src/                             # Исходный код React
│   ├── components/                     # Переиспользуемые компоненты
│   │   ├── Topbar.jsx                  # Header с логотипом, часы, тема
│   │   ├── Navbar.jsx                  # Навигация (вкладки)
│   │   ├── KpiCard.jsx                 # KPI карточка
│   │   └── ... (20+ компонентов)
│   ├── pages/                          # Полные страницы
│   │   ├── Home.jsx                    # Главная страница ✅
│   │   ├── Dashboard.jsx               # Дашборд с графиками ✅
│   │   └── MapPage.jsx                 # (резерв для React карты)
│   ├── hooks/
│   │   └── useStore.js                 # Zustand state management
│   ├── App.jsx                         # Главный компонент + React Router
│   ├── App.css                         # Глобальные стили + CSS переменные
│   └── main.jsx                        # Entry point
│
├── 📂 designs/                         # МАКЕТЫ И ИСХОДНИКИ
│   ├── mockups/                        # PDF макеты от дизайнера
│   │   └── Мониторинг_главная_light.pdf
│   ├── images/                         # Исходные файлы иллюстраций
│   └── MOCKUPS.md                      # Описание макетов
│
└── 📂 dist/                            # Собранный проект (npm run build)
```

---

## 🖼️ Как работать с макетами и фото

### Когда дизайнер дает макет (PDF):
1. **Положи в**: `designs/mockups/название.pdf`
2. **Обнови**: `designs/MOCKUPS.md` с описанием
3. **Реализуй**: в React компоненте в `src/pages/`

### Когда дизайнер дает иллюстрацию (PNG/SVG):
1. **Положи в**: `public/assets/images/`
2. **Используй в React**:
   ```jsx
   <img src="/assets/images/illustration.png" alt="description" />
   ```

### Пример: Hero иллюстрация
```jsx
// src/pages/Home.jsx
<img
  src="/assets/images/hero-illustration.png"
  alt="Мониторинговые сервисы"
  style={{
    width: '200px',
    height: '180px',
    objectFit: 'contain',
  }}
/>
```

---

## 🎯 Основные страницы

| Страница | Компонент | URL | Статус |
|----------|-----------|-----|--------|
| **Главная** | Home.jsx | `/` | ✅ Готова |
| **Дашборд** | Dashboard.jsx | `/dashboard` | ✅ Готов |
| **Карта** | map.html | `/map` | ✅ Готова |

---

## 🚀 Команды

```bash
# Разработка
npm run dev          # Запуск на http://localhost:5173

# Сборка
npm run build        # Production сборка в dist/

# Preview
npm run preview      # Просмотр собранного проекта
```

---

## 💾 Что хранится где

- **CSS переменные** → `src/App.css` (темы, цвета)
- **Состояние приложения** → `src/hooks/useStore.js` (Zustand)
- **React Router** → `src/App.jsx`
- **Статические файлы** → `public/` (фото, данные, map.html)
- **Макеты** → `designs/` (НЕ коммитятся в git, только для справки)

---

## 📝 Когда добавляешь новую страницу

1. Создай `src/pages/NewPage.jsx`
2. Добавь route в `src/App.jsx`
3. Если нужны иллюстрации → положи в `public/assets/images/`
4. Обновиши этот файл

---

**Текущий статус**: Проект ~98% готов, все основные страницы реализованы и работают! 🎉
