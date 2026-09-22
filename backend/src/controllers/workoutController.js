const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Отримати весь розклад тренувань із порахованими вільними місцями
const getWorkouts = async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      include: {
        bookings: {
          where: { status: { not: 'CANCELLED' } }
        }
      },
      orderBy: { dateTime: 'asc' }
    });

    const formattedWorkouts = workouts.map(w => ({
      id: w.id,
      title: w.title,
      description: w.description,
      trainer: w.trainer,
      dateTime: w.dateTime,
      capacity: w.capacity,
      availableSlots: w.capacity - w.bookings.length
    }));

    res.json(formattedWorkouts);
  } catch (error) {
    console.error('Помилка завантаження розкладу:', error);
    res.status(500).json({ error: 'Не вдалося завантажити розклад тренувань' });
  }
};

// 2. Отримати одне конкретне тренування за ID
const getWorkoutById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        bookings: {
          where: { status: { not: 'CANCELLED' } }
        }
      }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Тренування не знайдено' });
    }

    res.json({
      ...workout,
      availableSlots: workout.capacity - workout.bookings.length
    });
  } catch (error) {
    console.error('Помилка отримання тренування:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

// 3. Створити нове тренування
const createWorkout = async (req, res) => {
  try {
    const { title, description, trainer, dateTime, capacity } = req.body;
    const newWorkout = await prisma.workout.create({
      data: {
        title,
        description,
        trainer,
        dateTime: new Date(dateTime),
        capacity: parseInt(capacity, 10)
      }
    });
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Помилка створення тренування:', error);
    res.status(500).json({ error: 'Не вдалося створити тренування' });
  }
};

// 4. Оновити тренування
const updateWorkout = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, trainer, dateTime, capacity } = req.body;
    
    const updatedWorkout = await prisma.workout.update({
      where: { id },
      data: {
        title,
        description,
        trainer,
        dateTime: dateTime ? new Date(dateTime) : undefined,
        capacity: capacity ? parseInt(capacity, 10) : undefined
      }
    });
    res.json(updatedWorkout);
  } catch (error) {
    console.error('Помилка оновлення тренування:', error);
    res.status(500).json({ error: 'Не вдалося оновити тренування' });
  }
};

// 5. Видалити тренування
const deleteWorkout = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.workout.delete({ where: { id } });
    res.json({ message: 'Тренування успішно видалено' });
  } catch (error) {
    console.error('Помилка видалення тренування:', error);
    res.status(500).json({ error: 'Не вдалося видалити тренування' });
  }
};

// 6. Запис користувача на тренування
const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const workoutId = req.workout.id;

    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        workoutId,
        status: { not: 'CANCELLED' }
      }
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Ви вже записані на це тренування' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        workoutId,
        status: 'CONFIRMED'
      },
      include: { workout: true }
    });

    res.status(201).json({ message: 'Успішний запис на тренування', booking });
  } catch (error) {
    console.error('Помилка створення запису:', error);
    res.status(500).json({ error: 'Не вдалося оформити запис' });
  }
};

// 7. Отримати список записів поточного користувача
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { workout: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Помилка завантаження записів:', error);
    res.status(500).json({ error: 'Не вдалося отримати ваші записи' });
  }
};

// 8. Скасування або зміна статусу запису
const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { status } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Запис не знайдено' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'У вас немає доступу до цього запису' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status || 'CANCELLED' }
    });

    res.json({ message: 'Статус запису успішно змінено', booking: updatedBooking });
  } catch (error) {
    console.error('Помилка оновлення запису:', error);
    res.status(500).json({ error: 'Не вдалося змінити статус запису' });
  }
};

module.exports = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  createBooking,
  getUserBookings,
  updateBookingStatus
};