const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Створення запису
exports.createBooking = async (req, res) => {
  try {
    const workoutId = Number(req.body.workoutId || req.body.workout_id);
    const userId = Number(req.user.id || req.user.userId);

    if (!userId) {
      return res.status(401).json({ error: 'Користувач не авторизований' });
    }

    // Перевірка на дублікат
    const existing = await prisma.booking.findFirst({
      where: { userId, workoutId }
    });

    if (existing) {
      return res.status(400).json({ error: 'Ви вже записані на це тренування' });
    }

    const booking = await prisma.booking.create({
      data: { userId, workoutId },
      include: { workout: true }
    });

    return res.status(201).json({ message: 'Запис успішно створено', booking });
  } catch (error) {
    console.error('Помилка при створенні запису:', error);
    return res.status(500).json({ error: 'Не вдалося створити запис' });
  }
};

// Отримання записів користувача
exports.getUserBookings = async (req, res) => {
  try {
    const userId = Number(req.user.id || req.user.userId);

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { workout: true }
    });

    return res.json(bookings);
  } catch (error) {
    console.error('Помилка отримання записів:', error);
    return res.status(500).json({ error: 'Не вдалося завантажити записи' });
  }
};

// Скасування запису
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const userId = Number(req.user.id || req.user.userId);

    await prisma.booking.deleteMany({
      where: { id: bookingId, userId }
    });

    return res.json({ message: 'Запис скасовано' });
  } catch (error) {
    console.error('Помилка скасування запису:', error);
    return res.status(500).json({ error: 'Не вдалося скасувати запис' });
  }
};