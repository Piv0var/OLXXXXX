const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const adsRoutes = require('./routes/adsRoutes');
const messagesRoutes = require('./routes/messagesRoutes'); 
const db = require('./config/db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/ads', adsRoutes);
app.use('/messages', messagesRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
