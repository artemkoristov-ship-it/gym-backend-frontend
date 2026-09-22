const router = require('express').Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Отримати всі рекорди
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = Number(req.user.id || req.user.userId);
    const results = await prisma.result.findMany({
      where: { userId },
      orderBy: { id: 'desc' }
    });
    return res.json(results);
  } catch (error) {
    next(error);
  }
});

// Додати або оновити максимальний рекорд для вправи
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = Number(req.user.id || req.user.userId);
    const { title, value, exercise, weight } = req.body;

    const finalTitle = (title || exercise || '').trim();
    const finalValue = (value || weight || '').trim();

    if (!finalTitle || !finalValue) {
      return res.status(400).json({ error: 'Заповніть назву вправи та результат' });
    }

    // Перевіряємо, чи така вправа вже існує у цього користувача
    const existingResult = await prisma.result.findFirst({
      where: {
        userId: Number(userId),
        title: finalTitle
      }
    });

    let savedResult;

    if (existingResult) {
      // Якщо вправа вже є — оновлюємо її значення та дату
      savedResult = await prisma.result.update({
        where: { id: existingResult.id },
        data: {
          value: String(finalValue),
          date: new Date() // оновлюємо дату на сьогодні
        }
      });
    } else {
      // Якщо вправи немає — створюємо нову
      savedResult = await prisma.result.create({
        data: {
          userId: Number(userId),
          title: String(finalTitle),
          value: String(finalValue)
        }
      });
    }

    return res.status(201).json(savedResult);
  } catch (error) {
    console.error('Помилка збереження рекорду:', error);
    next(error);
  }
});

// Видалити рекорд за ID
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const resultId = Number(req.params.id);
    console.log(`Запит на видалення рекорду з ID: ${resultId}`);

    if (isNaN(resultId)) {
      return res.status(400).json({ error: 'Некоректний ID запису' });
    }

    await prisma.result.delete({
      where: { id: resultId }
    });

    return res.json({ message: 'Видалено успішно' });
  } catch (error) {
    console.error('Помилка при видаленні у базі:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Запис не знайдено' });
    }
    next(error);
  }
});

module.exports = router;