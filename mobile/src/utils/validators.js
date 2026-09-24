// mobile/src/utils/validators.js

// 1. Валідація email
function validateEmail(email) {
  if (!email) return 'Email не може бути порожнім';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return 'Некоректний формат email';
  return null;
}

// 2. Валідація пароля (мінімум 6 символів)
function validatePassword(password) {
  if (!password) return 'Пароль не може бути порожнім';
  if (password.length < 6) return 'Пароль має містити щонайменше 6 символів';
  return null;
}

// 3. Розрахунок відсотків заповненості тренування для індикатора у списку
function calculateOccupancyRate(bookedCount, capacity) {
  if (capacity <= 0) return 0;
  const rate = (bookedCount / capacity) * 100;
  return Math.min(Math.round(rate), 100);
}

module.exports = {
  validateEmail,
  validatePassword,
  calculateOccupancyRate,
};