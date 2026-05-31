const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAllAuthors = async (req, res) => {
  try {
    const db = getDb();
    const authors = await db
      .db('booklibrary')
      .collection('authors')
      .find()
      .toArray();
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAuthorById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const db = getDb();
    const author = await db
      .db('booklibrary')
      .collection('authors')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { firstName, lastName, nationality, birthYear, genre, bio, website, activeYears } = req.body;

    if (!firstName || !lastName || !nationality || !birthYear || !genre || !bio || !activeYears) {
      return res.status(400).json({
        error: 'All fields are required: firstName, lastName, nationality, birthYear, genre, bio, activeYears'
      });
    }
    if (typeof birthYear !== 'number') {
      return res.status(400).json({ error: 'birthYear must be a number' });
    }

    const author = { firstName, lastName, nationality, birthYear, genre, bio, website: website || '', activeYears };
    const db = getDb();
    const result = await db.db('booklibrary').collection('authors').insertOne(author);
    res.status(201).json({ message: 'Author created', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAuthor = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const { firstName, lastName, nationality, birthYear, genre, bio, website, activeYears } = req.body;

    if (!firstName || !lastName || !nationality || !birthYear || !genre || !bio || !activeYears) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (typeof birthYear !== 'number') {
      return res.status(400).json({ error: 'birthYear must be a number' });
    }

    const db = getDb();
    const result = await db
      .db('booklibrary')
      .collection('authors')
      .replaceOne(
        { _id: new ObjectId(req.params.id) },
        { firstName, lastName, nationality, birthYear, genre, bio, website: website || '', activeYears }
      );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json({ message: 'Author updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const db = getDb();
    const result = await db
      .db('booklibrary')
      .collection('authors')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) return res.status(404).json({ error: 'Author not found' });
    res.status(200).json({ message: 'Author deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };