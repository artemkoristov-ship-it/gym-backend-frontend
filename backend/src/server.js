require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { PrismaClient } = require('@prisma/client');

// Імпорт роутів
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const resultRoutes = require('./routes/resultRoutes'); // Підключено роут рекордів

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. Middlewares (Проміжні обробники)
// ==========================================
app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 

// Логування вхідних запитів у консоль
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// 2. Маршрути (Routes)
// ==========================================
// Перевірка працездатності сервера
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Gym API працює коректно' });
});

// Основні API роути
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/results', resultRoutes); // Маршрут для зберігання рекордів у профілі

// ==========================================
// 3. Обробка помилок
// ==========================================
// Обробка запитів на неіснуючі маршрути (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не знайдено' });
});

// Глобальна обробка помилок (500)
app.use((err, req, res, next) => {
  console.error('💥 Глобальна помилка сервера:', err.stack);
  res.status(500).json({ 
    error: 'Внутрішня помилка сервера',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==========================================
// 4. Запуск сервера
// ==========================================
const server = app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// ==========================================
// 5. Graceful Shutdown (Коректне вимкнення)
// ==========================================
const gracefulShutdown = async (signal) => {
  console.log(`\nОтримано сигнал ${signal}. Закриття сервера та Prisma...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Зєднання з БД закрито. Сервер вимкнено.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));