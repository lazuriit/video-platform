# 📑 Документация API платформы YADRO

Данный раздел содержит описание REST API для взаимодействия фронтенда с бэкендом (Flask).

## 🚀 Общая информация

* **Базовый URL:** `/api`
* **Формат данных:** JSON (если не указано иное)
* **Авторизация:** Bearer JWT-токен в заголовке `Authorization: Bearer <token>`

---

## 🔐 1. Авторизация и пользователи

### Регистрация (`POST /api/register`)
Создание новой учетной записи пользователя.

<details>
<summary><b>Структура запроса и ответа</b></summary>

**Тело запроса (JSON):**
```json
{
  "email": "user@example.com",
  "password": "secretpassword",
  "first_name": "Иван",
  "last_name": "Иванов"
}
```

**Ответы:**
* `201 Created` — Пользователь успешно создан:
  ```json
  { "message": "Регистрация прошла успешно!" }
  ```
* `400 Bad Request` — Неверный формат данных или email уже занят.
</details>

### Вход в систему (`POST /api/login`)
Аутентификация пользователя и получение токена доступа.

<details>
<summary><b>Структура запроса и ответа</b></summary>

**Тело запроса (JSON):**
```json
{
  "email": "user@example.com",
  "password": "secretpassword"
}
```

**Ответы:**
* `200 OK` — Успешный вход:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 42,
      "email": "user@example.com",
      "first_name": "Иван",
      "last_name": "Иванов"
    }
  }
  ```
* `401 Unauthorized` — Неверный email или пароль.
</details>

---

## 🎬 2. Работа с видео

### Получение ленты видео (`GET /api/videos`)
Возвращает список всех доступных видеороликов платформы. Авторизация не требуется.

<details>
<summary><b>Пример ответа</b></summary>

* `200 OK` — Список видео успешно получен:
  ```json
  [
    {
      "id": 1,
      "title": "Обзор архитектуры YADRO",
      "video_url": "/static/uploads/video1.mp4",
      "created_at": "2026-05-20T01:30:00Z"
    }
  ]
  ```
</details>

### Загрузка нового видео (`POST /api/videos/upload`)
Публикация нового видеоролика на платформу.
* **Заголовки:** `Authorization: Bearer <JWT-токен>`
* **Тип запроса:** `multipart/form-data` (FormData)


| Поле формы | Тип | Описание |
| :--- | :--- | :--- |
| `title` | string | Название видеоролика |
| `video` | file | Бинарный файл видео (mp4, avi) |

<details>
<summary><b>Ответы</b></summary>

* `201 Created` — Видео успешно загружено:
  ```json
  {
    "message": "Видео успешно загружено",
    "video_id": 2
  }
  ```
* `401 Unauthorized` — Отсутствует или неверный токен авторизации.
</details>

---

## 💬 3. Чат «Вопрос / ответ»

### Получение сообщений чата (`GET /api/chat`)
Просмотр истории сообщений в чате. Авторизация не требуется.

<details>
<summary><b>Пример ответа</b></summary>

* `200 OK` — Список сообщений:
  ```json
  [
    {
      "id": 101,
      "user": "Иван Иванов",
      "text": "Когда будет запись вебинара?",
      "timestamp": "2026-05-20T01:15:00Z"
    }
  ]
  ```
</details>

### Отправка сообщения (`POST /api/chat`)
Публикация нового вопроса или ответа в чат.
* **Заголовки:** `Authorization: Bearer <JWT-токен>`

<details>
<summary><b>Структура запроса и ответа</b></summary>

**Тело запроса (JSON):**
```json
{
  "text": "Текст сообщения"
}
```

**Ответы:**
* `201 Created` — Сообщение отправлено:
  ```json
  {
    "id": 102,
    "status": "sent"
  }
  ```
* `401 Unauthorized` — Пользователь не авторизован.
</details>
