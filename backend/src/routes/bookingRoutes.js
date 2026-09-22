const router = require('express').Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkWorkoutAvailability, validateIdParam } = require('../middleware/bookingMiddleware');
const { 
  getUserBookings, 
  createBooking, 
  cancelBooking 
} = require('../controllers/bookingController');

// 1. Отримати всі записи поточного користувача
router.get('/', authenticateToken, getUserBookings);

// 2. Записатися на тренування (перевірка місць через мідлвар, створення через контролер)
router.post('/', authenticateToken, checkWorkoutAvailability, createBooking);

// 3. Скасувати запис на тренування (перевірка ID через мідлвар, видалення через контролер)
router.delete('/:id', authenticateToken, validateIdParam('id'), cancelBooking);

module.exports = router;