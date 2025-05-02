# 🧠 MoodBot Admin Panel

Це повноцінна система для обліку та аналізу настроїв користувачів через Telegram-бота. Вона включає:

- Telegram-бот для збору настроїв
- MongoDB для зберігання історії
- Express.js API для роботи з базою
- React-адмінку з діаграмами, фільтрами, темами

---

## 📸 Інтерфейс

### 🌙 Темна тема:
![Темна тема адмінки](./screenshots/dark-mode.png)

### 📊 Діаграма:
![Кругова діаграма](./screenshots/pie-chart.png)

---

## 📦 Технології

- **Bot:** [Telegraf](https://telegraf.js.org/)
- **Backend:** Node.js + Express + MongoDB (через Mongoose)
- **Frontend:** React (CRA) + Chart.js + CSS Variables
- **Database:** MongoDB Atlas (або локально)
- **Хостинг:** локально або на VPS

---

## 🚀 Функціонал

- 🤖 Telegram-бот з inline-кнопками для обліку настрою
- 📅 Зберігання історії настроїв з точним timestamp
- 📊 Автоматична статистика та кругова діаграма
- 🗑️ Видалення записів в адмінці (лише для адміністратора)
- 🔍 Фільтрація за настроєм і користувачем
- 🌗 Перемикання світлої / темної теми
- 🧑‍🎨 Аватарки користувачів
- 🧠 Гнучкий інтерфейс з анімаціями

---

## ⚙️ Встановлення

### 🔧 1. Клонування:

```bash
git clone https://github.com/yourname/moodbot-admin.git
cd moodbot-admin
```

### 📦 2. Установка залежностей:

#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
cd client
npm install
```

---

## 🔐 Налаштування змінних середовища

Створи файл `.env`:

```
BOT_TOKEN=your_telegram_bot_token
MONGO_URI=mongodb+srv://...
PORT=3939
```

---

## 🧪 Запуск проєкту

У двох терміналах:

```bash
# 1. Backend
cd server
npm run dev

# 2. Frontend
cd client
npm start
```

Адмінка буде доступна за адресою:
```
http://localhost:3000
```

---

## 📂 Структура проєкту

```
moodbot-admin/
├── bot/                 # Код Telegram-бота
├── server/              # Express + MongoDB API
├── client/              # React Admin Panel
└── README.md
```

---

## 📈 У майбутньому

- [ ] Експорт у CSV
- [ ] Фільтр по датах
- [ ] Авторизація для входу в адмінку
- [ ] Статистика за періоди
- [ ] Мультимовність

---

## 📬 Контакт

Created by [@BIAckBlrD](https://t.me/BIAckBlrD)  
Проєкт для портфоліо та навчання