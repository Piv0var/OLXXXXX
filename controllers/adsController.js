const db = require('../config/db');

// Создание объявления
exports.createAd = async (req, res) => {
  const { title, description, category, price, location } = req.body;

  if (!title || !description || !category || !price || !location) {
    return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
  }

  db.query(
    'INSERT INTO ads (title, description, category, price, location, user_id) VALUES (?, ?, ?, ?, ?, ?)', 
    [title, description, category, price, location, req.user.userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Ошибка базы данных' });

      res.status(201).json({ message: 'Объявление успешно создано' });
    }
  );
};

// Поиск объявлений по названию или категории
exports.searchAds = (req, res) => {
  const { query } = req.query; 

  if (!query) {
    return res.status(400).json({ message: 'Запрос не может быть пустым' });
  }

  db.query(
    'SELECT * FROM ads WHERE title LIKE ? OR category LIKE ?',
    [`%${query}%`, `%${query}%`],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Ошибка базы данных' });

      res.status(200).json(result);
    }
  );
};

// Редактирование объявления
exports.editAd = (req, res) => {
  const { id } = req.params;
  const { title, description, category, price, location } = req.body;

  // Проверка, что хотя бы одно поле для редактирования передано
  if (!title && !description && !category && !price && !location) {
    return res.status(400).json({ message: 'Не переданы данные для редактирования' });
  }

  // Строим строку для обновления
  const fields = [];
  const values = [];
  
  if (title) {
    fields.push('title = ?');
    values.push(title);
  }
  if (description) {
    fields.push('description = ?');
    values.push(description);
  }
  if (category) {
    fields.push('category = ?');
    values.push(category);
  }
  if (price) {
    fields.push('price = ?');
    values.push(price);
  }
  if (location) {
    fields.push('location = ?');
    values.push(location);
  }

  values.push(id);

  const query = `UPDATE ads SET ${fields.join(', ')} WHERE id = ?`;

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Ошибка базы данных' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }

    res.status(200).json({ message: 'Объявление обновлено' });
  });
};


// Удаление объявления
exports.deleteAd = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM ads WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Ошибка базы данных' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }

    res.status(200).json({ message: 'Объявление удалено' });
  });
};

// Вывод всех объявлений
exports.getAllAds = (req, res) => {
  db.query('SELECT * FROM ads', (err, result) => {
    if (err) return res.status(500).json({ message: 'Ошибка базы данных' });

    res.status(200).json(result);
  });
};

// Отметить объявление как проданное
exports.markAdAsSold = (req, res) => {
  const { id } = req.params;

  db.query('UPDATE ads SET status = ? WHERE id = ?', ['sold', id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Ошибка базы данных' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }

    res.status(200).json({ message: 'Объявление отмечено как проданное' });
  });
};
