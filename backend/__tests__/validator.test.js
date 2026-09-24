// backend/__tests__/validator.test.js
const { checkWorkoutAvailability, checkDuplicateBooking } = require('../src/utils/validators');

describe('Модульні тести бізнес-логіки занять та записів', () => {

  // Тест 1: Успішна перевірка наявності вільних місць
  test('Arrange-Act-Assert: Успіх, коли є вільні місця', () => {
    // Arrange (Підготовка)
    const workout = { id: 1, capacity: 10 };
    const currentBookingsCount = 5;

    // Act (Дія) & Assert (Перевірка)
    expect(() => checkWorkoutAvailability(workout, currentBookingsCount)).not.toThrow();
    expect(checkWorkoutAvailability(workout, currentBookingsCount)).toBe(true);
  });

  // Тест 2: Помилка, коли місць немає (граничний випадок)
  test('Помилка: Немає вільних місць, коли заповненість дорівнює місткості', () => {
    // Arrange
    const workout = { id: 1, capacity: 5 };
    const currentBookingsCount = 5;

    // Act & Assert
    expect(() => checkWorkoutAvailability(workout, currentBookingsCount)).toThrow(
      'На тренування немає вільних місць'
    );
  });

  // Тест 3: Помилка, якщо тренування не існує
  test('Помилка: Тренування не знайдено', () => {
    expect(() => checkWorkoutAvailability(null, 2)).toThrow('Тренування не знайдено');
  });

  // Тест 4: Перевірка на дублікат запису (користувач уже записаний)
  test('Помилка: Користувач уже записаний на тренування (дублікат)', () => {
    // Arrange
    const existingBookings = [
      { userId: 1, workoutId: 10 },
      { userId: 2, workoutId: 10 }
    ];

    // Act & Assert
    expect(() => checkDuplicateBooking(existingBookings, 1, 10)).toThrow(
      'Користувач уже записаний на це тренування'
    );
  });

  // Тест 5: Успіх, якщо користувач ще не записаний
  test('Успіх: Користувач ще не записаний на це тренування', () => {
    // Arrange
    const existingBookings = [
      { userId: 2, workoutId: 10 }
    ];

    // Act & Assert
    const result = checkDuplicateBooking(existingBookings, 1, 10);
    expect(result).toBe(false);
  });

});