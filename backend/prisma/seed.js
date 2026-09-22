const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.workout.createMany({
    data: [
      {
        title: 'Силове тренування',
        description: 'Опрацювання основних груп м’язів із вільною вагою.',
        trainer: 'Олексій Коваленко',
        date: new Date(Date.now() + 86400000), // завтра
        capacity: 10,
      },
      {
        title: 'Йога та Розтяжка',
        description: 'Відновлення, гнучкість та зняття напруги після навантажень.',
        trainer: 'Марія Петрова',
        date: new Date(Date.now() + 172800000), // післязавтра
        capacity: 15,
      },
      {
        title: 'Кросфіт / HIIT',
        description: 'Інтенсивне кардіо-тренування для витривалості.',
        trainer: 'Дмитро Бойко',
        date: new Date(Date.now() + 259200000),
        capacity: 8,
      },
    ],
  });

  console.log('Тестові тренування успішно додані в базу даних!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });