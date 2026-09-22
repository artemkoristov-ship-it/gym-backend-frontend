const prisma = require('../config/db');

exports.getResults = async (req, res) => {
  try {
    const results = await prisma.result.findMany({
      where: { userId: req.user.userId }
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

exports.createResult = async (req, res) => {
  try {
    const { title, value } = req.body;
    const result = await prisma.result.create({
      data: { title, value, userId: req.user.userId }
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при збереженні результату' });
  }
};