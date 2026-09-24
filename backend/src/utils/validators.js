// backend/src/utils/validators.js

// 1. Перевірка чи є вільні місця на тренуванні
function checkWorkoutAvailability(workout, currentBookingsCount) {
  if (!workout) {
    throw new Error('Тренування не знайдено');
  }
  if (currentBookingsCount >= workout.capacity) {
    throw new Error('На тренування немає вільних місць');
  }
  return true;
}

// 2. Перевірка на дублікат запису
function checkDuplicateBooking(existingBookings, userId, workoutId) {
  const isAlreadyBooked = existingBookings.some(
    (b) => b.userId === userId && b.workoutId === workoutId
  );
  if (isAlreadyBooked) {
    throw new Error('Користувач уже записаний на це тренування');
  }
  return false;
}

module.exports = {
  checkWorkoutAvailability,
  checkDuplicateBooking,
};