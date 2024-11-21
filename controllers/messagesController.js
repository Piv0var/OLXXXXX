const db = require('../config/db');

// Отправка сообщения
exports.sendMessage = (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.userId;

  if (!receiverId || !message) {
    return res.status(400).json({ message: 'Пользователь и сообщение обязательны' });
  }

  // Проверяем, существует ли получатель
  db.query('SELECT * FROM users WHERE id = ?', [receiverId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Ошибка базы данных' });

    if (result.length === 0) {
      return res.status(404).json({ message: 'Получатель не найден' });
    }

    db.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [senderId, receiverId, message],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Ошибка базы данных' });

        res.status(201).json({ message: 'Сообщение отправлено' });
      }
    );
  });
};
// Вывод всех сообщений
exports.getAllMessages = (req, res) => {
  const userId = req.user.userId;
  db.query(
    `SELECT messages.id, users.email AS sender_email, messages.message, messages.sent_at, 
            (CASE WHEN messages.sender_id = ? THEN 'sent' ELSE 'received' END) AS message_type
     FROM messages 
     JOIN users ON users.id = messages.sender_id
     WHERE messages.sender_id = ? OR messages.receiver_id = ? 
     ORDER BY messages.sent_at DESC`,
    [userId, userId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Ошибка базы данных' });

      if (result.length === 0) {
        return res.status(404).json({ message: 'Нет сообщений' });
      }

      res.status(200).json(result);
    }
  );
};
