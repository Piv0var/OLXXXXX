const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const messagesController = require('../controllers/messagesController');

// Отправка сообщения
router.post('/', authMiddleware, messagesController.sendMessage);
// Получение всех сообщений
router.get('/', authMiddleware, messagesController.getAllMessages);


module.exports = router;
