const express = require('express');
const router = express.Router();
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} = require('../controllers/authors');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);
router.post('/', isAuthenticated, createAuthor);
router.put('/:id', isAuthenticated, updateAuthor);
router.delete('/:id', isAuthenticated, deleteAuthor);

module.exports = router;