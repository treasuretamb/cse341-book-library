const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllBooks = async (req, res) => {
  try {
    const db = getDb();
    const books = await db
      .db('booklibrary')
      .collection('books')
      .find()
      .toArray();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const db = getDb();
    const book = await db
      .db('booklibrary')
      .collection('books')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, genre, year, isbn, description, rating, status, coverUrl } = req.body;

    // Validation
    if (!title || !author || !genre || !year || !isbn || !description || !rating || !status) {
      return res.status(400).json({ error: 'All fields are required: title, author, genre, year, isbn, description, rating, status' });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }

    const book = { title, author, genre, year, isbn, description, rating, status, coverUrl: coverUrl || '' };
    const db = getDb();
    const result = await db.db('booklibrary').collection('books').insertOne(book);
    res.status(201).json({ message: 'Book created', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const { title, author, genre, year, isbn, description, rating, status, coverUrl } = req.body;

    if (!title || !author || !genre || !year || !isbn || !description || !rating || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }

    const db = getDb();
    const result = await db
      .db('booklibrary')
      .collection('books')
      .replaceOne(
        { _id: new ObjectId(req.params.id) },
        { title, author, genre, year, isbn, description, rating, status, coverUrl: coverUrl || '' }
      );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json({ message: 'Book updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const db = getDb();
    const result = await db
      .db('booklibrary')
      .collection('books')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };