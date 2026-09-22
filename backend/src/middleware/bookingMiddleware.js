const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkWorkoutAvailability = async (req, res, next) => {
  try {
    // Витягуємо ID тренування з будь-якого можливого поля
    const workoutId = req.body.workoutId || req.body.workout_id || req.body.id;

    if (!workoutId) {
      return res.status(400).json({ error: 'Не вказано ID тренування (workoutId)' });
    }

    const numericWorkoutId = Number(workoutId);

    // Шукаємо тренування
    const workout = await prisma.workout.findUnique({
      where: { id: numericWorkoutId },
      include: { bookings: true }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Тренування не знайдено' });
    }

    // Перевіряємо кількість місць (якщо в базі вказано capacity)
    if (workout.capacity && workout.bookings) {
      if (workout.bookings.length >= workout.capacity) {
        return res.status(400).json({ error: 'На жаль, усі місця на це тренування вже зайняті' });
      }
    }

    // Зберігаємо нормалізований ID далі для контролера
    req.body.workoutId = numericWorkoutId;
    next();
  } catch (error) {
    console.error('Помилка у checkWorkoutAvailability:', error);
    return res.status(500).json({ error: 'Помилка перевірки доступності тренування' });
  }
};

const validateIdParam = (paramName) => (req, res, next) => {
  const id = Number(req.params[paramName]);
  if (isNaN(id)) {
    return res.status(400).json({ error: `Некоректний ID параметра ${paramName}` });
  }
  next();
};

module.exports = {
  checkWorkoutAvailability,
  validateIdParam
};