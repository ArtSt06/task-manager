# Task Manager — приложение для управления задачами

## Описание

Task Manager — это веб-приложение для организации личных задач.
Приложение разделено на клиентскую и серверную части.
Клиентская часть написана на **React + TypeScript**, серверная — на **Node.js + Express**.  
Аутентификация реализована через **Firebase Authentication API**, а для хранения данных используется **MongoDB**.

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone git@github.com/ArtSt06/task-manager.git
cd task-manager
```

### 2. Настройка переменных окружения

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Заполните созданные `.env` файлы своими данными (см. раздел «Переменные окружения» ниже).

### 3. Установка зависимостей

Из корневой папки выполните:

```bash
npm install
npm run install:all
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

После запуска откройте в браузере: [http://localhost:5173](http://localhost:5173)

### 5. Сборка для продакшена

```bash
npm run build
npm start
```

## Переменные окружения

### Клиент

Создайте файл `client/.env` на основе `client/.env.example`:

### Сервер

Создайте файл `server/.env` на основе `server/.env.example`:

## Тестирование

Для запуска тестов клиента выполните:

```bash
cd client
npm test
```

Для запуска тестов сервера выполните:

```bash
cd server
npm test
```
