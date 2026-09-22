const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Отримати всі тренування
router.get('/', async (req, res, next) => {
  try {
    const workouts = await prisma.workout.findMany({
      include: {
        bookings: true //  Оце підтягує записи для кожного тренування
      }
    });
    res.json(workouts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;