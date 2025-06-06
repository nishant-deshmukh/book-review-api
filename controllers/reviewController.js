const Review = require('../models/Review');
const Book = require('../models/Book');

// POST /reviews/:bookId
exports.addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const existingReview = await Review.findOne({ where: { bookId, userId } });
    if (existingReview) {
      return res.status(400).json({ msg: 'You have already reviewed this book' });
    }

    const review = await Review.create({ rating, comment, userId, bookId });
    res.json(review);
  } catch (err) {
    console.error('Error in addReview:', err.message);
    res.status(500).send('Server error');
  }
};

// PUT /reviews/:id
exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(reviewId);
    if (!review) return res.status(404).json({ msg: 'Review not found' });
    if (review.userId !== userId) return res.status(401).json({ msg: 'Not authorized' });

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
      }
      review.rating = rating;
    }
    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();
    res.json(review);
  } catch (err) {
    console.error('Error in updateReview:', err.message);
    res.status(500).send('Server error');
  }
};

// DELETE /reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review) return res.status(404).json({ msg: 'Review not found' });
    if (review.userId !== userId) return res.status(401).json({ msg: 'Not authorized' });

    await review.destroy();
    res.json({ msg: 'Review deleted' });
  } catch (err) {
    console.error('Error in deleteReview:', err.message);
    res.status(500).send('Server error');
  }
};
