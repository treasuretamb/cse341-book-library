const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/books');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', isAuthenticated, createBook);
router.put('/:id', isAuthenticated, updateBook);
router.delete('/:id', isAuthenticated, deleteBook);

module.exports = router;