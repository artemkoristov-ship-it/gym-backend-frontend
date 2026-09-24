// mobile/__tests__/validators.test.js
const { validateEmail, validatePassword, calculateOccupancyRate } = require('../src/utils/validators');

describe('Модульні тести утиліт Front-end (React Native)', () => {

  // Тест 1: Перевірка валідного email
  test('Arrange-Act-Assert: Успіх для правильного email', () => {
    const email = 'user@example.com';
    const error = validateEmail(email);
    expect(error).toBeNull();
  });

  // Тест 2: Помилка для некоректного email
  test('Помилка для email без рабака (@)', () => {
    const email = 'userexample.com';
    const error = validateEmail(email);
    expect(error).toBe('Некоректний формат email');
  });

  // Тест 3: Помилка для короткого пароля
  test('Помилка: Пароль занадто короткий (< 6 символів)', () => {
    const password = '123';
    const error = validatePassword(password);
    expect(error).toBe('Пароль має містити щонайменше 6 символів');
  });

  // Тест 4: Успіх для надійного пароля
  test('Успіх для нормального пароля', () => {
    const password = 'securePassword123';
    const error = validatePassword(password);
    expect(error).toBeNull();
  });

  // Тест 5: Розрахунок заповненості залу (Occupancy Rate)
  test('Розрахунок відсотка заповненості тренування', () => {
    const booked = 5;
    const capacity = 10;
    const rate = calculateOccupancyRate(booked, capacity);
    expect(rate).toBe(50); // 5 з 10 це 50%
  });

});