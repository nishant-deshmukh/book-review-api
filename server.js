// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db'); // MySQL connection + Sequelize instance
const User = require('./models/User');    // Import User model
const { sequelize } = require('./config/db');

const app = express();

// Connect to database (this function will connect to MySQL)
connectDB();

// Init Middleware to parse JSON in request body
app.use(express.json({ extended: false }));

// Define a simple root route for testing
app.get('/', (req, res) => res.send('Book Review API is running!'));

// Auth routes (signup, login)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/reviews', require('./routes/reviews'));



// Sync Sequelize models to create tables if they don't exist
sequelize.sync({ alter: true })
  .then(() => {
    console.log('🗃️ Tables synced');

    // Start the server after successful DB sync
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => {
    console.error('Table sync error:', err);
  });
