const { Op } = require('sequelize');
const Book = require('../models/Book');
const Review = require('../models/Review');
const User = require('../models/User');

// POST /books
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;
    if (!title || !author) {
      return res.status(400).json({ msg: 'Title and Author are required' });
    }

    const newBook = await Book.create({ title, author, genre, description });
    res.json(newBook);
  } catch (err) {
    console.error('Error in addBook:', err.message);
    res.status(500).send('Server error');
  }
};

// GET /books/search?q=term
exports.searchBooks = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) {
      return res.status(400).json({ msg: 'Search query (q) is required' });
    }

    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { author: { [Op.like]: `%${searchTerm}%` } }
        ]
      }
    });

    res.json(books);
  } catch (err) {
    console.error('Error in searchBooks:', err.message);
    res.status(500).send('Server error');
  }
};

// GET /books
exports.getBooks = async (req, res) => {
  try {
    let { page = 1, limit = 5, author, genre } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    let where = {};
    if (author) where.author = author;
    if (genre) where.genre = genre;

    const result = await Book.findAndCountAll({ where, offset, limit });

    res.json({
      totalBooks: result.count,
      currentPage: page,
      totalPages: Math.ceil(result.count / limit),
      books: result.rows
    });
  } catch (err) {
    console.error('Error in getBooks:', err.message);
    res.status(500).send('Server error');
  }
};

// GET /books/:id
exports.getBookDetails = async (req, res) => {
  try {
    const bookId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const reviewsData = await Review.findAll({
      where: { bookId },
      attributes: ['rating']
    });

    let avgRating = 0;
    if (reviewsData.length > 0) {
      const total = reviewsData.reduce((sum, r) => sum + r.rating, 0);
      avgRating = parseFloat((total / reviewsData.length).toFixed(2));
    }

    const reviews = await Review.findAndCountAll({
      where: { bookId },
      include: [{ model: User, attributes: ['id', 'name'] }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      book,
      averageRating: avgRating,
      reviews: {
        totalReviews: reviews.count,
        totalPages: Math.ceil(reviews.count / limit),
        currentPage: page,
        data: reviews.rows
      }
    });
  } catch (err) {
    console.error('Error in getBookDetails:', err.message);
    res.status(500).send('Server error');
  }
};

// GET /books-with-reviews
exports.getBooksWithReviews = async (req, res) => {
  try {
    let { page = 1, limit = 5, author, genre } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    let where = {};
    if (author) where.author = author;
    if (genre) where.genre = genre;

    const result = await Book.findAndCountAll({
      where,
      offset,
      limit,
      include: [
        {
          model: Review,
          include: [{ model: User, attributes: ['id', 'name'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      totalBooks: result.count,
      currentPage: page,
      totalPages: Math.ceil(result.count / limit),
      books: result.rows
    });
  } catch (err) {
    console.error('Error in getBooksWithReviews:', err.message);
    res.status(500).send('Server error');
  }
};

// PUT /books/:id
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, genre, description } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.description = description || book.description;

    await book.save();
    res.json(book);
  } catch (err) {
    console.error('Error in updateBook:', err.message);
    res.status(500).send('Server error');
  }
};

// DELETE /books/:id
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    await book.destroy();
    res.json({ msg: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error in deleteBook:', err.message);
    res.status(500).send('Server error');
  }
};
