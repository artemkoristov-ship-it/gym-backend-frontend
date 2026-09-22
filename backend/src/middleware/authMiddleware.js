const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Немає доступу. Токен відсутній.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Помилка перевірки токена:', err.message);
    return res.status(401).json({ error: 'Недійсний або застарілий токен.' });
  }
};

module.exports = authenticateToken;
module.exports.authenticateToken = authenticateToken;