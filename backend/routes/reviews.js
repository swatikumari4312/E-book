const express = require('express');
const Review = require('../models/Review');
const protect = require('../middleware/auth');
const router = express.Router();

// Add review (protected)
router.post('/', protect, async (req, res) => {
  const { bookId, rating, reviewText } = req.body;
  try {
    const review = await Review.create({ ...req.body, userId: req.user._id });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get reviews for book + average rating
router.get('/book/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId }).populate('userId', 'name');
    const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10 });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update/delete own review (similar to books, implement with findByIdAndUpdate/Delete, check userId match)

// Example for update:
router.put('/:id', protect, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review || review.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Not authorized' });
  }
  const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete similar...

module.exports = router;