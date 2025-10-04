const express = require('express');
const Book = require('../models/Book');
const protect = require('../middleware/auth');
const router = express.Router();

// Get all books with pagination and search
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  const search = req.query.search || ''; // get search query

  try {
    // Filter books by title or author (case-insensitive)
    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ],
    };

    const books = await Book.find(query)
      .populate('addedBy', 'name')
      .limit(limit)
      .skip(skip);

    const total = await Book.countDocuments(query);

    res.json({ books, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// Add book (protected)
router.post('/', protect, async (req, res) => {
  const { title, author, description, genre, year } = req.body;
  try {
    const book = await Book.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name');
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update book (only owner)
router.put('/:id', protect, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book || book.addedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Not authorized' });
  }
  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete book (only owner)
router.delete('/:id', protect, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book || book.addedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Not authorized' });
  }
  await Book.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Book deleted' });
});

module.exports = router;