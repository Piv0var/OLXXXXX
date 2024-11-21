const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const adsController = require('../controllers/adsController');

// Создание объявления
router.post('/', authMiddleware, adsController.createAd);

// Поиск объявлений
router.get('/search', adsController.searchAds);

// Редактирование объявления
router.put('/:id', authMiddleware, adsController.editAd);

// Удаление объявления
router.delete('/:id', authMiddleware, adsController.deleteAd);

// Вывод всех объявлений
router.get('/', adsController.getAllAds)
// Отметить объявление как проданное
router.put('/sold/:id', authMiddleware, adsController.markAdAsSold);

module.exports = router;
