// routes/books.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bookController = require('../controllers/bookController');

router.post('/', auth, bookController.addBook);
router.get('/search', bookController.searchBooks);
router.get('/books-with-reviews', bookController.getBooksWithReviews);
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookDetails);
router.put('/:id', auth, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;

